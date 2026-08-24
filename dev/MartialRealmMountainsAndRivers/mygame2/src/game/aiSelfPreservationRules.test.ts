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

describe('切片 K：policy emergency 參數化', () => {
  it('emergency.minimumHealthPercent 覆寫緊急血量門檻', () => {
    // 15/24 ≈ 62.5%，高於 order 門檻 30 → 平時不自保。
    const healthy = state({ players: [player({ health: 15 })] })
    expect(chooseSelfPreservationAction(healthy, 'ai-1', 30)).toBeNull()
    // policy 把門檻拉高到 70 → 觸發撤退。
    const action = chooseSelfPreservationAction(healthy, 'ai-1', 30, { minimumHealthPercent: 70 })
    expect(action?.type).toBe('move')
  })

  it('emergency.surroundedEnemyCount 覆寫包圍敵數門檻', () => {
    // 單一相鄰敵人：預設門檻 2 不觸發；policy 降到 1 → 觸發。
    const threatened = state({ creatures: [creature('c1', { row: 5, column: 4 })] })
    expect(chooseSelfPreservationAction(threatened, 'ai-1', 0)).toBeNull()
    const action = chooseSelfPreservationAction(threatened, 'ai-1', 0, { surroundedEnemyCount: 1 })
    expect(action?.type).toBe('move')
  })

  it('帶入內建 defensive-guardian 的 emergency（10／2）與既有常數行為完全一致', () => {
    const lowHealth = state({ players: [player({ health: 6 })] })
    const surrounded = state({ creatures: [creature('c1', { row: 5, column: 4 }), creature('c2', { row: 5, column: 6 })] })
    const calm = state()

    expect(chooseSelfPreservationAction(lowHealth, 'ai-1', 30, { minimumHealthPercent: 10, surroundedEnemyCount: 2 }))
      .toEqual(chooseSelfPreservationAction(lowHealth, 'ai-1', 30))
    expect(chooseSelfPreservationAction(surrounded, 'ai-1', 0, { minimumHealthPercent: 10, surroundedEnemyCount: 2 }))
      .toEqual(chooseSelfPreservationAction(surrounded, 'ai-1', 0))
    expect(chooseSelfPreservationAction(calm, 'ai-1', 30, { minimumHealthPercent: 10, surroundedEnemyCount: 2 }))
      .toEqual(chooseSelfPreservationAction(calm, 'ai-1', 30))
  })

  it('emergency 未提供欄位時逐項退回常數（fallback 路徑）', () => {
    // 只給 surroundedEnemyCount=1：血量門檻退回常數 10 → 8.3% 血仍觸發、62.5% 血不觸發。
    const hurt = state({ players: [player({ health: 2 })] })
    expect(chooseSelfPreservationAction(hurt, 'ai-1', 0, { surroundedEnemyCount: 1 })?.type).toBe('move')

    const healthy = state({ players: [player({ health: 15 })] })
    expect(chooseSelfPreservationAction(healthy, 'ai-1', 0, { surroundedEnemyCount: 1 })).toBeNull()
  })
})
