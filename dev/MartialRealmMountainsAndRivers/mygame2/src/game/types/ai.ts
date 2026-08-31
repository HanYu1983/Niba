export type AiOrderStatus = 'active' | 'paused' | 'completed' | 'failed'

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
      priority: number
      status: AiOrderStatus
    }
  | {
      id: string
      type: 'decision-tree'
      aiPlayerId: string
      priority: number
      status: AiOrderStatus
    }
  | {
      id: string
      type: 'graph-search'
      aiPlayerId: string
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