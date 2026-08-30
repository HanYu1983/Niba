import type { GameState, DialogueQueueEntry } from '../types'
import type { ScenarioDialogueStep } from '../catalogs/storyDialogueCatalog'

/** 取得目前對話佇列；未設定 campaignState 時回傳空佇列（不寫回）。 */
export function getDialogueQueue(state: GameState): DialogueQueueEntry[] {
  return state.campaignState?.dialogueQueue ?? []
}

/** 取得已觸發的對話 stepId 集合；未設定時回傳空集合。 */
export function getTriggeredDialogueIds(state: GameState): string[] {
  return state.campaignState?.triggeredDialogueIds ?? []
}

/** 將對話步驟轉為佇列項並推入 campaignState.dialogueQueue。 */
export function enqueueDialogue(state: GameState, steps: ScenarioDialogueStep[]): GameState {
  if (steps.length === 0 || !state.campaignState) return state
  const entries: DialogueQueueEntry[] = steps.map((step) => ({
    stepId: step.id,
    speakerName: step.speakerName,
    speakerIcon: step.speakerIcon,
    content: step.content,
    triggerCondition: step.triggerCondition,
    triggerParam: step.triggerParam,
    consumed: false,
  }))
  return {
    ...state,
    campaignState: {
      ...state.campaignState,
      dialogueQueue: [...state.campaignState.dialogueQueue, ...entries],
    },
  }
}

/** 取出對話佇列首項並移除之。 */
export function dequeueDialogue(state: GameState): { state: GameState; entry: DialogueQueueEntry | null } {
  const queue = getDialogueQueue(state)
  if (queue.length === 0 || !state.campaignState) return { state, entry: null }
  const [entry, ...rest] = queue
  return {
    state: { ...state, campaignState: { ...state.campaignState, dialogueQueue: rest } },
    entry,
  }
}

/** 將指定 stepId 標記為已觸發。 */
export function markDialogueTriggered(state: GameState, stepId: string): GameState {
  if (!state.campaignState) return state
  const triggered = getTriggeredDialogueIds(state)
  if (triggered.includes(stepId)) return state
  return { ...state, campaignState: { ...state.campaignState, triggeredDialogueIds: [...triggered, stepId] } }
}

/** 一次標記多個 stepId 為已觸發。 */
export function markDialoguesTriggered(state: GameState, stepIds: string[]): GameState {
  if (stepIds.length === 0 || !state.campaignState) return state
  return {
    ...state,
    campaignState: {
      ...state.campaignState,
      triggeredDialogueIds: [...new Set([...getTriggeredDialogueIds(state), ...stepIds])],
    },
  }
}

/** 清空對話佇列，並將佇列中所有 stepId 標記為已觸發。 */
export function skipAllDialogue(state: GameState): GameState {
  if (!state.campaignState) return state
  const stepIds = getDialogueQueue(state).map((entry) => entry.stepId)
  return {
    ...state,
    campaignState: {
      ...state.campaignState,
      triggeredDialogueIds: [...new Set([...getTriggeredDialogueIds(state), ...stepIds])],
      dialogueQueue: [],
    },
  }
}

/** 判斷對話佇列是否為空。 */
export function isDialogueQueueEmpty(state: GameState): boolean {
  return getDialogueQueue(state).length === 0
}
