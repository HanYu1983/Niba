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
  /** 暴擊率加成（百分比，直接加在臂力決定的暴擊率上）。 */
  criticalRateBonus?: number
  terrainCostOverride?: number
  /** 逐地形消耗覆寫：指定地形直接回傳此值（優先於基礎消耗與乘算，可讓 wall 變可通行）。 */
  terrainCostOverrides?: Partial<Record<TerrainType, number>>
  maxHealthDamagePercent?: number
  reflectionPercent?: number
  attributeMultiplier?: number
  /** 定身：持有此 Buff 的怪物本回合跳過移動。 */
  immobilized?: boolean
  /** 震懾：三重共振觸發時施加，目標完全跳過下一個回合。 */
  stunned?: boolean
  /** 是否在地圖生物 icon 上顯示顏色標記（需搭配 CSS `.creature--buff-*` 樣式）。 */
  mapMarker?: boolean
  /** 地圖標記的 CSS class 後綴；未指定時由 `id` 推導。 */
  mapMarkerClass?: string
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
  /** 每回合回復「最大內力 × 比例」的內力。 */
  innerPowerRegenPercent?: number
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
  /** 最大生命值上限倍率（resource-limit 原語；預設 1，可 <1 或 >1）。 */
  maxHealthMultiplier?: number
  /** 最大體力上限倍率（resource-limit 原語；預設 1）。 */
  maxStaminaMultiplier?: number
  /** 最大內力上限倍率（resource-limit 原語；預設 1）。 */
  maxInnerPowerMultiplier?: number
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
    // 凌淵「山河歸藏」內功常駐 Buff：裝備期間提升悟性（呼應守護者持續領悟山河之道）。
    id: 'lingyuan-shelter-breath-buff',
    name: '山河歸藏',
    description: '裝備山河歸藏期間，吐納山河靈氣入體，悟性 +3。',
    duration: 'persistent',
    attributeModifiers: { insight: 3 },
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
  { id: 'golden-body-critical-boost', name: '暴擊強化', description: '暴擊率 +15%。', duration: 'persistent', category: 'buff', criticalRateBonus: 15, mapMarker: true, mapMarkerClass: 'golden-body-critical' },
  { id: 'swift-wind-movement', name: '疾行', description: '地形消耗一律視為草地。', duration: 'persistent', category: 'buff', terrainCostOverride: 2, mapMarker: true, mapMarkerClass: 'swift-wind' },
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
  { id: 'scarlet-flame-burning', name: '燃燒', description: '每回合損失最大生命 20%。', duration: 'rounds', durationRounds: 3, maxHealthDamagePercent: 0.2, mapMarker: true, mapMarkerClass: 'scarlet-flame' },
  { id: 'frost-water-cold-poison', name: '寒毒', description: '五維屬性降低 20%。', duration: 'rounds', durationRounds: 2, attributeMultiplier: 0.8, mapMarker: true, mapMarkerClass: 'frost-water-cold' },
  { id: 'earth-mountain-reflection', name: '反震', description: '受到傷害時反彈 25% 傷害。', duration: 'persistent', category: 'buff', reflectionPercent: 0.25, mapMarker: true, mapMarkerClass: 'earth-mountain' },
  { id: 'hundred-poison-rot', name: '腐骨毒', description: '中毒：每回合損失最大生命 10%，且五維降低 15%。', duration: 'rounds', durationRounds: 3, category: 'debuff', maxHealthDamagePercent: 0.1, attributeMultiplier: 0.85, mapMarker: true, mapMarkerClass: 'hundred-poison' },
  { id: 'trap-immobilize', name: '定身', description: '被陷阱定身，本回合無法移動。', duration: 'rounds', durationRounds: 3, immobilized: true },
  { id: 'triple-resonance-stun', name: '震懾', description: '三重共振衝擊，目標下一個回合完全無法行動。', duration: 'rounds', durationRounds: 1, stunned: true, mapMarker: true, mapMarkerClass: 'triple-resonance-stun' },
  { id: 'return-light', name: '回光', description: '瀕死時攔截死亡，復活至 30% 血並清除所有 debuff（只保一次）。', duration: 'persistent', reviveOnDeath: true, reviveHealthPercent: 0.3, clearDebuffsOnRevive: true },
  // 類別 5：移動類 — 指定地形消耗降為 1
  { id: 'plain-step', name: '草行', description: '進入草地時，移動消耗降為 1。', duration: 'persistent', category: 'buff', terrainCostOverrides: { plain: 1 } },
  { id: 'forest-step', name: '林行', description: '進入森林時，移動消耗降為 2。', duration: 'persistent', category: 'buff', terrainCostOverrides: { forest: 2 } },
  { id: 'water-step', name: '水行', description: '進入水域時，移動消耗降為 2。', duration: 'persistent', category: 'buff', terrainCostOverrides: { water: 2 } },
  { id: 'mountain-step', name: '山行', description: '進入山嶽時，移動消耗降為 2。', duration: 'persistent', category: 'buff', terrainCostOverrides: { mountain: 2 } },
  { id: 'desert-step', name: '沙行', description: '進入荒漠時，移動消耗降為 2。', duration: 'persistent', category: 'buff', terrainCostOverrides: { desert: 2 } },
  { id: 'wall-step', name: '破壁', description: '進入牆壁時，移動消耗降為 2。', duration: 'persistent', category: 'buff', terrainCostOverrides: { wall: 2 } },
  { id: 'road-step', name: '道行', description: '進入官道時，移動消耗降為 1。', duration: 'persistent', category: 'buff', terrainCostOverrides: { road: 1 } },
  // 類別 1：資源轉換
  { id: 'bloodthirst', name: '嗜血', description: '造成傷害時，回復 30% 傷害值的血量。', duration: 'rounds', durationRounds: 3, category: 'buff', lifestealPercent: 0.3 },
  { id: 'iron-wall-art', name: '鐵壁訣', description: '受到傷害時，最終傷害 -20%。', duration: 'rounds', durationRounds: 3, category: 'buff', damageReductionPercent: 0.2 },
  { id: 'spring-return-art', name: '回春訣', description: '每回合回復最大血量 10% 的氣血。', duration: 'rounds', durationRounds: 3, category: 'buff', healthRegenPercent: 0.1 },
  { id: 'qi-transformation-art', name: '化氣訣', description: '每回合回復「最大內力 ×10%」的氣血。', duration: 'rounds', durationRounds: 3, category: 'buff', innerPowerHealthRegenPercent: 0.1 },
  { id: 'inner-power-drain', name: '汲元', description: '造成傷害時，回復 10% 傷害值的內力。', duration: 'rounds', durationRounds: 3, category: 'buff', innerPowerLeechPercent: 0.1 },
  { id: 'break-army-art', name: '破軍訣', description: '普通攻擊造成的最終傷害 +20%。', duration: 'rounds', durationRounds: 3, category: 'buff', damageDealtPercent: 0.2 },
  { id: 'vigor-art', name: '罡氣訣', description: '外功造成的最終傷害 +20%。', duration: 'rounds', durationRounds: 3, category: 'buff', externalSkillDamagePercent: 0.2 },
  { id: 'phantom-step', name: '幻影步', description: '回避率 +5%。', duration: 'persistent', category: 'buff', evasionRateBonus: 5 },
  { id: 'home-turf-forest', name: '林隱狼性', description: '身處森林主場：回避率 +15%、造成傷害 +15%，森林移動消耗降為 2。', duration: 'persistent', category: 'buff', evasionRateBonus: 15, damageDealtPercent: 0.15, terrainCostOverrides: { forest: 2 } },
  { id: 'home-turf-mountain', name: '山嶽磐甲', description: '身處山嶽主場：受到傷害 -20%，山嶽移動消耗降為 2。', duration: 'persistent', category: 'buff', damageReductionPercent: 0.2, terrainCostOverrides: { mountain: 2 } },
  { id: 'home-turf-water', name: '狂瀾水息', description: '身處水域主場：造成傷害 +15%、內息 +2，水域移動消耗降為 2。', duration: 'persistent', category: 'buff', damageDealtPercent: 0.15, attributeModifiers: { innerEnergy: 2 }, terrainCostOverrides: { water: 2 } },
  { id: 'home-turf-desert', name: '沙暴凶煞', description: '身處荒漠主場：造成傷害 +15%，荒漠移動消耗降為 2。', duration: 'persistent', category: 'buff', damageDealtPercent: 0.15, terrainCostOverrides: { desert: 2 } },
  // 天地共鳴目標附加效果（林風迴避/炎砂灼燒/寒潭玄毒/厚土反震）：效果尚未設計周全，暫停使用。
  // { id: 'terrain-resonance-swift-evasion', name: '林風迴避', ... },
  // { id: 'terrain-resonance-burning', name: '炎砂灼燒', ... },
  // { id: 'terrain-resonance-cold-poison', name: '寒潭玄毒', ... },
  // { id: 'terrain-resonance-earth-reflection', name: '厚土反震', ... },
  // 類別 4：條件型
  { id: 'back-to-water', name: '背水', description: '血量低於 30% 時，五維 ×1.5。', duration: 'rounds', durationRounds: 3, category: 'buff', conditional: { when: 'health-below', threshold: 0.3, multiplier: 1.5 } },
  { id: 'nurture-qi', name: '養氣', description: '血量高於 80% 時，五維 ×1.2。', duration: 'rounds', durationRounds: 3, category: 'buff', conditional: { when: 'health-above', threshold: 0.8, multiplier: 1.2 } },
  { id: 'all-in', name: '孤注', description: '血量低於 15% 時，五維 ×2。', duration: 'rounds', durationRounds: 3, category: 'buff', conditional: { when: 'health-below', threshold: 0.15, multiplier: 2 } },
  // 銳鋒流（金）：快劍搶攻
  { id: 'sharp-edge-sword-heart', name: '劍心明鑑', description: '自身地圖視野半徑 +2。', duration: 'persistent', category: 'buff', visionRadiusBonus: 2 },
  { id: 'sharp-edge-keen-edge', name: '凌厲劍勢', description: '普通攻擊造成的最終傷害 +10%。', duration: 'persistent', category: 'buff', damageDealtPercent: 0.1 },
  // 煙雨流（水）：綿掌迴雪、養生回復
  { id: 'misty-rain-drizzle-nourish', name: '雨潤回春', description: '每回合回復最大內力 10% 的內力。', duration: 'persistent', category: 'buff', innerPowerRegenPercent: 0.1 },
  { id: 'misty-rain-rain-curtain', name: '雨幕遮身', description: '受到傷害時，最終傷害 -10%。', duration: 'persistent', category: 'buff', damageReductionPercent: 0.1 },
  // 烈陽流（火）：血性剛猛、越戰越勇
  { id: 'blazing-sun-fervor', name: '烈陽戰意', description: '臂力與根骨 +3。', duration: 'persistent', category: 'buff', attributeModifiers: { armStrength: 3, constitution: 3 } },
  { id: 'blazing-sun-blazing-gaze', name: '烈目凝芒', description: '暴擊率 ×1.25。', duration: 'persistent', category: 'buff', criticalRateMultiplier: 1.25 },
  // 黃土流（土）：持久游擊與工事
  { id: 'yellow-earth-rammed-earth', name: '夯土工事', description: '建築材料消耗 -15%。', duration: 'persistent', category: 'buff', buildingMaterialCostReduction: 0.15 },
  { id: 'yellow-earth-pack-march', name: '負重健行', description: '最大體力 +4。', duration: 'persistent', category: 'buff', maxStaminaBonus: 4 },
  // 幽影流（無）：隱匿暗襲
  { id: 'ghost-shadow-shadow-veil', name: '幽影蔽身', description: '回避率 +10%。', duration: 'persistent', category: 'buff', evasionRateBonus: 10 },
  { id: 'ghost-shadow-lone-resolve', name: '孤影決絕', description: '血量低於 25% 時，五維 ×1.6，持續 3 回合。', duration: 'rounds', durationRounds: 3, category: 'buff', conditional: { when: 'health-below', threshold: 0.25, multiplier: 1.6 } },
  // 天賦（passive-buff 原語）：由 talentCatalog 參照，開局隨角色注入為常駐 buff。
  { id: 'talent-cartographer-vision', name: '天賦·製圖', description: '製圖師：自身地圖視野半徑 +1。', duration: 'persistent', category: 'buff', visionRadiusBonus: 1 },
  { id: 'talent-scavenger-gather', name: '天賦·拾荒', description: '拾荒者：採集時 25% 機率雙倍產出。', duration: 'persistent', category: 'buff', gatherDoubleYieldChance: 0.25 },
  { id: 'talent-phantom-dodge', name: '天賦·幻影步', description: '幻影步：回避率 +6%、暴擊率 -3%。', duration: 'persistent', category: 'buff', evasionRateBonus: 6, criticalRateBonus: -3 },
  { id: 'talent-merchant-king', name: '天賦·商賈', description: '商賈巨擘：買入價格 -20%、賣出價格 +20%、普攻最終傷害 +10%。', duration: 'persistent', category: 'buff', shopBuyPriceDiscount: 0.2, shopSellPriceBonus: 0.2, damageDealtPercent: 0.1 },
  // 天賦（resource-limit 原語）：內息調度 — 內力上限 ×1.1、體力上限 ×0.9。以 buff multiplier 表達，統一走 getResourceLimit 管線。
  { id: 'talent-qi-master', name: '天賦·內息調度', description: '內息調度：內力上限 +10%、體力上限 -10%。', duration: 'persistent', category: 'buff', maxInnerPowerMultiplier: 1.1, maxStaminaMultiplier: 0.9 },
  // 凌淵專屬天賦 Buff（talent-vital-body / talent-deep-dantian / talent-sturdy-legs）
  // 因尚未定案暫時移除；定案後連同 talentCatalog 的對應天賦一併回歸。
]