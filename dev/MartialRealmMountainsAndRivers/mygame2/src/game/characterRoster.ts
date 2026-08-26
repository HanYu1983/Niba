/**
 * 俠客名冊（Character Roster Storage）。
 *
 * 跨對局持久化的角色庫：玩家可建立、保存、修改與刪除多個自有角色。
 * 每個角色為「模板」，對局是「遊玩實例」；本階段僅含基本參數與五維設定，
 * 卷系統（scrolls）、功法庫（learnedSkillIds）等養成欄位留待後續階段。
 *
 * 儲存於 localStorage，獨立於單局存檔（gameSave.ts），與 campaignClearance.ts 同模式。
 */

import type { PlayerAttributes } from './types'

/** 名冊版本：用於未來欄位演進的相容處理。 */
export const CHARACTER_ROSTER_VERSION = 1
export const CHARACTER_ROSTER_STORAGE_KEY = 'mygame2.character-roster'

/** 五維預設值（全 0，代表無永久加成）。 */
export const DEFAULT_ATTRIBUTE_BONUSES: PlayerAttributes = {
  armStrength: 0,
  constitution: 0,
  agility: 0,
  innerEnergy: 0,
  insight: 0,
}

/** 跨對局持久角色（名册實體）。 */
export type PersistentCharacter = {
  id: string
  name: string
  /** 外觀 icon／稱號（輕量，不影響數值）。 */
  portrait?: string
  title?: string
  /** 永久五維加成，開局疊加進 createCharacterState 的 baseAttributes。 */
  attributeBonuses: PlayerAttributes
  /** 養成統計。 */
  gamesPlayed: number
  createdAt: number
}

type RosterPayload = {
  version: number
  characters: PersistentCharacter[]
}

function getStored(): PersistentCharacter[] {
  if (typeof localStorage === 'undefined') return []
  try {
    const raw = localStorage.getItem(CHARACTER_ROSTER_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as Partial<RosterPayload>
    if (!parsed || !Array.isArray(parsed.characters)) return []
    return parsed.characters
  } catch {
    return []
  }
}

function persist(characters: PersistentCharacter[]) {
  if (typeof localStorage === 'undefined') return
  const payload: RosterPayload = { version: CHARACTER_ROSTER_VERSION, characters }
  localStorage.setItem(CHARACTER_ROSTER_STORAGE_KEY, JSON.stringify(payload))
}

/** 產生唯一 id（時間戳 + 隨機片段）。 */
function generateId(): string {
  return `char-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

/** 讀取所有名册角色。 */
export function getCharacters(): PersistentCharacter[] {
  return getStored()
}

/** 依 id 查詢單一角色；不存在回傳 undefined。 */
export function getCharacter(id: string): PersistentCharacter | undefined {
  return getStored().find((character) => character.id === id)
}

/** 檢查名稱是否已被使用（排除指定 id，用於改名時）。 */
export function isCharacterNameTaken(name: string, excludeId?: string): boolean {
  const trimmed = name.trim()
  if (!trimmed) return false
  return getStored().some((character) => character.name === trimmed && character.id !== excludeId)
}

/** 建立新角色並回傳；名稱重複或空白時回傳 null。 */
export function createCharacter(input: {
  name: string
  portrait?: string
  title?: string
  attributeBonuses?: Partial<PlayerAttributes>
}): PersistentCharacter | null {
  const name = input.name.trim()
  if (!name || isCharacterNameTaken(name)) return null

  const character: PersistentCharacter = {
    id: generateId(),
    name,
    portrait: input.portrait,
    title: input.title,
    attributeBonuses: { ...DEFAULT_ATTRIBUTE_BONUSES, ...input.attributeBonuses },
    gamesPlayed: 0,
    createdAt: Date.now(),
  }

  persist([...getStored(), character])
  return character
}

/** 更新角色基本資料（名稱／外觀／稱號／五維加成）。名稱重複或空白時回傳 false。 */
export function updateCharacter(
  id: string,
  patch: {
    name?: string
    portrait?: string
    title?: string
    attributeBonuses?: Partial<PlayerAttributes>
  },
): boolean {
  const characters = getStored()
  const index = characters.findIndex((character) => character.id === id)
  if (index < 0) return false

  const current = characters[index]
  const nextName = patch.name !== undefined ? patch.name.trim() : current.name
  if (!nextName || isCharacterNameTaken(nextName, id)) return false

  const updated: PersistentCharacter = {
    ...current,
    name: nextName,
    portrait: patch.portrait !== undefined ? patch.portrait : current.portrait,
    title: patch.title !== undefined ? patch.title : current.title,
    attributeBonuses: patch.attributeBonuses
      ? { ...current.attributeBonuses, ...patch.attributeBonuses }
      : current.attributeBonuses,
  }

  const next = [...characters]
  next[index] = updated
  persist(next)
  return true
}

/** 刪除角色；不存在回傳 false。 */
export function deleteCharacter(id: string): boolean {
  const characters = getStored()
  const next = characters.filter((character) => character.id !== id)
  if (next.length === characters.length) return false
  persist(next)
  return true
}
