import { describe, expect, it } from 'vitest'
import {
  getBuildingLevel,
  isFixedFunctionBuilding,
  canUpgradeBuildingType,
  getBuildingUpgradeCost,
  getBuildingUpgradeResult,
  upgradeBuildingInBase,
  canPlayerBuildBuildingType,
  DEFAULT_BUILDING_LEVEL,
  BUILDING_UPGRADE_COST_PER_LEVEL,
} from './buildingProgressionRules'
import type { BaseState, PlayerState } from '../types'
import { getMaxHealth, getMaxInnerPower, getMaxStamina } from './playerStatsRules'
import type { BaseBuilding } from '../catalogs/buildingCatalog'

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

function makeBuilding(overrides: Partial<BaseBuilding> = {}): BaseBuilding {
  return {
    id: 'building-1',
    type: 'wall',
    name: '強化城牆',
    description: '提升據點最大生命。',
    constructionCost: 30,
    level: 1,
    ...overrides,
  }
}

function makeBase(overrides: Partial<BaseState> = {}): BaseState {
  return {
    id: 'base-1',
    name: '測試據點',
    position: { row: 5, column: 6 },
    buildings: [makeBuilding()],
    buildingMaterials: 100,
    maxBuildingMaterials: 100,
    health: 100,
    maxHealth: 100,
    ...overrides,
  }
}

describe('建築等級', () => {
  it('未指定等級時預設為 1 級', () => {
    expect(getBuildingLevel(makeBuilding({ level: undefined }))).toBe(DEFAULT_BUILDING_LEVEL)
  })

  it('固定功能建築不可升級', () => {
    expect(isFixedFunctionBuilding('waystation')).toBe(true)
    expect(isFixedFunctionBuilding('exchange')).toBe(true)
    expect(isFixedFunctionBuilding('regional-management')).toBe(true)
    expect(canUpgradeBuildingType('waystation')).toBe(false)
  })

  it('一般建築可升級', () => {
    expect(canUpgradeBuildingType('wall')).toBe(true)
    expect(canUpgradeBuildingType('infirmary')).toBe(true)
  })

  it('升級成本依目前等級遞增', () => {
    const level1 = makeBuilding({ level: 1 })
    const level2 = makeBuilding({ level: 2 })
    expect(getBuildingUpgradeCost(level1)).toBe(BUILDING_UPGRADE_COST_PER_LEVEL)
    expect(getBuildingUpgradeCost(level2)).toBe(BUILDING_UPGRADE_COST_PER_LEVEL * 2)
  })
})

describe('升級判定', () => {
  it('官階不足時不可升級', () => {
    const player = makePlayer({ prestige: 0 }) // 流民首領，上限 Lv.1
    const base = makeBase()
    const result = getBuildingUpgradeResult(base, base.buildings[0], player)
    expect(result.ok).toBe(false)
    expect(result.reason).toContain('官階')
  })

  it('村寨掌事可將建築升至 2 級', () => {
    const player = makePlayer({ prestige: 80 }) // 上限 Lv.2
    const base = makeBase()
    const result = getBuildingUpgradeResult(base, base.buildings[0], player)
    expect(result.ok).toBe(true)
    expect(result.nextLevel).toBe(2)
  })

  it('建料不足時不可升級', () => {
    const player = makePlayer({ prestige: 80 })
    const base = makeBase({ buildingMaterials: 5 })
    const result = getBuildingUpgradeResult(base, base.buildings[0], player)
    expect(result.ok).toBe(false)
    expect(result.reason).toContain('建料')
  })

  it('升級成功後扣除建料並提高等級', () => {
    const player = makePlayer({ prestige: 80 })
    const base = makeBase()
    const next = upgradeBuildingInBase(base, base.buildings[0].id, player)
    expect(next.buildings[0].level).toBe(2)
    expect(next.buildingMaterials).toBe(100 - BUILDING_UPGRADE_COST_PER_LEVEL)
  })

  it('固定功能建築不可透過 upgradeBuildingInBase 升級', () => {
    const player = makePlayer({ prestige: 80 })
    const building = makeBuilding({ id: 'waystation-1', type: 'waystation', level: 1 })
    const base = makeBase({ buildings: [building] })
    const next = upgradeBuildingInBase(base, building.id, player)
    expect(next.buildings[0].level).toBe(1)
  })
})

describe('官階解鎖建築', () => {
  it('流民首領可建造基礎建築、商店與強化城牆', () => {
    const player = makePlayer({ prestige: 0 })
    expect(canPlayerBuildBuildingType(player, 'board')).toBe(true)
    expect(canPlayerBuildBuildingType(player, 'item-shop')).toBe(true)
    expect(canPlayerBuildBuildingType(player, 'equipment-shop')).toBe(true)
    expect(canPlayerBuildBuildingType(player, 'wall')).toBe(true)
  })

  it('所有建築官階需求皆為 1，流民首領即可建造', () => {
    const player = makePlayer({ prestige: 0 })
    expect(canPlayerBuildBuildingType(player, 'waystation')).toBe(true)
    expect(canPlayerBuildBuildingType(player, 'regional-management')).toBe(true)
  })

  it('村寨掌事可建造建料倉庫與醫療室', () => {
    const player = makePlayer({ prestige: 80 })
    expect(canPlayerBuildBuildingType(player, 'warehouse')).toBe(true)
    expect(canPlayerBuildBuildingType(player, 'infirmary')).toBe(true)
  })

  it('鄉鎮主事可建造城牆與修理工坊', () => {
    const player = makePlayer({ prestige: 240 })
    expect(canPlayerBuildBuildingType(player, 'wall')).toBe(true)
    expect(canPlayerBuildBuildingType(player, 'workshop')).toBe(true)
  })

  it('地方縣佐可建造驛站、交易所與總管府', () => {
    const player = makePlayer({ prestige: 560 })
    expect(canPlayerBuildBuildingType(player, 'waystation')).toBe(true)
    expect(canPlayerBuildBuildingType(player, 'exchange')).toBe(true)
    expect(canPlayerBuildBuildingType(player, 'regional-management')).toBe(true)
  })
})