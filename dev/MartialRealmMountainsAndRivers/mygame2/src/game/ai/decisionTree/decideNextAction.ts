import type { GameState } from '../../types'
import type { AiAction } from '../aiAction'
import { validateAiAction } from '../validation/validateAiAction'
import {
  isHealthCritical,
  isExhausted,
  findAdjacentCreature,
  findAdjacentItem,
  findAdjacentResourcePoint,
  needsBuildingMaterials,
  getOwnedBase,
  findUnexploredNearby,
  getVisibleCreatures,
} from './conditions'
import {
  buildRetreatAction,
  buildMoveToBaseAction,
  buildAttackAction,
  buildCollectItemAction,
  buildCollectResourceAction,
  buildExploreAction,
} from './actionBuilders'

/**
 * 決策樹 V2（方案 C：無狀態分層）
 *
 * 小樹（先 return）：保命、即時戰鬥
 * 中樹（中段 return）：撿道具、採集、建造
 * 大樹（最後 return）：探索（預設戰略）
 *
 * 每個條件成立 → 生成 candidate → validate → return。
 * 條件不成立或 validation 失敗 → fall through 到下一棵。
 */
export function decideNextAction(state: GameState, playerId: string): AiAction | null {
  const player = state.players.find((p) => p.id === playerId)
  if (!player) return null

  // ═══════════════════════════════════════════════════
  // 小樹 1：保命
  // ═══════════════════════════════════════════════════

  // 1.1 血量極低 → 逃命
  if (isHealthCritical(player)) {
    const candidate = buildRetreatAction(state, player)
    if (candidate && validateAiAction(state, candidate).valid) return candidate
  }

  // 1.2 體力耗盡 → 回據點
  if (isExhausted(player)) {
    const candidate = buildMoveToBaseAction(state, player)
    if (candidate && validateAiAction(state, candidate).valid) return candidate
  }

  // ═══════════════════════════════════════════════════
  // 小樹 2：即時戰鬥
  // ═══════════════════════════════════════════════════

  // 2.1 旁邊有怪 → 打
  const adjacentCreature = findAdjacentCreature(state, player)
  if (adjacentCreature && player.stamina >= 5) {
    const candidate = buildAttackAction(state, player, adjacentCreature)
    if (candidate && validateAiAction(state, candidate).valid) return candidate
  }

  // 2.2 近距離有怪（2格內）+ 體力足 → 走過去
  if (player.stamina >= 5) {
    const visible = getVisibleCreatures(state, player.id)
    const nearby = visible
      .filter((a) => {
        const pos = a.sourceType === 'creature' ? a.creature.position : a.nest.position
        const dist = Math.abs(pos.row - player.position.row) + Math.abs(pos.column - player.position.column)
        return dist <= 2
      })
      .sort((a, b) => {
        const posA = a.sourceType === 'creature' ? a.creature.position : a.nest.position
        const posB = b.sourceType === 'creature' ? b.creature.position : b.nest.position
        const dA = Math.abs(posA.row - player.position.row) + Math.abs(posA.column - player.position.column)
        const dB = Math.abs(posB.row - player.position.row) + Math.abs(posB.column - player.position.column)
        return dA - dB
      })[0]
    if (nearby) {
      const candidate = buildAttackAction(state, player, nearby)
      if (candidate && validateAiAction(state, candidate).valid) return candidate
    }
  }

  // ═══════════════════════════════════════════════════
  // 中樹 3：撿道具
  // ═══════════════════════════════════════════════════

  const adjacentItem = findAdjacentItem(state, player)
  if (adjacentItem) {
    const candidate = buildCollectItemAction(state, player, adjacentItem.id, adjacentItem.position)
    if (candidate && validateAiAction(state, candidate).valid) return candidate
  }

  // ═══════════════════════════════════════════════════
  // 中樹 4：建造 / 採集
  // ═══════════════════════════════════════════════════

  const base = getOwnedBase(state, player.id)
  if (base) {
    const isAtBase = Math.abs(player.position.row - base.position.row) + Math.abs(player.position.column - base.position.column) <= 1

    // 4.1 已與據點相鄰 + 建料足夠 → 建造
    if (isAtBase && base.buildingMaterials >= 3) {
      const candidate: AiAction = {
        type: 'build',
        actor: { id: player.id, kind: 'player' },
        baseId: base.id,
        buildingType: 'basic',
        reason: '建造防禦',
      }
      if (validateAiAction(state, candidate).valid) return candidate
    }

    // 4.2 旁邊有資源點 + 建料不足 → 採集
    if (needsBuildingMaterials(state, player.id)) {
      const resource = findAdjacentResourcePoint(state, player)
      if (resource) {
        const candidate = buildCollectResourceAction(state, player, resource.id, resource.position)
        if (candidate && validateAiAction(state, candidate).valid) return candidate
      }
    }

    // 4.3 不在據點旁 → 移動到據點
    if (!isAtBase) {
      const candidate = buildMoveToBaseAction(state, player)
      if (candidate && validateAiAction(state, candidate).valid) return candidate
    }

    // 4.4 需要建料 + 不在資源點旁 → 移動到資源點
    if (needsBuildingMaterials(state, player.id)) {
      const nearest = state.resourcePoints.reduce(
        (best, rp) => {
          const dRp = Math.abs(rp.position.row - player.position.row) + Math.abs(rp.position.column - player.position.column)
          const dB = best ? Math.abs(best.position.row - player.position.row) + Math.abs(best.position.column - player.position.column) : Infinity
          return dRp < dB ? rp : best
        },
        null as typeof state.resourcePoints[0] | null,
      )
      if (nearest) {
        const candidate = buildCollectResourceAction(state, player, nearest.id, nearest.position)
        if (candidate && validateAiAction(state, candidate).valid) return candidate
      }
    }
  }

  // ═══════════════════════════════════════════════════
  // 大樹 5：探索（預設戰略）
  // ═══════════════════════════════════════════════════

  const unexplored = findUnexploredNearby(state, player)
  if (unexplored) {
    const candidate = buildExploreAction(state, player, unexplored)
    if (candidate && validateAiAction(state, candidate).valid) return candidate
  }

  // ═══════════════════════════════════════════════════
  // 兜底：待命
  // ═══════════════════════════════════════════════════
  return null
}
