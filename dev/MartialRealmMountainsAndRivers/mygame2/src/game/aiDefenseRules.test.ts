import { describe, expect, it } from 'vitest'
import { chooseDefenseAction, assessBaseThreats } from './aiDefenseRules'
import type { BaseState, CreatureState, GameState, PlayerState } from './types'

function makePlayer(overrides: Partial<PlayerState> = {}): PlayerState {
  return {
    id: 'ai-1', name: 'AI 守城者', isAI: true, position: { row: 5, column: 5 },
    attributes: { armStrength: 8, constitution: 8, agility: 7, innerEnergy: 5, insight: 7 },
    innerSkillIds: ['tuna-gong'], innerSkillId: 'tuna-gong', externalSkillIds: [], equippedExternalSkillIds: [],
    health: 30, maxHealth: 30, stamina: 10, maxStamina: 10, innerPower: 10, maxInnerPower: 10,
    prestige: 0, money: 0, experience: 0, inventory: [], turnEnded: false, ...overrides,
  }
}

function makeBase(): BaseState {
  return { id: 'base-1', name: '洛陽', position: { row: 5, column: 5 }, buildings: [], buildingMaterials: 0, maxBuildingMaterials: 100, health: 100, maxHealth: 100 }
}

function makeCreature(overrides: Partial<CreatureState> = {}): CreatureState {
  return { ...makePlayer({ id: 'creature-1', name: '敵人', isAI: false }), behaviorType: 'roamer', schoolId: 'scarlet-flame', position: { row: 5, column: 6 }, health: 20, maxHealth: 20, ...overrides } as CreatureState
}

function makeState(overrides: Partial<GameState> = {}): GameState {
  const rows = 11
  const columns = 11
  return {
    map: { rows, columns, cells: Array.from({ length: rows * columns }, (_, index) => { const row = Math.floor(index / columns); const column = index % columns; return { id: `${row}-${column}`, row, column, terrain: 'plain' as const } }) },
    bases: [makeBase()], defenseStructures: [], ruins: [], creatureNests: [], resourcePoints: [], itemPoints: [], explorationEvents: [],
    players: [makePlayer()], creatures: [makeCreature()], activePlayerId: 'ai-1', round: 1, creatureActionLogs: [], attackPreview: null, externalSkillPreview: null,
    repairPreview: null, creatureTurnInProgress: false, activeCreatureId: null, operation: { type: 'idle' }, blockingModal: null, sharedWarehouse: [], sharedEquipmentWarehouse: [], aiOrders: [], aiConstructionPlans: [],
    ...overrides,
  }
}

const protectOrder = {
  id: 'order-1', type: 'protect-base' as const, aiPlayerId: 'ai-1', baseId: 'base-1', radius: 6, priority: 80, retreatHealthPercent: 30, status: 'active' as const,
}

describe('AI 防守決策', () => {
  it('相鄰威脅時優先攻擊', () => {
    const state = makeState()
    const threats = assessBaseThreats(state, 'base-1', 'ai-1')
    expect(threats[0]?.directlyAttackingBase).toBe(true)
    expect(chooseDefenseAction(state, 'ai-1', protectOrder)).toEqual({ type: 'attack', targetId: 'creature-1', targetType: 'creature' })
  })

  it('AI 在防守半徑外且可移動時返回防守範圍', () => {
    const state = makeState({ players: [makePlayer({ position: { row: 1, column: 1 }, stamina: 20, maxStamina: 20 })], creatures: [] })
    const action = chooseDefenseAction(state, 'ai-1', protectOrder)
    expect(action.type).toBe('move')
    if (action.type === 'move') expect(Math.abs(action.position.row - 5) + Math.abs(action.position.column - 5)).toBeLessThanOrEqual(6)
  })

  it('沒有威脅時待命', () => {
    const state = makeState({ creatures: [] })
    expect(chooseDefenseAction(state, 'ai-1', protectOrder)).toEqual({ type: 'hold-position', reason: 'no-threat' })
  })

  it('命令暫停時不會繼續執行防守行動', () => {
    const state = makeState()
    expect(chooseDefenseAction(state, 'ai-1', { ...protectOrder, status: 'paused' })).toEqual({ type: 'end-turn', reason: 'command-paused' })
  })
})
