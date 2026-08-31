import { describe, expect, it } from 'vitest'
import { chooseSupportAction } from './aiSupportRules'
import type { GameState, PlayerState, Position } from './types'
import {
  makeAiTestState,
  makeSupportPlayerOrder,
  makeTestBase,
  makeTestCreature,
  makeTestHuman,
  makeTestPlayer,
} from './testHelpers/gameFixtures'

function player(id: string, position: Position, overrides: Partial<PlayerState> = {}): PlayerState {
  return makeTestPlayer({ id, name: id, isAI: id.startsWith('ai'), position, ...overrides })
}

const order = makeSupportPlayerOrder({ id: 'support-1', maxDistance: 3, priority: 80 })

function state(overrides: Partial<GameState> = {}): GameState {
  return makeAiTestState({
    bases: [makeTestBase({ position: { row: 1, column: 1 } })],
    players: [player('ai-1', { row: 1, column: 1 }), makeTestHuman({ position: { row: 5, column: 5 } })],
    ...overrides,
  })
}

describe('AI 支援決策', () => {
  it('與目標距離超過限制時，移動靠近目標玩家', () => {
    const action = chooseSupportAction(state(), 'ai-1', order)
    expect(action.type).toBe('move')
  })

  it('目標玩家死亡時，停止執行支援命令', () => {
    const action = chooseSupportAction(state({
      players: [player('ai-1', { row: 1, column: 1 }), player('player-1', { row: 5, column: 5 }, { health: 0 })],
    }), 'ai-1', order)
    expect(action).toEqual({ type: 'end-turn', reason: 'command-paused' })
  })

  it('支援目標附近有威脅且 AI 相鄰時，優先攻擊', () => {
    const action = chooseSupportAction(state({
      players: [player('ai-1', { row: 5, column: 3 }), player('player-1', { row: 5, column: 5 })],
      creatures: [makeTestCreature({ position: { row: 5, column: 4 } })],
    }), 'ai-1', { ...order, maxDistance: 10 })
    expect(action).toEqual({ type: 'attack', targetId: 'creature-1', targetType: 'creature' })
  })

  it('阻擋 AI 前往支援目標的生物，即使遠離目標也會優先攻擊', () => {
    const action = chooseSupportAction(state({
      players: [player('ai-1', { row: 5, column: 3 }), player('player-1', { row: 5, column: 8 })],
      creatures: [makeTestCreature({ position: { row: 5, column: 4 } })],
    }), 'ai-1', { ...order, maxDistance: 3 })
    expect(action).toEqual({ type: 'attack', targetId: 'creature-1', targetType: 'creature' })
  })
})
