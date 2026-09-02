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
import { applyMidTermGoalInputs, overrideScoreForMidTermGoal, abortMidTermGoal, applyKillGoalInputs, lockTravelGoal, clearTravelGoal, invalidateTravelGoalIfUnavailable, isTravelGoalName, getMidTermGoalSummary } from './fuzzy/midTermGoal'
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
/** 移動目標的強制維持回合數：鎖定目標後至少維持 N 步才允許切換（暴力解法，避免目標頻繁切換）。 */
const MIN_COMMITMENT_TURNS = 1
const movementCommitments = new Map<string, {
  orderId: string
  goal: string
  targetKey: string
  score: number
  /** 剩餘強制維持回合數；>0 時即使新目標分數更高也維持原目標。 */
  remainingTurns: number
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
  if (!result.target) return ''
  const target = result.target as { kind?: string; targetId?: string; targetType?: string; position?: unknown }
  // 攻擊目標以 targetId 為穩定鍵：怪物在 step 間可能移動（position 變化），
  // 若含 position，承諾會因怪物移動而失配、無法集火同一個目標。
  if (target.kind === 'attack' && target.targetId) {
    return `attack:${target.targetType}:${target.targetId}`
  }
  return JSON.stringify(result.target)
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
    abortMidTermGoal(playerId)
    return normalCandidate
  }

  // 尋找「承諾目標」：移動承諾匹配有 move 的候選；攻擊承諾匹配同樣「打同一個目標」的 engageCombat。
  const committed = eligible.find((candidate) =>
    candidate.goal === commitment.goal && getGoalTargetKey(candidate.result) === commitment.targetKey,
  ) ?? rankedGoals.find((candidate) =>
    candidate.result.actions?.some((action) => action.type === 'attack')
      && getGoalTargetKey(candidate.result) === commitment.targetKey,
  )
  if (!committed) {
    movementCommitments.delete(playerId)
    return normalCandidate
  }
  if (!normalCandidate || normalCandidate.goal === committed.goal && getGoalTargetKey(normalCandidate.result) === commitment.targetKey) {
    const c = committed
    movementCommitments.set(playerId, { ...commitment, score: c.result.score, remainingTurns: Math.max(0, commitment.remainingTurns - 1) })
    return c
  }

  // 強制維持期內：即使新目標分數更高也維持原目標，避免目標頻繁切換。
  // 原目標仍可執行（committed 存在）時，強制維持直到 remainingTurns 歸零。
  if (commitment.remainingTurns > 0) {
    movementCommitments.set(playerId, { ...commitment, score: committed.result.score, remainingTurns: commitment.remainingTurns - 1 })
    return committed
  }

  // 新目標必須顯著更好，否則沿用原路線/原攻擊目標，避免一步向左、一步向右。
  if (normalCandidate.result.score >= committed.result.score + AI_MOVEMENT_MOMENTUM_MARGIN) {
    movementCommitments.delete(playerId)
    return normalCandidate
  }
  movementCommitments.set(playerId, { ...commitment, score: committed.result.score, remainingTurns: 0 })
  return committed
}

function rememberMovementCommitment(playerId: string, orderId: string, candidate: { goal: string; result: { score: number; target?: unknown; actions?: AiAction[] } }): void {
  const action = candidate.result.actions?.[0]
  // 承諾「移動到目標」或「攻擊既有目標」，讓玩家會持續推進/持續打同一目標，而不是打一下就轉移。
  if (!action || (action.type !== 'move' && action.type !== 'transport' && action.type !== 'attack')) return
  movementCommitments.set(playerId, {
    orderId,
    goal: candidate.goal,
    targetKey: getGoalTargetKey(candidate.result),
    score: candidate.result.score,
    remainingTurns: MIN_COMMITMENT_TURNS,
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
  console.info('[AI action]', {
    round,
    player: { id: playerId, name: playerName },
    action,
    result: outcome.ok ? 'succeeded' : 'failed',
    reason: action.reason || outcome.reason,
  })
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
  goalResults: Record<string, { score: number; target?: unknown; context?: unknown; actions?: AiAction[] }>,
  selectedGoal: string,
  threshold: number,
  actions: AiAction[],
): void {
  const playerState = state.players.find((candidate) => candidate.id === player.id)
  const topGoals = Object.entries(goalResults)
    .sort((first, second) => second[1].score - first[1].score)
    .slice(0, 5)
    .map(([goal, result]) => ({
      goal,
      score: Number(result.score.toFixed(3)),
      executable: (result.actions?.length ?? 0) > 0,
      actions: result.actions?.map((action) => action.type) ?? [],
    }))

  console.info('[AI decision core]', {
    round: state.round,
    player: { id: player.id, name: player.name, position: player.position },
    personality: order.personality ?? 'balanced',
    status: {
      stamina: playerState?.stamina,
      health: playerState?.health,
      level: playerState?.level,
      turnEnded: playerState?.turnEnded,
    },
    midTerm: getMidTermGoalSummary(player.id) ?? null,
    momentum: movementCommitments.get(player.id) ?? null,
    perception: {
      staminaRatio: Number(inputs.staminaRatio.toFixed(3)),
      healthRatio: Number(inputs.healthRatio.toFixed(3)),
      nearestThreatDistance: inputs.distToNearestThreat,
      nearestBase: inputs.nearestBase?.id,
      nearestUndiscoveredBase: inputs.nearestUndiscoveredBase?.id,
      unexploredInvisibleCells: inputs.unexploredInvisibleCells,
      reachableItemCount: inputs.reachableItemCount,
      reachableResourceCount: inputs.reachableResourceCount,
    },
    topGoals,
    selected: {
      goal: selectedGoal,
      score: Number((goalResults[selectedGoal]?.score ?? 0).toFixed(3)),
      threshold,
      context: goalResults[selectedGoal]?.context,
      actions: actions.map((action) => ({
        type: action.type,
        destination: action.type === 'move' ? action.destination : undefined,
        target: 'target' in action ? action.target : undefined,
        reason: action.reason,
      })),
    },
  })

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
      recordAiStepEvent(
        deps.updateGameState,
        deps.getState().round,
        playerId,
        currentPlayer.name,
        action,
        { ok: false, reason: `保底驗證失敗（代碼 bug）：${validation.reason}` },
      )
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

    // 2.5 中期目標：決定是否鎖定「擊殺獵物 / 存錢打工」，並對目標分數覆寫（優先執行）。
    applyMidTermGoalInputs(
      currentPlayer.id,
      currentPlayer.money ?? 0,
      inputs.staminaRatio,
      inputs.hasMissionBoard,
      inputs.feasibility.missionBaseId,
    )
    applyKillGoalInputs(
      currentPlayer.id,
      inputs.combatCandidates.map((candidate) => ({
        targetId: candidate.creatureId,
        targetType: 'creature' as const,
        distance: candidate.distance,
        damageRatio: candidate.damageRatio,
        canSurvive: inputs.hitsSurvivable >= 1,
      })),
      inputs.staminaRatio,
    )
    invalidateTravelGoalIfUnavailable(currentPlayer.id, goalResults)
    for (const goalName of Object.keys(goalResults) as GoalName[]) {
      goalResults[goalName] = overrideScoreForMidTermGoal(currentPlayer.id, goalName, goalResults[goalName])
    }

    // 4. Select（result.actions 已由 evaluate 保證合法）
    const rankedGoals = rankGoals(goalResults)
    let actions: AiAction[] = []
    let goalFound = false
    let normalCandidate: typeof rankedGoals[number] | undefined
    let fallbackMovementCandidate: typeof rankedGoals[number] | undefined

    for (const candidate of rankedGoals) {
      const threshold = getAiGoalConstraints(order.personality).goalThresholds?.[candidate.goal] ?? MIN_THRESHOLD
      const candidateActions = candidate.result.actions
      if (!candidateActions || candidateActions.length === 0) continue
      if (candidateActions.every((a) => a.type === 'hold')) continue
      if (!fallbackMovementCandidate && candidateActions.some((action) => isMovementAction(action))) {
        fallbackMovementCandidate = candidate
      }
      if (candidate.result.score < threshold) continue

      normalCandidate = candidate
      break
    }

    const selectedCandidate = selectFuzzyCandidateWithMomentum(
      playerId,
      order.id,
      rankedGoals,
      getAiGoalConstraints(order.personality).goalThresholds ?? {},
      goalResults,
      normalCandidate ?? fallbackMovementCandidate,
    )
    if (selectedCandidate) {
      actions = selectedCandidate.result.actions ?? []
      goalFound = actions.length > 0
      if (goalFound) {
        rememberMovementCommitment(playerId, order.id, selectedCandidate)
        // 移動類目標：鎖定中期目標，避免繞圈（學招/任務/探索/清障/收集/防禦建設）
        if (isTravelGoalName(selectedCandidate.goal)) {
          lockTravelGoal(playerId, selectedCandidate.goal, getGoalTargetKey(selectedCandidate.result))
        }
        const threshold = getAiGoalConstraints(order.personality).goalThresholds?.[selectedCandidate.goal] ?? MIN_THRESHOLD
        logAiDecision(deps.getState(), currentPlayer, order, inputs, goalResults, selectedCandidate.goal, threshold, actions)
      }
    }

    if (!goalFound) {
      movementCommitments.delete(playerId)
      clearTravelGoal(playerId)
      return {
        endTurnReason: '模糊策略：目前沒有可執行的行動，結束回合。',
      }
    }
    return { actions }
  })
}

