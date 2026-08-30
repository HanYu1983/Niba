import type { GameState, PlayerState, Position } from '../../types'
import { getAdjacentPositions } from '../../types'
import type { AiAction, AiActorRef } from '../aiAction'
import type { HostileActor } from '../perception/targetDiscovery'
import { collectReachableCells } from '../perception/reachablePositions'
import { getBlockedPositions } from '../perception/blockedPositions'
import { canTraverseTerrain, getTerrainStaminaCost } from '../../rules/playerDerivedRules'
import { getVisibleOwnedBase } from './conditions'

// ─── Dijkstra cost map（從任意起點）──────────────

function buildCostMapFrom(
  state: GameState,
  start: Position,
  player: PlayerState,
): Map<string, number> {
  const cellsByPosition = new Map(state.map.cells.map((c) => [`${c.row}-${c.column}`, c]))
  const blockedKeys = new Set(getBlockedPositions(state, player.id).map((p) => `${p.row}-${p.column}`))
  const costs = new Map<string, number>()
  const queue: Array<{ row: number; column: number; cost: number }> = [{ ...start, cost: 0 }]
  let head = 0
  costs.set(`${start.row}-${start.column}`, 0)

  while (head < queue.length) {
    const cur = queue[head++]
    for (const adj of getAdjacentPositions(cur)) {
      const cell = cellsByPosition.get(`${adj.row}-${adj.column}`)
      if (!cell || !canTraverseTerrain(cell.terrain, player) || blockedKeys.has(cell.id)) continue
      const nextCost = cur.cost + getTerrainStaminaCost(cell.terrain, player)
      const prev = costs.get(cell.id)
      if (prev !== undefined && prev <= nextCost) continue
      costs.set(cell.id, nextCost)
      queue.push({ row: cell.row, column: cell.column, cost: nextCost })
    }
  }
  return costs
}

// ─── 找最近可達相鄰格 ──────────────────────────

export function findClosestReachablePosition(
  state: GameState,
  player: PlayerState,
  targetPosition: Position,
): Position {
  const reachable = collectReachableCells(state, player)
  if (reachable.length === 0) return player.position

  const distToTarget = Math.abs(player.position.row - targetPosition.row) + Math.abs(player.position.column - targetPosition.column)
  if (distToTarget <= 1) {
    const targetReachable = reachable.find((c) => c.position.row === targetPosition.row && c.position.column === targetPosition.column)
    if (targetReachable) return targetPosition
  }

  const adjacents = reachable.filter((c) => {
    if (c.cost === 0) return false
    const d = Math.abs(c.position.row - player.position.row) + Math.abs(c.position.column - player.position.column)
    return d <= 1
  })

  if (adjacents.length === 0) return player.position

  const targetCosts = buildCostMapFrom(state, targetPosition, player)
  const best = adjacents.reduce((best, c) => {
    const dBest = targetCosts.get(best.cellId) ?? Infinity
    const dC = targetCosts.get(c.cellId) ?? Infinity
    return dC < dBest ? c : best
  })
  return best.position
}

// ─── 最短路徑版（含 parent，可重構路徑）────────────

function buildCostMapFromWithParents(
  state: GameState,
  start: Position,
  player: PlayerState,
): { costs: Map<string, number>; parents: Map<string, string> } {
  const cellsByPosition = new Map(state.map.cells.map((c) => [`${c.row}-${c.column}`, c]))
  const blockedKeys = new Set(getBlockedPositions(state, player.id).map((p) => `${p.row}-${p.column}`))
  const costs = new Map<string, number>()
  const parents = new Map<string, string>()
  const startKey = `${start.row}-${start.column}`
  const queue: Array<{ cellId: string; cost: number }> = [{ cellId: startKey, cost: 0 }]
  let head = 0
  costs.set(startKey, 0)

  while (head < queue.length) {
    const cur = queue[head++]
    const curPos = cellsByPosition.get(cur.cellId)
    if (!curPos) continue
    for (const adj of getAdjacentPositions(curPos)) {
      const cell = cellsByPosition.get(`${adj.row}-${adj.column}`)
      if (!cell || !canTraverseTerrain(cell.terrain, player) || blockedKeys.has(cell.id)) continue
      const nextCost = cur.cost + getTerrainStaminaCost(cell.terrain, player)
      const prev = costs.get(cell.id)
      if (prev !== undefined && prev <= nextCost) continue
      costs.set(cell.id, nextCost)
      parents.set(cell.id, cur.cellId)
      queue.push({ cellId: cell.id, cost: nextCost })
    }
  }
  return { costs, parents }
}

function reconstructPath(parents: Map<string, string>, targetCellId: string, startCellId: string): string[] {
  const reversed: string[] = []
  let cur: string | undefined = targetCellId
  const seen = new Set<string>()
  while (cur !== undefined && cur !== startCellId && !seen.has(cur)) {
    seen.add(cur)
    reversed.push(cur)
    cur = parents.get(cur)
  }
  if (cur === startCellId) reversed.push(startCellId)
  return reversed.reverse()
}

function getMovableNeighborKeys(state: GameState, player: PlayerState): Set<string> {
  const cellsByPosition = new Map(state.map.cells.map((c) => [`${c.row}-${c.column}`, c]))
  const blockedKeys = new Set(getBlockedPositions(state, player.id).map((p) => `${p.row}-${p.column}`))
  const keys = new Set<string>()
  for (const adj of getAdjacentPositions(player.position)) {
    const cell = cellsByPosition.get(`${adj.row}-${adj.column}`)
    if (cell && canTraverseTerrain(cell.terrain, player) && !blockedKeys.has(cell.id)) {
      keys.add(cell.id)
    }
  }
  return keys
}

/**
 * 另一版本：用含 parent 的 Dijkstra 算出 player → targetPosition 的最短路徑，
 * 取「最短路徑 ∩ player 的四個可移動鄰格」中離 player 最近（路徑上第一步）的格子回傳。
 * 目標不可達時回傳 player.position（產生物件時由呼叫端判斷為不移動）。
 */
export function findClosestReachablePositionByShortestPath(
  state: GameState,
  player: PlayerState,
  targetPosition: Position,
): Position {
  if (player.position.row === targetPosition.row && player.position.column === targetPosition.column) {
    return player.position
  }
  const { costs, parents } = buildCostMapFromWithParents(state, player.position, player)
  const startKey = `${player.position.row}-${player.position.column}`
  const targetKey = `${targetPosition.row}-${targetPosition.column}`
  if (!costs.has(targetKey)) return player.position

  const path = reconstructPath(parents, targetKey, startKey)
  const movable = getMovableNeighborKeys(state, player)
  for (const cellId of path) {
    if (cellId === startKey) continue
    if (movable.has(cellId)) {
      const [row, column] = cellId.split('-').map(Number)
      return { row, column }
    }
  }
  return player.position
}

// ─── 動作構建器 ──────────────────────────────────

export function buildRetreatAction(
  state: GameState,
  player: PlayerState,
): AiAction | null {
  const actor: AiActorRef = { id: player.id, kind: 'player' }

  const visibleCreatures = state.creatures.filter((c) => c.health > 0)
  const nearestThreat = visibleCreatures
    .sort((a, b) => {
      const da = Math.abs(a.position.row - player.position.row) + Math.abs(a.position.column - player.position.column)
      const db = Math.abs(b.position.row - player.position.row) + Math.abs(b.position.column - player.position.column)
      return da - db
    })[0]

  if (!nearestThreat) return null

  const reachable = collectReachableCells(state, player)
  const adjacents = reachable.filter((c) => {
    if (c.cost === 0) return false
    const d = Math.abs(c.position.row - player.position.row) + Math.abs(c.position.column - player.position.column)
    return d <= 1
  })

  if (adjacents.length === 0) return null

  const threatPos = nearestThreat.position
  const bestEscape = adjacents.reduce((best, c) => {
    const dBest = Math.abs(best.position.row - threatPos.row) + Math.abs(best.position.column - threatPos.column)
    const dC = Math.abs(c.position.row - threatPos.row) + Math.abs(c.position.column - threatPos.column)
    return dC > dBest ? c : best
  })

  return {
    type: 'move',
    actor,
    destination: bestEscape.position,
    reason: `逃命：遠離 ${nearestThreat.name}（目標 (${bestEscape.position.row}, ${bestEscape.position.column})，體力 ${Math.floor(player.stamina)}）`,
  }
}

export function buildMoveToBaseAction(
  state: GameState,
  player: PlayerState,
): AiAction | null {
  const actor: AiActorRef = { id: player.id, kind: 'player' }
  const base = getVisibleOwnedBase(state, player.id)
  if (!base) return null

  const dest = findClosestReachablePosition(state, player, base.position)
  if (dest.row === player.position.row && dest.column === player.position.column) return null

  return {
    type: 'move',
    actor,
    destination: dest,
    reason: `回據點：${base.name}（目標 (${dest.row}, ${dest.column})，體力 ${Math.floor(player.stamina)}）`,
  }
}

export function buildAttackAction(
  state: GameState,
  player: PlayerState,
  hostile: HostileActor,
): AiAction | null {
  const actor: AiActorRef = { id: player.id, kind: 'player' }
  const pos = hostile.sourceType === 'creature' ? hostile.creature.position : hostile.nest.position
  const id = hostile.sourceType === 'creature' ? hostile.creature.id : hostile.nest.id
  const kind = hostile.sourceType === 'creature' ? 'creature' as const : 'nest' as const
  const name = hostile.sourceType === 'creature' ? hostile.creature.name : hostile.nest.name

  const dist = Math.abs(pos.row - player.position.row) + Math.abs(pos.column - player.position.column)

  if (dist <= 1) {
    return {
      type: 'attack',
      actor,
      target: { id, kind, position: pos },
      reason: `攻擊 ${name}（目標 (${pos.row}, ${pos.column})，體力 ${Math.floor(player.stamina)}）`,
    }
  }

  const moveDest = findClosestReachablePosition(state, player, pos)
  return {
    type: 'move',
    actor,
    destination: moveDest,
    reason: `移動到 ${name} 附近（目標 (${moveDest.row}, ${moveDest.column})，敵在 (${pos.row}, ${pos.column})，體力 ${Math.floor(player.stamina)}）`,
  }
}

export function buildCollectItemAction(
  state: GameState,
  player: PlayerState,
  itemId: string,
  itemPosition: Position,
): AiAction | null {
  const actor: AiActorRef = { id: player.id, kind: 'player' }

  if (player.position.row === itemPosition.row && player.position.column === itemPosition.column) {
    return {
      type: 'collect',
      actor,
      target: { id: itemId, kind: 'item', position: itemPosition },
      reason: `拾取道具（目標 (${itemPosition.row}, ${itemPosition.column})，體力 ${Math.floor(player.stamina)}）`,
    }
  }

  const dest = findClosestReachablePosition(state, player, itemPosition)
  return {
    type: 'move',
    actor,
    destination: dest,
    reason: `移動到道具位置（目標 (${dest.row}, ${dest.column})，道具在 (${itemPosition.row}, ${itemPosition.column})，體力 ${Math.floor(player.stamina)}）`,
  }
}

export function buildCollectResourceAction(
  state: GameState,
  player: PlayerState,
  rpId: string,
  rpPosition: Position,
): AiAction | null {
  const actor: AiActorRef = { id: player.id, kind: 'player' }

  if (player.position.row === rpPosition.row && player.position.column === rpPosition.column) {
    return {
      type: 'collect',
      actor,
      target: { id: rpId, kind: 'resource', position: rpPosition },
      reason: `採集資源（體力 ${Math.floor(player.stamina)}）`,
    }
  }

  const dest = findClosestReachablePosition(state, player, rpPosition)
  return {
    type: 'move',
    actor,
    destination: dest,
    reason: `移動到資源點 (${dest.row}, ${dest.column}) 附近，資源點在 (${rpPosition.row}, ${rpPosition.column})，體力 ${Math.floor(player.stamina)}`,
  }
}

export function buildExploreAction(
  state: GameState,
  player: PlayerState,
  targetPos: Position,
): AiAction | null {
  const actor: AiActorRef = { id: player.id, kind: 'player' }
  const dest = findClosestReachablePositionByShortestPath(state, player, targetPos)
  if (dest.row === player.position.row && dest.column === player.position.column) return null
  return {
    type: 'move',
    actor,
    destination: dest,
    reason: `探索未探索區域（目標 (${dest.row}, ${dest.column})，目的 (${targetPos.row}, ${targetPos.column})，體力 ${Math.floor(player.stamina)}）`,
  }
}

/**
 * 清理／採集廢墟（kind: 'ruin'）。
 *
 * ⚠️ 開發提醒：worldSetup 的 createRuins 目前「未避開 resourcePoints」，
 * 可能使同一格同時存在廢墟與資源點（重疊實體）。決策樹選擇目標時
 * 以 state.ruins（status === 'intact' 且相鄰）優先，若與資源點重疊，
 * 兩者皆可採集——請留意世界生成層是否要修正為互斥。
 *
 * 需玩家位於廢墟周遭一格（與 clearRuin 的 isAdjacent 一致）。
 */
export function buildCollectRuinAction(
  state: GameState,
  player: PlayerState,
): AiAction | null {
  const actor: AiActorRef = { id: player.id, kind: 'player' }
  const adjacentRuin = (state.ruins ?? []).find((ruin) => {
    if (ruin.status !== 'intact') return false
    const d = Math.abs(ruin.position.row - player.position.row) + Math.abs(ruin.position.column - player.position.column)
    return d === 1
  })
  if (!adjacentRuin) return null
  return {
    type: 'collect',
    actor,
    target: { id: adjacentRuin.id, kind: 'ruin', position: adjacentRuin.position },
    reason: `清理廢墟\n 採集（目標 (${adjacentRuin.position.row}, ${adjacentRuin.position.column})，體力 ${Math.floor(player.stamina)}）`,
  }
}
