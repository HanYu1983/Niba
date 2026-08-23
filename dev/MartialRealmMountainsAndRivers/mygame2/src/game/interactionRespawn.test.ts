import { describe, expect, it } from 'vitest'
import { gameStore } from './gameStore'

describe('互動點補生成', () => {
  it('撿取道具點後不再補生成新的道具點', () => {
    gameStore.resetForTest()
    const state = gameStore.getState()
    const player = state.players[0]
    const itemPoint = { id: 'respawn-item', itemId: null, position: player.position }
    gameStore.setStateForTest({ ...state, itemPoints: [itemPoint], players: [{ ...player, money: 0 }] })
    gameStore.collectItemPoint(player.id, itemPoint.id)
    expect(gameStore.getState().itemPoints).toHaveLength(0)
  })
})
