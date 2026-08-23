import type { ExplorationEventPoolId, ExplorationEventState, ExplorationEventType, MapState, Position } from '../types'
import { explorationEventCatalog, type ExplorationEventPoolDefinition } from './eventCatalog'

/** 回合結束事件可在任何地形發生的通用事件池（增益與減益並存）。 */
export const COMMON_EXPLORATION_EVENT_TYPES: ExplorationEventType[] = [
  'lost-caravan',
  'wounded-traveler',
  'ancient-ruins',
  'hermit-healer',
  'night-haunt',
  'cursed-fog',
]

const terrainEventPool: Partial<Record<MapState['cells'][number]['terrain'], ExplorationEventType[]>> = {
  plain: ['village-request', 'lost-caravan', 'abandoned-shrine', 'highway-toll-gang', 'old-friend-reunion'],
  forest: ['forest-herb-gatherer', 'deep-forest-beast', 'ancient-tree-enlightenment', 'toxic-mire', 'moonlit-cultivation'],
  mountain: ['mountain-bandit-ambush', 'cliff-carved-scripture', 'mountain-spring-well', 'flash-flood', 'hot-spring'],
  water: ['ferry-merchant', 'waterfront-fisher', 'flooded-temple'],
  desert: ['desert-mirage', 'buried-caravan', 'wandering-ascetic', 'quicksand-trap'],
}

export function getTerrainExplorationEventTypes(
  terrain: MapState['cells'][number]['terrain'],
  availableTypes: ExplorationEventType[] = explorationEventCatalog.map((event) => event.type),
): ExplorationEventType[] {
  const available = new Set(availableTypes)
  return (terrainEventPool[terrain] ?? []).filter((type) => available.has(type))
}

export function createExplorationEventState(
  type: ExplorationEventType,
  position: Position,
  id: string,
  sourcePoolId?: ExplorationEventPoolId,
): ExplorationEventState | null {
  const definition = explorationEventCatalog.find((event) => event.type === type)
  if (!definition) return null

  return {
    id,
    type,
    name: definition.name,
    description: definition.description,
    position,
    status: 'available',
    discovered: true,
    expiresAtRound: null,
    sourcePoolId,
  }
}

export function createExplorationEvents(
  map: MapState,
  excludedPositions: Position[] = [],
  eventTypes: ExplorationEventType[] = explorationEventCatalog.map((event) => event.type),
  seed = 20260803,
  count = eventTypes.length,
): ExplorationEventState[] {
  const availableCells = map.cells.filter((cell) =>
    cell.terrain !== 'wall' && !excludedPositions.some((position) => position.row === cell.row && position.column === cell.column),
  ).sort((first, second) => {
    const firstScore = Math.sin((first.row + 1) * 127.1 + (first.column + 1) * 311.7 + seed * 74.7)
    const secondScore = Math.sin((second.row + 1) * 127.1 + (second.column + 1) * 311.7 + seed * 74.7)
    return secondScore - firstScore
  })
  const occupiedPositions: Position[] = []

  const availableEventTypes = eventTypes.length > 0 ? eventTypes : explorationEventCatalog.map((event) => event.type)
  return Array.from({ length: Math.max(0, count) }, (_, index) => {
    const type = availableEventTypes[index % availableEventTypes.length]
    const definition = explorationEventCatalog.find((event) => event.type === type)
    const cell = availableCells.find((candidate) => !occupiedPositions.some((position) => position.row === candidate.row && position.column === candidate.column))
    if (!definition || !cell) return []
    occupiedPositions.push({ row: cell.row, column: cell.column })
    const event = createExplorationEventState(
      definition.type,
      { row: cell.row, column: cell.column },
      `event-${definition.type}-${index + 1}`,
    )
    return event ? [event] : []
  }).flat()
}

export function createExplorationEventsFromPools(
  map: MapState,
  excludedPositions: Position[],
  pools: ExplorationEventPoolDefinition[],
  seed = 20260803,
  count = 5,
): ExplorationEventState[] {
  const eventTypes = [...new Set(pools.flatMap((pool) => pool.eventTypes))]
  if (eventTypes.length === 0) return []

  // 事件池內的事件不能依 catalog 順序固定生成，否則第一個事件池的第一個事件
  // 會在每次補點時都被選中（例如總是生成失散商隊）。使用 seed 做穩定排序，
  // 讓同一局可重現，同時讓不同建築組合與不同回合有不同事件順序。
  const shuffledEventTypes = eventTypes
    .map((type, index) => ({
      type,
      score: Math.sin(seed * 74.7 + index * 127.1 + type.length * 311.7),
    }))
    .sort((first, second) => second.score - first.score)
    .map(({ type }) => type)

  const poolByType = new Map<ExplorationEventType, ExplorationEventPoolId>()
  for (const pool of pools) {
    for (const eventType of pool.eventTypes) poolByType.set(eventType, pool.id)
  }

  const events = createExplorationEvents(map, excludedPositions, shuffledEventTypes, seed, count)
  return events.map((event) => ({
    ...event,
    sourcePoolId: poolByType.get(event.type as ExplorationEventType),
  }))
}

/**
 * 從完整事件目錄生成探索事件。
 * 建築不再控制事件是否出現；建築需求由各事件選項的 building-exists
 * requirement 在事件解析階段判斷。
 */
export function createExplorationEventsFromCatalog(
  map: MapState,
  excludedPositions: Position[],
  seed = 20260803,
  count = 5,
): ExplorationEventState[] {
  const eventTypes = explorationEventCatalog.map((event) => event.type)
  const availableCells = map.cells.filter((cell) =>
    cell.terrain !== 'wall' && !excludedPositions.some((position) => position.row === cell.row && position.column === cell.column),
  ).sort((first, second) => {
    const firstScore = Math.sin((first.row + 1) * 127.1 + (first.column + 1) * 311.7 + seed * 74.7)
    const secondScore = Math.sin((second.row + 1) * 127.1 + (second.column + 1) * 311.7 + seed * 74.7)
    return secondScore - firstScore
  })
  const events: ExplorationEventState[] = []
  const limit = Math.min(Math.max(0, count), availableCells.length)
  for (let index = 0; index < limit; index += 1) {
    const cell = availableCells[index]
    const terrainTypes = getTerrainExplorationEventTypes(cell.terrain, eventTypes)
    const candidateTypes = terrainTypes.length > 0 ? terrainTypes : eventTypes
    const type = candidateTypes[index % candidateTypes.length]
    const event = createExplorationEventState(type, { row: cell.row, column: cell.column }, `event-${type}-${index + 1}`)
    if (event) events.push(event)
  }
  return events
}