import { type ExternalSkill } from '../catalogs/externalSkillCatalog'
import { type InnerSkill } from '../catalogs/innerSkillCatalog'
import { allExternalSkillCatalog, allInnerSkillCatalog } from '../catalogs/martialHallSkillCatalog'
import type { SchoolElement } from '../catalogs/skillProgressionCatalog'
import type { ActionOutcome, GameState, InsightCapacityBreakdown, PlayerAttributes, PlayerState } from '../types'
import { getMaxInnerPower } from './playerStatsRules'
import { applyBaseHealthBonuses } from './baseRules'
import { getEffectiveAttributesForPlayer } from './playerDerivedRules'
export type MartialElement = 'none' | 'metal' | 'wood' | 'water' | 'fire' | 'earth'
  
export type { SchoolElement } from '../catalogs/skillProgressionCatalog'
export { getSchoolElement } from '../catalogs/skillProgressionCatalog'

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
export function getElementDamageMultiplier(attacker: SchoolElement | undefined, defender: SchoolElement | undefined): number {
  if (!attacker || !defender || attacker === 'none' || defender === 'none' || attacker === defender) return 1
  const counters: Record<Exclude<SchoolElement, 'none'>, Exclude<SchoolElement, 'none'>> = {
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

/** 五行相生：generator 元素是否生成 generated 元素（木→火→土→金→水→木）。太虛流不參與相生。 */
export function isElementGenerating(
  generator: SchoolElement | undefined,
  generated: SchoolElement | undefined,
): boolean {
  if (!generator || !generated || generator === 'none' || generated === 'none') return false
  const generation: Record<Exclude<SchoolElement, 'none'>, Exclude<SchoolElement, 'none'>> = {
    wood: 'fire',
    fire: 'earth',
    earth: 'metal',
    metal: 'water',
    water: 'wood',
  }
  return generation[generator] === generated
}

/** 五行相生連攜倍率：內功元素生外功元素時傷害 ×1.25，否則 ×1。 */
export const GENERATION_SYNERGY_MULTIPLIER = 1.25

/** 五行相生連攜：內功元素生外功元素時回傳倍率，否則 ×1。 */
export function getGenerationSynergyMultiplier(
  innerElement: SchoolElement | undefined,
  outerElement: SchoolElement | undefined,
): number {
  return isElementGenerating(innerElement, outerElement) ? GENERATION_SYNERGY_MULTIPLIER : 1
}

export function getElementName(element: SchoolElement | undefined): string {
  return ({ none: '無屬性', metal: '金', wood: '木', water: '水', fire: '火', earth: '土' } satisfies Record<SchoolElement, string>)[element ?? 'none']
}

/** 供戰鬥預覽顯示攻守雙方屬性與實際傷害倍率。 */
export function getElementInteractionText(attacker: SchoolElement | undefined, defender: SchoolElement | undefined): string {
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

export function equipInnerSkillAction(
  state: GameState,
  playerId: string,
  skillId: string,
): { state: GameState; result: ActionOutcome } {
  const player = state.players.find((p) => p.id === playerId)
  if (!player) {
    return { state, result: { ok: false, reason: '玩家不存在' } }
  }

  const skill = allInnerSkillCatalog.find((s) => s.id === skillId)
  if (!skill) {
    return { state, result: { ok: false, reason: '功法不存在' } }
  }

  if (player.innerSkillId === skillId) {
    return { state, result: { ok: false, reason: '已裝備此功法' } }
  }

  if (!player.innerSkillIds.includes(skillId)) {
    return { state, result: { ok: false, reason: '未學會此功法' } }
  }

  const effectiveAttributes = getEffectiveAttributesForPlayer(player)
  if (effectiveAttributes.insight < skill.insightRequirement) {
    return { state, result: { ok: false, reason: '悟性不足' } }
  }

  const maxInnerPower = getMaxInnerPower(effectiveAttributes)
  const innerPowerCost = Math.max(1, maxInnerPower * 0.01)

  const nextPlayer: PlayerState = {
    ...player,
    innerSkillId: skillId,
    innerPower: Math.max(0, player.innerPower - innerPowerCost),
  }

  const nextState: GameState = {
    ...state,
    players: state.players.map((p) => (p.id === playerId ? nextPlayer : p)),
  }

  return {
    state: applyBaseHealthBonuses(nextState),
    result: { ok: true },
  }
}

/**
 * 啟用／停用外功（切換 equippedExternalSkillIds）。
 * 啟用需：已學會 + 悟性容量足夠；啟用消耗 1% 內力，停用不消耗。
 * 供 gameStore 與 AI 執行層共用。
 */
export function toggleExternalSkillAction(
  state: GameState,
  playerId: string,
  skillId: string,
): { state: GameState; result: ActionOutcome } {
  const player = state.players.find((p) => p.id === playerId)
  if (!player) {
    return { state, result: { ok: false, reason: '玩家不存在' } }
  }
  const skill = getExternalSkill(skillId)
  if (!skill || !player.externalSkillIds.includes(skillId)) {
    return { state, result: { ok: false, reason: '未學會此外功' } }
  }

  const isEquipped = player.equippedExternalSkillIds.includes(skillId)
  const usedCapacity = getPlayerTotalInsightCost(player) - (isEquipped ? skill.insightCost : 0)
  if (!isEquipped && usedCapacity + skill.insightCost > getEffectiveAttributesForPlayer(player).insight) {
    return { state, result: { ok: false, reason: '悟性容量不足' } }
  }

  const maxInnerPower = getMaxInnerPower(getEffectiveAttributesForPlayer(player))
  const innerPowerCost = Math.max(1, maxInnerPower * 0.01)

  const nextState: GameState = {
    ...state,
    players: state.players.map((currentPlayer) =>
      currentPlayer.id === playerId
        ? {
            ...currentPlayer,
            equippedExternalSkillIds: isEquipped
              ? currentPlayer.equippedExternalSkillIds.filter((id) => id !== skillId)
              : [...currentPlayer.equippedExternalSkillIds, skillId],
            innerPower: isEquipped
              ? currentPlayer.innerPower
              : Math.max(0, currentPlayer.innerPower - innerPowerCost),
          }
        : currentPlayer,
    ),
  }

  return {
    state: applyBaseHealthBonuses(nextState),
    result: { ok: true },
  }
}
