import type { GameState, ActionOutcome, AiConstructionPlanItem, ActionResult } from '../types'
import type { AiAction } from './aiAction'
import type { AiActionEvent } from './aiActionEvent'
import { createAiActionEvent } from './aiActionEvent'
import { chooseSelfPreservationAction } from '../aiSelfPreservationRules'
import { chooseDefenseAction } from '../aiDefenseRules'
import { chooseSupportAction } from '../aiSupportRules'
import { defenseActionToAiAction } from './defenseActionAdapter'
import { validateAiAction } from './validation/validateAiAction'
import { getPlayerAiEmergency } from './policy/aiPolicyRegistry'
import { pickNextBuildCandidate, pickUpgradeCandidate } from './construction/constructionAi'
import { computeFuzzyInputs } from './fuzzy/fuzzyInputs'
import { evaluateAllGoals } from './fuzzy/goals'
import { MIN_THRESHOLD, rankGoals } from './fuzzy/decision'
import { getAiGoalConstraints } from './fuzzy/personality'
import { ACTION_STAMINA_COSTS, canPlayerPerformAction } from '../rules/actionCostRules'
import { constructBuilding, upgradeBuilding } from '../actions/buildingActions'
import { moveCreatures, spawnCreaturesFromNests as spawnCreaturesFromNestsAction } from '../actions/creatureActions'
import { createCharacterState } from '../characterFactory'
import { defaultRandomSource } from '../rules/randomRules'
import { isSameOrAdjacent } from '../types'
import type { ExecuteAiActionDependencies } from './execution/executeAiAction'

/** 全域行動日誌上限：只保留最新 N 筆，避免長局面資料無限成長（重構文件 §4.5）。 */
const MAX_ACTION_EVENTS = 200

/** AI step 迴圈上限：避免異常狀態下無限迴圈。 */
const MAX_LOOPS = 50

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
): ActionOutcome {
  const actor = { id: playerId, kind: 'player' as const }
  let loopCount = 0
  let exitReason = ''

  while (!exitReason && deps.getState().players.find((p) => p.id === playerId)!.stamina > 0 && loopCount < MAX_LOOPS) {
    loopCount++
    const currentPlayer = deps.getState().players.find((p) => p.id === playerId)!

    const decision = decide()
    if ('exitReason' in decision) {
      exitReason = decision.exitReason
      continue
    }

    for (const action of decision.actions) {
      const cp = deps.getState().players.find((p) => p.id === playerId)
      if (!cp || cp.stamina <= 0) {
        exitReason = `體力耗盡（剩餘 ${cp?.stamina ?? 0}）`
        break
      }
      const validation = validateAiAction(deps.getState(), action)
      if (!validation.valid) {
        exitReason = `保底驗證失敗（代碼 bug）：${validation.reason}`
        break
      }
      const actionResult = deps.executeAiAction(action)
      recordAiStepEvent(deps.updateGameState, deps.getState().round, playerId, currentPlayer.name, action, actionResult)
      if (!actionResult.ok) {
        exitReason = `行動失敗：${actionResult.reason ?? '未知錯誤'}`
        break
      }
    }
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

  const decision = chooseSupportAction(state, playerId, order)
  if (decision.type === 'attack') {
    const action = defenseActionToAiAction(state, playerId, decision)
    const rejection = validateAiStepAction(state, action)
    if (rejection) {
      recordAiStepEvent(deps.updateGameState, state.round, playerId, player.name, action, { ok: false, reason: rejection })
      return { ok: false, reason: rejection }
    }
    const result = deps.executeAiAttack(playerId, decision.targetType, decision.targetId)
    recordAiStepEvent(deps.updateGameState, state.round, playerId, player.name, action, result.ok ? { ok: true } : { ok: false, reason: result.reason })
    return result.ok ? { ok: true } : { ok: false, reason: result.reason ?? 'AI 支援攻擊失敗。' }
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
    return result.ok ? { ok: true } : { ok: false, reason: result.reason ?? 'AI 支援移動失敗。' }
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

  return runAiStepLoop(deps, playerId, player.name, '模糊策略', () => {
    const currentPlayer = deps.getState().players.find((p) => p.id === playerId)!

    // 1. Perceive
    const inputs = computeFuzzyInputs(deps.getState(), currentPlayer)

    // 2. Evaluate（evaluateAllGoals 內部已做 validate + apply）
    const goalResults = evaluateAllGoals(
      inputs,
      deps.getState(),
      currentPlayer,
      aiDeps,
      getAiGoalConstraints(order.personality),
    )

    // 4. Select（result.actions 已由 evaluate 保證合法）
    const rankedGoals = rankGoals(goalResults)
    let actions: AiAction[] = []
    let goalFound = false

    for (const candidate of rankedGoals) {
      const threshold = getAiGoalConstraints(order.personality).goalThresholds?.[candidate.goal] ?? MIN_THRESHOLD
      if (candidate.result.score < threshold) break

      const candidateActions = candidate.result.actions
      if (!candidateActions || candidateActions.length === 0) continue
      if (candidateActions.every((a) => a.type === 'hold')) continue

      actions = candidateActions
      goalFound = true
      break
    }

    if (!goalFound) {
      return { exitReason: `所有目標分數過低或無法產生有效行動（最高 ${rankedGoals[0]?.goal} = ${rankedGoals[0]?.result.score.toFixed(2)}）` }
    }
    return { actions }
  })
}

