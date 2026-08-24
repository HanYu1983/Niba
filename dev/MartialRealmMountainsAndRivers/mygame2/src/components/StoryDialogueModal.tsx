import { useEffect } from 'react'
import { Button, Flex, Typography, Modal } from 'antd'
import type { DialogueQueueEntry } from '../game/types'

type StoryDialogueModalProps = {
  entry: DialogueQueueEntry | null
  remaining: number
  onAdvance: () => void
  onSkip: () => void
}

/**
 * 劇情對話彈窗。
 *
 * 顯示對話佇列中的單一步驟（說話者頭像、名稱、對話文），並提供：
 * - 繼續（下一句）：Space / Enter，或點擊按鈕
 * - 跳過對話：Esc，或點擊按鈕
 *
 * 對話為阻塞式彈窗，顯示期間凍結地圖交互（由 blockingModal 控管）。
 */
function StoryDialogueModal({ entry, remaining, onAdvance, onSkip }: StoryDialogueModalProps) {
  useEffect(() => {
    if (!entry) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        onAdvance()
      } else if (event.key === 'Escape') {
        event.preventDefault()
        onSkip()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [entry, onAdvance, onSkip])

  return (
    <Modal
      title="劇情對話"
      open={entry !== null}
      closable={false}
      maskClosable={false}
      keyboard={false}
      footer={null}
      destroyOnHidden
    >
      {entry && (
        <Flex vertical gap={16}>
          <Flex align="center" gap={12}>
            <div
              style={{
                width: 48,
                height: 48,
                fontSize: 28,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(0,0,0,0.06)',
                borderRadius: 8,
              }}
            >
              {entry.speakerIcon || '🗨️'}
            </div>
            <Flex vertical>
              <Typography.Text strong>{entry.speakerName}</Typography.Text>
              {remaining > 0 && (
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  還有 {remaining} 句
                </Typography.Text>
              )}
            </Flex>
          </Flex>

          <Typography.Paragraph
            style={{
              margin: 0,
              fontSize: 15,
              lineHeight: 1.7,
              whiteSpace: 'pre-wrap',
              height: 120,
              overflowY: 'auto',
            }}
          >
            {entry.content}
          </Typography.Paragraph>

          <Flex justify="space-between" align="center">
            <Button type="text" onClick={onSkip}>跳過對話（Esc）</Button>
            <Button type="primary" onClick={onAdvance}>
              {remaining > 0 ? '下一句（Enter）' : '繼續（Enter）'}
            </Button>
          </Flex>
        </Flex>
      )}
    </Modal>
  )
}

export default StoryDialogueModal
