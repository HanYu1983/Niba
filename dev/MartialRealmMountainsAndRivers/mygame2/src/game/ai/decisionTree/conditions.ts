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

export function needsBuildingMaterials(state: GameState, _playerId: string): boolean {
  const base = state.bases.find((b) => b.active !== false && b.health > 0)
  if (!base) return false
  return base.buildingMaterials < base.maxBuildingMaterials * 0.7
}

// ─── 建造條件 ──────────────────────────────────────

export function getOwnedBase(state: GameState, _playerId: string) {
  return state.bases.find((b) => b.active !== false && b.health > 0) ?? null
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
