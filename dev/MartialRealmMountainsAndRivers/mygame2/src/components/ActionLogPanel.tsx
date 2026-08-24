import { Button, Empty, List, Modal, Typography } from 'antd'
import type { AiActionEvent } from '../game/ai/aiActionEvent'
import { formatAiActionEvent } from '../game/ai/aiActionEvent'

type ActionLogPanelProps = {
  open: boolean
  events: AiActionEvent[]
  onClose: () => void
}

/** 全域行動日誌檢視器（重構文件 §15 Phase 5）：最新事件在最上，失敗行動以危險色標示。 */
function ActionLogPanel({ open, events, onClose }: ActionLogPanelProps) {
  const latestFirst = events.slice().reverse()
  return (
    <Modal
      title="📜 全域行動日誌"
      open={open}
      footer={<Button onClick={onClose}>關閉</Button>}
      onCancel={onClose}
      width={560}
    >
      {latestFirst.length === 0 ? (
        <Empty description="目前沒有行動紀錄。" />
      ) : (
        <div style={{ maxHeight: 480, overflowY: 'auto' }}>
          <List
            size="small"
            dataSource={latestFirst}
            rowKey={(event) => event.id}
            renderItem={(event) => (
              <List.Item style={{ padding: '4px 0' }}>
                <Typography.Text type={event.result === 'failed' ? 'danger' : undefined} style={{ fontSize: 13 }}>
                  {formatAiActionEvent(event)}
                </Typography.Text>
              </List.Item>
            )}
          />
        </div>
      )}
    </Modal>
  )
}

export default ActionLogPanel
