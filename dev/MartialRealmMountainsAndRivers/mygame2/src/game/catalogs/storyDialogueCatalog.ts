import type { DialogueTriggerCondition } from '../types'

/**
 * 劇情對話文本資料（ScenarioDialogueStep）。
 *
 * 以章節 ID 索引；遊戲端透過 dialogueTriggerRules.collectTriggeredDialogues
 * 依觸發條件比對並填入對話佇列。此處為「資料驅動」對話系統的資料層，
 * 未來可由編輯器 DialogueEditorModal 產出同等結構的 JSON 並注入。
 */
export type ScenarioDialogueStep = {
  id: string
  speakerName: string
  speakerIcon: string
  content: string
  triggerCondition: DialogueTriggerCondition
  triggerParam?: string
  /** 執行此對話後是否一併結束本章（用於 on-victory / on-failure 結算對話）。 */
  endsChapter?: boolean
  customMetadata?: Record<string, unknown>
}

/** 以章節 ID 索引的對話清單。 */
export const storyDialogueCatalog: Record<string, ScenarioDialogueStep[]> = {
  'prologue-village': [
    {
      id: 'prologue-start-1',
      speakerName: '村長 趙無極',
      speakerIcon: '👴',
      content: '少俠，青石村近來妖氣頻生，村外還出現了作祟的妖物。煩請你助我一臂之力。',
      triggerCondition: 'on-start',
    },
    {
      id: 'prologue-start-2',
      speakerName: '主角',
      speakerIcon: '🥋',
      content: '妖患不除，村中難安。我這便去打探一番。',
      triggerCondition: 'on-start',
    },
    {
      id: 'prologue-boss-victory-1',
      speakerName: '村長 趙無極',
      speakerIcon: '👴',
      content: '那妖物終於伏誅！青石村得救矣——少俠大恩，老夫此生不忘。',
      triggerCondition: 'on-victory',
      endsChapter: true,
    },
  ],
}