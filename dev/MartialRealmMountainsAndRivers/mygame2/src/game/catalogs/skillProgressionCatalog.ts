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
    innerNames: ['金剛築基'],
    externalNames: ['金剛拳'],
    theme: '強化臂力與根骨，擅長正面壓制與承受傷害。',
    formula: '臂力 × 0.6 + 根骨 × 0.4',
    calculate: (attributes, level) => Math.max(1, Math.floor(attributes.armStrength * 0.6 + attributes.constitution * 0.4) * level),
  },
  {
    id: 'swift-wind',
    element: 'wood',
    name: '追風流',
    innerNames: ['追風吐納'],
    externalNames: ['追風腿'],
    theme: '強化身法與悟性，擅長機動與連續出手。',
    formula: '身法 × 0.6 + 悟性 × 0.4',
    calculate: (attributes, level) => Math.max(1, Math.floor(attributes.agility * 0.6 + attributes.insight * 0.4) * level),
  },
  {
    id: 'scarlet-flame',
    element: 'fire',
    name: '赤炎流',
    innerNames: ['赤炎引氣'],
    externalNames: ['炎火掌'],
    theme: '強化臂力與內息，追求高爆發傷害。',
    formula: '臂力 × 0.5 + 內息 × 0.5',
    calculate: (attributes, level) => Math.max(1, Math.floor(attributes.armStrength * 0.5 + attributes.innerEnergy * 0.5) * level),
  },
  {
    id: 'frost-water',
    element: 'water',
    name: '寒水流',
    innerNames: ['寒水養氣'],
    externalNames: ['寒水掌'],
    theme: '強化內息與根骨，擅長穩定輸出與持久作戰。',
    formula: '內息 × 0.6 + 根骨 × 0.4',
    calculate: (attributes, level) => Math.max(1, Math.floor(attributes.innerEnergy * 0.6 + attributes.constitution * 0.4) * level),
  },
  {
    id: 'earth-mountain',
    element: 'earth',
    name: '厚土流',
    innerNames: ['厚土納元'],
    externalNames: ['裂地拳'],
    theme: '強化根骨與內息，擅長防守反擊與重擊。',
    formula: '根骨 × 0.6 + 內息 × 0.4',
    calculate: (attributes, level) => Math.max(1, Math.floor(attributes.constitution * 0.6 + attributes.innerEnergy * 0.4) * level),
  },
  {
    id: 'void-spirit',
    element: 'none',
    name: '太虛流',
    innerNames: ['太虛養神'],
    externalNames: ['靈犀指'],
    theme: '均衡五項屬性，擅長靈活應對各種戰局。',
    formula: '五項基本屬性總和 ÷ 5',
    calculate: (attributes, level) => Math.max(1, Math.floor((attributes.armStrength + attributes.constitution + attributes.agility + attributes.innerEnergy + attributes.insight) / 5) * level),
  },
  {
    id: 'hundred-poison',
    element: 'wood',
    name: '百毒流',
    innerNames: ['百毒納氣'],
    externalNames: ['腐骨爪'],
    theme: '南疆小派，以毒入武；擅長陰柔纏鬥與官道奔行，名不經傳卻不容小覷。',
    formula: '臂力 × 0.5 + 身法 × 0.5',
    calculate: (attributes, level) => Math.max(1, Math.floor(attributes.armStrength * 0.5 + attributes.agility * 0.5) * level),
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

/** 各門派輕功效果（併入靈氣型外功的 passiveBuffIds）。 */
const schoolLightFootEffect: Record<string, FunctionalExternalSkillEffect> = {
  'golden-body': 'wall-step',
  'swift-wind': 'forest-step',
  'scarlet-flame': 'desert-step',
  'frost-water': 'water-step',
  'earth-mountain': 'mountain-step',
  'void-spirit': 'plain-step',
  'hundred-poison': 'road-step',
}

/** 各門派靈氣型外功名稱後綴。 */
const schoolAuraLabels: Record<string, string> = {
  'golden-body': '暴擊強化',
  'swift-wind': '疾行',
  'scarlet-flame': '踏沙功',
  'frost-water': '踏水功',
  'earth-mountain': '反震',
  'void-spirit': '迴氣（悟道）',
  'hundred-poison': '驛路步',
}

/** 各門派靈氣型外功的自身 buff 效果（無則為 undefined）。 */
const schoolAuraEffects: Record<string, FunctionalExternalSkillEffect | undefined> = {
  'golden-body': 'critical-rate',
  'swift-wind': 'terrain-adaptation',
  'scarlet-flame': undefined,
  'frost-water': undefined,
  'earth-mountain': 'reflection',
  'void-spirit': 'experience-gain',
  'hundred-poison': undefined,
}

/** 各門派傷害型外功的指定目標 debuff 效果（無則為 undefined）。 */
const schoolDamageEffects: Record<string, FunctionalExternalSkillEffect | undefined> = {
  'golden-body': undefined,
  'swift-wind': undefined,
  'scarlet-flame': 'burning',
  'frost-water': 'attribute-reduction',
  'earth-mountain': undefined,
  'void-spirit': undefined,
  'hundred-poison': 'poison',
}

export const progressionExternalSkills: ExternalSkill[] = schools.flatMap((school) => {
  const name = school.externalNames[0]
  const damageEffect = schoolDamageEffects[school.id]
  const auraEffect = schoolAuraEffects[school.id]
  const lightFootEffect = schoolLightFootEffect[school.id]

  // 傷害型外功：基礎傷害招式。
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
    category: 'damage',
    target: 'target',
    calculateDamage: (attributes: PlayerAttributes) => school.calculate(attributes, 1) + 1,
  }

  // 指定目標 debuff 型外功（赤焰·燎原、寒水·凝霜、百毒·淬毒）：歸入傷害型。
  const debuffSkill: ExternalSkill | undefined = damageEffect
    ? {
        id: `${school.id}-external-damage-debuff`,
        name: `${school.name}·${schoolAuraLabels[school.id] ?? '奧義'}`,
        description: `${school.theme}${functionalExternalSkillDescriptions[damageEffect]}`,
        formulaDescription: functionalExternalSkillDescriptions[damageEffect],
        insightCost: 2,
        requiredHallLevel: 3,
        school: school.name,
        schoolId: school.id,
        element: school.element,
        level: 1,
        innerPowerCost: 6,
        category: 'damage',
        target: 'target',
        calculateDamage: () => 0,
        functionalEffect: damageEffect,
      }
    : undefined

  // 靈氣型外功：自身 buff + 輕功效果併入，一律使用 passiveBuffIds。
  const auraBuffIds = [
    ...(auraEffect ? getFunctionalSkillBuffIds(auraEffect) : []),
    ...getFunctionalSkillBuffIds(lightFootEffect),
  ]
  const auraSkill: ExternalSkill = {
    id: `${school.id}-external-functional`,
    name: `${school.name}·${schoolAuraLabels[school.id] ?? '靈氣'}`,
    description: `${school.theme}${functionalExternalSkillDescriptions[lightFootEffect]}`,
    formulaDescription: functionalExternalSkillDescriptions[lightFootEffect],
    insightCost: 2,
    requiredHallLevel: 3,
    school: school.name,
    schoolId: school.id,
    element: school.element,
    level: 1,
    innerPowerCost: 0,
    category: 'aura',
    target: 'self',
    passiveBuffIds: auraBuffIds,
    calculateDamage: () => 0,
    functionalEffect: auraEffect,
    // 門派靈氣型外功僅透過武館學習，不從怪物/巢穴掉落。
    lootExcluded: true,
  }

  return [damageSkill, ...(debuffSkill ? [debuffSkill] : []), auraSkill]
})

export const martialHallExternalSkills: ExternalSkill[] = progressionExternalSkills.filter((skill) => skill.school === martialHallSchool.name)
