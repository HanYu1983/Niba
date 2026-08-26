/**
 * 目標函數引導測試（Guiding Tests）
 *
 * 本檔案的目的不是約束現有程式碼，而是「先寫出期望的目標值，再回頭修改算分方式來符合測試」。
 * 每個目標只保留一組最關鍵的測試：在最適/最差狀況下，分數必須高於或低於某個門檻。
 *
 * 開發流程：
 *   1. 決定目標在某種情境下應該回傳什麼數值範圍
 *   2. 寫下 assert（如 expect(result.score).toBeGreaterThan(0.6)）
 *   3. 修改 goals.ts 中的算分邏輯直到測試通過
 */
import { describe, expect, it } from 'vitest'
import { evaluateSelfPreservation, evaluateCollectItems, evaluatePositioning, evaluateAttackNest, evaluateEquipInnerSkill, evaluateUseInnerSkillAttack } from './goals'
import type { FuzzyInputs } from './fuzzyInputs'
import { MIN_THRESHOLD } from './decision'

function makeInputs(overrides: Partial<FuzzyInputs> = {}): FuzzyInputs {
  return {
    hitsSurvivable: 99,
    staminaRatio: 1,
    distToNearestThreat: Infinity,
    maxVisibleEnemyDamage: 0,
    reachableItemCount: 0,
    reachableResourceCount: 0,
    reachableInterests: [],
    distToNearestItem: Infinity,
    exitCount: 4,
    nearestExit: undefined,
    nearestBase: undefined,
    visibleBaseIds: [],
    materialRatio: 0,
    canBuild: false,
    buildableBuilding: undefined,
    nearestResourcePoint: undefined,
    distToNearestResourcePoint: Infinity,
    isAdjacentToResourcePoint: false,
    unexploredReachableCount: 0,
    nearestUnexploredPosition: undefined,
    distToNearestCreature: Infinity,
    nearestCreatureId: '',
    availableAttributePoints: 0,
    bestItemToUse: undefined,
    equipableEquipment: undefined,
    distToNearestNest: Infinity,
    nearestNestId: '',
    visibleCreatureCount: 0,
    betterInnerSkill: undefined,
    hasDamageInnerSkill: false,
    innerPowerRatio: 0,
    ...overrides,
  }
}

describe('evaluateSelfPreservation', () => {
  it('血低（hitsSurvivable=1）+ 威脅近（dist=1）→ score 應該高於 0.5', () => {
    const result = evaluateSelfPreservation(makeInputs({
      hitsSurvivable: 1,
      distToNearestThreat: 1,
    }))
    expect(result.score).toBeGreaterThan(0.5)
  })

  it('血厚 + 無敵人 → score 應該低於 0.1', () => {
    const result = evaluateSelfPreservation(makeInputs())
    expect(result.score).toBeLessThan(0.1)
  })
})

describe('evaluateCollectItems', () => {
  it('有道具（count=1, dist=1）→ score 應該高於 MIN_THRESHOLD', () => {
    const result = evaluateCollectItems(makeInputs({
      reachableItemCount: 1,
      distToNearestItem: 1,
      reachableInterests: [{
        cellId: 'c1',
        position: { row: 5, column: 4 },
        cost: 1,
        kind: 'item',
        ref: { id: 'item-1', position: { row: 5, column: 4 } } as never,
      }],
    }))
    expect(result.score).toBeGreaterThan(MIN_THRESHOLD)
  })

  it('無道具 → score 應該等於 0', () => {
    const result = evaluateCollectItems(makeInputs())
    expect(result.score).toBe(0)
  })
})

describe('evaluatePositioning', () => {
  it('無出口（exitCount=0）→ score 應該高於 0.9', () => {
    const result = evaluatePositioning(makeInputs({ exitCount: 0 }))
    expect(result.score).toBeGreaterThan(0.9)
  })

  it('出口多（exitCount=4）→ score 應該低於 0.1', () => {
    const result = evaluatePositioning(makeInputs({ exitCount: 4 }))
    expect(result.score).toBeLessThan(0.1)
  })
})

describe('evaluateAttackNest', () => {
  it('安全血量 + 無生物 + 巢穴近（dist=1）→ score 應該高於 0.6', () => {
    const result = evaluateAttackNest(makeInputs({
      hitsSurvivable: 8,
      visibleCreatureCount: 0,
      distToNearestNest: 1,
    }))
    expect(result.score).toBeGreaterThan(0.6)
  })

  it('有可見生物 → score 應該等於 0', () => {
    const result = evaluateAttackNest(makeInputs({
      visibleCreatureCount: 1,
      distToNearestNest: 1,
    }))
    expect(result.score).toBe(0)
  })

  it('無巢穴 → score 應該等於 0', () => {
    const result = evaluateAttackNest(makeInputs())
    expect(result.score).toBe(0)
  })
})

describe('evaluateEquipInnerSkill', () => {
  it('有更強內功 + 內力充足 → score 應該高於 0.5', () => {
    const result = evaluateEquipInnerSkill(makeInputs({
      betterInnerSkill: { id: 'tuna-gong', name: '吐納功', insightRequirement: 5 },
      innerPowerRatio: 0.5,
    }))
    expect(result.score).toBeGreaterThan(0.5)
  })

  it('無更強內功 → score 應該等於 0', () => {
    const result = evaluateEquipInnerSkill(makeInputs())
    expect(result.score).toBe(0)
  })
})

describe('evaluateUseInnerSkillAttack', () => {
  it('有傷害內功 + 內力足夠 + 敵人近 → score 應該高於 0.5', () => {
    const result = evaluateUseInnerSkillAttack(makeInputs({
      hasDamageInnerSkill: true,
      innerPowerRatio: 0.5,
      visibleCreatureCount: 1,
      distToNearestThreat: 1,
    }))
    expect(result.score).toBeGreaterThan(0.5)
  })

  it('無傷害內功 → score 應該等於 0', () => {
    const result = evaluateUseInnerSkillAttack(makeInputs({
      visibleCreatureCount: 1,
      distToNearestThreat: 1,
    }))
    expect(result.score).toBe(0)
  })
})
