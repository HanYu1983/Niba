import { describe, expect, it } from 'vitest'
import { executeAiAttack } from './executeAiAttack'
import { getActionablePlayer } from '../../rules/actionCostRules'
import { applyExperienceAndLevelUp } from '../../characterFactory'
import type { CombatActionDependencies } from '../../actions/combatActions'
import {
  makeAiTestState,
  makeTestCreature,
  makeTestPlayer,
} from '../../testHelpers/aiTestFixtures'

const dependencies: CombatActionDependencies = {
  getActionablePlayer,
  createLootForPlayer: () => undefined,
  getLearnableSkill: () => undefined,
  applyExperienceAndLevelUp,
  addLootToPlayer: (player) => player,
  random: () => 0.99,
}

describe('executeAiAttack', () => {
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
