import type { BaseBuilding } from '../catalogs/buildingCatalog'
import type { DefenseStructureDefinition } from '../catalogs/defenseStructureCatalog'
import type { EquipmentDefinition } from '../catalogs/equipmentCatalog'
import type { ItemEffectType } from '../catalogs/itemCatalog'
import type { ExternalSkill } from '../catalogs/externalSkillCatalog'
import type { GovernancePolicyId } from '../catalogs/governancePolicyCatalog'
import type { InnerSkill } from '../catalogs/innerSkillCatalog'
import type { MartialSchoolId } from '../catalogs/martialSchoolCatalog'
import type { EventEffect, EventRequirement } from '../events/eventCatalog'
import type { BuffEffects } from '../core/buffEffects'
import type { Position } from './geometry'

export type PlayerAttributes = {
  armStrength: number
  constitution: number
  agility: number
  innerEnergy: number
  insight: number
}

export type EquipmentInstance = {
  instanceId: string
  equipmentId: string
  durability: number
  maxDurability: number
}

export type EquipmentLoadout = {
  weaponInstanceId: string | null
  armorInstanceId: string | null
  accessoryInstanceId: string | null
}

export type BuffInstance = Partial<BuffEffects> & {
  id: string
  definitionId: string
  sourceId: string
  remainingRounds: number | null
}

export type InventoryEntry = {
  itemId: string
  quantity: number
}

export type SkillProgression = {
  experience: number
  level: number
}

export type PlayerState = {
  id: string
  name: string
  isAI?: boolean
  position: Position
  attributes: PlayerAttributes
  baseAttributes?: PlayerAttributes
  innerSkillIds: string[]
  innerSkillId: string
  externalSkillIds: string[]
  equippedExternalSkillIds: string[]
  /** 本回合已使用的外功 ID；回合開始時清空，每個外功每回合最多使用一次。 */
  externalSkillsUsedThisTurn?: string[]
  /** 本回合已使用的道具效果類型；回合開始時清空，每種效果每回合最多使用一次。 */
  itemEffectsUsedThisTurn?: ItemEffectType[]
  skillProgression?: Record<string, SkillProgression>
  health: number
  maxHealth: number
  stamina: number
  maxStamina: number
  innerPower: number
  maxInnerPower: number
  prestige: number
  governanceRank?: number
  unlockedPolicyIds?: GovernancePolicyId[]
  money: number
  experience: number
  level?: number
  availableAttributePoints?: number
  inventory: InventoryEntry[]
  /** 已解鎖、可進入隨機掉落池的裝備定義 ID；不是玩家實際持有的裝備。 */
  unlockedEquipmentDropIds?: string[]
  equipmentInventory?: EquipmentInstance[]
  equipmentLoadout?: EquipmentLoadout
  buffs?: BuffInstance[]
  /** 角色外觀 icon（來自名册角色，可選）。 */
  portrait?: string
  /** 角色稱號（來自名册角色，可選）。 */
  title?: string
  /** 名册角色 ID（官方角色或自訂角色）；事件掉落會依此判斷專屬功法解鎖。 */
  characterId?: string
  turnEnded: boolean,
}

export type GovernanceRank = {
  rank: number
  name: string
  requiredPrestige: number
  maxBuildingLevel: number
}

export const governanceRankCatalog: GovernanceRank[] = [
  { rank: 1, name: '流民首領', requiredPrestige: 0, maxBuildingLevel: 1 },
  { rank: 2, name: '村寨掌事', requiredPrestige: 80, maxBuildingLevel: 2 },
  { rank: 3, name: '鄉鎮主事', requiredPrestige: 240, maxBuildingLevel: 3 },
  { rank: 4, name: '地方縣佐', requiredPrestige: 560, maxBuildingLevel: 4 },
  { rank: 5, name: '一方太守', requiredPrestige: 1100, maxBuildingLevel: 5 },
  { rank: 6, name: '勢力盟主', requiredPrestige: 1800, maxBuildingLevel: 6 },
]

export type UpgradeableAttribute = keyof PlayerAttributes

export const ATTRIBUTE_NAMES: Record<UpgradeableAttribute, string> = {
  armStrength: '臂力',
  constitution: '根骨',
  agility: '身法',
  innerEnergy: '內息',
  insight: '悟性',
}

export const ATTRIBUTE_POINTS_PER_LEVEL = 2

export function getExperienceRequired(level: number): number {
  return Math.max(1, level) * 50
}

export type CreatureState = PlayerState & {
  behaviorType?: 'scavenger' | 'hunter' | 'sieger' | 'wanderer' | 'roamer'
  schoolId?: MartialSchoolId
  aggroRange?: number
  homePosition?: Position
  homeNestId?: string
  spawnedRound?: number
  /** 首領標記：擊殺時觸發 on-defeat-boss 對話、地圖顯示金框。 */
  isBoss?: boolean
}

export type ItemPointState = {
  id: string
  itemId: string | null
  position: Position
  /** 是否可被敵人生物吃掉／破壞（劇本模式預設 false＝不會被吃掉）。 */
  eatableByCreatures?: boolean
  /** 自訂掉落物清單（可指定多個道具/裝備/功法）。未指定時依地形隨機掉落。 */
  customDrops?: Array<{ lootId: string; chance: number }>
}

export type LootResult =
  | { kind: 'item'; itemId: string; itemName: string; itemIcon: string }
  | { kind: 'equipment'; instance: EquipmentInstance; equipment: EquipmentDefinition }
  | { kind: 'skill'; skill: InnerSkill | ExternalSkill; skillType: 'inner' | 'external' }

export type LearnedSkillResult =
  | { type: 'inner'; skill: InnerSkill }
  | { type: 'external'; skill: ExternalSkill }

export type BaseState = {
  id: string
  name: string
  position: Position
  buildings: BaseBuilding[]
  buildingMaterials: number
  maxBuildingMaterials: number
  health: number
  maxHealth: number
  /** 據點是否仍在運作；血量歸零時停用所有建築功能。 */
  active?: boolean
  activePolicyId?: GovernancePolicyId
  /** 上次切換政策的回合數；政策切換需等待固定回合的冷卻。 */
  lastPolicySwitchRound?: number
  martialSchoolId?: MartialSchoolId
  /** 是否已被玩家解鎖視野。完成首次告示牌任務後設為 true，據點開始提供永久視野。 */
  discovered?: boolean
  /**
   * 允許建造的建築類型與最高等級（如漁村只允許特定建築）。
   * 未指定時表示可建造所有建築（無限制）。
   */
  allowedBuildings?: Array<{ type: string; maxLevel?: number }>
}

export type CreatureNestState = {
  id: string
  name: string
  position: Position
  health: number
  maxHealth: number
  /** 每回合結束時的生成機率（0–1），每次生成後 -5%，最低 10%。 */
  spawnChance: number
  /** 生成後的冷卻剩餘回合數（0 = 可生成）。 */
  cooldownRounds: number
  spawnLevel: number
  behaviorType?: CreatureState['behaviorType']
  schoolId?: MartialSchoolId
  /**
   * 巢穴主導元素（區域靈氣系統）。
   * 有屬性巢穴產生對應元素的靈氣場；無屬性巢穴（省略或 'none'）不產生靈氣。
   * 對齊 `skillRules.ts` 的 `SchoolElement`。
   */
  dominantElement?: 'none' | 'metal' | 'wood' | 'water' | 'fire' | 'earth'
}

export type ResourcePointState = {
  id: string
  name: string
  position: Position
  ownerBaseId: string
  materialIncome: number
  lastCollectedRound: number | null
  health: number
  maxHealth: number
  /** 資源點被 Creature 摧毀後失活，保留於地圖等待玩家修復。 */
  active?: boolean
}

/**
 * 門派據點：地圖上的中立設施，不可佔領，攜帶某門派的三個功法（內功/傷害外功/技能型外功）。
 * 玩家可在該處「學習」或「練習」功法，均會累積據點自身經驗值使其升級（1→2→3）解鎖功法。
 */
export type SectGateState = {
  id: string
  schoolId: MartialSchoolId
  position: Position
  /** 門派據點自身經驗值（學習/練習均會累積）。 */
  experience: number
  /** 由 experience 推導；1 解鎖內功、2 解鎖傷害外功、3 解鎖技能型外功。 */
  level: 1 | 2 | 3
}

/**
 * 全局靈氣 buff：由貿易市場建成時隨機賦予，影響整局遊戲。
 * 可無限疊加（城市據點數量有限），來源據點失活（active === false）時失效。
 */
export type GlobalBuffKind =
  | 'shop-price-reduction'   // 商店購買價格降低
  | 'material-income-bonus'  // 資源採集與被動建料收入增加
  | 'healing-bonus'          // 醫療室/休整回復增加
  | 'base-defense-reduction' // 據點承受傷害降低
  | 'round-end-recovery-bonus' // 每回合結束額外回復氣血/內力
  | 'skill-experience-bonus' // 功法練習經驗增加

export type GlobalBuff = {
  id: string
  kind: GlobalBuffKind
  /** 效果幅度（百分比，例如 10 表示 10%）。 */
  magnitude: number
  /** 來源據點 id；該據點失活時此 buff 失效。 */
  sourceBaseId: string
  /** 來源貿易市場建築 id；升級該市場時會提升此 buff 的 magnitude。 */
  sourceBuildingId?: string
  /** 來源貿易市場的等級（決定此 buff 的 magnitude 強度）。 */
  sourceBuildingLevel?: number
}

export type DefenseStructureState = DefenseStructureDefinition & {
  id: string
  position: Position
  ownerBaseId: string
  health: number
  /** 由廢墟修復而成時，記錄來源廢墟的村落名。 */
  originName?: string
  /** 轟城砲等範圍砲擊設施的冷卻剩餘回合數（0 表示可發射）。 */
  cooldownRemaining?: number
  /** 紀錄最後一次砲擊的回合，供測試與判定單回合多次砲擊。 */
  lastFiredRound?: number
}

export type RuinState = {
  id: string
  name: string
  position: Position
  status: 'intact' | 'reconstructed'
}

/** 一次性陷阱（絆馬索 / 定身索）。 */
export type TrapState = {
  id: string
  position: Position
  type: 'snare' | 'immobilize'
  ownerPlayerId: string
  /** 絆馬索（snare）造成的傷害；由道具 effectValue 定義。 */
  damage?: number
  remainingUses?: number
}

export type ExplorationEventStatus = 'hidden' | 'available' | 'resolved' | 'expired'
export type ExplorationEventPoolId =
  | 'board-events'
  | 'item-shop-events'
  | 'equipment-shop-events'
  | 'martial-hall-events'
  | 'infirmary-events'
  | 'warehouse-events'
  | 'workshop-events'
  | 'wall-events'
  | 'barracks-events'
  | 'waystation-events'
  | 'exchange-events'
  | 'regional-management-events'
  | 'trade-market-events'
  | 'barricade-events'
  | 'watchtower-events'
  | 'arrow-tower-events'

export type ExplorationEventType =
  | 'lost-caravan'
  | 'ancient-ruins'
  | 'wounded-traveler'
  | 'wandering-merchant'
  | 'abandoned-shrine'
  | 'resource-cache'
  | 'wandering-scholar'
  | 'beast-tracks'
  | 'village-request'
  | 'storm-shelter'
  | 'bandit-ransom'
  | 'traveling-herbalist'
  | 'strange-well'
  | 'wandering-fighter'
  | 'martial-script'
  | 'trade-route'
  | 'commodity-surplus'
  | 'siege-alert'
  | 'watchtower-report'
  | 'arrow-ambush'
  | 'forest-herb-gatherer'
  | 'deep-forest-beast'
  | 'ancient-tree-enlightenment'
  | 'mountain-bandit-ambush'
  | 'cliff-carved-scripture'
  | 'mountain-spring-well'
  | 'ferry-merchant'
  | 'waterfront-fisher'
  | 'flooded-temple'
  | 'desert-mirage'
  | 'buried-caravan'
  | 'wandering-ascetic'

export type ExplorationEventState = {
  id: string
  type: ExplorationEventType | 'custom'
  name: string
  description: string
  position: Position
  status: ExplorationEventStatus
  discovered: boolean
  expiresAtRound: number | null
  sourcePoolId?: ExplorationEventPoolId
  /** 是否可被敵人生物吃掉／破壞（劇本模式預設 false＝不會被吃掉）。 */
  eatableByCreatures?: boolean
  /** 自定義事件定義（type === 'custom' 時存在）。 */
  customEvent?: {
    icon: string
    choices: Array<{
      id: string
      label: string
      description: string
      endsPlayerTurn: boolean
      requirements: EventRequirement[]
      effects: EventEffect[]
      /** 自訂結果彈窗訊息（可選；未填時自動由效果生成）。 */
      resultMessage?: string
    }>
  }
}

export type ExplorationEventChoice = {
  id: string
  label: string
  description: string
  endsPlayerTurn: boolean
}