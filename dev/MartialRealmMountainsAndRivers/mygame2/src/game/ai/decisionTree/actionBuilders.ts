import type { GameState, PlayerState, Position } from '../../types'
import { getAdjacentPositions } from '../../types'
import type { AiAction, AiActorRef } from '../aiAction'
import type { HostileActor } from '../perception/targetDiscovery'
import { collectReachableCells } from '../perception/reachablePositions'
import { getBlockedPositions } from '../perception/blockedPositions'
import { canTraverseTerrain, getTerrainStaminaCost } from '../../rules/playerDerivedRules'

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

// ─── 找最近可达相鄰格 ──────────────────────────

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
    reason: `逃命：遠離 ${nearestThreat.name}`,
  }
}

export function buildMoveToBaseAction(
  state: GameState,
  player: PlayerState,
): AiAction | null {
  const actor: AiActorRef = { id: player.id, kind: 'player' }
  const base = state.bases.find((b) => b.active !== false && b.health > 0)
  if (!base) return null

  const dest = findClosestReachablePosition(state, player, base.position)
  if (dest.row === player.position.row && dest.column === player.position.column) return null

  return {
    type: 'move',
    actor,
    destination: dest,
    reason: `回據點：${base.name}`,
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
      reason: `攻擊 ${name}`,
    }
  }

  const moveDest = findClosestReachablePosition(state, player, pos)
  return {
    type: 'move',
    actor,
    destination: moveDest,
    reason: `移動到 ${name} 附近`,
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
      reason: '拾取道具',
    }
  }

  const dest = findClosestReachablePosition(state, player, itemPosition)
  return {
    type: 'move',
    actor,
    destination: dest,
    reason: '移動到道具位置',
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
      reason: '採集資源',
    }
  }

  const dest = findClosestReachablePosition(state, player, rpPosition)
  return {
    type: 'move',
    actor,
    destination: dest,
    reason: '移動到資源點',
  }
}

export function buildExploreAction(
  state: GameState,
  player: PlayerState,
  targetPos: Position,
): AiAction | null {
  const actor: AiActorRef = { id: player.id, kind: 'player' }
  const dest = findClosestReachablePosition(state, player, targetPos)
  if (dest.row === player.position.row && dest.column === player.position.column) return null
  return {
    type: 'move',
    actor,
    destination: dest,
    reason: '探索未探索區域',
  }
}
