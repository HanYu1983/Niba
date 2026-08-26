import { Card, Collapse, Flex, Tag, Tooltip, Typography } from 'antd'
import type { ReactNode } from 'react'
import AttributeSections from './AttributeSections'
import StatBar from './StatBar'
import StatValue from './StatValue'
import LevelBadge from './LevelBadge'
import SkillCard from './SkillCard'
import GovernanceRankSection from './GovernanceRankSection'
import BuffTag from './BuffTag'
import AiDebugPanel from './AiDebugPanel'
import { type PlayerState, type UpgradeableAttribute, getExperienceRequired } from '../game/types'
import { getInnerSkill, getPlayerInsightCapacityBreakdown, getSkillDamage, getSkillExperienceRequired, getSkillInnerPowerCost, getSkillProgression } from '../game/rules/skillRules'
import { allExternalSkillCatalog } from '../game/catalogs/martialHallSkillCatalog'
import { getActiveBuffsForPlayer, getBuff, getCriticalRateForPlayer, getEffectiveAttributesForPlayer, getEvasionRate, getExternalSkillCritRateForPlayer, getRootReductionRate } from '../game/rules/playerDerivedRules'
import { getGovernanceRankName, getGovernanceRankNumber } from '../game/rules/governanceRules'
import { getActiveGlobalBuffs, getGlobalBuffDisplayEntries } from '../game/rules/globalBuffRules'
import { getAuraDisplayEntries } from '../game/rules/auraRules'
import type { GameState } from '../game/types'

type PlayerPanelProps = {
  player: PlayerState
  isActive: boolean
  onAllocateAttributePoint: (attribute: UpgradeableAttribute) => void
  /** 用於顯示全局靈氣與區域靈氣。 */
  gameState: GameState
}

/** 每 10% 一個 icon，最多顯示 10 個（100%），剩餘以數字補足。 */
function renderRateWithIcons(rate: number, icon: string): ReactNode {
  const iconCount = Math.min(10, Math.floor(rate / 10))
  const icons = Array.from({ length: iconCount }, (_, index) => (
    <span key={index} role="img" aria-label={icon}>{icon}</span>
  ))
  return (
    <span>
      {icons}
      <span style={{ marginInlineStart: 4 }}>{Math.round(rate * 100) / 100}%</span>
    </span>
  )
}

function PlayerPanel({ player, isActive, onAllocateAttributePoint, gameState }: PlayerPanelProps) {
  const innerSkill = getInnerSkill(player.innerSkillId)
  const innerProgression = getSkillProgression(player, innerSkill.id)
  const equippedExternalSkills = player.equippedExternalSkillIds.map((id) => allExternalSkillCatalog.find((skill) => skill.id === id)).filter((skill): skill is NonNullable<typeof skill> => Boolean(skill))
  const effectiveAttributes = getEffectiveAttributesForPlayer(player)
  const insightCapacity = getPlayerInsightCapacityBreakdown(player)
  const activeBuffs = getActiveBuffsForPlayer(player)
  // 全局靈氣（貿易市場）與區域靈氣（巢穴/防衛營）統一整合在此區塊。
  const globalBuffEntries = getGlobalBuffDisplayEntries(getActiveGlobalBuffs(gameState))
  const auraEntries = getAuraDisplayEntries(gameState, player.position, 'player')

  return (
    <Card
      className={`player-panel${isActive ? ' player-panel--active' : ''}`}
      title={isActive ? '玩家操作（目前回合）' : '玩家操作（等待中）'}
      variant="borderless"
    >
      <Flex vertical gap={12}>
        <div className="player-panel__identity">
          <div className="player-panel__identity-copy">
            <Typography.Title level={4}>
              {player.portrait ? `${player.portrait} ` : ''}{player.name}
              {player.title ? <Typography.Text type="secondary">（{player.title}）</Typography.Text> : null}
              {player.isAI && <Tag color="purple">AI</Tag>}
            </Typography.Title>
            <Typography.Text type="secondary">{player.id}</Typography.Text>
          </div>
          <LevelBadge level={player.level ?? 1} />
          <span title={getGovernanceRankName(player.prestige)}>
            <LevelBadge level={getGovernanceRankNumber(player.prestige)} label="官階" tone="rank" />
          </span>
        </div>

        <Collapse
          className="player-panel__collapse"
          defaultActiveKey={['rank', 'basic', 'attributes', 'skills', 'qi', 'ai-debug']}
          items={[
            {
              key: 'rank',
              label: <Typography.Text strong>官階</Typography.Text>,
              extra: <Typography.Text type="secondary">治理成長</Typography.Text>,
              children: <GovernanceRankSection player={player} />,
            },
            {
              key: 'basic',
              label: <Typography.Text strong>基本資料</Typography.Text>,
              extra: <Typography.Text type="secondary">角色資源與行動狀態</Typography.Text>,
              children: <Flex vertical gap={8}>
                <StatValue label="金錢" tone="gold">🪙 {player.money}</StatValue>
                <StatBar label="血量" current={player.health} max={player.maxHealth} status="exception" />
                <StatBar label="內力" current={player.innerPower} max={player.maxInnerPower} />
                <StatValue label="體力">{Math.floor(player.stamina)} / {Math.floor(player.maxStamina)}</StatValue>
                <StatValue label="減傷率">
                  <Tooltip title="由根骨決定：每個根骨提供 2% 機率使受到的傷害減半。">
                    {renderRateWithIcons(getRootReductionRate(player), '🛡️')}
                  </Tooltip>
                </StatValue>
                <StatValue label="回避率">
                  <Tooltip title="受攻擊時完全閃避的機率，依身法決定。">
                    {renderRateWithIcons(getEvasionRate(player), '💨')}
                  </Tooltip>
                </StatValue>
                <StatValue label="暴擊率">
                  <Tooltip title="攻擊時造成雙倍傷害的機率，依臂力決定（每 1 點臂力 +2%）。">
                    {renderRateWithIcons(getCriticalRateForPlayer(player), '⚔️')}
                  </Tooltip>
                </StatValue>
                <StatValue label="爆發率">
                  <Tooltip title="傷害型外功造成暴擊的機率，依內息決定（每 1 點內息 +2%）。">
                    {renderRateWithIcons(getExternalSkillCritRateForPlayer(player), '💥')}
                  </Tooltip>
                </StatValue>
                <StatValue label="運功數值">
                  <span style={{ color: insightCapacity.exceeded ? '#dc2626' : undefined }}>
                    {insightCapacity.total} / {insightCapacity.limit}
                  </span>
                  {insightCapacity.exceeded && <Tag color="red" style={{ marginInlineStart: 8 }}>運功效率 10%</Tag>}
                </StatValue>
                <StatValue label="經驗">{player.experience} / {getExperienceRequired(player.level ?? 1)}</StatValue>
              </Flex>,
            },
            {
              key: 'attributes',
              label: <Typography.Text strong>基本屬性</Typography.Text>,
              extra: <Typography.Text type="secondary">裝備與靈氣後</Typography.Text>,
              children: <Flex vertical gap={8}>
                <AttributeSections attributes={effectiveAttributes} availableAttributePoints={player.availableAttributePoints ?? 0} onAllocateAttributePoint={onAllocateAttributePoint} />
                <StatValue label="可分配屬性點">{player.availableAttributePoints ?? 0}</StatValue>
              </Flex>,
            },
            {
              key: 'skills',
              label: <Typography.Text strong>功法</Typography.Text>,
              extra: <Typography.Text type="secondary">裝備與成長進度</Typography.Text>,
              children: <Flex vertical gap={8}>
                <SkillCard
                  icon="☯"
                  label="裝備內功"
                  compact
                  element={innerSkill.element}
                  name={innerSkill.name}
                  description={innerSkill.description}
                  status="已裝備"
                  highlight={{ label: '目前傷害值', value: getSkillDamage(effectiveAttributes, innerSkill, innerProgression.level) }}
                  meta={`功法等級 Lv.${innerProgression.level}｜經驗 ${innerProgression.experience} / ${getSkillExperienceRequired(innerProgression.level)}`}
                />
                {equippedExternalSkills.map((skill) => {
                  const progression = getSkillProgression(player, skill.id)
                  const innerPowerCost = getSkillInnerPowerCost(skill.innerPowerCost, progression.level)
                  return (
                    <SkillCard
                      key={skill.id}
                      icon="⚡"
                      label="外功"
                      compact
                      element={skill.element}
                      name={skill.name}
                      description={skill.description}
                      meta={`功法等級 Lv.${progression.level}｜經驗 ${progression.experience} / ${getSkillExperienceRequired(progression.level)}｜內力 -${innerPowerCost}`}
                    />
                  )
                })}
              </Flex>,
            },
            {
              key: 'qi',
              label: <Typography.Text strong>靈氣</Typography.Text>,
              extra: <Typography.Text type="secondary">目前生效效果</Typography.Text>,
              children: <Flex vertical gap={8}>
                {activeBuffs.length > 0 && <Flex wrap="wrap" gap={8}>{activeBuffs.map((buff) => {
                  const definition = getBuff(buff.definitionId)
                  return definition ? (
                    <BuffTag
                      key={buff.id}
                      name={definition.name}
                      icon="✨"
                      tone="neutral"
                      meta={buff.remainingRounds === null ? '持續生效' : `剩 ${buff.remainingRounds} 回合`}
                      tooltip={definition.description}
                    />
                  ) : null
                })}</Flex>}

                {globalBuffEntries.length > 0 && (
                  <Flex wrap gap={4}>
                    {globalBuffEntries.map((entry) => {
                      const levelLabel = entry.count === 1
                        ? `Lv.${entry.levels[0]}`
                        : entry.levels.map((level) => `Lv.${level}`).join('、')
                      return (
                        <BuffTag
                          key={entry.kind}
                          name={entry.name}
                          icon="✨"
                          tone="global"
                          meta={levelLabel}
                          tooltip={`${entry.name}：${entry.description}（共 ${entry.count} 層、${levelLabel}，合計 ${entry.totalPercent}%）`}
                        />
                      )
                    })}
                  </Flex>
                )}

                {auraEntries.length > 0 && (
                  <Flex wrap gap={4}>
                    {auraEntries.map((entry, index) => {
                      const isHarmful = entry.kind === 'damage-over-time'
                      return (
                        <BuffTag
                          key={`${entry.sourceId}-${index}`}
                          name={entry.sourceName}
                          icon={isHarmful ? '🔥' : '💚'}
                          tone={isHarmful ? 'debuff' : 'buff'}
                          tooltip={`${entry.sourceName}：${entry.description}`}
                        />
                      )
                    })}
                  </Flex>
                )}

                {activeBuffs.length === 0 && globalBuffEntries.length === 0 && auraEntries.length === 0 && (
                  <Typography.Text type="secondary">目前沒有生效中的靈氣</Typography.Text>
                )}
              </Flex>,
            },
            {
              key: 'ai-debug',
              label: <Typography.Text strong>AI 除錯</Typography.Text>,
              extra: <Typography.Text type="secondary">模糊邏輯決策</Typography.Text>,
              children: <AiDebugPanel player={player} gameState={gameState} />,
            },
          ]}
        />

      </Flex>
    </Card>
  )
}

export default PlayerPanel
