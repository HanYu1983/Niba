import { describe, expect, it } from 'vitest'
import { progressionExternalSkills, progressionInnerSkills } from './skillProgressionCatalog'
import { functionalSkillBuffBindings, functionalExternalSkillDescriptions, getFunctionalSkillBuffIds } from './functionalSkillRegistry'
import { buffCatalog } from './buffCatalog'
import { allExternalSkillCatalog, getMartialHallSkills, martialHallExternalSkillCatalog, martialHallInnerSkillCatalog } from './martialHallSkillCatalog'
import { jianghuExternalSkills } from './jianghuExternalSkillCatalog'

describe('skillProgressionCatalog', () => {
  it('提供六個流派且每個流派都有一個內功、傷害外功、機能外功與輕功', () => {
    expect(progressionInnerSkills).toHaveLength(6)
    expect(progressionExternalSkills).toHaveLength(18)

    for (const skills of [progressionInnerSkills, progressionExternalSkills]) {
      const levelsBySchool = new Map<string, number[]>()
      for (const skill of skills) {
        const school = (skill as typeof skill & { school: string }).school
        const level = (skill as typeof skill & { level: number }).level
        levelsBySchool.set(school, [...(levelsBySchool.get(school) ?? []), level])
      }
      expect(levelsBySchool.size).toBe(6)
      for (const levels of levelsBySchool.values()) expect(levels.every((level) => level === 1)).toBe(true)
    }
  })

  it('每個流派都有一個傷害外功、一個機能外功與一個門派輕功', () => {
    for (const schoolId of ['golden-body', 'swift-wind', 'scarlet-flame', 'frost-water', 'earth-mountain', 'void-spirit']) {
      const schoolSkills = progressionExternalSkills.filter((skill) => skill.schoolId === schoolId)
      // 傷害外功：無 functionalEffect
      expect(schoolSkills.filter((skill) => !skill.functionalEffect)).toHaveLength(1)
      // 機能外功：有 functionalEffect 且非輕功
      expect(schoolSkills.filter((skill) => skill.functionalEffect && !skill.lootExcluded)).toHaveLength(1)
      // 門派輕功：有 functionalEffect 且 lootExcluded
      expect(schoolSkills.filter((skill) => skill.lootExcluded)).toHaveLength(1)
    }
  })

  it('內功由一級武館學習，傷害型外功需要二級武館，功能型外功與輕功需要三級武館', () => {
    expect(progressionInnerSkills.every((skill) => skill.requiredHallLevel === 1)).toBe(true)
    expect(progressionExternalSkills.filter((skill) => !skill.functionalEffect).every((skill) => skill.requiredHallLevel === 2)).toBe(true)
    expect(progressionExternalSkills.filter((skill) => skill.functionalEffect).every((skill) => skill.requiredHallLevel === 3)).toBe(true)
  })

  it('武館販售目錄只包含太虛流進階功法', async () => {
    expect(martialHallInnerSkillCatalog.filter((skill) => skill.school)).toHaveLength(1)
    expect(martialHallExternalSkillCatalog.filter((skill) => skill.school)).toHaveLength(3)
    expect(martialHallInnerSkillCatalog.filter((skill) => skill.school).every((skill) => skill.school === '太虛流')).toBe(true)
    expect(martialHallExternalSkillCatalog.filter((skill) => skill.school).every((skill) => skill.school === '太虛流')).toBe(true)
  })

  it('每個機能型外功與輕功都有具體效果描述', () => {
    const functionalSkills = progressionExternalSkills.filter((skill) => skill.functionalEffect)

    expect(functionalSkills).toHaveLength(12)
    for (const skill of functionalSkills) {
      const effect = skill.functionalEffect as keyof typeof functionalExternalSkillDescriptions
      expect(skill.description).not.toContain('技能型外功')
      expect(skill.description).toContain(functionalExternalSkillDescriptions[effect])
      expect(skill.formulaDescription).toBe(functionalExternalSkillDescriptions[effect])
    }
  })

  it('功能型外功 registry 對應的 Buff 都存在於 buffCatalog', () => {
    for (const [effect, buffIds] of Object.entries(functionalSkillBuffBindings)) {
      // experience-gain 不掛 Buff，為合法例外。
      if (buffIds.length === 0) continue
      for (const buffId of buffIds) {
        expect(buffCatalog.some((buff) => buff.id === buffId), `effect ${effect} → buff ${buffId}`).toBe(true)
      }
      expect(getFunctionalSkillBuffIds(effect as never)).toEqual(buffIds)
    }
  })

  it('所有外功法使用的 functionalEffect 都在 registry 有對應 Buff', () => {
    for (const skill of allExternalSkillCatalog) {
      if (!skill.functionalEffect) continue
      expect(getFunctionalSkillBuffIds(skill.functionalEffect as never).length > 0 || skill.functionalEffect === 'experience-gain',
        `功法 ${skill.id} 的效果 ${skill.functionalEffect} 應有對應 Buff`).toBe(true)
    }
  })
})

describe('江湖外功功法（無門派）', () => {
  it('提供 9 個江湖靈氣型外功，對應 9 個 Buff', () => {
    expect(jianghuExternalSkills).toHaveLength(9)
    expect(jianghuExternalSkills.every((skill) => !skill.schoolId)).toBe(true)
    expect(jianghuExternalSkills.every((skill) => skill.target === 'self')).toBe(true)
    expect(jianghuExternalSkills.every((skill) => skill.category === 'aura')).toBe(true)
    expect(jianghuExternalSkills.every((skill) => skill.functionalEffect)).toBe(true)
    // 輕功已改為門派專屬，不再屬於江湖外功。
    expect(jianghuExternalSkills.every((skill) => !skill.id.includes('step'))).toBe(true)
  })

  it('回春功為強化型外功，主動施放回復自身 20% 血量', () => {
    const skill = allExternalSkillCatalog.find((candidate) => candidate.id === 'jianghu-spring-return')
    expect(skill).toBeDefined()
    expect(skill!.category).toBe('enhancement')
    expect(skill!.target).toBe('self')
    expect(skill!.activationEffect).toEqual({ kind: 'heal-self-percent', percent: 0.2 })
  })

  it('江湖外功已加入完整功法池', () => {
    for (const skill of jianghuExternalSkills) {
      expect(allExternalSkillCatalog.some((candidate) => candidate.id === skill.id)).toBe(true)
    }
  })

  it('江湖外功不可在武館學習（只透過怪物/巢穴掉落）', () => {
    // 無門派據點：提供全部門派功法，但不含江湖功法。
    const allSchoolSkills = getMartialHallSkills(undefined).external
    const voidSpiritSkills = getMartialHallSkills('void-spirit').external
    for (const skill of jianghuExternalSkills) {
      expect(allSchoolSkills.some((candidate) => candidate.id === skill.id)).toBe(false)
      expect(voidSpiritSkills.some((candidate) => candidate.id === skill.id)).toBe(false)
    }
    // 江湖功法仍保留在完整功法池（供怪物/巢穴掉落查找）。
    expect(allExternalSkillCatalog.some((candidate) => candidate.id === jianghuExternalSkills[0].id)).toBe(true)
  })

  it('每個江湖外功都有具體效果描述', () => {
    for (const skill of jianghuExternalSkills) {
      const effect = skill.functionalEffect as keyof typeof functionalExternalSkillDescriptions
      expect(skill.description).not.toContain('技能型外功')
      expect(skill.formulaDescription).toBe(functionalExternalSkillDescriptions[effect])
    }
  })
})
