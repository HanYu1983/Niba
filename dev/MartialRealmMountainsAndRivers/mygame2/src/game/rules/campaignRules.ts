import type { GameState, CampaignState } from '../types'
import { executeTriggers } from './triggerRules'

/**
 * 劇情目標推進與勝利判定純函式。
 *
 * 集中處理 campaignState.activeObjectives 的進度更新與勝利判定，
 * 供各動作掛鉤點（擊敗怪物、摧毀巢穴、建造建築等）呼叫。
 */

/** 目標進度更新事件的類型。 */
export type ObjectiveProgressEvent =
  | { type: 'defeat-creature'; targetId: string }
  | { type: 'destroy-nest'; targetId: string }
  | { type: 'build-building'; buildingType: string; buildingLevel?: number }
  | { type: 'reconstruct-ruin'; targetId: string }
  | { type: 'learn-skill'; skillId: string }
  | { type: 'reach-prestige'; amount: number }
  | { type: 'survive-rounds'; round: number }
  | { type: 'build-defense-structure'; structureType: string }
  | { type: 'reach-position'; row: number; column: number }
  | { type: 'interact-object'; targetId: string }

/**
 * 依事件更新所有符合條件的目標進度。
 *
 * 語意規則：
 * - 綁定 targetId：只有事件目標與 targetId 相符才累計（如擊敗指定 Boss）。
 * - 不綁定 targetId：任何同類型事件都累計（如擊敗任意怪物）。
 * - 已完成的目標不再累計。
 */
export function progressObjectives(
  state: GameState,
  event: ObjectiveProgressEvent,
): GameState {
  const campaign = state.campaignState
  if (!campaign) return state

  const nextObjectives = campaign.activeObjectives.map((objective) => {
    if (objective.completed) return objective
    if (objective.type !== event.type) return objective

    // 指定類型目標：事件類型必須相符才推進（如建造指定建築/防禦設施）。
    if (objective.type === 'build-building' && objective.buildingType) {
      if (event.type !== 'build-building' || event.buildingType !== objective.buildingType) return objective
      // 若指定等級，需事件等級達標（如「三級道具店」需 Lv.3）。
      if (objective.buildingLevel !== undefined && (event.buildingLevel ?? 1) < objective.buildingLevel) return objective
      return { ...objective, currentValue: objective.targetValue, completed: true }
    }
    if (objective.type === 'build-defense-structure' && objective.structureType) {
      if (event.type !== 'build-defense-structure' || event.structureType !== objective.structureType) return objective
      return { ...objective, currentValue: objective.targetValue, completed: true }
    }

    // reach-position：事件位置與目標位置相符才推進。
    if (objective.type === 'reach-position') {
      if (event.type !== 'reach-position') return objective
      if (objective.targetRow !== event.row || objective.targetColumn !== event.column) return objective
      return { ...objective, currentValue: objective.targetValue, completed: true }
    }

    // interact-object：支援三種語意：
    // 1. targetIds（多物件）：需與清單中所有物件各互動一次。
    // 2. targetId（單物件）：與指定物件互動一次即完成。
    // 3. 皆無：任何 interact-object 事件都累計（需搭配 targetValue 次數）。
    if (objective.type === 'interact-object') {
      if (event.type !== 'interact-object') return objective
      // 多物件目標：逐一倒入 doneTargetIds，全數互動過即完成。
      if (objective.targetIds && objective.targetIds.length > 0) {
        if (!objective.targetIds.includes(event.targetId)) return objective
        const done = new Set(objective.doneTargetIds ?? [])
        if (done.has(event.targetId)) return objective
        done.add(event.targetId)
        const completed = objective.targetIds.every((id) => done.has(id))
        return { ...objective, doneTargetIds: [...done], currentValue: done.size, completed }
      }
      // 單一物件目標。
      if (objective.targetId) {
        if (event.targetId !== objective.targetId) return objective
        return { ...objective, currentValue: objective.targetValue, completed: true }
      }
      // 無指定 → 依 targetValue 累計互動次數。
      const next = Math.min(objective.targetValue, objective.currentValue + 1)
      return { ...objective, currentValue: next, completed: next >= objective.targetValue }
    }

    // 綁定目標：事件目標必須相符才推進。
    if (objective.targetId) {
      const eventTargetId = getEventTargetId(event)
      if (eventTargetId !== objective.targetId) return objective
      return { ...objective, currentValue: objective.targetValue, completed: true }
    }

    // 不綁定目標：任何同類型事件都累計。
    const next = Math.min(objective.targetValue, objective.currentValue + 1)
    return { ...objective, currentValue: next, completed: next >= objective.targetValue }
  })

  return {
    ...state,
    campaignState: { ...campaign, activeObjectives: nextObjectives },
  }
}

/** 取得事件關聯的目標物件 id（若該事件類型有）。 */
function getEventTargetId(event: ObjectiveProgressEvent): string | undefined {
  switch (event.type) {
    case 'defeat-creature':
    case 'destroy-nest':
    case 'reconstruct-ruin':
    case 'interact-object':
      return event.targetId
    default:
      return undefined
  }
}

/** 判斷所有主線目標（非支線）是否皆已完成。 */
export function areMainObjectivesComplete(campaign: CampaignState): boolean {
  const mainObjectives = campaign.activeObjectives.filter((objective) => !objective.isOptional)
  return mainObjectives.length > 0 && mainObjectives.every((objective) => objective.completed)
}

/**
 * 依目前遊戲狀態自動完成「條件式」目標：
 * - reach-prestige：玩家聲望達標即完成
 * - survive-rounds：目前回合數達標即完成
 *
 * 這些目標不需在每次聲望/回合變更點接入，而是集中在此判定。
 */
function autoCompleteConditionalObjectives(state: GameState): GameState {
  const campaign = state.campaignState
  if (!campaign) return state
  const maxPrestige = Math.max(0, ...state.players.map((player) => player.prestige))
  let changed = false
  const nextObjectives = campaign.activeObjectives.map((objective) => {
    if (objective.completed) return objective
    if (objective.type === 'reach-prestige' && maxPrestige >= objective.targetValue) {
      changed = true
      return { ...objective, currentValue: objective.targetValue, completed: true }
    }
    if (objective.type === 'survive-rounds' && state.round >= objective.targetValue) {
      changed = true
      return { ...objective, currentValue: objective.targetValue, completed: true }
    }
    return objective
  })
  if (!changed) return state
  return { ...state, campaignState: { ...campaign, activeObjectives: nextObjectives } }
}

/**
 * 檢查是否達成勝利：所有主線目標完成。
 * 若達成，設定 gameWon = true，並觸發 on-victory 觸發器（勝利結算前）。
 */
export function checkVictory(state: GameState): GameState {
  const campaign = state.campaignState
  if (!campaign || state.gameWon) return state
  // 先自動完成條件式目標（聲望/回合），再判定勝利。
  const withAutoComplete = autoCompleteConditionalObjectives(state)
  if (areMainObjectivesComplete(withAutoComplete.campaignState!)) {
    const withWon = { ...withAutoComplete, gameWon: true }
    // 勝利結算前觸發 on-victory 觸發器（如播放勝利對話）。
    return executeTriggers(withWon, { type: 'on-victory' })
  }
  return withAutoComplete
}
