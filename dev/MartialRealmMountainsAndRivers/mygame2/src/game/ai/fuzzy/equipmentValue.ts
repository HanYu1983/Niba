import type { AiPersonalityId } from '../../types/ai'
import { clampValue, computeUnifiedValue } from './valueContext'

export type EquipmentValueContext = {
  attributeGain: number
  durabilityRatio: number
  replacesBroken: boolean
  personality?: AiPersonalityId
}

export type InnerSkillValueContext = {
  damageGainRatio: number
  insightRatio: number
  personality?: AiPersonalityId
}

function personalityMultiplier(personality: AiPersonalityId | undefined): number {
  return personality === 'scholar' ? 1.15 : personality === 'cautious' ? 1.05 : 1
}

export function computeEquipmentCandidateValue(context: EquipmentValueContext): number {
  const replacementBonus = context.replacesBroken ? 0.25 : 0
  const benefit = Math.max(0, context.attributeGain) * 0.18 + Math.max(0, context.durabilityRatio) * 0.15 + replacementBonus
  return computeUnifiedValue({
    need: clampValue(benefit),
    benefit: clampValue(benefit),
    urgency: context.replacesBroken ? 1 : 0.8,
    risk: clampValue(1 - context.durabilityRatio),
    cost: 0,
    distance: 0,
    personalityWeight: personalityMultiplier(context.personality),
  })
}

export function computeInnerSkillCandidateValue(context: InnerSkillValueContext): number {
  const benefit = Math.max(0, context.damageGainRatio) * 0.75 + Math.max(0, Math.min(1, context.insightRatio)) * 0.25
  return computeUnifiedValue({
    need: clampValue(benefit),
    benefit: clampValue(benefit),
    urgency: 0.8,
    risk: 0,
    cost: clampValue(context.insightRatio),
    distance: 0,
    personalityWeight: personalityMultiplier(context.personality),
  })
}