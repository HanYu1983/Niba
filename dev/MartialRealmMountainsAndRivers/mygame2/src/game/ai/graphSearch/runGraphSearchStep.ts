import type { GameState } from '../../types'
import type { AiAction } from '../aiAction'
import type { ExecuteAiActionDependencies } from '../execution/executeAiAction'
import { makeRoot, extractPath } from './AiNodeImpl'
import { greedyLongestPath } from './searchStrategies'

const MAX_DEPTH = 3

/**
 * V3 圖搜索貪婪演算法入口函數。
 * 建立根節點 → 搜索最佳路徑 → 提取行動序列。
 *
 * @returns actions  實際要執行的行動（不含 end-turn）
 * @returns endTurn  最佳路徑以結束回合收尾（或無可用行動）時為 true，
 *                   呼叫端應於執行完 actions 後結束回合。
 */
export function runGraphSearchStep(
  state: GameState,
  playerId: string,
  dependencies: ExecuteAiActionDependencies,
): { actions: AiAction[]; endTurn: boolean; exitReason?: string } {
  const player = state.players.find((p) => p.id === playerId)
  if (!player) return { actions: [], endTurn: true, exitReason: '玩家不存在' }
  if (player.stamina <= 0) return { actions: [], endTurn: true, exitReason: '體力耗盡' }

  const root = makeRoot(state, playerId)
  const bestLeaf = greedyLongestPath(root, MAX_DEPTH, dependencies)

  if (!bestLeaf) {
    // 無任何節點，直接結束回合
    return { actions: [], endTurn: true, exitReason: '搜索無結果' }
  }

  const fullPath = extractPath(bestLeaf)
  if (fullPath.length === 0) {
    return { actions: [], endTurn: true, exitReason: '無可行動' }
  }

  // 剝離尾端的 end-turn：end-turn 是「結束回合」的訊號，交由呼叫端於執行完 actions 後結束，
  // 不作為實際行動執行（避免在迴圈內觸發完整的 endPlayerTurn 連鎖）。
  const endTurn = fullPath[fullPath.length - 1].type === 'end-turn'
  const actions = endTurn ? fullPath.slice(0, -1) : fullPath

  return { actions, endTurn }
}
