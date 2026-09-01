export type ValueContext = {
  need: number
  benefit: number
  urgency: number
  risk: number
  cost: number
  distance: number
  personalityWeight: number
}

export type ValueEvaluation = {
  value: number
  context: ValueContext
  factors: {
    need: number
    benefit: number
    urgency: number
    riskPenalty: number
    costPenalty: number
    distanceDecay: number
    personalityWeight: number
  }
}

export function clampValue(value: number): number {
  return Math.max(0, Math.min(1, value))
}

export function distanceDecay(distance: number): number {
  return Math.max(0, 1 - Math.min(10, Math.max(0, distance)) * 0.05)
}

/** 統一候選價值聚合器；合法性仍由規則與 action validation 負責。 */
export function evaluateUnifiedValue(context: ValueContext): ValueEvaluation {
  const factors = {
    need: clampValue(context.need),
    benefit: clampValue(context.benefit),
    urgency: clampValue(context.urgency),
    riskPenalty: 1 - clampValue(context.risk) * 0.5,
    costPenalty: 1 - clampValue(context.cost) * 0.3,
    distanceDecay: distanceDecay(context.distance),
    personalityWeight: Math.max(0, context.personalityWeight),
  }
  return {
    value: clampValue(
      factors.need
        * factors.benefit
        * factors.urgency
        * factors.riskPenalty
        * factors.costPenalty
        * factors.distanceDecay
        * factors.personalityWeight,
    ),
    context,
    factors,
  }
}

export function computeUnifiedValue(context: ValueContext): number {
  return evaluateUnifiedValue(context).value
}