import type { AiPersonalityId } from '../../types/ai'

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
  return Math.max(0, Math.min(1,
    (Math.max(0, context.attributeGain) * 0.18 + Math.max(0, context.durabilityRatio) * 0.15 + replacementBonus)
      * personalityMultiplier(context.personality),
  ))
}

export function computeInnerSkillCandidateValue(context: InnerSkillValueContext): number {
  return Math.max(0, Math.min(1,
    (Math.max(0, context.damageGainRatio) * 0.75 + Math.max(0, Math.min(1, context.insightRatio)) * 0.25)
      * personalityMultiplier(context.personality),
  ))
}