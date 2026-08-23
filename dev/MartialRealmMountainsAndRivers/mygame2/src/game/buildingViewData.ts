import type { BaseBuilding } from './catalogs/buildingCatalog'
import { BUILDING_TYPES } from './catalogs/buildingCatalog'

export const baseBuildingIcons: Record<string, string> = {
  [BUILDING_TYPES.BOARD]: '📜',
  [BUILDING_TYPES.WALL]: '🧱',
  [BUILDING_TYPES.BARRACKS]: '🛡️',
  [BUILDING_TYPES.WAREHOUSE]: '📦',
  [BUILDING_TYPES.WORKSHOP]: '🔧',
  [BUILDING_TYPES.INFIRMARY]: '🏥',
}

export function getBaseBuildingIcon(building: BaseBuilding): string {
  return baseBuildingIcons[building.type] ?? '🏗️'
}
