import { defenseStructureCatalog, type DefenseStructureType } from '../catalogs/defenseStructureCatalog'
import type { ActionOutcome, BaseState, DefenseStructureState, GameState, RuinState } from '../types'
import { isAdjacent, type Position } from '../types'
import { canPlayerPerformAction, spendPlayerStamina } from '../rules/actionCostRules'
import { getScoutCellIds } from '../rules/visibilityRules'
import { BASE_INFLUENCE_RANGE, getBaseMaxBuildingMaterials, isBaseActive } from '../rules/baseRules'
import { progressObjectives, checkVictory } from '../rules/campaignRules'
import { executeTriggers } from '../rules/triggerRules'

export type RuinActionResult = {
  state: GameState
  result: ActionOutcome
}

/** 修復廢墟的體力成本。 */
export const RUIN_RECONSTRUCT_STAMINA = 5
/** 修復廢墟的經驗值獎勵。 */
export const RUIN_RECONSTRUCT_EXPERIENCE = 10
/** 清除廢墟的經驗值獎勵。 */
export const RUIN_CLEAR_EXPERIENCE = 20
/** 清除位於活躍據點影響範圍內的廢墟時，據點獲得的建料。 */
export const RUIN_CLEAR_MATERIAL_BONUS = 20

/**
 * 找出離廢墟最近、且在影響範圍內且仍活躍的據點。
 * 該據點會因清除廢墟而獲得建料獎勵。
 */
export function findRuinBonusBase(state: GameState, position: Position, range: number): BaseState | undefined {
  let closest: BaseState | undefined
  let closestDistance = Infinity
  for (const base of state.bases) {
    if (!isBaseActive(base)) continue
    const distance = Math.abs(base.position.row - position.row) + Math.abs(base.position.column - position.column)
    if (distance <= range && distance < closestDistance) {
      closest = base
      closestDistance = distance
    }
  }
  return closest
}

export function clearRuin(state: GameState, playerId: string, ruinId: string): RuinActionResult {
  const player = state.players.find((candidate) => candidate.id === playerId)
  const ruin = (state.ruins ?? []).find((candidate) => candidate.id === ruinId)
  const actionCheck = canPlayerPerformAction(state, playerId, RUIN_RECONSTRUCT_STAMINA)

  if (!actionCheck.ok) return { state, result: { ok: false, reason: actionCheck.reason ?? '目前無法行動。' } }
  if (!player) return { state, result: { ok: false, reason: '玩家不存在。' } }
  if (!ruin) return { state, result: { ok: false, reason: '廢墟不存在。' } }
  if (ruin.status !== 'intact') return { state, result: { ok: false, reason: '此廢墟已修復。' } }
  if (!isAdjacent(player.position, ruin.position)) return { state, result: { ok: false, reason: '玩家需位於廢墟周遭一格。' } }

  // 廢墟落在活躍據點的影響範圍（視野）內時，該據點獲得建料獎勵。
  const bonusMaterial = state.bases.length > 0
    ? findRuinBonusBase(state, ruin.position, BASE_INFLUENCE_RANGE)
    : undefined

  return {
    state: executeTriggers({
      ...state,
      ruins: (state.ruins ?? []).filter((candidate) => candidate.id !== ruinId),
      bases: bonusMaterial
        ? state.bases.map((candidate) => candidate.id === bonusMaterial.id
          ? { ...candidate, buildingMaterials: Math.min(getBaseMaxBuildingMaterials(candidate), candidate.buildingMaterials + RUIN_CLEAR_MATERIAL_BONUS) }
          : candidate)
        : state.bases,
      players: state.players.map((candidate) => candidate.id === playerId
        ? spendPlayerStamina({ ...candidate, experience: candidate.experience + RUIN_CLEAR_EXPERIENCE }, RUIN_RECONSTRUCT_STAMINA)
        : candidate),
    }, { type: 'on-object-destroyed', param: ruinId }),
    result: { ok: true },
  }
}

/**
 * 修復廢墟為小型防禦設施。
 *
 * - 玩家需位於廢墟周邊一格。
 * - 消耗體力，不消耗建料、不增加聲望，獎勵經驗值。
 * - 廢墟轉變為對應的小型防禦設施，並改為不可行走（wall 地形）。
 * - 不結束玩家回合。
 */
export function reconstructRuin(
  state: GameState,
  playerId: string,
  ruinId: string,
  structureType: DefenseStructureType,
): RuinActionResult {
  const player = state.players.find((candidate) => candidate.id === playerId)
  const ruin = (state.ruins ?? []).find((candidate) => candidate.id === ruinId)
  const definition = defenseStructureCatalog.find((candidate) => candidate.type === structureType)
  const isSmallStructure = structureType === 'small-watchtower' || structureType === 'small-arrow-tower' || structureType === 'small-waystation'
  const actionCheck = canPlayerPerformAction(state, playerId, RUIN_RECONSTRUCT_STAMINA)

  if (!actionCheck.ok) return { state, result: { ok: false, reason: actionCheck.reason ?? '目前無法行動。' } }
  if (!player) return { state, result: { ok: false, reason: '玩家不存在。' } }
  if (!ruin) return { state, result: { ok: false, reason: '廢墟不存在。' } }
  if (ruin.status !== 'intact') return { state, result: { ok: false, reason: '此廢墟已修復。' } }
  if (!definition || !isSmallStructure) return { state, result: { ok: false, reason: '未知的小型設施。' } }
  if (!isAdjacent(player.position, ruin.position)) return { state, result: { ok: false, reason: '玩家需位於廢墟周遭一格。' } }

  const structure: DefenseStructureState = {
    ...definition,
    id: `${ruin.id}-structure`,
    position: ruin.position,
    ownerBaseId: '',
    // 保留來源廢墟的村落名，讓設施名稱下方可顯示「源自 X 村」
    originName: ruin.name,
    health: definition.maxHealth,
  }

  const nextRuins: RuinState[] = (state.ruins ?? []).map((candidate) =>
    candidate.id === ruinId ? { ...candidate, status: 'reconstructed' as const } : candidate,
  )

  // 廢墟修復的小型設施所在格立即視為已探索；提供視野的設施（瞭望臺/箭塔）另納入其視野範圍，
  // 確保即使不在玩家目前視野內，下一步仍會顯示設施 marker（避免「修復後看不到」的霧中怪異現象）。
  const cellId = `${ruin.position.row}-${ruin.position.column}`
  const structureVisionRange = structure.providesVision ? 1 : 0
  const exploredIds = [cellId, ...getScoutCellIds(state.map, ruin.position, structureVisionRange)]
  const existingExploredCellIds = (state.visibility ?? { exploredCellIds: [], mode: 'fog' as const }).exploredCellIds ?? []

  const nextState: GameState = {
    ...state,
    ruins: nextRuins,
    defenseStructures: [...(state.defenseStructures ?? []), structure],
    visibility: {
      ...(state.visibility ?? { exploredCellIds: [], mode: 'fog' as const }),
      exploredCellIds: [...new Set([...existingExploredCellIds, ...exploredIds])],
    },
    players: state.players.map((candidate) => candidate.id === playerId
      ? spendPlayerStamina({ ...candidate, experience: candidate.experience + RUIN_RECONSTRUCT_EXPERIENCE }, RUIN_RECONSTRUCT_STAMINA)
      : candidate),
  }

  // 劇情模式下，更新 reconstruct-ruin 目標進度並檢查勝利。
  const withProgress = nextState.campaignState
    ? checkVictory(progressObjectives(nextState, { type: 'reconstruct-ruin', targetId: ruinId }))
    : nextState

  return {
    state: withProgress,
    result: { ok: true },
  }
}
