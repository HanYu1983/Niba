import type { GameState, PlayerState } from '../../types'
import type { AiAction, AiActorRef } from '../aiAction'
import type { GoalName, GoalResult } from './goals'
import { collectReachableCells } from '../perception/reachablePositions'
import { externalSkillCatalog } from '../../catalogs/externalSkillCatalog'

/**
 * 目標→行動序列映射：將 GoalResult 轉為 AiAction[] 供 executeAiAction 逐步執行。
 *
 * V1：selfPreservation / collectItems / positioning 各回傳 1~2 步行動。
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
    case 'positioning':
      return buildPositioningActions(actor, result, state, player)
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

// ─── positioning ──────────────────────────────────────────────────

function buildPositioningActions(
  actor: AiActorRef,
  result: GoalResult,
  state: GameState,
  player: PlayerState,
): AiAction[] {
  // 無出口 → 攻擊最近怪物（優先外功傷害型）
  if (result.target?.kind === 'attack') {
    return buildPositioningAttack(actor, state, player)
  }

  // 有出口 → 移動到最近出口
  if (result.target?.kind === 'exit') {
    return [{
      type: 'move',
      actor,
      destination: result.target.position,
      reason: `定位：前往出口 (${result.target.position.row},${result.target.position.column})`,
    }]
  }

  return [{ type: 'hold', actor, reason: '定位：無行動需求' }]
}

function buildPositioningAttack(
  actor: AiActorRef,
  state: GameState,
  player: PlayerState,
): AiAction[] {
  // 找最近的怪物
  const nearestCreature = state.creatures
    .filter((c) => c.health > 0)
    .sort((a, b) => {
      const da = Math.abs(a.position.row - player.position.row) + Math.abs(a.position.column - player.position.column)
      const db = Math.abs(b.position.row - player.position.row) + Math.abs(b.position.column - player.position.column)
      return da - db
    })[0]

  if (!nearestCreature) {
    return [{ type: 'hold', actor, reason: '定位：無出口但無可攻擊怪物' }]
  }

  const targetType = 'creature'
  const targetId = nearestCreature.id
  const position = nearestCreature.position

  // 優先使用已裝備的外功傷害型技能
  const damageSkill = player.equippedExternalSkillIds
    .map((id) => externalSkillCatalog.find((s) => s.id === id))
    .find((s): s is NonNullable<typeof s> => s != null && s.category === 'damage' && s.target === 'target')

  if (damageSkill) {
    return [{
      type: 'attack',
      actor,
      target: { id: targetId, kind: targetType, position },
      reason: `定位：無出口→攻擊（外功 ${damageSkill.name}）`,
    }]
  }

  return [{
    type: 'attack',
    actor,
    target: { id: targetId, kind: targetType, position },
    reason: '定位：無出口→攻擊',
  }]
}
