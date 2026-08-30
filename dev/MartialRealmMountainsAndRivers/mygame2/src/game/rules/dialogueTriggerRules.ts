import type { GameState, DialogueTriggerCondition } from '../types'
import { storyDialogueCatalog, type ScenarioDialogueStep } from '../catalogs/storyDialogueCatalog'
import { getTriggeredDialogueIds } from './dialogueRules'

/** 一個觸發事件：由遊戲動作（掛鉤點）產出，供比對對話觸發條件。 */
export type DialogueTrigger = {
  type: DialogueTriggerCondition
  /** 依觸發條件而異：objectiveId / "row,column" / creatureId / round / 無。 */
  param?: string
  /** 目前章節 ID（corresponds to campaignState.currentChapter）。 */
  chapterId?: string
}

/**
 * 比對單一對話步驟的觸發條件是否與其相符。
 *
 * 對照規則：
 * - triggerCondition 與 event.type 完全相符（開放式字串／自訂條件皆適用）。
 * - 若對話有指定 triggerParam，需與 event.param 相符（無 event.param 則不符）。
 * - 若對話未指定 triggerParam，則只要 type 相符即觸發。
 */
function matchesTrigger(step: ScenarioDialogueStep, trigger: DialogueTrigger): boolean {
  if (step.triggerCondition !== trigger.type) return false
  if (step.triggerParam !== undefined && step.triggerParam !== trigger.param) return false
  return true
}

/**
 * 收集指定章節中、符合觸發事件且尚未觸發過的對話步驟。
 * 依 Catalog 中的原始順序回傳。
 *
 * 對話來源優先順序：
 * 1. campaignState.dialogues（由 scenarioCompiler 從 ScenarioDefinition 注入，資料驅動）
 * 2. storyDialogueCatalog（硬編碼的官方對話，作為 fallback）
 */
export function collectTriggeredDialogues(state: GameState, trigger: DialogueTrigger): ScenarioDialogueStep[] {
  const chapterId = trigger.chapterId ?? state.campaignState?.chapterKey ?? String(state.campaignState?.currentChapter ?? 0)
  const injected = state.campaignState?.dialogues
  const catalog: ScenarioDialogueStep[] = injected && injected.length > 0
    ? injected
    : (storyDialogueCatalog[chapterId] ?? [])
  const triggeredIds = new Set(getTriggeredDialogueIds(state))
  return catalog.filter((step) => matchesTrigger(step, trigger) && !triggeredIds.has(step.id))
}