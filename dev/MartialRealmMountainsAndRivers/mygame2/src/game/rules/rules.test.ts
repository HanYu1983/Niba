import { describe, expect, it } from 'vitest'
import { validateDefenseBuild } from './defenseRules'
import { getReachableCellIds } from './movementRules'
import type { BaseState, GameState, PlayerState } from '../types'
import { getMaxHealth, getMaxInnerPower, getMaxStamina } from './playerStatsRules'

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
    health: getMaxHealth(attributes),
    maxHealth: getMaxHealth(attributes),
    stamina: getMaxStamina(attributes),
    maxStamina: getMaxStamina(attributes),
    innerPower: getMaxInnerPower(attributes),
    maxInnerPower: getMaxInnerPower(attributes),
    prestige: 0,
    money: 0,
    experience: 0,
    inventory: [],
    turnEnded: false,
    ...overrides,
  }
}

function makeBase(): BaseState {
  return {
    id: 'base-1',
    name: '測試據點',
    position: { row: 5, column: 6 },
    buildings: [],
    buildingMaterials: 20,
    maxBuildingMaterials: 100,
    health: 100,
    maxHealth: 100,
  }
}

function makeState(overrides: Partial<GameState> = {}): GameState {
  const rows = 11
  const columns = 11
  return {
    map: {
      rows,
      columns,
      cells: Array.from({ length: rows * columns }, (_, index) => {
        const row = Math.floor(index / columns)
        const column = index % columns
        return { id: `${row}-${column}`, row, column, terrain: 'plain' as const }
      }),
    },
    bases: [makeBase()],
    defenseStructures: [],
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
    repairPreview: null,
    creatureTurnInProgress: false,
    activeCreatureId: null,
    operation: { type: 'idle' },
    blockingModal: null,
    ...overrides,
  }
}

describe('movement rules', () => {
  it('只回傳體力可到達且不包含起點的格子', () => {
    const player = makePlayer({ stamina: 2, position: { row: 5, column: 5 } })
    const map = makeState().map

    const reachable = getReachableCellIds(map, player)

    expect(reachable).toContain('5-4')
    expect(reachable).not.toContain('5-5')
    expect(reachable).not.toContain('5-7')
  })

  it('被封鎖的格子不會列入可到達結果', () => {
    const player = makePlayer({ stamina: 4, position: { row: 5, column: 5 } })
    const reachable = getReachableCellIds(makeState().map, player, [{ row: 5, column: 4 }])

    expect(reachable).not.toContain('5-4')
  })
})

describe('defense build rules', () => {
  it('合法位置可以建造木柵', () => {
    const state = makeState()
    const player = state.players[0]

    expect(validateDefenseBuild(state, player, 'player-1', 'base-1', 'barricade', { row: 5, column: 7 })).toBeNull()
  })

  it('建料不足或位置被佔用時不可建造', () => {
    const state = makeState({
      bases: [{ ...makeBase(), buildingMaterials: 0 }],
    })
    const player = state.players[0]

    expect(validateDefenseBuild(state, player, 'player-1', 'base-1', 'barricade', { row: 5, column: 7 })).toContain('建料不足')

    const occupiedState = makeState({
      players: [makePlayer({ position: { row: 5, column: 7 } })],
    })
    expect(validateDefenseBuild(
      occupiedState,
      occupiedState.players[0],
      'player-1',
      'base-1',
      'barricade',
      { row: 5, column: 7 },
    )).toBe('目標格已被佔用。')
  })
})
