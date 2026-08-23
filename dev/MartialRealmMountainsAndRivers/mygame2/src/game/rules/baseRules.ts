import type { BaseState, GameState, PlayerState } from '../types'
import { BUILDING_TYPES } from '../catalogs/buildingCatalog'
import { getMaxHealth } from './playerStatsRules'

export const BASE_INFLUENCE_RANGE = 5

/** 舊存檔沒有 active 欄位時視為仍在運作；新狀態會明確寫入 false。 */
export function isBaseActive(base: BaseState): boolean {
  return base.active !== false && base.health > 0
}

export function getWallHealthRecovery(base: BaseState): number {
  if (!isBaseActive(base)) return 0
  return base.buildings
    .filter((building) => building.type === BUILDING_TYPES.WALL)
    .reduce((total, building) => total + (building.level ?? 1), 0)
}

/** 每回合防衛營回復範圍內友軍的血量（依 healthBonus 加總）。 */
export function getBarracksRecovery(base: BaseState): number {
  if (!isBaseActive(base)) return 0
  return base.buildings
    .filter((building) => building.type === BUILDING_TYPES.BARRACKS)
    .reduce((total, building) => total + (building.healthBonus ?? 0), 0)
}

export function isPlayerWithinBaseVision(base: BaseState, player: PlayerState): boolean {
  const distance = Math.abs(base.position.row - player.position.row) + Math.abs(base.position.column - player.position.column)
  return distance <= BASE_INFLUENCE_RANGE
}

export function getBaseMaxBuildingMaterials(base: BaseState): number {
  if (!isBaseActive(base)) return base.maxBuildingMaterials
  return base.maxBuildingMaterials + base.buildings.reduce(
    (total, building) => total + (building.materialCapacityBonus ?? 0),
    0,
  )
}

export function getResourceCollectionMaterialGain(base: BaseState, materialIncome: number): number {
  if (!isBaseActive(base)) return 0
  return materialIncome + base.buildings.reduce(
    (total, building) => total + (building.collectionBonus ?? 0),
    0,
  )
}

export function getBaseMaxHealth(base: BaseState): number {
  if (!isBaseActive(base)) return base.maxHealth
  return base.maxHealth + base.buildings.reduce(
    (total, building) => total + (building.type === BUILDING_TYPES.WALL ? (building.healthBonus ?? 0) : 0),
    0,
  )
}

/** 據點帶動的玩家最大生命加成。目前無；防衛營不再提升玩家最大生命（改為每回合回復氣血）。 */
export function getBaseHealthBonus(_state: GameState, _player: PlayerState): number {
  return 0
}

export function getPlayerMaxHealth(state: GameState, player: PlayerState): number {
  return getMaxHealth(player.attributes) + getBaseHealthBonus(state, player)
}

export function applyBaseHealthBonuses(state: GameState): GameState {
  return {
    ...state,
    players: state.players.map((player) => {
      const maxHealth = getPlayerMaxHealth(state, player)
      return {
        ...player,
        maxHealth,
        health: Math.min(player.health, maxHealth),
      }
    }),
  }
}
