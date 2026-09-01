import type { AiPersonalityId } from '../../types/ai'
import { clampValue, computeUnifiedValue } from './valueContext'

export type CombatValueContext = {
  distance: number
  healthRatio: number
  damageRatio: number
  hitsSurvivable: number
  staminaRatio: number
  level: number
  personality?: AiPersonalityId
}

/** 計算可見生物的相對攻擊價值；目標合法性由 action validation 處理。 */
export function computeCombatCandidateValue(context: CombatValueContext): number {
  const killOpportunity = clampValue(context.damageRatio * 1.5)
  const vulnerability = clampValue(1 - context.healthRatio)
  const survival = clampValue(context.hitsSurvivable / 5)
  const levelReward = clampValue(context.level / 10)
  const risk = context.hitsSurvivable < 1 ? 1 : context.hitsSurvivable < 2 ? 0.5 : 0
  const personalityMultiplier = context.personality === 'aggressive' ? 1.15
    : context.personality === 'cautious' || context.personality === 'guardian' ? 0.85
      : 1

  return computeUnifiedValue({
    need: clampValue(0.5 + context.staminaRatio * 0.5),
    benefit: killOpportunity * 0.45 + vulnerability * 0.2 + survival * 0.15 + levelReward * 0.2,
    urgency: killOpportunity,
    risk,
    cost: clampValue(1 - context.staminaRatio),
    distance: context.distance,
    personalityWeight: personalityMultiplier,
  })
}