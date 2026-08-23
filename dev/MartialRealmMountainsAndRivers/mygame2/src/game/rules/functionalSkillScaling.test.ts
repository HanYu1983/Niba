import { describe, expect, it } from 'vitest'
import { getBuff } from './playerDerivedRules'
import { getFunctionalSkillBuffOverrides } from './functionalSkillScaling'

describe('功能型外功等級縮放', () => {
  it('燎原 Lv.1 保持基礎燃燒效果', () => {
    const definition = getBuff('scarlet-flame-burning')!
    expect(getFunctionalSkillBuffOverrides('burning', 1, definition)).toMatchObject({
      maxHealthDamagePercent: 0.2,
      remainingRounds: 3,
    })
  })

  it('燎原 Lv.3 提高燃燒比例並延長持續時間', () => {
    const definition = getBuff('scarlet-flame-burning')!
    expect(getFunctionalSkillBuffOverrides('burning', 3, definition)).toMatchObject({
      maxHealthDamagePercent: 0.26,
      remainingRounds: 4,
    })
  })
})
