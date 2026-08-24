import { describe, expect, it } from 'vitest'
import {
  getActivePolicyId,
  getEffectiveMoneyCost,
  getEffectiveMaterialGain,
  getEffectivePassiveMaterialIncome,
  getEffectiveIncomingDamage,
  canSwitchPolicy,
} from './policyRules'
import type { BaseState, PlayerState } from '../types'
import { getMaxHealth, getMaxInnerPower, getMaxStamina } from './playerStatsRules'

const baseAttributes = { armStrength: 8, constitution: 8, agility: 7, innerEnergy: 5, insight: 7 }

function makePlayer(overrides: Partial<PlayerState> = {}): PlayerState {
  return {
    id: 'player-1',
    name: '玩家 1',
    position: { row: 5, column: 5 },
    attributes: baseAttributes,
    innerSkillIds: ['tuna-gong'],
    innerSkillId: 'tuna-gong',
    externalSkillIds: [],
    equippedExternalSkillIds: [],
    health: getMaxHealth(baseAttributes),
    maxHealth: getMaxHealth(baseAttributes),
    stamina: getMaxStamina(baseAttributes),
    maxStamina: getMaxStamina(baseAttributes),
    innerPower: getMaxInnerPower(baseAttributes),
    maxInnerPower: getMaxInnerPower(baseAttributes),
    prestige: 0,
    money: 0,
    experience: 0,
    inventory: [],
    turnEnded: false,
    ...overrides,
  }
}

function makeBase(overrides: Partial<BaseState> = {}): BaseState {
  return {
    id: 'base-1',
    name: '測試據點',
    position: { row: 5, column: 6 },
    buildings: [],
    buildingMaterials: 100,
    maxBuildingMaterials: 100,
    health: 100,
    maxHealth: 100,
    activePolicyId: 'basic',
    ...overrides,
  }
}

describe('據點政策', () => {
  it('預設啟用基本政策', () => {
    expect(getActivePolicyId(makeBase())).toBe('basic')
  })

  it('經濟政策降低金錢支出', () => {
    const base = makeBase({ activePolicyId: 'economic' })
    expect(getEffectiveMoneyCost(base, 100)).toBe(95)
  })

  it('基本政策不改變金錢支出', () => {
    const base = makeBase({ activePolicyId: 'basic' })
    expect(getEffectiveMoneyCost(base, 100)).toBe(100)
  })

  it('民生政策增加建料獲取', () => {
    const base = makeBase({ activePolicyId: 'civilian' })
    expect(getEffectiveMaterialGain(base, 10)).toBe(11)
  })

  it('民生政策增加被動建料收入', () => {
    const base = makeBase({ activePolicyId: 'civilian' })
    expect(getEffectivePassiveMaterialIncome(base, 10)).toBe(11)
  })

  it('軍事政策降低據點承受傷害', () => {
    const base = makeBase({ activePolicyId: 'military' })
    expect(getEffectiveIncomingDamage(base, 100)).toBe(95)
  })

  it('基本政策不降低傷害', () => {
    const base = makeBase({ activePolicyId: 'basic' })
    expect(getEffectiveIncomingDamage(base, 100)).toBe(100)
  })
})

describe('政策切換', () => {
  it('未解鎖政策時不可切換', () => {
    const player = makePlayer({ prestige: 0, unlockedPolicyIds: ['basic'] })
    const base = makeBase()
    expect(canSwitchPolicy(player, base, 'civilian').ok).toBe(false)
  })

  it('已解鎖政策時可切換', () => {
    const player = makePlayer({ prestige: 80, unlockedPolicyIds: ['basic', 'civilian'] })
    const base = makeBase()
    expect(canSwitchPolicy(player, base, 'civilian').ok).toBe(true)
  })

  it('即使 unlockedPolicyIds 欄位過時，官階足夠仍可切換', () => {
    // 模擬：玩家聲望已達勢力盟主，但 unlockedPolicyIds 欄位未同步更新。
    const player = makePlayer({ prestige: 1200, unlockedPolicyIds: ['basic'] })
    const base = makeBase()
    expect(canSwitchPolicy(player, base, 'civilian').ok).toBe(true)
    expect(canSwitchPolicy(player, base, 'military').ok).toBe(true)
    expect(canSwitchPolicy(player, base, 'economic').ok).toBe(true)
  })

  it('切換到已啟用政策時失敗', () => {
    const player = makePlayer({ prestige: 80, unlockedPolicyIds: ['basic', 'civilian'] })
    const base = makeBase({ activePolicyId: 'civilian' })
    expect(canSwitchPolicy(player, base, 'civilian').ok).toBe(false)
  })
})