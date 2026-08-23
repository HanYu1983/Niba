import { describe, expect, it } from 'vitest'
import { buildingActionRegistry } from './buildingActionRegistry'
import type { BaseState, PlayerState } from './types'

function makePlayer(overrides: Partial<PlayerState> = {}): PlayerState {
  return {
    id: 'player-1',
    name: '玩家 1',
    position: { row: 5, column: 5 },
    attributes: { armStrength: 8, constitution: 8, agility: 7, innerEnergy: 5, insight: 7 },
    innerSkillIds: ['tuna-gong'],
    innerSkillId: 'tuna-gong',
    externalSkillIds: [],
    equippedExternalSkillIds: [],
    health: 20,
    maxHealth: 24,
    stamina: 7,
    maxStamina: 7,
    innerPower: 10,
    maxInnerPower: 15,
    prestige: 0,
    money: 10,
    experience: 0,
    inventory: [],
    equipmentInventory: [{ instanceId: 'sword-1', equipmentId: 'iron-sword', durability: 18, maxDurability: 20 }],
    turnEnded: false,
    ...overrides,
  }
}

function makeBase(buildingTypes: string[] = ['board', 'workshop']): BaseState {
  return {
    id: 'base-1',
    name: '測試據點',
    position: { row: 5, column: 6 },
    buildings: buildingTypes.map((type) => ({
      id: `building-${type}`,
      type,
      name: type,
      description: type,
      constructionCost: 0,
    })),
    buildingMaterials: 100,
    maxBuildingMaterials: 100,
    health: 100,
    maxHealth: 100,
  }
}

describe('buildingActionRegistry', () => {
  it('相鄰且回合未結束時，告示牌任務可用', () => {
    const availability = buildingActionRegistry.mission.getAvailability(makeBase(), makePlayer())
    expect(availability.available).toBe(true)
  })

  it('沒有告示牌或醫療室時，對應 action 不可用', () => {
    const base = makeBase([])
    const player = makePlayer()

    expect(buildingActionRegistry.mission.getAvailability(base, player)).toEqual({
      available: false,
      reason: '需要先建造告示牌。',
    })
    expect(buildingActionRegistry.heal.getAvailability(base, player)).toEqual({
      available: false,
      reason: '需要先建造醫療室。',
    })
  })

  it('玩家回合結束後，任務與就醫不可用', () => {
    const player = makePlayer({ turnEnded: true })
    const base = makeBase(['board', 'infirmary'])

    expect(buildingActionRegistry.mission.getAvailability(base, player).available).toBe(false)
    expect(buildingActionRegistry.heal.getAvailability(base, player).available).toBe(false)
  })

  it('修理需要工坊、損耗裝備與足夠體力', () => {
    const base = makeBase()
    const player = makePlayer()

    expect(buildingActionRegistry.repair.getAvailability(base, player).available).toBe(true)
    // 修理不再收取金錢，改為檢查體力。
    expect(buildingActionRegistry.repair.getAvailability(
      base,
      makePlayer({ stamina: 1 }),
    ).available).toBe(false)
    // 沒有工坊時無法修理。
    expect(buildingActionRegistry.repair.getAvailability(
      makeBase(['board']),
      player,
    ).available).toBe(false)
  })
})
