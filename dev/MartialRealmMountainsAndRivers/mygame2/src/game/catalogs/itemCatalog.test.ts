import { describe, expect, it } from 'vitest'
import { itemCatalog } from './itemCatalog'
import { buffCatalog } from './buffCatalog'

describe('高階道具 catalog', () => {
  it('包含 Lv.3 至 Lv.5 道具', () => {
    const highLevelItems = itemCatalog.filter((item) => item.requiredShopLevel >= 3)
    expect(highLevelItems.length).toBeGreaterThanOrEqual(8)
    expect(new Set(highLevelItems.map((item) => item.requiredShopLevel))).toEqual(new Set([3, 4, 5]))
  })

  it('所有 Buff 道具都對應有效 Buff 定義', () => {
    for (const item of itemCatalog.filter((candidate) => candidate.effect === 'buff')) {
      expect(buffCatalog.some((buff) => buff.id === item.buffDefinitionId)).toBe(true)
    }
  })
    it('所有道具都有分類，元素爆發道具統一歸類', () => {
      expect(itemCatalog.every((item) => item.category !== undefined)).toBe(true)
      expect(itemCatalog.filter((item) => item.effect === 'element-burst').every((item) => item.category === 'element-burst')).toBe(true)
    })
})