import type { ExternalSkill } from './externalSkillCatalog'
import type { InnerSkill } from './innerSkillCatalog'
import type { PlayerAttributes } from '../types'
import { type FunctionalExternalSkillEffect, functionalExternalSkillDescriptions, getFunctionalSkillBuffIds } from './functionalSkillRegistry'

export type { FunctionalExternalSkillEffect }

type SchoolDefinition = {
  id: string
  name: string
  innerNames: string[]
  externalNames: string[]
  theme: string
  formula: string
  calculate: (attributes: PlayerAttributes, level: number) => number
  element: 'none' | 'metal' | 'wood' | 'water' | 'fire' | 'earth'
}

const schools: SchoolDefinition[] = [
  {
    id: 'golden-body',
    element: 'metal',
    name: '金剛流',
    innerNames: ['金剛築基', '鐵壁真氣', '金鐘護脈', '不動玄功', '大金剛心法', '金身無漏訣'],
    externalNames: ['金剛拳', '撼山拳', '鎮岳掌', '金鐘震', '伏魔大手印', '不壞金剛掌'],
    theme: '強化臂力與根骨，擅長正面壓制與承受傷害。',
    formula: '臂力 × 0.6 + 根骨 × 0.4',
    calculate: (attributes, level) => Math.max(1, Math.floor(attributes.armStrength * 0.6 + attributes.constitution * 0.4) * level),
  },
  {
    id: 'swift-wind',
    element: 'wood',
    name: '追風流',
    innerNames: ['追風吐納', '踏雲心法', '流影真訣', '天涯行氣', '風神無形功', '九天追風訣'],
    externalNames: ['追風腿', '踏雲掌', '流影刃', '風回燕返', '天涯一瞬', '九天神行擊'],
    theme: '強化身法與悟性，擅長機動與連續出手。',
    formula: '身法 × 0.6 + 悟性 × 0.4',
    calculate: (attributes, level) => Math.max(1, Math.floor(attributes.agility * 0.6 + attributes.insight * 0.4) * level),
  },
  {
    id: 'scarlet-flame',
    element: 'fire',
    name: '赤炎流',
    innerNames: ['赤炎引氣', '燎原真氣', '炎陽心經', '焚脈玄功', '赤日焚天訣', '九陽離火經'],
    externalNames: ['炎火掌', '赤焰指', '燎原擊', '炎陽爆', '焚天掌勢', '九陽焚世掌'],
    theme: '強化臂力與內息，追求高爆發傷害。',
    formula: '臂力 × 0.5 + 內息 × 0.5',
    calculate: (attributes, level) => Math.max(1, Math.floor(attributes.armStrength * 0.5 + attributes.innerEnergy * 0.5) * level),
  },
  {
    id: 'frost-water',
    element: 'water',
    name: '寒水流',
    innerNames: ['寒水養氣', '凝霜真氣', '玄冰心法', '寒潮運功', '太陰冰魄訣', '萬川歸海經'],
    externalNames: ['寒水掌', '凝霜指', '冰河落', '玄冰破', '太陰封脈手', '萬川寂滅掌'],
    theme: '強化內息與根骨，擅長穩定輸出與持久作戰。',
    formula: '內息 × 0.6 + 根骨 × 0.4',
    calculate: (attributes, level) => Math.max(1, Math.floor(attributes.innerEnergy * 0.6 + attributes.constitution * 0.4) * level),
  },
  {
    id: 'earth-mountain',
    element: 'earth',
    name: '厚土流',
    innerNames: ['厚土納元', '山嶽真氣', '地脈心法', '坤元護體功', '大地玄鎧訣', '鎮世厚土經'],
    externalNames: ['裂地拳', '崩山掌', '地煞震', '山河墜', '坤元鎮岳手', '鎮世大崩拳'],
    theme: '強化根骨與內息，擅長防守反擊與重擊。',
    formula: '根骨 × 0.6 + 內息 × 0.4',
    calculate: (attributes, level) => Math.max(1, Math.floor(attributes.constitution * 0.6 + attributes.innerEnergy * 0.4) * level),
  },
  {
    id: 'void-spirit',
    element: 'none',
    name: '太虛流',
    innerNames: ['太虛養神', '靈台觀想', '太虛真解', '空明心經', '無相太虛功', '太虛萬象訣'],
    externalNames: ['靈犀指', '空明掌', '無相擊', '太虛幻身', '萬象歸虛手', '無相太虛印'],
    theme: '均衡五項屬性，擅長靈活應對各種戰局。',
    formula: '五項基本屬性總和 ÷ 5',
    calculate: (attributes, level) => Math.max(1, Math.floor((attributes.armStrength + attributes.constitution + attributes.agility + attributes.innerEnergy + attributes.insight) / 5) * level),
  },
]

export const MARTIAL_HALL_SCHOOL_ID = 'void-spirit'
export const martialHallSchool = schools.find((school) => school.id === MARTIAL_HALL_SCHOOL_ID)!

export const progressionInnerSkills: InnerSkill[] = schools.map((school) => {
  const name = school.innerNames[0]
  const insightRequirement = 5
  return {
    id: `${school.id}-inner`,
    name,
    description: `${school.theme}核心內功。`,
    formulaDescription: `${school.formula}（最低 1)`,
    insightRequirement,
    requiredHallLevel: 1,
    school: school.name,
    schoolId: school.id,
    element: school.element,
    level: 1,
    calculateDamage: (attributes: PlayerAttributes) => school.calculate(attributes, 1),
  }
})

export const martialHallInnerSkills: InnerSkill[] = progressionInnerSkills.filter((skill) => skill.school === martialHallSchool.name)

/** 各門派對應的輕功（功能效果）。 */
const schoolLightFootEffect: Record<string, FunctionalExternalSkillEffect> = {
  'golden-body': 'wall-step',
  'swift-wind': 'forest-step',
  'scarlet-flame': 'desert-step',
  'frost-water': 'water-step',
  'earth-mountain': 'mountain-step',
  'void-spirit': 'plain-step',
}

/** 各門派輕功名稱。 */
const schoolLightFootName: Record<string, string> = {
  'golden-body': '破壁功',
  'swift-wind': '林間步',
  'scarlet-flame': '踏沙功',
  'frost-water': '踏水功',
  'earth-mountain': '登山功',
  'void-spirit': '草上飛',
}

/** 各門派輕功主題前綴（描述會接上效果說明）。 */
const schoolLightFootTheme: Record<string, string> = {
  'golden-body': '金剛流輕功',
  'swift-wind': '追風流輕功',
  'scarlet-flame': '赤炎流輕功',
  'frost-water': '寒水流輕功',
  'earth-mountain': '厚土流輕功',
  'void-spirit': '太虛流輕功',
}

export const progressionExternalSkills: ExternalSkill[] = schools.flatMap((school) => {
  const name = school.externalNames[0]
  const functionalName = `${school.name}·${school.id === 'golden-body' ? '暴擊強化' : school.id === 'swift-wind' ? '追風攻勢' : school.id === 'scarlet-flame' ? '燎原' : school.id === 'frost-water' ? '凝霜' : school.id === 'earth-mountain' ? '反震' : '迴氣（悟道）'}`
  const functionalEffect = (school.id === 'golden-body' ? 'critical-rate' : school.id === 'swift-wind' ? 'basic-attack-stamina-reduction' : school.id === 'scarlet-flame' ? 'burning' : school.id === 'frost-water' ? 'attribute-reduction' : school.id === 'earth-mountain' ? 'reflection' : 'experience-gain') as FunctionalExternalSkillEffect
  const damageSkill: ExternalSkill = {
    id: `${school.id}-external-damage`,
    name,
    description: `${school.theme}傷害型外功。`,
    formulaDescription: `${school.formula}（最低 1）`,
    insightCost: 2,
    requiredHallLevel: 2,
    school: school.name,
    schoolId: school.id,
    element: school.element,
    level: 1,
    innerPowerCost: 4,
    target: 'target',
    calculateDamage: (attributes: PlayerAttributes) => school.calculate(attributes, 1) + 1,
  }
  const functionalSkill: ExternalSkill = {
    id: `${school.id}-external-functional`,
    name: functionalName,
    description: `${school.theme}${functionalExternalSkillDescriptions[functionalEffect]}`,
    formulaDescription: functionalExternalSkillDescriptions[functionalEffect],
    insightCost: 2,
    requiredHallLevel: 3,
    school: school.name,
    schoolId: school.id,
    level: 1,
    innerPowerCost: 6,
    category: school.id === 'scarlet-flame' || school.id === 'frost-water' ? 'damage' : 'aura',
    passiveBuffIds: school.id === 'scarlet-flame' || school.id === 'frost-water' ? undefined : getFunctionalSkillBuffIds(functionalEffect),
    target: school.id === 'golden-body' || school.id === 'swift-wind' || school.id === 'earth-mountain' || school.id === 'void-spirit' ? 'self' : 'target',
    calculateDamage: () => 0,
    functionalEffect,
  }
  const lightFootEffect = schoolLightFootEffect[school.id]
  const lightFootSkill: ExternalSkill = {
    id: `${school.id}-external-light-foot`,
    name: schoolLightFootName[school.id] ?? `${school.name}輕功`,
    description: `${schoolLightFootTheme[school.id] ?? school.theme}，門派專屬。${functionalExternalSkillDescriptions[lightFootEffect]}`,
    formulaDescription: functionalExternalSkillDescriptions[lightFootEffect],
    insightCost: 2,
    requiredHallLevel: 3,
    school: school.name,
    schoolId: school.id,
    element: school.element,
    level: 1,
    innerPowerCost: 5,
    target: 'self',
    calculateDamage: () => 0,
    functionalEffect: lightFootEffect,
    category: 'aura',
    // 門派輕功僅透過武館學習，不從怪物/巢穴掉落。
    lootExcluded: true,
  }
  return [damageSkill, functionalSkill, lightFootSkill]
})

export const martialHallExternalSkills: ExternalSkill[] = progressionExternalSkills.filter((skill) => skill.school === martialHallSchool.name)
