import type { BaseState, DefenseStructureState, GameState, Position } from '../types'
import { getAdjacentPositions } from '../types'
import { BUILDING_TYPES } from '../catalogs/buildingCatalog'
import { assertPlayerTurn } from './actionCostRules'
import { getOccupiedPositions, SPAWN_LAYERS } from './occupancyRules'
import { canTraverseTerrain } from './playerDerivedRules'
import { isBaseActive } from './baseRules'

/** 驛站傳送的基本費用。 */
export const WAYSTATION_TRANSPORT_COST = 10

/** 小型驛站（廢墟修復）的傳送費用。 */
export const SMALL_WAYSTATION_TRANSPORT_COST = 10

/** 驛站可到達的目標：其他據點或小型驛站。 */
export type TransportTarget = {
  id: string
  name: string
  position: Position
  kind: 'base' | 'small-waystation'
}

/** 傳送來源：據點驛站或小型驛站（廢墟修復的防禦設施）。 */
export type TransportSource = {
  kind: 'base' | 'small-waystation'
  /** 來源據點 ID（小型驛站時為空）。 */
  baseId?: string
  /** 小型驛站防禦設施。 */
  structure?: DefenseStructureState
}

/** 依玩家位置判斷可用的傳送來源（據點驛站或小型驛站）。 */
export function getTransportSource(state: GameState, playerId: string): TransportSource | null {
  const player = state.players.find((candidate) => candidate.id === playerId)
  if (!player) return null

  const sourceBase = state.bases.find((candidate) =>
    isBaseActive(candidate) &&
    Math.abs(candidate.position.row - player.position.row) +
    Math.abs(candidate.position.column - player.position.column) <= 1,
  )
  if (sourceBase && hasWaystation(sourceBase)) {
    return { kind: 'base', baseId: sourceBase.id }
  }

  const smallWaystation = (state.defenseStructures ?? []).find((structure) =>
    structure.type === 'small-waystation' &&
    Math.abs(structure.position.row - player.position.row) +
    Math.abs(structure.position.column - player.position.column) <= 1,
  )
  if (smallWaystation) {
    return { kind: 'small-waystation', structure: smallWaystation }
  }

  return null
}

/** 取得傳送來源可到達的所有目標。 */
export function getTransportTargets(state: GameState, source: TransportSource | null): TransportTarget[] {
  // 小型驛站只能到達其他小型驛站（由廢墟修復的防禦設施），排除當前所在的驛站。
  const smallWaystations: TransportTarget[] = (state.defenseStructures ?? [])
    .filter((structure) => structure.type === 'small-waystation')
    .filter((structure) => structure.id !== source?.structure?.id)
    .map((structure) => ({
      id: structure.id,
      name: structure.originName ?? structure.name ?? '小型驛站',
      position: structure.position,
      kind: 'small-waystation' as const,
    }))

  if (source?.kind === 'small-waystation') {
    return smallWaystations
  }

  const bases: TransportTarget[] = state.bases
    .filter((base) => isBaseActive(base) && base.id !== source?.baseId)
    .map((base) => ({ id: base.id, name: base.name, position: base.position, kind: 'base' }))

  return [...bases, ...smallWaystations]
}

/** 依目標 ID 解析傳送目標（據點或小型驛站）。 */
export function resolveTransportTarget(state: GameState, targetId: string): TransportTarget | null {
  const base = state.bases.find((candidate) => candidate.id === targetId)
  if (base && isBaseActive(base)) return { id: base.id, name: base.name, position: base.position, kind: 'base' }

  const smallWaystation = (state.defenseStructures ?? []).find(
    (candidate) => candidate.id === targetId && candidate.type === 'small-waystation',
  )
  if (smallWaystation) {
    return {
      id: smallWaystation.id,
      name: smallWaystation.originName ?? smallWaystation.name ?? '小型驛站',
      position: smallWaystation.position,
      kind: 'small-waystation',
    }
  }

  return null
}

/** 找出傳送目標周遭一格可供玩家降落的空地。 */
export function getTransportLandingPosition(
  state: GameState,
  target: TransportTarget,
  playerId: string,
): Position | null {
  const player = state.players.find((candidate) => candidate.id === playerId)
  if (!player) return null

  const blocked = getOccupiedPositions(state, { excludePlayerId: playerId, layers: SPAWN_LAYERS })
  const isBlocked = (position: Position) => blocked.some(
    (occupied) => occupied.row === position.row && occupied.column === position.column,
  )

  const landingCell = getAdjacentPositions(target.position)
    .map((position) => state.map.cells.find((cell) => cell.row === position.row && cell.column === position.column))
    .filter((cell): cell is NonNullable<typeof cell> => Boolean(cell))
    .find((cell) => canTraverseTerrain(cell.terrain, player) && !isBlocked(cell))

  return landingCell ? { row: landingCell.row, column: landingCell.column } : null
}

/**
 * 檢查玩家是否可以從目前據點傳送到目標（據點或已修復的廢墟點）。
 * 只有出發據點需要驛站；目的據點不需要驛站。
 */
export function canTransportPlayer(
  state: GameState,
  playerId: string,
  targetId: string,
): { ok: boolean; reason?: string; cost?: number } {
  const player = state.players.find((candidate) => candidate.id === playerId)
  if (!player) {
    return { ok: false, reason: '玩家不存在。' }
  }

  const turnCheck = assertPlayerTurn(state, player)
  if (!turnCheck.ok) return turnCheck

  const target = resolveTransportTarget(state, targetId)
  if (!target) {
    return { ok: false, reason: '目標不存在。' }
  }

  const source = getTransportSource(state, playerId)
  if (!source) {
    return { ok: false, reason: '玩家不在任何驛站附近。' }
  }

  // 小型驛站只能到達其他小型驛站。
  if (source.kind === 'small-waystation' && target.kind !== 'small-waystation') {
    return { ok: false, reason: '小型驛站只能傳送至其他小型驛站。' }
  }

  // 不能傳送到目前的驛站（據點驛站或小型驛站本身）。
  if (source.kind === 'base' && target.kind === 'base' && source.baseId === target.id) {
    return { ok: false, reason: '不能傳送到目前據點。' }
  }
  if (source.kind === 'small-waystation' && source.structure?.id === target.id) {
    return { ok: false, reason: '不能傳送到目前所在的小型驛站。' }
  }

  if (!getTransportLandingPosition(state, target, playerId)) {
    return { ok: false, reason: '目標周遭沒有可供降落的空地。' }
  }

  const cost = source.kind === 'small-waystation' ? SMALL_WAYSTATION_TRANSPORT_COST : WAYSTATION_TRANSPORT_COST

  if (player.money < cost) {
    return { ok: false, reason: `金錢不足，需要 ${cost} 金錢。` }
  }

  return { ok: true, cost }
}

export function hasWaystation(base: BaseState): boolean {
  return base.buildings.some((building) => building.type === BUILDING_TYPES.WAYSTATION)
}

export function getTransportCost(state: GameState, playerId: string, targetId: string): number {
  const result = canTransportPlayer(state, playerId, targetId)
  return result.ok ? (result.cost ?? WAYSTATION_TRANSPORT_COST) : 0
}
