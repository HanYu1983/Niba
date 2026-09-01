import { describe, expect, it } from 'vitest'
import { computeEventChoiceValue } from './eventValue'

const context = {
  playerMoney: 100,
  effects: [{ type: 'prestige' as const, amount: 3 }],
}

describe('computeEventChoiceValue', () => {
  it('技能學習具有高於一般聲望的價值', () => {
    expect(computeEventChoiceValue({
      ...context,
      effects: [{ type: 'learn-skill', skillType: 'inner' }],
    })).toBeGreaterThan(computeEventChoiceValue(context))
  })

  it('正向金錢收益高於同額支出', () => {
    expect(computeEventChoiceValue({
      ...context,
      effects: [{ type: 'money', amount: 20 }],
    })).toBeGreaterThan(computeEventChoiceValue({
      ...context,
      effects: [{ type: 'money', amount: -20 }],
    }))
  })

  it('生成敵對生物會降低選項價值', () => {
    expect(computeEventChoiceValue({
      ...context,
      effects: [{ type: 'spawn-creature', creatureId: 'creature-1' }],
    })).toBe(0)
  })
})
