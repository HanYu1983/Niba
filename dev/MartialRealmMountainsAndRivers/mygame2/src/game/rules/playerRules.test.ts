import { describe, expect, it } from 'vitest'
import { calculateDamage, recoverLivingPlayers, uniqueCreaturesById } from './playerRules'
import type { CreatureState, PlayerState } from '../types'

type TestCharacter = PlayerState

const character: TestCharacter = {
  id: 'player-1', name: '玩家', position: { row: 1, column: 1 },
  attributes: { armStrength: 8, constitution: 8, agility: 7, innerEnergy: 5, insight: 7 },
  innerSkillIds: ['tuna-gong'], innerSkillId: 'tuna-gong', externalSkillIds: [], equippedExternalSkillIds: [],
  health: 10, maxHealth: 20, stamina: 1, maxStamina: 7, innerPower: 2, maxInnerPower: 15,
  prestige: 0, money: 0, experience: 0, inventory: [], turnEnded: true,
}

describe('player rules', () => {
  it('恢復存活玩家並維持死亡玩家不可行動', () => {
    const [living, dead] = recoverLivingPlayers([character, { ...character, id: 'dead', health: 0 }])
    // 最大血量 = constitution(8) × 3 = 24，5% = 1.2 → 10 + 1.2 = 11.2
    expect(living.health).toBe(11.2)
    // 當前角色：arm 8、agility 7 → maxStamina = 0.5×8 + 0.5×7 = 7.5
    expect(living.stamina).toBe(7.5)
    // 最大內力 = innerEnergy(5) × 3 = 15；有效悟性 = 7 + 吐納功(+5) = 12，回復率 = 5% + 12×0.5% = 11% → 15×11% = 1.65 → 2 + 1.65 = 3.65
    expect(living.innerPower).toBe(3.65)
    expect(living.turnEnded).toBe(false)
    expect(dead.health).toBe(0)
    expect(dead.turnEnded).toBe(true)
  })

  it('傷害至少為 1', () => {
    expect(calculateDamage(2, 5)).toBe(1)
    expect(calculateDamage(8, 5)).toBe(3)
  })

  it('依 id 移除重複 Creature', () => {
    const creature = { ...character, id: 'creature-1' } as CreatureState
    expect(uniqueCreaturesById([creature, { ...creature, position: { row: 2, column: 2 } }])).toHaveLength(1)
  })
})
