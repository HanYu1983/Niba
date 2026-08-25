import type { GoalName, GoalResult } from './goals'

/** 最低門檻：所有目標分數低於此值時原地待命 */
export const MIN_THRESHOLD = 0.2

/** selfPreservation 覆寫門檻：高於此值時 engageCombat 歸零 */
export const SELF_PRESERVATION_OVERRIDE = 0.6

/** tie-breaking 優先級：分數相同時依此順序選擇 */
const PRIORITY_ORDER: GoalName[] = [
  'selfPreservation',
  'allocateAttributes',
  'equipEquipment',
  'positioning',
  'engageCombat',
  'collectItems',
  'useItem',
  'construction',
  'exploration',
]

/**
 * 從加權後的目標分數中選出最佳目標。
 * argmax + tie-breaking by PRIORITY_ORDER。
 */
export function selectBestGoal(weightedResults: Record<GoalName, GoalResult>): { goal: GoalName; result: GoalResult } {
  const allGoals = Object.keys(weightedResults) as GoalName[]
  let bestGoal: GoalName = allGoals[0]
  let bestScore = -1

  for (const goal of allGoals) {
    const score = weightedResults[goal].score
    if (score > bestScore) {
      bestScore = score
      bestGoal = goal
    }
  }

  // tie-breaking：若有並列最高分，依 PRIORITY_ORDER 決勝
  const tiedGoals = allGoals.filter((g) => weightedResults[g].score === bestScore)
  if (tiedGoals.length > 1) {
    for (const p of PRIORITY_ORDER) {
      if (tiedGoals.includes(p)) {
        bestGoal = p
        break
      }
    }
  }

  return { goal: bestGoal, result: weightedResults[bestGoal] }
}
