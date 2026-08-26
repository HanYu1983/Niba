import type { PlayerAttributes } from '../types'

/** 可被 resource-limit 修正的資源上限種類。 */
export type ResourceLimit = 'health' | 'stamina' | 'innerPower'

/** resource-limit 修正量：各資源的倍率與固定加成。 */
export type ResourceLimitModifiers = {
  /** 各資源上限的倍率（預設 1）。 */
  multiplier?: Partial<Record<ResourceLimit, number>>
  /** 各資源上限的固定加成（預設 0）。 */
  bonus?: Partial<Record<ResourceLimit, number>>
}

/** 各資源的基礎公式（不含 buff 修正）。 */
function baseLimit(resource: ResourceLimit, attributes: PlayerAttributes): number {
  switch (resource) {
    case 'health':
      return attributes.constitution * 3
    case 'stamina':
      return attributes.agility * 0.5 + attributes.armStrength * 0.5
    case 'innerPower':
      return attributes.innerEnergy * 3
  }
}

/**
 * 計算某資源上限（資源上限統一入口）。
 *
 * baseLimit(resource) × multiplier + bonus：
 * - multiplier 作用在 effective 五維的基礎公式上（資源維度的獨立倍率，不與 attributeMultiplier 混疊）。
 * - bonus 提供固定加算（如 maxStaminaBonus）。
 *
 * @param modifiers 可省略；省略時回傳原始值（白箱相容既有 getter）。
 */
export function getResourceLimit(
  attributes: PlayerAttributes,
  resource: ResourceLimit,
  modifiers?: ResourceLimitModifiers,
): number {
  const base = baseLimit(resource, attributes)
  const multiplier = modifiers?.multiplier?.[resource] ?? 1
  const bonus = modifiers?.bonus?.[resource] ?? 0
  return base * multiplier + bonus
}

/** 依根骨計算角色最大生命值：1 根骨 = 3 氣血。 */
export function getMaxHealth(attributes: PlayerAttributes): number {
  return getResourceLimit(attributes, 'health')
}

/** 依身法與臂力計算角色最大體力：0.5 × 身法 + 0.5 × 臂力。 */
export function getMaxStamina(attributes: PlayerAttributes): number {
  return getResourceLimit(attributes, 'stamina')
}

/** 依內息計算角色最大內力：1 內息 = 3 內力。 */
export function getMaxInnerPower(attributes: PlayerAttributes): number {
  return getResourceLimit(attributes, 'innerPower')
}
