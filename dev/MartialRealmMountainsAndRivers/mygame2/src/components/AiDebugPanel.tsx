import { Collapse, Flex, Tag, Typography } from 'antd'
import type { GameState, PlayerState } from '../game/types'
import { computeFuzzyInputs } from '../game/ai/fuzzy/fuzzyInputs'
import { evaluateAllGoals } from '../game/ai/fuzzy/goals'
import { MIN_THRESHOLD } from '../game/ai/fuzzy/decision'

type AiDebugPanelProps = {
  player: PlayerState
  gameState: GameState
}

function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return '∞'
  return value % 1 === 0 ? String(value) : value.toFixed(2)
}

function AiDebugPanel({ player, gameState }: AiDebugPanelProps) {
  const inputs = computeFuzzyInputs(gameState, player)
  const goals = evaluateAllGoals(inputs)

  return (
    <Collapse
      className="player-panel__collapse"
      defaultActiveKey={['fuzzy-inputs', 'goals']}
      items={[
        {
          key: 'fuzzy-inputs',
          label: <Typography.Text strong>Fuzzy Inputs</Typography.Text>,
          children: <Flex vertical gap={4}>
            <Row label="hitsSurvivable" value={formatNumber(inputs.hitsSurvivable)} />
            <Row label="staminaRatio" value={formatNumber(inputs.staminaRatio)} />
            <Row label="distToNearestThreat" value={formatNumber(inputs.distToNearestThreat)} />
            <Row label="maxVisibleEnemyDamage" value={formatNumber(inputs.maxVisibleEnemyDamage)} />
            <Row label="reachableItemCount" value={formatNumber(inputs.reachableItemCount)} />
            <Row label="reachableResourceCount" value={formatNumber(inputs.reachableResourceCount)} />
            <Row label="distToNearestItem" value={formatNumber(inputs.distToNearestItem)} />
            <Row label="exitCount" value={formatNumber(inputs.exitCount)} />
            <Row label="nearestExit" value={inputs.nearestExit ? `(${inputs.nearestExit.row},${inputs.nearestExit.column})` : '—'} />
          </Flex>,
        },
        {
          key: 'goals',
          label: <Typography.Text strong>Goals</Typography.Text>,
          children: <Flex vertical gap={4}>
            {Object.entries(goals).map(([name, result]) => (
              <Flex key={name} align="center" gap={8}>
                <Typography.Text style={{ width: 140, flexShrink: 0 }}>{name}</Typography.Text>
                <Tag color={result.score >= MIN_THRESHOLD ? 'green' : result.score > 0 ? 'default' : 'default'}>
                  {formatNumber(result.score)}
                </Tag>
                {result.target && (
                  <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                    → {result.target.kind}
                  </Typography.Text>
                )}
              </Flex>
            ))}
          </Flex>,
        },
      ]}
    />
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <Flex justify="space-between">
      <Typography.Text type="secondary">{label}</Typography.Text>
      <Typography.Text>{value}</Typography.Text>
    </Flex>
  )
}

export default AiDebugPanel
