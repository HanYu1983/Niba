import { describe, expect, it } from 'vitest'
import { equipmentCatalog } from './equipmentCatalog'

const ATTRIBUTE_KEYS = ['armStrength', 'constitution', 'agility', 'innerEnergy', 'insight'] as const

function modifierTotal(modifiers: Record<string, number>): number {
  return ATTRIBUTE_KEYS.reduce((sum, key) => sum + (modifiers[key] ?? 0), 0)
}

describe('equipmentCatalog 數值規則', () => {
  it('每個 requiredShopLevel 對應兩個屬性點（modifiers 總和 = requiredShopLevel × 2）', () => {
    for (const equipment of equipmentCatalog) {
      const expected = equipment.requiredShopLevel * 2
      expect(
        modifierTotal(equipment.modifiers as Record<string, number>),
        `${equipment.id} 屬性點應為 ${expected}`,
      ).toBe(expected)
    }
  })
    it('所有裝備都有與 slot 一致的分類', () => {
      expect(equipmentCatalog.every((equipment) => equipment.category === equipment.slot)).toBe(true)
    })

  it('buyPrice = requiredShopLevel × 30', () => {
    for (const equipment of equipmentCatalog) {
      const expected = equipment.requiredShopLevel * 30
      expect(equipment.buyPrice, `${equipment.id} 價格應為 ${expected}`).toBe(expected)
    }
  })
})
