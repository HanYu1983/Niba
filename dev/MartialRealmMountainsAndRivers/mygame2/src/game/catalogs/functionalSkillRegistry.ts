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
  | 'burning'
  | 'attribute-reduction'
  | 'reflection'
  | 'experience-gain'
  // 百毒流：淬毒（持續傷害＋屬性削弱）
  | 'poison'
  // 幽影流：影匿（迴避強化）
  | 'evasion'
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

/** 功能型外功的玩家可讀效果說明，避免目錄只顯示「技能型外功」。 */
export const functionalExternalSkillDescriptions: Record<FunctionalExternalSkillEffect, string> = {
  'critical-rate': '自身暴擊率 ×2，持續 2 回合。',
  'terrain-adaptation': '自身接下來 2 回合移動時，所有地形體力消耗視為 2。',
  burning: '使目標燃燒 3 回合，每回合損失最大生命 20%。',
  'attribute-reduction': '使目標 2 回合內五項基本屬性降低 20%。',
  reflection: '自身 3 回合內受到傷害時，反彈同等傷害。',
  'experience-gain': '自身與目前裝備的功法額外獲得 10 點功法經驗。',
  poison: '使目標中毒 3 回合，每回合損失最大生命 10%，且五維屬性降低 15%。',
  evasion: '自身 3 回合內回避率 +15%。',
  // 類別 1：資源轉換
  lifesteal: '自身 3 回合內造成傷害時，回復 30% 傷害值的血量。',
  'damage-reduction': '自身 3 回合內受到傷害時，最終傷害 -20%。',
  'health-regen': '自身 3 回合內每回合回復最大血量 10% 的氣血。',
  'inner-power-health-regen': '自身 3 回合內每回合回復「最大內力 ×10%」的氣血。',
  'inner-power-leech': '自身 3 回合內造成傷害時，回復 20% 傷害值的內力。',
  'damage-dealt': '自身 3 回合內普通攻擊造成的最終傷害 +20%。',
  'external-skill-damage': '自身 3 回合內外功造成的最終傷害 +20%。',
  // 類別 4：條件型
  'back-to-water': '自身 3 回合內血量低於 30% 時，五維 ×1.5。',
  'nurture-qi': '自身 3 回合內血量高於 80% 時，五維 ×1.2。',
  'all-in': '自身 3 回合內血量低於 15% 時，五維 ×2。',
  // 類別 5：移動類
  'plain-step': '自身 2 回合內進入草地時，移動消耗降為 1。獲得「幻影步」效果，增加5%回避率。',
  'forest-step': '自身 2 回合內進入森林時，移動消耗降為 2。獲得「幻影步」效果，增加5%回避率。',
  'water-step': '自身 2 回合內進入水域時，移動消耗降為 2。獲得「幻影步」效果，增加5%回避率。',
  'mountain-step': '自身 2 回合內進入山嶽時，移動消耗降為 2。獲得「幻影步」效果，增加5%回避率。',
  'desert-step': '自身 2 回合內進入荒漠時，移動消耗降為 2。獲得「幻影步」效果，增加5%回避率。',
  'wall-step': '自身 2 回合內進入牆壁時，移動消耗降為 2。獲得「幻影步」效果，增加5%回避率。',
  'road-step': '自身 2 回合內進入官道時，移動消耗降為 1。獲得「幻影步」效果，增加5%回避率。',
}

/** 每個功能效果對應的 Buff 定義 ID 清單（一個效果可對應多個 Buff）。完整清單由外部測試驗證逐項對應。 */
export const functionalSkillBuffBindings: Record<FunctionalExternalSkillEffect, string[]> = {
  'critical-rate': ['golden-body-critical-boost'],
  'terrain-adaptation': ['swift-wind-movement'],
  burning: ['scarlet-flame-burning'],
  'attribute-reduction': ['frost-water-cold-poison'],
  reflection: ['earth-mountain-reflection'],
  'experience-gain': [],
  poison: ['hundred-poison-rot'],
  evasion: ['ghost-shadow-veil'],
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
  'plain-step': ['plain-step','phantom-step'],
  'forest-step': ['forest-step', 'phantom-step'],
  'water-step': ['water-step', 'phantom-step'],
  'mountain-step': ['mountain-step', 'phantom-step'],
  'desert-step': ['desert-step', 'phantom-step'],
  'wall-step': ['wall-step', 'phantom-step'],
  'road-step': ['road-step', 'phantom-step'],
}

/** 取得某效果對應的 Buff 定義 ID 清單；無對應時回傳空陣列（例如 `experience-gain`）。 */
export function getFunctionalSkillBuffIds(effect: FunctionalExternalSkillEffect | undefined): string[] {
  if (!effect) return []
  return functionalSkillBuffBindings[effect] ?? []
}