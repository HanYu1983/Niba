import { describe, expect, it } from 'vitest'
import { computeEquipmentCandidateValue, computeInnerSkillCandidateValue } from './equipmentValue'

describe('equipment and inner-skill candidate values', () => {
  it('屬性提升越高，裝備價值越高', () => {
    expect(computeEquipmentCandidateValue({ attributeGain: 4, durabilityRatio: 1, replacesBroken: false }))
      .toBeGreaterThan(computeEquipmentCandidateValue({ attributeGain: 1, durabilityRatio: 1, replacesBroken: false }))
  })

  it('替換損壞裝備時有額外價值', () => {
    expect(computeEquipmentCandidateValue({ attributeGain: 0, durabilityRatio: 1, replacesBroken: true }))
      .toBeGreaterThan(computeEquipmentCandidateValue({ attributeGain: 0, durabilityRatio: 1, replacesBroken: false }))
  })

  it('內功傷害提升越高，候選價值越高', () => {
    expect(computeInnerSkillCandidateValue({ damageGainRatio: 0.8, insightRatio: 0.5 }))
      .toBeGreaterThan(computeInnerSkillCandidateValue({ damageGainRatio: 0.2, insightRatio: 0.5 }))
  })

  it('修煉型提高內功候選價值', () => {
    expect(computeInnerSkillCandidateValue({ damageGainRatio: 0.4, insightRatio: 0.5, personality: 'scholar' }))
      .toBeGreaterThan(computeInnerSkillCandidateValue({ damageGainRatio: 0.4, insightRatio: 0.5 }))
  })
})
