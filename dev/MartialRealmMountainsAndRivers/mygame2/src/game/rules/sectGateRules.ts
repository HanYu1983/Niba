import type { ExternalSkill } from '../catalogs/externalSkillCatalog'
import type { InnerSkill } from '../catalogs/innerSkillCatalog'
import type { MartialSchoolId } from '../catalogs/martialSchoolCatalog'
import { progressionInnerSkills, progressionExternalSkills } from '../catalogs/skillProgressionCatalog'

/**
 * 門派據點規則：等級推導、功法解鎖與學習/練習代價。
 *
 * 門派據點為地圖中立設施，等級由據點自身經驗值推導（1→2→3），
 * Lv1 解鎖內功、Lv2 解鎖傷害型外功、Lv3 解鎖技能型外功。
 * 學習/練習均累積據點經驗，升級門檻約「每次動作 +20，100 升 Lv2、200 升 Lv3」。
 */

/** 門派據點等級門檻：累計消費 100 / 250 金錢後升級。 */
export const SECT_GATE_LEVEL_THRESHOLDS = {
  1: 0,
  2: 100,
  3: 250,
} as const
export const SECT_GATE_MAX_LEVEL = 3
/** 門派功法學習與練習消耗的體力。 */
export const SECT_GATE_PRACTICE_STAMINA_COST = 3
/** 學習門派功法的固定金錢消費。 */
export const SECT_GATE_LEARN_COST = 30
/** 每次練習功法增加的門派據點經驗。 */
export const SECT_GATE_PRACTICE_EXPERIENCE = 30

/** 由據點累計消費經驗推導等級。 */
export function getSectGateLevel(experience: number): 1 | 2 | 3 {
  if (experience >= SECT_GATE_LEVEL_THRESHOLDS[3]) return 3
  if (experience >= SECT_GATE_LEVEL_THRESHOLDS[2]) return 2
  return 1
}

/** 增加門派據點經驗，並同步更新其等級。 */
export function addSectGateExperience(gate: { experience: number; level: 1 | 2 | 3 }, amount: number) {
  const experience = gate.experience + Math.max(0, amount)
  return { experience, level: getSectGateLevel(experience) }
}

/** 取得某門派的全部功法（內功 / 傷害型外功 / 靈氣型外功），允許同類型有多本。 */
export function getSectGateSkills(schoolId: MartialSchoolId | undefined): {
  inner: InnerSkill[]
  damage: ExternalSkill[]
  aura: ExternalSkill[]
} {
  const inner = progressionInnerSkills.filter((skill) => skill.schoolId === schoolId)
  const damage = progressionExternalSkills.filter(
    (skill) => skill.schoolId === schoolId && skill.category === 'damage',
  )
  const aura = progressionExternalSkills.filter(
    (skill) => skill.schoolId === schoolId && skill.category === 'aura',
  )
  return { inner, damage, aura }
}

/** 學習門派功法的固定金錢消費（30 金錢）。 */
export function getSectGateLearnCost(_schoolId: MartialSchoolId, _skillId: string): number {
  return SECT_GATE_LEARN_COST
}

/** 門派功法不再有等級鎖定，一律視為解鎖（回傳 1）。 */
export function getSkillRequiredSectGateLevel(_schoolId: MartialSchoolId, _skillId: string): 1 {
  return 1
}