import type { AiOrder, BaseState, CreatureState, GameState, Position } from './types'
import { isAdjacent } from './types'
import { manhattanDistance } from './ai/perception/distance'
import { collectReachableCells } from './ai/perception/reachablePositions'
import { getHostileActorPosition, listHostileActors } from './ai/perception/targetDiscovery'

export type AiDefenseAction =
  | { type: 'attack'; targetId: string; targetType: 'creature' | 'nest' }
  | { type: 'move'; position: Position; reason: 'return-to-defense-radius' | 'intercept-threat' | 'self-preservation' }
  | { type: 'hold-position'; reason: 'no-threat' | 'insufficient-stamina' | 'retreat' }
  | { type: 'end-turn'; reason: 'no-legal-action' | 'command-paused' }

export type AiThreatAssessment = {
  targetId: string
  targetType: 'creature' | 'nest'
  position: Position
  distanceToBase: number
  distanceToAi: number
  threatScore: number
  directlyAttackingBase: boolean
}

function getOrderBase(state: GameState, order: Extract<AiOrder, { type: 'protect-base' }>): BaseState | null {
  return state.bases.find((base) => base.id === order.baseId) ?? null
}

function getThreatTargets(state: GameState, base: BaseState): Array<{ target: CreatureState | GameState['creatureNests'][number]; targetType: 'creature' | 'nest' }> {
  return listHostileActors(state)
    .filter((actor) => manhattanDistance(getHostileActorPosition(actor), base.position) <= 12)
    .map((actor) => actor.sourceType === 'creature'
      ? { target: actor.creature, targetType: 'creature' as const }
      : { target: actor.nest, targetType: 'nest' as const })
}

export function assessBaseThreats(state: GameState, baseId: string, aiPlayerId: string): AiThreatAssessment[] {
  const base = state.bases.find((candidate) => candidate.id === baseId)
  const aiPlayer = state.players.find((player) => player.id === aiPlayerId)
  if (!base || !aiPlayer) return []

  return getThreatTargets(state, base)
    .map(({ target, targetType }) => {
      const distanceToBase = manhattanDistance(target.position, base.position)
      const distanceToAi = manhattanDistance(target.position, aiPlayer.position)
      const directlyAttackingBase = isAdjacent(target.position, base.position)
      return {
        targetId: target.id,
        targetType,
        position: target.position,
        distanceToBase,
        distanceToAi,
        directlyAttackingBase,
        threatScore: (directlyAttackingBase ? 1000 : 0) + Math.max(0, 120 - distanceToBase * 10) + Math.max(0, 30 - distanceToAi),
      }
    })
    .sort((first, second) => second.threatScore - first.threatScore)
}

function getDefenseRadiusCells(state: GameState, aiPlayer: GameState['players'][number], base: BaseState, radius: number) {
  return collectReachableCells(state, aiPlayer)
    .filter((cell) => manhattanDistance(cell.position, base.position) <= radius)
}

export function chooseDefenseAction(state: GameState, aiPlayerId: string, order: Extract<AiOrder, { type: 'protect-base' }>): AiDefenseAction {
  const aiPlayer = state.players.find((player) => player.id === aiPlayerId)
  const base = getOrderBase(state, order)
  if (!aiPlayer || !base || order.status !== 'active') return { type: 'end-turn', reason: 'command-paused' }
  if (aiPlayer.health <= 0 || aiPlayer.stamina <= 0) return { type: 'hold-position', reason: aiPlayer.health <= 0 ? 'retreat' : 'insufficient-stamina' }

  const threats = assessBaseThreats(state, base.id, aiPlayer.id)
  const adjacentThreat = threats.find((threat) => threat.distanceToAi === 1)
  if (adjacentThreat) return { type: 'attack', targetId: adjacentThreat.targetId, targetType: adjacentThreat.targetType }

  const aiDistanceToBase = manhattanDistance(aiPlayer.position, base.position)
  if (aiDistanceToBase > order.radius) {
    const destination = getDefenseRadiusCells(state, aiPlayer, base, order.radius)
      .sort((first, second) => manhattanDistance(first.position, base.position) - manhattanDistance(second.position, base.position) || first.cost - second.cost)[0]
    if (destination) return { type: 'move', position: destination.position, reason: 'return-to-defense-radius' }
  }

  const threat = threats[0]
  if (threat && threat.distanceToBase <= order.radius + 3) {
    const destination = getDefenseRadiusCells(state, aiPlayer, base, order.radius)
      .map((cell) => ({ ...cell, threatDistance: manhattanDistance(cell.position, threat.position) }))
      .sort((first, second) => first.threatDistance - second.threatDistance || first.cost - second.cost)[0]
    if (destination) return { type: 'move', position: destination.position, reason: 'intercept-threat' }
  }

  return { type: 'hold-position', reason: 'no-threat' }
}
