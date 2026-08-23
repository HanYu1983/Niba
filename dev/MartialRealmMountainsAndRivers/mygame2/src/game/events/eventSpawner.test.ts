import { describe, expect, it } from 'vitest'
import { COMMON_EXPLORATION_EVENT_TYPES, createExplorationEvents, createExplorationEventsFromCatalog, createExplorationEventsFromPools, getTerrainExplorationEventTypes } from './eventSpawner'
import { explorationEventCatalog, getDefenseStructurePoolKey, getUnlockedExplorationEventPools } from './eventCatalog'
import type { MapState } from '../types'

const map: MapState = {
  rows: 5,
  columns: 5,
  cells: Array.from({ length: 25 }, (_, index) => {
    const row = Math.floor(index / 5)
    const column = index % 5
    return { id: `${row}-${column}`, row, column, terrain: row === 0 || column === 0 || row === 4 || column === 4 ? 'wall' : 'plain' }
  }),
}

describe('eventSpawner', () => {
  it('通用事件池包含跨地形可發生的事件', () => {
    expect(COMMON_EXPLORATION_EVENT_TYPES).toEqual(['lost-caravan', 'wounded-traveler', 'ancient-ruins'])
  })

  it('地形事件池依地形提供專屬事件', () => {
     expect(getTerrainExplorationEventTypes('forest')).toEqual(['forest-herb-gatherer', 'deep-forest-beast', 'ancient-tree-enlightenment'])
     expect(getTerrainExplorationEventTypes('desert')).toEqual(['desert-mirage', 'buried-caravan', 'wandering-ascetic'])
  })

  it('所有地形事件池事件都存在於事件目錄', () => {
    for (const terrain of ['plain', 'forest', 'water', 'mountain', 'desert'] as const) {
      for (const type of getTerrainExplorationEventTypes(terrain)) {
        expect(explorationEventCatalog.some((event) => event.type === type), `${terrain}:${type}`).toBe(true)
      }
    }
  })

  it('依事件類型建立事件並避開排除位置', () => {
    const events = createExplorationEvents(map, [{ row: 2, column: 2 }], ['lost-caravan', 'ancient-ruins'])
    expect(events).toHaveLength(2)
    expect(events.map((event) => event.type)).toEqual(['lost-caravan', 'ancient-ruins'])
    expect(events.some((event) => event.position.row === 2 && event.position.column === 2)).toBe(false)
  })

  it('同一批事件不會使用相同位置，且 seed 會影響位置排序', () => {
    const first = createExplorationEvents(map, [], ['lost-caravan', 'ancient-ruins'], 1)
    const second = createExplorationEvents(map, [], ['lost-caravan', 'ancient-ruins'], 2)
    expect(new Set(first.map((event) => `${event.position.row}-${event.position.column}`)).size).toBe(2)
    expect(first.map((event) => event.position)).not.toEqual(second.map((event) => event.position))
  })

  it('事件數量可超過事件種類數並循環使用事件種類', () => {
    const events = createExplorationEvents(map, [], ['lost-caravan', 'ancient-ruins'], 1, 3)
    expect(events).toHaveLength(3)
    expect(events.map((event) => event.type)).toEqual(['lost-caravan', 'ancient-ruins', 'lost-caravan'])
  })

  it('完整事件目錄可在沒有建築解鎖時生成所有類型事件', () => {
    const events = createExplorationEventsFromCatalog(map, [], 1, 20)
    expect(events).toHaveLength(9)
    // 測試地圖為 plain，事件類型現在依地形池循環，至少涵蓋該地形的多個事件。
    expect(new Set(events.map((event) => event.type)).size).toBeGreaterThanOrEqual(3)
  })

  it('建築可以解鎖對應事件池', () => {
    const pools = getUnlockedExplorationEventPools([
      { buildings: [{ id: 'board-1', type: 'board', name: '告示牌', description: '', constructionCost: 0 }] },
      { buildings: [{ id: 'infirmary-1', type: 'infirmary', name: '醫療室', description: '', constructionCost: 50 }] },
    ])

    expect(pools.map((pool) => pool.id)).toEqual(['board-events', 'infirmary-events'])
  })

  it('依事件池生成事件並保存來源池 ID', () => {
    const pools = getUnlockedExplorationEventPools([
      { buildings: [{ id: 'board-1', type: 'board', name: '告示牌', description: '', constructionCost: 0 }] },
    ])
    const events = createExplorationEventsFromPools(map, [], pools, 1, 13)

    expect(events.some((event) => event.sourcePoolId === 'board-events')).toBe(true)
  })

  it('貿易市場可解鎖對應事件池', () => {
    const pools = getUnlockedExplorationEventPools([
      { buildings: [{ id: 'trade-1', type: 'trade-market', name: '貿易市場', description: '', constructionCost: 60 }] },
    ])

    expect(pools.some((pool) => pool.id === 'trade-market-events')).toBe(true)
  })

  it('防禦設施類型可解鎖對應事件池', () => {
    const pools = getUnlockedExplorationEventPools([], ['barricade', 'arrow-tower'])
    const ids = pools.map((pool) => pool.id)

    expect(ids).toContain('barricade-events')
    expect(ids).toContain('arrow-tower-events')
  })

  it('正規化的防禦設施池鍵可直接解鎖對應事件池', () => {
    const pools = getUnlockedExplorationEventPools([], ['watchtower'])
    expect(pools.map((pool) => pool.id)).toContain('watchtower-events')
  })
})

describe('getDefenseStructurePoolKey', () => {
  it('正規化進階與小型防禦設施到基礎事件池', () => {
    expect(getDefenseStructurePoolKey('watchtower')).toBe('watchtower')
    expect(getDefenseStructurePoolKey('advanced-watchtower')).toBe('watchtower')
    expect(getDefenseStructurePoolKey('small-watchtower')).toBe('watchtower')
    expect(getDefenseStructurePoolKey('arrow-tower')).toBe('arrow-tower')
    expect(getDefenseStructurePoolKey('advanced-arrow-tower')).toBe('arrow-tower')
    expect(getDefenseStructurePoolKey('barricade')).toBe('barricade')
  })
})
