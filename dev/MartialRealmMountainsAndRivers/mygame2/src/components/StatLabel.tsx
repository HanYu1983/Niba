import { Typography } from 'antd'
import type { ReactNode } from 'react'

type StatLabelProps = {
  children: ReactNode
}

/**
 * 欄位小標籤（L3 封裝元件）。
 * 統一「官階」「聲望」等欄位標籤的樣式，禁止在畫面層自行拼湊。
 */
function StatLabel({ children }: StatLabelProps) {
  return <Typography.Text className="stat-label">{children}</Typography.Text>
}

export default StatLabel
