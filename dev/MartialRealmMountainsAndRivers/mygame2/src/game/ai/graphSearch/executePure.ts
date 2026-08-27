import type { GameState } from '../../types'
import type { AiAction } from '../aiAction'
import { executeAiAction, type ExecuteAiActionDependencies } from '../execution/executeAiAction'

export function executePure(
  state: GameState,
  action: AiAction,
  dependencies: ExecuteAiActionDependencies,
): GameState {
  const copy = structuredClone(state)
  const result = executeAiAction(copy, action, dependencies)
  return result.state
}
