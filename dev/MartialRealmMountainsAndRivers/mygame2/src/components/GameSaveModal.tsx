import { Alert, Button, Flex, List, Modal, Tag, Tooltip, Typography } from 'antd'
import { FileDoneOutlined, ClockCircleOutlined } from '@ant-design/icons'
import type { GameSaveSlotSummary } from '../game/gameSave'

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
      <List
        bordered
        dataSource={slots}
        renderItem={(entry) => <List.Item actions={[
          ...(entry.slot === 0 ? [] : [
            <Button key="save" type="primary" onClick={() => onSave(entry.slot)}>儲存</Button>,
          ]),
          <Button key="load" disabled={!entry.savedAt} onClick={() => onLoad(entry.slot)}>讀取</Button>,
          ...(entry.slot === 0 ? [] : [
            <Button key="delete" danger disabled={!entry.savedAt} onClick={() => onDelete(entry.slot)}>刪除</Button>,
          ]),
        ]}>
          <List.Item.Meta
            title={
              <Flex align="center" gap={8}>
                <span>{entry.slot === 0 ? '自動存檔' : `存檔欄位 ${entry.slot}`}</span>
                {entry.savedAt && entry.rewardStatus === 'settled' && (
                  <Tooltip title="此局武學殘卷已結算入名册；讀取後不會重複計算。">
                    <Tag icon={<FileDoneOutlined />} color="gold" style={{ marginInlineEnd: 0 }}></Tag>
                  </Tooltip>
                )}
                {entry.savedAt && entry.rewardStatus === 'pending' && (
                  <Tooltip title="此存檔為局末狀態但尚未結算，讀取後會正常結算。">
                    <Tag icon={<ClockCircleOutlined />} color="default" style={{ marginInlineEnd: 0 }}>局末待結算</Tag>
                  </Tooltip>
                )}
              </Flex>
            }
            description={entry.savedAt ? `第 ${entry.round ?? 0} 回合｜${new Date(entry.savedAt).toLocaleString()}` : '尚未產生自動存檔'}
          />
        </List.Item>}
      />
      <Typography.Text type="secondary">儲存到已有資料的欄位會覆蓋原存檔。</Typography.Text>
    </Flex>
  </Modal>
}

export default GameSaveModal