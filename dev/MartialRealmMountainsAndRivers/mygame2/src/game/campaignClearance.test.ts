import { describe, expect, it, beforeEach, vi } from 'vitest'
import {
  getScenarioClearances,
  getScenarioCleared,
  recordScenarioClearance,
  clearScenarioClearance,
} from './campaignClearance'

function stubLocalStorage() {
  const store = new Map<string, string>()
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => (store.has(key) ? store.get(key) ?? null : null),
    setItem: (key: string, value: string) => { store.set(key, value) },
    removeItem: (key: string) => { store.delete(key) },
  })
}

describe('campaignClearance', () => {
  beforeEach(() => {
    stubLocalStorage()
  })

  it('預設無通關紀錄', () => {
    expect(getScenarioClearances()).toEqual({})
    expect(getScenarioCleared('prologue-village')).toBeUndefined()
  })

  it('記錄通關成功後可讀取', () => {
    recordScenarioClearance('prologue-village', true)
    expect(getScenarioCleared('prologue-village')).toBe(true)
    expect(getScenarioClearances()['prologue-village']).toBe(true)
  })

  it('記錄失敗狀態為 false', () => {
    recordScenarioClearance('prologue-village', false)
    expect(getScenarioCleared('prologue-village')).toBe(false)
  })

  it('可清除單一劇本的通關紀錄', () => {
    recordScenarioClearance('prologue-village', true)
    clearScenarioClearance('prologue-village')
    expect(getScenarioCleared('prologue-village')).toBeUndefined()
  })

  it('空 id 不寫入', () => {
    recordScenarioClearance('', true)
    expect(getScenarioClearances()).toEqual({})
  })
})