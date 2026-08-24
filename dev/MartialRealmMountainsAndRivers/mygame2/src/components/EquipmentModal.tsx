import { Button, Collapse, Flex, List, Modal, Space, Tag, Typography } from 'antd'
import type { EquipmentSlot } from '../game/catalogs/equipmentCatalog'
import { getEquipmentLoadout, getEquipmentInstance, getEquipment, getEquipmentInventory } from '../game/rules/playerDerivedRules'
import { type PlayerState } from '../game/types'
import { EQUIPMENT_SLOT_LABELS, formatEquipmentModifiers } from '../game/equipmentViewData'
import HighlightText from './HighlightText'

type EquipmentModalProps = {
  player: PlayerState | null
  isActive: boolean
  onEquip: (instanceId: string) => void
  onUnequip: (slot: EquipmentSlot) => void
  onClose: () => void
}

function EquipmentModal({ player, isActive, onEquip, onUnequip, onClose }: EquipmentModalProps) {
  const loadout = player ? getEquipmentLoadout(player) : null
  const slots: EquipmentSlot[] = ['weapon', 'armor', 'accessory']
  const equipmentGroups = [
    { slot: 'weapon' as const, label: '⚔️ 武器' },
    { slot: 'armor' as const, label: '🛡️ 防具' },
    { slot: 'accessory' as const, label: '💍 配件' },
  ]

  return (
    <Modal
      title="裝備"
      open={player !== null}
      onCancel={onClose}
      footer={<Button onClick={onClose}>關閉</Button>}
      destroyOnHidden
    >
      {player && loadout && (
        <>
          <Typography.Title level={5}>目前裝備</Typography.Title>
          <Flex vertical gap={8}>
            {slots.map((slot) => {
              const instanceId = loadout[`${slot}InstanceId`]
              const instance = getEquipmentInstance(player, instanceId)
              const current = instance ? getEquipment(instance.equipmentId) : null
              return (
                <Flex key={slot} justify="space-between" align="center" gap={8}>
                  <Typography.Text>
                    {EQUIPMENT_SLOT_LABELS[slot]}：{current ? `${current.icon} ${current.name}（耐久 ${instance?.durability} / ${instance?.maxDurability}）` : '未裝備'}
                  </Typography.Text>
                  {current && (
                    <Button size="small" disabled={!isActive} onClick={() => onUnequip(slot)}>
                      卸下
                    </Button>
                  )}
                </Flex>
              )
            })}
          </Flex>

          <Typography.Title level={5}>裝備清單</Typography.Title>
          <Collapse items={equipmentGroups.map((group) => ({
            key: group.slot,
            label: group.label,
            children: (
              <List
                dataSource={getEquipmentInventory(player).filter((instance) => getEquipment(instance.equipmentId)?.slot === group.slot)}
                renderItem={(instance) => {
                  const item = getEquipment(instance.equipmentId)
                  if (!item) return null
                  const equipped = loadout[`${item.slot}InstanceId`] === instance.instanceId
                  const modifiers = formatEquipmentModifiers(item.modifiers)
                  return (
                    <List.Item
                      actions={[
                        <Button key="equip" type={equipped ? 'default' : 'primary'} disabled={!isActive || equipped || instance.durability <= 0} onClick={() => onEquip(instance.instanceId)}>
                          {equipped ? '已裝備' : '裝備'}
                        </Button>,
                      ]}
                    >
                      <List.Item.Meta
                        avatar={<span>{item.icon}</span>}
                        title={<Space><Typography.Text strong>{item.name}</Typography.Text><Tag>{EQUIPMENT_SLOT_LABELS[item.slot]}</Tag><Tag color={instance.durability <= 0 ? 'red' : 'blue'}>耐久 {instance.durability} / {instance.maxDurability}</Tag></Space>}
                        description={<Space orientation="vertical" size={2}><Typography.Text type="secondary"><HighlightText>{item.description}</HighlightText></Typography.Text><Typography.Text type="success">屬性：{modifiers}</Typography.Text></Space>}
                      />
                    </List.Item>
                  )
                }}
              />
            ),
          }))} />
          {getEquipmentInventory(player).length === 0 && (
            <Typography.Text type="secondary">目前沒有裝備。</Typography.Text>
          )}
        </>
      )}
    </Modal>
  )
}

export default EquipmentModal