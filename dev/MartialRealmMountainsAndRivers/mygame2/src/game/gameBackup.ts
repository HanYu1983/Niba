/**
 * 遊戲備份（Game Backup）。
 *
 * 目的：允許玩家將整個遊戲狀態（存檔、名冊角色、通關進度、挑戰等級、
 * 自訂地圖模板、設定等）匯出為 JSON 檔案自行保存，避免瀏覽器
 * localStorage 被清空（換瀏覽器、清除瀏覽資料、隱私模式等）造成進度損失。
 *
 * 做法：掃描 localStorage 中所有 `mygame2.` 前綴的 key，整包序列化。
 * 匯入時逐 key 還原（僅還原 `mygame2.` 前綴，不會污染其他網站資料）。
 */

/** 匯出的備份檔格式。 */
export type GameBackupPayload = {
  /** 備份格式版本（未來欄位演進用）。 */
  backupVersion: 1
  /** 匯出時間（ISO 8601）。 */
  exportedAt: string
  /** 遊戲標識（避免誤匯入其他遊戲的備份檔）。 */
  game: 'mygame2'
  /** key → 原始 JSON 字串（與 localStorage 內容一致）。 */
  entries: Record<string, string>
}

/** 備份涵蓋的 localStorage key 前綴。 */
const BACKUP_KEY_PREFIX = 'mygame2.'

/** 列出所有屬於本遊戲的 localStorage key。 */
function listBackupKeys(): string[] {
  if (typeof localStorage === 'undefined') return []
  const keys: string[] = []
  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index)
    if (key && key.startsWith(BACKUP_KEY_PREFIX)) keys.push(key)
  }
  return keys.sort()
}

/** 匯出整個遊戲狀態為備份 payload；無任何資料時回傳 null。 */
export function createGameBackup(): GameBackupPayload | null {
  const keys = listBackupKeys()
  if (keys.length === 0) return null
  const entries: Record<string, string> = {}
  for (const key of keys) {
    const value = localStorage.getItem(key)
    if (value !== null) entries[key] = value
  }
  return {
    backupVersion: 1,
    exportedAt: new Date().toISOString(),
    game: 'mygame2',
    entries,
  }
}

/** 匯入備份：逐 key 還原至 localStorage。回傳還原的 key 數量。 */
export function restoreGameBackup(payload: GameBackupPayload): number {
  if (typeof localStorage === 'undefined') return 0
  let restored = 0
  for (const [key, value] of Object.entries(payload.entries)) {
    // 安全防護：僅還原本遊戲前綴的 key。
    if (!key.startsWith(BACKUP_KEY_PREFIX)) continue
    try {
      localStorage.setItem(key, value)
      restored += 1
    } catch {
      // 單一 key 寫入失敗（如 QuotaExceededError）不中斷其餘還原。
      continue
    }
  }
  return restored
}

/** 驗證備份檔 JSON 是否為合法的本遊戲備份。 */
export function parseGameBackup(raw: string): { ok: true; payload: GameBackupPayload } | { ok: false; reason: string } {
  try {
    const payload = JSON.parse(raw) as Partial<GameBackupPayload>
    if (payload.game !== 'mygame2') return { ok: false, reason: '這不是本遊戲的備份檔。' }
    if (payload.backupVersion !== 1) return { ok: false, reason: '備份檔版本不相容。' }
    if (!payload.entries || typeof payload.entries !== 'object') return { ok: false, reason: '備份檔資料損壞。' }
    return { ok: true, payload: payload as GameBackupPayload }
  } catch {
    return { ok: false, reason: '備份檔格式錯誤，無法解析。' }
  }
}

/** 產生備份檔建議檔名（含日期時間）。 */
export function getBackupFileName(): string {
  const now = new Date()
  const pad = (value: number) => String(value).padStart(2, '0')
  return `mygame2-backup-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}.json`
}
