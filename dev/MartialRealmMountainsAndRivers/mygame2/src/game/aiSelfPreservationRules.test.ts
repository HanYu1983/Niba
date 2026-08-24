import { describe, expect, it } from 'vitest'
import { chooseSelfPreservationAction } from './aiSelfPreservationRules'
import type { GameState, PlayerState, Position } from './types'
import {
  makeAiTestState,
  makeTestCreature,
  makeTestPlayer,
} from './testHelpers/aiTestFixtures'

function player(overrides: Partial<PlayerState> = {}): PlayerState {
  return makeTestPlayer({ name: 'AI', ...overrides })
}

function creature(id: string, position: Position) {
  return makeTestCreature({ id, name: id, position })
}

function state(overrides: Partial<GameState> = {}): GameState {
  return makeAiTestState({
    bases: [],
    players: [player()],
    ...overrides,
  })
}

describe('AI 自保決策', () => {
  it('生命值低於玩家設定門檻時優先撤退', () => {
    const action = chooseSelfPreservationAction(state({ players: [player({ health: 6 })] }), 'ai-1', 30)
    expect(action?.type).toBe('move')
    if (action?.type === 'move') expect(action.reason).toBe('self-preservation')
  })

  it('被兩名敵人包圍時優先脫離危險', () => {
    const action = chooseSelfPreservationAction(state({ creatures: [creature('c1', { row: 5, column: 4 }), creature('c2', { row: 5, column: 6 })] }), 'ai-1', 0)
    expect(action?.type).toBe('move')
  })

  it('沒有自保條件時交回玩家命令決策', () => {
    expect(chooseSelfPreservationAction(state(), 'ai-1', 30)).toBeNull()
  })
})
