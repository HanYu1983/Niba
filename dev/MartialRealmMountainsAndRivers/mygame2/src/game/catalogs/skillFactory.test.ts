import { describe, expect, it } from 'vitest'
import {
  createAuraExternalSkill,
  createDamageExternalSkill,
  createEnhancementExternalSkill,
  createInnerSkill,
} from './skillFactory'
import type { PlayerAttributes } from '../types'

const baseAttributes: PlayerAttributes = {
  armStrength: 8,
  constitution: 8,
  agility: 7,
  innerEnergy: 5,
  insight: 7,
}

describe('createInnerSkill', () => {
  it('建立合法的內功並套用預設 requiredHallLevel', () => {
    const skill = createInnerSkill({
      id: 'test-inner',
      name: '測試內功',
      description: '測試。',
      formulaDescription: '臂力 × 1',
      insightRequirement: 5,
      calculateDamage: () => 10,
    })
    expect(skill.id).toBe('test-inner')
    expect(skill.requiredHallLevel).toBe(1)
    expect(skill.calculateDamage(baseAttributes)).toBe(10)
    expect(skill.buffIds).toBeUndefined()
  })

  it('保留 buffIds', () => {
    const skill = createInnerSkill({
      id: 'test-inner-2',
      name: '測試內功',
      description: '測試。',
      formulaDescription: '測試。',
      insightRequirement: 5,
      buffIds: ['tuna-gong-focus'],
      calculateDamage: () => 10,
    })
    expect(skill.buffIds).toEqual(['tuna-gong-focus'])
  })
})

describe('createDamageExternalSkill', () => {
  it('自動標記 category damage 與 target target，內力大於 0 才允許', () => {
    const skill = createDamageExternalSkill({
      id: 'test-damage',
      name: '測試外功',
      description: '測試。',
      formulaDescription: '測試。',
      insightCost: 2,
      innerPowerCost: 4,
      calculateDamage: () => 20,
    })
    expect(skill.category).toBe('damage')
    expect(skill.target).toBe('target')
    expect(skill.innerPowerCost).toBe(4)
    expect(skill.calculateDamage(baseAttributes)).toBe(20)
  })

  it('內力消耗 <= 0 時失敗', () => {
    expect(() =>
      createDamageExternalSkill({
        id: 'bad',
        name: 'x',
        description: 'x',
        formulaDescription: 'x',
        insightCost: 2,
        innerPowerCost: 0,
      }),
    ).toThrow(/innerPowerCost/)
  })

  it('未提供 calculateDamage 時補預設 0', () => {
    const skill = createDamageExternalSkill({
      id: 'test-damage-2',
      name: '測試',
      description: '測試。',
      formulaDescription: '測試。',
      insightCost: 2,
      innerPowerCost: 4,
    })
    expect(skill.calculateDamage(baseAttributes)).toBe(0)
  })
})

describe('createAuraExternalSkill', () => {
  it('自動標定 category aura 與 target self，內耗為 0', () => {
    const skill = createAuraExternalSkill({
      id: 'test-aura',
      name: '測試靈氣',
      description: '測試。',
      formulaDescription: '測試。',
      insightCost: 2,
      passiveBuffIds: ['bloodthirst'],
    })
    expect(skill.category).toBe('aura')
    expect(skill.target).toBe('self')
    expect(skill.innerPowerCost).toBe(0)
    expect(skill.passiveBuffIds).toEqual(['bloodthirst'])
  })

  it('靠 functionalEffect 解析出 passiveBuffIds', () => {
    const skill = createAuraExternalSkill({
      id: 'test-aura-fx',
      name: '測試靈氣',
      description: '測試。',
      formulaDescription: '測試。',
      insightCost: 2,
      functionalEffect: 'lifesteal',
    })
    expect(skill.category).toBe('aura')
    expect(skill.passiveBuffIds).toContain('bloodthirst')
  })

  it('接受地形靈氣效果（不需 buff）', () => {
    const skill = createAuraExternalSkill({
      id: 'test-aura-terrain',
      name: '測試輕功',
      description: '測試。',
      formulaDescription: '測試。',
      insightCost: 2,
      auraEffect: { kind: 'terrain-cost-reduction', terrain: 'forest', amount: -2, minimumCost: 1 },
    })
    expect(skill.category).toBe('aura')
    expect(skill.auraEffect).toEqual({ kind: 'terrain-cost-reduction', terrain: 'forest', amount: -2, minimumCost: 1 })
  })

  it('沒有任何效果來源時失敗', () => {
    expect(() =>
      createAuraExternalSkill({
        id: 'bad-aura',
        name: 'x',
        description: 'x',
        formulaDescription: 'x',
        insightCost: 2,
      }),
    ).toThrow(/常駐效果/)
  })
})

describe('createEnhancementExternalSkill', () => {
  it('建立強化型外功並帶 activationEffect', () => {
    const skill = createEnhancementExternalSkill({
      id: 'test-enhance',
      name: '測試強化',
      description: '測試。',
      formulaDescription: '測試。',
      insightCost: 2,
      innerPowerCost: 2,
      activationEffect: { kind: 'heal-self-percent', percent: 0.2 },
    })
    expect(skill.category).toBe('enhancement')
    expect(skill.target).toBe('self')
    expect(skill.activationEffect).toEqual({ kind: 'heal-self-percent', percent: 0.2 })
    expect(skill.calculateDamage(baseAttributes)).toBe(0)
  })

  it('缺少 activationEffect 時失敗', () => {
    expect(() =>
      createEnhancementExternalSkill({
        id: 'bad-enhance',
        name: 'x',
        description: 'x',
        formulaDescription: 'x',
        insightCost: 2,
        innerPowerCost: 2,
        activationEffect: undefined as never,
      }),
    ).toThrow(/activationEffect/)
  })
})