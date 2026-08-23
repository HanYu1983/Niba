import { describe, expect, it } from 'vitest'
import { chooseSelfPreservationAction } from './aiSelfPreservationRules'
import type { CreatureState, GameState, PlayerState } from './types'

function player(overrides: Partial<PlayerState> = {}): PlayerState {
  return {
    id: 'ai-1', name: 'AI', isAI: true, position: { row: 5, column: 5 }, attributes: { armStrength: 8, constitution: 8, agility: 7, innerEnergy: 5, insight: 7 }, innerSkillIds: ['tuna-gong'], innerSkillId: 'tuna-gong', externalSkillIds: [], equippedExternalSkillIds: [], health: 30, maxHealth: 30, stamina: 20, maxStamina: 20, innerPower: 10, maxInnerPower: 10, prestige: 0, money: 0, experience: 0, inventory: [], turnEnded: false, ...overrides,
  }
}

function creature(id: string, position: { row: number; column: number }): CreatureState {
  return { ...player({ id, name: id, isAI: false, position }), behaviorType: 'roamer', schoolId: 'scarlet-flame' } as CreatureState
}

function state(overrides: Partial<GameState> = {}): GameState {
  return {
    map: { rows: 11, columns: 11, cells: Array.from({ length: 121 }, (_, index) => { const row = Math.floor(index / 11); const column = index % 11; return { id: `${row}-${column}`, row, column, terrain: 'plain' as const } }) },
    bases: [], defenseStructures: [], ruins: [], creatureNests: [], resourcePoints: [], itemPoints: [], explorationEvents: [], players: [player()], creatures: [], activePlayerId: 'ai-1', round: 1, creatureActionLogs: [], attackPreview: null, externalSkillPreview: null, repairPreview: null, creatureTurnInProgress: false, activeCreatureId: null, operation: { type: 'idle' }, blockingModal: null, aiOrders: [], aiConstructionPlans: [], ...overrides,
  }
}

describe('AI 自保決策', () => {
  it('生命值低於玩家設定門檻時優先撤退', () => {
    const action = chooseSelfPreservationAction(state({ players: [player({ health: 6 })] }), 'ai-1', 30)
    expect(action?.type).toBe('move')
    if (action?.type === 'move') expect(action.reason).toBe('self-preservation')
  })

  it('被兩名敵人包圍時優先脫離危險', () => {
    const action = chooseSelfPreservationAction(state({ creatures: [creature('c1', { row: 5, column: 4 }), creature('c2', { row: 5, column: 6 })] }), 'ai-1', 0)
    expect(action?.type).toBe('move')
  })

  it('沒有自保條件時交回玩家命令決策', () => {
    expect(chooseSelfPreservationAction(state(), 'ai-1', 30)).toBeNull()
  })
})
