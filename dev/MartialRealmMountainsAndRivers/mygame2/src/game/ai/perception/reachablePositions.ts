import type { GameState, PlayerState, Position, TerrainType } from '../../types'
import { buildMovementCostMap, getBlockedPositions } from './blockedPositions'
import { canTraverseTerrain } from '../../rules/playerDerivedRules'

export type ReachableCell = {
  cellId: string
  position: Position
  /** 從 actor 目前位置出發的最小體力成本（保證 ≤ actor.stamina）。 */
  cost: number
}

export type CellUnreachableReason = {
  cellId: string
  position: Position
  reason: string
}

/** 依阻擋實體反查「這格被誰佔據／為何不可穿越」的文字描述。 */
export function describeCellUnreachable(
  state: GameState,
  actor: PlayerState,
  cell: { id: string; row: number; column: number; terrain: TerrainType },
): string {
  const cellKey = cell.id
  const otherPlayer = state.players.find(
    (p) => p.id !== actor.id && p.health > 0 && `${p.position.row}-${p.position.column}` === cellKey,
  )
  if (otherPlayer) return `被其他玩家 ${otherPlayer.name} 佔據`
  const creature = state.creatures.find(
    (c) => c.health > 0 && `${c.position.row}-${c.position.column}` === cellKey,
  )
  if (creature) return `被生物 ${creature.name} 佔據`
  const base = state.bases.find((b) => `${b.position.row}-${b.position.column}` === cellKey)
  if (base) return `被據點 ${base.name} 佔據`
  const ruin = (state.ruins ?? []).find(
    (r) => r.status === 'intact' && `${r.position.row}-${r.position.column}` === cellKey,
  )
  if (ruin) return `被完好廢墟 ${ruin.name} 佔據（需先清理）`
  const gate = (state.sectGates ?? []).find((g) => `${g.position.row}-${g.position.column}` === cellKey)
  if (gate) return `被門派據點佔據`
  const defense = (state.defenseStructures ?? []).find(
    (d) => `${d.position.row}-${d.position.column}` === cellKey,
  )
  if (defense) return `被防禦設施（${defense.type}）佔據`
  if (cell.terrain === 'wall') return '該格是牆壁，無法通行'
  if (!blockedByObstacle(state, actor, cellKey) && !canTraverseTerrain(cell.terrain, actor)) {
    return `地形「${cell.terrain}」無法穿越`
  }
  return '無通往該格的路徑'
}

/** 該格是否正交被阻擋實體佔據（描述不可達時用的補充檢查）。 */
function blockedByObstacle(state: GameState, actor: PlayerState, cellId: string): boolean {
  return getBlockedPositions(state, actor.id).some(
    (p) => `${p.row}-${p.column}` === cellId,
  )
}

/**
 * 共用可達性感知：一次 Dijkstra 成本圖，列出以剩餘體力可達的所有格子。
 *
 * - 牆與不可通行地形：成本圖不會包含，自動排除。
 * - 被阻擋格（其他玩家／生物／據點／廢墟／門派據點／防禦設施）：不可停留也不可穿越。
 * - 包含原地（cost 0）；是否排除原地由呼叫端決定。
 *
 * 傳入選擇性 `reasons` 收集器時，會對「不可達的格子」逐一記錄不可達原因，
 * 供呼叫端（如 validateAiAction）在目標不可達時回報具體原因。
 */
export function collectReachableCells(
  state: GameState,
  actor: PlayerState,
  reasons?: CellUnreachableReason[],
): ReachableCell[] {
  const blocked = getBlockedPositions(state, actor.id)
  const costs = buildMovementCostMap(state.map, actor, blocked)
  const blockedKeys = new Set(blocked.map((position) => `${position.row}-${position.column}`))

  const reachable: ReachableCell[] = []
  for (const cell of state.map.cells) {
    if (cell.terrain === 'wall') {
      if (reasons) reasons.push({ cellId: cell.id, position: { row: cell.row, column: cell.column }, reason: '該格是牆壁，無法通行' })
      continue
    }
    if (blockedKeys.has(cell.id)) {
      if (reasons) reasons.push({ cellId: cell.id, position: { row: cell.row, column: cell.column }, reason: describeCellUnreachable(state, actor, cell) })
      continue
    }
    const cost = costs.get(cell.id)
    if (cost === undefined) {
      if (reasons) reasons.push({ cellId: cell.id, position: { row: cell.row, column: cell.column }, reason: describeCellUnreachable(state, actor, cell) })
      continue
    }
    if (cost > actor.stamina) {
      if (reasons) reasons.push({ cellId: cell.id, position: { row: cell.row, column: cell.column }, reason: `體力不足（需要 ${cost}，剩餘 ${actor.stamina}）` })
      continue
    }
    reachable.push({ cellId: cell.id, position: { row: cell.row, column: cell.column }, cost })
  }
  return reachable
}
