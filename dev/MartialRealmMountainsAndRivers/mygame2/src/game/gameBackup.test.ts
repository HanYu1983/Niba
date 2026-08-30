import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createGameBackup, parseGameBackup, restoreGameBackup, type GameBackupPayload } from './gameBackup'

describe('gameBackup', () => {
  beforeEach(() => {
    const values = new Map<string, string>()
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => { values.set(key, value) },
      removeItem: (key: string) => { values.delete(key) },
      key: (index: number) => Array.from(values.keys())[index] ?? null,
      get length() { return values.size },
    })
  })

  it('匯出涵蓋所有 mygame2. 前綴 key，且不含其他網站資料', () => {
    localStorage.setItem('mygame2.game-save', '{"a":1}')
    localStorage.setItem('mygame2.game-save.slot.0', '{"b":2}')
    localStorage.setItem('other-site.data', '{"c":3}')
    const backup = createGameBackup()
    expect(backup).not.toBeNull()
    expect(Object.keys(backup!.entries)).toEqual(['mygame2.game-save', 'mygame2.game-save.slot.0'])
  })

  it('還原時僅還原本遊戲前綴的 key，忽略其他網站資料', () => {
    const payload: GameBackupPayload = {
      backupVersion: 1,
      exportedAt: new Date().toISOString(),
      game: 'mygame2',
      entries: {
        'mygame2.game-save': '{"x":1}',
        'other-site.data': '{"y":2}',
      },
    }
    const restored = restoreGameBackup(payload)
    expect(restored).toBe(1)
    expect(localStorage.getItem('mygame2.game-save')).toBe('{"x":1}')
    expect(localStorage.getItem('other-site.data')).toBeNull()
  })

  it('單一 key 寫入失敗（QuotaExceeded）不中斷其餘還原', () => {
    const failingKey = 'mygame2.game-save.slot.0'
    const originalSetItem = localStorage.setItem
    localStorage.setItem = (key: string, value: string) => {
      if (key === failingKey) throw new Error('QuotaExceededError')
      originalSetItem(key, value)
    }
    const payload: GameBackupPayload = {
      backupVersion: 1,
      exportedAt: new Date().toISOString(),
      game: 'mygame2',
      entries: {
        [failingKey]: '{"a":1}',
        'mygame2.game-save': '{"b":2}',
      },
    }
    const restored = restoreGameBackup(payload)
    // 失敗的 key 不計入，其餘成功
    expect(restored).toBe(1)
    expect(localStorage.getItem('mygame2.game-save')).toBe('{"b":2}')
    expect(localStorage.getItem(failingKey)).toBeNull()
  })

  it('parseGameBackup 拒絕非本遊戲或版本不符的備份', () => {
    expect(parseGameBackup(JSON.stringify({ game: 'other', backupVersion: 1, entries: {} })).ok).toBe(false)
    expect(parseGameBackup(JSON.stringify({ game: 'mygame2', backupVersion: 99, entries: {} })).ok).toBe(false)
    expect(parseGameBackup(JSON.stringify({ game: 'mygame2', backupVersion: 1, entries: {} })).ok).toBe(true)
  })
})