import { buffCatalog, type BuffDefinition } from '../catalogs/buffCatalog'
import { equipmentCatalog, type EquipmentDefinition } from '../catalogs/equipmentCatalog'
import { allInnerSkillCatalog } from '../catalogs/martialHallSkillCatalog'
import { allExternalSkillCatalog } from '../catalogs/martialHallSkillCatalog'
import { getFunctionalSkillBuffOverrides } from './functionalSkillScaling'
import { elementHomeTurfBuffs } from '../catalogs/martialSchoolCatalog'
import type {
  ActionOutcome,
  EquipmentInstance,
  EquipmentLoadout,
  PlayerAttributes,
  PlayerState,
  CreatureState,
  TerrainType,
  BuffInstance,
  UpgradeableAttribute,
} from '../types'
import { terrainStaminaCost, type GameState } from '../types'
import { restoreAfterAttributeChange } from '../characterFactory'
import { getSchoolElement } from '../catalogs/skillProgressionCatalog'
import {
  getResourceLimit,
  type ResourceLimit,
  type ResourceLimitModifiers,
} from './playerStatsRules'
/** 以 ID 快取目錄查詢，避免重複線性掃描；目錄在模組載入時固定。 */
const buffById = new Map(buffCatalog.map((buff) => [buff.id, buff] as const))
const equipmentById = new Map(equipmentCatalog.map((equipment) => [equipment.id, equipment] as const))

export function getEquipment(equipmentId: string): EquipmentDefinition | undefined {
  return equipmentById.get(equipmentId)
}

export function getEquipmentLoadout(player: PlayerState): EquipmentLoadout {
  return player.equipmentLoadout ?? {
    weaponInstanceId: null,
    armorInstanceId: null,
    accessoryInstanceId: null,
  }
}

export function getEquipmentInventory(player: PlayerState): EquipmentInstance[] {
  return player.equipmentInventory ?? []
}

export function getEquipmentInstance(player: PlayerState, instanceId: string | null): EquipmentInstance | undefined {
  return instanceId
    ? getEquipmentInventory(player).find((instance) => instance.instanceId === instanceId)
    : undefined
}

export function createEquipmentInstance(equipmentId: string, instanceId: string): EquipmentInstance | undefined {
  const definition = getEquipment(equipmentId)
  if (!definition) return undefined

  return {
    instanceId,
    equipmentId,
    durability: definition.maxDurability,
    maxDurability: definition.maxDurability,
  }
}

export function getBuff(buffId: string): BuffDefinition | undefined {
  return buffById.get(buffId)
}

function getEffectiveBuffDefinition(instance: BuffInstance): BuffDefinition | undefined {
  const definition = getBuff(instance.definitionId)
  if (!definition) return undefined
  const overrides: Partial<BuffDefinition> = {}
  for (const key of [
    'attributeMultiplier', 'maxHealthDamagePercent', 'criticalRateMultiplier', 'criticalRateBonus', 'terrainCostOverride', 'reflectionPercent',
    'lifestealPercent', 'innerPowerLeechPercent', 'damageReductionPercent', 'healthRegenPercent',
    'innerPowerHealthRegenPercent', 'innerPowerRegenPercent', 'damageDealtPercent', 'externalSkillDamagePercent', 'evasionRateBonus',
    'staminaToInnerPowerRatio', 'externalSkillInnerCostReduction', 'insightTrueDamageMultiplier',
    'visionRadiusBonus', 'maxStaminaBonus', 'maxHealthMultiplier', 'maxStaminaMultiplier', 'maxInnerPowerMultiplier', 'gatherStaminaCostReduction', 'gatherDoubleYieldChance',
    'buildingMaterialCostReduction', 'buildingReputationBonus', 'shopBuyPriceDiscount',
    'shopSellPriceBonus', 'questRewardBonus', 'skillExpGainPercent', 'confused', 'damageTakenFromAlliesBonus', 'basicAttackStaminaCostReduction', 'conditional',
  ] as const) {
    const value = instance[key]
    if (value !== undefined) overrides[key] = value as never
  }
  return { ...definition, ...overrides }
}

/** 取得玩家目前生效 Buff 的定義（過濾掉不存在或已過期的 Buff）。 */
export function getActiveBuffDefinitions(player: PlayerState): BuffDefinition[] {
  return getActiveBuffsForPlayer(player)
    .map(getEffectiveBuffDefinition)
    .filter((definition): definition is BuffDefinition => Boolean(definition))
}

export function getActiveBuffsForPlayer(player: PlayerState): BuffInstance[] {
  const explicitBuffs = (player.buffs ?? []).filter((buff) => {
    const definition = getBuff(buff.definitionId)
    return Boolean(definition) && (buff.remainingRounds === null || buff.remainingRounds > 0)
  })
  return [
    ...explicitBuffs,
    ...(getInnerSkillBuffs(player) ?? []),
    ...getEquippedExternalSkillBuffs(player),
  ]
}

/** 將已裝備的靈氣型外功轉成常駐 Buff；強化型外功（主動施放）刻意排除。 */
function getEquippedExternalSkillBuffs(player: PlayerState): BuffInstance[] {
  return player.equippedExternalSkillIds.flatMap((skillId) => {
    const skill = allExternalSkillCatalog.find((candidate) => candidate.id === skillId)
    if (!skill || skill.category !== 'aura' || !skill.passiveBuffIds?.length) return []
    const level = Math.max(1, Math.floor(player.skillProgression?.[skillId]?.level ?? 1))
    return skill.passiveBuffIds.map((definitionId) => {
      const definition = getBuff(definitionId)
      const overrides = definition && skill.functionalEffect
        ? getFunctionalSkillBuffOverrides(skill.functionalEffect, level, definition)
        : {}
      return {
        id: `external-skill:${skillId}:${definitionId}`,
        definitionId,
        sourceId: skillId,
        remainingRounds: null,
        ...overrides,
      }
    })
  })
}

/** 取得怪物目前正在變的 Buff；主場 Buff 依「五行屬性」推導，僅依當前站立地形動態注入，不寫入 state。 */
export function getActiveBuffsForCreature(creature: CreatureState, terrain?: TerrainType): BuffInstance[] {
  const homeTurf = terrain ? elementHomeTurfBuffs[getSchoolElement(creature.schoolId)] : undefined
  const homeTurfBuff = homeTurf && homeTurf.terrain === terrain
    ? [{ id: `home-turf:${creature.id}:${homeTurf.definitionId}`, definitionId: homeTurf.definitionId, sourceId: 'terrain', remainingRounds: null }]
    : []
  return [...getActiveBuffsForPlayer(creature), ...homeTurfBuff]
}

export function getActiveBuffDefinitionsForCreature(creature: CreatureState, terrain?: TerrainType): BuffDefinition[] {
  return getActiveBuffsForCreature(creature, terrain)
    .map(getEffectiveBuffDefinition)
    .filter((definition): definition is BuffDefinition => Boolean(definition))
}

function getInnerSkillBuffs(player: PlayerState): BuffInstance[] | undefined {
  // 用完整內功目錄查找（含官方角色專屬內功等），基礎 innerSkillCatalog 不含它們，
  // 會導致專屬內功的常駐 Buff（如山河歸藏的悟性加成）不生效。
  const innerSkill = allInnerSkillCatalog.find((skill) => skill.id === player.innerSkillId)

  return innerSkill?.buffIds?.map((definitionId) => ({
    id: `inner-skill:${player.innerSkillId}:${definitionId}`,
    definitionId,
    sourceId: player.innerSkillId,
    remainingRounds: null,
  }))
}

export function getPlayerLoadoutInstances(player: PlayerState): EquipmentInstance[] {
  const loadout = getEquipmentLoadout(player)
  const instanceIds = [loadout.weaponInstanceId, loadout.armorInstanceId, loadout.accessoryInstanceId]
  return instanceIds
    .map((instanceId) => getEquipmentInstance(player, instanceId))
    .filter((instance): instance is EquipmentInstance => Boolean(instance))
}

export function getEffectiveAttributes(
  baseAttributes: PlayerAttributes,
  loadout: EquipmentLoadout,
  equipmentInstances: EquipmentInstance[] = [],
): PlayerAttributes {
  const result = { ...baseAttributes }
  const equipmentInstanceIds = [
    loadout.weaponInstanceId,
    loadout.armorInstanceId,
    loadout.accessoryInstanceId,
  ]

  for (const instanceId of equipmentInstanceIds) {
    const instance = instanceId
      ? equipmentInstances.find((candidate) => candidate.instanceId === instanceId)
      : undefined
    const equipment = instance && instance.durability > 0
      ? getEquipment(instance.equipmentId)
      : undefined
    if (!equipment) continue

    for (const attribute of Object.keys(result) as Array<keyof PlayerAttributes>) {
      result[attribute] += equipment.modifiers[attribute] ?? 0
    }
  }

  for (const attribute of Object.keys(result) as Array<keyof PlayerAttributes>) {
    result[attribute] = Math.max(1, Math.floor(result[attribute]))
  }

  return result
}

function getEffectiveAttributesWithDefinitions(player: PlayerState, activeDefinitions: BuffDefinition[]): PlayerAttributes {
  const baseAttributes = player.baseAttributes ?? player.attributes
  const result = { ...baseAttributes }
  const loadout = getPlayerLoadoutInstances(player)

  for (const instance of loadout) {
    if (instance.durability <= 0) continue
    const equipment = getEquipment(instance.equipmentId)
    if (!equipment) continue

    for (const attribute of Object.keys(result) as Array<keyof PlayerAttributes>) {
      result[attribute] += equipment.modifiers[attribute] ?? 0
    }
  }

  for (const definition of activeDefinitions) {
    if (!definition.attributeModifiers) continue
    for (const attribute of Object.keys(result) as Array<keyof PlayerAttributes>) {
      result[attribute] += definition.attributeModifiers[attribute] ?? 0
    }
  }

  for (const definition of activeDefinitions) {
    const multiplier = definition.attributeMultiplier
    if (multiplier === undefined) continue
    for (const attribute of Object.keys(result) as Array<keyof PlayerAttributes>) result[attribute] *= multiplier
  }

  // 類別 4：條件型 — 依血量區間即時判定，與 attributeMultiplier 疊乘
  const healthRatio = player.maxHealth > 0 ? player.health / player.maxHealth : 1
  for (const definition of activeDefinitions) {
    const conditional = definition.conditional
    if (!conditional) continue
    const met = conditional.when === 'health-below'
      ? healthRatio < conditional.threshold
      : healthRatio > conditional.threshold
    if (!met) continue
    for (const attribute of Object.keys(result) as Array<keyof PlayerAttributes>) {
      result[attribute] *= conditional.multiplier
    }
  }

  for (const attribute of Object.keys(result) as Array<keyof PlayerAttributes>) {
    result[attribute] = Math.max(1, Math.floor(result[attribute]))
  }

  return result
}

export function getEffectiveAttributesForPlayer(player: PlayerState): PlayerAttributes {
  return getEffectiveAttributesWithDefinitions(player, getActiveBuffDefinitions(player))
}

/** 取得包含當前地形主場 Buff 的怪物有效五維。 */
export function getEffectiveAttributesForCreature(creature: CreatureState, terrain?: TerrainType): PlayerAttributes {
  return getEffectiveAttributesWithDefinitions(creature, getActiveBuffDefinitionsForCreature(creature, terrain))
}

/** 玩家是否可進入此地形：牆壁原本不可通行，但破壁功（terrainCostOverrides.wall）可使其可通行。 */
export function canTraverseTerrain(terrain: TerrainType, player: PlayerState): boolean {
  if (terrain !== 'wall' || Number.isFinite(terrainStaminaCost[terrain])) return true
  return getActiveBuffDefinitions(player).some((definition) => definition.terrainCostOverrides?.wall !== undefined)
}

export function getTerrainStaminaCost(terrain: TerrainType, player?: PlayerState): number {
  const baseCost = terrainStaminaCost[terrain]
  const activeDefinitions = player ? getActiveBuffDefinitions(player) : []

  // 逐地形覆寫優先：破壁功可將 wall 由 ∞ 降為 1，也覆寫其他地形。
  if (player) {
    const override = activeDefinitions.reduce<number | undefined>((found, definition) => {
      const value = definition.terrainCostOverrides?.[terrain]
      return value !== undefined ? value : found
    }, undefined)
    if (override !== undefined) return Math.max(0, override)
  }

  if (!Number.isFinite(baseCost)) return baseCost
  if (activeDefinitions.some((definition) => definition.id === 'swift-wind-movement')) return 2

  const multiplier = player
    ? activeDefinitions.reduce((total, definition) => {
      return total * (definition.terrainStaminaCostMultipliers?.[terrain] ?? 1)
    }, 1)
    : 1

  return Math.max(0, baseCost * multiplier)
}

/** 取得怪物移動消耗，包含當前位置生效的主場 Buff。 */
export function getCreatureTerrainStaminaCost(creature: CreatureState, terrain: TerrainType): number {
  const baseCost = terrainStaminaCost[terrain]
  if (!Number.isFinite(baseCost)) return baseCost
  const override = getActiveBuffDefinitionsForCreature(creature, terrain).reduce<number | undefined>((found, definition) => {
    const value = definition.terrainCostOverrides?.[terrain]
    return value !== undefined ? value : found
  }, undefined)
  return Math.max(0, override ?? baseCost)
}

export function getCriticalRateForPlayer(player: PlayerState): number {
  const baseRate = getEffectiveAttributesForPlayer(player).armStrength * 2
  const definitions = getActiveBuffDefinitions(player)
  const multiplier = definitions.reduce((rate, definition) => rate * (definition.criticalRateMultiplier ?? 1), 1)
  const bonus = definitions.reduce((total, definition) => total + (definition.criticalRateBonus ?? 0), 0)
  return baseRate * multiplier + bonus
}

/** 傷害型外功的暴擊率：內息每 1 點提供 2%（與普通攻擊的臂力暴擊率共用暴擊 Buff 加成）。 */
export function getExternalSkillCritRateForPlayer(player: PlayerState): number {
  const baseRate = getEffectiveAttributesForPlayer(player).innerEnergy * 2
  const definitions = getActiveBuffDefinitions(player)
  const multiplier = definitions.reduce((rate, definition) => rate * (definition.criticalRateMultiplier ?? 1), 1)
  const bonus = definitions.reduce((total, definition) => total + (definition.criticalRateBonus ?? 0), 0)
  return baseRate * multiplier + bonus
}

/** 對指定 Buff 欄位求和（用於吸血、汲元、減傷、傷害加成等百分比欄位）。 */
function sumBuffPercent(player: PlayerState, field: keyof BuffDefinition): number {
  return getActiveBuffDefinitions(player).reduce((total, definition) => {
    const value = definition[field]
    return total + (typeof value === 'number' ? value : 0)
  }, 0)
}

/** 造成傷害時回復傷害值比例的血量（嗜血）。 */
export function getLifestealPercent(player: PlayerState): number {
  return sumBuffPercent(player, 'lifestealPercent')
}

/** 造成傷害時回復傷害值比例的內力（汲元）。 */
export function getInnerPowerLeechPercent(player: PlayerState): number {
  return sumBuffPercent(player, 'innerPowerLeechPercent')
}

/** 受到傷害時的最終傷害減免比例（鐵壁訣）。 */
export function getDamageReductionPercent(player: PlayerState): number {
  return sumBuffPercent(player, 'damageReductionPercent')
}

/** 回避率（百分比）：依有效身法決定（0~100），並加上回避率加成 Buff。 */
export function getEvasionRate(player: PlayerState): number {
  const baseRate = getEffectiveAttributesForPlayer(player).agility
  const bonus = getActiveBuffDefinitions(player).reduce(
    (total, definition) => total + (definition.evasionRateBonus ?? 0),
    0,
  )
  return Math.min(100, baseRate + bonus)
}

/** 根骨減傷率（百分比）：依有效根骨決定，每個根骨提供 2% 機率使本次傷害減半。 */
export function getRootReductionRate(player: PlayerState): number {
  return Math.min(100, getEffectiveAttributesForPlayer(player).constitution * 2)
}

/** 普通攻擊造成的最終傷害加成比例（破軍訣）。 */
export function getDamageDealtPercent(player: PlayerState): number {
  return sumBuffPercent(player, 'damageDealtPercent')
}

/** 怪物普通攻擊傷害加成，包含當前地形生效的主場 Buff。 */
export function getCreatureDamageDealtPercent(creature: CreatureState, terrain?: TerrainType): number {
  return getActiveBuffDefinitionsForCreature(creature, terrain).reduce(
    (total, definition) => total + (definition.damageDealtPercent ?? 0),
    0,
  )
}

/** 怪物主場減傷比例，僅計入當前地形有效的 Buff。 */
export function getCreatureDamageReductionPercent(creature: CreatureState, terrain?: TerrainType): number {
  return getActiveBuffDefinitionsForCreature(creature, terrain).reduce(
    (total, definition) => total + (definition.damageReductionPercent ?? 0),
    0,
  )
}

/** 外功造成的最終傷害加成比例（罡氣訣）。 */
export function getExternalSkillDamagePercent(player: PlayerState): number {
  return sumBuffPercent(player, 'externalSkillDamagePercent')
}

/** 功法經驗獲得加成比例（迴氣悟道等；乘以所得經驗）。 */
export function getPlayerSkillExpGainPercent(player: PlayerState): number {
  return sumBuffPercent(player, 'skillExpGainPercent')
}

/** 所有外功內力消耗減免值（四兩千斤等）。 */
export function getExternalSkillInnerCostReduction(player: PlayerState): number {
  return sumBuffPercent(player, 'externalSkillInnerCostReduction')
}

/** 商店買入價格折扣比例（商道通鑑；0.15 代表 -15%）。 */
export function getShopBuyPriceDiscount(player: PlayerState): number {
  return sumBuffPercent(player, 'shopBuyPriceDiscount')
}

/** 商店賣出價格加成比例（商道通鑑；0.15 代表 +15%）。 */
export function getShopSellPriceBonus(player: PlayerState): number {
  return sumBuffPercent(player, 'shopSellPriceBonus')
}

/** 最大體力加成（神行八卦步）。 */
export function getMaxStaminaBonus(player: PlayerState): number {
  return sumBuffPercent(player, 'maxStaminaBonus')
}

/**
 * 依玩家狀態計算某資源上限（統一入口；含 buff 的 multiplier / fixed bonus）。
 *
 * - base 使用 `getEffectiveAttributesForPlayer` 的有效五維（已含 attributeMultiplier 等）。
 * - multiplier 疊乘所有生效 buff 的 max{Health,Stamina,InnerPower}Multiplier 欄位
 *   （resource-limit 天賦以此表達，如 qi-master 內力 ×1.1）；可再疊加傳入的 talentMods。
 * - stamina 的 fixed bonus 彙整所有生效 buff 的 maxStaminaBonus 欄位。
 */
export function getPlayerResourceLimit(
  player: PlayerState,
  resource: ResourceLimit,
  modifiers?: ResourceLimitModifiers,
): number {
  const effective = getEffectiveAttributesForPlayer(player)
  const definitions = getActiveBuffDefinitions(player)
  const multiplierField =
    resource === 'health'
      ? 'maxHealthMultiplier'
      : resource === 'stamina'
        ? 'maxStaminaMultiplier'
        : 'maxInnerPowerMultiplier'
  const buffMultiplier = definitions.reduce((product, definition) => product * (definition[multiplierField] ?? 1), 1)
  const multi = (modifiers?.multiplier?.[resource] ?? 1) * buffMultiplier
  return getResourceLimit(effective, resource, {
    multiplier: { [resource]: multi },
    bonus: {
      ...(resource === 'stamina' ? { stamina: getMaxStaminaBonus(player) } : {}),
      ...modifiers?.bonus,
    },
  })
}

/** 建築材料消耗減免比例（天工開物；0.25 代表 -25%）。 */
export function getBuildingMaterialCostReduction(player: PlayerState): number {
  return sumBuffPercent(player, 'buildingMaterialCostReduction')
}

/** 建築獲得的聲望加成比例（天工開物）。 */
export function getBuildingReputationBonus(player: PlayerState): number {
  return sumBuffPercent(player, 'buildingReputationBonus')
}

/** 採集體力消耗減免值（靈植百草鑑）。 */
export function getGatherStaminaCostReduction(player: PlayerState): number {
  return sumBuffPercent(player, 'gatherStaminaCostReduction')
}

/** 採集雙倍產出機率（靈植百草鑑；0.5 代表 50%）。 */
export function getGatherDoubleYieldChance(player: PlayerState): number {
  return sumBuffPercent(player, 'gatherDoubleYieldChance')
}

/** 回合結束時剩餘體力轉化內力的比例（太虛引氣；1 體力 → N 內力）。 */
export function getStaminaToInnerPowerRatio(player: PlayerState): number {
  return sumBuffPercent(player, 'staminaToInnerPowerRatio')
}

/**
 * 分配屬性點數的純領域函數。
 * 玩家有可分配點數時，將指定屬性 +1 並扣除 1 點。
 */
export function allocateAttributePointAction(
  state: GameState,
  playerId: string,
  attribute: UpgradeableAttribute,
): { state: GameState; result: ActionOutcome } {
  const player = state.players.find((candidate) => candidate.id === playerId)
  const points = player?.availableAttributePoints ?? 0
  if (!player || points <= 0) {
    return { state, result: { ok: false, reason: '無可分配屬性點數。' } }
  }

  const baseAttributes = player.baseAttributes ?? player.attributes
  const nextAttributes = { ...baseAttributes, [attribute]: Math.max(1, baseAttributes[attribute] + 1) }

  return {
    state: {
      ...state,
      players: state.players.map((candidate) => candidate.id === playerId
        ? restoreAfterAttributeChange({
          ...candidate,
          baseAttributes: nextAttributes,
          availableAttributePoints: points - 1,
        }, getEffectiveAttributesForPlayer({ ...candidate, baseAttributes: nextAttributes }))
        : candidate),
    },
    result: { ok: true },
  }
}
