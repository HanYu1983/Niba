import type { AiOrder, GameState, PlayerState } from './types'
import { isAdjacent } from './types'
import { manhattanDistance } from './ai/perception/distance'
import { collectReachableCells } from './ai/perception/reachablePositions'
import { getHostileActorId, getHostileActorPosition, listHostileActors } from './ai/perception/targetDiscovery'
import type { AiDefenseAction, AiThreatAssessment } from './aiDefenseRules'

function nearbyThreats(state: GameState, target: PlayerState): AiThreatAssessment[] {
  return listHostileActors(state)
    .map((actor) => {
      const position = getHostileActorPosition(actor)
      const distanceToTarget = manhattanDistance(position, target.position)
      return {
        targetId: getHostileActorId(actor),
        targetType: actor.sourceType,
        position,
        distanceToBase: distanceToTarget,
        distanceToAi: distanceToTarget,
        threatScore: actor.sourceType === 'creature'
          ? isAdjacent(position, target.position) ? 1000 : Math.max(0, 80 - distanceToTarget * 10)
          : isAdjacent(position, target.position) ? 900 : Math.max(0, 60 - distanceToTarget * 8),
        directlyAttackingBase: isAdjacent(position, target.position),
      }
    })
    .filter((threat) => threat.distanceToAi <= 4)
    .sort((first, second) => second.threatScore - first.threatScore)
}

function adjacentAiThreats(state: GameState, aiPlayer: PlayerState): AiThreatAssessment[] {
  return listHostileActors(state)
    .map((actor) => {
      const position = getHostileActorPosition(actor)
      const distanceToAi = manhattanDistance(position, aiPlayer.position)
      return {
        targetId: getHostileActorId(actor),
        targetType: actor.sourceType,
        position,
        distanceToBase: distanceToAi,
        distanceToAi,
        threatScore: actor.sourceType === 'creature' ? 1000 : 900,
        directlyAttackingBase: false,
      }
    })
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

  const targetDistance = manhattanDistance(aiPlayer.position, targetPlayer.position)
  if (targetDistance > order.maxDistance) {
    const destination = collectReachableCells(state, aiPlayer)
      .map((cell) => ({ ...cell, targetDistance: manhattanDistance(cell.position, targetPlayer.position) }))
      .sort((first, second) => first.targetDistance - second.targetDistance || first.cost - second.cost)[0]
    if (destination) return { type: 'move', position: destination.position, reason: 'intercept-threat' }
  }

  return threats.length > 0 ? { type: 'hold-position', reason: 'no-threat' } : { type: 'hold-position', reason: 'no-threat' }
}
