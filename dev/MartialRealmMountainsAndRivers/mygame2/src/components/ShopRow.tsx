import { Flex, Space, Typography } from 'antd'
import type { ReactNode } from 'react'
import HighlightText from './HighlightText'

type ShopRowProps = {
  /** 商品名稱（含圖示）。 */
  name: ReactNode
  /** 商品描述（次要資訊）。 */
  description?: ReactNode
  /** 標籤（價格、數量等）。 */
  tags?: ReactNode
  /** 右側操作區（數量輸入、按鈕）。 */
  actions?: ReactNode
}

/**
 * 商店商品列（L3 封裝元件）。
 * 統一「商店」中商品資訊 + 操作區的呈現。
 */
function ShopRow({ name, description, tags, actions }: ShopRowProps) {
  return (
    <Flex justify="space-between" align="center" gap={12}>
      <Flex vertical gap={2} style={{ minWidth: 0 }}>
        <Typography.Text strong>{name}</Typography.Text>
        {description && (
          <Typography.Text type="secondary">
            {typeof description === 'string' ? <HighlightText>{description}</HighlightText> : description}
          </Typography.Text>
        )}
        {tags && (
          <Space size={4} wrap>
            {tags}
          </Space>
        )}
      </Flex>
      {actions && <Space>{actions}</Space>}
    </Flex>
  )
}

export default ShopRow