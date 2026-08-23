import { Button, Flex, Modal, Tag, Tooltip, Typography } from 'antd'
import { getActivePolicyId, getPolicyName } from '../game/rules/policyRules'
import { getPolicyDefinition } from '../game/rules/governanceRules'
import { hasWaystation } from '../game/rules/transportRules'
import { hasRegionalManagement } from '../game/rules/regionalManagementRules'
import { getGlobalBuffDisplayEntries } from '../game/rules/globalBuffRules'
import { getBaseBuildingIcon } from '../game/buildingViewData'
import { BUILDING_TYPES } from '../game/catalogs/buildingCatalog'
import { type BaseState, type GameState, type PlayerState, isAdjacent } from '../game/types'
import LocationDetailsCard from './LocationDetailsCard'
import StatValue from './StatValue'

type BaseDetailsModalProps = {
  base: BaseState | null
  currentPlayer: PlayerState | null
  gameState: GameState
  onOpenBuildings: (baseId: string) => void
  onOpenDefense: (baseId: string) => void
  onOpenPolicySwitch: (baseId: string) => void
  onOpenWarehouse: (baseId: string) => void
  onOpenTransport: (baseId: string) => void
  onOpenRegionalManagement: (baseId: string) => void
  onClose: () => void
}

function BaseDetailsModal({
  base,
  currentPlayer,
  gameState,
  onOpenBuildings,
  onOpenDefense,
  onOpenPolicySwitch,
  onOpenWarehouse,
  onOpenTransport,
  onOpenRegionalManagement,
  onClose,
}: BaseDetailsModalProps) {
  const canShowBuildings = Boolean(
    base &&
    currentPlayer &&
    isAdjacent(currentPlayer.position, base.position),
  )
  const baseHasWaystation = base ? hasWaystation(base) : false
  const baseHasExchange = base ? base.buildings.some((building) => building.type === BUILDING_TYPES.EXCHANGE) : false
  const baseHasRegionalManagement = base ? hasRegionalManagement(base) : false
  const baseGlobalBuffs = base
    ? (gameState.globalBuffs ?? []).filter((buff) => buff.sourceBaseId === base.id)
    : []
  return (
    <Modal
      title={base ? `${base.name} · 詳細資料` : '據點詳細資料'}
      open={base !== null}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
    >
      {base && (
        <LocationDetailsCard
          icon="🏯"
          name={base.name}
          position={`位置 (${base.position.row + 1}, ${base.position.column + 1})`}
          statusLabel={base.health === 0 ? '已摧毀' : '防守中'}
          statusColor={base.health === 0 ? 'red' : 'gold'}
          health={base.health}
          maxHealth={base.maxHealth}
        >
          <StatValue label="建料">{base.buildingMaterials} / {base.maxBuildingMaterials}</StatValue>
          <StatValue label="政策">
            <Tooltip title={getPolicyDefinition(getActivePolicyId(base))?.description}>
              <Tag color="blue">{getPolicyName(getActivePolicyId(base))}</Tag>
            </Tooltip>
          </StatValue>

          {baseGlobalBuffs.length > 0 && (
            <StatValue label="全局靈氣">
              <Flex wrap gap={4}>
                {getGlobalBuffDisplayEntries(baseGlobalBuffs).map((entry) => {
                  const levelLabel = entry.count === 1
                    ? `Lv.${entry.levels[0]}`
                    : entry.levels.map((level) => `Lv.${level}`).join('、')
                  return (
                    <Tooltip key={entry.kind} title={`${entry.name}：${entry.description}（共 ${entry.count} 層、${levelLabel}，合計 ${entry.totalPercent}%）`}>
                      <Tag color="purple">{entry.name} {levelLabel}</Tag>
                    </Tooltip>
                  )
                })}
              </Flex>
            </StatValue>
          )}

          {canShowBuildings && (
            <Button
              block
              onClick={() => {
                onClose()
                onOpenBuildings(base.id)
              }}
            >
              🏗️ 建築
            </Button>
          )}

          {canShowBuildings && (
            <Button block onClick={() => { onClose(); onOpenDefense(base.id) }}>
              🛡️ 防禦建築
            </Button>
          )}

          {canShowBuildings && (
            <Button block onClick={() => { onClose(); onOpenPolicySwitch(base.id) }}>
              ⚖️ 切換政策
            </Button>
          )}

          {canShowBuildings && baseHasExchange && (
            <Button block onClick={() => { onClose(); onOpenWarehouse(base.id) }}>
              📦 公共倉庫
            </Button>
          )}

          {canShowBuildings && baseHasWaystation && (
            <Button block onClick={() => { onClose(); onOpenTransport(base.id) }}>
              🐎 驛站傳送
            </Button>
          )}

          {canShowBuildings && baseHasRegionalManagement && (
            <Button block onClick={() => { onClose(); onOpenRegionalManagement(base.id) }}>
              🏛️ 總管府治理
            </Button>
          )}

          <Flex vertical gap={8}>
            <Typography.Text strong>據點建築</Typography.Text>
            {base.buildings.map((building) => (
              <Flex align="flex-start" gap={8} key={building.id}>
                <span>{getBaseBuildingIcon(building)}</span>
                <Flex vertical>
                  <Typography.Text strong>{building.name}</Typography.Text>
                  <Typography.Paragraph type="secondary" style={{ margin: 0 }}>{building.description}</Typography.Paragraph>
                </Flex>
              </Flex>
            ))}
          </Flex>
        </LocationDetailsCard>
      )}
    </Modal>
  )
}

export default BaseDetailsModal
