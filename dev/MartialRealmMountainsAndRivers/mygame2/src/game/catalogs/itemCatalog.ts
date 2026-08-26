import type { SchoolElement } from './skillProgressionCatalog'

export type { SchoolElement } from './skillProgressionCatalog'

export type ItemEffectType =
  | 'health'
  | 'stamina'
  | 'inner-power'
  | 'buff'
  | 'attribute-up'
  | 'trap'
  | 'scout'
  | 'reveal-creatures'
  | 'recall-base'
  | 'element-burst'

export type ItemCategory =
  | 'resource-tradeoff'
  | 'special'
  | 'battlefield-control'
  | 'element-burst'
  | 'recovery'
  | 'attribute-up'

export type ItemDefinition = {
  id: string
  name: string
  description: string
  icon: string
  effectLabel: string
  effect: ItemEffectType
  /** 道具設計分類，供商店、掉落池與 UI 篩選使用。 */
  category?: ItemCategory
  effectValue?: number
  /** 使用後附加的臨時 Buff；僅 effect 為 buff 時使用。 */
  buffDefinitionId?: string
  /** 屬性提升類（attribute-up）提升的屬性。 */
  attribute?: keyof import('../types').PlayerAttributes
  /** 陷阱類（trap）的陷阱種類。 */
  trapType?: 'snare' | 'immobilize'
  /** 元素爆發類（element-burst）的元素。 */
  element?: SchoolElement
  /** 資源取捨型道具的立即代價；扣除當前值，不設下限。 */
  cost?: Partial<{
    health: number
    stamina: number
    innerPower: number
  }>
  /** 商店買入價格。 */
  buyPrice: number
  /** 需要商店達到此等級才會販售。 */
  requiredShopLevel: number
}

// 基礎 catalog 已清空舊道具；所有道具改由下方擴充陣列（extendedItemCatalog）提供。
export const itemCatalog: ItemDefinition[] = []

// ===== 一次性使用道具擴充（見 reports/item-depth-design.md） =====

// 分類 1：資源取捨型（怪物掉落，不賣）
export const resourceTradeoffItems: ItemDefinition[] = [
  { id: 'burn-blood-pill', name: '燃血丹', description: '燃燒氣血換取內力。', icon: '🩸', effectLabel: '內力 +20 / 生命 -15', effect: 'inner-power', effectValue: 20, cost: { health: 15 }, buyPrice: 0, requiredShopLevel: 0 },
  { id: 'devour-soul-talisman', name: '噬魂符', description: '吞噬魂魄換取體力。', icon: '👻', effectLabel: '體力 +20 / 生命 -15', effect: 'stamina', effectValue: 20, cost: { health: 15 }, buyPrice: 0, requiredShopLevel: 0 },
  { id: 'exchange-spirit-talisman', name: '換元符', description: '以體力換取生命。', icon: '🔄', effectLabel: '生命 +20 / 體力 -15', effect: 'health', effectValue: 20, cost: { stamina: 15 }, buyPrice: 0, requiredShopLevel: 0 },
  { id: 'split-vein-talisman', name: '裂脈符', description: '以體力換取內力。', icon: '⚡', effectLabel: '內力 +20 / 體力 -15', effect: 'inner-power', effectValue: 20, cost: { stamina: 15 }, buyPrice: 0, requiredShopLevel: 0 },
  { id: 'condense-yuan-pill', name: '凝元丹', description: '以內力換取氣血。', icon: '💠', effectLabel: '生命 +25 / 內力 -10', effect: 'health', effectValue: 25, cost: { innerPower: 10 }, buyPrice: 0, requiredShopLevel: 0 },
  { id: 'gather-qi-talisman', name: '聚氣符', description: '以內力換取體力。', icon: '🌬️', effectLabel: '體力 +20 / 內力 -10', effect: 'stamina', effectValue: 20, cost: { innerPower: 10 }, buyPrice: 0, requiredShopLevel: 0 },
]

// 特殊：回光玉（稀有度門檻）
export const specialItems: ItemDefinition[] = [
  { id: 'return-light-jade', name: '回光玉', description: '事前吃下掛載「回光」Buff，瀕死時復活至 30% 血並清除所有 debuff（只保一次）。', icon: '💎', effectLabel: '掛載回光 Buff', effect: 'buff', buffDefinitionId: 'return-light', buyPrice: 200, requiredShopLevel: 5 },
]

// 分類 2：戰場操控型
export const battlefieldControlItems: ItemDefinition[] = [
  { id: 'hobble-rope', name: '絆馬索', description: '當前格放置陷阱，怪物經過受傷。', icon: '🪢', effectLabel: '放置絆馬陷阱（傷害 15）', effect: 'trap', trapType: 'snare', effectValue: 15, buyPrice: 25, requiredShopLevel: 1 },
  { id: 'immobilize-rope', name: '定身索', description: '當前格放置陷阱，怪物踩中定身 3 回合。', icon: '⛓️', effectLabel: '放置定身陷阱', effect: 'trap', trapType: 'immobilize', buyPrice: 40, requiredShopLevel: 2 },
  { id: 'scout-talisman', name: '探地符', description: '立即揭示周圍半徑 6 格地形。', icon: '🔍', effectLabel: '揭示半徑 6 格', effect: 'scout', effectValue: 6, buyPrice: 20, requiredShopLevel: 1 },
  { id: 'warn-gong-talisman', name: '鳴鑼符', description: '揭示全圖怪物位置，下回合恢復迷霧。', icon: '🥁', effectLabel: '揭示全圖怪物', effect: 'reveal-creatures', buyPrice: 35, requiredShopLevel: 2 },
  { id: 'recall-base-talisman', name: '回營符', description: '撤退到最近據點，不耗體力（類似驛站傳送）。', icon: '🏠', effectLabel: '撤退到最近據點', effect: 'recall-base', buyPrice: 45, requiredShopLevel: 2 },
]

// 分類 3：元素爆發型（6 元素 × 4 階）
export const elementBurstItems: ItemDefinition[] = [
  // 火
  { id: 'fire-thunder-talisman', name: '火雷符', description: '火屬性爆發傷害。', icon: '🔥', effectLabel: '火屬性傷害 15', effect: 'element-burst', element: 'fire', effectValue: 15, buyPrice: 20, requiredShopLevel: 1 },
  { id: 'blaze-talisman', name: '烈焰符', description: '火屬性爆發傷害。', icon: '🔥', effectLabel: '火屬性傷害 30', effect: 'element-burst', element: 'fire', effectValue: 30, buyPrice: 40, requiredShopLevel: 2 },
  { id: 'inferno-talisman', name: '炎獄符', description: '火屬性爆發傷害。', icon: '🔥', effectLabel: '火屬性傷害 50', effect: 'element-burst', element: 'fire', effectValue: 50, buyPrice: 70, requiredShopLevel: 3 },
  { id: 'sky-burning-fire-talisman', name: '焚天火符', description: '火屬性爆發傷害。', icon: '🔥', effectLabel: '火屬性傷害 75', effect: 'element-burst', element: 'fire', effectValue: 75, buyPrice: 110, requiredShopLevel: 4 },
  // 水
  { id: 'cold-ice-needle', name: '寒冰針', description: '水屬性爆發傷害。', icon: '❄️', effectLabel: '水屬性傷害 15', effect: 'element-burst', element: 'water', effectValue: 15, buyPrice: 20, requiredShopLevel: 1 },
  { id: 'mystic-ice-needle', name: '玄冰針', description: '水屬性爆發傷害。', icon: '❄️', effectLabel: '水屬性傷害 30', effect: 'element-burst', element: 'water', effectValue: 30, buyPrice: 40, requiredShopLevel: 2 },
  { id: 'ice-soul-needle', name: '冰魄針', description: '水屬性爆發傷害。', icon: '❄️', effectLabel: '水屬性傷害 50', effect: 'element-burst', element: 'water', effectValue: 50, buyPrice: 70, requiredShopLevel: 3 },
  { id: 'frost-doom-needle', name: '玄霜滅世針', description: '水屬性爆發傷害。', icon: '❄️', effectLabel: '水屬性傷害 75', effect: 'element-burst', element: 'water', effectValue: 75, buyPrice: 110, requiredShopLevel: 4 },
  // 土
  { id: 'falling-rock-talisman', name: '落石符', description: '土屬性爆發傷害。', icon: '🪨', effectLabel: '土屬性傷害 15', effect: 'element-burst', element: 'earth', effectValue: 15, buyPrice: 20, requiredShopLevel: 1 },
  { id: 'mountain-collapse-talisman', name: '崩山符', description: '土屬性爆發傷害。', icon: '🪨', effectLabel: '土屬性傷害 30', effect: 'element-burst', element: 'earth', effectValue: 30, buyPrice: 40, requiredShopLevel: 2 },
  { id: 'earth-split-talisman', name: '裂地符', description: '土屬性爆發傷害。', icon: '🪨', effectLabel: '土屬性傷害 50', effect: 'element-burst', element: 'earth', effectValue: 50, buyPrice: 70, requiredShopLevel: 3 },
  { id: 'suppress-mountain-talisman', name: '鎮嶽符', description: '土屬性爆發傷害。', icon: '🪨', effectLabel: '土屬性傷害 75', effect: 'element-burst', element: 'earth', effectValue: 75, buyPrice: 110, requiredShopLevel: 4 },
  // 金
  { id: 'gold-glint-talisman', name: '金芒符', description: '金屬性爆發傷害。', icon: '⚜️', effectLabel: '金屬性傷害 15', effect: 'element-burst', element: 'metal', effectValue: 15, buyPrice: 20, requiredShopLevel: 1 },
  { id: 'sharp-metal-talisman', name: '銳金符', description: '金屬性爆發傷害。', icon: '⚜️', effectLabel: '金屬性傷害 30', effect: 'element-burst', element: 'metal', effectValue: 30, buyPrice: 40, requiredShopLevel: 2 },
  { id: 'armor-break-talisman', name: '破甲符', description: '金屬性爆發傷害。', icon: '⚜️', effectLabel: '金屬性傷害 50', effect: 'element-burst', element: 'metal', effectValue: 50, buyPrice: 70, requiredShopLevel: 3 },
  { id: 'taibai-break-army-talisman', name: '太白破軍符', description: '金屬性爆發傷害。', icon: '⚜️', effectLabel: '金屬性傷害 75', effect: 'element-burst', element: 'metal', effectValue: 75, buyPrice: 110, requiredShopLevel: 4 },
  // 木
  { id: 'green-wood-talisman', name: '青木符', description: '木屬性爆發傷害。', icon: '🌿', effectLabel: '木屬性傷害 15', effect: 'element-burst', element: 'wood', effectValue: 15, buyPrice: 20, requiredShopLevel: 1 },
  { id: 'bind-wood-talisman', name: '纏木符', description: '木屬性爆發傷害。', icon: '🌿', effectLabel: '木屬性傷害 30', effect: 'element-burst', element: 'wood', effectValue: 30, buyPrice: 40, requiredShopLevel: 2 },
  { id: 'forest-luo-talisman', name: '森羅符', description: '木屬性爆發傷害。', icon: '🌿', effectLabel: '木屬性傷害 50', effect: 'element-burst', element: 'wood', effectValue: 50, buyPrice: 70, requiredShopLevel: 3 },
  { id: 'azure-emperor-wood-talisman', name: '青帝木皇符', description: '木屬性爆發傷害。', icon: '🌿', effectLabel: '木屬性傷害 75', effect: 'element-burst', element: 'wood', effectValue: 75, buyPrice: 110, requiredShopLevel: 4 },
  // 無
  { id: 'thunder-fire-bomb', name: '雷火彈', description: '火器爆破傷害，不受相剋。', icon: '💣', effectLabel: '爆破傷害 15', effect: 'element-burst', element: 'none', effectValue: 15, buyPrice: 20, requiredShopLevel: 1 },
  { id: 'thunderclap-bomb', name: '霹靂彈', description: '火器爆破傷害，不受相剋。', icon: '💣', effectLabel: '爆破傷害 30', effect: 'element-burst', element: 'none', effectValue: 30, buyPrice: 40, requiredShopLevel: 2 },
  { id: 'sky-shaking-thunder', name: '震天雷', description: '火器爆破傷害，不受相剋。', icon: '💣', effectLabel: '爆破傷害 50', effect: 'element-burst', element: 'none', effectValue: 50, buyPrice: 70, requiredShopLevel: 3 },
  { id: 'nine-sky-thunder-bomb', name: '九天雷劫彈', description: '火器爆破傷害，不受相剋。', icon: '💣', effectLabel: '爆破傷害 75', effect: 'element-burst', element: 'none', effectValue: 75, buyPrice: 110, requiredShopLevel: 4 },
]

// 分類 4：恢復型（3 資源 × 4 階）
export const recoveryItems: ItemDefinition[] = [
  // 氣血
  { id: 'heal-wound-medicine', name: '療傷藥', description: '恢復生命值。', icon: '🧪', effectLabel: '生命值 +20', effect: 'health', effectValue: 20, buyPrice: 20, requiredShopLevel: 1 },
  { id: 'great-return-pill', name: '大還丹', description: '大幅恢復生命值。', icon: '🧴', effectLabel: '生命值 +50', effect: 'health', effectValue: 50, buyPrice: 40, requiredShopLevel: 2 },
  { id: 'return-heaven-pill', name: '回天丹', description: '恢復大量生命值。', icon: '💊', effectLabel: '生命值 +80', effect: 'health', effectValue: 80, buyPrice: 70, requiredShopLevel: 3 },
  { id: 'nine-turn-return-heaven-pill', name: '九轉回天丹', description: '恢復巨量生命值。', icon: '✨', effectLabel: '生命值 +120', effect: 'health', effectValue: 120, buyPrice: 110, requiredShopLevel: 4 },
  // 內力
  { id: 'gather-qi-pill', name: '聚氣丹', description: '恢復內力。', icon: '🔮', effectLabel: '內力 +15', effect: 'inner-power', effectValue: 15, buyPrice: 20, requiredShopLevel: 1 },
  { id: 'gather-yuan-pill', name: '聚元丹', description: '大幅恢復內力。', icon: '🔵', effectLabel: '內力 +35', effect: 'inner-power', effectValue: 35, buyPrice: 40, requiredShopLevel: 2 },
  { id: 'true-yuan-pill', name: '真元丹', description: '恢復大量內力。', icon: '🟣', effectLabel: '內力 +60', effect: 'inner-power', effectValue: 60, buyPrice: 70, requiredShopLevel: 3 },
  { id: 'taixu-condense-yuan-pill', name: '太虛凝元丹', description: '恢復巨量內力。', icon: '🌌', effectLabel: '內力 +100', effect: 'inner-power', effectValue: 100, buyPrice: 110, requiredShopLevel: 4 },
  // 體力
  { id: 'recover-qi-pill', name: '回氣丹', description: '恢復體力。', icon: '🫙', effectLabel: '體力 +6', effect: 'stamina', effectValue: 6, buyPrice: 15, requiredShopLevel: 1 },
  { id: 'true-qi-return-yuan-pill', name: '真氣回元丹', description: '大幅恢復體力。', icon: '🍶', effectLabel: '體力 +14', effect: 'stamina', effectValue: 14, buyPrice: 40, requiredShopLevel: 2 },
  { id: 'qi-sea-pill', name: '氣海丹', description: '恢復大量體力。', icon: '🌊', effectLabel: '體力 +25', effect: 'stamina', effectValue: 25, buyPrice: 70, requiredShopLevel: 3 },
  { id: 'hunyuan-qi-pill', name: '混元氣丹', description: '恢復巨量體力。', icon: '🌟', effectLabel: '體力 +40', effect: 'stamina', effectValue: 40, buyPrice: 110, requiredShopLevel: 4 },
]

// 屬性提升類（一次性永久 +1）
export const attributeUpItems: ItemDefinition[] = [
  { id: 'great-strength-pill', name: '大力丸', description: '永久提升臂力 +1。', icon: '💪', effectLabel: '臂力 +1（永久）', effect: 'attribute-up', attribute: 'armStrength', effectValue: 1, buyPrice: 70, requiredShopLevel: 1 },
  { id: 'light-body-pill', name: '輕身丸', description: '永久提升身法 +1。', icon: '🌪️', effectLabel: '身法 +1（永久）', effect: 'attribute-up', attribute: 'agility', effectValue: 1, buyPrice: 70, requiredShopLevel: 1 },
  { id: 'extend-life-pill', name: '續命丹', description: '永久提升根骨 +1。', icon: '❤️‍🔥', effectLabel: '根骨 +1（永久）', effect: 'attribute-up', attribute: 'constitution', effectValue: 1, buyPrice: 70, requiredShopLevel: 1 },
  { id: 'clear-mind-pill', name: '明心丹', description: '永久提升悟性 +1。', icon: '🌟', effectLabel: '悟性 +1（永久）', effect: 'attribute-up', attribute: 'insight', effectValue: 1, buyPrice: 70, requiredShopLevel: 1 },
  { id: 'calm-spirit-pill', name: '凝神丹', description: '永久提升內息 +1。', icon: '🟣', effectLabel: '內息 +1（永久）', effect: 'attribute-up', attribute: 'innerEnergy', effectValue: 1, buyPrice: 70, requiredShopLevel: 1 },
]

export const extendedItemCatalog: ItemDefinition[] = [
  ...resourceTradeoffItems.map((item) => ({ ...item, category: 'resource-tradeoff' as const })),
  ...specialItems.map((item) => ({ ...item, category: 'special' as const })),
  ...battlefieldControlItems.map((item) => ({ ...item, category: 'battlefield-control' as const })),
  ...elementBurstItems.map((item) => ({ ...item, category: 'element-burst' as const })),
  ...recoveryItems.map((item) => ({ ...item, category: 'recovery' as const })),
  ...attributeUpItems.map((item) => ({ ...item, category: 'attribute-up' as const })),
]

// 將擴充道具合併進主 catalog
itemCatalog.push(...extendedItemCatalog)
