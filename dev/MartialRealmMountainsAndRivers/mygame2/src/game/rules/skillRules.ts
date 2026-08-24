import { type ExternalSkill } from '../catalogs/externalSkillCatalog'
import { type InnerSkill } from '../catalogs/innerSkillCatalog'
import { allExternalSkillCatalog, allInnerSkillCatalog } from '../catalogs/martialHallSkillCatalog'
import type { InsightCapacityBreakdown, PlayerAttributes, PlayerState } from '../types'
import { getEffectiveAttributesForPlayer } from './playerDerivedRules'
export type MartialElement = 'none' | 'metal' | 'wood' | 'water' | 'fire' | 'earth'

export function getSchoolElement(schoolId?: string): MartialElement {
  switch (schoolId) {
    case 'golden-body': return 'metal'
    case 'swift-wind': return 'wood'
    case 'scarlet-flame': return 'fire'
    case 'frost-water': return 'water'
    case 'earth-mountain': return 'earth'
    case 'hundred-poison': return 'wood'
    case 'sharp-edge': return 'metal'
    case 'misty-rain': return 'water'
    case 'blazing-sun': return 'fire'
    case 'yellow-earth': return 'earth'
    default: return 'none'
  }
}

export const OVERCAPACITY_SKILL_EFFECT_MULTIPLIER = 0.1
/** 每次使用/練習功法獲得的功法經驗。 */
export const SKILL_EXPERIENCE_PER_USE = 5
/** 功法第一級升級所需經驗；後續等級每級增加固定經驗。 */
export const SKILL_EXPERIENCE_PER_LEVEL = 50
export const SKILL_EXPERIENCE_LEVEL_INCREMENT = 20

/** 取得功法從指定等級升到下一級所需的經驗。 */
export function getSkillExperienceRequired(level: number): number {
  return SKILL_EXPERIENCE_PER_LEVEL + Math.max(0, level - 1) * SKILL_EXPERIENCE_LEVEL_INCREMENT
}

/** 五行相剋：攻擊方克制防守方時傷害 ×1.25，反之 ×0.75。太虛流不參與相剋。 */
export function getElementDamageMultiplier(attacker: MartialElement | undefined, defender: MartialElement | undefined): number {
  if (!attacker || !defender || attacker === 'none' || defender === 'none' || attacker === defender) return 1
  const counters: Record<Exclude<MartialElement, 'none'>, Exclude<MartialElement, 'none'>> = {
    metal: 'wood',
    wood: 'earth',
    earth: 'water',
    water: 'fire',
    fire: 'metal',
  }
  if (counters[attacker] === defender) return 1.25
  if (counters[defender] === attacker) return 0.75
  return 1
}

export function getElementName(element: MartialElement | undefined): string {
  return ({ none: '無屬性', metal: '金', wood: '木', water: '水', fire: '火', earth: '土' } satisfies Record<MartialElement, string>)[element ?? 'none']
}

/** 供戰鬥預覽顯示攻守雙方屬性與實際傷害倍率。 */
export function getElementInteractionText(attacker: MartialElement | undefined, defender: MartialElement | undefined): string {
  const multiplier = getElementDamageMultiplier(attacker, defender)
  const attackerName = getElementName(attacker)
  const defenderName = getElementName(defender)
  if (multiplier === 1.25) return `${attackerName}克制${defenderName}｜傷害 ×1.25`
  if (multiplier === 0.75) return `${attackerName}被${defenderName}克制｜傷害 ×0.75`
  if (attackerName === '無屬性' || defenderName === '無屬性') return `${attackerName} vs ${defenderName}｜不套用相剋`
  if (attackerName === defenderName) return `${attackerName} vs ${defenderName}｜同屬性，傷害 ×1`
  return `${attackerName} vs ${defenderName}｜無相剋，傷害 ×1`
}

export function getSkillProgression(player: PlayerState, skillId: string): { experience: number; level: number } {
  return player.skillProgression?.[skillId] ?? { experience: 0, level: 1 }
}

/** 依功法等級放大基礎傷害：等級越高，傷害越高（成長減半，1 級維持 1×）。 */
export function getSkillDamage(attributes: PlayerAttributes, skill: InnerSkill | ExternalSkill, level: number): number {
  return Math.max(1, Math.floor(skill.calculateDamage(attributes) * (1 + (level - 1) * 0.5)))
}

/** 依功法等級放大內力消耗：等級越高，消耗越高（成長減半，1 級維持原值）。 */
export function getSkillInnerPowerCost(baseCost: number, level: number): number {
  return Math.max(0, Math.floor(baseCost * (1 + (level - 1) * 0.5)))
}

export function addSkillExperience(player: PlayerState, skillId: string, amount = SKILL_EXPERIENCE_PER_USE): PlayerState {
  const current = getSkillProgression(player, skillId)
  let experience = current.experience + Math.max(0, amount)
  let level = current.level
  while (experience >= getSkillExperienceRequired(level)) {
    experience -= getSkillExperienceRequired(level)
    level += 1
  }
  return {
    ...player,
    skillProgression: {
      ...(player.skillProgression ?? {}),
      [skillId]: { experience, level },
    },
  }
}

export function getExternalSkill(skillId: string): ExternalSkill {
  return allExternalSkillCatalog.find((skill) => skill.id === skillId) ?? allExternalSkillCatalog[0]
}

export function getInnerSkill(skillId: string): InnerSkill {
  return allInnerSkillCatalog.find((skill) => skill.id === skillId) ?? allInnerSkillCatalog[0]
}

export function getPlayerTotalInsightCost(player: PlayerState): number {
  const innerSkillCost = getInnerSkill(player.innerSkillId).insightRequirement
  const externalSkillCost = player.equippedExternalSkillIds.reduce(
    (total, skillId) => total + getExternalSkill(skillId).insightCost,
    0,
  )

  return innerSkillCost + externalSkillCost
}

export function getPlayerInsightCapacityBreakdown(player: PlayerState): InsightCapacityBreakdown {
  const inner = getInnerSkill(player.innerSkillId).insightRequirement
  const external = player.equippedExternalSkillIds.reduce(
    (total, skillId) => total + getExternalSkill(skillId).insightCost,
    0,
  )
  const total = inner + external
  const effectiveInsight = getEffectiveAttributesForPlayer(player).insight

  return {
    total,
    inner,
    external,
    limit: effectiveInsight,
    exceeded: total > effectiveInsight,
  }
}

/** 功法配置超出悟性容量時，功法仍可運轉，但效果大幅衰減。 */
export function getSkillEffectMultiplier(player: PlayerState): number {
  return getPlayerInsightCapacityBreakdown(player).exceeded
    ? OVERCAPACITY_SKILL_EFFECT_MULTIPLIER
    : 1
}
