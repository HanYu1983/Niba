import type { BaseState, EquipmentInstance, PlayerState, RepairEquipmentPreview } from '../types'
import { isAdjacent } from '../types'
import { isBaseActive } from './baseRules'
import { getEquipment, getEquipmentInventory } from './playerDerivedRules'

export function hasBuilding(base: BaseState, buildingType: string): boolean {
  return isBaseActive(base) && base.buildings.some((building) => building.type === buildingType)
}

/** 取得據點修理工坊的等級；尚未建造或未指定等級時視為 1。 */
export function getWorkshopLevel(base: BaseState): number {
  if (!isBaseActive(base)) return 0
  const workshop = base.buildings.find((building) => building.type === 'workshop')
  return workshop?.level ?? 1
}

export function requiresAdjacentActivePlayer(base: BaseState, player: PlayerState | null): boolean {
  return Boolean(player && isAdjacent(player.position, base.position) && !player.turnEnded)
}

export function getRepairSummary(player: PlayerState, workshopLevel = 1): {
  equipmentCount: number
  durabilityRestored: number
  moneyCost: number
  repairedEquipment: RepairEquipmentPreview[]
  /** 因工坊等級不足而無法修理的裝備數量。 */
  lockedEquipmentCount: number
} {
  const equipment = getEquipmentInventory(player)
  const repairable = equipment.filter((instance) =>
    (getEquipment(instance.equipmentId)?.requiredShopLevel ?? 1) <= workshopLevel,
  )
  const lockedEquipmentCount = equipment.length - repairable.length
  const durabilityRestored = repairable.reduce(
    (total, instance) => total + Math.max(0, instance.maxDurability - instance.durability),
    0,
  )

  return {
    equipmentCount: repairable.length,
    durabilityRestored,
    // 修理只消耗行動體力，不再收取金錢；保留欄位以相容既有 RepairPreview 型別與 UI。
    moneyCost: 0,
    lockedEquipmentCount,
    repairedEquipment: repairable.flatMap((instance) => {
      const definition = getEquipment(instance.equipmentId)
      const restored = Math.max(0, instance.maxDurability - instance.durability)
      return definition && restored > 0 ? [{
        instanceId: instance.instanceId,
        equipmentId: instance.equipmentId,
        name: definition.name,
        icon: definition.icon,
        slot: definition.slot,
        beforeDurability: instance.durability,
        maxDurability: instance.maxDurability,
        durabilityRestored: restored,
      }] : []
    }),
  }
}

/** 依工坊等級修復可處理的裝備；等級不足的裝備保留原樣。 */
export function repairEquipmentInventory(equipment: EquipmentInstance[], workshopLevel: number): EquipmentInstance[] {
  return equipment.map((instance) =>
    (getEquipment(instance.equipmentId)?.requiredShopLevel ?? 1) <= workshopLevel
      ? { ...instance, durability: instance.maxDurability }
      : instance,
  )
}
