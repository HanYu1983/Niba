import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getGameSaveSlots, loadGameState, loadGameStateFromSlot, saveGameState, saveGameStateToSlot, scheduleAutoSave, flushAutoSave } from './gameSave'
import { markRunSettled } from './settledRuns'
import type { GameState } from './types'

const state = { round: 7 } as GameState

/** 寫入一筆原始存檔 payload 到指定 key（模擬惡意/損壞存檔）。 */
function seedRawSave(key: string, payload: unknown): void {
  const raw = JSON.stringify({ version: 1, savedAt: new Date().toISOString(), state: payload })
  localStorage.setItem(key, raw)
}

describe('gameSave', () => {
  beforeEach(() => {
    const values = new Map<string, string>()
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, next: string) => { values.set(key, next) },
      removeItem: (key: string) => { values.delete(key) },
    })
  })

  it('可以儲存並讀取遊戲狀態', () => {
    expect(saveGameState(state).ok).toBe(true)
    const result = loadGameState()
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.state.round).toBe(7)
  })

  it('可以隨遊戲狀態保存與讀取 AI 命令及建設計畫', () => {
    const stateWithAiData = {
      ...state,
      aiOrders: [{
        id: 'order-1',
        type: 'protect-base' as const,
        aiPlayerId: 'ai-1',
        baseId: 'base-1',
        radius: 6,
        priority: 80,
        retreatHealthPercent: 30,
        status: 'active' as const,
      }],
      aiConstructionPlans: [{
        aiPlayerId: 'ai-1',
        baseId: 'base-1',
        policy: 'defense' as const,
        allowUpgrade: true,
        queue: [],
      }],
    }
    expect(saveGameState(stateWithAiData).ok).toBe(true)
    const result = loadGameState()
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.state.aiOrders).toEqual(stateWithAiData.aiOrders)
      expect(result.state.aiConstructionPlans).toEqual(stateWithAiData.aiConstructionPlans)
    }
  })

  it('沒有存檔時回傳原因', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => null,
      setItem: () => undefined,
      removeItem: () => undefined,
    })
    const result = loadGameState()
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.reason).toContain('沒有')
  })

  it('提供自動存檔與十個手動存檔欄位並可獨立儲存與讀取', () => {
    expect(getGameSaveSlots()).toHaveLength(11)
    expect(saveGameStateToSlot(state, 0).ok).toBe(true)
    expect(loadGameStateFromSlot(0)).toMatchObject({ ok: true, state: { round: 7 } })
    expect(saveGameStateToSlot(state, 3).ok).toBe(true)
    expect(loadGameStateFromSlot(3)).toMatchObject({ ok: true, state: { round: 7 } })
    expect(loadGameStateFromSlot(2).ok).toBe(false)
  })

  it('摘要三態判定：runId 已登記為 settled、局末未登記為 pending、進行中為 in-progress', () => {
    const store = new Map<string, string>()
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => (store.has(key) ? store.get(key) ?? null : null),
      setItem: (key: string, value: string) => { store.set(key, value) },
      removeItem: (key: string) => { store.delete(key) },
    })
    // slot 1：有 runId、已登記 → settled
    saveGameStateToSlot({ ...state, runId: 'run-a' } as GameState, 1)
    markRunSettled('run-a')
    // slot 2：有 runId、局末未登記 → pending
    saveGameStateToSlot({ ...state, runId: 'run-b', gameWon: true } as GameState, 2)
    // slot 3：有 runId、進行中 → in-progress
    saveGameStateToSlot({ ...state, runId: 'run-c' } as GameState, 3)
    // slot 4：無 runId（舊存檔）、局末 → settled（退回推斷）
    saveGameStateToSlot({ ...state, gameOver: true } as GameState, 4)
    // slot 5：無 runId、非局末 → in-progress
    saveGameStateToSlot(state, 5)

    const slots = getGameSaveSlots()
    expect(slots.find((entry) => entry.slot === 1)?.rewardStatus).toBe('settled')
    expect(slots.find((entry) => entry.slot === 2)?.rewardStatus).toBe('pending')
    expect(slots.find((entry) => entry.slot === 3)?.rewardStatus).toBe('in-progress')
    expect(slots.find((entry) => entry.slot === 4)?.rewardStatus).toBe('settled')
    expect(slots.find((entry) => entry.slot === 5)?.rewardStatus).toBe('in-progress')
  })

  it('惡意存檔（players 為字串）讀取時回傳失敗，不會白屏', () => {
    seedRawSave('mygame2.game-save', { players: 'x', round: 1 })
    const result = loadGameState()
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.reason).toContain('玩家')
  })

  it('惡意存檔（map.cells 為 null）讀取時回傳失敗，不會白屏', () => {
    seedRawSave('mygame2.game-save', { map: { rows: 10, columns: 10, cells: null }, round: 1 })
    const result = loadGameState()
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.reason).toContain('地圖')
  })

  it('惡意存檔（map 為字串）讀取時回傳失敗，不會白屏', () => {
    seedRawSave('mygame2.game-save', { map: 'x', round: 1 })
    const result = loadGameState()
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.reason).toContain('地圖')
  })

  it('惡意存檔（玩家缺 position）讀取時回傳失敗，不會白屏', () => {
    seedRawSave('mygame2.game-save', { players: [{ id: 'p1' }], round: 1 })
    const result = loadGameState()
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.reason).toContain('玩家')
  })

  it('惡意存檔（slot 版）讀取時回傳失敗，不會白屏', () => {
    seedRawSave('mygame2.game-save.slot.1', { players: 'x', round: 1 })
    const result = loadGameStateFromSlot(1)
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.reason).toContain('玩家')
  })

  it('自動存檔 debounce：延遲後寫入最新快照，多次呼叫只保留最後一份', () => {
    vi.useFakeTimers()
    const store = new Map<string, string>()
    localStorage.setItem = (key: string, value: string) => { store.set(key, value) }
    localStorage.getItem = (key: string) => store.get(key) ?? null
    try {
      scheduleAutoSave({ round: 1 } as GameState)
      scheduleAutoSave({ round: 2 } as GameState)
      scheduleAutoSave({ round: 3 } as GameState)
      // 未到延遲：尚未寫入
      expect(store.size).toBe(0)
      vi.advanceTimersByTime(500)
      // 僅寫入最後一份（round 3）
      expect(store.size).toBe(1)
      const payload = JSON.parse(store.get('mygame2.game-save.slot.0') ?? '{}') as { state: { round: number } }
      expect(payload.state.round).toBe(3)
    } finally {
      vi.useRealTimers()
    }
  })

  it('自動存檔 debounce：flushAutoSave 立即寫入尚未觸發的快照', () => {
    vi.useFakeTimers()
    const store = new Map<string, string>()
    localStorage.setItem = (key: string, value: string) => { store.set(key, value) }
    localStorage.getItem = (key: string) => store.get(key) ?? null
    try {
      scheduleAutoSave({ round: 5 } as GameState)
      flushAutoSave()
      expect(store.size).toBe(1)
      vi.advanceTimersByTime(500)
      // flush 後 timer 已清除，不會重複寫入
      expect(store.size).toBe(1)
    } finally {
      vi.useRealTimers()
    }
  })
})