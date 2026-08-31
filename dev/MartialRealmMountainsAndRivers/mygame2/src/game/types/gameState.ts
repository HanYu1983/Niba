import type { Position } from './geometry'
import type { PlayerAttributes } from './entities'
import type { DefenseStructureType } from '../catalogs/defenseStructureCatalog'
import type { AiActionEvent } from '../ai/aiActionEvent'
import type {
  MapState,
  VisibilityStateData,
} from './map'
import type {
  PlayerState,
  CreatureState,
  BaseState,
  CreatureNestState,
  ResourcePointState,
  ItemPointState,
  ExplorationEventState,
  SectGateState,
  GlobalBuff,
  DefenseStructureState,
  RuinState,
  TrapState,
  InventoryEntry,
  EquipmentInstance,
} from './entities'
import type {
  AttackPreview,
  ExternalSkillPreview,
  ItemBurstPreview,
  RepairPreview,
  AttackTargetType,
} from './combat'
import type { CampaignState } from './campaign'
import type { AiOrder, AiConstructionPlan } from './ai'
import type { RunStats } from '../types'

export type GameOperation =
  | { type: 'idle' }
  | { type: 'moving'; movementUsed: boolean }
  | { type: 'targeting-attack' }
  | { type: 'targeting-first-aid' }
  | { type: 'targeting-external-skill'; skillId: string }
  | { type: 'targeting-item'; itemId: string }
  | { type: 'previewing-attack' }
  | { type: 'previewing-item-burst' }
  | { type: 'previewing-external-skill' }
  | { type: 'building-defense'; baseId: string; structureType: DefenseStructureType; position: Position | null }

/** 目標選取來源種類（用於高亮樣式與 preview 分派）。 */
export type TargetingSource = 'attack' | 'external-skill' | 'item-burst' | 'first-aid'

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

export type BlockingModal =
  | { type: 'action-result'; result: ActionResult; continuation: ActionContinuation }
  | { type: 'story-dialogue'; entry: import('./campaign').DialogueQueueEntry; remaining: number }
  | null

export type InsightCapacityBreakdown = {
  total: number
  inner: number
  external: number
  limit: number
  exceeded: boolean
}

export type CreatureActionLog = {
  creatureId: string
  creatureName: string
  message: string
}

export type ItemPointPickupResult = {
  itemId: string
  itemName: string
  itemIcon: string
}

/**
 * 權威模擬狀態：地圖、世界物件、玩家／生物、回合推進與劇情進度。
 * 這些欄位構成遊戲規則的「事實」，由 domain actions 產生與消費。
 */
export type WorldState = {
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
  /** 巢穴每回合回復的最大生命比例（開局時從 settings 帶入，預設 0.01）。 */
  nestHealthRegenPercent?: number
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
  creatureTurnInProgress: boolean
  activeCreatureId: string | null
  gameOver?: boolean
  gameOverReason?: 'all-players-defeated' | 'any-base-destroyed'
  gameWon?: boolean
  /** 人類玩家本回合已造成的傷害累積（供「單回合最高傷害」戰績計算）；回合開始時歸零。 */
  damageDealtThisRound?: number
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

/**
 * UI 過渡狀態：預覽、目標選取、阻塞彈窗與一次性視覺訊號。
 * 這些欄位是「玩家正在做什麼」的暫存，不影響規則模擬本身。
 */
export type UiState = {
  attackPreview: AttackPreview | null
  externalSkillPreview: ExternalSkillPreview | null
  itemBurstPreview?: ItemBurstPreview | null
  repairPreview?: RepairPreview | null
  operation: GameOperation
  blockingModal: BlockingModal
  /** 三重共振震動動畫：記錄被命中生物的位置與觸發訊號；供該位置呈現 shake 動畫（即使生物已被移除）。 */
  creatureShake?: { signal: number; targetId: string; position: Position; icon: string } | null
}

/**
 * Session 識別狀態：本局唯一識別與名册角色綁定。
 * 隨存檔序列化，供殘卷結算跨 session 去重。
 */
export type SessionState = {
  /** 本局唯一識別（startGame/restartGame/loadScenario 時產生），隨存檔序列化；供殘卷結算跨 session 去重。 */
  runId?: string
  /** 本局各人類玩家選用的名册角色 id（依人類玩家順序；未選用為 null）。隨存檔序列化，讀檔後還原，避免局末結算回寫到錯誤角色。 */
  activeCharacterIds?: (string | null)[]
  /** 舊版單一角色欄位（向下相容，讀取舊存檔時轉換為 activeCharacterIds）。 */
  activeCharacterId?: string | null
}

/**
 * 完整遊戲狀態 = WorldState（權威模擬）+ UiState（UI 過渡）+ SessionState（本局識別）。
 *
 * 以 intersection 組合，欄位形狀與拆分前完全一致——既有建構與讀取程式碼不需改動。
 * 後續可逐步讓 domain actions 只依賴 WorldState、UI 元件只讀取 UiState。
 */
export type GameState = WorldState & UiState & SessionState

export type { PlayerAttributes }