import type { GameState, PlayerState, Position } from '../../types'
import { buildMovementCostMap, getBlockedPositions } from './blockedPositions'

export type ReachableCell = {
  cellId: string
  position: Position
  /** 從 actor 目前位置出發的最小體力成本（保證 ≤ actor.stamina）。 */
  cost: number
}

/**
 * 共用可達性感知：一次 Dijkstra 成本圖，列出以剩餘體力可達的所有格子。
 *
 * - 牆與不可通行地形：成本圖不會包含，自動排除。
 * - 被阻擋格（其他玩家／生物／據點／廢墟／門派據點／防禦設施）：不可停留也不可穿越。
 * - 包含原地（cost 0）；是否排除原地由呼叫端決定（行為保持：各策略原規則不同）。
 */
export function collectReachableCells(state: GameState, actor: PlayerState): ReachableCell[] {
  const blocked = getBlockedPositions(state, actor.id)
  const costs = buildMovementCostMap(state.map, actor, blocked)
  const blockedKeys = new Set(blocked.map((position) => `${position.row}-${position.column}`))

  const reachable: ReachableCell[] = []
  for (const cell of state.map.cells) {
    if (cell.terrain === 'wall') continue
    if (blockedKeys.has(cell.id)) continue
    const cost = costs.get(cell.id)
    if (cost === undefined || cost > actor.stamina) continue
    reachable.push({ cellId: cell.id, position: { row: cell.row, column: cell.column }, cost })
  }
  return reachable
}
