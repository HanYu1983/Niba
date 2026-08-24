import { describe, expect, it } from 'vitest'
import { chooseSupportAction } from './aiSupportRules'
import type { BaseState, GameState, PlayerState } from './types'

function player(id: string, position: { row: number; column: number }, overrides: Partial<PlayerState> = {}): PlayerState {
  return {
    id, name: id, isAI: id.startsWith('ai'), position, attributes: { armStrength: 8, constitution: 8, agility: 7, innerEnergy: 5, insight: 7 },
    innerSkillIds: ['tuna-gong'], innerSkillId: 'tuna-gong', externalSkillIds: [], equippedExternalSkillIds: [], health: 30, maxHealth: 30,
    stamina: 20, maxStamina: 20, innerPower: 10, maxInnerPower: 10, prestige: 0, money: 0, experience: 0, inventory: [], turnEnded: false, ...overrides,
  }
}

const base: BaseState = { id: 'base-1', name: '洛陽', position: { row: 1, column: 1 }, buildings: [], buildingMaterials: 0, maxBuildingMaterials: 100, health: 100, maxHealth: 100 }
const order = { id: 'support-1', type: 'support-player' as const, aiPlayerId: 'ai-1', playerId: 'player-1', maxDistance: 3, priority: 80, retreatHealthPercent: 30, status: 'active' as const }

function state(overrides: Partial<GameState> = {}): GameState {
  return {
    map: { rows: 11, columns: 11, cells: Array.from({ length: 121 }, (_, index) => { const row = Math.floor(index / 11); const column = index % 11; return { id: `${row}-${column}`, row, column, terrain: 'plain' as const } }) },
    bases: [base], defenseStructures: [], ruins: [], creatureNests: [], resourcePoints: [], itemPoints: [], explorationEvents: [],
    players: [player('ai-1', { row: 1, column: 1 }), player('player-1', { row: 5, column: 5 })], creatures: [], activePlayerId: 'ai-1', round: 1, creatureActionLogs: [], attackPreview: null, externalSkillPreview: null, repairPreview: null, creatureTurnInProgress: false, activeCreatureId: null, operation: { type: 'idle' }, blockingModal: null, aiOrders: [], aiConstructionPlans: [], ...overrides,
  }
}

describe('AI 支援決策', () => {
  it('與目標距離超過限制時，移動靠近目標玩家', () => {
    const action = chooseSupportAction(state(), 'ai-1', order)
    expect(action.type).toBe('move')
  })

  it('目標玩家死亡時，停止執行支援命令', () => {
    const action = chooseSupportAction(state({ players: [player('ai-1', { row: 1, column: 1 }), player('player-1', { row: 5, column: 5 }, { health: 0 })] }), 'ai-1', order)
    expect(action).toEqual({ type: 'end-turn', reason: 'command-paused' })
  })

  it('支援目標附近有威脅且 AI 相鄰時，優先攻擊', () => {
    const action = chooseSupportAction(state({ players: [player('ai-1', { row: 5, column: 3 }), player('player-1', { row: 5, column: 5 })], creatures: [player('creature-1', { row: 5, column: 4 }, { isAI: false }) as never] }), 'ai-1', { ...order, maxDistance: 10 })
    expect(action).toEqual({ type: 'attack', targetId: 'creature-1', targetType: 'creature' })
  })

  it('阻擋 AI 前往支援目標的生物，即使遠離目標也會優先攻擊', () => {
    const action = chooseSupportAction(state({
      players: [player('ai-1', { row: 5, column: 3 }), player('player-1', { row: 5, column: 8 })],
      creatures: [player('creature-1', { row: 5, column: 4 }, { isAI: false }) as never],
    }), 'ai-1', { ...order, maxDistance: 3 })
    expect(action).toEqual({ type: 'attack', targetId: 'creature-1', targetType: 'creature' })
  })
})
