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
