import type { GameState, PlayerState, Position } from '../../types'
import { listHostileActors, type HostileActor } from '../perception/targetDiscovery'
import { collectReachableInterests, type ReachableInterest } from '../perception/reachableInterests'
import { getBlockedPositions } from '../../rules/movementRules'
import { canTraverseTerrain } from '../../rules/playerDerivedRules'
import { getAdjacentPositions } from '../../types'

export interface FuzzyInputs {
  /** 能扛幾下攻擊（health / maxEnemyDamage），無敵人時 = 99 */
  hitsSurvivable: number
  /** 體力比 0~1 */
  staminaRatio: number
  /** 到最近威脅的距離 */
  distToNearestThreat: number
  /** 場上可見生物最高傷害力（粗估） */
  maxVisibleEnemyDamage: number
  /** 可到達的道具數量 */
  reachableItemCount: number
  /** 可到達的資源點數量 */
  reachableResourceCount: number
  /** 可到達的興趣點（道具 + 資源） */
  reachableInterests: ReturnType<typeof collectReachableInterests>
  /** 到最近道具的距離（格數），無道具 = Infinity */
  distToNearestItem: number
  /** 四方向可通行出口數（0~4） */
  exitCount: number
  /** 最近出口位置（曼哈頓 1 格內），無出口 = undefined */
  nearestExit: Position | undefined
}

function manhattan(a: Position, b: Position): number {
  return Math.abs(a.row - b.row) + Math.abs(a.column - b.column)
}

/**
 * 計算模糊輸入變數（每步重新呼叫，perception 基於當前 state）。
 *
 * V1 簡化：maxVisibleEnemyDamage 用 creature.health * 0.3 粗估，
 * 後續可替換為精確傷害公式。
 */
export function computeFuzzyInputs(state: GameState, player: PlayerState): FuzzyInputs {
  const hostiles = listHostileActors(state)

  // 粗估敵人最高傷害力：取最強生物的 health * 0.3
  const creatureHostiles = hostiles.filter((h): h is HostileActor & { sourceType: 'creature'; creature: { health: number; position: Position } } => h.sourceType === 'creature')
  const maxVisibleEnemyDamage = creatureHostiles.length > 0
    ? Math.max(...creatureHostiles.map((h) => Math.max(1, Math.floor(h.creature.health * 0.3))))
    : 0

  const hitsSurvivable = maxVisibleEnemyDamage > 0
    ? player.health / maxVisibleEnemyDamage
    : 99

  const distToNearestThreat = hostiles.length > 0
    ? Math.min(...hostiles.map((h) => manhattan(player.position, h.sourceType === 'creature' ? h.creature.position : h.nest.position)))
    : Infinity

  const interests = collectReachableInterests(state, player)
  const itemInterests = interests.filter((i: ReachableInterest) => i.kind === 'item')

  const distToNearestItem = itemInterests.length > 0
    ? Math.min(...itemInterests.map((i: ReachableInterest) => i.cost))
    : Infinity

  // 四方向出口計算：上下左右可通行且未被佔據 = 出口
  const blocked = new Set(
    getBlockedPositions(state, player.id).map((p) => `${p.row}-${p.column}`),
  )
  const cellsByPosition = new Map(state.map.cells.map((c) => [`${c.row}-${c.column}`, c]))
  const adjacents = getAdjacentPositions(player.position)
  let exitCount = 0
  let nearestExit: Position | undefined
  for (const pos of adjacents) {
    const cell = cellsByPosition.get(`${pos.row}-${pos.column}`)
    const isBlocked = blocked.has(`${pos.row}-${pos.column}`)
    if (cell && canTraverseTerrain(cell.terrain, player) && !isBlocked) {
      exitCount++
      if (!nearestExit) nearestExit = pos
    }
  }

  return {
    hitsSurvivable,
    staminaRatio: player.stamina / player.maxStamina,
    distToNearestThreat,
    maxVisibleEnemyDamage,
    reachableItemCount: itemInterests.length,
    reachableResourceCount: interests.filter((i: ReachableInterest) => i.kind === 'resource').length,
    reachableInterests: interests,
    distToNearestItem,
    exitCount,
    nearestExit,
  }
}
