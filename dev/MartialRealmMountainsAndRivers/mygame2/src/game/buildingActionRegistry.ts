import type { BaseState, PlayerState } from './types'
import { BUILDING_TYPES, type BaseBuildingActionType } from './catalogs/buildingCatalog'
import {
  getRepairSummary,
  getWorkshopLevel,
  hasBuilding,
  requiresAdjacentActivePlayer,
} from './rules/buildingRules'
import { ACTION_STAMINA_COSTS } from './rules/actionCostRules'

export type BuildingActionContext = {
  onMission: (baseId: string) => void
  onHeal: (baseId: string) => void
  onRepair: (baseId: string) => void
}

export type BuildingActionRegistration = {
  label: string
  icon: string
  getAvailability: (base: BaseState, player: PlayerState | null) => { available: boolean; reason?: string }
  execute: (baseId: string, context: BuildingActionContext) => void
}

export const buildingActionRegistry: Record<BaseBuildingActionType, BuildingActionRegistration> = {
  mission: {
    label: '執行任務',
    icon: '📜',
    getAvailability: (base, player) => {
      const available = hasBuilding(base, BUILDING_TYPES.BOARD) && requiresAdjacentActivePlayer(base, player)
      return {
        available,
        reason: !hasBuilding(base, BUILDING_TYPES.BOARD)
          ? '需要先建造告示牌。'
          : '需位於據點相鄰位置，且玩家回合尚未結束。',
      }
    },
    execute: (baseId, context) => context.onMission(baseId),
  },
  heal: {
    label: '就醫',
    icon: '🏥',
    getAvailability: (base, player) => {
      const available = Boolean(
        hasBuilding(base, BUILDING_TYPES.INFIRMARY) &&
        requiresAdjacentActivePlayer(base, player) &&
        player &&
        (player.health < player.maxHealth || player.innerPower < player.maxInnerPower),
      )
      return {
        available,
        reason: !hasBuilding(base, BUILDING_TYPES.INFIRMARY)
          ? '需要先建造醫療室。'
          : '需位於據點相鄰位置、回合尚未結束，且氣血或內力未滿。',
      }
    },
    execute: (baseId, context) => context.onHeal(baseId),
  },
  repair: {
    label: '修理',
    icon: '🔧',
    getAvailability: (base, player) => {
      const repairSummary = player ? getRepairSummary(player, getWorkshopLevel(base)) : null
      const hasWorkshop = hasBuilding(base, BUILDING_TYPES.WORKSHOP)
      const available = Boolean(
        player && hasWorkshop && requiresAdjacentActivePlayer(base, player) &&
        repairSummary && repairSummary.durabilityRestored > 0 && player.stamina >= ACTION_STAMINA_COSTS.repair,
      )
      return { available, reason: !hasWorkshop ? '需要先建造修理工坊。' : '需要位於據點相鄰位置、有損耗裝備且體力足夠。' }
    },
    execute: (baseId, context) => context.onRepair(baseId),
  },
}