import { describe, expect, it, vi } from 'vitest'
import { moveCreatures } from './creatureActions'
import type { CreatureState, GameState, PlayerState } from '../types'
import { getCreatureCriticalRate, getCreatureEvasionRate, getCreatureRootReductionRate } from '../rules/playerDerivedRules'

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
    health: 100,
    maxHealth: 100,
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

function runCreatureTurn(state: GameState) {
  return moveCreatures(
    state.creatures, state.map, state.players, state.bases, state.resourcePoints,
    state.defenseStructures ?? [], state.itemPoints, state.explorationEvents ?? [],
    state.creatureNests, state.ruins ?? [], state.traps ?? [], state.sectGates ?? [],
    state.globalBuffs ?? [], undefined, 1,
  )
}

describe('生物對稱防禦與多次攻擊', () => {
  it('生物回避率依有效身法（含主場 Buff）計算', () => {
    const creature = makeCreature('c1', { row: 3, column: 3 }, {
      attributes: { armStrength: 4, constitution: 6, agility: 12, innerEnergy: 2, insight: 1 },
    })
    expect(getCreatureEvasionRate(creature, 'plain')).toBe(12)
  })

  it('生物根骨減傷率依有效根骨計算', () => {
    const creature = makeCreature('c1', { row: 3, column: 3 }, {
      attributes: { armStrength: 4, constitution: 10, agility: 3, innerEnergy: 2, insight: 1 },
    })
    expect(getCreatureRootReductionRate(creature, 'plain')).toBe(20)
  })

  it('生物暴擊率依有效臂力計算', () => {
    const creature = makeCreature('c1', { row: 3, column: 3 }, {
      attributes: { armStrength: 10, constitution: 6, agility: 3, innerEnergy: 2, insight: 1 },
    })
    expect(getCreatureCriticalRate(creature, 'plain')).toBe(20)
  })

  it('體力足夠時生物連續攻擊多次', () => {
    // 生物體力 12，每次攻擊消耗 5 → 可攻擊 2 次。
    const state = makeSmallState({
      players: [makePlayer({ position: { row: 3, column: 4 }, health: 100, maxHealth: 100 })],
      creatures: [makeCreature('c1', { row: 3, column: 3 }, {
        stamina: 12,
        maxStamina: 12,
        attributes: { armStrength: 4, constitution: 1, agility: 1, innerEnergy: 2, insight: 1 },
      })],
    })

    const result = runCreatureTurn(state)
    const player = result.players.find((p) => p.id === 'player-1')!
    // 兩次攻擊都命中（低回避/低減傷），玩家血量應明顯下降。
    expect(player.health).toBeLessThan(100)
    // 生物剩餘體力 = 12 - 5*2 = 2
    const creature = result.creatures.find((c) => c.id === 'c1')!
    expect(creature.stamina).toBe(2)
    // 日誌應包含連續攻擊訊息
    expect(result.logs.some((log) => log.message.includes('連續攻擊'))).toBe(true)
  })

  it('體力不足時只攻擊一次', () => {
    const state = makeSmallState({
      players: [makePlayer({ position: { row: 3, column: 4 }, health: 100, maxHealth: 100 })],
      creatures: [makeCreature('c1', { row: 3, column: 3 }, {
        stamina: 6,
        maxStamina: 6,
        attributes: { armStrength: 4, constitution: 1, agility: 1, innerEnergy: 2, insight: 1 },
      })],
    })

    const result = runCreatureTurn(state)
    const creature = result.creatures.find((c) => c.id === 'c1')!
    // 6 - 5 = 1
    expect(creature.stamina).toBe(1)
    expect(result.logs.some((log) => log.message.includes('連續攻擊'))).toBe(false)
  })

  it('生物攻擊玩家時可暴擊（1.5 倍）', () => {
    // 高臂力 → 高暴擊率；mock Math.random 讓暴擊判定命中（random < critRate）。
    // 玩家低身法/低根骨，避免回避與根骨減傷干擾暴擊判定。
    vi.spyOn(Math, 'random').mockReturnValue(0.01)
    const state = makeSmallState({
      players: [makePlayer({
        position: { row: 3, column: 4 },
        health: 100,
        maxHealth: 100,
        attributes: { armStrength: 8, constitution: 1, agility: 1, innerEnergy: 5, insight: 7 },
      })],
      creatures: [makeCreature('c1', { row: 3, column: 3 }, {
        stamina: 5,
        maxStamina: 5,
        attributes: { armStrength: 30, constitution: 1, agility: 1, innerEnergy: 2, insight: 1 },
      })],
    })

    const result = runCreatureTurn(state)
    const player = result.players.find((p) => p.id === 'player-1')!
    // 暴擊造成 1.5 倍傷害，玩家血量應低於 100。
    expect(player.health).toBeLessThan(100)
    expect(result.logs.some((log) => log.message.includes('暴擊'))).toBe(true)
    vi.restoreAllMocks()
  })
})
