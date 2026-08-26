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
            <SectionTitle title="生存" />
            <Row label="hitsSurvivable" value={formatNumber(inputs.hitsSurvivable)} />
            <Row label="staminaRatio" value={formatNumber(inputs.staminaRatio)} />
            <Row label="innerPowerRatio" value={formatNumber(inputs.innerPowerRatio)} />
            <SectionTitle title="威脅" />
            <Row label="distToNearestThreat" value={formatNumber(inputs.distToNearestThreat)} />
            <Row label="maxVisibleEnemyDamage" value={formatNumber(inputs.maxVisibleEnemyDamage)} />
            <Row label="visibleCreatureIds" value={inputs.visibleCreatureIds.length > 0 ? inputs.visibleCreatureIds.join(', ') : '—'} />
            <Row label="distToNearestCreature" value={formatNumber(inputs.distToNearestCreature)} />
            <Row label="nearestCreatureId" value={inputs.nearestCreatureId || '—'} />
            <SectionTitle title="巢穴" />
            <Row label="distToNearestNest" value={formatNumber(inputs.distToNearestNest)} />
            <Row label="nearestNestId" value={inputs.nearestNestId || '—'} />
            <SectionTitle title="道具" />
            <Row label="reachableItemCount" value={formatNumber(inputs.reachableItemCount)} />
            <Row label="distToNearestItem" value={formatNumber(inputs.distToNearestItem)} />
            <Row label="bestItemToUse" value={inputs.bestItemToUse ? `${inputs.bestItemToUse.name} (${inputs.bestItemToUse.effect})` : '—'} />
            <SectionTitle title="資源" />
            <Row label="reachableResourceCount" value={formatNumber(inputs.reachableResourceCount)} />
            <Row label="nearestResourcePoint" value={inputs.nearestResourcePoint ? `(${inputs.nearestResourcePoint.position.row},${inputs.nearestResourcePoint.position.column})` : '—'} />
            <Row label="distToNearestResourcePoint" value={formatNumber(inputs.distToNearestResourcePoint)} />
            <Row label="isAdjacentToResourcePoint" value={inputs.isAdjacentToResourcePoint ? '是' : '否'} />
            <SectionTitle title="建設" />
            <Row label="nearestBase" value={inputs.nearestBase ? inputs.nearestBase.name : '—'} />
            <Row label="visibleBaseIds" value={inputs.visibleBaseIds.length > 0 ? inputs.visibleBaseIds.join(', ') : '—'} />
            <Row label="materialRatio" value={formatNumber(inputs.materialRatio)} />
            <Row label="canBuild" value={inputs.canBuild ? '是' : '否'} />
            <Row label="buildableBuilding" value={inputs.buildableBuilding ? inputs.buildableBuilding.name : '—'} />
            <SectionTitle title="定位" />
            <Row label="exitCount" value={formatNumber(inputs.exitCount)} />
            <Row label="nearestExit" value={inputs.nearestExit ? `(${inputs.nearestExit.row},${inputs.nearestExit.column})` : '—'} />
            <SectionTitle title="探索" />
            <Row label="unexploredReachableCount" value={formatNumber(inputs.unexploredReachableCount)} />
            <Row label="nearestUnexploredPosition" value={inputs.nearestUnexploredPosition ? `(${inputs.nearestUnexploredPosition.row},${inputs.nearestUnexploredPosition.column})` : '—'} />
            <Row label="unexploredInvisibleCells" value={formatNumber(inputs.unexploredInvisibleCells)} />
            <Row label="nearestUnexploredInvisiblePosition" value={inputs.nearestUnexploredInvisiblePosition ? `(${inputs.nearestUnexploredInvisiblePosition.row},${inputs.nearestUnexploredInvisiblePosition.column})` : '—'} />
            <SectionTitle title="屬性" />
            <Row label="availableAttributePoints" value={formatNumber(inputs.availableAttributePoints)} />
            <SectionTitle title="裝備" />
            <Row label="equipableEquipment" value={inputs.equipableEquipment ? `${inputs.equipableEquipment.name} (${inputs.equipableEquipment.slot}, 耐久${inputs.equipableEquipment.durability})` : '—'} />
            <SectionTitle title="內功" />
            <Row label="betterInnerSkill" value={inputs.betterInnerSkill ? `${inputs.betterInnerSkill.name} (悟性${inputs.betterInnerSkill.insightRequirement})` : '—'} />
            <Row label="hasDamageInnerSkill" value={inputs.hasDamageInnerSkill ? '是' : '否'} />
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

function SectionTitle({ title }: { title: string }) {
  return (
    <Typography.Text type="secondary" style={{ fontSize: 11, marginTop: 4, borderBottom: '1px solid #f0f0f0', paddingBottom: 2, display: 'block' }}>
      {title}
    </Typography.Text>
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
