import { describe, expect, it } from 'vitest'
import { chooseDefenseAction, assessBaseThreats } from './aiDefenseRules'
import type { GameState, PlayerState } from './types'
import {
  makeAiTestState,
  makeProtectBaseOrder,
  makeTestCreature,
  makeTestPlayer,
} from './testHelpers/aiTestFixtures'

function makePlayer(overrides: Partial<PlayerState> = {}): PlayerState {
  return makeTestPlayer({ name: 'AI 守城者', stamina: 10, maxStamina: 10, ...overrides })
}

function makeState(overrides: Partial<GameState> = {}): GameState {
  return makeAiTestState({
    players: [makePlayer()],
    creatures: [makeTestCreature()],
    ...overrides,
  })
}

const protectOrder = makeProtectBaseOrder({ id: 'order-1' })

describe('AI 防守決策', () => {
  it('相鄰威脅時優先攻擊', () => {
    const state = makeState()
    const threats = assessBaseThreats(state, 'base-1', 'ai-1')
    expect(threats[0]?.directlyAttackingBase).toBe(true)
    expect(chooseDefenseAction(state, 'ai-1', protectOrder)).toEqual({ type: 'attack', targetId: 'creature-1', targetType: 'creature' })
  })

  it('AI 在防守半徑外且可移動時返回防守範圍', () => {
    const state = makeState({ players: [makePlayer({ position: { row: 1, column: 1 }, stamina: 20, maxStamina: 20 })], creatures: [] })
    const action = chooseDefenseAction(state, 'ai-1', protectOrder)
    expect(action.type).toBe('move')
    if (action.type === 'move') expect(Math.abs(action.position.row - 5) + Math.abs(action.position.column - 5)).toBeLessThanOrEqual(6)
  })

  it('沒有威脅時待命', () => {
    const state = makeState({ creatures: [] })
    expect(chooseDefenseAction(state, 'ai-1', protectOrder)).toEqual({ type: 'hold-position', reason: 'no-threat' })
  })

  it('命令暫停時不會繼續執行防守行動', () => {
    const state = makeState()
    expect(chooseDefenseAction(state, 'ai-1', { ...protectOrder, status: 'paused' })).toEqual({ type: 'end-turn', reason: 'command-paused' })
  })
})
