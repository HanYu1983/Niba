import type { GameState, PlayerState } from '../../types'
import { getAdjacentPositions } from '../../types'
import type { AiAction, AiActorRef } from '../aiAction'
import type { GoalName, GoalResult } from './goals'
import { collectReachableCells } from '../perception/reachablePositions'
import { getBlockedPositions } from '../perception/blockedPositions'
import { canTraverseTerrain, getTerrainStaminaCost } from '../../rules/playerDerivedRules'
import { getPlayerVisibleCellIds } from '../../rules/visibilityRules'
import { externalSkillCatalog } from '../../catalogs/externalSkillCatalog'
import { validateAiAction } from '../validation/validateAiAction'
import { executeAiAction, type ExecuteAiActionDependencies } from '../execution/executeAiAction'

/**
 * 從指定位置出發，用 Dijkstra 計算到所有可达格的最短路徑成本。
 * 回傳 cellId → cost 的 Map（起點 cost = 0）。
 */
function buildCostMapFrom(
  state: GameState,
  start: { row: number; column: number },
  player: PlayerState,
): Map<string, number> {
  const cellsByPosition = new Map(
    state.map.cells.map((c) => [`${c.row}-${c.column}`, c]),
  )
  const blockedKeys = new Set(
    getBlockedPositions(state, player.id).map((p) => `${p.row}-${p.column}`),
  )
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

/**
 * 從玩家的相鄰可達格中，找出沿最短路徑最接近目標的格子。
 * 使用 Dijkstra 從目標反向建最短路徑樹，取代 manhattan 距離。
 */
function findClosestReachablePosition(state: GameState, player: PlayerState, targetPosition: { row: number; column: number }): { row: number; column: number } {
  const reachable = collectReachableCells(state, player)
  if (reachable.length === 0) return player.position

  // 目標本身與玩家相鄰且可達
  const distToTarget = Math.abs(player.position.row - targetPosition.row) + Math.abs(player.position.column - targetPosition.column)
  if (distToTarget <= 1) {
    const targetReachable = reachable.find((c) => c.position.row === targetPosition.row && c.position.column === targetPosition.column)
    if (targetReachable) return targetPosition
  }

  // 只取相鄰格（cost > 0 表示不是原地，manhattan ≤ 1 表示相鄰）
  const adjacents = reachable.filter((c) => {
    if (c.cost === 0) return false
    const d = Math.abs(c.position.row - player.position.row) + Math.abs(c.position.column - player.position.column)
    return d <= 1
  })

  if (adjacents.length === 0) return player.position

  // 從目標位置建最短路徑樹
  const targetCosts = buildCostMapFrom(state, targetPosition, player)

  // 從相鄰格中選「沿最短路徑最接近目標」的格子
  const best = adjacents.reduce((best, c) => {
    const dBest = targetCosts.get(best.cellId) ?? Infinity
    const dC = targetCosts.get(c.cellId) ?? Infinity
    return dC < dBest ? c : best
  })
  return best.position
}

/**
 * 生成行動序列 + 逐步驗證 + 逐步 apply。
 *
 * 每個 action 先 validateAiAction（含體力檢查），通過後 executeAiAction 產出新 GameState。
 * 新 GameState 作為下一步的驗證基準。任何一步失敗 → 回傳空陣列（整組放棄）。
 */
export function buildValidatedActionSequence(
  goal: GoalName,
  result: GoalResult,
  state: GameState,
  player: PlayerState,
  dependencies: ExecuteAiActionDependencies,
): AiAction[] {
  const actions = buildActionSequence(goal, result, state, player)
  if (actions.length === 0) return []

  let current = state
  for (const action of actions) {
    const validation = validateAiAction(current, action)
    if (!validation.valid) return []
    const outcome = executeAiAction(current, action, dependencies)
    if (!outcome.result.ok) return []
    current = outcome.state
  }
  return actions
}

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
    case 'construction':
      return buildConstructionActions(actor, result, state, player)
    case 'exploration':
      return buildExplorationActions(actor, result, state, player)
    case 'engageCombat':
      return buildEngageCombatActions(actor, result, state, player)
    case 'allocateAttributes':
      return buildAllocateAttributeActions(actor, result)
    case 'useItem':
      return buildUseItemActions(actor, result)
    case 'equipEquipment':
      return buildEquipActions(actor, result)
    case 'attackNest':
      return buildAttackNestActions(actor, result, state, player)
    case 'equipInnerSkill':
      return buildEquipInnerSkillActions(actor, result)
    case 'useInnerSkillAttack':
      return buildUseInnerSkillAttackActions(actor, result, state, player)
    case 'learnMartialSkill':
      return buildLearnSkillActions(actor, result, state, player)
    case 'practiceSkill':
      return buildPracticeSkillActions(actor, result, state, player)
    case 'executeMission':
      return buildMissionActions(actor, result, state, player)
    case 'repairEquipment':
      return buildRepairActions(actor, result, state, player)
    case 'buildDefense':
      return buildDefenseActions(actor, result, state, player)
  }
}

// ─── selfPreservation ──────────────────────────────────────────────

function buildRetreatActions(
  actor: AiActorRef,
  result: GoalResult,
  state: GameState,
  player: PlayerState,
): AiAction[] {
  if (!result.target) {
    return [{ type: 'hold', actor, reason: '保命：無目標，原地待命' }]
  }

  // 回據點醫治：往據點方向移動
  if (result.target.kind === 'return-to-base-heal') {
    const moveDest = findClosestReachablePosition(state, player, result.target.position)
    if (moveDest.row === player.position.row && moveDest.column === player.position.column) {
      return [{ type: 'hold', actor, reason: '保命：已在據點，原地待命' }]
    }
    return [{
      type: 'move',
      actor,
      destination: moveDest,
      reason: `保命：回據點醫治（血量比=${result.context?.healthRatio ?? '?'}）`,
    }]
  }

  // 使用醫療室就醫
  if (result.target.kind === 'use-facility' && result.target.facilityType === 'heal') {
    const healTarget = result.target
    const base = state.bases.find((b) => b.id === healTarget.baseId)
    if (!base) return [{ type: 'hold', actor, reason: '保命：據點不存在' }]
    const moveDest = findClosestReachablePosition(state, player, base.position)
    if (moveDest.row === player.position.row && moveDest.column === player.position.column) {
      // 已在據點旁 → 使用醫療室
      return [{
        type: 'use-facility',
        actor,
        baseId: base.id,
        facilityType: 'heal',
        reason: `保命：使用醫療室就醫（血量比=${result.context?.healthRatio ?? '?'}）`,
      }]
    }
    return [{
      type: 'move',
      actor,
      destination: moveDest,
      reason: `保命：移動到據點使用醫療室`,
    }]
  }

  if (result.target.kind !== 'retreat') {
    return [{ type: 'hold', actor, reason: '保命：無逃離方向，原地待命' }]
  }

  // 找視野內最近威脅位置
  const visibleCellIds = getPlayerVisibleCellIds(state, player.id)
  const cellsByPosition = new Map(state.map.cells.map((c) => [`${c.row}-${c.column}`, c]))
  const nearestThreat = state.creatures
    .filter((c) => {
      if (c.health <= 0) return false
      const cell = cellsByPosition.get(`${c.position.row}-${c.position.column}`)
      return cell != null && visibleCellIds.has(cell.id)
    })
    .sort((a, b) => {
      const da = Math.abs(a.position.row - player.position.row) + Math.abs(a.position.column - player.position.column)
      const db = Math.abs(b.position.row - player.position.row) + Math.abs(b.position.column - player.position.column)
      return da - db
    })[0]

  if (!nearestThreat) {
    return [{ type: 'hold', actor, reason: '保命：無威脅，原地待命' }]
  }

  // 只取相鄰可達格，選離威脅最遠的
  const reachable = collectReachableCells(state, player)
  const adjacents = reachable.filter((c) => {
    if (c.cost === 0) return false
    const d = Math.abs(c.position.row - player.position.row) + Math.abs(c.position.column - player.position.column)
    return d <= 1
  })

  if (adjacents.length === 0) {
    return [{ type: 'hold', actor, reason: '保命：無可移動鄰格，原地待命' }]
  }

  const threatPos = nearestThreat.position
  const bestEscape = adjacents.reduce((best, c) => {
    const dBest = Math.abs(best.position.row - threatPos.row) + Math.abs(best.position.column - threatPos.column)
    const dC = Math.abs(c.position.row - threatPos.row) + Math.abs(c.position.column - threatPos.column)
    return dC > dBest ? c : best
  })

  return [{
    type: 'move',
    actor,
    destination: bestEscape.position,
    reason: `保命：逃離 ${nearestThreat.name}（hitsSurvivable=${result.context?.hitsSurvivable ?? '?'}）`,
  }]
}

// ─── collectItems ──────────────────────────────────────────────────

function buildCollectItemActions(
  actor: AiActorRef,
  result: GoalResult,
  state: GameState,
  player: PlayerState,
): AiAction[] {
  if (!result.target || result.target.kind !== 'item') {
    return [{ type: 'hold', actor, reason: '收集道具：無可撿道具' }]
  }

  const target = result.target
  const onSameCell = player.position.row === target.position.row && player.position.column === target.position.column

  if (onSameCell) {
    return [{
      type: 'collect',
      actor,
      target: { id: target.id, kind: 'item', position: target.position },
      reason: '收集道具：拾取',
    }]
  }

  const moveDest = findClosestReachablePosition(state, player, target.position)
  return [
    {
      type: 'move',
      actor,
      destination: moveDest,
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

  if (result.target?.kind === 'follow-player') {
    const moveDest = findClosestReachablePosition(state, player, result.target.position)
    if (moveDest.row === player.position.row && moveDest.column === player.position.column) {
      return [{ type: 'hold', actor, reason: '定位：已在支援距離內' }]
    }
    return [{
      type: 'move',
      actor,
      destination: moveDest,
      reason: `定位：跟隨支援目標 (${result.target.position.row},${result.target.position.column})`,
    }]
  }

  // 有出口 → 移動到最近出口
  if (result.target?.kind === 'exit') {
    const moveDest = findClosestReachablePosition(state, player, result.target.position)
    return [{
      type: 'move',
      actor,
      destination: moveDest,
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

// ─── construction ──────────────────────────────────────────────────

function buildConstructionActions(
  actor: AiActorRef,
  result: GoalResult,
  state: GameState,
  player: PlayerState,
): AiAction[] {
  const action = result.context?.action as string | undefined

  // build：直接蓋建築
  if (result.target?.kind === 'build') {
    return [{
      type: 'build',
      actor,
      baseId: result.target.baseId,
      buildingType: result.target.buildingId,
      reason: `建設：建造 ${result.target.buildingName}`,
    }]
  }

  if (result.target?.kind === 'upgrade') {
    return [{
      type: 'upgrade',
      actor,
      baseId: result.target.baseId,
      buildingId: result.target.buildingId,
      reason: `建設：升級 ${result.target.buildingName} 至 Lv.${result.target.nextLevel}`,
    }]
  }

  // collect：已在資源點旁，採集
  if (action === 'collect' && result.target?.kind === 'resource-point') {
    return [{
      type: 'collect',
      actor,
      target: { id: result.target.resourcePointId, kind: 'resource', position: result.target.position },
      reason: '建設：採集建料',
    }]
  }

  // move-to-resource：移動到資源點
  if (action === 'move-to-resource' && result.target?.kind === 'resource-point') {
    const moveDest = findClosestReachablePosition(state, player, result.target.position)
    return [{
      type: 'move',
      actor,
      destination: moveDest,
      reason: '建設：移動到資源點',
    }]
  }

  // move-to-base-for-build：建料滿但不在據點旁，移動到據點
  if (action === 'move-to-base-for-build' && result.context?.baseId) {
    const base = state.bases.find((candidate) => candidate.id === result.context?.baseId)
    if (!base) return [{ type: 'hold', actor, reason: '建設：找不到目標據點' }]
    const moveDest = findClosestReachablePosition(state, player, base.position)
    return [{
      type: 'move',
      actor,
      destination: moveDest,
      reason: '建設：移動到據點準備建造',
    }]
  }

  // work：據點未 active，嘗試採集資源
  if (action === 'work') {
    return [{ type: 'hold', actor, reason: '打工：據點未啟用，採集資源中' }]
  }

  return [{ type: 'hold', actor, reason: '建設：無行動需求' }]
}

// ─── exploration ──────────────────────────────────────────────────

function buildExplorationActions(
  actor: AiActorRef,
  result: GoalResult,
  state: GameState,
  player: PlayerState,
): AiAction[] {
  if (result.target?.kind === 'explore') {
    const moveDest = findClosestReachablePosition(state, player, result.target.position)
    if (moveDest.row === player.position.row && moveDest.column === player.position.column) {
      return [{
        type: 'hold',
        actor,
        reason: '探索：剩餘體力不足以移動到下一格，原地待命',
      }]
    }
    return [{
      type: 'move',
      actor,
      destination: moveDest,
      reason: `探索：移動到未探索格 (${result.target.position.row},${result.target.position.column})`,
    }]
  }

  // 無未探索格 → 回據點
  const bases = state.bases.filter((b) => b.health > 0)
  if (bases.length > 0) {
    const nearestBase = bases.reduce((best, b) => {
      const dBest = Math.abs(best.position.row - player.position.row) + Math.abs(best.position.column - player.position.column)
      const dB = Math.abs(b.position.row - player.position.row) + Math.abs(b.position.column - player.position.column)
      return dB < dBest ? b : best
    })
    const moveDest = findClosestReachablePosition(state, player, nearestBase.position)
    if (moveDest.row !== player.position.row || moveDest.column !== player.position.column) {
      return [{
        type: 'move',
        actor,
        destination: moveDest,
        reason: `探索：無未探索格，回據點 ${nearestBase.name}`,
      }]
    }
  }

  return [{ type: 'hold', actor, reason: '探索：無未探索格' }]
}

// ─── engageCombat ───────────────────────────────────────────────

function buildEngageCombatActions(
  actor: AiActorRef,
  result: GoalResult,
  state: GameState,
  player: PlayerState,
): AiAction[] {
  if (!result.target || result.target.kind !== 'attack') {
    return [{ type: 'hold', actor, reason: '交戰：無可攻擊目標' }]
  }

  const targetId = (result.target as { targetId?: string }).targetId
  if (!targetId) {
    return [{ type: 'hold', actor, reason: '交戰：無可攻擊目標' }]
  }

  const creature = state.creatures.find((c) => c.id === targetId)
  if (!creature || creature.health <= 0) {
    return [{ type: 'hold', actor, reason: '交戰：目標無效' }]
  }

  const targetPosition = creature.position
  const dist = Math.abs(targetPosition.row - player.position.row) + Math.abs(targetPosition.column - player.position.column)

  // 相鄰 → 直接攻擊
  if (dist <= 1) {
    return [{
      type: 'attack',
      actor,
      target: { id: creature.id, kind: 'creature', position: targetPosition },
      reason: `交戰：攻擊 ${creature.name}`,
    }]
  }

  // 不相鄰 → 先移動再攻擊
  const moveDest = findClosestReachablePosition(state, player, targetPosition)
  return [
    {
      type: 'move',
      actor,
      destination: moveDest,
      reason: `交戰：移動到 ${creature.name} 附近`,
    },
    {
      type: 'attack',
      actor,
      target: { id: creature.id, kind: 'creature', position: targetPosition },
      reason: `交戰：攻擊 ${creature.name}`,
    },
  ]
}

// ─── allocateAttributes ─────────────────────────────────────────

function buildAllocateAttributeActions(
  actor: AiActorRef,
  result: GoalResult,
): AiAction[] {
  if (!result.target || result.target.kind !== 'allocate-attribute') {
    return [{ type: 'hold', actor, reason: '屬性分配：無可分配屬性' }]
  }

  return [{
    type: 'allocate-attribute',
    actor,
    attribute: result.target.attribute as 'armStrength',
    reason: `屬性分配：提升 ${result.target.attribute}`,
  }]
}

// ─── useItem ────────────────────────────────────────────────────

function buildUseItemActions(
  actor: AiActorRef,
  result: GoalResult,
): AiAction[] {
  if (!result.target || result.target.kind !== 'use-item') {
    return [{ type: 'hold', actor, reason: '使用道具：無可用道具' }]
  }

  return [{
    type: 'use-item',
    actor,
    itemId: result.target.itemId,
    reason: `使用道具：${result.context?.name ?? result.target.itemId}`,
  }]
}

// ─── equipEquipment ────────────────────────────────────────────

function buildEquipActions(
  actor: AiActorRef,
  result: GoalResult,
): AiAction[] {
  if (!result.target || result.target.kind !== 'equip') {
    return [{ type: 'hold', actor, reason: '裝備：無可裝備物品' }]
  }

  return [{
    type: 'equip',
    actor,
    instanceId: result.target.instanceId,
    reason: `裝備：${result.context?.name ?? result.target.instanceId}（${result.context?.slot ?? ''}）`,
  }]
}

// ─── attackNest ────────────────────────────────────────────────

function buildAttackNestActions(
  actor: AiActorRef,
  result: GoalResult,
  state: GameState,
  player: PlayerState,
): AiAction[] {
  if (!result.target || result.target.kind !== 'attack') {
    return [{ type: 'hold', actor, reason: '打巢穴：無目標' }]
  }

  // 找最近巢穴
  const nest = state.creatureNests
    .filter((n) => n.health > 0)
    .sort((a, b) => {
      const da = Math.abs(a.position.row - player.position.row) + Math.abs(a.position.column - player.position.column)
      const db = Math.abs(b.position.row - player.position.row) + Math.abs(b.position.column - player.position.column)
      return da - db
    })[0]

  if (!nest) {
    return [{ type: 'hold', actor, reason: '打巢穴：無可攻擊巢穴' }]
  }

  const dist = Math.abs(nest.position.row - player.position.row) + Math.abs(nest.position.column - player.position.column)

  if (dist <= 1) {
    return [{
      type: 'attack',
      actor,
      target: { id: nest.id, kind: 'nest', position: nest.position },
      reason: `打巢穴：攻擊 ${nest.name}`,
    }]
  }

  const moveDest = findClosestReachablePosition(state, player, nest.position)
  return [
    {
      type: 'move',
      actor,
      destination: moveDest,
      reason: `打巢穴：移動到 ${nest.name} 附近`,
    },
    {
      type: 'attack',
      actor,
      target: { id: nest.id, kind: 'nest', position: nest.position },
      reason: `打巢穴：攻擊 ${nest.name}`,
    },
  ]
}

// ─── equipInnerSkill ──────────────────────────────────────────

function buildEquipInnerSkillActions(
  actor: AiActorRef,
  result: GoalResult,
): AiAction[] {
  if (!result.target || result.target.kind !== 'equip-inner-skill') {
    return [{ type: 'hold', actor, reason: '裝備功法：無可裝備功法' }]
  }

  return [{
    type: 'equip-inner-skill',
    actor,
    skillId: result.target.skillId,
    reason: `裝備功法：${result.context?.skillName ?? result.target.skillId}`,
  }]
}

// ─── useInnerSkillAttack ─────────────────────────────────────

function buildUseInnerSkillAttackActions(
  actor: AiActorRef,
  result: GoalResult,
  state: GameState,
  player: PlayerState,
): AiAction[] {
  if (!result.target || result.target.kind !== 'use-inner-skill-attack') {
    return [{ type: 'hold', actor, reason: '使用功法：無可用目標' }]
  }

  // 找最近的怪物
  const nearestCreature = state.creatures
    .filter((c) => c.health > 0)
    .sort((a, b) => {
      const da = Math.abs(a.position.row - player.position.row) + Math.abs(a.position.column - player.position.column)
      const db = Math.abs(b.position.row - player.position.row) + Math.abs(b.position.column - player.position.column)
      return da - db
    })[0]

  if (!nearestCreature) {
    return [{ type: 'hold', actor, reason: '使用功法：無可攻擊生物' }]
  }

  const dist = Math.abs(nearestCreature.position.row - player.position.row) + Math.abs(nearestCreature.position.column - player.position.column)

  if (dist <= 1) {
    return [{
      type: 'attack',
      actor,
      target: { id: nearestCreature.id, kind: 'creature', position: nearestCreature.position },
      reason: `使用功法攻擊：${nearestCreature.name}`,
    }]
  }

  const moveDest = findClosestReachablePosition(state, player, nearestCreature.position)
  return [
    {
      type: 'move',
      actor,
      destination: moveDest,
      reason: `使用功法：移動到 ${nearestCreature.name} 附近`,
    },
    {
      type: 'attack',
      actor,
      target: { id: nearestCreature.id, kind: 'creature', position: nearestCreature.position },
      reason: `使用功法攻擊：${nearestCreature.name}`,
    },
  ]
}

// ─── learnMartialSkill ────────────────────────────────────────

function buildLearnSkillActions(
  actor: AiActorRef,
  result: GoalResult,
  state: GameState,
  player: PlayerState,
): AiAction[] {
  if (!result.target || result.target.kind !== 'learn-skill') {
    return [{ type: 'hold', actor, reason: '學招：無可學技能' }]
  }
  const target = result.target

  // 門派學招：移動到門派據點附近
  if (target.gateId) {
    const gate = (state.sectGates ?? []).find((g) => g.id === target.gateId)
    if (!gate) return [{ type: 'hold', actor, reason: '學招：門派據點不存在' }]
    const dist = Math.abs(player.position.row - gate.position.row) + Math.abs(player.position.column - gate.position.column)
    if (dist <= 1) {
      return [{
        type: 'learn-skill',
        actor,
        gateId: gate.id,
        skillType: 'inner',
        skillId: target.skillId,
        reason: `學招：學習門派功法 ${result.context?.name ?? target.skillId}`,
      }]
    }
    const moveDest = findClosestReachablePosition(state, player, gate.position)
    return [{
      type: 'move',
      actor,
      destination: moveDest,
      reason: `學招：移動到門派據點`,
    }]
  }

  // 武館學招：移動到據點附近
  if (target.baseId) {
    const base = state.bases.find((b) => b.id === target.baseId)
    if (!base) return [{ type: 'hold', actor, reason: '學招：據點不存在' }]
    const dist = Math.abs(player.position.row - base.position.row) + Math.abs(player.position.column - base.position.column)
    if (dist <= 1) {
      return [{
        type: 'learn-skill',
        actor,
        baseId: base.id,
        skillType: target.skillType,
        skillId: target.skillId,
        reason: `學招：學習武館功法 ${result.context?.name ?? target.skillId}`,
      }]
    }
    const moveDest = findClosestReachablePosition(state, player, base.position)
    return [{
      type: 'move',
      actor,
      destination: moveDest,
      reason: `學招：移動到武館據點`,
    }]
  }

  return [{ type: 'hold', actor, reason: '學招：無目標' }]
}

// ─── practiceSkill ────────────────────────────────────────────

function buildPracticeSkillActions(
  actor: AiActorRef,
  result: GoalResult,
  state: GameState,
  player: PlayerState,
): AiAction[] {
  if (!result.target || result.target.kind !== 'practice-skill') {
    return [{ type: 'hold', actor, reason: '練功：無可練技能' }]
  }
  const target = result.target

  const gate = (state.sectGates ?? []).find((g) => g.id === target.gateId)
  if (!gate) return [{ type: 'hold', actor, reason: '練功：門派據點不存在' }]

  const dist = Math.abs(player.position.row - gate.position.row) + Math.abs(player.position.column - gate.position.column)
  if (dist <= 1) {
    return [{
      type: 'practice-skill',
      actor,
      gateId: gate.id,
      skillId: target.skillId,
      reason: `練功：練習功法 ${result.context?.name ?? target.skillId}`,
    }]
  }

  const moveDest = findClosestReachablePosition(state, player, gate.position)
  return [{
    type: 'move',
    actor,
    destination: moveDest,
    reason: `練功：移動到門派據點`,
  }]
}

// ─── executeMission ───────────────────────────────────────────

function buildMissionActions(
  actor: AiActorRef,
  result: GoalResult,
  state: GameState,
  player: PlayerState,
): AiAction[] {
  if (!result.target || result.target.kind !== 'use-facility') {
    return [{ type: 'hold', actor, reason: '任務：無告示牌' }]
  }
  const target = result.target

  const base = state.bases.find((b) => b.id === target.baseId)
  if (!base) return [{ type: 'hold', actor, reason: '任務：據點不存在' }]

  const dist = Math.abs(player.position.row - base.position.row) + Math.abs(player.position.column - base.position.column)
  if (dist <= 1) {
    return [{
      type: 'use-facility',
      actor,
      baseId: base.id,
      facilityType: 'mission',
      reason: '任務：執行告示牌任務',
    }]
  }

  const moveDest = findClosestReachablePosition(state, player, base.position)
  return [{
    type: 'move',
    actor,
    destination: moveDest,
    reason: `任務：移動到告示牌據點`,
  }]
}

// ─── repairEquipment ──────────────────────────────────────────

function buildRepairActions(
  actor: AiActorRef,
  result: GoalResult,
  state: GameState,
  player: PlayerState,
): AiAction[] {
  if (!result.target || result.target.kind !== 'use-facility') {
    return [{ type: 'hold', actor, reason: '修理：無受損裝備' }]
  }
  const target = result.target

  const base = state.bases.find((b) => b.id === target.baseId)
  if (!base) return [{ type: 'hold', actor, reason: '修理：據點不存在' }]

  const dist = Math.abs(player.position.row - base.position.row) + Math.abs(player.position.column - base.position.column)
  if (dist <= 1) {
    return [{
      type: 'use-facility',
      actor,
      baseId: base.id,
      facilityType: 'repair',
      reason: '修理：使用工坊修理裝備',
    }]
  }

  const moveDest = findClosestReachablePosition(state, player, base.position)
  return [{
    type: 'move',
    actor,
    destination: moveDest,
    reason: `修理：移動到工坊據點`,
  }]
}

// ─── buildDefense ─────────────────────────────────────────────

function buildDefenseActions(
  actor: AiActorRef,
  result: GoalResult,
  state: GameState,
  player: PlayerState,
): AiAction[] {
  if (!result.target || result.target.kind !== 'defense-build') {
    return [{ type: 'hold', actor, reason: '防禦建設：無可建造設施' }]
  }
  const target = result.target

  const base = state.bases.find((b) => b.id === target.baseId)
  if (!base) return [{ type: 'hold', actor, reason: '防禦建設：據點不存在' }]

  const dist = Math.abs(player.position.row - base.position.row) + Math.abs(player.position.column - base.position.column)
  if (dist <= 1) {
    return [{
      type: 'defense-build',
      actor,
      baseId: base.id,
      structureType: target.structureType,
      position: base.position,
      reason: `防禦建設：建造 ${result.context?.structureName ?? target.structureType}`,
    }]
  }

  const moveDest = findClosestReachablePosition(state, player, base.position)
  return [{
    type: 'move',
    actor,
    destination: moveDest,
    reason: `防禦建設：移動到據點`,
  }]
}
