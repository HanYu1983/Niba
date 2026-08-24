import { describe, expect, it } from 'vitest'
import { applyEquipmentLoadout, reduceEquipmentDurability } from './equipmentRules'
import type { EquipmentLoadout, PlayerState } from '../types'

function makePlayer(): PlayerState {
  return {
    id: 'player-1',
    name: '玩家 1',
    position: { row: 1, column: 1 },
    attributes: { armStrength: 8, constitution: 8, agility: 7, innerEnergy: 5, insight: 7 },
    baseAttributes: { armStrength: 8, constitution: 8, agility: 7, innerEnergy: 5, insight: 7 },
    innerSkillIds: ['tuna-gong'],
    innerSkillId: 'tuna-gong',
    externalSkillIds: [],
    equippedExternalSkillIds: [],
    health: 24,
    maxHealth: 24,
    stamina: 7,
    maxStamina: 7,
    innerPower: 15,
    maxInnerPower: 15,
    prestige: 0,
    money: 0,
    experience: 0,
    inventory: [],
    equipmentInventory: [
      { instanceId: 'sword-1', equipmentId: 'iron-sword', durability: 20, maxDurability: 20 },
      { instanceId: 'robe-1', equipmentId: 'traveling-robe', durability: 20, maxDurability: 20 },
    ],
    equipmentLoadout: { weaponInstanceId: null, armorInstanceId: null, accessoryInstanceId: null },
    turnEnded: false,
  }
}

describe('equipment rules', () => {
  it('套用 loadout 後重算屬性與衍生上限，並裁切超過上限的資源', () => {
    const player = makePlayer()
    const loadout: EquipmentLoadout = { ...player.equipmentLoadout!, weaponInstanceId: 'sword-1' }
    const nextPlayer = applyEquipmentLoadout({ ...player, health: 30, stamina: 10 }, loadout)

    expect(nextPlayer.attributes.armStrength).toBe(10)
    expect(nextPlayer.maxHealth).toBe(24)
    // 身法 7、臂力 10 → 0.5×7 + 0.5×10 = 8.5
    expect(nextPlayer.maxStamina).toBe(8.5)
    expect(nextPlayer.health).toBe(24)
    expect(nextPlayer.stamina).toBe(8.5)
  })

  it('只扣除指定 slot 的耐久並重新計算 loadout', () => {
    const player = makePlayer()
    const equipped = applyEquipmentLoadout(player, { ...player.equipmentLoadout!, weaponInstanceId: 'sword-1' })
    const nextPlayer = reduceEquipmentDurability(equipped, 'weapon', 1)

    expect(nextPlayer.equipmentInventory?.find((item) => item.instanceId === 'sword-1')?.durability).toBe(19)
    expect(nextPlayer.equipmentInventory?.find((item) => item.instanceId === 'robe-1')?.durability).toBe(20)
  })

  it('沒有指定 slot 裝備時不改變玩家狀態', () => {
    const player = makePlayer()
    expect(reduceEquipmentDurability(player, 'accessory', 1)).toEqual(player)
  })

  it('切換內功時重新套用內功 Buff', () => {
    const player = makePlayer()
    const nextPlayer = applyEquipmentLoadout(
      { ...player, innerSkillId: 'void-spirit-inner-1', innerSkillIds: ['tuna-gong', 'void-spirit-inner-1'] },
      player.equipmentLoadout!,
    )

    expect(nextPlayer.innerSkillId).toBe('void-spirit-inner-1')
  })
})
