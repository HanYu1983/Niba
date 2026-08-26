import { describe, expect, it, beforeEach, vi } from 'vitest'
import {
  getCharacters,
  getCharacter,
  createCharacter,
  updateCharacter,
  deleteCharacter,
  isCharacterNameTaken,
  DEFAULT_ATTRIBUTE_BONUSES,
} from './characterRoster'

function stubLocalStorage() {
  const store = new Map<string, string>()
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => (store.has(key) ? store.get(key) ?? null : null),
    setItem: (key: string, value: string) => { store.set(key, value) },
    removeItem: (key: string) => { store.delete(key) },
  })
}

describe('characterRoster', () => {
  beforeEach(() => {
    stubLocalStorage()
  })

  it('預設名册為空', () => {
    expect(getCharacters()).toEqual([])
    expect(getCharacter('any')).toBeUndefined()
  })

  it('建立角色後可讀取，五維加成預設全 0', () => {
    const character = createCharacter({ name: '張三' })
    expect(character).not.toBeNull()
    expect(character!.name).toBe('張三')
    expect(character!.attributeBonuses).toEqual(DEFAULT_ATTRIBUTE_BONUSES)
    expect(character!.gamesPlayed).toBe(0)
    expect(getCharacters()).toHaveLength(1)
    expect(getCharacter(character!.id)?.name).toBe('張三')
  })

  it('建立角色可帶入五維加成與外觀', () => {
    const character = createCharacter({
      name: '李四',
      portrait: 'sword',
      title: '劍客',
      attributeBonuses: { armStrength: 2, agility: 1 },
    })
    expect(character!.portrait).toBe('sword')
    expect(character!.title).toBe('劍客')
    expect(character!.attributeBonuses.armStrength).toBe(2)
    expect(character!.attributeBonuses.agility).toBe(1)
    expect(character!.attributeBonuses.constitution).toBe(0)
  })

  it('空白名稱或重複名稱不建立', () => {
    expect(createCharacter({ name: '   ' })).toBeNull()
    createCharacter({ name: '王五' })
    expect(createCharacter({ name: '王五' })).toBeNull()
    expect(getCharacters()).toHaveLength(1)
  })

  it('可更新名稱、外觀與五維加成', () => {
    const character = createCharacter({ name: '趙六' })!
    const ok = updateCharacter(character.id, {
      name: '趙六改',
      title: '大俠',
      attributeBonuses: { insight: 3 },
    })
    expect(ok).toBe(true)
    const updated = getCharacter(character.id)!
    expect(updated.name).toBe('趙六改')
    expect(updated.title).toBe('大俠')
    expect(updated.attributeBonuses.insight).toBe(3)
  })

  it('改名為重複名稱時失敗且不變更', () => {
    const a = createCharacter({ name: '甲' })!
    createCharacter({ name: '乙' })
    expect(updateCharacter(a.id, { name: '乙' })).toBe(false)
    expect(getCharacter(a.id)!.name).toBe('甲')
  })

  it('更新不存在的角色回傳 false', () => {
    expect(updateCharacter('missing', { name: 'x' })).toBe(false)
  })

  it('可刪除角色', () => {
    const character = createCharacter({ name: '丙' })!
    expect(deleteCharacter(character.id)).toBe(true)
    expect(getCharacters()).toHaveLength(0)
    expect(deleteCharacter(character.id)).toBe(false)
  })

  it('isCharacterNameTaken 排除自身 id', () => {
    const character = createCharacter({ name: '丁' })!
    expect(isCharacterNameTaken('丁')).toBe(true)
    expect(isCharacterNameTaken('丁', character.id)).toBe(false)
  })
})
