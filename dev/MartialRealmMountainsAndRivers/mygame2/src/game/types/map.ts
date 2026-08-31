export type { Position } from './geometry'

export type TerrainType = 'plain' | 'forest' | 'water' | 'mountain' | 'desert' | 'wall' | 'road'

export type TerrainWeights = {
  plain: number
  forest: number
  water: number
  mountain: number
  desert: number
}

export type GameSettings = {
  rows: number
  columns: number
  baseCount: number
  nestCount: number
  resourcePointCount: number
  itemPointCount: number
  playerCount: number
  aiPlayerCount?: number
  explorationEventCount: number
  /** 人類玩家回合結束時，隨機觸發探索事件的機率（0~1）。 */
  explorationTriggerChance?: number
  /** 巢穴每回合回復的最大生命比例（0~1，預設 0.01）。 */
  nestHealthRegenPercent?: number
  creatureCount: number
  ruinCount: number
  /** 地圖上生成的中立門派據點數量，上限 6（六門派各一）。 */
  sectGateCount?: number
  /** 各可通行地形的生成權重；未提供時使用預設權重。 */
  terrainWeights?: TerrainWeights
  seed: number
}

export const terrainStaminaCost: Record<TerrainType, number> = {
  plain: 2,
  forest: 4,
  water: 6,
  mountain: 5,
  desert: 3,
  wall: Number.POSITIVE_INFINITY,
  road: 1,
}

export type MapCell = {
  id: string
  row: number
  column: number
  terrain: TerrainType
}

export type MapState = {
  rows: number
  columns: number
  cells: MapCell[]
}

export type VisibilityMode = 'fog' | 'revealed'
export type VisibilityState = 'unexplored' | 'explored' | 'visible'
export type VisibilityStateData = {
  exploredCellIds: string[]
  mode: VisibilityMode
}