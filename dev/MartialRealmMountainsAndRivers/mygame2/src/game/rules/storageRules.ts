import type { GameState, InventoryEntry, PlayerState, EquipmentInstance } from '../types'
import { BUILDING_TYPES } from '../catalogs/buildingCatalog'
import { assertPlayerTurn } from './actionCostRules'
import { isBaseActive } from './baseRules'

/** 判斷玩家是否位於任一擁有交易所的據點附近。 */
export function getExchangeBaseId(state: GameState, playerId: string): string | null {
  const player = state.players.find((candidate) => candidate.id === playerId)
  if (!player) return null

  const base = state.bases.find((candidate) =>
    Math.abs(candidate.position.row - player.position.row) +
    Math.abs(candidate.position.column - player.position.column) <= 1 &&
    isBaseActive(candidate) && candidate.buildings.some((building) => building.type === BUILDING_TYPES.EXCHANGE),
  )

  return base ? base.id : null
}

export function canAccessSharedWarehouse(
  state: GameState,
  playerId: string,
): { ok: boolean; reason?: string } {
  const player = state.players.find((candidate) => candidate.id === playerId)
  if (!player) {
    return { ok: false, reason: '玩家不存在。' }
  }

  const turnCheck = assertPlayerTurn(state, player)
  if (!turnCheck.ok) return turnCheck

  if (!getExchangeBaseId(state, playerId)) {
    return { ok: false, reason: '玩家附近沒有交易所。' }
  }

  return { ok: true }
}

export function getSharedWarehouse(state: GameState): InventoryEntry[] {
  return state.sharedWarehouse ?? []
}

export function getSharedWarehouseItemQuantity(state: GameState, itemId: string): number {
  return getSharedWarehouse(state).find((entry) => entry.itemId === itemId)?.quantity ?? 0
}

export function getPlayerItemQuantity(player: PlayerState, itemId: string): number {
  return player.inventory.find((entry) => entry.itemId === itemId)?.quantity ?? 0
}

export function canDepositItem(
  state: GameState,
  playerId: string,
  itemId: string,
  quantity: number,
): { ok: boolean; reason?: string } {
  const access = canAccessSharedWarehouse(state, playerId)
  if (!access.ok) return access

  if (quantity <= 0) {
    return { ok: false, reason: '存入數量必須大於 0。' }
  }

  const player = state.players.find((candidate) => candidate.id === playerId)
  if (!player) {
    return { ok: false, reason: '玩家不存在。' }
  }

  const owned = getPlayerItemQuantity(player, itemId)
  if (owned < quantity) {
    return { ok: false, reason: `持有數量不足，目前持有 ${owned}。` }
  }

  return { ok: true }
}

export function canWithdrawItem(
  state: GameState,
  playerId: string,
  itemId: string,
  quantity: number,
): { ok: boolean; reason?: string } {
  const access = canAccessSharedWarehouse(state, playerId)
  if (!access.ok) return access

  if (quantity <= 0) {
    return { ok: false, reason: '取出數量必須大於 0。' }
  }

  const available = getSharedWarehouseItemQuantity(state, itemId)
  if (available < quantity) {
    return { ok: false, reason: `公共倉庫數量不足，目前有 ${available}。` }
  }

  return { ok: true }
}

/** 從玩家背包移出物品。 */
export function removeItemFromPlayer(player: PlayerState, itemId: string, quantity: number): PlayerState {
  return {
    ...player,
    inventory: player.inventory
      .map((entry) =>
        entry.itemId === itemId ? { ...entry, quantity: entry.quantity - quantity } : entry,
      )
      .filter((entry) => entry.quantity > 0),
  }
}

/** 將物品加入玩家背包。 */
export function addItemToPlayer(player: PlayerState, itemId: string, quantity: number): PlayerState {
  const existing = player.inventory.find((entry) => entry.itemId === itemId)
  if (existing) {
    return {
      ...player,
      inventory: player.inventory.map((entry) =>
        entry.itemId === itemId ? { ...entry, quantity: entry.quantity + quantity } : entry,
      ),
    }
  }
  return { ...player, inventory: [...player.inventory, { itemId, quantity }] }
}

/** 從公共倉庫移出物品。 */
export function removeItemFromWarehouse(warehouse: InventoryEntry[], itemId: string, quantity: number): InventoryEntry[] {
  return warehouse
    .map((entry) =>
      entry.itemId === itemId ? { ...entry, quantity: entry.quantity - quantity } : entry,
    )
    .filter((entry) => entry.quantity > 0)
}

/** 將物品加入公共倉庫。 */
export function addItemToWarehouse(warehouse: InventoryEntry[], itemId: string, quantity: number): InventoryEntry[] {
  const existing = warehouse.find((entry) => entry.itemId === itemId)
  if (existing) {
    return warehouse.map((entry) =>
      entry.itemId === itemId ? { ...entry, quantity: entry.quantity + quantity } : entry,
    )
  }
  return [...warehouse, { itemId, quantity }]
}

// ── 裝備倉庫（裝備有耐久度，與道具分開存放）──

export function getSharedEquipmentWarehouse(state: GameState): EquipmentInstance[] {
  return state.sharedEquipmentWarehouse ?? []
}

export function getPlayerEquipmentQuantity(player: PlayerState, instanceId: string): number {
  return (player.equipmentInventory ?? []).filter((instance) => instance.instanceId === instanceId).length
}

export function canDepositEquipment(
  state: GameState,
  playerId: string,
  instanceId: string,
): { ok: boolean; reason?: string } {
  const access = canAccessSharedWarehouse(state, playerId)
  if (!access.ok) return access

  const player = state.players.find((candidate) => candidate.id === playerId)
  if (!player) {
    return { ok: false, reason: '玩家不存在。' }
  }

  const owned = getPlayerEquipmentQuantity(player, instanceId)
  if (owned <= 0) {
    return { ok: false, reason: '玩家沒有這件裝備。' }
  }

  return { ok: true }
}

export function canWithdrawEquipment(
  state: GameState,
  playerId: string,
  instanceId: string,
): { ok: boolean; reason?: string } {
  const access = canAccessSharedWarehouse(state, playerId)
  if (!access.ok) return access

  const available = getSharedEquipmentWarehouse(state).some((instance) => instance.instanceId === instanceId)
  if (!available) {
    return { ok: false, reason: '公共倉庫沒有這件裝備。' }
  }

  return { ok: true }
}

/** 從玩家裝備欄移出指定裝備。 */
export function removeEquipmentFromPlayer(player: PlayerState, instanceId: string): PlayerState {
  return {
    ...player,
    equipmentInventory: (player.equipmentInventory ?? []).filter(
      (instance) => instance.instanceId !== instanceId,
    ),
  }
}

/** 將裝備加入玩家裝備欄。 */
export function addEquipmentToPlayer(player: PlayerState, instance: EquipmentInstance): PlayerState {
  return {
    ...player,
    equipmentInventory: [...(player.equipmentInventory ?? []), instance],
  }
}

/** 從公共裝備倉庫移出指定裝備。 */
export function removeEquipmentFromWarehouse(
  warehouse: EquipmentInstance[],
  instanceId: string,
): EquipmentInstance[] {
  return warehouse.filter((instance) => instance.instanceId !== instanceId)
}

/** 將裝備加入公共裝備倉庫。 */
export function addEquipmentToWarehouse(
  warehouse: EquipmentInstance[],
  instance: EquipmentInstance,
): EquipmentInstance[] {
  return [...warehouse, instance]
}
