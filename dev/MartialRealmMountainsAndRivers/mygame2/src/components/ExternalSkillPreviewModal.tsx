import { Button, Flex, Modal, Space, Typography } from 'antd'
import type { ExternalSkillPreview } from '../game/types'
import PreviewStats from './PreviewStats'

type Props = {
  preview: ExternalSkillPreview | null
  onConfirm: () => void
  onCancel: () => void
}

function ExternalSkillPreviewModal({ preview, onConfirm, onCancel }: Props) {
  return (
    <Modal
      title="外功預期結果"
      open={preview !== null}
      onCancel={onCancel}
      footer={<Space><Button onClick={onCancel}>取消</Button><Button type="primary" danger onClick={onConfirm}>確定施放</Button></Space>}
      destroyOnHidden
    >
      {preview && <Flex vertical gap={12}>
        <Typography.Title level={5} style={{ margin: 0 }}>{preview.skillName}</Typography.Title>
        <Typography.Paragraph>{preview.playerName} 將對 {preview.targetMode === 'self' ? '自己' : preview.targetName} 施放此功法。</Typography.Paragraph>
        <PreviewStats
          items={[
            { label: '作用對象', value: preview.targetMode === 'self' ? '自身' : preview.targetMode === 'nest' ? '巢穴' : '敵方目標' },
            ...(preview.targetMode === 'self'
              ? [{ label: '功法作用', value: preview.effectSummary ?? '作用於自身' }]
              : [{ label: '預期傷害', value: preview.expectedDamage }]),
            ...(preview.tripleResonance
              ? [{ label: '三重共振', value: '連攜＋共鳴＋相剋｜傷害 ×1.95，目標震懾一回合' }]
              : preview.synergy
                ? [{ label: '五行相生', value: '內功生外功｜傷害 ×1.25' }]
                : []),
            ...(preview.targetMode !== 'self' && preview.criticalRate !== undefined
              ? [{ label: '外功暴擊率', value: `${preview.criticalRate}%` }]
              : []),
            ...(preview.targetMode !== 'self' && preview.targetReduction !== undefined && preview.targetReduction > 0
              ? [{ label: '敵方減傷率', value: `${preview.targetReduction}%` }]
              : []),
            ...(preview.targetMode !== 'self' && preview.targetEvasion !== undefined && preview.targetEvasion > 0
              ? [{ label: '敵方回避率', value: `${preview.targetEvasion}%` }]
              : []),
            ...(preview.terrainResonance ? [{ label: '天地共鳴', value: preview.terrainResonance }] : []),
            { label: '內力消耗', value: preview.innerPowerCost },
            ...(preview.elementInteraction ? [{ label: '五行相剋', value: preview.elementInteraction }] : []),
            ...(preview.targetMode !== 'self' && preview.targetHealth !== undefined && preview.targetMaxHealth !== undefined
              ? [{ label: '目標血量', value: `${Math.round(preview.targetHealth)} / ${Math.round(preview.targetMaxHealth)}` }]
              : []),
          ]}
        />
        <Typography.Paragraph type="secondary" style={{ margin: 0 }}>確認後才會消耗內力並使用本回合的外功行動。</Typography.Paragraph>
      </Flex>}
    </Modal>
  )
}

export default ExternalSkillPreviewModal
