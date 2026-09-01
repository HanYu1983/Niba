import { Button, Flex, List, Tag, Tooltip } from 'antd'
import { FileDoneOutlined, ClockCircleOutlined } from '@ant-design/icons'
import type { GameSaveSlotSummary } from '../game/gameSave'

type SaveSlotListProps = {
  slots: GameSaveSlotSummary[]
  onSave: (slot: number) => void
  onLoad: (slot: number) => void
  onDelete: (slot: number) => void
  /** 是否顯示「儲存」按鈕（開始頁面讀取進度時通常不需要儲存）。 */
  showSave?: boolean
}

function SaveSlotList({ slots, onSave, onLoad, onDelete, showSave = true }: SaveSlotListProps) {
  return (
    <List
      bordered
      dataSource={slots}
      renderItem={(entry) => <List.Item actions={[
        ...(showSave && entry.slot !== 0 ? [
          <Button key="save" type="primary" onClick={() => onSave(entry.slot)}>儲存</Button>,
        ] : []),
        <Button key="load" disabled={!entry.savedAt} onClick={() => onLoad(entry.slot)}>讀取</Button>,
        ...(entry.slot !== 0 ? [
          <Button key="delete" danger disabled={!entry.savedAt} onClick={() => onDelete(entry.slot)}>刪除</Button>,
        ] : []),
      ]}>
        <List.Item.Meta
          title={
            <Flex align="center" gap={8}>
              <span>{entry.slot === 0 ? '自動存檔' : `存檔欄位 ${entry.slot}`}</span>
              {entry.savedAt && entry.mode === 'challenge' && (
                <Tooltip title="此存檔為挑戰關卡模式：勝利時闖關等級 +1。">
                  <Tag color="purple" style={{ marginInlineEnd: 0 }}>挑戰關卡</Tag>
                </Tooltip>
              )}
              {entry.savedAt && entry.mode === 'scenario' && (
                <Tooltip title={`此存檔為劇本關卡模式（${entry.scenarioId ?? '未知關卡'}）。`}>
                  <Tag color="blue" style={{ marginInlineEnd: 0 }}>劇本關卡</Tag>
                </Tooltip>
              )}
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
  )
}

export default SaveSlotList