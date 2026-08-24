import type { ScenarioDefinition } from '../editor/editorTypes'

/**
 * 關卡儲存層（Scenario Storage）。
 *
 * 負責官方關卡 JSON 的讀取、localStorage 副本的管理、版本比對，
 * 以及自訂關卡 id 的產生。編輯器與開始遊戲頁面皆透過此模組存取關卡，
 * 不直接操作 localStorage 或 fetch。
 *
 * 設計原則：
 * - 官方關卡（靜態 JSON）唯讀，永不修改。
 * - 玩家編輯一律發生在 localStorage 副本上。
 * - 版本以關卡 JSON 內的 `version` 欄位為準。
 */

export type ScenarioSource = 'official' | 'custom'

export type StoredScenario = {
  id: string
  source: ScenarioSource
  /** 官方關卡的來源版本；custom 關卡為 undefined。 */
  sourceVersion?: string
  /** 玩家是否修改過此副本（自訂關卡恆為 true）。 */
  modified: boolean
  scenario: ScenarioDefinition
}

/** localStorage 存一個 map：{ [id]: StoredScenario }。 */
export type StoredScenarioMap = Record<string, StoredScenario>

export type OfficialScenarioIndex = {
  version: string
  scenarios: Array<{ id: string; file: string; version: string }>
}

export const SCENARIO_COPIES_STORAGE_KEY = 'mygame2.scenario-copies'
export const SCENARIO_INDEX_PATH = 'data/scenarios/index.json'

/** 官方關卡 JSON 的基礎路徑（相對於 public/）。 */
export const SCENARIO_BASE_PATH = 'data/scenarios'

/** 讀取官方關卡清單（fetch index.json）。 */
export async function fetchOfficialScenarioIndex(): Promise<OfficialScenarioIndex> {
  const response = await fetch(`${SCENARIO_BASE_PATH}/index.json`)
  if (!response.ok) {
    throw new Error(`無法讀取官方關卡清單：HTTP ${response.status}`)
  }
  return (await response.json()) as OfficialScenarioIndex
}

/** 讀取單一官方關卡 JSON。 */
export async function fetchOfficialScenario(file: string): Promise<ScenarioDefinition> {
  const response = await fetch(`${SCENARIO_BASE_PATH}/${file}`)
  if (!response.ok) {
    throw new Error(`無法讀取官方關卡 ${file}：HTTP ${response.status}`)
  }
  return (await response.json()) as ScenarioDefinition
}

/** 讀取 localStorage 所有副本（含型別校驗，失敗回 {}）。 */
export function getStoredScenarios(): StoredScenarioMap {
  try {
    const raw = localStorage.getItem(SCENARIO_COPIES_STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {}
    const map: StoredScenarioMap = {}
    for (const [id, value] of Object.entries(parsed as Record<string, unknown>)) {
      if (isValidStoredScenario(value)) {
        map[id] = value
      }
    }
    return map
  } catch {
    return {}
  }
}

/** 儲存 / 更新一個副本。 */
export function saveStoredScenario(entry: StoredScenario): void {
  const map = getStoredScenarios()
  map[entry.id] = entry
  localStorage.setItem(SCENARIO_COPIES_STORAGE_KEY, JSON.stringify(map))
}

/** 刪除一個副本。 */
export function deleteStoredScenario(id: string): void {
  const map = getStoredScenarios()
  delete map[id]
  localStorage.setItem(SCENARIO_COPIES_STORAGE_KEY, JSON.stringify(map))
}

/** 產生一個不與既有 id 衝突的自訂關卡 id（`custom-` 前綴 + 時間戳）。 */
export function generateCustomScenarioId(): string {
  const existing = getStoredScenarios()
  let id = ''
  do {
    id = `custom-${Date.now()}-${Math.floor(Math.random() * 1000)}`
  } while (existing[id])
  return id
}

/**
 * 啟動時同步官方關卡：
 * 對每個官方關卡，若無副本則建立；若有副本則回傳版本差異供 UI 提示。
 *
 * 回傳：
 * - scenarios：同步後的完整副本 map（含官方副本與既有自訂關卡）。
 * - outdated：官方版本比副本新的關卡清單（供 UI 提示三選一）。
 */
export async function syncOfficialScenarios(): Promise<{
  scenarios: StoredScenarioMap
  outdated: Array<{ official: ScenarioDefinition; stored: StoredScenario }>
}> {
  const index = await fetchOfficialScenarioIndex()
  const stored = getStoredScenarios()
  const outdated: Array<{ official: ScenarioDefinition; stored: StoredScenario }> = []

  for (const entry of index.scenarios) {
    const official = await fetchOfficialScenario(entry.file)
    const existing = stored[entry.id]
    if (!existing) {
      // 無副本 → 建立官方副本。
      stored[entry.id] = {
        id: entry.id,
        source: 'official',
        sourceVersion: official.version,
        modified: false,
        scenario: official,
      }
    } else if (existing.source === 'official' && existing.sourceVersion !== official.version) {
      // 官方版本更新 → 標記 outdated，保留副本供 UI 提示。
      outdated.push({ official, stored: existing })
    }
  }

  localStorage.setItem(SCENARIO_COPIES_STORAGE_KEY, JSON.stringify(stored))
  return { scenarios: stored, outdated }
}

/** 以官方新版覆蓋副本（「重置為官方新版」）。 */
export function resetStoredScenarioToOfficial(stored: StoredScenario, official: ScenarioDefinition): StoredScenario {
  const updated: StoredScenario = {
    ...stored,
    sourceVersion: official.version,
    modified: false,
    scenario: official,
  }
  saveStoredScenario(updated)
  return updated
}

/** 將舊副本另存為自訂關卡（「另存為自訂關卡」）。 */
export function saveAsCustomScenario(stored: StoredScenario): StoredScenario {
  const custom: StoredScenario = {
    id: generateCustomScenarioId(),
    source: 'custom',
    modified: true,
    scenario: stored.scenario,
  }
  saveStoredScenario(custom)
  return custom
}

function isValidStoredScenario(value: unknown): value is StoredScenario {
  if (!value || typeof value !== 'object') return false
  const candidate = value as Partial<StoredScenario>
  return (
    typeof candidate.id === 'string' &&
    (candidate.source === 'official' || candidate.source === 'custom') &&
    typeof candidate.modified === 'boolean' &&
    !!candidate.scenario &&
    typeof candidate.scenario === 'object'
  )
}
