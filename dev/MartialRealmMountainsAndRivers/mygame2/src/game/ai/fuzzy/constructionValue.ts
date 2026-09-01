import type { AiPersonalityId } from '../../types/ai'

export type ConstructionValueContext = {
  kind: 'build' | 'upgrade'
  buildingType: string
  cost: number
  materialRatio: number
  threatCountNearBase: number
  distanceToBase: number
  personality?: AiPersonalityId
}

const BASE_BENEFIT: Record<string, number> = {
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

function clamp(value: number): number {
  return Math.max(0, Math.min(1, value))
}

/** 計算合法建設候選的相對價值；合法性由呼叫端處理。 */
export function computeConstructionCandidateValue(context: ConstructionValueContext): number {
  const benefit = BASE_BENEFIT[context.buildingType] ?? 0.55
  const personalityMultiplier = PERSONALITY_BONUS[context.personality ?? 'balanced']?.[context.buildingType] ?? 1
  const materialNeed = clamp(context.materialRatio)
  const threatUrgency = context.threatCountNearBase > 0 && (context.buildingType === 'arrow-tower' || context.buildingType === 'advanced-arrow-tower')
    ? clamp(0.6 + context.threatCountNearBase * 0.1)
    : context.threatCountNearBase > 0 ? 0.35 : 0.7
  const costPressure = clamp(context.cost / 100)
  const distanceDecay = Math.max(0, 1 - Math.min(10, context.distanceToBase) * 0.05)
  const upgradeBonus = context.kind === 'upgrade' ? 1.05 : 1

  return clamp(
    benefit
      * personalityMultiplier
      * (0.4 + materialNeed * 0.6)
      * threatUrgency
      * (1 - costPressure * 0.25)
      * distanceDecay
      * upgradeBonus,
  )
}