import { Flex, Tag, Typography } from 'antd'
import type { ReactNode } from 'react'
import StatBar from './StatBar'

type LocationDetailsCardProps = {
  /** 地點圖示（emoji）。 */
  icon: ReactNode
  /** 地點名稱。 */
  name: ReactNode
  /** 位置描述（如「位置 (1, 2)」）。 */
  position: ReactNode
  /** 狀態標籤文字。 */
  statusLabel: ReactNode
  /** 狀態標籤顏色（antd Tag color）。 */
  statusColor?: string
  /** 血量數值。 */
  health: number
  /** 最大血量。 */
  maxHealth: number
  /** 血量標籤文字，預設「血量」。 */
  healthLabel?: string
  /** 額外內容（按鈕、描述等）。 */
  children?: ReactNode
}

/**
 * 地點詳細資料卡（L3 封裝元件）。
 * 統一「據點 / 巢穴 / 資源點」的身份 + 狀態 + 血量進度呈現。
 */
function LocationDetailsCard({
  icon,
  name,
  position,
  statusLabel,
  statusColor = 'gold',
  health,
  maxHealth,
  healthLabel = '血量',
  children,
}: LocationDetailsCardProps) {
  return (
    <Flex vertical gap={12}>
      <Flex align="center" gap={8}>
        <span role="img" aria-label="地點圖示" className="location-details-card__icon">{icon}</span>
        <Flex vertical flex={1} style={{ minWidth: 0 }}>
          <Typography.Title level={4} style={{ margin: 0 }}>{name}</Typography.Title>
          <Typography.Text type="secondary">{position}</Typography.Text>
        </Flex>
        <Tag color={statusColor}>{statusLabel}</Tag>
      </Flex>

      <StatBar
        label={healthLabel}
        current={health}
        max={maxHealth}
        status={health === 0 ? 'exception' : 'active'}
      />

      {children}
    </Flex>
  )
}

export default LocationDetailsCard
