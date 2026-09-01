import { Button, Flex, Modal, Space, Typography } from 'antd'
import type { AttackPreview } from '../game/types'
import PreviewStats from './PreviewStats'

type AttackPreviewModalProps = {
  preview: AttackPreview | null
  onConfirm: () => void
  onCancel: () => void
}

function AttackPreviewModal({ preview, onConfirm, onCancel }: AttackPreviewModalProps) {
  return (
    <Modal
      title="戰鬥預期結果"
      open={preview !== null}
      footer={
        <Space>
          <Button onClick={onCancel}>取消</Button>
          <Button type="primary" danger onClick={onConfirm}>
            確定攻擊
          </Button>
        </Space>
      }
      onCancel={onCancel}
      destroyOnHidden
    >
      {preview && (
        <Flex vertical gap={12}>
          <Typography.Paragraph>
            {preview.playerName} 即將攻擊 {preview.targetName}。
          </Typography.Paragraph>
          <PreviewStats
            items={[
              { label: '預期傷害', value: preview.expectedDamage },
              { label: '普通攻擊暴擊率', value: `${preview.criticalRate}%` },
              ...(preview.targetReduction !== undefined && preview.targetReduction > 0
                ? [{ label: '敵方減傷率', value: `${preview.targetReduction}%` }]
                : []),
              ...(preview.targetEvasion !== undefined && preview.targetEvasion > 0
                ? [{ label: '敵方回避率', value: `${preview.targetEvasion}%` }]
                : []),
              ...(preview.elementInteraction ? [{ label: '五行相剋', value: preview.elementInteraction }] : []),
              ...(preview.terrainResonance ? [{ label: '天地共鳴', value: preview.terrainResonance }] : []),
              { label: '目標血量', value: `${Math.round(preview.targetHealth)} / ${Math.round(preview.targetMaxHealth)}` },
            ]}
          />
        </Flex>
      )}
    </Modal>
  )
}

export default AttackPreviewModal
