/**
 * 挑戰關卡的全局共享狀態（Challenge State Storage）。
 *
 * 記錄闖關等級、歷史最高等級與總通關次數，儲存在 localStorage。
 * 等級為所有角色共用（全局共享），每次通關後 +1，地圖參數隨等級換算。
 * 詳見 reports/system/challenge-mode-design.md。
 */

import type { ChallengeState } from './types'

const CHALLENGE_STORAGE_KEY = 'mygame2.challenge-state'

const DEFAULT_CHALLENGE_STATE: ChallengeState = {
  level: 1,
  highestLevel: 0,
  totalClears: 0,
}

function isValidState(value: unknown): value is ChallengeState {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  const state = value as Partial<ChallengeState>
  return (
    typeof state.level === 'number' && Number.isFinite(state.level) && state.level >= 1 &&
    typeof state.highestLevel === 'number' && Number.isFinite(state.highestLevel) &&
    typeof state.totalClears === 'number' && Number.isFinite(state.totalClears) && state.totalClears >= 0
  )
}

function getStored(): ChallengeState {
  if (typeof localStorage === 'undefined') return { ...DEFAULT_CHALLENGE_STATE }
  try {
    const raw = localStorage.getItem(CHALLENGE_STORAGE_KEY)
    if (!raw) return { ...DEFAULT_CHALLENGE_STATE }
    const parsed = JSON.parse(raw) as unknown
    if (!isValidState(parsed)) return { ...DEFAULT_CHALLENGE_STATE }
    return {
      level: Math.max(1, Math.round(parsed.level)),
      highestLevel: Math.max(0, Math.round(parsed.highestLevel)),
      totalClears: Math.max(0, Math.round(parsed.totalClears)),
    }
  } catch {
    return { ...DEFAULT_CHALLENGE_STATE }
  }
}

function persist(state: ChallengeState) {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(CHALLENGE_STORAGE_KEY, JSON.stringify(state))
}

/** 讀取挑戰關卡狀態（無存檔時回傳預設值）。 */
export function getChallengeState(): ChallengeState {
  return getStored()
}

/** 記錄一次挑戰通關：等級 +1、歷史最高同步、總通關次數 +1。 */
export function recordChallengeVictory(): ChallengeState {
  const current = getStored()
  const next: ChallengeState = {
    level: current.level + 1,
    highestLevel: Math.max(current.highestLevel, current.level + 1),
    totalClears: current.totalClears + 1,
  }
  persist(next)
  return next
}

/** 重置挑戰關卡狀態為初始值（供除錯用）。 */
export function resetChallengeState(): ChallengeState {
  const next = { ...DEFAULT_CHALLENGE_STATE }
  persist(next)
  return next
}
