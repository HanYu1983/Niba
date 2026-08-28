import { Card, Flex, Tag, Tooltip, Typography } from 'antd'
import { getActivePolicyId, getPolicyName } from '../game/rules/policyRules'
import { getPolicyDefinition } from '../game/rules/governanceRules'
import { getGlobalBuffDisplayEntries } from '../game/rules/globalBuffRules'
import StatBar from './StatBar'
import StatValue from './StatValue'
import type { BaseState, GlobalBuff } from '../game/types'

type BasePanelProps = {
  bases: BaseState[]
  /** 目前生效中的全局 buff（用於每張據點卡片顯示該據點貢獻的靈氣）。 */
  globalBuffs: GlobalBuff[]
  selectedBaseId?: string | null
  onBaseSelect?: (baseId: string) => void
  onBaseDetails?: (baseId: string) => void
}

function BasePanel({ bases, globalBuffs, selectedBaseId, onBaseSelect, onBaseDetails }: BasePanelProps) {
  return (
    <div className="base-list">
      {bases.map((base) => {
        const baseBuffs = globalBuffs.filter((buff) => buff.sourceBaseId === base.id)
        return (
          <Card
            key={base.id}
            className={`base-panel${base.id === selectedBaseId ? ' base-panel--selected' : ''}`}
            variant="borderless"
            onClick={() => {
              onBaseSelect?.(base.id)
              onBaseDetails?.(base.id)
            }}
          >
          <Flex vertical gap={12}>
            <div className="base-panel__identity">
              <div className="base-panel__avatar">🏯</div>
              <div className="base-panel__identity-copy">
                <Typography.Title level={4}>{base.name}</Typography.Title>
                <Typography.Text type="secondary">
                  位置 ({base.position.row}, {base.position.column})
                </Typography.Text>
              </div>
              <Tag color={base.health === 0 ? 'red' : 'gold'}>
                {base.health === 0 ? '已摧毀' : '防守中'}
              </Tag>
            </div>

            <StatBar
              label="血量"
              current={base.health}
              max={base.maxHealth}
              status={base.health === 0 ? 'exception' : 'active'}
            />

            <StatBar
              label="建料"
              current={base.buildingMaterials}
              max={base.maxBuildingMaterials}
              status="active"
            />

            <StatValue label="目前政策">
              <Tooltip title={getPolicyDefinition(getActivePolicyId(base))?.description}>
                <Tag color="blue">{getPolicyName(getActivePolicyId(base))}</Tag>
              </Tooltip>
            </StatValue>

            {baseBuffs.length > 0 && (
              <div className="base-panel__buffs">
                <Typography.Text type="secondary" className="base-panel__buffs-label">全局靈氣</Typography.Text>
                <Flex wrap gap={4}>
                  {getGlobalBuffDisplayEntries(baseBuffs).map((entry) => {
                    const levelLabel = entry.count === 1
                      ? `Lv.${entry.levels[0]}`
                      : entry.levels.map((level) => `Lv.${level}`).join('、')
                    return (
                      <Tooltip key={entry.kind} title={`${entry.name}：${entry.description}（共 ${entry.count} 層、${levelLabel}，合計 ${entry.totalPercent}%）`}>
                        <Tag color="purple">{entry.name} {levelLabel}</Tag>
                      </Tooltip>
                    )
                  })}
                </Flex>
              </div>
            )}
          </Flex>
        </Card>
        )
      })}
    </div>
  )
}

export default BasePanel