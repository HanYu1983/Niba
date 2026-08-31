import { Button, Divider, Flex, Space, Tag, Typography, message } from 'antd'
import { useState, type ReactNode } from 'react'
import {
  getCharacter,
  getAttributeUpgradeCost,
  getSkillLearnCost,
  learnSkill,
  spendScrollsOnAttribute,
  setInitialExternalSkill,
  setInitialInternalSkill,
  closeInitialExternalSkill,
  closeInitialInternalSkill,
  type PersistentCharacter,
} from '../game/characterRoster'
import { ATTRIBUTE_NAMES, type UpgradeableAttribute } from '../game/types'
import {
  allInnerSkillCatalog,
  allExternalSkillCatalog,
} from '../game/catalogs/martialHallSkillCatalog'
import type { ExternalSkill } from '../game/catalogs/externalSkillCatalog'
import { getExternalSkill, getInnerSkill } from '../game/rules/skillRules'
import SkillCard from './SkillCard'

/** 外功類別（不含 undefined，作為篩選用明確型別）。 */
type ExternalSkillCategory = 'damage' | 'aura' | 'enhancement'
/** 五行元素（不含 undefined）。 */
type ElementKey = ExternalSkill['element'] & string

const ATTRIBUTE_KEYS: UpgradeableAttribute[] = ['armStrength', 'constitution', 'agility', 'innerEnergy', 'insight']

/** 五行屬性篩選標籤。 */
const ELEMENT_TAGS: { label: string; value: ElementKey }[] = [
  { label: '⚔️ 金', value: 'metal' },
  { label: '🌿 木', value: 'wood' },
  { label: '💧 水', value: 'water' },
  { label: '🔥 火', value: 'fire' },
  { label: '⛰️ 土', value: 'earth' },
  { label: '❄️ 無', value: 'none' },
]

/** 外功類別篩選標籤。 */
const CATEGORY_TAGS: { label: string; value: ExternalSkillCategory }[] = [
  { label: '⚔️ 傷害型', value: 'damage' },
  { label: '💫 靈氣型', value: 'aura' },
  { label: '💪 強化型', value: 'enhancement' },
]

/** 篩選標籤列：「全部」＋多個可切換 tag。單選，再點同一 tag 取消。 */
function FilterTagRow<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { label: string; value: T }[]
  value: T | null
  onChange: (next: T | null) => void
}) {
  return (
    <Space wrap size={[4, 4]} style={{ marginBottom: 8 }}>
      <Tag.CheckableTag checked={value === null} onChange={() => onChange(null)}>
        全部
      </Tag.CheckableTag>
      {options.map((option) => (
        <Tag.CheckableTag
          key={option.value}
          checked={value === option.value}
          onChange={() => onChange(value === option.value ? null : option.value)}
        >
          {option.label}
        </Tag.CheckableTag>
      ))}
    </Space>
  )
}

/** 功法展示圖示（共用視覺縮影，與遊戲內功法頁一致）。 */
function skillIcon(skill: { element?: string }): ReactNode {
  const emoji: Record<string, string> = {
    metal: '⚔️',
    wood: '🌿',
    water: '💧',
    fire: '🔥',
    earth: '⛰️',
  }
  return emoji[skill.element ?? 'none'] ?? '📜'
}

type CharacterTrainingPanelProps = {
  character: PersistentCharacter
  /** 培養後回呼（供父層刷新列表）。 */
  onChanged?: () => void
}

/** 培養面板：花卷提升五維、設定初始功法。由角色 Modal 的「培養」Tab 使用。 */
function CharacterTrainingPanel({ character, onChanged }: CharacterTrainingPanelProps) {
  const [current, setCurrent] = useState<PersistentCharacter>(character)
  const [lastCharacter, setLastCharacter] = useState<PersistentCharacter>(character)
  // 父層 editing 更新（如天賦 tab 扣卷後）時同步本面板快照，避免殘卷數顯示不一致。
  // 「渲染期間調整 state」模式：prop 變更時直接重置 state，取代 setState-in-effect（避免級聯渲染）。
  if (lastCharacter !== character) {
    setLastCharacter(character)
    setCurrent(character)
  }
  /** 外功篩選：類別＋五行。 */
  const [externalCategory, setExternalCategory] = useState<ExternalSkillCategory | null>(null)
  const [externalElement, setExternalElement] = useState<ElementKey | null>(null)
  /** 內功篩選：五行（內功無類別）。 */
  const [internalElement, setInternalElement] = useState<ElementKey | null>(null)

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

  const handleLearnSkill = (skillId: string) => {
    const result = learnSkill(character.id, skillId)
    if (result.ok) {
      message.success('已學習功法。')
      refresh()
    } else {
      message.error(result.reason ?? '學習失敗。')
    }
  }

  const handleSetExternal = (skillId: string) => {
    const result = setInitialExternalSkill(character.id, skillId)
    if (result.ok) {
      message.success('已開啟為初始外功。')
      refresh()
    } else {
      message.error(result.reason ?? '開啟失敗。')
    }
  }

  const handleSetInternal = (skillId: string) => {
    const result = setInitialInternalSkill(character.id, skillId)
    if (result.ok) {
      message.success('已開啟為初始內功。')
      refresh()
    } else {
      message.error(result.reason ?? '開啟失敗。')
    }
  }

  const handleCloseExternal = (skillId: string) => {
    if (closeInitialExternalSkill(character.id, skillId)) {
      message.success('已關閉此初始外功。')
      refresh()
    } else {
      message.error('關閉失敗。')
    }
  }

  const handleCloseInternal = () => {
    if (closeInitialInternalSkill(character.id)) {
      message.success('已關閉初始內功。')
      refresh()
    } else {
      message.error('關閉失敗。')
    }
  }

  // 已開啟（開局攜帶）功法所占用的悟性。
  const innerInsight = current.initialInternalSkillId ? getInnerSkill(current.initialInternalSkillId).insightRequirement : 0
  const externalInsight = (current.initialExternalSkillIds ?? []).reduce(
    (total, skillId) => total + getExternalSkill(skillId).insightCost,
    0,
  )
  const totalInsight = innerInsight + externalInsight
  const insightCapacity = 8 + (current.attributeBonuses.insight ?? 0)

  // 可培養清單：遊戲中獲得過的功法（含已學習與尚未學習）。
  const allExternal = allExternalSkillCatalog.filter((skill) => current.unlockedSkillIds.includes(skill.id))
  const allInternal = allInnerSkillCatalog.filter((skill) => current.unlockedSkillIds.includes(skill.id))

  // 套用篩選。
  const unlockExternal = allExternal.filter(
    (skill) =>
      (externalCategory === null || skill.category === externalCategory) &&
      (externalElement === null || skill.element === externalElement),
  )
  const unlockInternal = allInternal.filter(
    (skill) => internalElement === null || skill.element === internalElement,
  )

  // 下一項功法的學習成本（隨已學習功法數遞增）。
  const nextLearnCost = getSkillLearnCost((current.learnedSkillIds ?? []).length)

  return (
    <>
      <Typography.Paragraph type="secondary">
        目前持有 <Typography.Text strong>📜 {current.scrolls}</Typography.Text> 武學殘卷。
      </Typography.Paragraph>
      <Typography.Paragraph type="secondary">
        已開啟功法占用悟性：<Typography.Text strong>{totalInsight}</Typography.Text> /{' '}
        <Typography.Text strong>{insightCapacity}</Typography.Text>{' '}
        <Typography.Text type="secondary">（剩餘 {Math.max(0, insightCapacity - totalInsight)}）</Typography.Text>{' '}
        （內功 {innerInsight} + 外功 {externalInsight}）
      </Typography.Paragraph>

      <Divider>五維永久加成</Divider>
      <Flex gap={12} wrap>
        {ATTRIBUTE_KEYS.map((attribute) => {
          const bonus = current.attributeBonuses[attribute]
          const cost = getAttributeUpgradeCost(bonus)
          return (
            <Space key={attribute} direction="vertical" align="center">
              <Typography.Text>{ATTRIBUTE_NAMES[attribute]}</Typography.Text>
              <Typography.Text strong>{8 + bonus}</Typography.Text>
              <Typography.Text type="secondary">（加成 +{bonus}）</Typography.Text>
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

      <Divider>可培養外功</Divider>
      <FilterTagRow options={CATEGORY_TAGS} value={externalCategory} onChange={setExternalCategory} />
      <FilterTagRow options={ELEMENT_TAGS} value={externalElement} onChange={setExternalElement} />
      <Flex
        gap={12}
        wrap
        style={{ maxHeight: 320, overflowY: 'auto', paddingRight: 8 }}
      >
        {unlockExternal.map((skill) => {
          const isLearned = current.learnedSkillIds.includes(skill.id)
          const isOpened = current.initialExternalSkillIds.includes(skill.id)
          const status = isOpened ? '已開啟' : isLearned ? '已學習' : '可學習'
          return (
            <div key={skill.id} style={{ width: 220 }}>
              <SkillCard
                icon={skillIcon(skill)}
                label="外功"
                element={skill.element}
                name={skill.name}
                description={skill.description}
                status={status}
                compact
              >
                {!isLearned ? (
                  <Button
                    size="small"
                    disabled={current.scrolls < nextLearnCost}
                    onClick={() => handleLearnSkill(skill.id)}
                  >
                    學習（{nextLearnCost} 卷）
                  </Button>
                ) : isOpened ? (
                  <Button
                    size="small"
                    danger
                    onClick={() => handleCloseExternal(skill.id)}
                  >
                    關閉
                  </Button>
                ) : (
                  <Button
                    size="small"
                    onClick={() => handleSetExternal(skill.id)}
                  >
                    開啟
                  </Button>
                )}
              </SkillCard>
            </div>
          )
        })}
        {unlockExternal.length === 0 && (
          <Typography.Text type="secondary">尚未獲得任何外功。</Typography.Text>
        )}
      </Flex>

      <Divider>可培養內功</Divider>
      <FilterTagRow options={ELEMENT_TAGS} value={internalElement} onChange={setInternalElement} />
      <Flex
        gap={12}
        wrap
        style={{ maxHeight: 320, overflowY: 'auto', paddingRight: 8 }}
      >
        {unlockInternal.map((skill) => {
          const isLearned = current.learnedSkillIds.includes(skill.id)
          const isOpened = current.initialInternalSkillId === skill.id
          const status = isOpened ? '已開啟' : isLearned ? '已學習' : '可學習'
          return (
            <div key={skill.id} style={{ width: 220 }}>
              <SkillCard
                icon={skillIcon(skill)}
                label="內功"
                element={skill.element}
                name={skill.name}
                description={skill.description}
                status={status}
                compact
              >
                {!isLearned ? (
                  <Button
                    size="small"
                    disabled={current.scrolls < nextLearnCost}
                    onClick={() => handleLearnSkill(skill.id)}
                  >
                    學習（{nextLearnCost} 卷）
                  </Button>
                ) : isOpened ? (
                  <Button
                    size="small"
                    danger
                    onClick={handleCloseInternal}
                  >
                    關閉
                  </Button>
                ) : (
                  <Button
                    size="small"
                    onClick={() => handleSetInternal(skill.id)}
                  >
                    開啟
                  </Button>
                )}
              </SkillCard>
            </div>
          )
        })}
        {unlockInternal.length === 0 && (
          <Typography.Text type="secondary">尚未獲得任何內功。</Typography.Text>
        )}
      </Flex>
    </>
  )
}

export default CharacterTrainingPanel