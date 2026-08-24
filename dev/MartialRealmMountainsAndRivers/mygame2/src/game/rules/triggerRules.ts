import type { GameState } from '../types'
import type { ScenarioTrigger } from '../../editor/editorTypes'
import type { ScenarioDialogueStep } from '../catalogs/storyDialogueCatalog'
import { enqueueDialogue } from '../actions/dialogueActions'

/**
 * 事件觸發器執行器。
 *
 * 以「時機（condition）→ 行為（action）→ 參數（actionParam）」統一管理觸發。
 * 在各遊戲動作掛鉤點呼叫 executeTriggers，掃描符合條件的觸發器並執行對應行為。
 */

/** 一個觸發事件：由遊戲動作（掛鉤點）產出，供比對觸發器條件。 */
export type TriggerEvent = {
  type: string
  /** 依觸發條件而異：objectiveId / "row,column" / creatureId / round / 無。 */
  param?: string
}

/**
 * 依觸發事件執行所有符合條件的觸發器。
 * 回傳更新後的 GameState。
 */
export function executeTriggers(state: GameState, event: TriggerEvent): GameState {
  const triggers = state.campaignState?.triggers ?? []
  return triggers.reduce((currentState, trigger) => {
    if (!matchesTrigger(trigger, event)) return currentState
    return executeAction(currentState, trigger)
  }, state)
}

/** 比對單一觸發器的條件是否與事件相符。 */
function matchesTrigger(trigger: ScenarioTrigger, event: TriggerEvent): boolean {
  if (trigger.condition !== event.type) return false
  if (trigger.conditionParam !== undefined && trigger.conditionParam !== event.param) return false
  return true
}

/** 執行單一觸發器的行為。 */
function executeAction(state: GameState, trigger: ScenarioTrigger): GameState {
  if (trigger.action === 'start-dialogue') {
    const group = state.campaignState?.dialogueGroups?.[trigger.actionParam]
    if (group && group.steps.length > 0) {
      // 對話組步驟為純腳本（不含觸發條件），轉為 ScenarioDialogueStep 後入佇列。
      const steps = group.steps.map((step) => ({
        id: step.id,
        speakerName: step.speakerName,
        speakerIcon: step.speakerIcon,
        content: step.content,
        triggerCondition: trigger.condition as ScenarioDialogueStep['triggerCondition'],
      }))
      return enqueueDialogue(state, steps)
    }
  }
  if (trigger.action === 'spawn-creature') {
    // 避免重複生成：若場上已有同 id 怪物則跳過。
    if (state.creatures.some((creature) => creature.id === trigger.actionParam)) return state
    const creature = state.scenarioCreatures?.find((c) => c.id === trigger.actionParam)
    if (creature) {
      return { ...state, creatures: [...state.creatures, creature] }
    }
  }
  return state
}
