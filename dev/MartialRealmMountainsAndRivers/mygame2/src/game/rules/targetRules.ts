import type {
  BaseState,
  CreatureNestState,
  CreatureState,
  ExplorationEventState,
  GameState,
  MapCell,
  PlayerState,
  ResourcePointState,
  AttackTargetType,
} from '../types'
import { isAdjacent, isSameOrAdjacent } from '../types'
import { getBlockedPositions, getMovementCostTo } from './movementRules'
import { canTraverseTerrain } from './playerDerivedRules'

export function getAttackTarget(
  state: GameState,
  player: PlayerState | null,
  targetType: AttackTargetType,
  targetId: string,
): { player: PlayerState; target: CreatureState | CreatureNestState } | null {
  const target = targetType === 'creature'
    ? state.creatures.find((currentCreature) => currentCreature.id === targetId)
    : state.creatureNests.find((nest) => nest.id === targetId)

  if (!player || !target || target.health <= 0 || !isAdjacent(player.position, target.position)) {
    return null
  }

  return { player, target }
}

export function getResourceCollectionTarget(
  state: GameState,
  player: PlayerState | null,
  resourcePointId: string,
): { player: PlayerState; resourcePoint: ResourcePointState; base: BaseState } | null {
  const resourcePoint = state.resourcePoints.find((currentResourcePoint) => currentResourcePoint.id === resourcePointId)
  const base = state.bases.find((currentBase) => currentBase.id === resourcePoint?.ownerBaseId)

  if (
    !player ||
    !resourcePoint ||
    !base ||
    !isSameOrAdjacent(player.position, resourcePoint.position)
  ) {
    return null
  }

  return { player, resourcePoint, base }
}

export function getExplorationEventTarget(
  state: GameState,
  player: PlayerState | null,
  eventId: string,
): { player: PlayerState; event: ExplorationEventState } | null {
  const event = (state.explorationEvents ?? []).find((candidate) => candidate.id === eventId)

  if (!player || !event || event.status !== 'available' || player.position.row !== event.position.row || player.position.column !== event.position.column) {
    return null
  }

  return { player, event }
}

export function getMovementTarget(
  state: GameState,
  player: PlayerState | null,
  playerId: string,
  row: number,
  column: number,
): { player: PlayerState; targetCell: MapCell; staminaCost: number } | null {
  const targetCellId = `${row}-${column}`
  const targetCell = state.map.cells.find((cell) => cell.row === row && cell.column === column)

  if (!player || !targetCell || !canTraverseTerrain(targetCell.terrain, player)) {
    return null
  }

  const staminaCost = getMovementCostTo(state.map, player, targetCellId, getBlockedPositions(state, playerId))

  if (staminaCost === null || staminaCost > player.stamina) {
    return null
  }

  return { player, targetCell, staminaCost }
}
