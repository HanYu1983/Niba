import type { GoalName } from './goals'
import type { AiPersonalityId } from '../../types/ai'

export type AiGoalConstraints = {
  allowedGoals?: readonly GoalName[]
  goalWeights?: Partial<Record<GoalName, number>>
  goalThresholds?: Partial<Record<GoalName, number>>
  followTarget?: { position: { row: number; column: number }; maxDistance: number }
  forcedCombatTarget?: { id: string; position: { row: number; column: number } }
}

const ALL_GOALS: GoalName[] = [
  'selfPreservation', 'collectItems', 'positioning', 'construction', 'exploration',
  'engageCombat', 'allocateAttributes', 'useItem', 'equipEquipment', 'attackNest',
  'equipInnerSkill', 'useInnerSkillAttack', 'learnMartialSkill', 'practiceSkill',
  'executeMission', 'repairEquipment', 'buildDefense', 'buyConsumable', 'buyEquipment',
]

export const AI_PERSONALITY_PROFILES: Record<AiPersonalityId, AiGoalConstraints> = {
  balanced: { goalWeights: { construction: 1.15 } },
  aggressive: { goalWeights: { engageCombat: 1.5, attackNest: 1.3, selfPreservation: 0.8 }, goalThresholds: { selfPreservation: 0.15 } },
  cautious: { goalWeights: { selfPreservation: 1.5, useItem: 1.2, engageCombat: 0.6 }, goalThresholds: { selfPreservation: 0.15 } },
  builder: { goalWeights: { construction: 1.5, buildDefense: 1.3, executeMission: 1.2 } },
  explorer: { goalWeights: { exploration: 1.5, collectItems: 1.2, engageCombat: 0.7 } },
  // 護衛型：跟隨並保護人類玩家（fuzzy 命令下自動設定 followTarget）。
  guardian: { goalWeights: { selfPreservation: 1.3, engageCombat: 1.2, positioning: 1.5, construction: 0.7, exploration: 0.5, executeMission: 0.6 } },
  // 經營型：任務、建設、採集為主，戰鬥為輔。
  economist: { goalWeights: { executeMission: 1.5, construction: 1.3, collectItems: 1.2, engageCombat: 0.7, attackNest: 0.6 } },
  // 修煉型：學招、練功、裝備功法為主。
  scholar: { goalWeights: { learnMartialSkill: 1.5, practiceSkill: 1.5, equipInnerSkill: 1.3, equipEquipment: 1.2, engageCombat: 0.8 } },
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
