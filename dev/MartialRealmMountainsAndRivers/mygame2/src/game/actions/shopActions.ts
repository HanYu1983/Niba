import type { ActionOutcome, GameState, InventoryEntry } from '../types'
import { createEquipmentInstance } from '../rules/playerDerivedRules'
import {
  canBuyEquipment,
  canBuyItem,
  canSellEquipment,
  canSellItem,
} from '../rules/shopRules'
import { ACTION_STAMINA_COSTS, canPlayerPerformAction, spendPlayerStamina } from '../rules/actionCostRules'
import { addMoneySpent } from '../runStats'
import { addSectGateExperience } from '../rules/sectGateRules'
import { equipmentCatalog } from '../catalogs/equipmentCatalog'

export type ShopActionResult = {
  state: GameState
  result: ActionOutcome
}

export function addInventoryItem(inventory: InventoryEntry[], itemId: string, quantity = 1): InventoryEntry[] {
  if (quantity <= 0) return inventory
  const existingEntry = inventory.find((entry) => entry.itemId === itemId)

  if (existingEntry) {
    return inventory.map((entry) =>
      entry.itemId === itemId ? { ...entry, quantity: entry.quantity + quantity } : entry,
    )
  }

  return [...inventory, { itemId, quantity }]
}

export function buyItem(state: GameState, playerId: string, itemId: string, quantity: number): ShopActionResult {
  const validation = canBuyItem(state, playerId, itemId, quantity)
  if (!validation.ok) {
    return { state, result: { ok: false, reason: validation.reason ?? '購買道具失敗。' } }
  }

  const player = state.players.find((candidate) => candidate.id === playerId)
  if (!player) return { state, result: { ok: false, reason: '玩家不存在。' } }
  const actionCheck = canPlayerPerformAction(state, playerId, ACTION_STAMINA_COSTS.shop)
  if (!actionCheck.ok) return { state, result: { ok: false, reason: actionCheck.reason ?? '目前無法行動。' } }

  const price = validation.price ?? 0
  return {
    state: addMoneySpent({
      ...state,
      players: state.players.map((currentPlayer) =>
        currentPlayer.id === playerId
          ? spendPlayerStamina({ ...currentPlayer, money: currentPlayer.money - price, inventory: addInventoryItem(currentPlayer.inventory, itemId, quantity) }, ACTION_STAMINA_COSTS.shop)
          : currentPlayer,
      ),
    }, price),
    result: { ok: true },
  }
}

export function sellItem(state: GameState, playerId: string, itemId: string, quantity: number): ShopActionResult {
  const validation = canSellItem(state, playerId, itemId, quantity)
  if (!validation.ok) {
    return { state, result: { ok: false, reason: validation.reason ?? '出售道具失敗。' } }
  }

  const player = state.players.find((candidate) => candidate.id === playerId)
  if (!player) return { state, result: { ok: false, reason: '玩家不存在。' } }
  const actionCheck = canPlayerPerformAction(state, playerId, ACTION_STAMINA_COSTS.shop)
  if (!actionCheck.ok) return { state, result: { ok: false, reason: actionCheck.reason ?? '目前無法行動。' } }

  const price = validation.price ?? 0
  return {
    state: {
      ...state,
      players: state.players.map((currentPlayer) =>
        currentPlayer.id === playerId
          ? spendPlayerStamina({
            ...currentPlayer,
            money: currentPlayer.money + price,
            inventory: currentPlayer.inventory
              .map((entry) => entry.itemId === itemId ? { ...entry, quantity: entry.quantity - quantity } : entry)
              .filter((entry) => entry.quantity > 0),
          }, ACTION_STAMINA_COSTS.shop)
          : currentPlayer,
      ),
    },
    result: { ok: true },
  }
}

export function sellEquipment(state: GameState, playerId: string, instanceId: string): ShopActionResult {
  const validation = canSellEquipment(state, playerId, instanceId)
  if (!validation.ok) {
    return { state, result: { ok: false, reason: validation.reason ?? '出售裝備失敗。' } }
  }

  const player = state.players.find((candidate) => candidate.id === playerId)
  if (!player) return { state, result: { ok: false, reason: '玩家不存在。' } }

  const price = validation.price ?? 0
  return {
    state: {
      ...state,
      players: state.players.map((currentPlayer) =>
        currentPlayer.id === playerId
          ? { ...currentPlayer, money: currentPlayer.money + price, equipmentInventory: (currentPlayer.equipmentInventory ?? []).filter((instance) => instance.instanceId !== instanceId) }
          : currentPlayer,
      ),
    },
    result: { ok: true },
  }
}

export function buyEquipment(state: GameState, playerId: string, equipmentId: string): ShopActionResult {
  const validation = canBuyEquipment(state, playerId, equipmentId)
  if (!validation.ok) {
    return { state, result: { ok: false, reason: validation.reason ?? '購買裝備失敗。' } }
  }

  const player = state.players.find((candidate) => candidate.id === playerId)
  if (!player) return { state, result: { ok: false, reason: '玩家不存在。' } }

  const instance = createEquipmentInstance(equipmentId, `${player.id}-${equipmentId}-${Date.now()}`)
  if (!instance) return { state, result: { ok: false, reason: '無法建立裝備實例。' } }

  const price = validation.price ?? 0
  return {
    state: addMoneySpent({
      ...state,
      players: state.players.map((currentPlayer) =>
        currentPlayer.id === playerId
          ? { ...currentPlayer, money: currentPlayer.money - price, equipmentInventory: [...(currentPlayer.equipmentInventory ?? []), instance] }
          : currentPlayer,
      ),
    }, price),
    result: { ok: true },
  }
}

/** 在門派據點購買該門派專屬裝備；消費金額等量轉為據點經驗。 */
export function buySectEquipment(state: GameState, playerId: string, gateId: string, equipmentId: string): ShopActionResult {
  const player = state.players.find((candidate) => candidate.id === playerId)
  const gate = state.sectGates?.find((candidate) => candidate.id === gateId)
  const equipment = equipmentCatalog.find((candidate) => candidate.id === equipmentId)
  if (!player || !gate || !equipment?.schoolId || !equipment.sectGateLevel) {
    return { state, result: { ok: false, reason: '門派據點或專屬裝備不存在。' } }
  }
  const distance = Math.abs(player.position.row - gate.position.row) + Math.abs(player.position.column - gate.position.column)
  if (distance > 1) return { state, result: { ok: false, reason: '必須靠近門派據點才能購買裝備。' } }
  if (equipment.schoolId !== gate.schoolId) return { state, result: { ok: false, reason: '此裝備不屬於該門派。' } }
  if (gate.level < equipment.sectGateLevel) return { state, result: { ok: false, reason: `門派據點需要達到 Lv.${equipment.sectGateLevel}。` } }
  const price = equipment.buyPrice
  if (player.money < price) return { state, result: { ok: false, reason: `金錢不足，需要 ${price} 金錢。` } }
  const instance = createEquipmentInstance(equipmentId, `${player.id}-${equipmentId}-${Date.now()}`)
  if (!instance) return { state, result: { ok: false, reason: '無法建立裝備實例。' } }
  const gateProgress = addSectGateExperience(gate, price)
  return {
    state: addMoneySpent({
      ...state,
      sectGates: (state.sectGates ?? []).map((candidate) => candidate.id === gateId ? { ...candidate, ...gateProgress } : candidate),
      players: state.players.map((candidate) => candidate.id === playerId
        ? { ...candidate, money: candidate.money - price, equipmentInventory: [...(candidate.equipmentInventory ?? []), instance] }
        : candidate),
    }, price),
    result: { ok: true },
  }
}
