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
]