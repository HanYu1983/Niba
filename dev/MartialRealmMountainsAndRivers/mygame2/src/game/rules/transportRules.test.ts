import { describe, expect, it } from 'vitest'
import {
  canTransportPlayer,
  hasWaystation,
  getTransportCost,
  getTransportTargets,
  resolveTransportTarget,
  WAYSTATION_TRANSPORT_COST,
} from './transportRules'
import type { BaseState, DefenseStructureState, GameState, PlayerState } from '../types'
import { getMaxHealth, getMaxInnerPower, getMaxStamina } from './playerStatsRules'

function makeSmallWaystation(overrides: Partial<DefenseStructureState> = {}): DefenseStructureState {
  return {
    id: 'sws-1',
    type: 'small-waystation',
    name: '小型驛站',
    description: '由廢墟修復而成',
    icon: '🐎',
    constructionCost: 0,
    requiredRank: 0,
    maxHealth: 30,
    healthBonus: 0,
    blocksMovement: true,
    providesVision: false,
    attackRange: 0,
    attackDamage: 0,
    position: { row: 5, column: 6 },
    ownerBaseId: '',
    health: 30,
    ...overrides,
  }
}

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
    money: 100,
    experience: 0,
    inventory: [],
    turnEnded: false,
    ...overrides,
  }
}

function makeBase(overrides: Partial<BaseState> = {}): BaseState {
  return {
    id: 'base-1',
    name: '測試據點 1',
    position: { row: 5, column: 6 },
    buildings: [],
    buildingMaterials: 100,
    maxBuildingMaterials: 100,
    health: 100,
    maxHealth: 100,
    ...overrides,
  }
}

function makeState(overrides: Partial<GameState> = {}): GameState {
  const player = makePlayer()
  return {
    map: {
      rows: 11,
      columns: 11,
      cells: Array.from({ length: 121 }, (_, index) => {
        const row = Math.floor(index / 11)
        const column = index % 11
        return { id: `${row}-${column}`, row, column, terrain: 'plain' as const }
      }),
    },
    bases: [],
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
    ...overrides,
  }
}

describe('驛站傳送', () => {
  it('出發據點需要有驛站', () => {
    const source = makeBase({ id: 'source', position: { row: 5, column: 6 }, buildings: [] })
    const target = makeBase({ id: 'target', position: { row: 10, column: 10 } })
    const state = makeState({ bases: [source, target] })
    expect(canTransportPlayer(state, 'player-1', 'target').ok).toBe(false)
  })

  it('目的據點不需要有驛站', () => {
    const source = makeBase({
      id: 'source',
      position: { row: 5, column: 6 },
      buildings: [{ id: 'ws', type: 'waystation', name: '驛站', description: '', constructionCost: 20 }],
    })
    const target = makeBase({ id: 'target', position: { row: 10, column: 10 }, buildings: [] })
    const state = makeState({ bases: [source, target] })
    const result = canTransportPlayer(state, 'player-1', 'target')
    expect(result.ok).toBe(true)
    expect(result.cost).toBe(WAYSTATION_TRANSPORT_COST)
  })

  it('目標據點周遭沒有空地時不可傳送', () => {
    const source = makeBase({
      id: 'source',
      position: { row: 5, column: 6 },
      buildings: [{ id: 'ws', type: 'waystation', name: '驛站', description: '', constructionCost: 20 }],
    })
    const target = makeBase({ id: 'target', position: { row: 5, column: 5 } })
    const blockers = [
      { id: 'p2', name: '玩家 2', position: { row: 4, column: 5 } },
      { id: 'p3', name: '玩家 3', position: { row: 6, column: 5 } },
      { id: 'p4', name: '玩家 4', position: { row: 5, column: 4 } },
      { id: 'p5', name: '玩家 5', position: { row: 5, column: 6 } },
    ].map((blocked) => ({ ...makePlayer(), ...blocked }))
    const state = makeState({ bases: [source, target], players: [makePlayer(), ...blockers] })

    expect(canTransportPlayer(state, 'player-1', 'target').ok).toBe(false)
  })

  it('金錢不足時無法傳送', () => {
    const source = makeBase({
      id: 'source',
      position: { row: 5, column: 6 },
      buildings: [{ id: 'ws', type: 'waystation', name: '驛站', description: '', constructionCost: 20 }],
    })
    const target = makeBase({ id: 'target', position: { row: 10, column: 10 } })
    const state = makeState({
      bases: [source, target],
      players: [makePlayer({ money: 5 })],
    })
    expect(canTransportPlayer(state, 'player-1', 'target').ok).toBe(false)
  })

  it('不能傳送到目前據點', () => {
    const source = makeBase({
      id: 'source',
      position: { row: 5, column: 6 },
      buildings: [{ id: 'ws', type: 'waystation', name: '驛站', description: '', constructionCost: 20 }],
    })
    const state = makeState({ bases: [source] })
    expect(canTransportPlayer(state, 'player-1', 'source').ok).toBe(false)
  })

  it('hasWaystation 判斷正確', () => {
    const withWaystation = makeBase({
      buildings: [{ id: 'ws', type: 'waystation', name: '驛站', description: '', constructionCost: 20 }],
    })
    const without = makeBase({ buildings: [] })
    expect(hasWaystation(withWaystation)).toBe(true)
    expect(hasWaystation(without)).toBe(false)
  })

  it('getTransportCost 返回 0 當無法傳送', () => {
    const target = makeBase({ id: 'target', position: { row: 10, column: 10 } })
    const state = makeState({ bases: [target] })
    expect(getTransportCost(state, 'player-1', 'target')).toBe(0)
  })

  it('小型驛站是說明：從據點驛站可傳送到的其目標（據點或小型驛站）', () => {
    const source = makeBase({
      id: 'source',
      position: { row: 5, column: 6 },
      buildings: [{ id: 'ws', type: 'waystation', name: '驛站', description: '', constructionCost: 20 }],
    })
    const target = makeBase({ id: 'target', position: { row: 10, column: 10 } })
    const smallWaystation = makeSmallWaystation({ id: 'sws-2', position: { row: 8, column: 8 }, originName: '青石村' })
    const state = makeState({ bases: [source, target], defenseStructures: [smallWaystation] })
    const result = canTransportPlayer(state, 'player-1', 'sws-2')
    expect(result.ok).toBe(true)
    expect(result.cost).toBe(WAYSTATION_TRANSPORT_COST)
  })

  it('getTransportTargets 包含其他據點與小型驛站', () => {
    const source = makeBase({ id: 'source', position: { row: 5, column: 6 } })
    const target = makeBase({ id: 'target', position: { row: 10, column: 10 } })
    const smallWaystation = makeSmallWaystation({ id: 'sws-1', position: { row: 8, column: 8 }, originName: '忘憂谷村' })
    const otherWaystation = makeSmallWaystation({ id: 'sws-2', position: { row: 9, column: 9 } })
    const state = makeState({ bases: [source, target], defenseStructures: [smallWaystation, otherWaystation] })

    const targets = getTransportTargets(state, { kind: 'base', baseId: 'source' })
    expect(targets.map((t) => t.id)).toEqual(['target', 'sws-1', 'sws-2'])
    expect(targets.find((t) => t.id === 'sws-1')?.kind).toBe('small-waystation')
  })

  it('據點驛站不再將門派據點列為傳送目標', () => {
    const source = makeBase({
      id: 'source',
      position: { row: 5, column: 6 },
      buildings: [{ id: 'ws', type: 'waystation', name: '驛站', description: '', constructionCost: 20 }],
    })
    const gate = { id: 'gate-1', schoolId: 'swift-wind' as const, position: { row: 10, column: 10 }, experience: 0, level: 1 as const }
    const state = makeState({ bases: [source], sectGates: [gate] })
    const targets = getTransportTargets(state, { kind: 'base', baseId: 'source' })

    expect(targets.find((target) => target.id === 'gate-1')).toBeUndefined()
    expect(canTransportPlayer(state, 'player-1', 'gate-1').ok).toBe(false)
  })

  it('getTransportTargets 排除已失活的據點', () => {
    const source = makeBase({ id: 'source', position: { row: 5, column: 6 } })
    const activeTarget = makeBase({ id: 'active-target', position: { row: 10, column: 10 } })
    const inactiveTarget = makeBase({ id: 'inactive-target', position: { row: 12, column: 12 }, health: 0, active: false })
    const state = makeState({ bases: [source, activeTarget, inactiveTarget] })

    const targets = getTransportTargets(state, { kind: 'base', baseId: 'source' })
    expect(targets.map((target) => target.id)).toEqual(['active-target'])
    expect(resolveTransportTarget(state, 'inactive-target')).toBeNull()
  })

  it('小型驛站傳送目標 = 所有其他小型驛站（排除自身）', () => {
    const source = makeBase({ id: 'source', position: { row: 5, column: 6 } })
    const current = makeSmallWaystation({ id: 'sws-curr', originName: '蘆葦村' })
    const other = makeSmallWaystation({ id: 'sws-other', position: { row: 8, column: 8 }, originName: '青石村' })
    const state = makeState({ bases: [source], defenseStructures: [current, other] })

    const targets = getTransportTargets(state, { kind: 'small-waystation', structure: current })
    expect(targets.map((t) => t.id)).toEqual(['sws-other'])
    expect(targets.find((t) => t.id === 'sws-other')?.name).toBe('青石村')
  })

  it('小型驛站可傳送to其他小型驛站', () => {
    const source = makeBase({ id: 'source', position: { row: 5, column: 6 } })
    const current = makeSmallWaystation({ id: 'sws-current', originName: '蘆葦村' })
    const other = makeSmallWaystation({ id: 'sws-target', position: { row: 8, column: 8 } })
    const state = makeState({
      bases: [source],
      defenseStructures: [current, other],
    })
    const result = canTransportPlayer(state, 'player-1', 'sws-target')
    expect(result.ok).toBe(true)
  })

  it('小型驛站不可傳送到自身', () => {
    const source = makeBase({ id: 'source', position: { row: 5, column: 6 } })
    const current = makeSmallWaystation({ id: 'sws-1' })
    const state = makeState({
      bases: [source],
      defenseStructures: [current],
    })
    expect(canTransportPlayer(state, 'player-1', 'sws-1').ok).toBe(false)
  })

  it('小型驛站不可傳送到據點', () => {
    const source = makeBase({ id: 'source', position: { row: 5, column: 6 } })
    const target = makeBase({ id: 'target', position: { row: 10, column: 10 } })
    const current = makeSmallWaystation({ id: 'sws-1' })
    const state = makeState({
      bases: [source, target],
      defenseStructures: [current],
    })
    expect(canTransportPlayer(state, 'player-1', 'target').ok).toBe(false)
  })
})