import type { Position } from '../types'

export const MAP_INFLUENCE_RANGE = 5

export function getManhattanDistance(first: Position, second: Position): number {
  return Math.abs(first.row - second.row) + Math.abs(first.column - second.column)
}

export function isWithinMapInfluenceRange(cell: Position, origin: Position, range = MAP_INFLUENCE_RANGE): boolean {
  return getManhattanDistance(cell, origin) <= range
}

export type MapCellInteractionMode = {
  unexplored: boolean
  externalSkillTargeting: boolean
  attackTargeting: boolean
  hasCreatureTarget: boolean
  hasNestTarget: boolean
  canSelectDefensePosition: boolean
  isReachable: boolean
}

export type MapCellViewState = {
  isUnexplored: boolean
  isVisible: boolean
  isExplored: boolean
  isKnownLocation: boolean
  isReachable: boolean
  isSkillTarget: boolean
  isAttackTarget: boolean
  isBaseInfluence: boolean
  isDefenseBuildRange: boolean
  canSelectDefensePosition: boolean
}

export type MapCellInteractionContext = {
  position: Position
  visibility: 'visible' | 'explored' | 'unexplored'
  movementEnabled: boolean
  attackTargeting: boolean
  firstAidTargeting: boolean
  externalSkillTargeting: boolean
  itemTargeting: boolean
  defenseBuildMode: boolean
  activePlayerId: string | null
  isReachable: boolean
  canSelectDefensePosition: boolean
  creatureTargetId?: string
  nestTargetId?: string
  playerTargetId?: string
  marker?: { type: MapMarkerType; id: string }
  gameOver?: boolean
  blockingModal?: boolean
  creatureTurnInProgress?: boolean
}

export type MapCellInteractionAction =
  | { type: 'none' }
  | { type: 'move'; playerId: string; position: Position }
  | { type: 'target-creature'; creatureId: string }
  | { type: 'target-nest'; nestId: string }
  | { type: 'target-player'; playerId: string }
  | { type: 'build-defense'; position: Position }
  | { type: 'inspect-creature'; creatureId: string }
  | { type: 'inspect-nest'; nestId: string }
  | { type: 'inspect-base'; baseId: string }
  | { type: 'inspect-defense'; structureId: string }
  | { type: 'inspect-event'; eventId: string }
  | { type: 'inspect-ruin'; ruinId: string }
  | { type: 'inspect-resource'; resourcePointId: string }
  | { type: 'inspect-item'; itemPointId: string }
  | { type: 'inspect-sect-gate'; sectGateId: string }

function getMarkerAction(context: MapCellInteractionContext): MapCellInteractionAction | null {
  const marker = context.marker
  if (!marker) return null
  const targeting = context.attackTargeting || context.firstAidTargeting || context.externalSkillTargeting || context.itemTargeting
  if (marker.type === 'creature') return context.creatureTargetId === marker.id && targeting
    ? { type: 'target-creature', creatureId: marker.id }
    : targeting ? { type: 'none' } : { type: 'inspect-creature', creatureId: marker.id }
  if (marker.type === 'nest') return context.nestTargetId === marker.id && targeting
    ? { type: 'target-nest', nestId: marker.id }
    : targeting ? { type: 'none' } : { type: 'inspect-nest', nestId: marker.id }
  if (marker.type === 'player') return context.firstAidTargeting && context.playerTargetId === marker.id
    ? { type: 'target-player', playerId: marker.id }
    : context.firstAidTargeting ? { type: 'none' } : null
  if (marker.type === 'base') return targeting ? { type: 'none' } : { type: 'inspect-base', baseId: marker.id }
  if (marker.type === 'defense') return targeting || context.defenseBuildMode ? { type: 'none' } : { type: 'inspect-defense', structureId: marker.id }
  if (marker.type === 'ruin') return targeting ? { type: 'none' } : { type: 'inspect-ruin', ruinId: marker.id }
  if (marker.type === 'resource') return targeting ? { type: 'none' } : { type: 'inspect-resource', resourcePointId: marker.id }
  if (marker.type === 'event') return context.movementEnabled && context.isReachable && context.activePlayerId
    ? { type: 'move', playerId: context.activePlayerId, position: context.position }
    : targeting ? { type: 'none' } : { type: 'inspect-event', eventId: marker.id }
  if (marker.type === 'item') return context.movementEnabled && context.isReachable && context.activePlayerId
    ? { type: 'move', playerId: context.activePlayerId, position: context.position }
    : targeting ? { type: 'none' } : { type: 'inspect-item', itemPointId: marker.id }
  if (marker.type === 'sect-gate') return targeting ? { type: 'none' } : { type: 'inspect-sect-gate', sectGateId: marker.id }
  return { type: 'none' }
}

/** Resolves both empty-cell and marker interactions without React side effects. */
export function resolveMapCellAction(context: MapCellInteractionContext): MapCellInteractionAction {
  if (context.gameOver || context.blockingModal || context.creatureTurnInProgress) return { type: 'none' }
  // 未探查（黑色）格子：仍允許移動到可達的高亮格（探索行為），
  // 但阻擋其他互動（攻擊、查看、建造等）。
  if (context.visibility === 'unexplored') {
    if (context.isReachable && context.activePlayerId) {
      return { type: 'move', playerId: context.activePlayerId, position: context.position }
    }
    return { type: 'none' }
  }
  const markerAction = getMarkerAction(context)
  if (markerAction) return markerAction
  const targeting = context.attackTargeting || context.firstAidTargeting || context.externalSkillTargeting || context.itemTargeting
  if (targeting && context.creatureTargetId) return { type: 'target-creature', creatureId: context.creatureTargetId }
  if (targeting && context.nestTargetId) return { type: 'target-nest', nestId: context.nestTargetId }
  if (context.firstAidTargeting && context.playerTargetId) return { type: 'target-player', playerId: context.playerTargetId }
  if (context.canSelectDefensePosition) return { type: 'build-defense', position: context.position }
  if (context.isReachable && context.activePlayerId) return { type: 'move', playerId: context.activePlayerId, position: context.position }
  return { type: 'none' }
}

export type MapMarkerType = 'creature' | 'nest' | 'player' | 'base' | 'defense' | 'event' | 'ruin' | 'resource' | 'item' | 'sect-gate'

export function getMapCellRangeState(
  cell: Position,
  selectedBasePosition: Position | null,
  selectedBaseActive: boolean,
  knownLocation: boolean,
): { isBaseInfluence: boolean } {
  return {
    isBaseInfluence: Boolean(
      selectedBasePosition && selectedBaseActive && knownLocation &&
      isWithinMapInfluenceRange(cell, selectedBasePosition),
    ),
  }
}
