/**
 * 戰役通關進度（Campaign Clearance Storage）。
 *
 * 記錄哪些劇本關卡已闖關成功／失敗，儲存在 localStorage。
 * 用於開始遊戲畫面的「劇本地圖」Tab，為每個劇本顯示通過標記。
 */

/** 每一關的通關紀錄：true = 已通關；false = 已挑戰但失敗。 */
export type ScenarioClearanceMap = Record<string, boolean>

const CLEARANCE_STORAGE_KEY = 'mygame2.scenario-clearances'

function getStored(): ScenarioClearanceMap {
  if (typeof localStorage === 'undefined') return {}
  try {
    const raw = localStorage.getItem(CLEARANCE_STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as unknown
    return (parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {}) as ScenarioClearanceMap
  } catch {
    return {}
  }
}

function persist(map: ScenarioClearanceMap) {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(CLEARANCE_STORAGE_KEY, JSON.stringify(map))
}

/** 讀取所有劇本的通關紀錄。 */
export function getScenarioClearances(): ScenarioClearanceMap {
  return getStored()
}

/** 查詢單一劇本是否已闖關成功。未知時回傳 undefined（未挑戰）。 */
export function getScenarioCleared(scenarioId: string): boolean | undefined {
  return getStored()[scenarioId]
}

/** 記錄劇本通關狀態（true = 成功；false = 失敗）。 */
export function recordScenarioClearance(scenarioId: string, cleared: boolean) {
  if (!scenarioId) return
  const map = getStored()
  map[scenarioId] = cleared
  persist(map)
}

/** 清除單一劇本的通關紀錄。 */
export function clearScenarioClearance(scenarioId: string) {
  const map = getStored()
  delete map[scenarioId]
  persist(map)
}