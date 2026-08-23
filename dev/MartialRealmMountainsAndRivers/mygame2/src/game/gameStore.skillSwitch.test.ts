import { beforeEach, describe, expect, it } from 'vitest'
import { gameStore } from './gameStore'

describe('內功切換', () => {
  beforeEach(() => gameStore.resetForTest())

  it('已透過武館學習的太虛流內功可以切換裝備', () => {
    const state = gameStore.getState()
    const player = state.players[0]
    gameStore.setStateForTest({
      ...state,
      players: [{ ...player, money: 200, innerSkillIds: [...player.innerSkillIds, 'void-spirit-inner'] }],
    })

    gameStore.equipInnerSkill(player.id, 'void-spirit-inner')

    expect(gameStore.getState().players[0].innerSkillId).toBe('void-spirit-inner')
  })

  it('切換內功消耗 1% 內力', () => {
    const state = gameStore.getState()
    const player = state.players[0]
    gameStore.setStateForTest({
      ...state,
      players: [{ ...player, money: 200, innerSkillIds: [...player.innerSkillIds, 'void-spirit-inner'] }],
    })
    const maxInnerPower = gameStore.getState().players[0].maxInnerPower
    const beforeInnerPower = gameStore.getState().players[0].innerPower

    gameStore.equipInnerSkill(player.id, 'void-spirit-inner')

    expect(gameStore.getState().players[0].innerPower).toBe(beforeInnerPower - Math.max(1, Math.floor(maxInnerPower * 0.01)))
  })

  it('切換到同一內功不消耗內力', () => {
    const state = gameStore.getState()
    const player = state.players[0]
    const beforeInnerPower = player.innerPower

    gameStore.equipInnerSkill(player.id, player.innerSkillId)

    expect(gameStore.getState().players[0].innerPower).toBe(beforeInnerPower)
  })
})
