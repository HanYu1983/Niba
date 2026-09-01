export type ValueContext = {
  need: number
  benefit: number
  urgency: number
  risk: number
  cost: number
  distance: number
  personalityWeight: number
}

export function clampValue(value: number): number {
  return Math.max(0, Math.min(1, value))
}

export function distanceDecay(distance: number): number {
  return Math.max(0, 1 - Math.min(10, Math.max(0, distance)) * 0.05)
}

/** 統一候選價值聚合器；合法性仍由規則與 action validation 負責。 */
export function computeUnifiedValue(context: ValueContext): number {
  return clampValue(
    clampValue(context.need)
      * clampValue(context.benefit)
      * clampValue(context.urgency)
      * (1 - clampValue(context.risk) * 0.5)
      * (1 - clampValue(context.cost) * 0.3)
      * distanceDecay(context.distance)
      * Math.max(0, context.personalityWeight),
  )
}