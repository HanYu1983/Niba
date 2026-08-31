import type { GameState } from '../types'
import type { ScenarioTrigger } from '../contracts/scenario'
import type { ScenarioDialogueStep } from '../catalogs/storyDialogueCatalog'
import { enqueueDialogue } from './dialogueRules'

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

/** 比對單一觸發器的條件是否與事件相符。 */
function matchesTrigger(trigger: ScenarioTrigger, event: TriggerEvent, state: GameState): boolean {
  // on-events-resolved：conditionParam 為逗號分隔的事件 id 清單，
  // 清單內「全部」事件皆已解決時觸發（與 event.type / param 無關，由狀態判定）。
  if (trigger.condition === 'on-events-resolved') {
    const requiredIds = (trigger.conditionParam ?? '')
      .split(',')
      .map((id) => id.trim())
      .filter(Boolean)
    if (requiredIds.length === 0) return false
    const resolved = new Set(state.campaignState?.resolvedEventIds ?? [])
    return requiredIds.every((id) => resolved.has(id))
  }
  if (trigger.condition !== event.type) return false
  if (trigger.conditionParam !== undefined && trigger.conditionParam !== event.param) return false
  return true
}

/**
 * 依觸發事件執行所有符合條件的觸發器。
 * 回傳更新後的 GameState。
 *
 * 狀態型條件（如 on-events-resolved）在每次相關動作後都會被檢查，
 * 因此以 `campaignState.triggeredTriggerIds` 記錄已執行的觸發器 id，確保只執行一次。
 */
export function executeTriggers(state: GameState, event: TriggerEvent): GameState {
  const triggers = state.campaignState?.triggers ?? []
  const executed = new Set(state.campaignState?.triggeredTriggerIds ?? [])
  return triggers.reduce((currentState, trigger) => {
    // 已執行過的觸發器不再重複執行（防止狀態型條件重複觸發）。
    if (executed.has(trigger.id)) return currentState
    if (!matchesTrigger(trigger, event, currentState)) return currentState
    const nextState = executeAction(currentState, trigger)
    executed.add(trigger.id)
    return {
      ...nextState,
      campaignState: nextState.campaignState
        ? { ...nextState.campaignState, triggeredTriggerIds: [...executed] }
        : nextState.campaignState,
    }
  }, state)
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
