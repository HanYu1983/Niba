import { describe, expect, it } from 'vitest'
import type { CreatureState } from '../types'
import { makeTestCreature } from '../testHelpers/aiTestFixtures'
import { validateCreatureTurnEligibility } from './creatureTurnPipeline'

describe('validateCreatureTurnEligibility（切片 I：§9.2 creature kind 回合資格）', () => {
  it('存活且座標有效 → 通過', () => {
    expect(validateCreatureTurnEligibility(makeTestCreature())).toEqual({ ok: true })
  })

  it('已死亡 → 拒絕', () => {
    expect(validateCreatureTurnEligibility(makeTestCreature({ health: 0 }))).toEqual({
      ok: false,
      reason: 'Creature 已無法行動。',
    })
  })

  it('座標缺失或非有限值 → 拒絕', () => {
    const noPosition = makeTestCreature()
    const missingPosition = { ...noPosition, position: undefined } as unknown as CreatureState
    expect(validateCreatureTurnEligibility(missingPosition)).toEqual({
      ok: false,
      reason: 'Creature 座標無效。',
    })

    const nanPosition = makeTestCreature({ position: { row: Number.NaN, column: 5 } })
    expect(validateCreatureTurnEligibility(nanPosition)).toEqual({
      ok: false,
      reason: 'Creature 座標無效。',
    })
  })
})
