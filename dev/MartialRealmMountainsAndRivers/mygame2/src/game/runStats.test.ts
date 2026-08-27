import { describe, expect, it } from 'vitest'
import {
  addMoneySpent,
  bumpRunStatMax,
  createEmptyRunStats,
  incrementRunStat,
  recordDamageDealt,
  recordMaxLevel,
} from './runStats'
import type { GameState } from './types'

function makeState(overrides: Partial<GameState> = {}): GameState {
  return {
    map: { rows: 5, columns: 5, cells: [] },
    bases: [],
    creatureNests: [],
    resourcePoints: [],
    itemPoints: [],
    players: [],
    creatures: [],
    activePlayerId: 'player-1',
    round: 1,
    creatureActionLogs: [],
    attackPreview: null,
    externalSkillPreview: null,
    creatureTurnInProgress: false,
    activeCreatureId: null,
    operation: { type: 'idle' },
    blockingModal: null,
    ...overrides,
  }
}

describe('createEmptyRunStats', () => {
  it('所有數值欄位為 0，五維快照為 null', () => {
    const stats = createEmptyRunStats()
    expect(stats.creaturesDefeated).toBe(0)
    expect(stats.moneySpent).toBe(0)
    expect(stats.maxLevelReached).toBe(0)
    expect(stats.attributesAtMaxLevel).toBeNull()
  })
})

describe('incrementRunStat', () => {
  it('累加指定欄位', () => {
    const state = incrementRunStat(makeState(), 'creaturesDefeated')
    expect(state.runStats?.creaturesDefeated).toBe(1)
    const twice = incrementRunStat(state, 'creaturesDefeated', 3)
    expect(twice.runStats?.creaturesDefeated).toBe(4)
  })

  it('runStats 未初始化時自動建立', () => {
    const state = incrementRunStat(makeState(), 'eventsResolved')
    expect(state.runStats?.eventsResolved).toBe(1)
  })
})

describe('bumpRunStatMax', () => {
  it('取較大值更新峰值', () => {
    const state = bumpRunStatMax(makeState(), 'maxNormalAttackDamage', 50)
    expect(state.runStats?.maxNormalAttackDamage).toBe(50)
    const lower = bumpRunStatMax(state, 'maxNormalAttackDamage', 30)
    expect(lower.runStats?.maxNormalAttackDamage).toBe(50)
    const higher = bumpRunStatMax(state, 'maxNormalAttackDamage', 80)
    expect(higher.runStats?.maxNormalAttackDamage).toBe(80)
  })
})

describe('addMoneySpent', () => {
  it('累加金錢消費', () => {
    const state = addMoneySpent(makeState(), 30)
    expect(state.runStats?.moneySpent).toBe(30)
    const next = addMoneySpent(state, 20)
    expect(next.runStats?.moneySpent).toBe(50)
  })

  it('非正數不累加（回傳原 state）', () => {
    const state = addMoneySpent(makeState(), 0)
    expect(state.runStats).toBeUndefined()
  })
})

describe('recordDamageDealt（單回合最高傷害）', () => {
  it('回合內累加傷害並刷新峰值', () => {
    let state = recordDamageDealt(makeState(), 30)
    expect(state.damageDealtThisRound).toBe(30)
    expect(state.runStats?.maxDamageInSingleRound).toBe(30)
    // 同回合第二擊：累積 30 + 20 = 50，峰值刷新。
    state = recordDamageDealt(state, 20)
    expect(state.damageDealtThisRound).toBe(50)
    expect(state.runStats?.maxDamageInSingleRound).toBe(50)
  })

  it('新回合歸零後峰值保留較高者', () => {
    let state = recordDamageDealt(makeState(), 50)
    // 模擬回合開始歸零（startPlayerTurn 行為）。
    state = { ...state, damageDealtThisRound: 0 }
    state = recordDamageDealt(state, 20)
    expect(state.damageDealtThisRound).toBe(20)
    expect(state.runStats?.maxDamageInSingleRound).toBe(50)
  })

  it('非正數傷害不累加', () => {
    const state = recordDamageDealt(makeState(), 0)
    expect(state.damageDealtThisRound).toBeUndefined()
    expect(state.runStats).toBeUndefined()
  })
})

describe('recordMaxLevel', () => {
  it('等級刷新峰值時記錄等級與五維快照', () => {
    const state = recordMaxLevel(makeState(), 3, { armStrength: 10, constitution: 9, agility: 8, innerEnergy: 7, insight: 6 })
    expect(state.runStats?.maxLevelReached).toBe(3)
    expect(state.runStats?.attributesAtMaxLevel).toEqual({ armStrength: 10, constitution: 9, agility: 8, innerEnergy: 7, insight: 6 })
  })

  it('等級未超過峰值時不更新', () => {
    const state = recordMaxLevel(makeState(), 3, { armStrength: 10, constitution: 9, agility: 8, innerEnergy: 7, insight: 6 })
    const unchanged = recordMaxLevel(state, 2, { armStrength: 1, constitution: 1, agility: 1, innerEnergy: 1, insight: 1 })
    expect(unchanged.runStats?.maxLevelReached).toBe(3)
    expect(unchanged.runStats?.attributesAtMaxLevel?.armStrength).toBe(10)
  })
})
