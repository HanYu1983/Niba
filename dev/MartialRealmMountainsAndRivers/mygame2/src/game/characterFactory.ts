import {
  type PlayerAttributes,
  type PlayerState,
  type CreatureState,
  type InventoryEntry,
} from './types'
import {
  getMaxStamina,
  getMaxInnerPower,
  getMaxHealth,
} from './rules/playerStatsRules'
import {
  getEquipmentLoadout,
  getEffectiveAttributes,
  getEffectiveAttributesForPlayer,
} from './rules/playerDerivedRules'
import {
  getExperienceRequired,
  ATTRIBUTE_POINTS_PER_LEVEL,
} from './types'
import { innerSkillCatalog } from './catalogs/innerSkillCatalog'
import { externalSkillCatalog } from './catalogs/externalSkillCatalog'

/**
 * 建立玩家或 Creature 的角色狀態。
 *
 * 此函式集中處理：
 * - 裝備 loadout 套用與衍生屬性重算
 * - 衍生上限（血量、體力、內力）計算
 * - 內外功初始清單預設
 *
 * 抽離自 `gameStore.ts`，讓世界生成、debug 狀態與 Creature 工廠
 * 可在不依賴 store facade 的情況下建立角色。
 */
export function createCharacterState(
  character: Omit<PlayerState, 'health' | 'maxHealth' | 'stamina' | 'maxStamina' | 'innerPower' | 'maxInnerPower' | 'inventory' | 'innerSkillIds' | 'externalSkillIds' | 'equippedExternalSkillIds'> & {
    inventory?: InventoryEntry[]
    innerSkillIds?: string[]
    externalSkillIds?: string[]
    equippedExternalSkillIds?: string[]
    skillProgression?: PlayerState['skillProgression']
    behaviorType?: CreatureState['behaviorType']
    schoolId?: CreatureState['schoolId']
    aggroRange?: CreatureState['aggroRange']
    homePosition?: CreatureState['homePosition']
    homeNestId?: CreatureState['homeNestId']
    isBoss?: CreatureState['isBoss']
  },
): CreatureState {
  const baseAttributes = character.baseAttributes ?? character.attributes
  const equipmentInventory = character.equipmentInventory ?? []
  const equipmentLoadout = getEquipmentLoadout(character as PlayerState)
  const attributes = getEffectiveAttributes(baseAttributes, equipmentLoadout, equipmentInventory)

  const player = {
    ...character,
    baseAttributes,
    attributes,
    health: getMaxHealth(attributes),
    maxHealth: getMaxHealth(attributes),
    stamina: getMaxStamina(attributes),
    maxStamina: getMaxStamina(attributes),
    innerPower: getMaxInnerPower(attributes),
    maxInnerPower: getMaxInnerPower(attributes),
    level: character.level ?? 1,
    availableAttributePoints: character.availableAttributePoints ?? 0,
    governanceRank: character.governanceRank ?? 1,
    unlockedPolicyIds: character.unlockedPolicyIds ?? ['basic'],
    inventory: character.inventory ?? [],
    unlockedEquipmentDropIds: character.unlockedEquipmentDropIds ?? [],
    equipmentInventory,
    equipmentLoadout,
    innerSkillIds: character.innerSkillIds ?? innerSkillCatalog.map((skill) => skill.id),
    externalSkillIds: character.externalSkillIds ?? externalSkillCatalog.map((skill) => skill.id),
    equippedExternalSkillIds: character.equippedExternalSkillIds ?? [],
    skillProgression: character.skillProgression ?? {},
  }

  const attributesWithBuffs = getEffectiveAttributesForPlayer(player)
  return {
    ...player,
    attributes: attributesWithBuffs,
    maxHealth: getMaxHealth(attributesWithBuffs),
    health: getMaxHealth(attributesWithBuffs),
    maxStamina: getMaxStamina(attributesWithBuffs),
    stamina: getMaxStamina(attributesWithBuffs),
    maxInnerPower: getMaxInnerPower(attributesWithBuffs),
    innerPower: getMaxInnerPower(attributesWithBuffs),
  }
}

/**
 * 累加經驗值並處理連續升級。
 *
 * 抽離自 `gameStore.ts`，讓經驗結算可在 store action 與測試中重用。
 */
export function applyExperienceAndLevelUp(player: PlayerState, experienceGain: number): PlayerState {
  let experience = player.experience + experienceGain
  let level = player.level ?? 1
  let availableAttributePoints = player.availableAttributePoints ?? 0
  let leveledUp = false

  while (experience >= getExperienceRequired(level)) {
    experience -= getExperienceRequired(level)
    level += 1
    availableAttributePoints += ATTRIBUTE_POINTS_PER_LEVEL
    leveledUp = true
  }

  return {
    ...player,
    experience,
    level,
    availableAttributePoints,
    // 升級當下只回復體力，不再回復氣血與內力。
    ...(leveledUp ? {
      stamina: player.maxStamina,
    } : {}),
  }
}

/**
 * 屬性變更後重置衍生上限與當前值。
 *
 * 抽離自 `gameStore.ts`，用於屬性投點、裝備更動等場景。
 */
export function restoreAfterAttributeChange(player: PlayerState, attributes: PlayerAttributes): PlayerState {
  return {
    ...player,
    attributes,
    maxHealth: getMaxHealth(attributes),
    maxStamina: getMaxStamina(attributes),
    maxInnerPower: getMaxInnerPower(attributes),
  }
}
