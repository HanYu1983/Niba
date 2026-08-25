import { describe, expect, it } from 'vitest'
import {
  formatAuraEffect,
  getActiveAuraFields,
  getAuraDisplayEntries,
  getAuraEffectsAt,
  getNestAuraField,
  isWithinAura,
  resolveRoundEndAuraEffects,
  NEST_AURA_RADIUS,
} from './auraRules'
import type { BaseState, CreatureNestState, PlayerState } from '../types'

function makeNest(overrides: Partial<CreatureNestState> = {}): CreatureNestState {
  return {
    id: 'nest-1',
    name: '巢穴 1',
    position: { row: 5, column: 5 },
    health: 120,
    maxHealth: 120,
    spawnChance: 0.1,
    cooldownRounds: 0,
    spawnLevel: 1,
    ...overrides,
  }
}

function makeBase(overrides: Partial<BaseState> = {}): BaseState {
  return {
    id: 'base-1',
    name: '據點',
    position: { row: 0, column: 0 },
    buildings: [],
    buildingMaterials: 100,
    maxBuildingMaterials: 100,
    health: 100,
    maxHealth: 100,
    active: true,
    ...overrides,
  }
}

function makePlayer(overrides: Partial<PlayerState> = {}): PlayerState {
  return {
    id: 'player-1',
    name: '玩家',
    position: { row: 5, column: 5 },
    attributes: { armStrength: 8, constitution: 8, agility: 7, innerEnergy: 5, insight: 7 },
    innerSkillIds: ['tuna-gong'],
    innerSkillId: 'tuna-gong',
    externalSkillIds: [],
    equippedExternalSkillIds: [],
    health: 100,
    maxHealth: 100,
    stamina: 10,
    maxStamina: 10,
    innerPower: 20,
    maxInnerPower: 20,
    prestige: 0,
    money: 0,
    experience: 0,
    inventory: [],
    turnEnded: false,
    ...overrides,
  }
}

describe('巢穴靈氣場', () => {
  it('無屬性巢穴（未指定 dominantElement）不產生靈氣', () => {
    expect(getNestAuraField(makeNest())).toBeNull()
  })

  it('無屬性巢穴（dominantElement = none）不產生靈氣', () => {
    expect(getNestAuraField(makeNest({ dominantElement: 'none' }))).toBeNull()
  })

  it('火焰巢穴產生灼燒靈氣（每回合掉血 5%）', () => {
    const field = getNestAuraField(makeNest({ dominantElement: 'fire' }))
    expect(field).not.toBeNull()
    expect(field!.element).toBe('fire')
    expect(field!.radius).toBe(NEST_AURA_RADIUS)
    expect(field!.effects).toContainEqual({ kind: 'damage-over-time', magnitude: 0.05, target: 'player' })
  })

  it('金屬性巢穴產生金煞靈氣（每回合掉血 3%）', () => {
    const field = getNestAuraField(makeNest({ dominantElement: 'metal' }))
    expect(field!.effects).toContainEqual({ kind: 'damage-over-time', magnitude: 0.03, target: 'player' })
  })
})

describe('靈氣範圍判定', () => {
  it('曼哈頓距離在範圍內為 true', () => {
    const field = getNestAuraField(makeNest({ dominantElement: 'fire' }))!
    expect(isWithinAura(field, { row: 5, column: 5 })).toBe(true) // 中心
    expect(isWithinAura(field, { row: 7, column: 6 })).toBe(true) // 距離 3
  })

  it('曼哈頓距離超出範圍為 false', () => {
    const field = getNestAuraField(makeNest({ dominantElement: 'fire' }))!
    expect(isWithinAura(field, { row: 8, column: 6 })).toBe(false) // 距離 4
  })
})

describe('回合結束靈氣解析', () => {
  it('火焰巢穴範圍內玩家每回合掉血 5%', () => {
    const nest = makeNest({ dominantElement: 'fire' })
    const player = makePlayer({ position: { row: 5, column: 5 }, health: 100, maxHealth: 100 })
    const result = resolveRoundEndAuraEffects([], [nest], [player])
    expect(result[0].health).toBe(95)
  })

  it('範圍外玩家不受巢穴靈氣影響', () => {
    const nest = makeNest({ dominantElement: 'fire' })
    const player = makePlayer({ position: { row: 9, column: 9 }, health: 100, maxHealth: 100 })
    const result = resolveRoundEndAuraEffects([], [nest], [player])
    expect(result[0].health).toBe(100)
  })

  it('死亡巢穴（health = 0）不產生靈氣', () => {
    const nest = makeNest({ dominantElement: 'fire', health: 0 })
    const player = makePlayer({ position: { row: 5, column: 5 }, health: 100, maxHealth: 100 })
    const result = resolveRoundEndAuraEffects([], [nest], [player])
    expect(result[0].health).toBe(100)
  })

  it('防衛營範圍內玩家每回合回血（healthBonus 加總）', () => {
    const base = makeBase({
      buildings: [{ id: 'b1', type: 'barracks', name: '防衛營', description: '', constructionCost: 50, healthBonus: 10 }],
    })
    const player = makePlayer({ position: { row: 2, column: 2 }, health: 50, maxHealth: 100 })
    const result = resolveRoundEndAuraEffects([base], [], [player])
    expect(result[0].health).toBe(60)
  })

  it('防衛營範圍外玩家不回血', () => {
    const base = makeBase({
      buildings: [{ id: 'b1', type: 'barracks', name: '防衛營', description: '', constructionCost: 50, healthBonus: 10 }],
    })
    const player = makePlayer({ position: { row: 6, column: 6 }, health: 50, maxHealth: 100 })
    const result = resolveRoundEndAuraEffects([base], [], [player])
    expect(result[0].health).toBe(50)
  })

  it('失活據點（active = false）不產生防衛營回血', () => {
    const base = makeBase({
      active: false,
      buildings: [{ id: 'b1', type: 'barracks', name: '防衛營', description: '', constructionCost: 50, healthBonus: 10 }],
    })
    const player = makePlayer({ position: { row: 2, column: 2 }, health: 50, maxHealth: 100 })
    const result = resolveRoundEndAuraEffects([base], [], [player])
    expect(result[0].health).toBe(50)
  })

  it('正負靈氣共存：回血與掉血獨立結算後合併', () => {
    const base = makeBase({
      position: { row: 5, column: 5 },
      buildings: [{ id: 'b1', type: 'barracks', name: '防衛營', description: '', constructionCost: 50, healthBonus: 10 }],
    })
    const nest = makeNest({ dominantElement: 'fire' })
    // 玩家同時在防衛營（+10）與火焰巢穴（-5%）範圍內，起始 90 血
    const player = makePlayer({ position: { row: 5, column: 5 }, health: 90, maxHealth: 100 })
    const result = resolveRoundEndAuraEffects([base], [nest], [player])
    expect(result[0].health).toBe(95)
  })

  it('死亡玩家不受靈氣影響', () => {
    const nest = makeNest({ dominantElement: 'fire' })
    const player = makePlayer({ position: { row: 5, column: 5 }, health: 0, maxHealth: 100 })
    const result = resolveRoundEndAuraEffects([], [nest], [player])
    expect(result[0].health).toBe(0)
  })
})

describe('getActiveAuraFields / getAuraEffectsAt', () => {
  it('收集活躍巢穴與防衛營的靈氣場', () => {
    const nest = makeNest({ dominantElement: 'fire' })
    const base = makeBase({
      buildings: [{ id: 'b1', type: 'barracks', name: '防衛營', description: '', constructionCost: 50, healthBonus: 10 }],
    })
    const fields = getActiveAuraFields({ bases: [base], creatureNests: [nest] } as never)
    expect(fields).toHaveLength(2)
  })

  it('getAuraEffectsAt 依目標類型過濾', () => {
    const nest = makeNest({ dominantElement: 'fire' })
    const effects = getAuraEffectsAt({ bases: [], creatureNests: [nest] } as never, { row: 5, column: 5 }, 'player')
    expect(effects).toContainEqual({ kind: 'damage-over-time', magnitude: 0.05, target: 'player' })
  })
})

describe('getAuraDisplayEntries / formatAuraEffect', () => {
  it('formatAuraEffect 產生可讀描述', () => {
    expect(formatAuraEffect('damage-over-time', 0.05)).toBe('每回合損失最大生命 5%')
    expect(formatAuraEffect('heal-over-time', 10)).toBe('每回合回復 10 氣血')
  })

  it('getAuraDisplayEntries 回傳含來源名稱的顯示條目', () => {
    const nest = makeNest({ id: 'nest-1', name: '火焰巢穴', dominantElement: 'fire' })
    const entries = getAuraDisplayEntries({ bases: [], creatureNests: [nest] } as never, { row: 5, column: 5 }, 'player')
    expect(entries).toHaveLength(1)
    expect(entries[0]).toMatchObject({
      sourceId: 'nest-1',
      sourceName: '火焰巢穴',
      element: 'fire',
      kind: 'damage-over-time',
      description: '每回合損失最大生命 5%',
    })
  })

  it('getAuraDisplayEntries 範圍外回傳空陣列', () => {
    const nest = makeNest({ id: 'nest-1', name: '火焰巢穴', dominantElement: 'fire' })
    const entries = getAuraDisplayEntries({ bases: [], creatureNests: [nest] } as never, { row: 9, column: 9 }, 'player')
    expect(entries).toHaveLength(0)
  })

  it('getAuraDisplayEntries 防衛營來源名稱含「防衛營」', () => {
    const base = makeBase({
      id: 'base-1',
      name: '據點',
      position: { row: 5, column: 5 },
      buildings: [{ id: 'b1', type: 'barracks', name: '防衛營', description: '', constructionCost: 50, healthBonus: 10 }],
    })
    const entries = getAuraDisplayEntries({ bases: [base], creatureNests: [] } as never, { row: 5, column: 5 }, 'player')
    expect(entries[0].sourceName).toBe('據點·防衛營')
    expect(entries[0].description).toBe('每回合回復 10 氣血')
  })
})
