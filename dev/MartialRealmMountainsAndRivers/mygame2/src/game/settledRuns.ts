/**
 * 已結算局登記表（Settled Runs Registry）。
 *
 * 以「本局唯一識別（runId）」為單位持久化記錄「該局武學殘卷已結算」的事實，
 * 供結算流程跨 session、跨存檔欄位去重（設計文件：
 * reports/system/scroll-reward-settlement-dedup-design.md）。
 *
 * 儲存於 localStorage，與名册（characterRoster.ts）、劇本通關記錄
 * （campaignClearance.ts）同模式。
 */

const SETTLED_RUNS_STORAGE_KEY = 'mygame2.settled-runs'
const SETTLED_RUNS_VERSION = 1
/** 登記表上限：只保留最近 N 筆，避免 localStorage 無限成長。 */
export const MAX_SETTLED_RUNS = 200

type SettledRunsPayload = {
  version: number
  /** 已結算的 runId 清單（新的在尾端）。 */
  runIds: string[]
}

function getStored(): string[] {
  if (typeof localStorage === 'undefined') return []
  try {
    const raw = localStorage.getItem(SETTLED_RUNS_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as Partial<SettledRunsPayload>
    if (!parsed || !Array.isArray(parsed.runIds)) return []
    return parsed.runIds.filter((id): id is string => typeof id === 'string')
  } catch {
    return []
  }
}

function persist(runIds: string[]): void {
  if (typeof localStorage === 'undefined') return
  const payload: SettledRunsPayload = { version: SETTLED_RUNS_VERSION, runIds }
  localStorage.setItem(SETTLED_RUNS_STORAGE_KEY, JSON.stringify(payload))
}

/** 查詢某局是否已結算過殘卷。 */
export function isRunSettled(runId: string): boolean {
  if (!runId) return false
  return getStored().includes(runId)
}

/** 登記某局已結算；冪等（重複標記不重複儲存），超上限時淘汰最舊者。 */
export function markRunSettled(runId: string): void {
  if (!runId) return
  const current = getStored()
  if (current.includes(runId)) return
  const next = [...current, runId].slice(-MAX_SETTLED_RUNS)
  persist(next)
}

/** 產生本局唯一識別：run-{timestamp36}-{random6}（與名册角色 id 同模式）。 */
export function generateRunId(): string {
  return `run-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}
