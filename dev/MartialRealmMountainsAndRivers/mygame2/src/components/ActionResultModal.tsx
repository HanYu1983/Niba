import { Button, Modal, Space, Typography } from 'antd'
import type { ActionResult } from '../game/types'
import HighlightText from './HighlightText'

type ActionResultModalProps = {
  result: ActionResult | null
  onClose: () => void
}

function ActionResultModal({ result, onClose }: ActionResultModalProps) {
  return (
    <Modal
      title={result?.title ?? '行動結果'}
      open={result !== null}
      onCancel={onClose}
      footer={<Button type="primary" onClick={onClose}>確定</Button>}
      destroyOnHidden
    >
      {result && (
        <Space orientation="vertical" size={12}>
          <Typography.Paragraph style={{ margin: 0 }}>
            <HighlightText>{result.message}</HighlightText>
          </Typography.Paragraph>
          {result.rewards.length > 0 && (
            <>
              <Typography.Text strong>獲得結果</Typography.Text>
              {result.rewards.map((reward) => (
                <Typography.Text key={reward}>
                  <HighlightText>{reward}</HighlightText>
                </Typography.Text>
              ))}
            </>
          )}
        </Space>
      )}
    </Modal>
  )
}

export default ActionResultModal

