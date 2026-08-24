import { describe, expect, it } from 'vitest'
import {
  SECT_GATE_LEARN_COST,
  getSkillRequiredSectGateLevel,
  getSectGateLearnCost,
  getSectGateSkills,
} from './sectGateRules'

describe('sectGateRules', () => {
  it('門派據點提供該門派內功、傷害外功與靈氣外功（允許同類型多本）', () => {
    const { inner, damage, aura } = getSectGateSkills('void-spirit')
    expect(inner.map((skill) => skill.id)).toContain('void-spirit-inner')
    expect(damage.map((skill) => skill.id)).toContain('void-spirit-external-damage')
    expect(aura.map((skill) => skill.id)).toContain('void-spirit-external-functional')
  })

  it('門派功法不再有等級鎖定，一律解鎖', () => {
    expect(getSkillRequiredSectGateLevel('void-spirit', 'void-spirit-inner')).toBe(1)
    expect(getSkillRequiredSectGateLevel('void-spirit', 'void-spirit-external-damage')).toBe(1)
    expect(getSkillRequiredSectGateLevel('void-spirit', 'void-spirit-external-functional')).toBe(1)
  })

  it('學習門派功法固定花費 30 金錢', () => {
    expect(SECT_GATE_LEARN_COST).toBe(30)
    const all = ['void-spirit-inner', 'void-spirit-external-damage', 'void-spirit-external-functional']
    for (const skillId of all) {
      expect(getSectGateLearnCost('void-spirit', skillId)).toBe(30)
    }
  })
})