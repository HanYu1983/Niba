import { describe, expect, it } from 'vitest'
import { getTalentBuffs, getTalent, getAvailableTalents } from './talentCatalog'

describe('talentCatalog', () => {
  it('回傳可選用的天賦（皆為 MVP passive-buff）', () => {
    const available = getAvailableTalents()
    expect(available.length).toBeGreaterThan(0)
    for (const talent of available) {
      expect(talent.available).toBe(true)
      expect(talent.effects.length).toBeGreaterThan(0)
      // MVP 僅支援 passive-buff 原語，所有可用效果必須是該 kind。
      for (const effect of talent.effects) {
        expect(effect.kind).toBe('passive-buff')
      }
    }
  })

  it('getTalent 依 id 查詢；未知 id 回傳 undefined', () => {
    expect(getTalent('cartographer')?.name).toBe('製圖師')
    expect(getTalent('nonexistent')).toBeUndefined()
  })

  it('getTalentBuffs 將天賦轉為常駐 buff', () => {
    const buffs = getTalentBuffs(['cartographer'])
    expect(buffs).toHaveLength(1)
    const buff = buffs[0]
    expect(buff.definitionId).toBe('talent-cartographer-vision')
    expect(buff.sourceId).toBe('cartographer')
    // 天賦 buff 為常駐，永不淘汰。
    expect(buff.remainingRounds).toBeNull()
    expect(buff.id.startsWith('talent:cartographer:')).toBe(true)
  })

  it('多個天賦合併為多個 buff；未知天賦忽略', () => {
    const buffs = getTalentBuffs(['cartographer', 'scavenger', 'nope'])
    const ids = buffs.map((b) => b.definitionId)
    expect(ids).toContain('talent-cartographer-vision')
    expect(ids).toContain('talent-scavenger-gather')
    expect(buffs).toHaveLength(2)
  })

  it('空天賦清單回傳空陣列', () => {
    expect(getTalentBuffs([])).toEqual([])
  })
})