import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AI_TURN_STEP_DELAY_MS, createAiTurnScheduler, type AiTurnSchedulerDeps } from './aiTurnScheduler'

describe('aiTurnScheduler', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  function createDeps(overrides: Partial<AiTurnSchedulerDeps> = {}) {
    const calls = {
      defenseSteps: [] as string[],
      supportSteps: [] as string[],
      constructionSteps: [] as string[],
      endedTurns: [] as string[],
    }
    const deps: AiTurnSchedulerDeps = {
      getState: () => ({ activePlayerId: 'p1' }),
      runDefenseStep: (actorId) => {
        calls.defenseSteps.push(actorId)
        return { ok: true }
      },
      runSupportStep: (actorId) => {
        calls.supportSteps.push(actorId)
        return { ok: true }
      },
      runConstructionStep: (actorId) => {
        calls.constructionSteps.push(actorId)
        return { ok: true }
      },
      endTurn: (actorId) => {
        calls.endedTurns.push(actorId)
      },
      ...overrides,
    }
    return { calls, deps }
  }

  it('延遲 AI_TURN_STEP_DELAY_MS 後為防守訂單執行一步', () => {
    const { calls, deps } = createDeps()
    const scheduler = createAiTurnScheduler(deps)

    scheduler.requestStep('p1', 'protect-base')
    expect(calls.defenseSteps).toEqual([])

    vi.advanceTimersByTime(AI_TURN_STEP_DELAY_MS - 1)
    expect(calls.defenseSteps).toEqual([])

    vi.advanceTimersByTime(1)
    expect(calls.defenseSteps).toEqual(['p1'])
    expect(scheduler.isPending()).toBe(false)
  })

  it('支援訂單走支援步驟', () => {
    const { calls, deps } = createDeps()
    const scheduler = createAiTurnScheduler(deps)

    scheduler.requestStep('p1', 'support-player')
    vi.advanceTimersByTime(AI_TURN_STEP_DELAY_MS)

    expect(calls.supportSteps).toEqual(['p1'])
    expect(calls.defenseSteps).toEqual([])
  })

  it('建設步驟走建設 AI', () => {
    const { calls, deps } = createDeps()
    const scheduler = createAiTurnScheduler(deps)

    scheduler.requestStep('p1', 'construction')
    vi.advanceTimersByTime(AI_TURN_STEP_DELAY_MS)

    expect(calls.constructionSteps).toEqual(['p1'])
    expect(calls.defenseSteps).toEqual([])
    expect(scheduler.isPending()).toBe(false)
  })

  it('cancel 之後不得執行 stale timer', () => {
    const { calls, deps } = createDeps()
    const scheduler = createAiTurnScheduler(deps)

    scheduler.requestStep('p1', 'protect-base')
    scheduler.cancel()
    vi.advanceTimersByTime(AI_TURN_STEP_DELAY_MS * 2)

    expect(calls.defenseSteps).toEqual([])
    expect(calls.supportSteps).toEqual([])
    expect(calls.endedTurns).toEqual([])
  })

  it('同一 Actor 重複請求不重入：只保留一個計時器，不重置也不重複執行', () => {
    const { calls, deps } = createDeps()
    const scheduler = createAiTurnScheduler(deps)

    scheduler.requestStep('p1', 'protect-base')
    // 第二次請求應為冪等操作：不新增計時器。
    scheduler.requestStep('p1', 'protect-base')
    vi.advanceTimersByTime(AI_TURN_STEP_DELAY_MS - 50)
    // 未重置計時：原計時器即將觸發。
    vi.advanceTimersByTime(50)
    expect(calls.defenseSteps).toEqual(['p1'])
    // 冪等期間殘留的重複計時器不存在：再推進也不會重跑。
    vi.advanceTimersByTime(AI_TURN_STEP_DELAY_MS * 3)
    expect(calls.defenseSteps).toEqual(['p1'])
  })

  it('換 Actor 時取消前一個待執行 step', () => {
    const { calls, deps } = createDeps({ getState: () => ({ activePlayerId: 'p2' }) })
    const scheduler = createAiTurnScheduler(deps)

    scheduler.requestStep('p1', 'protect-base')
    scheduler.requestStep('p2', 'protect-base')
    vi.advanceTimersByTime(AI_TURN_STEP_DELAY_MS)

    expect(calls.defenseSteps).toEqual(['p2'])
  })

  it('step 失敗且 Actor 仍是當前玩家時結束其回合', () => {
    const { calls, deps } = createDeps({
      runDefenseStep: () => ({ ok: false }),
    })
    const scheduler = createAiTurnScheduler(deps)

    scheduler.requestStep('p1', 'protect-base')
    vi.advanceTimersByTime(AI_TURN_STEP_DELAY_MS)

    expect(calls.endedTurns).toEqual(['p1'])
  })

  it('step 失敗但回合已換人時不誤結束新玩家的回合', () => {
    let activeId = 'p1'
    const { calls, deps } = createDeps({
      getState: () => ({ activePlayerId: activeId }),
      runSupportStep: () => ({ ok: false }),
    })
    const scheduler = createAiTurnScheduler(deps)

    scheduler.requestStep('p1', 'support-player')
    activeId = 'p9' // 計時器觸發前回合已換人。
    vi.advanceTimersByTime(AI_TURN_STEP_DELAY_MS)

    expect(calls.supportSteps).toEqual([]) // stale 防護：直接不執行。
    expect(calls.endedTurns).toEqual([])
  })
})
