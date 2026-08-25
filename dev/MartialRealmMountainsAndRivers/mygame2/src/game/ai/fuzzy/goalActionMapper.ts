import type { GameState, PlayerState } from '../../types'
import type { AiAction, AiActorRef } from '../aiAction'
import type { GoalName, GoalResult } from './goals'
import { collectReachableCells } from '../perception/reachablePositions'

/**
 * 目標→行動序列映射：將 GoalResult 轉為 AiAction[] 供 executeAiAction 逐步執行。
 *
 * V1：selfPreservation 和 collectItems 各回傳 1~2 步行動。
 */
export function buildActionSequence(
  goal: GoalName,
  result: GoalResult,
  state: GameState,
  player: PlayerState,
): AiAction[] {
  const actor: AiActorRef = { id: player.id, kind: 'player' }

  switch (goal) {
    case 'selfPreservation':
      return buildRetreatActions(actor, result, state, player)
    case 'collectItems':
      return buildCollectItemActions(actor, result, state, player)
  }
}

// ─── selfPreservation ──────────────────────────────────────────────

function buildRetreatActions(
  actor: AiActorRef,
  result: GoalResult,
  state: GameState,
  player: PlayerState,
): AiAction[] {
  if (!result.target || result.target.kind !== 'retreat') {
    return [{ type: 'hold', actor, reason: '保命：無逃離方向，原地待命' }]
  }

  // 找離威脅最遠的可到達鄰格
  const reachable = collectReachableCells(state, player)
  if (reachable.length === 0) {
    return [{ type: 'hold', actor, reason: '保命：無法移動，原地待命' }]
  }

  // V1: 取體力內可到達的最遠格（作為逃離方向）
  const bestEscape = reachable[reachable.length - 1]
  return [{
    type: 'move',
    actor,
    destination: bestEscape.position,
    reason: `保命：逃離（hitsSurvivable=${result.context?.hitsSurvivable ?? '?'}）`,
  }]
}

// ─── collectItems ──────────────────────────────────────────────────

function buildCollectItemActions(
  actor: AiActorRef,
  result: GoalResult,
  _state: GameState,
  player: PlayerState,
): AiAction[] {
  if (!result.target || result.target.kind !== 'item') {
    return [{ type: 'hold', actor, reason: '收集道具：無可撿道具' }]
  }

  const target = result.target
  const onSameCell = player.position.row === target.position.row && player.position.column === target.position.column

  if (onSameCell) {
    // 已在道具格上，直接撿
    return [{
      type: 'collect',
      actor,
      target: { id: target.id, kind: 'item', position: target.position },
      reason: '收集道具：拾取',
    }]
  }

  // 需要先移動到道具格
  return [
    {
      type: 'move',
      actor,
      destination: target.position,
      reason: '收集道具：移動到道具位置',
    },
    {
      type: 'collect',
      actor,
      target: { id: target.id, kind: 'item', position: target.position },
      reason: '收集道具：拾取',
    },
  ]
}
