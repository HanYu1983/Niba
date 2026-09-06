import { describe, it, expect, beforeEach } from 'vitest'
import { computeFuzzyInputs } from './fuzzyInputs'
import { evaluateAllGoals } from './goals'
import { buildAiDependencies } from '../aiStepRunner'
import { applyKillGoalInputs, clearMidTermGoals, type KillCandidate } from './midTermGoal'
import type { GameState, PlayerState } from '../../types'

/**
 * 重現 trace：AI 鎖定擊殺目標 nest-creature-1（距離 3、damageRatio 1），
 * 驗證 engageCombat 應有分數並產生追擊 action（而非 0）。
 */

function makePlayer(overrides: Partial<PlayerState> = {}): PlayerState {
  return {
    id: 'player-2',
    name: '諸葛亮',
    position: { row: 9, column: 4 },
    attributes: { armStrength: 8, constitution: 8, agility: 7, innerEnergy: 5, insight: 7 },
    baseAttributes: { armStrength: 8, constitution: 8, agility: 7, innerEnergy: 5, insight: 7 },
    health: 25.35,
    maxHealth: 27,
    stamina: 5.5,
    maxStamina: 10.5,
    innerPower: 10,
    maxInnerPower: 10,
    prestige: 0,
    money: 0,
    experience: 0,
    level: 2,
    inventory: [],
    equipmentInventory: [],
    equipmentLoadout: { weaponInstanceId: null, armorInstanceId: null, accessoryInstanceId: null },
    innerSkillIds: ['swift-wind-inner'],
    innerSkillId: 'swift-wind-inner',
    externalSkillIds: ['swift-wind-external-damage'],
    equippedExternalSkillIds: ['swift-wind-external-damage'],
    turnEnded: false,
    isAI: true,
    ...overrides,
  }
}

function makeState(overrides: Partial<GameState> = {}): GameState {
  const player = makePlayer()
  return {
    round: 17,
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
    bases: [],
    creatures: [{
      ...makePlayer({ id: 'nest-creature-1', name: '生物巢穴 1的怪物', position: { row: 8, column: 6 }, health: 21, maxHealth: 21, level: 1 }),
      schoolId: 'ghost-shadow',
      behaviorType: 'roamer',
      attributes: { armStrength: 5, constitution: 5, agility: 5, innerEnergy: 5, insight: 5 },
    }],
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
    ...overrides,
  }
}

describe('擊殺目標追擊（trace 重現）', () => {
  beforeEach(() => {
    clearMidTermGoals()
  })

  it('鎖定擊殺目標（距離 3）時，engageCombat 應有分數並產生追擊 action', () => {
    const state = makeState()
    const player = state.players[0]
    const deps = buildAiDependencies({
      getActionablePlayer: (s, playerId) => s.players.find((p) => p.id === playerId) ?? null,
      createLootForPlayer: () => undefined,
      getLearnableSkill: () => undefined,
      applyExperienceAndLevelUp: (p) => p,
      addLootToPlayer: (p) => p,
    })

    // 鎖定擊殺目標
    const killCandidate: KillCandidate = {
      targetId: 'nest-creature-1',
      targetType: 'creature',
      distance: 3,
      damageRatio: 1,
      canSurvive: true,
    }
    applyKillGoalInputs('player-2', [killCandidate], 0.8)

    const inputs = computeFuzzyInputs(state, player)
    const goals = evaluateAllGoals(inputs, state, player, deps)

    expect(goals.engageCombat.score).toBeGreaterThan(0)
    expect(goals.engageCombat.actions?.some((a) => a.type === 'move' || a.type === 'attack' || a.type === 'use-external-skill')).toBe(true)
  })
})
