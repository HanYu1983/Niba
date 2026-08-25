import type { GameState, ItemPointState, PlayerState, Position, ResourcePointState } from '../../types'
import { collectReachableCells } from './reachablePositions'

export type ReachableInterest = {
  cellId: string
  position: Position
  /** 從 actor 目前位置出發的最小體力成本（保證 ≤ actor.stamina）。 */
  cost: number
  kind: 'item' | 'resource'
  ref: ItemPointState | ResourcePointState
}

/**
 * 列出 actor 剩餘體力可達範圍內的所有道具與資源點。
 *
 * 用途：AI 興趣點巡檢（逐點移動拾取）。
 * - 道具：state.itemPoints 中 position 落在可達格內的項目。
 * - 資源：state.resourcePoints 中 active !== false 且 position 在可達格內的項目。
 * - 探索事件需 UI modal 選擇，AI 無法自動處理，故不納入。
 * - 結果以 cost 升序排列（最近的先）。
 */
export function collectReachableInterests(state: GameState, actor: PlayerState): ReachableInterest[] {
  const reachable = collectReachableCells(state, actor)
  const reachableKeys = new Set(reachable.map((cell) => cell.cellId))
  const costByCellId = new Map(reachable.map((cell) => [cell.cellId, cell.cost]))

  const interests: ReachableInterest[] = []

  for (const point of state.itemPoints) {
    const key = `${point.position.row}-${point.position.column}`
    if (!reachableKeys.has(key)) continue
    const cost = costByCellId.get(key)
    if (cost === undefined) continue
    interests.push({ cellId: key, position: point.position, cost, kind: 'item', ref: point })
  }

  for (const point of state.resourcePoints) {
    if (point.active === false) continue
    const key = `${point.position.row}-${point.position.column}`
    if (!reachableKeys.has(key)) continue
    const cost = costByCellId.get(key)
    if (cost === undefined) continue
    interests.push({ cellId: key, position: point.position, cost, kind: 'resource', ref: point })
  }

  interests.sort((a, b) => a.cost - b.cost)
  return interests
}
