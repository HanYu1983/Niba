import type {
  BaseState,
  EquipmentInstance,
  GameState,
} from '../types'
import {
  getEffectiveMoneyCost,
} from './policyRules'
import { equipmentCatalog } from '../catalogs/equipmentCatalog'
import { itemCatalog } from '../catalogs/itemCatalog'
import { BUILDING_TYPES } from '../catalogs/buildingCatalog'
import { assertPlayerTurn } from './actionCostRules'
import { isBaseActive } from './baseRules'

/** 裝備賣出價格（依目前耐久比例）。 */
export function getEquipmentSellPrice(instance: EquipmentInstance): number {
  const definition = equipmentCatalog.find((equipment) => equipment.id === instance.equipmentId)
  if (!definition) return 0

  const basePrice = Math.round(definition.buyPrice * 0.5)
  const durabilityRatio = instance.durability / Math.max(1, instance.maxDurability)
  return Math.max(1, Math.round(basePrice * durabilityRatio))
}

export function getEquipmentBuyPrice(base: BaseState, equipmentId: string, state?: GameState): number {
  const definition = equipmentCatalog.find((equipment) => equipment.id === equipmentId)
  if (!definition) return 0
  return getEffectiveMoneyCost(base, definition.buyPrice, state)
}

/** 檢查玩家是否位於有商店的據點。 */
export function getShopBaseId(state: GameState, playerId: string): string | null {
  const player = state.players.find((candidate) => candidate.id === playerId)
  if (!player) return null

  const base = state.bases.find((candidate) =>
    Math.abs(candidate.position.row - player.position.row) +
    Math.abs(candidate.position.column - player.position.column) <= 1 &&
    isBaseActive(candidate) && candidate.buildings.some((building) =>
      building.type === BUILDING_TYPES.ITEM_SHOP || building.type === BUILDING_TYPES.EQUIPMENT_SHOP,
    ),
  )

  return base ? base.id : null
}

/** 取得指定商店建築的等級；未建造時回傳 0。 */
export function getShopLevel(base: BaseState, shopType: 'item-shop' | 'equipment-shop'): number {
  if (!isBaseActive(base)) return 0
  const shop = base.buildings.find((building) => building.type === shopType)
  return shop?.level ?? 0
}

export function getItemBuyPrice(base: BaseState, itemId: string, state?: GameState): number {
  const item = itemCatalog.find((candidate) => candidate.id === itemId)
  if (!item) return 0
  return getEffectiveMoneyCost(base, item.buyPrice, state)
}

export function getItemSellPrice(itemId: string): number {
  const item = itemCatalog.find((candidate) => candidate.id === itemId)
  if (!item) return 0
  return Math.max(1, Math.round(item.buyPrice * 0.5))
}

export function canBuyItem(
  state: GameState,
  playerId: string,
  itemId: string,
  quantity: number,
): { ok: boolean; reason?: string; price?: number } {
  if (!itemCatalog.some((item) => item.id === itemId)) {
    return { ok: false, reason: '未知道具。' }
  }
  if (quantity <= 0) {
    return { ok: false, reason: '購買數量必須大於 0。' }
  }

  const player = state.players.find((candidate) => candidate.id === playerId)
  const baseId = getShopBaseId(state, playerId)
  const base = baseId ? state.bases.find((candidate) => candidate.id === baseId) : undefined

  if (!player || !base) {
    return { ok: false, reason: '玩家附近沒有商店。' }
  }

  const turnCheck = assertPlayerTurn(state, player)
  if (!turnCheck.ok) return turnCheck

  const item = itemCatalog.find((candidate) => candidate.id === itemId)
  if (!item || item.requiredShopLevel <= 0) {
    return { ok: false, reason: '此道具不可在商店購買。' }
  }
  if (getShopLevel(base, 'item-shop') < item.requiredShopLevel) {
    return { ok: false, reason: `需要道具商店 Lv.${item.requiredShopLevel}。` }
  }

  const price = getItemBuyPrice(base, itemId, state) * quantity
  if (player.money < price) {
    return { ok: false, reason: `金錢不足，需要 ${price} 金錢。` }
  }

  return { ok: true, price }
}

export function canSellItem(
  state: GameState,
  playerId: string,
  itemId: string,
  quantity: number,
): { ok: boolean; reason?: string; price?: number } {
  if (quantity <= 0) {
    return { ok: false, reason: '賣出數量必須大於 0。' }
  }

  const player = state.players.find((candidate) => candidate.id === playerId)
  if (!player || !getShopBaseId(state, playerId)) {
    return { ok: false, reason: '玩家附近沒有商店。' }
  }

  const turnCheck = assertPlayerTurn(state, player)
  if (!turnCheck.ok) return turnCheck

  const owned = player.inventory.find((entry) => entry.itemId === itemId)?.quantity ?? 0
  if (owned < quantity) {
    return { ok: false, reason: `持有數量不足，目前持有 ${owned}。` }
  }

  return { ok: true, price: getItemSellPrice(itemId) * quantity }
}

export function canSellEquipment(
  state: GameState,
  playerId: string,
  instanceId: string,
): { ok: boolean; reason?: string; price?: number } {
  const player = state.players.find((candidate) => candidate.id === playerId)
  if (!player || !getShopBaseId(state, playerId)) {
    return { ok: false, reason: '玩家附近沒有商店。' }
  }

  const turnCheck = assertPlayerTurn(state, player)
  if (!turnCheck.ok) return turnCheck

  const instance = player.equipmentInventory?.find((candidate) => candidate.instanceId === instanceId)
  if (!instance) {
    return { ok: false, reason: '裝備不存在。' }
  }

  const equipment = equipmentCatalog.find((candidate) => candidate.id === instance.equipmentId)
  if (equipment?.schoolId) {
    return { ok: false, reason: '門派專屬裝備不可在一般據點商店出售。' }
  }

  // 已裝備的裝備不可直接賣出。
  const loadout = player.equipmentLoadout
  if (
    loadout?.weaponInstanceId === instanceId ||
    loadout?.armorInstanceId === instanceId ||
    loadout?.accessoryInstanceId === instanceId
  ) {
    return { ok: false, reason: '已裝備的裝備需要先卸下。' }
  }

  return { ok: true, price: getEquipmentSellPrice(instance) }
}

export function canBuyEquipment(
  state: GameState,
  playerId: string,
  equipmentId: string,
): { ok: boolean; reason?: string; price?: number } {
  if (!equipmentCatalog.some((equipment) => equipment.id === equipmentId)) {
    return { ok: false, reason: '未知裝備。' }
  }

  const player = state.players.find((candidate) => candidate.id === playerId)
  const baseId = getShopBaseId(state, playerId)
  const base = baseId ? state.bases.find((candidate) => candidate.id === baseId) : undefined

  if (!player || !base) {
    return { ok: false, reason: '玩家附近沒有商店。' }
  }

  // 購買裝備需要裝備商店。
  if (!base.buildings.some((building) => building.type === BUILDING_TYPES.EQUIPMENT_SHOP)) {
    return { ok: false, reason: '需要裝備商店。' }
  }

  const turnCheck = assertPlayerTurn(state, player)
  if (!turnCheck.ok) return turnCheck

  const equipment = equipmentCatalog.find((candidate) => candidate.id === equipmentId)
  if (equipment && getShopLevel(base, 'equipment-shop') < equipment.requiredShopLevel) {
    return { ok: false, reason: `需要裝備商店 Lv.${equipment.requiredShopLevel}。` }
  }

  const price = getEquipmentBuyPrice(base, equipmentId, state)
  if (player.money < price) {
    return { ok: false, reason: `金錢不足，需要 ${price} 金錢。` }
  }

  return { ok: true, price }
}
