import { describe, expect, it } from 'vitest'
import { computeCombatCandidateValue } from './combatValue'

function value(overrides: Partial<Parameters<typeof computeCombatCandidateValue>[0]> = {}) {
  return computeCombatCandidateValue({
    distance: 1,
    healthRatio: 1,
    damageRatio: 0.4,
    hitsSurvivable: 5,
    level: 3,
    ...overrides,
    staminaRatio: overrides.staminaRatio ?? 1,
  })
}

describe('computeCombatCandidateValue', () => {
  it('同距離下優先攻擊低血量目標', () => {
    expect(value({ healthRatio: 0.2 })).toBeGreaterThan(value({ healthRatio: 1 }))
  })

  it('高傷害命中率提高攻擊價值', () => {
    expect(value({ damageRatio: 0.9 })).toBeGreaterThan(value({ damageRatio: 0.2 }))
  })

  it('好戰型提高攻擊候選價值', () => {
    expect(value({ personality: 'aggressive' })).toBeGreaterThan(value())
  })

  it('風險過高時降低攻擊價值', () => {
    expect(value({ hitsSurvivable: 0.5 })).toBeLessThan(value({ hitsSurvivable: 3 }))
  })
})
