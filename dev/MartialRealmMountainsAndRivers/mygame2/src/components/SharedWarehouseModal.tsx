import { useState } from 'react'
import { Button, Flex, InputNumber, List, Modal, Space, Tabs, Tag, Typography } from 'antd'
import { itemCatalog } from '../game/catalogs/itemCatalog'
import { getEquipment } from '../game/rules/playerDerivedRules'
import type { GameState, PlayerState, EquipmentInstance } from '../game/types'
import { getSharedEquipmentWarehouse, getSharedWarehouse } from '../game/rules/storageRules'

type SharedWarehouseModalProps = {
  gameState: GameState
  player: PlayerState | null
  open: boolean
  onDeposit: (itemId: string, quantity: number) => void
  onWithdraw: (itemId: string, quantity: number) => void
  onDepositEquipment: (instanceId: string) => void
  onWithdrawEquipment: (instanceId: string) => void
  onClose: () => void
}

function EquipmentRow({
  instance,
  owned,
  stored,
  onDeposit,
  onWithdraw,
}: {
  instance: EquipmentInstance
  owned: boolean
  stored: boolean
  onDeposit: (instanceId: string) => void
  onWithdraw: (instanceId: string) => void
}) {
  const equipment = getEquipment(instance.equipmentId)
  if (!equipment) return null
  const slotName = equipment.slot === 'weapon' ? '武器' : equipment.slot === 'armor' ? '防具' : '配件'
  return (
    <List.Item>
      <List.Item.Meta
        title={<Typography.Text>{equipment.icon} {equipment.name}</Typography.Text>}
        description={
          <Space size={8}>
            <Tag>{slotName}</Tag>
            <Typography.Text type="secondary">耐久 {instance.durability} / {instance.maxDurability}</Typography.Text>
          </Space>
        }
      />
      <Space>
        <Button disabled={!owned} onClick={() => onDeposit(instance.instanceId)}>
          存入
        </Button>
        <Button disabled={!stored} onClick={() => onWithdraw(instance.instanceId)}>
          取出
        </Button>
      </Space>
    </List.Item>
  )
}

function SharedWarehouseModal({
  gameState,
  player,
  open,
  onDeposit,
  onWithdraw,
  onDepositEquipment,
  onWithdrawEquipment,
  onClose,
}: SharedWarehouseModalProps) {
  const [depositQty, setDepositQty] = useState<Record<string, number>>({})
  const [withdrawQty, setWithdrawQty] = useState<Record<string, number>>({})
  const warehouse = getSharedWarehouse(gameState)
  const equipmentWarehouse = getSharedEquipmentWarehouse(gameState)
  const playerEquipment = player?.equipmentInventory ?? []
  const playerEquipmentIds = new Set(playerEquipment.map((instance) => instance.instanceId))
  const warehouseEquipmentIds = new Set(equipmentWarehouse.map((instance) => instance.instanceId))
  const allEquipment = [...playerEquipment, ...equipmentWarehouse].filter(
    (instance, index, array) =>
      array.findIndex((candidate) => candidate.instanceId === instance.instanceId) === index,
  )

  const playerOwnedIds = new Set((player?.inventory ?? []).map((e) => e.itemId))
  const warehouseItemIds = new Set(warehouse.map((e) => e.itemId))
  const relevantItems = itemCatalog.filter(
    (item) => playerOwnedIds.has(item.id) || warehouseItemIds.has(item.id),
  )

  const itemTab = (
    <List
      dataSource={relevantItems}
      renderItem={(item) => {
        const playerOwned = player?.inventory.find((e) => e.itemId === item.id)?.quantity ?? 0
        const stored = warehouse.find((e) => e.itemId === item.id)?.quantity ?? 0
        return (
          <List.Item>
            <List.Item.Meta
              title={<Typography.Text>{item.icon} {item.name}</Typography.Text>}
              description={<>持有：{playerOwned}｜倉庫：{stored}</>}
            />
            <Space>
              <InputNumber
                min={1}
                max={playerOwned}
                value={depositQty[item.id] ?? 1}
                onChange={(value) => setDepositQty((prev) => ({ ...prev, [item.id]: value ?? 1 }))}
                style={{ width: 70 }}
              />
              <Button disabled={playerOwned <= 0} onClick={() => onDeposit(item.id, depositQty[item.id] ?? 1)}>
                存入
              </Button>
              <InputNumber
                min={1}
                max={stored}
                value={withdrawQty[item.id] ?? 1}
                onChange={(value) => setWithdrawQty((prev) => ({ ...prev, [item.id]: value ?? 1 }))}
                style={{ width: 70 }}
              />
              <Button disabled={stored <= 0} onClick={() => onWithdraw(item.id, withdrawQty[item.id] ?? 1)}>
                取出
              </Button>
            </Space>
          </List.Item>
        )
      }}
    />
  )

  const equipmentTab = (
    <List
      dataSource={allEquipment}
      renderItem={(instance) => (
        <EquipmentRow
          instance={instance}
          owned={playerEquipmentIds.has(instance.instanceId)}
          stored={warehouseEquipmentIds.has(instance.instanceId)}
          onDeposit={onDepositEquipment}
          onWithdraw={onWithdrawEquipment}
        />
      )}
    />
  )

  return (
    <Modal
      title="跨據點公共倉庫"
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
    >
      <Flex vertical gap={12}>
        <Typography.Text type="secondary">
          公共倉庫跨據點共享，不消耗行動、不增加聲望、無容量限制。
        </Typography.Text>
        <Tabs
          items={[
            { key: 'items', label: '道具', children: itemTab },
            { key: 'equipment', label: '裝備', children: equipmentTab },
          ]}
        />
      </Flex>
    </Modal>
  )
}

export default SharedWarehouseModal
