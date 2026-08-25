import { describe, expect, it } from 'vitest'
import { addSkillExperience, getElementDamageMultiplier, getGenerationSynergyMultiplier, getSkillDamage, getSkillExperienceRequired, getSkillProgression, isElementGenerating } from './skillRules'
import { innerSkillCatalog } from '../catalogs/innerSkillCatalog'
import type { PlayerState } from '../types'

const player = { skillProgression: {} } as PlayerState

describe('功法經驗', () => {
  it('使用功法增加經驗並在達標時升級', () => {
    const progressed = addSkillExperience(player, 'golden-body-external-damage', 60)
    expect(getSkillProgression(progressed, 'golden-body-external-damage')).toEqual({ experience: 10, level: 2 })
  })

  it('功法升級需求會隨目前等級增加', () => {
    expect(getSkillExperienceRequired(1)).toBe(50)
    expect(getSkillExperienceRequired(2)).toBe(70)
    expect(getSkillExperienceRequired(3)).toBe(90)
  })

  it('連續升級時依各級需求扣除經驗', () => {
    const progressed = addSkillExperience(player, 'golden-body-external-damage', 130)
    expect(getSkillProgression(progressed, 'golden-body-external-damage')).toEqual({ experience: 10, level: 3 })
  })

  it('未有進度的功法從第一級開始', () => {
    expect(getSkillProgression(player, 'unknown')).toEqual({ experience: 0, level: 1 })
  })
})

describe('功法等級傷害', () => {
  it('等級越高，基礎傷害越高', () => {
    const tunaGong = innerSkillCatalog[0]
    const attributes = { armStrength: 8, constitution: 8, agility: 7, innerEnergy: 5, insight: 7 }
    expect(getSkillDamage(attributes, tunaGong, 1)).toBe(tunaGong.calculateDamage(attributes))
    expect(getSkillDamage(attributes, tunaGong, 3)).toBe(Math.floor(tunaGong.calculateDamage(attributes) * 2))
  })
})

describe('五行相剋', () => {
  it('攻擊方克制防守方時傷害提高至 1.25 倍', () => {
    expect(getElementDamageMultiplier('metal', 'wood')).toBe(1.25)
  })

  it('攻擊方被防守方克制時傷害降低至 0.75 倍', () => {
    expect(getElementDamageMultiplier('metal', 'fire')).toBe(0.75)
  })

  it('太虛流無屬性時不套用相剋', () => {
    expect(getElementDamageMultiplier('none', 'wood')).toBe(1)
    expect(getElementDamageMultiplier('metal', 'none')).toBe(1)
  })
})

describe('五行相生連攜', () => {
  it('內功元素生外功元素時觸發連攜', () => {
    expect(isElementGenerating('metal', 'earth')).toBe(true)
    expect(isElementGenerating('earth', 'water')).toBe(true)
    expect(isElementGenerating('water', 'wood')).toBe(true)
    expect(isElementGenerating('wood', 'fire')).toBe(true)
    expect(isElementGenerating('fire', 'metal')).toBe(true)
  })

  it('反向（外功生內功）不觸發', () => {
    expect(isElementGenerating('earth', 'metal')).toBe(false)
    expect(isElementGenerating('metal', 'fire')).toBe(false)
  })

  it('同屬性不觸發', () => {
    expect(isElementGenerating('fire', 'fire')).toBe(false)
  })

  it('太虛流不參與連攜', () => {
    expect(isElementGenerating('none', 'wood')).toBe(false)
    expect(isElementGenerating('metal', 'none')).toBe(false)
  })

  it('連攜倍率 ×1.25，否則 ×1', () => {
    expect(getGenerationSynergyMultiplier('metal', 'earth')).toBe(1.25)
    expect(getGenerationSynergyMultiplier('earth', 'metal')).toBe(1)
    expect(getGenerationSynergyMultiplier('none', 'earth')).toBe(1)
  })
})
