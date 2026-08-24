import { Button, Flex, Modal, Tabs } from 'antd'
import type { ExternalSkill } from '../game/catalogs/externalSkillCatalog'
import type { InnerSkill } from '../game/catalogs/innerSkillCatalog'
import type { PlayerState } from '../game/types'
import { getPlayerInsightCapacityBreakdown, getSkillDamage, getSkillInnerPowerCost, getSkillProgression } from '../game/rules/skillRules'
import { getEffectiveAttributesForPlayer } from '../game/rules/playerDerivedRules'
import SkillCard from './SkillCard'
import StatValue from './StatValue'

type SkillModalProps = {
  player: PlayerState | null
  innerSkills: InnerSkill[]
  externalSkills: ExternalSkill[]
  onEquipInnerSkill: (skillId: string) => void
  onToggleExternalSkill: (skillId: string) => void
  onClose: () => void
}

function SkillModal({
  player,
  innerSkills,
  externalSkills,
  onEquipInnerSkill,
  onToggleExternalSkill,
  onClose,
}: SkillModalProps) {
  const insightCapacity = player ? getPlayerInsightCapacityBreakdown(player) : null
  const effectiveInsight = player ? getEffectiveAttributesForPlayer(player).insight : 0

  return (
    <Modal
      title="功法設定"
      open={player !== null}
      onCancel={onClose}
      footer={<Button onClick={onClose}>關閉</Button>}
      destroyOnHidden
    >
      {player && (
        <Tabs
          items={[
            {
              key: 'inner',
              label: '內功',
              children: (
                <Flex vertical gap={8}>
                  <StatValue label="切換消耗">切換內功消耗 1% 內力</StatValue>
                  {player.innerSkillIds.map((skillId) => {
                    const skill = innerSkills.find((currentSkill) => currentSkill.id === skillId)
                    if (!skill) return null
                    const equipped = player.innerSkillId === skill.id
                    const meetsRequirement = effectiveInsight >= skill.insightRequirement
                    return (
                      <SkillCard
                        key={skill.id}
                        icon="☯"
                        label="內功"
                        compact
                        element={skill.element}
                        name={skill.name}
                        description={skill.description}
                        status={equipped ? '目前裝備' : undefined}
                        meta={
                          <>
                            <StatValue label="公式">{skill.formulaDescription}</StatValue>
                            <StatValue label="悟性需求">{skill.insightRequirement}（目前 {effectiveInsight}）</StatValue>
                          </>
                        }
                        highlight={{ label: '目前傷害值', value: getSkillDamage(getEffectiveAttributesForPlayer(player), skill, getSkillProgression(player, skill.id).level) }}
                      >
                        <Button
                          type={equipped ? 'default' : 'primary'}
                          disabled={equipped || player.turnEnded || !meetsRequirement}
                          onClick={() => onEquipInnerSkill(skill.id)}
                        >
                          {equipped ? '已裝備' : meetsRequirement ? '切換' : '悟性不足'}
                        </Button>
                      </SkillCard>
                    )
                  })}
                </Flex>
              ),
            },
            {
              key: 'external',
              label: '外功',
              children: (
                <Flex vertical gap={12}>
                  <StatValue label="開啟消耗">開啟外功消耗 1% 內力（關閉不消耗）</StatValue>
                  <StatValue label="悟性容量">
                    {insightCapacity?.total ?? 0} / {insightCapacity?.limit ?? 0}
                    （內功 {insightCapacity?.inner ?? 0} + 外功 {insightCapacity?.external ?? 0}）
                  </StatValue>
                  <Flex vertical gap={8}>
                    {externalSkills.filter((skill) => player.externalSkillIds.includes(skill.id)).map((skill) => {
                      const equipped = player.equippedExternalSkillIds.includes(skill.id)
                      const canEquip = equipped || (insightCapacity?.total ?? 0) + skill.insightCost <= effectiveInsight
                      const skillLevel = getSkillProgression(player, skill.id).level
                      const innerPowerCost = getSkillInnerPowerCost(skill.innerPowerCost, skillLevel)
                      return (
                        <SkillCard
                          key={skill.id}
                          icon="⚡"
                          label="外功"
                          compact
                          element={skill.element}
                          name={skill.name}
                          description={skill.description}
                          status={equipped ? '已開啟' : undefined}
                          meta={
                            <>
                              <StatValue label="公式">{skill.formulaDescription}</StatValue>
                              <StatValue label="容量">{skill.insightCost}</StatValue>
                              <StatValue label="內力消耗">{innerPowerCost}</StatValue>
                            </>
                          }
                        >
                          <Button
                            disabled={!equipped && !canEquip}
                            onClick={() => onToggleExternalSkill(skill.id)}
                          >
                            {equipped ? '關閉' : '開啟'}
                          </Button>
                        </SkillCard>
                      )
                    })}
                  </Flex>
                </Flex>
              ),
            },
          ]}
        />
      )}
    </Modal>
  )
}

export default SkillModal
