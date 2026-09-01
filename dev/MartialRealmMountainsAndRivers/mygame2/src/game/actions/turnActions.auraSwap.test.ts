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

describe('更換靈氣型功法後仍累積經驗', () => {
  it('同一功法解除後重新裝備，下一回合仍累積 +3 經驗', () => {
    const auraSkillId = 'golden-body-external-functional'
    let state = makeSmallState({
      players: [makePlayer({
        externalSkillIds: [auraSkillId],
        equippedExternalSkillIds: [auraSkillId],
        skillProgression: { [auraSkillId]: { experience: 0, level: 1 } },
      })],
    })

    let result = endPlayerTurn(state, 'player-1', emptyDeps)
    expect(result.state.players[0]?.skillProgression?.[auraSkillId]?.experience).toBe(3)

    state = {
      ...result.state,
      creatureTurnInProgress: false,
      players: result.state.players.map((player) => ({ ...player, equippedExternalSkillIds: [], turnEnded: false })),
    }
    result = endPlayerTurn(state, 'player-1', emptyDeps)
    expect(result.state.players[0]?.skillProgression?.[auraSkillId]?.experience).toBe(3)

    state = {
      ...result.state,
      creatureTurnInProgress: false,
      players: result.state.players.map((player) => ({ ...player, equippedExternalSkillIds: [auraSkillId], turnEnded: false })),
    }
    result = endPlayerTurn(state, 'player-1', emptyDeps)
    expect(result.state.players[0]?.skillProgression?.[auraSkillId]?.experience).toBe(6)
  })

  it('先裝備 A 結束回合，再換成 B 結束回合，B 仍累積經驗', () => {
    const auraA = 'golden-body-external-functional'
    const auraB = 'swift-wind-external-functional'
    // 初始裝備 A
    let state = makeSmallState({
      players: [makePlayer({
        externalSkillIds: [auraA, auraB],
        equippedExternalSkillIds: [auraA],
        skillProgression: { [auraA]: { experience: 0, level: 1 } },
      })],
    })

    // 回合 1：裝備 A，結束回合 → A +5
    let result = endPlayerTurn(state, 'player-1', emptyDeps)
    let progressed = result.state.players.find((p) => p.id === 'player-1')
    expect(progressed?.skillProgression?.[auraA]?.experience).toBe(AURA_SKILL_EXPERIENCE_PER_ROUND)

    // 模擬更換：卸下 A，裝備 B，並清除生物回合旗標
    state = {
      ...result.state,
      creatureTurnInProgress: false,
      players: result.state.players.map((p) => p.id === 'player-1'
        ? { ...p, equippedExternalSkillIds: [auraB], turnEnded: false }
        : p),
    }

    // 回合 2：裝備 B，結束回合 → B +5
    result = endPlayerTurn(state, 'player-1', emptyDeps)
    progressed = result.state.players.find((p) => p.id === 'player-1')
    expect(progressed?.equippedExternalSkillIds).toEqual([auraB])
    expect(progressed?.skillProgression?.[auraB]?.experience).toBe(AURA_SKILL_EXPERIENCE_PER_ROUND)
  })
})