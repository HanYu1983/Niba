import { getSchoolElement, type SchoolElement } from '../catalogs/skillProgressionCatalog'
import type { TerrainType } from '../types'
import { getElementDamageMultiplier, isElementGenerating } from './skillRules'

/** 天地共鳴的傷害倍率。 */
export const TERRAIN_RESONANCE_DAMAGE_MULTIPLIER = 1.25
/** 親和地形施放外功時的內力減免。 */
export const TERRAIN_RESONANCE_INNER_POWER_DISCOUNT = 1
export const TERRAIN_RESONANCE_CRITICAL_RATE_BONUS = 5

const resonantTerrains: Record<Exclude<SchoolElement, 'none'>, TerrainType[]> = {
  metal: ['mountain'],
  wood: ['forest'],
  water: ['water'],
  fire: ['desert'],
  earth: ['plain'],
}

export function isTerrainResonant(skillElement: SchoolElement | undefined, terrain: TerrainType | undefined): boolean {
  if (!skillElement || skillElement === 'none' || !terrain) return false
  return resonantTerrains[skillElement].includes(terrain)
}

export function getTerrainResonanceDamageMultiplier(
  skillElement: SchoolElement | undefined,
  terrain: TerrainType | undefined,
): number {
  return isTerrainResonant(skillElement, terrain) ? TERRAIN_RESONANCE_DAMAGE_MULTIPLIER : 1
}

export function getTerrainResonanceInnerPowerDiscount(
  skillElement: SchoolElement | undefined,
  terrain: TerrainType | undefined,
): number {
  return isTerrainResonant(skillElement, terrain) ? TERRAIN_RESONANCE_INNER_POWER_DISCOUNT : 0
}

/** 金屬性功法在山嶽共鳴時的額外暴擊率。 */
export function getTerrainResonanceCriticalRateBonus(
  skillElement: SchoolElement | undefined,
  terrain: TerrainType | undefined,
): number {
  return skillElement === 'metal' && terrain === 'mountain' ? TERRAIN_RESONANCE_CRITICAL_RATE_BONUS : 0
}

export function getTerrainAtPosition(
  cells: ReadonlyArray<{ row: number; column: number; terrain: TerrainType }>,
  position: { row: number; column: number },
): TerrainType | undefined {
  return cells.find((cell) => cell.row === position.row && cell.column === position.column)?.terrain
}

export function getTerrainResonanceLabel(
  skillElement: SchoolElement | undefined,
  terrain: TerrainType | undefined,
): string | undefined {
  return isTerrainResonant(skillElement, terrain)
    ? `地形共鳴（${terrain}）：傷害 +25%、內力 -1`
    : undefined
}

/**
 * 三重共振：一次外功攻擊同時滿足「相生連攜（內功生外功）＋天地共鳴＋五行相剋」。
 * 觸發時對目標施加震懾，並使該次攻擊無視目標減傷與回避效果。
 */
export function isTripleResonance(params: {
  innerElement: SchoolElement | undefined
  outerElement: SchoolElement | undefined
  terrain: TerrainType | undefined
  targetSchoolId?: string
}): boolean {
  const { innerElement, outerElement, terrain, targetSchoolId } = params
  if (!isElementGenerating(innerElement, outerElement)) return false
  if (!isTerrainResonant(outerElement, terrain)) return false
  const targetElement = getSchoolElement(targetSchoolId)
  return getElementDamageMultiplier(outerElement, targetElement) > 1
}
