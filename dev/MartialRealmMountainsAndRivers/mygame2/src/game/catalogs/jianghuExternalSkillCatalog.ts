import type { FunctionalExternalSkillEffect } from './functionalSkillRegistry'
import { createAuraExternalSkill, createEnhancementExternalSkill } from './skillFactory'
import type { ExternalSkill } from './externalSkillCatalog'

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
 * `formulaDescription` 直接由各功法手寫，避免依賴額外 mapping。
 */
function createJianghuSkill(input: {
  id: string
  name: string
  description: string
  formulaDescription: string
  functionalEffect: FunctionalExternalSkillEffect
}): ExternalSkill {
  return createAuraExternalSkill({
    ...JIANGHU_AURA_DEFAULTS,
    ...input,
  })
}

export const jianghuExternalSkills: ExternalSkill[] = [
  // 類別 1：資源轉換
  createJianghuSkill({
    id: 'jianghu-bloodthirst',
    name: '血飲功',
    description: '江湖邪功，以敵之血養己之身。',
    formulaDescription: '造成傷害時，回復「15% + 等級×2%」傷害值的血量。',
    functionalEffect: 'lifesteal',
  }),
  createJianghuSkill({
    id: 'jianghu-iron-wall',
    name: '鐵壁功',
    description: '江湖橫練功夫，運勁護體。',
    formulaDescription: '受到傷害時，最終傷害 「-(10% + 等級×2%)」。',
    functionalEffect: 'damage-reduction',
  }),
  createJianghuSkill({
    id: 'jianghu-qi-transformation',
    name: '化氣功',
    description: '江湖秘傳，化內力為氣血。',
    formulaDescription: '每回合回復「最大內力 ×（5% + 等級×1%）」的氣血。',
    functionalEffect: 'inner-power-health-regen',
  }),
  createJianghuSkill({
    id: 'jianghu-inner-power-drain',
    name: '汲元功',
    description: '江湖奪氣之法，傷敵而補己。',
    formulaDescription: '造成傷害時，回復「8% + 等級×1.5%」的傷害值的內力。',
    functionalEffect: 'inner-power-leech',
  }),
  createJianghuSkill({
    id: 'jianghu-break-army',
    name: '破軍功',
    description: '江湖殺伐之術，專破敵陣。',
    formulaDescription: '普通攻擊造成的最終傷害 +「10% + 等級×2%」。',
    functionalEffect: 'damage-dealt',
  }),
  createJianghuSkill({
    id: 'jianghu-vigor',
    name: '罡氣功',
    description: '江湖剛猛內勁，灌注外功。',
    formulaDescription: '外功造成的最終傷害 +「10% + 等級×2%」。',
    functionalEffect: 'external-skill-damage',
  }),
  // 類別 4：條件型
  createJianghuSkill({
    id: 'jianghu-back-to-water',
    name: '背水功',
    description: '江湖絕境求生之術，置之死地而後生。',
    formulaDescription: '血量低於 30% 時，五維 ×「1.25 + 等級×0.05」。',
    functionalEffect: 'back-to-water',
  }),
  createJianghuSkill({
    id: 'jianghu-nurture-qi',
    name: '養氣功',
    description: '江湖養生心法，氣足則力盛。',
    formulaDescription: '血量高於 80% 時，五維 ×「1.1 + 等級×0.05」。',
    functionalEffect: 'nurture-qi',
  }),
  createJianghuSkill({
    id: 'jianghu-all-in',
    name: '孤注功',
    description: '江湖搏命之技，一擲乾坤。',
    formulaDescription: '血量低於 15% 時，五維 ×「1.5 + 等級×0.1」。',
    functionalEffect: 'all-in',
  }),
  // 悟性輔助線：散修謀生的市井功夫
  createJianghuSkill({
    id: 'jianghu-sky-eye',
    name: '天眼功',
    description: '登高望遠的散修眼法，練成後目光如炬。',
    formulaDescription: '自身地圖視野半徑 +1（常駐）。',
    functionalEffect: 'vision-expansion',
  }),
  createJianghuSkill({
    id: 'jianghu-four-ounces',
    name: '四兩功',
    description: '以巧勁卸蠻力的江湖手法，出招省力。',
    formulaDescription: '所有外功內力消耗 -1（最低 1，常駐）。',
    functionalEffect: 'skill-cost-reduction',
  }),
  createJianghuSkill({
    id: 'jianghu-merchant-way',
    name: '商道功',
    description: '行商護鏢練就的市井智慧，低買高賣。',
    formulaDescription: '買入價格 -15%，賣出價格 +15%（常駐）。',
    functionalEffect: 'merchant-way',
  }),
  createJianghuSkill({
    id: 'jianghu-craftsman',
    name: '天工功',
    description: '匠人營造之術，築城修寨事半功倍。',
    formulaDescription: '建築材料消耗 -25%，建造聲望 +50%（常駐）。',
    functionalEffect: 'craftsmanship',
  }),
  createJianghuSkill({
    id: 'jianghu-gathering',
    name: '百草功',
    description: '採藥人世代相傳的本事，識百草、辨靈物。',
    formulaDescription: '採集體力消耗 -1，採集 50% 機率雙倍產出（常駐）。',
    functionalEffect: 'gathering',
  }),
  createJianghuSkill({
    id: 'jianghu-divine-movement',
    name: '神行功',
    description: '千里獨行的趕路功夫，氣長則行遠。',
    formulaDescription: '最大體力 +2（常駐）。',
    functionalEffect: 'divine-movement',
  }),
  createJianghuSkill({
    id: 'jianghu-qi-conversion',
    name: '引氣功',
    description: '導引吐納之術，收斂餘勁化為內息。',
    formulaDescription: '回合結束時，剩餘體力轉化為內力（1 體力 → 2 內力，常駐）。',
    functionalEffect: 'qi-conversion',
  }),
  createJianghuSkill({
    id: 'jianghu-longevity',
    name: '長生功',
    description: '江湖養生延年之術，氣血自生不絕。',
    formulaDescription: '每回合回復最大血量 10% 的氣血。',
    functionalEffect: 'health-regen',
  }),
  // 迴避與保命：江湖人身懷絕技以求自保
  createJianghuSkill({
    id: 'jianghu-phantom',
    name: '幻影功',
    description: '虛實難辨的詭異身法，敵招難以沾身。',
    formulaDescription: '回避率 +「5% + 等級×1%」（常駐）。',
    functionalEffect: 'evasion',
  }),
  createJianghuSkill({
    id: 'jianghu-return-light',
    name: '回光功',
    description: '瀕死反擊的保命絕學，迴光返照絕處逢生。',
    formulaDescription: '瀕死時攔截死亡，復活至「30% + 等級×5%」血量並清除所有 debuff（常駐，只保一次）。',
    functionalEffect: 'revive-guard',
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