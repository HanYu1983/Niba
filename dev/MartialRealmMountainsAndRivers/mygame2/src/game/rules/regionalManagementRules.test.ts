import { describe, expect, it } from 'vitest'
import {
  canOpenRegionalManagement,
  canSwitchRemotePolicy,
  canTransferMaterials,
  hasRegionalManagement,
} from './regionalManagementRules'
import type { GameState, PlayerState } from '../types'
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
    prestige: 80,
    money: 0,
    experience: 0,
    inventory: [],
    turnEnded: false,
    governanceRank: 2,
    unlockedPolicyIds: ['basic', 'civilian'],
    ...overrides,
  }
}

function makeState(overrides: Partial<GameState> = {}): GameState {
  const player = makePlayer()
  return {
    map: { rows: 11, columns: 11, cells: [] },
    bases: [
      {
        id: 'base-1',
        name: '總管府據點',
        position: { row: 5, column: 6 },
        buildings: [{ id: 'b1-rm', type: 'regional-management', name: '總管府', description: '', constructionCost: 80 }],
        buildingMaterials: 100,
        maxBuildingMaterials: 100,
        health: 100,
        maxHealth: 100,
        activePolicyId: 'basic',
      },
      {
        id: 'base-2',
        name: '目的據點',
        position: { row: 10, column: 10 },
        buildings: [],
        buildingMaterials: 50,
        maxBuildingMaterials: 100,
        health: 100,
        maxHealth: 100,
        activePolicyId: 'basic',
      },
    ],
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

describe('總管府治理', () => {
  it('hasRegionalManagement 判斷正確', () => {
    const withRm = makeState().bases[0]
    expect(hasRegionalManagement(withRm)).toBe(true)
  })

  it('玩家在有總管府的據點附近可開啟治理', () => {
    const state = makeState()
    expect(canOpenRegionalManagement(state, 'player-1').ok).toBe(true)
  })

  it('沒有總管府時無法開啟治理', () => {
    const state = makeState({
      bases: [{
        ...makeState().bases[0],
        buildings: [],
      }],
    })
    expect(canOpenRegionalManagement(state, 'player-1').ok).toBe(false)
  })

  it('可遠端切換目標據點政策', () => {
    const state = makeState()
    expect(canSwitchRemotePolicy(state, 'player-1', 'base-2', 'civilian').ok).toBe(true)
  })

  it('未解鎖的政策無法遠端切換', () => {
    const state = makeState()
    expect(canSwitchRemotePolicy(state, 'player-1', 'base-2', 'military').ok).toBe(false)
  })

  it('可調度建料到其他據點並套用損耗', () => {
    const state = makeState()
    const result = canTransferMaterials(state, 'player-1', 'base-1', 'base-2', 20)
    expect(result.ok).toBe(true)
    expect(result.deliveredAmount).toBe(18)
  })

  it('來源建料不足時無法調度', () => {
    const state = makeState({
      bases: [{
        ...makeState().bases[0],
        buildingMaterials: 5,
      }],
    })
    expect(canTransferMaterials(state, 'player-1', 'base-1', 'base-2', 20).ok).toBe(false)
  })

  it('來源與目的相同時無法調度', () => {
    const state = makeState()
    expect(canTransferMaterials(state, 'player-1', 'base-1', 'base-1', 10).ok).toBe(false)
  })

  it('目的據點建料倉庫提高調度上限', () => {
    const state = makeState({
      bases: [
        makeState().bases[0],
        {
          ...makeState().bases[1],
          buildingMaterials: 95,
          buildings: [{
            id: 'b2-warehouse',
            type: 'warehouse',
            name: '建料倉庫',
            description: '',
            constructionCost: 40,
            materialCapacityBonus: 50,
          }],
        },
      ],
    })
    // 目的據點 95 + 18 = 113，基礎上限 100 會拒絕，但倉庫上限 150 應允許。
    const result = canTransferMaterials(state, 'player-1', 'base-1', 'base-2', 20)
    expect(result.ok).toBe(true)
    expect(result.deliveredAmount).toBe(18)
  })
})