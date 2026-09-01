import type { GameState } from './types'
import { isRunSettled } from './settledRuns'
import { validateGameState } from './gameSaveValidation'

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
  /** 目前對局是否為挑戰關卡模式（勝利時記錄闖關等級 +1）。舊存檔缺漏視為 false。 */
  isChallengeMode?: boolean
  /** 目前對局的劇本關卡 id（記錄通關進度用）。非劇本模式為 null/缺漏。 */
  scenarioId?: string | null
}

/** 武學殘卷結算狀態（三態，設計文件 scroll-reward-settlement-dedup-design.md §3.3）。 */
export type RewardSettlementStatus = 'settled' | 'pending' | 'in-progress'

/** 存檔所屬的遊戲模式。 */
export type GameSaveMode = 'sandbox' | 'challenge' | 'scenario'

export type GameSaveSlotSummary = {
  slot: number
  savedAt: string | null
  round: number | null
  /**
   * 武學殘卷結算狀態：
   * - 'settled'：已領過——有 runId 且已登記；或舊存檔無 runId 但局末（退回推斷）。
   * - 'pending'：局末但尚未結算（勝利對話期間存檔的情境），讀取後可補結算。
   * - 'in-progress'：遊戲進行中。
   */
  rewardStatus: RewardSettlementStatus
  /** 存檔所屬模式：挑戰關卡 / 劇本關卡 / 沙盒（預設）。 */
  mode: GameSaveMode
  /** 劇本關卡 id（僅 mode = 'scenario' 時有值）。 */
  scenarioId: string | null
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

function normalizeAiOrders(state: GameState): GameState {
  const existingOrders = Array.isArray(state.aiOrders) ? state.aiOrders : []
  let migratedLegacyOrder = false
  const normalizedOrders = existingOrders.map((order) => {
    const legacyOrder = order as unknown as { type?: string }
    if (legacyOrder.type === 'decision-tree' || legacyOrder.type === 'graph-search') {
      migratedLegacyOrder = true
      return { ...order, type: 'fuzzy' as const }
    }
    return order
  })
  const orderedPlayerIds = new Set(normalizedOrders.map((order) => order.aiPlayerId))
  const recoveredOrders = (Array.isArray(state.players) ? state.players : [])
    .filter((player) => player.isAI === true && !orderedPlayerIds.has(player.id))
    .map((player) => ({
      id: `ai-order-fuzzy-${player.id}`,
      type: 'fuzzy' as const,
      aiPlayerId: player.id,
      ...(player.aiPersonality ? { personality: player.aiPersonality } : {}),
      priority: 50,
      status: 'active' as const,
    }))

  if (recoveredOrders.length === 0 && !migratedLegacyOrder) return state
  return {
    ...state,
    aiOrders: [...normalizedOrders, ...recoveredOrders],
  }
}

export function getGameSaveSlots(): GameSaveSlotSummary[] {
  return Array.from({ length: GAME_SAVE_SLOT_COUNT + 1 }, (_, index) => {
    const slot = index
    try {
      const raw = typeof localStorage === 'undefined' ? null : localStorage.getItem(getSlotKey(slot))
      const payload = raw ? JSON.parse(raw) as Partial<GameSaveData> : null
      const scenarioId = typeof payload?.scenarioId === 'string' && payload.scenarioId ? payload.scenarioId : null
      const isChallenge = payload?.isChallengeMode === true
      return {
        slot,
        savedAt: typeof payload?.savedAt === 'string' ? payload.savedAt : null,
        round: typeof payload?.state?.round === 'number' ? payload.state.round : null,
        rewardStatus: resolveRewardStatus(payload?.state),
        mode: isChallenge ? 'challenge' : scenarioId ? 'scenario' : 'sandbox',
        scenarioId,
      }
    } catch {
      return { slot, savedAt: null, round: null, rewardStatus: 'in-progress' as const, mode: 'sandbox' as const, scenarioId: null }
    }
  })
}

export function saveGameStateToSlot(state: GameState, slot: number, activeCharacterId: string | null = null, isChallengeMode = false, scenarioId: string | null = null): { ok: boolean; reason?: string } {
  if (!isValidSlot(slot)) return { ok: false, reason: '存檔欄位不存在。' }
  if (typeof localStorage === 'undefined') return { ok: false, reason: '目前環境不支援儲存。' }
  try {
    // activeCharacterId 已隨 GameState 序列化；payload 欄位保留作向下相容，
    // 呼叫端未傳時回退讀取 state.activeCharacterId。
    const resolvedId = activeCharacterId ?? state.activeCharacterId ?? null
    localStorage.setItem(getSlotKey(slot), JSON.stringify({ version: GAME_SAVE_VERSION, savedAt: new Date().toISOString(), state, activeCharacterId: resolvedId, isChallengeMode, scenarioId } satisfies GameSaveData))
    return { ok: true }
  } catch {
    return { ok: false, reason: '儲存失敗，可能是瀏覽器儲存空間不足。' }
  }
}

export function loadGameStateFromSlot(slot: number): { ok: true; state: GameState; activeCharacterId: string | null; isChallengeMode: boolean; scenarioId: string | null } | { ok: false; reason: string } {
  if (!isValidSlot(slot)) return { ok: false, reason: '存檔欄位不存在。' }
  if (typeof localStorage === 'undefined') return { ok: false, reason: '目前環境不支援讀取。' }
  try {
    const raw = localStorage.getItem(getSlotKey(slot))
    if (!raw) return { ok: false, reason: `存檔欄位 ${slot} 目前是空的。` }
    const payload = JSON.parse(raw) as Partial<GameSaveData>
    if (payload.version !== GAME_SAVE_VERSION || !payload.state || typeof payload.state !== 'object') return { ok: false, reason: '存檔版本不相容或資料損壞。' }
    const state = normalizeAiOrders(payload.state)
    const validation = validateGameState(state)
    if (!validation.valid) return { ok: false, reason: validation.reason ?? '存檔資料損壞，無法讀取。' }
    return {
      ok: true,
      state,
      activeCharacterId: payload.activeCharacterId ?? null,
      isChallengeMode: payload.isChallengeMode === true,
      scenarioId: typeof payload.scenarioId === 'string' && payload.scenarioId ? payload.scenarioId : null,
    }
  } catch {
    return { ok: false, reason: '存檔資料損壞，無法讀取。' }
  }
}

export function deleteGameStateFromSlot(slot: number): void {
  if (isValidSlot(slot) && typeof localStorage !== 'undefined') localStorage.removeItem(getSlotKey(slot))
}

/** 自動存檔 debounce 延遲（毫秒）。 */
export const AUTO_SAVE_DEBOUNCE_MS = 500

/** 待寫入的自動存檔快照（debounce 期間累積最新一份）。 */
let pendingAutoSave: { state: GameState; activeCharacterId: string | null; isChallengeMode: boolean; scenarioId: string | null } | null = null
let autoSaveTimer: ReturnType<typeof setTimeout> | null = null

/**
 * 自動存檔（debounce 版）。
 *
 * 自動存檔在每回合結束等熱路徑頻繁觸發，直接同步寫入 localStorage 會造成
 * 不必要的序列化成本。此函式將寫入延後 AUTO_SAVE_DEBOUNCE_MS，期間內多次呼叫
 * 只保留最新一份快照，最後一次寫入。
 *
 * 手動存檔（saveGameStateToSlot 的 slot 1–10）維持即時寫入，不受影響。
 */
export function scheduleAutoSave(state: GameState, activeCharacterId: string | null = null, isChallengeMode = false, scenarioId: string | null = null): void {
  if (typeof localStorage === 'undefined') return
  pendingAutoSave = { state, activeCharacterId, isChallengeMode, scenarioId }
  if (autoSaveTimer !== null) clearTimeout(autoSaveTimer)
  autoSaveTimer = setTimeout(() => {
    autoSaveTimer = null
    const snapshot = pendingAutoSave
    pendingAutoSave = null
    if (snapshot) saveGameStateToSlot(snapshot.state, AUTO_SAVE_SLOT, snapshot.activeCharacterId, snapshot.isChallengeMode, snapshot.scenarioId)
  }, AUTO_SAVE_DEBOUNCE_MS)
}

/** 立即寫入尚未觸發的 debounce 自動存檔（供測試與頁面卸載前 flush）。 */
export function flushAutoSave(): void {
  if (autoSaveTimer !== null) {
    clearTimeout(autoSaveTimer)
    autoSaveTimer = null
  }
  const snapshot = pendingAutoSave
  pendingAutoSave = null
  if (snapshot) saveGameStateToSlot(snapshot.state, AUTO_SAVE_SLOT, snapshot.activeCharacterId, snapshot.isChallengeMode, snapshot.scenarioId)
}

export function saveGameState(state: GameState, activeCharacterId: string | null = null, isChallengeMode = false, scenarioId: string | null = null): { ok: boolean; reason?: string } {
  if (typeof localStorage === 'undefined') return { ok: false, reason: '目前環境不支援儲存。' }
  try {
    // activeCharacterId 已隨 GameState 序列化；payload 欄位保留作向下相容，
    // 呼叫端未傳時回退讀取 state.activeCharacterId。
    const resolvedId = activeCharacterId ?? state.activeCharacterId ?? null
    const payload: GameSaveData = { version: GAME_SAVE_VERSION, savedAt: new Date().toISOString(), state, activeCharacterId: resolvedId, isChallengeMode, scenarioId }
    localStorage.setItem(GAME_SAVE_STORAGE_KEY, JSON.stringify(payload))
    return { ok: true }
  } catch {
    return { ok: false, reason: '儲存失敗，可能是瀏覽器儲存空間不足。' }
  }
}

export function loadGameState(): { ok: true; state: GameState; activeCharacterId: string | null; isChallengeMode: boolean; scenarioId: string | null } | { ok: false; reason: string } {
  if (typeof localStorage === 'undefined') return { ok: false, reason: '目前環境不支援讀取。' }
  try {
    const raw = localStorage.getItem(GAME_SAVE_STORAGE_KEY)
    if (!raw) return { ok: false, reason: '目前沒有可讀取的存檔。' }
    const payload = JSON.parse(raw) as Partial<GameSaveData>
    if (payload.version !== GAME_SAVE_VERSION || !payload.state || typeof payload.state !== 'object') {
      return { ok: false, reason: '存檔版本不相容或資料損壞。' }
    }
    const state = normalizeAiOrders(payload.state)
    const validation = validateGameState(state)
    if (!validation.valid) return { ok: false, reason: validation.reason ?? '存檔資料損壞，無法讀取。' }
    return {
      ok: true,
      state,
      activeCharacterId: payload.activeCharacterId ?? null,
      isChallengeMode: payload.isChallengeMode === true,
      scenarioId: typeof payload.scenarioId === 'string' && payload.scenarioId ? payload.scenarioId : null,
    }
  } catch {
    return { ok: false, reason: '存檔資料損壞，無法讀取。' }
  }
}

export function hasSavedGame(): boolean {
  return typeof localStorage !== 'undefined' && localStorage.getItem(GAME_SAVE_STORAGE_KEY) !== null
}
