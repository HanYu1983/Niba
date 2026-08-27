import { Progress, Typography } from 'antd'
import type { ProgressProps } from 'antd'
import type { ReactNode } from 'react'
import StatLabel from './StatLabel'

type StatBarProps = {
  label: ReactNode
  current: number
  max: number
  status?: ProgressProps['status']
  /** 是否顯示數值文字（current / max）。預設顯示。 */
  showValue?: boolean
  /** 進度條漸層色（僅限封裝元件內部使用）。 */
  strokeColor?: ProgressProps['strokeColor']
}

/**
 * 數值 + 進度條（L3 封裝元件）。
 * 統一「血量、內力、聲望」等數值條的呈現，禁止在畫面層自行拼湊。
 */
function StatBar({ label, current, max, status = 'active', showValue = true, strokeColor }: StatBarProps) {
  const safeMax = Math.max(0, max)
  const percent = safeMax > 0
    ? Math.min(100, Math.max(0, Math.round((current / safeMax) * 100)))
    : 0

  return (
    <div className="stat-bar">
      <div className="stat-bar__head">
        <StatLabel>{label}</StatLabel>
        {showValue && <Typography.Text strong>{Math.floor(current)}{safeMax > 0 ? ` / ${Math.floor(max)}` : ''}</Typography.Text>}
      </div>
      <Progress
        percent={percent}
        showInfo={false}
        size="small"
        status={status}
        strokeColor={strokeColor}
      />
    </div>
  )
}

export default StatBar
