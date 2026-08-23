import type { PlayerAttributes, TerrainType } from "../types"

export type BuffDuration = 'persistent' | 'rounds'

export type BuffCategory = 'buff' | 'debuff' | 'neutral'

export type BuffConditional = {
  when: 'health-below' | 'health-above'
  /** 0-1 之間的血量比例門檻。 */
  threshold: number
  /** 觸發時套用的五維乘算。 */
  multiplier: number
}

export type BuffDefinition = {
  id: string
  name: string
  description: string
  duration: BuffDuration
  /** duration 為 rounds 時的持續回合數。 */
  durationRounds?: number
  category?: BuffCategory
  attributeModifiers?: Partial<PlayerAttributes>
  terrainStaminaCostMultipliers?: Partial<Record<TerrainType, number>>
  criticalRateMultiplier?: number
  terrainCostOverride?: number
  /** 逐地形消耗覆寫：指定地形直接回傳此值（優先於基礎消耗與乘算，可讓 wall 變可通行）。 */
  terrainCostOverrides?: Partial<Record<TerrainType, number>>
  maxHealthDamagePercent?: number
  reflectionPercent?: number
  attributeMultiplier?: number
  /** 定身：持有此 Buff 的怪物本回合跳過移動。 */
  immobilized?: boolean
  /** 條件觸發型：血量歸零時復活。 */
  reviveOnDeath?: boolean
  /** 復活時恢復的血量比例（0–1）。 */
  reviveHealthPercent?: number
  /** 復活時是否清除所有 debuff。 */
  clearDebuffsOnRevive?: boolean
  // 類別 1：資源轉換
  /** 造成傷害時回復傷害值比例的血量。 */
  lifestealPercent?: number
  /** 造成傷害時回復傷害值比例的內力。 */
  innerPowerLeechPercent?: number
  /** 受到傷害時，最終傷害減免比例。 */
  damageReductionPercent?: number
  // 類別 1：週期回復
  /** 每回合回復最大血量比例。 */
  healthRegenPercent?: number
  /** 每回合回復「最大內力 × 比例」的血量。 */
  innerPowerHealthRegenPercent?: number
  // 類別 1：傷害增益
  /** 普通攻擊造成的最終傷害加成比例。 */
  damageDealtPercent?: number
  /** 外功造成的最終傷害加成比例。 */
  externalSkillDamagePercent?: number
  /** 回避率加成（百分比，直接加在身法決定的回避率上）。 */
  evasionRateBonus?: number
  /** 普通攻擊的體力消耗減免。 */
  basicAttackStaminaCostReduction?: number
  staminaToInnerPowerRatio?: number
  externalSkillInnerCostReduction?: number
  insightTrueDamageMultiplier?: number
  visionRadiusBonus?: number
  maxStaminaBonus?: number
  gatherStaminaCostReduction?: number
  gatherDoubleYieldChance?: number
  buildingMaterialCostReduction?: number
  buildingReputationBonus?: number
  shopBuyPriceDiscount?: number
  shopSellPriceBonus?: number
  questRewardBonus?: number
  /** 功法經驗獲取比例加成。 */
  skillExpGainPercent?: number
  confused?: boolean
  damageTakenFromAlliesBonus?: number
  // 類別 4：條件型
  /** 依血量區間觸發的五維乘算。 */
  conditional?: BuffConditional
}

export const buffCatalog: BuffDefinition[] = [
  {
    id: 'tuna-gong-focus',
    name: '吐納養氣',
    description: '裝備吐納功期間，提升悟性。',
    duration: 'persistent',
    attributeModifiers: { insight: 5 },
  },
  {
    id: 'iron-force-strength',
    name: '鐵臂鍛體',
    description: '裝備鐵臂功期間，提升臂力。',
    duration: 'persistent',
    attributeModifiers: { armStrength: 1 },
  },
  {
    id: 'inner-breathing-inner-energy',
    name: '玄息凝氣',
    description: '裝備玄息訣期間，提升內息。',
    duration: 'persistent',
    attributeModifiers: { innerEnergy: 1 },
  },
  {
    id: 'iron-wall-constitution',
    name: '磐石護體',
    description: '根骨沉穩如山，提升承受傷害的根基。',
    duration: 'persistent',
    attributeModifiers: { constitution: 1 },
  },
  {
    id: 'flowing-shadow-agility',
    name: '流雲身法',
    description: '身形飄忽如流雲，提升行動時的靈活性。',
    duration: 'persistent',
    attributeModifiers: { agility: 1 },
  },
  { id: 'golden-body-critical-boost', name: '暴擊強化', description: '暴擊率 ×2。', duration: 'rounds', durationRounds: 2, criticalRateMultiplier: 2 },
  { id: 'swift-wind-movement', name: '疾行', description: '地形消耗一律視為草地。', duration: 'rounds', durationRounds: 2, terrainCostOverride: 2 },
  { id: 'swift-wind-attack-focus', name: '追風攻勢', description: '普通攻擊體力消耗 -2。', duration: 'persistent', category: 'buff', basicAttackStaminaCostReduction: 2 },
  { id: 'void-spirit-return-qi', name: '迴氣悟道', description: '功法經驗獲得 +20%。', duration: 'persistent', category: 'buff', skillExpGainPercent: 0.2 },
  // 悟性輔助功法（靈氣型外功）：天眼望氣
  { id: 'sky-eye-vision', name: '天眼望氣', description: '自身地圖視野半徑 +1。', duration: 'persistent', category: 'buff', visionRadiusBonus: 1 },
  // 悟性輔助功法（靈氣型外功）：四兩撥千斤
  { id: 'four-ounces-thousand-pounds', name: '四兩撥千斤', description: '所有外功內力消耗 -1（最低 1）。', duration: 'persistent', category: 'buff', externalSkillInnerCostReduction: 1 },
  // 悟性輔助功法（靈氣型外功）：商道通鑑
  { id: 'merchant-way', name: '商道通鑑', description: '買入價格 -15%，賣出價格 +15%。', duration: 'persistent', category: 'buff', shopBuyPriceDiscount: 0.15, shopSellPriceBonus: 0.15 },
  // 悟性輔助功法（靈氣型外功）：天工開物
  { id: 'heavenly-craftsman', name: '天工開物', description: '建築材料消耗 -25%，建造聲望 +50%。', duration: 'persistent', category: 'buff', buildingMaterialCostReduction: 0.25, buildingReputationBonus: 0.5 },
  // 悟性輔助功法（靈氣型外功）：靈植百草鑑
  { id: 'spirit-herb-hundred-grass', name: '靈植百草', description: '採集體力消耗 -1，採集 50% 機率雙倍產出。', duration: 'persistent', category: 'buff', gatherStaminaCostReduction: 1, gatherDoubleYieldChance: 0.5 },
  // 悟性輔助功法（靈氣型外功）：神行八卦步
  { id: 'divine-movement-eight-trigrams', name: '神行八卦', description: '最大體力 +2。', duration: 'persistent', category: 'buff', maxStaminaBonus: 2 },
  // 悟性輔助功法（靈氣型外功）：太虛引氣
  { id: 'taixu-qi-conversion', name: '引氣歸元', description: '回合結束時，剩餘體力轉化為內力（1 體力 → 2 內力）。', duration: 'persistent', category: 'buff', staminaToInnerPowerRatio: 2 },
  { id: 'scarlet-flame-burning', name: '燃燒', description: '每回合損失最大生命 20%。', duration: 'rounds', durationRounds: 3, maxHealthDamagePercent: 0.2 },
  { id: 'frost-water-cold-poison', name: '寒毒', description: '五維屬性降低 20%。', duration: 'rounds', durationRounds: 2, attributeMultiplier: 0.8 },
  { id: 'earth-mountain-reflection', name: '反震', description: '受到傷害時反彈同等傷害。', duration: 'rounds', durationRounds: 3, reflectionPercent: 1 },
  { id: 'hundred-poison-rot', name: '腐骨毒', description: '中毒：每回合損失最大生命 10%，且五維降低 15%。', duration: 'rounds', durationRounds: 3, category: 'debuff', maxHealthDamagePercent: 0.1, attributeMultiplier: 0.85 },
  { id: 'trap-immobilize', name: '定身', description: '被陷阱定身，本回合無法移動。', duration: 'rounds', durationRounds: 3, immobilized: true },
  { id: 'return-light', name: '回光', description: '瀕死時攔截死亡，復活至 30% 血並清除所有 debuff（只保一次）。', duration: 'persistent', reviveOnDeath: true, reviveHealthPercent: 0.3, clearDebuffsOnRevive: true },
  // 類別 5：移動類 — 指定地形消耗降為 1
  { id: 'plain-step', name: '草行', description: '進入草地時，移動消耗降為 1。', duration: 'rounds', durationRounds: 2, terrainCostOverrides: { plain: 1 } },
  { id: 'forest-step', name: '林行', description: '進入森林時，移動消耗降為 2。', duration: 'rounds', durationRounds: 2, terrainCostOverrides: { forest: 2 } },
  { id: 'water-step', name: '水行', description: '進入水域時，移動消耗降為 2。', duration: 'rounds', durationRounds: 2, terrainCostOverrides: { water: 2 } },
  { id: 'mountain-step', name: '山行', description: '進入山嶽時，移動消耗降為 2。', duration: 'rounds', durationRounds: 2, terrainCostOverrides: { mountain: 2 } },
  { id: 'desert-step', name: '沙行', description: '進入荒漠時，移動消耗降為 2。', duration: 'rounds', durationRounds: 2, terrainCostOverrides: { desert: 2 } },
  { id: 'wall-step', name: '破壁', description: '進入牆壁時，移動消耗降為 2。', duration: 'rounds', durationRounds: 2, terrainCostOverrides: { wall: 2 } },
  { id: 'road-step', name: '道行', description: '進入官道時，移動消耗降為 1。', duration: 'rounds', durationRounds: 2, terrainCostOverrides: { road: 1 } },
  // 類別 1：資源轉換
  { id: 'bloodthirst', name: '嗜血', description: '造成傷害時，回復 30% 傷害值的血量。', duration: 'rounds', durationRounds: 3, category: 'buff', lifestealPercent: 0.3 },
  { id: 'iron-wall-art', name: '鐵壁訣', description: '受到傷害時，最終傷害 -20%。', duration: 'rounds', durationRounds: 3, category: 'buff', damageReductionPercent: 0.2 },
  { id: 'spring-return-art', name: '回春訣', description: '每回合回復最大血量 10% 的氣血。', duration: 'rounds', durationRounds: 3, category: 'buff', healthRegenPercent: 0.1 },
  { id: 'qi-transformation-art', name: '化氣訣', description: '每回合回復「最大內力 ×10%」的氣血。', duration: 'rounds', durationRounds: 3, category: 'buff', innerPowerHealthRegenPercent: 0.1 },
  { id: 'inner-power-drain', name: '汲元', description: '造成傷害時，回復 20% 傷害值的內力。', duration: 'rounds', durationRounds: 3, category: 'buff', innerPowerLeechPercent: 0.2 },
  { id: 'break-army-art', name: '破軍訣', description: '普通攻擊造成的最終傷害 +20%。', duration: 'rounds', durationRounds: 3, category: 'buff', damageDealtPercent: 0.2 },
  { id: 'vigor-art', name: '罡氣訣', description: '外功造成的最終傷害 +20%。', duration: 'rounds', durationRounds: 3, category: 'buff', externalSkillDamagePercent: 0.2 },
  { id: 'phantom-step', name: '幻影步', description: '回避率 +5%。', duration: 'persistent', category: 'buff', evasionRateBonus: 5 },
  { id: 'home-turf-forest', name: '林隱狼性', description: '身處森林主場：回避率 +15%、造成傷害 +15%，森林移動消耗降為 2。', duration: 'persistent', category: 'buff', evasionRateBonus: 15, damageDealtPercent: 0.15, terrainCostOverrides: { forest: 2 } },
  { id: 'home-turf-mountain', name: '山嶽磐甲', description: '身處山嶽主場：受到傷害 -20%，山嶽移動消耗降為 2。', duration: 'persistent', category: 'buff', damageReductionPercent: 0.2, terrainCostOverrides: { mountain: 2 } },
  { id: 'home-turf-water', name: '狂瀾水息', description: '身處水域主場：造成傷害 +15%、內息 +2，水域移動消耗降為 2。', duration: 'persistent', category: 'buff', damageDealtPercent: 0.15, attributeModifiers: { innerEnergy: 2 }, terrainCostOverrides: { water: 2 } },
  { id: 'home-turf-desert', name: '沙暴凶煞', description: '身處荒漠主場：造成傷害 +15%，荒漠移動消耗降為 2。', duration: 'persistent', category: 'buff', damageDealtPercent: 0.15, terrainCostOverrides: { desert: 2 } },
  { id: 'home-turf-ruin', name: '金剛古陣', description: '身處山嶽主場：受到傷害 -25%、臂力與根骨 +2，山嶽移動消耗降為 2。', duration: 'persistent', category: 'buff', damageReductionPercent: 0.25, attributeModifiers: { armStrength: 2, constitution: 2 }, terrainCostOverrides: { mountain: 2 } },
  { id: 'terrain-resonance-swift-evasion', name: '林風迴避', description: '追風流在森林施放共鳴後，回避率 +5%，持續 2 回合。', duration: 'rounds', durationRounds: 2, category: 'buff', evasionRateBonus: 5 },
  { id: 'terrain-resonance-burning', name: '炎砂灼燒', description: '赤炎流在荒漠共鳴：每回合損失最大生命 25%，持續 3 回合。', duration: 'rounds', durationRounds: 3, category: 'debuff', maxHealthDamagePercent: 0.25 },
  { id: 'terrain-resonance-cold-poison', name: '寒潭玄毒', description: '寒水流在水域共鳴：五維降低 30%，持續 2 回合。', duration: 'rounds', durationRounds: 2, category: 'debuff', attributeMultiplier: 0.7 },
  { id: 'terrain-resonance-earth-reflection', name: '厚土反震', description: '厚土流在草地共鳴：反震傷害額外 +10%，持續 3 回合。', duration: 'rounds', durationRounds: 3, category: 'buff', reflectionPercent: 0.1 },
  // 類別 4：條件型
  { id: 'back-to-water', name: '背水', description: '血量低於 30% 時，五維 ×1.5。', duration: 'rounds', durationRounds: 3, category: 'buff', conditional: { when: 'health-below', threshold: 0.3, multiplier: 1.5 } },
  { id: 'nurture-qi', name: '養氣', description: '血量高於 80% 時，五維 ×1.2。', duration: 'rounds', durationRounds: 3, category: 'buff', conditional: { when: 'health-above', threshold: 0.8, multiplier: 1.2 } },
  { id: 'all-in', name: '孤注', description: '血量低於 15% 時，五維 ×2。', duration: 'rounds', durationRounds: 3, category: 'buff', conditional: { when: 'health-below', threshold: 0.15, multiplier: 2 } },
]