/**
 * 官方角色目錄（Official Character Catalog）。
 *
 * 每個篇章對應一位「守護者」官方角色，預建於名冊中，僅供沙盒模式遊玩與培養。
 * 劇本模式不綁定名冊（劇本內的「凌淵」是 `ScenarioDefinition` 定義的故事角色，
 * 與本目錄的官方角色僅名稱相同，資料零耦合）。
 *
 * 設計參考：`reports/system/official-character-chapter-design-v2.md`。
 */

import type { PlayerAttributes } from '../types'
import type { SchoolElement } from './skillProgressionCatalog'

/** 官方角色隨篇章進度解鎖的內容（可學習功法 / 可解鎖天賦）。 */
export type StoryUnlock = {
  /** 觸發解鎖的劇本 id（對應 campaignScenarioCatalog）。 */
  scenarioId: string
  /** 通關後加入名冊官方角色的 unlockedSkillIds。 */
  skillIds?: string[]
  /** 通關後加入名冊官方角色的 unlockedTalentIds。 */
  talentIds?: string[]
}

export type OfficialCharacterDefinition = {
  /** 對應名冊角色 id（固定 id，建立後不可變動）。 */
  characterId: string
  /** 綁定篇章（scenario id）。 */
  chapterId: string
  name: string
  title: string
  portrait: string
  /** 沙盒首次開局等級錨點（後續跨局累積，詳見 V2 §11.2）。 */
  initialLevel: number
  /** 沙盒首次開局五維加成（疊加在 createCharacterState 預設之上）。 */
  initialAttributes: Partial<PlayerAttributes>
  /** 守護者一脈所屬五行（凌淵採 'none' 表「無所偏、守護五行」）。 */
  element: SchoolElement
  /** 專屬內功 id（建立時即「已學」）。 */
  exclusiveInnerSkillId: string
  /** 專屬外功三件套 id（建立時即「已學」）。 */
  exclusiveExternalSkillIds: string[]
  /** 隨篇章進度解鎖的內容（劇本通關時併入 unlockedSkillIds / unlockedTalentIds）。 */
  storyUnlocks: StoryUnlock[]
}

/**
 * 凌淵：第一章「青石遺恨」守護者。
 *
 * 故事定位：守護者一脈傳人，五章的主角。師父犧牲封印妖王後，將主角託付青石村。
 * 五行立場採 'none'，象徵「無所偏私、守護五行平衡」。
 *
 * 戰鬥風格：攻守兼備——以「山河歸藏」蓄養氣血、「山河脈動」擴大輸出，
 * 兼具治療續戰（回春）與爆發收割（破軍）兩端，
 * 呼應五章中「守護家園 → 走遍山河 → 最終決戰」的成長弧線。
 */
export const lingyuan: OfficialCharacterDefinition = {
  characterId: 'official-lingyuan',
  chapterId: 'prologue-village',
  name: '凌淵',
  title: '山河守護者',
  portrait: '⚔️',
  initialLevel: 1,
  // 凌淵的「初始五維加成」：在 createCharacterState 預設（8/8/8/8/8）之上疊加，
  // 略偏均衡——臂力與根骨稍高（承擔守護責任的體魄），悟性稍高（領悟守護者傳承）。
  initialAttributes: {
    armStrength: 2,
    constitution: 2,
    agility: 0,
    innerEnergy: 1,
    insight: 2,
  },
  element: 'none',
  exclusiveInnerSkillId: 'lingyuan-shelter-breath',
  exclusiveExternalSkillIds: [
    'lingyuan-mountain-pulse',   // 傷害型：山河脈動
    'lingyuan-rivers-sustain',    // 靈氣型：江河長養
    'lingyuan-five-elements-mend', // 強化型：五行歸元
  ],
  storyUnlocks: [
    // 序章通關不解鎖額外內容（專屬功法已隨建立直接學會）。
    // 預留未來章節擴充；此處先不放任何項目，
    // 待後續章節定義完成後再加入對應解鎖。
  ],
}

/** 所有官方角色定義。 */
export const officialCharacterCatalog: OfficialCharacterDefinition[] = [lingyuan]

/** 依 chapterId 查詢官方角色定義。 */
export function getOfficialCharacterByChapter(chapterId: string): OfficialCharacterDefinition | undefined {
  return officialCharacterCatalog.find((character) => character.chapterId === chapterId)
}

/** 依 characterId 查詢官方角色定義。 */
export function getOfficialCharacterById(characterId: string): OfficialCharacterDefinition | undefined {
  return officialCharacterCatalog.find((character) => character.characterId === characterId)
}
