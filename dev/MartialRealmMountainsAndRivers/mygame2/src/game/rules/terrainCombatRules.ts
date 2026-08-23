import type { TerrainType } from '../types'
import type { MartialElement } from './skillRules'

/** 天地共鳴的傷害倍率。 */
export const TERRAIN_RESONANCE_DAMAGE_MULTIPLIER = 1.25
/** 親和地形施放外功時的內力減免。 */
export const TERRAIN_RESONANCE_INNER_POWER_DISCOUNT = 1
export const TERRAIN_RESONANCE_CRITICAL_RATE_BONUS = 5

const resonantTerrains: Record<Exclude<MartialElement, 'none'>, TerrainType[]> = {
  metal: ['mountain'],
  wood: ['forest'],
  water: ['water'],
  fire: ['desert'],
  earth: ['plain'],
}

export function isTerrainResonant(skillElement: MartialElement | undefined, terrain: TerrainType | undefined): boolean {
  if (!skillElement || skillElement === 'none' || !terrain) return false
  return resonantTerrains[skillElement].includes(terrain)
}

export function getTerrainResonanceDamageMultiplier(
  skillElement: MartialElement | undefined,
  terrain: TerrainType | undefined,
): number {
  return isTerrainResonant(skillElement, terrain) ? TERRAIN_RESONANCE_DAMAGE_MULTIPLIER : 1
}

export function getTerrainResonanceInnerPowerDiscount(
  skillElement: MartialElement | undefined,
  terrain: TerrainType | undefined,
): number {
  return isTerrainResonant(skillElement, terrain) ? TERRAIN_RESONANCE_INNER_POWER_DISCOUNT : 0
}

/** 金屬性功法在山嶽共鳴時的額外暴擊率。 */
export function getTerrainResonanceCriticalRateBonus(
  skillElement: MartialElement | undefined,
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
  skillElement: MartialElement | undefined,
  terrain: TerrainType | undefined,
): string | undefined {
  return isTerrainResonant(skillElement, terrain)
    ? `地形共鳴（${terrain}）：傷害 +25%、內力 -1`
    : undefined
}
