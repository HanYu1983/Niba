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

/**
 * 移動目標鎖定：鎖定「前往某個地點並完成」的移動類目標（學招/任務/探索/清障/收集/防禦建設）。
 * 一旦鎖定，持續執行到「目標不再可執行」（到達完成 / 不可達 / 高風險）才換，
 * 避免 AI 因各目標分數波動而在不同據點/地點間來回繞圈。
 */
export type TravelGoal = {
  type: 'travel'
  goal: GoalName
  targetKey: string
}

export type MidTermGoal = SaveMoneyGoal | KillGoal | TravelGoal

/** 存錢目標的固定目標額：約夠買一顆屬性丹($70) + 學功法($30) 的組合。 */
export const SAVE_MONEY_TARGET = 100
/** 多少錢以下視為「缺錢」，適合啟動存錢目標。 */
export const SAVE_MONEY_TRIGGER = SAVE_MONEY_TARGET * 0.8
/** 存錢目標能透過打工把自己扣到低於多少體力會中斷（避免一直打工不做事）。 */
const MISSION_STAMINA_FLOOR = 0.1
/** 視為「夠強可追殺」的傷害門檻：一回合總傷必須能削掉此比例以上血。 */
export const KILL_DAMAGE_RATIO = 0.4
/** 一回合可擊殺的傷害門檻；這種安全且高價值的機會可中斷存錢。 */
export const KILL_ONE_TURN_DAMAGE_RATIO = 0.75
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

/** 讀取目前中期目標摘要（供 trace 日誌／除錯用）。無目標回傳 undefined。 */
export function getMidTermGoalSummary(playerId: string): { type: MidTermGoal['type']; goal?: GoalName; targetKey?: string; targetAmount?: number; targetId?: string } | undefined {
  const goal = midTermGoals.get(playerId)
  if (!goal) return undefined
  if (goal.type === 'save-money') return { type: 'save-money', targetAmount: goal.targetAmount }
  if (goal.type === 'kill') return { type: 'kill', targetId: goal.targetId }
  return { type: 'travel', goal: goal.goal, targetKey: goal.targetKey }
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

  // 選最佳可殺獵物；相鄰且一回可擊殺時，即使正在存錢也允許中斷存錢。
  const best = playerStaminaRatio >= 0.1
    ? candidates
      .filter((c) => c.damageRatio >= KILL_DAMAGE_RATIO && c.canSurvive && c.distance > 0 && c.distance <= KILL_MAX_DISTANCE)
      .sort((a, b) => b.damageRatio - a.damageRatio || a.distance - b.distance)[0]
    : undefined
  const currentIsSaving = midTermGoals.get(playerId)?.type === 'save-money'
  const canFinishThisTurn = best
    && best.distance === 1
    && best.damageRatio >= KILL_ONE_TURN_DAMAGE_RATIO
  if (best && (!currentIsSaving || canFinishThisTurn)) {
    const goal: KillGoal = { type: 'kill', targetId: best.targetId, targetType: best.targetType }
    midTermGoals.set(playerId, goal)
    return goal
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
  if (current.type === 'travel') {
    const travel = current as TravelGoal
    // 鎖定的移動目標：分數抬到最高，確保持續執行。
    // 不要求 targetKey 完全一致（位置型目標的 targetKey 會微變），只要 goal 相同且有合法 action。
    if (goal === travel.goal
      && result.actions && result.actions.some((a) => a.type !== 'hold')) {
      return { ...result, score: 1.0 }
    }
    // 其他移動類目標：壓低，避免繞圈切換（除非是擊殺/存錢等更高優先）
    if (isTravelGoalName(goal) && goal !== travel.goal) {
      return { ...result, score: 0 }
    }
  }
  return result
}

/** 鎖定一個移動目標（學招/任務/探索/清障/收集/防禦建設）。 */
export function lockTravelGoal(playerId: string, goal: GoalName, targetKey: string): void {
  const current = midTermGoals.get(playerId)
  // 不覆寫擊殺/存錢等更高優先的中期目標
  if (current && (current.type === 'kill' || current.type === 'save-money')) return
  midTermGoals.set(playerId, { type: 'travel', goal, targetKey })
}

/** 清除移動目標鎖定（若目前是 travel）。 */
export function clearTravelGoal(playerId: string): void {
  const current = midTermGoals.get(playerId)
  if (current?.type === 'travel') midTermGoals.delete(playerId)
}

/** 依本 step 最新評估結果清除已不可執行的移動目標。 */
export function invalidateTravelGoalIfUnavailable(
  playerId: string,
  goalResults: Partial<Record<GoalName, GoalResult>>,
): void {
  const current = midTermGoals.get(playerId)
  if (current?.type !== 'travel') return

  const result = goalResults[current.goal]
  // 只要鎖定目標的 goal 仍有合法（非 hold）action，就保留 lock。
  // 不要求 targetKey 完全一致：位置型目標（collectItems/exploration）的 targetKey
  // 會因 reachableInterests 排序或目標細節變化而微變，但玩家仍在往同類目標推進，
  // 若因 targetKey 微變就清除，會造成目標在 1-2 步內頻繁切換。
  const remainsExecutable = result
    && result.actions?.some((action) => action.type !== 'hold')
  if (!remainsExecutable) midTermGoals.delete(playerId)
}

/** 是否為「移動類」目標（需要鎖定避免繞圈）。 */
export function isTravelGoalName(goal: GoalName): boolean {
  return goal === 'learnMartialSkill'
    || goal === 'executeMission'
    || goal === 'exploration'
    || goal === 'construction'
    || goal === 'collectItems'
    || goal === 'repairEquipment'
    || goal === 'buildDefense'
    || goal === 'buyConsumable'
    || goal === 'buyEquipment'
}

/** 高風險逃生時清除中期目標（由 stepRunner 在高威脅時呼叫）。 */
export function abortMidTermGoal(playerId: string): void {
  midTermGoals.delete(playerId)
}

/** 測試輔助：清除所有中期目標。 */
export function clearMidTermGoals(): void {
  midTermGoals.clear()
}