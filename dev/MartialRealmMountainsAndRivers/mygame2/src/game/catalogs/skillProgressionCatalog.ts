import type { InnerSkill } from './innerSkillCatalog'
import type { PlayerAttributes } from '../types'
import { type FunctionalExternalSkillEffect } from './functionalSkillRegistry'
import type { ExternalSkill } from './externalSkillCatalog'
import { createAuraExternalSkill, createDamageExternalSkill, createInnerSkill } from './skillFactory'

type SchoolElement = 'none' | 'metal' | 'wood' | 'water' | 'fire' | 'earth'

type InnerSkillEntry = {
  name: string
  theme: string
  formula: string
  calculate: (attributes: PlayerAttributes, level: number) => number
}

/** 門派外功目錄的原料條目；由 Factory 轉為完整 `ExternalSkill`。 */
type ExternalSkillEntry = {
  name: string
  description: string
  effect?: FunctionalExternalSkillEffect
  innerPowerCost?: number
  passiveBuffIds?: string[]
}

type MartialSchoolDefinition = {
  id: string
  name: string
  element: SchoolElement
  inner: InnerSkillEntry[]
  damage: ExternalSkillEntry[]
  aura: ExternalSkillEntry[]
  enhancement: ExternalSkillEntry[]
}

/**
 * 門派武學唯一資料來源。
 *
 * 每個門派可擁有任意數量的各類功法；目前門派強化型外功尚未配置，
 * 但保留 `enhancement` 陣列供後續新增，避免再次修改資料結構。
 */
export const martialSchoolCatalog: MartialSchoolDefinition[] = [
  {
    id: 'golden-body',
    name: '金剛流',
    element: 'metal',
    inner: [{
      name: '金剛築基',
      theme: '強化臂力與根骨，擅長正面壓制與承受傷害。',
      formula: '臂力 × 0.6 + 根骨 × 0.4',
      calculate: (attributes, level) => Math.max(1, Math.floor(attributes.armStrength * 0.6 + attributes.constitution * 0.4) * level),
    }],
    damage: [{ name: '金剛拳', description: '凝聚臂力與根骨之力，對相鄰單一敵人造成傷害。', innerPowerCost: 4 }],
    aura: [
      { name: '暴擊強化', description: '自身暴擊率 ×2，持續 2 回合。', effect: 'critical-rate', passiveBuffIds: ['golden-body-critical-boost'] },
      { name: '破壁功', description: '進入牆壁時，移動消耗降為 2。', passiveBuffIds: ['wall-step'] },
    ],
    enhancement: [],
  },
  {
    id: 'swift-wind',
    name: '追風流',
    element: 'wood',
    inner: [{
      name: '追風吐納',
      theme: '強化身法與悟性，擅長機動與連續出手。',
      formula: '身法 × 0.6 + 悟性 × 0.4',
      calculate: (attributes, level) => Math.max(1, Math.floor(attributes.agility * 0.6 + attributes.insight * 0.4) * level),
    }],
    damage: [{ name: '追風腿', description: '以身法帶動腿勁，對相鄰單一敵人造成傷害。', innerPowerCost: 4 }],
    aura: [
      { name: '疾行', description: '地形消耗一律視為草地。', passiveBuffIds: ['swift-wind-movement'] },
      { name: '林間步', description: '進入森林時，移動消耗降為 2。', passiveBuffIds: ['forest-step'] },
    ],
    enhancement: [],
  },
  {
    id: 'scarlet-flame',
    name: '赤炎流',
    element: 'fire',
    inner: [{
      name: '赤炎引氣',
      theme: '強化臂力與內息，追求高爆發傷害。',
      formula: '臂力 × 0.5 + 內息 × 0.5',
      calculate: (attributes, level) => Math.max(1, Math.floor(attributes.armStrength * 0.5 + attributes.innerEnergy * 0.5) * level),
    }],
    damage: [
      { name: '炎火掌', description: '凝聚炎力一掌擊出，對相鄰單一敵人造成傷害。', innerPowerCost: 4 },
      { name: '燎原', description: '使目標燃燒 3 回合，每回合損失最大生命 20%。', effect: 'burning', innerPowerCost: 6 },
    ],
    aura: [{ name: '踏沙功', description: '進入荒漠時，移動消耗降為 2。', passiveBuffIds: ['desert-step'] }],
    enhancement: [],
  },
  {
    id: 'frost-water',
    name: '寒水流',
    element: 'water',
    inner: [{
      name: '寒水養氣',
      theme: '強化內息與根骨，擅長穩定輸出與持久作戰。',
      formula: '內息 × 0.6 + 根骨 × 0.4',
      calculate: (attributes, level) => Math.max(1, Math.floor(attributes.innerEnergy * 0.6 + attributes.constitution * 0.4) * level),
    }],
    damage: [
      { name: '寒水掌', description: '寒氣凝於掌上，對相鄰單一敵人造成傷害。', innerPowerCost: 4 },
      { name: '凝霜', description: '使目標 2 回合內五項基本屬性降低 20%。', effect: 'attribute-reduction', innerPowerCost: 6 },
    ],
    aura: [{ name: '踏水功', description: '進入水域時，移動消耗降為 2。', passiveBuffIds: ['water-step'] }],
    enhancement: [],
  },
  {
    id: 'earth-mountain',
    name: '厚土流',
    element: 'earth',
    inner: [{
      name: '厚土納元',
      theme: '強化根骨與內息，擅長防守反擊與重擊。',
      formula: '根骨 × 0.6 + 內息 × 0.4',
      calculate: (attributes, level) => Math.max(1, Math.floor(attributes.constitution * 0.6 + attributes.innerEnergy * 0.4) * level),
    }],
    damage: [{ name: '裂地拳', description: '以大地之力震擊，對相鄰單一敵人造成傷害。', innerPowerCost: 4 }],
    aura: [
      { name: '反震', description: '自身 3 回合內受到傷害時，反彈同等傷害。', effect: 'reflection', passiveBuffIds: ['earth-mountain-reflection'] },
      { name: '登山功', description: '進入山嶽時，移動消耗降為 2。', passiveBuffIds: ['mountain-step'] },
    ],
    enhancement: [],
  },
  {
    id: 'void-spirit',
    name: '太虛流',
    element: 'none',
    inner: [{
      name: '太虛養神',
      theme: '均衡五項屬性，擅長靈活應對各種戰局。',
      formula: '五項基本屬性總和 ÷ 5',
      calculate: (attributes, level) => Math.max(1, Math.floor((attributes.armStrength + attributes.constitution + attributes.agility + attributes.innerEnergy + attributes.insight) / 5) * level),
    }],
    damage: [{ name: '靈犀指', description: '以靈犀一指點出，對相鄰單一敵人造成傷害。', innerPowerCost: 4 }],
    aura: [
      { name: '迴氣（悟道）', description: '開啟後功法經驗獲得 +20%（常駐）。', passiveBuffIds: ['void-spirit-return-qi'] },
      { name: '草上飛', description: '進入草地時，移動消耗降為 1。', passiveBuffIds: ['plain-step'] },
    ],
    enhancement: [],
  },
  {
    id: 'hundred-poison',
    name: '百毒流',
    element: 'wood',
    inner: [{
      name: '百毒納氣',
      theme: '南疆小派，以毒入武；擅長陰柔纏鬥與官道奔行，名不經傳卻不容人小覷。',
      formula: '臂力 × 0.5 + 身法 × 0.5',
      calculate: (attributes, level) => Math.max(1, Math.floor(attributes.armStrength * 0.5 + attributes.agility * 0.5) * level),
    }],
    damage: [
      { name: '腐骨爪', description: '毒爪抓向敵人，對相鄰單一敵人造成傷害。', innerPowerCost: 4 },
      { name: '淬毒', description: '使目標中毒 3 回合，每回合損失最大生命 10%，且五維屬性降低 15%。', effect: 'poison', innerPowerCost: 6 },
    ],
    aura: [{ name: '驛路步', description: '進入官道時，移動消耗降為 1。', passiveBuffIds: ['road-step'] }],
    enhancement: [],
  },
]

export const MARTIAL_HALL_SCHOOL_ID = 'void-spirit'
export const martialHallSchool = martialSchoolCatalog.find((school) => school.id === MARTIAL_HALL_SCHOOL_ID)!

export const progressionInnerSkills: InnerSkill[] = martialSchoolCatalog.flatMap((school) => school.inner.map((inner) => createInnerSkill({
  id: `${school.id}-inner`,
  name: inner.name,
  description: `${inner.theme}核心內功。`,
  formulaDescription: `${inner.formula}（最低 1）`,
  insightRequirement: 5,
  requiredHallLevel: 1,
  school: school.name,
  schoolId: school.id,
  element: school.element,
  level: 1,
  calculateDamage: (attributes) => inner.calculate(attributes, 1),
})))

export const martialHallInnerSkills: InnerSkill[] = progressionInnerSkills.filter((skill) => skill.school === martialHallSchool.name)

export const progressionExternalSkills: ExternalSkill[] = martialSchoolCatalog.flatMap((school) => {
  const inner = school.inner[0]
  const damageSkills = school.damage.map((entry, index) => createDamageExternalSkill({
    id: index === 0 ? `${school.id}-external-damage` : `${school.id}-external-damage-${index + 1}`,
    name: entry.name,
    description: `${inner.theme}${entry.description}`,
    formulaDescription: entry.description,
    insightCost: 2,
    requiredHallLevel: index === 0 ? 2 : 3,
    school: school.name,
    schoolId: school.id,
    element: school.element,
    level: 1,
    innerPowerCost: entry.innerPowerCost ?? (index === 0 ? 4 : 6),
    functionalEffect: entry.effect,
    calculateDamage: index === 0 ? (attributes) => school.inner[0].calculate(attributes, 1) + 1 : undefined,
  }))

  const auraSkills = school.aura.map((entry, index) => createAuraExternalSkill({
    id: `${school.id}-external-functional${index === 0 ? '' : `-${index + 1}`}`,
    name: entry.name,
    description: `${inner.theme}${entry.description}`,
    formulaDescription: entry.description,
    insightCost: 2,
    requiredHallLevel: 3,
    school: school.name,
    schoolId: school.id,
    element: school.element,
    level: 1,
    passiveBuffIds: entry.passiveBuffIds,
  }))

  // 強化型外功預留給未來門派功法，目前回春功位於江湖功法目錄。
  return [...damageSkills, ...auraSkills]
})

export const martialHallExternalSkills: ExternalSkill[] = progressionExternalSkills.filter((skill) => skill.school === martialHallSchool.name)
