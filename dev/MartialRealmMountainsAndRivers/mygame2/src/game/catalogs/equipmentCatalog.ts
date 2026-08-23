import type { PlayerAttributes } from "../types"
import type { MartialSchoolId } from './martialSchoolCatalog'

export type EquipmentSlot = 'weapon' | 'armor' | 'accessory'
export type EquipmentCategory = EquipmentSlot

export type EquipmentDefinition = {
  id: string
  name: string
  description: string
  icon: string
  slot: EquipmentSlot
  /** 裝備分類；目前與裝備欄位一致，保留獨立欄位供掉落池與 UI 篩選。 */
  category?: EquipmentCategory
  modifiers: Partial<PlayerAttributes>
  maxDurability: number
  /** 商店買入價格。 */
  buyPrice: number
  /** 需要商店達到此等級才會販售。 */
  requiredShopLevel: number
  /** 門派專屬裝備；只有對應門派據點會販售。 */
  schoolId?: MartialSchoolId
  /** 門派據點達到此等級後解鎖。 */
  sectGateLevel?: 1 | 2 | 3
}

const baseEquipmentCatalog: EquipmentDefinition[] = [
  // ── 武器（weapon）──
  {
    id: 'iron-sword',
    name: '精鐵劍',
    description: '沉重而可靠的兵器，提升臂力。',
    icon: '🗡️',
    slot: 'weapon',
    maxDurability: 20,
    modifiers: { armStrength: 2 },
    buyPrice: 30,
    requiredShopLevel: 1,
  },
  {
    id: 'bronze-blade',
    name: '青銅刀',
    description: '樸實耐用的刀，均衡提升臂力與根骨。',
    icon: '🔪',
    slot: 'weapon',
    maxDurability: 24,
    modifiers: { armStrength: 1, constitution: 1 },
    buyPrice: 30,
    requiredShopLevel: 1,
  },
  {
    id: 'bamboo-staff',
    name: '青竹杖',
    description: '輕巧的竹杖，適合身法靈動的武者。',
    icon: '🥢',
    slot: 'weapon',
    maxDurability: 16,
    modifiers: { agility: 2 },
    buyPrice: 30,
    requiredShopLevel: 1,
  },
  {
    id: 'spirit-wand',
    name: '聚靈杖',
    description: '凝聚靈氣的短杖，提升內息與悟性。',
    icon: '🪄',
    slot: 'weapon',
    maxDurability: 14,
    modifiers: { innerEnergy: 2, insight: 2 },
    buyPrice: 60,
    requiredShopLevel: 2,
  },
  // ── 防具（armor）──
  {
    id: 'traveling-robe',
    name: '行者護衣',
    description: '輕便護衣，提升身法與根骨。',
    icon: '🥋',
    slot: 'armor',
    maxDurability: 20,
    modifiers: { agility: 1, constitution: 1 },
    buyPrice: 30,
    requiredShopLevel: 1,
  },
  {
    id: 'leather-armor',
    name: '皮甲',
    description: '堅韌的皮革護甲，著重根骨防護。',
    icon: '🦺',
    slot: 'armor',
    maxDurability: 26,
    modifiers: { constitution: 2 },
    buyPrice: 30,
    requiredShopLevel: 1,
  },
  {
    id: 'cloth-robe',
    name: '布衣',
    description: '輕柔的布衣，提升內息流轉。',
    icon: '👘',
    slot: 'armor',
    maxDurability: 16,
    modifiers: { innerEnergy: 2, insight: 2 },
    buyPrice: 60,
    requiredShopLevel: 2,
  },
  // ── 配件（accessory）──
  {
    id: 'jade-pendant',
    name: '溫玉佩',
    description: '溫養經脈，提升內息與悟性。',
    icon: '📿',
    slot: 'accessory',
    maxDurability: 20,
    modifiers: { innerEnergy: 1, insight: 1 },
    buyPrice: 30,
    requiredShopLevel: 1,
  },
  {
    id: 'iron-ring',
    name: '鐵指環',
    description: '樸實的鐵環，強化臂力。',
    icon: '💍',
    slot: 'accessory',
    maxDurability: 24,
    modifiers: { armStrength: 2 },
    buyPrice: 30,
    requiredShopLevel: 1,
  },
  {
    id: 'swift-boots',
    name: '疾風靴',
    description: '輕快的靴子，提升身法。',
    icon: '👢',
    slot: 'accessory',
    maxDurability: 18,
    modifiers: { agility: 2 },
    buyPrice: 30,
    requiredShopLevel: 1,
  },
  {
    id: 'insight-talisman',
    name: '悟道符',
    description: '記載玄奧符文的符紙，提升悟性。',
    icon: '🧧',
    slot: 'accessory',
    maxDurability: 14,
    modifiers: { insight: 4 },
    buyPrice: 60,
    requiredShopLevel: 2,
  },
  // ── Lv.3 ──
  {
    id: 'fine-steel-sword',
    name: '精鋼劍',
    description: '以精鋼鍛造的利劍，臂力與根骨兼備。',
    icon: '⚔️',
    slot: 'weapon',
    maxDurability: 28,
    modifiers: { armStrength: 4, constitution: 2 },
    buyPrice: 90,
    requiredShopLevel: 3,
  },
  {
    id: 'chain-mail',
    name: '鎖子甲',
    description: '環環相扣的鐵甲，大幅提升根骨防護。',
    icon: '🛡️',
    slot: 'armor',
    maxDurability: 30,
    modifiers: { constitution: 6 },
    buyPrice: 90,
    requiredShopLevel: 3,
  },
  {
    id: 'spirit-bracelet',
    name: '靈犀手鐲',
    description: '蘊含靈氣的手鐲，提升內息與悟性。',
    icon: '📿',
    slot: 'accessory',
    maxDurability: 24,
    modifiers: { innerEnergy: 3, insight: 3 },
    buyPrice: 90,
    requiredShopLevel: 3,
  },
  // ── Lv.4 ──
  {
    id: 'frost-blade',
    name: '寒霜刀',
    description: '刀身凝霜，臂力與身法並重。',
    icon: '❄️',
    slot: 'weapon',
    maxDurability: 32,
    modifiers: { armStrength: 5, agility: 3 },
    buyPrice: 120,
    requiredShopLevel: 4,
  },
  {
    id: 'dragon-scale-armor',
    name: '龍鱗甲',
    description: '以龍鱗編織的寶甲，根骨與內息兼顧。',
    icon: '🐉',
    slot: 'armor',
    maxDurability: 34,
    modifiers: { constitution: 5, innerEnergy: 3 },
    buyPrice: 120,
    requiredShopLevel: 4,
  },
  {
    id: 'moon-pendant',
    name: '明月佩',
    description: '映照月華的玉佩，提升內息與悟性。',
    icon: '🌙',
    slot: 'accessory',
    maxDurability: 28,
    modifiers: { innerEnergy: 4, insight: 4 },
    buyPrice: 120,
    requiredShopLevel: 4,
  },
  // ── Lv.5 ──
  {
    id: 'thunder-spear',
    name: '雷霆槍',
    description: '槍尖雷光閃爍，臂力與身法大幅提升。',
    icon: '⚡',
    slot: 'weapon',
    maxDurability: 36,
    modifiers: { armStrength: 6, agility: 4 },
    buyPrice: 150,
    requiredShopLevel: 5,
  },
  {
    id: 'celestial-robe',
    name: '天罡袍',
    description: '繡有天罡星紋的法袍，內息與悟性並進。',
    icon: '👘',
    slot: 'armor',
    maxDurability: 32,
    modifiers: { innerEnergy: 5, insight: 5 },
    buyPrice: 150,
    requiredShopLevel: 5,
  },
  {
    id: 'phoenix-ring',
    name: '鳳凰戒',
    description: '浴火鳳凰之戒，全面提升根骨與內息。',
    icon: '🔥',
    slot: 'accessory',
    maxDurability: 30,
    modifiers: { constitution: 5, innerEnergy: 5 },
    buyPrice: 150,
    requiredShopLevel: 5,
  },
  // ── Lv.6 ──
  {
    id: 'divine-sword',
    name: '神兵天劍',
    description: '傳說中的神兵，臂力與悟性臻至化境。',
    icon: '🌟',
    slot: 'weapon',
    maxDurability: 40,
    modifiers: { armStrength: 8, insight: 4 },
    buyPrice: 180,
    requiredShopLevel: 6,
  },
  {
    id: 'immortal-armor',
    name: '不滅戰甲',
    description: '刀槍不入的戰甲，根骨與身法登峰造極。',
    icon: '🏆',
    slot: 'armor',
    maxDurability: 42,
    modifiers: { constitution: 8, agility: 4 },
    buyPrice: 180,
    requiredShopLevel: 6,
  },
  {
    id: 'soul-jade',
    name: '鎮魂玉',
    description: '鎮守魂魄的寶玉，內息與悟性圓滿。',
    icon: '💎',
    slot: 'accessory',
    maxDurability: 36,
    modifiers: { innerEnergy: 6, insight: 6 },
    buyPrice: 180,
    requiredShopLevel: 6,
  },
]

/** 各門派專屬裝備；每個門派各一武器、防具、配件，解鎖順序刻意不同。 */
const sectEquipmentCatalog: EquipmentDefinition[] = [
  ['golden-body', '金剛震岳拳套', 'weapon', '🥊', 1, 90, { armStrength: 2, constitution: 1 }],
  ['golden-body', '不動金身甲', 'armor', '🛡️', 2, 150, { constitution: 4 }],
  ['golden-body', '金剛護脈佩', 'accessory', '📿', 3, 210, { constitution: 3, armStrength: 1 }],
  ['swift-wind', '追風流雲衣', 'armor', '🥋', 1, 90, { agility: 2, insight: 1 }],
  ['swift-wind', '踏雲玉佩', 'accessory', '📿', 2, 150, { agility: 3 }],
  ['swift-wind', '九天追風刃', 'weapon', '⚔️', 3, 210, { agility: 4, armStrength: 1 }],
  ['scarlet-flame', '赤炎焚心佩', 'accessory', '🔥', 1, 90, { innerEnergy: 2, armStrength: 1 }],
  ['scarlet-flame', '燎原炎甲', 'armor', '🧥', 2, 150, { innerEnergy: 3, constitution: 1 }],
  ['scarlet-flame', '九陽離火掌套', 'weapon', '🔥', 3, 210, { armStrength: 4, innerEnergy: 2 }],
  ['frost-water', '寒水凝霜袍', 'armor', '❄️', 1, 90, { constitution: 2, innerEnergy: 1 }],
  ['frost-water', '萬川歸海佩', 'accessory', '💧', 2, 150, { innerEnergy: 3, constitution: 1 }],
  ['frost-water', '玄冰寒刃', 'weapon', '🗡️', 3, 210, { innerEnergy: 4, agility: 1 }],
  ['earth-mountain', '厚土鎮岳靴', 'accessory', '🥾', 1, 90, { constitution: 2, agility: 1 }],
  ['earth-mountain', '山河護甲', 'armor', '🛡️', 2, 150, { constitution: 4, innerEnergy: 1 }],
  ['earth-mountain', '裂地重拳', 'weapon', '👊', 3, 210, { armStrength: 4, constitution: 2 }],
  ['void-spirit', '太虛觀想冠', 'accessory', '🎐', 1, 90, { insight: 3 }],
  ['void-spirit', '空明無相衣', 'armor', '👘', 2, 150, { insight: 2, innerEnergy: 2 }],
  ['void-spirit', '萬象歸虛劍', 'weapon', '🗡️', 3, 210, { armStrength: 2, agility: 2, insight: 1 }],
  ['hundred-poison', '百毒蠱囊', 'accessory', '🧪', 1, 90, { agility: 2, armStrength: 1 }],
  ['hundred-poison', '毒蟒軟甲', 'armor', '🧥', 2, 150, { agility: 3, constitution: 1 }],
  ['hundred-poison', '蝕骨毒爪', 'weapon', '🗡️', 3, 210, { armStrength: 4, agility: 2 }],
  ['ghost-shadow', '幽影面紗', 'accessory', '🎭', 1, 90, { agility: 2, insight: 1 }],
  ['ghost-shadow', '夜行勁裝', 'armor', '🥋', 2, 150, { agility: 3, innerEnergy: 1 }],
  ['ghost-shadow', '索命影刃', 'weapon', '🗡️', 3, 210, { agility: 4, insight: 2 }],
].map(([schoolId, name, slot, icon, sectGateLevel, _buyPrice, modifiers]) => ({
  id: `sect-${schoolId}-${slot}`,
  name: name as string,
  description: `${name as string}，蘊含該門派的武學真意。`,
  icon: icon as string,
  slot: slot as EquipmentSlot,
  schoolId: schoolId as MartialSchoolId,
  sectGateLevel: sectGateLevel as 1 | 2 | 3,
  // 門派裝備仍遵守既有階級規則：每級提供兩點屬性，價格為每級 30 金。
  modifiers: {
    ...(modifiers as Partial<PlayerAttributes>),
    armStrength: ((modifiers as Partial<PlayerAttributes>).armStrength ?? 0) +
      (Number(sectGateLevel) * 2 - Object.values(modifiers as Partial<PlayerAttributes>).reduce((sum, value) => sum + (value ?? 0), 0)),
  },
  maxDurability: 24,
  buyPrice: Number(sectGateLevel) * 30,
  requiredShopLevel: Number(sectGateLevel),
}))

/** 統一補上裝備分類，避免每筆裝備資料重複填寫與 slot 不一致。 */
export const equipmentCatalog: EquipmentDefinition[] = [...baseEquipmentCatalog, ...sectEquipmentCatalog].map((equipment) => ({
  ...equipment,
  category: equipment.slot,
}))