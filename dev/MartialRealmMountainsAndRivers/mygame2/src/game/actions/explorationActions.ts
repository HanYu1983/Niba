import { BUILDING_TYPES } from '../catalogs/buildingCatalog'
import type { ExplorationEventChoice } from '../types'
import type { ActionExecutionResult, ActionOutcome, GameState } from '../types'
import { applyEventEffects, checkEventRequirements, getEventChoiceDefinition, applyEventStateEffects } from '../events/eventResolver'
import { getBuildingLevel, getMissionReward } from '../rules/buildingProgressionRules'
import { getResourceCollectionMaterialGain, getBaseMaxBuildingMaterials, isBaseActive } from '../rules/baseRules'
import { getEffectiveMaterialGain } from '../rules/policyRules'
import { getGlobalHealingMultiplier } from '../rules/globalBuffRules'
import { getExplorationEventTarget, getResourceCollectionTarget } from '../rules/targetRules'
import { ACTION_STAMINA_COSTS, canPlayerPerformAction, getActionablePlayer, spendPlayerStamina } from '../rules/actionCostRules'
import { isAdjacent, isSameOrAdjacent } from '../types'
import { getGatherDoubleYieldChance, getGatherStaminaCostReduction } from '../rules/playerDerivedRules'
import { replenishInteractionPoint } from '../worldGeneration'
import { incrementRunStat } from '../runStats'
import { progressObjectives, checkVictory } from '../rules/campaignRules'
import { executeTriggers } from '../rules/triggerRules'
import { defaultRandomSource, type RandomSource } from '../rules/randomRules'

export type ExplorationActionResult<T = ActionOutcome> = {
  state: GameState
  result: T
}

/** 批次任務的總收穫。 */
export type MissionBatchResult = {
  count: number
  money: number
  prestige: number
}

/** 批次採集的總收穫。 */
export type CollectionBatchResult = {
  count: number
  materialGain: number
  prestige: number
}

export type InfirmaryResult = {
  healthRecovery: number
  innerPowerRecovery: number
  infirmaryLevel: number
}

export const INFIRMARY_HEALTH_RECOVERY = 15
export const INFIRMARY_INNER_POWER_RECOVERY = 8

function rollInfirmaryRecovery(baseValue: number, buildingLevel: number, random: RandomSource): number {
  const minimum = Math.max(1, Math.floor(baseValue * (0.8 + (buildingLevel - 1) * 0.4)))
  const maximum = Math.ceil(baseValue * (1.2 + (buildingLevel - 1) * 0.4))
  return minimum + Math.floor(random() * (maximum - minimum + 1))
}

export function executeMission(state: GameState, playerId: string, baseId: string): ExplorationActionResult {
  const player = getActionablePlayer(state, playerId)
  const base = state.bases.find((currentBase) => currentBase.id === baseId)
  const board = base?.buildings.find((building) => building.type === BUILDING_TYPES.BOARD)
  const actionCheck = canPlayerPerformAction(state, playerId, ACTION_STAMINA_COSTS.mission)
  if (!actionCheck.ok) return { state, result: { ok: false, reason: actionCheck.reason ?? '體力不足。' } }
  if (!player || !base || !isBaseActive(base) || !board || Math.abs(player.position.row - base.position.row) + Math.abs(player.position.column - base.position.column) > 1) {
    return { state, result: { ok: false, reason: !player ? '目前無法行動。' : !base ? '據點不存在。' : !isBaseActive(base) ? '據點已停用，無法使用建築功能。' : !board ? '據點沒有告示牌。' : '玩家未在據點旁。' } }
  }

  const reward = getMissionReward(getBuildingLevel(board))
  return {
    state: {
      ...state,
      players: state.players.map((currentPlayer) => currentPlayer.id === playerId
        ? spendPlayerStamina({ ...currentPlayer, money: currentPlayer.money + reward.money, prestige: currentPlayer.prestige + reward.prestige }, ACTION_STAMINA_COSTS.mission)
        : currentPlayer),
      // 完成首次告示牌任務後解鎖據點永久視野。
      bases: state.bases.map((currentBase) => currentBase.id === baseId
        ? { ...currentBase, discovered: true }
        : currentBase),
    },
    result: { ok: true },
  }
}

export function executeMissionBatch(state: GameState, playerId: string, baseId: string): ExplorationActionResult<ActionExecutionResult<MissionBatchResult>> {
  const player = getActionablePlayer(state, playerId)
  const base = state.bases.find((candidate) => candidate.id === baseId)
  const board = base?.buildings.find((building) => building.type === BUILDING_TYPES.BOARD)
  const actionCheck = canPlayerPerformAction(state, playerId, 0)
  if (!actionCheck.ok) return { state, result: { ok: false, reason: actionCheck.reason ?? '目前無法行動。' } }
  if (!player || !base || !isBaseActive(base) || !board || !isAdjacent(player.position, base.position)) {
    return { state, result: { ok: false, reason: !player ? '目前無法行動。' : !base ? '據點不存在。' : !isBaseActive(base) ? '據點已停用，無法使用建築功能。' : !board ? '據點沒有告示牌。' : '玩家未在據點旁。' } }
  }
  const count = Math.floor(player.stamina / ACTION_STAMINA_COSTS.mission)
  if (count <= 0) return { state, result: { ok: false, reason: '體力不足。' } }
  const reward = getMissionReward(getBuildingLevel(board))
  return {
    state: {
      ...state,
      players: state.players.map((currentPlayer) => currentPlayer.id === playerId
        ? spendPlayerStamina({ ...currentPlayer, money: currentPlayer.money + reward.money * count, prestige: currentPlayer.prestige + reward.prestige * count }, ACTION_STAMINA_COSTS.mission * count)
        : currentPlayer),
      bases: state.bases.map((currentBase) => currentBase.id === baseId ? { ...currentBase, discovered: true } : currentBase),
    },
    result: { ok: true, data: { count, money: reward.money * count, prestige: reward.prestige * count } },
  }
}

export function useInfirmary(state: GameState, playerId: string, baseId: string, random: RandomSource = defaultRandomSource): ExplorationActionResult<ActionExecutionResult<InfirmaryResult>> {
  const player = getActionablePlayer(state, playerId)
  const base = state.bases.find((currentBase) => currentBase.id === baseId)
  const hasInfirmary = base?.buildings.some((building) => building.type === BUILDING_TYPES.INFIRMARY)
  const infirmary = base?.buildings.find((building) => building.type === BUILDING_TYPES.INFIRMARY)
  const adjacent = base && player
    ? Math.abs(player.position.row - base.position.row) + Math.abs(player.position.column - base.position.column) <= 1
    : false
  const actionCheck = canPlayerPerformAction(state, playerId, ACTION_STAMINA_COSTS.heal)
  if (!actionCheck.ok) return { state, result: { ok: false, reason: actionCheck.reason ?? '體力不足。' } }
  if (!player || !base || !isBaseActive(base) || !hasInfirmary || !adjacent || (player.health >= player.maxHealth && player.innerPower >= player.maxInnerPower)) {
    return { state, result: { ok: false, reason: !player ? '目前無法行動。' : !base ? '據點不存在。' : !isBaseActive(base) ? '據點已停用，無法使用建築功能。' : !hasInfirmary ? '據點沒有醫療室。' : player.health >= player.maxHealth && player.innerPower >= player.maxInnerPower ? '生命值與內力都已恢復。' : '玩家未在據點旁。' } }
  }

  const healingMultiplier = getGlobalHealingMultiplier(state)
  const infirmaryLevel = infirmary ? getBuildingLevel(infirmary) : 1
  const healthRecovery = Math.round(rollInfirmaryRecovery(INFIRMARY_HEALTH_RECOVERY, infirmaryLevel, random) * healingMultiplier)
  const innerPowerRecovery = Math.round(rollInfirmaryRecovery(INFIRMARY_INNER_POWER_RECOVERY, infirmaryLevel, random) * healingMultiplier)
  console.info('[醫療室] 就醫結算', {
    playerId,
    baseId,
    infirmaryLevel,
    baseHealthRecovery: INFIRMARY_HEALTH_RECOVERY,
    baseInnerPowerRecovery: INFIRMARY_INNER_POWER_RECOVERY,
    healthRecovery,
    innerPowerRecovery,
    healingMultiplier,
    playerHealthBefore: player.health,
    playerMaxHealth: player.maxHealth,
    playerInnerPowerBefore: player.innerPower,
    playerMaxInnerPower: player.maxInnerPower,
  })
  return {
    state: {
      ...state,
      players: state.players.map((currentPlayer) => currentPlayer.id === playerId
        ? {
          ...currentPlayer,
          health: Math.min(currentPlayer.maxHealth, currentPlayer.health + healthRecovery),
          innerPower: Math.min(currentPlayer.maxInnerPower, currentPlayer.innerPower + innerPowerRecovery),
          stamina: Math.max(0, currentPlayer.stamina - ACTION_STAMINA_COSTS.heal),
        }
        : currentPlayer),
    },
    result: { ok: true, data: { healthRecovery: Math.min(player.maxHealth - player.health, healthRecovery), innerPowerRecovery: Math.min(player.maxInnerPower - player.innerPower, innerPowerRecovery), infirmaryLevel } },
  }
}

export function collectResourcePoint(state: GameState, playerId: string, resourcePointId: string): ExplorationActionResult {
  const player = getActionablePlayer(state, playerId)
  const resourcePoint = state.resourcePoints.find((point) => point.id === resourcePointId)
  const base = state.bases.find((candidate) => candidate.id === resourcePoint?.ownerBaseId)
  const staminaCost = Math.max(1, ACTION_STAMINA_COSTS.collectResource - (player ? getGatherStaminaCostReduction(player) : 0))
  const actionCheck = canPlayerPerformAction(state, playerId, staminaCost)
  if (!player) return { state, result: { ok: false, reason: '目前不是你的回合、回合已結束、玩家已死亡，或仍有未處理的結果。' } }
  if (!actionCheck.ok) return { state, result: { ok: false, reason: actionCheck.reason ?? '體力不足。' } }
  if (!resourcePoint || !base) return { state, result: { ok: false, reason: '資源點不存在或沒有所屬據點。' } }
  if (resourcePoint.active === false) return { state, result: { ok: false, reason: '資源點已失活，請先修復。' } }
  if (!isBaseActive(base)) return { state, result: { ok: false, reason: '所屬據點已停用，無法使用建築功能。' } }
  if (!isSameOrAdjacent(player.position, resourcePoint.position)) return { state, result: { ok: false, reason: '玩家需位於資源點自身格或周圍一格。' } }

  const target = getResourceCollectionTarget(state, player, resourcePointId)
  if (!target) return { state, result: { ok: false, reason: '資源點目前無法採集。' } }

  // 先計算建築加成的採集量，再套用民生政策與全局靈氣加成。
  const baseGain = getResourceCollectionMaterialGain(target.base, target.resourcePoint.materialIncome)
  const materialGain = getEffectiveMaterialGain(target.base, baseGain, state)
  const maxBuildingMaterials = getBaseMaxBuildingMaterials(target.base)
  if (target.base.buildingMaterials >= maxBuildingMaterials) {
    return { state, result: { ok: false, reason: '據點建料已達上限，請先使用或調度建料。' } }
  }
  // 靈植百草鑑：依機率雙倍產出。
  const yieldMultiplier = getGatherDoubleYieldChance(player) > 0 && defaultRandomSource() < getGatherDoubleYieldChance(player) ? 2 : 1
  const effectiveGain = materialGain * yieldMultiplier
  return {
    state: {
      ...state,
      players: state.players.map((currentPlayer) => currentPlayer.id === target.player.id
        ? spendPlayerStamina({ ...currentPlayer, prestige: currentPlayer.prestige + 5 }, staminaCost)
        : currentPlayer),
      bases: state.bases.map((currentBase) => currentBase.id === target.base.id
        ? { ...currentBase, buildingMaterials: Math.min(maxBuildingMaterials, currentBase.buildingMaterials + effectiveGain) }
        : currentBase),
      resourcePoints: state.resourcePoints,
    },
    result: { ok: true },
  }
}

export function collectResourcePointBatch(state: GameState, playerId: string, resourcePointId: string): ExplorationActionResult<ActionExecutionResult<CollectionBatchResult>> {
  const player = getActionablePlayer(state, playerId)
  const resourcePoint = state.resourcePoints.find((point) => point.id === resourcePointId)
  const base = state.bases.find((candidate) => candidate.id === resourcePoint?.ownerBaseId)
  const actionCheck = canPlayerPerformAction(state, playerId, 0)
  if (!actionCheck.ok) return { state, result: { ok: false, reason: actionCheck.reason ?? '目前無法行動。' } }
  if (!player) return { state, result: { ok: false, reason: '目前無法行動。' } }
  if (!resourcePoint || !base) return { state, result: { ok: false, reason: '資源點不存在或沒有所屬據點。' } }
  if (resourcePoint.active === false) return { state, result: { ok: false, reason: '資源點已失活，請先修復。' } }
  if (!isBaseActive(base)) return { state, result: { ok: false, reason: '所屬據點已停用，無法使用建築功能。' } }
  if (!isSameOrAdjacent(player.position, resourcePoint.position)) return { state, result: { ok: false, reason: '玩家需位於資源點自身格或周圍一格。' } }
  const target = getResourceCollectionTarget(state, player, resourcePointId)
  if (!target) return { state, result: { ok: false, reason: '資源點目前無法採集。' } }
  const materialGain = getEffectiveMaterialGain(target.base, getResourceCollectionMaterialGain(target.base, target.resourcePoint.materialIncome), state)
  const maxBuildingMaterials = getBaseMaxBuildingMaterials(target.base)
  const staminaCost = Math.max(1, ACTION_STAMINA_COSTS.collectResource - getGatherStaminaCostReduction(player))
  const count = Math.min(
    Math.floor(player.stamina / staminaCost),
    materialGain > 0 ? Math.floor((maxBuildingMaterials - target.base.buildingMaterials) / materialGain) : 0,
  )
  if (count <= 0) return { state, result: { ok: false, reason: target.base.buildingMaterials >= maxBuildingMaterials ? '據點建料已達上限，請先使用或調度建料。' : '體力不足。' } }
  return {
    state: {
      ...state,
      players: state.players.map((currentPlayer) => currentPlayer.id === playerId
        ? spendPlayerStamina({ ...currentPlayer, prestige: currentPlayer.prestige + 5 * count }, staminaCost * count)
        : currentPlayer),
      bases: state.bases.map((currentBase) => currentBase.id === target.base.id
        ? { ...currentBase, buildingMaterials: Math.min(maxBuildingMaterials, currentBase.buildingMaterials + materialGain * count) }
        : currentBase),
    },
    result: { ok: true, data: { count, materialGain: materialGain * count, prestige: 5 * count } },
  }
}

export function resolvePendingExplorationEvent(state: GameState, _playerId: string, eventId: string, choiceId: ExplorationEventChoice['id']): ExplorationActionResult {
  const event = state.pendingExplorationEvent
  if (!event) return { state, result: { ok: false, reason: '沒有待處理的探索事件。' } }
  if (event.id !== eventId) return { state, result: { ok: false, reason: '待處理的探索事件已改變。' } }
  // 回合結束隨機觸發的事件，目標玩家記錄在 pendingExplorationEventPlayerId
  // （觸發時 activePlayerId 可能已切換到下一名玩家）。
  const playerId = state.pendingExplorationEventPlayerId ?? _playerId
  const player = state.players.find((candidate) => candidate.id === playerId)
  if (!player) return { state, result: { ok: false, reason: '玩家不存在。' } }
  const choice = getEventChoiceDefinition(event, choiceId)
  if (!choice) return { state, result: { ok: false, reason: '事件選項不存在。' } }
  // 回合結束隨機觸發的事件不佔地圖格，因此跳過「玩家位於事件點」的條件，
  // 但仍檢查其他條件（例如金錢是否足夠）。
  const requirements = choice.requirements.filter((requirement) => requirement.type !== 'adjacent-to-event')
  const requirementsCheck = checkEventRequirements({ ...state, activePlayerId: player.id }, playerId, event, requirements)
  if (!requirementsCheck.allowed) {
    return { state, result: { ok: false, reason: requirementsCheck.reasons.join('、') || '未滿足事件條件。' } }
  }
  const nextPlayer = spendPlayerStamina(applyEventEffects({ ...player, turnEnded: player.turnEnded }, choice.effects), 0)
  const nextState = {
    ...state,
    players: state.players.map((candidate) => candidate.id === playerId ? nextPlayer : candidate),
    // 回合結束隨機觸發的探索事件已回答，清除待處理事件。
    // 該事件不佔用地圖格子，因此不補回任何地圖探索點。
    pendingExplorationEvent: null,
    pendingExplorationEventPlayerId: null,
  }
  // 套用狀態層級效果（如 spawn-creature 生產怪物）。
  const withStateEffects = applyEventStateEffects(nextState, choice.effects)
  return {
    state: incrementRunStat(withStateEffects, 'eventsResolved'),
    result: { ok: true },
  }
}

export function resolveExplorationEvent(state: GameState, playerId: string, eventId: string, choiceId: ExplorationEventChoice['id']): ExplorationActionResult {
  const actionCheck = canPlayerPerformAction(state, playerId, ACTION_STAMINA_COSTS.exploration)
  if (!actionCheck.ok) return { state, result: { ok: false, reason: actionCheck.reason ?? '體力不足。' } }
  const target = getExplorationEventTarget(state, getActionablePlayer(state, playerId), eventId)
  if (!target) return { state, result: { ok: false, reason: '事件不存在、距離不足，或目前無法行動。' } }
  const choice = getEventChoiceDefinition(target.event, choiceId)
  if (!choice) return { state, result: { ok: false, reason: '事件選項不存在。' } }
  const requirements = checkEventRequirements(state, playerId, target.event, choice.requirements)
  if (!requirements.allowed) return { state, result: { ok: false, reason: requirements.reasons.join('、') || '未滿足事件條件。' } }

  const nextPlayer = spendPlayerStamina(
    applyEventEffects({ ...target.player, turnEnded: target.player.turnEnded }, choice.effects),
    ACTION_STAMINA_COSTS.exploration,
  )
  const nextState = {
    ...state,
    players: state.players.map((player) => player.id === playerId ? nextPlayer : player),
    // 完成後移除事件點，再由事件池補充一個新的事件點。
    explorationEvents: (state.explorationEvents ?? []).filter((event) => event.id !== eventId),
  }

  // 套用狀態層級效果（如 spawn-creature 生產怪物）。
  const withStateEffects = applyEventStateEffects(nextState, choice.effects)

  // 記錄已解決事件 id，並檢查 on-events-resolved 觸發器（如「三處靈泉皆淨化 → 出現對話與 boss」）。
  const withResolvedRecord = withStateEffects.campaignState
    ? {
        ...withStateEffects,
        campaignState: {
          ...withStateEffects.campaignState,
          resolvedEventIds: [...new Set([...(withStateEffects.campaignState.resolvedEventIds ?? []), eventId])],
        },
      }
    : withStateEffects
  const withEventTriggers = executeTriggers(withResolvedRecord, { type: 'on-events-resolved', param: eventId })

  // 互動完成後推進 interact-object 目標並檢查勝利。
  const withObjectives = progressObjectives(withEventTriggers, { type: 'interact-object', targetId: eventId })
  return {
    state: incrementRunStat(checkVictory(replenishInteractionPoint(withObjectives, false, target.event)), 'eventsResolved'),
    result: { ok: true },
  }
}
