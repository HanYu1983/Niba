import { describe, expect, it } from 'vitest'
import type { CreatureTurnResult } from './creatureActions'
import { moveCreatures } from './creatureActions'
import { endPlayerTurn } from './turnActions'
import type { CreatureState, GameState, PlayerState } from '../types'
import type { AiActionEvent } from '../ai/aiActionEvent'

function makePlainMap(rows: number, columns: number): GameState['map'] {
  return {
    rows,
    columns,
    cells: Array.from({ length: rows * columns }, (_, index) => {
      const row = Math.floor(index / columns)
      const column = index % columns
      const isBorder = row === 0 || column === 0 || row === rows - 1 || column === columns - 1
      return { id: `${row}-${column}`, row, column, terrain: isBorder ? ('wall' as const) : ('plain' as const) }
    }),
  }
}

function makePlayer(overrides: Partial<PlayerState> = {}): PlayerState {
  const attributes = { armStrength: 8, constitution: 8, agility: 7, innerEnergy: 5, insight: 7 }
  return {
    id: 'player-1',
    name: '玩家 1',
    position: { row: 5, column: 5 },
    attributes,
    innerSkillIds: ['tuna-gong'],
    innerSkillId: 'tuna-gong',
    externalSkillIds: [],
    equippedExternalSkillIds: [],
    health: 24,
    maxHealth: 24,
    stamina: 7,
    maxStamina: 7,
    innerPower: 15,
    maxInnerPower: 15,
    prestige: 0,
    money: 0,
    experience: 0,
    inventory: [],
    turnEnded: false,
    ...overrides,
  }
}

function makeCreature(id: string, position: { row: number; column: number }, overrides: Partial<CreatureState> = {}): CreatureState {
  return makePlayer({
    id,
    name: `生物 ${id}`,
    position,
    attributes: { armStrength: 4, constitution: 6, agility: 3, innerEnergy: 2, insight: 1 },
    ...overrides,
  })
}

function makeSmallState(overrides: Partial<GameState> = {}): GameState {
  return {
    map: makePlainMap(11, 11),
    bases: [],
    creatureNests: [],
    resourcePoints: [],
    itemPoints: [],
    players: [makePlayer()],
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

describe('runCreatureTurn 產出 §4.5 全域事件（切片 J）', () => {
  it('相鄰玩家 → 攻擊事件，actor 為 creature、回合號正確', () => {
    const state = makeSmallState({
      players: [makePlayer({ position: { row: 3, column: 4 } })],
      creatures: [makeCreature('c1', { row: 3, column: 3 })],
    })

    const result = moveCreatures(
      state.creatures, state.map, state.players, state.bases, state.resourcePoints,
      state.defenseStructures ?? [], state.itemPoints, state.explorationEvents ?? [],
      state.creatureNests, state.ruins ?? [], state.traps ?? [], state.sectGates ?? [],
      state.globalBuffs ?? [], undefined, 7,
    )

    expect(result.events).toHaveLength(1)
    const event = result.events![0]
    expect(event.round).toBe(7)
    expect(event.actor).toEqual({ id: 'c1', kind: 'creature', name: '生物 c1' })
    expect(event.action.type).toBe('attack')
    if (event.action.type === 'attack') {
      expect(event.action.actor).toEqual({ id: 'c1', kind: 'creature' })
      expect(event.action.target).toMatchObject({ id: 'player-1', kind: 'player', position: { row: 3, column: 4 } })
    }
    expect(event.result).toBe('succeeded')
  })

  it('沒有任何目標 → 原地待命事件（succeeded）', () => {
    const state = makeSmallState({ players: [], creatures: [makeCreature('c1', { row: 3, column: 3 })] })

    const result = moveCreatures(
      state.creatures, state.map, state.players, state.bases, state.resourcePoints,
      state.defenseStructures ?? [], state.itemPoints, state.explorationEvents ?? [],
    )

    expect(result.events).toHaveLength(1)
    const event = result.events![0]
    expect(event.action).toMatchObject({ type: 'hold', actor: { id: 'c1', kind: 'creature' } })
    expect(event.result).toBe('succeeded')
    expect(event.reason).toContain('原地待命')
  })

  it('體力不足以移動 → 待命事件記為 failed', () => {
    const state = makeSmallState({
      players: [makePlayer({ position: { row: 3, column: 5 } })],
      creatures: [makeCreature('c1', { row: 3, column: 3 }, { stamina: 1, maxStamina: 1 })],
    })

    const result = moveCreatures(
      state.creatures, state.map, state.players, state.bases, state.resourcePoints,
      state.defenseStructures ?? [], state.itemPoints, state.explorationEvents ?? [],
    )

    expect(result.events).toHaveLength(1)
    const event = result.events![0]
    expect(event.action.type).toBe('hold')
    expect(event.result).toBe('failed')
  })

  it('多隻 Creature 的事件順序與輸入順序一致', () => {
    const state = makeSmallState({
      players: [],
      creatures: [
        makeCreature('c1', { row: 2, column: 2 }),
        makeCreature('c2', { row: 8, column: 8 }),
      ],
    })

    const result = moveCreatures(
      state.creatures, state.map, state.players, state.bases, state.resourcePoints,
      state.defenseStructures ?? [], state.itemPoints, state.explorationEvents ?? [],
    )

    expect(result.events?.map((event) => event.actor.id)).toEqual(['c1', 'c2'])
  })
})

describe('endPlayerTurn 把 Creature 事件併入 GameState.actionEvents（切片 J）', () => {
  function makeCreatureResult(events: AiActionEvent[]): CreatureTurnResult {
    return {
      creatures: [],
      players: [],
      resourcePoints: [],
      logs: [],
      steps: [],
      events,
    }
  }

  it('回合完成時：既有玩家事件保留，Creature 事件依序附加', () => {
    const state = makeSmallState()
    const priorEvent: AiActionEvent = {
      id: 'action-1-player-1-1',
      round: 1,
      actor: { id: 'player-1', kind: 'player', name: '玩家 1' },
      action: { type: 'end-turn', actor: { id: 'player-1', kind: 'player' }, reason: '測試' },
      result: 'succeeded',
      createdAt: '2026-08-24T00:00:00.000Z',
    }
    const stateWithEvents: GameState = { ...state, actionEvents: [priorEvent], players: [makePlayer({ turnEnded: false })] }
    const creatureEvent: AiActionEvent = {
      id: 'action-1-c1-2',
      round: 1,
      actor: { id: 'c1', kind: 'creature', name: '生物 c1' },
      action: { type: 'hold', actor: { id: 'c1', kind: 'creature' }, reason: '沒有可執行的目標，原地待命。' },
      result: 'succeeded',
      createdAt: '2026-08-24T00:00:01.000Z',
    }

    const result = endPlayerTurn(stateWithEvents, 'player-1', {
      moveCreatures: () => makeCreatureResult([creatureEvent]),
      spawnCreaturesFromNests: (currentState, creatures) => ({ nests: currentState.creatureNests, creatures, logs: [] }),
    })

    expect(result.state.actionEvents).toEqual([priorEvent, creatureEvent])
  })

  it('回合未完成（其他玩家尚未結束）→ actionEvents 不變', () => {
    const state = makeSmallState({
      players: [makePlayer(), makePlayer({ id: 'player-2', name: '玩家 2' })],
    })
    const stateWithEvents: GameState = { ...state, actionEvents: [] }

    const result = endPlayerTurn(stateWithEvents, 'player-1', {
      moveCreatures: () => makeCreatureResult([]),
      spawnCreaturesFromNests: (currentState, creatures) => ({ nests: currentState.creatureNests, creatures, logs: [] }),
    })

    expect(result.creatureTurn).toBeNull()
    expect(result.state.actionEvents).toEqual([])
  })
})
