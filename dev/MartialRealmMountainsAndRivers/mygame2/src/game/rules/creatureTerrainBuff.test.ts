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
  it('追風流（木）身處森林時生效', () => {
    const definitions = getActiveBuffDefinitionsForCreature(creature, 'forest')
    expect(definitions.some((definition) => definition.id === 'home-turf-forest')).toBe(true)
  })

  it('追風流（木）離開森林時失效', () => {
    const definitions = getActiveBuffDefinitionsForCreature(creature, 'plain')
    expect(definitions.some((definition) => definition.id === 'home-turf-forest')).toBe(false)
  })

  it('追風流在森林移動消耗為 2，離開森林恢復正常成本', () => {
    expect(getCreatureTerrainStaminaCost(creature, 'forest')).toBe(2)
    expect(getCreatureTerrainStaminaCost(creature, 'water')).toBe(6)
  })

  it('主場依五行屬性判斷：同五行不同流派共享主場', () => {
    const woodCreature = { ...creature, schoolId: 'hundred-poison' as const }
    const metalCreature = { ...creature, schoolId: 'golden-body' as const }
    const metalCreature2 = { ...creature, schoolId: 'sharp-edge' as const }
    const earthCreature = { ...creature, schoolId: 'yellow-earth' as const }

    // 木：百毒流與追風流皆在森林生效
    expect(getActiveBuffDefinitionsForCreature(woodCreature, 'forest').some((d) => d.id === 'home-turf-forest')).toBe(true)
    // 金：金剛流與銳鋒流皆在山嶽生效（統一 home-turf-mountain）
    expect(getActiveBuffDefinitionsForCreature(metalCreature, 'mountain').some((d) => d.id === 'home-turf-mountain')).toBe(true)
    expect(getActiveBuffDefinitionsForCreature(metalCreature2, 'mountain').some((d) => d.id === 'home-turf-mountain')).toBe(true)
    // 土：黃土流在山嶽生效（統一 home-turf-mountain）
    expect(getActiveBuffDefinitionsForCreature(earthCreature, 'mountain').some((d) => d.id === 'home-turf-mountain')).toBe(true)
  })
})
