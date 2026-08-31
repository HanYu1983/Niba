import type { GameSettings, GameState, PlayerState } from '../types'
import type { CreatureTurnResult } from '../actions/creatureActions'
import { getSavedGameSettings } from '../gameSettings'

/**
 * SessionContext：封裝一局遊戲的 session 生命週期狀態。
 *
 * 這些原本是 gameStore.ts 的模組級變數。把它們收斂到單一物件，
 * 讓 session 的建立／重置／讀取有明確的單一來源，也便於測試注入。
 */
export interface SessionContext {
  /** 目前對局使用的遊戲設定（開局時快照）。 */
  lastGameSettings: GameSettings
  /** 目前載入的劇本關卡 id（記錄通關進度用）；非劇本模式為 null。 */
  currentScenarioId: string | null
  /** 目前對局是否為挑戰關卡模式（勝利時記錄闖關等級 +1）。 */
  isChallengeMode: boolean
  /** 目前對局各人類玩家選用的名册角色 id（依人類玩家順序；未選用為 null）。 */
  activeCharacterIds: (string | null)[]
  /**
   * 本局殘卷獎勵是否已結算（防重旗標）。
   *
   * 生命週期：startGame / restartGame 重置為 false；settle 成功後設為 true；
   * 載入局末存檔時視為已結算（true），避免讀檔即重算。
   */
  rewardSettled: boolean
  /**
   * 暫存的敵人行動結果（回合結束觸發探索事件時延後執行）。
   *
   * 為何需要它：
   * `endPlayerTurn` 一次完成兩件事——「回合結束隨機觸發探索事件」與「計算並執行敵人行動」。
   * 原本兩者同步進行，導致事件彈窗與敵人行動彈窗同時出現。
   * 為讓「事件彈窗（含結果）先出現、玩家確認後才執行敵人行動」，
   * 我們把敵人行動的執行延後到事件處理完之後。
   *
   * 為何用 session 變數而非 state 欄位：
   * 若把整個 CreatureTurnResult 存入 GameState，types.ts 就得 import
   * ./actions/creatureActions 的型別，但 creatureActions 又依賴 types，
   * 會造成循環依賴。用 session 變數（reactive store 外的純暫存）可避開這問題，
   * 且它只在「結束回合 → 事件處理完」的短暫窗口內存在，不需持久化或重渲染。
   */
  pendingCreatureTurn: CreatureTurnResult | null
  /** 暫存敵人行動時的玩家快照（供 flush 時合併事件效果）。 */
  pendingCreatureTurnBasePlayers: PlayerState[] | null
}

/** 建立一個全新的 SessionContext（預設值）。 */
export function createSessionContext(): SessionContext {
  return {
    lastGameSettings: getSavedGameSettings(),
    currentScenarioId: null,
    isChallengeMode: false,
    activeCharacterIds: [],
    rewardSettled: false,
    pendingCreatureTurn: null,
    pendingCreatureTurnBasePlayers: null,
  }
}

/** 清除暫存的敵人行動（回合結束流程重啟時呼叫）。 */
export function clearPendingCreatureTurn(session: SessionContext): void {
  session.pendingCreatureTurn = null
  session.pendingCreatureTurnBasePlayers = null
}

/**
 * 以目前 GameState 的 activeCharacterIds 還原名册角色 id 陣列（向下相容）。
 *
 * 優先序：state.activeCharacterIds → state.activeCharacterId → payload 的
 * activeCharacterId（讀檔時傳入）→ []。
 */
export function resolveActiveCharacterIds(
  state: GameState,
  payloadActiveCharacterId?: string | null,
): (string | null)[] {
  if (state.activeCharacterIds) return state.activeCharacterIds
  if (state.activeCharacterId !== undefined) return [state.activeCharacterId]
  if (payloadActiveCharacterId !== undefined && payloadActiveCharacterId !== null) return [payloadActiveCharacterId]
  return []
}