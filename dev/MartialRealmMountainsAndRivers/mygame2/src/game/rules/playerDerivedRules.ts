import { buffCatalog, type BuffDefinition } from '../catalogs/buffCatalog'
import { BuffEffectsKeys } from '../core/buffEffects'
import { equipmentCatalog, type EquipmentDefinition } from '../catalogs/equipmentCatalog'
import { allInnerSkillCatalog } from '../catalogs/martialHallSkillCatalog'
import { allExternalSkillCatalog } from '../catalogs/martialHallSkillCatalog'
import { getAuraSkillLevelOverrides, getFunctionalSkillBuffOverrides } from './functionalSkillScaling'
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
const externalSkillById = new Map(allExternalSkillCatalog.map((skill) => [skill.id, skill] as const))
const innerSkillById = new Map(allInnerSkillCatalog.map((skill) => [skill.id, skill] as const))

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

/**
 * 有效 Buff 定義快取：player 為 immutable（每次變更換新物件），
 * 故以 WeakMap 依物件身分快取，避免熱路徑（BFS 每格）重複計算。
 */
const activeBuffDefinitionsCache = new WeakMap<PlayerState, BuffDefinition[]>()

function getEffectiveBuffDefinition(instance: BuffInstance): BuffDefinition | undefined {
  const definition = getBuff(instance.definitionId)
  if (!definition) return undefined
  const overrides: Partial<BuffDefinition> = {}
  // 型別驅動：以 BuffEffects 的效果欄位鍵為準，取代手工白名單，
  // 新增效果欄位時自動納入覆寫，不會漏列。
  for (const key of BuffEffectsKeys) {
    const value = instance[key]
    if (value !== undefined) overrides[key] = value as never
  }
  const effective = { ...definition, ...overrides }
  // 有等級縮放覆寫時，動態更新描述以反映縮放後數值（功法升級後 UI 同步顯示）。
  if (Object.keys(overrides).length > 0) {
    const scaledDescription = buildScaledBuffDescription(effective)
    if (scaledDescription) effective.description = scaledDescription
  }
  return effective
}

/**
 * 依縮放後的有效數值動態生成 Buff 描述。
 * 僅處理會隨功法等級縮放的靈氣 Buff；其餘回傳 undefined（維持原始描述）。
 */
function buildScaledBuffDescription(definition: BuffDefinition): string | undefined {
  const pct = (value: number | undefined) => value === undefined ? undefined : `${Math.round(value * 100)}%`
  switch (definition.id) {
    case 'golden-body-critical-boost':
      return definition.criticalRateBonus !== undefined ? `暴擊率 +${definition.criticalRateBonus}%。` : undefined
    case 'earth-mountain-reflection':
      return definition.reflectionPercent !== undefined ? `受到傷害時反彈 ${pct(definition.reflectionPercent)} 傷害。` : undefined
    case 'bloodthirst':
      return definition.lifestealPercent !== undefined ? `造成傷害時，回復 ${pct(definition.lifestealPercent)} 傷害值的血量。` : undefined
    case 'iron-wall-art':
    case 'misty-rain-rain-curtain':
      return definition.damageReductionPercent !== undefined ? `受到傷害時，最終傷害 -${pct(definition.damageReductionPercent)}。` : undefined
    case 'qi-transformation-art':
      return definition.innerPowerHealthRegenPercent !== undefined ? `每回合回復「最大內力 ×${pct(definition.innerPowerHealthRegenPercent)}」的氣血。` : undefined
    case 'inner-power-drain':
      return definition.innerPowerLeechPercent !== undefined ? `造成傷害時，回復 ${pct(definition.innerPowerLeechPercent)} 傷害值的內力。` : undefined
    case 'break-army-art':
    case 'sharp-edge-keen-edge':
      return definition.damageDealtPercent !== undefined ? `普通攻擊造成的最終傷害 +${pct(definition.damageDealtPercent)}。` : undefined
    case 'vigor-art':
      return definition.externalSkillDamagePercent !== undefined ? `外功造成的最終傷害 +${pct(definition.externalSkillDamagePercent)}。` : undefined
    case 'spring-return-art':
      return definition.healthRegenPercent !== undefined ? `每回合回復最大血量 ${pct(definition.healthRegenPercent)} 的氣血。` : undefined
    case 'phantom-step':
    case 'ghost-shadow-shadow-veil':
      return definition.evasionRateBonus !== undefined ? `回避率 +${definition.evasionRateBonus}%。` : undefined
    case 'return-light':
      return definition.reviveHealthPercent !== undefined ? `瀕死時攔截死亡，復活至 ${pct(definition.reviveHealthPercent)} 血並清除所有 debuff（只保一次）。` : undefined
    case 'back-to-water':
      return definition.conditional ? `血量低於 ${pct(definition.conditional.threshold)} 時，五維 ×${definition.conditional.multiplier}。` : undefined
    case 'nurture-qi':
      return definition.conditional ? `血量高於 ${pct(definition.conditional.threshold)} 時，五維 ×${definition.conditional.multiplier}。` : undefined
    case 'all-in':
      return definition.conditional ? `血量低於 ${pct(definition.conditional.threshold)} 時，五維 ×${definition.conditional.multiplier}。` : undefined
    case 'ghost-shadow-lone-resolve':
      return definition.conditional ? `血量低於 ${pct(definition.conditional.threshold)} 時，五維 ×${definition.conditional.multiplier}，持續 3 回合。` : undefined
    case 'sky-eye-vision':
    case 'sharp-edge-sword-heart':
      return definition.visionRadiusBonus !== undefined ? `自身地圖視野半徑 +${definition.visionRadiusBonus}。` : undefined
    case 'four-ounces-thousand-pounds':
      return definition.externalSkillInnerCostReduction !== undefined ? `所有外功內力消耗 -${definition.externalSkillInnerCostReduction}（最低 1）。` : undefined
    case 'merchant-way':
      return definition.shopBuyPriceDiscount !== undefined && definition.shopSellPriceBonus !== undefined
        ? `買入價格 -${pct(definition.shopBuyPriceDiscount)}，賣出價格 +${pct(definition.shopSellPriceBonus)}。`
        : undefined
    case 'heavenly-craftsman':
      return definition.buildingMaterialCostReduction !== undefined && definition.buildingReputationBonus !== undefined
        ? `建築材料消耗 -${pct(definition.buildingMaterialCostReduction)}，建造聲望 +${pct(definition.buildingReputationBonus)}。`
        : undefined
    case 'spirit-herb-hundred-grass':
      return definition.gatherStaminaCostReduction !== undefined && definition.gatherDoubleYieldChance !== undefined
        ? `採集體力消耗 -${definition.gatherStaminaCostReduction}，採集 ${pct(definition.gatherDoubleYieldChance)} 機率雙倍產出。`
        : undefined
    case 'divine-movement-eight-trigrams':
      return definition.maxStaminaBonus !== undefined ? `最大體力 +${definition.maxStaminaBonus}。` : undefined
    case 'taixu-qi-conversion':
      return definition.staminaToInnerPowerRatio !== undefined ? `回合結束時，剩餘體力轉化為內力（1 體力 → ${definition.staminaToInnerPowerRatio} 內力）。` : undefined
    case 'void-spirit-return-qi':
      return definition.skillExpGainPercent !== undefined ? `功法經驗獲得 +${pct(definition.skillExpGainPercent)}。` : undefined
    case 'misty-rain-drizzle-nourish':
      return definition.innerPowerRegenPercent !== undefined ? `每回合回復最大內力 ${pct(definition.innerPowerRegenPercent)} 的內力。` : undefined
    case 'blazing-sun-fervor':
      return definition.attributeModifiers
        ? `臂力與根骨 +${definition.attributeModifiers.armStrength ?? 0}。`
        : undefined
    case 'blazing-sun-blazing-gaze':
      return definition.criticalRateMultiplier !== undefined ? `暴擊率 ×${definition.criticalRateMultiplier}。` : undefined
    case 'yellow-earth-rammed-earth':
      return definition.buildingMaterialCostReduction !== undefined ? `建築材料消耗 -${pct(definition.buildingMaterialCostReduction)}。` : undefined
    case 'yellow-earth-pack-march':
      return definition.maxStaminaBonus !== undefined ? `最大體力 +${definition.maxStaminaBonus}。` : undefined
    default:
      return undefined
  }
}

/** 取得玩家目前生效 Buff 的定義（過濾掉不存在或已過期的 Buff）。 */
export function getActiveBuffDefinitions(player: PlayerState): BuffDefinition[] {
  const cached = activeBuffDefinitionsCache.get(player)
  if (cached) return cached
  const definitions = getActiveBuffsForPlayer(player)
    .map(getEffectiveBuffDefinition)
    .filter((definition): definition is BuffDefinition => Boolean(definition))
  activeBuffDefinitionsCache.set(player, definitions)
  return definitions
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
    const skill = externalSkillById.get(skillId)
    if (!skill || skill.category !== 'aura' || !skill.passiveBuffIds?.length) return []
    const level = Math.max(1, Math.floor(player.skillProgression?.[skillId]?.level ?? 1))
    return skill.passiveBuffIds.map((definitionId) => {
      const definition = getBuff(definitionId)
      const overrides = definition && skill.functionalEffect
        ? getFunctionalSkillBuffOverrides(skill.functionalEffect, level, definition)
        : definition
          ? getAuraSkillLevelOverrides(skillId, level, definition)
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
  const innerSkill = innerSkillById.get(player.innerSkillId)

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
