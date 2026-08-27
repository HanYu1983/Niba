import { Alert, Button, Flex, Modal, Space, Tag, Typography } from 'antd'
import { useState } from 'react'
import BuildingListItem from './BuildingListItem'
import type { BaseState, Position } from '../game/types'
import type { DefenseStructureType } from '../game/catalogs/defenseStructureCatalog'
import { buildableDefenseStructureCatalog } from '../game/catalogs/defenseStructureCatalog'
import { getGovernanceRank } from '../game/rules/governanceRules'
import { ACTION_STAMINA_COSTS } from '../game/rules/actionCostRules'
import { getDefenseBuildRange } from '../game/rules/defenseRules'

type DefenseStructureBuildModalProps = {
  base: BaseState | null
  player: import('../game/types').PlayerState | null
  structureType: DefenseStructureType
  position: Position | null
  open: boolean
  onSelectStructure: (structureType: DefenseStructureType) => void
  onBeginPositionSelection: () => void
  onConfirm: () => boolean
  onCancel: () => void
}

function DefenseStructureBuildModal({
  base,
  player,
  structureType,
  position,
  open,
  onSelectStructure,
  onBeginPositionSelection,
  onConfirm,
  onCancel,
}: DefenseStructureBuildModalProps) {
  const [error, setError] = useState<string | null>(null)
  const selectedDefinition = buildableDefenseStructureCatalog.find((definition) => definition.type === structureType)
  const buildRange = player ? getDefenseBuildRange(getGovernanceRank(player.prestige).rank) : 0

  return (
    <Modal
      title={base ? `${base.name} · 防禦建築` : '防禦建築'}
      open={open}
      onCancel={() => {
        setError(null)
        onCancel()
      }}
      destroyOnHidden
      footer={null}
    >
      {base && selectedDefinition && (
        <Flex vertical gap={16}>
          <Typography.Paragraph style={{ margin: 0 }}>
            選擇防禦建築後即自動進入「選擇建造位置」，點擊地圖上據點周圍 {buildRange} 格內的空格，再確認建造。
          </Typography.Paragraph>

          <Typography.Text>
            可用建料：<strong>{base.buildingMaterials}</strong> / {base.maxBuildingMaterials}
          </Typography.Text>

          <Flex vertical gap={8}>
            {buildableDefenseStructureCatalog.map((definition) => {
              const selected = definition.type === structureType
              const affordable = base.buildingMaterials >= definition.constructionCost
              const rankUnlocked = (player ? getGovernanceRank(player.prestige).rank : 0) >= definition.requiredRank

              return (
                <BuildingListItem
                  key={definition.type}
                  icon={definition.icon}
                  name={definition.name}
                  description={definition.description}
                  status={selected ? <Tag color="blue">已選擇</Tag> : undefined}
                  tags={
                    <>
                      {definition.changesTerrain
                        ? <Tag color="green">改寫地形</Tag>
                        : <Tag color="green">生命 {definition.maxHealth}</Tag>}
                      <Tag color="gold">成本 {definition.constructionCost} 建料</Tag>
                      <Tag color="orange">體力 ✦{definition.changesTerrain ? ACTION_STAMINA_COSTS.roadBuild : ACTION_STAMINA_COSTS.defenseBuild}</Tag>
                      <Tag color={rankUnlocked ? 'blue' : 'red'}>官階 {definition.requiredRank} 階</Tag>
                      {definition.blocksMovement && <Tag color="blue">阻擋移動</Tag>}
                      {definition.providesVision && <Tag color="purple">提供視野</Tag>}
                      {definition.attackRange > 0 && <Tag color="red">射程 {definition.attackRange}</Tag>}
                    </>
                  }
                  actions={[{
                    key: 'select',
                    label: selected ? '已選擇' : '選擇建築',
                    disabled: !affordable || !rankUnlocked,
                    onClick: () => {
                      setError(null)
                      // 選擇建築後自動進入「選擇建造位置」，省去手動點擊按鈕的流程。
                      onSelectStructure(definition.type)
                      onBeginPositionSelection()
                    },
                  }]}
                />
              )
            })}
          </Flex>

          {error && <Alert type="error" showIcon title={error} />}

          <Space>
            <Button onClick={() => { setError(null); onCancel() }}>取消</Button>
            {!position && (
              <Button
                disabled={!selectedDefinition || base.buildingMaterials < selectedDefinition.constructionCost}
                onClick={() => {
                  setError(null)
                  onBeginPositionSelection()
                }}
              >
                選擇建造位置
              </Button>
            )}
            {position && (
              <Button
                type="primary"
                disabled={!selectedDefinition || !base || base.buildingMaterials < selectedDefinition.constructionCost}
                onClick={() => {
                  if (!onConfirm()) {
                    setError('建造失敗：位置可能已被佔用、建料不足，或目前已無法建造。')
                  }
                }}
              >
                確認建造
              </Button>
            )}
          </Space>
        </Flex>
      )}
    </Modal>
  )
}

export default DefenseStructureBuildModal
