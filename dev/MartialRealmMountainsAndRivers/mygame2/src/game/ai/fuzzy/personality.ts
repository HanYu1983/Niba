import type { GoalName } from './goals'
import type { AiPersonalityId } from '../../types/ai'

export type AiGoalConstraints = {
  allowedGoals?: readonly GoalName[]
  goalWeights?: Partial<Record<GoalName, number>>
  goalThresholds?: Partial<Record<GoalName, number>>
}

const ALL_GOALS: GoalName[] = [
  'selfPreservation', 'collectItems', 'positioning', 'construction', 'exploration',
  'engageCombat', 'allocateAttributes', 'useItem', 'equipEquipment', 'attackNest',
  'equipInnerSkill', 'useInnerSkillAttack', 'learnMartialSkill', 'practiceSkill',
  'executeMission', 'repairEquipment', 'buildDefense',
]

export const AI_PERSONALITY_PROFILES: Record<AiPersonalityId, AiGoalConstraints> = {
  balanced: { goalWeights: {} },
  aggressive: { goalWeights: { engageCombat: 1.5, attackNest: 1.3, selfPreservation: 0.8 }, goalThresholds: { selfPreservation: 0.15 } },
  cautious: { goalWeights: { selfPreservation: 1.5, useItem: 1.2, engageCombat: 0.6 }, goalThresholds: { selfPreservation: 0.15 } },
  builder: { goalWeights: { construction: 1.5, buildDefense: 1.3, executeMission: 1.2 } },
  explorer: { goalWeights: { exploration: 1.5, collectItems: 1.2, engageCombat: 0.7 } },
}

export function getAiGoalConstraints(
  personality: AiPersonalityId | undefined,
  allowedGoals?: readonly GoalName[],
): AiGoalConstraints {
  const profile = AI_PERSONALITY_PROFILES[personality ?? 'balanced']
  return {
    allowedGoals: allowedGoals ?? ALL_GOALS,
    goalWeights: profile.goalWeights,
    goalThresholds: profile.goalThresholds,
  }
}
