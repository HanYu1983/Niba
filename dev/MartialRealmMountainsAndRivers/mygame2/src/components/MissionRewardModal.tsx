import { Button, Checkbox, Modal, Space, Typography } from 'antd'
import { useState } from 'react'
import { getMissionReward } from '../game/rules/buildingProgressionRules'
import { BUILDING_TYPES } from '../game/catalogs/buildingCatalog'
import type { PlayerState, BaseState } from '../game/types'

type MissionRewardModalProps = {
  player: PlayerState | null
  base: BaseState | null
  onConfirm: () => void
  onCancel: () => void
  onConfirmBatch: () => void
}

function MissionRewardModal({ player, base, onConfirm, onCancel, onConfirmBatch }: MissionRewardModalProps) {
  const [allIn, setAllIn] = useState(false)
  return (
    <Modal
      title="執行任務"
      open={base !== null}
      onCancel={onCancel}
      footer={
        <Space>
          <Button onClick={onCancel}>取消</Button>
          <Button type="primary" onClick={allIn ? onConfirmBatch : onConfirm}>{allIn ? '全部投入執行' : '確認執行'}</Button>
        </Space>
      }
      destroyOnHidden
    >
      {player && base && (() => {
        const boardLevel = base.buildings.find((building) => building.type === BUILDING_TYPES.BOARD)?.level ?? 1
        const reward = getMissionReward(boardLevel)
        return (
          <Space orientation="vertical" size={10}>
            <Typography.Paragraph>
              {player.name} 將在「{base.name}」執行告示牌任務。
            </Typography.Paragraph>
            <Typography.Text type="secondary">告示牌等級 Lv.{boardLevel}</Typography.Text>
            <Typography.Text type="success">完成任務後獲得金錢 +{reward.money}、聲望 +{reward.prestige}</Typography.Text>
            <Checkbox checked={allIn} onChange={(event) => setAllIn(event.target.checked)}>
              全部投入本回合可用體力
            </Checkbox>
          </Space>
        )
      })()}
    </Modal>
  )
}

export default MissionRewardModal