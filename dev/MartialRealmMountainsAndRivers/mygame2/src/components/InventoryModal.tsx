import { Button, Collapse, Empty, Modal, Space, Tag, Typography } from 'antd'
import type { ItemDefinition } from '../game/catalogs/itemCatalog'
import type { PlayerState } from '../game/types'
import { ITEM_EFFECT_GROUPS } from './itemGroups'
import ShopRow from './ShopRow'

type InventoryModalProps = {
  player: PlayerState | null
  isActive: boolean
  items: ItemDefinition[]
  onUseItem: (itemId: string) => void
  onClose: () => void
}

function InventoryModal({ player, isActive, items, onUseItem, onClose }: InventoryModalProps) {
  const groups = ITEM_EFFECT_GROUPS
    .map((group) => ({
      ...group,
      entries: (player?.inventory ?? []).filter(
        (entry) => items.find((item) => item.id === entry.itemId)?.effect === group.effect,
      ),
    }))
    .filter((group) => group.entries.length > 0)

  return (
    <Modal
      title="道具背包"
      open={player !== null}
      onCancel={onClose}
      footer={<Button onClick={onClose}>關閉</Button>}
      destroyOnHidden
    >
      {player && groups.length > 0 ? (
        <Collapse className="player-panel__collapse" items={groups.map((group) => ({
          key: group.effect,
          label: `${group.icon} ${group.label}`,
          children: (
            <Space orientation="vertical" size={12} style={{ width: '100%' }}>
              {group.entries.map((entry) => {
                const item = items.find((currentItem) => currentItem.id === entry.itemId)
                if (!item) return null

                const isFull = item.effect === 'health'
                  ? player.health >= player.maxHealth
                  : item.effect === 'stamina'
                    ? player.stamina >= player.maxStamina
                    : item.effect === 'inner-power'
                      ? player.innerPower >= player.maxInnerPower
                      : false
                const effectAlreadyUsed = !!player.itemEffectsUsedThisTurn?.includes(item.effect)

                const notes: string[] = []
                if (item.description) notes.push(item.description)
                if (isFull) notes.push('目前數值已滿')
                if (effectAlreadyUsed) notes.push('本回合已使用過此類道具')

                return (
                  <ShopRow
                    key={entry.itemId}
                    name={<Space><Typography.Text>{item.icon}</Typography.Text>{item.name}</Space>}
                    description={item.effectLabel}
                    tags={
                      <Space size={4} wrap>
                        <Tag>×{entry.quantity}</Tag>
                        {isFull && <Tag color="warning">已滿</Tag>}
                        {effectAlreadyUsed && <Tag color="orange">已用過</Tag>}
                      </Space>
                    }
                    actions={
                      <Button
                        type="primary"
                        disabled={!isActive || isFull || effectAlreadyUsed}
                        onClick={() => onUseItem(item.id)}
                      >
                        使用
                      </Button>
                    }
                  />
                )
              })}
            </Space>
          ),
        }))} />
      ) : (
        <Empty description="背包目前沒有道具" />
      )}
    </Modal>
  )
}

export default InventoryModal
