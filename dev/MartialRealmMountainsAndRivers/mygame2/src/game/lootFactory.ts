import { itemCatalog } from './catalogs/itemCatalog'
import { equipmentCatalog, type EquipmentDefinition } from './catalogs/equipmentCatalog'
import { allExternalSkillCatalog, allInnerSkillCatalog } from './catalogs/martialHallSkillCatalog'
import { jianghuExternalSkills } from './catalogs/jianghuExternalSkillCatalog'
import {
  type LearnedSkillResult,
  type LootDefinition,
  type LootResult,
  type PlayerState,
  itemPointLootCatalog,
  lootCatalog,
} from './types'
import { createEquipmentInstance, getEquipment, getEquipmentInventory } from './rules/playerDerivedRules'
import { addInventoryItem } from './actions/shopActions'
import { terrainItemPointLootCatalog } from './catalogs/terrainLootCatalog'
import type { TerrainType } from './types'

function createFallbackItem(): LootResult {
  const item = itemCatalog[0]
  return { kind: 'item', itemId: item.id, itemName: item.name, itemIcon: item.icon }
}

function createEquipmentLoot(player: PlayerState, equipmentId: string, fallback: EquipmentDefinition): LootResult {
  const equipment = getEquipment(equipmentId) ?? fallback
  // 使用全域唯一 ID，避免模組層計數器在重新載入/熱更新後重置，
  // 導致新獲取的裝備與既有裝備共用相同 instanceId（無法正確裝備）。
  const instance = createEquipmentInstance(
    equipment.id,
    `equipment-${player.id}-${crypto.randomUUID()}`,
  )
  return instance ? { kind: 'equipment', instance, equipment } : createFallbackItem()
}

/** 依階級決定掉落權重：階級越高越稀有。 */
export function getTierWeight(tier: number): number {
  // 階級 1 權重 20，階級 2 權重 10，階級 3 權重 5，階級 4 權重 3，階級 5 權重 1
  return Math.max(1, Math.round(20 / Math.pow(2, tier - 1)))
}

const innerSkillById = new Map(allInnerSkillCatalog.map((skill) => [skill.id, skill] as const))
const externalSkillById = new Map(allExternalSkillCatalog.map((skill) => [skill.id, skill] as const))
const itemById = new Map(itemCatalog.map((item) => [item.id, item] as const))

/** 道具點掉落混合比例：20% 通用物資、80% 當地特產。 */
export const ITEM_POINT_GENERIC_LOOT_RATE = 0.2
export const ITEM_POINT_TERRAIN_LOOT_RATE = 0.8

type ItemPointLootDefinition = Extract<LootDefinition, { kind: 'item' | 'equipment' }>

function toSkillLoot(
  skills: ReadonlyArray<{ id: string; requiredHallLevel?: number; lootExcluded?: boolean }>,
  skillType: 'inner' | 'external',
  learnedIds: ReadonlySet<string>,
  level: number,
): LootDefinition[] {
  return skills
    .filter((skill) => !learnedIds.has(skill.id) && !skill.lootExcluded && (skill.requiredHallLevel ?? 1) <= level)
    .map((skill) => ({ kind: 'skill' as const, skillId: skill.id, skillType, weight: getTierWeight(skill.requiredHallLevel ?? 1) }))
}

export function createLootForPlayer(player: PlayerState, creatureLevel = 1): LootResult | undefined {
  const level = Math.max(1, creatureLevel)

  // 道具：以 requiredShopLevel 作為階級，只取貨階級 ≤ 怪物等級的道具。
  const itemLoot: LootDefinition[] = itemCatalog
    .filter((item) => (item.requiredShopLevel ?? 1) <= level)
    .map((item) => ({
      kind: 'item' as const,
      itemId: item.id,
      weight: getTierWeight(item.requiredShopLevel ?? 1),
    }))

  // 功法：以 requiredHallLevel 作為階級，只掉落階級 ≤ 怪物等級且尚未學會的功法。
  const skillLoot: LootDefinition[] = [
    ...toSkillLoot(allInnerSkillCatalog, 'inner', new Set(player.innerSkillIds), level),
    ...toSkillLoot(allExternalSkillCatalog, 'external', new Set(player.externalSkillIds), level),
  ]

  // 裝備：從所有非門派專屬裝備中依階級抽取，只掉落階級 ≤ 怪物等級的裝備。
  const equipmentLoot: LootDefinition[] = equipmentCatalog
    .filter((equipment) => !equipment.schoolId && equipment.requiredShopLevel <= level)
    .map((equipment) => ({ kind: 'equipment' as const, equipmentId: equipment.id, weight: getTierWeight(equipment.requiredShopLevel) }))

  const availableLoot = [...lootCatalog, ...itemLoot, ...skillLoot, ...equipmentLoot]
  const totalWeight = availableLoot.reduce((total, loot) => total + loot.weight, 0)
  if (totalWeight <= 0) return undefined

  let roll = Math.random() * totalWeight
  const loot = availableLoot.find((candidate) => {
    roll -= candidate.weight
    return roll < 0
  }) ?? availableLoot[0]

  if (!loot) return undefined

  if (loot.kind === 'item') {
    const item = itemById.get(loot.itemId)
    return item ? { kind: 'item', itemId: item.id, itemName: item.name, itemIcon: item.icon } : undefined
  }

  if (loot.kind === 'equipment') {
    const equipment = getEquipment(loot.equipmentId)
    return equipment ? createEquipmentLoot(player, equipment.id, equipment) : undefined
  }

  if (loot.kind === 'skill') {
    const skill = loot.skillType === 'inner'
      ? innerSkillById.get(loot.skillId)
      : externalSkillById.get(loot.skillId)
    return skill ? { kind: 'skill', skill, skillType: loot.skillType } : undefined
  }

  return undefined
}

export function createItemPointLootForPlayer(player: PlayerState, terrain?: TerrainType): LootResult {
  const isItemPointLoot = (loot: LootDefinition): loot is ItemPointLootDefinition => loot.kind !== 'skill'
  const terrainLootIds = new Set(
    Object.values(terrainItemPointLootCatalog).flat().filter(isItemPointLoot).map((loot) => loot.kind === 'item' ? `item:${loot.itemId}` : `equipment:${loot.equipmentId}`),
  )
  const genericLoot = itemPointLootCatalog.filter((loot): loot is ItemPointLootDefinition => {
    if (!isItemPointLoot(loot)) return false
    return !terrainLootIds.has(loot.kind === 'item' ? `item:${loot.itemId}` : `equipment:${loot.equipmentId}`)
  })
  const terrainLoot = (terrainItemPointLootCatalog[terrain ?? 'plain'] ?? []).filter(isItemPointLoot)
  const availableLoot: ItemPointLootDefinition[] = terrainLoot.length > 0
    ? [
      ...genericLoot.map((loot) => ({ ...loot, weight: loot.weight * ITEM_POINT_GENERIC_LOOT_RATE })),
      ...terrainLoot.map((loot) => ({ ...loot, weight: loot.weight * ITEM_POINT_TERRAIN_LOOT_RATE })),
    ]
    : genericLoot
  const totalWeight = availableLoot.reduce((total, loot) => total + loot.weight, 0)
  let roll = Math.random() * totalWeight
  const loot = availableLoot.find((candidate) => {
    roll -= candidate.weight
    return roll < 0
  }) ?? availableLoot[0]

  if (!loot || loot.kind === 'item') {
    const item = itemById.get(loot?.kind === 'item' ? loot.itemId : 'heal-wound-medicine') ?? itemCatalog[0]
    return { kind: 'item', itemId: item.id, itemName: item.name, itemIcon: item.icon }
  }
  if (!loot || loot.kind !== 'equipment') return createFallbackItem()
  return createEquipmentLoot(player, loot.equipmentId, equipmentCatalog.find((equipment) => !equipment.schoolId) ?? equipmentCatalog[0])
}

export function addLootToPlayer(player: PlayerState, loot: LootResult): PlayerState {
  if (loot.kind === 'item') return { ...player, inventory: addInventoryItem(player.inventory, loot.itemId) }
  if (loot.kind === 'equipment') return { ...player, equipmentInventory: [...getEquipmentInventory(player), loot.instance] }
  return loot.skillType === 'inner'
    ? { ...player, innerSkillIds: [...player.innerSkillIds, loot.skill.id] }
    : { ...player, externalSkillIds: [...player.externalSkillIds, loot.skill.id] }
}

/**
 * 依指定的 lootId 建立 LootResult（供自訂掉落物使用）。
 * lootId 可能是道具 id、裝備 id、內功 id 或外功 id。
 * 找不到時回傳 undefined。
 */
export function createLootFromId(player: PlayerState, lootId: string): LootResult | undefined {
  const item = itemById.get(lootId)
  if (item) return { kind: 'item', itemId: item.id, itemName: item.name, itemIcon: item.icon }
  const equipment = getEquipment(lootId)
  if (equipment) return createEquipmentLoot(player, equipment.id, equipment)
  const inner = innerSkillById.get(lootId)
  if (inner) return { kind: 'skill', skill: inner, skillType: 'inner' }
  const external = externalSkillById.get(lootId)
  if (external) return { kind: 'skill', skill: external, skillType: 'external' }
  return undefined
}

/**
 * 巢穴被摧毀時，向玩家傳授一個尚未學會的江湖外功功法。
 *
 * 高階功法架構已於江湖功法的開發中完成（`jianghuExternalSkills`），
 * 因此巢穴傳授功法直接取自該目錄；若玩家已學會全部江湖功法則回傳 undefined。
 */
export function getLearnableSkill(player: PlayerState): LearnedSkillResult | undefined {
  const learned = new Set(player.externalSkillIds)
  const unlearned = jianghuExternalSkills.filter((skill) => !learned.has(skill.id))
  const picked = unlearned[Math.floor(Math.random() * unlearned.length)]
  return picked ? { type: 'external', skill: picked } : undefined
}
