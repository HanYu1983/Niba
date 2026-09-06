import { describe, it, expect, beforeEach } from 'vitest'
import { computeFuzzyInputs } from './fuzzyInputs'
import { evaluateAllGoals } from './goals'
import { buildAiDependencies } from '../aiStepRunner'
import { clearMidTermGoals } from './midTermGoal'
import type { GameState, PlayerState } from '../../types'

/**
 * 重現 trace：玩家 (4,2)、未發現據點 base-2 (2,8)、體力充足、無可達未探索格。
 * 驗證 exploration 為何為 0（AI 停在原地）。
 */

function makePlayer(overrides: Partial<PlayerState> = {}): PlayerState {
  return {
    id: 'player-2',
    name: '司空摘星',
    position: { row: 4, column: 2 },
    attributes: { armStrength: 8, constitution: 8, agility: 7, innerEnergy: 5, insight: 7 },
    baseAttributes: { armStrength: 8, constitution: 8, agility: 7, innerEnergy: 5, insight: 7 },
    health: 50,
    maxHealth: 50,
    stamina: 23,
    maxStamina: 24,
    innerPower: 10,
    maxInnerPower: 10,
    prestige: 0,
    money: 0,
    experience: 0,
    level: 4,
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

function makeState(player: PlayerState): GameState {
  return {
    round: 18,
    players: [player],
    activePlayerId: player.id,
    map: {
      rows: 15,
      columns: 15,
      cells: Array.from({ length: 15 * 15 }, (_, i) => {
        const row = Math.floor(i / 15)
        const column = i % 15
        return { id: `${row}-${column}`, row, column, terrain: 'plain' }
      }),
    },
    bases: [{
      id: 'base-2',
      name: '岳陽',
      position: { row: 2, column: 8 },
      buildings: [],
      buildingMaterials: 42.5,
      maxBuildingMaterials: 150,
      health: 155,
      maxHealth: 155,
      active: true,
      martialSchoolId: 'swift-wind',
      discovered: false,
    }],
    creatures: [],
    creatureNests: [],
    resourcePoints: [],
    itemPoints: [],
    sectGates: [],
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

describe('探索目標（trace 重現：玩家遠離據點）', () => {
  beforeEach(() => {
    clearMidTermGoals()
  })

  it('玩家 (4,2)、據點 (2,8)、體力充足時，exploration 應有分數並產生移動', () => {
    const player = makePlayer()
    const state = makeState(player)
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
    console.log('unexploredReachableCount =', inputs.unexploredReachableCount)
    // eslint-disable-next-line no-console
    console.log('nearestUndiscoveredBase =', inputs.nearestUndiscoveredBase?.id)
    // eslint-disable-next-line no-console
    console.log('exploration =', JSON.stringify(goals.exploration))

    expect(goals.exploration.score).toBeGreaterThan(0)
  })
})
