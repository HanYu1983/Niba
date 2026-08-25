import { describe, expect, it } from 'vitest'
import { evaluateSelfPreservation, evaluateCollectItems, evaluatePositioning } from './goals'
import type { FuzzyInputs } from './fuzzyInputs'

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

// ─── evaluateSelfPreservation ───────────────────────────────────────

describe('evaluateSelfPreservation', () => {
  it('安全狀態（血厚、體力滿、無敵人）→ score = 0', () => {
    const result = evaluateSelfPreservation(makeInputs())
    expect(result.score).toBe(0)
    expect(result.target).toBeUndefined()
  })

  it('hitsSurvivable < 2 且威脅近 → score > 0.5（危險）', () => {
    const result = evaluateSelfPreservation(makeInputs({
      hitsSurvivable: 1,
      distToNearestThreat: 1,
    }))
    expect(result.score).toBeGreaterThan(0.5)
    expect(result.target?.kind).toBe('retreat')
  })

  it('hitsSurvivable < 1.5 → f_hitsLow = 1.0', () => {
    const result = evaluateSelfPreservation(makeInputs({
      hitsSurvivable: 1,
      distToNearestThreat: Infinity,
    }))
    expect(result.score).toBeGreaterThanOrEqual(1.0)
  })

  it('hitsSurvivable > 3 → f_hitsLow = 0，無敵人 → score = 0', () => {
    const result = evaluateSelfPreservation(makeInputs({
      hitsSurvivable: 5,
      distToNearestThreat: Infinity,
    }))
    expect(result.score).toBe(0)
  })

  it('體力耗盡（staminaRatio < 0.1）→ score > 0', () => {
    const result = evaluateSelfPreservation(makeInputs({
      staminaRatio: 0.05,
      hitsSurvivable: 99,
      distToNearestThreat: Infinity,
    }))
    expect(result.score).toBeGreaterThan(0)
  })

  it('體力耗盡且威脅近 → score 更高', () => {
    const low = evaluateSelfPreservation(makeInputs({
      staminaRatio: 0.05,
      distToNearestThreat: Infinity,
    }))
    const high = evaluateSelfPreservation(makeInputs({
      staminaRatio: 0.05,
      distToNearestThreat: 1,
    }))
    expect(high.score).toBeGreaterThanOrEqual(low.score)
  })

  it('distToNearestThreat < Infinity → 有 retreat target', () => {
    const result = evaluateSelfPreservation(makeInputs({
      distToNearestThreat: 2,
    }))
    expect(result.target?.kind).toBe('retreat')
  })

  it('distToNearestThreat = Infinity → 無 target', () => {
    const result = evaluateSelfPreservation(makeInputs({
      distToNearestThreat: Infinity,
    }))
    expect(result.target).toBeUndefined()
  })

  it('context 包含 hitsSurvivable 和 distToNearestThreat', () => {
    const result = evaluateSelfPreservation(makeInputs({
      hitsSurvivable: 3,
      distToNearestThreat: 5,
    }))
    expect(result.context).toEqual({ hitsSurvivable: 3, distToNearestThreat: 5 })
  })
})

// ─── evaluateCollectItems ───────────────────────────────────────────

describe('evaluateCollectItems', () => {
  it('無道具 → score = 0', () => {
    const result = evaluateCollectItems(makeInputs())
    expect(result.score).toBe(0)
    expect(result.target).toBeUndefined()
  })

  it('有 1 個道具 → score > 0', () => {
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
    expect(result.score).toBeGreaterThan(0)
    expect(result.target?.kind).toBe('item')
  })

  it('reachableItemCount = 3 + staminaRatio >= 0.85 → score 很高', () => {
    const result = evaluateCollectItems(makeInputs({
      reachableItemCount: 3,
      staminaRatio: 0.9,
      distToNearestItem: 2,
      reachableInterests: [{
        cellId: 'c1',
        position: { row: 5, column: 4 },
        cost: 2,
        kind: 'item',
        ref: { id: 'item-1', position: { row: 5, column: 4 } } as never,
      }],
    }))
    expect(result.score).toBeGreaterThan(0.8)
  })

  it('reachableItemCount = 3 + staminaRatio < 0.7 → score 降低', () => {
    const high = evaluateCollectItems(makeInputs({
      reachableItemCount: 3,
      staminaRatio: 0.9,
      distToNearestItem: 2,
    }))
    const low = evaluateCollectItems(makeInputs({
      reachableItemCount: 3,
      staminaRatio: 0.5,
      distToNearestItem: 2,
    }))
    expect(high.score).toBeGreaterThan(low.score)
  })

  it('distToNearestItem > 5 → score 乘以 0.7', () => {
    const near = evaluateCollectItems(makeInputs({
      reachableItemCount: 3,
      staminaRatio: 0.9,
      distToNearestItem: 3,
    }))
    const far = evaluateCollectItems(makeInputs({
      reachableItemCount: 3,
      staminaRatio: 0.9,
      distToNearestItem: 6,
    }))
    expect(far.score).toBeLessThan(near.score)
    // 遠距離分数 = 近距離分數 * 0.7
    expect(far.score).toBeCloseTo(near.score * 0.7, 5)
  })

  it('reachableItemCount = 0 → score = 0，即使 stamina 滿', () => {
    const result = evaluateCollectItems(makeInputs({
      reachableItemCount: 0,
      staminaRatio: 1,
    }))
    expect(result.score).toBe(0)
  })

  it('有道具 → target 為 item 且帶有 id 和 position', () => {
    const result = evaluateCollectItems(makeInputs({
      reachableItemCount: 1,
      distToNearestItem: 1,
      reachableInterests: [{
        cellId: 'c1',
        position: { row: 3, column: 7 },
        cost: 1,
        kind: 'item',
        ref: { id: 'item-42', position: { row: 3, column: 7 } } as never,
      }],
    }))
    expect(result.target).toEqual({
      kind: 'item',
      id: 'item-42',
      position: { row: 3, column: 7 },
    })
  })

  it('context 包含 reachableItemCount 和 distToNearestItem', () => {
    const result = evaluateCollectItems(makeInputs({
      reachableItemCount: 2,
      distToNearestItem: 4,
    }))
    expect(result.context).toEqual({ reachableItemCount: 2, distToNearestItem: 4 })
  })
})

// ─── evaluatePositioning ────────────────────────────────────────────

describe('evaluatePositioning', () => {
  it('4 個出口 → score = 0', () => {
    const result = evaluatePositioning(makeInputs({ exitCount: 4 }))
    expect(result.score).toBe(0)
    expect(result.target).toBeUndefined()
  })

  it('0 個出口 + 無威脅 → score = 1.0', () => {
    const result = evaluatePositioning(makeInputs({
      exitCount: 0,
      distToNearestThreat: Infinity,
    }))
    expect(result.score).toBe(1.0)
  })

  it('0 個出口 + 有威脅 → score > 1.0 不可能， capped at 1.0', () => {
    const result = evaluatePositioning(makeInputs({
      exitCount: 0,
      distToNearestThreat: 1,
    }))
    expect(result.score).toBeLessThanOrEqual(1.0)
    expect(result.score).toBeGreaterThanOrEqual(1.0) // f_fewExits=1, threat boost capped
  })

  it('0 個出口 + 有威脅 → attack target', () => {
    const result = evaluatePositioning(makeInputs({
      exitCount: 0,
      distToNearestThreat: 2,
    }))
    expect(result.target?.kind).toBe('attack')
  })

  it('0 個出口 + 無威脅 → 無 attack target', () => {
    const result = evaluatePositioning(makeInputs({
      exitCount: 0,
      distToNearestThreat: Infinity,
    }))
    expect(result.target).toBeUndefined()
  })

  it('1 個出口 → score 約 0.7', () => {
    const result = evaluatePositioning(makeInputs({ exitCount: 1 }))
    expect(result.score).toBeGreaterThanOrEqual(0.6)
    expect(result.score).toBeLessThanOrEqual(0.8)
  })

  it('2 個出口 → score 約 0.3', () => {
    const result = evaluatePositioning(makeInputs({ exitCount: 2 }))
    expect(result.score).toBeGreaterThanOrEqual(0.2)
    expect(result.score).toBeLessThanOrEqual(0.4)
  })

  it('3 個出口 → score = 0', () => {
    const result = evaluatePositioning(makeInputs({ exitCount: 3 }))
    expect(result.score).toBe(0)
  })

  it('有出口 + nearestExit → exit target', () => {
    const result = evaluatePositioning(makeInputs({
      exitCount: 1,
      nearestExit: { row: 5, column: 4 },
    }))
    expect(result.target).toEqual({
      kind: 'exit',
      position: { row: 5, column: 4 },
    })
  })

  it('有出口但無 nearestExit → 無 target', () => {
    const result = evaluatePositioning(makeInputs({
      exitCount: 1,
      nearestExit: undefined,
    }))
    expect(result.target).toBeUndefined()
  })

  it('出口越少分數越高', () => {
    const r0 = evaluatePositioning(makeInputs({ exitCount: 0 }))
    const r1 = evaluatePositioning(makeInputs({ exitCount: 1 }))
    const r2 = evaluatePositioning(makeInputs({ exitCount: 2 }))
    const r3 = evaluatePositioning(makeInputs({ exitCount: 3 }))
    expect(r0.score).toBeGreaterThan(r1.score)
    expect(r1.score).toBeGreaterThan(r2.score)
    expect(r2.score).toBeGreaterThan(r3.score)
  })

  it('context 包含 exitCount 和 distToNearestThreat', () => {
    const result = evaluatePositioning(makeInputs({
      exitCount: 1,
      distToNearestThreat: 3,
    }))
    expect(result.context).toEqual({ exitCount: 1, distToNearestThreat: 3 })
  })
})
