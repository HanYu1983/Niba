import type { TerrainType } from '../types'
import type { LootDefinition } from './lootCatalog'
import { itemCatalog } from './itemCatalog'
import { equipmentCatalog } from './equipmentCatalog'

/** 地形特產掉落池；每件道具與裝備只歸入一個主要地形。 */
export const terrainItemPointLootCatalog: Partial<Record<TerrainType, LootDefinition[]>> = {
  plain: createTerrainLoot(
    ['heal-wound-medicine', 'great-return-pill', 'return-heaven-pill', 'nine-turn-return-heaven-pill', 'scout-talisman', 'warn-gong-talisman', 'falling-rock-talisman', 'mountain-collapse-talisman', 'earth-split-talisman', 'suppress-mountain-talisman', 'great-strength-pill'],
    ['iron-sword', 'bronze-blade', 'traveling-robe', 'jade-pendant', 'iron-ring'],
  ),
  forest: createTerrainLoot(
    ['recover-qi-pill', 'true-qi-return-yuan-pill', 'qi-sea-pill', 'hunyuan-qi-pill', 'gather-qi-talisman', 'hobble-rope', 'green-wood-talisman', 'bind-wood-talisman', 'forest-luo-talisman', 'azure-emperor-wood-talisman', 'light-body-pill', 'clear-mind-pill'],
    ['bamboo-staff', 'swift-boots', 'insight-talisman', 'spirit-bracelet', 'celestial-robe'],
  ),
  mountain: createTerrainLoot(
    ['immobilize-rope', 'recall-base-talisman', 'extend-life-pill', 'gold-glint-talisman', 'sharp-metal-talisman', 'armor-break-talisman', 'taibai-break-army-talisman'],
    ['fine-steel-sword', 'chain-mail', 'thunder-spear', 'divine-sword', 'immortal-armor'],
  ),
  water: createTerrainLoot(
    ['condense-yuan-pill', 'gather-qi-pill', 'gather-yuan-pill', 'true-yuan-pill', 'taixu-condense-yuan-pill', 'cold-ice-needle', 'mystic-ice-needle', 'ice-soul-needle', 'frost-doom-needle', 'calm-spirit-pill'],
    ['spirit-wand', 'cloth-robe', 'frost-blade', 'moon-pendant'],
  ),
  desert: createTerrainLoot(
    ['burn-blood-pill', 'devour-soul-talisman', 'exchange-spirit-talisman', 'split-vein-talisman', 'return-light-jade', 'fire-thunder-talisman', 'blaze-talisman', 'inferno-talisman', 'sky-burning-fire-talisman'],
    ['leather-armor', 'dragon-scale-armor', 'phoenix-ring', 'soul-jade'],
  ),
}

function getCatalogWeight(requiredLevel: number): number {
  return Math.max(1, 12 - requiredLevel * 2)
}

function createTerrainLoot(itemIds: string[], equipmentIds: string[]): LootDefinition[] {
  const itemLoot = itemIds.flatMap((itemId) => {
    const item = itemCatalog.find((candidate) => candidate.id === itemId)
    return item ? [{ kind: 'item' as const, itemId, weight: getCatalogWeight(item.requiredShopLevel) }] : []
  })
  const equipmentLoot = equipmentIds.flatMap((equipmentId) => {
    const equipment = equipmentCatalog.find((candidate) => candidate.id === equipmentId)
    return equipment ? [{ kind: 'equipment' as const, equipmentId, weight: getCatalogWeight(equipment.requiredShopLevel) }] : []
  })
  return [...itemLoot, ...equipmentLoot]
}
