import { Flex, Modal, Tag, Typography } from 'antd'
import { type RuinState, type PlayerState } from '../game/types'
import { defenseStructureCatalog } from '../game/catalogs/defenseStructureCatalog'
import { RUIN_CLEAR_EXPERIENCE, RUIN_RECONSTRUCT_STAMINA, RUIN_RECONSTRUCT_EXPERIENCE } from '../game/actions/ruinActions'
import OptionCard from './OptionCard'

type RuinDetailsModalProps = {
  ruin: RuinState | null
  player: PlayerState | null
  onReconstruct: (structureType: 'small-watchtower' | 'small-arrow-tower' | 'small-waystation') => void
  onClear: () => void
  onClose: () => void
}

function RuinDetailsModal({ ruin, player, onReconstruct, onClear, onClose }: RuinDetailsModalProps) {
  const adjacent = Boolean(ruin && player && Math.abs(player.position.row - ruin.position.row) + Math.abs(player.position.column - ruin.position.column) <= 1)
  const actionable = Boolean(player && !player.turnEnded && player.health > 0 && adjacent && ruin?.status === 'intact')
  const staminaEnough = Boolean(player && player.stamina >= RUIN_RECONSTRUCT_STAMINA)

  const smallWatchtower = defenseStructureCatalog.find((candidate) => candidate.type === 'small-watchtower')
  const smallArrowTower = defenseStructureCatalog.find((candidate) => candidate.type === 'small-arrow-tower')
  const smallWaystation = defenseStructureCatalog.find((candidate) => candidate.type === 'small-waystation')

  return (
    <Modal
      title={ruin ? `${ruin.name ?? '廢墟'}詳細資料` : '廢墟詳細資料'}
      open={ruin !== null}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
    >
      {ruin && (
        <Flex vertical gap={12}>
          <Flex align="center" gap={8}>
            <Typography.Title level={4} style={{ margin: 0 }}>🏚️ {ruin.name ?? '廢墟'}</Typography.Title>
            <Tag color={ruin.status === 'intact' ? 'orange' : 'default'}>{ruin.status === 'intact' ? '可修復' : '已修復'}</Tag>
          </Flex>
          <Typography.Paragraph style={{ margin: 0 }}>
            一座古代文明的廢墟，阻礙通行，但可以花費體力修復為小型防禦設施。
          </Typography.Paragraph>
          <Typography.Text type="secondary">
            位置：({ruin.position.row + 1}, {ruin.position.column + 1})
          </Typography.Text>
          {!adjacent && <Typography.Text type="warning">玩家需移動到廢墟周邊一格才能互動。</Typography.Text>}
          {ruin.status === 'reconstructed' && <Typography.Text type="secondary">此廢墟已修復，不能重複修復。</Typography.Text>}
          {adjacent && !staminaEnough && <Typography.Text type="warning">體力不足，需要 {RUIN_RECONSTRUCT_STAMINA} 體力。</Typography.Text>}
          <Flex vertical gap={8}>
            <OptionCard
              title="🧹 清除廢墟點"
              description={`移除廢墟並恢復此格通行。消耗 ${RUIN_RECONSTRUCT_STAMINA} 體力，獲得 ${RUIN_CLEAR_EXPERIENCE} 經驗值。`}
              actionLabel="清除"
              danger
              disabled={!actionable || !staminaEnough}
              onAction={onClear}
            />
            {smallWatchtower && (
              <OptionCard
                title={`${smallWatchtower.icon} ${smallWatchtower.name}`}
                description={`提供 ${smallWatchtower.providesVision ? '2 格視野' : '無視野'}，生命 ${smallWatchtower.maxHealth}。消耗 ${RUIN_RECONSTRUCT_STAMINA} 體力，獲得 ${RUIN_RECONSTRUCT_EXPERIENCE} 經驗值。`}
                actionLabel="修復"
                disabled={!actionable || !staminaEnough}
                onAction={() => onReconstruct('small-watchtower')}
              />
            )}
            {smallArrowTower && (
              <OptionCard
                title={`${smallArrowTower.icon} ${smallArrowTower.name}`}
                description={`提供 1 格視野與 1 格射程（傷害 ${smallArrowTower.attackDamage}），生命 ${smallArrowTower.maxHealth}。消耗 ${RUIN_RECONSTRUCT_STAMINA} 體力，獲得 ${RUIN_RECONSTRUCT_EXPERIENCE} 經驗值。`}
                actionLabel="修復"
                disabled={!actionable || !staminaEnough}
                onAction={() => onReconstruct('small-arrow-tower')}
              />
            )}
            {smallWaystation && (
              <OptionCard
                title={`${smallWaystation.icon} ${smallWaystation.name}`}
                description={`可傳送至其他已修復的廢墟點，生命 ${smallWaystation.maxHealth}。消耗 ${RUIN_RECONSTRUCT_STAMINA} 體力，獲得 ${RUIN_RECONSTRUCT_EXPERIENCE} 經驗值。`}
                actionLabel="修復"
                disabled={!actionable || !staminaEnough}
                onAction={() => onReconstruct('small-waystation')}
              />
            )}
          </Flex>
        </Flex>
      )}
    </Modal>
  )
}

export default RuinDetailsModal
