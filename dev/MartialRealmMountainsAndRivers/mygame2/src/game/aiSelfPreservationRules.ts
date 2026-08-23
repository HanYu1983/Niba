import type { GameState, PlayerState, Position } from './types'
import { isAdjacent, isSamePosition } from './types'
import { getBlockedPositions, getMovementCostTo } from './rules/movementRules'
import type { AiDefenseAction } from './aiDefenseRules'

const EMERGENCY_RETREAT_PERCENT = 10
const SURROUNDED_ENEMY_COUNT = 2

function distance(first: Position, second: Position): number {
  return Math.abs(first.row - second.row) + Math.abs(first.column - second.column)
}

function enemyPositions(state: GameState): Position[] {
  return [
    ...state.creatures.filter((creature) => creature.health > 0).map((creature) => creature.position),
    ...state.creatureNests.filter((nest) => nest.health > 0).map((nest) => nest.position),
  ]
}

function getEscapePosition(state: GameState, player: PlayerState): Position | null {
  const enemies = enemyPositions(state)
  const blocked = getBlockedPositions(state, player.id)
  const candidates = state.map.cells
    .filter((cell) => cell.terrain !== 'wall')
    .filter((cell) => !blocked.some((position) => isSamePosition(position, cell)))
    .map((cell) => {
      const position = { row: cell.row, column: cell.column }
      return {
        position,
        cost: getMovementCostTo(state.map, player, cell.id, blocked),
        nearestEnemyDistance: enemies.length > 0 ? Math.min(...enemies.map((enemy) => distance(position, enemy))) : Infinity,
      }
    })
    .filter((candidate): candidate is { position: Position; cost: number; nearestEnemyDistance: number } => candidate.cost !== null && candidate.cost > 0 && candidate.cost <= player.stamina)
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
