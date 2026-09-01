import type { AiPersonalityId } from '../../types/ai'

export type CombatValueContext = {
  distance: number
  healthRatio: number
  damageRatio: number
  hitsSurvivable: number
  level: number
  personality?: AiPersonalityId
}

/** 計算可見生物的相對攻擊價值；目標合法性由 action validation 處理。 */
export function computeCombatCandidateValue(context: CombatValueContext): number {
  const proximity = Math.max(0, 1 - Math.min(10, context.distance) * 0.05)
  const killOpportunity = Math.min(1, context.damageRatio * 1.5)
  const vulnerability = Math.max(0, Math.min(1, 1 - context.healthRatio))
  const survival = Math.max(0, Math.min(1, context.hitsSurvivable / 5))
  const levelReward = Math.max(0, Math.min(1, context.level / 10))
  const riskPenalty = context.hitsSurvivable < 1 ? 0.45 : context.hitsSurvivable < 2 ? 0.75 : 1
  const personalityMultiplier = context.personality === 'aggressive' ? 1.15
    : context.personality === 'cautious' || context.personality === 'guardian' ? 0.85
      : 1

  return Math.max(0, Math.min(1,
    (killOpportunity * 0.45 + vulnerability * 0.2 + survival * 0.15 + levelReward * 0.2)
      * proximity
      * riskPenalty
      * personalityMultiplier,
  ))
}