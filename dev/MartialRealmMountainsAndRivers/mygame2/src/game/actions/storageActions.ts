import type { ActionOutcome, GameState } from '../types'
import {
  addEquipmentToPlayer,
  addEquipmentToWarehouse,
  addItemToPlayer,
  addItemToWarehouse,
  canDepositEquipment,
  canDepositItem,
  canWithdrawEquipment,
  canWithdrawItem,
  getSharedEquipmentWarehouse,
  removeEquipmentFromPlayer,
  removeEquipmentFromWarehouse,
  removeItemFromPlayer,
  removeItemFromWarehouse,
} from '../rules/storageRules'

export type StorageActionResult = {
  state: GameState
  result: ActionOutcome
}

export function depositItem(state: GameState, playerId: string, itemId: string, quantity: number): StorageActionResult {
  const validation = canDepositItem(state, playerId, itemId, quantity)
  if (!validation.ok) return { state, result: { ok: false, reason: validation.reason ?? '存入道具失敗。' } }

  const player = state.players.find((candidate) => candidate.id === playerId)
  if (!player) return { state, result: { ok: false, reason: '玩家不存在。' } }

  return {
    state: {
      ...state,
      players: state.players.map((currentPlayer) => currentPlayer.id === playerId
        ? removeItemFromPlayer(currentPlayer, itemId, quantity)
        : currentPlayer),
      sharedWarehouse: addItemToWarehouse(state.sharedWarehouse ?? [], itemId, quantity),
    },
    result: { ok: true },
  }
}

export function withdrawItem(state: GameState, playerId: string, itemId: string, quantity: number): StorageActionResult {
  const validation = canWithdrawItem(state, playerId, itemId, quantity)
  if (!validation.ok) return { state, result: { ok: false, reason: validation.reason ?? '取出道具失敗。' } }

  const player = state.players.find((candidate) => candidate.id === playerId)
  if (!player) return { state, result: { ok: false, reason: '玩家不存在。' } }

  return {
    state: {
      ...state,
      players: state.players.map((currentPlayer) => currentPlayer.id === playerId
        ? addItemToPlayer(currentPlayer, itemId, quantity)
        : currentPlayer),
      sharedWarehouse: removeItemFromWarehouse(state.sharedWarehouse ?? [], itemId, quantity),
    },
    result: { ok: true },
  }
}

export function depositEquipment(state: GameState, playerId: string, instanceId: string): StorageActionResult {
  const validation = canDepositEquipment(state, playerId, instanceId)
  if (!validation.ok) return { state, result: { ok: false, reason: validation.reason ?? '存入裝備失敗。' } }

  const player = state.players.find((candidate) => candidate.id === playerId)
  const instance = player?.equipmentInventory?.find((candidate) => candidate.instanceId === instanceId)
  if (!player) return { state, result: { ok: false, reason: '玩家不存在。' } }
  if (!instance) return { state, result: { ok: false, reason: '裝備不存在。' } }

  return {
    state: {
      ...state,
      players: state.players.map((currentPlayer) => currentPlayer.id === playerId
        ? removeEquipmentFromPlayer(currentPlayer, instanceId)
        : currentPlayer),
      sharedEquipmentWarehouse: addEquipmentToWarehouse(getSharedEquipmentWarehouse(state), instance),
    },
    result: { ok: true },
  }
}

export function withdrawEquipment(state: GameState, playerId: string, instanceId: string): StorageActionResult {
  const validation = canWithdrawEquipment(state, playerId, instanceId)
  if (!validation.ok) return { state, result: { ok: false, reason: validation.reason ?? '取出裝備失敗。' } }

  const player = state.players.find((candidate) => candidate.id === playerId)
  const instance = getSharedEquipmentWarehouse(state).find((candidate) => candidate.instanceId === instanceId)
  if (!player) return { state, result: { ok: false, reason: '玩家不存在。' } }
  if (!instance) return { state, result: { ok: false, reason: '裝備不存在。' } }

  return {
    state: {
      ...state,
      players: state.players.map((currentPlayer) => currentPlayer.id === playerId
        ? addEquipmentToPlayer(currentPlayer, instance)
        : currentPlayer),
      sharedEquipmentWarehouse: removeEquipmentFromWarehouse(getSharedEquipmentWarehouse(state), instanceId),
    },
    result: { ok: true },
  }
}
