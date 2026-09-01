import { describe, expect, it } from 'vitest'
import { computeConstructionCandidateValue } from './constructionValue'

function value(overrides: Partial<Parameters<typeof computeConstructionCandidateValue>[0]> = {}) {
  return computeConstructionCandidateValue({
    kind: 'build',
    buildingType: 'warehouse',
    cost: 20,
    materialRatio: 1,
    threatCountNearBase: 0,
    distanceToBase: 1,
    ...overrides,
  })
}

describe('computeConstructionCandidateValue', () => {
  it('讓建設偏好型提高倉庫候選價值', () => {
    expect(value({ personality: 'builder' })).toBeGreaterThan(value())
  })

  it('有威脅時提高防禦建築相對於一般建築的價值', () => {
    expect(value({ buildingType: 'arrow-tower', threatCountNearBase: 3 }))
      .toBeGreaterThan(value({ buildingType: 'warehouse', threatCountNearBase: 3 }))
  })

  it('成本與距離增加時降低候選價值', () => {
    expect(value({ cost: 80, distanceToBase: 8 })).toBeLessThan(value({ cost: 20, distanceToBase: 1 }))
  })

  it('升級候選在相同條件下有小幅效益加成', () => {
    expect(value({ kind: 'upgrade' })).toBeGreaterThan(value({ kind: 'build' }))
  })
})
