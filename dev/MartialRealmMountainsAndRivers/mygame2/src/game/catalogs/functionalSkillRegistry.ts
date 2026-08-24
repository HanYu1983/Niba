/**
 * 功能型外功統一 registry。
 *
 * 將 `FunctionalExternalSkillEffect` 型別、玩家可讀描述與對應 Buff ID 集中於此，
 * 供功法目錄、江湖功法目錄與戰鬥施放邏輯共用，避免多處字串映射漂移。
 *
 * 依賴方向：本模組不依賴 `ExternalSkill`，避免與 `externalSkillCatalog` 產生循環引用。
 */

export type FunctionalExternalSkillEffect =
  | 'critical-rate'
  | 'terrain-adaptation'
  | 'basic-attack-stamina-reduction'
  | 'burning'
  | 'attribute-reduction'
  | 'reflection'
  | 'experience-gain'
  // 百毒流：淬毒（持續傷害＋屬性削弱）
  | 'poison'
  // 類別 1：資源轉換
  | 'lifesteal'
  | 'damage-reduction'
  | 'health-regen'
  | 'inner-power-health-regen'
  | 'inner-power-leech'
  | 'damage-dealt'
  | 'external-skill-damage'
  // 類別 4：條件型
  | 'back-to-water'
  | 'nurture-qi'
  | 'all-in'
  // 類別 5：移動類
  | 'plain-step'
  | 'forest-step'
  | 'water-step'
  | 'mountain-step'
  | 'desert-step'
  | 'wall-step'
  | 'road-step'
  // 悟性輔助功法
  | 'vision-expansion'
  | 'skill-cost-reduction'
  | 'merchant-way'
  | 'craftsmanship'
  | 'gathering'
  | 'divine-movement'
  | 'qi-conversion'
  // 江湖線：迴避與保命（掛載既有幻影步／回光 Buff）
  | 'evasion'
  | 'revive-guard'

/** 每個功能效果對應的 Buff 定義 ID 清單（一個效果可對應多個 Buff）。完整清單由外部測試驗證逐項對應。 */
export const functionalSkillBuffBindings: Record<FunctionalExternalSkillEffect, string[]> = {
  'critical-rate': ['golden-body-critical-boost'],
  'terrain-adaptation': ['swift-wind-movement'],
  'basic-attack-stamina-reduction': ['swift-wind-attack-focus'],
  burning: ['scarlet-flame-burning'],
  'attribute-reduction': ['frost-water-cold-poison'],
  reflection: ['earth-mountain-reflection'],
  'experience-gain': [],
  poison: ['hundred-poison-rot'],
  // 類別 1：資源轉換
  lifesteal: ['bloodthirst'],
  'damage-reduction': ['iron-wall-art'],
  'health-regen': ['spring-return-art'],
  'inner-power-health-regen': ['qi-transformation-art'],
  'inner-power-leech': ['inner-power-drain'],
  'damage-dealt': ['break-army-art'],
  'external-skill-damage': ['vigor-art'],
  // 類別 4：條件型
  'back-to-water': ['back-to-water'],
  'nurture-qi': ['nurture-qi'],
  'all-in': ['all-in'],
  // 類別 5：移動類
  'plain-step': ['plain-step'],
  'forest-step': ['forest-step'],
  'water-step': ['water-step'],
  'mountain-step': ['mountain-step'],
  'desert-step': ['desert-step'],
  'wall-step': ['wall-step'],
  "road-step": ['road-step'],
  // 悟性輔助功法
  'vision-expansion': ['sky-eye-vision'],
  'skill-cost-reduction': ['four-ounces-thousand-pounds'],
  'merchant-way': ['merchant-way'],
  'craftsmanship': ['heavenly-craftsman'],
  'gathering': ['spirit-herb-hundred-grass'],
  'divine-movement': ['divine-movement-eight-trigrams'],
  'qi-conversion': ['taixu-qi-conversion'],
  evasion: ['phantom-step'],
  'revive-guard': ['return-light'],
}

/** 取得某效果對應的 Buff 定義 ID 清單；無對應時回傳空陣列（例如 `experience-gain`）。 */
export function getFunctionalSkillBuffIds(effect: FunctionalExternalSkillEffect | undefined): string[] {
  if (!effect) return []
  return functionalSkillBuffBindings[effect] ?? []
}