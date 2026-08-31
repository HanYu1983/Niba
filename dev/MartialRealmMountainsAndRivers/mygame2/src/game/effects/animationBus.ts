import type { CreatureTurnResult } from '../actions/creatureActions'
import { animateCreatureTurn as animateCreatureTurnAction } from '../creatureAnimation'
import type { UpdateGameState } from '../store/createStore'

/**
 * AnimationBus：動畫／一次性視覺訊號的統一出口。
 *
 * 把「執行敵人行動動畫」這類需要 updateGameState 的視覺流程，
 * 從 gameStore 抽離，讓 store 專注於狀態管理，動畫流程有獨立職責。
 */
export function animateCreatureTurn(
  result: CreatureTurnResult,
  updateGameState: UpdateGameState,
): void {
  animateCreatureTurnAction(result, updateGameState)
}