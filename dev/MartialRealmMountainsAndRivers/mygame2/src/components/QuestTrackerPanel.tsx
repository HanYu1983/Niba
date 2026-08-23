import { Card, Collapse, Flex, Progress, Tag, Typography } from 'antd'
import { CheckCircleOutlined, AimOutlined } from '@ant-design/icons'
import type { GameState } from '../game/types'

type QuestTrackerPanelProps = {
  gameState: GameState
}

/**
 * 任務追蹤 HUD：顯示劇本模式的主線與支線目標進度。
 * 僅在 campaignState 存在（劇本模式）時顯示。
 */
function QuestTrackerPanel({ gameState }: QuestTrackerPanelProps) {
  const campaign = gameState.campaignState
  if (!campaign) return null

  const objectives = campaign.activeObjectives
  const mainObjectives = objectives.filter((objective) => !objective.isOptional)
  const optionalObjectives = objectives.filter((objective) => objective.isOptional)

  const renderObjective = (objective: { id: string; title: string; currentValue: number; targetValue: number; completed: boolean; isOptional?: boolean }) => {
    const percent = objective.targetValue > 0
      ? Math.min(100, Math.round((objective.currentValue / objective.targetValue) * 100))
      : 0
    return (
      <Flex key={objective.id} vertical gap={2} style={{ padding: '4px 0' }}>
        <Flex align="center" gap={6}>
          {objective.completed ? (
            <CheckCircleOutlined style={{ color: '#52c41a' }} />
          ) : (
            <AimOutlined style={{ color: '#8c8c8c' }} />
          )}
          <Typography.Text
            style={{
              fontSize: 13,
              textDecoration: objective.completed ? 'line-through' : 'none',
              color: objective.completed ? '#8c8c8c' : '#333',
            }}
          >
            {objective.title}
          </Typography.Text>
          {objective.completed && <Tag color="success" style={{ marginInlineEnd: 0 }}>完成</Tag>}
        </Flex>
        {!objective.completed && (
          <Progress
            percent={percent}
            size="small"
            showInfo={false}
            strokeColor={objective.isOptional ? '#d4a017' : '#1677ff'}
            style={{ margin: 0 }}
          />
        )}
      </Flex>
    )
  }

  return (
    <Card
      className="quest-tracker-panel"
      size="small"
      variant="borderless"
      style={{ background: 'rgba(255,251,244,0.94)' }}
    >
      <Collapse
        ghost
        size="small"
        defaultActiveKey={['main']}
        items={[
          {
            key: 'main',
            label: (
              <Typography.Text strong style={{ fontSize: 13 }}>
                📜 主線目標
              </Typography.Text>
            ),
            children: mainObjectives.length > 0
              ? mainObjectives.map(renderObjective)
              : <Typography.Text type="secondary" style={{ fontSize: 12 }}>無主線目標</Typography.Text>,
          },
          // 沒有支線目標時整個支線區塊不顯示。
          ...(optionalObjectives.length > 0 ? [{
            key: 'optional',
            label: (
              <Typography.Text strong style={{ fontSize: 13 }}>
                ⭐ 支線目標
              </Typography.Text>
            ),
            children: optionalObjectives.map(renderObjective),
          }] : []),
        ]}
      />
    </Card>
  )
}

export default QuestTrackerPanel
