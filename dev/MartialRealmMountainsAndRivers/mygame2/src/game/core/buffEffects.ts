import type { PlayerAttributes, TerrainType } from '../types'
import type { BuffConditional } from '../catalogs/buffCatalog'

/**
 * Buff 效果欄位基底型別。
 *
 * 收斂「可被 BuffInstance 覆寫的數值/旗標效果欄位」，讓
 * `BuffDefinition = BuffEffects & BuffMetadata` 與
 * `BuffInstance = Partial<BuffEffects> & { id; definitionId; sourceId; remainingRounds }`
 * 共用同一份欄位定義，取代散落的手工白名單。
 *
 * 所有欄位皆為可選（optional），因為單一 Buff 通常只影響少數效果。
 */
export type BuffEffects = {
  /** 五維屬性加成（覆寫定義基礎值，供等級縮放）。 */
  attributeModifiers?: Partial<PlayerAttributes>
  /** 逐地形體力消耗乘算。 */
  terrainStaminaCostMultipliers?: Partial<Record<TerrainType, number>>
  /** 暴擊率乘算。 */
  criticalRateMultiplier?: number
  /** 暴擊率加成（百分比，直接加在臂力決定的暴擊率上）。 */
  criticalRateBonus?: number
  /** 逐地形消耗覆寫：指定地形直接回傳此值（優先於基礎消耗與乘算，可讓 wall 變可通行）。 */
  terrainCostOverride?: number
  /** 逐地形消耗覆寫（多地形版）。 */
  terrainCostOverrides?: Partial<Record<TerrainType, number>>
  /** 最大血量傷害比例。 */
  maxHealthDamagePercent?: number
  /** 反傷比例。 */
  reflectionPercent?: number
  /** 五維乘算。 */
  attributeMultiplier?: number
  /** 定身：持有此 Buff 的怪物本回合跳過移動。 */
  immobilized?: boolean
  /** 震懾：三重共振觸發時施加，目標完全跳過下一個回合。 */
  stunned?: boolean
  /** 條件觸發型：血量歸零時復活。 */
  reviveOnDeath?: boolean
  /** 復活時恢復的血量比例（0–1）。 */
  reviveHealthPercent?: number
  /** 復活時是否清除所有 debuff。 */
  clearDebuffsOnRevive?: boolean
  /** 造成傷害時回復傷害值比例的血量。 */
  lifestealPercent?: number
  /** 造成傷害時回復傷害值比例的內力。 */
  innerPowerLeechPercent?: number
  /** 受到傷害時，最終傷害減免比例。 */
  damageReductionPercent?: number
  /** 每回合回復最大血量比例。 */
  healthRegenPercent?: number
  /** 每回合回復「最大內力 × 比例」的血量。 */
  innerPowerHealthRegenPercent?: number
  /** 每回合回復「最大內力 × 比例」的內力。 */
  innerPowerRegenPercent?: number
  /** 普通攻擊造成的最終傷害加成比例。 */
  damageDealtPercent?: number
  /** 外功造成的最終傷害加成比例。 */
  externalSkillDamagePercent?: number
  /** 回避率加成（百分比，直接加在身法決定的回避率上）。 */
  evasionRateBonus?: number
  /** 普通攻擊的體力消耗減免。 */
  basicAttackStaminaCostReduction?: number
  /** 體力轉內力比例。 */
  staminaToInnerPowerRatio?: number
  /** 外功內力消耗減免。 */
  externalSkillInnerCostReduction?: number
  /** 悟性真實傷害乘算。 */
  insightTrueDamageMultiplier?: number
  /** 視野半徑加成。 */
  visionRadiusBonus?: number
  /** 最大體力加成。 */
  maxStaminaBonus?: number
  /** 最大生命值上限倍率（resource-limit 原語；預設 1，可 <1 或 >1）。 */
  maxHealthMultiplier?: number
  /** 最大體力上限倍率（resource-limit 原語；預設 1）。 */
  maxStaminaMultiplier?: number
  /** 最大內力上限倍率（resource-limit 原語；預設 1）。 */
  maxInnerPowerMultiplier?: number
  /** 採集體力消耗減免。 */
  gatherStaminaCostReduction?: number
  /** 採集雙倍產出機率。 */
  gatherDoubleYieldChance?: number
  /** 建料消耗減免。 */
  buildingMaterialCostReduction?: number
  /** 建造聲望加成。 */
  buildingReputationBonus?: number
  /** 商店購買折扣。 */
  shopBuyPriceDiscount?: number
  /** 商店販售加成。 */
  shopSellPriceBonus?: number
  /** 任務獎勵加成。 */
  questRewardBonus?: number
  /** 功法經驗獲取比例加成。 */
  skillExpGainPercent?: number
  /** 混亂：行動隨機化。 */
  confused?: boolean
  /** 來自友軍的傷害加成。 */
  damageTakenFromAlliesBonus?: number
  /** 條件觸發型：依血量區間觸發的五維乘算。 */
  conditional?: BuffConditional
}

/**
 * BuffEffects 的執行期鍵陣列。
 *
 * 供「依 instance 覆寫定義」的邏輯以型別驅動方式迭代效果欄位，
 * 取代手工白名單。以 `satisfies` 確保與型別欄位一致。
 */
export const BuffEffectsKeys = [
  'attributeModifiers',
  'terrainStaminaCostMultipliers',
  'criticalRateMultiplier',
  'criticalRateBonus',
  'terrainCostOverride',
  'terrainCostOverrides',
  'maxHealthDamagePercent',
  'reflectionPercent',
  'attributeMultiplier',
  'immobilized',
  'stunned',
  'reviveOnDeath',
  'reviveHealthPercent',
  'clearDebuffsOnRevive',
  'lifestealPercent',
  'innerPowerLeechPercent',
  'damageReductionPercent',
  'healthRegenPercent',
  'innerPowerHealthRegenPercent',
  'innerPowerRegenPercent',
  'damageDealtPercent',
  'externalSkillDamagePercent',
  'evasionRateBonus',
  'basicAttackStaminaCostReduction',
  'staminaToInnerPowerRatio',
  'externalSkillInnerCostReduction',
  'insightTrueDamageMultiplier',
  'visionRadiusBonus',
  'maxStaminaBonus',
  'maxHealthMultiplier',
  'maxStaminaMultiplier',
  'maxInnerPowerMultiplier',
  'gatherStaminaCostReduction',
  'gatherDoubleYieldChance',
  'buildingMaterialCostReduction',
  'buildingReputationBonus',
  'shopBuyPriceDiscount',
  'shopSellPriceBonus',
  'questRewardBonus',
  'skillExpGainPercent',
  'confused',
  'damageTakenFromAlliesBonus',
  'conditional',
] as const satisfies readonly (keyof BuffEffects)[]