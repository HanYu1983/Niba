import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getGameSaveSlots, loadGameState, loadGameStateFromSlot, saveGameState, saveGameStateToSlot } from './gameSave'
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
})