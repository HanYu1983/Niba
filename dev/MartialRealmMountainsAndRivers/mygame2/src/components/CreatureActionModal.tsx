import { List, Modal, Typography } from 'antd'
import type { HighlightTerm } from './highlightTerms'
import type { CreatureActionLog } from '../game/types'
import HighlightText from './HighlightText'

type CreatureActionModalProps = {
  logs: CreatureActionLog[]
  open: boolean
  onClose: () => void
  /** 額外要高亮的名詞（生物名、據點名、巢穴名等，來自目前遊戲狀態）。 */
  extraTerms?: HighlightTerm[]
}

function CreatureActionModal({ logs, open, onClose, extraTerms }: CreatureActionModalProps) {
  return (
    <Modal
      title="生物行動結果"
      open={open}
      onOk={onClose}
      onCancel={onClose}
      okText="知道了"
      cancelButtonProps={{ style: { display: 'none' } }}
      destroyOnHidden
    >
      <Typography.Paragraph>
        生物剛完成一個行動：
      </Typography.Paragraph>
      {logs.length > 0 ? (
        <List
          size="small"
          dataSource={logs}
          renderItem={(log, index) => (
            <List.Item key={`${log.creatureId}-${index}`}><HighlightText extraTerms={extraTerms}>{log.message}</HighlightText></List.Item>
          )}
        />
      ) : (
        <Typography.Text type="secondary">本回合沒有生物行動。</Typography.Text>
      )}
    </Modal>
  )
}

export default CreatureActionModal
