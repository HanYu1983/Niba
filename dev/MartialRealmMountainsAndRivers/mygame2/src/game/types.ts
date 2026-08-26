import type { BaseBuilding } from "./catalogs/buildingCatalog"
import type { DefenseStructureDefinition, DefenseStructureType } from "./catalogs/defenseStructureCatalog"
import type { EquipmentDefinition } from "./catalogs/equipmentCatalog"
import type { ItemEffectType } from './catalogs/itemCatalog'
import type { ExternalSkill } from "./catalogs/externalSkillCatalog"
import type { GovernancePolicyId } from "./catalogs/governancePolicyCatalog"
import type { InnerSkill } from "./catalogs/innerSkillCatalog"
import type { MartialSchoolId } from './catalogs/martialSchoolCatalog'
import type { EventEffect, EventRequirement } from './events/eventCatalog'
import type { AiActionEvent } from './ai/aiActionEvent'
import { itemCatalog } from './catalogs/itemCatalog'
import { equipmentCatalog } from './catalogs/equipmentCatalog'

export type Position = {
  row: number
  column: number
}

export type GameSettings = {
  rows: number
  columns: number
  baseCount: number
  nestCount: number
  resourcePointCount: number
  itemPointCount: number
  playerCount: number
  aiPlayerCount?: number
  explorationEventCount: number
  /** 人類玩家回合結束時，隨機觸發探索事件的機率（0~1）。 */
  explorationTriggerChance?: number
  creatureCount: number
  ruinCount: number
  /** 地圖上生成的中立門派據點數量，上限 6（六門派各一）。 */
  sectGateCount?: number
  /** 各可通行地形的生成權重；未提供時使用預設權重。 */
  terrainWeights?: TerrainWeights
  seed: number
}

export type TerrainType = 'plain' | 'forest' | 'water' | 'mountain' | 'desert' | 'wall' | 'road'

/** 可通行地形的生成權重（不含 wall / road）。權重越高，該地形出現越多。 */
export type TerrainWeights = {
  plain: number
  forest: number
  water: number
  mountain: number
  desert: number
}

export const terrainStaminaCost: Record<TerrainType, number> = {
  plain: 2,
  forest: 4,
  water: 6,
  mountain: 5,
  desert: 3,
  wall: Number.POSITIVE_INFINITY,
  road: 1,
}

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

export type BuffInstance = {
  id: string
  definitionId: string
  sourceId: string
  remainingRounds: number | null
  attributeMultiplier?: number
  maxHealthDamagePercent?: number
  criticalRateMultiplier?: number
  criticalRateBonus?: number
  terrainCostOverride?: number
  reflectionPercent?: number
  lifestealPercent?: number
  innerPowerLeechPercent?: number
  damageReductionPercent?: number
  healthRegenPercent?: number
  innerPowerHealthRegenPercent?: number
  /** 每回合回復「最大內力 × 比例」的內力。 */
  innerPowerRegenPercent?: number
  damageDealtPercent?: number
  externalSkillDamagePercent?: number
  evasionRateBonus?: number
  basicAttackStaminaCostReduction?: number
  staminaToInnerPowerRatio?: number
  externalSkillInnerCostReduction?: number
  insightTrueDamageMultiplier?: number
  visionRadiusBonus?: number
  maxStaminaBonus?: number
  gatherStaminaCostReduction?: number
  gatherDoubleYieldChance?: number
  buildingMaterialCostReduction?: number
  buildingReputationBonus?: number
  shopBuyPriceDiscount?: number
  shopSellPriceBonus?: number
  questRewardBonus?: number
  /** 功法經驗獲得加成比例（技能經驗乘算）。 */
  skillExpGainPercent?: number
  confused?: boolean
  /** 震懾：三重共振觸發時施加，目標完全跳過下一個回合。 */
  stunned?: boolean
  damageTakenFromAlliesBonus?: number
  /** 復活時恢復的血量比例（覆寫定義基礎值，供等級縮放；reviveOnDeath 仍由定義旗標決定）。 */
  reviveHealthPercent?: number
  /** 條件觸發型：依血量區間觸發的四維乘算（覆寫定義基礎值，供等級縮放）。 */
  conditional?: {
    when: 'health-below' | 'health-above'
    threshold: number
    multiplier: number
  }
}

export type MapCell = {
  id: string
  row: number
  column: number
  terrain: TerrainType
}

export type MapState = {
  rows: number
  columns: number
  cells: MapCell[]
}

export type VisibilityMode = 'fog' | 'revealed'
export type VisibilityState = 'unexplored' | 'explored' | 'visible'
export type VisibilityStateData = {
  exploredCellIds: string[]
  mode: VisibilityMode
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

/** 建設相關聲望來源，用於追蹤建設指令的聲望發放。 */
export type ConstructionPrestigeSource =
  | 'build'
  | 'upgrade'
  | 'repair'
  | 'heal'
  | 'policy-switch'

export const CONSTRUCTION_PRESTIGE: Record<ConstructionPrestigeSource, number> = {
  build: 5,
  upgrade: 8,
  repair: 3,
  heal: 2,
  'policy-switch': 4,
}

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

export type LootResult =
  | { kind: 'item'; itemId: string; itemName: string; itemIcon: string }
  | { kind: 'equipment'; instance: EquipmentInstance; equipment: EquipmentDefinition }
  | { kind: 'skill'; skill: InnerSkill | ExternalSkill; skillType: 'inner' | 'external' }

export type LearnedSkillResult =
  | { type: 'inner'; skill: InnerSkill }
  | { type: 'external'; skill: ExternalSkill }

export type LootDefinition =
  | { kind: 'item'; itemId: string; weight: number }
  | { kind: 'equipment'; equipmentId: string; weight: number }
  | { kind: 'skill'; skillId: string; skillType: 'inner' | 'external'; weight: number }

export const lootCatalog: LootDefinition[] = [
  // 暫時清空可掉落的功法清單；有待重新設計江湖功法後再填入。
]

/** 道具點專用掉落池：包含所有道具與裝備，不包含功法。 */
export const itemPointLootCatalog: LootDefinition[] = [
  // 道具點只會掉落 1~2 級道具。
  ...itemCatalog
    .filter((item) => (item.requiredShopLevel ?? 1) <= 2)
    .map((item) => ({ kind: 'item' as const, itemId: item.id, weight: 20 })),
  // 道具點只會掉落 1~2 級裝備。
  ...equipmentCatalog
    .filter((equipment) => !equipment.schoolId && equipment.requiredShopLevel <= 2)
    .map((equipment) => ({ kind: 'equipment' as const, equipmentId: equipment.id, weight: 10 })),
]

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
   * 對齊 `skillRules.ts` 的 `MartialElement`。
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

export type ExternalSkillPreview = {
  playerId: string
  targetType: AttackTargetType
  targetId: string
  skillId: string
  playerName: string
  targetName: string
  skillName: string
  innerPowerCost: number
  expectedDamage: number
  /** 傷害型外功的暴擊率（內息每 1 點提供 2%）。 */
  criticalRate?: number
  /** 是否觸發五行相生連攜（內功生外功）。 */
  synergy?: boolean
  /** 是否觸發三重共振（連攜＋天地共鳴＋五行相剋）。 */
  tripleResonance?: boolean
  /** 連攜共振狀態：single 僅連攜、dual 連攜＋共鳴、triple 三重共振。 */
  synergyResonanceState?: 'single' | 'dual' | 'triple'
  targetHealth?: number
  targetMaxHealth?: number
  targetMode?: 'self' | 'target' | 'nest'
  effectSummary?: string
  elementInteraction?: string
  terrainResonance?: string
}

export type GameOperation =
  | { type: 'idle' }
  | { type: 'moving'; movementUsed: boolean }
  | { type: 'targeting-attack' }
  | { type: 'targeting-external-skill'; skillId: string }
  | { type: 'targeting-item'; itemId: string }
  | { type: 'previewing-attack' }
  | { type: 'previewing-item-burst' }
  | { type: 'previewing-external-skill' }
  | { type: 'building-defense'; baseId: string; structureType: DefenseStructureType; position: Position | null }

/** 目標選取來源種類（用於高亮樣式與 preview 分派）。 */
export type TargetingSource = 'attack' | 'external-skill' | 'item-burst'

/** 範圍形狀：決定「哪些格子是合法目標」。 */
export type TargetingShape =
  | { kind: 'radius'; range: number }          // 曼哈頓半徑 range 格內（range=1 即周遭 4 格）
  | { kind: 'cross'; length: number }          // 十字形（上下左右各 length 格）
  | { kind: 'line'; length: number }           // 直線（需搭配方向，Phase 後續支援）
  | { kind: 'custom'; cellIds: string[] }      // 自訂格子集合（編輯器）

/** 選取模式：決定「如何選取、命中多少目標」。 */
export type SelectionMode =
  | { kind: 'single' }              // 點選 1 個目標
  | { kind: 'all' }                 // 一次命中範圍內所有目標
  | { kind: 'multi'; max: number }  // 點選多個（上限 max）

/** 目標選取規格：範圍形狀 × 選取模式 × 目標類型的組合契約。 */
export type TargetingSpec = {
  shape: TargetingShape
  mode: SelectionMode
  targetTypes: AttackTargetType[]
  hint: string
  source: TargetingSource
}

export type ActionResult = {
  title: string
  message: string
  rewards: string[]
}

export type ActionOutcome =
  | { ok: true }
  | { ok: false; reason: string }

export type ActionExecutionResult<T> =
  | { ok: true; data: T }
  | { ok: false; reason: string }

export type MaterialTransferResult = {
  deliveredAmount: number
  loss: number
}

export type ActionContinuation =
  | { type: 'none' }
  | { type: 'end-player-turn'; playerId: string }
  | { type: 'flush-creature-turn' }

/** 對話觸發條件類型。採開放式字串，供未來擴充自訂條件。 */
export type DialogueTriggerCondition =
  | 'on-start'                // 關卡開局時觸發
  | 'on-objective-complete'   // 特定任務目標達成時觸發（triggerParam = objectiveId）
  | 'on-enter-region'         // 玩家進入指定區域時觸發（triggerParam = "row,column" 或 region id）
  | 'on-enter-area'           // 玩家進入編輯器定義的區域時觸發（triggerParam = areaId）
  | 'on-exit-area'            // 玩家離開編輯器定義的區域時觸發（triggerParam = areaId）
  | 'on-defeat-boss'          // 擊敗首領時觸發（triggerParam = creatureId）
  | 'on-round-reached'        // 到達指定回合時觸發（triggerParam = round number）
  | 'on-object-destroyed'     // 指定物件從地圖消失時觸發（triggerParam = objectId；含生物死亡、建築/防禦設施被破壞等）
  | 'on-failure'              // 失敗結算前觸發
  | 'on-victory'              // 勝利結算前觸發
  | string                    // 開放式擴充

/** 對話佇列中單一步驟的運行時狀態。 */
export type DialogueQueueEntry = {
  stepId: string              // 對應 ScenarioDialogueStep.id
  speakerName: string
  speakerIcon: string
  content: string
  triggerCondition: DialogueTriggerCondition
  triggerParam?: string
  /** 是否已顯示完畢（供跳過/還原用）。 */
  consumed?: boolean
}

/** 劇情模式運行時狀態（對話佇列 + 任務目標 + 失敗條件）。 */
export type CampaignState = {
  /** 當前章節索引（0 = 序章）。 */
  currentChapter: number
  /** 當前章節 key（storyDialogueCatalog 索引鍵）。 */
  chapterKey?: string
  /** 已觸發過的對話 stepId 集合（避免重複觸發）。 */
  triggeredDialogueIds: string[]
  /** 待顯示的對話佇列（FIFO；一次可能有多句排隊）。 */
  dialogueQueue: DialogueQueueEntry[]
  /** 本章節的對話定義（由 scenarioCompiler 從 ScenarioDefinition 注入）。 */
  dialogues?: Array<{
    id: string
    speakerName: string
    speakerIcon: string
    content: string
    triggerCondition: string
    triggerParam?: string
    endsChapter?: boolean
  }>
  /** 本章節的對話組定義（由 scenarioCompiler 注入，供觸發器 start-dialogue 使用）。 */
  dialogueGroups?: Record<string, {
    name: string
    steps: Array<{
      id: string
      speakerName: string
      speakerIcon: string
      content: string
    }>
  }>
  /** 本章節的事件觸發器定義（由 scenarioCompiler 注入）。 */
  triggers?: Array<{
    id: string
    condition: string
    conditionParam?: string
    action: 'start-dialogue' | 'spawn-creature'
    actionParam: string
  }>
  /** 編輯器定義的區域列表（供 on-enter-area / on-exit-area 觸發器使用）。 */
  scenarioAreas?: Array<{
    id: string
    name: string
    positions: Array<{ row: number; column: number }>
    /** 此區域的 on-enter-area 觸發器觸發一次後，即從地圖移除（一次性區域）。 */
    destroyWhenTriggered?: boolean
  }>
  /** 探索點消失後是否補充新探索點（劇本模式預設關閉）。 */
  replenishExplorationEvents?: boolean
  /** 任務目標運行時狀態。 */
  activeObjectives: Array<{
    id: string
    title: string
    type: string
    targetValue: number
    currentValue: number
    completed: boolean
    isOptional?: boolean
    /** 目標關聯的物件 id（如擊敗的 Boss creatureId）。 */
    targetId?: string
    /** 目標關聯的多個物件 id，全部互動/完成才計入目標（interact-object 用）。 */
    targetIds?: string[]
    /** 已完成的物件 id 集合（targetIds 目標用的運行時進度）。 */
    doneTargetIds?: string[]
    /** 目標指定的到達位置列（reach-position 目標用）。 */
    targetRow?: number
    /** 目標指定的到達位置欄（reach-position 目標用）。 */
    targetColumn?: number
    /** 目標指定的建築類型（build-building 目標用，如 'infirmary'）。 */
    buildingType?: string
    /** 目標指定的建築等級（build-building 目標用，如 3 表示三級）。 */
    buildingLevel?: number
    /** 目標指定的防禦設施類型（build-defense-structure 目標用）。 */
    structureType?: string
  }>
  /** 失敗條件運行時狀態。 */
  failConditions: {
    maxRounds?: number
    baseMustSurvive?: boolean
    playerMustSurvive?: boolean
    criticalBases?: string[]
    maxLostBasesCount?: number
  }
}

export type BlockingModal =
  | { type: 'action-result'; result: ActionResult; continuation: ActionContinuation }
  | { type: 'story-dialogue'; entry: DialogueQueueEntry; remaining: number }
  | null

export type InsightCapacityBreakdown = {
  total: number
  inner: number
  external: number
  limit: number
  exceeded: boolean
}

/** 普通攻擊的暴擊率：臂力每 1 點提供 2%，最高 50%。 */
export function getCriticalRate(attributes: PlayerAttributes): number {
  return attributes.armStrength * 2
}

export type CreatureActionLog = {
  creatureId: string
  creatureName: string
  message: string
}

export type AttackTargetType = 'creature' | 'nest'

export type AttackPreview = {
  playerId: string
  targetType: AttackTargetType
  targetId: string
  playerName: string
  targetName: string
  expectedDamage: number
  criticalRate: number
  targetHealth: number
  targetMaxHealth: number
  elementInteraction?: string
  terrainResonance?: string
}

/** 元素爆發道具（element-burst）的預期結果預覽。 */
export type ItemBurstPreview = {
  playerId: string
  playerName: string
  itemId: string
  itemName: string
  itemIcon: string
  targetType: AttackTargetType
  targetId: string
  targetName: string
  expectedDamage: number
  targetHealth: number
  targetMaxHealth: number
  elementInteraction?: string
}

export type AttackExecutionResult = {
  playerId: string
  playerName: string
  targetType: AttackTargetType
  targetId: string
  targetName: string
  damage: number
  nextHealth: number
  maxHealth: number
  criticalRate: number
  criticalHit: boolean
  terrainResonance?: string
  defeated: boolean
  experienceReward?: number
  moneyReward?: number
  loot?: LootResult
  learnedSkill?: LearnedSkillResult
  levelsGained?: number
  newLevel?: number
  attributePointsGained?: number
  equipmentDurabilityChanges?: EquipmentDurabilityChange[]
}

export type EquipmentDurabilityChange = {
  slot: 'weapon' | 'armor' | 'accessory'
  equipmentName: string
  before: number
  after: number
  amount: number
}

export type ExternalDamageExecutionResult = {
  playerId: string
  playerName: string
  targetType: AttackTargetType
  targetId: string
  targetName: string
  /** 目標被擊殺前的格子位置（供震動動畫在被移除後仍能定位）。 */
  targetPosition?: Position
  skillId: string
  skillName: string
  damage: number
  nextHealth: number
  maxHealth: number
  innerPowerCost: number
  /** 範圍攻擊（selectionMode = all）：各目標的傷害結果；單體攻擊時為 undefined。 */
  areaTargets?: Array<{
    targetType: AttackTargetType
    targetId: string
    targetName: string
    targetPosition?: Position
    damage: number
    nextHealth: number
    maxHealth: number
    defeated: boolean
  }>
  /** 傷害型外功的暴擊率（內息每 1 點提供 2%）。 */
  criticalRate?: number
  /** 本次外功是否觸發暴擊。 */
  criticalHit?: boolean
  /** 本次外功是否觸發五行相生連攜。 */
  synergy?: boolean
  /** 本次外功是否觸發三重共振（連攜＋共鳴＋相剋）。 */
  tripleResonance?: boolean
  targetMode?: 'self' | 'target' | 'nest'
  terrainResonance?: string
  defeated: boolean
  experienceReward?: number
  moneyReward?: number
  loot?: LootResult
  learnedSkill?: LearnedSkillResult
  levelsGained?: number
  newLevel?: number
  attributePointsGained?: number
  equipmentDurabilityChanges?: EquipmentDurabilityChange[]
  appliedBuffs?: Array<{
    name: string
    description: string
    remainingRounds: number | null
  }>
}

/** 元素爆發道具（element-burst）的執行結果，與普通攻擊/外功共用擊殺結算。 */
export type ItemBurstExecutionResult = {
  playerId: string
  playerName: string
  itemId: string
  itemName: string
  itemIcon: string
  element?: string
  targetType: AttackTargetType
  targetId: string
  targetName: string
  damage: number
  nextHealth: number
  maxHealth: number
  defeated: boolean
  experienceReward?: number
  moneyReward?: number
  loot?: LootResult
  learnedSkill?: LearnedSkillResult
  levelsGained?: number
  newLevel?: number
  attributePointsGained?: number
}

export type RepairEquipmentPreview = {
  instanceId: string
  equipmentId: string
  name: string
  icon: string
  slot: 'weapon' | 'armor' | 'accessory'
  beforeDurability: number
  maxDurability: number
  durabilityRestored: number
}

export type RepairPreview = {
  playerId: string
  baseId: string
  equipmentCount: number
  durabilityRestored: number
  moneyCost: number
  repairedEquipment?: RepairEquipmentPreview[]
  /** 因工坊等級不足而無法修理的裝備數量。 */
  lockedEquipmentCount?: number
}

export function getAdjacentPositions(position: Position): Position[] {
  return [
    { row: position.row - 1, column: position.column },
    { row: position.row + 1, column: position.column },
    { row: position.row, column: position.column - 1 },
    { row: position.row, column: position.column + 1 },
  ]
}

export function isSamePosition(first: Position, second: Position): boolean {
  return first.row === second.row && first.column === second.column
}

/** 判斷 target 是否在 origin 的 range 格曼哈頓距離內（range = 1 等同相鄰；距離 0 回傳 false）。 */
export function isWithinRange(origin: Position, target: Position, range: number): boolean {
  const distance = Math.abs(origin.row - target.row) + Math.abs(origin.column - target.column)
  return distance <= range && distance > 0
}

export function isAdjacent(first: Position, second: Position): boolean {
  return isWithinRange(first, second, 1)
}

/** 判斷位置是否在目標自身格或周圍一格內。 */
export function isSameOrAdjacent(first: Position, second: Position): boolean {
  return isSamePosition(first, second) || isAdjacent(first, second)
}

/** 本局累積戰績；由各行動模組在事件發生時累加，供結局彈窗結算顯示。 */
export type RunStats = {
  creaturesDefeated: number
  nestsDestroyed: number
  buildingsBuilt: number
  buildingsUpgraded: number
  buildingsRepaired: number
  eventsResolved: number
  itemsCollected: number
  skillsLearned: number
  defenseStructuresBuilt: number
  maxNormalAttackDamage: number
  maxExternalSkillDamage: number
  maxLevelReached: number
  attributesAtMaxLevel: PlayerAttributes | null
  moneySpent: number
}

export type GameState = {
  map: MapState
  visibility?: VisibilityStateData
  bases: BaseState[]
  defenseStructures?: DefenseStructureState[]
  ruins?: RuinState[]
  /** 一次性陷阱（絆馬索 / 定身索）。 */
  traps?: TrapState[]
  /** 鳴鑼符暫時揭示的怪物所在格 id；下回合恢復迷霧。 */
  revealedCreatureCellIds?: string[]
  /** 鳴鑼符揭示的到期回合（使用時 round + 1）。 */
  revealedCreatureUntilRound?: number
  creatureNests: CreatureNestState[]
  resourcePoints: ResourcePointState[]
  itemPoints: ItemPointState[]
  explorationEvents?: ExplorationEventState[]
    /** 回合結束隨機觸發、等待玩家選擇的探索事件（不佔用地圖格子）。 */
  pendingExplorationEvent?: ExplorationEventState | null
  /** 觸發 pendingExplorationEvent 的目標玩家 id（回合結束時觸發時，activePlayerId 可能已切換）。 */
  pendingExplorationEventPlayerId?: string | null
  /** 回合結束隨機觸發探索事件的機率（開局時從 settings 帶入）。 */
  explorationTriggerChance?: number
  /** 中立門派據點。 */
  sectGates?: SectGateState[]
  /** 貿易市場賦予的全局靈氣 buff；來源據點失活時自動失效。 */
  globalBuffs?: GlobalBuff[]
  players: PlayerState[]
  creatures: CreatureState[]
  /** 場景中「開局不生成」的怪物定義（spawnOnLoad === false），供事件效果 spawn-creature 觸發時加入場上。 */
  scenarioCreatures?: CreatureState[]
  /** 場景中「開局不生成」的探索事件點定義（spawnOnLoad === false），供事件效果 spawn-event 觸發時加入場上。 */
  scenarioEvents?: ExplorationEventState[]
  /** 場景中「開局不生成」的據點定義（spawnOnLoad === false），供事件效果 spawn-base 觸發時加入場上。 */
  scenarioBases?: BaseState[]
  /** 場景中「開局不生成」的巢穴定義（spawnOnLoad === false），供事件效果 spawn-nest 觸發時加入場上。 */
  scenarioNests?: CreatureNestState[]
  activePlayerId: string
  round: number
  creatureActionLogs: CreatureActionLog[]
  attackPreview: AttackPreview | null
  externalSkillPreview: ExternalSkillPreview | null
  itemBurstPreview?: ItemBurstPreview | null
  repairPreview?: RepairPreview | null
  creatureTurnInProgress: boolean
  activeCreatureId: string | null
  operation: GameOperation
  blockingModal: BlockingModal
  /** 三重共振震動動畫：記錄被命中生物的位置與觸發訊號；供該位置呈現 shake 動畫（即使生物已被移除）。 */
  creatureShake?: { signal: number; targetId: string; position: Position; icon: string } | null
  gameOver?: boolean
  gameOverReason?: 'all-players-defeated' | 'any-base-destroyed'
  gameWon?: boolean
  /** 本局累積戰績；由各行動模組累加，供結局彈窗結算顯示。 */
  runStats?: RunStats
  /** 劇情模式運行狀態；沙盒模式不設定此欄位。 */
  campaignState?: CampaignState
  sharedWarehouse?: InventoryEntry[]
  /** 跨據點共享的裝備倉庫（裝備有耐久度，與道具分開存放）。 */
  sharedEquipmentWarehouse?: EquipmentInstance[]
  aiOrders?: AiOrder[]
  aiConstructionPlans?: AiConstructionPlan[]
  /** 全域行動日誌（重構文件 §4.5 AiActionEvent）；只保留最新 MAX_ACTION_EVENTS 筆，隨存檔序列化。 */
  actionEvents?: AiActionEvent[]
}

export type AiOrderStatus = 'active' | 'paused' | 'completed' | 'failed'

export type AiOrder =
  | {
      id: string
      type: 'protect-base'
      aiPlayerId: string
      baseId: string
      radius: number
      priority: number
      retreatHealthPercent: number
      status: AiOrderStatus
    }
  | {
      id: string
      type: 'support-player'
      aiPlayerId: string
      playerId: string
      maxDistance: number
      priority: number
      retreatHealthPercent: number
      status: AiOrderStatus
    }
  | {
      id: string
      type: 'test1'
      aiPlayerId: string
      priority: number
      status: AiOrderStatus
    }

export type AiConstructionPolicy = 'defense' | 'economy' | 'frontline' | 'balanced' | 'paused'

export type AiConstructionPlanItem = {
  buildingType: string
  priority: number
  status: 'planned' | 'building' | 'completed' | 'blocked' | 'cancelled'
  blockedReason?: string
}

export type AiConstructionPlan = {
  aiPlayerId: string
  baseId: string
  policy: AiConstructionPolicy
  allowUpgrade: boolean
  queue: AiConstructionPlanItem[]
}

export type ItemPointPickupResult = {
  itemId: string
  itemName: string
  itemIcon: string
}
