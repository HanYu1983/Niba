import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  SCENARIO_COPIES_STORAGE_KEY,
  deleteStoredScenario,
  generateCustomScenarioId,
  getStoredScenarios,
  resetStoredScenarioToOfficial,
  saveAsCustomScenario,
  saveStoredScenario,
  syncOfficialScenarios,
  type StoredScenario,
} from './scenarioStorage'
import type { ScenarioDefinition } from '../editor/editorTypes'

function makeScenario(overrides: Partial<ScenarioDefinition> = {}): ScenarioDefinition {
  return {
    version: '1.0.0',
    id: 'prologue-village',
    title: '序章：青石遺恨',
    description: '',
    chapterIndex: 0,
    mapSize: { rows: 10, columns: 10 },
    cells: [],
    entities: [],
    quests: { victoryObjectives: [], failConditions: {} },
    dialogues: {},
    ...overrides,
  }
}

function makeStored(overrides: Partial<StoredScenario> = {}): StoredScenario {
  return {
    id: 'prologue-village',
    source: 'official',
    sourceVersion: '1.0.0',
    modified: false,
    scenario: makeScenario(),
    ...overrides,
  }
}

function stubLocalStorage() {
  const values = new Map<string, string>()
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, next: string) => { values.set(key, next) },
    removeItem: (key: string) => { values.delete(key) },
    clear: () => { values.clear() },
  })
}

describe('scenarioStorage 副本持久化', () => {
  beforeEach(() => {
    stubLocalStorage()
  })

  it('預設無副本', () => {
    expect(getStoredScenarios()).toEqual({})
  })

  it('可儲存並讀取副本', () => {
    const entry = makeStored()
    saveStoredScenario(entry)
    const map = getStoredScenarios()
    expect(map['prologue-village']).toEqual(entry)
  })

  it('可刪除副本', () => {
    saveStoredScenario(makeStored())
    deleteStoredScenario('prologue-village')
    expect(getStoredScenarios()).toEqual({})
  })

  it('讀取損壞資料時回傳空 map', () => {
    localStorage.setItem(SCENARIO_COPIES_STORAGE_KEY, 'not-json')
    expect(getStoredScenarios()).toEqual({})
  })

  it('過濾掉型別不合法的副本', () => {
    localStorage.setItem(
      SCENARIO_COPIES_STORAGE_KEY,
      JSON.stringify({
        good: makeStored(),
        bad: { id: 'bad', source: 'unknown', modified: false, scenario: null },
      }),
    )
    const map = getStoredScenarios()
    expect(Object.keys(map)).toEqual(['good'])
  })
})

describe('generateCustomScenarioId', () => {
  it('產生 custom- 前綴的 id', () => {
    expect(generateCustomScenarioId().startsWith('custom-')).toBe(true)
  })

  it('產生的 id 不與既有副本衝突', () => {
    saveStoredScenario(makeStored())
    const id = generateCustomScenarioId()
    expect(id).not.toBe('prologue-village')
  })
})

describe('resetStoredScenarioToOfficial', () => {
  it('以官方新版覆蓋副本並重設 modified', () => {
    const stored = makeStored({ modified: true, sourceVersion: '1.0.0' })
    const official = makeScenario({ version: '1.1.0' })
    const updated = resetStoredScenarioToOfficial(stored, official)
    expect(updated.sourceVersion).toBe('1.1.0')
    expect(updated.modified).toBe(false)
    expect(updated.scenario.version).toBe('1.1.0')
    expect(getStoredScenarios()['prologue-village'].sourceVersion).toBe('1.1.0')
  })
})

describe('saveAsCustomScenario', () => {
  it('將副本另存為自訂關卡', () => {
    const stored = makeStored()
    const custom = saveAsCustomScenario(stored)
    expect(custom.source).toBe('custom')
    expect(custom.modified).toBe(true)
    expect(custom.id.startsWith('custom-')).toBe(true)
    expect(getStoredScenarios()[custom.id]).toEqual(custom)
  })
})

describe('syncOfficialScenarios', () => {
  beforeEach(() => {
    stubLocalStorage()
    vi.stubGlobal('fetch', vi.fn())
  })

  it('無副本時建立官方副本', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ version: '1.0.0', scenarios: [{ id: 'prologue-village', file: 'prologue-village.json', version: '1.0.0' }] }),
    } as Response)
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => makeScenario(),
    } as Response)

    const result = await syncOfficialScenarios()
    expect(result.scenarios['prologue-village'].source).toBe('official')
    expect(result.scenarios['prologue-village'].sourceVersion).toBe('1.0.0')
    expect(result.outdated).toEqual([])
  })

  it('版本相同時不標記 outdated', async () => {
    saveStoredScenario(makeStored())
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ version: '1.0.0', scenarios: [{ id: 'prologue-village', file: 'prologue-village.json', version: '1.0.0' }] }),
    } as Response)
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => makeScenario(),
    } as Response)

    const result = await syncOfficialScenarios()
    expect(result.outdated).toEqual([])
    expect(result.scenarios['prologue-village'].modified).toBe(false)
  })

  it('官方版本更新時標記 outdated', async () => {
    saveStoredScenario(makeStored({ sourceVersion: '1.0.0' }))
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ version: '1.0.0', scenarios: [{ id: 'prologue-village', file: 'prologue-village.json', version: '1.1.0' }] }),
    } as Response)
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => makeScenario({ version: '1.1.0' }),
    } as Response)

    const result = await syncOfficialScenarios()
    expect(result.outdated).toHaveLength(1)
    expect(result.outdated[0].official.version).toBe('1.1.0')
    expect(result.outdated[0].stored.sourceVersion).toBe('1.0.0')
  })

  it('保留既有自訂關卡', async () => {
    saveStoredScenario(makeStored({ id: 'custom-1', source: 'custom', modified: true }))
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ version: '1.0.0', scenarios: [] }),
    } as Response)

    const result = await syncOfficialScenarios()
    expect(result.scenarios['custom-1'].source).toBe('custom')
  })
})
