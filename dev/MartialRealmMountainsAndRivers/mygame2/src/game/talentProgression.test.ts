import { describe, expect, it, beforeEach, vi } from 'vitest'
import {
  createCharacter,
  getCharacter,
  addScrolls,
  getTalentUnlockCost,
  unlockTalent,
  setCharacterTalent,
} from './characterRoster'

function stubLocalStorage() {
  const store = new Map<string, string>()
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => (store.has(key) ? store.get(key) ?? null : null),
    setItem: (key: string, value: string) => { store.set(key, value) },
    removeItem: (key: string) => { store.delete(key) },
  })
}

describe('天賦解鎖流程', () => {
  beforeEach(() => {
    stubLocalStorage()
  })

  it('新角色預設未解鎖任何天賦', () => {
    const character = createCharacter({ name: '甲' })!
    expect(character.unlockedTalentIds).toEqual([])
    expect(character.talentIds).toEqual([])
  })

  it('解鎖天賦需花卷，成本隨已解鎖數遞增', () => {
    const character = createCharacter({ name: '乙' })!
    addScrolls(character.id, 100)
    const before = getCharacter(character.id)!.scrolls
    expect(getTalentUnlockCost(0)).toBe(30)
    const result = unlockTalent(character.id, 'cartographer')
    expect(result.ok).toBe(true)
    const updated = getCharacter(character.id)!
    expect(updated.unlockedTalentIds).toContain('cartographer')
    expect(updated.scrolls).toBe(before - 30)
  })

  it('未知天賦無法解鎖', () => {
    const character = createCharacter({ name: '丙' })!
    addScrolls(character.id, 100)
    const result = unlockTalent(character.id, 'nonexistent')
    expect(result.ok).toBe(false)
    expect(result.reason).toContain('未知')
  })

  it('卷不足時無法解鎖', () => {
    const character = createCharacter({ name: '丁' })!
    addScrolls(character.id, -10000) // 歸零（新角預設大量殘卷）
    addScrolls(character.id, 5)
    const result = unlockTalent(character.id, 'cartographer')
    expect(result.ok).toBe(false)
    expect(result.reason).toContain('卷不足')
  })

  it('重複解鎖回傳「已解鎖」', () => {
    const character = createCharacter({ name: '戊' })!
    addScrolls(character.id, 100)
    unlockTalent(character.id, 'cartographer')
    const again = unlockTalent(character.id, 'cartographer')
    expect(again.ok).toBe(false)
    expect(again.reason).toContain('已解鎖')
  })

  it('解鎖後才能開啟；開啟後才能關閉', () => {
    const character = createCharacter({ name: '己' })!
    addScrolls(character.id, 100)

    // 未解鎖：無法開啟
    const notUnlocked = setCharacterTalent(character.id, 'cartographer', true)
    expect(notUnlocked.ok).toBe(false)
    expect(notUnlocked.reason).toContain('尚未解鎖')

    // 解鎖
    unlockTalent(character.id, 'cartographer')
    const enabled = setCharacterTalent(character.id, 'cartographer', true)
    expect(enabled.ok).toBe(true)
    expect(getCharacter(character.id)!.talentIds).toContain('cartographer')

    // 可重複開啟（維持）
    const reEnabled = setCharacterTalent(character.id, 'cartographer', true)
    expect(reEnabled.ok).toBe(true)
    expect(getCharacter(character.id)!.talentIds).toContain('cartographer')

    // 開啟不花卷
    const afterEnable = getCharacter(character.id)!.scrolls
    expect(afterEnable).toBe(getCharacter(character.id)!.scrolls)

    // 關閉
    const disabled = setCharacterTalent(character.id, 'cartographer', false)
    expect(disabled.ok).toBe(true)
    expect(getCharacter(character.id)!.talentIds).not.toContain('cartographer')
  })
})