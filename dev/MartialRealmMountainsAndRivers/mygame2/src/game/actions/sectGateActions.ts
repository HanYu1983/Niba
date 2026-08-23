import type { ActionOutcome, GameState } from '../types'
import { canPlayerPerformAction, spendPlayerStamina } from '../rules/actionCostRules'
import { addSkillExperience, SKILL_EXPERIENCE_PER_USE } from '../rules/skillRules'
import { getGlobalSkillExperienceMultiplier } from '../rules/globalBuffRules'
import {
  SECT_GATE_PRACTICE_STAMINA_COST,
  SECT_GATE_PRACTICE_EXPERIENCE,
  getSectGateLearnCost,
  getSectGateSkills,
  addSectGateExperience,
} from '../rules/sectGateRules'
import { addMoneySpent, incrementRunStat } from '../runStats'
import { progressObjectives, checkVictory } from '../rules/campaignRules'

/**
 * 門派據點行動：學習功法（Learn）與練習功法（Practice）。
 *
 * - 學習：消耗 3 點體力與金錢（沿用武館公式），據點等級解鎖對應功法；學習累積據點經驗。
 * - 練習：消耗體力，僅能練已學會的功法；練習同時累積據點經驗與該功法個人經驗。
 * - 學習與練習均須玩家位於門派據點相鄰一格。
 */

/** 學習門派功法。 */
export function learnSkillAtSectGate(
  state: GameState,
  playerId: string,
  gateId: string,
  skillId: string,
): { state: GameState; result: ActionOutcome } {
  const player = state.players.find((candidate) => candidate.id === playerId)
  const gate = state.sectGates?.find((candidate) => candidate.id === gateId)

  if (!player || !gate) {
    return { state, result: { ok: false, reason: '門派據點或玩家不存在。' } }
  }
  const actionCheck = canPlayerPerformAction(state, playerId, SECT_GATE_PRACTICE_STAMINA_COST)
  if (!actionCheck.ok) {
    return { state, result: { ok: false, reason: actionCheck.reason ?? '目前無法學習功法。' } }
  }
  // 必須在門派據點相鄰一格才能互動。
  const distance = Math.abs(player.position.row - gate.position.row) + Math.abs(player.position.column - gate.position.column)
  if (distance > 1) {
    return { state, result: { ok: false, reason: '必須靠近門派據點才能學習功法。' } }
  }

  const { inner, damage, aura } = getSectGateSkills(gate.schoolId)
  const all = [inner, damage, aura].filter((skill): skill is NonNullable<typeof skill> => skill !== null)
  const skill = all.find((candidate) => candidate.id === skillId)
  if (!skill) {
    return { state, result: { ok: false, reason: '此門派據點沒有該功法。' } }
  }

  const isInner = skillId === inner?.id
  if (isInner ? player.innerSkillIds.includes(skillId) : player.externalSkillIds.includes(skillId)) {
    return { state, result: { ok: false, reason: '玩家已學會此功法。' } }
  }

  const moneyCost = getSectGateLearnCost(gate.schoolId, skillId)
  if (player.money < moneyCost) {
    return { state, result: { ok: false, reason: `金錢不足，需要 ${moneyCost} 金錢。` } }
  }

  const nextGateProgress = addSectGateExperience(gate, moneyCost)
  const learnedState: GameState = {
    ...state,
    sectGates: (state.sectGates ?? []).map((candidate) => candidate.id === gateId
      ? { ...candidate, ...nextGateProgress }
      : candidate),
    players: state.players.map((candidate) => candidate.id !== playerId
      ? candidate
      : isInner
        ? { ...spendPlayerStamina(candidate, SECT_GATE_PRACTICE_STAMINA_COST), money: candidate.money - moneyCost, innerSkillIds: [...candidate.innerSkillIds, skillId] }
        : { ...spendPlayerStamina(candidate, SECT_GATE_PRACTICE_STAMINA_COST), money: candidate.money - moneyCost, externalSkillIds: [...candidate.externalSkillIds, skillId] }),
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

/** 練習門派據點功法（僅限已學會）。 */
export function practiceSkillAtSectGate(
  state: GameState,
  playerId: string,
  gateId: string,
  skillId: string,
): { state: GameState; result: ActionOutcome } {
  const player = state.players.find((candidate) => candidate.id === playerId)
  const gate = state.sectGates?.find((candidate) => candidate.id === gateId)

  if (!player || !gate) {
    return { state, result: { ok: false, reason: '門派據點或玩家不存在。' } }
  }
  const actionCheck = canPlayerPerformAction(state, playerId, SECT_GATE_PRACTICE_STAMINA_COST)
  if (!actionCheck.ok) {
    return { state, result: { ok: false, reason: actionCheck.reason ?? '目前無法練習功法。' } }
  }
  const distance = Math.abs(player.position.row - gate.position.row) + Math.abs(player.position.column - gate.position.column)
  if (distance > 1) {
    return { state, result: { ok: false, reason: '必須靠近門派據點才能練習功法。' } }
  }

  const { inner, damage, aura } = getSectGateSkills(gate.schoolId)
  const all = [inner, damage, aura].filter((skill): skill is NonNullable<typeof skill> => skill !== null)
  const skill = all.find((candidate) => candidate.id === skillId)
  if (!skill) {
    return { state, result: { ok: false, reason: '此門派據點沒有該功法。' } }
  }
  // 練習需玩家已學會。
  const learned = (skillId === inner?.id)
    ? player.innerSkillIds.includes(skillId)
    : player.externalSkillIds.includes(skillId)
  if (!learned) {
    return { state, result: { ok: false, reason: '必須先學會此功法才能練習。' } }
  }

  const experienceMultiplier = getGlobalSkillExperienceMultiplier(state)
  const nextGateProgress = addSectGateExperience(gate, SECT_GATE_PRACTICE_EXPERIENCE)
  return {
    state: {
      ...state,
      sectGates: (state.sectGates ?? []).map((candidate) => candidate.id === gateId
        ? { ...candidate, ...nextGateProgress }
        : candidate),
      players: state.players.map((candidate) => candidate.id !== playerId
        ? candidate
        : addSkillExperience(
          spendPlayerStamina(candidate, SECT_GATE_PRACTICE_STAMINA_COST),
          skillId,
          Math.round(SKILL_EXPERIENCE_PER_USE * experienceMultiplier),
        )),
    },
    result: { ok: true },
  }
}