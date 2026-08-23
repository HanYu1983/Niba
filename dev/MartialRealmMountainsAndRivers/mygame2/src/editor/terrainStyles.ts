import type { TerrainType } from '../game/types'

/**
 * 地形樣式定義（唯一來源）。
 * 遊戲地圖與編輯器共用此定義，確保地形顏色與標籤一致。
 */
export const TERRAIN_STYLES: Record<TerrainType, { color: string; label: string; icon: string }> = {
  plain: { color: '#a8c686', label: '平原', icon: '🌾' },
  forest: { color: '#4f8f5a', label: '森林', icon: '🌲' },
  water: { color: '#3b82c4', label: '水域', icon: '🌊' },
  mountain: { color: '#8d8f9a', label: '山嶺', icon: '⛰️' },
  desert: { color: '#e0c07a', label: '沙漠', icon: '🏜️' },
  wall: { color: '#4b5563', label: '牆體', icon: '🧱' },
  road: { color: '#c9a86a', label: '道路', icon: '🛤️' },
}

/** 地形選項（供編輯器調色盤使用）。 */
export const TERRAIN_OPTIONS = Object.entries(TERRAIN_STYLES).map(([value, style]) => ({
  value: value as TerrainType,
  label: style.label,
  color: style.color,
  icon: style.icon,
}))
