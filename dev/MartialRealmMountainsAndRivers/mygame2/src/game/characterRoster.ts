/**
 * 俠客名冊（Character Roster Storage）。
 *
 * 跨對局持久化的角色庫：玩家可建立、保存、修改與刪除多個自有角色。
 * 每個角色為「模板」，對局是「遊玩實例」；局末依表現結算武學殘卷（scrolls）
 * 並回寫功法庫（learnedSkillIds）。
 *
 * 儲存於 localStorage，獨立於單局存檔（gameSave.ts），與 campaignClearance.ts 同模式。
 */

import type { PlayerAttributes, RunStats } from './types'
import { getTalent } from './catalogs/talentCatalog'

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
  /** 累積武學殘卷（單一貨幣）。 */
  scrolls: number
  /** 可培養功法：遊戲中獲得過的技能 id（內功＋外功），尚未花卷學習。 */
  unlockedSkillIds: string[]
  /** 已學習功法：花卷學會的技能 id（內功＋外功），限 unlockedSkillIds 內。 */
  learnedSkillIds: string[]
  /** 用卷開啟（設為開局攜帶）的外功（限 learnedSkillIds 內）。 */
  initialExternalSkillIds: string[]
  /** 開局內功（預設 'tuna-gong'，可為庫內其他內功）。 */
  initialInternalSkillId: string
  /** 已花卷解鎖的天賦 ids（可多個；解鎖後才能開啟，見 catalogs/talentCatalog）。 */
  unlockedTalentIds: string[]
  /** 已開啟（啟用）的天賦 ids（限 unlockedTalentIds 內；開局注入為常駐效果）。 */
  talentIds: string[]
  /** 養成統計。 */
  gamesPlayed: number
  createdAt: number
}

/** 新角色預設已解鎖的內功（吐納功）。 */
export const DEFAULT_LEARNED_INNER_SKILL_ID = 'tuna-gong'

/** 新角色預設已解鎖的可培養外功（破空掌）。 */
export const DEFAULT_UNLOCKED_EXTERNAL_SKILL_IDS = ['sky-breaking-palm']

/** 新角色預設持有的武學殘卷數。 */
export const DEFAULT_STARTING_SCROLLS = 2000

/**
 * 建立預設養成欄位（供新角色與缺省相容使用）。
 * 吐納功為初始武學，新角色預設「已學會」（learnedSkillIds 含之）；
 * 可培養外功預設解鎖破空掌。
 */
export function createDefaultProgression(): Pick<
  PersistentCharacter,
  | 'scrolls'
  | 'unlockedSkillIds'
  | 'learnedSkillIds'
  | 'initialExternalSkillIds'
  | 'initialInternalSkillId'
  | 'unlockedTalentIds'
  | 'talentIds'
> {
  return {
    scrolls: DEFAULT_STARTING_SCROLLS,
    unlockedSkillIds: [DEFAULT_LEARNED_INNER_SKILL_ID, ...DEFAULT_UNLOCKED_EXTERNAL_SKILL_IDS],
    learnedSkillIds: [DEFAULT_LEARNED_INNER_SKILL_ID],
    initialExternalSkillIds: [],
    initialInternalSkillId: DEFAULT_LEARNED_INNER_SKILL_ID,
    unlockedTalentIds: [],
    talentIds: [],
  }
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
    // 缺省相容：新角色已含完整欄位則回傳（對缺少新增欄位的舊角色補預設）。
    if (parsed.characters.some((character) => Array.isArray(character.unlockedSkillIds))) {
      const defaults = createDefaultProgression()
      return parsed.characters.map((character) => ({
        ...defaults,
        ...character,
        // 既有角色若有 talentIds 則保留，否則補空陣列。
        talentIds: Array.isArray(character.talentIds) ? character.talentIds : [],
        unlockedTalentIds: Array.isArray(character.unlockedTalentIds)
          ? character.unlockedTalentIds
          : Array.isArray(character.talentIds)
            ? character.talentIds
            : [],
      }))
    }
    // 舊版存檔：缺少 unlockedSkillIds 欄位。將舊 learnedSkillIds 視為「已解鎖（可培養）」，
    // 並補上 scrolls、五維加成等預設值。
    const defaults = createDefaultProgression()
    return parsed.characters.map((character) => ({
      ...defaults,
      ...character,
      unlockedSkillIds: [...new Set([
        ...defaults.unlockedSkillIds,
        ...(character.learnedSkillIds ?? []),
      ])],
      learnedSkillIds: [],
      attributeBonuses: { ...DEFAULT_ATTRIBUTE_BONUSES, ...(character.attributeBonuses ?? {}) },
    }))
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
    ...createDefaultProgression(),
    gamesPlayed: 0,
    createdAt: Date.now(),
  }

  persist([...getStored(), character])
  return character
}

/** 更新角色基本資料（名稱／外觀／稱號／五維加成）。名稱重複或空白時回傳 false。
 * 天賦的開啟／解除請用 setCharacterTalent（需先解鎖）。 */
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

/** 卷獲取公式的起點值（可調）。 */
export const SCROLL_REWARD = {
  winBase: 20,
  loseBase: 8,
  perLevel: 3,
  perCreature: 2,
  perNewSkill: 5,
} as const

/**
 * 依局末表現結算武學殘卷（純函式）。
 *
 * @param stats 本局 RunStats。
 * @param won 是否勝利。
 * @param newSkillCount 本局新增入庫的功法數（去重後）。
 */
export function computeScrollReward(stats: RunStats, won: boolean, newSkillCount = 0): number {
  const base = won ? SCROLL_REWARD.winBase : SCROLL_REWARD.loseBase
  const levelBonus = (stats.maxLevelReached ?? 0) * SCROLL_REWARD.perLevel
  const creatureBonus = (stats.creaturesDefeated ?? 0) * SCROLL_REWARD.perCreature
  const skillBonus = newSkillCount * SCROLL_REWARD.perNewSkill
  return base + levelBonus + creatureBonus + skillBonus
}

/**
 * 局末回寫：將本局表現結算為卷並累加，同時把本局獲得的功法併入「可培養清單」（unlockedSkillIds，去重）。
 * 注意：遊戲中「獲得」功法僅解鎖到可培養清單，需另行花卷「學習」（learnSkill）後才會加入 learnedSkillIds。
 * 回傳更新後的角色；角色不存在回傳 undefined。
 */
export function applyEndGameRewards(
  id: string,
  stats: RunStats,
  won: boolean,
  gainedSkillIds: string[],
): PersistentCharacter | undefined {
  const characters = getStored()
  const index = characters.findIndex((character) => character.id === id)
  if (index < 0) return undefined

  const current = characters[index]
  const merged = [...new Set([...(current.unlockedSkillIds ?? []), ...gainedSkillIds])]
  const newSkillCount = merged.length - (current.unlockedSkillIds ?? []).length
  const scrolls = computeScrollReward(stats, won, newSkillCount)

  const updated: PersistentCharacter = {
    ...current,
    scrolls: (current.scrolls ?? 0) + scrolls,
    unlockedSkillIds: merged,
    gamesPlayed: (current.gamesPlayed ?? 0) + 1,
  }

  const next = [...characters]
  next[index] = updated
  persist(next)
  return updated
}

/** 直接累加角色卷數（供培養介面花卷使用）；角色不存在回傳 false。 */
export function addScrolls(id: string, amount: number): boolean {
  const characters = getStored()
  const index = characters.findIndex((character) => character.id === id)
  if (index < 0) return false
  const next = [...characters]
  next[index] = { ...next[index], scrolls: Math.max(0, (next[index].scrolls ?? 0) + amount) }
  persist(next)
  return true
}

/** 卷花費起點值（可調）。 */
export const SCROLL_COST = {
  /** 五維每點基礎成本：10 + 5 × 已投點數。 */
  attributeBase: 10,
  attributePerPoint: 5,
  /** 功法學習成本：基礎 30 + 20 × 已學習功法數（越學越貴，與五維同模式）。 */
  skillBase: 30,
  skillPerPoint: 20,
} as const

/** 計算某維下一點的成本：10 + 5 × 已投點數。 */
export function getAttributeUpgradeCost(currentBonus: number): number {
  return SCROLL_COST.attributeBase + SCROLL_COST.attributePerPoint * currentBonus
}

/** 計算下一項功法的學習成本：30 + 20 × 已學習功法數（越學越貴）。 */
export function getSkillLearnCost(learnedCount: number): number {
  return SCROLL_COST.skillBase + SCROLL_COST.skillPerPoint * learnedCount
}

/**
 * 花卷提升某維永久加成。卷不足或角色不存在回傳 false。
 * 成功時扣卷並 +1 該維加成。
 */
export function spendScrollsOnAttribute(id: string, attribute: keyof PlayerAttributes): boolean {
  const characters = getStored()
  const index = characters.findIndex((character) => character.id === id)
  if (index < 0) return false

  const current = characters[index]
  const currentBonus = current.attributeBonuses[attribute] ?? 0
  const cost = getAttributeUpgradeCost(currentBonus)
  if ((current.scrolls ?? 0) < cost) return false

  const next = [...characters]
  next[index] = {
    ...current,
    scrolls: (current.scrolls ?? 0) - cost,
    attributeBonuses: { ...current.attributeBonuses, [attribute]: currentBonus + 1 },
  }
  persist(next)
  return true
}

/**
 * 花卷「學習」功法：將可培養清單（unlockedSkillIds）中的功法正式學會（加入 learnedSkillIds）。
 * 需先獲得（在 unlockedSkillIds 內）、尚未學習、卷數足夠。
 * 回傳 { ok, reason? }。
 */
export function learnSkill(id: string, skillId: string): { ok: boolean; reason?: string } {
  const characters = getStored()
  const index = characters.findIndex((character) => character.id === id)
  if (index < 0) return { ok: false, reason: '角色不存在。' }

  const current = characters[index]
  const unlocked = current.unlockedSkillIds ?? []
  if (!unlocked.includes(skillId)) return { ok: false, reason: '尚未獲得此功法，無法學習。' }
  if ((current.learnedSkillIds ?? []).includes(skillId)) return { ok: false, reason: '此功法已學習。' }

  const learnedCount = (current.learnedSkillIds ?? []).length
  const cost = getSkillLearnCost(learnedCount)
  if ((current.scrolls ?? 0) < cost) return { ok: false, reason: '卷不足。' }

  const next = [...characters]
  next[index] = {
    ...current,
    scrolls: (current.scrolls ?? 0) - cost,
    learnedSkillIds: [...(current.learnedSkillIds ?? []), skillId],
  }
  persist(next)
  return { ok: true }
}

/** 開啟天賦時的成本基準（與功法學習同公式，依「已解鎖天賦數」遞增）。 */
export function getTalentUnlockCost(unlockedCount: number): number {
  return getSkillLearnCost(unlockedCount)
}

/**
 * 花卷「解鎖」天賦：將天賦加入 unlockedTalentIds。
 * 需是已定義天賦、尚未解鎖、卷數足夠。
 * 解鎖後才能開啟（setCharacterTalent 切換 talentIds）。回傳 { ok, reason? }。
 */
export function unlockTalent(id: string, talentId: string): { ok: boolean; reason?: string } {
  const characters = getStored()
  const index = characters.findIndex((character) => character.id === id)
  if (index < 0) return { ok: false, reason: '角色不存在。' }
  if (!getTalent(talentId)) return { ok: false, reason: '未知的天賦。' }

  const current = characters[index]
  const unlocked = current.unlockedTalentIds ?? []
  if (unlocked.includes(talentId)) return { ok: false, reason: '此天賦已解鎖。' }

  const cost = getTalentUnlockCost(unlocked.length)
  if ((current.scrolls ?? 0) < cost) return { ok: false, reason: '卷不足。' }

  const next = [...characters]
  next[index] = {
    ...current,
    scrolls: (current.scrolls ?? 0) - cost,
    unlockedTalentIds: [...unlocked, talentId],
  }
  persist(next)
  return { ok: true }
}

/**
 * 開啟／關閉已解鎖的天賦（在 unlockedTalentIds 內切換 talentIds）。
 * 開啟／關閉不花卷（解鎖時已花費）；僅能操作已解鎖天賦。
 * 回傳 { ok, reason? }。
 */
export function setCharacterTalent(id: string, talentId: string, enabled: boolean): { ok: boolean; reason?: string } {
  const characters = getStored()
  const index = characters.findIndex((character) => character.id === id)
  if (index < 0) return { ok: false, reason: '角色不存在。' }

  const current = characters[index]
  const unlocked = current.unlockedTalentIds ?? []
  if (!unlocked.includes(talentId)) return { ok: false, reason: '尚未解鎖此天賦，無法開啟。' }

  const selected = new Set(current.talentIds ?? [])
  if (enabled) {
    selected.add(talentId)
  } else {
    selected.delete(talentId)
  }

  const next = [...characters]
  next[index] = {
    ...current,
    talentIds: [...selected],
  }
  persist(next)
  return { ok: true }
}

/**
 * 開啟已學習的外功為開局攜帶（加入 initialExternalSkillIds）。
 * 需已學習、未重複、未達上限。開啟／關閉不花卷（學習時已花費）。
 * 回傳 { ok, reason? }。
 */
export function setInitialExternalSkill(id: string, skillId: string): { ok: boolean; reason?: string } {
  const characters = getStored()
  const index = characters.findIndex((character) => character.id === id)
  if (index < 0) return { ok: false, reason: '角色不存在。' }

  const current = characters[index]
  const learned = current.learnedSkillIds ?? []
  if (!learned.includes(skillId)) return { ok: false, reason: '尚未學習此功法，無法開啟。' }
  if ((current.initialExternalSkillIds ?? []).includes(skillId)) return { ok: false, reason: '此功法已是初始外功。' }

  const next = [...characters]
  next[index] = {
    ...current,
    initialExternalSkillIds: [...(current.initialExternalSkillIds ?? []), skillId],
  }
  persist(next)
  return { ok: true }
}

/**
 * 開啟已學習的內功為開局內功。開啟／關閉不花卷（學習時已花費）。
 * 成功時更新 initialInternalSkillId。
 */
export function setInitialInternalSkill(id: string, skillId: string): { ok: boolean; reason?: string } {
  const characters = getStored()
  const index = characters.findIndex((character) => character.id === id)
  if (index < 0) return { ok: false, reason: '角色不存在。' }

  const current = characters[index]
  const learned = current.learnedSkillIds ?? []
  if (!learned.includes(skillId)) return { ok: false, reason: '尚未學習此內功，無法開啟。' }

  const next = [...characters]
  next[index] = {
    ...current,
    initialInternalSkillId: skillId,
  }
  persist(next)
  return { ok: true }
}

/**
 * 關閉已開啟的外功（取消設為開局攜帶）。不花卷、不退卷。
 * 若該外功不在開啟清單則回傳 false。
 */
export function closeInitialExternalSkill(id: string, skillId: string): boolean {
  const characters = getStored()
  const index = characters.findIndex((character) => character.id === id)
  if (index < 0) return false

  const current = characters[index]
  const opened = current.initialExternalSkillIds ?? []
  if (!opened.includes(skillId)) return false

  const next = [...characters]
  next[index] = {
    ...current,
    initialExternalSkillIds: opened.filter((candidate) => candidate !== skillId),
  }
  persist(next)
  return true
}

/**
 * 關閉已開啟的內功（取消設為開局內功，清空為未開啟）。
 * 若目前沒有開啟內功則回傳 false。
 */
export function closeInitialInternalSkill(id: string): boolean {
  const characters = getStored()
  const index = characters.findIndex((character) => character.id === id)
  if (index < 0) return false

  const current = characters[index]
  if (!current.initialInternalSkillId) return false

  const next = [...characters]
  next[index] = { ...current, initialInternalSkillId: '' }
  persist(next)
  return true
}
