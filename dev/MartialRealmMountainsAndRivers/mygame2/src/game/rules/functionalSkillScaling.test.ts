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

  it('商道通鑑：買入折扣與賣出加成隨等級成長', () => {
    const definition = getBuff('merchant-way')!
    expect(getFunctionalSkillBuffOverrides('merchant-way', 1, definition)).toMatchObject({
      shopBuyPriceDiscount: 0.15,
      shopSellPriceBonus: 0.15,
    })
    expect(getFunctionalSkillBuffOverrides('merchant-way', 3, definition)).toMatchObject({
      shopBuyPriceDiscount: 0.21,
      shopSellPriceBonus: 0.21,
    })
  })

  it('天工開物：材料減免與聲望加成隨等級成長', () => {
    const definition = getBuff('heavenly-craftsman')!
    expect(getFunctionalSkillBuffOverrides('craftsmanship', 1, definition)).toMatchObject({
      buildingMaterialCostReduction: 0.25,
      buildingReputationBonus: 0.5,
    })
    expect(getFunctionalSkillBuffOverrides('craftsmanship', 3, definition)).toMatchObject({
      buildingMaterialCostReduction: 0.35,
      buildingReputationBonus: 0.7,
    })
  })

  it('靈植百草鑑：採集省體力與雙倍產出機率成長', () => {
    const definition = getBuff('spirit-herb-hundred-grass')!
    expect(getFunctionalSkillBuffOverrides('gathering', 1, definition)).toMatchObject({
      gatherStaminaCostReduction: 1,
      gatherDoubleYieldChance: 0.5,
    })
    expect(getFunctionalSkillBuffOverrides('gathering', 3, definition)).toMatchObject({
      gatherDoubleYieldChance: 0.6,
    })
  })

  it('神行八卦步：最大體力 +2，每級再 +1', () => {
    const definition = getBuff('divine-movement-eight-trigrams')!
    expect(getFunctionalSkillBuffOverrides('divine-movement', 1, definition)).toMatchObject({
      maxStaminaBonus: 2,
    })
    expect(getFunctionalSkillBuffOverrides('divine-movement', 3, definition)).toMatchObject({
      maxStaminaBonus: 4,
    })
  })

  it('太虛引氣：體力轉化內力比例隨等級成長', () => {
    const definition = getBuff('taixu-qi-conversion')!
    expect(getFunctionalSkillBuffOverrides('qi-conversion', 1, definition)).toMatchObject({
      staminaToInnerPowerRatio: 2,
    })
    expect(getFunctionalSkillBuffOverrides('qi-conversion', 3, definition)).toMatchObject({
      staminaToInnerPowerRatio: 4,
    })
  })

  it('幻影功：迴避率每級 +1%', () => {
    const definition = getBuff('phantom-step')!
    expect(getFunctionalSkillBuffOverrides('evasion', 1, definition)).toMatchObject({
      evasionRateBonus: 5,
    })
    expect(getFunctionalSkillBuffOverrides('evasion', 3, definition)).toMatchObject({
      evasionRateBonus: 7,
    })
  })

  it('回光功：復活血量比例每級 +5%，上限 100%', () => {
    const definition = getBuff('return-light')!
    expect(getFunctionalSkillBuffOverrides('revive-guard', 1, definition)).toMatchObject({
      reviveHealthPercent: 0.3,
    })
    expect(getFunctionalSkillBuffOverrides('revive-guard', 3, definition)).toMatchObject({
      reviveHealthPercent: 0.4,
    })
    expect(getFunctionalSkillBuffOverrides('revive-guard', 20, definition)).toMatchObject({
      reviveHealthPercent: 1,
    })
  })
})
