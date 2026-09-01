import { describe, expect, it } from 'vitest'
import { getActiveBuffDefinitions } from './playerDerivedRules'
import type { PlayerState } from '../types'

function makePlayer(overrides: Partial<PlayerState> = {}): PlayerState {
  return {
    id: 'p1',
    name: '玩家',
    position: { row: 2, column: 2 },
    attributes: { armStrength: 8, constitution: 8, agility: 8, innerEnergy: 8, insight: 8 },
    baseAttributes: { armStrength: 8, constitution: 8, agility: 8, innerEnergy: 8, insight: 8 },
    innerSkillId: 'tuna-gong',
    innerSkillIds: ['tuna-gong'],
    externalSkillIds: [],
    equippedExternalSkillIds: [],
    health: 20,
    maxHealth: 20,
    stamina: 10,
    maxStamina: 10,
    innerPower: 10,
    maxInnerPower: 10,
    prestige: 0,
    money: 0,
    experience: 0,
    level: 1,
    inventory: [],
    equipmentInventory: [],
    equipmentLoadout: { weaponInstanceId: null, armorInstanceId: null, accessoryInstanceId: null },
    turnEnded: false,
    ...overrides,
  } as unknown as PlayerState
}

describe('靈氣功法升級後 Buff 描述反映縮放數值', () => {
  it('幽影蔽身 Lv.3：回避率描述更新為 +14%', () => {
    const player = makePlayer({
      externalSkillIds: ['ghost-shadow-external-functional'],
      equippedExternalSkillIds: ['ghost-shadow-external-functional'],
      skillProgression: { 'ghost-shadow-external-functional': { experience: 0, level: 3 } },
    })
    const definitions = getActiveBuffDefinitions(player)
    const buff = definitions.find((d) => d.id === 'ghost-shadow-shadow-veil')
    expect(buff?.evasionRateBonus).toBe(14)
    expect(buff?.description).toContain('回避率 +14%')
  })

  it('凌淵江河長養 Lv.3：回血描述更新為 +14%', () => {
    const player = makePlayer({
      externalSkillIds: ['lingyuan-rivers-sustain'],
      equippedExternalSkillIds: ['lingyuan-rivers-sustain'],
      skillProgression: { 'lingyuan-rivers-sustain': { experience: 0, level: 3 } },
    })
    const definitions = getActiveBuffDefinitions(player)
    const buff = definitions.find((d) => d.id === 'spring-return-art')
    expect(buff?.healthRegenPercent).toBeCloseTo(0.14)
    expect(buff?.description).toContain('14%')
  })

  it('烈陽戰意 Lv.3：臂力根骨描述更新為 +5', () => {
    const player = makePlayer({
      externalSkillIds: ['blazing-sun-external-functional'],
      equippedExternalSkillIds: ['blazing-sun-external-functional'],
      skillProgression: { 'blazing-sun-external-functional': { experience: 0, level: 3 } },
    })
    const definitions = getActiveBuffDefinitions(player)
    const buff = definitions.find((d) => d.id === 'blazing-sun-fervor')
    expect(buff?.attributeModifiers?.armStrength).toBe(5)
    expect(buff?.description).toContain('臂力與根骨 +5')
  })

  it('江湖血飲功 Lv.3：吸血描述更新為 +19%', () => {
    const player = makePlayer({
      externalSkillIds: ['jianghu-bloodthirst'],
      equippedExternalSkillIds: ['jianghu-bloodthirst'],
      skillProgression: { 'jianghu-bloodthirst': { experience: 0, level: 3 } },
    })
    const definitions = getActiveBuffDefinitions(player)
    const buff = definitions.find((d) => d.id === 'bloodthirst')
    expect(buff?.lifestealPercent).toBeCloseTo(0.19)
    expect(buff?.description).toContain('19%')
  })

  it('暴擊強化 Lv.3：暴擊率描述更新為 +25%', () => {
    const player = makePlayer({
      externalSkillIds: ['golden-body-external-functional'],
      equippedExternalSkillIds: ['golden-body-external-functional'],
      skillProgression: { 'golden-body-external-functional': { experience: 0, level: 3 } },
    })
    const definitions = getActiveBuffDefinitions(player)
    const buff = definitions.find((d) => d.id === 'golden-body-critical-boost')
    expect(buff?.criticalRateBonus).toBe(25)
    expect(buff?.description).toContain('暴擊率 +25%')
  })

  it('反震 Lv.3：反彈描述更新為 20%', () => {
    const player = makePlayer({
      externalSkillIds: ['earth-mountain-external-functional'],
      equippedExternalSkillIds: ['earth-mountain-external-functional'],
      skillProgression: { 'earth-mountain-external-functional': { experience: 0, level: 3 } },
    })
    const definitions = getActiveBuffDefinitions(player)
    const buff = definitions.find((d) => d.id === 'earth-mountain-reflection')
    // Lv.1 基礎 15% → Lv.3 → 15% × 1.3 = 19.5%
    expect(buff?.reflectionPercent).toBeCloseTo(0.195)
    expect(buff?.description).toContain('20%')
  })
})