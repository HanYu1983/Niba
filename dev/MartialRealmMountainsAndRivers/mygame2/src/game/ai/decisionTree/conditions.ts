import type { GameState, PlayerState, Position } from '../../types'
import { isAdjacent, isSamePosition } from '../../types'
import type { HostileActor } from '../perception/targetDiscovery'
import { listHostileActors } from '../perception/targetDiscovery'
import { getPlayerVisibleCellIds, getFoggedCellIds } from '../../rules/visibilityRules'
import { itemCatalog } from '../../catalogs/itemCatalog'

// ─── 保命條件 ──────────────────────────────────────

export function isHealthCritical(player: PlayerState): boolean {
  return player.health <= player.maxHealth * 0.2
}

export function isHealthLow(player: PlayerState): boolean {
  return player.health <= player.maxHealth * 0.4
}

/** 玩家背包中所有回血道具（effect === 'health'），依回血量由小到大排序回 [{itemId, healAmount}]。 */
export function getHealingItemsByAmount(player: PlayerState): { itemId: string; healAmount: number }[] {
  return (player.inventory ?? [])
    .filter((entry) => entry.quantity > 0)
    .map((entry) => {
      const def = itemCatalog.find((item) => item.id === entry.itemId)
      if (!def || def.effect !== 'health' || !def.effectValue) return null
      return { itemId: entry.itemId, healAmount: def.effectValue }
    })
    .filter((x): x is { itemId: string; healAmount: number } => x !== null)
    .sort((a, b) => a.healAmount - b.healAmount)
}

/**
 * 需要回血時要使用的回血道具（取回血量最小者）。
 * 條件：現有血量與滿血的差距 ≧ 最小回血道具量，或現有血量 < 15。
 * 無道具或不需要回血時回 null。
 */
export function findHealingItemToUse(player: PlayerState): { itemId: string; healAmount: number } | null {
  const items = getHealingItemsByAmount(player)
  if (items.length === 0) return null
  const smallest = items[0]
  const deficit = player.maxHealth - player.health
  if (deficit >= smallest.healAmount) return smallest
  if (player.health < 15) return smallest
  return null
}

export function isExhausted(player: PlayerState): boolean {
  return player.stamina <= 2
}

export function getVisibleCreatures(state: GameState, playerId: string): HostileActor[] {
  const visibleCellIds = getPlayerVisibleCellIds(state, playerId)
  return listHostileActors(state).filter((a) => {
    const pos = a.sourceType === 'creature' ? a.creature.position : a.nest.position
    return state.map.cells.some((c) => c.row === pos.row && c.column === pos.column && visibleCellIds.has(c.id))
  })
}

export function findAdjacentCreature(state: GameState, player: PlayerState): HostileActor | null {
  const visible = getVisibleCreatures(state, player.id)
  return visible.find((a) => {
    const pos = a.sourceType === 'creature' ? a.creature.position : a.nest.position
    return isAdjacent(player.position, pos)
  }) ?? null
}

// ─── 道具條件 ──────────────────────────────────────

/** 道具只可「同格」拾取，因此以是否站在道具所在格判斷。 */
export function findAdjacentItem(state: GameState, player: PlayerState) {
  return state.itemPoints.find((item) => isSamePosition(player.position, item.position)) ?? null
}

// ─── 資源條件 ──────────────────────────────────────

export function findAdjacentResourcePoint(state: GameState, player: PlayerState) {
  return state.resourcePoints.find((rp) => isAdjacent(player.position, rp.position)) ?? null
}

export function needsBuildingMaterials(state: GameState, playerId: string): boolean {
  const base = getVisibleOwnedBase(state, playerId)
  if (!base) return false
  return base.buildingMaterials < base.maxBuildingMaterials * 0.7
}

// ─── 建造條件 ──────────────────────────────────────

/** 所有存活據點（未限制視野；供「無據點可用」的最終情境判斷）。 */
export function getOwnedBase(state: GameState, _playerId: string) {
  return state.bases.find((b) => b.active !== false && b.health > 0) ?? null
}

/**
 * 視野內可見的存活據點。
 *
 * 決策樹的建造／採集／回據點邏輯必須以「玩家視野內可見的據點」為判斷依據，
 * 而非地圖上所有據點（不可見據點等同未知，不應據以規劃動作）。
 *
 * 開通的據點（discovered）會永久提供其周邊視野（見 visibilityRules），
 * 因此其所在格必然在可見集合內——只需以 getPlayerVisibleCellIds 判斷即可。
 */
export function getVisibleOwnedBase(state: GameState, playerId: string) {
  const visible = getPlayerVisibleCellIds(state, playerId)
  const base = getOwnedBase(state, playerId)
  if (!base) return null
  const cellKey = `${base.position.row}-${base.position.column}`
  if (!visible.has(cellKey)) return null
  return base
}

// ─── 探索條件 ──────────────────────────────────────

/**
 * 找出「最近的探索目標格」。
 *
 * 只從有戰爭迷霧的格子中尋找：迷霧格 = 不在永久已探索清單（exploredCellIds）中的格，
 * 與視野範圍無關。再排除有地上物（玩家、怪物、據點、巢穴、資源點、物品點、廢墟、
 * 門派據點、防禦設施、陷阱、探索事件）與牆壁的格，以曼哈頓距離挑出離玩家最近者。
 * 其餘一概不管（不校驗剩餘體力可達性、不設探索距離上限）。
 */
export function findUnexploredNearby(state: GameState, player: PlayerState): Position | null {
  const fogged = getFoggedCellIds(state)

  const occupied = new Set<string>()
  const add = (pos: Position | undefined): void => {
    if (pos && Number.isFinite(pos.row) && Number.isFinite(pos.column)) {
      occupied.add(`${pos.row}-${pos.column}`)
    }
  }
  for (const p of state.players) add(p.position)
  for (const c of state.creatures) add(c.position)
  for (const b of state.bases) add(b.position)
  for (const n of state.creatureNests ?? []) add(n.position)
  for (const rp of state.resourcePoints) add(rp.position)
  for (const ip of state.itemPoints) add(ip.position)
  for (const r of state.ruins ?? []) add(r.position)
  for (const s of state.sectGates ?? []) add(s.position)
  for (const d of state.defenseStructures ?? []) add(d.position)
  for (const t of state.traps ?? []) add(t.position)
  for (const e of state.explorationEvents ?? []) add(e.position)

  let best: Position | null = null
  let bestDist = Infinity
  for (const cell of state.map.cells) {
    if (cell.terrain === 'wall') continue
    if (occupied.has(cell.id)) continue
    if (!fogged.has(cell.id)) continue
    const dist = manhattan(player.position, { row: cell.row, column: cell.column })
    if (dist < bestDist) {
      bestDist = dist
      best = { row: cell.row, column: cell.column }
    }
  }
  return best
}

// ─── 距離工具 ──────────────────────────────────────

export function manhattan(a: Position, b: Position): number {
  return Math.abs(a.row - b.row) + Math.abs(a.column - b.column)
}
