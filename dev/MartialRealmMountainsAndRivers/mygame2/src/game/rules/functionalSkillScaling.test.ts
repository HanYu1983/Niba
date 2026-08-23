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

  it('天眼望氣 Lv.1 視野 +1（ceil(Lv/3)）', () => {
    const definition = getBuff('sky-eye-vision')!
    expect(getFunctionalSkillBuffOverrides('vision-expansion', 1, definition)).toMatchObject({
      visionRadiusBonus: 1,
    })
  })

  it('天眼望氣 Lv.6 視野 +2（ceil(Lv/3)）', () => {
    const definition = getBuff('sky-eye-vision')!
    expect(getFunctionalSkillBuffOverrides('vision-expansion', 6, definition)).toMatchObject({
      visionRadiusBonus: 2,
    })
  })

  it('四兩千斤 Lv.1 外功內力消耗 -1，Lv.3 -3', () => {
    const definition = getBuff('four-ounces-thousand-pounds')!
    expect(getFunctionalSkillBuffOverrides('skill-cost-reduction', 1, definition)).toMatchObject({
      externalSkillInnerCostReduction: 1,
    })
    expect(getFunctionalSkillBuffOverrides('skill-cost-reduction', 3, definition)).toMatchObject({
      externalSkillInnerCostReduction: 3,
    })
  })
})
