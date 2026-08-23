import { useState } from 'react'
import { Button, Collapse, Flex, InputNumber, Modal, Tabs, Tag, Typography } from 'antd'
import {
  getEquipmentBuyPrice,
  getEquipmentSellPrice,
  getItemBuyPrice,
  getItemSellPrice,
  getShopLevel,
} from '../game/rules/shopRules'
import { equipmentCatalog, type EquipmentSlot } from '../game/catalogs/equipmentCatalog'
import { itemCatalog } from '../game/catalogs/itemCatalog'
import { BUILDING_TYPES } from '../game/catalogs/buildingCatalog'
import { type BaseState, type GameState, type PlayerState } from '../game/types'
import { EQUIPMENT_SLOT_LABELS, formatEquipmentModifiers } from '../game/equipmentViewData'
import ShopRow from './ShopRow'
import StatValue from './StatValue'
import { ITEM_EFFECT_GROUPS } from './itemGroups'

const EQUIPMENT_SLOT_GROUPS: Array<{ slot: EquipmentSlot; label: string; icon: string }> = [
  { slot: 'weapon', label: '武器', icon: '⚔️' },
  { slot: 'armor', label: '防具', icon: '🛡️' },
  { slot: 'accessory', label: '配件', icon: '💍' },
]

type ShopModalProps = {
  base: BaseState | null
  player: PlayerState | null
  gameState: GameState
  onBuyItem: (itemId: string, quantity: number) => void
  onSellItem: (itemId: string, quantity: number) => void
  onBuyEquipment: (equipmentId: string) => void
  onSellEquipment: (instanceId: string) => void
  onClose: () => void
}

function ShopModal({ base, player, gameState, onBuyItem, onSellItem, onBuyEquipment, onSellEquipment, onClose }: ShopModalProps) {
  const [buyQty, setBuyQty] = useState<Record<string, number>>({})
  const [sellQty, setSellQty] = useState<Record<string, number>>({})

  const hasItemShop = base?.buildings.some((building) => building.type === BUILDING_TYPES.ITEM_SHOP) ?? false
  const hasEquipmentShop = base?.buildings.some((building) => building.type === BUILDING_TYPES.EQUIPMENT_SHOP) ?? false
  const availableItems = base
    ? itemCatalog.filter((item) => item.requiredShopLevel > 0 && getShopLevel(base, 'item-shop') >= item.requiredShopLevel)
    : []
  const availableItemGroups = ITEM_EFFECT_GROUPS
    .map((group) => ({ ...group, items: availableItems.filter((item) => item.effect === group.effect) }))
    .filter((group) => group.items.length > 0)
  const inventoryItemGroups = ITEM_EFFECT_GROUPS
    .map((group) => ({
      ...group,
      entries: (player?.inventory ?? []).filter((entry) => itemCatalog.find((item) => item.id === entry.itemId)?.effect === group.effect),
    }))
    .filter((group) => group.entries.length > 0)
  const availableEquipmentGroups = EQUIPMENT_SLOT_GROUPS
    .map((group) => ({
      ...group,
      equipment: equipmentCatalog.filter((equipment) => !equipment.schoolId && equipment.slot === group.slot && base && getShopLevel(base, 'equipment-shop') >= equipment.requiredShopLevel),
    }))
    .filter((group) => group.equipment.length > 0)
  const inventoryEquipmentGroups = EQUIPMENT_SLOT_GROUPS
    .map((group) => ({
      ...group,
      instances: (player?.equipmentInventory ?? []).filter((instance) => {
        const equipment = equipmentCatalog.find((candidate) => candidate.id === instance.equipmentId)
        return !equipment?.schoolId && equipment?.slot === group.slot
      }),
    }))
    .filter((group) => group.instances.length > 0)

  return (
    <Modal
      title={base ? `${base.name} · 商店` : '商店'}
      open={base !== null}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
    >
      {base && (
        <Flex vertical gap={12}>
          <StatValue label="玩家金錢" tone="gold">🪙 {player?.money ?? 0}</StatValue>
          <Tabs
          items={[
            ...(hasItemShop ? [{
              key: 'buy',
              label: '購買道具',
              children: (
                <Collapse items={availableItemGroups.map((group) => ({
                  key: group.effect,
                  label: `${group.icon} ${group.label}`,
                  children: (
                    <Flex vertical gap={12}>
                      {group.items.map((item) => {
                      const price = getItemBuyPrice(base, item.id, gameState)
                      const qty = buyQty[item.id] ?? 1
                      const canAfford = (player?.money ?? 0) >= price * qty
                      return (
                        <ShopRow
                          key={item.id}
                          name={`${item.icon} ${item.name}`}
                          description={item.effectLabel}
                          tags={<><Tag color="blue">商店 Lv.{item.requiredShopLevel}</Tag><Tag color="gold">{price} 金錢</Tag></>}
                          actions={
                            <>
                              <InputNumber
                                min={1}
                                value={qty}
                                onChange={(value) => setBuyQty((prev) => ({ ...prev, [item.id]: value ?? 1 }))}
                                style={{ width: 60 }}
                              />
                              <Button
                                type="primary"
                                disabled={!canAfford}
                                onClick={() => onBuyItem(item.id, qty)}
                              >
                                購買
                              </Button>
                            </>
                          }
                        />
                      )
                      })}
                    </Flex>
                  ),
                }))} />
              ),
            }] : []),
            ...(hasItemShop ? [{
              key: 'sell',
              label: '賣出道具',
              children: (
                <>
                  <Collapse items={inventoryItemGroups.map((group) => ({
                    key: group.effect,
                    label: `${group.icon} ${group.label}`,
                    children: (
                      <Flex vertical gap={12}>
                        {group.entries.map((entry) => {
                    const item = itemCatalog.find((candidate) => candidate.id === entry.itemId)
                    if (!item) return null
                    const price = getItemSellPrice(item.id)
                    const qty = sellQty[item.id] ?? 1
                    return (
                      <ShopRow
                        key={item.id}
                        name={`${item.icon} ${item.name}`}
                        tags={<><Tag color="blue">商店 Lv.{item.requiredShopLevel}</Tag><Tag>×{entry.quantity}</Tag><Tag color="green">{price} 金錢</Tag></>}
                        actions={
                          <>
                            <InputNumber
                              min={1}
                              max={entry.quantity}
                              value={qty}
                              onChange={(value) => setSellQty((prev) => ({ ...prev, [item.id]: value ?? 1 }))}
                              style={{ width: 60 }}
                            />
                            <Button onClick={() => onSellItem(item.id, qty)}>賣出</Button>
                          </>
                        }
                      />
                        )})}
                      </Flex>
                    ),
                  }))} />
                  {(player?.inventory ?? []).length === 0 && (
                    <Typography.Text type="secondary">背包沒有可賣出的道具。</Typography.Text>
                  )}
                </>
              ),
            }] : []),
            ...(hasEquipmentShop ? [{
              key: 'buy-equipment',
              label: '購買裝備',
              children: (
                <Collapse items={availableEquipmentGroups.map((group) => ({
                  key: group.slot,
                  label: `${group.icon} ${group.label}`,
                  children: (
                    <Flex vertical gap={12}>
                      {group.equipment.map((equipment) => {
                      const price = getEquipmentBuyPrice(base, equipment.id, gameState)
                      const canAfford = (player?.money ?? 0) >= price
                      const modifiers = formatEquipmentModifiers(equipment.modifiers)
                      return (
                        <ShopRow
                          key={equipment.id}
                          name={`${equipment.icon} ${equipment.name}`}
                          description={`${EQUIPMENT_SLOT_LABELS[equipment.slot]} 耐久 ${equipment.maxDurability}`}
                          tags={<><Tag color="blue">商店 Lv.{equipment.requiredShopLevel}</Tag><Typography.Text type="success">屬性：{modifiers}</Typography.Text><Tag color="gold">{price} 金錢</Tag></>}
                          actions={
                            <Button
                              type="primary"
                              disabled={!canAfford}
                              onClick={() => onBuyEquipment(equipment.id)}
                            >
                              購買
                            </Button>
                          }
                        />
                      )
                      })}
                    </Flex>
                  ),
                }))} />
              ),
            }] : []),
            ...(hasEquipmentShop ? [{
              key: 'sell-equipment',
              label: '賣出裝備',
              children: (
                <>
                  <Collapse items={inventoryEquipmentGroups.map((group) => ({
                    key: group.slot,
                    label: `${group.icon} ${group.label}`,
                    children: (
                      <Flex vertical gap={12}>
                        {group.instances.map((instance) => {
                    const equipment = equipmentCatalog.find((candidate) => candidate.id === instance.equipmentId)
                    if (!equipment) return null
                    const price = getEquipmentSellPrice(instance)
                    const isEquipped =
                      player?.equipmentLoadout?.weaponInstanceId === instance.instanceId ||
                      player?.equipmentLoadout?.armorInstanceId === instance.instanceId ||
                      player?.equipmentLoadout?.accessoryInstanceId === instance.instanceId
                    return (
                      <ShopRow
                        key={instance.instanceId}
                        name={`${equipment.icon} ${equipment.name}`}
                        description={`耐久 ${instance.durability}/${instance.maxDurability}`}
                        tags={<><Tag color="blue">商店 Lv.{equipment.requiredShopLevel}</Tag>{isEquipped && <Tag color="orange">已裝備</Tag>}<Tag color="green">{price} 金錢</Tag></>}
                        actions={
                          <Button disabled={isEquipped} onClick={() => onSellEquipment(instance.instanceId)}>
                            賣出
                          </Button>
                        }
                      />
                        )})}
                      </Flex>
                    ),
                  }))} />
                  {(player?.equipmentInventory ?? []).length === 0 && (
                    <Typography.Text type="secondary">沒有可賣出的裝備。</Typography.Text>
                  )}
                </>
              ),
            }] : []),
          ]}
          />
        </Flex>
      )}
    </Modal>
  )
}

export default ShopModal
