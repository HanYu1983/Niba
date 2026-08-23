import type { AiOrder, GameState, PlayerState, Position } from './types'
import { isAdjacent, isSamePosition } from './types'
import { getBlockedPositions, getMovementCostTo } from './rules/movementRules'
import type { AiDefenseAction, AiThreatAssessment } from './aiDefenseRules'

function distance(first: Position, second: Position): number {
  return Math.abs(first.row - second.row) + Math.abs(first.column - second.column)
}

function nearbyThreats(state: GameState, target: PlayerState): AiThreatAssessment[] {
  return [
    ...state.creatures.filter((creature) => creature.health > 0).map((creature) => ({
      targetId: creature.id,
      targetType: 'creature' as const,
      position: creature.position,
      distanceToBase: distance(creature.position, target.position),
      distanceToAi: distance(creature.position, target.position),
      threatScore: isAdjacent(creature.position, target.position) ? 1000 : Math.max(0, 80 - distance(creature.position, target.position) * 10),
      directlyAttackingBase: isAdjacent(creature.position, target.position),
    })),
    ...state.creatureNests.filter((nest) => nest.health > 0).map((nest) => ({
      targetId: nest.id,
      targetType: 'nest' as const,
      position: nest.position,
      distanceToBase: distance(nest.position, target.position),
      distanceToAi: distance(nest.position, target.position),
      threatScore: isAdjacent(nest.position, target.position) ? 900 : Math.max(0, 60 - distance(nest.position, target.position) * 8),
      directlyAttackingBase: isAdjacent(nest.position, target.position),
    })),
  ].filter((threat) => threat.distanceToAi <= 4).sort((first, second) => second.threatScore - first.threatScore)
}

function adjacentAiThreats(state: GameState, aiPlayer: PlayerState): AiThreatAssessment[] {
  return [
    ...state.creatures.filter((creature) => creature.health > 0).map((creature) => ({
      targetId: creature.id,
      targetType: 'creature' as const,
      position: creature.position,
      distanceToBase: distance(creature.position, aiPlayer.position),
      distanceToAi: distance(creature.position, aiPlayer.position),
      threatScore: 1000,
      directlyAttackingBase: false,
    })),
    ...state.creatureNests.filter((nest) => nest.health > 0).map((nest) => ({
      targetId: nest.id,
      targetType: 'nest' as const,
      position: nest.position,
      distanceToBase: distance(nest.position, aiPlayer.position),
      distanceToAi: distance(nest.position, aiPlayer.position),
      threatScore: 900,
      directlyAttackingBase: false,
    })),
  ]
    .filter((threat) => threat.distanceToAi === 1)
    .sort((first, second) => second.threatScore - first.threatScore)
}

export function chooseSupportAction(
  state: GameState,
  aiPlayerId: string,
  order: Extract<AiOrder, { type: 'support-player' }>,
): AiDefenseAction {
  const aiPlayer = state.players.find((player) => player.id === aiPlayerId)
  const targetPlayer = state.players.find((player) => player.id === order.playerId)
  if (!aiPlayer || !targetPlayer || order.status !== 'active') return { type: 'end-turn', reason: 'command-paused' }
  if (targetPlayer.health <= 0) return { type: 'end-turn', reason: 'command-paused' }
  if (aiPlayer.health <= 0 || aiPlayer.stamina <= 0) return { type: 'hold-position', reason: aiPlayer.health <= 0 ? 'retreat' : 'insufficient-stamina' }

  const threats = nearbyThreats(state, targetPlayer)
  const adjacentThreat = adjacentAiThreats(state, aiPlayer)[0] ?? threats.find((threat) => isAdjacent(aiPlayer.position, threat.position))
  if (adjacentThreat) return { type: 'attack', targetId: adjacentThreat.targetId, targetType: adjacentThreat.targetType }

  const targetDistance = distance(aiPlayer.position, targetPlayer.position)
  if (targetDistance > order.maxDistance) {
    const blocked = getBlockedPositions(state, aiPlayerId)
    const candidates = state.map.cells
      .filter((cell) => cell.terrain !== 'wall')
      .filter((cell) => !blocked.some((position) => isSamePosition(position, cell)))
      .map((cell) => ({
        position: { row: cell.row, column: cell.column },
        cost: getMovementCostTo(state.map, aiPlayer, cell.id, blocked),
        targetDistance: distance(cell, targetPlayer.position),
      }))
      .filter((candidate): candidate is { position: Position; cost: number; targetDistance: number } => candidate.cost !== null && candidate.cost <= aiPlayer.stamina)
      .sort((first, second) => first.targetDistance - second.targetDistance || first.cost - second.cost)
    const destination = candidates[0]
    if (destination) return { type: 'move', position: destination.position, reason: 'intercept-threat' }
  }

  return threats.length > 0 ? { type: 'hold-position', reason: 'no-threat' } : { type: 'hold-position', reason: 'no-threat' }
}
