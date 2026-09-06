/**
 * 五行元素展示資料：用於在世界狀態卡顯示「相生／相剋」循環圖標，
 * 提示玩家如何構築功法（內功元素生外功元素 → 相生連攜；外功元素克目標 → 相剋）。
 *
 * 五行順序（相生環）：木 → 火 → 土 → 金 → 水 → 木
 * 五行相剋（每個元素克一個）：金克木、木克土、土克水、水克火、火克金
 */

import type { SchoolElement } from '../catalogs/skillProgressionCatalog'

export type FiveElementMeta = {
  key: Exclude<SchoolElement, 'none'>
  label: string
  /** 元素對應的擬人化圖示字元。 */
  icon: string
  /** 用於圓點配色（與既有五行技能卡片色系一致）。 */
  color: string
  /** 被此元素「相生」的元素（即此元素 → 生 → next）。 */
  generates: Exclude<SchoolElement, 'none'>
  /** 被此元素「相剋」的元素（即此元素 → 克 → counters）。 */
  counters: Exclude<SchoolElement, 'none'>
}

/** 依相生循環排列的五元素：木 → 火 → 土 → 金 → 水 → 木。 */
export const FIVE_ELEMENTS: FiveElementMeta[] = [
  { key: 'wood', label: '木', icon: '🌿', color: '#4ade80', generates: 'fire', counters: 'earth' },
  { key: 'fire', label: '火', icon: '🔥', color: '#f87171', generates: 'earth', counters: 'metal' },
  { key: 'earth', label: '土', icon: '🏔️', color: '#fbbf24', generates: 'metal', counters: 'water' },
  { key: 'metal', label: '金', icon: '⚜️', color: '#eab308', generates: 'water', counters: 'wood' },
  { key: 'water', label: '水', icon: '💧', color: '#60a5fa', generates: 'wood', counters: 'fire' },
]

/** 依元素 key 快速查詢。 */
export const FIVE_ELEMENT_BY_KEY: Record<FiveElementMeta['key'], FiveElementMeta> = Object.fromEntries(
  FIVE_ELEMENTS.map((meta) => [meta.key, meta]),
) as Record<FiveElementMeta['key'], FiveElementMeta>

/** 依相剋循環排列的五元素：金→木→土→水→火→金（每個元素「克」後者，最後火克金閉合回金）。 */
export const FIVE_ELEMENTS_COUNTERS_CYCLE: FiveElementMeta[] = (() => {
  const start = FIVE_ELEMENT_BY_KEY.metal
  const result: FiveElementMeta[] = []
  let current: FiveElementMeta = start
  do {
    result.push(current)
    current = FIVE_ELEMENT_BY_KEY[current.counters]
  } while (current.key !== start.key)
  return result
})()