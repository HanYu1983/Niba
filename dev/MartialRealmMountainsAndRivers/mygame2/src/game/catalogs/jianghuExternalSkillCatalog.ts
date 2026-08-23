import type { ExternalSkill } from './externalSkillCatalog'
import type { FunctionalExternalSkillEffect } from './functionalSkillRegistry'
import { functionalExternalSkillDescriptions } from './functionalSkillRegistry'

/**
 * 江湖外功功法目錄。
 *
 * 所謂「江湖門派」就是沒有門派——這些功法由散修武者於江湖中流傳，
 * 不隸屬任何武館流派（無 `schoolId`），因此可在任何武館學習、也可自掉落取得。
 *
 * 每個功法對應一個 Buff，透過 `functionalEffect` → 功能型外功 registry 掛載到
 * 對應的 Buff 上（皆為 `target: 'self'`，施放時對自身施加 Buff）。
 */

/** 江湖功法的固定屬性：所有功能型外功共用相同取得條件與施展成本。 */
const JIANGHU_SKILL_DEFAULTS = {
  insightCost: 2,
  requiredHallLevel: 3,
  level: 1,
  innerPowerCost: 5,
  target: 'self' as const,
}

/**
 * 建立單一江湖功能型外功法。
 * `formulaDescription` 直接取自 `functionalExternalSkillDescriptions`，
 * 避免與效果說明（description）產生資料漂移。
 */
function createJianghuSkill(input: {
  id: string
  name: string
  description: string
  functionalEffect: FunctionalExternalSkillEffect
}): ExternalSkill {
  return {
    ...JIANGHU_SKILL_DEFAULTS,
    ...input,
    formulaDescription: functionalExternalSkillDescriptions[input.functionalEffect],
    calculateDamage: () => 0,
  }
}

export const jianghuExternalSkills: ExternalSkill[] = [
  // 類別 1：資源轉換
  createJianghuSkill({
    id: 'jianghu-bloodthirst',
    name: '血飲功',
    description: '江湖邪功，以敵之血養己之身。',
    functionalEffect: 'lifesteal',
  }),
  createJianghuSkill({
    id: 'jianghu-iron-wall',
    name: '鐵壁功',
    description: '江湖橫練功夫，運勁護體。',
    functionalEffect: 'damage-reduction',
  }),
  createJianghuSkill({
    id: 'jianghu-spring-return',
    name: '回春功',
    description: '江湖養生功法，氣血生生不息。',
    functionalEffect: 'health-regen',
  }),
  createJianghuSkill({
    id: 'jianghu-qi-transformation',
    name: '化氣功',
    description: '江湖秘傳，化內力為氣血。',
    functionalEffect: 'inner-power-health-regen',
  }),
  createJianghuSkill({
    id: 'jianghu-inner-power-drain',
    name: '汲元功',
    description: '江湖奪氣之法，傷敵而補己。',
    functionalEffect: 'inner-power-leech',
  }),
  createJianghuSkill({
    id: 'jianghu-break-army',
    name: '破軍功',
    description: '江湖殺伐之術，專破敵陣。',
    functionalEffect: 'damage-dealt',
  }),
  createJianghuSkill({
    id: 'jianghu-vigor',
    name: '罡氣功',
    description: '江湖剛猛內勁，灌注外功。',
    functionalEffect: 'external-skill-damage',
  }),
  // 類別 4：條件型
  createJianghuSkill({
    id: 'jianghu-back-to-water',
    name: '背水功',
    description: '江湖絕境求生之術，置之死地而後生。',
    functionalEffect: 'back-to-water',
  }),
  createJianghuSkill({
    id: 'jianghu-nurture-qi',
    name: '養氣功',
    description: '江湖養生心法，氣足則力盛。',
    functionalEffect: 'nurture-qi',
  }),
  createJianghuSkill({
    id: 'jianghu-all-in',
    name: '孤注功',
    description: '江湖搏命之技，一擲乾坤。',
    functionalEffect: 'all-in',
  }),
  // 洞悉與身法
  createJianghuSkill({
    id: 'jianghu-critical-eye',
    name: '洞玄功',
    description: '江湖眼力之術，洞察敵人破綻。',
    functionalEffect: 'critical-rate',
  }),
  createJianghuSkill({
    id: 'jianghu-wayfarer',
    name: '遊方功',
    description: '江湖行腳功夫，翻山越嶺如履平地。',
    functionalEffect: 'terrain-adaptation',
  }),
  createJianghuSkill({
    id: 'jianghu-mirror-return',
    name: '鏡花功',
    description: '江湖借力之法，以彼之道還施彼身。',
    functionalEffect: 'reflection',
  }),
  createJianghuSkill({
    id: 'jianghu-elusive-trail',
    name: '迷蹤功',
    description: '江湖遁形之技，身形飄忽難以捉摸。',
    functionalEffect: 'evasion',
  }),
  // 周天運轉
  createJianghuSkill({
    id: 'jianghu-breath-cycle',
    name: '行氣功',
    description: '江湖導引術，行氣通脈不知疲倦。',
    functionalEffect: 'stamina-regen',
  }),
  createJianghuSkill({
    id: 'jianghu-tide-breath',
    name: '潮息功',
    description: '江湖吐納秘法，內息如潮生生不絕。',
    functionalEffect: 'inner-power-regen',
  }),
  // 險功與自保
  createJianghuSkill({
    id: 'jianghu-demonic-frenzy',
    name: '入魔功',
    description: '江湖禁術，燃血入魔力量暴漲，卻傷及己身。',
    functionalEffect: 'berserk',
  }),
  createJianghuSkill({
    id: 'jianghu-dust-cleansing',
    name: '滌塵功',
    description: '江湖自保心法，滌盡身上異狀百毒。',
    functionalEffect: 'cleanse',
  }),
  createJianghuSkill({
    id: 'jianghu-sitting-forget',
    name: '坐忘功',
    description: '江湖靜坐之法，片刻調息體力內力雙復。',
    functionalEffect: 'recover',
  }),
  createJianghuSkill({
    id: 'jianghu-poison-proof',
    name: '百毒不侵功',
    description: '江湖橫練罡氣，毒邪不侵。',
    functionalEffect: 'debuff-immunity',
  }),
]

export type JianghuExternalSkillEffect = FunctionalExternalSkillEffect