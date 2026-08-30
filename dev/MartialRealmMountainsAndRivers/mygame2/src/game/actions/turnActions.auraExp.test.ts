import { describe, expect, it } from 'vitest'
import { endPlayerTurn, AURA_SKILL_EXPERIENCE_PER_ROUND } from './turnActions'
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

const emptyDeps = {
  moveCreatures: (currentState: GameState) => ({ creatures: [], players: currentState.players, resourcePoints: [], logs: [], steps: [] }),
  spawnCreaturesFromNests: (currentState: GameState, creatures: GameState['creatures']) => ({ nests: currentState.creatureNests, creatures, logs: [] }),
}

describe('靈氣型外功每回合經驗（endPlayerTurn）', () => {
  it('已裝備的靈氣型外功在結束回合時累積 +5 功法經驗', () => {
    const auraSkillId = 'golden-body-external-functional'
    const state = makeSmallState({
      players: [makePlayer({
        externalSkillIds: [auraSkillId],
        equippedExternalSkillIds: [auraSkillId],
        skillProgression: { [auraSkillId]: { experience: 0, level: 1 } },
      })],
    })

    const result = endPlayerTurn(state, 'player-1', emptyDeps)

    const progressed = result.state.players.find((p) => p.id === 'player-1')
    expect(progressed?.skillProgression?.[auraSkillId]?.experience).toBe(AURA_SKILL_EXPERIENCE_PER_ROUND)
    expect(progressed?.skillProgression?.[auraSkillId]?.level).toBe(1)
  })

  it('未裝備的靈氣型外功不累積經驗', () => {
    const auraSkillId = 'golden-body-external-functional'
    const state = makeSmallState({
      players: [makePlayer({
        externalSkillIds: [auraSkillId],
        equippedExternalSkillIds: [],
        skillProgression: { [auraSkillId]: { experience: 0, level: 1 } },
      })],
    })

    const result = endPlayerTurn(state, 'player-1', emptyDeps)

    const progressed = result.state.players.find((p) => p.id === 'player-1')
    expect(progressed?.skillProgression?.[auraSkillId]?.experience).toBe(0)
  })

  it('傷害型外功（非 aura）不累積經驗', () => {
    const damageSkillId = 'golden-body-external-damage'
    const state = makeSmallState({
      players: [makePlayer({
        externalSkillIds: [damageSkillId],
        equippedExternalSkillIds: [damageSkillId],
        skillProgression: { [damageSkillId]: { experience: 0, level: 1 } },
      })],
    })

    const result = endPlayerTurn(state, 'player-1', emptyDeps)

    const progressed = result.state.players.find((p) => p.id === 'player-1')
    expect(progressed?.skillProgression?.[damageSkillId]?.experience).toBe(0)
  })

  it('多個已裝備靈氣型外功各自累積經驗', () => {
    const aura1 = 'golden-body-external-functional'
    const aura2 = 'golden-body-external-functional-2'
    const state = makeSmallState({
      players: [makePlayer({
        externalSkillIds: [aura1, aura2],
        equippedExternalSkillIds: [aura1, aura2],
        skillProgression: { [aura1]: { experience: 0, level: 1 }, [aura2]: { experience: 0, level: 1 } },
      })],
    })

    const result = endPlayerTurn(state, 'player-1', emptyDeps)

    const progressed = result.state.players.find((p) => p.id === 'player-1')
    expect(progressed?.skillProgression?.[aura1]?.experience).toBe(AURA_SKILL_EXPERIENCE_PER_ROUND)
    expect(progressed?.skillProgression?.[aura2]?.experience).toBe(AURA_SKILL_EXPERIENCE_PER_ROUND)
  })
})