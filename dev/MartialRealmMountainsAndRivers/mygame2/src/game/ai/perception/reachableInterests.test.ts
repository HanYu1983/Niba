import { describe, expect, it } from 'vitest'
import type { ItemPointState, PlayerState } from '../../types'
import { makeAiTestState, makeTestPlayer, makeTestResourcePoint } from '../../testHelpers/aiTestFixtures'
import { collectReachableInterests } from './reachableInterests'

function makeItemPoint(overrides: Partial<ItemPointState> = {}): ItemPointState {
  return {
    id: 'item-1',
    itemId: null,
    position: { row: 5, column: 6 },
    ...overrides,
  }
}

describe('collectReachableInterests', () => {
  it('體力範圍內的道具與資源點被包含，體力不足的被排除', () => {
    const actor: PlayerState = makeTestPlayer({ position: { row: 5, column: 5 }, stamina: 4, maxStamina: 4 })
    const item1 = makeItemPoint({ id: 'item-near', position: { row: 5, column: 6 }, itemId: 'sword' })
    const item2 = makeItemPoint({ id: 'item-far', position: { row: 5, column: 9 }, itemId: 'shield' })
    const resource = makeTestResourcePoint({ position: { row: 5, column: 4 } })
    const state = makeAiTestState({ players: [actor], itemPoints: [item1, item2], resourcePoints: [resource] })

    const interests = collectReachableInterests(state, actor)

    expect(interests).toHaveLength(2)
    expect(interests.map((i) => i.ref.id)).toContain('item-near')
    expect(interests.map((i) => i.ref.id)).toContain('resource-point-1')
    expect(interests.map((i) => i.ref.id)).not.toContain('item-far')
  })

  it('結果以 cost 升序排列', () => {
    const actor: PlayerState = makeTestPlayer({ position: { row: 5, column: 5 }, stamina: 8, maxStamina: 8 })
    const itemFar = makeItemPoint({ id: 'item-far', position: { row: 5, column: 7 } })
    const itemNear = makeItemPoint({ id: 'item-near', position: { row: 5, column: 6 } })
    const state = makeAiTestState({ players: [actor], itemPoints: [itemFar, itemNear] })

    const interests = collectReachableInterests(state, actor)

    expect(interests).toHaveLength(2)
    expect(interests[0].ref.id).toBe('item-near')
    expect(interests[0].cost).toBe(2)
    expect(interests[1].ref.id).toBe('item-far')
    expect(interests[1].cost).toBe(4)
  })

  it('kind 正確標記為 item 或 resource', () => {
    const actor: PlayerState = makeTestPlayer({ position: { row: 5, column: 5 }, stamina: 4, maxStamina: 4 })
    const item = makeItemPoint({ position: { row: 5, column: 6 } })
    const resource = makeTestResourcePoint({ position: { row: 5, column: 4 } })
    const state = makeAiTestState({ players: [actor], itemPoints: [item], resourcePoints: [resource] })

    const interests = collectReachableInterests(state, actor)

    const itemInterest = interests.find((i) => i.kind === 'item')
    const resourceInterest = interests.find((i) => i.kind === 'resource')
    expect(itemInterest).toBeDefined()
    expect(resourceInterest).toBeDefined()
    expect(itemInterest!.ref).toBe(item)
    expect(resourceInterest!.ref).toBe(resource)
  })

  it('被牆隔開的道具不可達', () => {
    const actor: PlayerState = makeTestPlayer({ position: { row: 3, column: 3 }, stamina: 99, maxStamina: 99 })
    const item = makeItemPoint({ id: 'item-walled', position: { row: 1, column: 1 } })
    const wallCells = [
      { row: 0, column: 0 }, { row: 0, column: 1 }, { row: 0, column: 2 },
      { row: 1, column: 0 }, { row: 1, column: 2 },
      { row: 2, column: 0 }, { row: 2, column: 1 }, { row: 2, column: 2 },
    ]
    const wallKeys = new Set(wallCells.map((w) => `${w.row}-${w.column}`))
    const map = {
      rows: 7, columns: 7,
      cells: Array.from({ length: 49 }, (_, index) => {
        const row = Math.floor(index / 7)
        const column = index % 7
        return { id: `${row}-${column}`, row, column, terrain: wallKeys.has(`${row}-${column}`) ? 'wall' as const : 'plain' as const }
      }),
    }
    const state = makeAiTestState({ map, players: [actor], itemPoints: [item] })

    const interests = collectReachableInterests(state, actor)

    expect(interests).toHaveLength(0)
  })

  it('active=false 的資源點被排除', () => {
    const actor: PlayerState = makeTestPlayer({ position: { row: 5, column: 5 }, stamina: 4, maxStamina: 4 })
    const activeResource = makeTestResourcePoint({ id: 'res-active', position: { row: 5, column: 4 }, active: true })
    const inactiveResource = makeTestResourcePoint({ id: 'res-inactive', position: { row: 5, column: 6 }, active: false })
    const state = makeAiTestState({ players: [actor], resourcePoints: [activeResource, inactiveResource] })

    const interests = collectReachableInterests(state, actor)

    expect(interests).toHaveLength(1)
    expect(interests[0].ref.id).toBe('res-active')
  })

  it('無道具與資源時回傳空陣列', () => {
    const actor: PlayerState = makeTestPlayer({ position: { row: 5, column: 5 }, stamina: 4, maxStamina: 4 })
    const state = makeAiTestState({ players: [actor] })

    const interests = collectReachableInterests(state, actor)

    expect(interests).toEqual([])
  })
})
