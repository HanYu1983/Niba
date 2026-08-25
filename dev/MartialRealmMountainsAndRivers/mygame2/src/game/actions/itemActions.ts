import type { ActionExecutionResult, GameState, LootResult } from '../types'
import { canPlayerPerformAction } from '../rules/actionCostRules'
import { addLootToPlayer, createItemPointLootForPlayer, createLootFromId } from '../lootFactory'
import { incrementRunStat } from '../runStats'
import { replenishInteractionPoint } from '../worldGeneration'

export type CollectItemPointResult = {
  state: GameState
  result: ActionExecutionResult<LootResult[]>
}

/**
 * 撿取道具點的純領域函數：驗證 → 掉落 → 移除道具點 → 補充互動點。
 *
 * - 玩家必須與道具點同格。
 * - 自訂掉落物依機率逐一判定；否則依地形隨機掉落單一物資。
 */
export function collectItemPointAction(
  state: GameState,
  playerId: string,
  itemPointId: string,
): CollectItemPointResult {
  const itemPoint = state.itemPoints.find((point) => point.id === itemPointId)
  const player = state.players.find((candidate) => candidate.id === playerId)

  if (
    !itemPoint ||
    !player ||
    player.position.row !== itemPoint.position.row ||
    player.position.column !== itemPoint.position.column
  ) {
    return { state, result: { ok: false, reason: '道具點不存在、玩家未進入所在格，或目前無法行動。' } }
  }

  const turnCheck = canPlayerPerformAction(state, playerId, 0)
  if (!turnCheck.ok) {
    return { state, result: { ok: false, reason: turnCheck.reason ?? '目前無法行動。' } }
  }

  const terrain = state.map.cells.find((cell) => cell.row === itemPoint.position.row && cell.column === itemPoint.position.column)?.terrain
  const loots: LootResult[] = itemPoint.customDrops && itemPoint.customDrops.length > 0
    ? itemPoint.customDrops
        .filter((drop) => Math.random() * 100 < drop.chance)
        .map((drop) => createLootFromId(player, drop.lootId))
        .filter((loot): loot is LootResult => loot !== undefined)
    : [createItemPointLootForPlayer(player, terrain)]

  const nextState = {
    ...state,
    itemPoints: state.itemPoints.filter((point) => point.id !== itemPointId),
    players: state.players.map((currentPlayer) =>
      currentPlayer.id === playerId
        ? {
            ...currentPlayer,
            ...loots.reduce((acc, loot) => addLootToPlayer(acc, loot), currentPlayer),
            turnEnded: currentPlayer.turnEnded,
          }
        : currentPlayer,
    ),
  }
  return {
    state: incrementRunStat(replenishInteractionPoint(nextState, true, null), 'itemsCollected'),
    result: { ok: true, data: loots },
  }
}
