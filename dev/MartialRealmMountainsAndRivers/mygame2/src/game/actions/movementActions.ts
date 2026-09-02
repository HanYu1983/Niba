import type { ActionOutcome, GameState } from '../types'
import { updatePlayerVisibility } from '../rules/visibilityRules'
import { applyBaseHealthBonuses } from '../rules/baseRules'
import { getMovementTarget } from '../rules/targetRules'
import { getActionablePlayer } from '../rules/actionCostRules'
import { progressObjectives, checkVictory } from '../rules/campaignRules'
import { collectTriggeredDialogues, type DialogueTrigger } from '../rules/dialogueTriggerRules'
import { enqueueDialogue } from './dialogueActions'
import { executeTriggers } from '../rules/triggerRules'

/** 檢查玩家進入/離開區域觸發器。 */
function checkAreaTriggers(
  state: GameState,
  prevRow: number,
  prevCol: number,
  newRow: number,
  newCol: number,
): GameState {
  const areas = state.campaignState?.scenarioAreas ?? []
  if (areas.length === 0) return state

  let currentState = state
  // 收集預期會被觸發的一次性區域 id，觸發後將其從地圖移除。
  const consumedAreaIds = new Set<string>()

  // 檢查離開區域
  for (const area of areas) {
    const wasInArea = area.positions.some((pos) => pos.row === prevRow && pos.column === prevCol)
    const isInArea = area.positions.some((pos) => pos.row === newRow && pos.column === newCol)
    if (wasInArea && !isInArea) {
      // 觸發 on-exit-area
      currentState = enqueueTriggeredDialogues(currentState, { type: 'on-exit-area', param: area.id })
      currentState = executeTriggers(currentState, { type: 'on-exit-area', param: area.id })
      // 若此區域為一次性，且存在對應的 on-exit-area 觸發器，則消費該區域。
      const hasExitTrigger = (currentState.campaignState?.triggers ?? []).some(
        (trigger) => trigger.condition === 'on-exit-area' && trigger.conditionParam === area.id,
      )
      if (area.destroyWhenTriggered && hasExitTrigger) {
        consumedAreaIds.add(area.id)
      }
    }
  }

  // 檢查進入區域
  for (const area of areas) {
    const wasInArea = area.positions.some((pos) => pos.row === prevRow && pos.column === prevCol)
    const isInArea = area.positions.some((pos) => pos.row === newRow && pos.column === newCol)
    if (!wasInArea && isInArea) {
      // 觸發 on-enter-area
      currentState = enqueueTriggeredDialogues(currentState, { type: 'on-enter-area', param: area.id })
      currentState = executeTriggers(currentState, { type: 'on-enter-area', param: area.id })
      // 若此區域為一次性，且存在對應的 on-enter-area 觸發器，則消費該區域。
      const hasEntryTrigger = (currentState.campaignState?.triggers ?? []).some(
        (trigger) => trigger.condition === 'on-enter-area' && trigger.conditionParam === area.id,
      )
      if (area.destroyWhenTriggered && hasEntryTrigger) {
        consumedAreaIds.add(area.id)
      }
    }
  }

  if (consumedAreaIds.size > 0) {
    currentState = {
      ...currentState,
      campaignState: currentState.campaignState
        ? {
          ...currentState.campaignState,
          scenarioAreas: (currentState.campaignState.scenarioAreas ?? []).filter(
            (area) => !consumedAreaIds.has(area.id),
          ),
        }
        : currentState.campaignState,
    }
  }

  return currentState
}

export function movePlayer(
  state: GameState,
  playerId: string,
  row: number,
  column: number,
): { state: GameState; result: ActionOutcome } {
  const player = getActionablePlayer(state, playerId)
  if (!player) return { state, result: { ok: false, reason: '找不到可行動的玩家。' } }
  const target = getMovementTarget(state, player, playerId, row, column)
  if (!target) return { state, result: { ok: false, reason: '無法移動至目標位置。' } }

  const prevRow = player.position.row
  const prevCol = player.position.column

  const nextState = {
    ...state,
    players: state.players.map((p) => p.id === playerId
      ? {
        ...p,
        position: { row, column },
        stamina: p.stamina - target.staminaCost,
      }
      : p),
  }

  const stateWithHealthBonus = applyBaseHealthBonuses(nextState)
  // 玩家設定為不觸發互動（canTriggerInteraction === false）時，跳過互動／劇情觸發判定。
  // 這樣 AI 或非主控玩家移動時不會推進探索、道具、區域與勝利目標。
  if (player.canTriggerInteraction === false) {
    return {
      state: { ...stateWithHealthBonus, visibility: updatePlayerVisibility(stateWithHealthBonus, playerId) },
      result: { ok: true },
    }
  }
  // 移動完成後推進 reach-position 目標並檢查勝利。
  const withObjectives = progressObjectives(stateWithHealthBonus, { type: 'reach-position', row, column })
  // 移動完成後檢查 on-enter-region 對話與觸發器（玩家進入指定座標時觸發，舊版相容）。
  const withDialogue = enqueueTriggeredDialogues(withObjectives, { type: 'on-enter-region', param: `${row},${column}` })
  const withTriggers = executeTriggers(withDialogue, { type: 'on-enter-region', param: `${row},${column}` })
  // 檢查編輯器定義的區域觸發器（on-enter-area / on-exit-area）。
  const withAreaTriggers = checkAreaTriggers(withTriggers, prevRow, prevCol, row, column)
  return {
    state: { ...checkVictory(withAreaTriggers), visibility: updatePlayerVisibility(withAreaTriggers, playerId) },
    result: { ok: true },
  }
}

/**
 * 收集並推入符合觸發事件的對話步驟（若處於劇情模式）。
 * 沙盒模式（無 campaignState）下 collectTriggeredDialogues 會回傳空清單，不污染狀態。
 */
function enqueueTriggeredDialogues(state: GameState, trigger: DialogueTrigger): GameState {
  const steps = collectTriggeredDialogues(state, trigger)
  return enqueueDialogue(state, steps)
}
