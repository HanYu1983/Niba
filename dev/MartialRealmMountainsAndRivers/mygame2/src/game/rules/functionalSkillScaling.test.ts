import { describe, expect, it } from 'vitest'
import { getBuff } from './playerDerivedRules'
import { getAuraSkillLevelOverrides, getFunctionalSkillBuffOverrides } from './functionalSkillScaling'

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

describe('門派／專屬靈氣功法等級縮放（getAuraSkillLevelOverrides）', () => {
  it('太虛流·迴氣悟道：功法經驗 +20%，每級 +2%', () => {
    const definition = getBuff('void-spirit-return-qi')!
    expect(getAuraSkillLevelOverrides('void-spirit-external-functional', 1, definition)).toMatchObject({
      skillExpGainPercent: 0.2,
    })
    expect(getAuraSkillLevelOverrides('void-spirit-external-functional', 3, definition).skillExpGainPercent).toBeCloseTo(0.24)
  })

  it('銳鋒流·劍心明鑑：視野 +2，每級 +1', () => {
    const definition = getBuff('sharp-edge-sword-heart')!
    expect(getAuraSkillLevelOverrides('sharp-edge-external-functional', 1, definition)).toMatchObject({
      visionRadiusBonus: 2,
    })
    expect(getAuraSkillLevelOverrides('sharp-edge-external-functional', 3, definition)).toMatchObject({
      visionRadiusBonus: 4,
    })
  })

  it('銳鋒流·凌厲劍勢：普攻傷害 +10%，每級 +2%', () => {
    const definition = getBuff('sharp-edge-keen-edge')!
    expect(getAuraSkillLevelOverrides('sharp-edge-external-functional-2', 1, definition)).toMatchObject({
      damageDealtPercent: 0.1,
    })
    expect(getAuraSkillLevelOverrides('sharp-edge-external-functional-2', 3, definition)).toMatchObject({
      damageDealtPercent: 0.14,
    })
  })

  it('煙雨流·雨潤回春：回內力 10%，每級 +5%', () => {
    const definition = getBuff('misty-rain-drizzle-nourish')!
    expect(getAuraSkillLevelOverrides('misty-rain-external-functional', 1, definition)).toMatchObject({
      innerPowerRegenPercent: 0.1,
    })
    expect(getAuraSkillLevelOverrides('misty-rain-external-functional', 3, definition).innerPowerRegenPercent).toBeCloseTo(0.2)
  })

  it('煙雨流·雨幕遮身：減傷 10%，每級 +2%', () => {
    const definition = getBuff('misty-rain-rain-curtain')!
    expect(getAuraSkillLevelOverrides('misty-rain-external-functional-2', 1, definition)).toMatchObject({
      damageReductionPercent: 0.1,
    })
    expect(getAuraSkillLevelOverrides('misty-rain-external-functional-2', 3, definition)).toMatchObject({
      damageReductionPercent: 0.14,
    })
  })

  it('烈陽流·烈陽戰意：臂力根骨 +3，每級 +1', () => {
    const definition = getBuff('blazing-sun-fervor')!
    expect(getAuraSkillLevelOverrides('blazing-sun-external-functional', 1, definition)).toMatchObject({
      attributeModifiers: { armStrength: 3, constitution: 3 },
    })
    expect(getAuraSkillLevelOverrides('blazing-sun-external-functional', 3, definition)).toMatchObject({
      attributeModifiers: { armStrength: 5, constitution: 5 },
    })
  })

  it('烈陽流·烈目凝芒：暴擊率 ×1.25，每級 +0.05', () => {
    const definition = getBuff('blazing-sun-blazing-gaze')!
    expect(getAuraSkillLevelOverrides('blazing-sun-external-functional-2', 1, definition)).toMatchObject({
      criticalRateMultiplier: 1.25,
    })
    expect(getAuraSkillLevelOverrides('blazing-sun-external-functional-2', 3, definition)).toMatchObject({
      criticalRateMultiplier: 1.35,
    })
  })

  it('黃土流·夯土工事：建材 -15%，每級 +3%', () => {
    const definition = getBuff('yellow-earth-rammed-earth')!
    expect(getAuraSkillLevelOverrides('yellow-earth-external-functional', 1, definition)).toMatchObject({
      buildingMaterialCostReduction: 0.15,
    })
    expect(getAuraSkillLevelOverrides('yellow-earth-external-functional', 3, definition)).toMatchObject({
      buildingMaterialCostReduction: 0.21,
    })
  })

  it('黃土流·負重健行：最大體力 +4，每級 +1', () => {
    const definition = getBuff('yellow-earth-pack-march')!
    expect(getAuraSkillLevelOverrides('yellow-earth-external-functional-2', 1, definition)).toMatchObject({
      maxStaminaBonus: 4,
    })
    expect(getAuraSkillLevelOverrides('yellow-earth-external-functional-2', 3, definition)).toMatchObject({
      maxStaminaBonus: 6,
    })
  })

  it('幽影流·幽影蔽身：回避率 +10%，每級 +2%', () => {
    const definition = getBuff('ghost-shadow-shadow-veil')!
    expect(getAuraSkillLevelOverrides('ghost-shadow-external-functional', 1, definition)).toMatchObject({
      evasionRateBonus: 10,
    })
    expect(getAuraSkillLevelOverrides('ghost-shadow-external-functional', 3, definition)).toMatchObject({
      evasionRateBonus: 14,
    })
  })

  it('幽影流·孤影決絕：血<25% 五維 ×1.6，每級 +0.05', () => {
    const definition = getBuff('ghost-shadow-lone-resolve')!
    expect(getAuraSkillLevelOverrides('ghost-shadow-external-functional-2', 1, definition)).toMatchObject({
      conditional: { when: 'health-below', threshold: 0.25, multiplier: 1.6 },
    })
    expect(getAuraSkillLevelOverrides('ghost-shadow-external-functional-2', 3, definition).conditional?.multiplier).toBeCloseTo(1.7)
  })

  it('凌淵·江河長養：回血 10%，每級 +2%', () => {
    const definition = getBuff('spring-return-art')!
    expect(getAuraSkillLevelOverrides('lingyuan-rivers-sustain', 1, definition)).toMatchObject({
      healthRegenPercent: 0.1,
    })
    expect(getAuraSkillLevelOverrides('lingyuan-rivers-sustain', 3, definition).healthRegenPercent).toBeCloseTo(0.14)
  })
})
