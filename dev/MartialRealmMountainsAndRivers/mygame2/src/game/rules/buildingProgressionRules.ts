import { BUILDING_TYPES, buildingCatalog, type BaseBuilding } from '../catalogs/buildingCatalog'
import type { BaseState, PlayerState } from '../types'
import { getGovernanceRank, getMaxBuildingLevelForPlayer } from './governanceRules'
import { getBuildingMaterialCostReduction } from './playerDerivedRules'

/** 固定功能建築：建造後提供完整功能，不進入一般等級升級流程。 */
export const FIXED_FUNCTION_BUILDING_TYPES: string[] = [
  BUILDING_TYPES.WAYSTATION,
  BUILDING_TYPES.EXCHANGE,
  BUILDING_TYPES.REGIONAL_MANAGEMENT,
]

export const DEFAULT_BUILDING_LEVEL = 1

/** 一般建築升級所需的基礎建料成本。 */
export const BUILDING_UPGRADE_COST_PER_LEVEL = 40

/** 告示牌任務每等級提供的金錢獎勵。 */
export const MISSION_MONEY_PER_LEVEL = 10
/** 告示牌任務每等級提供的聲望獎勵。 */
export const MISSION_PRESTIGE_PER_LEVEL = 5

export type MissionReward = {
  money: number
  prestige: number
}

/** 依告示牌等級計算任務獎勵（單一真實來源）。 */
export function getMissionReward(boardLevel: number): MissionReward {
  return {
    money: MISSION_MONEY_PER_LEVEL * boardLevel,
    prestige: MISSION_PRESTIGE_PER_LEVEL * boardLevel,
  }
}

export function getBuildingLevel(building: BaseBuilding): number {
  return building.level ?? DEFAULT_BUILDING_LEVEL
}

export function isFixedFunctionBuilding(buildingType: string): boolean {
  return FIXED_FUNCTION_BUILDING_TYPES.includes(buildingType)
}

export function canUpgradeBuildingType(buildingType: string): boolean {
  return !isFixedFunctionBuilding(buildingType)
}

export function getBuildingUpgradeCost(building: BaseBuilding): number {
  return BUILDING_UPGRADE_COST_PER_LEVEL * getBuildingLevel(building)
}

/** 依玩家自帶「建築材料消耗減免」Buff 計算升級成本（天工開物）。 */
export function getEffectiveBuildingUpgradeCost(building: BaseBuilding, player: PlayerState): number {
  const baseCost = getBuildingUpgradeCost(building)
  const reduction = getBuildingMaterialCostReduction(player)
  return reduction > 0 ? Math.max(1, Math.floor(baseCost * (1 - reduction))) : baseCost
}

/** 判斷玩家官階是否足以解鎖指定建築類型。 */
export function canPlayerBuildBuildingType(player: PlayerState, buildingType: string): boolean {
  const definition = buildingCatalog.find((building) => building.type === buildingType)
  if (!definition) return false

  const requiredRank = definition.requiredRank ?? 1
  return getGovernanceRank(player.prestige).rank >= requiredRank
}

export function getBaseBuilding(base: BaseState, buildingId: string): BaseBuilding | undefined {
  return base.buildings.find((building) => building.id === buildingId)
}

export function getPlayerBuildingCap(player: PlayerState): number {
  return getMaxBuildingLevelForPlayer(player)
}

export function getBuildingUpgradeResult(
  base: BaseState,
  building: BaseBuilding,
  player: PlayerState,
): { ok: boolean; reason?: string; nextLevel?: number; cost?: number } {
  if (!canUpgradeBuildingType(building.type)) {
    return { ok: false, reason: '此建築為固定功能建築，無法升級。' }
  }

  const currentLevel = getBuildingLevel(building)
  const cap = getPlayerBuildingCap(player)

  if (currentLevel >= cap) {
    return { ok: false, reason: `已達官階上限 Lv.${cap}。` }
  }

  const cost = getEffectiveBuildingUpgradeCost(building, player)

  if (base.buildingMaterials < cost) {
    return { ok: false, reason: `建料不足，需要 ${cost} 建料。` }
  }

  return { ok: true, nextLevel: currentLevel + 1, cost }
}

export function upgradeBuildingInBase(
  base: BaseState,
  buildingId: string,
  player: PlayerState,
): BaseState {
  const building = getBaseBuilding(base, buildingId)
  if (!building) return base

  const result = getBuildingUpgradeResult(base, building, player)
  if (!result.ok) return base

  return {
    ...base,
    buildings: base.buildings.map((candidate) =>
      candidate.id === buildingId
        ? { ...candidate, level: result.nextLevel }
        : candidate,
    ),
    buildingMaterials: base.buildingMaterials - (result.cost ?? 0),
  }
}
