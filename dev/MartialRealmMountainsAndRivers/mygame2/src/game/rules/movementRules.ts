import type { GameState, MapState, PlayerState, Position } from '../types'
import { getAdjacentPositions } from '../types'
import { canTraverseTerrain, getTerrainStaminaCost } from './playerDerivedRules'

/**
 * 統一取得「會擋住移動」的格子位置，供玩家移動、AI 決策共用。
 *
 * 阻擋移動的物件：其他玩家、生物、據點、未清除的廢墟、門派據點。
 * 資源點、物品點、探索事件等可通行（可走上去互動/採集）。
 * 廢墟清除後（自 state.ruins 移除）自動可通行。
 */
export type BlockedPositionOptions = {
  /** 生成物件時，互動點也視為已佔用；玩家移動仍維持可走上互動點。 */
  includeInteractionPoints?: boolean
}

export function getBlockedPositions(state: GameState, playerId: string, options: BlockedPositionOptions = {}): Position[] {
  const positions = [
    ...state.players.filter((player) => player.id !== playerId).map((player) => player.position),
    ...state.creatures.map((creature) => creature.position),
    ...state.bases.map((base) => base.position),
    ...(state.ruins ?? []).filter((ruin) => ruin.status === 'intact').map((ruin) => ruin.position),
    ...(state.sectGates ?? []).map((gate) => gate.position),
    ...(state.defenseStructures ?? []).map((structure) => structure.position),
    ...(options.includeInteractionPoints ? [
      ...state.resourcePoints.map((point) => point.position),
      ...state.itemPoints.map((point) => point.position),
      ...(state.explorationEvents ?? []).map((event) => event.position),
      ...(state.traps ?? []).map((trap) => trap.position),
    ] : []),
  ]
  return positions.filter((position): position is Position => Boolean(
    position && Number.isFinite(position.row) && Number.isFinite(position.column),
  ))
}

export function buildMovementCostMap(
  map: MapState,
  player: PlayerState,
  blockedPositions: Position[] = [],
): Map<string, number> {
  const cellsByPosition = new Map(
    map.cells.map((cell) => [`${cell.row}-${cell.column}`, cell]),
  )
  const blockedPositionKeys = new Set(
    blockedPositions
      .filter((position): position is Position => Boolean(
        position && Number.isFinite(position.row) && Number.isFinite(position.column),
      ))
      .map((position) => `${position.row}-${position.column}`),
  )
  const costs = new Map<string, number>()
  const queue: Array<{ row: number; column: number; cost: number }> = [
    { ...player.position, cost: 0 },
  ]
  let queueHead = 0

  costs.set(`${player.position.row}-${player.position.column}`, 0)

  while (queueHead < queue.length) {
    const current = queue[queueHead++]

    for (const adjacentPosition of getAdjacentPositions(current)) {
      const cell = cellsByPosition.get(`${adjacentPosition.row}-${adjacentPosition.column}`)

      if (
        !cell ||
        !canTraverseTerrain(cell.terrain, player) ||
        blockedPositionKeys.has(`${adjacentPosition.row}-${adjacentPosition.column}`)
      ) {
        continue
      }

      const nextCost = current.cost + getTerrainStaminaCost(cell.terrain, player)
      const previousCost = costs.get(cell.id)

      if (previousCost !== undefined && previousCost <= nextCost) {
        continue
      }

      costs.set(cell.id, nextCost)
      queue.push({ row: cell.row, column: cell.column, cost: nextCost })
    }
  }

  return costs
}

export function getMovementCostTo(
  map: MapState,
  player: PlayerState,
  targetId: string,
  blockedPositions: Position[] = [],
): number | null {
  return buildMovementCostMap(map, player, blockedPositions).get(targetId) ?? null
}

export function getReachableCellIds(
  map: MapState,
  player: PlayerState,
  blockedPositions: Position[] = [],
): Set<string> {
  const costs = buildMovementCostMap(map, player, blockedPositions)
  const originId = `${player.position.row}-${player.position.column}`

  return new Set(
    [...costs.entries()]
      .filter(([cellId, cost]) => cellId !== originId && cost <= player.stamina)
      .map(([cellId]) => cellId),
  )
}
