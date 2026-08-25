import type { ActionOutcome, AttackTargetType, GameState } from '../../types'
import type { AiAction } from '../aiAction'
import { movePlayer } from '../../actions/movementActions'
import { collectResourcePoint } from '../../actions/explorationActions'
import { constructBuilding } from '../../actions/buildingActions'
import { endPlayerTurn, type TurnActionDependencies } from '../../actions/turnActions'
import { executeAiAttack } from './executeAiAttack'
import { collectItemPointAction } from '../../actions/itemActions'
import type { CombatActionDependencies } from '../../actions/combatActions'

export type ExecuteAiActionDependencies = {
  combat: CombatActionDependencies
  turn: TurnActionDependencies
}

/**
 * 通用 AI 行動執行器（純領域函數）：validate → execute → return。
 *
 * 所有 AI 行動經此單一入口執行，確保一致性與可測試性。
 * 呼叫端負責驗證（validateAiAction）與記錄（recordAiStepEvent）。
 */
export function executeAiAction(
  state: GameState,
  action: AiAction,
  dependencies: ExecuteAiActionDependencies,
): { state: GameState; result: ActionOutcome } {
  switch (action.type) {
    case 'move':
      return movePlayer(state, action.actor.id, action.destination.row, action.destination.column)
    case 'attack': {
      const result = executeAiAttack(state, action.actor.id, action.target.kind as AttackTargetType, action.target.id, dependencies.combat)
      return { state: result.state, result: result.result }
    }
    case 'collect': {
      if (action.target.kind === 'item') {
        const result = collectItemPointAction(state, action.actor.id, action.target.id)
        return { state: result.state, result: result.result }
      }
      const result = collectResourcePoint(state, action.actor.id, action.target.id)
      return { state: result.state, result: result.result }
    }
    case 'build': {
      const result = constructBuilding(state, action.baseId, action.buildingType, action.actor.id)
      return { state: result.state, result: result.result }
    }
    case 'hold':
      return { state, result: { ok: true } }
    // 注意：此分支僅回傳純 state，不會觸發 creature turn 動畫
    // （animateCreatureTurn 等 side-effect 必須由 store 方法處理）。
    // 呼叫端若需完整回合結束流程，應直接使用 gameStore.endPlayerTurn。
    case 'end-turn': {
      const result = endPlayerTurn(state, action.actor.id, dependencies.turn)
      return { state: result.state, result: { ok: true } }
    }
    // allocate-attribute / use-item / equip 由 gameStore 層直接處理，不經過此領域函數。
    default:
      return { state, result: { ok: false, reason: `未知行動類型：${(action as { type: string }).type}` } }
  }
}
