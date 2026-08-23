import { Button, Card, Flex, Typography } from 'antd'
import type { ReactNode } from 'react'
import HighlightText from './HighlightText'

type OptionCardProps = {
  /** 選項標題。 */
  title: ReactNode
  /** 選項描述。 */
  description: ReactNode
  /** 按鈕文字。 */
  actionLabel: ReactNode
  /** 按鈕是否可用。 */
  disabled?: boolean
  /** 按鈕類型（primary / default）。 */
  buttonType?: 'primary' | 'default'
  /** 是否為危險操作（紅色按鈕）。 */
  danger?: boolean
  /** 點擊按鈕。 */
  onAction: () => void
}

/**
 * 選項卡片（L3 封裝元件）。
 * 統一「探索事件 / 廢墟」中可選擇動作卡片的呈現。
 */
function OptionCard({ title, description, actionLabel, disabled = false, buttonType = 'primary', danger = false, onAction }: OptionCardProps) {
  return (
    <Card size="small">
      <Flex justify="space-between" align="center" gap={12}>
        <Flex vertical gap={2}>
          <Typography.Text strong>{title}</Typography.Text>
          <Typography.Text type="secondary">
            {typeof description === 'string' ? <HighlightText>{description}</HighlightText> : description}
          </Typography.Text>
        </Flex>
        <Button type={buttonType} danger={danger} disabled={disabled} onClick={onAction}>
          {actionLabel}
        </Button>
      </Flex>
    </Card>
  )
}

export default OptionCard
