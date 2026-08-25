import type { Position } from '../../types'
import { trapezoid, fuzzyAnd, fuzzyOr } from './membershipFunctions'
import type { FuzzyInputs } from './fuzzyInputs'

export type GoalName = 'selfPreservation' | 'collectItems' | 'positioning' | 'construction' | 'exploration' | 'engageCombat' | 'allocateAttributes' | 'useItem'

export interface GoalResult {
  score: number
  target?: GoalTarget
  context?: Record<string, unknown>
}

export type GoalTarget =
  | { kind: 'retreat'; escapeDirection: Position }
  | { kind: 'item'; id: string; position: Position }
  | { kind: 'attack'; targetId: string; targetType: 'creature' | 'nest'; position: Position }
  | { kind: 'exit'; position: Position }
  | { kind: 'build'; baseId: string; buildingId: string; buildingName: string }
  | { kind: 'resource-point'; resourcePointId: string; position: Position }
  | { kind: 'explore'; position: Position }
  | { kind: 'allocate-attribute'; attribute: string }
  | { kind: 'use-item'; itemId: string }

// ─── selfPreservation ──────────────────────────────────────────────

export function evaluateSelfPreservation(inputs: FuzzyInputs): GoalResult {
  const { hitsSurvivable, staminaRatio, distToNearestThreat } = inputs

  // hitsSurvivable < 2 → LOW 高（危險）；> 5 → HIGH 高（安全）
  const f_hitsLow = trapezoid(hitsSurvivable, 0, 0, 1.5, 3)
  const f_staminaDepleted = trapezoid(staminaRatio, 0, 0, 0.1, 0.2)
  const f_threatClose = trapezoid(distToNearestThreat, 0, 0, 2, 4)

  const score = fuzzyOr(
    f_hitsLow,
    f_staminaDepleted,
    fuzzyAnd(f_hitsLow, f_threatClose),
  )

  // 逃離方向：遠離最近威脅（V1 簡化：往威脅反方向）
  const escapeDirection: Position | undefined = distToNearestThreat < Infinity
    ? { row: 0, column: 0 } // V1: 佔位，由 goalActionMapper 計算具體方向
    : undefined

  return {
    score,
    target: escapeDirection ? { kind: 'retreat', escapeDirection } : undefined,
    context: { hitsSurvivable, distToNearestThreat },
  }
}

// ─── collectItems ──────────────────────────────────────────────────

export function evaluateCollectItems(inputs: FuzzyInputs): GoalResult {
  const { reachableItemCount, staminaRatio, distToNearestItem } = inputs

  const f_manyItems = trapezoid(reachableItemCount, 0, 0, 3, 5)    // >=5 → 1.0, >=3 → 0.6
  const f_staminaHigh = trapezoid(staminaRatio, 0.7, 0.85, 1, 1)
  const f_hasItems = trapezoid(reachableItemCount, 0, 0, 1, 2)     // 有道具就 > 0

  let score = fuzzyOr(
    fuzzyAnd(f_manyItems, f_staminaHigh),
    f_hasItems,
  )

  // 距離衰減
  if (distToNearestItem > 5) {
    score *= 0.7
  }

  // 最近道具作為 target（V1: 取第一個，後續可改為最佳選擇）
  const bestItem = inputs.reachableInterests.find((i) => i.kind === 'item' as const)

  return {
    score,
    target: bestItem
      ? { kind: 'item', id: bestItem.ref.id, position: bestItem.position }
      : undefined,
    context: { reachableItemCount, distToNearestItem },
  }
}

// ─── engageCombat ───────────────────────────────────────────────
// 附近有怪物 → 高分；體力充足 + 血量健康 → 加分

function evaluateEngageCombat(inputs: FuzzyInputs): GoalResult {
  const { distToNearestCreature, staminaRatio, hitsSurvivable, nearestCreatureId } = inputs

  if (!nearestCreatureId || distToNearestCreature === Infinity) {
    return { score: 0 }
  }

  const f_closeCreature = distToNearestCreature <= 1
    ? 1
    : distToNearestCreature <= 3
      ? 0.7
      : 0.3

  const f_staminaHigh = trapezoid(staminaRatio, 0.4, 0.6, 1, 1)
  const f_healthy = trapezoid(hitsSurvivable, 3, 5, 10, 10)

  const score = fuzzyAnd(fuzzyOr(f_closeCreature, f_healthy), fuzzyOr(f_staminaHigh, f_closeCreature))

  return {
    score,
    target: { kind: 'attack', targetId: nearestCreatureId, targetType: 'creature', position: { row: -1, column: -1 } },
    context: { distToNearestCreature, nearestCreatureId },
  }
}

// ─── allocateAttributes ─────────────────────────────────────────
// 有可分配屬性點 → 分數 = 1（最高優先）

function evaluateAllocateAttributes(inputs: FuzzyInputs): GoalResult {
  const { availableAttributePoints } = inputs

  if (availableAttributePoints <= 0) {
    return { score: 0 }
  }

  // V1：固定分配 armStrength（攻擊力）
  return {
    score: 1,
    target: { kind: 'allocate-attribute', attribute: 'armStrength' },
    context: { availableAttributePoints },
  }
}

// ─── useItem ────────────────────────────────────────────────────
// 有值得用的道具 → 高分

function evaluateUseItem(inputs: FuzzyInputs): GoalResult {
  const { bestItemToUse } = inputs

  if (!bestItemToUse) {
    return { score: 0 }
  }

  // 回血/回體力道具根據需求程度給分
  if (bestItemToUse.effect === 'health' || bestItemToUse.effect === 'stamina') {
    const score = bestItemToUse.effect === 'health' ? 0.8 : 0.6
    return {
      score,
      target: { kind: 'use-item', itemId: bestItemToUse.id },
      context: { effect: bestItemToUse.effect, name: bestItemToUse.name },
    }
  }

  // 探地符/回營符等：中等分數
  return {
    score: 0.4,
    target: { kind: 'use-item', itemId: bestItemToUse.id },
    context: { effect: bestItemToUse.effect, name: bestItemToUse.name },
  }
}

// ─── evaluateAllGoals ──────────────────────────────────────────────

export function evaluateAllGoals(inputs: FuzzyInputs): Record<GoalName, GoalResult> {
  return {
    selfPreservation: evaluateSelfPreservation(inputs),
    collectItems: evaluateCollectItems(inputs),
    positioning: evaluatePositioning(inputs),
    construction: evaluateConstruction(inputs),
    exploration: evaluateExploration(inputs),
    engageCombat: evaluateEngageCombat(inputs),
    allocateAttributes: evaluateAllocateAttributes(inputs),
    useItem: evaluateUseItem(inputs),
  }
}

// ─── construction ──────────────────────────────────────────────────
// 建料滿 + 可蓋 → 高分 build；建料不足 + 有資源點 → 移動/採集

function evaluateConstruction(inputs: FuzzyInputs): GoalResult {
  const { materialRatio, canBuild, buildableBuilding, nearestBase, nearestResourcePoint, distToNearestResourcePoint, isAdjacentToResourcePoint } = inputs

  // 情境 A：建料滿 + 可建造 → 高分 + build target
  if (materialRatio >= 1 && canBuild && buildableBuilding && nearestBase) {
    return {
      score: 0.9,
      target: { kind: 'build', baseId: nearestBase.id, buildingId: buildableBuilding.id, buildingName: buildableBuilding.name },
      context: { materialRatio, action: 'build' },
    }
  }

  // 情境 B：已與資源點相鄰 → 採集（高分）
  if (isAdjacentToResourcePoint && nearestResourcePoint) {
    return {
      score: 0.8,
      target: { kind: 'resource-point', resourcePointId: nearestResourcePoint.id, position: nearestResourcePoint.position },
      context: { materialRatio, action: 'collect' },
    }
  }

  // 情境 C：建料不足 + 有資源點 → 移動到資源點（中高分）
  if (materialRatio < 1 && nearestResourcePoint && distToNearestResourcePoint < Infinity) {
    return {
      score: 0.5,
      target: { kind: 'resource-point', resourcePointId: nearestResourcePoint.id, position: nearestResourcePoint.position },
      context: { materialRatio, distToNearestResourcePoint, action: 'move-to-resource' },
    }
  }

  // 無據點或無資源點 → 低分
  return {
    score: nearestBase ? 0.1 : 0,
    context: { materialRatio },
  }
}

// ─── exploration ──────────────────────────────────────────────────
// 預設目標：有未探索可達格 → 高分 + 移動到最近的未探索格

function evaluateExploration(inputs: FuzzyInputs): GoalResult {
  const { unexploredReachableCount, nearestUnexploredPosition, staminaRatio } = inputs

  if (unexploredReachableCount === 0 || !nearestUnexploredPosition) {
    return { score: 0 }
  }

  // 未探索格越多分數越高，體力充足時加分
  const baseScore = Math.min(1, unexploredReachableCount / 10)
  const score = staminaRatio > 0.3 ? baseScore : baseScore * 0.5

  return {
    score,
    target: { kind: 'explore', position: nearestUnexploredPosition },
    context: { unexploredReachableCount },
  }
}

// ─── positioning ──────────────────────────────────────────────────
// 出口越少 → 分數越高；無出口且有怪 → attack target；有出口 → exit target

export function evaluatePositioning(inputs: FuzzyInputs): GoalResult {
  const { exitCount, distToNearestThreat, nearestExit } = inputs

  // 出口越少分數越高：0 → 1.0, 1 → 0.667, 2 → 0.333, >=3 → 0
  const f_fewExits = exitCount >= 3 ? 0 : (3 - exitCount) / 3

  // 無出口時的危險加成：周圍有怪則更高
  const f_threatClose = trapezoid(distToNearestThreat, 0, 0, 2, 4)
  const score = exitCount === 0
    ? Math.min(1, f_fewExits + f_threatClose * 0.3)
    : f_fewExits

  // target：無出口 → 用 nearestCreature（由 mapper 找最近怪）；有出口 → exit
  let target: GoalTarget | undefined
  if (exitCount === 0 && distToNearestThreat < Infinity) {
    // attack target：由 mapper 從 state 中找最近 creature
    target = { kind: 'attack', targetId: '', targetType: 'creature', position: { row: -1, column: -1 } }
  } else if (nearestExit) {
    target = { kind: 'exit', position: nearestExit }
  }

  return {
    score,
    target,
    context: { exitCount, distToNearestThreat },
  }
}
