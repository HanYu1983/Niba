import { Button, Space, Tag, Tooltip, Typography } from 'antd'
import type { ReactNode } from 'react'
import HighlightText from './HighlightText'

type BuildingListItemProps = {
  icon: string
  name: string
  description: string
  tags?: ReactNode
  status?: ReactNode
  actions: BuildingListAction[]
}

export type BuildingListAction = {
  key: string
  label: string
  disabled?: boolean
  tooltip?: string
  onClick: () => void
}

function BuildingListItem({
  icon,
  name,
  description,
  tags,
  status,
  actions,
}: BuildingListItemProps) {
  return (
    <div className="building-list-item">
      <div className="building-list-item__header">
        <span className="building-list-item__icon">{icon}</span>
        <div className="building-list-item__title">
          <Space size={6}>
            <Typography.Text strong>{name}</Typography.Text>
            {status}
          </Space>
          <Typography.Text className="building-list-item__description">
            <HighlightText>{description}</HighlightText>
          </Typography.Text>
          {tags && (
            <Space size={4} wrap className="building-list-item__tags">
              {tags}
            </Space>
          )}
        </div>
      </div>
      <div className="building-list-item__actions">
        {actions.map((action) => {
          const button = (
            <Button
              key={action.key}
              size="small"
              disabled={action.disabled}
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          )
          return action.tooltip
            ? <Tooltip key={action.key} title={action.tooltip}>{button}</Tooltip>
            : button
        })}
      </div>
    </div>
  )
}

export function BuiltTag() {
  return <Tag color="green">已建造</Tag>
}

export default BuildingListItem