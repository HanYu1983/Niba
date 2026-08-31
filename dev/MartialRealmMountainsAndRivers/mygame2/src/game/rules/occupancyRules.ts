import type { Position } from '../types'

/**
 * 佔位（Occupancy）統一規則。
 *
 * 收斂「哪些格子被實體佔住、不可放置/不可通行」的計算，取代散落各處的手工拼湊。
 * 各呼叫端依需求選用不同 layer 組合（移動、生成、建造），避免漏列或重複疊加。
 */

/** 佔位實體層級。 */
export type OccupancyLayer =
  | 'players'
  | 'creatures'
  | 'bases'
  | 'nests'
  | 'ruins'
  | 'sectGates'
  | 'defenseStructures'
  | 'resourcePoints'
  | 'itemPoints'
  | 'events'
  | 'traps'

export type OccupancyOptions = {
  /** 排除指定玩家（移動時不把自己視為佔位）。 */
  excludePlayerId?: string
  /** 排除指定據點（目標據點本身不視為佔位，玩家可站上據點格）。 */
  excludeBaseId?: string
  /** 要納入的佔位層級；未指定時預設為 MOVEMENT_LAYERS。 */
  layers?: OccupancyLayer[]
}

/**
 * 佔位計算所需的結構化來源。
 *
 * 刻意用最小結構型別（非完整 GameState），讓 MapGrid 等只持有部分資料的呼叫端
 * 也能直接傳入，不必拼出完整 state。
 */
export type OccupancySource = {
  players: { id?: string; position: Position }[]
  creatures: { position: Position }[]
  bases: { id?: string; position: Position }[]
  creatureNests: { position: Position }[]
  ruins?: { status: string; position: Position }[]
  sectGates?: { position: Position }[]
  defenseStructures?: { position: Position }[]
  resourcePoints?: { position: Position }[]
  itemPoints?: { position: Position }[]
  explorationEvents?: { position: Position }[]
  traps?: { position: Position }[]
}

/** 移動阻擋層級：其他玩家、生物、據點、巢穴、未清除廢墟、門派據點、防禦設施。 */
export const MOVEMENT_LAYERS: OccupancyLayer[] = [
  'players', 'creatures', 'bases', 'nests', 'ruins', 'sectGates', 'defenseStructures',
]

/** 生成物件層級：移動阻擋 + 互動點（資源點、物品點、事件、陷阱）。 */
export const SPAWN_LAYERS: OccupancyLayer[] = [
  ...MOVEMENT_LAYERS, 'resourcePoints', 'itemPoints', 'events', 'traps',
]

/** 建造層級：移動阻擋 + 互動點（建造時不可蓋在互動點上）。 */
export const BUILD_LAYERS: OccupancyLayer[] = SPAWN_LAYERS

/** 依層級收集佔位位置（含座標有效性過濾）。 */
export function getOccupiedPositions(state: OccupancySource, options: OccupancyOptions = {}): Position[] {
  const layers = options.layers ?? MOVEMENT_LAYERS
  const positions: Position[] = []

  if (layers.includes('players')) {
    positions.push(...state.players
      .filter((player) => options.excludePlayerId === undefined || player.id !== options.excludePlayerId)
      .map((player) => player.position))
  }
  if (layers.includes('creatures')) {
    positions.push(...state.creatures.map((creature) => creature.position))
  }
  if (layers.includes('bases')) {
    positions.push(...state.bases
      .filter((base) => options.excludeBaseId === undefined || base.id !== options.excludeBaseId)
      .map((base) => base.position))
  }
  if (layers.includes('nests')) {
    positions.push(...state.creatureNests.map((nest) => nest.position))
  }
  if (layers.includes('ruins')) {
    positions.push(...(state.ruins ?? [])
      .filter((ruin) => ruin.status === 'intact')
      .map((ruin) => ruin.position))
  }
  if (layers.includes('sectGates')) {
    positions.push(...(state.sectGates ?? []).map((gate) => gate.position))
  }
  if (layers.includes('defenseStructures')) {
    positions.push(...(state.defenseStructures ?? []).map((structure) => structure.position))
  }
  if (layers.includes('resourcePoints')) {
    positions.push(...(state.resourcePoints ?? []).map((point) => point.position))
  }
  if (layers.includes('itemPoints')) {
    positions.push(...(state.itemPoints ?? []).map((point) => point.position))
  }
  if (layers.includes('events')) {
    positions.push(...(state.explorationEvents ?? []).map((event) => event.position))
  }
  if (layers.includes('traps')) {
    positions.push(...(state.traps ?? []).map((trap) => trap.position))
  }

  return positions.filter((position): position is Position => Boolean(
    position && Number.isFinite(position.row) && Number.isFinite(position.column),
  ))
}

/** 依層級收集佔位格的「row-column」鍵集合，供 O(1) 查詢。 */
export function getOccupiedKeySet(state: OccupancySource, options: OccupancyOptions = {}): Set<string> {
  return new Set(getOccupiedPositions(state, options).map((position) => `${position.row}-${position.column}`))
}