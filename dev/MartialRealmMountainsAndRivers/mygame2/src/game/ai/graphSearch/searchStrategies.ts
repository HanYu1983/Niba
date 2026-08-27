import type { AiNode } from './types'
import type { ExecuteAiActionDependencies } from '../execution/executeAiAction'

/**
 * 貪婪最長路徑搜索（V3 Phase 1）。
 * DFS + 分支剪枝，回傳累計分數最高的葉節點。
 */
export function greedyLongestPath(
  root: AiNode,
  maxDepth: number,
  dependencies: ExecuteAiActionDependencies,
): AiNode | null {
  let bestLeaf: AiNode | null = null
  let bestScore = -Infinity

  function dfs(current: AiNode): void {
    if (current.depth >= maxDepth) {
      if (current.cumulativeCost > bestScore) {
        bestScore = current.cumulativeCost
        bestLeaf = current
      }
      return
    }

    const edges = current instanceof Object && 'getEdges' in current
      ? (current as any).getEdges(dependencies)
      : []

    // 已在 getAdjacentNodes 內剪枝，此處直接展開
    for (const edge of edges) {
      dfs(edge.node)
    }

    // 如果沒有子節點，視為葉節點
    if (edges.length === 0) {
      if (current.cumulativeCost > bestScore) {
        bestScore = current.cumulativeCost
        bestLeaf = current
      }
    }
  }

  dfs(root)
  return bestLeaf
}
