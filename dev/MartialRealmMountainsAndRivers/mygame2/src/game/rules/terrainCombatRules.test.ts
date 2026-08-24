import { describe, expect, it } from 'vitest'
import {
  getTerrainAtPosition,
  getTerrainResonanceCriticalRateBonus,
  getTerrainResonanceDamageMultiplier,
  getTerrainResonanceInnerPowerDiscount,
  getTerrainResonanceLabel,
  isTerrainResonant,
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
