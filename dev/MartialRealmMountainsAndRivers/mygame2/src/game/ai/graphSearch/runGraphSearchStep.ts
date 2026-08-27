import type { GameState } from '../../types'
import type { AiAction } from '../aiAction'
import type { ExecuteAiActionDependencies } from '../execution/executeAiAction'
import { makeRoot, extractPath } from './AiNodeImpl'
import { greedyLongestPath } from './searchStrategies'

const MAX_DEPTH = 3

/**
 * V3 圖搜索貪婪演算法入口函數。
 * 建立根節點 → 搜索最佳路徑 → 提取行動序列。
 */
export function runGraphSearchStep(
  state: GameState,
  playerId: string,
  dependencies: ExecuteAiActionDependencies,
): { actions: AiAction[]; exitReason?: string } {
  const player = state.players.find((p) => p.id === playerId)
  if (!player) return { actions: [], exitReason: '玩家不存在' }
  if (player.stamina <= 0) return { actions: [], exitReason: '體力耗盡' }

  const root = makeRoot(state, playerId)
  const bestLeaf = greedyLongestPath(root, MAX_DEPTH, dependencies)

  if (!bestLeaf) return { actions: [], exitReason: '搜索無結果' }

  const actions = extractPath(bestLeaf)
  if (actions.length === 0) return { actions: [], exitReason: '無可行動' }

  return { actions }
}
