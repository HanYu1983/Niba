import { describe, it, expect, beforeEach } from 'vitest'
import { computeFuzzyInputs } from './fuzzyInputs'
import { evaluateAllGoals } from './goals'
import { buildAiDependencies } from '../aiStepRunner'
import { clearMidTermGoals } from './midTermGoal'
import type { GameState, PlayerState } from '../../types'

/**
 * 驗證「悟性容量已滿時，AI 不應再學功法」（無效行為修正）。
 */

function makePlayer(overrides: Partial<PlayerState> = {}): PlayerState {
  return {
    id: 'player-1',
    name: '測試',
    position: { row: 2, column: 2 },
    attributes: { armStrength: 8, constitution: 8, agility: 7, innerEnergy: 5, insight: 5 },
    baseAttributes: { armStrength: 8, constitution: 8, agility: 7, innerEnergy: 5, insight: 5 },
    health: 50,
    maxHealth: 50,
    stamina: 20,
    maxStamina: 20,
    innerPower: 10,
    maxInnerPower: 10,
    prestige: 0,
    money: 200,
    experience: 0,
    level: 2,
    inventory: [],
    equipmentInventory: [],
    equipmentLoadout: { weaponInstanceId: null, armorInstanceId: null, accessoryInstanceId: null },
    innerSkillIds: ['tuna-gong'],
    innerSkillId: 'tuna-gong',
    externalSkillIds: [],
    equippedExternalSkillIds: [],
    turnEnded: false,
    isAI: true,
    ...overrides,
  }
}

function makeState(player: PlayerState, gate: boolean): GameState {
  return {
    round: 1,
    players: [player],
    activePlayerId: player.id,
    map: {
      rows: 5,
      columns: 5,
      cells: Array.from({ length: 25 }, (_, i) => {
        const row = Math.floor(i / 5)
        const column = i % 5
        return { id: `${row}-${column}`, row, column, terrain: 'plain' }
      }),
    },
    bases: [],
    creatures: [],
    creatureNests: [],
    resourcePoints: [],
    itemPoints: [],
    sectGates: gate ? [{
      id: 'sect-gate-1',
      schoolId: 'swift-wind',
      position: { row: 2, column: 3 },
      level: 1,
      experience: 0,
    }] : [],
    visibility: { exploredCellIds: [], mode: 'fog' },
    creatureActionLogs: [],
    attackPreview: null,
    externalSkillPreview: null,
    creatureTurnInProgress: false,
    activeCreatureId: null,
    operation: { type: 'idle' },
    blockingModal: null,
  }
}

describe('悟性容量已滿時不學功法', () => {
  beforeEach(() => {
    clearMidTermGoals()
  })

  it('悟性容量未滿時，學招分數正常', () => {
    // 悟性 5，只裝備吐納功（內功需求低），容量未滿
    const player = makePlayer()
    const state = makeState(player, true)
    const deps = buildAiDependencies({
      getActionablePlayer: (s, playerId) => s.players.find((p) => p.id === playerId) ?? null,
      createLootForPlayer: () => undefined,
      getLearnableSkill: () => undefined,
      applyExperienceAndLevelUp: (p) => p,
      addLootToPlayer: (p) => p,
    })

    const inputs = computeFuzzyInputs(state, player)
    const goals = evaluateAllGoals(inputs, state, player, deps)

    // eslint-disable-next-line no-console
    console.log('learnMartialSkill (capacity ok) =', goals.learnMartialSkill.score)
    expect(goals.learnMartialSkill.score).toBeGreaterThan(0.5)
  })

  it('悟性容量已滿時，學招分數大幅降低', () => {
    // 悟性 5，但裝備多個高悟性需求外功使容量超限
    const player = makePlayer({
      equippedExternalSkillIds: ['swift-wind-external-damage', 'blazing-sun-external-damage', 'void-spirit-external-damage'],
    })
    const state = makeState(player, true)
    const deps = buildAiDependencies({
      getActionablePlayer: (s, playerId) => s.players.find((p) => p.id === playerId) ?? null,
      createLootForPlayer: () => undefined,
      getLearnableSkill: () => undefined,
      applyExperienceAndLevelUp: (p) => p,
      addLootToPlayer: (p) => p,
    })

    const inputs = computeFuzzyInputs(state, player)
    const goals = evaluateAllGoals(inputs, state, player, deps)

    // eslint-disable-next-line no-console
    console.log('learnMartialSkill (capacity full) =', goals.learnMartialSkill.score)
    // 容量已滿 → f_capacity = 0.1，分數應遠低於未滿時
    expect(goals.learnMartialSkill.score).toBeLessThan(0.3)
  })
})
