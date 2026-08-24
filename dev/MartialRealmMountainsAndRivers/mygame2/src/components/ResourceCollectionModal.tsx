import { Button, Checkbox, Modal, Space, Typography } from 'antd'
import { useState } from 'react'
import { getResourceCollectionMaterialGain } from '../game/rules/baseRules'
import { getEffectiveMaterialGain } from '../game/rules/policyRules'
import type { PlayerState, ResourcePointState, BaseState, GameState } from '../game/types'

type ResourceCollectionModalProps = {
  player: PlayerState | null
  resourcePoint: ResourcePointState | null
  base: BaseState | null
  gameState: GameState
  onConfirm: () => void
  onCancel: () => void
  onConfirmBatch: () => void
}

function ResourceCollectionModal({
  player,
  resourcePoint,
  base,
  gameState,
  onConfirm,
  onCancel,
  onConfirmBatch,
}: ResourceCollectionModalProps) {
  const [allIn, setAllIn] = useState(false)
  return (
    <Modal
      title="採集資源點"
      open={resourcePoint !== null}
      onCancel={onCancel}
      footer={
        <Space>
          <Button onClick={onCancel}>取消</Button>
          <Button type="primary" onClick={allIn ? onConfirmBatch : onConfirm}>{allIn ? '全部投入採集' : '確認採集'}</Button>
        </Space>
      }
      destroyOnHidden
    >
      {resourcePoint && base && player && (
        <Space orientation="vertical" size={12}>
          <Typography.Paragraph>
            {player.name} 將採集「{resourcePoint.name}」。
          </Typography.Paragraph>
          <Typography.Text>
            所屬據點「{base.name}」建料 +{getEffectiveMaterialGain(base, getResourceCollectionMaterialGain(base, resourcePoint.materialIncome), gameState)}
          </Typography.Text>
          <Typography.Text type="success">玩家聲望 +5</Typography.Text>
          <Checkbox checked={allIn} onChange={(event) => setAllIn(event.target.checked)}>
            全部投入本回合可用體力
          </Checkbox>
        </Space>
      )}
    </Modal>
  )
}

export default ResourceCollectionModal