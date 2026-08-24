import { externalSkillCatalog, type ExternalSkill } from './externalSkillCatalog'
import { innerSkillCatalog, type InnerSkill } from './innerSkillCatalog'
import {
  martialHallExternalSkills,
  martialHallInnerSkills,
  progressionExternalSkills,
  progressionInnerSkills,
} from './skillProgressionCatalog'
import { jianghuExternalSkills, springReturnEnhancement } from './jianghuExternalSkillCatalog'
import { insightUtilityExternalSkills } from './insightUtilityExternalSkillCatalog'
import type { MartialSchoolId } from './martialSchoolCatalog'

/** 武館只販售太虛流進階功法；既有武館功法不列入商店。 */
export const martialHallInnerSkillCatalog: InnerSkill[] = martialHallInnerSkills
export const martialHallExternalSkillCatalog: ExternalSkill[] = martialHallExternalSkills

/** 完整查找目錄，供戰鬥、Buff 與已學功法使用。 */
export const allInnerSkillCatalog: InnerSkill[] = [...innerSkillCatalog, ...progressionInnerSkills]
export const allExternalSkillCatalog: ExternalSkill[] = [...externalSkillCatalog, ...progressionExternalSkills, ...jianghuExternalSkills, springReturnEnhancement, ...insightUtilityExternalSkills]

export function getMartialHallSkills(schoolId: MartialSchoolId | undefined): {
  inner: InnerSkill[]
  external: ExternalSkill[]
} {
  // 江湖功法定義為「無門派」散修功法，不經武館傳授，只透過怪物/巢穴掉落取得，
  // 故以下目錄不包含 jianghuExternalSkills。
  // 據點未定義門派（所有門派）時，提供全部門派的功法。
  if (!schoolId) {
    return {
      inner: progressionInnerSkills,
      external: progressionExternalSkills,
    }
  }
  return {
    inner: progressionInnerSkills.filter((skill) => skill.schoolId === schoolId),
    external: progressionExternalSkills.filter((skill) => skill.schoolId === schoolId),
  }
}