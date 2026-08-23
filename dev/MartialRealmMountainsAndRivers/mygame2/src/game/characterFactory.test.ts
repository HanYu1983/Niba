import { describe, expect, it } from 'vitest'
import {
  createCharacterState,
  applyExperienceAndLevelUp,
  restoreAfterAttributeChange,
} from './characterFactory'
import type { PlayerState, PlayerAttributes, CreatureState } from './types'
import { getExperienceRequired } from './types'

function createBasePlayer(overrides: Partial<PlayerState> = {}): PlayerState {
  return createCharacterState({
    id: 'test-player',
    name: '測試玩家',
    innerSkillId: 'tuna-gong',
    position: { row: 1, column: 1 },
    attributes: { armStrength: 8, constitution: 8, agility: 8, innerEnergy: 8, insight: 8 },
    prestige: 0,
    money: 0,
    experience: 0,
    turnEnded: false,
    ...overrides,
  })
}

describe('createCharacterState', () => {
  it('根據屬性計算衍生上限', () => {
    const player = createBasePlayer()
    expect(player.maxHealth).toBeGreaterThan(0)
    expect(player.health).toBe(player.maxHealth)
    expect(player.maxStamina).toBeGreaterThan(0)
    expect(player.stamina).toBe(player.maxStamina)
    expect(player.maxInnerPower).toBeGreaterThan(0)
    expect(player.innerPower).toBe(player.maxInnerPower)
  })

  it('預設內功清單涵蓋所有內功', () => {
    const player = createBasePlayer()
    expect(player.innerSkillIds.length).toBeGreaterThan(0)
  })

  it('未指定裝備時 loadout 為空', () => {
    const player = createBasePlayer()
    expect(player.equipmentLoadout?.weaponInstanceId).toBeNull()
    expect(player.equipmentLoadout?.armorInstanceId).toBeNull()
    expect(player.equipmentLoadout?.accessoryInstanceId).toBeNull()
  })

  it('保留傳入的行為類型與流派', () => {
    const creature = createCharacterState({
      id: 'test-creature',
      name: '測試妖物',
      innerSkillId: 'tuna-gong',
      position: { row: 1, column: 1 },
      attributes: { armStrength: 6, constitution: 6, agility: 6, innerEnergy: 6, insight: 6 },
      prestige: 0,
      money: 0,
      experience: 0,
      turnEnded: false,
      behaviorType: 'roamer',
      schoolId: 'frost-water',
    })
    expect((creature as CreatureState).behaviorType).toBe('roamer')
    expect((creature as CreatureState).schoolId).toBe('frost-water')
  })
})

describe('applyExperienceAndLevelUp', () => {
  it('經驗不足時不升級', () => {
    const player = createBasePlayer({ level: 1, experience: 0, availableAttributePoints: 0 })
    const next = applyExperienceAndLevelUp(player, 10)
    expect(next.level).toBe(1)
    expect(next.experience).toBe(10)
    expect(next.availableAttributePoints).toBe(0)
  })

  it('經驗達標時升級並累加屬性點', () => {
    const player = createBasePlayer({ level: 1, experience: 0, availableAttributePoints: 0 })
    const required = getExperienceRequired(1)
    const next = applyExperienceAndLevelUp(player, required)
    expect(next.level).toBe(2)
    expect(next.availableAttributePoints).toBeGreaterThan(0)
  })

  it('連續升級處理剩餘經驗', () => {
    const player = createBasePlayer({ level: 1, experience: 0, availableAttributePoints: 0 })
    const required1 = getExperienceRequired(1)
    const required2 = getExperienceRequired(2)
    const next = applyExperienceAndLevelUp(player, required1 + required2 + 5)
    expect(next.level).toBe(3)
    expect(next.experience).toBe(5)
  })

  it('殘血升級只回復體力，不回復氣血與內力', () => {
    const base = createBasePlayer()
    const player = { ...base, health: 5, innerPower: 3, stamina: 1 }
    const required = getExperienceRequired(1)
    const next = applyExperienceAndLevelUp(player, required)
    expect(next.level).toBe(2)
    expect(next.health).toBe(5)
    expect(next.innerPower).toBe(3)
    expect(next.stamina).toBe(player.maxStamina)
  })

  it('未升級時不會回復氣血', () => {
    const base = createBasePlayer()
    const player = { ...base, health: 5, innerPower: 3 }
    const next = applyExperienceAndLevelUp(player, 10)
    expect(next.level).toBe(1)
    expect(next.health).toBe(5)
    expect(next.innerPower).toBe(3)
  })
})

describe('restoreAfterAttributeChange', () => {
  it('更新衍生上限但不回復氣血與內力', () => {
    const player = createBasePlayer()
    const damagedPlayer = { ...player, health: 1, stamina: 1, innerPower: 1 }
    const attributes: PlayerAttributes = { armStrength: 10, constitution: 8, agility: 8, innerEnergy: 8, insight: 8 }
    const restored = restoreAfterAttributeChange(damagedPlayer, attributes)
    expect(restored.attributes).toEqual(attributes)
    expect(restored.health).toBe(1)
    expect(restored.stamina).toBe(1)
    expect(restored.innerPower).toBe(1)
  })
})
