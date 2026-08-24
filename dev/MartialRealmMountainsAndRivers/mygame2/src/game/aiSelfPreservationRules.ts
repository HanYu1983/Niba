import type { GameState, PlayerState, Position } from './types'
import { isAdjacent } from './types'
import { manhattanDistance } from './ai/perception/distance'
import { collectReachableCells } from './ai/perception/reachablePositions'
import { getHostileActorPosition, listHostileActors } from './ai/perception/targetDiscovery'
import type { AiDefenseAction } from './aiDefenseRules'

const EMERGENCY_RETREAT_PERCENT = 10
const SURROUNDED_ENEMY_COUNT = 2

function enemyPositions(state: GameState): Position[] {
  return listHostileActors(state).map((actor) => getHostileActorPosition(actor))
}

function getEscapePosition(state: GameState, player: PlayerState): Position | null {
  const enemies = enemyPositions(state)
  const candidates = collectReachableCells(state, player)
    .filter((cell) => cell.cost > 0)
    .map((cell) => ({
      position: cell.position,
      cost: cell.cost,
      nearestEnemyDistance: enemies.length > 0 ? Math.min(...enemies.map((enemy) => manhattanDistance(cell.position, enemy))) : Infinity,
    }))
    .sort((first, second) => second.nearestEnemyDistance - first.nearestEnemyDistance || first.cost - second.cost)

  return candidates[0]?.position ?? null
}

export function chooseSelfPreservationAction(state: GameState, playerId: string, retreatHealthPercent: number): AiDefenseAction | null {
  const player = state.players.find((candidate) => candidate.id === playerId)
  if (!player || !player.isAI || player.health <= 0) return { type: 'end-turn', reason: 'no-legal-action' }

  const healthPercent = player.maxHealth > 0 ? (player.health / player.maxHealth) * 100 : 0
  const adjacentEnemyCount = enemyPositions(state).filter((position) => isAdjacent(player.position, position)).length
  const emergencyHealthThreshold = Math.max(EMERGENCY_RETREAT_PERCENT, retreatHealthPercent)
  const mustRetreat = healthPercent <= emergencyHealthThreshold || adjacentEnemyCount >= SURROUNDED_ENEMY_COUNT
  if (!mustRetreat) return null

  const escapePosition = getEscapePosition(state, player)
  if (escapePosition) return { type: 'move', position: escapePosition, reason: 'self-preservation' }
  return { type: 'hold-position', reason: 'retreat' }
}

export { EMERGENCY_RETREAT_PERCENT, SURROUNDED_ENEMY_COUNT }
