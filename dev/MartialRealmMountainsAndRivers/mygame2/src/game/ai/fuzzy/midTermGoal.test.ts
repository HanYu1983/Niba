import { describe, it, expect, beforeEach } from 'vitest'
import { applyMidTermGoalInputs, overrideScoreForMidTermGoal, clearMidTermGoals, isSavingMoney, getSaveMoneyTarget, SAVE_MONEY_TARGET, SAVE_MONEY_TRIGGER, applyKillGoalInputs, isKilling, getKillTargetId, KILL_DAMAGE_RATIO, type KillCandidate } from './midTermGoal'
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

const killAgentResult: GoalResult = {
  score: 0.4,
  target: { kind: 'attack', targetId: 'creature-9', targetType: 'creature', position: { row: 3, column: 3 } },
  actions: [{ type: 'move', actor: { id: 'p1', kind: 'player' }, destination: { row: 2, column: 3 }, reason: '追擊' }],
}

const otherKillResult: GoalResult = {
  score: 0.4,
  target: { kind: 'attack', targetId: 'creature-999', targetType: 'creature', position: { row: 3, column: 3 } },
  actions: [{ type: 'move', actor: { id: 'p1', kind: 'player' }, destination: { row: 2, column: 3 }, reason: '追擊' }],
}

function killCandidate(overrides: Partial<KillCandidate>): KillCandidate {
  return {
    targetId: 'creature-9',
    targetType: 'creature',
    distance: 3,
    damageRatio: 0.8,
    canSurvive: true,
    ...overrides,
  }
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

describe('midTermGoal 擊殺目標', () => {
  beforeEach(() => {
    clearMidTermGoals()
  })

  it('有可殺獵物 → 鎖定擊殺', () => {
    const goal = applyKillGoalInputs('p1', [killCandidate({})], 0.8)
    expect(goal?.type).toBe('kill')
    expect(isKilling('p1')).toBe(true)
    expect(getKillTargetId('p1')).toBe('creature-9')
  })

  it('無可殺獵物 → 不鎖定', () => {
    const goal = applyKillGoalInputs('p1', [killCandidate({ damageRatio: 0.1 })], 0.8)
    expect(goal).toBeUndefined()
    expect(isKilling('p1')).toBe(false)
  })

  it('獵物距離太遠 → 不鎖定', () => {
    const goal = applyKillGoalInputs('p1', [killCandidate({ distance: 99 })], 0.8)
    expect(goal).toBeUndefined()
  })

  it('鍛住不死 → 鎖定觸發仍需 damageRatio ≥ 門檻', () => {
    const goal = applyKillGoalInputs('p1', [killCandidate({ damageRatio: KILL_DAMAGE_RATIO - 0.01 })], 0.8)
    expect(goal).toBeUndefined()
  })

  it('鎖定中目標死亡（不可見）→ 解除', () => {
    applyKillGoalInputs('p1', [killCandidate({})], 0.8)
    expect(isKilling('p1')).toBe(true)
    // 下一次呼叫，候選清單不再含該目標
    applyKillGoalInputs('p1', [killCandidate({ targetId: 'creature-other' })], 0.8)
    expect(getKillTargetId('p1')).toBe('creature-other')
  })

  it('鎖定中身法扛不住 → 解除', () => {
    applyKillGoalInputs('p1', [killCandidate({})], 0.8)
    expect(isKilling('p1')).toBe(true)
    applyKillGoalInputs('p1', [killCandidate({})], 0.05)
    expect(isKilling('p1')).toBe(false)
  })

  it('鎖定時把對應 engageCombat 抬到 1.0', () => {
    applyKillGoalInputs('p1', [killCandidate({})], 0.8)
    const overridden = overrideScoreForMidTermGoal('p1', 'engageCombat', killAgentResult)
    expect(overridden.score).toBe(1.0)
  })

  it('鎖定時不影響打其他目標的 engageCombat', () => {
    applyKillGoalInputs('p1', [killCandidate({})], 0.8)
    const overridden = overrideScoreForMidTermGoal('p1', 'engageCombat', otherKillResult)
    expect(overridden.score).toBe(0.4)
  })
})