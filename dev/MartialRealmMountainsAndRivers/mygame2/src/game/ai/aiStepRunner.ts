import type { GameState, ActionOutcome, AiConstructionPlanItem, ActionResult } from '../types'
import type { AiAction } from './aiAction'
import type { AiActionEvent } from './aiActionEvent'
import { createAiActionEvent } from './aiActionEvent'
import { chooseSelfPreservationAction } from '../aiSelfPreservationRules'
import { chooseDefenseAction } from '../aiDefenseRules'
import { defenseActionToAiAction } from './defenseActionAdapter'
import { validateAiAction } from './validation/validateAiAction'
import { getPlayerAiEmergency } from './policy/aiPolicyRegistry'
import { pickNextBuildCandidate, pickUpgradeCandidate } from './construction/constructionAi'
import { computeFuzzyInputs } from './fuzzy/fuzzyInputs'
import { evaluateAllGoals, type GoalName } from './fuzzy/goals'
import { MIN_THRESHOLD, rankGoals } from './fuzzy/decision'
import { getAiGoalConstraints } from './fuzzy/personality'
import { ACTION_STAMINA_COSTS, canPlayerPerformAction } from '../rules/actionCostRules'
import { constructBuilding, upgradeBuilding } from '../actions/buildingActions'
import { moveCreatures, spawnCreaturesFromNests as spawnCreaturesFromNestsAction } from '../actions/creatureActions'
import { createCharacterState } from '../characterFactory'
import { defaultRandomSource } from '../rules/randomRules'
import { isSameOrAdjacent } from '../types'
import type { ExecuteAiActionDependencies } from './execution/executeAiAction'
import { rememberAiMoveOrigin } from './fuzzy/goalActionMapper'

/** 全域行動日誌上限：只保留最新 N 筆，避免長局面資料無限成長（重構文件 §4.5）。 */
const MAX_ACTION_EVENTS = 200

/** AI step 迴圈上限：避免異常狀態下無限迴圈。 */
const MAX_LOOPS = 50

/** 移動目標的決策衝量：避免相近分數的目標在相鄰 step 間來回切換。 */
const AI_MOVEMENT_MOMENTUM_MARGIN = 0.2
const movementCommitments = new Map<string, {
  orderId: string
  goal: string
  targetKey: string
  score: number
}>()

/** 圖搜索／模糊策略評估用的 stub combat deps（不實際結算掉落/升級）。 */
const STUB_COMBAT_DEPS: ExecuteAiActionDependencies['combat'] = {
  getActionablePlayer: (s, playerId) => s.players.find((p) => p.id === playerId) ?? null,
  createLootForPlayer: () => undefined,
  getLearnableSkill: () => undefined,
  applyExperienceAndLevelUp: (player) => player,
  addLootToPlayer: (player) => player,
}
export interface AiStepRunnerDeps {
  getState: () => GameState
  updateGameState: (updater: (state: GameState) => GameState) => void
  /** 執行單一 AI 行動（含驗證與日誌）。 */
  executeAiAction: (action: AiAction) => ActionOutcome
  /** 結束玩家回合。 */
  endPlayerTurn: (playerId: string) => void
  /** 移動玩家到指定格。 */
  movePlayerTo: (playerId: string, row: number, column: number) => ActionOutcome
  /** 執行 AI 攻擊。 */
  executeAiAttack: (playerId: string, targetType: string, targetId: string) => ActionOutcome
  /** 採集資源點。 */
  collectResourcePoint: (playerId: string, resourcePointId: string) => ActionOutcome
  /** 顯示行動結果彈窗。 */
  showActionResult: (result: ActionResult) => void
}

function getGoalTargetKey(result: { target?: unknown }): string {
  return result.target ? JSON.stringify(result.target) : ''
}

function isMovementAction(action: AiAction): boolean {
  return action.type === 'move' || action.type === 'transport'
}

function isHighThreat(goalResults: Record<string, { score: number }>): boolean {
  return (goalResults.selfPreservation?.score ?? 0) >= 0.6
}

function selectFuzzyCandidateWithMomentum(
  playerId: string,
  orderId: string,
  rankedGoals: Array<{ goal: GoalName; result: { score: number; target?: unknown; actions?: AiAction[] } }>,
  thresholds: Partial<Record<GoalName, number>>,
  goalResults: Record<string, { score: number }>,
  normalCandidate: { goal: GoalName; result: { score: number; target?: unknown; actions?: AiAction[] } } | undefined,
): { goal: GoalName; result: { score: number; target?: unknown; actions?: AiAction[] } } | undefined {
  const eligible = rankedGoals.filter((candidate) => {
    const threshold = thresholds[candidate.goal] ?? MIN_THRESHOLD
    return candidate.result.score >= threshold
      && candidate.result.actions?.some((action) => isMovementAction(action))
  })
  const commitment = movementCommitments.get(playerId)
  if (!commitment || commitment.orderId !== orderId) return normalCandidate
  if (isHighThreat(goalResults)) {
    movementCommitments.delete(playerId)
    return normalCandidate
  }

  const committed = eligible.find((candidate) =>
    candidate.goal === commitment.goal && getGoalTargetKey(candidate.result) === commitment.targetKey,
  )
  if (!committed) {
    movementCommitments.delete(playerId)
    return normalCandidate
  }
  if (!normalCandidate || normalCandidate.goal === committed.goal && getGoalTargetKey(normalCandidate.result) === commitment.targetKey) return committed

  // 新目標必須顯著更好，否則沿用原路線，避免一步向左、一步向右。
  if (normalCandidate.result.score >= committed.result.score + AI_MOVEMENT_MOMENTUM_MARGIN) {
    movementCommitments.delete(playerId)
    return normalCandidate
  }
  return committed
}

function rememberMovementCommitment(playerId: string, orderId: string, candidate: { goal: string; result: { score: number; target?: unknown; actions?: AiAction[] } }): void {
  const action = candidate.result.actions?.[0]
  if (!action || !isMovementAction(action)) return
  movementCommitments.set(playerId, {
    orderId,
    goal: candidate.goal,
    targetKey: getGoalTargetKey(candidate.result),
    score: candidate.result.score,
  })
}

/** 建立 AI 行動執行所需的 turn dependencies（與 executeAiAction 共用）。 */
export function buildAiDependencies(combat: ExecuteAiActionDependencies['combat']): ExecuteAiActionDependencies {
  return {
    combat,
    turn: {
      moveCreatures: (currentState) => moveCreatures(
        currentState.creatures,
        currentState.map,
        currentState.players,
        currentState.bases,
        currentState.resourcePoints,
        currentState.defenseStructures ?? [],
        currentState.itemPoints ?? [],
        currentState.explorationEvents ?? [],
        currentState.creatureNests,
        currentState.ruins ?? [],
        currentState.traps ?? [],
        currentState.sectGates ?? [],
        currentState.globalBuffs ?? [],
        defaultRandomSource,
        currentState.round,
      ),
      spawnCreaturesFromNests: (currentState, creatures, players) => spawnCreaturesFromNestsAction(
        currentState.creatureNests,
        creatures,
        currentState.map,
        players,
        currentState.bases,
        currentState.round + 1,
        { createCreatureState: (input) => createCharacterState(input) },
        undefined,
        currentState.nestHealthRegenPercent,
      ),
    },
  }
}

/** 把一次 Player AI step 的決策與結果寫入全域行動日誌。 */
function recordAiStepEvent(
  updateGameState: AiStepRunnerDeps['updateGameState'],
  round: number,
  playerId: string,
  playerName: string,
  action: AiAction,
  outcome: { ok: boolean; reason?: string },
): void {
  const event: AiActionEvent = createAiActionEvent({
    round,
    actor: { id: playerId, kind: 'player', name: playerName },
    action,
    result: outcome.ok ? 'succeeded' : 'failed',
    reason: action.reason || outcome.reason,
  })
  updateGameState((current) => ({
    ...current,
    actionEvents: [...(current.actionEvents ?? []), event].slice(-MAX_ACTION_EVENTS),
  }))
}

/** 切片 I：AI step 執行前的單一驗證關卡。回傳 null 代表可執行。 */
function validateAiStepAction(state: GameState, action: AiAction): string | null {
  const validation = validateAiAction(state, action)
  return validation.valid ? null : validation.reason
}

function logAiDecision(
  state: GameState,
  player: { id: string; name: string; position: { row: number; column: number } },
  order: { type: string; personality?: string; playerId?: string; maxDistance?: number },
  inputs: ReturnType<typeof computeFuzzyInputs>,
  goalResults: Record<string, { score: number; target?: unknown; context?: unknown }>,
  selectedGoal: string,
  threshold: number,
  actions: AiAction[],
): void {
  console.info('[AI decision]', {
    round: state.round,
    player: { id: player.id, name: player.name, position: player.position },
    order: order.type,
    personality: order.personality ?? 'balanced',
    supportTarget: order.type === 'support-player' ? {
      id: order.playerId,
      maxDistance: order.maxDistance,
    } : undefined,
    inputs,
    goals: Object.fromEntries(Object.entries(goalResults).map(([goal, result]) => [goal, {
      score: Number(result.score.toFixed(3)),
      target: result.target,
      context: result.context,
    }])),
    selectedGoal,
    selectedContext: goalResults[selectedGoal]?.context,
    candidateRanking: {
      construction: inputs.constructionCandidates.map((candidate) => ({
        id: candidate.buildingId,
        kind: candidate.kind,
        value: Number(candidate.value.toFixed(3)),
        factors: candidate.valueFactors,
      })),
      combat: inputs.combatCandidates.map((candidate) => ({
        id: candidate.creatureId,
        distance: candidate.distance,
        damageRatio: Number(candidate.damageRatio.toFixed(3)),
        value: Number(candidate.value.toFixed(3)),
        factors: candidate.valueFactors,
      })),
      equipment: inputs.equipmentCandidates.map((candidate) => ({
        id: candidate.instanceId,
        slot: candidate.slot,
        value: Number(candidate.value.toFixed(3)),
        factors: candidate.valueFactors,
      })),
      innerSkills: inputs.innerSkillCandidates.map((candidate) => ({
        id: candidate.id,
        damageGainRatio: Number(candidate.damageGainRatio.toFixed(3)),
        value: Number(candidate.value.toFixed(3)),
        factors: candidate.valueFactors,
      })),
    },
    threshold,
    actions,
  })
}

/** 更新建設計畫中單一 queue item 的狀態。 */
function updateConstructionPlanItem(
  updateGameState: AiStepRunnerDeps['updateGameState'],
  aiPlayerId: string,
  itemIndex: number,
  patch: Partial<Pick<AiConstructionPlanItem, 'status' | 'blockedReason'>>,
): void {
  updateGameState((current) => ({
    ...current,
    aiConstructionPlans: (current.aiConstructionPlans ?? []).map((plan) => plan.aiPlayerId === aiPlayerId
      ? { ...plan, queue: plan.queue.map((item, index) => index === itemIndex ? { ...item, ...patch } : item) }
      : plan),
  }))
}

/** 取得 AI 玩家（已驗證可執行 step）。 */
function getAiPlayer(state: GameState, playerId: string) {
  const player = state.players.find((candidate) => candidate.id === playerId)
  if (!player?.isAI || state.activePlayerId !== playerId || state.creatureTurnInProgress || state.gameOver) {
    return null
  }
  return player
}

/** 單一步驟的決策結果：要執行的行動序列，或直接結束迴圈的 exitReason。 */
type AiLoopDecision =
  | { actions: AiAction[] }
  | { endTurnReason: string }
  | { exitReason: string }

/**
 * AI step 迴圈骨架（重構文件 §11 Turn Scheduler 共用框架）。
 *
 * 封裝 fuzzy step 的共用迴圈邏輯：
 * - 每步呼叫 `decide` 取得要執行的行動（或直接結束）。
 * - 執行前保底 validate（正常必定通過，不通過 = 代碼 bug）。
 * - 體力耗盡／迴圈上限／行動失敗時設定 exitReason 結束。
 * - 正常結束（無 exitReason）→ endPlayerTurn + ok:true；
 *   異常結束 → ok:false（由 scheduler 負責結束回合）。
 *
 * @param deps        store 依賴
 * @param playerId    AI 玩家 id
 * @param playerName  玩家名稱（日誌用）
 * @param loopLabel   迴圈名稱（日誌 reason 用）
 * @param decide      每步決策：回傳要執行的行動，或直接結束迴圈
 */
function runAiStepLoop(
  deps: AiStepRunnerDeps,
  playerId: string,
  playerName: string,
  loopLabel: string,
  decide: () => AiLoopDecision,
  executeAction: (action: AiAction) => ActionOutcome = deps.executeAiAction,
): ActionOutcome {
  const actor = { id: playerId, kind: 'player' as const }
  let loopCount = 0
  let exitReason = ''

  while (!exitReason && deps.getState().players.find((p) => p.id === playerId)!.stamina > 0 && loopCount < MAX_LOOPS) {
    loopCount++
    const currentPlayer = deps.getState().players.find((p) => p.id === playerId)!

    const decision = decide()
    if ('endTurnReason' in decision) {
      deps.endPlayerTurn(playerId)
      recordAiStepEvent(
        deps.updateGameState,
        deps.getState().round,
        playerId,
        currentPlayer.name,
        { type: 'end-turn', actor, reason: decision.endTurnReason },
        { ok: true },
      )
      return { ok: true }
    }
    if ('exitReason' in decision) {
      exitReason = decision.exitReason
      continue
    }

    const action = decision.actions[0]
    if (!action) {
      exitReason = '沒有可執行行動。'
      continue
    }
    const cp = deps.getState().players.find((p) => p.id === playerId)
    if (!cp || cp.stamina <= 0) {
      exitReason = `體力耗盡（剩餘 ${cp?.stamina ?? 0}）`
      continue
    }
    const validation = validateAiAction(deps.getState(), action)
    if (!validation.valid) {
      exitReason = `保底驗證失敗（代碼 bug）：${validation.reason}`
      continue
    }
    const actionResult = executeAction(action)
    recordAiStepEvent(deps.updateGameState, deps.getState().round, playerId, currentPlayer.name, action, actionResult)
    if (!actionResult.ok) {
      exitReason = `行動失敗：${actionResult.reason ?? '未知錯誤'}`
      continue
    }
    if (action.type === 'move') {
      rememberAiMoveOrigin(playerId, currentPlayer.position)
    }

    // 一次只執行一個 action；下一個 action 由 scheduler 的下一個 timer 觸發。
    return { ok: true }
  }

  // ── 出口邏輯 ──────────────────────────────────────────────
  if (!exitReason) {
    // 正常結束：呼叫 endPlayerTurn，回傳 ok:true（scheduler 不會重複呼叫 endTurn）
    const endAction = { type: 'end-turn' as const, actor, reason: `${loopLabel}迴圈結束（${loopCount} 步）` }
    deps.endPlayerTurn(playerId)
    recordAiStepEvent(deps.updateGameState, deps.getState().round, playerId, playerName, endAction, { ok: true })
    return { ok: true }
  }
  // 異常退出：不呼叫 endPlayerTurn，回傳 ok:false（scheduler 會負責結束回合）
  return { ok: false, reason: exitReason }
}

/** 執行防守（protect-base）step。 */
export function runAiDefenseStep(deps: AiStepRunnerDeps, playerId: string): ActionOutcome {
  const state = deps.getState()
  const player = getAiPlayer(state, playerId)
  const order = state.aiOrders?.find((candidate) => candidate.aiPlayerId === playerId && candidate.type === 'protect-base' && candidate.status === 'active')
  if (!player || !order || order.type !== 'protect-base') {
    return { ok: false, reason: '目前無法執行 AI 防守回合。' }
  }

  const selfPreservation = chooseSelfPreservationAction(state, playerId, order.retreatHealthPercent, getPlayerAiEmergency())
  if (selfPreservation?.type === 'move') {
    const action = defenseActionToAiAction(state, playerId, selfPreservation)
    const rejection = validateAiStepAction(state, action)
    if (rejection) {
      recordAiStepEvent(deps.updateGameState, state.round, playerId, player.name, action, { ok: false, reason: rejection })
      return { ok: false, reason: rejection }
    }
    const result = deps.movePlayerTo(playerId, selfPreservation.position.row, selfPreservation.position.column)
    recordAiStepEvent(deps.updateGameState, state.round, playerId, player.name, action, result)
    return result.ok ? { ok: true } : { ok: false, reason: result.reason ?? 'AI 自保移動失敗。' }
  }
  if (selfPreservation) {
    const action = defenseActionToAiAction(state, playerId, selfPreservation)
    const rejection = validateAiStepAction(state, action)
    if (rejection) {
      recordAiStepEvent(deps.updateGameState, state.round, playerId, player.name, action, { ok: false, reason: rejection })
      return { ok: false, reason: rejection }
    }
    deps.endPlayerTurn(playerId)
    recordAiStepEvent(deps.updateGameState, state.round, playerId, player.name, action, { ok: true })
    return { ok: true }
  }

  const decision = chooseDefenseAction(state, playerId, order)
  if (decision.type === 'attack') {
    const action = defenseActionToAiAction(state, playerId, decision)
    const rejection = validateAiStepAction(state, action)
    if (rejection) {
      recordAiStepEvent(deps.updateGameState, state.round, playerId, player.name, action, { ok: false, reason: rejection })
      return { ok: false, reason: rejection }
    }
    const result = deps.executeAiAttack(playerId, decision.targetType, decision.targetId)
    recordAiStepEvent(deps.updateGameState, state.round, playerId, player.name, action, result.ok ? { ok: true } : { ok: false, reason: result.reason })
    return result.ok ? { ok: true } : { ok: false, reason: result.reason ?? 'AI 攻擊失敗。' }
  }
  if (decision.type === 'move') {
    const action = defenseActionToAiAction(state, playerId, decision)
    const rejection = validateAiStepAction(state, action)
    if (rejection) {
      recordAiStepEvent(deps.updateGameState, state.round, playerId, player.name, action, { ok: false, reason: rejection })
      return { ok: false, reason: rejection }
    }
    const result = deps.movePlayerTo(playerId, decision.position.row, decision.position.column)
    recordAiStepEvent(deps.updateGameState, state.round, playerId, player.name, action, result)
    return result.ok ? { ok: true } : { ok: false, reason: result.reason ?? 'AI 移動失敗。' }
  }
  {
    const action = defenseActionToAiAction(state, playerId, decision)
    const rejection = validateAiStepAction(state, action)
    if (rejection) {
      recordAiStepEvent(deps.updateGameState, state.round, playerId, player.name, action, { ok: false, reason: rejection })
      return { ok: false, reason: rejection }
    }
    deps.endPlayerTurn(playerId)
    recordAiStepEvent(deps.updateGameState, state.round, playerId, player.name, action, { ok: true })
    return { ok: true }
  }
}

/** 執行支援（support-player）step。 */
export function runAiSupportStep(deps: AiStepRunnerDeps, playerId: string): ActionOutcome {
  const state = deps.getState()
  const player = getAiPlayer(state, playerId)
  const order = state.aiOrders?.find((candidate) => candidate.aiPlayerId === playerId && candidate.type === 'support-player' && candidate.status === 'active')
  if (!player || !order || order.type !== 'support-player') {
    return { ok: false, reason: '目前無法執行 AI 支援回合。' }
  }
  const target = state.players.find((candidate) => candidate.id === order.playerId)
  if (!target || target.health <= 0) {
    deps.updateGameState((current) => ({
      ...current,
      aiOrders: (current.aiOrders ?? []).map((currentOrder) => currentOrder.id === order.id ? { ...currentOrder, status: 'paused' as const } : currentOrder),
    }))
    deps.endPlayerTurn(playerId)
    recordAiStepEvent(
      deps.updateGameState,
      state.round,
      playerId,
      player.name,
      { type: 'end-turn', actor: { id: playerId, kind: 'player' }, reason: '支援目標不存在，暫停支援命令。' },
      { ok: true },
    )
    return { ok: true }
  }
  const aiDeps = buildAiDependencies(STUB_COMBAT_DEPS)
  const constraints = getAiGoalConstraints(player.aiPersonality, ['selfPreservation', 'engageCombat', 'positioning'])
  constraints.followTarget = { position: target.position, maxDistance: order.maxDistance }
  const combatTarget = state.creatures
    .filter((creature) => creature.health > 0)
    .map((creature) => ({
      creature,
      distance: Math.min(
        Math.abs(creature.position.row - target.position.row) + Math.abs(creature.position.column - target.position.column),
        Math.abs(creature.position.row - player.position.row) + Math.abs(creature.position.column - player.position.column),
      ),
    }))
    .sort((first, second) => first.distance - second.distance)[0]
  if (combatTarget) {
    if (combatTarget.distance > 1) {
      // 遠處的怪物不能被支援命令直接指定為攔截目標，避免 fuzzy 選出不可執行的遠距攻擊。
      constraints.forcedCombatTarget = undefined
    } else {
      constraints.forcedCombatTarget = { id: combatTarget.creature.id, position: combatTarget.creature.position }
    }
  }

  return runAiStepLoop(deps, playerId, player.name, '模糊支援策略', () => {
    const currentPlayer = deps.getState().players.find((candidate) => candidate.id === playerId)!
    const goalResults = evaluateAllGoals(
      computeFuzzyInputs(deps.getState(), currentPlayer, player.aiPersonality),
      deps.getState(),
      currentPlayer,
      aiDeps,
      constraints,
    )
    const rankedGoals = rankGoals(goalResults)
    for (const candidate of rankedGoals) {
      if (candidate.result.score < (constraints.goalThresholds?.[candidate.goal] ?? MIN_THRESHOLD)) break
      if (candidate.result.actions?.length && candidate.result.actions.some((action) => action.type !== 'hold')) {
        logAiDecision(
          deps.getState(),
          currentPlayer,
          order,
          computeFuzzyInputs(deps.getState(), currentPlayer, player.aiPersonality),
          goalResults,
          candidate.goal,
          constraints.goalThresholds?.[candidate.goal] ?? MIN_THRESHOLD,
          candidate.result.actions,
        )
        return { actions: candidate.result.actions }
      }
    }
    return { exitReason: '支援命令下沒有可執行的 fuzzy 行動' }
  }, (action) => action.type === 'attack'
    ? deps.executeAiAttack(playerId, action.target.kind === 'creature' ? 'creature' : action.target.kind, action.target.id)
    : deps.executeAiAction(action))
}

/** 執行建設（construction）step。 */
export function runAiConstructionStep(deps: AiStepRunnerDeps, playerId: string): ActionOutcome {
  const state = deps.getState()
  const player = getAiPlayer(state, playerId)
  const plan = state.aiConstructionPlans?.find((candidate) => candidate.aiPlayerId === playerId)
  if (!player || !plan) {
    return { ok: false, reason: '目前無法執行 AI 建設回合。' }
  }
  if (!state.bases.some((candidate) => candidate.id === plan.baseId)) {
    return { ok: false, reason: '建設計畫的據點不存在。' }
  }

  // paused 方針：不主動建造，但可執行採集（§14.6）。
  if (plan.policy === 'paused') {
    const adjacentPoint = (state.resourcePoints ?? []).find((point) => isSameOrAdjacent(player.position, point.position))
    if (adjacentPoint) {
      const collectAction: AiAction = { type: 'collect', actor: { id: playerId, kind: 'player' }, target: { id: adjacentPoint.id, kind: 'resource', position: adjacentPoint.position }, reason: '暫停建造，採集建料。' }
      const rejection = validateAiStepAction(state, collectAction)
      if (rejection) {
        recordAiStepEvent(deps.updateGameState, state.round, playerId, player.name, collectAction, { ok: false, reason: rejection })
        return { ok: false, reason: rejection }
      }
      const result = deps.collectResourcePoint(playerId, adjacentPoint.id)
      recordAiStepEvent(deps.updateGameState, state.round, playerId, player.name, collectAction, result.ok ? { ok: true } : { ok: false, reason: result.reason })
      return result.ok ? { ok: true } : { ok: false, reason: result.reason ?? '採集失敗。' }
    }
    deps.endPlayerTurn(playerId)
    recordAiStepEvent(
      deps.updateGameState,
      state.round,
      playerId,
      player.name,
      { type: 'hold', actor: { id: playerId, kind: 'player' }, reason: '暫停建造：附近無可採集的資源點。' },
      { ok: true },
    )
    return { ok: true }
  }

  // 體力護欄：體力不足以建造時直接結束回合；這是暫時性狀態，不可標記為 blocked。
  if (!canPlayerPerformAction(deps.getState(), playerId, ACTION_STAMINA_COSTS.build).ok) {
    deps.endPlayerTurn(playerId)
    recordAiStepEvent(
      deps.updateGameState,
      state.round,
      playerId,
      player.name,
      { type: 'end-turn', actor: { id: playerId, kind: 'player' }, reason: '體力不足，結束建設回合。' },
      { ok: true },
    )
    return { ok: true }
  }

  // 依效用評分逐一套用候選；失敗者標記 blocked（含原因）後換下一個。
  const excluded = new Set<number>()
  while (true) {
    const candidate = pickNextBuildCandidate(deps.getState(), plan, excluded)
    if (!candidate) break
    const buildAction: AiAction = { type: 'build', actor: { id: playerId, kind: 'player' }, baseId: plan.baseId, buildingType: candidate.buildingId, reason: `建設計畫：${candidate.buildingName}（優先度 ${candidate.item.priority}）。` }
    const rejection = validateAiStepAction(deps.getState(), buildAction)
    if (rejection) {
      updateConstructionPlanItem(deps.updateGameState, playerId, candidate.itemIndex, { status: 'blocked', blockedReason: rejection })
      excluded.add(candidate.itemIndex)
      continue
    }
    const outcome = constructBuilding(deps.getState(), plan.baseId, candidate.buildingId, playerId)
    if (outcome.result.ok) {
      deps.updateGameState(() => outcome.state)
      updateConstructionPlanItem(deps.updateGameState, playerId, candidate.itemIndex, { status: 'completed', blockedReason: undefined })
      recordAiStepEvent(
        deps.updateGameState,
        deps.getState().round,
        playerId,
        player.name,
        buildAction,
        { ok: true },
      )
      deps.showActionResult({
        title: '🏗️ 建設完成',
        message: `${player.name} 已在據點完成「${candidate.buildingName}」。`,
        rewards: [],
      })
      return { ok: true }
    }
    updateConstructionPlanItem(deps.updateGameState, playerId, candidate.itemIndex, { status: 'blocked', blockedReason: outcome.result.reason })
    excluded.add(candidate.itemIndex)
  }

  // 佇列全部受阻 → 升級 fallback（若允許）。
  const upgradeCandidate = pickUpgradeCandidate(deps.getState(), plan)
  if (upgradeCandidate) {
    const outcome = upgradeBuilding(deps.getState(), playerId, plan.baseId, upgradeCandidate.buildingId)
    if (outcome.result.ok) {
      deps.updateGameState(() => outcome.state)
      recordAiStepEvent(
        deps.updateGameState,
        deps.getState().round,
        playerId,
        player.name,
        { type: 'build', actor: { id: playerId, kind: 'player' }, baseId: plan.baseId, buildingType: upgradeCandidate.buildingName, reason: '佇列已無可建項目，升級既有建築。' },
        { ok: true },
      )
      deps.showActionResult({
        title: '⬆️ 建築升級',
        message: `${player.name} 已將「${upgradeCandidate.buildingName}」升級。`,
        rewards: [],
      })
      return { ok: true }
    }
    // 升級失敗不阻塞 queue：記錄待命原因即可。
    deps.endPlayerTurn(playerId)
    recordAiStepEvent(
      deps.updateGameState,
      deps.getState().round,
      playerId,
      player.name,
      { type: 'hold', actor: { id: playerId, kind: 'player' }, reason: outcome.result.reason ?? '目前無法升級建築。' },
      { ok: true },
    )
    return { ok: true }
  }

  deps.endPlayerTurn(playerId)
  recordAiStepEvent(
    deps.updateGameState,
    deps.getState().round,
    playerId,
    player.name,
    { type: 'end-turn', actor: { id: playerId, kind: 'player' }, reason: '沒有可執行的建設項目，結束回合。' },
    { ok: true },
  )
  return { ok: true }
}

/** 執行模糊策略（fuzzy）step。 */
export function runFuzzyStep(deps: AiStepRunnerDeps, playerId: string): ActionOutcome {
  const state = deps.getState()
  const player = getAiPlayer(state, playerId)
  const order = state.aiOrders?.find((candidate) => candidate.aiPlayerId === playerId && candidate.type === 'fuzzy' && candidate.status === 'active')
  if (!player || !order || order.type !== 'fuzzy') {
    return { ok: false, reason: '目前無法執行模糊策略回合。' }
  }

  const aiDeps = buildAiDependencies(STUB_COMBAT_DEPS)

  // 護衛型（guardian）：fuzzy 命令下自動跟隨最近的人類玩家（複用 support-player 的 followTarget 機制）。
  const guardianConstraints = getAiGoalConstraints(order.personality)
  if (order.personality === 'guardian') {
    const humanTarget = deps.getState().players.find((candidate) => !candidate.isAI && candidate.health > 0)
    if (humanTarget) {
      guardianConstraints.followTarget = { position: humanTarget.position, maxDistance: 3 }
    }
  }

  return runAiStepLoop(deps, playerId, player.name, '模糊策略', () => {
    const currentPlayer = deps.getState().players.find((p) => p.id === playerId)!

    // 1. Perceive
    const inputs = computeFuzzyInputs(deps.getState(), currentPlayer, order.personality)

    // 2. Evaluate（evaluateAllGoals 內部已做 validate + apply）
    const goalResults = evaluateAllGoals(
      inputs,
      deps.getState(),
      currentPlayer,
      aiDeps,
      guardianConstraints,
    )

    // 4. Select（result.actions 已由 evaluate 保證合法）
    const rankedGoals = rankGoals(goalResults)
    let actions: AiAction[] = []
    let goalFound = false
    let normalCandidate: typeof rankedGoals[number] | undefined

    for (const candidate of rankedGoals) {
      const threshold = getAiGoalConstraints(order.personality).goalThresholds?.[candidate.goal] ?? MIN_THRESHOLD
      if (candidate.result.score < threshold) break

      const candidateActions = candidate.result.actions
      if (!candidateActions || candidateActions.length === 0) continue
      if (candidateActions.every((a) => a.type === 'hold')) continue

      normalCandidate = candidate
      break
    }

    const selectedCandidate = selectFuzzyCandidateWithMomentum(
      playerId,
      order.id,
      rankedGoals,
      getAiGoalConstraints(order.personality).goalThresholds ?? {},
      goalResults,
      normalCandidate,
    )
    if (selectedCandidate) {
      actions = selectedCandidate.result.actions ?? []
      goalFound = actions.length > 0
      if (goalFound) {
        rememberMovementCommitment(playerId, order.id, selectedCandidate)
        const threshold = getAiGoalConstraints(order.personality).goalThresholds?.[selectedCandidate.goal] ?? MIN_THRESHOLD
        logAiDecision(deps.getState(), currentPlayer, order, inputs, goalResults, selectedCandidate.goal, threshold, actions)
      }
    }

    if (!goalFound) {
      const highest = rankedGoals[0]
      movementCommitments.delete(playerId)
      return {
        endTurnReason: highest
            ? `模糊策略：${highest.goal} 分數 ${highest.result.score.toFixed(2)}，但目前沒有可執行 action，結束回合。`
            : '模糊策略：沒有可執行 action，結束回合。',
      }
    }
    return { actions }
  })
}

