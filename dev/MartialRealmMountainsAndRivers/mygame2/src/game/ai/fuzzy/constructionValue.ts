import type { AiPersonalityId } from '../../types/ai'
import { clampValue, computeUnifiedValue, evaluateUnifiedValue, type ValueEvaluation } from './valueContext'

export type ConstructionValueContext = {
  kind: 'build' | 'upgrade'
  buildingType: string
  cost: number
  materialRatio: number
  threatCountNearBase: number
  distanceToBase: number
  /** 另一個未發現據點需要透過驛站才能有效抵達。 */
  waystationAccessNeed?: number
  personality?: AiPersonalityId
}

const BASE_BENEFIT: Record<string, number> = {
  waystation: 0.88,
  'equipment-shop': 0.9,
  'item-shop': 0.85,
  infirmary: 0.8,
  warehouse: 0.75,
  workshop: 0.65,
  'martial-hall': 0.7,
  'arrow-tower': 0.8,
  'advanced-arrow-tower': 0.95,
}

const PERSONALITY_BONUS: Partial<Record<AiPersonalityId, Partial<Record<string, number>>>> = {
  aggressive: { 'arrow-tower': 1.15, 'advanced-arrow-tower': 1.25 },
  builder: { warehouse: 1.2, workshop: 1.15 },
  guardian: { infirmary: 1.2, 'arrow-tower': 1.2, 'advanced-arrow-tower': 1.25 },
  economist: { warehouse: 1.25, 'item-shop': 1.15, 'equipment-shop': 1.1 },
  scholar: { 'martial-hall': 1.25, workshop: 1.1 },
}

/** 計算合法建設候選的相對價值；合法性由呼叫端處理。 */
export function evaluateConstructionCandidateValue(context: ConstructionValueContext): ValueEvaluation {
  const benefit = (BASE_BENEFIT[context.buildingType] ?? 0.55)
    + (context.buildingType === 'waystation' ? (context.waystationAccessNeed ?? 0) * 0.3 : 0)
  const personalityMultiplier = PERSONALITY_BONUS[context.personality ?? 'balanced']?.[context.buildingType] ?? 1
  const materialNeed = clampValue(context.materialRatio)
  const threatUrgency = context.threatCountNearBase > 0 && (context.buildingType === 'arrow-tower' || context.buildingType === 'advanced-arrow-tower')
    ? clampValue(0.6 + context.threatCountNearBase * 0.1)
    : context.threatCountNearBase > 0 ? 0.35 : 0.7
  const costPressure = clampValue(context.cost / 100)
  const upgradeBonus = context.kind === 'upgrade' ? 1.05 : 1

  return evaluateUnifiedValue({
    need: 0.4 + materialNeed * 0.6,
    benefit: benefit * upgradeBonus,
    urgency: threatUrgency,
    risk: 0,
    cost: costPressure * (0.25 / 0.3),
    distance: context.distanceToBase,
    personalityWeight: personalityMultiplier,
  })
}

export function computeConstructionCandidateValue(context: ConstructionValueContext): number {
  return computeUnifiedValue(evaluateConstructionCandidateValue(context).context)
}