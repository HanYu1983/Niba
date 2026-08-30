import type { ActionExecutionResult, GameState, PlayerState } from '../types'
import { isAdjacent } from '../types'
import { ACTION_STAMINA_COSTS, canPlayerPerformAction, spendPlayerStamina } from '../rules/actionCostRules'

/** 急救復活後的血量。 */
export const FIRST_AID_REVIVE_HEALTH = 5

export type FirstAidExecutionResult = {
  playerId: string
  playerName: string
  targetId: string
  targetName: string
  revivedHealth: number
}

/**
 * 急救：復活周圍一格內倒下（health <= 0）的玩家，血量恢復至 FIRST_AID_REVIVE_HEALTH。
 * 僅消耗施救者體力（ACTION_STAMINA_COSTS.firstAid），目標不消耗任何資源。
 * 目標復活後維持原本回合狀態（turnEnded 由回合流程管理）。
 */
export function performFirstAid(
  state: GameState,
  playerId: string,
  targetPlayerId: string,
): { state: GameState; result: ActionExecutionResult<FirstAidExecutionResult> } {
  const player = state.players.find((candidate) => candidate.id === playerId)
  const target = state.players.find((candidate) => candidate.id === targetPlayerId)
  const actionCheck = canPlayerPerformAction(state, playerId, ACTION_STAMINA_COSTS.firstAid)
  if (!actionCheck.ok) return { state, result: { ok: false, reason: actionCheck.reason ?? '目前無法行動。' } }
  if (!player) return { state, result: { ok: false, reason: '玩家不存在。' } }
  if (!target) return { state, result: { ok: false, reason: '急救目標不存在。' } }
  if (target.id === player.id) return { state, result: { ok: false, reason: '無法對自己進行急救。' } }
  if (target.health > 0) return { state, result: { ok: false, reason: '目標玩家尚未倒下，無需急救。' } }
  if (!isAdjacent(player.position, target.position)) return { state, result: { ok: false, reason: '急救目標需位於周圍一格內。' } }

  const revivedTarget: PlayerState = { ...target, health: FIRST_AID_REVIVE_HEALTH }
  return {
    state: {
      ...state,
      players: state.players.map((candidate) => {
        if (candidate.id === target.id) return revivedTarget
        if (candidate.id === player.id) return spendPlayerStamina(candidate, ACTION_STAMINA_COSTS.firstAid)
        return candidate
      }),
    },
    result: {
      ok: true,
      data: {
        playerId: player.id,
        playerName: player.name,
        targetId: target.id,
        targetName: target.name,
        revivedHealth: FIRST_AID_REVIVE_HEALTH,
      },
    },
  }
}

