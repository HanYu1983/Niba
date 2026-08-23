import { describe, expect, it } from 'vitest'
import { getBuff } from './playerDerivedRules'
import { getFunctionalSkillBuffOverrides } from './functionalSkillScaling'

describe('功能型外功等級縮放', () => {
  it('燎原 Lv.1 保持基礎燃燒效果', () => {
    const definition = getBuff('scarlet-flame-burning')!
    expect(getFunctionalSkillBuffOverrides('burning', 1, definition)).toMatchObject({
      maxHealthDamagePercent: 0.2,
      remainingRounds: 3,
    })
  })

  it('燎原 Lv.3 提高燃燒比例並延長持續時間', () => {
    const definition = getBuff('scarlet-flame-burning')!
    expect(getFunctionalSkillBuffOverrides('burning', 3, definition)).toMatchObject({
      maxHealthDamagePercent: 0.26,
      remainingRounds: 4,
    })
  })

  it('淬毒 Lv.1 保持基礎腐骨毒效果', () => {
    const definition = getBuff('hundred-poison-rot')!
    expect(getFunctionalSkillBuffOverrides('poison', 1, definition)).toMatchObject({
      remainingRounds: 3,
    })
    const overrides = getFunctionalSkillBuffOverrides('poison', 1, definition)
    expect(overrides.maxHealthDamagePercent).toBeCloseTo(0.1, 10)
    expect(overrides.attributeMultiplier).toBeCloseTo(0.85, 10)
  })

  it('淬毒 Lv.3 提高中毒比例、加深五維減益並延長持續時間', () => {
    const definition = getBuff('hundred-poison-rot')!
    const overrides = getFunctionalSkillBuffOverrides('poison', 3, definition)
    expect(overrides.maxHealthDamagePercent).toBeCloseTo(0.13, 10)
    expect(overrides.attributeMultiplier).toBeCloseTo(0.805, 10)
    expect(overrides.remainingRounds).toBe(4)
  })

  it('寒毒 Lv.2 加深五維減益（乘數應下降而非上升）', () => {
    const definition = getBuff('frost-water-cold-poison')!
    const overrides = getFunctionalSkillBuffOverrides('attribute-reduction', 2, definition)
    expect(overrides.attributeMultiplier).toBeCloseTo(0.77, 10)
  })

  it('影匿 Lv.1 保持基礎迴避，Lv.3 每級 +3%', () => {
    const definition = getBuff('ghost-shadow-veil')!
    expect(getFunctionalSkillBuffOverrides('evasion', 1, definition)).toMatchObject({ evasionRateBonus: 15 })
    expect(getFunctionalSkillBuffOverrides('evasion', 3, definition)).toMatchObject({ evasionRateBonus: 21 })
  })

  it('行氣功 Lv.1 保持基礎體力回復，Lv.3 提升比例', () => {
    const definition = getBuff('jianghu-stamina-flow')!
    const lv1 = getFunctionalSkillBuffOverrides('stamina-regen', 1, definition)
    expect(lv1.staminaRegenPercent).toBeCloseTo(0.15, 10)
    expect(getFunctionalSkillBuffOverrides('stamina-regen', 3, definition).staminaRegenPercent).toBeCloseTo(0.195, 10)
  })

  it('潮息功 Lv.1 保持基礎內力回復，Lv.3 提升比例', () => {
    const definition = getBuff('jianghu-inner-tide')!
    const lv1 = getFunctionalSkillBuffOverrides('inner-power-regen', 1, definition)
    expect(lv1.innerPowerRegenPercent).toBeCloseTo(0.1, 10)
    expect(getFunctionalSkillBuffOverrides('inner-power-regen', 3, definition).innerPowerRegenPercent).toBeCloseTo(0.13, 10)
  })

  it('瞬發技與免疫不產生 Buff 覆寫（無綁定）', () => {
    expect(getFunctionalSkillBuffOverrides('cleanse', 5, getBuff('jianghu-stamina-flow')!)).toEqual({})
    expect(getFunctionalSkillBuffOverrides('recover', 5, getBuff('jianghu-stamina-flow')!)).toEqual({})
    expect(getFunctionalSkillBuffOverrides('berserk', 5, getBuff('jianghu-demonic-state')!)).toEqual({})
  })
})
