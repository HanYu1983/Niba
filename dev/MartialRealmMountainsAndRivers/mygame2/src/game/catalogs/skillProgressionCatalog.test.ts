import { describe, expect, it } from 'vitest'
import { martialSchoolCatalog, progressionExternalSkills, progressionInnerSkills } from './skillProgressionCatalog'
import { functionalSkillBuffBindings, getFunctionalSkillBuffIds } from './functionalSkillRegistry'
import { buffCatalog } from './buffCatalog'
import { allExternalSkillCatalog, getMartialHallSkills, martialHallExternalSkillCatalog, martialHallInnerSkillCatalog } from './martialHallSkillCatalog'
import { jianghuExternalSkills } from './jianghuExternalSkillCatalog'

describe('skillProgressionCatalog', () => {
  it('提供十二個流派且每個流派都有內功與外功', () => {
    expect(progressionInnerSkills).toHaveLength(12)
    // 每個門派：至少一個傷害型與靈氣型；赤焰/寒水/百毒另有 debuff 傷害型。
    expect(progressionExternalSkills).toHaveLength(36)

    for (const skills of [progressionInnerSkills, progressionExternalSkills]) {
      const levelsBySchool = new Map<string, number[]>()
      for (const skill of skills) {
        const school = (skill as typeof skill & { school: string }).school
        const level = (skill as typeof skill & { level: number }).level
        levelsBySchool.set(school, [...(levelsBySchool.get(school) ?? []), level])
      }
      expect(levelsBySchool.size).toBe(12)
      for (const levels of levelsBySchool.values()) expect(levels.every((level) => level === 1)).toBe(true)
    }
  })

  it('五行元素各由兩個門派守護', () => {
    for (const element of ['none', 'metal', 'wood', 'water', 'fire', 'earth'] as const) {
      const schools = martialSchoolCatalog.filter((school) => school.element === element)
      expect(schools, `element ${element}`).toHaveLength(2)
    }
  })

  it('每個流派都有傷害型與靈氣型外功；赤炎/寒水/百毒另有 debuff 傷害型', () => {
    for (const schoolId of ['golden-body', 'swift-wind', 'scarlet-flame', 'frost-water', 'earth-mountain', 'void-spirit', 'hundred-poison', 'sharp-edge', 'misty-rain', 'blazing-sun', 'yellow-earth', 'ghost-shadow']) {
      const schoolSkills = progressionExternalSkills.filter((skill) => skill.schoolId === schoolId)
      // 每個門派都有基礎傷害型外功。
      expect(schoolSkills.filter((skill) => skill.category === 'damage' && skill.id.endsWith('-external-damage'))).toHaveLength(1)
      // 每個門派至少都有一個靈氣型外功（含輕功效果）；同類功法數量不設上限。
      expect(schoolSkills.filter((skill) => skill.category === 'aura').length).toBeGreaterThan(0)
    }
    // 赤焰/寒水/百毒有額外 debuff 傷害型。
    for (const schoolId of ['scarlet-flame', 'frost-water', 'hundred-poison']) {
      const schoolSkills = progressionExternalSkills.filter((skill) => skill.schoolId === schoolId)
      expect(schoolSkills.filter((skill) => skill.category === 'damage')).toHaveLength(2)
    }
  })

  it('內功由一級武館學習，傷害型外功需要二級武館，靈氣型外功需要三級武館', () => {
    expect(progressionInnerSkills.every((skill) => skill.requiredHallLevel === 1)).toBe(true)
    expect(progressionExternalSkills.filter((skill) => skill.category === 'damage' && skill.id.endsWith('-external-damage')).every((skill) => skill.requiredHallLevel === 2)).toBe(true)
    expect(progressionExternalSkills.filter((skill) => skill.category === 'aura').every((skill) => skill.requiredHallLevel === 3)).toBe(true)
  })

  it('武館販售目錄只包含太虛流進階功法', async () => {
    expect(martialHallInnerSkillCatalog.filter((skill) => skill.school)).toHaveLength(1)
    expect(martialHallExternalSkillCatalog.filter((skill) => skill.school)).toHaveLength(3)
    expect(martialHallInnerSkillCatalog.filter((skill) => skill.school).every((skill) => skill.school === '太虛流')).toBe(true)
    expect(martialHallExternalSkillCatalog.filter((skill) => skill.school).every((skill) => skill.school === '太虛流')).toBe(true)
  })

  it('每個靈氣型外功與 debuff 型外功都有具體效果描述', () => {
    const auraSkills = progressionExternalSkills.filter((skill) => skill.category === 'aura')
    const debuffSkills = progressionExternalSkills.filter((skill) => skill.category === 'damage' && skill.id.endsWith('-external-damage-debuff'))

    // 靈氣型：必須有明確的靈氣分類與效果欄位；效果描述可由 Factory 生成。
    for (const skill of auraSkills) {
      expect(skill.description).not.toContain('技能型外功')
      expect(skill.formulaDescription.length).toBeGreaterThan(0)
      expect(skill.passiveBuffIds?.length).toBeGreaterThan(0)
    }
    // debuff 型：描述包含自身效果說明。
    for (const skill of debuffSkills) {
      expect(skill.description).not.toContain('技能型外功')
      expect(skill.description).toContain(skill.formulaDescription)
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

  it('太虛流·迴氣為常駐靈氣外功，掛載 +20% 功法經驗 Buff', () => {
    const aura = progressionExternalSkills.find((skill) => skill.name === '迴氣（悟道）')
    expect(aura).toBeDefined()
    expect(aura!.category).toBe('aura')
    expect(aura!.passiveBuffIds).toContain('void-spirit-return-qi')
    const buff = buffCatalog.find((candidate) => candidate.id === 'void-spirit-return-qi')
    expect(buff?.duration).toBe('persistent')
    expect(buff?.skillExpGainPercent).toBe(0.2)
  })
})

describe('江湖外功功法（無門派）', () => {
  it('提供 19 個江湖靈氣型外功，對應 19 個 Buff', () => {
    expect(jianghuExternalSkills).toHaveLength(19)
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
      expect(skill.description).not.toContain('技能型外功')
      expect(skill.formulaDescription.length).toBeGreaterThan(0)
    }
  })
})
