import { describe, expect, it } from 'vitest'
import { executeExternalDamage, type CombatActionDependencies } from './combatActions'
import type { CreatureState, GameState, PlayerState } from '../types'

function makeMap() {
  return {
    rows: 10,
    columns: 10,
    cells: Array.from({ length: 10 * 10 }, (_, index) => {
      const row = Math.floor(index / 10)
      const column = index % 10
      const isBorder = row === 0 || column === 0 || row === 9 || column === 9
      return { id: `${row}-${column}`, row, column, terrain: isBorder ? 'wall' : 'plain' }
    }),
  }
}

function makePlayer(overrides: Partial<PlayerState> = {}): PlayerState {
  return {
    id: 'player-1',
    name: '玩家 1',
    position: { row: 5, column: 5 },
    attributes: { armStrength: 8, constitution: 8, agility: 7, innerEnergy: 10, insight: 7 },
    innerSkillIds: ['tuna-gong'],
    innerSkillId: 'tuna-gong',
    externalSkillIds: ['blazing-sun-external-damage'],
    equippedExternalSkillIds: ['blazing-sun-external-damage'],
    health: 100,
    maxHealth: 100,
    stamina: 10,
    maxStamina: 10,
    innerPower: 100,
    maxInnerPower: 100,
    prestige: 0,
    money: 0,
    experience: 0,
    inventory: [],
    turnEnded: false,
    ...overrides,
  }
}

function makeCreature(id: string, position: { row: number; column: number }): CreatureState {
  return makePlayer({
    id,
    name: `生物 ${id}`,
    position,
    attributes: { armStrength: 4, constitution: 20, agility: 3, innerEnergy: 2, insight: 1 },
    externalSkillIds: [],
    equippedExternalSkillIds: [],
  })
}

function makeDeps(): CombatActionDependencies {
  return {
    getActionablePlayer: (state, id) => state.players.find((p) => p.id === id) ?? null,
    createLootForPlayer: () => undefined,
    getLearnableSkill: () => undefined,
    applyExperienceAndLevelUp: (player) => player,
    addLootToPlayer: (player) => player,
    random: () => 0.99,
  }
}

function makeState(creatures: CreatureState[]): GameState {
  return {
    map: makeMap(),
    bases: [],
    creatureNests: [],
    resourcePoints: [],
    itemPoints: [],
    players: [makePlayer()],
    creatures,
    activePlayerId: 'player-1',
    round: 1,
    creatureActionLogs: [],
    attackPreview: null,
    externalSkillPreview: null,
    creatureTurnInProgress: false,
    activeCreatureId: null,
    operation: { type: 'idle' },
    blockingModal: null,
  } as never as GameState
}

describe('範圍攻擊（selectionMode = all）', () => {
  it('三重共振時無視目標減傷、根骨減傷與回避率', () => {
    const player = makePlayer({
      innerSkillId: 'frost-water-inner',
      innerSkillIds: ['frost-water-inner'],
      externalSkillIds: ['swift-wind-external-damage'],
      equippedExternalSkillIds: ['swift-wind-external-damage'],
    })
    const creature = makeCreature('c1', { row: 4, column: 5 })
    creature.schoolId = 'earth-mountain'
    creature.attributes = { armStrength: 4, constitution: 50, agility: 50, innerEnergy: 2, insight: 1 }
    creature.buffs = [{ id: 'home-turf-mountain', definitionId: 'home-turf-mountain', sourceId: 'test', remainingRounds: null }]
    const state = makeState([creature])
    state.players = [player]
    state.map.cells = state.map.cells.map((cell) =>
      cell.row === 5 && cell.column === 5 ? { ...cell, terrain: 'forest' as const } :
        cell.row === 4 && cell.column === 5 ? { ...cell, terrain: 'mountain' as const } : cell,
    )

    const withReduction = executeExternalDamage(state, 'player-1', 'creature', 'c1', 'swift-wind-external-damage', makeDeps())
    const withoutReduction = executeExternalDamage(
      { ...state, creatures: [{ ...creature, buffs: [] }] },
      'player-1',
      'creature',
      'c1',
      'swift-wind-external-damage',
      makeDeps(),
    )

    expect(withReduction.result.ok).toBe(true)
    expect(withoutReduction.result.ok).toBe(true)
    if (withReduction.result.ok && withoutReduction.result.ok) {
      expect(withReduction.result.data.tripleResonance).toBe(true)
      expect(withReduction.result.data.targetDefense).toBeUndefined()
      expect(withReduction.result.data.damage).toBeGreaterThan(0)
      expect(withReduction.result.data.damage).toBe(withoutReduction.result.data.damage)
    }
  })

  it('烈陽轟對玩家周遭所有生物造成傷害', () => {
    // 兩隻生物位於玩家周遭
    const c1 = makeCreature('c1', { row: 4, column: 5 })
    const c2 = makeCreature('c2', { row: 5, column: 6 })
    const state = makeState([c1, c2])
    const before = state.creatures.map((c) => c.health)
    const { state: next, result } = executeExternalDamage(
      state,
      'player-1',
      'creature',
      'c1',
      'blazing-sun-external-damage',
      makeDeps(),
    )
    expect(result.ok).toBe(true)
    const areaTargets = result.ok ? result.data.areaTargets : []
    expect(areaTargets?.length).toBe(2)
    // 兩隻生物都受傷害（血量下降）
    const c1After = next.creatures.find((c) => c.id === 'c1')
    const c2After = next.creatures.find((c) => c.id === 'c2')
    expect(c1After!.health).toBeLessThan(before[0])
    expect(c2After!.health).toBeLessThan(before[1])
  })

  it('範圍外生物不受傷害', () => {
    const c1 = makeCreature('c1', { row: 4, column: 5 })   // 範圍內
    const c2 = makeCreature('c2', { row: 8, column: 8 })   // 範圍外（距離 6）
    const state = makeState([c1, c2])
    const { result } = executeExternalDamage(
      state,
      'player-1',
      'creature',
      'c1',
      'blazing-sun-external-damage',
      makeDeps(),
    )
    expect(result.ok).toBe(true)
    const areaTargets = result.ok ? result.data.areaTargets : []
    expect(areaTargets?.length).toBe(1)
  })

  it('範圍內無目標時回傳失敗', () => {
    const c2 = makeCreature('c2', { row: 8, column: 8 })   // 範圍外
    const state = makeState([c2])
    const { result } = executeExternalDamage(
      state,
      'player-1',
      'creature',
      'c2',
      'blazing-sun-external-damage',
      makeDeps(),
    )
    expect(result.ok).toBe(false)
  })
})