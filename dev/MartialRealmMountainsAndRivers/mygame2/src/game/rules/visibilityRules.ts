import type {
  GameState,
  MapCell,
  MapState,
  Position,
  VisibilityState,
  VisibilityStateData,
} from '../types'
import { getActiveBuffDefinitions } from './playerDerivedRules'

export const DEFAULT_VISION_RANGE = 3
export const BASE_VISION_RANGE = 5

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

export function getPlayerVisionRange(state: GameState, playerId: string): number {
  // 讀取玩家已生效 Buff 提供的視野加成（如天眼望氣），疊加在基礎視野上。
  const player = state.players.find((candidate) => candidate.id === playerId)
  let bonus = 0
  if (player) {
    for (const buff of getActiveBuffDefinitions(player)) {
      bonus += buff.visionRadiusBonus ?? 0
    }
  }
  return DEFAULT_VISION_RANGE + bonus
}

export function getPlayerVisibleCellIds(state: GameState, _playerId?: string): Set<string> {
  const players = state.players.filter((candidate) => candidate.health > 0)
  // 視野由所有存活玩家共享；即使查詢的玩家已死亡（activePlayerId 指向死亡玩家），
  // 只要還有其他存活玩家就應顯示其視野，避免地圖全黑。僅在完全沒有存活玩家時回傳空集合。
  if (players.length === 0) return new Set()

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
    // 視野範圍由防禦建築參數（visionRange）決定；所有防禦建築至少 1（自身一格）。
    const visionRange = Math.max(1, structure.visionRange ?? 0)
    getVisionCellIds(state.map, structure.position, visionRange)
      .forEach((cellId) => visibleIds.add(cellId))
  }

  return visibleIds
}

/** 戰爭迷霧格子集合：未在永久已探索清單（exploredCellIds）中的格子 id。
 *  與視野範圍、暫時揭示無關；若已全圖揭示（mode === 'revealed'）則回傳空集合。 */
export function getFoggedCellIds(state: GameState): Set<string> {
  const visibility = state.visibility ?? { exploredCellIds: [], mode: 'fog' as const }
  if (visibility.mode === 'revealed') return new Set()
  const explored = new Set(visibility.exploredCellIds)
  return new Set(
    state.map.cells.filter((cell) => !explored.has(cell.id)).map((cell) => cell.id),
  )
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
