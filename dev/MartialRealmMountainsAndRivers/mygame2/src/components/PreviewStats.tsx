import { Flex } from 'antd'
import type { ReactNode } from 'react'
import StatValue from './StatValue'

type PreviewStatsProps = {
  /** 一組「標籤 + 數值」對。 */
  items: { label: ReactNode; value: ReactNode }[]
}

/**
 * 預覽數值格（L3 封裝元件）。
 * 統一「攻擊預覽 / 外功預覽」中「標籤 + 數值」並排的呈現。
 */
function PreviewStats({ items }: PreviewStatsProps) {
  return (
    <Flex vertical gap={6} className="preview-stats">
      {items.map((item, index) => (
        <StatValue key={index} label={item.label}>{item.value}</StatValue>
      ))}
    </Flex>
  )
}

export default PreviewStats
