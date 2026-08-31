import type { ActionOutcome, GameState } from '../types'
import {
  addEquipmentToPlayer,
  addEquipmentToWarehouse,
  addItemToPlayer,
  addItemToWarehouse,
  addSkillToPlayer,
  addSkillToWarehouse,
  canDepositEquipment,
  canDepositItem,
  canDepositSkill,
  canWithdrawEquipment,
  canWithdrawItem,
  canWithdrawSkill,
  getSharedEquipmentWarehouse,
  getSharedSkillWarehouse,
  getSkillType,
  removeEquipmentFromPlayer,
  removeEquipmentFromWarehouse,
  removeItemFromPlayer,
  removeItemFromWarehouse,
  removeSkillFromPlayer,
  removeSkillFromWarehouse,
} from '../rules/storageRules'
import { getSkillProgression } from '../rules/skillRules'

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

export function depositSkill(state: GameState, playerId: string, skillId: string): StorageActionResult {
  const validation = canDepositSkill(state, playerId, skillId)
  if (!validation.ok) return { state, result: { ok: false, reason: validation.reason ?? '存入功法失敗。' } }

  const player = state.players.find((candidate) => candidate.id === playerId)
  if (!player) return { state, result: { ok: false, reason: '玩家不存在。' } }

  const skillType = getSkillType(skillId)
  if (!skillType) return { state, result: { ok: false, reason: '功法不存在。' } }

  const progression = getSkillProgression(player, skillId)
  const entry = { skillId, skillType, experience: progression.experience, level: progression.level }

  return {
    state: {
      ...state,
      players: state.players.map((currentPlayer) => currentPlayer.id === playerId
        ? removeSkillFromPlayer(currentPlayer, skillId)
        : currentPlayer),
      sharedSkillWarehouse: addSkillToWarehouse(getSharedSkillWarehouse(state), entry),
    },
    result: { ok: true },
  }
}

export function withdrawSkill(state: GameState, playerId: string, skillId: string): StorageActionResult {
  const validation = canWithdrawSkill(state, playerId, skillId)
  if (!validation.ok) return { state, result: { ok: false, reason: validation.reason ?? '取出功法失敗。' } }

  const player = state.players.find((candidate) => candidate.id === playerId)
  const entry = getSharedSkillWarehouse(state).find((candidate) => candidate.skillId === skillId)
  if (!player) return { state, result: { ok: false, reason: '玩家不存在。' } }
  if (!entry) return { state, result: { ok: false, reason: '功法不存在。' } }

  return {
    state: {
      ...state,
      players: state.players.map((currentPlayer) => currentPlayer.id === playerId
        ? addSkillToPlayer(currentPlayer, entry)
        : currentPlayer),
      sharedSkillWarehouse: removeSkillFromWarehouse(getSharedSkillWarehouse(state), skillId),
    },
    result: { ok: true },
  }
}
