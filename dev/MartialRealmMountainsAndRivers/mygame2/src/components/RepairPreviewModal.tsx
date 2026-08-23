import { Button, Descriptions, Flex, List, Modal, Space, Tag, Typography } from 'antd'
import type { RepairPreview } from '../game/types'

type RepairPreviewModalProps = {
  preview: RepairPreview | null
  onCancel: () => void
  onConfirm: () => void
}

function RepairPreviewModal({ preview, onCancel, onConfirm }: RepairPreviewModalProps) {
  return (
    <Modal
      title="修理預覽"
      open={preview !== null}
      onCancel={onCancel}
      footer={
        <Space>
          <Button onClick={onCancel}>取消</Button>
          <Button type="primary" onClick={onConfirm}>確認修理</Button>
        </Space>
      }
      destroyOnHidden
    >
      {preview && (
        <Space orientation="vertical" size={12}>
          <Descriptions column={1} size="small" bordered items={[
            { key: 'count', label: '修理數量', children: `${preview.equipmentCount} 件` },
            { key: 'durability', label: '總恢復耐久', children: `${preview.durabilityRestored} 點` },
            { key: 'stamina', label: '體力消耗', children: <Tag color="blue">2 點</Tag> },
            { key: 'money', label: '金錢消耗', children: <Tag color="green">0（免費修理）</Tag> },
          ]} />
          <Typography.Text strong>修理明細</Typography.Text>
          <List
            size="small"
            bordered
            dataSource={preview.repairedEquipment ?? []}
            renderItem={(equipment) => (
              <List.Item>
                <Flex vertical gap={2}>
                  <Typography.Text strong>{equipment.icon} {equipment.name}</Typography.Text>
                  <Typography.Text type="secondary">
                    {equipment.beforeDurability} / {equipment.maxDurability} → {equipment.maxDurability} / {equipment.maxDurability}（恢復 {equipment.durabilityRestored}）
                  </Typography.Text>
                </Flex>
              </List.Item>
            )}
          />
          {preview.lockedEquipmentCount ? (
            <Typography.Text type="danger">
              有 {preview.lockedEquipmentCount} 件裝備因修理工坊等級不足而無法修理。
            </Typography.Text>
          ) : null}
          <Typography.Text type="secondary">確認後會立即修理以上裝備、扣除 2 點體力，並結束目前玩家回合。</Typography.Text>
        </Space>
      )}
    </Modal>
  )
}

export default RepairPreviewModal
