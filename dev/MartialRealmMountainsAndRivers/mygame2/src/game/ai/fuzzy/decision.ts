import type { GoalName, GoalResult } from './goals'

/** 最低門檻：所有目標分數低於此值時原地待命 */
export const MIN_THRESHOLD = 0.2

/** selfPreservation 覆寫門檻：高於此值時 engageCombat 歸零 */
export const SELF_PRESERVATION_OVERRIDE = 0.6

/** tie-breaking 優先級：分數相同時依此順序選擇 */
const PRIORITY_ORDER: GoalName[] = [
  'selfPreservation',
  'allocateAttributes',
  'equipInnerSkill',
  'equipEquipment',
  'learnMartialSkill',
  'practiceSkill',
  'useInnerSkillAttack',
  'engageCombat',
  'attackNest',
  'prepareNest',
  'positioning',
  'collectItems',
  'useItem',
  'repairEquipment',
  'construction',
  'buildDefense',
  'executeMission',
  'buyConsumable',
  'buyEquipment',
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

/**
 * 回傳按分數降序排列的目標清單（同分按 PRIORITY_ORDER 決勝）。
 * 供呼叫端逐一嘗試直到找到可執行的目標。
 */
export function rankGoals(weightedResults: Record<GoalName, GoalResult>): Array<{ goal: GoalName; result: GoalResult }> {
  const allGoals = Object.keys(weightedResults) as GoalName[]

  // 先按分數降序排
  const sorted = allGoals
    .map((g) => ({ goal: g, score: weightedResults[g].score }))
    .sort((a, b) => b.score - a.score)

  // 同分者按 PRIORITY_ORDER 排序
  const priorityIndex = new Map(PRIORITY_ORDER.map((g, i) => [g, i]))
  const result: Array<{ goal: GoalName; result: GoalResult }> = []
  let i = 0
  while (i < sorted.length) {
    const currentScore = sorted[i].score
    // 取出所有同分的
    const tied: GoalName[] = []
    while (i < sorted.length && sorted[i].score === currentScore) {
      tied.push(sorted[i].goal)
      i++
    }
    // 同分內按 PRIORITY_ORDER 排
    tied.sort((a, b) => (priorityIndex.get(a) ?? 999) - (priorityIndex.get(b) ?? 999))
    for (const g of tied) {
      result.push({ goal: g, result: weightedResults[g] })
    }
  }

  return result
}
