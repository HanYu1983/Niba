import { describe, expect, it } from 'vitest'
import { getActiveBuffDefinitionsForCreature, getCreatureTerrainStaminaCost } from './playerDerivedRules'
import type { CreatureState } from '../types'

const creature = {
  id: 'creature-1',
  name: '追風妖',
  schoolId: 'swift-wind',
  attributes: { armStrength: 4, constitution: 4, agility: 4, innerEnergy: 4, insight: 2 },
  baseAttributes: { armStrength: 4, constitution: 4, agility: 4, innerEnergy: 4, insight: 2 },
  position: { row: 2, column: 2 },
  health: 20,
  maxHealth: 20,
  maxStamina: 10,
  stamina: 10,
  maxInnerPower: 10,
  innerPower: 10,
  innerSkillId: 'tuna-gong',
  innerSkillIds: ['tuna-gong'],
  externalSkillIds: [],
  equippedExternalSkillIds: [],
  inventory: [],
  equipmentInventory: [],
  equipmentLoadout: { weaponInstanceId: null, armorInstanceId: null, accessoryInstanceId: null },
  money: 0,
  prestige: 0,
  experience: 0,
  level: 1,
  turnEnded: false,
} as unknown as CreatureState

describe('怪物地形主場 Buff', () => {
  it('追風流身處森林時生效', () => {
    const definitions = getActiveBuffDefinitionsForCreature(creature, 'forest')
    expect(definitions.some((definition) => definition.id === 'home-turf-forest')).toBe(true)
  })

  it('追風流離開森林時失效', () => {
    const definitions = getActiveBuffDefinitionsForCreature(creature, 'plain')
    expect(definitions.some((definition) => definition.id === 'home-turf-forest')).toBe(false)
  })

  it('追風流在森林移動消耗為 2，離開森林恢復正常成本', () => {
    expect(getCreatureTerrainStaminaCost(creature, 'forest')).toBe(2)
    expect(getCreatureTerrainStaminaCost(creature, 'water')).toBe(6)
  })
})
