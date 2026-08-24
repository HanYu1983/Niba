import type { GameState, Position } from '../../types'
import { isAdjacent } from '../../types'
import { canPlayerPerformAction } from '../../rules/actionCostRules'
import { collectReachableCells } from '../perception/reachablePositions'
import type { AiAction, AiTargetRef } from '../aiAction'

export type AiValidationResult = { valid: true } | { valid: false; reason: string }

function isSamePosition(first: Position, second: Position): boolean {
  return first.row === second.row && first.column === second.column
}

/** 依目標種類解析出「存在且帶血量」的實體；不存在回 null。 */
function findTarget(state: GameState, target: AiTargetRef): { health: number; position: Position } | null {
  switch (target.kind) {
    case 'player':
      return state.players.find((candidate) => candidate.id === target.id) ?? null
    case 'creature':
      return state.creatures.find((candidate) => candidate.id === target.id) ?? null
    case 'nest':
      return state.creatureNests.find((candidate) => candidate.id === target.id) ?? null
    case 'base':
      return state.bases.find((candidate) => candidate.id === target.id) ?? null
    case 'resource':
      return state.resourcePoints.find((candidate) => candidate.id === target.id) ?? null
    case 'defense':
      return (state.defenseStructures ?? []).find((candidate) => candidate.id === target.id) ?? null
  }
}

/**
 * 通用行動驗證（重構文件 §9.2）。
 *
 * 切片 C 範圍：只驗證、不改變任何現有行動路徑（Scheduler／Creature 接線在後續切片）。
 * - player kind：回合合法性沿用 `canPlayerPerformAction` 單一事實來源。
 * - creature kind：回合階段檢查隨切片 D（Creature 管線）補上。
 */
export function validateAiAction(state: GameState, action: AiAction): AiValidationResult {
  const actor = action.actor.kind === 'player'
    ? state.players.find((candidate) => candidate.id === action.actor.id)
    : state.creatures.find((candidate) => candidate.id === action.actor.id)
  if (!actor) return { valid: false, reason: '行動者不存在。' }
  if (actor.health <= 0) return { valid: false, reason: '行動者已無法行動。' }

  if (action.actor.kind === 'player') {
    const turnCheck = canPlayerPerformAction(state, action.actor.id, 0)
    if (!turnCheck.ok) return { valid: false, reason: turnCheck.reason ?? '目前無法行動。' }
  }

  switch (action.type) {
    case 'move': {
      const reachable = collectReachableCells(state, actor).some((cell) => isSamePosition(cell.position, action.destination))
      return reachable
        ? { valid: true }
        : { valid: false, reason: '目的地不可達或體力不足。' }
    }
    case 'attack': {
      const target = findTarget(state, action.target)
      if (!target || target.health <= 0) return { valid: false, reason: '攻擊目標不存在或已死亡。' }
      if (!isAdjacent(actor.position, target.position)) return { valid: false, reason: '目標不在攻擊距離內。' }
      return { valid: true }
    }
    case 'collect': {
      const target = findTarget(state, action.target)
      if (!target || target.health <= 0) return { valid: false, reason: '採集目標不存在或已失效。' }
      return { valid: true }
    }
    case 'build': {
      const base = state.bases.find((candidate) => candidate.id === action.baseId)
      if (!base) return { valid: false, reason: '建築目標據點不存在。' }
      return { valid: true }
    }
    case 'hold':
    case 'end-turn':
      return { valid: true }
  }
}
