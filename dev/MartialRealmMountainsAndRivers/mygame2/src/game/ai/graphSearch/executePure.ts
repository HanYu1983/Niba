import type { GameState } from '../../types'
import type { AiAction } from '../aiAction'
import { executeAiAction, type ExecuteAiActionDependencies } from '../execution/executeAiAction'

/**
 * 純執行：對 state 套用單一 AI 行動並回傳新 state。
 *
 * 所有 domain action（movePlayer / collectResourcePoint / executeAiAttack 等）
 * 皆為 immutable（以 spread 回傳新物件，不就地變異輸入），因此不需
 * structuredClone 深拷貝——直接傳入即可，輸入 state 不會被污染。
 */
export function executePure(
  state: GameState,
  action: AiAction,
  dependencies: ExecuteAiActionDependencies,
): GameState {
  const result = executeAiAction(state, action, dependencies)
  return result.state
}
