import { describe, expect, it, vi } from 'vitest'
import type { ActionOutcome, GameState } from './types'
import { runActionExecution, runActionOutcome } from './storeAdapters'

const state = {} as GameState

describe('storeAdapters', () => {
  it('runActionOutcome 會執行一次 action、套用 state 並回傳結果', () => {
    const updateGameState = vi.fn((updater: (currentState: GameState) => GameState) => updater(state))
    const nextState = { ...state, round: 2 }
    const action = vi.fn((): { state: GameState; result: ActionOutcome } => ({
      state: nextState,
      result: { ok: true },
    }))

    const result = runActionOutcome(updateGameState, action, 'fallback')

    expect(action).toHaveBeenCalledTimes(1)
    expect(updateGameState).toHaveBeenCalledTimes(1)
    expect(result).toEqual({ ok: true })
    expect(updateGameState.mock.results[0]?.value).toBe(nextState)
  })

  it('runActionOutcome 會保留 action 的失敗原因，而不是覆蓋成 fallback', () => {
    const updateGameState = vi.fn((updater: (currentState: GameState) => GameState) => updater(state))
    const result = runActionOutcome(
      updateGameState,
      () => ({ state, result: { ok: false, reason: 'action failed' } }),
      'fallback',
    )

    expect(result).toEqual({ ok: false, reason: 'action failed' })
  })

  it('runActionExecution 會保留泛型 data', () => {
    const updateGameState = vi.fn((updater: (currentState: GameState) => GameState) => updater(state))
    const result = runActionExecution(
      updateGameState,
      () => ({ state, result: { ok: true, data: { deliveredAmount: 9 } } }),
      'fallback',
    )

    expect(result).toEqual({ ok: true, data: { deliveredAmount: 9 } })
  })
})
