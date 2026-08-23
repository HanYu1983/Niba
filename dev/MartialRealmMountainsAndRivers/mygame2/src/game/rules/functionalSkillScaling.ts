import type { FunctionalExternalSkillEffect } from '../catalogs/functionalSkillRegistry'
import type { BuffDefinition } from '../catalogs/buffCatalog'
import type { BuffInstance } from '../types'

const LEVEL_SCALE = 0.15

function scaledPercent(value: number | undefined, level: number): number | undefined {
  return value === undefined ? undefined : value * (1 + Math.max(0, level - 1) * LEVEL_SCALE)
}

/** 減益乘數隨等級加深：放大「削減幅度」使乘數趨近 0（更強），Lv.1 保持原值。 */
function deepenedMultiplier(value: number | undefined, level: number): number | undefined {
  if (value === undefined) return undefined
  const reduction = Math.min(1, (1 - value) * (1 + Math.max(0, level - 1) * LEVEL_SCALE))
  return Math.max(0, 1 - reduction)
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

  if (effect === 'critical-rate' && definition.criticalRateMultiplier !== undefined) {
    overrides.criticalRateMultiplier = definition.criticalRateMultiplier + levelDelta * 0.25
  }
  if (effect === 'burning' || effect === 'poison') {
    overrides.maxHealthDamagePercent = scaledPercent(definition.maxHealthDamagePercent, level)
    if (definition.durationRounds !== undefined) {
      overrides.remainingRounds = definition.durationRounds + Math.floor(levelDelta / 2)
    }
  }
  if (effect === 'poison') overrides.attributeMultiplier = deepenedMultiplier(definition.attributeMultiplier, level)
  if (effect === 'attribute-reduction') overrides.attributeMultiplier = deepenedMultiplier(definition.attributeMultiplier, level)
  if (effect === 'reflection') overrides.reflectionPercent = scaledPercent(definition.reflectionPercent, level)
  if (effect === 'lifesteal') overrides.lifestealPercent = scaledPercent(definition.lifestealPercent, level)
  if (effect === 'damage-reduction') overrides.damageReductionPercent = scaledPercent(definition.damageReductionPercent, level)
  if (effect === 'health-regen') overrides.healthRegenPercent = scaledPercent(definition.healthRegenPercent, level)
  if (effect === 'stamina-regen') overrides.staminaRegenPercent = scaledPercent(definition.staminaRegenPercent, level)
  if (effect === 'inner-power-regen') overrides.innerPowerRegenPercent = scaledPercent(definition.innerPowerRegenPercent, level)
  if (effect === 'inner-power-health-regen') overrides.innerPowerHealthRegenPercent = scaledPercent(definition.innerPowerHealthRegenPercent, level)
  if (effect === 'inner-power-leech') overrides.innerPowerLeechPercent = scaledPercent(definition.innerPowerLeechPercent, level)
  if (effect === 'damage-dealt') overrides.damageDealtPercent = scaledPercent(definition.damageDealtPercent, level)
  if (effect === 'external-skill-damage') overrides.externalSkillDamagePercent = scaledPercent(definition.externalSkillDamagePercent, level)
  if (effect === 'terrain-adaptation') overrides.terrainCostOverride = definition.terrainCostOverride
  if (effect?.endsWith('-step')) overrides.evasionRateBonus = (definition.evasionRateBonus ?? 0) + levelDelta
  if (effect === 'evasion') overrides.evasionRateBonus = (definition.evasionRateBonus ?? 0) + levelDelta * 3

  return Object.fromEntries(Object.entries(overrides).filter(([, value]) => value !== undefined))
}
