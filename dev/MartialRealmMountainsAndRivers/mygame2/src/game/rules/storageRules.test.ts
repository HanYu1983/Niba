import { describe, expect, it } from 'vitest'
import {
  canDepositItem,
  canWithdrawItem,
  canDepositEquipment,
  canWithdrawEquipment,
  canDepositSkill,
  canWithdrawSkill,
  getSharedWarehouseItemQuantity,
  getSharedEquipmentWarehouse,
  getSharedSkillWarehouse,
  getPlayerItemQuantity,
  getPlayerEquipmentQuantity,
  addItemToPlayer,
  removeItemFromPlayer,
  addItemToWarehouse,
  removeItemFromWarehouse,
  addEquipmentToPlayer,
  removeEquipmentFromPlayer,
  addEquipmentToWarehouse,
  removeEquipmentFromWarehouse,
  addSkillToPlayer,
  removeSkillFromPlayer,
  addSkillToWarehouse,
  removeSkillFromWarehouse,
} from './storageRules'
import type { GameState, PlayerState, EquipmentInstance } from '../types'
import { getMaxHealth, getMaxInnerPower, getMaxStamina } from './playerStatsRules'

const baseAttributes = { armStrength: 8, constitution: 8, agility: 7, innerEnergy: 5, insight: 7 }

function makePlayer(overrides: Partial<PlayerState> = {}): PlayerState {
  return {
    id: 'player-1',
    name: '玩家 1',
    position: { row: 5, column: 5 },
    attributes: baseAttributes,
    innerSkillIds: ['tuna-gong'],
    innerSkillId: 'tuna-gong',
    externalSkillIds: [],
    equippedExternalSkillIds: [],
    health: getMaxHealth(baseAttributes),
    maxHealth: getMaxHealth(baseAttributes),
    stamina: getMaxStamina(baseAttributes),
    maxStamina: getMaxStamina(baseAttributes),
    innerPower: getMaxInnerPower(baseAttributes),
    maxInnerPower: getMaxInnerPower(baseAttributes),
    prestige: 0,
    money: 0,
    experience: 0,
    inventory: [],
    turnEnded: false,
    ...overrides,
  }
}

function makeExchangeState(overrides: Partial<GameState> = {}): GameState {
  const player = makePlayer({ inventory: [{ itemId: 'heal-wound-medicine', quantity: 3 }] })
  return {
    map: { rows: 11, columns: 11, cells: [] },
    bases: [{
      id: 'base-1',
      name: '據點 1',
      position: { row: 5, column: 6 },
      buildings: [{ id: 'b1-ex', type: 'exchange', name: '交易所', description: '', constructionCost: 30 }],
      buildingMaterials: 100,
      maxBuildingMaterials: 100,
      health: 100,
      maxHealth: 100,
    }],
    creatureNests: [],
    resourcePoints: [],
    itemPoints: [],
    players: [player],
    creatures: [],
    activePlayerId: 'player-1',
    round: 1,
    creatureActionLogs: [],
    attackPreview: null,
    externalSkillPreview: null,
    creatureTurnInProgress: false,
    activeCreatureId: null,
    operation: { type: 'idle' },
    blockingModal: null,
    sharedWarehouse: [],
    ...overrides,
  }
}

describe('公共倉庫存取', () => {
  it('有交易所時可存入物品', () => {
    const state = makeExchangeState()
    expect(canDepositItem(state, 'player-1', 'heal-wound-medicine', 1).ok).toBe(true)
  })

  it('沒有交易所時不可存入', () => {
    const state = makeExchangeState({
      bases: [{
        ...makeExchangeState().bases[0],
        buildings: [],
      }],
    })
    expect(canDepositItem(state, 'player-1', 'heal-wound-medicine', 1).ok).toBe(false)
  })

  it('持有數量不足時不可存入', () => {
    const state = makeExchangeState()
    expect(canDepositItem(state, 'player-1', 'heal-wound-medicine', 99).ok).toBe(false)
  })

  it('公共倉庫數量不足時不可取出', () => {
    const state = makeExchangeState()
    expect(canWithdrawItem(state, 'player-1', 'heal-wound-medicine', 1).ok).toBe(false)
  })

  it('存入後公共倉庫數量增加', () => {
    const state = makeExchangeState()
    const warehouse = addItemToWarehouse(state.sharedWarehouse ?? [], 'heal-wound-medicine', 2)
    expect(getSharedWarehouseItemQuantity({ ...state, sharedWarehouse: warehouse }, 'heal-wound-medicine')).toBe(2)
  })

  it('玩家物品數量計算正確', () => {
    const player = makePlayer({ inventory: [{ itemId: 'recover-qi-pill', quantity: 5 }] })
    expect(getPlayerItemQuantity(player, 'recover-qi-pill')).toBe(5)
    expect(getPlayerItemQuantity(player, 'heal-wound-medicine')).toBe(0)
  })

  it('移除玩家物品超過數量時移除項目', () => {
    const player = makePlayer({ inventory: [{ itemId: 'heal-wound-medicine', quantity: 1 }] })
    const next = removeItemFromPlayer(player, 'heal-wound-medicine', 1)
    expect(getPlayerItemQuantity(next, 'heal-wound-medicine')).toBe(0)
    expect(next.inventory).toHaveLength(0)
  })

  it('加入玩家物品到既有項目', () => {
    const player = makePlayer({ inventory: [{ itemId: 'heal-wound-medicine', quantity: 1 }] })
    const next = addItemToPlayer(player, 'heal-wound-medicine', 2)
    expect(getPlayerItemQuantity(next, 'heal-wound-medicine')).toBe(3)
  })

  it('移除公共倉庫物品', () => {
    const warehouse = [{ itemId: 'heal-wound-medicine', quantity: 3 }]
    const next = removeItemFromWarehouse(warehouse, 'heal-wound-medicine', 2)
    expect(next).toEqual([{ itemId: 'heal-wound-medicine', quantity: 1 }])
  })
})

describe('公共裝備倉庫存取', () => {
  const makeEquipmentInstance = (instanceId: string): EquipmentInstance => ({
    instanceId,
    equipmentId: 'iron-sword',
    durability: 20,
    maxDurability: 20,
  })

  it('有交易所且持有裝備時可存入', () => {
    const player = makePlayer({ equipmentInventory: [makeEquipmentInstance('eq-1')] })
    const state = makeExchangeState({ players: [player] })
    expect(canDepositEquipment(state, 'player-1', 'eq-1').ok).toBe(true)
  })

  it('未持有裝備時不可存入', () => {
    const state = makeExchangeState()
    expect(canDepositEquipment(state, 'player-1', 'eq-1').ok).toBe(false)
  })

  it('倉庫沒有裝備時不可取出', () => {
    const state = makeExchangeState()
    expect(canWithdrawEquipment(state, 'player-1', 'eq-1').ok).toBe(false)
  })

  it('存入後倉庫有該裝備', () => {
    const player = makePlayer({ equipmentInventory: [makeEquipmentInstance('eq-1')] })
    const state = makeExchangeState({ players: [player] })
    const warehouse = addEquipmentToWarehouse(getSharedEquipmentWarehouse(state), makeEquipmentInstance('eq-1'))
    expect(getSharedEquipmentWarehouse({ ...state, sharedEquipmentWarehouse: warehouse })).toHaveLength(1)
  })

  it('玩家裝備數量計算正確', () => {
    const player = makePlayer({ equipmentInventory: [makeEquipmentInstance('eq-1'), makeEquipmentInstance('eq-2')] })
    expect(getPlayerEquipmentQuantity(player, 'eq-1')).toBe(1)
    expect(getPlayerEquipmentQuantity(player, 'eq-3')).toBe(0)
  })

  it('移除玩家裝備', () => {
    const player = makePlayer({ equipmentInventory: [makeEquipmentInstance('eq-1')] })
    const next = removeEquipmentFromPlayer(player, 'eq-1')
    expect(next.equipmentInventory).toHaveLength(0)
  })

  it('加入玩家裝備', () => {
    const player = makePlayer()
    const next = addEquipmentToPlayer(player, makeEquipmentInstance('eq-1'))
    expect(next.equipmentInventory).toHaveLength(1)
  })

  it('移除倉庫裝備', () => {
    const warehouse = [makeEquipmentInstance('eq-1'), makeEquipmentInstance('eq-2')]
    const next = removeEquipmentFromWarehouse(warehouse, 'eq-1')
    expect(next).toHaveLength(1)
    expect(next[0].instanceId).toBe('eq-2')
  })
})

describe('公共功法倉庫存取', () => {
  it('已學會且非當前內功時可存入', () => {
    const player = makePlayer({
      innerSkillIds: ['tuna-gong', 'golden-body-inner'],
      innerSkillId: 'tuna-gong',
      externalSkillIds: ['golden-body-external-damage'],
      skillProgression: { 'golden-body-inner': { experience: 30, level: 2 } },
    })
    const state = makeExchangeState({ players: [player] })
    expect(canDepositSkill(state, 'player-1', 'golden-body-inner').ok).toBe(true)
  })

  it('目前裝備的內功不可存入', () => {
    const player = makePlayer({
      innerSkillIds: ['tuna-gong'],
      innerSkillId: 'tuna-gong',
    })
    const state = makeExchangeState({ players: [player] })
    expect(canDepositSkill(state, 'player-1', 'tuna-gong').ok).toBe(false)
  })

  it('未學會的功法不可存入', () => {
    const state = makeExchangeState()
    expect(canDepositSkill(state, 'player-1', 'golden-body-inner').ok).toBe(false)
  })

  it('倉庫沒有功法時不可取出', () => {
    const state = makeExchangeState()
    expect(canWithdrawSkill(state, 'player-1', 'golden-body-inner').ok).toBe(false)
  })

  it('存入後倉庫有該功法且保留經驗值', () => {
    const player = makePlayer({
      innerSkillIds: ['tuna-gong', 'golden-body-inner'],
      innerSkillId: 'tuna-gong',
      skillProgression: { 'golden-body-inner': { experience: 30, level: 2 } },
    })
    const state = makeExchangeState({ players: [player] })
    const warehouse = addSkillToWarehouse(getSharedSkillWarehouse(state), {
      skillId: 'golden-body-inner',
      skillType: 'inner',
      experience: 30,
      level: 2,
    })
    const stored = getSharedSkillWarehouse({ ...state, sharedSkillWarehouse: warehouse })
    expect(stored).toHaveLength(1)
    expect(stored[0]).toMatchObject({ skillId: 'golden-body-inner', experience: 30, level: 2 })
  })

  it('移除玩家功法時一併移除其經驗值', () => {
    const player = makePlayer({
      innerSkillIds: ['tuna-gong', 'golden-body-inner'],
      innerSkillId: 'tuna-gong',
      skillProgression: { 'golden-body-inner': { experience: 30, level: 2 } },
    })
    const next = removeSkillFromPlayer(player, 'golden-body-inner')
    expect(next.innerSkillIds).not.toContain('golden-body-inner')
    expect(next.skillProgression?.['golden-body-inner']).toBeUndefined()
  })

  it('加入玩家功法時繼承經驗值', () => {
    const player = makePlayer()
    const next = addSkillToPlayer(player, {
      skillId: 'golden-body-inner',
      skillType: 'inner',
      experience: 30,
      level: 2,
    })
    expect(next.innerSkillIds).toContain('golden-body-inner')
    expect(next.skillProgression?.['golden-body-inner']).toEqual({ experience: 30, level: 2 })
  })

  it('移除倉庫功法', () => {
    const warehouse = [
      { skillId: 'golden-body-inner', skillType: 'inner' as const, experience: 30, level: 2 },
      { skillId: 'swift-wind-inner', skillType: 'inner' as const, experience: 0, level: 1 },
    ]
    const next = removeSkillFromWarehouse(warehouse, 'golden-body-inner')
    expect(next).toHaveLength(1)
    expect(next[0].skillId).toBe('swift-wind-inner')
  })
})