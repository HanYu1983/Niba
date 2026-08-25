import type { GoalName, GoalResult } from './goals'

/** 最低門檻：所有目標分數低於此值時原地待命 */
export const MIN_THRESHOLD = 0.2

/** selfPreservation 覆寫門檻：高於此值時 engageCombat 歸零（V1 暫無 engageCombat） */
export const SELF_PRESERVATION_OVERRIDE = 0.6

/** tie-breaking 優先級：分數相同時依此順序選擇 */
const PRIORITY_ORDER: GoalName[] = [
  'selfPreservation',
  'collectItems',
]

/**
 * 從加權後的目標分數中選出最佳目標。
 * argmax + tie-breaking by PRIORITY_ORDER。
 */
export function selectBestGoal(weightedResults: Record<GoalName, GoalResult>): { goal: GoalName; result: GoalResult } {
  let bestGoal: GoalName = PRIORITY_ORDER[0]
  let bestScore = -1

  for (const goal of PRIORITY_ORDER) {
    const score = weightedResults[goal].score
    if (score > bestScore) {
      bestScore = score
      bestGoal = goal
    }
  }

  return { goal: bestGoal, result: weightedResults[bestGoal] }
}
