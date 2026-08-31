import { describe, expect, it } from 'vitest'
import { allExternalSkillCatalog } from '../catalogs/martialHallSkillCatalog'
import { getAuraSkillLevelOverrides, getFunctionalSkillBuffOverrides } from './functionalSkillScaling'
import { getBuff } from './playerDerivedRules'

/** 移動類靈氣 Buff：刻意維持固定值，不隨等級縮放。 */
const MOVEMENT_BUFF_IDS = new Set([
  'wall-step', 'swift-wind-movement', 'forest-step', 'desert-step', 'water-step', 'mountain-step', 'plain-step',
])

describe('所有靈氣型外功的等級縮放覆蓋完整性', () => {
  it('每個非移動類靈氣型外功都有縮放處理（functionalEffect 或 getAuraSkillLevelOverrides）', () => {
    const auraSkills = allExternalSkillCatalog.filter((skill) => skill.category === 'aura')
    expect(auraSkills.length).toBeGreaterThan(0)

    const unscaled: string[] = []
    for (const skill of auraSkills) {
      // 移動類功法刻意不縮放。
      const isMovement = (skill.passiveBuffIds ?? []).every((buffId) => MOVEMENT_BUFF_IDS.has(buffId))
      if (isMovement) continue

      // 有 functionalEffect → 走 getFunctionalSkillBuffOverrides
      if (skill.functionalEffect) {
        const definition = getBuff((skill.passiveBuffIds ?? [])[0])
        if (!definition) continue
        const overrides = getFunctionalSkillBuffOverrides(skill.functionalEffect, 3, definition)
        if (Object.keys(overrides).length === 0) unscaled.push(`${skill.id}（functionalEffect=${skill.functionalEffect}）`)
        continue
      }

      // 無 functionalEffect → 走 getAuraSkillLevelOverrides
      const definition = getBuff((skill.passiveBuffIds ?? [])[0])
      if (!definition) continue
      const overrides = getAuraSkillLevelOverrides(skill.id, 3, definition)
      if (Object.keys(overrides).length === 0) unscaled.push(`${skill.id}（無 functionalEffect）`)
    }

    expect(unscaled).toEqual([])
  })
})