import { describe, expect, it } from 'vitest'
import { gameStore } from '../gameStore'
import { getExplorationEventDefinition } from './eventCatalog'
import type { ExplorationEventType } from '../types'

describe('探索事件互動', () => {
  it('成功互動後事件會從場上移除', () => {
    gameStore.resetForTest()
    const state = gameStore.getState()
    const event = state.explorationEvents?.[0]
    if (!event) return

    const player = state.players[0]
    gameStore.setStateForTest({
      ...state,
      activePlayerId: player.id,
      players: [{ ...player, position: event.position, turnEnded: false }],
      explorationEvents: [event],
    })

    const choiceId = getExplorationEventDefinition(event.type as ExplorationEventType)?.choices[0]?.id
    if (!choiceId) return
    const result = gameStore.resolveExplorationEvent(player.id, event.id, choiceId)

    expect(result.ok).toBe(true)
    expect(gameStore.getState().explorationEvents?.some((current) => current.id === event.id)).toBe(false)
  })

  it('探索事件不消耗體力，體力為 0 時仍可互動', () => {
    gameStore.resetForTest()
    const state = gameStore.getState()
    const event = state.explorationEvents?.[0]
    if (!event) return

    const player = state.players[0]
    gameStore.setStateForTest({
      ...state,
      activePlayerId: player.id,
      players: [{ ...player, position: event.position, turnEnded: false, stamina: 0 }],
      explorationEvents: [event],
    })

    const choiceId = getExplorationEventDefinition(event.type as ExplorationEventType)?.choices[0]?.id
    if (!choiceId) return
    const result = gameStore.resolveExplorationEvent(player.id, event.id, choiceId)

    expect(result.ok).toBe(true)
  })
})
