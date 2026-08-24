import { Progress } from 'antd'
import type { ProgressProps } from 'antd'
import type { ReactNode } from 'react'

type StatProgressProps = {
  label: ReactNode
  current: number
  max: number
  status?: ProgressProps['status']
}

function StatProgress({ label, current, max, status = 'active' }: StatProgressProps) {
  const safeMax = Math.max(0, max)
  const percent = safeMax > 0
    ? Math.min(100, Math.max(0, Math.round((current / safeMax) * 100)))
    : 0

  return (
    <>
      <span className="player-panel__stat-label">{label}</span>
      <Progress
        percent={percent}
        format={() => `${current} / ${max}`}
        size="small"
        status={status}
      />
    </>
  )
}

export default StatProgress
