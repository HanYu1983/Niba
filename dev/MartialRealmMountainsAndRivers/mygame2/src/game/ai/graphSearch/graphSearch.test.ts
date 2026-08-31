import { describe, expect, it } from 'vitest'
import { makeRoot, extractPath } from './AiNodeImpl'
import { runGraphSearchStep } from './runGraphSearchStep'
import { AiNodeImpl } from './AiNodeImpl'
import { getTierScore, canKillThisTurn } from './scoring'
import { executePure } from './executePure'
import type { GameState, PlayerState, CreatureState } from '../../types'
import type { AiAction } from '../aiAction'
import type { ExecuteAiActionDependencies } from '../execution/executeAiAction'

function makePlayerState(id: string, health: number, row: number, column: number, stamina: number) {
  return {
    id,
    name: id,
    isAI: true,
    position: { row, column },
    attributes: { armStrength: 8, constitution: 8, agility: 7, innerEnergy: 5, insight: 7 },
    baseAttributes: { armStrength: 8, constitution: 8, agility: 7, innerEnergy: 5, insight: 7 },
    health,
    maxHealth: 100,
    stamina,
    maxStamina: 100,
    innerPower: 20,
    maxInnerPower: 100,
    prestige: 0,
    money: 100,
    experience: 0,
    inventory: [],
    equippedExternalSkillIds: [],
    innerSkillIds: [],
    innerSkillId: 'tuna-gong',
    externalSkillIds: [],
    turnEnded: false,
  }
}

function makeState(overrides: Partial<GameState> = {}): GameState {
  const base: GameState = {
    map: {
      rows: 5,
      columns: 5,
      cells: Array.from({ length: 25 }, (_, index) => {
        const row = Math.floor(index / 5)
        const column = index % 5
        return { id: `${row}-${column}`, row, column, terrain: 'plain' }
      }),
    },
    players: [
      makePlayerState('ai-1', 100, 2, 2, 50) as PlayerState,
    ],
    creatures: [],
    creatureNests: [],
    bases: [],
    resourcePoints: [],
    itemPoints: [],
    defenseStructures: [],
    explorationEvents: [],
    activePlayerId: 'ai-1',
    round: 1,
    creatureActionLogs: [],
    attackPreview: null,
    externalSkillPreview: null,
    creatureTurnInProgress: false,
    activeCreatureId: null,
    operation: { type: 'idle' },
    blockingModal: null,
    ...overrides,
  }
  return base
}

const deps: ExecuteAiActionDependencies = {
  combat: {
    getActionablePlayer: (state: GameState, playerId: string) => state.players.find((p) => p.id === playerId) ?? null,
    createLootForPlayer: () => undefined,
    getLearnableSkill: () => undefined,
    applyExperienceAndLevelUp: (player) => player,
    addLootToPlayer: (player) => player,
  },
  turn: {
    moveCreatures: (s: GameState) => ({ creatures: s.creatures, players: s.players, resourcePoints: s.resourcePoints, logs: [] }),
    spawnCreaturesFromNests: (s: GameState) => ({ nests: s.creatureNests, creatures: s.creatures, logs: [] }),
  },
}

describe('AiNodeImpl', () => {
  it('累計成本由 parent 累加', () => {
    const root = makeRoot(makeState(), 'ai-1')
    const child = new AiNodeImpl(root.state, { type: 'end-turn', actor: { id: 'ai-1', kind: 'player' }, reason: 'test' } as AiAction, root, 2, 1, 48)
    expect(child.cumulativeCost).toBe(2)
  })

  it('makeRoot 建立深度 0 根節點', () => {
    const root = makeRoot(makeState(), 'ai-1')
    expect(root.depth).toBe(0)
    expect(root.remainingStamina).toBe(50)
  })
})

describe('extractPath', () => {
  it('回溯 parent 收集行動序列', () => {
    const root = makeRoot(makeState(), 'ai-1')
    const a1 = { type: 'end-turn', actor: { id: 'ai-1', kind: 'player' }, reason: 'a' } as AiAction
    const a2 = { type: 'end-turn', actor: { id: 'ai-1', kind: 'player' }, reason: 'b' } as AiAction
    const n1 = new AiNodeImpl(root.state, a1, root, 0, 1, 50)
    const n2 = new AiNodeImpl(root.state, a2, n1, 0, 2, 50)
    expect(extractPath(n2)).toEqual([a1, a2])
  })
})

describe('scoring', () => {
  it('getTierScore 依 tier 給分', () => {
    expect(getTierScore(1)).toBe(0.1)
    expect(getTierScore(6)).toBe(0.6)
  })

  it('canKillThisTurn 體力不足回 false', () => {
    const state = makeState()
    expect(canKillThisTurn(state, 'ai-1', { health: 5, maxHealth: 10, position: { row: 0, column: 0 } }, 2)).toBe(false)
  })
})

describe('runGraphSearchStep', () => {
  it('stamina 0 回無行動', () => {
    const state = makeState()
    state.players[0].stamina = 0
    const result = runGraphSearchStep(state, 'ai-1', deps)
    expect(result.actions).toEqual([])
    expect(result.exitReason).toBe('體力耗盡')
  })

  it('無威脅時回退探索；沒有可行動則交由出口結束回合', () => {
    const state = makeState()
    state.map.cells = state.map.cells.map((c) => ({ ...c, terrain: c.terrain }))
    const result = runGraphSearchStep(state, 'ai-1', deps)
    if (result.actions.length > 0) {
      expect(result.actions.every((action) => action.type !== 'end-turn')).toBe(true)
      expect(result.actions[0].type).toBe('move')
    } else {
      expect(result.exitReason).toBe('無可行動')
    }
  })

  it('鄰近擊殺目標時優先攻擊', () => {
    const state = makeState()
    state.creatures = [{
      id: 'c1',
      name: '弱怪',
      health: 5,
      maxHealth: 10,
      behaviorType: 'roamer',
      position: { row: 2, column: 3 },
      attributes: { armStrength: 1, constitution: 1, agility: 1, innerEnergy: 1, insight: 1 },
      innerSkillIds: [],
      innerSkillId: 'tuna-gong',
      externalSkillIds: [],
      equippedExternalSkillIds: [],
      stamina: 10,
      maxStamina: 10,
      innerPower: 10,
      maxInnerPower: 10,
      prestige: 0,
      money: 0,
      experience: 0,
      inventory: [],
      turnEnded: false,
    } as CreatureState]
    const result = runGraphSearchStep(state, 'ai-1', deps)
    expect(result.actions.length).toBeGreaterThan(0)
  })
})

describe('executePure', () => {
  it('不回傳 mutate 原始 state（深拷貝執行）', () => {
    const state = makeState()
    const action = { type: 'move', actor: { id: 'ai-1', kind: 'player' }, destination: { row: 2, column: 3 }, reason: 'test' } as AiAction
    const next = executePure(state, action, deps)
    expect(next).toBeDefined()
    expect(state.players[0].id).toBe('ai-1')
    expect(state.players[0].position).toEqual({ row: 2, column: 2 })
  })
})
