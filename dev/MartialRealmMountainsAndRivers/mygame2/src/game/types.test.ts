import { describe, expect, it } from 'vitest'
import {
  getAdjacentPositions,
  isAdjacent,
  isSamePosition,
  getCriticalRate,
  getExperienceRequired,
  ATTRIBUTE_POINTS_PER_LEVEL,
  type PlayerState,
  type PlayerAttributes,
} from './types'
import { buffCatalog } from './catalogs/buffCatalog'
import { getMaxStamina, getMaxInnerPower, getMaxHealth } from './rules/playerStatsRules'
import { getActiveBuffsForPlayer, canTraverseTerrain, getDamageDealtPercent, getDamageReductionPercent, getEffectiveAttributesForPlayer, getEvasionRate, getExternalSkillDamagePercent, getExternalSkillInnerCostReduction, getInnerPowerLeechPercent, getLifestealPercent, getTerrainStaminaCost } from './rules/playerDerivedRules'
import { applyPeriodicBuffEffects } from './rules/playerRules'
import { getPlayerTotalInsightCost, getPlayerInsightCapacityBreakdown, getSkillEffectMultiplier } from './rules/skillRules'

const baseAttributes: PlayerAttributes = {
  armStrength: 8,
  constitution: 8,
  agility: 7,
  innerEnergy: 5,
  insight: 7,
}

function makePlayer(overrides: Partial<PlayerState> = {}): PlayerState {
  return {
    id: 'player-1',
    name: '玩家 1',
    position: { row: 5, column: 5 },
    attributes: baseAttributes,
    innerSkillIds: ['tuna-gong'],
    innerSkillId: 'tuna-gong',
    externalSkillIds: ['sky-breaking-palm'],
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

describe('屬性上限', () => {
  it('體力上限由身法與臂力各半決定', () => {
    // 身法 10、臂力 8 → 0.5×10 + 0.5×8 = 9
    expect(getMaxStamina({ ...baseAttributes, agility: 10, armStrength: 8 })).toBe(9)
    // 身法 7、臂力 8 → 0.5×7 + 0.5×8 = 7.5
    expect(getMaxStamina(baseAttributes)).toBe(7.5)
  })

  it('最大內力為內息 × 3', () => {
    expect(getMaxInnerPower({ ...baseAttributes, innerEnergy: 5 })).toBe(15)
  })

  it('最大生命為根骨 × 3', () => {
    expect(getMaxHealth({ ...baseAttributes, constitution: 8 })).toBe(24)
  })
})

describe('角色升級規則', () => {
  it('每次升級取得 2 點屬性點', () => {
    expect(ATTRIBUTE_POINTS_PER_LEVEL).toBe(2)
  })

  it('初始等級的下一級需求為 50，並依等級遞增', () => {
    expect(getExperienceRequired(1)).toBe(50)
    expect(getExperienceRequired(2)).toBe(100)
  })

  it('五維修正後最低為 1', () => {
    const player = makePlayer({
      baseAttributes: { ...baseAttributes, armStrength: 1 },
      attributes: { ...baseAttributes, armStrength: 1 },
      buffs: [{ id: 'negative-test', definitionId: 'iron-force-strength', sourceId: 'test', remainingRounds: null }],
    })
    expect(getEffectiveAttributesForPlayer(player).armStrength).toBeGreaterThanOrEqual(1)
  })
})

describe('地形體力消耗', () => {
  it('平原消耗 2', () => {
    expect(getTerrainStaminaCost('plain')).toBe(2)
  })

  it('森林消耗 4', () => {
    expect(getTerrainStaminaCost('forest')).toBe(4)
  })

  it('水域消耗 6', () => {
    expect(getTerrainStaminaCost('water')).toBe(6)
  })

  it('Buff 可將水域消耗降為 2', () => {
    const player = makePlayer({ buffs: [{ id: 'water-buff', definitionId: 'water-step', sourceId: 'test', remainingRounds: null }] })
    expect(getTerrainStaminaCost('water', player)).toBe(2)
    expect(buffCatalog.some((buff) => buff.id === 'water-step')).toBe(true)
  })

  it('牆體不可通行', () => {
    expect(getTerrainStaminaCost('wall')).toBe(Number.POSITIVE_INFINITY)
  })

  it('破壁功使牆體可通行且消耗降為 2', () => {
    const player = makePlayer({ buffs: [{ id: 'b1', definitionId: 'wall-step', sourceId: 'test', remainingRounds: null }] })
    expect(canTraverseTerrain('wall', player)).toBe(true)
    expect(getTerrainStaminaCost('wall', player)).toBe(2)
  })

  it('無破壁功時牆體不可通行', () => {
    const player = makePlayer()
    expect(canTraverseTerrain('wall', player)).toBe(false)
  })

  it('疾行：所有地形移動消耗 -2（最低 1）', () => {
    const player = makePlayer({ buffs: [{ id: 'b1', definitionId: 'swift-wind-movement', sourceId: 'test', remainingRounds: null }] })
    // 平原 2-2=0 → 最低 1；森林 4-2=2；水域 6-2=4；山嶽 5-2=3；荒漠 3-2=1；官道 1-2 → 最低 1。
    expect(getTerrainStaminaCost('plain', player)).toBe(1)
    expect(getTerrainStaminaCost('forest', player)).toBe(2)
    expect(getTerrainStaminaCost('water', player)).toBe(4)
    expect(getTerrainStaminaCost('mountain', player)).toBe(3)
    expect(getTerrainStaminaCost('desert', player)).toBe(1)
    expect(getTerrainStaminaCost('road', player)).toBe(1)
  })
})

describe('類別 1：資源轉換 Buff', () => {
  it('嗜血：造成傷害時回復 30% 傷害值的血量', () => {
    const player = makePlayer({ buffs: [{ id: 'b1', definitionId: 'bloodthirst', sourceId: 'test', remainingRounds: null }] })
    expect(getLifestealPercent(player)).toBe(0.3)
  })

  it('汲元：造成傷害時回復 10% 傷害值的內力', () => {
    const player = makePlayer({ buffs: [{ id: 'b1', definitionId: 'inner-power-drain', sourceId: 'test', remainingRounds: null }] })
    expect(getInnerPowerLeechPercent(player)).toBe(0.1)
  })

  it('鐵壁訣：受到傷害時最終傷害 -20%', () => {
    const player = makePlayer({ buffs: [{ id: 'b1', definitionId: 'iron-wall-art', sourceId: 'test', remainingRounds: null }] })
    expect(getDamageReductionPercent(player)).toBe(0.2)
  })

  it('破軍訣：普通攻擊傷害 +20%', () => {
    const player = makePlayer({ buffs: [{ id: 'b1', definitionId: 'break-army-art', sourceId: 'test', remainingRounds: null }] })
    expect(getDamageDealtPercent(player)).toBe(0.2)
  })

  it('罡氣訣：外功傷害 +20%', () => {
    const player = makePlayer({ buffs: [{ id: 'b1', definitionId: 'vigor-art', sourceId: 'test', remainingRounds: null }] })
    expect(getExternalSkillDamagePercent(player)).toBe(0.2)
  })

  it('四兩千斤：外功內力消耗 -1', () => {
    const player = makePlayer({ buffs: [{ id: 'b1', definitionId: 'four-ounces-thousand-pounds', sourceId: 'test', remainingRounds: null }] })
    expect(getExternalSkillInnerCostReduction(player)).toBe(1)
  })

  it('幻影步：回避率 +5%', () => {
    const player = makePlayer({ buffs: [{ id: 'b1', definitionId: 'phantom-step', sourceId: 'test', remainingRounds: null }] })
    // 基礎回避率 = 身法 7，加上 Buff 加成 5 → 12
    expect(getEvasionRate(player)).toBe(12)
  })

  it('回春訣：每回合回復最大血量 10%', () => {
    const player = makePlayer({
      health: 20,
      buffs: [{ id: 'b1', definitionId: 'spring-return-art', sourceId: 'test', remainingRounds: null }],
    })
    const [after] = applyPeriodicBuffEffects([player])
    expect(after.health).toBe(22.4)
  })

  it('化氣訣：每回合回復最大內力 ×10% 的血量', () => {
    const player = makePlayer({
      health: 20,
      buffs: [{ id: 'b1', definitionId: 'qi-transformation-art', sourceId: 'test', remainingRounds: null }],
    })
    const [after] = applyPeriodicBuffEffects([player])
    // 最大內力 = innerEnergy(5) × 3 = 15，10% = 1.5
    expect(after.health).toBe(21.5)
  })
})

describe('類別 4：條件型 Buff', () => {
  it('背水：血量低於 30% 時五維 ×1.5', () => {
    const player = makePlayer({
      health: 10,
      maxHealth: 40,
      buffs: [{ id: 'b1', definitionId: 'back-to-water', sourceId: 'test', remainingRounds: null }],
    })
    expect(getEffectiveAttributesForPlayer(player).armStrength).toBe(Math.floor(8 * 1.5))
  })

  it('背水：血量高於 30% 時不觸發', () => {
    const player = makePlayer({
      health: 30,
      maxHealth: 40,
      buffs: [{ id: 'b1', definitionId: 'back-to-water', sourceId: 'test', remainingRounds: null }],
    })
    expect(getEffectiveAttributesForPlayer(player).armStrength).toBe(8)
  })

  it('養氣：血量高於 80% 時五維 ×1.2', () => {
    const player = makePlayer({
      health: 36,
      maxHealth: 40,
      buffs: [{ id: 'b1', definitionId: 'nurture-qi', sourceId: 'test', remainingRounds: null }],
    })
    expect(getEffectiveAttributesForPlayer(player).armStrength).toBe(Math.floor(8 * 1.2))
  })

  it('孤注：血量低於 15% 時五維 ×2', () => {
    const player = makePlayer({
      health: 4,
      maxHealth: 40,
      buffs: [{ id: 'b1', definitionId: 'all-in', sourceId: 'test', remainingRounds: null }],
    })
    expect(getEffectiveAttributesForPlayer(player).armStrength).toBe(16)
  })

  it('多個條件型同時滿足時全部疊乘', () => {
    const player = makePlayer({
      health: 4,
      maxHealth: 40,
      buffs: [
        { id: 'b1', definitionId: 'back-to-water', sourceId: 'test', remainingRounds: null },
        { id: 'b2', definitionId: 'all-in', sourceId: 'test', remainingRounds: null },
      ],
    })
    expect(getEffectiveAttributesForPlayer(player).armStrength).toBe(Math.floor(8 * 1.5 * 2))
  })
})

describe('鄰接與位置', () => {
  it('getAdjacentPositions 回傳上下左右四格', () => {
    const positions = getAdjacentPositions({ row: 5, column: 5 })
    expect(positions).toHaveLength(4)
    expect(positions).toEqual([
      { row: 4, column: 5 },
      { row: 6, column: 5 },
      { row: 5, column: 4 },
      { row: 5, column: 6 },
    ])
  })

  it('isSamePosition 判斷相同座標', () => {
    expect(isSamePosition({ row: 1, column: 2 }, { row: 1, column: 2 })).toBe(true)
    expect(isSamePosition({ row: 1, column: 2 }, { row: 2, column: 2 })).toBe(false)
  })

  it('isAdjacent 只認可曼哈頓距離 1', () => {
    expect(isAdjacent({ row: 5, column: 5 }, { row: 5, column: 6 })).toBe(true)
    expect(isAdjacent({ row: 5, column: 5 }, { row: 5, column: 7 })).toBe(false)
    expect(isAdjacent({ row: 5, column: 5 }, { row: 5, column: 5 })).toBe(false)
  })
})

describe('臂力普通攻擊暴擊率', () => {
  it('每 1 點臂力 2%，最高 50%', () => {
    expect(getCriticalRate({ ...baseAttributes, armStrength: 1 })).toBe(2)
    expect(getCriticalRate({ ...baseAttributes, armStrength: 5 })).toBe(10)
    expect(getCriticalRate({ ...baseAttributes, armStrength: 10 })).toBe(20)
    expect(getCriticalRate({ ...baseAttributes, armStrength: 20 })).toBe(40)
  })
})

describe('悟性容量', () => {
  it('功法超出悟性上限時效果大幅衰減', () => {
    const player = makePlayer({
      attributes: { ...baseAttributes, insight: 1 },
      equippedExternalSkillIds: ['sky-breaking-palm'],
    })
    expect(getSkillEffectMultiplier(player)).toBe(0.1)
    expect(getSkillEffectMultiplier(makePlayer({ equippedExternalSkillIds: [] }))).toBe(1)
  })
  it('未裝備外功時，總容量等於內功需求', () => {
    const player = makePlayer({ innerSkillId: 'tuna-gong' })
    expect(getPlayerTotalInsightCost(player)).toBe(5)
  })

  it('裝備外功後，總容量為內功 + 外功', () => {
    const player = makePlayer({
      innerSkillId: 'tuna-gong',
      equippedExternalSkillIds: ['sky-breaking-palm'],
    })
    expect(getPlayerTotalInsightCost(player)).toBe(5 + 2)
  })

  it('breakdown 正確拆分內功與外功', () => {
    const player = makePlayer({
      innerSkillId: 'tuna-gong',
      equippedExternalSkillIds: ['sky-breaking-palm'],
    })
    const breakdown = getPlayerInsightCapacityBreakdown(player)
    expect(breakdown.inner).toBe(5)
    expect(breakdown.external).toBe(2)
    expect(breakdown.total).toBe(7)
    // 吐納功提供悟性 +5，因此容量上限使用有效悟性 12。
    expect(breakdown.limit).toBe(12)
    expect(breakdown.exceeded).toBe(false)
  })

  it('容量超過悟性時 exceeded 為 true', () => {
    const player = makePlayer({
      innerSkillId: 'tuna-gong',
      equippedExternalSkillIds: ['sky-breaking-palm'],
      attributes: { ...baseAttributes, insight: 1 },
    })
    const breakdown = getPlayerInsightCapacityBreakdown(player)
    expect(breakdown.total).toBe(5 + 2)
    expect(breakdown.exceeded).toBe(true)
  })
})

describe('內功 Buff', () => {
  it('吐納功提供持續 Buff', () => {
    const player = makePlayer({ innerSkillId: 'tuna-gong' })
    expect(getActiveBuffsForPlayer(player)).toEqual([
      expect.objectContaining({ definitionId: 'tuna-gong-focus', remainingRounds: null }),
    ])
  })
})
