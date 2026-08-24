import { Button, Flex, Modal, Typography } from 'antd'
import type { ItemDefinition } from '../game/catalogs/itemCatalog'
import { equipmentCatalog } from '../game/catalogs/equipmentCatalog'
import { terrainItemPointLootCatalog } from '../game/catalogs/terrainLootCatalog'
import { type ItemPointState, type PlayerState, type TerrainType } from '../game/types'

type ItemPointDetailsModalProps = {
  itemPoint: ItemPointState | null
  itemCatalog: ItemDefinition[]
  currentPlayer: PlayerState | null
  terrain?: TerrainType
  onCollect: (itemPointId: string) => void
  onClose: () => void
}

function ItemPointDetailsModal({
  itemPoint,
  itemCatalog,
  currentPlayer,
  terrain,
  onCollect,
  onClose,
}: ItemPointDetailsModalProps) {
  const canCollect = Boolean(
    itemPoint &&
    currentPlayer &&
    !currentPlayer.turnEnded &&
    currentPlayer.position.row === itemPoint.position.row && currentPlayer.position.column === itemPoint.position.column,
  )
  const terrainLabel: Record<string, string> = {
    plain: '🌾 草地物產',
    forest: '🌲 森林物產',
    mountain: '⛰️ 山嶽礦藏',
    water: '🌊 水澤珍品',
    desert: '🏜️ 荒漠秘寶',
  }
  const terrainLootLabels = terrain
    ? (terrainItemPointLootCatalog[terrain] ?? []).map((loot) => {
      if (loot.kind === 'item') {
        const item = itemCatalog.find((candidate) => candidate.id === loot.itemId)
        return item ? `${item.icon} ${item.name}` : loot.itemId
      }
      if (loot.kind === 'equipment') {
        const equipment = equipmentCatalog.find((candidate) => candidate.id === loot.equipmentId)
        return equipment ? `${equipment.icon} ${equipment.name}` : loot.equipmentId
      }
      return undefined
    }).filter((label): label is string => Boolean(label))
    : []

  return (
    <Modal
      title="道具點詳細資料"
      open={itemPoint !== null}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
    >
      {itemPoint && (
        <Flex vertical gap={12}>
          <Typography.Title level={4} style={{ margin: 0 }}>🎁 神秘道具點</Typography.Title>
          <Typography.Text type="secondary">
            位置 ({itemPoint.position.row + 1}, {itemPoint.position.column + 1})
          </Typography.Text>
          {terrain && <Typography.Text strong>{terrainLabel[terrain] ?? '🎁 地形物產'}</Typography.Text>}
          <Typography.Paragraph style={{ margin: 0 }}>
            移動到道具點所在格後會自動觸發並隨機獲得一件道具；其中約 80% 來自當地物產，約 20% 來自通用物資。
          </Typography.Paragraph>
          <Typography.Text type="secondary">
            地形特產：{terrainLootLabels.length > 0 ? terrainLootLabels.join('、') : '目前沒有特產資料'}
          </Typography.Text>
          <Button
            block
            type="primary"
            disabled={!canCollect}
            onClick={() => onCollect(itemPoint.id)}
          >
            🎁 撿取道具
          </Button>
          {!canCollect && (
            <Typography.Text type="warning">
              玩家需移動到道具點所在格，且尚未結束回合。
            </Typography.Text>
          )}
        </Flex>
      )}
    </Modal>
  )
}

export default ItemPointDetailsModal
