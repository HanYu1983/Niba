import { describe, expect, it } from 'vitest'
import { createGameState } from './worldSetup'
import { rollRoamerLevel } from './rules/creatureBehaviorRules'

describe('初始生物生成規則', () => {
  it('新遊戲開局建立游蕩型 Creature', () => {
    const state = createGameState({ rows: 30, columns: 30, baseCount: 3, nestCount: 1, resourcePointCount: 4, itemPointCount: 4, playerCount: 1, explorationEventCount: 3, creatureCount: 4, ruinCount: 10, seed: 20260803 })
    expect(state.creatures).toHaveLength(4)
    expect(state.creatures.every((creature) => creature.behaviorType === 'roamer' && creature.schoolId === 'void-spirit')).toBe(true)
    expect(state.creatures.some((creature) => {
      const level = creature.level ?? 1
      // void-spirit 內功五維靈氣：臂力/根骨/悟性各 +1；每級成長 2。
      return creature.attributes.armStrength === 7 + (level - 1) * 2
        && creature.attributes.constitution === 7 + (level - 1) * 2
        && creature.attributes.agility === 6 + (level - 1) * 2
        && creature.attributes.innerEnergy === 6 + (level - 1) * 2
        && creature.attributes.insight === 7 + (level - 1) * 2
    })).toBe(true)
  })

  it('游蕩怪等級隨機且高等級機率較低', () => {
    const state = createGameState({ rows: 30, columns: 30, baseCount: 3, nestCount: 1, resourcePointCount: 4, itemPointCount: 4, playerCount: 1, explorationEventCount: 3, creatureCount: 5, ruinCount: 10, seed: 20260803 })
    expect(state.creatures).toHaveLength(5)
    expect(state.creatures.every((creature) => creature.level !== undefined && creature.level >= 1 && creature.level <= 3)).toBe(true)
    expect(rollRoamerLevel(0)).toBe(1)
    expect(rollRoamerLevel(0.99)).toBe(3)
  })
})
