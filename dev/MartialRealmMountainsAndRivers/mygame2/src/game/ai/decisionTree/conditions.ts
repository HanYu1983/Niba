import type { GameState, PlayerState, Position } from '../../types'
import { isAdjacent } from '../../types'
import type { HostileActor } from '../perception/targetDiscovery'
import { listHostileActors } from '../perception/targetDiscovery'
import { getPlayerVisibleCellIds } from '../../rules/visibilityRules'
import { collectReachableCells } from '../perception/reachablePositions'

// ─── 保命條件 ──────────────────────────────────────

export function isHealthCritical(player: PlayerState): boolean {
  return player.health <= player.maxHealth * 0.2
}

export function isHealthLow(player: PlayerState): boolean {
  return player.health <= player.maxHealth * 0.4
}

export function isExhausted(player: PlayerState): boolean {
  return player.stamina <= 2
}

export function getVisibleCreatures(state: GameState, playerId: string): HostileActor[] {
  const visibleCellIds = getPlayerVisibleCellIds(state, playerId)
  return listHostileActors(state).filter((a) => {
    const pos = a.sourceType === 'creature' ? a.creature.position : a.nest.position
    return state.map.cells.some((c) => c.row === pos.row && c.column === pos.column && visibleCellIds.has(c.id))
  })
}

export function findAdjacentCreature(state: GameState, player: PlayerState): HostileActor | null {
  const visible = getVisibleCreatures(state, player.id)
  return visible.find((a) => {
    const pos = a.sourceType === 'creature' ? a.creature.position : a.nest.position
    return isAdjacent(player.position, pos)
  }) ?? null
}

// ─── 道具條件 ──────────────────────────────────────

export function findAdjacentItem(state: GameState, player: PlayerState) {
  return state.itemPoints.find((item) => isAdjacent(player.position, item.position)) ?? null
}

// ─── 資源條件 ──────────────────────────────────────

export function findAdjacentResourcePoint(state: GameState, player: PlayerState) {
  return state.resourcePoints.find((rp) => isAdjacent(player.position, rp.position)) ?? null
}

export function needsBuildingMaterials(state: GameState, playerId: string): boolean {
  const base = getVisibleOwnedBase(state, playerId)
  if (!base) return false
  return base.buildingMaterials < base.maxBuildingMaterials * 0.7
}

// ─── 建造條件 ──────────────────────────────────────

/** 所有存活據點（未限制視野；供「無據點可用」的最終情境判斷）。 */
export function getOwnedBase(state: GameState, _playerId: string) {
  return state.bases.find((b) => b.active !== false && b.health > 0) ?? null
}

/**
 * 視野內可見的存活據點。
 *
 * 決策樹的建造／採集／回據點邏輯必須以「玩家視野內可見的據點」為判斷依據，
 * 而非地圖上所有據點（不可見據點等同未知，不應據以規劃動作）。
 *
 * 開通的據點（discovered）會永久提供其周邊視野（見 visibilityRules），
 * 因此其所在格必然在可見集合內——只需以 getPlayerVisibleCellIds 判斷即可。
 */
export function getVisibleOwnedBase(state: GameState, playerId: string) {
  const visible = getPlayerVisibleCellIds(state, playerId)
  const base = getOwnedBase(state, playerId)
  if (!base) return null
  const cellKey = `${base.position.row}-${base.position.column}`
  if (!visible.has(cellKey)) return null
  return base
}

// ─── 探索條件 ──────────────────────────────────────

export function findUnexploredNearby(state: GameState, player: PlayerState): Position | null {
  const reachable = collectReachableCells(state, player)
  const explored = getPlayerVisibleCellIds(state, player.id)
  const unexplored = reachable.filter((c) => !explored.has(c.cellId))
  if (unexplored.length === 0) return null
  return unexplored[0].position
}

// ─── 距離工具 ──────────────────────────────────────

export function manhattan(a: Position, b: Position): number {
  return Math.abs(a.row - b.row) + Math.abs(a.column - b.column)
}
