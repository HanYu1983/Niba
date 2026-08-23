import { describe, expect, it } from 'vitest'
import { getAttackTarget, getExplorationEventTarget, getMovementTarget, getResourceCollectionTarget } from './targetRules'
import type { CreatureNestState, CreatureState, ExplorationEventState, GameState, PlayerState, ResourcePointState } from '../types'

const player: PlayerState = {
  id: 'player-1',
  name: '玩家 1',
  position: { row: 5, column: 5 },
  attributes: { armStrength: 8, constitution: 8, agility: 7, innerEnergy: 5, insight: 7 },
  innerSkillIds: ['tuna-gong'],
  innerSkillId: 'tuna-gong',
  externalSkillIds: [],
  equippedExternalSkillIds: [],
  health: 20,
  maxHealth: 24,
  stamina: 7,
  maxStamina: 7,
  innerPower: 10,
  maxInnerPower: 15,
  prestige: 0,
  money: 0,
  experience: 0,
  inventory: [],
  turnEnded: false,
}

const creature: CreatureState = { ...player, id: 'creature-1', name: 'Creature', position: { row: 5, column: 6 } }
const nest: CreatureNestState = { id: 'nest-1', name: '巢穴', position: { row: 6, column: 5 }, health: 100, maxHealth: 100, spawnChance: 0.1, cooldownRounds: 0, spawnLevel: 1 }
const resourcePoint: ResourcePointState = { id: 'resource-1', name: '資源點', position: { row: 5, column: 6 }, ownerBaseId: 'base-1', materialIncome: 10, lastCollectedRound: null, health: 30, maxHealth: 30 }
const event: ExplorationEventState = { id: 'event-1', type: 'lost-caravan', name: '商隊', description: '事件', position: { row: 6, column: 5 }, status: 'available', discovered: true, expiresAtRound: null }

const state: GameState = {
  map: { rows: 10, columns: 10, cells: [] },
  bases: [{ id: 'base-1', name: '據點', position: { row: 5, column: 7 }, buildings: [], buildingMaterials: 0, maxBuildingMaterials: 100, health: 100, maxHealth: 100 }],
  defenseStructures: [],
  creatureNests: [nest],
  resourcePoints: [resourcePoint],
  itemPoints: [],
  explorationEvents: [event],
  players: [player],
  creatures: [creature],
  activePlayerId: player.id,
  round: 1,
  creatureActionLogs: [],
  attackPreview: null,
  externalSkillPreview: null,
  repairPreview: null,
  creatureTurnInProgress: false,
  activeCreatureId: null,
  operation: { type: 'idle' },
  blockingModal: null,
}

describe('target rules', () => {
  it('可解析相鄰且存活的 Creature 與巢穴', () => {
    expect(getAttackTarget(state, player, 'creature', 'creature-1')?.target.id).toBe('creature-1')
    expect(getAttackTarget(state, player, 'nest', 'nest-1')?.target.id).toBe('nest-1')
  })

  it('不可解析死亡、遠距離或不存在的戰鬥目標', () => {
    expect(getAttackTarget(state, player, 'creature', 'missing')).toBeNull()
    expect(getAttackTarget(state, { ...player, position: { row: 1, column: 1 } }, 'creature', 'creature-1')).toBeNull()
    expect(getAttackTarget({ ...state, creatures: [{ ...creature, health: 0 }] }, player, 'creature', 'creature-1')).toBeNull()
  })

  it('可解析本回合尚未採集且相鄰的資源點', () => {
    expect(getResourceCollectionTarget(state, player, 'resource-1')?.base.id).toBe('base-1')
    expect(getResourceCollectionTarget({ ...state, resourcePoints: [{ ...resourcePoint, lastCollectedRound: 1 }] }, player, 'resource-1')?.base.id).toBe('base-1')
  })

  it('可解析位於資源點自身格的玩家', () => {
    const sameCellPlayer = { ...player, position: resourcePoint.position }
    expect(getResourceCollectionTarget(state, sameCellPlayer, 'resource-1')?.base.id).toBe('base-1')
  })

  it('只解析 available 且同格的探索事件', () => {
    const sameCellPlayer = { ...player, position: event.position }
    expect(getExplorationEventTarget(state, sameCellPlayer, 'event-1')?.event.id).toBe('event-1')
    expect(getExplorationEventTarget({ ...state, explorationEvents: [{ ...event, status: 'resolved' }] }, sameCellPlayer, 'event-1')).toBeNull()
  })

  it('資源點不阻擋移動（可通行採集）', () => {
    // 玩家在 (5,5)，資源點在 (5,6)，目標 (5,7)：資源點不應阻擋路徑
    const cells = Array.from({ length: 100 }, (_, index) => {
      const row = Math.floor(index / 10)
      const column = index % 10
      return { id: `${row}-${column}`, row, column, terrain: 'plain' as const }
    })
    const movingPlayer = { ...player, position: { row: 5, column: 5 }, stamina: 20 }
    const cleanState = {
      ...state,
      map: { rows: 10, columns: 10, cells },
      creatures: [],
      bases: [],
      resourcePoints: [{ ...resourcePoint, position: { row: 5, column: 6 } }],
    }
    const target = getMovementTarget(cleanState, movingPlayer, 'player-1', 5, 7)
    expect(target).not.toBeNull()
  })
})
