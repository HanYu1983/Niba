import type { GameState } from './types'

export const GAME_SAVE_STORAGE_KEY = 'mygame2.game-save'
export const GAME_SAVE_SLOT_COUNT = 10
/** 自動存檔固定使用的欄位編號；手動存檔欄位為 1–10。 */
export const AUTO_SAVE_SLOT = 0
export const GAME_SAVE_SLOT_STORAGE_PREFIX = 'mygame2.game-save.slot.'
export const GAME_SAVE_VERSION = 1

type GameSaveData = {
  version: number
  savedAt: string
  state: GameState
}

export type GameSaveSlotSummary = {
  slot: number
  savedAt: string | null
  round: number | null
}

function getSlotKey(slot: number): string {
  return `${GAME_SAVE_SLOT_STORAGE_PREFIX}${slot}`
}

function isValidSlot(slot: number): boolean {
  return Number.isInteger(slot) && slot >= AUTO_SAVE_SLOT && slot <= GAME_SAVE_SLOT_COUNT
}

export function getGameSaveSlots(): GameSaveSlotSummary[] {
  return Array.from({ length: GAME_SAVE_SLOT_COUNT + 1 }, (_, index) => {
    const slot = index
    try {
      const raw = typeof localStorage === 'undefined' ? null : localStorage.getItem(getSlotKey(slot))
      const payload = raw ? JSON.parse(raw) as Partial<GameSaveData> : null
      return { slot, savedAt: typeof payload?.savedAt === 'string' ? payload.savedAt : null, round: typeof payload?.state?.round === 'number' ? payload.state.round : null }
    } catch {
      return { slot, savedAt: null, round: null }
    }
  })
}

export function saveGameStateToSlot(state: GameState, slot: number): { ok: boolean; reason?: string } {
  if (!isValidSlot(slot)) return { ok: false, reason: '存檔欄位不存在。' }
  if (typeof localStorage === 'undefined') return { ok: false, reason: '目前環境不支援儲存。' }
  try {
    localStorage.setItem(getSlotKey(slot), JSON.stringify({ version: GAME_SAVE_VERSION, savedAt: new Date().toISOString(), state } satisfies GameSaveData))
    return { ok: true }
  } catch {
    return { ok: false, reason: '儲存失敗，可能是瀏覽器儲存空間不足。' }
  }
}

export function loadGameStateFromSlot(slot: number): { ok: true; state: GameState } | { ok: false; reason: string } {
  if (!isValidSlot(slot)) return { ok: false, reason: '存檔欄位不存在。' }
  if (typeof localStorage === 'undefined') return { ok: false, reason: '目前環境不支援讀取。' }
  try {
    const raw = localStorage.getItem(getSlotKey(slot))
    if (!raw) return { ok: false, reason: `存檔欄位 ${slot} 目前是空的。` }
    const payload = JSON.parse(raw) as Partial<GameSaveData>
    if (payload.version !== GAME_SAVE_VERSION || !payload.state || typeof payload.state !== 'object') return { ok: false, reason: '存檔版本不相容或資料損壞。' }
    return { ok: true, state: payload.state }
  } catch {
    return { ok: false, reason: '存檔資料損壞，無法讀取。' }
  }
}

export function deleteGameStateFromSlot(slot: number): void {
  if (isValidSlot(slot) && typeof localStorage !== 'undefined') localStorage.removeItem(getSlotKey(slot))
}

export function saveGameState(state: GameState): { ok: boolean; reason?: string } {
  if (typeof localStorage === 'undefined') return { ok: false, reason: '目前環境不支援儲存。' }
  try {
    const payload: GameSaveData = { version: GAME_SAVE_VERSION, savedAt: new Date().toISOString(), state }
    localStorage.setItem(GAME_SAVE_STORAGE_KEY, JSON.stringify(payload))
    return { ok: true }
  } catch {
    return { ok: false, reason: '儲存失敗，可能是瀏覽器儲存空間不足。' }
  }
}

export function loadGameState(): { ok: true; state: GameState } | { ok: false; reason: string } {
  if (typeof localStorage === 'undefined') return { ok: false, reason: '目前環境不支援讀取。' }
  try {
    const raw = localStorage.getItem(GAME_SAVE_STORAGE_KEY)
    if (!raw) return { ok: false, reason: '目前沒有可讀取的存檔。' }
    const payload = JSON.parse(raw) as Partial<GameSaveData>
    if (payload.version !== GAME_SAVE_VERSION || !payload.state || typeof payload.state !== 'object') {
      return { ok: false, reason: '存檔版本不相容或資料損壞。' }
    }
    return { ok: true, state: payload.state }
  } catch {
    return { ok: false, reason: '存檔資料損壞，無法讀取。' }
  }
}

export function hasSavedGame(): boolean {
  return typeof localStorage !== 'undefined' && localStorage.getItem(GAME_SAVE_STORAGE_KEY) !== null
}
