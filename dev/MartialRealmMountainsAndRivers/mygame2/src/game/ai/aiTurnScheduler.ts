/**
 * Player AI 回合排程器（重構文件 §11 Turn Scheduler／§12 Phase 3）。
 *
 * 職責：把「防守（protect-base）」與「支援（support-player）」兩種 AI 訂單的
 * 執行框架合併在此——差異只剩 Policy（呼叫哪個 step）；計時、取消、
 * 失敗結束回合與防重入全部共用。
 *
 * 邊界規則（§11.2／§11.3）：
 * - 同一 Actor 不可同時存在兩個待執行 step（不重入）。
 * - 取消後不得執行 stale timer；Actor 不再是當前回合玩家時亦然。
 * - `setTimeout` 只作為動畫節奏，不作為遊戲規則來源。
 * - React 只負責啟動、停止與顯示；本模組不依賴 App.tsx 即可運作與測試。
 */

export const AI_TURN_STEP_DELAY_MS = 350

export type AiOrderKind = 'protect-base' | 'support-player' | 'construction' | 'test1' | 'test2'

export interface AiTurnSchedulerDeps {
  /** 讀取最新局面（判斷 Actor 是否仍是當前回合玩家）。 */
  getState(): { activePlayerId: string }
  runDefenseStep(actorId: string): { ok: boolean; reason?: string }
  runSupportStep(actorId: string): { ok: boolean; reason?: string }
  runConstructionStep(actorId: string): { ok: boolean; reason?: string }
  runTest1Step(actorId: string): { ok: boolean; reason?: string }
  runTest2Step(actorId: string): { ok: boolean; reason?: string }
  /** step 失敗且 Actor 仍在回合中時，結束其回合。 */
  endTurn(actorId: string): void
  /** step 失敗時通知 UI 顯示原因（可選）。 */
  onStepFailed?(actorId: string, reason: string): void
}

type TimerHandle = ReturnType<typeof setTimeout>

export interface AiTurnScheduler {
  /**
   * 為指定 Actor 排程下一步（延遲 {@link AI_TURN_STEP_DELAY_MS} 執行）。
   * 同一 Actor 已有待執行 step 時為冪等操作（不重入、不重置計時）；
   * 換 Actor 時會取消前一個待執行 step。
   */
  requestStep(actorId: string, orderType: AiOrderKind): void
  /** 取消待執行 step；之後不得再觸發 stale 回呼。 */
  cancel(): void
  /** 目前是否有待執行 step（可選擇性比對 Actor）。 */
  isPending(actorId?: string): boolean
}

export function createAiTurnScheduler(deps: AiTurnSchedulerDeps): AiTurnScheduler {
  let pendingActorId: string | null = null
  let timerHandle: TimerHandle | null = null

  function clearTimer(): void {
    if (timerHandle !== null) {
      clearTimeout(timerHandle)
      timerHandle = null
    }
    pendingActorId = null
  }

  return {
    requestStep(actorId, orderType): void {
      if (pendingActorId === actorId) {
        return
      }
      clearTimer()
      pendingActorId = actorId
      timerHandle = setTimeout(() => {
        timerHandle = null
        const scheduledActorId = pendingActorId
        pendingActorId = null
        // stale 防護：取消後或 Actor 已換人時不得執行。
        if (scheduledActorId === null || deps.getState().activePlayerId !== scheduledActorId) {
          return
        }
        const result = orderType === 'protect-base'
          ? deps.runDefenseStep(scheduledActorId)
          : orderType === 'support-player'
            ? deps.runSupportStep(scheduledActorId)
            : orderType === 'construction'
              ? deps.runConstructionStep(scheduledActorId)
              : orderType === 'test2'
                ? deps.runTest2Step(scheduledActorId)
                : deps.runTest1Step(scheduledActorId)
        if (!result.ok && deps.getState().activePlayerId === scheduledActorId) {
          if (result.reason) {
            deps.onStepFailed?.(scheduledActorId, result.reason)
          }
          deps.endTurn(scheduledActorId)
        }
      }, AI_TURN_STEP_DELAY_MS)
    },
    cancel(): void {
      clearTimer()
    },
    isPending(actorId?: string): boolean {
      return pendingActorId !== null && (actorId === undefined || pendingActorId === actorId)
    },
  }
}
