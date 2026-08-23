import { describe, expect, it } from 'vitest'
import { createGameState } from './gameStore'

describe('玩家數目設定', () => {
  it('playerCount=2 時建立兩名玩家', () => {
    const state = createGameState({
      rows: 30,
      columns: 30,
      baseCount: 3,
      nestCount: 2,
      resourcePointCount: 6,
      itemPointCount: 6,
      playerCount: 2,
      explorationEventCount: 3,
      creatureCount: 4,
      ruinCount: 10,
      seed: 20260803,
    })

    expect(state.players).toHaveLength(2)
    expect(state.players.map((player) => player.id)).toEqual(['player-1', 'player-2'])
    expect(state.activePlayerId).toBe('player-1')
    expect(state.players.every((player) => Object.values(player.baseAttributes ?? player.attributes).every((value) => value === 8))).toBe(true)
    expect(state.players.every((player) => player.externalSkillIds.length === 0 && player.equippedExternalSkillIds.length === 0)).toBe(true)
  })
})