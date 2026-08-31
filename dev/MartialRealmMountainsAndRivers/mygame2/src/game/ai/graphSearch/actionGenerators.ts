import type { Position } from '../../types'
import type { AiAction, AiActorRef, AiTargetRef } from '../aiAction'
import type { AiNode, AiEdge } from './types'
import { AiNodeImpl } from './AiNodeImpl'
import { executePure } from './executePure'
import { getTierScore, canKillThisTurn } from './scoring'
import { getAiActionStaminaCost } from '../../rules/actionCostRules'
import { listHostileActors, getHostileActorPosition } from '../perception/targetDiscovery'
import { collectReachableCells } from '../perception/reachablePositions'
import { getCellVisibility } from '../../rules/visibilityRules'
import type { ExecuteAiActionDependencies } from '../execution/executeAiAction'

const MAX_BRANCHES = 5

function makeActorRef(playerId: string): AiActorRef {
  return { id: playerId, kind: 'player' }
}

function manhattan(a: Position, b: Position): number {
  return Math.abs(a.row - b.row) + Math.abs(a.column - b.column)
}

/** Tier 5: 撤退（血量過低）。 */
function generateRetreat(node: AiNode, dependencies: ExecuteAiActionDependencies): AiEdge[] {
  const player = node.state.players.find((p) => p.id === node.state.activePlayerId)
  if (!player) return []
  const healthRatio = player.health / player.maxHealth
  if (healthRatio > 0.4) return []

  const threats = listHostileActors(node.state)
  if (threats.length === 0) return []

  const reachable = collectReachableCells(node.state, player)
  const threatPositions = threats.map(getHostileActorPosition)

  // 找離所有威脅最遠的可达格
  let bestCell: { cellId: string; position: Position; dist: number } | null = null
  for (const cell of reachable) {
    const minDist = Math.min(...threatPositions.map((tp) => manhattan(cell.position, tp)))
    if (minDist > 0 && (!bestCell || minDist > bestCell.dist)) {
      bestCell = { cellId: cell.cellId, position: cell.position, dist: minDist }
    }
  }
  if (!bestCell) return []

  const action: AiAction = {
    type: 'move',
    actor: makeActorRef(player.id),
    destination: bestCell.position,
    reason: `撤退：血量過低（${healthRatio.toFixed(2)}），遠離威脅`,
  }
  const cost = getAiActionStaminaCost(node.state, action)
  if (cost > node.remainingStamina) return []

  const newState = executePure(node.state, action, dependencies)
  const childNode = new AiNodeImpl(newState, action, node, cost, node.depth + 1, node.remainingStamina - cost)
  return [{ node: childNode, action, score: getTierScore(5), cost }]
}

/** Tier 5: 回基地治療。 */
function generateHeal(node: AiNode, dependencies: ExecuteAiActionDependencies): AiEdge[] {
  const player = node.state.players.find((p) => p.id === node.state.activePlayerId)
  if (!player) return []
  const healthRatio = player.health / player.maxHealth
  if (healthRatio > 0.7) return []

  // 找最近的有醫療室的據點
  const bases = node.state.bases.filter((b) => b.buildings.some((bl) => bl.type === 'infirmary'))
  if (bases.length === 0) return []

  const reachable = collectReachableCells(node.state, player)
  const reachablePositions = new Set(reachable.map((c) => `${c.position.row}-${c.position.column}`))

  // 找可达的據點
  for (const base of bases) {
    const baseKey = `${base.position.row}-${base.position.column}`
    if (!reachablePositions.has(baseKey)) continue

    const action: AiAction = {
      type: 'use-facility',
      actor: makeActorRef(player.id),
      facilityType: 'heal',
      baseId: base.id,
      reason: `回基地治療（血量 ${healthRatio.toFixed(2)}）`,
    }
    const cost = getAiActionStaminaCost(node.state, action)
    if (cost > node.remainingStamina) continue

    const newState = executePure(node.state, action, dependencies)
    const childNode = new AiNodeImpl(newState, action, node, cost, node.depth + 1, node.remainingStamina - cost)
    return [{ node: childNode, action, score: getTierScore(5), cost }]
  }

  return []
}

/** Tier 4: 攻擊鄰近敵人（能本回合击殺）。 */
function generateKillThisTurn(node: AiNode, dependencies: ExecuteAiActionDependencies): AiEdge[] {
  const playerId = node.state.activePlayerId
  const player = node.state.players.find((p) => p.id === playerId)
  if (!player) return []

  const threats = listHostileActors(node.state)
  const results: AiEdge[] = []

  for (const threat of threats) {
    const pos = getHostileActorPosition(threat)
    const dist = manhattan(player.position, pos)
    if (dist > 1) continue // 只考慮鄰近敵人

    const enemy = threat.sourceType === 'creature' ? threat.creature : threat.nest
    if (!canKillThisTurn(node.state, playerId, enemy, node.remainingStamina)) continue

    const targetRef: AiTargetRef = {
      id: enemy.id,
      kind: threat.sourceType,
      position: pos,
    }
    const action: AiAction = {
      type: 'attack',
      actor: makeActorRef(playerId),
      target: targetRef,
      reason: `本回合擊殺 ${enemy.name}`,
    }
    const cost = getAiActionStaminaCost(node.state, action)
    if (cost > node.remainingStamina) continue

    const newState = executePure(node.state, action, dependencies)
    const childNode = new AiNodeImpl(newState, action, node, cost, node.depth + 1, node.remainingStamina - cost)
    results.push({ node: childNode, action, score: getTierScore(6), cost })
  }

  return results.slice(0, MAX_BRANCHES)
}

/** Tier 4: 攻擊鄰近敵人（不可本回合击殺）。 */
function generateAttack(node: AiNode, dependencies: ExecuteAiActionDependencies): AiEdge[] {
  const playerId = node.state.activePlayerId
  const player = node.state.players.find((p) => p.id === playerId)
  if (!player) return []

  const threats = listHostileActors(node.state)
  const results: AiEdge[] = []

  for (const threat of threats) {
    const pos = getHostileActorPosition(threat)
    const dist = manhattan(player.position, pos)
    if (dist > 1) continue

    const enemy = threat.sourceType === 'creature' ? threat.creature : threat.nest
    if (canKillThisTurn(node.state, playerId, enemy, node.remainingStamina)) continue // 由 generateKillThisTurn 處理

    const targetRef: AiTargetRef = {
      id: enemy.id,
      kind: threat.sourceType,
      position: pos,
    }
    const action: AiAction = {
      type: 'attack',
      actor: makeActorRef(playerId),
      target: targetRef,
      reason: `攻擊 ${enemy.name}`,
    }
    const cost = getAiActionStaminaCost(node.state, action)
    if (cost > node.remainingStamina) continue

    const newState = executePure(node.state, action, dependencies)
    const childNode = new AiNodeImpl(newState, action, node, cost, node.depth + 1, node.remainingStamina - cost)
    results.push({ node: childNode, action, score: getTierScore(4), cost })
  }

  return results.slice(0, MAX_BRANCHES)
}

/** Tier 4: 移動接近敵人（多步攻擊序列的第一步）。 */
function generateMoveToEnemy(node: AiNode, dependencies: ExecuteAiActionDependencies): AiEdge[] {
  const playerId = node.state.activePlayerId
  const player = node.state.players.find((p) => p.id === playerId)
  if (!player) return []

  const threats = listHostileActors(node.state)
  const reachable = collectReachableCells(node.state, player)
  const results: AiEdge[] = []

  for (const threat of threats) {
    const pos = getHostileActorPosition(threat)
    const dist = manhattan(player.position, pos)
    if (dist <= 1) continue // 已鄰近

    // 找離敵人最近的可达格
    let bestCell: { position: Position; dist: number } | null = null
    for (const cell of reachable) {
      const cellDist = manhattan(cell.position, pos)
      if (cellDist < dist && (!bestCell || cellDist < bestCell.dist)) {
        bestCell = { position: cell.position, dist: cellDist }
      }
    }
    if (!bestCell) continue

    const action: AiAction = {
      type: 'move',
      actor: makeActorRef(playerId),
      destination: bestCell.position,
      reason: `接近 ${threat.sourceType === 'creature' ? threat.creature.name : threat.nest.name}`,
    }
    const cost = getAiActionStaminaCost(node.state, action)
    if (cost > node.remainingStamina) continue

    const newState = executePure(node.state, action, dependencies)
    const childNode = new AiNodeImpl(newState, action, node, cost, node.depth + 1, node.remainingStamina - cost)
    results.push({ node: childNode, action, score: getTierScore(4), cost })
  }

  return results.slice(0, MAX_BRANCHES)
}

/** Tier 3: 採集資源。 */
function generateCollectResource(node: AiNode, dependencies: ExecuteAiActionDependencies): AiEdge[] {
  const playerId = node.state.activePlayerId
  const player = node.state.players.find((p) => p.id === playerId)
  if (!player) return []

  const reachable = collectReachableCells(node.state, player)
  const reachableSet = new Set(reachable.map((c) => c.cellId))
  const results: AiEdge[] = []

  for (const resource of node.state.resourcePoints) {
    if (!reachableSet.has(`${resource.position.row}-${resource.position.column}`)) continue
    if (resource.health <= 0) continue

    const action: AiAction = {
      type: 'collect',
      actor: makeActorRef(playerId),
      target: { id: resource.id, kind: 'resource', position: resource.position },
      reason: `採集 ${resource.name}`,
    }
    const cost = getAiActionStaminaCost(node.state, action)
    if (cost > node.remainingStamina) continue

    const newState = executePure(node.state, action, dependencies)
    const childNode = new AiNodeImpl(newState, action, node, cost, node.depth + 1, node.remainingStamina - cost)
    results.push({ node: childNode, action, score: getTierScore(3), cost })
  }

  return results.slice(0, MAX_BRANCHES)
}

/** Tier 2: 探索（移動到未探索格）。 */
function generateExplore(node: AiNode, dependencies: ExecuteAiActionDependencies): AiEdge[] {
  const playerId = node.state.activePlayerId
  const player = node.state.players.find((p) => p.id === playerId)
  if (!player) return []

  const reachable = collectReachableCells(node.state, player)
  const results: AiEdge[] = []

  // 找未探索的可达格
  for (const cell of reachable) {
    if (cell.cost <= 0) continue // 原地不探索
    const cellState = node.state.map.cells.find((c) => c.id === cell.cellId)
    if (!cellState) continue
    const visibility = getCellVisibility(node.state, playerId, cellState)
    if (visibility === 'visible') continue

    const action: AiAction = {
      type: 'move',
      actor: makeActorRef(playerId),
      destination: cell.position,
      reason: `探索新區域`,
    }
    const cost = getAiActionStaminaCost(node.state, action)
    if (cost > node.remainingStamina) continue

    const newState = executePure(node.state, action, dependencies)
    const childNode = new AiNodeImpl(newState, action, node, cost, node.depth + 1, node.remainingStamina - cost)
    results.push({ node: childNode, action, score: getTierScore(2), cost })
  }

  return results.slice(0, MAX_BRANCHES)
}

/**
 * 取得所有相鄰節點（所有 Tier 的生成器合併）。
 * 按 Tier 降序排列，每層剪枝 MAX_BRANCHES 個。
 */
export function getAdjacentNodes(
  node: AiNode,
  dependencies: ExecuteAiActionDependencies,
): AiEdge[] {
  const allEdges: AiEdge[] = [
    ...generateKillThisTurn(node, dependencies),   // Tier 6
    ...generateRetreat(node, dependencies),        // Tier 5
    ...generateHeal(node, dependencies),           // Tier 5
    ...generateAttack(node, dependencies),         // Tier 4
    ...generateMoveToEnemy(node, dependencies),    // Tier 4
    ...generateCollectResource(node, dependencies),// Tier 3
    ...generateExplore(node, dependencies),        // Tier 2
  ]

  // 按分數降序排列，取前 MAX_BRANCHES 個
  allEdges.sort((a, b) => b.score - a.score)
  return allEdges.slice(0, MAX_BRANCHES)
}
