export type AiOrderStatus = 'active' | 'paused' | 'completed' | 'failed'

export type AiPersonalityId = 'balanced' | 'aggressive' | 'cautious' | 'builder' | 'explorer'

export type AiPersonalityProfile = {
  id: AiPersonalityId
  goalWeights: Partial<Record<import('../ai/fuzzy/goals').GoalName, number>>
  goalThresholds?: Partial<Record<import('../ai/fuzzy/goals').GoalName, number>>
}

export type AiOrder =
  | {
      id: string
      type: 'protect-base'
      aiPlayerId: string
      baseId: string
      radius: number
      priority: number
      retreatHealthPercent: number
      status: AiOrderStatus
    }
  | {
      id: string
      type: 'support-player'
      aiPlayerId: string
      playerId: string
      maxDistance: number
      priority: number
      retreatHealthPercent: number
      status: AiOrderStatus
    }
  | {
      id: string
      type: 'fuzzy'
      aiPlayerId: string
      personality?: AiPersonalityId
      priority: number
      status: AiOrderStatus
    }

export type AiConstructionPolicy = 'defense' | 'economy' | 'frontline' | 'balanced' | 'paused'

export type AiConstructionPlanItem = {
  buildingType: string
  priority: number
  status: 'planned' | 'building' | 'completed' | 'blocked' | 'cancelled'
  blockedReason?: string
}

export type AiConstructionPlan = {
  aiPlayerId: string
  baseId: string
  policy: AiConstructionPolicy
  allowUpgrade: boolean
  queue: AiConstructionPlanItem[]
}