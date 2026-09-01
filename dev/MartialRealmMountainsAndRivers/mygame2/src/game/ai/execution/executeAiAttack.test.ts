import { describe, expect, it } from 'vitest'
import { executeAiAttack } from './executeAiAttack'
import { executeAiAction } from './executeAiAction'
import { getActionablePlayer } from '../../rules/actionCostRules'
import { applyExperienceAndLevelUp } from '../../characterFactory'
import type { CombatActionDependencies } from '../../actions/combatActions'
import {
  makeAiTestState,
  makeTestCreature,
  makeTestPlayer,
} from '../../testHelpers/gameFixtures'

const dependencies: CombatActionDependencies = {
  getActionablePlayer,
  createLootForPlayer: () => undefined,
  getLearnableSkill: () => undefined,
  applyExperienceAndLevelUp,
  addLootToPlayer: (player) => player,
  random: () => 0.99,
}

describe('executeAiAttack', () => {
  it('AI 可直接使用元素爆發道具攻擊相鄰巢穴', () => {
    const state = makeAiTestState({
      players: [makeTestPlayer({
        isAI: true,
        inventory: [{ itemId: 'fire-thunder-talisman', quantity: 1 }],
      })],
      creatureNests: [{
        id: 'nest-1',
        name: '火焰巢穴',
        position: { row: 5, column: 6 },
        health: 40,
        maxHealth: 40,
        spawnChance: 0,
        cooldownRounds: 0,
        spawnLevel: 1,
        behaviorType: 'scavenger',
        schoolId: 'scarlet-flame',
        dominantElement: 'fire',
      }],
    })

    const outcome = executeAiAction(state, {
      type: 'use-element-burst',
      actor: { id: 'ai-1', kind: 'player' },
      itemId: 'fire-thunder-talisman',
      target: { id: 'nest-1', kind: 'nest', position: { row: 5, column: 6 } },
      reason: '測試：使用元素爆發攻擊巢穴',
    }, {
      combat: dependencies,
      turn: {
        moveCreatures: (currentState) => ({ creatures: currentState.creatures, players: currentState.players, resourcePoints: currentState.resourcePoints, logs: [] }),
        spawnCreaturesFromNests: (currentState) => ({ creatures: currentState.creatures, spawned: [], nests: currentState.creatureNests, logs: [] }),
      },
    })

    expect(outcome.result.ok).toBe(true)
    expect(outcome.state.creatureNests[0]?.health).toBeLessThan(40)
    expect(outcome.state.players[0]?.inventory).toEqual([])
    expect(outcome.state.itemBurstPreview).toBeNull()
  })

  it('相鄰目標時直接結算傷害，不寫入 attackPreview', () => {
    const state = makeAiTestState({
      players: [makeTestPlayer({ isAI: true })],
      creatures: [makeTestCreature({ health: 20, maxHealth: 20 })],
    })

    const outcome = executeAiAttack(state, 'ai-1', 'creature', 'creature-1', dependencies)
    const creature = outcome.state.creatures.find((candidate) => candidate.id === 'creature-1')

    expect(outcome.result.ok).toBe(true)
    expect(creature === undefined || creature.health < 20).toBe(true)
    expect(outcome.state.attackPreview).toBeNull()
    expect(outcome.state.operation).toEqual({ type: 'idle' })
    expect(state.attackPreview).toBeNull()
  })

  it('目標不相鄰時失敗且不改狀態', () => {
    const state = makeAiTestState({
      players: [makeTestPlayer({ isAI: true })],
      creatures: [makeTestCreature({ position: { row: 8, column: 8 }, health: 20, maxHealth: 20 })],
    })

    const outcome = executeAiAttack(state, 'ai-1', 'creature', 'creature-1', dependencies)

    expect(outcome).toEqual({
      state,
      result: { ok: false, reason: '攻擊目標已不存在或無法攻擊。' },
    })
  })

  it('體力不足時失敗，不留下 preview', () => {
    const state = makeAiTestState({
      players: [makeTestPlayer({ isAI: true, stamina: 3, maxStamina: 20 })],
      creatures: [makeTestCreature({ health: 20, maxHealth: 20 })],
    })

    const outcome = executeAiAttack(state, 'ai-1', 'creature', 'creature-1', dependencies)

    expect(outcome.result).toEqual({ ok: false, reason: '體力不足。' })
    expect(outcome.state.attackPreview).toBeNull()
    expect(outcome.state.creatures[0]?.health).toBe(20)
  })
})
