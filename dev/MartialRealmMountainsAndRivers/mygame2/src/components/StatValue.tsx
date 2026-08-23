import { Typography } from 'antd'
import type { ReactNode } from 'react'
import StatLabel from './StatLabel'

type StatValueProps = {
  label: ReactNode
  children: ReactNode
  /** 數值強調色調（僅限封裝元件內部使用）。 */
  tone?: 'default' | 'gold'
}

/**
 * 標籤 + 純數值（L3 封裝元件）。
 * 統一「金錢、體力、經驗」等無進度條數值的呈現，禁止在畫面層自行拼湊。
 */
function StatValue({ label, children, tone = 'default' }: StatValueProps) {
  return (
    <div className={`stat-value${tone === 'gold' ? ' stat-value--gold' : ''}`}>
      <StatLabel>{label}</StatLabel>
      <Typography.Text strong>{children}</Typography.Text>
    </div>
  )
}

export default StatValue
