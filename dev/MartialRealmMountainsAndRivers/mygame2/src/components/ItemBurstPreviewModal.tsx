import { Button, Flex, Modal, Space, Typography } from 'antd'
import type { ItemBurstPreview } from '../game/types'
import PreviewStats from './PreviewStats'

type ItemBurstPreviewModalProps = {
  preview: ItemBurstPreview | null
  onConfirm: () => void
  onCancel: () => void
}

function ItemBurstPreviewModal({ preview, onConfirm, onCancel }: ItemBurstPreviewModalProps) {
  return (
    <Modal
      title="道具預期結果"
      open={preview !== null}
      footer={
        <Space>
          <Button onClick={onCancel}>取消</Button>
          <Button type="primary" danger onClick={onConfirm}>
            確定使用
          </Button>
        </Space>
      }
      onCancel={onCancel}
      destroyOnHidden
    >
      {preview && (
        <Flex vertical gap={12}>
          <Typography.Paragraph>
            {preview.playerName} 即將使用 {preview.itemIcon} {preview.itemName} 攻擊 {preview.targetName}。
          </Typography.Paragraph>
          <PreviewStats
            items={[
              { label: '預期傷害', value: Math.round(preview.expectedDamage) },
              ...(preview.elementInteraction ? [{ label: '五行相剋', value: preview.elementInteraction }] : []),
              { label: '目標血量', value: `${Math.round(preview.targetHealth)} / ${Math.round(preview.targetMaxHealth)}` },
            ]}
          />
        </Flex>
      )}
    </Modal>
  )
}

export default ItemBurstPreviewModal