import { Button, Divider, Flex, Select, Space, Typography, message } from 'antd'
import { useState } from 'react'
import {
  getCharacter,
  getAttributeUpgradeCost,
  spendScrollsOnAttribute,
  setInitialExternalSkill,
  setInitialInternalSkill,
  type PersistentCharacter,
} from '../game/characterRoster'
import { ATTRIBUTE_NAMES, type UpgradeableAttribute } from '../game/types'
import { allInnerSkillCatalog, allExternalSkillCatalog } from '../game/catalogs/martialHallSkillCatalog'

const ATTRIBUTE_KEYS: UpgradeableAttribute[] = ['armStrength', 'constitution', 'agility', 'innerEnergy', 'insight']

type CharacterTrainingPanelProps = {
  character: PersistentCharacter
  /** 培養後回呼（供父層刷新列表）。 */
  onChanged?: () => void
}

/** 培養面板：花卷提升五維、設定初始功法。由角色 Modal 的「培養」Tab 使用。 */
function CharacterTrainingPanel({ character, onChanged }: CharacterTrainingPanelProps) {
  const [current, setCurrent] = useState<PersistentCharacter>(character)

  const refresh = () => {
    const latest = getCharacter(character.id)
    if (latest) setCurrent(latest)
    onChanged?.()
  }

  const handleSpendAttribute = (attribute: UpgradeableAttribute) => {
    const cost = getAttributeUpgradeCost(current.attributeBonuses[attribute])
    if (spendScrollsOnAttribute(character.id, attribute)) {
      message.success(`已提升${ATTRIBUTE_NAMES[attribute]} +1（花費 ${cost} 卷）。`)
      refresh()
    } else {
      message.error('卷不足或角色不存在。')
    }
  }

  const handleSetExternal = (skillId: string) => {
    const result = setInitialExternalSkill(character.id, skillId)
    if (result.ok) {
      message.success('已設為初始外功。')
      refresh()
    } else {
      message.error(result.reason ?? '設定失敗。')
    }
  }

  const handleSetInternal = (skillId: string) => {
    const result = setInitialInternalSkill(character.id, skillId)
    if (result.ok) {
      message.success('已設為初始內功。')
      refresh()
    } else {
      message.error(result.reason ?? '設定失敗。')
    }
  }

  const learnedExternal = allExternalSkillCatalog.filter((skill) => current.learnedSkillIds.includes(skill.id))
  const learnedInternal = allInnerSkillCatalog.filter((skill) => current.learnedSkillIds.includes(skill.id))
  const externalOptions = learnedExternal
    .filter((skill) => !current.initialExternalSkillIds.includes(skill.id))
    .map((skill) => ({ label: skill.name, value: skill.id }))
  const internalOptions = learnedInternal
    .filter((skill) => skill.id !== current.initialInternalSkillId)
    .map((skill) => ({ label: skill.name, value: skill.id }))

  return (
    <>
      <Typography.Paragraph type="secondary">
        目前持有 <Typography.Text strong>📜 {current.scrolls}</Typography.Text> 武學殘卷。
      </Typography.Paragraph>

      <Divider>五維永久加成</Divider>
      <Flex gap={12} wrap>
        {ATTRIBUTE_KEYS.map((attribute) => {
          const bonus = current.attributeBonuses[attribute]
          const cost = getAttributeUpgradeCost(bonus)
          return (
            <Space key={attribute} direction="vertical" align="center">
              <Typography.Text>{ATTRIBUTE_NAMES[attribute]}</Typography.Text>
              <Typography.Text strong>+{bonus}</Typography.Text>
              <Button
                size="small"
                disabled={current.scrolls < cost}
                onClick={() => handleSpendAttribute(attribute)}
              >
                +1（{cost} 卷）
              </Button>
            </Space>
          )
        })}
      </Flex>

      <Divider>初始功法（花卷設定）</Divider>
      <Space direction="vertical" style={{ width: '100%' }}>
        <div>
          <Typography.Text>初始外功（上限 2）：</Typography.Text>
          <Space wrap>
            {current.initialExternalSkillIds.map((id) => {
              const skill = allExternalSkillCatalog.find((candidate) => candidate.id === id)
              return <Typography.Text key={id} type="secondary">✓ {skill?.name ?? id}</Typography.Text>
            })}
          </Space>
          <Select
            style={{ width: '100%', marginTop: 8 }}
            placeholder="選擇已學過的外功設為初始（30 卷）"
            value={undefined}
            onChange={handleSetExternal}
            options={externalOptions}
            disabled={externalOptions.length === 0}
          />
        </div>
        <div>
          <Typography.Text>初始內功：</Typography.Text>
          <Typography.Text type="secondary">
            {allInnerSkillCatalog.find((skill) => skill.id === current.initialInternalSkillId)?.name ?? current.initialInternalSkillId}
          </Typography.Text>
          <Select
            style={{ width: '100%', marginTop: 8 }}
            placeholder="選擇已學到的內功設為初始（30 卷）"
            value={undefined}
            onChange={handleSetInternal}
            options={internalOptions}
            disabled={internalOptions.length === 0}
          />
        </div>
      </Space>
    </>
  )
}

export default CharacterTrainingPanel