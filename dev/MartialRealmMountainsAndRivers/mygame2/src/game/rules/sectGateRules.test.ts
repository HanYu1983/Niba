import { describe, expect, it } from 'vitest'
import {
  SECT_GATE_LEARN_COST,
  getSkillRequiredSectGateLevel,
  getSectGateLearnCost,
  getSectGateSkills,
} from './sectGateRules'

describe('sectGateRules', () => {
  it('門派據點提供該門派一內功、一傷害外功、一技能外功與一輕功', () => {
    const { inner, damage, functional, lightFoot } = getSectGateSkills('void-spirit')
    expect(inner?.id).toBe('void-spirit-inner')
    expect(damage?.id).toBe('void-spirit-external-damage')
    expect(functional?.id).toBe('void-spirit-external-functional')
    expect(lightFoot?.id).toBe('void-spirit-external-light-foot')
  })

  it('門派功法不再有等級鎖定，一律解鎖', () => {
    expect(getSkillRequiredSectGateLevel('void-spirit', 'void-spirit-inner')).toBe(1)
    expect(getSkillRequiredSectGateLevel('void-spirit', 'void-spirit-external-damage')).toBe(1)
    expect(getSkillRequiredSectGateLevel('void-spirit', 'void-spirit-external-functional')).toBe(1)
    expect(getSkillRequiredSectGateLevel('void-spirit', 'void-spirit-external-light-foot')).toBe(1)
  })

  it('學習門派功法固定花費 30 金錢', () => {
    expect(SECT_GATE_LEARN_COST).toBe(30)
    const all = ['void-spirit-inner', 'void-spirit-external-damage', 'void-spirit-external-functional', 'void-spirit-external-light-foot']
    for (const skillId of all) {
      expect(getSectGateLearnCost('void-spirit', skillId)).toBe(30)
    }
  })
})