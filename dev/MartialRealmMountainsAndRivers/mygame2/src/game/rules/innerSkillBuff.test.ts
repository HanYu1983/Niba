import { describe, expect, it } from 'vitest'
import { getActiveBuffDefinitions } from './playerDerivedRules'
import type { PlayerState } from '../types'

const player = (innerSkillId: string): PlayerState => ({
  id: 'p1',
  name: '玩家',
  position: { row: 2, column: 2 },
  attributes: { armStrength: 8, constitution: 8, agility: 8, innerEnergy: 8, insight: 8 },
  baseAttributes: { armStrength: 8, constitution: 8, agility: 8, innerEnergy: 8, insight: 8 },
  innerSkillId,
  innerSkillIds: [innerSkillId],
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
} as unknown as PlayerState)

describe('getInnerSkillBuffs（內功常駐 Buff）', () => {
  it('基礎內功（吐納功）的 Buff 正常生效', () => {
    const definitions = getActiveBuffDefinitions(player('tuna-gong'))
    expect(definitions.some((d) => d.id === 'tuna-gong-focus')).toBe(true)
  })

  it('官方角色專屬內功（山河歸藏）的 Buff 也能生效', () => {
    // 回歸測試：getInnerSkillBuffs 原本只查基礎 innerSkillCatalog，
    // 專屬內功不在其中，導致 lingyuan-shelter-breath-buff 不生效。
    const definitions = getActiveBuffDefinitions(player('lingyuan-shelter-breath'))
    const buff = definitions.find((d) => d.id === 'lingyuan-shelter-breath-buff')
    expect(buff).toBeDefined()
    expect(buff?.attributeModifiers?.insight).toBe(3)
  })

  it('門派進階內功（金剛流 golden-body-inner）也能被完整目錄找到', () => {
    // 進階內功 id 為 `${schoolId}-inner`，位於 progressionInnerSkills（allInnerSkillCatalog 內）。
    // 其本身無 buffIds（門派常駐 Buff 掛在靈氣型外功上），故不應產生任何內功 Buff。
    const definitions = getActiveBuffDefinitions(player('golden-body-inner'))
    expect(definitions).toEqual([])
  })
})
