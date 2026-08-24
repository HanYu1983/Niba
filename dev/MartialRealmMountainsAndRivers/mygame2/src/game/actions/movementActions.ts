import type { ActionOutcome, GameState } from '../types'
import { updatePlayerVisibility } from '../rules/visibilityRules'
import { applyBaseHealthBonuses } from '../rules/baseRules'
import { getMovementTarget } from '../rules/targetRules'
import { getActionablePlayer } from '../rules/actionCostRules'
import { progressObjectives, checkVictory } from '../rules/campaignRules'
import { collectTriggeredDialogues, type DialogueTrigger } from '../rules/dialogueTriggerRules'
import { enqueueDialogue } from './dialogueActions'
import { executeTriggers } from '../rules/triggerRules'

export function movePlayer(
  state: GameState,
  playerId: string,
  row: number,
  column: number,
): { state: GameState; result: ActionOutcome } {
  const target = getMovementTarget(state, getActionablePlayer(state, playerId), playerId, row, column)
  if (!target) return { state, result: { ok: false, reason: '無法移動至目標位置。' } }

  const nextState = {
    ...state,
    players: state.players.map((player) => player.id === playerId
      ? {
        ...player,
        position: { row, column },
        stamina: player.stamina - target.staminaCost,
      }
      : player),
  }

  const stateWithHealthBonus = applyBaseHealthBonuses(nextState)
  // 移動完成後推進 reach-position 目標並檢查勝利。
  const withObjectives = progressObjectives(stateWithHealthBonus, { type: 'reach-position', row, column })
  // 移動完成後檢查 on-enter-region 對話與觸發器（玩家進入指定區域時觸發）。
  const withDialogue = enqueueTriggeredDialogues(withObjectives, { type: 'on-enter-region', param: `${row},${column}` })
  const withTriggers = executeTriggers(withDialogue, { type: 'on-enter-region', param: `${row},${column}` })
  return {
    state: { ...checkVictory(withTriggers), visibility: updatePlayerVisibility(withTriggers, playerId) },
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
