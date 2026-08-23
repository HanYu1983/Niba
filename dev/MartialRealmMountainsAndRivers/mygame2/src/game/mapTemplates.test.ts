import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  BUILTIN_TEMPLATES,
  CUSTOM_TEMPLATES_STORAGE_KEY,
  SELECTED_TEMPLATE_STORAGE_KEY,
  deleteCustomTemplate,
  getCustomTemplates,
  getSelectedTemplateId,
  isTemplateNameTaken,
  randomSeed,
  saveCustomTemplate,
  saveSelectedTemplateId,
  type MapTemplate,
} from './mapTemplates'

const LIMITS: Record<string, [number, number]> = {
  rows: [15, 80],
  columns: [15, 80],
  baseCount: [1, 12],
  nestCount: [0, 30],
  resourcePointCount: [0, 60],
  itemPointCount: [0, 60],
  playerCount: [1, 4],
  aiPlayerCount: [0, 8],
  explorationEventCount: [0, 60],
  creatureCount: [0, 60],
  ruinCount: [0, 60],
  sectGateCount: [0, 30],
}

function makeCustomTemplate(overrides: Partial<MapTemplate> = {}): MapTemplate {
  return {
    id: 'custom-test',
    name: '測試模板',
    builtin: false,
    settings: {
      rows: 30,
      columns: 30,
      baseCount: 3,
      nestCount: 2,
      resourcePointCount: 8,
      itemPointCount: 6,
      playerCount: 1,
      aiPlayerCount: 0,
      explorationEventCount: 4,
      creatureCount: 2,
      ruinCount: 8,
      sectGateCount: 2,
    },
    ...overrides,
  }
}

describe('內建模板', () => {
  it('提供內建模板（標準單人 / 標準雙人）', () => {
    expect(BUILTIN_TEMPLATES.length).toBeGreaterThanOrEqual(1)
    expect(BUILTIN_TEMPLATES[0].id).toBe('standard')
    expect(BUILTIN_TEMPLATES.every((t) => t.builtin === true)).toBe(true)
  })

  it('內建模板 id 不重複', () => {
    const ids = BUILTIN_TEMPLATES.map((t) => t.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('內建模板數值皆落在 InputNumber 的 min/max 範圍內', () => {
    for (const template of BUILTIN_TEMPLATES) {
      for (const [key, [min, max]] of Object.entries(LIMITS)) {
        const value = template.settings[key as keyof typeof template.settings]
        expect(value, `${template.name}.${key}`).toBeGreaterThanOrEqual(min)
        expect(value, `${template.name}.${key}`).toBeLessThanOrEqual(max)
      }
    }
  })

  it('內建模板不含 seed 欄位', () => {
    for (const template of BUILTIN_TEMPLATES) {
      expect('seed' in template.settings).toBe(false)
    }
  })
})

describe('randomSeed', () => {
  it('產生 0–999999999 的整數', () => {
    for (let i = 0; i < 100; i++) {
      const seed = randomSeed()
      expect(Number.isInteger(seed)).toBe(true)
      expect(seed).toBeGreaterThanOrEqual(0)
      expect(seed).toBeLessThanOrEqual(999999999)
    }
  })
})

describe('自訂模板持久化', () => {
  beforeEach(() => {
    const values = new Map<string, string>()
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, next: string) => { values.set(key, next) },
      removeItem: (key: string) => { values.delete(key) },
      clear: () => { values.clear() },
    })
  })

  it('預設無自訂模板', () => {
    expect(getCustomTemplates()).toEqual([])
  })

  it('可儲存並讀取自訂模板', () => {
    const template = makeCustomTemplate()
    expect(saveCustomTemplate(template)).toBe(true)
    const loaded = getCustomTemplates()
    expect(loaded).toHaveLength(1)
    expect(loaded[0]).toEqual(template)
  })

  it('名稱與內建模板衝突時拒絕儲存', () => {
    const template = makeCustomTemplate({ name: '入門地圖' })
    expect(saveCustomTemplate(template)).toBe(false)
    expect(getCustomTemplates()).toEqual([])
  })

  it('名稱與既有自訂模板衝突時拒絕儲存', () => {
    expect(saveCustomTemplate(makeCustomTemplate())).toBe(true)
    const duplicate = makeCustomTemplate({ id: 'custom-other', name: '測試模板' })
    expect(saveCustomTemplate(duplicate)).toBe(false)
    expect(getCustomTemplates()).toHaveLength(1)
  })

  it('isTemplateNameTaken 偵測內建與自訂名稱', () => {
    expect(isTemplateNameTaken('入門地圖')).toBe(true)
    expect(isTemplateNameTaken('')).toBe(true)
    expect(isTemplateNameTaken('   ')).toBe(true)
    expect(isTemplateNameTaken('全新名稱')).toBe(false)
    saveCustomTemplate(makeCustomTemplate())
    expect(isTemplateNameTaken('測試模板')).toBe(true)
  })

  it('可刪除自訂模板', () => {
    saveCustomTemplate(makeCustomTemplate())
    expect(getCustomTemplates()).toHaveLength(1)
    deleteCustomTemplate('custom-test')
    expect(getCustomTemplates()).toEqual([])
  })

  it('localStorage 內容損毀時回傳空陣列', () => {
    localStorage.setItem(CUSTOM_TEMPLATES_STORAGE_KEY, 'not-json')
    expect(getCustomTemplates()).toEqual([])
    localStorage.setItem(CUSTOM_TEMPLATES_STORAGE_KEY, JSON.stringify([{ id: 'bad' }]))
    expect(getCustomTemplates()).toEqual([])
  })

  it('可儲存並讀取所選模板 ID', () => {
    expect(getSelectedTemplateId()).toBeUndefined()
    saveSelectedTemplateId('scenario-forest')
    expect(getSelectedTemplateId()).toBe('scenario-forest')
  })

  it('所選模板 ID 儲存於專用 key', () => {
    saveSelectedTemplateId('scenario-desert')
    expect(localStorage.getItem(SELECTED_TEMPLATE_STORAGE_KEY)).toBe('scenario-desert')
  })
})