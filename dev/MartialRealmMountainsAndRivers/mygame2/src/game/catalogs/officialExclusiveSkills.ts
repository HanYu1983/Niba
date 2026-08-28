/**
 * 官方角色專屬功法（Official Exclusive Skills）。
 *
 * 凌淵的四件套專屬功法——設計時需注意：
 * - `exclusiveCharacterId: 'official-lingyuan'` 標記獨佔（凌淵唯一可學）。
 * - `lootExcluded: true` 排除怪物/巢穴掉落池。
 * - 透過 `allExternalSkillCatalog` 聚合提供給功法設定頁、戰鬥查詢。
 * - 不加入 `progressionExternalSkills`（武館/門派）與 `jianghuExternalSkills`（掉落/巢穴）。
 *
 * 設計參考：`reports/system/official-character-chapter-design-v2.md`。
 */

import type { PlayerAttributes } from '../types'
import {
  createAuraExternalSkill,
  createDamageExternalSkill,
  createEnhancementExternalSkill,
  createInnerSkill,
} from './skillFactory'

/* ================================================================== */
/* 1. 內功：山河歸藏                                                  */
/* ================================================================== */

/**
 * 凌淵的傳承內功——守護者一脈的基礎心法。
 *
 * 主題：均衡五項基本屬性，無所偏私，呼應「守護五行」的故事定位。
 * 元素：'none'（不主場、不參與五行相剋——守護者超然於五行的對立之外）。
 * 機制：普攻傷害公式均衡——臂力為主、內息為輔，呼應「以體魄承擔守護責任」。
 *
 * 常駐 Buff（`tuna-gong-focus` 風格）：裝備期間提升悟性，
 * 象徵守護者透過修煉持續領悟山河之道。
 */
export const lingyuanShelterBreath = createInnerSkill({
  id: 'lingyuan-shelter-breath',
  name: '山河歸藏',
  description: '守護者一脈的基礎心法：吐納間山河靈氣入體，五臟六腑與天地共鳴，無所偏私地涵養五行。',
  formulaDescription: '臂力 × 0.5 + 根骨 × 0.2 + 內息 × 0.3（最低 1）',
  insightRequirement: 5,
  requiredHallLevel: 1,
  element: 'none',
  buffIds: ['lingyuan-shelter-breath-buff'],
  calculateDamage: (attributes: PlayerAttributes) =>
    Math.max(
      1,
      Math.floor(attributes.armStrength * 0.5 + attributes.constitution * 0.2 + attributes.innerEnergy * 0.3),
    ),
})
lingyuanShelterBreath.exclusiveCharacterId = 'official-lingyuan'
lingyuanShelterBreath.lootExcluded = true

/* ================================================================== */
/* 2. 傷害型外功：山河脈動                                              */
/* ================================================================== */

/**
 * 凌淵的範圍傷害外功——以守護者一脈的內力共鳴，震動周圍山河靈氣。
 *
 * 主題：呼應第三章（淨化被污染的水源）、第五章決戰的範圍清場。
 * 元素：'none'（不參與五行相剋——對所有敵人同樣有效，象徵守護者對「一切威脅家園之物」皆震之以威）。
 * 形狀：半徑 1 / all（周圍 8 格）。
 *
 * 機制：傷害公式以內息為主（內力震動山河），
 * 呼應「守護者並非蠻力武者，而是以修煉凝聚的內力驅動守護之力」。
 */
export const lingyuanMountainPulse = createDamageExternalSkill({
  id: 'lingyuan-mountain-pulse',
  name: '山河脈動',
  description: '以守護者一脈的內力共鳴，震動周圍山河靈氣，對周圍 1 格內所有敵人造成傷害。',
  formulaDescription: '內息 × 0.6 + 悟性 × 0.4（最低 1）',
  insightCost: 4,
  requiredHallLevel: 2,
  element: 'none',
  innerPowerCost: 8,
  shape: { kind: 'radius', range: 1 },
  selectionMode: { kind: 'all' },
  // 凌淵的範圍傷害：以內息為主、悟性為輔，呼應「以修為驅動守護之力」。
  calculateDamage: (attributes: PlayerAttributes) =>
    Math.max(1, Math.floor(attributes.innerEnergy * 0.6 + attributes.insight * 0.4)),
})
lingyuanMountainPulse.exclusiveCharacterId = 'official-lingyuan'
lingyuanMountainPulse.lootExcluded = true

/* ================================================================== */
/* 3. 靈氣型外功：江河長養                                              */
/* ================================================================== */

/**
 * 凌淵的常駐治療外功——以守護者一脈的修為，呼喚江河靈氣滋養自身。
 *
 * 主題：呼應第三章（淨化水源）與四章旅程中的持久戰——守護者必須長時間維持自身戰力。
 * 元素：'water'（與「江河」呼應——靈氣型掛載水屬性可在水域主場發揮，
 * 但不參與戰鬥的五行相剋）。
 * 機制：每回合回復最大血量 10%（與既有「回春訣」相同，但描述更貼合守護者）。
 *
 * 設計選擇：凌淵沒有裝備既有「回春訣」，這是他的守護者專屬版本，
 * 透過 `lootExcluded` + `exclusiveCharacterId` 雙重鎖定。
 */
export const lingyuanRiversSustain = createAuraExternalSkill({
  id: 'lingyuan-rivers-sustain',
  name: '江河長養',
  description: '呼喚江河靈氣滋養自身：每回合回復最大血量 10% 的氣血。',
  formulaDescription: '每回合回復最大血量 10%（常駐）',
  insightCost: 2,
  requiredHallLevel: 3,
  element: 'water',
  passiveBuffIds: ['spring-return-art'],
})
lingyuanRiversSustain.exclusiveCharacterId = 'official-lingyuan'
lingyuanRiversSustain.lootExcluded = true

/* ================================================================== */
/* 4. 強化型外功：五行歸元                                              */
/* ================================================================== */

/**
 * 凌淵的主動治療外功——守護者一脈的核心防禦技。
 *
 * 主題：呼應「修復五行失衡」的核心命題——當妖氣侵蝕導致五行紊亂，
 * 守護者以自身修為重整五行秩序，將紊亂化為平衡。
 * 機制：主動施放，立即回復最大血量 30%（當前實作只支援 `heal-self-percent`，
 * 對應「修復」主題；`cleanse-self` 清除 debuff 為後續實作項目）。
 *
 * 註：未來擴充可加入 `cleanse-self` 並組合多個 `activationEffect`
 * （例如 `{ kind: 'heal-self-percent', percent: 0.3 }` +
 * `{ kind: 'cleanse-self' }` 串列），以完整實現「重整五行」的敘事。
 */
export const lingyuanFiveElementsMend = createEnhancementExternalSkill({
  id: 'lingyuan-five-elements-mend',
  name: '五行歸元',
  description: '以守護者一脈的修為重整五行秩序，瞬間回復自身最大血量 30%。',
  formulaDescription: '主動施放：回復最大血量 30%',
  insightCost: 3,
  requiredHallLevel: 2,
  element: 'none',
  innerPowerCost: 5,
  activationEffect: { kind: 'heal-self-percent', percent: 0.3 },
})
lingyuanFiveElementsMend.exclusiveCharacterId = 'official-lingyuan'
lingyuanFiveElementsMend.lootExcluded = true

/* ================================================================== */
/* 匯出：四件套                                                       */
/* ================================================================== */

export const lingyuanExclusiveInnerSkills = [lingyuanShelterBreath]
export const lingyuanExclusiveExternalSkills = [
  lingyuanMountainPulse,
  lingyuanRiversSustain,
  lingyuanFiveElementsMend,
]
