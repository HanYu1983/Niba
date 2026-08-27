import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getGameSaveSlots, loadGameState, loadGameStateFromSlot, saveGameState, saveGameStateToSlot } from './gameSave'
import { markRunSettled } from './settledRuns'
import type { GameState } from './types'

const state = { round: 7 } as GameState

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
})