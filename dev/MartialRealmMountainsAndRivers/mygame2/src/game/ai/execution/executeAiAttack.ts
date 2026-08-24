import type { ActionExecutionResult, AttackExecutionResult, AttackTargetType, GameState } from '../../types'
import { createAttackPreview } from '../../previewOrchestration'
import { executeAttack, type CombatActionDependencies } from '../../actions/combatActions'

/**
 * AI 攻擊的原子 domain action：當場計算傷害並結算，不寫入 UI Preview。
 * 目標合法性仍走既有 getAttackTarget／createAttackPreview，因此執行前會再驗證一次。
 */
export function executeAiAttack(
  state: GameState,
  playerId: string,
  targetType: AttackTargetType,
  targetId: string,
  dependencies: CombatActionDependencies,
): { state: GameState; result: ActionExecutionResult<AttackExecutionResult> } {
  const preview = createAttackPreview(state, dependencies.getActionablePlayer(state, playerId), targetType, targetId)
  if (!preview) {
    return { state, result: { ok: false, reason: '攻擊目標已不存在或無法攻擊。' } }
  }
  return executeAttack(state, preview, dependencies)
}
