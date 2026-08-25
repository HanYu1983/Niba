import type { Position } from '../../types'
import { trapezoid, fuzzyAnd, fuzzyOr } from './membershipFunctions'
import type { FuzzyInputs } from './fuzzyInputs'

export type GoalName = 'selfPreservation' | 'collectItems' | 'positioning'

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

// ─── evaluateAllGoals ──────────────────────────────────────────────

export function evaluateAllGoals(inputs: FuzzyInputs): Record<GoalName, GoalResult> {
  return {
    selfPreservation: evaluateSelfPreservation(inputs),
    collectItems: evaluateCollectItems(inputs),
    positioning: evaluatePositioning(inputs),
  }
}

// ─── positioning ──────────────────────────────────────────────────
// 出口越少 → 分數越高；無出口且有怪 → attack target；有出口 → exit target

function evaluatePositioning(inputs: FuzzyInputs): GoalResult {
  const { exitCount, distToNearestThreat, nearestExit } = inputs

  // 出口越少分數越高：0 exits → 1.0, 1 → 0.7, 2 → 0.3, >=3 → 0
  const f_fewExits = trapezoid(exitCount, 0, 0, 2, 3)

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
