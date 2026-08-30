import type { GameState } from './types'

/**
 * 存檔 schema 驗證。
 *
 * 目的：讀取存檔（localStorage 或備份匯入）後，先做基本結構檢查，
 * 避免惡意/損壞存檔（如 `players: "x"`、`map.cells: null`）在後續
 * 渲染或模擬時白屏或拋例外。
 *
 * 這是「防禦性」檢查，只驗證關鍵結構與型別，不做完整業務規則驗證
 * （完整規則由遊戲執行時自行處理）。
 */

/** 驗證結果。 */
export type GameStateValidationResult = {
  valid: boolean
  /** 第一個失敗原因（供錯誤訊息顯示）。 */
  reason?: string
}

/** 判斷是否為非空陣列。 */
function isNonEmptyArray(value: unknown): value is unknown[] {
  return Array.isArray(value) && value.length > 0
}

/** 判斷是否為有效座標物件。 */
function isValidPosition(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false
  const position = value as { row?: unknown; column?: unknown }
  return typeof position.row === 'number' && Number.isFinite(position.row)
    && typeof position.column === 'number' && Number.isFinite(position.column)
}

/** 判斷是否為有效地圖格。 */
function isValidMapCell(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false
  const cell = value as { id?: unknown; row?: unknown; column?: unknown; terrain?: unknown }
  return typeof cell.id === 'string'
    && typeof cell.row === 'number' && Number.isFinite(cell.row)
    && typeof cell.column === 'number' && Number.isFinite(cell.column)
    && typeof cell.terrain === 'string'
}

/**
 * 驗證 GameState 的關鍵結構。
 *
 * 策略：**欄位存在才驗型別**。缺欄位（undefined）視為可接受（相容舊存檔/測試 stub），
 * 但欄位存在且型別錯誤（如 `players: "x"`、`map.cells: null`）即判定損壞。
 * 這樣既能擋掉惡意/損壞存檔，又不會誤擋缺欄位的合法存檔。
 *
 * 檢查項目（任一失敗即回傳 invalid）：
 * - state 為物件
 * - map 存在時：cells 為非空陣列且每格結構正確
 * - players / creatures / bases / creatureNests / resourcePoints / itemPoints 存在時：必須為陣列
 * - activePlayerId 存在時：必須為字串
 * - round 存在時：必須為有限數字
 * - 每個 player 存在時：需有 id 與有效 position
 */
export function validateGameState(state: unknown): GameStateValidationResult {
  if (!state || typeof state !== 'object') {
    return { valid: false, reason: '存檔缺少遊戲狀態。' }
  }
  const candidate = state as Partial<GameState>

  // map（存在才驗）
  if (candidate.map !== undefined) {
    if (!candidate.map || typeof candidate.map !== 'object') {
      return { valid: false, reason: '存檔缺少地圖資料。' }
    }
    const map = candidate.map as { rows?: unknown; columns?: unknown; cells?: unknown }
    if (typeof map.rows !== 'number' || typeof map.columns !== 'number') {
      return { valid: false, reason: '地圖尺寸資料損壞。' }
    }
    if (!isNonEmptyArray(map.cells) || !map.cells.every(isValidMapCell)) {
      return { valid: false, reason: '地圖格子資料損壞。' }
    }
  }

  // 核心實體陣列（存在才驗）
  const arrayFields: Array<[keyof GameState, string]> = [
    ['players', '玩家'],
    ['creatures', '怪物'],
    ['bases', '據點'],
    ['creatureNests', '巢穴'],
    ['resourcePoints', '資源點'],
    ['itemPoints', '物品點'],
  ]
  for (const [field, label] of arrayFields) {
    const value = candidate[field]
    if (value !== undefined && !Array.isArray(value)) {
      return { valid: false, reason: `存檔的${label}資料損壞。` }
    }
  }

  // activePlayerId / round（存在才驗）
  if (candidate.activePlayerId !== undefined && typeof candidate.activePlayerId !== 'string') {
    return { valid: false, reason: '存檔缺少當前行動玩家。' }
  }
  if (candidate.round !== undefined && (typeof candidate.round !== 'number' || !Number.isFinite(candidate.round))) {
    return { valid: false, reason: '存檔的回合數資料損壞。' }
  }

  // 每個玩家需有 id 與有效 position（存在才驗）
  const players = candidate.players
  if (players !== undefined && !players.every((player) => {
    if (!player || typeof player !== 'object') return false
    const p = player as { id?: unknown; position?: unknown }
    return typeof p.id === 'string' && isValidPosition(p.position)
  })) {
    return { valid: false, reason: '存檔的玩家資料損壞。' }
  }

  return { valid: true }
}