import type {
  GameState,
  MapCell,
  MapState,
  Position,
  VisibilityState,
  VisibilityStateData,
} from '../types'

export const DEFAULT_VISION_RANGE = 3
export const BASE_VISION_RANGE = 5
export const WATCHTOWER_VISION_RANGE = 3
export const ADVANCED_WATCHTOWER_VISION_RANGE = 5
export const SMALL_WATCHTOWER_VISION_RANGE = 2
export const SMALL_ARROW_TOWER_VISION_RANGE = 1

function getVisionCellIds(map: MapState, position: Position, range: number): Set<string> {
  return new Set(
    map.cells
      .filter((cell) => Math.abs(cell.row - position.row) + Math.abs(cell.column - position.column) <= range)
      .map((cell) => cell.id),
  )
}

/** 探地符（scout）：以指定位置為中心、曼哈頓距離 ≤ range 的格子 id 集合。 */
export function getScoutCellIds(map: MapState, position: Position, range: number): string[] {
  return [...getVisionCellIds(map, position, range)]
}

export function getPlayerVisionRange(_state: GameState, _playerId: string): number {
  // 目前所有玩家使用相同基礎視野，保留 selector 供未來角色效果擴充。
  void _state
  void _playerId
  return DEFAULT_VISION_RANGE
}

export function getPlayerVisibleCellIds(state: GameState, playerId: string): Set<string> {
  const players = state.players.filter((candidate) => candidate.health > 0)
  if (!players.some((player) => player.id === playerId)) return new Set()

  const visibleIds = new Set<string>()
  for (const player of players) {
    getVisionCellIds(state.map, player.position, getPlayerVisionRange(state, player.id))
      .forEach((cellId) => visibleIds.add(cellId))
  }

  for (const base of state.bases) {
    // 據點需完成首次告示牌任務（discovered = true）才提供永久視野。
    if (!base.discovered) continue
    getVisionCellIds(state.map, base.position, BASE_VISION_RANGE)
      .forEach((cellId) => visibleIds.add(cellId))
  }

  for (const structure of state.defenseStructures ?? []) {
    // 標準瞭望塔提供 3 格視野。
    if (structure.type === 'watchtower') {
      getVisionCellIds(state.map, structure.position, WATCHTOWER_VISION_RANGE)
        .forEach((cellId) => visibleIds.add(cellId))
    }
    // 進階瞭望塔提供 5 格視野。
    if (structure.type === 'advanced-watchtower') {
      getVisionCellIds(state.map, structure.position, ADVANCED_WATCHTOWER_VISION_RANGE)
        .forEach((cellId) => visibleIds.add(cellId))
    }
    // 廢墟修復的小型瞭望臺提供 2 格視野。
    if (structure.type === 'small-watchtower') {
      getVisionCellIds(state.map, structure.position, SMALL_WATCHTOWER_VISION_RANGE)
        .forEach((cellId) => visibleIds.add(cellId))
    }
    // 廢墟修復的小型箭塔提供 1 格視野。
    if (structure.type === 'small-arrow-tower') {
      getVisionCellIds(state.map, structure.position, SMALL_ARROW_TOWER_VISION_RANGE)
        .forEach((cellId) => visibleIds.add(cellId))
    }
  }

  return visibleIds
}

export function getCellVisibility(state: GameState, playerId: string, cell: MapCell): VisibilityState {
  const visibility = state.visibility ?? { exploredCellIds: [], mode: 'fog' as const }
  if (visibility.mode === 'revealed') return 'visible'
  const visibleIds = getPlayerVisibleCellIds(state, playerId)
  if (visibleIds.size === 0) return 'unexplored'
  if (visibleIds.has(cell.id)) return 'visible'
  // 鳴鑼符（reveal-creatures）：暫時揭示怪物所在格，下回合恢復迷霧。
  if (state.revealedCreatureCellIds?.includes(cell.id)) return 'visible'
  return visibility.exploredCellIds.includes(cell.id) ? 'explored' : 'unexplored'
}

export function updatePlayerVisibility(state: GameState, playerId: string): VisibilityStateData {
  const visibility = state.visibility ?? { exploredCellIds: [], mode: 'fog' as const }
  if (visibility.mode === 'revealed') return visibility
  const visibleIds = getPlayerVisibleCellIds(state, playerId)
  if (visibleIds.size === 0) return visibility
  return { ...visibility, exploredCellIds: [...new Set([...visibility.exploredCellIds, ...visibleIds])] }
}
