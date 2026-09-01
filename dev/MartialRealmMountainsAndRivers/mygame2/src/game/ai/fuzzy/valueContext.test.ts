import { describe, expect, it } from 'vitest'
import { computeUnifiedValue, distanceDecay, evaluateUnifiedValue } from './valueContext'

describe('computeUnifiedValue', () => {
  const base = {
    need: 0.8,
    benefit: 0.8,
    urgency: 0.8,
    risk: 0,
    cost: 0,
    distance: 0,
    personalityWeight: 1,
  }

  it('各核心需求維度降低時，價值不會提高', () => {
    const fullValue = computeUnifiedValue(base)
    expect(computeUnifiedValue({ ...base, need: 0.2 })).toBeLessThan(fullValue)
    expect(computeUnifiedValue({ ...base, risk: 1 })).toBeLessThan(fullValue)
    expect(computeUnifiedValue({ ...base, cost: 1 })).toBeLessThan(fullValue)
  })

  it('距離衰減隨距離增加而降低', () => {
    expect(distanceDecay(4)).toBeLessThan(distanceDecay(1))
    expect(computeUnifiedValue({ ...base, distance: 4 })).toBeLessThan(computeUnifiedValue(base))
  })

  it('結果限制在 0 到 1', () => {
    expect(computeUnifiedValue({ ...base, personalityWeight: 10 })).toBeLessThanOrEqual(1)
    expect(computeUnifiedValue({ ...base, risk: 10, cost: 10 })).toBeGreaterThanOrEqual(0)
  })

  it('回傳可供日誌使用的正規化因子', () => {
    const evaluation = evaluateUnifiedValue({ ...base, risk: 0.4, cost: 0.2 })
    expect(evaluation.value).toBe(computeUnifiedValue({ ...base, risk: 0.4, cost: 0.2 }))
    expect(evaluation.factors.need).toBe(0.8)
    expect(evaluation.factors.riskPenalty).toBe(0.8)
    expect(evaluation.factors.costPenalty).toBe(0.94)
  })
})
