import { describe, expect, it } from 'vitest'
import {
  getGovernanceRankNumber,
  getGovernanceRankName,
  getGovernanceRankUpMessage,
  getNextGovernanceRequirement,
  getMaxBuildingLevelForPlayer,
  applyPrestigeGain,
  getAvailablePolicyIds,
} from './governanceRules'
import type { PlayerState } from '../types'
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

describe('官階與聲望', () => {
  it('初始聲望為 0 時官階為流民首領', () => {
    expect(getGovernanceRankNumber(0)).toBe(1)
    expect(getGovernanceRankName(0)).toBe('流民首領')
  })

  it('聲望 80 達到村寨掌事', () => {
    expect(getGovernanceRankNumber(80)).toBe(2)
    expect(getGovernanceRankName(80)).toBe('村寨掌事')
  })

  it('聲望 240 達到鄉鎮主事', () => {
    expect(getGovernanceRankNumber(240)).toBe(3)
  })

  it('聲望 560 達到地方縣佐', () => {
    expect(getGovernanceRankNumber(560)).toBe(4)
  })

  it('聲望 1100 達到一方太守', () => {
    expect(getGovernanceRankNumber(1100)).toBe(5)
  })

  it('聲望 1800 達到勢力盟主', () => {
    expect(getGovernanceRankNumber(1800)).toBe(6)
  })

  it('官階不會因聲望減少而倒退', () => {
    expect(getGovernanceRankNumber(1800)).toBe(6)
    expect(getGovernanceRankNumber(1200)).toBe(5)
    expect(getGovernanceRankNumber(300)).toBe(3)
    expect(getGovernanceRankNumber(10)).toBe(1)
  })

  it('下一官階需求正確', () => {
    expect(getNextGovernanceRequirement(1)).toBe(80)
    expect(getNextGovernanceRequirement(2)).toBe(240)
    expect(getNextGovernanceRequirement(3)).toBe(560)
    expect(getNextGovernanceRequirement(4)).toBe(1100)
    expect(getNextGovernanceRequirement(5)).toBe(1800)
    expect(getNextGovernanceRequirement(6)).toBeNull()
  })

  it('官階不會因聲望減少而倒退', () => {
    expect(getGovernanceRankNumber(1800)).toBe(6)
    expect(getGovernanceRankNumber(1200)).toBe(5)
    expect(getGovernanceRankNumber(300)).toBe(3)
    expect(getGovernanceRankNumber(10)).toBe(1)
  })

  it('跨官階門檻時回傳升級訊息', () => {
    const message = getGovernanceRankUpMessage(70, 85)
    expect(message).toContain('官階升級')
    expect(message).toContain('流民首領')
    expect(message).toContain('村寨掌事')
  })

  it('未跨階時不回傳升級訊息', () => {
    expect(getGovernanceRankUpMessage(10, 70)).toBeNull()
    expect(getGovernanceRankUpMessage(100, 200)).toBeNull()
    expect(getGovernanceRankUpMessage(45, 20)).toBeNull()
  })

  it('最高建築等級隨官階提升', () => {
    const player1 = makePlayer({ prestige: 0 })
    expect(getMaxBuildingLevelForPlayer(player1)).toBe(1)

    const player2 = makePlayer({ prestige: 80 })
    expect(getMaxBuildingLevelForPlayer(player2)).toBe(2)

    const player3 = makePlayer({ prestige: 240 })
    expect(getMaxBuildingLevelForPlayer(player3)).toBe(3)

    const player4 = makePlayer({ prestige: 560 })
    expect(getMaxBuildingLevelForPlayer(player4)).toBe(4)
  })
})

describe('政策解鎖', () => {
  it('初始只有基本政策', () => {
    const player = makePlayer({ prestige: 0 })
    expect(getAvailablePolicyIds(player)).toEqual(['basic'])
  })

  it('村寨掌事解鎖資源政策', () => {
    const player = makePlayer({ prestige: 80 })
    expect(getAvailablePolicyIds(player)).toContain('civilian')
    expect(getAvailablePolicyIds(player)).not.toContain('military')
    expect(getAvailablePolicyIds(player)).not.toContain('economic')
  })

  it('鄉鎮主事解鎖軍事政策', () => {
    const player = makePlayer({ prestige: 240 })
    expect(getAvailablePolicyIds(player)).toContain('civilian')
    expect(getAvailablePolicyIds(player)).toContain('military')
    expect(getAvailablePolicyIds(player)).not.toContain('economic')
  })

  it('地方縣佐解鎖經濟政策', () => {
    const player = makePlayer({ prestige: 560 })
    expect(getAvailablePolicyIds(player)).toContain('civilian')
    expect(getAvailablePolicyIds(player)).toContain('military')
    expect(getAvailablePolicyIds(player)).toContain('economic')
  })
})

describe('applyPrestigeGain', () => {
  it('增加聲望後正確更新官階', () => {
    const player = makePlayer({ prestige: 0 })
    const next = applyPrestigeGain(player, 80)
    expect(next.prestige).toBe(80)
    expect(next.governanceRank).toBe(2)
  })

  it('聲望為負數時不變', () => {
    const player = makePlayer({ prestige: 80, governanceRank: 2, unlockedPolicyIds: ['basic', 'economic'] })
    const next = applyPrestigeGain(player, -10)
    expect(next.prestige).toBe(80)
    expect(next.governanceRank).toBe(2)
  })

  it('解鎖對應政策', () => {
    const player = makePlayer({ prestige: 0, unlockedPolicyIds: ['basic'] })
    const next = applyPrestigeGain(player, 80)
    expect(next.unlockedPolicyIds).toContain('civilian')
  })

  it('多次升級時累積解鎖', () => {
    const player = makePlayer({ prestige: 0, unlockedPolicyIds: ['basic'] })
    const next = applyPrestigeGain(player, 560)
    expect(next.prestige).toBe(560)
    expect(next.governanceRank).toBe(4)
    expect(next.unlockedPolicyIds).toContain('civilian')
    expect(next.unlockedPolicyIds).toContain('military')
    expect(next.unlockedPolicyIds).toContain('economic')
  })
})