import type { ActionExecutionResult, ActionOutcome, GameState } from './types'

type StateUpdater<T> = (state: GameState) => { state: GameState; result: T }

export function runActionOutcome(
  updateGameState: (updater: (state: GameState) => GameState) => void,
  action: StateUpdater<ActionOutcome>,
  fallbackReason: string,
): ActionOutcome {
  let result: ActionOutcome = { ok: false, reason: fallbackReason }
  updateGameState((state) => {
    const outcome = action(state)
    result = outcome.result
    return outcome.state
  })
  return result
}

export function runActionExecution<T>(
  updateGameState: (updater: (state: GameState) => GameState) => void,
  action: StateUpdater<ActionExecutionResult<T>>,
  fallbackReason: string,
): ActionExecutionResult<T> {
  let result: ActionExecutionResult<T> = { ok: false, reason: fallbackReason }
  updateGameState((state) => {
    const outcome = action(state)
    result = outcome.result
    return outcome.state
  })
  return result
}
