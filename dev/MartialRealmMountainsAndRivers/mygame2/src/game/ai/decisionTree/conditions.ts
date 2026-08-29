import type { GameState, PlayerState, Position, UpgradeableAttribute, BaseState } from '../../types'
import { isAdjacent, isSamePosition, isSameOrAdjacent } from '../../types'
import type { HostileActor } from '../perception/targetDiscovery'
import { listHostileActors } from '../perception/targetDiscovery'
import { getPlayerVisibleCellIds, getFoggedCellIds } from '../../rules/visibilityRules'
import { itemCatalog } from '../../catalogs/itemCatalog'
import { BUILDING_TYPES } from '../../catalogs/buildingCatalog'
import { getShopLevel } from '../../rules/shopRules'
import { getEquipmentLoadout, getEquipmentInventory, getEquipment, getEffectiveAttributesForPlayer } from '../../rules/playerDerivedRules'
import { getInnerSkill, getPlayerTotalInsightCost } from '../../rules/skillRules'
import { getMartialHallSkills } from '../../catalogs/martialHallSkillCatalog'

// ─── 保命條件 ──────────────────────────────────────

export function isHealthCritical(player: PlayerState): boolean {
  return player.health <= player.maxHealth * 0.3
}

export function isHealthLow(player: PlayerState): boolean {
  return player.health <= player.maxHealth * 0.6
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

/** 玩家目前「相鄰或同格」的存活據點（回血/蓋醫院用）。 */
export function findAdjacentBase(state: GameState, player: PlayerState) {
  return state.bases.find((b) => b.active !== false && b.health > 0 && isSameOrAdjacent(player.position, b.position)) ?? null
}

/** 血量或內力未滿 → 需要在據點醫療。 */
export function needsBaseHeal(player: PlayerState): boolean {
  return player.health < player.maxHealth || player.innerPower < player.maxInnerPower
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

/** 可見怪物/巢穴中，曼哈頓距離最近、且非相鄰（相鄰格已由攻擊段落處理）者。 */
export function findNearestHostile(state: GameState, player: PlayerState): HostileActor | null {
  const visible = getVisibleCreatures(state, player.id)
  let nearest: HostileActor | null = null
  let bestDist = Infinity
  for (const a of visible) {
    const pos = a.sourceType === 'creature' ? a.creature.position : a.nest.position
    const d = manhattan(player.position, pos)
    if (d <= 1) continue
    if (d < bestDist) {
      bestDist = d
      nearest = a
    }
  }
  return nearest
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

// ─── 裝備條件 ──────────────────────────────────────

/** 尚有空格子的可裝備部位：武器→防具→配件依序，回傳第一個符合（該部位有、耐久>0）的 instance。 */
export function findEquipCandidate(player: PlayerState): { instanceId: string } | null {
  const loadout = getEquipmentLoadout(player)
  const inventory = getEquipmentInventory(player)
  const slots = [
    { slot: 'weapon', key: 'weaponInstanceId' },
    { slot: 'armor', key: 'armorInstanceId' },
    { slot: 'accessory', key: 'accessoryInstanceId' },
  ]
  for (const { slot, key } of slots) {
    if ((loadout as Record<string, string | null>)[key]) continue
    const candidate = inventory.find((entry) => {
      const def = getEquipment(entry.equipmentId)
      return !!def && def.slot === slot && entry.durability > 0
    })
    if (candidate) return { instanceId: candidate.instanceId }
  }
  return null
}

/** 傷害比目前裝備內功更高的已學會內功（且悟性足夠）。 */
export function findBetterInnerSkill(player: PlayerState): { skillId: string; damage: number; currentDamage: number } | null {
  const attrs = getEffectiveAttributesForPlayer(player)
  const currentDamage = getInnerSkill(player.innerSkillId).calculateDamage(attrs)
  let best: { skillId: string; damage: number } | null = null
  for (const skillId of player.innerSkillIds) {
    if (skillId === player.innerSkillId) continue
    const skill = getInnerSkill(skillId)
    if (attrs.insight < skill.insightRequirement) continue
    const damage = skill.calculateDamage(attrs)
    if (damage > currentDamage && (!best || damage > best.damage)) {
      best = { skillId, damage }
    }
  }
  return best ? { skillId: best.skillId, damage: best.damage, currentDamage } : null
}

/** 玩家可見據點中，武館可教授、且尚未學會、剩餘悟性足夠的外功。 */
export function findLearnableExternalSkill(state: GameState, player: PlayerState): { skillId: string; baseId: string } | null {
  const base = getVisibleOwnedBase(state, player.id)
  if (!base) return null
  const hall = base.buildings.find((b) => b.type.startsWith('martial-hall'))
  if (!hall) return null
  const skills = getMartialHallSkills(base.martialSchoolId)
  const attrs = getEffectiveAttributesForPlayer(player)
  const usedCapacity = getPlayerTotalInsightCost(player)
  for (const skill of skills.external) {
    if (player.externalSkillIds.includes(skill.id)) continue
    if (usedCapacity + skill.insightCost > attrs.insight) continue
    return { skillId: skill.id, baseId: base.id }
  }
  return null
}

// ─── 屬性分配條件 ──────────────────────────────────

// 依「根骨、身法、臂力、內息、悟性」的機率權重分配（前面的優先）。
const ATTRIBUTE_ALLOCATION_WEIGHTS: Array<{ attribute: UpgradeableAttribute; weight: number }> = [
  { attribute: 'constitution', weight: 0.3 },
  { attribute: 'agility', weight: 0.25 },
  { attribute: 'armStrength', weight: 0.2 },
  { attribute: 'innerEnergy', weight: 0.15 },
  { attribute: 'insight', weight: 0.1 },
]

/** 有可分配屬性點時，依權重隨機回傳要分配的屬性；無點數回傳 null。 */
export function pickAttributeToAllocate(player: PlayerState): UpgradeableAttribute | null {
  const points = player.availableAttributePoints ?? 0
  if (points <= 0) return null
  let roll = Math.random()
  for (const { attribute, weight } of ATTRIBUTE_ALLOCATION_WEIGHTS) {
    if (roll < weight) return attribute
    roll -= weight
  }
  return ATTRIBUTE_ALLOCATION_WEIGHTS[ATTRIBUTE_ALLOCATION_WEIGHTS.length - 1].attribute
}

// ─── 任務／商店條件 ──────────────────────────────────

/** 應執行任務：據點旁且有告示牌，且（任務未執行 或 金錢 < 50）。 */
export function shouldRunMission(adjacentBase: BaseState, player: PlayerState): boolean {
  if (!adjacentBase.buildings.some((b) => b.type === BUILDING_TYPES.BOARD)) return false
  return !adjacentBase.discovered || (player.money ?? 0) < 50
}

/** 身上擁有的回血道具數量（inventory 中 effect === 'health' 的總數）。 */
export function countHealingItems(player: PlayerState): number {
  return (player.inventory ?? []).reduce((sum, entry) => {
    const item = itemCatalog.find((i) => i.id === entry.itemId)
    return item && item.effect === 'health' ? sum + entry.quantity : sum
  }, 0)
}

/** 道具商店存在時，回傳最便宜且可負擔（商店等級、金錢、當回合未用過）的回血道具。 */
export function findBuyableHealItem(adjacentBase: BaseState, player: PlayerState) {
  if (!adjacentBase.buildings.some((b) => b.type === BUILDING_TYPES.ITEM_SHOP)) return null
  const shopLevel = getShopLevel(adjacentBase, 'item-shop')
  const usedEffects = new Set(player.itemEffectsUsedThisTurn ?? [])
  const best = itemCatalog
    .filter((i) => (
      i.effect === 'health'
      && i.buyPrice > 0
      && i.requiredShopLevel <= shopLevel
      && !usedEffects.has(i.effect)
      && i.buyPrice <= (player.money ?? 0)
    ))
    .sort((a, b) => a.buyPrice - b.buyPrice)[0]
  return best ? { itemId: best.id, price: best.buyPrice } : null
}

// ─── 距離工具 ──────────────────────────────────────

export function manhattan(a: Position, b: Position): number {
  return Math.abs(a.row - b.row) + Math.abs(a.column - b.column)
}
