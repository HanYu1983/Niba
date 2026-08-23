import type { ExternalSkill } from './externalSkillCatalog'
import type { FunctionalExternalSkillEffect } from './functionalSkillRegistry'
import { functionalExternalSkillDescriptions } from './functionalSkillRegistry'
import { createAuraExternalSkill, createEnhancementExternalSkill } from './skillFactory'

/**
 * 江湖外功功法目錄。
 *
 * 所謂「江湖門派」就是沒有門派——這些功法由散修武者於江湖中流傳，
 * 不隸屬任何 `schoolId`，因此可在任何武館學習、也可自掉落取得。
 *
 * 每個功法對應一個靈氣 Buff，透過 `functionalEffect` → 功能型外功 registry
 * 掛載到對應的 Buff 上（皆為 `target: 'self'`、`category: 'aura'`，裝備後常駐生效）。
 */

/** 江湖靈氣型外功的共用取得條件。 */
const JIANGHU_AURA_DEFAULTS = {
  insightCost: 2,
  requiredHallLevel: 3,
  level: 1,
}

/**
 * 建立單一江湖靈氣型外功。
 * `formulaDescription` 直接取自 `functionalExternalSkillDescriptions`，
 * 避免與 `effect` 說明（description）產生資料漂移。
 */
function createJianghuSkill(input: {
  id: string
  name: string
  description: string
  functionalEffect: FunctionalExternalSkillEffect
}): ExternalSkill {
  return createAuraExternalSkill({
    ...JIANGHU_AURA_DEFAULTS,
    ...input,
    formulaDescription: functionalExternalSkillDescriptions[input.functionalEffect],
  })
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
]

/**
 * 強化型外功：回春功。
 * 直接施放、立即回復自身最大生命的 20%；無冷卻、不消耗體力、允許滿血施放。
 */
export const springReturnEnhancement: ExternalSkill = createEnhancementExternalSkill({
  id: 'jianghu-spring-return',
  name: '回春功',
  description: '江湖養生功法，施展後氣血迅速回覆。直接施放，回復自身最大生命的 20%。',
  formulaDescription: '直接回復自身最大生命的 20%。',
  insightCost: 2,
  requiredHallLevel: 3,
  level: 1,
  innerPowerCost: 2,
  activationEffect: { kind: 'heal-self-percent', percent: 0.2 },
})

export type JianghuExternalSkillEffect = FunctionalExternalSkillEffect