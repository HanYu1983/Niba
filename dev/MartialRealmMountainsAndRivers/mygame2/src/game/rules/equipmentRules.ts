import type {
  ActionOutcome,
  EquipmentLoadout,
  GameState,
  PlayerState,
} from '../types'
import type { EquipmentSlot } from '../catalogs/equipmentCatalog'
import {
  getEffectiveAttributesForPlayer,
  getEquipment,
  getEquipmentInventory,
  getEquipmentLoadout,
  getPlayerResourceLimit,
} from './playerDerivedRules'
import { getActionablePlayer } from './actionCostRules'
import { applyBaseHealthBonuses } from './baseRules'

export function applyEquipmentLoadout(player: PlayerState, equipmentLoadout: EquipmentLoadout): PlayerState {
  const baseAttributes = player.baseAttributes ?? player.attributes
  const attributes = getEffectiveAttributesForPlayer({ ...player, equipmentLoadout })
  const updated = { ...player, baseAttributes, attributes, equipmentLoadout }
  const maxHealth = getPlayerResourceLimit(updated, 'health')
  const maxStamina = getPlayerResourceLimit(updated, 'stamina')
  const maxInnerPower = getPlayerResourceLimit(updated, 'innerPower')

  return {
    ...updated,
    maxHealth,
    health: Math.min(player.health, maxHealth),
    maxStamina,
    stamina: Math.min(player.stamina, maxStamina),
    maxInnerPower,
    innerPower: Math.min(player.innerPower, maxInnerPower),
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

/**
 * 裝備道具的純領域函數。
 * 將指定 instanceId 的裝備套用到對應部位。
 */
export function equipEquipmentAction(
  state: GameState,
  playerId: string,
  instanceId: string,
): { state: GameState; result: ActionOutcome } {
  const player = getActionablePlayer(state, playerId)
  const instance = player
    ? getEquipmentInventory(player).find((candidate) => candidate.instanceId === instanceId)
    : undefined
  const equipment = instance ? getEquipment(instance.equipmentId) : undefined

  if (!player || !instance || !equipment || instance.durability <= 0) {
    return { state, result: { ok: false, reason: '裝備不存在、已損壞，或玩家目前無法行動。' } }
  }

  const currentLoadout = getEquipmentLoadout(player)
  const nextLoadout: EquipmentLoadout = {
    ...currentLoadout,
    [`${equipment.slot}InstanceId`]: instance.instanceId,
  }

  return {
    state: applyBaseHealthBonuses({
      ...state,
      players: state.players.map((currentPlayer) =>
        currentPlayer.id === playerId
          ? applyEquipmentLoadout(
            currentPlayer.equipmentInventory?.some((candidate) => candidate.instanceId === instance.instanceId)
              ? currentPlayer
              : { ...currentPlayer, equipmentInventory: [...getEquipmentInventory(currentPlayer), instance] },
            nextLoadout,
          )
          : currentPlayer,
      ),
    }),
    result: { ok: true },
  }
}
