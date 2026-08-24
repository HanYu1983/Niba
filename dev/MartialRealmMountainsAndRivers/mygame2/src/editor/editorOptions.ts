/**
 * 編輯器共用選項定義。
 * 所有下拉選項皆從遊戲 catalog 動態生成，確保「唯一來源」：
 * 修改遊戲 catalog 時，編輯器選項自動同步更新。
 */
import { martialSchoolCatalog } from '../game/catalogs/martialSchoolCatalog'
import { CREATURE_BEHAVIOR_NAMES, type CreatureBehaviorType } from '../game/rules/creatureBehaviorRules'
import { governancePolicyCatalog } from '../game/catalogs/governancePolicyCatalog'
import { buildingCatalog } from '../game/catalogs/buildingCatalog'
import { explorationEventCatalog } from '../game/events/eventCatalog'
import { defenseStructureCatalog } from '../game/catalogs/defenseStructureCatalog'
import type { MartialSchoolId } from '../game/catalogs/martialSchoolCatalog'
import type { GovernancePolicyId } from '../game/catalogs/governancePolicyCatalog'
import type { DefenseStructureType } from '../game/catalogs/defenseStructureCatalog'

export const SCHOOL_OPTIONS = martialSchoolCatalog.map((school) => ({
  value: school.id as MartialSchoolId,
  label: school.name,
}))

export const BEHAVIOR_OPTIONS = Object.entries(CREATURE_BEHAVIOR_NAMES).map(([value, label]) => ({
  value: value as CreatureBehaviorType,
  label,
}))

export const POLICY_OPTIONS = governancePolicyCatalog.map((policy) => ({
  value: policy.id as GovernancePolicyId,
  label: policy.name,
}))

/** 建築選項（排除重複的武館流派變體，只保留通用建築）。 */
export const BUILDING_OPTIONS = buildingCatalog
  .filter((building) => !building.schoolId) // 排除流派武館（由門派據點處理）
  .map((building) => ({
    value: building.type,
    label: building.name,
  }))

/** 事件類型選項。 */
export const EVENT_TYPE_OPTIONS = explorationEventCatalog.map((event) => ({
  value: event.type,
  label: event.name,
}))

/** 防禦設施類型選項。 */
export const DEFENSE_STRUCTURE_OPTIONS = defenseStructureCatalog.map((structure) => ({
  value: structure.type as DefenseStructureType,
  label: `${structure.icon} ${structure.name}`,
}))

/** 掉落物選項（道具 + 裝備 + 功法）。 */
import { itemCatalog } from '../game/catalogs/itemCatalog'
import { equipmentCatalog } from '../game/catalogs/equipmentCatalog'
import { allExternalSkillCatalog, allInnerSkillCatalog } from '../game/catalogs/martialHallSkillCatalog'
import { jianghuExternalSkills } from '../game/catalogs/jianghuExternalSkillCatalog'

export type LootDropEntry = {
  lootId: string
  lootKind: 'item' | 'equipment' | 'skill'
  lootName: string
  chance: number
}

export const LOOT_ITEM_OPTIONS: Array<{ value: string; label: string; kind: 'item' | 'equipment' | 'skill' }> = [
  ...itemCatalog.map((item) => ({ value: item.id, label: `${item.icon} ${item.name}`, kind: 'item' as const })),
  ...equipmentCatalog.map((eq) => ({ value: eq.id, label: `${eq.icon} ${eq.name}`, kind: 'equipment' as const })),
  ...allInnerSkillCatalog.map((skill) => ({ value: skill.id, label: `☯ ${skill.name}`, kind: 'skill' as const })),
  ...allExternalSkillCatalog.map((skill) => ({ value: skill.id, label: `⚡ ${skill.name}`, kind: 'skill' as const })),
  ...jianghuExternalSkills.map((skill) => ({ value: skill.id, label: `⚡ ${skill.name}`, kind: 'skill' as const })),
]

/** 內功選項。 */
export const INNER_SKILL_OPTIONS = allInnerSkillCatalog.map((skill) => ({
  value: skill.id,
  label: `☯ ${skill.name}${skill.school ? `（${skill.school}）` : ''}`,
}))

/** 外功選項。 */
export const EXTERNAL_SKILL_OPTIONS = allExternalSkillCatalog.map((skill) => ({
  value: skill.id,
  label: `⚡ ${skill.name}${skill.school ? `（${skill.school}）` : ''}`,
}))

/** 五維屬性欄位定義。 */
export const ATTRIBUTE_FIELDS: Array<{ key: keyof import('../game/types').PlayerAttributes; label: string }> = [
  { key: 'armStrength', label: '臂力' },
  { key: 'constitution', label: '根骨' },
  { key: 'agility', label: '身法' },
  { key: 'innerEnergy', label: '內息' },
  { key: 'insight', label: '悟性' },
]
