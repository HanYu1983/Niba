import { beforeEach, describe, expect, it, vi } from 'vitest'
import { isRunSettled, markRunSettled, generateRunId, MAX_SETTLED_RUNS } from './settledRuns'

describe('settledRuns（已結算局登記表）', () => {
  let store: Map<string, string>

  beforeEach(() => {
    store = new Map()
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => (store.has(key) ? store.get(key) ?? null : null),
      setItem: (key: string, value: string) => { store.set(key, value) },
      removeItem: (key: string) => { store.delete(key) },
    })
  })

  it('未登記的 runId 回傳 false', () => {
    expect(isRunSettled('run-x')).toBe(false)
  })

  it('markRunSettled 後可查詢為已結算', () => {
    markRunSettled('run-a')
    expect(isRunSettled('run-a')).toBe(true)
    expect(isRunSettled('run-b')).toBe(false)
  })

  it('markRunSettled 冪等：重複標記不重複儲存', () => {
    markRunSettled('run-a')
    markRunSettled('run-a')
    const payload = JSON.parse(store.get('mygame2.settled-runs')!) as { runIds: string[] }
    expect(payload.runIds).toEqual(['run-a'])
  })

  it('空字串不登記也不視為已結算', () => {
    markRunSettled('')
    expect(isRunSettled('')).toBe(false)
    expect(store.has('mygame2.settled-runs')).toBe(false)
  })

  it('超過上限時淘汰最舊者', () => {
    for (let index = 0; index < MAX_SETTLED_RUNS + 10; index += 1) {
      markRunSettled(`run-${index}`)
    }
    expect(isRunSettled('run-0')).toBe(false)
    expect(isRunSettled(`run-${MAX_SETTLED_RUNS + 9}`)).toBe(true)
    const payload = JSON.parse(store.get('mygame2.settled-runs')!) as { runIds: string[] }
    expect(payload.runIds).toHaveLength(MAX_SETTLED_RUNS)
  })

  it('generateRunId 產生唯一且格式正確的 id', () => {
    const first = generateRunId()
    const second = generateRunId()
    expect(first).toMatch(/^run-[a-z0-9]+-[a-z0-9]{2,8}$/)
    expect(first).not.toBe(second)
  })
})
