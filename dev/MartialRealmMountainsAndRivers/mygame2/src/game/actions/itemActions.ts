import type { ActionExecutionResult, ActionOutcome, GameState, InventoryEntry, LootResult, PlayerState, TrapState, BuffInstance } from '../types'
import { isSamePosition, getAdjacentPositions, type Position } from '../types'
import { canPlayerPerformAction } from '../rules/actionCostRules'
import { addLootToPlayer, createItemPointLootForPlayer, createLootFromId } from '../lootFactory'
import { incrementRunStat } from '../runStats'
import { replenishInteractionPoint } from '../worldGeneration'
import { itemCatalog } from '../catalogs/itemCatalog'
import { canTraverseTerrain, getEffectiveAttributesForPlayer, getBuff, getPlayerResourceLimit } from '../rules/playerDerivedRules'
import { getActionablePlayer } from '../rules/actionCostRules'
import { restoreAfterAttributeChange } from '../characterFactory'
import { getScoutCellIds, updatePlayerVisibility } from '../rules/visibilityRules'
import { getOccupiedPositions, MOVEMENT_LAYERS } from '../rules/occupancyRules'

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

/**
 * 使用道具的純領域函數：validate → execute → return。
 * 對應 gameStore.useItem 的完整邏輯。
 */
export function useItemAction(
  state: GameState,
  playerId: string,
  itemId: string,
): { state: GameState; result: ActionOutcome } {
  const player = getActionablePlayer(state, playerId)
  const item = itemCatalog.find((currentItem) => currentItem.id === itemId)
  const inventoryEntry: InventoryEntry | undefined = player?.inventory.find((entry: InventoryEntry) => entry.itemId === itemId)

  if (
    !player ||
    !item ||
    !inventoryEntry ||
    inventoryEntry.quantity <= 0 ||
    state.activePlayerId !== playerId ||
    player.turnEnded
  ) {
    return { state, result: { ok: false, reason: '道具不存在、數量不足，或目前無法行動。' } }
  }

  if (player.itemEffectsUsedThisTurn?.includes(item.effect)) {
    return { state, result: { ok: false, reason: '本回合已使用過此類道具。' } }
  }

  // 消耗道具的通用輔助：扣除庫存數量。
  const consumeItem = (currentPlayer: PlayerState): PlayerState => ({
    ...currentPlayer,
    health: Math.max(0, currentPlayer.health - (item.cost?.health ?? 0)),
    stamina: Math.max(0, currentPlayer.stamina - (item.cost?.stamina ?? 0)),
    innerPower: Math.max(0, currentPlayer.innerPower - (item.cost?.innerPower ?? 0)),
    inventory: currentPlayer.inventory
      .map((entry) =>
        entry.itemId === itemId
          ? { ...entry, quantity: entry.quantity - 1 }
          : entry,
      )
      .filter((entry) => entry.quantity > 0),
  })

  // ===== 屬性提升類（attribute-up）：永久 +1 單一屬性，無上限 =====
  if (item.effect === 'attribute-up') {
    if (!item.attribute) {
      return { state, result: { ok: false, reason: '此道具未指定提升屬性。' } }
    }
    return {
      state: {
        ...state,
        players: state.players.map((currentPlayer) => {
          if (currentPlayer.id !== playerId) return currentPlayer
          const consumed = consumeItem(currentPlayer)
          const baseAttributes = consumed.baseAttributes ?? consumed.attributes
          const nextAttributes = {
            ...baseAttributes,
            [item.attribute!]: Math.max(1, baseAttributes[item.attribute!] + (item.effectValue ?? 1)),
          }
          return restoreAfterAttributeChange(
            { ...consumed, baseAttributes: nextAttributes, itemEffectsUsedThisTurn: [...(consumed.itemEffectsUsedThisTurn ?? []), 'attribute-up'] },
            getEffectiveAttributesForPlayer({ ...consumed, baseAttributes: nextAttributes }),
          )
        }),
      },
      result: { ok: true },
    }
  }

  // ===== 陷阱類（trap）：在當前格放置陷阱 =====
  if (item.effect === 'trap') {
    if (!item.trapType) {
      return { state, result: { ok: false, reason: '此陷阱未指定種類。' } }
    }
    const existingTrap = (state.traps ?? []).find((trap) =>
      isSamePosition(trap.position, player.position),
    )
    if (existingTrap) {
      return { state, result: { ok: false, reason: '當前格已有陷阱。' } }
    }
    const trap: TrapState = {
      id: `trap:${itemId}:${Date.now()}`,
      position: player.position,
      type: item.trapType,
      ownerPlayerId: playerId,
      damage: item.trapType === 'snare' ? (item.effectValue ?? 15) : undefined,
    }
    return {
      state: {
        ...state,
        traps: [...(state.traps ?? []), trap],
        players: state.players.map((currentPlayer) =>
          currentPlayer.id === playerId
            ? { ...consumeItem(currentPlayer), itemEffectsUsedThisTurn: [...(currentPlayer.itemEffectsUsedThisTurn ?? []), 'trap'] }
            : currentPlayer,
        ),
      },
      result: { ok: true },
    }
  }

  // ===== 探地符（scout）：揭示半徑 effectValue 格 =====
  if (item.effect === 'scout') {
    const scoutRange = item.effectValue ?? 6
    const scoutCellIds = getScoutCellIds(state.map, player.position, scoutRange)
    const visibility = state.visibility ?? { exploredCellIds: [], mode: 'fog' as const }
    const revealedCellIds = state.creatures
      .filter((creature) => creature.health > 0)
      .filter((creature) =>
        Math.abs(creature.position.row - player.position.row) +
          Math.abs(creature.position.column - player.position.column) <= scoutRange,
      )
      .map((creature) => {
        const cell = state.map.cells.find((candidate) =>
          candidate.row === creature.position.row && candidate.column === creature.position.column,
        )
        return cell?.id
      })
      .filter((cellId): cellId is string => Boolean(cellId))
    return {
      state: {
        ...state,
        visibility: {
          ...visibility,
          exploredCellIds: [...new Set([...visibility.exploredCellIds, ...scoutCellIds])],
        },
        revealedCreatureCellIds: [...new Set([...(state.revealedCreatureCellIds ?? []), ...revealedCellIds])],
        revealedCreatureUntilRound: state.round + 1,
        players: state.players.map((currentPlayer) =>
          currentPlayer.id === playerId
            ? { ...consumeItem(currentPlayer), itemEffectsUsedThisTurn: [...(currentPlayer.itemEffectsUsedThisTurn ?? []), 'scout'] }
            : currentPlayer,
        ),
      },
      result: { ok: true },
    }
  }

  // ===== 鳴鑼符（reveal-creatures）：暫時揭示全圖怪物位置 =====
  if (item.effect === 'reveal-creatures') {
    const revealedCellIds = state.creatures
      .filter((creature) => creature.health > 0)
      .map((creature) => {
        const cell = state.map.cells.find((candidate) =>
          candidate.row === creature.position.row && candidate.column === creature.position.column,
        )
        return cell?.id
      })
      .filter((cellId): cellId is string => Boolean(cellId))
    return {
      state: {
        ...state,
        revealedCreatureCellIds: revealedCellIds,
        revealedCreatureUntilRound: state.round + 1,
        players: state.players.map((currentPlayer) =>
          currentPlayer.id === playerId
            ? { ...consumeItem(currentPlayer), itemEffectsUsedThisTurn: [...(currentPlayer.itemEffectsUsedThisTurn ?? []), 'reveal-creatures'] }
            : currentPlayer,
        ),
      },
      result: { ok: true },
    }
  }

  // ===== 回營符（recall-base）：撤退到最近據點 =====
  if (item.effect === 'recall-base') {
    const activeBases = state.bases.filter((base) => base.active !== false)
    if (activeBases.length === 0) {
      return { state, result: { ok: false, reason: '目前沒有可用的據點。' } }
    }
    const manhattan = (a: Position, b: Position) =>
      Math.abs(a.row - b.row) + Math.abs(a.column - b.column)
    let nearestBase = activeBases[0]
    let minDistance = manhattan(player.position, nearestBase.position)
    for (const base of activeBases) {
      const distance = manhattan(player.position, base.position)
      if (distance < minDistance) {
        nearestBase = base
        minDistance = distance
      }
    }
    const isPositionFree = (position: Position) => {
      const cell = state.map.cells.find((candidate) =>
        candidate.row === position.row && candidate.column === position.column,
      )
      if (!cell || !canTraverseTerrain(cell.terrain, player)) return false
      const occupied = getOccupiedPositions(state, {
        excludePlayerId: playerId,
        excludeBaseId: nearestBase.id,
        layers: MOVEMENT_LAYERS,
      })
      return !occupied.some((occupiedPosition) => isSamePosition(occupiedPosition, position))
    }
    const targetPosition =
      getAdjacentPositions(nearestBase.position).find((position) => isPositionFree(position))
      ?? (isPositionFree(nearestBase.position) ? nearestBase.position : undefined)
    if (!targetPosition) {
      return { state, result: { ok: false, reason: '最近據點周圍沒有可落腳的空格。' } }
    }
    return {
      state: {
        ...state,
        players: state.players.map((currentPlayer) =>
          currentPlayer.id === playerId
            ? { ...consumeItem(currentPlayer), position: targetPosition, itemEffectsUsedThisTurn: [...(currentPlayer.itemEffectsUsedThisTurn ?? []), 'recall-base'] }
            : currentPlayer,
        ),
        visibility: updatePlayerVisibility({ ...state, players: state.players.map((currentPlayer) =>
          currentPlayer.id === playerId ? { ...currentPlayer, position: targetPosition } : currentPlayer,
        ) }, playerId),
      },
      result: { ok: true },
    }
  }

  // ===== 元素爆發類（element-burst）：需選格 =====
  if (item.effect === 'element-burst') {
    return {
      state: {
        ...state,
        operation: { type: 'targeting-item', itemId },
      },
      result: { ok: true },
    }
  }

  // ===== Buff 型道具 =====
  if (item.effect === 'buff') {
    if (!item.buffDefinitionId) {
      return { state, result: { ok: false, reason: '此 Buff 定義不存在。' } }
    }
    const buffInstance: BuffInstance = {
      id: `item:${itemId}:${Date.now()}`,
      definitionId: item.buffDefinitionId,
      sourceId: itemId,
      remainingRounds: getBuff(item.buffDefinitionId)?.duration === 'rounds'
        ? getBuff(item.buffDefinitionId)?.durationRounds ?? null
        : null,
    }
    return {
      state: {
        ...state,
        players: state.players.map((currentPlayer) => {
          if (currentPlayer.id !== playerId) return currentPlayer
          const withBuff = { ...currentPlayer, buffs: [...(currentPlayer.buffs ?? []), buffInstance] }
          return {
            ...withBuff,
            maxHealth: getPlayerResourceLimit(withBuff, 'health'),
            maxStamina: getPlayerResourceLimit(withBuff, 'stamina'),
            maxInnerPower: getPlayerResourceLimit(withBuff, 'innerPower'),
            inventory: currentPlayer.inventory
              .map((entry) =>
                entry.itemId === itemId
                  ? { ...entry, quantity: entry.quantity - 1 }
                  : entry,
              )
              .filter((entry) => entry.quantity > 0),
            itemEffectsUsedThisTurn: [...(currentPlayer.itemEffectsUsedThisTurn ?? []), item.effect],
            turnEnded: currentPlayer.turnEnded,
          }
        }),
      },
      result: { ok: true },
    }
  }

  // ===== 恢復類（health / stamina / inner-power）=====
  const nextValue = item.effect === 'health'
    ? Math.min(player.maxHealth, player.health + (item.effectValue ?? 0))
    : item.effect === 'stamina'
      ? Math.min(player.maxStamina, player.stamina + (item.effectValue ?? 0))
      : item.effect === 'inner-power'
        ? Math.min(player.maxInnerPower, player.innerPower + (item.effectValue ?? 0))
        : player.health

  const fullValue = item.effect === 'health'
    ? player.health
    : item.effect === 'stamina'
      ? player.stamina
      : item.effect === 'inner-power'
        ? player.innerPower
        : player.health

  if (nextValue === fullValue) {
    return { state, result: { ok: false, reason: '目前已達該道具效果的恢復上限。' } }
  }

  const nextPlayerResource = {
    health: item.effect === 'health' ? nextValue : Math.max(0, player.health - (item.cost?.health ?? 0)),
    stamina: item.effect === 'stamina' ? nextValue : Math.max(0, player.stamina - (item.cost?.stamina ?? 0)),
    innerPower: item.effect === 'inner-power' ? nextValue : Math.max(0, player.innerPower - (item.cost?.innerPower ?? 0)),
  }

  return {
    state: {
      ...state,
      players: state.players.map((currentPlayer) =>
        currentPlayer.id === playerId
          ? {
            ...currentPlayer,
            health: nextPlayerResource.health,
            stamina: nextPlayerResource.stamina,
            innerPower: nextPlayerResource.innerPower,
            itemEffectsUsedThisTurn: [...(currentPlayer.itemEffectsUsedThisTurn ?? []), item.effect],
            inventory: currentPlayer.inventory
              .map((entry) =>
                entry.itemId === itemId
                  ? { ...entry, quantity: entry.quantity - 1 }
                  : entry,
              )
              .filter((entry) => entry.quantity > 0),
            turnEnded: currentPlayer.turnEnded,
          }
          : currentPlayer,
      ),
    },
    result: { ok: true },
  }
}
