import type {
  EquipmentLoadout,
  PlayerState,
} from '../types'
import type { EquipmentSlot } from '../catalogs/equipmentCatalog'
import {
} from '../types'
import {
  getEffectiveAttributesForPlayer,
  getEquipmentInventory,
  getEquipmentLoadout,
} from './playerDerivedRules'
import { getMaxHealth, getMaxInnerPower, getMaxStamina } from './playerStatsRules'

export function applyEquipmentLoadout(player: PlayerState, equipmentLoadout: EquipmentLoadout): PlayerState {
  const baseAttributes = player.baseAttributes ?? player.attributes
  const attributes = getEffectiveAttributesForPlayer({ ...player, equipmentLoadout })
  const maxHealth = getMaxHealth(attributes)
  const maxStamina = getMaxStamina(attributes)
  const maxInnerPower = getMaxInnerPower(attributes)

  return {
    ...player,
    baseAttributes,
    attributes,
    maxHealth,
    health: Math.min(player.health, maxHealth),
    maxStamina,
    stamina: Math.min(player.stamina, maxStamina),
    maxInnerPower,
    innerPower: Math.min(player.innerPower, maxInnerPower),
    equipmentLoadout,
  }
}

export function reduceEquipmentDurability(
  player: PlayerState,
  slot: EquipmentSlot,
  amount: number,
): PlayerState {
  const loadout = getEquipmentLoadout(player)
  const instanceId = loadout[`${slot}InstanceId`]

  if (!instanceId) return player

  const equipmentInventory = getEquipmentInventory(player).map((instance) =>
    instance.instanceId === instanceId
      ? { ...instance, durability: Math.max(0, instance.durability - amount) }
      : instance,
  )

  return applyEquipmentLoadout({ ...player, equipmentInventory }, loadout)
}
