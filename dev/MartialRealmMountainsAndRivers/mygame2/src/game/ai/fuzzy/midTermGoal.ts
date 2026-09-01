import type { GoalName, GoalResult } from './goals'

/**
 * 中期目標（Mid-Term Goal）：把「達成某個可量化狀態」作為比單一 action 更長的執行單元。
 *
 * 已實作案例：
 * - **擊殺目標**：視野內有可殺獵物時鎖定「追殺這隻怪」直到它死亡。
 * - **存錢目標**：缺錢時鎖定「打工存錢」直到 `金錢 ≥ targetAmount`。
 *
 * 設計重點：
 * - 目標存放在模組級 Map（跨 fuzzy step 存活），key = playerId。
 * - 當目標活躍時，透過 `overrideScore` 把對應目標分數強制抬到最高，
 *   讓它一定能被選中，並由既有 move 承諾機制維持執行。
 * - 「完成」：條件滿足（獵物死亡 / 存錢達標）→ 清除目標。
 * - 「放棄」：目標不可行或高風險逃生時清除。
 */

export type SaveMoneyGoal = {
  type: 'save-money'
  targetAmount: number
}

export type KillGoal = {
  type: 'kill'
  targetId: string
  targetType: 'creature' | 'nest'
}

export type MidTermGoal = SaveMoneyGoal | KillGoal

/** 存錢目標的固定目標額：約夠買一顆屬性丹($70) + 學功法($30) 的組合。 */
export const SAVE_MONEY_TARGET = 100
/** 多少錢以下視為「缺錢」，適合啟動存錢目標。 */
export const SAVE_MONEY_TRIGGER = SAVE_MONEY_TARGET * 0.8
/** 存錢目標能透過打工把自己扣到低於多少體力會中斷（避免一直打工不做事）。 */
const MISSION_STAMINA_FLOOR = 0.1
/** 視為「夠強可追殺」的傷害門檻：一回合總傷必須能削掉此比例以上血。 */
export const KILL_DAMAGE_RATIO = 0.4
/** 追殺目標最遠距離：太遠不值得跑圖耗體力，交給探索/其他目標。 */
export const KILL_MAX_DISTANCE = 6

/** 可供「擊殺目標」判斷的可打候選形狀。 */
export type KillCandidate = {
  targetId: string
  targetType: 'creature' | 'nest'
  distance: number
  damageRatio: number
  /** 是否扛得住（能被攻擊幾次不致命）。 */
  canSurvive: boolean
}

const midTermGoals = new Map<string, MidTermGoal>()

/** 目前是否有存錢目標被鎖定。 */
export function isSavingMoney(playerId: string): boolean {
  return midTermGoals.get(playerId)?.type === 'save-money'
}

/** 目前是否有擊殺目標被鎖定。 */
export function isKilling(playerId: string): boolean {
  return midTermGoals.get(playerId)?.type === 'kill'
}

/** 讀取玩家的存錢目標額（若無回傳 0）。 */
export function getSaveMoneyTarget(playerId: string): number {
  return midTermGoals.get(playerId)?.type === 'save-money' ? (midTermGoals.get(playerId) as SaveMoneyGoal).targetAmount : 0
}

/** 讀取當前擊殺目標 id（若無回傳 ''）。 */
export function getKillTargetId(playerId: string): string {
  const goal = midTermGoals.get(playerId)
  return goal?.type === 'kill' ? (goal as KillGoal).targetId : ''
}

/** 依玩家狀態決定存錢目標是否要「覆寫分數」。 */
export function applyMidTermGoalInputs(
  playerId: string,
  money: number,
  staminaRatio: number,
  hasMissionBoard: boolean,
  missionBaseId: string,
): MidTermGoal | undefined {
  const current = midTermGoals.get(playerId)

  // 已有擊殺目標：不在此處理（由 applyKillGoalInputs 負責）
  if (current?.type === 'kill') return current

  // 已有存錢目標：檢查完成/放棄
  if (current?.type === 'save-money') {
    if (money >= current.targetAmount) {
      midTermGoals.delete(playerId)
      return undefined
    }
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

/**
 * 擊殺目標：視野內有可殺獵物 → 鎖定追殺，直到它死亡。
 * 尋找「傷害可一兩回殺 + 扛得住 + 距離在追殺範圍」的最佳獵物。
 */
export function applyKillGoalInputs(
  playerId: string,
  candidates: KillCandidate[],
  playerStaminaRatio: number,
): MidTermGoal | undefined {
  let current = midTermGoals.get(playerId)

  // 已有擊殺目標：確認目標還「可見」；否則視為完成/放棄，找新的
  if (current?.type === 'kill') {
    const targetId = (current as KillGoal).targetId
    const stillSeen = candidates.find((c) => c.targetId === targetId)
    if (stillSeen) {
      // 目標仍可見：若扛得住就維持鎖定；扛不住則解除並找下一個
      if (stillSeen.canSurvive && playerStaminaRatio >= 0.1) {
        return current
      }
      midTermGoals.delete(playerId)
      current = undefined
    } else {
      midTermGoals.delete(playerId)
      current = undefined
    }
  }

  if (!current) {
    // 選最佳可殺獵物（除非正在存錢，避免打架中斷存錢流程；體力不足時不重新鎖定）
    const best = playerStaminaRatio >= 0.1
      ? candidates
        .filter((c) => c.damageRatio >= KILL_DAMAGE_RATIO && c.canSurvive && c.distance > 0 && c.distance <= KILL_MAX_DISTANCE)
        .sort((a, b) => b.damageRatio - a.damageRatio || a.distance - b.distance)[0]
      : undefined
    if (best && midTermGoals.get(playerId)?.type !== 'save-money') {
      const goal: KillGoal = { type: 'kill', targetId: best.targetId, targetType: best.targetType }
      midTermGoals.set(playerId, goal)
      return goal
    }
  }

  return midTermGoals.get(playerId)
}

/** 當目標活躍時，把對應 goal 分數抬到最高（1.0），確保被選中。 */
export function overrideScoreForMidTermGoal(
  playerId: string,
  goal: GoalName,
  result: GoalResult,
): GoalResult {
  const current = midTermGoals.get(playerId)
  if (!current) return result
  if (current.type === 'kill' && goal === 'engageCombat') {
    const target = result.target
    if (target && target.kind === 'attack' && target.targetId === (current as KillGoal).targetId
      && result.actions && result.actions.some((a) => a.type !== 'hold')) {
      return { ...result, score: 1.0 }
    }
    return result
  }
  if (current.type === 'save-money' && goal === 'executeMission') {
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