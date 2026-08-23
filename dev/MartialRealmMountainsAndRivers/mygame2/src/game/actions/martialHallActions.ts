import { BUILDING_TYPES } from '../catalogs/buildingCatalog'
import type { ActionOutcome, GameState } from '../types'
import { getBuildingLevel } from '../rules/buildingProgressionRules'
import { canPlayerPerformAction } from '../rules/actionCostRules'
import { getMartialHallSkills } from '../catalogs/martialHallSkillCatalog'
import { isBaseActive } from '../rules/baseRules'
import { addMoneySpent, incrementRunStat } from '../runStats'
import { progressObjectives, checkVictory } from '../rules/campaignRules'

export const MARTIAL_HALL_LEARN_COST_PER_INSIGHT = 15

export type MartialHallSkillType = 'inner' | 'external'

export function getMartialHallSkillCost(insightCost: number): number {
  return insightCost * MARTIAL_HALL_LEARN_COST_PER_INSIGHT
}

export function learnSkillAtMartialHall(
  state: GameState,
  playerId: string,
  baseId: string,
  skillType: MartialHallSkillType,
  skillId: string,
): { state: GameState; result: ActionOutcome } {
  const player = state.players.find((candidate) => candidate.id === playerId)
  const base = state.bases.find((candidate) => candidate.id === baseId)
  const schoolSkills = getMartialHallSkills(base?.martialSchoolId)
  const skill = skillType === 'inner'
    ? schoolSkills.inner.find((candidate) => candidate.id === skillId)
    : schoolSkills.external.find((candidate) => candidate.id === skillId)
  // 依功法所屬門派找到對應武館；功法無門派（一般內功）時找第一個武館。
  const hall = base?.buildings.find((building) =>
    building.type === BUILDING_TYPES.MARTIAL_HALL
    && (!skill?.schoolId || building.schoolId === skill.schoolId),
  )

  if (!player || !base || !isBaseActive(base) || !hall || !skill) {
    return { state, result: { ok: false, reason: '武館、玩家或功法不存在。' } }
  }
  if (!canPlayerPerformAction(state, playerId, 0).ok) {
    return { state, result: { ok: false, reason: '目前無法學習功法。' } }
  }
  if (skillType === 'inner' && player.innerSkillIds.includes(skillId)) {
    return { state, result: { ok: false, reason: '玩家已學會此內功。' } }
  }
  if (skillType === 'external' && player.externalSkillIds.includes(skillId)) {
    return { state, result: { ok: false, reason: '玩家已學會此外功。' } }
  }
  if (getBuildingLevel(hall) < skill.requiredHallLevel) {
    return { state, result: { ok: false, reason: `需要武館 Lv.${skill.requiredHallLevel}。` } }
  }

  const insightCost = skillType === 'inner'
    ? schoolSkills.inner.find((candidate) => candidate.id === skillId)?.insightRequirement ?? 0
    : schoolSkills.external.find((candidate) => candidate.id === skillId)?.insightCost ?? 0
  const moneyCost = getMartialHallSkillCost(insightCost)
  if (player.money < moneyCost) {
    return { state, result: { ok: false, reason: `金錢不足，需要 ${moneyCost} 金錢。` } }
  }

  const learnedState: GameState = {
    ...state,
    players: state.players.map((candidate) => candidate.id !== playerId
      ? candidate
      : skillType === 'inner'
        ? { ...candidate, money: candidate.money - moneyCost, innerSkillIds: [...candidate.innerSkillIds, skillId] }
        : { ...candidate, money: candidate.money - moneyCost, externalSkillIds: [...candidate.externalSkillIds, skillId] }),
  }
  const withRunStat = incrementRunStat(addMoneySpent(learnedState, moneyCost), 'skillsLearned')
  // 劇情模式下，更新 learn-skill 目標進度並檢查勝利。
  const withProgress = withRunStat.campaignState
    ? checkVictory(progressObjectives(withRunStat, { type: 'learn-skill', skillId }))
    : withRunStat
  return {
    state: withProgress,
    result: { ok: true },
  }
}
