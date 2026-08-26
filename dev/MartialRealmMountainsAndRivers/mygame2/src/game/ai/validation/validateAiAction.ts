import type { GameState, Position } from '../../types'
import { isAdjacent } from '../../types'
import { canPlayerPerformAction } from '../../rules/actionCostRules'
import { collectReachableCells } from '../perception/reachablePositions'
import { defenseActionToAiAction, type AiAction, type AiTargetRef } from '../aiAction'
import type { AiDefenseAction } from '../../aiDefenseRules'

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
    case 'item': {
      const item = state.itemPoints.find((candidate) => candidate.id === target.id)
      return item ? { health: 1, position: item.position } : null
    }
  }
}

/**
 * 通用行動驗證（重構文件 §9.2）。
 *
 * - player kind：回合合法性沿用 `canPlayerPerformAction` 單一事實來源。
 * - creature kind：回合資格檢查由 Creature 管線的 `validateCreatureTurnEligibility`
 *   在 validate 段執行（切片 I 接線）；意圖層驗證共用本函式。
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
    case 'allocate-attribute':
    case 'use-item':
    case 'equip':
    case 'equip-inner-skill':
    case 'learn-skill':
    case 'practice-skill':
    case 'use-facility':
    case 'defense-build':
    case 'buy-item':
      return { valid: true }
  }
}

/**
 * 玩家 AI 決策層驗證（切片 I 接線）：把 `AiDefenseAction` 決策經 Adapter 轉成
 * `AiAction` 後走同一套 §9.2 驗證，作為 store step 執行前的單一把關點。
 */
export function validateAiDefenseDecision(
  state: GameState,
  playerId: string,
  decision: AiDefenseAction,
): AiValidationResult {
  return validateAiAction(state, defenseActionToAiAction(state, playerId, decision))
}
