import type { GameSettings, TerrainWeights } from './types'
import { DEFAULT_TERRAIN_WEIGHTS } from './worldGeneration'

export const DEFAULT_GAME_SETTINGS: GameSettings = {
  rows: 40,
  columns: 40,
  baseCount: 5,
  nestCount: 2,
  resourcePointCount: 15,
  itemPointCount: 8,
  playerCount: 1,
  aiPlayerCount: 0,
  explorationEventCount: 5,
  explorationTriggerChance: 0.2,
  creatureCount: 2,
  ruinCount: 10,
  sectGateCount: 3,
  terrainWeights: { ...DEFAULT_TERRAIN_WEIGHTS },
  seed: 20260803,
}

export const GAME_SETTINGS_STORAGE_KEY = 'mygame2.game-settings'

export function getSavedGameSettings(): GameSettings {
  if (typeof localStorage === 'undefined') return { ...DEFAULT_GAME_SETTINGS }

  try {
    const stored = JSON.parse(localStorage.getItem(GAME_SETTINGS_STORAGE_KEY) ?? 'null') as Partial<GameSettings> | null
    if (!stored || typeof stored !== 'object') return { ...DEFAULT_GAME_SETTINGS }

    const isValidNumber = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value)
    if (!isValidNumber(stored.rows) || !isValidNumber(stored.columns) || !isValidNumber(stored.baseCount) || !isValidNumber(stored.nestCount) || !isValidNumber(stored.resourcePointCount) || !isValidNumber(stored.itemPointCount) || !isValidNumber(stored.playerCount) || (stored.aiPlayerCount !== undefined && !isValidNumber(stored.aiPlayerCount)) || !isValidNumber(stored.explorationEventCount) || !isValidNumber(stored.creatureCount) || !isValidNumber(stored.ruinCount) || (stored.sectGateCount !== undefined && !isValidNumber(stored.sectGateCount)) || !isValidNumber(stored.seed)) {
      return { ...DEFAULT_GAME_SETTINGS }
    }

    const terrainWeights = parseTerrainWeights(stored.terrainWeights)

    return {
      rows: Math.round(stored.rows),
      columns: Math.round(stored.columns),
      baseCount: Math.round(stored.baseCount),
      nestCount: Math.round(stored.nestCount),
      resourcePointCount: Math.round(stored.resourcePointCount),
      itemPointCount: Math.round(stored.itemPointCount),
      playerCount: Math.min(4, Math.max(1, Math.round(stored.playerCount))),
      aiPlayerCount: Math.min(8, Math.max(0, Math.round(stored.aiPlayerCount ?? 0))),
      explorationEventCount: Math.max(0, Math.round(stored.explorationEventCount)),
      explorationTriggerChance: stored.explorationTriggerChance !== undefined && Number.isFinite(stored.explorationTriggerChance)
        ? Math.min(1, Math.max(0, stored.explorationTriggerChance))
        : DEFAULT_GAME_SETTINGS.explorationTriggerChance ?? 0.2,
      creatureCount: Math.max(0, Math.round(stored.creatureCount)),
      ruinCount: Math.max(0, Math.round(stored.ruinCount)),
      sectGateCount: Math.min(30, Math.max(0, Math.round(stored.sectGateCount ?? DEFAULT_GAME_SETTINGS.sectGateCount ?? 3))),
      terrainWeights,
      seed: Math.round(stored.seed),
    }
  } catch {
    return { ...DEFAULT_GAME_SETTINGS }
  }
}

/** 解析地形權重；缺欄位或非法時回退到預設值。 */
function parseTerrainWeights(value: unknown): TerrainWeights {
  const fallback = { ...DEFAULT_TERRAIN_WEIGHTS }
  if (!value || typeof value !== 'object') return fallback
  const weights = value as Partial<TerrainWeights>
  const keys: (keyof TerrainWeights)[] = ['plain', 'forest', 'water', 'mountain', 'desert']
  const parsed: TerrainWeights = { ...fallback }
  for (const key of keys) {
    const candidate = weights[key]
    if (typeof candidate === 'number' && Number.isFinite(candidate) && candidate >= 0) {
      parsed[key] = Math.round(candidate)
    }
  }
  return parsed
}

export function saveGameSettings(settings: GameSettings): void {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(GAME_SETTINGS_STORAGE_KEY, JSON.stringify(settings))
  } catch {
    // 儲存空間被停用或已滿時，遊戲仍可正常使用。
  }
}
