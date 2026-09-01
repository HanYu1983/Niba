import { afterEach, describe, expect, it, vi } from 'vitest'
import { triggerTurnStartExplorationEvent, EXPLORATION_TRIGGER_CHANCE } from './turnActions'
import type { GameState, PlayerState } from '../types'

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

function makeState(overrides: Partial<GameState> = {}): GameState {
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

afterEach(() => {
  vi.restoreAllMocks()
})

describe('triggerTurnStartExplorationEvent（回合開始隨機觸發探索事件）', () => {
  it('機率達成時為當前行動的人類玩家產生待處理事件', () => {
    // 第一次 random 決定「是否觸發」（0.1 < 0.2）；後續 random 用於選事件類型。
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0.1) // 觸發判定命中
      .mockReturnValueOnce(0)   // 選取事件類型偏移
      .mockReturnValueOnce(0)
    const state = makeState({ explorationTriggerChance: EXPLORATION_TRIGGER_CHANCE })
    const next = triggerTurnStartExplorationEvent(state, 'player-1')
    expect(next.pendingExplorationEvent).not.toBeNull()
    expect(next.pendingExplorationEventPlayerId).toBe('player-1')
  })

  it('機率未達成時不產生事件', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99) // 0.99 >= 0.2 → 不觸發
    const state = makeState({ explorationTriggerChance: EXPLORATION_TRIGGER_CHANCE })
    const next = triggerTurnStartExplorationEvent(state, 'player-1')
    expect(next.pendingExplorationEvent).toBeNull()
    expect(next.pendingExplorationEventPlayerId).toBeNull()
  })

  it('AI 玩家不會觸發事件', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0) // 機率命中
    const state = makeState({ players: [makePlayer({ isAI: true })], activePlayerId: 'player-1' })
    const next = triggerTurnStartExplorationEvent(state, 'player-1')
    expect(next.pendingExplorationEvent).toBeNull()
    expect(next.pendingExplorationEventPlayerId).toBeNull()
  })

  it('僅針對當前行動玩家觸發；指定非行動玩家時不動作', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0) // 機率命中
    const state = makeState({ players: [makePlayer(), makePlayer({ id: 'p2' })], activePlayerId: 'player-1' })
    // 指定 p2，但 p2 並非當前行動玩家，不應觸發。
    const next = triggerTurnStartExplorationEvent(state, 'p2')
    expect(next.pendingExplorationEvent).toBeNull()
  })
})