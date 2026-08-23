import type { EquipmentSlot } from './catalogs/equipmentCatalog'
import type { PlayerAttributes, UpgradeableAttribute } from './types'
import { ATTRIBUTE_NAMES } from './types'

export const EQUIPMENT_SLOT_LABELS: Record<EquipmentSlot, string> = {
  weapon: '武器',
  armor: '防具',
  accessory: '配件',
}

export function formatEquipmentModifiers(modifiers: Partial<PlayerAttributes>): string {
  return Object.entries(modifiers)
    .map(([attribute, value]) => {
      const label = ATTRIBUTE_NAMES[attribute as UpgradeableAttribute] ?? attribute
      return `${label} ${value && value > 0 ? '+' : ''}${value}`
    })
    .join('、')
}
