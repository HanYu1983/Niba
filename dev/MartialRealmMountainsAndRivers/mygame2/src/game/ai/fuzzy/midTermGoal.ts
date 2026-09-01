import type { GoalName, GoalResult } from './goals'

/**
 * 中期目標（Mid-Term Goal）：把「達成某個可量化狀態」作為比單一 action 更長的執行單元。
 *
 * V1 驗證案例：**存錢目標**。
 * 當玩家缺錢且可打工時，鎖定「打工存錢」直到 `金錢 ≥ targetAmount` 才換目標，
 * 避免 AI 打幾次工就跑去探索/練功而永遠存不夠錢買裝/學招。
 *
 * 設計重點：
 * - 目標存放在模組級 Map（跨 fuzzy step 存活），key = playerId。
 * - 當目標活躍時，透過 `overrideScore` 把對應目標的分數強制抬到最高，
 *   讓它一定能被選中，並由既有 move 承諾機制維持執行。
 * - 「完成」：條件滿足（存錢達標）→ 清除目標。
 * - 「放棄」：高風險逃生時清除（由 stepRunner 呼叫 `abortOnThreat`）。
 */

export type SaveMoneyGoal = {
  type: 'save-money'
  targetAmount: number
}

export type MidTermGoal = SaveMoneyGoal

/** 存錢目標的固定目標額：約夠買一顆屬性丹($70) + 學功法($30) 的組合。 */
export const SAVE_MONEY_TARGET = 100
/** 多少錢以下視為「缺錢」，適合啟動存錢目標。 */
export const SAVE_MONEY_TRIGGER = SAVE_MONEY_TARGET * 0.8
/** 存錢目標能透過打工把自己扣到低於多少體力會中斷（避免一直打工不做事）。 */
const MISSION_STAMINA_FLOOR = 0.1

const midTermGoals = new Map<string, MidTermGoal>()

/** 目前是否有存錢目標被鎖定。 */
export function isSavingMoney(playerId: string): boolean {
  return midTermGoals.get(playerId)?.type === 'save-money'
}

/** 讀取玩家的存錢目標額（若無回傳 0）。 */
export function getSaveMoneyTarget(playerId: string): number {
  return midTermGoals.get(playerId)?.type === 'save-money' ? (midTermGoals.get(playerId) as SaveMoneyGoal).targetAmount : 0
}

/** 依玩家狀態決定中期目標是否要「覆寫分數」。 */
export function applyMidTermGoalInputs(
  playerId: string,
  money: number,
  staminaRatio: number,
  hasMissionBoard: boolean,
  missionBaseId: string,
): MidTermGoal | undefined {
  const current = midTermGoals.get(playerId)

  // 已有存錢目標：檢查完成/放棄
  if (current?.type === 'save-money') {
    if (money >= current.targetAmount) {
      midTermGoals.delete(playerId)
      return undefined
    }
    // 打工可行性消失（告示牌沒了 / 無法到達 / 體力太低）→ 放棄
    if (!hasMissionBoard || !missionBaseId || staminaRatio < MISSION_STAMINA_FLOOR) {
      midTermGoals.delete(playerId)
      return undefined
    }
    return current
  }

  // 無目標：缺錢 + 有告示牌可打工 → 鎖定存錢
  if (money < SAVE_MONEY_TRIGGER && hasMissionBoard && missionBaseId && staminaRatio >= MISSION_STAMINA_FLOOR) {
    const goal: SaveMoneyGoal = { type: 'save-money', targetAmount: SAVE_MONEY_TARGET }
    midTermGoals.set(playerId, goal)
    return goal
  }

  return undefined
}

/** 當目標活躍時，把對應 goal 分數抬到最高（1.0），確保被選中。 */
export function overrideScoreForMidTermGoal(
  playerId: string,
  goal: GoalName,
  result: GoalResult,
): GoalResult {
  const current = midTermGoals.get(playerId)
  if (!current) return result
  if (current.type === 'save-money' && goal === 'executeMission') {
    // 只有在打工确实可执行（有合法 action）时才抬分
    if (result.actions && result.actions.length > 0 && result.actions.some((a) => a.type !== 'hold')) {
      return { ...result, score: 1.0 }
    }
  }
  return result
}

/** 高風險逃生時清除中期目標（由 stepRunner 在高威脅時呼叫）。 */
export function abortMidTermGoal(playerId: string): void {
  midTermGoals.delete(playerId)
}

/** 測試輔助：清除所有中期目標。 */
export function clearMidTermGoals(): void {
  midTermGoals.clear()
}