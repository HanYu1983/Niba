import { Flex, Modal, Tag, Tooltip, Typography } from 'antd'
import AttributeSections from './AttributeSections'
import SkillCard from './SkillCard'
import type { CreatureState, TerrainType } from '../game/types'
import { getInnerSkill, getSkillDamage, getSkillEffectMultiplier, getSkillProgression } from '../game/rules/skillRules'
import { calculateDamage } from '../game/rules/playerRules'
import { getCreatureBehaviorName, getCreatureIcon, getCreatureSchoolId } from '../game/rules/creatureBehaviorRules'
import { getActiveBuffsForCreature, getBuff, getEffectiveAttributesForCreature } from '../game/rules/playerDerivedRules'
import { martialSchoolCatalog } from '../game/catalogs/martialSchoolCatalog'

type CreatureCommandPanelProps = {
  creature: CreatureState | null
  terrain?: TerrainType
  open: boolean
  onClose: () => void
}

function CreatureCommandPanel({ creature, terrain, open, onClose }: CreatureCommandPanelProps) {
  const innerSkill = creature ? getInnerSkill(creature.innerSkillId) : null
  const behaviorName = creature ? getCreatureBehaviorName(creature) : null
  const schoolId = creature ? getCreatureSchoolId(creature) : null
  const schoolName = creature ? (martialSchoolCatalog.find((school) => school.id === schoolId)?.name ?? schoolId) : null
  const activeBuffs = creature ? getActiveBuffsForCreature(creature, terrain) : []
  const effectiveAttributes = creature ? getEffectiveAttributesForCreature(creature, terrain) : null
  const innerSkillLevel = creature && innerSkill ? getSkillProgression(creature, innerSkill.id).level : 0
  const calculatedDamage = creature && innerSkill && effectiveAttributes
    ? calculateDamage(Math.floor(getSkillDamage(effectiveAttributes, innerSkill, innerSkillLevel) * getSkillEffectMultiplier(creature)), 0)
    : 0
  const rawSkillDamage = creature && innerSkill && effectiveAttributes
    ? getSkillDamage(effectiveAttributes, innerSkill, innerSkillLevel)
    : 0
  const skillEffectMultiplier = creature ? getSkillEffectMultiplier(creature) : 1
  return (
    <Modal
      className="creature-command-panel"
      title={creature ? `${getCreatureIcon(creature)} ${creature.name}` : '生物指令面板'}
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
    >
      {creature && innerSkill && effectiveAttributes && (
        <div className="creature-command-panel__body">
          <Typography.Text type="secondary">
            血量 {creature.health} / {creature.maxHealth}
          </Typography.Text>
          <Typography.Text type="secondary">行為：{behaviorName}</Typography.Text>
          <Typography.Text type="secondary">流派：{schoolName}</Typography.Text>
          <Typography.Text type="secondary">
            傷害計算：內功原始 {rawSkillDamage}｜悟性倍率 {skillEffectMultiplier}｜顯示傷害 {calculatedDamage}
          </Typography.Text>
          <Flex gap={12} align="stretch" wrap="wrap">
            <div style={{ flex: '1 1 260px', minWidth: 0 }}>
              <SkillCard
                icon="☯"
                label="內功"
                element={innerSkill.element}
                name={innerSkill.name}
                description={innerSkill.description}
                status={`L${innerSkillLevel}`}
                meta={`公式：${innerSkill.formulaDescription}`}
                highlight={{ label: '普通攻擊傷害', value: calculatedDamage }}
              />
            </div>
            <div style={{ flex: '1 1 260px', minWidth: 0 }}>
              <AttributeSections
                attributes={effectiveAttributes}
                className="creature-command-panel__details"
              />
            </div>
          </Flex>

          {creature.aggroRange !== undefined && <Typography.Text type="secondary">警戒範圍：{creature.aggroRange} 格</Typography.Text>}
          {creature.homeNestId && <Typography.Text type="secondary">守護巢穴：{creature.homeNestId}</Typography.Text>}
          <div className="creature-command-panel__buffs">
            <Typography.Text strong>靈氣</Typography.Text>
            {activeBuffs.length > 0 ? activeBuffs.map((buff) => {
              const definition = getBuff(buff.definitionId)
              if (!definition) return null
              return (
                <Tooltip key={buff.id} title={definition.description}>
                  <Tag color="gold">
                    ✨ {definition.name} {buff.remainingRounds === null ? '（持續生效）' : `（剩 ${buff.remainingRounds} 回合）`}
                  </Tag>
                </Tooltip>
              )
            }) : <Typography.Text type="secondary">無</Typography.Text>}
          </div>
        </div>
      )}
    </Modal>
  )
}

export default CreatureCommandPanel