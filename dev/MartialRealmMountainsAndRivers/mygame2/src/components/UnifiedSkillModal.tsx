import { Button, Flex, Modal, Typography } from 'antd'
import type { ReactNode } from 'react'
import type { ExternalSkill } from '../game/catalogs/externalSkillCatalog'
import type { InnerSkill } from '../game/catalogs/innerSkillCatalog'
import type { CreatureState, MapCell, PlayerState } from '../game/types'
import { getElementDamageMultiplier, getElementName, getInnerSkill, getPlayerInsightCapacityBreakdown, getSchoolElement, getSkillDamage, getSkillInnerPowerCost, getSkillProgression, isElementGenerating } from '../game/rules/skillRules'
import { getEffectiveAttributesForPlayer } from '../game/rules/playerDerivedRules'
import { getTerrainAtPosition, isTerrainResonant } from '../game/rules/terrainCombatRules'
import UnifiedSkillCard from './UnifiedSkillCard'
import StatValue from './StatValue'

type UnifiedSkillModalProps = {
  player: PlayerState | null
  innerSkills: InnerSkill[]
  externalSkills: ExternalSkill[]
  /** 地圖格子（供判定天地共鳴）。 */
  mapCells: MapCell[]
  /** 場上可作為三重共振目標的生物。 */
  creatures?: CreatureState[]
  onEquipInnerSkill: (skillId: string) => void
  onToggleExternalSkill: (skillId: string) => void
  onClose: () => void
}

/** 門派對應的五行屬性名稱（如「土」）。 */
function getSchoolElementName(schoolId: string | undefined): string {
  return getElementName(getSchoolElement(schoolId))
}

/** 外功元素是否克制某門派元素。 */
function isCounteredBy(outerElement: NonNullable<ExternalSkill['element']>, schoolId: string): boolean {
  return getElementDamageMultiplier(outerElement, getSchoolElement(schoolId)) > 1
}

function UnifiedSkillModal({
  player,
  innerSkills,
  externalSkills,
  mapCells,
  creatures = [],
  onEquipInnerSkill,
  onToggleExternalSkill,
  onClose,
}: UnifiedSkillModalProps) {
  if (!player) return null

  const effective = getEffectiveAttributesForPlayer(player)
  const insightCapacity = getPlayerInsightCapacityBreakdown(player)
  const innerElement = getInnerSkill(player.innerSkillId).element
  const playerTerrain = getTerrainAtPosition(mapCells, player.position)

  // 計算三重共振：某外功元素是否克制某敵對門派
  const tripleResonanceTarget = (outerElement: ExternalSkill['element']): string | undefined => {
    if (!outerElement || outerElement === 'none' || !isElementGenerating(innerElement, outerElement)) return undefined
    if (!isTerrainResonant(outerElement, playerTerrain)) return undefined
    const countered = creatures.find((creature) =>
      creature.schoolId && creature.health > 0 && isCounteredBy(outerElement, creature.schoolId),
    )
    return countered ? getSchoolElementName(countered.schoolId) : undefined
  }

  const innerCards = player.innerSkillIds
    .map((id) => innerSkills.find((skill) => skill.id === id))
    .filter((skill): skill is InnerSkill => Boolean(skill))
  const externalCards = player.externalSkillIds
    .map((id) => externalSkills.find((skill) => skill.id === id))
    .filter((skill): skill is ExternalSkill => Boolean(skill))

  const innerTooltip = (skill: InnerSkill): ReactNode => (
    <div>
      <b>{skill.name}</b>
      <div>{skill.description}</div>
      <div>公式：{skill.formulaDescription}</div>
      <div>悟性需求：{skill.insightRequirement}</div>
    </div>
  )
  const externalTooltip = (skill: ExternalSkill): ReactNode => (
    <div>
      <b>{skill.name}</b>
      <div>{skill.description}</div>
      <div>公式：{skill.formulaDescription}</div>
      <div>內力消耗：{getSkillInnerPowerCost(skill.innerPowerCost, getSkillProgression(player, skill.id).level)}</div>
    </div>
  )

  return (
    <Modal
      title="功法設定"
      open
      onCancel={onClose}
      footer={<Button onClick={onClose}>關閉</Button>}
      destroyOnHidden
      width={760}
    >
      <Flex vertical gap={16}>
        <Flex wrap gap={24}>
          <StatValue label="內力">
            <span style={{ color: player.innerPower <= 0 ? '#dc2626' : undefined }}>
              {Math.floor(player.innerPower)} / {Math.floor(player.maxInnerPower)}
            </span>
          </StatValue>
          <StatValue label="悟性容量">
            {insightCapacity.total} / {insightCapacity.limit}
            （內功 {insightCapacity.inner} + 外功 {insightCapacity.external}）
          </StatValue>
        </Flex>
        <Flex align="center" gap={8} wrap>
          <Typography.Text type="secondary">切換內功 / 開啟外功各消耗 1% 內力</Typography.Text>
        </Flex>

        <div>
          <Typography.Text strong style={{ display: 'block', marginBottom: 8 }}>內功（選擇一個）</Typography.Text>
          <Flex wrap="wrap" gap={10}>
            {innerCards.map((skill) => {
              const equipped = player.innerSkillId === skill.id
              const meetsRequirement = effective.insight >= skill.insightRequirement
              const resonance = isTerrainResonant(skill.element, playerTerrain)
              return (
                <UnifiedSkillCard
                  key={skill.id}
                  kind="inner"
                  icon="☯"
                  element={skill.element}
                  name={skill.name}
                  status={equipped ? '已裝備' : undefined}
                  level={getSkillProgression(player, skill.id).level}
                  primaryLabel="傷害"
                  primaryValue={getSkillDamage(effective, skill, getSkillProgression(player, skill.id).level)}
                  resonance={resonance}
                  equipped={equipped}
                  clickable={!equipped && !player.turnEnded && meetsRequirement}
                  tooltip={innerTooltip(skill)}
                  onClick={() => onEquipInnerSkill(skill.id)}
                />
              )
            })}
          </Flex>
        </div>

        <div>
          <Typography.Text strong style={{ display: 'block', marginBottom: 8 }}>外功（可多個開啟）</Typography.Text>
          <Flex wrap gap={10}>
            {externalCards.map((skill) => {
              const equipped = player.equippedExternalSkillIds.includes(skill.id)
              const synergy = isElementGenerating(innerElement, skill.element)
              const resonance = isTerrainResonant(skill.element, playerTerrain)
              const triple = tripleResonanceTarget(skill.element)
              const canEquip = equipped || (insightCapacity.total + skill.insightCost) <= effective.insight
              return (
                <UnifiedSkillCard
                  key={skill.id}
                  kind="external"
                  icon="⚡"
                  element={skill.element}
                  name={skill.name}
                  status={equipped ? '已開啟' : undefined}
                  level={getSkillProgression(player, skill.id).level}
                  primaryLabel="內力"
                  primaryValue={getSkillInnerPowerCost(skill.innerPowerCost, getSkillProgression(player, skill.id).level)}
                  interactions={{ synergy, resonance, tripleResonance: triple }}
                  synergyHint={synergy && !equipped}
                  equipped={equipped}
                  clickable={!player.turnEnded && canEquip}
                  tooltip={externalTooltip(skill)}
                  onClick={() => onToggleExternalSkill(skill.id)}
                />
              )
            })}
          </Flex>
        </div>
      </Flex>
    </Modal>
  )
}

export default UnifiedSkillModal