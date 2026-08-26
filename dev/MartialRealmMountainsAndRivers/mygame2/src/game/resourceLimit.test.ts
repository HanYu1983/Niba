import { describe, expect, it } from 'vitest'
import { getResourceLimit, type ResourceLimitModifiers } from './rules/playerStatsRules'
import { getTalentBuffs, getResourceLimitModifiers } from './catalogs/talentCatalog'
import { createCharacterState } from './characterFactory'
import { getPlayerResourceLimit } from './rules/playerDerivedRules'
import type { PlayerAttributes } from './types'

const BASE: PlayerAttributes = { armStrength: 8, constitution: 8, agility: 8, innerEnergy: 8, insight: 8 }

function makePlayer(talentIds: string[]) {
  return createCharacterState({
    id: 'p1',
    name: '測試',
    innerSkillId: 'tuna-gong',
    position: { row: 1, column: 1 },
    attributes: BASE,
    buffs: getTalentBuffs(talentIds),
    prestige: 0,
    money: 0,
    experience: 0,
    turnEnded: false,
  })
}

describe('getResourceLimit 純函式核心', () => {
  it('無 modifiers 時等於既有三 getter 公式', () => {
    expect(getResourceLimit(BASE, 'health')).toBe(8 * 3)
    expect(getResourceLimit(BASE, 'stamina')).toBe(8 * 0.5 + 8 * 0.5)
    expect(getResourceLimit(BASE, 'innerPower')).toBe(8 * 3)
  })

  it('multiplier 與 bonus 疊加', () => {
    const mods: ResourceLimitModifiers = { multiplier: { stamina: 0.9 }, bonus: { stamina: 2 } }
    const base = 8 * 0.5 + 8 * 0.5
    expect(getResourceLimit(BASE, 'stamina', mods)).toBe(base * 0.9 + 2)
  })
})

describe('getResourceLimitModifiers 天賦彙整', () => {
  it('qi-master 以 passive-buff 表達（max*Multiplier），resource-limit 彙整為空', () => {
    // qi-master 採 buff 管線（buff field maxInnerPowerMultiplier/maxStaminaMultiplier），
    // 故 resource-limit 原語彙整不產生 multiplier。
    expect(getResourceLimitModifiers(['qi-master']).multiplier).toEqual({})
  })

  it('空清單回傳空 multiplier', () => {
    expect(getResourceLimitModifiers([]).multiplier).toEqual({})
  })
})

describe('qi-master 天賦注入後資源上限生效', () => {
  it('內力上限 ×1.1、體力上限 ×0.9（經 buff 管線）', () => {
    const player = makePlayer(['qi-master'])
    expect(player.maxInnerPower).toBeCloseTo(8 * 3 * 1.1, 5)
    expect(player.maxStamina).toBeCloseTo(8 * 0.9, 5)
    expect(player.maxHealth).toBe(8 * 3)
  })

  it('未選天賦時維持原始上限', () => {
    const player = makePlayer([])
    expect(player.maxHealth).toBe(24)
    expect(player.maxStamina).toBe(8)
    expect(player.maxInnerPower).toBe(24)
  })

  it('getPlayerResourceLimit 依 buff 反映 multiplier', () => {
    const player = makePlayer(['qi-master'])
    expect(getPlayerResourceLimit(player, 'innerPower')).toBeCloseTo(8 * 3 * 1.1, 5)
    expect(getPlayerResourceLimit(player, 'stamina')).toBeCloseTo(8 * 0.9, 5)
    expect(getPlayerResourceLimit(player, 'health')).toBe(24)
  })
})