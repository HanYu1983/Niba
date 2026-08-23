import type { PlayerAttributes } from '../types'

/** 依根骨計算角色最大生命值：1 根骨 = 3 氣血。 */
export function getMaxHealth(attributes: PlayerAttributes): number {
  return attributes.constitution * 3
}

/** 依身法與臂力計算角色最大體力：0.5 × 身法 + 0.5 × 臂力。 */
export function getMaxStamina(attributes: PlayerAttributes): number {
  return attributes.agility * 0.5 + attributes.armStrength * 0.5
}

/** 依內息計算角色最大內力：1 內息 = 3 內力。 */
export function getMaxInnerPower(attributes: PlayerAttributes): number {
  return attributes.innerEnergy * 3
}
