import { describe, expect, it } from 'vitest'
import { FIVE_ELEMENTS, FIVE_ELEMENTS_COUNTERS_CYCLE, FIVE_ELEMENT_BY_KEY, type FiveElementMeta } from './fiveElements'

describe('五行展示資料（fiveElements）', () => {
  it('包含五個非 none 元素，且順序為相生環（木→火→土→金→水→木）', () => {
    expect(FIVE_ELEMENTS.map((e) => e.key)).toEqual(['wood', 'fire', 'earth', 'metal', 'water'])
    // 依序檢查：每個元素「生」下一個元素，最後一個「生」回第一個（金）
    for (let i = 0; i < FIVE_ELEMENTS.length; i++) {
      const current = FIVE_ELEMENTS[i]
      const next = FIVE_ELEMENTS[(i + 1) % FIVE_ELEMENTS.length]
      expect(current.generates).toBe(next.key)
    }
    expect(FIVE_ELEMENTS[FIVE_ELEMENTS.length - 1].generates).toBe('wood')
  })

  it('相剋對照正確：金屬克木、木克土、土克水、水克火、火克金', () => {
    const byKey: Record<string, FiveElementMeta> = Object.fromEntries(
      FIVE_ELEMENTS.map((e) => [e.key, e]),
    )
    expect(byKey.metal.counters).toBe('wood')
    expect(byKey.wood.counters).toBe('earth')
    expect(byKey.earth.counters).toBe('water')
    expect(byKey.water.counters).toBe('fire')
    expect(byKey.fire.counters).toBe('metal')
  })

  it('每個元素都有獨立的 key、label、icon、color', () => {
    const keys = new Set(FIVE_ELEMENTS.map((e) => e.key))
    expect(keys.size).toBe(5)
    for (const e of FIVE_ELEMENTS) {
      expect(e.label).toBeTruthy()
      expect(e.icon).toBeTruthy()
      expect(e.color).toMatch(/^#[0-9a-fA-F]{6}$/)
    }
  })

  it('FIVE_ELEMENT_BY_KEY 索引完整且正確', () => {
    for (const e of FIVE_ELEMENTS) {
      expect(FIVE_ELEMENT_BY_KEY[e.key]).toEqual(e)
    }
    expect(Object.keys(FIVE_ELEMENT_BY_KEY).length).toBe(5)
  })

  it('相剋環 FIVE_ELEMENTS_COUNTERS_CYCLE 依金→木→土→水→火→金排列且閉合', () => {
    expect(FIVE_ELEMENTS_COUNTERS_CYCLE.map((e) => e.key)).toEqual(['metal', 'wood', 'earth', 'water', 'fire'])
    for (let i = 0; i < FIVE_ELEMENTS_COUNTERS_CYCLE.length; i++) {
      const current = FIVE_ELEMENTS_COUNTERS_CYCLE[i]
      const next = FIVE_ELEMENTS_COUNTERS_CYCLE[(i + 1) % FIVE_ELEMENTS_COUNTERS_CYCLE.length]
      expect(current.counters).toBe(next.key)
    }
    expect(FIVE_ELEMENTS_COUNTERS_CYCLE[FIVE_ELEMENTS_COUNTERS_CYCLE.length - 1].counters).toBe('metal')
  })

  it('與 skillRules 的相生/相剋邏輯一致（抽驗）', () => {
    // 相生：木生火、火生土、土生金、金生水、水生木
    for (const [generator, generated] of [
      ['wood', 'fire'],
      ['fire', 'earth'],
      ['earth', 'metal'],
      ['metal', 'water'],
      ['water', 'wood'],
    ] as const) {
      expect(FIVE_ELEMENT_BY_KEY[generator].generates).toBe(generated)
    }
    // 相剋：金克木、水克火、火克金
    for (const [attacker, defender] of [
      ['metal', 'wood'],
      ['wood', 'earth'],
      ['earth', 'water'],
      ['water', 'fire'],
      ['fire', 'metal'],
    ] as const) {
      expect(FIVE_ELEMENT_BY_KEY[attacker].counters).toBe(defender)
    }
  })
})