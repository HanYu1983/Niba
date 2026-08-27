import type { GameState } from './types'
import { isRunSettled } from './settledRuns'

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
  /** 目前對局選用的名册角色 id（未選用為 null/缺漏）。讀檔時還原，避免局末結算回寫到錯誤角色。 */
  activeCharacterId?: string | null
}

/** 武學殘卷結算狀態（三態，設計文件 scroll-reward-settlement-dedup-design.md §3.3）。 */
export type RewardSettlementStatus = 'settled' | 'pending' | 'in-progress'

export type GameSaveSlotSummary = {
  slot: number
  savedAt: string | null
  round: number | null
  /**
   * 武學殘卷結算狀態：
   * - 'settled'：已領過——有 runId 且已登記；或舊存檔無 runId 但局末（退回推斷）。
   * - 'pending'：局末但尚未結算（勝利對話期間存檔的情境），讀檔後可補結算。
   * - 'in-progress'：遊戲進行中。
   */
  rewardStatus: RewardSettlementStatus
}

/**
 * 判定存檔的殘卷結算狀態（三態混合判定）：
 * 有 runId 以登記表為準；無 runId（舊存檔）退回 gameWon/gameOver 推斷。
 */
function resolveRewardStatus(state: Partial<GameState> | undefined): RewardSettlementStatus {
  const isGameEnded = state?.gameWon === true || state?.gameOver === true
  const runId = typeof state?.runId === 'string' ? state.runId : undefined
  if (runId) {
    if (isRunSettled(runId)) return 'settled'
    return isGameEnded ? 'pending' : 'in-progress'
  }
  return isGameEnded ? 'settled' : 'in-progress'
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
      return {
        slot,
        savedAt: typeof payload?.savedAt === 'string' ? payload.savedAt : null,
        round: typeof payload?.state?.round === 'number' ? payload.state.round : null,
        rewardStatus: resolveRewardStatus(payload?.state),
      }
    } catch {
      return { slot, savedAt: null, round: null, rewardStatus: 'in-progress' as const }
    }
  })
}

export function saveGameStateToSlot(state: GameState, slot: number, activeCharacterId: string | null = null): { ok: boolean; reason?: string } {
  if (!isValidSlot(slot)) return { ok: false, reason: '存檔欄位不存在。' }
  if (typeof localStorage === 'undefined') return { ok: false, reason: '目前環境不支援儲存。' }
  try {
    localStorage.setItem(getSlotKey(slot), JSON.stringify({ version: GAME_SAVE_VERSION, savedAt: new Date().toISOString(), state, activeCharacterId } satisfies GameSaveData))
    return { ok: true }
  } catch {
    return { ok: false, reason: '儲存失敗，可能是瀏覽器儲存空間不足。' }
  }
}

export function loadGameStateFromSlot(slot: number): { ok: true; state: GameState; activeCharacterId: string | null } | { ok: false; reason: string } {
  if (!isValidSlot(slot)) return { ok: false, reason: '存檔欄位不存在。' }
  if (typeof localStorage === 'undefined') return { ok: false, reason: '目前環境不支援讀取。' }
  try {
    const raw = localStorage.getItem(getSlotKey(slot))
    if (!raw) return { ok: false, reason: `存檔欄位 ${slot} 目前是空的。` }
    const payload = JSON.parse(raw) as Partial<GameSaveData>
    if (payload.version !== GAME_SAVE_VERSION || !payload.state || typeof payload.state !== 'object') return { ok: false, reason: '存檔版本不相容或資料損壞。' }
    return { ok: true, state: payload.state, activeCharacterId: payload.activeCharacterId ?? null }
  } catch {
    return { ok: false, reason: '存檔資料損壞，無法讀取。' }
  }
}

export function deleteGameStateFromSlot(slot: number): void {
  if (isValidSlot(slot) && typeof localStorage !== 'undefined') localStorage.removeItem(getSlotKey(slot))
}

export function saveGameState(state: GameState, activeCharacterId: string | null = null): { ok: boolean; reason?: string } {
  if (typeof localStorage === 'undefined') return { ok: false, reason: '目前環境不支援儲存。' }
  try {
    const payload: GameSaveData = { version: GAME_SAVE_VERSION, savedAt: new Date().toISOString(), state, activeCharacterId }
    localStorage.setItem(GAME_SAVE_STORAGE_KEY, JSON.stringify(payload))
    return { ok: true }
  } catch {
    return { ok: false, reason: '儲存失敗，可能是瀏覽器儲存空間不足。' }
  }
}

export function loadGameState(): { ok: true; state: GameState; activeCharacterId: string | null } | { ok: false; reason: string } {
  if (typeof localStorage === 'undefined') return { ok: false, reason: '目前環境不支援讀取。' }
  try {
    const raw = localStorage.getItem(GAME_SAVE_STORAGE_KEY)
    if (!raw) return { ok: false, reason: '目前沒有可讀取的存檔。' }
    const payload = JSON.parse(raw) as Partial<GameSaveData>
    if (payload.version !== GAME_SAVE_VERSION || !payload.state || typeof payload.state !== 'object') {
      return { ok: false, reason: '存檔版本不相容或資料損壞。' }
    }
    return { ok: true, state: payload.state, activeCharacterId: payload.activeCharacterId ?? null }
  } catch {
    return { ok: false, reason: '存檔資料損壞，無法讀取。' }
  }
}

export function hasSavedGame(): boolean {
  return typeof localStorage !== 'undefined' && localStorage.getItem(GAME_SAVE_STORAGE_KEY) !== null
}
