import { Alert, Button, Flex, Modal, Typography } from 'antd'
import type { GameSaveSlotSummary } from '../game/gameSave'
import SaveSlotList from './SaveSlotList'

type GameSaveModalProps = {
  open: boolean
  slots: GameSaveSlotSummary[]
  onSave: (slot: number) => void
  onLoad: (slot: number) => void
  onDelete: (slot: number) => void
  onClose: () => void
}

function GameSaveModal({ open, slots, onSave, onLoad, onDelete, onClose }: GameSaveModalProps) {
  return <Modal title="遊戲存檔" open={open} onCancel={onClose} footer={<Button onClick={onClose}>關閉</Button>} destroyOnHidden>
    <Flex vertical gap={12}>
      <Alert type="warning" showIcon message="重要提醒：存檔只保存在目前瀏覽器的網頁快取（localStorage）中。" description="清除瀏覽器資料、使用無痕模式、換瀏覽器或換裝置，都可能造成存檔遺失。請不要把網頁快取視為永久或雲端備份。" />
      <SaveSlotList slots={slots} onSave={onSave} onLoad={onLoad} onDelete={onDelete} />
      <Typography.Text type="secondary">儲存到已有資料的欄位會覆蓋原存檔。</Typography.Text>
    </Flex>
  </Modal>
}

export default GameSaveModal