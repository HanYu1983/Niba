import type { GovernancePolicyId } from '../catalogs/governancePolicyCatalog';
import type {
  BaseState,
  GameState,
} from '../types'
import { canSwitchPolicy, getActivePolicyId } from './policyRules'
import { BUILDING_TYPES } from '../catalogs/buildingCatalog'
import { getBaseMaxBuildingMaterials, isBaseActive } from './baseRules'
import { assertPlayerTurn } from './actionCostRules'

/** 總管府建料調度的固定損耗比例。 */
export const MATERIAL_TRANSFER_LOSS_RATE = 0.1

export function hasRegionalManagement(base: BaseState): boolean {
  return isBaseActive(base) && base.buildings.some((building) => building.type === BUILDING_TYPES.REGIONAL_MANAGEMENT)
}

/** 檢查玩家是否位於有總管府的據點附近。 */
export function canOpenRegionalManagement(
  state: GameState,
  playerId: string,
): { ok: boolean; reason?: string; baseId?: string } {
  const player = state.players.find((candidate) => candidate.id === playerId)
  if (!player) {
    return { ok: false, reason: '玩家不存在。' }
  }

  const turnCheck = assertPlayerTurn(state, player)
  if (!turnCheck.ok) return turnCheck

  const base = state.bases.find((candidate) =>
    Math.abs(candidate.position.row - player.position.row) +
    Math.abs(candidate.position.column - player.position.column) <= 1 &&
    hasRegionalManagement(candidate),
  )

  if (!base) {
    return { ok: false, reason: '玩家附近沒有總管府。' }
  }

  return { ok: true, baseId: base.id }
}

/** 跨據點切換目標據點政策。目的據點不需要有總管府。 */
export function canSwitchRemotePolicy(
  state: GameState,
  playerId: string,
  targetBaseId: string,
  policyId: GovernancePolicyId,
): { ok: boolean; reason?: string } {
  const access = canOpenRegionalManagement(state, playerId)
  if (!access.ok) return access

  const player = state.players.find((candidate) => candidate.id === playerId)
  const targetBase = state.bases.find((candidate) => candidate.id === targetBaseId)
  if (!player || !targetBase) {
    return { ok: false, reason: '目標據點不存在。' }
  }
  if (!isBaseActive(targetBase)) return { ok: false, reason: '目標據點已停用。' }

  const validation = canSwitchPolicy(player, targetBase, policyId, state.round)
  if (!validation.ok) return validation

  return { ok: true }
}

/** 跨據點調度建料。 */
export function canTransferMaterials(
  state: GameState,
  playerId: string,
  sourceBaseId: string,
  targetBaseId: string,
  amount: number,
): { ok: boolean; reason?: string; deliveredAmount?: number } {
  const access = canOpenRegionalManagement(state, playerId)
  if (!access.ok) return access

  if (sourceBaseId === targetBaseId) {
    return { ok: false, reason: '來源與目的據點不能相同。' }
  }

  if (amount <= 0) {
    return { ok: false, reason: '調度數量必須大於 0。' }
  }

  const source = state.bases.find((candidate) => candidate.id === sourceBaseId)
  const target = state.bases.find((candidate) => candidate.id === targetBaseId)

  if (!source || !target) {
    return { ok: false, reason: '據點不存在。' }
  }
  if (!isBaseActive(source) || !isBaseActive(target)) return { ok: false, reason: '來源或目的據點已停用。' }

  if (source.buildingMaterials < amount) {
    return { ok: false, reason: `來源據點建料不足，目前有 ${source.buildingMaterials}。` }
  }

  const loss = Math.round(amount * MATERIAL_TRANSFER_LOSS_RATE)
  const deliveredAmount = amount - loss
  // 使用目標據點含倉庫加成的實際上限，而非來源據點的基礎上限。
  const targetCapacity = getBaseMaxBuildingMaterials(target)

  if (target.buildingMaterials + deliveredAmount > targetCapacity) {
    return { ok: false, reason: `目的據點建料將超過上限 ${targetCapacity}。` }
  }

  return { ok: true, deliveredAmount }
}

/** 提供總管府 modal 顯示所需的資料。 */
export function getRegionalManagementOverview(state: GameState, playerId: string) {
  const player = state.players.find((candidate) => candidate.id === playerId)

  return {
    player,
    bases: state.bases.map((base) => ({
      id: base.id,
      name: base.name,
      buildingMaterials: base.buildingMaterials,
      maxBuildingMaterials: base.maxBuildingMaterials,
      activePolicyId: getActivePolicyId(base),
      lastPolicySwitchRound: base.lastPolicySwitchRound,
      health: base.health,
      maxHealth: base.maxHealth,
    })),
  }
}
