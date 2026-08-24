import { createAuraExternalSkill } from './skillFactory'
import type { ExternalSkill } from './externalSkillCatalog'

/**
 * 悟性導向輔助功法（靈氣型外功）目錄。
 *
 * 這批功法為非戰鬥輔助型：不造成傷害、消耗 0 內力，以「常駐靈氣 Buff」形式
 * 提供大地圖視野、外功省氣等運轉增益，呼應高悟性的「隱士／勘輿／經營」流派。
 * 全部歸類為 `category: 'aura'`、`target: 'self'`，開啓即常駐、關閉即移除。
 *
 * 等級掛鉤：依 `functionalEffect` → `getFunctionalSkillBuffOverrides` 隨功法等級成長。
 */

export const insightUtilityExternalSkills: ExternalSkill[] = [
  // 天眼望氣：地圖視野半徑 +ceil(Lv/3)
  createAuraExternalSkill({
    id: 'insight-sky-eye-vision',
    name: '天眼望氣',
    description: '高德勘丈之術，觀氣明眸。開啟後擴大自身地圖視野。',
    formulaDescription: '自身地圖視野半徑 +1（每 3 級再 +1）。',
    insightCost: 3,
    requiredHallLevel: 3,
    level: 1,
    functionalEffect: 'vision-expansion',
  }),
  // 四兩撥千斤：所有外功內力消耗 -1
  createAuraExternalSkill({
    id: 'insight-four-ounces-thousand-pounds',
    name: '四兩千斤',
    description: '以悟性卸力化勁，省內力而施外功。',
    formulaDescription: '所有外功內力消耗 -1（最低 1，每級再 -1）。',
    insightCost: 4,
    requiredHallLevel: 3,
    level: 1,
    functionalEffect: 'skill-cost-reduction',
  }),
  // 商道通鑑：買入降價、賣出加價
  createAuraExternalSkill({
    id: 'insight-merchant-way',
    name: '商道通鑑',
    description: '通曉商賈之道，低買高賣。開啟後商店交易價差更有利。',
    formulaDescription: '買入價格 -15%，賣出價格 +15%（每級各 +3%）。',
    insightCost: 2,
    requiredHallLevel: 3,
    level: 1,
    functionalEffect: 'merchant-way',
  }),
  // 天工開物：建築材料減免、建造聲望加成
  createAuraExternalSkill({
    id: 'insight-heavenly-craftsman',
    name: '天工開物',
    description: '悟通營造之術，以巧奪天工。開啟後建築建造更節料、聲望更豐。',
    formulaDescription: '建築材料消耗 -25%，建造聲望 +50%（每級各 +5% / +10%）。',
    insightCost: 3,
    requiredHallLevel: 3,
    level: 1,
    functionalEffect: 'craftsmanship',
  }),
  // 靈植百草鑑：採集省體力、雙倍產出
  createAuraExternalSkill({
    id: 'insight-spirit-herb-hundred-grass',
    name: '靈植百草鑑',
    description: '熟知草木靈機，採集事半功倍。開啟後採集更省力、偶有雙倍收穫。',
    formulaDescription: '採集體力消耗 -1，採集雙倍產出機率 50%（每 2 級再 -1，每級 +5%）。',
    insightCost: 3,
    requiredHallLevel: 3,
    level: 1,
    functionalEffect: 'gathering',
  }),
  // 神行八卦步：最大體力加成
  createAuraExternalSkill({
    id: 'insight-divine-movement-eight-trigrams',
    name: '神行八卦步',
    description: '暗合八卦方位，奔走不息。開啟後大幅提升最大體力。',
    formulaDescription: '最大體力 +2（每級再 +1）。',
    insightCost: 2,
    requiredHallLevel: 3,
    level: 1,
    functionalEffect: 'divine-movement',
  }),
  // 太虛引氣：剩餘體力轉化內力
  createAuraExternalSkill({
    id: 'insight-taixu-qi-conversion',
    name: '太虛引氣',
    description: '以體化氣，涵養內力。開啟後於回合結束時將剩餘體力轉化為內力。',
    formulaDescription: '回合結束時剩餘體力轉化為內力（1 體力 → 2 內力，每級再 +1）。',
    insightCost: 3,
    requiredHallLevel: 3,
    level: 1,
    functionalEffect: 'qi-conversion',
  }),
]