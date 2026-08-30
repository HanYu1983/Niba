import type { InnerSkill } from './innerSkillCatalog'
import type { PlayerAttributes, SelectionMode, TargetingShape } from '../types'
import { type FunctionalExternalSkillEffect } from './functionalSkillRegistry'
import type { ExternalSkill } from './externalSkillCatalog'
import { createAuraExternalSkill, createDamageExternalSkill, createInnerSkill } from './skillFactory'

export type SchoolElement = 'none' | 'metal' | 'wood' | 'water' | 'fire' | 'earth'

export function getSchoolElement(schoolId?: string): SchoolElement {
  return martialSchoolCatalog.find(school => school.id === schoolId)?.element ?? 'none'
}

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
  /** 曼哈頓距離範圍（targeting 框架）；未設定時為相鄰。 */
  range?: number
  /** 範圍形狀（targeting 框架）；未設定時依 range 推導 radius。 */
  shape?: TargetingShape
  /** 選取模式（targeting 框架）；未設定時預設 single。 */
  selectionMode?: SelectionMode
  insightCost?: number
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
      { name: '暴擊強化', description: '自身暴擊率 +15%（常駐）。', effect: 'critical-rate', passiveBuffIds: ['golden-body-critical-boost'] },
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
    damage: [{ name: '追風腿', description: '以身法帶動腿勁，朝 2 格內單一敵人造成傷害。', innerPowerCost: 6, range: 2 }],
    aura: [
      { name: '疾行', description: '地形消耗一律視為草地。', passiveBuffIds: ['swift-wind-movement'], insightCost: 4 },
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
      { name: '燎原', description: '使周圍 1 格內目標燃燒 3 回合，每回合損失最大生命 20%。', effect: 'burning', innerPowerCost: 8, shape: { kind: 'radius', range: 1 }, selectionMode: { kind: 'all' } },
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
      { name: '凝霜', description: '使周圍 1 格內目標 2 回合內五項基本屬性降低 20%。', effect: 'attribute-reduction', innerPowerCost: 8, shape: { kind: 'radius', range: 1 }, selectionMode: { kind: 'all' } },
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
      { name: '反震', description: '開啟後受到傷害時，反彈 25% 傷害（常駐）。', effect: 'reflection', passiveBuffIds: ['earth-mountain-reflection'] },
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
    damage: [{ name: '靈犀指', description: '以靈犀一指點出，朝 2 格內單一敵人造成傷害。', innerPowerCost: 6, range: 2 }],
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
    aura: [],
    enhancement: [],
  },
  {
    id: 'sharp-edge',
    name: '銳鋒流',
    element: 'metal',
    inner: [{
      name: '銳鋒淬芒',
      theme: '新興鑄劍世家的快劍之道，強化臂力與身法，講究搶攻奪勢、一擊制敵。',
      formula: '臂力 × 0.7 + 身法 × 0.3',
      calculate: (attributes, level) => Math.max(1, Math.floor(attributes.armStrength * 0.7 + attributes.agility * 0.3) * level),
    }],
    damage: [{ name: '銳鋒斬', description: '快劍疾斬而出，朝 2 格內單一敵人造成傷害。', innerPowerCost: 6, range: 2 }],
    aura: [
      { name: '劍心明鑑', description: '自身地圖視野半徑 +1（常駐）。', passiveBuffIds: ['sharp-edge-sword-heart'] },
      { name: '凌厲劍勢', description: '普通攻擊造成的最終傷害 +10%（常駐）。', passiveBuffIds: ['sharp-edge-keen-edge'] },
    ],
    enhancement: [],
  },
  {
    id: 'misty-rain',
    name: '煙雨流',
    element: 'water',
    inner: [{
      name: '煙雨養元',
      theme: '江南煙雨樓的養生綿掌，強化內息與悟性，擅長以柔克剛與回復續戰。',
      formula: '內息 × 0.5 + 悟性 × 0.5',
      calculate: (attributes, level) => Math.max(1, Math.floor(attributes.innerEnergy * 0.5 + attributes.insight * 0.5) * level),
    }],
    damage: [{ name: '煙雨掌', description: '掌如細雨連綿，對相鄰單一敵人造成傷害。', innerPowerCost: 4 }],
    aura: [
      { name: '雨潤回春', description: '每回合回復最大內力 10% 的內力（常駐）。', passiveBuffIds: ['misty-rain-drizzle-nourish'] },
      { name: '雨幕遮身', description: '受到傷害時，最終傷害 -10%（常駐）。', passiveBuffIds: ['misty-rain-rain-curtain'] },
    ],
    enhancement: [],
  },
  {
    id: 'blazing-sun',
    name: '烈陽流',
    element: 'fire',
    inner: [{
      name: '烈陽戰體',
      theme: '西域烈陽教遺部的血性武學，強化根骨與臂力，越戰越勇、剛猛無儔。',
      formula: '根骨 × 0.6 + 臂力 × 0.4',
      calculate: (attributes, level) => Math.max(1, Math.floor(attributes.constitution * 0.6 + attributes.armStrength * 0.4) * level),
    }],
    damage: [{ name: '烈陽轟', description: '陽罡之氣轟然擊出，對周圍 1 格內所有敵人造成傷害。', innerPowerCost: 8, shape: { kind: 'radius', range: 1 }, selectionMode: { kind: 'all' } }],
    aura: [
      { name: '烈陽戰意', description: '臂力與根骨 +3（常駐）。', passiveBuffIds: ['blazing-sun-fervor'] },
      { name: '烈目凝芒', description: '暴擊率 ×1.25（常駐）。', passiveBuffIds: ['blazing-sun-blazing-gaze'] },
    ],
    enhancement: [],
  },
  {
    id: 'yellow-earth',
    name: '黃土流',
    element: 'earth',
    inner: [{
      name: '黃土紮根',
      theme: '黃土溝壑間獵戶自衛武團的野路子，強化根骨與身法，擅長持久游擊與修築工事。',
      formula: '根骨 × 0.5 + 身法 × 0.5',
      calculate: (attributes, level) => Math.max(1, Math.floor(attributes.constitution * 0.5 + attributes.agility * 0.5) * level),
    }],
    damage: [{ name: '裂石棍', description: '鐵棍劈裂山石，對相鄰單一敵人造成傷害。', innerPowerCost: 4 }],
    aura: [
      { name: '夯土工事', description: '建築材料消耗 -15%（常駐）。', passiveBuffIds: ['yellow-earth-rammed-earth'] },
      { name: '負重健行', description: '最大體力 +4（常駐）。', passiveBuffIds: ['yellow-earth-pack-march'] },
    ],
    enhancement: [],
  },
  {
    id: 'ghost-shadow',
    name: '幽影流',
    element: 'none',
    inner: [{
      name: '幽影藏形',
      theme: '隱世幽影流的暗襲之術，強化身法與悟性，來去無蹤、隱匿於暗。',
      formula: '身法 × 0.5 + 悟性 × 0.5',
      calculate: (attributes, level) => Math.max(1, Math.floor(attributes.agility * 0.5 + attributes.insight * 0.5) * level),
    }],
    damage: [{ name: '影襲', description: '自暗處無聲刺出，朝 2 格內單一敵人造成傷害。', innerPowerCost: 6, range: 2 }],
    aura: [
      { name: '幽影蔽身', description: '回避率 +10%（常駐）。', passiveBuffIds: ['ghost-shadow-shadow-veil'] },
      { name: '孤影決絕', description: '血量低於 25% 時五維 ×1.6，持續 3 回合。', passiveBuffIds: ['ghost-shadow-lone-resolve'] },
    ],
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
  const damageSkills = school.damage.map((entry, index) => createDamageExternalSkill({
    id: index === 0 ? `${school.id}-external-damage` : `${school.id}-external-damage-${index + 1}`,
    name: entry.name,
    description: `${entry.description}`,
    formulaDescription: entry.description,
    insightCost: 2,
    requiredHallLevel: index === 0 ? 2 : 3,
    school: school.name,
    schoolId: school.id,
    element: school.element,
    level: 1,
    innerPowerCost: entry.innerPowerCost ?? (index === 0 ? 4 : 6),
    range: entry.range,
    shape: entry.shape,
    selectionMode: entry.selectionMode,
    functionalEffect: entry.effect,
    calculateDamage: index === 0 ? (attributes) => school.inner[0].calculate(attributes, 1) + 1 : undefined,
  }))

  const auraSkills = school.aura.map((entry, index) => createAuraExternalSkill({
    id: `${school.id}-external-functional${index === 0 ? '' : `-${index + 1}`}`,
    name: entry.name,
    description: `${entry.description}`,
    formulaDescription: entry.description,
    insightCost: entry.insightCost ?? 2,
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
