import type { GameSettings, TerrainWeights } from './types'
import { DEFAULT_TERRAIN_WEIGHTS } from './worldGeneration'

/** 模板不含 seed，套用時另行隨機產生。 */
export type MapTemplateSettings = Omit<GameSettings, 'seed'>

/**
 * 挑戰關卡參數表：Lv1（簡單）到 Lv20（極度困難）共二十級。
 * 取值對照 handev/difficulty-metrics-guide.md §4.1 沙盒開局模版配方：
 * 加難軸＝守城數／巢穴數／初始怪數隨等級遞增；
 * 減難軸＝資源點／道具點／廢墟／門派據點與探索事件遞減；
 * 地形由草原曠野轉為山嶽水域偏重，提高體力成本壓縮玩家有效行動。
 */
const CHALLENGE_LEVEL_DEFS: {
  level: number
  title: string
  tier: string
  rows: number
  columns: number
  baseCount: number
  nestCount: number
  creatureCount: number
  resourcePointCount: number
  itemPointCount: number
  explorationEventCount: number
  explorationTriggerChance: number
  ruinCount: number
  sectGateCount: number
  terrainWeights: TerrainWeights
}[] = [
  { level: 1, title: '初出茅廬', tier: '簡單', rows: 15, columns: 15, baseCount: 1, nestCount: 1, creatureCount: 0, resourcePointCount: 8, itemPointCount: 24, explorationEventCount: 5, explorationTriggerChance: 0.1, ruinCount: 24, sectGateCount: 4, terrainWeights: { plain: 52, forest: 18, water: 8, mountain: 13, desert: 9 } },
  { level: 2, title: '小試身手', tier: '簡單', rows: 15, columns: 15, baseCount: 1, nestCount: 1, creatureCount: 2, resourcePointCount: 8, itemPointCount: 22, explorationEventCount: 5, explorationTriggerChance: 0.1, ruinCount: 22, sectGateCount: 4, terrainWeights: { plain: 52, forest: 18, water: 8, mountain: 13, desert: 9 } },
  { level: 3, title: '牛刀小試', tier: '簡單', rows: 15, columns: 15, baseCount: 1, nestCount: 2, creatureCount: 4, resourcePointCount: 8, itemPointCount: 20, explorationEventCount: 4, explorationTriggerChance: 0.1, ruinCount: 20, sectGateCount: 4, terrainWeights: { plain: 52, forest: 18, water: 8, mountain: 13, desert: 9 } },
  { level: 4, title: '初露崢嶸', tier: '簡單', rows: 18, columns: 18, baseCount: 1, nestCount: 2, creatureCount: 6, resourcePointCount: 7, itemPointCount: 20, explorationEventCount: 4, explorationTriggerChance: 0.1, ruinCount: 18, sectGateCount: 4, terrainWeights: { plain: 52, forest: 18, water: 8, mountain: 13, desert: 9 } },
  { level: 5, title: '行走江湖', tier: '普通', rows: 18, columns: 18, baseCount: 1, nestCount: 2, creatureCount: 9, resourcePointCount: 7, itemPointCount: 18, explorationEventCount: 4, explorationTriggerChance: 0.1, ruinCount: 16, sectGateCount: 4, terrainWeights: { plain: 52, forest: 18, water: 8, mountain: 13, desert: 9 } },
  { level: 6, title: '風波漸起', tier: '普通', rows: 18, columns: 18, baseCount: 2, nestCount: 3, creatureCount: 11, resourcePointCount: 7, itemPointCount: 18, explorationEventCount: 4, explorationTriggerChance: 0.1, ruinCount: 16, sectGateCount: 4, terrainWeights: { plain: 38, forest: 20, water: 12, mountain: 18, desert: 12 } },
  { level: 7, title: '群魔亂舞', tier: '普通', rows: 20, columns: 20, baseCount: 2, nestCount: 3, creatureCount: 13, resourcePointCount: 6, itemPointCount: 18, explorationEventCount: 3, explorationTriggerChance: 0.1, ruinCount: 14, sectGateCount: 3, terrainWeights: { plain: 38, forest: 20, water: 12, mountain: 18, desert: 12 } },
  { level: 8, title: '山雨欲來', tier: '普通', rows: 20, columns: 20, baseCount: 2, nestCount: 3, creatureCount: 15, resourcePointCount: 6, itemPointCount: 16, explorationEventCount: 3, explorationTriggerChance: 0.08, ruinCount: 14, sectGateCount: 3, terrainWeights: { plain: 38, forest: 20, water: 12, mountain: 18, desert: 12 } },
  { level: 9, title: '兵臨城下', tier: '困難', rows: 20, columns: 20, baseCount: 2, nestCount: 4, creatureCount: 17, resourcePointCount: 6, itemPointCount: 16, explorationEventCount: 3, explorationTriggerChance: 0.08, ruinCount: 12, sectGateCount: 3, terrainWeights: { plain: 38, forest: 20, water: 12, mountain: 18, desert: 12 } },
  { level: 10, title: '血戰荒原', tier: '困難', rows: 25, columns: 25, baseCount: 3, nestCount: 4, creatureCount: 19, resourcePointCount: 6, itemPointCount: 16, explorationEventCount: 3, explorationTriggerChance: 0.08, ruinCount: 12, sectGateCount: 3, terrainWeights: { plain: 38, forest: 20, water: 12, mountain: 18, desert: 12 } },
  { level: 11, title: '危機四伏', tier: '困難', rows: 25, columns: 25, baseCount: 3, nestCount: 4, creatureCount: 21, resourcePointCount: 6, itemPointCount: 14, explorationEventCount: 2, explorationTriggerChance: 0.06, ruinCount: 10, sectGateCount: 2, terrainWeights: { plain: 28, forest: 20, water: 15, mountain: 22, desert: 15 } },
  { level: 12, title: '烽煙四起', tier: '困難', rows: 25, columns: 25, baseCount: 3, nestCount: 5, creatureCount: 23, resourcePointCount: 5, itemPointCount: 14, explorationEventCount: 2, explorationTriggerChance: 0.06, ruinCount: 10, sectGateCount: 2, terrainWeights: { plain: 28, forest: 20, water: 15, mountain: 22, desert: 15 } },
  { level: 13, title: '十面埋伏', tier: '困難', rows: 30, columns: 30, baseCount: 3, nestCount: 5, creatureCount: 25, resourcePointCount: 5, itemPointCount: 12, explorationEventCount: 2, explorationTriggerChance: 0.05, ruinCount: 8, sectGateCount: 2, terrainWeights: { plain: 28, forest: 20, water: 15, mountain: 22, desert: 15 } },
  { level: 14, title: '孤城落日', tier: '地獄', rows: 30, columns: 30, baseCount: 3, nestCount: 5, creatureCount: 27, resourcePointCount: 5, itemPointCount: 12, explorationEventCount: 2, explorationTriggerChance: 0.05, ruinCount: 6, sectGateCount: 1, terrainWeights: { plain: 28, forest: 20, water: 15, mountain: 22, desert: 15 } },
  { level: 15, title: '妖氛蔽日', tier: '地獄', rows: 30, columns: 30, baseCount: 4, nestCount: 5, creatureCount: 29, resourcePointCount: 5, itemPointCount: 10, explorationEventCount: 1, explorationTriggerChance: 0.05, ruinCount: 6, sectGateCount: 1, terrainWeights: { plain: 28, forest: 20, water: 15, mountain: 22, desert: 15 } },
  { level: 16, title: '九死一生', tier: '地獄', rows: 35, columns: 35, baseCount: 4, nestCount: 6, creatureCount: 31, resourcePointCount: 4, itemPointCount: 10, explorationEventCount: 1, explorationTriggerChance: 0.04, ruinCount: 4, sectGateCount: 1, terrainWeights: { plain: 28, forest: 20, water: 15, mountain: 22, desert: 15 } },
  { level: 17, title: '步步驚心', tier: '地獄', rows: 35, columns: 35, baseCount: 4, nestCount: 6, creatureCount: 34, resourcePointCount: 4, itemPointCount: 8, explorationEventCount: 1, explorationTriggerChance: 0.03, ruinCount: 4, sectGateCount: 0, terrainWeights: { plain: 20, forest: 17, water: 18, mountain: 26, desert: 19 } },
  { level: 18, title: '修羅煉獄', tier: '極度困難', rows: 40, columns: 40, baseCount: 5, nestCount: 7, creatureCount: 37, resourcePointCount: 4, itemPointCount: 8, explorationEventCount: 1, explorationTriggerChance: 0.02, ruinCount: 2, sectGateCount: 0, terrainWeights: { plain: 20, forest: 17, water: 18, mountain: 26, desert: 19 } },
  { level: 19, title: '天地無光', tier: '極度困難', rows: 45, columns: 45, baseCount: 5, nestCount: 8, creatureCount: 40, resourcePointCount: 3, itemPointCount: 6, explorationEventCount: 0, explorationTriggerChance: 0.01, ruinCount: 2, sectGateCount: 0, terrainWeights: { plain: 20, forest: 17, water: 18, mountain: 26, desert: 19 } },
  { level: 20, title: '玄冥降世', tier: '極度困難', rows: 50, columns: 50, baseCount: 6, nestCount: 10, creatureCount: 44, resourcePointCount: 3, itemPointCount: 6, explorationEventCount: 0, explorationTriggerChance: 0, ruinCount: 0, sectGateCount: 0, terrainWeights: { plain: 20, forest: 17, water: 18, mountain: 26, desert: 19 } },
]

/** 挑戰關卡模板（Lv1～Lv20），供開局選單獨立分組顯示。 */
export const CHALLENGE_TEMPLATES: MapTemplate[] = CHALLENGE_LEVEL_DEFS.map((def) => ({
  id: `challenge-${String(def.level).padStart(2, '0')}`,
  name: `挑戰 Lv${def.level}：${def.title}（${def.tier}）`,
  builtin: true,
  settings: {
    rows: def.rows,
    columns: def.columns,
    baseCount: def.baseCount,
    nestCount: def.nestCount,
    resourcePointCount: def.resourcePointCount,
    itemPointCount: def.itemPointCount,
    playerCount: 1,
    aiPlayerCount: 0,
    explorationEventCount: def.explorationEventCount,
    explorationTriggerChance: def.explorationTriggerChance,
    creatureCount: def.creatureCount,
    ruinCount: def.ruinCount,
    sectGateCount: def.sectGateCount,
    terrainWeights: { ...def.terrainWeights },
  },
}))

export type MapTemplate = {
  id: string
  name: string
  builtin: boolean
  settings: MapTemplateSettings
}

export const BUILTIN_TEMPLATES: MapTemplate[] = [
  {
    id: 'standard',
    name: '入門地圖',
    builtin: true,
    settings: {
      rows: 15,
      columns: 15,
      baseCount: 1,
      nestCount: 3,
      resourcePointCount: 3,
      itemPointCount: 20,
      playerCount: 1,
      aiPlayerCount: 0,
      explorationEventCount: 0,
      explorationTriggerChance: 0.1,
      creatureCount: 10,
      ruinCount: 20,
      sectGateCount: 4,
      terrainWeights: { ...DEFAULT_TERRAIN_WEIGHTS },
    },
  },
  {
    id: 'standard-1',
    name: '入門地圖-雙城守護',
    builtin: true,
    settings: {
      rows: 15,
      columns: 15,
      baseCount: 2,
      nestCount: 4,
      resourcePointCount: 5,
      itemPointCount: 20,
      playerCount: 1,
      aiPlayerCount: 0,
      explorationEventCount: 0,
      explorationTriggerChance: 0.1,
      creatureCount: 10,
      ruinCount: 20,
      sectGateCount: 4,
      terrainWeights: { ...DEFAULT_TERRAIN_WEIGHTS },
    },
  },
  {
    id: 'standard-2',
    name: '標準雙人',
    builtin: true,
    settings: {
      rows: 20,
      columns: 20,
      baseCount: 2,
      nestCount: 6,
      resourcePointCount: 6,
      itemPointCount: 40,
      playerCount: 2,
      aiPlayerCount: 0,
      explorationEventCount: 0,
      explorationTriggerChance: 0.1,
      creatureCount: 20,
      ruinCount: 40,
      sectGateCount: 8,
      terrainWeights: { ...DEFAULT_TERRAIN_WEIGHTS },
    },
  },
  {
    id: 'scenario-forest',
    name: '情境：密林深處',
    builtin: true,
    settings: {
      rows: 18,
      columns: 18,
      baseCount: 1,
      nestCount: 5,
      resourcePointCount: 6,
      itemPointCount: 30,
      playerCount: 1,
      aiPlayerCount: 0,
      explorationEventCount: 6,
      explorationTriggerChance: 0.1,
      creatureCount: 14,
      ruinCount: 25,
      sectGateCount: 5,
      terrainWeights: { plain: 10, forest: 60, water: 8, mountain: 12, desert: 10 },
    },
  },
  {
    id: 'scenario-desert',
    name: '情境：荒漠求生',
    builtin: true,
    settings: {
      rows: 18,
      columns: 18,
      baseCount: 1,
      nestCount: 4,
      resourcePointCount: 4,
      itemPointCount: 25,
      playerCount: 1,
      aiPlayerCount: 0,
      explorationEventCount: 5,
      explorationTriggerChance: 0.1,
      creatureCount: 12,
      ruinCount: 30,
      sectGateCount: 4,
      terrainWeights: { plain: 15, forest: 5, water: 5, mountain: 15, desert: 60 },
    },
  },
  {
    id: 'scenario-mountain',
    name: '情境：崇山峻嶺',
    builtin: true,
    settings: {
      rows: 18,
      columns: 18,
      baseCount: 1,
      nestCount: 5,
      resourcePointCount: 5,
      itemPointCount: 25,
      playerCount: 1,
      aiPlayerCount: 0,
      explorationEventCount: 5,
      explorationTriggerChance: 0.1,
      creatureCount: 13,
      ruinCount: 28,
      sectGateCount: 5,
      terrainWeights: { plain: 10, forest: 15, water: 10, mountain: 55, desert: 10 },
    },
  },
  {
    id: 'scenario-water',
    name: '情境：湖澤環繞',
    builtin: true,
    settings: {
      rows: 18,
      columns: 18,
      baseCount: 1,
      nestCount: 4,
      resourcePointCount: 7,
      itemPointCount: 28,
      playerCount: 1,
      aiPlayerCount: 0,
      explorationEventCount: 6,
      explorationTriggerChance: 0.1,
      creatureCount: 10,
      ruinCount: 20,
      sectGateCount: 4,
      terrainWeights: { plain: 15, forest: 15, water: 55, mountain: 5, desert: 10 },
    },
  },
  {
    id: 'scenario-plains',
    name: '情境：草原開拓',
    builtin: true,
    settings: {
      rows: 18,
      columns: 18,
      baseCount: 2,
      nestCount: 3,
      resourcePointCount: 8,
      itemPointCount: 30,
      playerCount: 1,
      aiPlayerCount: 0,
      explorationEventCount: 7,
      explorationTriggerChance: 0.1,
      creatureCount: 10,
      ruinCount: 15,
      sectGateCount: 5,
      terrainWeights: { plain: 70, forest: 10, water: 8, mountain: 6, desert: 6 },
    },
  },
  {
    id: 'scenario-fortress',
    name: '情境：要塞攻防',
    builtin: true,
    settings: {
      rows: 20,
      columns: 20,
      baseCount: 2,
      nestCount: 7,
      resourcePointCount: 6,
      itemPointCount: 32,
      playerCount: 1,
      aiPlayerCount: 0,
      explorationEventCount: 5,
      explorationTriggerChance: 0.1,
      creatureCount: 18,
      ruinCount: 35,
      sectGateCount: 6,
      terrainWeights: { plain: 30, forest: 20, water: 10, mountain: 25, desert: 15 },
    },
  },
  {
    id: 'scenario-sect',
    name: '情境：武林盛會',
    builtin: true,
    settings: {
      rows: 20,
      columns: 20,
      baseCount: 1,
      nestCount: 4,
      resourcePointCount: 6,
      itemPointCount: 30,
      playerCount: 1,
      aiPlayerCount: 0,
      explorationEventCount: 6,
      explorationTriggerChance: 0.1,
      creatureCount: 12,
      ruinCount: 20,
      sectGateCount: 6,
      terrainWeights: { plain: 30, forest: 20, water: 15, mountain: 20, desert: 15 },
    },
  },
  {
    id: 'scenario-resource',
    name: '情境：資源豐饒',
    builtin: true,
    settings: {
      rows: 18,
      columns: 18,
      baseCount: 1,
      nestCount: 3,
      resourcePointCount: 10,
      itemPointCount: 35,
      playerCount: 1,
      aiPlayerCount: 0,
      explorationEventCount: 7,
      explorationTriggerChance: 0.1,
      creatureCount: 8,
      ruinCount: 12,
      sectGateCount: 4,
      terrainWeights: { plain: 40, forest: 25, water: 15, mountain: 10, desert: 10 },
    },
  },
  {
    id: 'scenario-item',
    name: '情境：寶藏獵場',
    builtin: true,
    settings: {
      rows: 18,
      columns: 18,
      baseCount: 1,
      nestCount: 5,
      resourcePointCount: 5,
      itemPointCount: 45,
      playerCount: 1,
      aiPlayerCount: 0,
      explorationEventCount: 6,
      explorationTriggerChance: 0.1,
      creatureCount: 14,
      ruinCount: 25,
      sectGateCount: 4,
      terrainWeights: { plain: 25, forest: 25, water: 15, mountain: 20, desert: 15 },
    },
  },
  {
    id: 'scenario-ruin',
    name: '情境：廢墟遺跡',
    builtin: true,
    settings: {
      rows: 18,
      columns: 18,
      baseCount: 1,
      nestCount: 5,
      resourcePointCount: 5,
      itemPointCount: 28,
      playerCount: 1,
      aiPlayerCount: 0,
      explorationEventCount: 6,
      explorationTriggerChance: 0.1,
      creatureCount: 14,
      ruinCount: 60,
      sectGateCount: 5,
      terrainWeights: { plain: 20, forest: 20, water: 15, mountain: 25, desert: 20 },
    },
  },
  {
    id: 'scenario-creature',
    name: '情境：怪物橫行',
    builtin: true,
    settings: {
      rows: 20,
      columns: 20,
      baseCount: 1,
      nestCount: 8,
      resourcePointCount: 5,
      itemPointCount: 30,
      playerCount: 1,
      aiPlayerCount: 0,
      explorationEventCount: 5,
      explorationTriggerChance: 0.1,
      creatureCount: 25,
      ruinCount: 30,
      sectGateCount: 4,
      terrainWeights: { plain: 25, forest: 25, water: 15, mountain: 20, desert: 15 },
    },
  },
  ...CHALLENGE_TEMPLATES,
]

/** 產生 0–999999999 的隨機種子（沿用 seed 上限）。 */
export function randomSeed(): number {
  return Math.floor(Math.random() * 1_000_000_000)
}

export const CUSTOM_TEMPLATES_STORAGE_KEY = 'mygame2.custom-map-templates'
/** 記錄玩家最後選擇的模板 ID。 */
export const SELECTED_TEMPLATE_STORAGE_KEY = 'mygame2.selected-map-template'

/** 讀取玩家最後選擇的模板 ID；無記錄時回傳 undefined。 */
export function getSelectedTemplateId(): string | undefined {
  if (typeof localStorage === 'undefined') return undefined
  try {
    const stored = localStorage.getItem(SELECTED_TEMPLATE_STORAGE_KEY)
    return stored && typeof stored === 'string' ? stored : undefined
  } catch {
    return undefined
  }
}

/** 記錄玩家選擇的模板 ID。 */
export function saveSelectedTemplateId(templateId: string): void {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(SELECTED_TEMPLATE_STORAGE_KEY, templateId)
  } catch {
    // 儲存空間被停用或已滿時，忽略。
  }
}

function isValidTemplate(value: unknown): value is MapTemplate {
  if (!value || typeof value !== 'object') return false
  const t = value as Partial<MapTemplate>
  if (typeof t.id !== 'string' || typeof t.name !== 'string' || typeof t.builtin !== 'boolean') return false
  const s = t.settings as Partial<MapTemplateSettings> | undefined
  if (!s || typeof s !== 'object') return false
  const numericKeys: (keyof MapTemplateSettings)[] = [
    'rows', 'columns', 'baseCount', 'nestCount',
    'resourcePointCount', 'itemPointCount', 'playerCount', 'aiPlayerCount',
    'explorationEventCount', 'creatureCount', 'ruinCount', 'sectGateCount',
  ]
  // explorationTriggerChance 為選擇性欄位（0~1），若有則需是合法數字。
  const triggerChance = s.explorationTriggerChance
  if (triggerChance !== undefined && !(typeof triggerChance === 'number' && Number.isFinite(triggerChance))) return false
  // terrainWeights 為選擇性欄位，若有則每個地形權重需是非負數字。
  if (s.terrainWeights !== undefined && !isValidTerrainWeights(s.terrainWeights)) return false
  return numericKeys.every((key) => typeof s[key] === 'number' && Number.isFinite(s[key]))
}

function isValidTerrainWeights(value: unknown): value is TerrainWeights {
  if (!value || typeof value !== 'object') return false
  const weights = value as Partial<TerrainWeights>
  const keys: (keyof TerrainWeights)[] = ['plain', 'forest', 'water', 'mountain', 'desert']
  return keys.every((key) => typeof weights[key] === 'number' && Number.isFinite(weights[key]) && weights[key]! >= 0)
}

export function getCustomTemplates(): MapTemplate[] {
  if (typeof localStorage === 'undefined') return []
  try {
    const stored = JSON.parse(localStorage.getItem(CUSTOM_TEMPLATES_STORAGE_KEY) ?? '[]') as unknown
    if (!Array.isArray(stored)) return []
    return stored.filter(isValidTemplate)
  } catch {
    return []
  }
}

/** 檢查名稱是否與內建或既有自訂模板衝突。 */
export function isTemplateNameTaken(name: string, excludeId?: string): boolean {
  const trimmed = name.trim()
  if (!trimmed) return true
  if (BUILTIN_TEMPLATES.some((t) => t.name === trimmed)) return true
  return getCustomTemplates().some((t) => t.name === trimmed && t.id !== excludeId)
}

/** 儲存自訂模板；名稱衝突時回傳 false。 */
export function saveCustomTemplate(template: MapTemplate): boolean {
  if (typeof localStorage === 'undefined') return false
  if (isTemplateNameTaken(template.name, template.id)) return false
  try {
    const existing = getCustomTemplates()
    const next = [...existing, template]
    localStorage.setItem(CUSTOM_TEMPLATES_STORAGE_KEY, JSON.stringify(next))
    return true
  } catch {
    return false
  }
}

/** 刪除自訂模板；內建模板不可刪除。 */
export function deleteCustomTemplate(id: string): void {
  if (typeof localStorage === 'undefined') return
  try {
    const next = getCustomTemplates().filter((t) => t.id !== id)
    localStorage.setItem(CUSTOM_TEMPLATES_STORAGE_KEY, JSON.stringify(next))
  } catch {
    // 儲存空間被停用或已滿時，忽略。
  }
}