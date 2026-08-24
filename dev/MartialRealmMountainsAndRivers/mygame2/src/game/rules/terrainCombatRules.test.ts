import { describe, expect, it } from 'vitest'
import {
  getTerrainAtPosition,
  getTerrainResonanceCriticalRateBonus,
  getTerrainResonanceDamageMultiplier,
  getTerrainResonanceInnerPowerDiscount,
  getTerrainResonanceLabel,
  isTerrainResonant,
  isTripleResonance,
} from './terrainCombatRules'

describe('天地共鳴規則', () => {
  it('親和地形觸發傷害與內力加成', () => {
    expect(isTerrainResonant('wood', 'forest')).toBe(true)
    expect(getTerrainResonanceDamageMultiplier('wood', 'forest')).toBe(1.25)
    expect(getTerrainResonanceInnerPowerDiscount('wood', 'forest')).toBe(1)
  })

  it('非親和地形不觸發加成', () => {
    expect(isTerrainResonant('wood', 'plain')).toBe(false)
    expect(getTerrainResonanceDamageMultiplier('wood', 'plain')).toBe(1)
    expect(getTerrainResonanceInnerPowerDiscount('wood', 'plain')).toBe(0)
    expect(getTerrainResonanceLabel('wood', 'plain')).toBeUndefined()
  })

  it('土屬性只在草地與厚土流共鳴', () => {
    expect(isTerrainResonant('earth', 'plain')).toBe(true)
    expect(isTerrainResonant('earth', 'mountain')).toBe(false)
  })

  it('金屬性在山嶽獲得額外暴擊率', () => {
    expect(getTerrainResonanceCriticalRateBonus('metal', 'mountain')).toBe(5)
    expect(getTerrainResonanceCriticalRateBonus('metal', 'plain')).toBe(0)
    expect(getTerrainResonanceCriticalRateBonus('earth', 'mountain')).toBe(0)
  })

  it('木屬性在森林可觸發追風回避共鳴', () => {
    expect(isTerrainResonant('wood', 'forest')).toBe(true)
  })

  it('可依位置查詢地形', () => {
    const cells = [
      { row: 1, column: 2, terrain: 'forest' as const },
      { row: 2, column: 2, terrain: 'plain' as const },
    ]
    expect(getTerrainAtPosition(cells, { row: 1, column: 2 })).toBe('forest')
    expect(getTerrainAtPosition(cells, { row: 9, column: 9 })).toBeUndefined()
  })
})

describe('三重共振判定', () => {
  it('同時滿足連攜＋共鳴＋相剋時觸發', () => {
    // 內功水生外功木；木在森林共鳴；木克土（目標 earth-mountain 為土系）
    expect(isTripleResonance({ innerElement: 'water', outerElement: 'wood', terrain: 'forest', targetSchoolId: 'earth-mountain' })).toBe(true)
  })

  it('缺少連攜時不觸發', () => {
    // 內功金生土（非木），故無連攜
    expect(isTripleResonance({ innerElement: 'metal', outerElement: 'wood', terrain: 'forest', targetSchoolId: 'earth-mountain' })).toBe(false)
  })

  it('缺少天地共鳴不觸發', () => {
    expect(isTripleResonance({ innerElement: 'water', outerElement: 'wood', terrain: 'plain', targetSchoolId: 'earth-mountain' })).toBe(false)
  })

  it('缺少相剋不觸發', () => {
    // 內功水生木，木在森林共鳴，但目標 swift-wind（木）；木不克木
    expect(isTripleResonance({ innerElement: 'water', outerElement: 'wood', terrain: 'forest', targetSchoolId: 'swift-wind' })).toBe(false)
  })

  it('太虛內功不觸發', () => {
    expect(isTripleResonance({ innerElement: 'none', outerElement: 'wood', terrain: 'forest', targetSchoolId: 'earth-mountain' })).toBe(false)
  })
})
