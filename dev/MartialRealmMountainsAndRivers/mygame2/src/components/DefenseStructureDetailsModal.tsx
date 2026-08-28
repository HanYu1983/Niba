import { Button, Flex, List, Modal, Tag, Typography } from 'antd'
import BuildingListItem from './BuildingListItem'
import StatBar from './StatBar'
import type { DefenseStructureState, BaseState } from '../game/types'
import {
  getBastionMultipliers,
  getEffectiveAttackDamage,
  getEffectiveMaxHealth,
} from '../game/rules/defenseBastionRules'

type DefenseStructureDetailsModalProps = {
  structure: DefenseStructureState | null
  ownerBase: BaseState | null
  /** 全地圖防禦設施清單，用於計算軍壘強化後的有效數值。 */
  allDefenseStructures?: DefenseStructureState[]
  onOpenTransport?: (structureId: string) => void
  onClose: () => void
}

function DefenseStructureDetailsModal({ structure, onOpenTransport, onClose, allDefenseStructures = [] }: DefenseStructureDetailsModalProps) {
  const bastionBoosted = structure ? getBastionMultipliers(allDefenseStructures, structure) : { hpMultiplier: 1, attackMultiplier: 1 }
  const boosted = bastionBoosted.hpMultiplier > 1
  return (
    <Modal
      title={structure ? `${structure.originName ?? structure.name}` : '防禦設施詳細資料'}
      open={structure !== null}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
    >
      {structure && (
        <Flex vertical gap={16}>
          <List
            dataSource={[structure]}
            renderItem={(currentStructure) => (
              <BuildingListItem
                icon={currentStructure.icon}
                name={currentStructure.name}
                description={currentStructure.description}
                status={<Tag color={currentStructure.health > 0 ? 'green' : 'red'}>{currentStructure.health > 0 ? '運作中' : '已摧毀'}</Tag>}
                tags={
                  <>
                    <Tag color="green">生命 {currentStructure.health}/{currentStructure.maxHealth}{boosted ? ` · 受軍壘強化 ×${bastionBoosted.hpMultiplier}` : ''}</Tag>
                    <Tag color="gold">成本 {currentStructure.constructionCost} 建料</Tag>
                    {currentStructure.blocksMovement && <Tag color="blue">阻擋移動</Tag>}
                    {currentStructure.providesVision && <Tag color="purple">提供視野</Tag>}
                  </>
                }
                actions={[{
                  key: 'view',
                  label: '查看中',
                  disabled: true,
                  onClick: () => undefined,
                }]}
              />
            )}
          />

          <Typography.Text type="secondary">
            位置 ({structure.position.row}, {structure.position.column})
          </Typography.Text>
          <StatBar
            label="設施生命"
            current={structure.health}
            max={getEffectiveMaxHealth(allDefenseStructures, structure)}
            status={structure.health <= 0 ? 'exception' : 'active'}
          />

          {structure.attackRange > 0 && (
            <Typography.Text>
              自動攻擊：Creature 回合攻擊 {structure.attackRange} 格內目標，造成 {getEffectiveAttackDamage(allDefenseStructures, structure)} 點傷害{boosted ? '（含軍壘強化 ×2）' : ''}。
            </Typography.Text>
          )}
          {structure.type === 'small-waystation' && onOpenTransport && (
            <Button block type="primary" onClick={() => onOpenTransport(structure.id)}>
              🐎 使用小型驛站傳送
            </Button>
          )}
        </Flex>
      )}
    </Modal>
  )
}

export default DefenseStructureDetailsModal