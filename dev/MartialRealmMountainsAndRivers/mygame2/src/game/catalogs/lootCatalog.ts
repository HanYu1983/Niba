import { itemCatalog } from './itemCatalog'
import { equipmentCatalog } from './equipmentCatalog'

export type LootDefinition =
  | { kind: 'item'; itemId: string; weight: number }
  | { kind: 'equipment'; equipmentId: string; weight: number }
  | { kind: 'skill'; skillId: string; skillType: 'inner' | 'external'; weight: number }

export const lootCatalog: LootDefinition[] = []

/** 道具點專用掉落池：包含所有道具與裝備，不包含功法。 */
export const itemPointLootCatalog: LootDefinition[] = [
  ...itemCatalog
    .filter((item) => (item.requiredShopLevel ?? 1) <= 2)
    .map((item) => ({ kind: 'item' as const, itemId: item.id, weight: 20 })),
  ...equipmentCatalog
    .filter((equipment) => !equipment.schoolId && equipment.requiredShopLevel <= 2)
    .map((equipment) => ({ kind: 'equipment' as const, equipmentId: equipment.id, weight: 10 })),
]