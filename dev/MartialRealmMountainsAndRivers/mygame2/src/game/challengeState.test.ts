import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  getChallengeState,
  recordChallengeVictory,
  resetChallengeState,
} from './challengeState'

function stubLocalStorage() {
  const store = new Map<string, string>()
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => (store.has(key) ? store.get(key) ?? null : null),
    setItem: (key: string, value: string) => { store.set(key, value) },
    removeItem: (key: string) => { store.delete(key) },
  })
}

describe('challengeState', () => {
  beforeEach(() => {
    stubLocalStorage()
  })

  it('無存檔時回傳預設值 { level: 1, highestLevel: 0, totalClears: 0 }', () => {
    expect(getChallengeState()).toEqual({ level: 1, highestLevel: 0, totalClears: 0 })
  })

  it('recordChallengeVictory 每次 +1 等級並同步歷史最高與通關次數', () => {
    recordChallengeVictory()
    expect(getChallengeState()).toEqual({ level: 2, highestLevel: 2, totalClears: 1 })

    recordChallengeVictory()
    recordChallengeVictory()
    expect(getChallengeState()).toEqual({ level: 4, highestLevel: 4, totalClears: 3 })
  })

  it('highestLevel 取歷史最大值（不因重置而下降）', () => {
    recordChallengeVictory()
    recordChallengeVictory()
    recordChallengeVictory()
    // 模擬玩家手動把等級調低（除錯情境）：直接寫入較低 level。
    localStorage.setItem('mygame2.challenge-state', JSON.stringify({ level: 2, highestLevel: 4, totalClears: 3 }))
    recordChallengeVictory()
    expect(getChallengeState()).toEqual({ level: 3, highestLevel: 4, totalClears: 4 })
  })

  it('resetChallengeState 重置為初始值', () => {
    recordChallengeVictory()
    recordChallengeVictory()
    resetChallengeState()
    expect(getChallengeState()).toEqual({ level: 1, highestLevel: 0, totalClears: 0 })
  })

  it('損壞的存檔回退為預設值', () => {
    localStorage.setItem('mygame2.challenge-state', 'not-json')
    expect(getChallengeState()).toEqual({ level: 1, highestLevel: 0, totalClears: 0 })

    localStorage.setItem('mygame2.challenge-state', JSON.stringify({ level: 'x' }))
    expect(getChallengeState()).toEqual({ level: 1, highestLevel: 0, totalClears: 0 })
  })
})
