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
import { evaluateSelfPreservation, evaluateCollectItems, evaluatePositioning } from './goals'
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
