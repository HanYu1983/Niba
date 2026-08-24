import { Flex, Modal, Tag, Tooltip, Typography } from 'antd'
import {
  getBuildingLevel,
  getBuildingUpgradeCost,
  getPlayerBuildingCap,
  isFixedFunctionBuilding,
  canUpgradeBuildingType,
  canPlayerBuildBuildingType,
} from '../game/rules/buildingProgressionRules'
import { getActivePolicyId, getPolicyName } from '../game/rules/policyRules'
import { getPolicyDefinition } from '../game/rules/governanceRules'
import { getBaseBuildingIcon } from '../game/buildingViewData'
import BuildingListItem, { BuiltTag } from './BuildingListItem'
import StatLabel from './StatLabel'
import { buildingActionRegistry } from '../game/buildingActionRegistry'
import { BUILDING_TYPES, buildingCatalog } from '../game/catalogs/buildingCatalog'
import type { BaseState, PlayerState } from '../game/types'
import { ACTION_STAMINA_COSTS } from '../game/rules/actionCostRules'

type BuildingListModalProps = {
  base: BaseState | null
  onBuild: (buildingId: string) => void
  onUpgrade: (buildingId: string) => void
  onVisitShop: (baseId: string) => void
  onOpenTransport: (baseId: string) => void
  onOpenWarehouse: (baseId: string) => void
  onOpenRegionalManagement: (baseId: string) => void
  onOpenMartialHall: (baseId: string) => void
  onClose: () => void
  onHeal: (baseId: string) => void
  onMission: (baseId: string) => void
  onRepair: (baseId: string) => void
  currentPlayer: PlayerState | null
}

function BuildingListModal({ base, onBuild, onUpgrade, onVisitShop, onOpenTransport, onOpenWarehouse, onOpenRegionalManagement, onOpenMartialHall, onClose, onHeal, onMission, onRepair, currentPlayer }: BuildingListModalProps) {
  const buildingCap = currentPlayer ? getPlayerBuildingCap(currentPlayer) : 1
  const availableMartialSchoolId = base?.martialSchoolId
  // 據點允許建築限制：若指定了 allowedBuildings，僅顯示清單內的建築。
  const allowedTypes = base?.allowedBuildings?.map((entry) => entry.type)
  const isBuildingAllowed = (type: string) => !allowedTypes || allowedTypes.length === 0 || allowedTypes.includes(type)
  // 據點允許建築的最高等級限制。
  const getAllowedMaxLevel = (type: string) => base?.allowedBuildings?.find((entry) => entry.type === type)?.maxLevel

  return (
    <Modal
      title={base ? `${base.name} · 據點建築` : '據點建築'}
      open={base !== null}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
    >
      {base && (
        <Flex vertical gap={16}>
          <Typography.Text>
            可用建料：<strong>{base.buildingMaterials}</strong> / {base.maxBuildingMaterials}
            {'　'}目前政策：
            <Tooltip title={getPolicyDefinition(getActivePolicyId(base))?.description}>
              <Tag color="blue">{getPolicyName(getActivePolicyId(base))}</Tag>
            </Tooltip>
          </Typography.Text>
          <Flex vertical gap={8}>
            {buildingCatalog
              .filter((building) => building.type !== BUILDING_TYPES.MARTIAL_HALL)
              .filter((building) => !availableMartialSchoolId || !building.schoolId || building.schoolId === availableMartialSchoolId)
              .filter((building) => isBuildingAllowed(building.type))
              .map((building) => {
              const ownedInstance = base.buildings.find((candidate) => building.schoolId
                ? candidate.schoolId === building.schoolId
                : candidate.type === building.type)
              const isOwned = Boolean(ownedInstance)
              const rankUnlocked = currentPlayer ? canPlayerBuildBuildingType(currentPlayer, building.type) : true
              const rankRequirement = building.requiredRank ?? 1
              const canBuild = !isOwned && rankUnlocked && base.buildingMaterials >= building.constructionCost
              const currentLevel = ownedInstance ? getBuildingLevel(ownedInstance) : 0
              const allowedMaxLevel = getAllowedMaxLevel(building.type)
              const reachedAllowedMax = allowedMaxLevel !== undefined && currentLevel >= allowedMaxLevel
              const canUpgrade = isOwned
                && canUpgradeBuildingType(building.type)
                && currentLevel < buildingCap
                && !reachedAllowedMax
                && base.buildingMaterials >= getBuildingUpgradeCost(ownedInstance!)
              const actionContext = { onMission, onHeal, onRepair }
              const registeredActions = isOwned
                ? (building.actions ?? []).flatMap((actionType) => {
                  const registration = buildingActionRegistry[actionType]
                  if (!registration) return []
                  const availability = registration.getAvailability(base, currentPlayer)
                  return [{
                    key: actionType,
                    label: `${registration.icon} ${registration.label}`,
                    disabled: !availability.available,
                    tooltip: availability.available ? undefined : availability.reason,
                    onClick: () => registration.execute(base.id, actionContext),
                  }]
                })
                : []

              return (
                <BuildingListItem
                  key={building.id}
                  icon={getBaseBuildingIcon(building)}
                  name={building.name}
                  description={building.description}
                  tags={<StatLabel>
                    {isOwned
                      ? (isFixedFunctionBuilding(building.type)
                        ? '固定功能建築'
                        : `目前 Lv.${currentLevel} / 官階上限 Lv.${buildingCap}`)
                      : (rankUnlocked
                        ? `建造成本 ${building.constructionCost} 建料`
                        : `需要官階 ${rankRequirement} 階以上`)}
                    {isOwned && !isFixedFunctionBuilding(building.type) && !reachedAllowedMax ? ` 升級 ✦${ACTION_STAMINA_COSTS.upgrade}` : ''}
                    {!isOwned ? ` 建造 ✦${ACTION_STAMINA_COSTS.build}` : ''}
                  </StatLabel>}
                  status={isOwned ? <BuiltTag /> : undefined}
                  actions={[
                    {
                      key: 'build',
                      label: isOwned ? '已建造' : (rankUnlocked ? `建造（${building.constructionCost} 建料）` : '官階不足'),
                      disabled: !canBuild,
                      tooltip: isOwned ? undefined : (rankUnlocked ? undefined : '官階不足'),
                      onClick: () => onBuild(building.id),
                    },
                    ...(isOwned && !isFixedFunctionBuilding(building.type) && ownedInstance && !reachedAllowedMax
                      ? [{
                        key: 'upgrade',
                        label: `升級至 Lv.${currentLevel + 1}（${getBuildingUpgradeCost(ownedInstance)} 建料）`,
                        disabled: !canUpgrade,
                        tooltip: canUpgrade ? undefined : (currentLevel >= buildingCap ? '已達官階上限' : '建料不足'),
                        onClick: () => onUpgrade(ownedInstance.id),
                      }]
                      : []),
                    ...(isOwned && (building.type === BUILDING_TYPES.ITEM_SHOP || building.type === BUILDING_TYPES.EQUIPMENT_SHOP)
                      ? [{
                        key: 'visit-shop',
                        label: '🛒 造訪商店',
                        onClick: () => onVisitShop(base.id),
                      }]
                      : []),
                    ...(isOwned && building.type === BUILDING_TYPES.WAYSTATION
                      ? [{
                        key: 'open-transport',
                        label: '🐎 驛站傳送',
                        onClick: () => onOpenTransport(base.id),
                      }]
                      : []),
                    ...(isOwned && building.type === BUILDING_TYPES.EXCHANGE
                      ? [{
                        key: 'open-warehouse',
                        label: '📦 公共倉庫',
                        onClick: () => onOpenWarehouse(base.id),
                      }]
                      : []),
                    ...(isOwned && building.type === BUILDING_TYPES.REGIONAL_MANAGEMENT
                      ? [{
                        key: 'open-regional-management',
                        label: '🏛️ 總管府治理',
                        onClick: () => onOpenRegionalManagement(base.id),
                      }]
                      : []),
                    ...(isOwned && building.type === BUILDING_TYPES.MARTIAL_HALL
                      ? [{
                        key: 'open-martial-hall',
                        label: '🥋 學習功法',
                        onClick: () => onOpenMartialHall(base.id),
                      }]
                      : []),
                    ...registeredActions,
                  ]}
                />
              )
            })}
          </Flex>
        </Flex>
      )}
    </Modal>
  )
}

export default BuildingListModal