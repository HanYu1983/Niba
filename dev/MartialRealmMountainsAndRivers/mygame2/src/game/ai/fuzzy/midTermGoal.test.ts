import { describe, it, expect, beforeEach } from 'vitest'
import { applyMidTermGoalInputs, overrideScoreForMidTermGoal, clearMidTermGoals, isSavingMoney, getSaveMoneyTarget, SAVE_MONEY_TRIGGER, SAVE_MONEY_TARGET } from './midTermGoal'
import type { GoalResult } from './goals'

const missionResult: GoalResult = {
  score: 0.4,
  target: { kind: 'use-facility', baseId: 'base-1', facilityType: 'mission' },
  actions: [{ type: 'use-facility', actor: { id: 'p1', kind: 'player' }, baseId: 'base-1', facilityType: 'mission', reason: '打工' }],
}

const holdResult: GoalResult = {
  score: 0.4,
  actions: [{ type: 'hold', actor: { id: 'p1', kind: 'player' }, reason: '待命' }],
}

describe('midTermGoal 存錢目標', () => {
  beforeEach(() => {
    clearMidTermGoals()
  })

  it('缺錢且有告示牌 → 鎖定存錢', () => {
    const goal = applyMidTermGoalInputs('p1', 0, 0.8, true, 'base-1')
    expect(goal?.type).toBe('save-money')
    expect(isSavingMoney('p1')).toBe(true)
  })

  it('金錢接近目標 → 不鎖定', () => {
    const goal = applyMidTermGoalInputs('p1', SAVE_MONEY_TRIGGER + 10, 0.8, true, 'base-1')
    expect(goal).toBeUndefined()
    expect(isSavingMoney('p1')).toBe(false)
  })

  it('無告示牌 → 不鎖定', () => {
    const goal = applyMidTermGoalInputs('p1', 0, 0.8, false, '')
    expect(goal).toBeUndefined()
  })

  it('體力太低 → 不鎖定', () => {
    const goal = applyMidTermGoalInputs('p1', 0, 0.05, true, 'base-1')
    expect(goal).toBeUndefined()
  })

  it('鎖定中金錢達標 → 解除', () => {
    applyMidTermGoalInputs('p1', 0, 0.8, true, 'base-1')
    expect(isSavingMoney('p1')).toBe(true)
    const goal = applyMidTermGoalInputs('p1', 200, 0.8, true, 'base-1')
    expect(goal).toBeUndefined()
    expect(isSavingMoney('p1')).toBe(false)
  })

  it('鎖定中告示牌消失 → 解除', () => {
    applyMidTermGoalInputs('p1', 0, 0.8, true, 'base-1')
    const goal = applyMidTermGoalInputs('p1', 10, 0.8, false, '')
    expect(goal).toBeUndefined()
  })

  it('鎖定時把打工 goal 抬到 1.0', () => {
    applyMidTermGoalInputs('p1', 0, 0.8, true, 'base-1')
    const overridden = overrideScoreForMidTermGoal('p1', 'executeMission', missionResult)
    expect(overridden.score).toBe(1.0)
  })

  it('鎖定時不影響其他 goal', () => {
    applyMidTermGoalInputs('p1', 0, 0.8, true, 'base-1')
    const overridden = overrideScoreForMidTermGoal('p1', 'exploration', { score: 0.3 })
    expect(overridden.score).toBe(0.3)
  })

  it('hold 型打工 action 不抬分（避免空轉）', () => {
    applyMidTermGoalInputs('p1', 0, 0.8, true, 'base-1')
    const overridden = overrideScoreForMidTermGoal('p1', 'executeMission', holdResult)
    expect(overridden.score).toBe(0.4)
  })

  it('getSaveMoneyTarget 回傳目標額', () => {
    applyMidTermGoalInputs('p1', 0, 0.8, true, 'base-1')
    expect(getSaveMoneyTarget('p1')).toBe(SAVE_MONEY_TARGET)
  })
})