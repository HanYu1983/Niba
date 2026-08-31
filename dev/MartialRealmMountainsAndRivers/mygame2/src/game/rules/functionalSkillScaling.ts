import type { FunctionalExternalSkillEffect } from '../catalogs/functionalSkillRegistry'
import type { BuffDefinition } from '../catalogs/buffCatalog'
import type { BuffInstance } from '../types'

const LEVEL_SCALE = 0.15

function scaledPercent(value: number | undefined, level: number): number | undefined {
  return value === undefined ? undefined : value * (1 + Math.max(0, level - 1) * LEVEL_SCALE)
}

/**
 * 計算功能型外功依功法等級產生的 Buff 實例覆寫值。
 * Lv.1 保持目錄原始效果；固定主場與內功 Buff 不經過此函式。
 */
export function getFunctionalSkillBuffOverrides(
  effect: FunctionalExternalSkillEffect | undefined,
  skillLevel: number,
  definition: BuffDefinition,
): Partial<BuffInstance> {
  const level = Math.max(1, Math.floor(skillLevel))
  const levelDelta = level - 1
  const overrides: Partial<BuffInstance> = {}

  if (effect === 'critical-rate' && definition.criticalRateBonus !== undefined) {
    overrides.criticalRateBonus = definition.criticalRateBonus + levelDelta * 5
  }
  if (effect === 'burning') {
    overrides.maxHealthDamagePercent = scaledPercent(definition.maxHealthDamagePercent, level)
    if (definition.durationRounds !== undefined) {
      overrides.remainingRounds = definition.durationRounds + Math.floor(levelDelta / 2)
    }
  }
  if (effect === 'attribute-reduction') overrides.attributeMultiplier = scaledPercent(definition.attributeMultiplier, level)
  if (effect === 'reflection') overrides.reflectionPercent = scaledPercent(definition.reflectionPercent, level)
  if (effect === 'health-regen') overrides.healthRegenPercent = scaledPercent(definition.healthRegenPercent, level)

  // ── 江湖常駐靈氣：數值減半 + 加法式等級公式（Lv.1 = 減半基礎值） ──
  if (effect) {
    const jianghuPercent = JIANGHU_ADDITIVE_PERCENT[effect]
    if (jianghuPercent && definition[jianghuPercent.field] !== undefined) {
      overrides[jianghuPercent.field] = jianghuPercent.base + levelDelta * jianghuPercent.step
    }
    const jianghuConditional = JIANGHU_ADDITIVE_CONDITIONAL[effect]
    if (jianghuConditional) {
      overrides.conditional = {
        when: jianghuConditional.when,
        threshold: jianghuConditional.threshold,
        multiplier: jianghuConditional.base + levelDelta * jianghuConditional.step,
      }
    }
  }
  if (effect === 'terrain-adaptation') overrides.terrainCostOverride = definition.terrainCostOverride
  if (effect === 'basic-attack-stamina-reduction') overrides.basicAttackStaminaCostReduction = definition.basicAttackStaminaCostReduction
  if (effect?.endsWith('-step')) overrides.evasionRateBonus = (definition.evasionRateBonus ?? 0) + levelDelta
  // 悟性輔助功法
  if (effect === 'vision-expansion') overrides.visionRadiusBonus = Math.ceil(level / 3)
  if (effect === 'skill-cost-reduction' && definition.externalSkillInnerCostReduction !== undefined) {
    overrides.externalSkillInnerCostReduction = definition.externalSkillInnerCostReduction + levelDelta
  }
  if (effect === 'merchant-way') {
    if (definition.shopBuyPriceDiscount !== undefined) overrides.shopBuyPriceDiscount = 0.15 + levelDelta * 0.03
    if (definition.shopSellPriceBonus !== undefined) overrides.shopSellPriceBonus = 0.15 + levelDelta * 0.03
  }
  if (effect === 'craftsmanship') {
    if (definition.buildingMaterialCostReduction !== undefined) overrides.buildingMaterialCostReduction = 0.25 + levelDelta * 0.05
    if (definition.buildingReputationBonus !== undefined) overrides.buildingReputationBonus = 0.5 + levelDelta * 0.1
  }
  if (effect === 'gathering') {
    if (definition.gatherStaminaCostReduction !== undefined) overrides.gatherStaminaCostReduction = 1 + Math.floor(levelDelta / 2)
    if (definition.gatherDoubleYieldChance !== undefined) overrides.gatherDoubleYieldChance = 0.5 + levelDelta * 0.05
  }
  if (effect === 'divine-movement') {
    overrides.maxStaminaBonus = 2 + levelDelta
  }
  if (effect === 'qi-conversion') {
    overrides.staminaToInnerPowerRatio = 2 + levelDelta
  }
  // 江湖線：迴避與保命（幻影功／回光功）
  if (effect === 'evasion') {
    overrides.evasionRateBonus = (definition.evasionRateBonus ?? 0) + levelDelta
  }
  if (effect === 'revive-guard' && definition.reviveHealthPercent !== undefined) {
    overrides.reviveHealthPercent = Math.min(1, definition.reviveHealthPercent + levelDelta * 0.05)
  }

  return Object.fromEntries(Object.entries(overrides).filter(([, value]) => value !== undefined))
}

/**
 * 依「功法 id」為沒有 functionalEffect 的門派／專屬靈氣功法縮放 Buff 數值。
 *
 * 這些功法原本只透過 passiveBuffIds 掛載固定值 Buff，不隨功法等級成長。
 * 為讓升級有實質回饋，這裡依功法 id 直接縮放對應 Buff 欄位。
 * 有 functionalEffect 的功法（江湖／悟性輔助）走 getFunctionalSkillBuffOverrides，不在此處理。
 */
export function getAuraSkillLevelOverrides(
  skillId: string,
  level: number,
  definition: BuffDefinition,
): Partial<BuffInstance> {
  const levelDelta = Math.max(1, Math.floor(level)) - 1
  const overrides: Partial<BuffInstance> = {}

  switch (skillId) {
    // 太虛流·迴氣（悟道）：功法經驗 +20% → 每級 +2%
    case 'void-spirit-external-functional':
      if (definition.skillExpGainPercent !== undefined) overrides.skillExpGainPercent = 0.2 + levelDelta * 0.02
      break
    // 銳鋒流·劍心明鑑：視野 +2 → 每級 +1
    case 'sharp-edge-external-functional':
      if (definition.visionRadiusBonus !== undefined) overrides.visionRadiusBonus = definition.visionRadiusBonus + levelDelta
      break
    // 銳鋒流·凌厲劍勢：普攻傷害 +10% → 每級 +2%
    case 'sharp-edge-external-functional-2':
      if (definition.damageDealtPercent !== undefined) overrides.damageDealtPercent = 0.1 + levelDelta * 0.02
      break
    // 煙雨流·雨潤回春：每回合回內力 10% → 每級 +5%
    case 'misty-rain-external-functional':
      if (definition.innerPowerRegenPercent !== undefined) overrides.innerPowerRegenPercent = 0.1 + levelDelta * 0.05
      break
    // 煙雨流·雨幕遮身：受到傷害 -10% → 每級 +2%
    case 'misty-rain-external-functional-2':
      if (definition.damageReductionPercent !== undefined) overrides.damageReductionPercent = 0.1 + levelDelta * 0.02
      break
    // 烈陽流·烈陽戰意：臂力根骨 +3 → 每級 +1
    case 'blazing-sun-external-functional':
      if (definition.attributeModifiers) {
        overrides.attributeModifiers = {
          armStrength: (definition.attributeModifiers.armStrength ?? 0) + levelDelta,
          constitution: (definition.attributeModifiers.constitution ?? 0) + levelDelta,
        }
      }
      break
    // 烈陽流·烈目凝芒：暴擊率 ×1.25 → 每級 +0.05
    case 'blazing-sun-external-functional-2':
      if (definition.criticalRateMultiplier !== undefined) overrides.criticalRateMultiplier = 1.25 + levelDelta * 0.05
      break
    // 黃土流·夯土工事：建材消耗 -15% → 每級 +3%
    case 'yellow-earth-external-functional':
      if (definition.buildingMaterialCostReduction !== undefined) overrides.buildingMaterialCostReduction = 0.15 + levelDelta * 0.03
      break
    // 黃土流·負重健行：最大體力 +4 → 每級 +1
    case 'yellow-earth-external-functional-2':
      if (definition.maxStaminaBonus !== undefined) overrides.maxStaminaBonus = definition.maxStaminaBonus + levelDelta
      break
    // 幽影流·幽影蔽身：回避率 +10% → 每級 +2%
    case 'ghost-shadow-external-functional':
      if (definition.evasionRateBonus !== undefined) overrides.evasionRateBonus = definition.evasionRateBonus + levelDelta * 2
      break
    // 幽影流·孤影決絕：血<25% 五維 ×1.6 → 每級 +0.05
    case 'ghost-shadow-external-functional-2':
      if (definition.conditional) {
        overrides.conditional = {
          when: definition.conditional.when,
          threshold: definition.conditional.threshold,
          multiplier: 1.6 + levelDelta * 0.05,
        }
      }
      break
    // 凌淵·江河長養：每回合回血 10% → 每級 +2%
    case 'lingyuan-rivers-sustain':
      if (definition.healthRegenPercent !== undefined) overrides.healthRegenPercent = 0.1 + levelDelta * 0.02
      break
  }

  return Object.fromEntries(Object.entries(overrides).filter(([, value]) => value !== undefined))
}

type JiāngHuPercentField =
  | 'lifestealPercent'
  | 'damageReductionPercent'
  | 'innerPowerHealthRegenPercent'
  | 'innerPowerLeechPercent'
  | 'damageDealtPercent'
  | 'externalSkillDamagePercent'

/** 江湖常駐效果：非條件型。`base` 為減半後基礎值，`step` 為每等級增量（Lv.1 = base）。 */
const JIANGHU_ADDITIVE_PERCENT: Partial<Record<FunctionalExternalSkillEffect, { field: JiāngHuPercentField; base: number; step: number }>> = {
  lifesteal: { field: 'lifestealPercent', base: 0.15, step: 0.02 },
  'damage-reduction': { field: 'damageReductionPercent', base: 0.1, step: 0.02 },
  'inner-power-health-regen': { field: 'innerPowerHealthRegenPercent', base: 0.05, step: 0.01 },
  'inner-power-leech': { field: 'innerPowerLeechPercent', base: 0.08, step: 0.015 },
  'damage-dealt': { field: 'damageDealtPercent', base: 0.1, step: 0.02 },
  'external-skill-damage': { field: 'externalSkillDamagePercent', base: 0.1, step: 0.02 },
}

/** 江湖常駐效果：條件型，等級僅縮放倍率，門檻固定。 */
const JIANGHU_ADDITIVE_CONDITIONAL: Partial<Record<FunctionalExternalSkillEffect, { when: 'health-below' | 'health-above'; threshold: number; base: number; step: number }>> = {
  'back-to-water': { when: 'health-below', threshold: 0.3, base: 1.25, step: 0.05 },
  'nurture-qi': { when: 'health-above', threshold: 0.8, base: 1.1, step: 0.05 },
  'all-in': { when: 'health-below', threshold: 0.15, base: 1.5, step: 0.1 },
}
