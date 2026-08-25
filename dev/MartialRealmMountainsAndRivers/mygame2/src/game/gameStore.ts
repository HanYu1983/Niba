import { useSyncExternalStore } from 'react'
import { itemCatalog, type ItemEffectType } from './catalogs/itemCatalog'
import {
  type Position,
  type GameSettings,
  type MapState,
  type PlayerState,
  type CreatureState,
  type BaseState,
  type CreatureNestState,
  type GameState,
  type GameOperation,
  type ActionResult,
  type ActionOutcome,
  type ActionExecutionResult,
  type MaterialTransferResult,
  type ActionContinuation,
  type RepairPreview,
  type AttackTargetType,
  type AttackExecutionResult,
  type ExternalDamageExecutionResult,
  type ItemBurstExecutionResult,
  type CreatureActionLog,
  type LootResult,
  type EquipmentLoadout,
  type BuffInstance,
  type TrapState,
  type ExplorationEventChoice,
  type UpgradeableAttribute,
  type AiOrder,
  type AiConstructionPlan,
  type AiConstructionPlanItem,
  type CampaignState,
  isAdjacent,
  isSameOrAdjacent,
  isSamePosition,
  getAdjacentPositions,
} from './types'
import type { AiAction } from './ai/aiAction'
import type { AiActionEvent } from './ai/aiActionEvent'
import { createAiActionEvent } from './ai/aiActionEvent'
import {
  getBuff,
  getEquipment,
  getEquipmentLoadout,
  getEffectiveAttributesForPlayer,
  getEquipmentInventory,
  canTraverseTerrain,
} from './rules/playerDerivedRules'
import { getExternalSkill, getPlayerTotalInsightCost, getElementDamageMultiplier, getSchoolElement } from './rules/skillRules'
import {
  applyBaseHealthBonuses,
} from './rules/baseRules'
import { validateDefenseBuild } from './rules/defenseRules'
import { getRepairSummary, getWorkshopLevel, repairEquipmentInventory } from './rules/buildingRules'
import { applyConstructionPrestige } from './rules/governanceRules'
import {
  canTransportPlayer,
  getTransportLandingPosition,
  resolveTransportTarget,
  WAYSTATION_TRANSPORT_COST,
} from './rules/transportRules'
import {
  updatePlayerVisibility,
  getScoutCellIds,
} from './rules/visibilityRules'
import {
  applyEquipmentLoadout,
} from './rules/equipmentRules'
import { type EquipmentSlot } from './catalogs/equipmentCatalog'
import { allInnerSkillCatalog } from './catalogs/martialHallSkillCatalog'
import type { DefenseStructureType } from './catalogs/defenseStructureCatalog'
import type { GovernancePolicyId } from './catalogs/governancePolicyCatalog'
import { ACTION_STAMINA_COSTS, canPlayerPerformAction, getActionablePlayer, spendPlayerStamina } from './rules/actionCostRules'
import {
  createCharacterState,
  applyExperienceAndLevelUp,
  restoreAfterAttributeChange,
} from './characterFactory'
import { getMaxHealth, getMaxInnerPower, getMaxStamina } from './rules/playerStatsRules'
import {
  buyEquipment as buyEquipmentAction,
  buySectEquipment as buySectEquipmentAction,
  buyItem as buyItemAction,
  sellEquipment as sellEquipmentAction,
  sellItem as sellItemAction,
} from './actions/shopActions'
import {
  constructBuilding as constructBuildingAction,
  constructDefenseStructure as constructDefenseStructureAction,
  upgradeBuilding as upgradeBuildingAction,
} from './actions/buildingActions'
import {
  pickNextBuildCandidate,
  pickUpgradeCandidate,
} from './ai/construction/constructionAi'
import {
  switchBasePolicy as switchBasePolicyAction,
  switchRemoteBasePolicy as switchRemoteBasePolicyAction,
  transferBaseMaterials as transferBaseMaterialsAction,
} from './actions/governanceActions'
import {
  collectResourcePoint as collectResourcePointAction,
  collectResourcePointBatch as collectResourcePointBatchAction,
  executeMission as executeMissionAction,
  executeMissionBatch as executeMissionBatchAction,
  resolveExplorationEvent as resolveExplorationEventAction,
  resolvePendingExplorationEvent as resolvePendingExplorationEventAction,
  useInfirmary as infirmaryAction,
  type CollectionBatchResult,
  type InfirmaryResult,
  type MissionBatchResult,
} from './actions/explorationActions'
import {
  applyTargetDefeat,
  executeAttack as executeAttackAction,
  executeExternalDamage as executeExternalDamageAction,
  resolveCreatureDefeatRewards,
} from './actions/combatActions'
import { executeAiAttack as executeAiAttackAction } from './ai/execution/executeAiAttack'
import {
  depositEquipment as depositEquipmentAction,
  depositItem as depositItemAction,
  withdrawEquipment as withdrawEquipmentAction,
  withdrawItem as withdrawItemAction,
} from './actions/storageActions'
import { movePlayer as movePlayerAction } from './actions/movementActions'
import { collectItemPointAction } from './actions/itemActions'
import {
  endPlayerTurn as endPlayerTurnAction,
  startPlayerTurn as startPlayerTurnAction,
  type CreatureTurnResult,
} from './actions/turnActions'
import {
  moveCreatures,
  spawnCreaturesFromNests as spawnCreaturesFromNestsAction,
} from './actions/creatureActions'
import { DEFAULT_GAME_SETTINGS, getSavedGameSettings } from './gameSettings'
import { animateCreatureTurn as animateCreatureTurnAction } from './creatureAnimation'
import { learnSkillAtMartialHall as learnSkillAtMartialHallAction } from './actions/martialHallActions'
import { learnSkillAtSectGate as learnSectGateSkillAction, practiceSkillAtSectGate as practiceSectGateSkillAction } from './actions/sectGateActions'
import { clearRuin as clearRuinAction, reconstructRuin as reconstructRuinAction } from './actions/ruinActions'
import { AUTO_SAVE_SLOT, getGameSaveSlots, loadGameState, loadGameStateFromSlot, saveGameState, saveGameStateToSlot, deleteGameStateFromSlot } from './gameSave'
import { recordScenarioClearance } from './campaignClearance'
import { createGameState as createWorldGameState, createDebugGameState as createWorldDebugGameState, createTestCampaignGameState as createWorldTestCampaignGameState } from './worldSetup'
import {
  canExecuteRepair,
  createAttackPreview,
  createExternalSkillPreview,
  createItemBurstPreview,
  createRepairPreview,
} from './previewOrchestration'
import {
  addLootToPlayer,
  createLootForPlayer,
  getLearnableSkill,
} from './lootFactory'
import { runActionExecution, runActionOutcome } from './storeAdapters'
import { recordMaxLevel } from './runStats'
import { enqueueDialogue, skipAllDialogue } from './actions/dialogueActions'
import { collectTriggeredDialogues } from './rules/dialogueTriggerRules'
import { checkVictory } from './rules/campaignRules'
import { executeTriggers } from './rules/triggerRules'
import { storyDialogueCatalog } from './catalogs/storyDialogueCatalog'
import { buildGameStateFromScenario } from '../editor/rules/scenarioCompiler'
import { validateScenario } from '../editor/rules/scenarioValidator'
import type { ScenarioDefinition } from '../editor/editorTypes'
import { chooseDefenseAction } from './aiDefenseRules'
import { chooseSupportAction } from './aiSupportRules'
import { chooseSelfPreservationAction } from './aiSelfPreservationRules'
import { defenseActionToAiAction } from './ai/aiAction'
import { validateAiAction } from './ai/validation/validateAiAction'
import { getPlayerAiEmergency } from './ai/policy/aiPolicyRegistry'
import { executeAiAction as executeAiActionDomain } from './ai/execution/executeAiAction'
import { computeFuzzyInputs } from './ai/fuzzy/fuzzyInputs'
import { evaluateAllGoals } from './ai/fuzzy/goals'
import { selectBestGoal, MIN_THRESHOLD } from './ai/fuzzy/decision'
import { buildActionSequence } from './ai/fuzzy/goalActionMapper'
import { defaultRandomSource } from './rules/randomRules'
import { getBlockedPositions } from './rules/movementRules'

export function spawnCreaturesFromNests(
  nests: CreatureNestState[],
  creatures: CreatureState[],
  map: MapState,
  players: PlayerState[],
  bases: BaseState[],
  round: number,
  blockedPositions: Position[] = [],
): { nests: CreatureNestState[]; creatures: CreatureState[]; logs: CreatureActionLog[] } {
  return spawnCreaturesFromNestsAction(nests, creatures, map, players, bases, round, {
    createCreatureState: (input) => createCharacterState(input),
  }, blockedPositions)
}

/** 掃描人類玩家，記錄最高等級與該等級五維快照。 */
function recordHumanMaxLevel(state: GameState): GameState {
  let next = state
  for (const player of state.players) {
    if (player.isAI) continue
    const level = player.level ?? 1
    next = recordMaxLevel(next, level, player.attributes)
  }
  return next
}

function hasAvailablePlayerAction(state: GameState, playerId: string): boolean {
  const player = getActionablePlayer(state, playerId)
  if (!player) return false
  return player.stamina > 0 || state.creatures.some((creature) => isAdjacent(player.position, creature.position)) || state.resourcePoints.some((point) => point.lastCollectedRound !== state.round && isSameOrAdjacent(player.position, point.position))
}

export function getDefenseBuildValidation(state: GameState, playerId: string, baseId: string, structureType: DefenseStructureType, position: Position): string | null {
  return validateDefenseBuild(state, getActionablePlayer(state, playerId), playerId, baseId, structureType, position)
}

export { moveCreatures }
export const createGameState = createWorldGameState
export const createDebugGameState = createWorldDebugGameState
export const createTestCampaignGameState = createWorldTestCampaignGameState
const initialGameState = createGameState()

let gameState = initialGameState
let lastGameSettings = getSavedGameSettings()
const listeners = new Set<() => void>()
/** 目前載入的劇本關卡 id（記錄通關進度用）；非劇本模式為 null。 */
let currentScenarioId: string | null = null

/**
 * 暫存的敵人行動結果（回合結束觸發探索事件時延後執行）。
 *
 * 為何需要它：
 * `endPlayerTurn` 一次完成兩件事——「回合結束隨機觸發探索事件」與「計算並執行敵人行動」。
 * 原本兩者同步進行，導致事件彈窗與敵人行動彈窗同時出現。
 * 為讓「事件彈窗（含結果）先出現、玩家確認後才執行敵人行動」，
 * 我們把敵人行動的執行延後到事件處理完之後。
 *
 * 為何用模組級變數而非 state 欄位：
 * 若把整個 CreatureTurnResult 存入 GameState，types.ts 就得 import
 * ./actions/creatureActions 的型別，但 creatureActions 又依賴 types，
 * 會造成循環依賴。用模組級變數（reactive store 外的純暫存）可避開這問題，
 * 且它只在「結束回合 → 事件處理完」的短暫窗口內存在，不需持久化或重渲染。
 *
 * 生命週期：endPlayerTurn 寫入 → 事件選擇（flushPendingCreatureTurn）或
 * 關閉（dismissPendingExplorationEvent）時讀取並清除。
 */
let pendingCreatureTurn: CreatureTurnResult | null = null
let pendingCreatureTurnBasePlayers: PlayerState[] | null = null

/** 全域行動日誌上限：只保留最新 N 筆，避免長局面資料無限成長（重構文件 §4.5）。 */
const MAX_ACTION_EVENTS = 200

function appendActionEvents(events: AiActionEvent[]): void {
  if (events.length === 0) return
  updateGameState((current) => ({
    ...current,
    actionEvents: [...(current.actionEvents ?? []), ...events].slice(-MAX_ACTION_EVENTS),
  }))
}

/**
 * 把一次 Player AI step 的決策與結果寫入全域行動日誌（重構文件 §4.5／§15 Phase 5）。
 * reason 優先取決策自帶理由；舊 attack 決策沒有理由欄位，退回執行結果的訊息。
 */
function recordAiStepEvent(
  round: number,
  playerId: string,
  playerName: string,
  action: AiAction,
  outcome: { ok: boolean; reason?: string },
): void {
  appendActionEvents([createAiActionEvent({
    round,
    actor: { id: playerId, kind: 'player', name: playerName },
    action,
    result: outcome.ok ? 'succeeded' : 'failed',
    reason: action.reason || outcome.reason,
  })])
}

/**
 * 切片 I：AI step 執行前的單一驗證關卡（重構文件 §9.2）。
 * 回傳 null 代表可執行；否則回傳拒絕原因（呼叫端負責記錄 failed 事件）。
 */
function validateAiStepAction(state: GameState, action: AiAction): string | null {
  const validation = validateAiAction(state, action)
  return validation.valid ? null : validation.reason
}

/** 更新建設計畫中單一 queue item 的狀態（重構文件 §14.6 狀態機）。 */
function updateConstructionPlanItem(
  aiPlayerId: string,
  itemIndex: number,
  patch: Partial<Pick<AiConstructionPlanItem, 'status' | 'blockedReason'>>,
): void {
  updateGameState((current) => ({
    ...current,
    aiConstructionPlans: (current.aiConstructionPlans ?? []).map((plan) => plan.aiPlayerId === aiPlayerId
      ? { ...plan, queue: plan.queue.map((item, index) => index === itemIndex ? { ...item, ...patch } : item) }
      : plan),
  }))
}

function updateGameState(updater: (state: GameState) => GameState) {
  let nextGameState = updater(gameState)

  if (nextGameState === gameState) {
    return
  }

  // 統一記錄人類玩家的最高等級與該等級五維快照（涵蓋所有升級來源）。
  nextGameState = recordHumanMaxLevel(nextGameState)

  // 統一顯示劇情對話：佇列非空且目前沒有阻塞彈窗時，自動顯示佇列首項。
  // 這讓任何掛鉤點（如擊殺 Boss 觸發 on-victory）填充佇列後，對話會立即彈出。
  const queue = nextGameState.campaignState?.dialogueQueue
  if (queue && queue.length > 0 && nextGameState.blockingModal === null) {
    nextGameState = {
      ...nextGameState,
      blockingModal: { type: 'story-dialogue', entry: queue[0], remaining: queue.length - 1 },
    }
  }

  gameState = nextGameState
  listeners.forEach((listener) => listener())
}

export function animateCreatureTurn(result: CreatureTurnResult) {
  animateCreatureTurnAction(result, updateGameState)
}

export const gameStore = {
  getState: () => gameState,

  allocateAttributePoint: (playerId: string, attribute: UpgradeableAttribute): boolean => {
    let allocated = false

    updateGameState((state) => {
      const player = state.players.find((candidate) => candidate.id === playerId)
      const points = player?.availableAttributePoints ?? 0
      if (!player || points <= 0) return state

      const baseAttributes = player.baseAttributes ?? player.attributes
      const attributes = { ...baseAttributes, [attribute]: Math.max(1, baseAttributes[attribute] + 1) }
      allocated = true
      return {
        ...state,
        players: state.players.map((candidate) => candidate.id === playerId
          ? restoreAfterAttributeChange({
            ...candidate,
            baseAttributes: attributes,
            availableAttributePoints: points - 1,
          }, getEffectiveAttributesForPlayer({ ...candidate, baseAttributes: attributes }))
          : candidate),
      }
    })

    return allocated
  },

  startGame: (settings: GameSettings) => {
    lastGameSettings = { ...settings }
    pendingCreatureTurn = null
    pendingCreatureTurnBasePlayers = null
    gameState = createGameState(lastGameSettings)
    listeners.forEach((listener) => listener())
  },

  /**
   * 啟動劇情章節：初始化 CampaignState 並觸發開局（on-start）對話。
   * chapterId 為 storyDialogueCatalog 的索引鍵。
   */
  startCampaignChapter: (chapterId: string, objectives: CampaignState['activeObjectives'] = [], failConditions: CampaignState['failConditions'] = {}) => {
    updateGameState((state) => {
      const campaignState: CampaignState = {
        currentChapter: Number(Object.keys(storyDialogueCatalog).indexOf(chapterId)) >= 0
          ? Object.keys(storyDialogueCatalog).indexOf(chapterId)
          : 0,
        triggeredDialogueIds: [],
        dialogueQueue: [],
        activeObjectives: objectives,
        failConditions,
      }
      const withCampaign: GameState = { ...state, campaignState }
      const steps = collectTriggeredDialogues(withCampaign, { type: 'on-start', chapterId })
      return enqueueDialogue(withCampaign, steps)
    })
  },

  /**
   * 推進對話佇列到下一句；佇列清空時關閉 blockingModal。
   * 若佇列非空且目前沒有 blockingModal，自動顯示下一句。
   */
  advanceDialogue: () => {
    let queueCleared = false
    updateGameState((state) => {
      const queue = state.campaignState?.dialogueQueue ?? []
      if (queue.length === 0) {
        // 佇列已空：確認是否正在顯示對話，是則關閉。
        const closing = state.blockingModal?.type === 'story-dialogue' ? { ...state, blockingModal: null } : state
        return closing
      }
      const entry = queue[0]
      const isBlockingDialogue = state.blockingModal?.type === 'story-dialogue'
      if (isBlockingDialogue) {
        // 已在顯示：消費目前這句，剩下交由下一句自動顯示。
        const remaining = queue.length - 1
        queueCleared = remaining === 0
        return {
          ...state,
          campaignState: {
            ...state.campaignState!,
            dialogueQueue: queue.slice(1),
            triggeredDialogueIds: state.campaignState!.triggeredDialogueIds.includes(entry.stepId)
              ? state.campaignState!.triggeredDialogueIds
              : [...state.campaignState!.triggeredDialogueIds, entry.stepId],
          },
          blockingModal: remaining > 0
            ? { type: 'story-dialogue', entry: queue[1], remaining }
            : null,
        }
      }
      // 未在顯示：顯示佇列首項。
      return { ...state, blockingModal: { type: 'story-dialogue', entry, remaining: queue.length - 1 } }
    })
    // 對話佇列已全部消費完畢：執行回合結束時暫存的敵人行動。
    if (queueCleared) {
      gameStore.flushPendingCreatureTurn()
    }
  },

  /** 跳過全部剩餘對話：清空佇列、標記已觸發、關閉對話彈窗。 */
  skipDialogue: () => {
    let hadQueue = false
    updateGameState((state) => {
      hadQueue = (state.campaignState?.dialogueQueue?.length ?? 0) > 0
      const next = skipAllDialogue(state)
      return next.blockingModal?.type === 'story-dialogue'
        ? { ...next, blockingModal: null }
        : next
    })
    // 跳過對話等同於消費完佇列：執行回合結束時暫存的敵人行動。
    if (hadQueue) {
      gameStore.flushPendingCreatureTurn()
    }
  },

  saveGame: (): ActionOutcome => {
    const result = saveGameState(gameState)
    return result.ok ? { ok: true } : { ok: false, reason: result.reason ?? '儲存失敗。' }
  },

  getSaveSlots: () => getGameSaveSlots(),

  saveGameToSlot: (slot: number): ActionOutcome => {
    const result = saveGameStateToSlot(gameState, slot)
    return result.ok ? { ok: true } : { ok: false, reason: result.reason ?? '儲存失敗。' }
  },

  loadGameFromSlot: (slot: number): ActionOutcome => {
    pendingCreatureTurn = null
    pendingCreatureTurnBasePlayers = null
    const result = loadGameStateFromSlot(slot)
    if (!result.ok) return result
    gameState = {
      ...result.state,
      aiOrders: result.state.aiOrders ?? [],
      aiConstructionPlans: result.state.aiConstructionPlans ?? [],
    }
    listeners.forEach((listener) => listener())
    return { ok: true }
  },

  deleteGameFromSlot: (slot: number): ActionOutcome => {
    deleteGameStateFromSlot(slot)
    return { ok: true }
  },

  loadGame: (): ActionOutcome => {
    const result = loadGameState()
    if (!result.ok) return result
    gameState = {
      ...result.state,
      aiOrders: result.state.aiOrders ?? [],
      aiConstructionPlans: result.state.aiConstructionPlans ?? [],
    }
    listeners.forEach((listener) => listener())
    return { ok: true }
  },

  setAiOrder: (order: AiOrder): ActionOutcome => {
    const aiPlayer = gameState.players.find((player) => player.id === order.aiPlayerId && player.isAI === true)
    if (!aiPlayer) return { ok: false, reason: '指定的玩家不是 AI 玩家。' }
    const existingOrder = gameState.aiOrders?.find((current) => current.id === order.id)
    if (existingOrder && existingOrder.aiPlayerId !== order.aiPlayerId) return { ok: false, reason: 'AI 命令不屬於指定的玩家。' }

    let saved = false
    updateGameState((state) => {
      const currentOrders = state.aiOrders ?? []
      const duplicate = currentOrders.some((current) =>
        current.id !== order.id &&
        current.aiPlayerId === order.aiPlayerId &&
        current.type === order.type &&
        (order.type === 'protect-base'
          ? current.type === 'protect-base' && current.baseId === order.baseId
          : order.type === 'support-player'
            ? current.type === 'support-player' && current.playerId === order.playerId
            : order.type === 'test1'),
      )
      if (duplicate) return state
      saved = true
      return {
        ...state,
        aiOrders: existingOrder
          ? currentOrders.map((current) => current.id === order.id ? order : current)
          : [
            ...currentOrders.map((current) => current.aiPlayerId === order.aiPlayerId && current.status === 'active'
              ? { ...current, status: 'paused' as const }
              : current),
            order,
          ],
      }
    })
    return saved
      ? { ok: true }
      : { ok: false, reason: '相同的 AI 命令已存在。' }
  },

  removeAiOrder: (aiPlayerId: string, orderId: string): ActionOutcome => {
    let removed = false
    updateGameState((state) => {
      const currentOrders = state.aiOrders ?? []
      const nextOrders = currentOrders.filter((order) => {
        const shouldRemove = order.id === orderId && order.aiPlayerId === aiPlayerId
        removed ||= shouldRemove
        return !shouldRemove
      })
      return removed ? { ...state, aiOrders: nextOrders } : state
    })
    return removed ? { ok: true } : { ok: false, reason: '找不到指定的 AI 命令。' }
  },

  setAiConstructionPlan: (plan: AiConstructionPlan): ActionOutcome => {
    const aiPlayer = gameState.players.find((player) => player.id === plan.aiPlayerId && player.isAI === true)
    if (!aiPlayer) return { ok: false, reason: '指定的玩家不是 AI 玩家。' }
    updateGameState((state) => ({
      ...state,
      aiConstructionPlans: [
        ...(state.aiConstructionPlans ?? []).filter((current) => current.aiPlayerId !== plan.aiPlayerId),
        plan,
      ],
    }))
    return { ok: true }
  },

  learnSkillAtMartialHall: (playerId: string, baseId: string, skillType: 'inner' | 'external', skillId: string): ActionOutcome => {
    return runActionOutcome(updateGameState, (state) => learnSkillAtMartialHallAction(state, playerId, baseId, skillType, skillId), '學習功法失敗。')
  },

  learnSectGateSkill: (playerId: string, gateId: string, skillId: string): ActionOutcome => {
    return runActionOutcome(updateGameState, (state) => learnSectGateSkillAction(state, playerId, gateId, skillId), '學習功法失敗。')
  },

  practiceSectGateSkill: (playerId: string, gateId: string, skillId: string): ActionOutcome => {
    return runActionOutcome(updateGameState, (state) => practiceSectGateSkillAction(state, playerId, gateId, skillId), '練習功法失敗。')
  },

  loadDebugMap: () => {
    gameState = createDebugGameState()
    listeners.forEach((listener) => listener())
  },

  /** 載入測試用劇情模式（Debug 地圖 + 序章對話）。 */
  startTestCampaign: () => {
    pendingCreatureTurn = null
    pendingCreatureTurnBasePlayers = null
    gameState = createTestCampaignGameState()
    // 觸發開局（on-start）對話：收集符合的步驟並填入佇列（updateGameState 會自動顯示）。
    updateGameState((state) => {
      const steps = collectTriggeredDialogues(state, { type: 'on-start' })
      return enqueueDialogue(state, steps)
    })
    listeners.forEach((listener) => listener())
  },

  /**
   * 載入一個 ScenarioDefinition 為運行中的 GameState。
   *
   * 供編輯器「一鍵試玩」與主選單「劇情模式」共用：
   * 1. validateScenario 檢查關卡合法性
   * 2. buildGameStateFromScenario 編譯為 GameState
   * 3. 觸發開局（on-start）對話
   *
   * 回傳 ActionOutcome：ok 表示載入成功，否則回傳驗證失敗原因。
   */
  loadScenario: (scenario: ScenarioDefinition): ActionOutcome => {
    const validation = validateScenario(scenario)
    if (!validation.valid) {
      const errorMessages = validation.issues
        .filter((issue) => issue.severity === 'error')
        .map((issue) => issue.message)
      return { ok: false, reason: errorMessages.join('；') || '關卡驗證失敗。' }
    }
    pendingCreatureTurn = null
    pendingCreatureTurnBasePlayers = null
    gameState = buildGameStateFromScenario(scenario)
    currentScenarioId = scenario.id
    // 觸發開局（on-start）對話與觸發器。
    updateGameState((state) => {
      const steps = collectTriggeredDialogues(state, { type: 'on-start' })
      const withDialogue = enqueueDialogue(state, steps)
      return executeTriggers(withDialogue, { type: 'on-start' })
    })
    listeners.forEach((listener) => listener())
    return { ok: true }
  },

  restartGame: () => {
    pendingCreatureTurn = null
    pendingCreatureTurnBasePlayers = null
    currentScenarioId = null
    gameState = createGameState(lastGameSettings)
    listeners.forEach((listener) => listener())
  },

  /** 記錄目前劇本的通關狀態（true = 闖關成功；false = 失敗）。 */
  recordCurrentScenarioClearance: (cleared: boolean) => {
    if (currentScenarioId) recordScenarioClearance(currentScenarioId, cleared)
  },

  showActionResult: (
    result: ActionResult,
    continuation: ActionContinuation = { type: 'none' },
  ) => {
    updateGameState((state) => ({
      ...state,
      blockingModal: { type: 'action-result', result, continuation },
      // 三重共振震動動畫在彈窗出現後清除，讓 ghost icon 在 0.5s 動畫結束後消失。
      creatureShake: null,
      operation: { type: 'idle' },
    }))
  },

  /** 觸發三重共振震動動畫：指定被命中生物的位置與 icon，該位置播放 shake 動畫（訊號疊加），不開啟結果彈窗。 */
  triggerCreatureShake: (targetId: string, position: Position, icon: string) => {
    updateGameState((state) => ({
      ...state,
      creatureShake: { signal: (state.creatureShake?.signal ?? 0) + 1, targetId, position, icon },
    }))
  },

  previewRepair: (playerId: string, baseId: string): RepairPreview | null => {
    let preview: RepairPreview | null = null

    updateGameState((state) => {
      const player = getActionablePlayer(state, playerId)
      preview = createRepairPreview(state, player, baseId)
      if (!preview) return state
      return { ...state, repairPreview: preview, operation: { type: 'idle' } }
    })

    return preview
  },

  executeRepair: (): ActionExecutionResult<RepairPreview> => {
    const preview = gameState.repairPreview
    if (!preview) return { ok: false, reason: '沒有待確認的修理預覽。' }
    let result: ActionExecutionResult<RepairPreview> = { ok: false, reason: '修理失敗。' }

    updateGameState((state) => {
      const player = state.players.find((candidate) => candidate.id === preview.playerId)
      const base = state.bases.find((candidate) => candidate.id === preview.baseId)
      if (
        !player ||
        !base ||
        !canExecuteRepair(state, preview)
      ) {
        result = { ok: false, reason: '玩家、工坊或位置條件不符合修理要求。' }
        return { ...state, repairPreview: null }
      }

      const repairSummary = getRepairSummary(player, getWorkshopLevel(base))
      result = { ok: true, data: { ...preview, ...repairSummary } }
      return {
        ...state,
        repairPreview: null,
        players: state.players.map((candidate) => candidate.id === player.id
          ? {
            ...candidate,
            // 修理不再消耗金錢，只消耗修理行動所需的體力。
            stamina: Math.max(0, candidate.stamina - ACTION_STAMINA_COSTS.repair),
            // 只修復工坊等級可處理的裝備；等級不足的裝備保留原樣
            equipmentInventory: repairEquipmentInventory(getEquipmentInventory(candidate), getWorkshopLevel(base)),
            turnEnded: candidate.turnEnded,
          }
          : candidate),
          }
    })

    return result
  },

  clearRepairPreview: () => {
    updateGameState((state) => ({ ...state, repairPreview: null }))
  },

  /**
   * 關閉目前的阻塞式結果彈窗（blockingModal），並依 continuation 執行後續動作。
   *
   * flush-creature-turn continuation：
   * 探索事件結果彈窗關閉後觸發。這串起整個「事件先、敵人行動後」的流程——
   * 事件結果彈窗（blockingModal）顯示時，暫存的敵人行動還未執行；
   * 玩家點擊「知道了」關閉此彈窗後，才在這裡呼叫 flushPendingCreatureTurn()
   * 執行敵人行動。確保彈窗順序是「事件結果 → 敵人行動」而非同時出現。
   */
  confirmBlockingModal: () => {
    const continuation = gameState.blockingModal?.type === 'action-result'
      ? gameState.blockingModal.continuation
      : null

    updateGameState((state) => ({ ...state, blockingModal: null }))

    if (continuation?.type === 'end-player-turn') {
      gameStore.endPlayerTurn(continuation.playerId)
    }
    if (continuation?.type === 'flush-creature-turn') {
      gameStore.flushPendingCreatureTurn()
    }
  },

  setOperation: (operation: GameOperation) => {
    updateGameState((state) => ({ ...state, operation }))
  },

  beginExternalSkillTargeting: (skillId: string) => {
    const skill = getExternalSkill(skillId)
    if (skill.target === 'self') {
      updateGameState((state) => {
        const preview = createExternalSkillPreview(state, getActionablePlayer(state, state.activePlayerId), 'creature', state.creatures[0]?.id ?? '', skillId)
        return preview ? { ...state, operation: { type: 'previewing-external-skill' }, externalSkillPreview: preview } : state
      })
      return
    }
    updateGameState((state) => ({ ...state, operation: { type: 'targeting-external-skill', skillId } }))
  },

  beginAttackTargeting: () => {
    updateGameState((state) => ({
      ...state,
      operation: { type: 'targeting-attack' },
    }))
  },

  subscribe: (listener: () => void) => {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },

  equipInnerSkill: (playerId: string, skillId: string) => {
    updateGameState((state) => {
      const player = getActionablePlayer(state, playerId)

      if (
        !player ||
        player.innerSkillId === skillId ||
        !player.innerSkillIds.includes(skillId) ||
        !allInnerSkillCatalog.some(
          (skill) => skill.id === skillId && getEffectiveAttributesForPlayer(player).insight >= skill.insightRequirement,
        )
      ) {
        return state
      }

      const effectiveAttributes = getEffectiveAttributesForPlayer(player)
      const maxInnerPower = getMaxInnerPower(effectiveAttributes)
      const innerPowerCost = Math.max(1, Math.floor(maxInnerPower * 0.01))

      return applyBaseHealthBonuses({
        ...state,
        players: state.players.map((currentPlayer) =>
          currentPlayer.id === playerId
            ? applyEquipmentLoadout(
              { ...currentPlayer, innerSkillId: skillId, innerPower: Math.max(0, currentPlayer.innerPower - innerPowerCost) },
              getEquipmentLoadout(currentPlayer),
            )
            : currentPlayer,
          ),
      })
    })
  },

  toggleExternalSkill: (playerId: string, skillId: string) => {
    updateGameState((state) => {
      const player = getActionablePlayer(state, playerId)
      const skill = getExternalSkill(skillId)

      if (!player || !skill || !player.externalSkillIds.includes(skillId)) {
        return state
      }

      const isEquipped = player.equippedExternalSkillIds.includes(skillId)
      const usedCapacity = getPlayerTotalInsightCost(player) - (isEquipped ? skill.insightCost : 0)

      if (!isEquipped && usedCapacity + skill.insightCost > getEffectiveAttributesForPlayer(player).insight) {
        return state
      }

      const maxInnerPower = getMaxInnerPower(getEffectiveAttributesForPlayer(player))
      const innerPowerCost = Math.max(1, Math.floor(maxInnerPower * 0.01))

      return applyBaseHealthBonuses({
        ...state,
        players: state.players.map((currentPlayer) =>
          currentPlayer.id === playerId
            ? {
              ...currentPlayer,
              equippedExternalSkillIds: isEquipped
                ? currentPlayer.equippedExternalSkillIds.filter((id) => id !== skillId)
                : [...currentPlayer.equippedExternalSkillIds, skillId],
              // 開啟外功消耗 1% 內力；關閉不消耗
              innerPower: isEquipped
                ? currentPlayer.innerPower
                : Math.max(0, currentPlayer.innerPower - innerPowerCost),
            }
            : currentPlayer,
        ),
      })
    })
  },

  equipEquipment: (playerId: string, instanceId: string): ActionOutcome => {
    let result: ActionOutcome = { ok: false, reason: '無法裝備此物品。' }

    updateGameState((state) => {
      const player = getActionablePlayer(state, playerId)
      const instance = player
        ? getEquipmentInventory(player).find((candidate) => candidate.instanceId === instanceId)
        : undefined
      const equipment = instance ? getEquipment(instance.equipmentId) : undefined

      if (!player || !instance || !equipment || instance.durability <= 0) {
        result = { ok: false, reason: '裝備不存在、已損壞，或玩家目前無法行動。' }
        return state
      }

      const currentLoadout = getEquipmentLoadout(player)
      const nextLoadout: EquipmentLoadout = {
        ...currentLoadout,
        [`${equipment.slot}InstanceId`]: instance.instanceId,
      }
      result = { ok: true }

      return applyBaseHealthBonuses({
        ...state,
        players: state.players.map((currentPlayer) =>
          currentPlayer.id === playerId
            ? applyEquipmentLoadout(
              currentPlayer.equipmentInventory?.some((candidate) => candidate.instanceId === instance.instanceId)
                ? currentPlayer
                : { ...currentPlayer, equipmentInventory: [...getEquipmentInventory(currentPlayer), instance] },
              nextLoadout,
            )
            : currentPlayer,
        ),
      })
    })

    return result
  },

  unequipEquipment: (playerId: string, slot: EquipmentSlot): ActionOutcome => {
    let result: ActionOutcome = { ok: false, reason: '目前無法卸下裝備。' }

    updateGameState((state) => {
      const player = getActionablePlayer(state, playerId)

      if (!player) {
        result = { ok: false, reason: '目前無法行動。' }
        return state
      }

      const currentLoadout = getEquipmentLoadout(player)
      const equipmentId = currentLoadout[`${slot}InstanceId`]

      if (!equipmentId) {
        result = { ok: false, reason: '該部位目前沒有裝備。' }
        return state
      }

      result = { ok: true }
      return applyBaseHealthBonuses({
        ...state,
        players: state.players.map((currentPlayer) =>
          currentPlayer.id === playerId
            ? applyEquipmentLoadout(currentPlayer, { ...currentLoadout, [`${slot}InstanceId`]: null })
            : currentPlayer,
        ),
      })
    })

    return result
  },

  executeExternalDamage: (playerId: string, creatureId: string, skillId: string): ActionExecutionResult<ExternalDamageExecutionResult> => {
    return gameStore.executeExternalDamageTarget(playerId, 'creature', creatureId, skillId)
  },

  executeExternalDamageTarget: (playerId: string, targetType: AttackTargetType, targetId: string, skillId: string): ActionExecutionResult<ExternalDamageExecutionResult> => {
    const action = executeExternalDamageAction(gameState, playerId, targetType, targetId, skillId, {
      getActionablePlayer,
      createLootForPlayer,
      getLearnableSkill,
      applyExperienceAndLevelUp,
      addLootToPlayer,
    })
    updateGameState(() => action.state)
    return action.result
  },

  previewExternalDamage: (playerId: string, creatureId: string, skillId: string) => {
    return gameStore.previewExternalDamageTarget(playerId, 'creature', creatureId, skillId)
  },

  previewExternalDamageTarget: (playerId: string, targetType: AttackTargetType, targetId: string, skillId: string) => {
    updateGameState((state) => {
      const preview = createExternalSkillPreview(
        state,
        getActionablePlayer(state, playerId),
        targetType,
        targetId,
        skillId,
      )
      if (!preview) {
        return state
      }

      return {
        ...state,
        operation: { type: 'previewing-external-skill' },
        externalSkillPreview: preview,
      }
    })
  },

  clearExternalSkillPreview: () => {
    updateGameState((state) => ({ ...state, externalSkillPreview: null, operation: { type: 'idle' } }))
  },

  executeExternalDamagePreview: (): ActionExecutionResult<ExternalDamageExecutionResult> => {
    const preview = gameState.externalSkillPreview

    if (!preview) {
      return { ok: false, reason: '沒有待確認的外功預覽。' }
    }

    const result = gameStore.executeExternalDamageTarget(
      preview.playerId,
      preview.targetType,
      preview.targetId,
      preview.skillId,
    )
    updateGameState((state) => ({ ...state, externalSkillPreview: null, operation: { type: 'idle' } }))
    return result
  },

  collectItemPoint: (playerId: string, itemPointId: string): ActionExecutionResult<LootResult[]> => {
    return runActionExecution(updateGameState, (state) => collectItemPointAction(state, playerId, itemPointId), '撿取失敗。')
  },

  useItem: (playerId: string, itemId: string): ActionOutcome => {
    let result: ActionOutcome = { ok: false, reason: '無法使用此道具。' }

    updateGameState((state) => {
      const player = getActionablePlayer(state, playerId)
      const item = itemCatalog.find((currentItem) => currentItem.id === itemId)
      const inventoryEntry = player?.inventory.find((entry) => entry.itemId === itemId)

      if (
        !player ||
        !item ||
        !inventoryEntry ||
        inventoryEntry.quantity <= 0 ||
        state.activePlayerId !== playerId ||
        player.turnEnded
      ) {
        result = { ok: false, reason: '道具不存在、數量不足，或目前無法行動。' }
        return state
      }

      if (player.itemEffectsUsedThisTurn?.includes(item.effect)) {
        result = { ok: false, reason: '本回合已使用過此類道具。' }
        return state
      }

      // 消耗道具的通用輔助：扣除庫存數量。
      const consumeItem = (currentPlayer: PlayerState): PlayerState => ({
        ...currentPlayer,
        health: Math.max(0, currentPlayer.health - (item.cost?.health ?? 0)),
        stamina: currentPlayer.stamina - (item.cost?.stamina ?? 0),
        innerPower: currentPlayer.innerPower - (item.cost?.innerPower ?? 0),
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
          result = { ok: false, reason: '此道具未指定提升屬性。' }
          return state
        }
        result = { ok: true }
        return {
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
        }
      }

      // ===== 陷阱類（trap）：在當前格放置陷阱 =====
      if (item.effect === 'trap') {
        if (!item.trapType) {
          result = { ok: false, reason: '此陷阱未指定種類。' }
          return state
        }
        const existingTrap = (state.traps ?? []).find((trap) =>
          isSamePosition(trap.position, player.position),
        )
        if (existingTrap) {
          result = { ok: false, reason: '當前格已有陷阱。' }
          return state
        }
        result = { ok: true }
        const trap: TrapState = {
          id: `trap:${itemId}:${Date.now()}`,
          position: player.position,
          type: item.trapType,
          ownerPlayerId: playerId,
          // 絆馬索傷害由道具 effectValue 定義；定身索無傷害。
          damage: item.trapType === 'snare' ? (item.effectValue ?? 15) : undefined,
        }
        return {
          ...state,
          traps: [...(state.traps ?? []), trap],
          players: state.players.map((currentPlayer) =>
            currentPlayer.id === playerId
              ? { ...consumeItem(currentPlayer), itemEffectsUsedThisTurn: [...(currentPlayer.itemEffectsUsedThisTurn ?? []), 'trap'] }
              : currentPlayer,
          ),
        }
      }

      // ===== 探地符（scout）：揭示半徑 effectValue 格，寫入 exploredCellIds，並暫時揭示範圍內怪物 =====
      if (item.effect === 'scout') {
        const scoutRange = item.effectValue ?? 6
        const scoutCellIds = getScoutCellIds(state.map, player.position, scoutRange)
        const visibility = state.visibility ?? { exploredCellIds: [], mode: 'fog' as const }
        // 範圍內活著怪物的所在格，暫時揭示（同鳴鑼符機制），使怪物可被看見。
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
        result = { ok: true }
        return {
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
        result = { ok: true }
        return {
          ...state,
          revealedCreatureCellIds: revealedCellIds,
          revealedCreatureUntilRound: state.round + 1,
          players: state.players.map((currentPlayer) =>
            currentPlayer.id === playerId
              ? { ...consumeItem(currentPlayer), itemEffectsUsedThisTurn: [...(currentPlayer.itemEffectsUsedThisTurn ?? []), 'reveal-creatures'] }
              : currentPlayer,
          ),
        }
      }

      // ===== 回營符（recall-base）：撤退到最近據點，不耗體力 =====
      if (item.effect === 'recall-base') {
        const activeBases = state.bases.filter((base) => base.active !== false)
        if (activeBases.length === 0) {
          result = { ok: false, reason: '目前沒有可用的據點。' }
          return state
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
          const occupied = [
            ...state.players.filter((candidate) => candidate.id !== playerId).map((candidate) => candidate.position),
            ...state.creatures.map((creature) => creature.position),
            // 目標據點本身不視為佔用，玩家可站上據點格。
            ...state.bases.filter((base) => base.id !== nearestBase.id).map((base) => base.position),
            ...state.creatureNests.map((nest) => nest.position),
            ...(state.defenseStructures ?? []).map((structure) => structure.position),
          ]
          return !occupied.some((occupiedPosition) => isSamePosition(occupiedPosition, position))
        }
        // 回營傳送應抵達據點周遭一格（仿驛站/小型驛站的降落邏輯），
        // 不應直接站上據點格。僅當據點周遭完全沒有空格時才退回站上據點格。
        const targetPosition =
          getAdjacentPositions(nearestBase.position).find((position) => isPositionFree(position))
          ?? (isPositionFree(nearestBase.position) ? nearestBase.position : undefined)
        if (!targetPosition) {
          result = { ok: false, reason: '最近據點周圍沒有可落腳的空格。' }
          return state
        }
        result = { ok: true }
        return {
          ...state,
          players: state.players.map((currentPlayer) =>
            currentPlayer.id === playerId
              ? { ...consumeItem(currentPlayer), position: targetPosition, itemEffectsUsedThisTurn: [...(currentPlayer.itemEffectsUsedThisTurn ?? []), 'recall-base'] }
              : currentPlayer,
          ),
          visibility: updatePlayerVisibility({ ...state, players: state.players.map((currentPlayer) =>
            currentPlayer.id === playerId ? { ...currentPlayer, position: targetPosition } : currentPlayer,
          ) }, playerId),
        }
      }

      // ===== 元素爆發類（element-burst）：需選格，傷害套用五行相剋 =====
      if (item.effect === 'element-burst') {
        // 元素爆發需先進入選格模式，由 MapGrid 點擊目標後再執行。
        result = { ok: true }
        return {
          ...state,
          operation: { type: 'targeting-item', itemId },
        }
      }

      const nextValue = item.effect === 'health'
        ? Math.min(player.maxHealth, player.health + (item.effectValue ?? 0))
        : item.effect === 'stamina'
          ? Math.min(player.maxStamina, player.stamina + (item.effectValue ?? 0))
          : item.effect === 'inner-power'
            ? Math.min(player.maxInnerPower, player.innerPower + (item.effectValue ?? 0))
            : player.health

      if (item.effect === 'buff') {
        // Buff 型道具：附加臨時 Buff，不需要檢查恢復上限。
        if (!item.buffDefinitionId) {
          result = { ok: false, reason: '此 Buff 定義不存在。' }
          return state
        }
        result = { ok: true }
        const buffInstance: BuffInstance = {
          id: `item:${itemId}:${Date.now()}`,
          definitionId: item.buffDefinitionId,
          sourceId: itemId,
          remainingRounds: getBuff(item.buffDefinitionId)?.duration === 'rounds'
            ? getBuff(item.buffDefinitionId)?.durationRounds ?? null
            : null,
        }
        return {
          ...state,
          players: state.players.map((currentPlayer) =>
            currentPlayer.id === playerId
              ? {
                ...currentPlayer,
                buffs: [...(currentPlayer.buffs ?? []), buffInstance],
                maxHealth: getMaxHealth(getEffectiveAttributesForPlayer({ ...currentPlayer, buffs: [...(currentPlayer.buffs ?? []), buffInstance] })),
                maxStamina: getMaxStamina(getEffectiveAttributesForPlayer({ ...currentPlayer, buffs: [...(currentPlayer.buffs ?? []), buffInstance] })),
                maxInnerPower: getMaxInnerPower(getEffectiveAttributesForPlayer({ ...currentPlayer, buffs: [...(currentPlayer.buffs ?? []), buffInstance] })),
                inventory: currentPlayer.inventory
                  .map((entry) =>
                    entry.itemId === itemId
                      ? { ...entry, quantity: entry.quantity - 1 }
                      : entry,
                  )
                  .filter((entry) => entry.quantity > 0),
                itemEffectsUsedThisTurn: item.effect === 'buff'
                  ? [...(currentPlayer.itemEffectsUsedThisTurn ?? []), item.effect]
                  : currentPlayer.itemEffectsUsedThisTurn,
                turnEnded: currentPlayer.turnEnded,
              }
              : currentPlayer,
          ),
        }
      }

      const fullValue = item.effect === 'health'
        ? player.health
        : item.effect === 'stamina'
          ? player.stamina
          : item.effect === 'inner-power'
            ? player.innerPower
            : player.health

      if (nextValue === fullValue) {
        result = { ok: false, reason: '目前已達該道具效果的恢復上限。' }
        return state
      }

      result = { ok: true }

      const nextPlayerResource = {
        health: item.effect === 'health' ? nextValue : Math.max(0, player.health - (item.cost?.health ?? 0)),
        stamina: item.effect === 'stamina' ? nextValue : player.stamina - (item.cost?.stamina ?? 0),
        innerPower: item.effect === 'inner-power' ? nextValue : player.innerPower - (item.cost?.innerPower ?? 0),
      }

      return {
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
      }
    })

    // 使用道具不算一個回合
    // gameStore.autoEndPlayerTurn(playerId)

    return result
  },

  buyItem: (playerId: string, itemId: string, quantity: number): ActionOutcome => {
    return runActionOutcome(updateGameState, (state) => buyItemAction(state, playerId, itemId, quantity), '購買道具失敗。')
  },

  sellItem: (playerId: string, itemId: string, quantity: number): ActionOutcome => {
    return runActionOutcome(updateGameState, (state) => sellItemAction(state, playerId, itemId, quantity), '出售道具失敗。')
  },

  sellEquipment: (playerId: string, instanceId: string): ActionOutcome => {
    return runActionOutcome(updateGameState, (state) => sellEquipmentAction(state, playerId, instanceId), '出售裝備失敗。')
  },

  buyEquipment: (playerId: string, equipmentId: string): ActionOutcome => {
    return runActionOutcome(updateGameState, (state) => buyEquipmentAction(state, playerId, equipmentId), '購買裝備失敗。')
  },

  buySectEquipment: (playerId: string, gateId: string, equipmentId: string): ActionOutcome => {
    return runActionOutcome(updateGameState, (state) => buySectEquipmentAction(state, playerId, gateId, equipmentId), '購買門派裝備失敗。')
  },

  constructBuilding: (baseId: string, buildingId: string, playerId?: string): ActionOutcome => {
    let result: ActionOutcome = { ok: false, reason: '建造建築失敗。' }
    updateGameState((state) => {
      const action = constructBuildingAction(state, baseId, buildingId, playerId)
      result = action.result
      if (!action.result.ok || !playerId) return action.state
      return {
        ...action.state,
        players: action.state.players.map((currentPlayer) => currentPlayer.id === playerId
          ? applyConstructionPrestige(currentPlayer, 'build')
          : currentPlayer),
      }
    })
    return result
  },

  upgradeBuilding: (playerId: string, baseId: string, buildingId: string): ActionOutcome => {
    let result: ActionOutcome = { ok: false, reason: '升級建築失敗。' }
    updateGameState((state) => {
      const action = upgradeBuildingAction(state, playerId, baseId, buildingId)
      result = action.result
      if (!action.result.ok) return action.state
      return {
        ...action.state,
        players: action.state.players.map((currentPlayer) => currentPlayer.id === playerId
          ? applyConstructionPrestige(currentPlayer, 'upgrade')
          : currentPlayer),
      }
    })
    return result
  },

  switchBasePolicy: (playerId: string, baseId: string, policyId: GovernancePolicyId): ActionOutcome => {
    return runActionOutcome(updateGameState, (state) => switchBasePolicyAction(state, playerId, baseId, policyId), '切換政策失敗。')
  },

  constructDefenseStructure: (
    playerId: string,
    baseId: string,
    structureType: DefenseStructureType,
    position: Position,
  ): ActionOutcome => {
    let result: ActionOutcome = { ok: false, reason: '建造防禦設施失敗。' }
    updateGameState((state) => {
      const action = constructDefenseStructureAction(state, playerId, baseId, structureType, position)
      result = action.result
      if (!action.result.ok) return action.state
      return {
        ...action.state,
        players: action.state.players.map((currentPlayer) => currentPlayer.id === playerId
          ? applyConstructionPrestige(currentPlayer, 'build')
          : currentPlayer),
      }
    })
    return result
  },

  reconstructRuin: (playerId: string, ruinId: string, structureType: DefenseStructureType): ActionOutcome => {
    return runActionOutcome(updateGameState, (state) => reconstructRuinAction(state, playerId, ruinId, structureType), '修復廢墟失敗。')
  },

  clearRuin: (playerId: string, ruinId: string): ActionOutcome => {
    return runActionOutcome(updateGameState, (state) => clearRuinAction(state, playerId, ruinId), '清除廢墟失敗。')
  },

  executeMission: (playerId: string, baseId: string): ActionOutcome => {
    return runActionOutcome(updateGameState, (state) => executeMissionAction(state, playerId, baseId), '任務執行失敗。')
  },

  executeMissionBatch: (playerId: string, baseId: string): ActionExecutionResult<MissionBatchResult> => {
    return runActionExecution(updateGameState, (state) => executeMissionBatchAction(state, playerId, baseId), '批次任務執行失敗。')
  },

  useInfirmary: (playerId: string, baseId: string): ActionExecutionResult<InfirmaryResult> => {
    return runActionExecution(updateGameState, (state) => infirmaryAction(state, playerId, baseId), '就醫失敗。')
  },

  collectResourcePoint: (playerId: string, resourcePointId: string): ActionOutcome => {
    return runActionOutcome(updateGameState, (state) => collectResourcePointAction(state, playerId, resourcePointId), '採集失敗。')
  },

  repairResourcePoint: (playerId: string, resourcePointId: string): ActionOutcome => {
    return runActionOutcome(updateGameState, (state) => {
      const player = getActionablePlayer(state, playerId)
      const resourcePoint = state.resourcePoints.find((point) => point.id === resourcePointId)
      if (!player || !resourcePoint) return { state, result: { ok: false, reason: '玩家或資源點不存在。' } }
      if (resourcePoint.active !== false) return { state, result: { ok: false, reason: '資源點目前不需要修復。' } }
      const actionCheck = canPlayerPerformAction(state, playerId, ACTION_STAMINA_COSTS.resourcePointBuild)
      if (!actionCheck.ok) return { state, result: { ok: false, reason: actionCheck.reason ?? '體力不足。' } }
      if (!isAdjacent(player.position, resourcePoint.position)) return { state, result: { ok: false, reason: '玩家必須位於資源點旁。' } }
      return {
        state: {
          ...state,
          resourcePoints: state.resourcePoints.map((point) => point.id === resourcePointId
            ? { ...point, health: point.maxHealth, active: true }
            : point),
          players: state.players.map((candidate) => candidate.id === playerId
            ? spendPlayerStamina(candidate, ACTION_STAMINA_COSTS.resourcePointBuild)
            : candidate),
        },
        result: { ok: true },
      }
    }, '修復資源點失敗。')
  },

  collectResourcePointBatch: (playerId: string, resourcePointId: string): ActionExecutionResult<CollectionBatchResult> => {
    return runActionExecution(updateGameState, (state) => collectResourcePointBatchAction(state, playerId, resourcePointId), '批次採集失敗。')
  },

  resolveExplorationEvent: (playerId: string, eventId: string, choiceId: ExplorationEventChoice['id']): ActionOutcome => {
    return runActionOutcome(updateGameState, (state) => resolveExplorationEventAction(state, playerId, eventId, choiceId), '探索事件處理失敗。')
  },

  /** 回合結束隨機觸發的探索事件（不佔地圖格）的回應處理。 */
  resolvePendingExplorationEvent: (playerId: string, eventId: string, choiceId: ExplorationEventChoice['id']): ActionOutcome => {
    return runActionOutcome(updateGameState, (state) => resolvePendingExplorationEventAction(state, playerId, eventId, choiceId), '待處理探索事件處理失敗。')
  },

  /**
   * 關閉並清除回合結束隨機觸發的探索事件（不套用任何效果）。
   * 此為「玩家直接關閉事件彈窗、不選擇任何選項」的路徑；
   * 因為沒有事件結果彈窗，所以立即執行暫存的敵人行動。
   */
  dismissPendingExplorationEvent: () => {
    updateGameState((state) => ({
      ...state,
      pendingExplorationEvent: null,
      pendingExplorationEventPlayerId: null,
    }))
    gameStore.flushPendingCreatureTurn()
  },

  /**
   * 執行回合結束時因觸發探索事件而暫存的敵人行動。
   *
   * 為何要覆寫 players：
   * `scheduledCreatureTurn.players` 是在「事件套用前」的舊快照（來自 endPlayerTurn）。
   * 探索事件可能已對玩家施放金錢/物品/聲望/功法等效果，若直接用舊快照執行
   * animateCreatureTurn，這些事件獎勵會被舊玩家狀態覆寫而遺失。
   * 因此這裡以「目前 gameState.players（含事件效果）」取代舊快照的玩家，
   * 讓敵人行動在正確的玩家狀態上結算。
   *
   * 呼叫時機：
   * 1. dismissPendingExplorationEvent（關閉事件，無結果彈窗）→ 立即執行
   * 2. confirmBlockingModal 的 flush-creature-turn continuation（事件結果彈窗關閉後）→ 執行
   */
  flushPendingCreatureTurn: () => {
    const scheduled = pendingCreatureTurn
    if (!scheduled) return
    pendingCreatureTurn = null
    const basePlayers = pendingCreatureTurnBasePlayers ?? gameState.players
    pendingCreatureTurnBasePlayers = null
    // 保留事件對玩家的效果，同時合併敵人行動快照中實際造成的血量與耐久度變化。
    const currentPlayers = gameState.players.map((currentPlayer) => {
      const beforeTurn = basePlayers.find((player) => player.id === currentPlayer.id)
      const afterCreatureTurn = scheduled.players.find((player) => player.id === currentPlayer.id)
      if (!beforeTurn || !afterCreatureTurn) return currentPlayer
      const healthDamage = Math.max(0, beforeTurn.health - afterCreatureTurn.health)
      return {
        ...currentPlayer,
        health: Math.max(0, currentPlayer.health - healthDamage),
        equipmentInventory: afterCreatureTurn.equipmentInventory,
      }
    })
    animateCreatureTurn({ ...scheduled, players: currentPlayers })
    if (!gameState.gameOver) saveGameStateToSlot(gameState, AUTO_SAVE_SLOT)
  },

  movePlayer: (playerId: string, rowDelta: number, columnDelta: number) => {
    updateGameState((state) => {
      const player = state.players.find((candidate) => candidate.id === playerId)
      if (!player) return state
      const action = movePlayerAction(state, playerId, player.position.row + rowDelta, player.position.column + columnDelta)
      return action.result.ok ? action.state : state
    })
    // 這裏先不自動判斷
    // gameStore.autoEndPlayerTurn(playerId)
  },

  movePlayerTo: (playerId: string, row: number, column: number) => {
    let result: ActionOutcome = { ok: false, reason: '無法移動至目標位置。' }
    updateGameState((state) => {
      const action = movePlayerAction(state, playerId, row, column)
      result = action.result
      return action.result.ok ? action.state : state
    })

    // 這裏先不自動判斷
    // gameStore.autoEndPlayerTurn(playerId)
    return result
  },

  transportPlayer: (playerId: string, targetId: string): ActionOutcome => {
    let result: ActionOutcome = { ok: false, reason: '傳送失敗。' }

    updateGameState((state) => {
      const validation = canTransportPlayer(state, playerId, targetId)
      if (!validation.ok) {
        result = { ok: false, reason: validation.reason ?? '傳送失敗。' }
        return state
      }

      const target = resolveTransportTarget(state, targetId)
      if (!target) {
        result = { ok: false, reason: '目標不存在。' }
        return state
      }

      const landingPosition = getTransportLandingPosition(state, target, playerId)
      if (!landingPosition) {
        result = { ok: false, reason: '目標周遭沒有可供降落的空地。' }
        return state
      }

      result = { ok: true }
      const cost = validation.cost ?? WAYSTATION_TRANSPORT_COST

      const nextState = {
        ...state,
        players: state.players.map((currentPlayer) =>
          currentPlayer.id === playerId
            ? {
              ...currentPlayer,
              position: landingPosition,
              money: currentPlayer.money - cost,
            }
            : currentPlayer,
        ),
      }

      return { ...nextState, visibility: updatePlayerVisibility(nextState, playerId) }
    })

    return result
  },

  depositToSharedWarehouse: (playerId: string, itemId: string, quantity: number): ActionOutcome => {
    return runActionOutcome(updateGameState, (state) => depositItemAction(state, playerId, itemId, quantity), '存入道具失敗。')
  },

  withdrawFromSharedWarehouse: (playerId: string, itemId: string, quantity: number): ActionOutcome => {
    return runActionOutcome(updateGameState, (state) => withdrawItemAction(state, playerId, itemId, quantity), '取出道具失敗。')
  },

  depositEquipmentToSharedWarehouse: (playerId: string, instanceId: string): ActionOutcome => {
    return runActionOutcome(updateGameState, (state) => depositEquipmentAction(state, playerId, instanceId), '存入裝備失敗。')
  },

  withdrawEquipmentFromSharedWarehouse: (playerId: string, instanceId: string): ActionOutcome => {
    return runActionOutcome(updateGameState, (state) => withdrawEquipmentAction(state, playerId, instanceId), '取出裝備失敗。')
  },

  switchRemoteBasePolicy: (playerId: string, targetBaseId: string, policyId: GovernancePolicyId): ActionOutcome => {
    return runActionOutcome(updateGameState, (state) => switchRemoteBasePolicyAction(state, playerId, targetBaseId, policyId), '遠端政策切換失敗。')
  },

  transferBaseMaterials: (
    playerId: string,
    sourceBaseId: string,
    targetBaseId: string,
    amount: number,
  ): ActionExecutionResult<MaterialTransferResult> => {
    return runActionExecution(
      updateGameState,
      (state) => transferBaseMaterialsAction(state, playerId, sourceBaseId, targetBaseId, amount),
      '建料調度失敗。',
    )
  },

  previewAttack: (playerId: string, creatureId: string) => {
    return gameStore.previewAttackTarget(playerId, 'creature', creatureId)
  },

  previewAttackTarget: (playerId: string, targetType: AttackTargetType, targetId: string) => {
    updateGameState((state) => {
      const preview = createAttackPreview(
        state,
        getActionablePlayer(state, playerId),
        targetType,
        targetId,
      )
      if (!preview) return state

      return {
        ...state,
        operation: { type: 'previewing-attack' },
        attackPreview: preview,
      }
    })
  },

  clearAttackPreview: () => {
    updateGameState((state) => ({ ...state, attackPreview: null, operation: { type: 'idle' } }))
  },

  executeAttack: (): ActionExecutionResult<AttackExecutionResult> => {
    return gameStore.executeAttackTarget()
  },

  executeAttackTarget: (): ActionExecutionResult<AttackExecutionResult> => {
    const action = executeAttackAction(gameState, gameState.attackPreview, {
      getActionablePlayer,
      createLootForPlayer,
      getLearnableSkill,
      applyExperienceAndLevelUp,
      addLootToPlayer,
    })
    updateGameState(() => action.state)
    return action.result
  },

  /** AI 攻擊：走原子 domain action，不經過 previewAttackTarget。人類玩家仍用 Preview API。 */
  executeAiAttack: (playerId: string, targetType: AttackTargetType, targetId: string): ActionExecutionResult<AttackExecutionResult> => {
    return runActionExecution(updateGameState, (state) => executeAiAttackAction(state, playerId, targetType, targetId, {
      getActionablePlayer,
      createLootForPlayer,
      getLearnableSkill,
      applyExperienceAndLevelUp,
      addLootToPlayer,
    }), 'AI 攻擊失敗。')
  },

  /** 通用 AI 行動執行器：所有 AI 行動經此單一入口執行。 */
  executeAiAction: (action: import('./ai/aiAction').AiAction): ActionOutcome => {
    return runActionOutcome(updateGameState, (state) => executeAiActionDomain(state, action, {
      combat: {
        getActionablePlayer,
        createLootForPlayer,
        getLearnableSkill,
        applyExperienceAndLevelUp,
        addLootToPlayer,
      },
      turn: {
        moveCreatures: (currentState) => moveCreatures(
          currentState.creatures,
          currentState.map,
          currentState.players,
          currentState.bases,
          currentState.resourcePoints,
          currentState.defenseStructures ?? [],
          currentState.itemPoints ?? [],
          currentState.explorationEvents ?? [],
          currentState.creatureNests,
          currentState.ruins ?? [],
          currentState.traps ?? [],
          currentState.sectGates ?? [],
          currentState.globalBuffs ?? [],
          defaultRandomSource,
          currentState.round,
        ),
        spawnCreaturesFromNests: (currentState, creatures, players) => spawnCreaturesFromNests(
          currentState.creatureNests,
          creatures,
          currentState.map,
          players,
          currentState.bases,
          currentState.round + 1,
        ),
      },
    }), 'AI 行動失敗。')
  },

  /** 選取元素爆發道具（element-burst）的目標並建立預覽。 */
  previewItemBurst: (targetType: AttackTargetType, targetId: string): ActionOutcome => {
    let result: ActionOutcome = { ok: false, reason: '元素爆發失敗。' }

    updateGameState((state) => {
      const operation = state.operation
      if (operation.type !== 'targeting-item') {
        result = { ok: false, reason: '目前沒有待執行的元素爆發道具。' }
        return state
      }
      const player = getActionablePlayer(state, state.activePlayerId)
      const preview = createItemBurstPreview(state, player, operation.itemId, targetType, targetId)
      if (!preview) {
        result = { ok: false, reason: '目標不存在或已被擊敗。' }
        return state
      }
      // 元素爆發道具只能攻擊玩家周遭一格的目標。
      const targetPosition = targetType === 'creature'
        ? state.creatures.find((creature) => creature.id === targetId)?.position
        : state.creatureNests.find((nest) => nest.id === targetId)?.position
      if (!player || !targetPosition || !isAdjacent(player.position, targetPosition)) {
        result = { ok: false, reason: '目標不在玩家周遭一格內。' }
        return state
      }
      result = { ok: true }
      return {
        ...state,
        operation: { type: 'previewing-item-burst' },
        itemBurstPreview: preview,
      }
    })

    return result
  },

  clearItemBurstPreview: () => {
    updateGameState((state) => ({
      ...state,
      itemBurstPreview: null,
      operation: { type: 'idle' },
    }))
  },

  /** 執行元素爆發道具（element-burst）對指定目標的傷害。 */
  executeItemBurst: (): ActionExecutionResult<ItemBurstExecutionResult> => {
    let result: ActionExecutionResult<ItemBurstExecutionResult> = { ok: false, reason: '元素爆發失敗。' }

    updateGameState((state) => {
      const preview = state.itemBurstPreview
      if (!preview) {
        result = { ok: false, reason: '目前沒有待執行的元素爆發道具。' }
        return state
      }
      const item = itemCatalog.find((candidate) => candidate.id === preview.itemId)
      const player = getActionablePlayer(state, state.activePlayerId)
      const inventoryEntry = player?.inventory.find((entry) => entry.itemId === preview.itemId)
      if (!item || item.effect !== 'element-burst' || !player || !inventoryEntry || inventoryEntry.quantity <= 0) {
        result = { ok: false, reason: '道具不存在或數量不足。' }
        return state
      }
      if (player.itemEffectsUsedThisTurn?.includes('element-burst')) {
        result = { ok: false, reason: '本回合已使用過元素爆發道具。' }
        return state
      }

      const targetType = preview.targetType
      const targetId = preview.targetId
      const target = targetType === 'creature'
        ? state.creatures.find((creature) => creature.id === targetId && creature.health > 0)
        : state.creatureNests.find((nest) => nest.id === targetId && nest.health > 0)
      if (!target) {
        result = { ok: false, reason: '目標不存在或已被擊敗。' }
        return state
      }

      const attackerElement = item.element
      const defenderElement = getSchoolElement(target.schoolId)
      const multiplier = getElementDamageMultiplier(attackerElement, defenderElement)
      const damage = Math.max(1, Math.floor((item.effectValue ?? 0) * multiplier))
      const nextHealth = Math.max(0, target.health - damage)
      const defeated = nextHealth === 0

      const consumeItem = (currentPlayer: PlayerState): PlayerState => ({
        ...currentPlayer,
        inventory: currentPlayer.inventory
          .map((entry) =>
            entry.itemId === preview.itemId
              ? { ...entry, quantity: entry.quantity - 1 }
              : entry,
          )
          .filter((entry) => entry.quantity > 0),
      })

      // 統一擊殺流程：擊殺生物時與普通攻擊/外功一致，結算經驗、金錢與掉落。
      const creatureRewards = targetType === 'creature'
        ? resolveCreatureDefeatRewards(player, target as { level?: number }, defeated, {
          getActionablePlayer,
          createLootForPlayer,
          getLearnableSkill,
          applyExperienceAndLevelUp,
          addLootToPlayer,
        }, defaultRandomSource)
        : null
      // 擊殺巢穴時與普通攻擊/外功一致，結算可學會的功法。
      const learnedSkill = targetType === 'nest' && defeated
        ? getLearnableSkill(player)
        : undefined

      const resultData: ItemBurstExecutionResult = {
        playerId: player.id,
        playerName: player.name,
        itemId: item.id,
        itemName: item.name,
        itemIcon: item.icon ?? '',
        element: item.element,
        targetType,
        targetId,
        targetName: target.name,
        damage,
        nextHealth,
        maxHealth: target.maxHealth,
        defeated,
        experienceReward: creatureRewards?.experienceGain || undefined,
        moneyReward: creatureRewards?.moneyReward || undefined,
        loot: creatureRewards?.loot,
        learnedSkill,
        levelsGained: creatureRewards
          ? (creatureRewards.progressedPlayer.level ?? 1) - (player.level ?? 1)
          : undefined,
        newLevel: creatureRewards?.progressedPlayer.level,
        attributePointsGained: creatureRewards
          ? (creatureRewards.progressedPlayer.availableAttributePoints ?? 0) - (player.availableAttributePoints ?? 0)
          : undefined,
      }
      result = { ok: true, data: resultData }

      // 統一死亡流程：血量歸零時由 applyTargetDefeat 移除目標（生物/巢穴）並處理勝利。
      const baseState: GameState = {
        ...state,
        operation: { type: 'idle' },
        itemBurstPreview: null,
        creatures: targetType === 'creature'
          ? state.creatures.map((creature) => creature.id === targetId ? { ...creature, health: nextHealth } : creature)
          : state.creatures,
        creatureNests: targetType === 'nest'
          ? state.creatureNests.map((nest) => nest.id === targetId ? { ...nest, health: nextHealth } : nest)
          : state.creatureNests,
        players: state.players.map((currentPlayer) =>
          currentPlayer.id === player.id
            ? (() => {
              const used: ItemEffectType[] = currentPlayer.itemEffectsUsedThisTurn?.includes('element-burst')
                ? currentPlayer.itemEffectsUsedThisTurn
                : [...(currentPlayer.itemEffectsUsedThisTurn ?? []), 'element-burst']
              const consumed = { ...consumeItem(currentPlayer), itemEffectsUsedThisTurn: used }
              if (!creatureRewards && !learnedSkill) return consumed
              const withLoot = creatureRewards?.loot
                ? addLootToPlayer(consumed, creatureRewards.loot)
                : consumed
              const withSkill = learnedSkill
                ? learnedSkill.type === 'inner'
                  ? { ...withLoot, innerSkillIds: [...withLoot.innerSkillIds, learnedSkill.skill.id] }
                  : { ...withLoot, externalSkillIds: [...withLoot.externalSkillIds, learnedSkill.skill.id] }
                : withLoot
              return {
                ...withSkill,
                level: creatureRewards?.progressedPlayer.level ?? withSkill.level,
                availableAttributePoints: creatureRewards?.progressedPlayer.availableAttributePoints ?? withSkill.availableAttributePoints,
                experience: creatureRewards?.progressedPlayer.experience ?? withSkill.experience,
                health: creatureRewards?.progressedPlayer.health ?? withSkill.health,
                innerPower: creatureRewards?.progressedPlayer.innerPower ?? withSkill.innerPower,
                money: withLoot.money + (creatureRewards?.moneyReward ?? 0),
              }
            })()
            : currentPlayer,
        ),
      }
      return applyTargetDefeat(baseState, targetType, targetId, nextHealth)
    })

    return result
  },

  autoEndPlayerTurn: (playerId: string) => {
    if (!playerId || hasAvailablePlayerAction(gameState, playerId)) {
      return
    }

    gameStore.endPlayerTurn(playerId)
  },

  runAiDefenseStep: (playerId: string): ActionOutcome => {
    const state = gameState
    const player = state.players.find((candidate) => candidate.id === playerId)
    const order = state.aiOrders?.find((candidate) => candidate.aiPlayerId === playerId && candidate.type === 'protect-base' && candidate.status === 'active')
    if (!player?.isAI || state.activePlayerId !== playerId || state.creatureTurnInProgress || state.gameOver || !order || order.type !== 'protect-base') {
      return { ok: false, reason: '目前無法執行 AI 防守回合。' }
    }

    const selfPreservation = chooseSelfPreservationAction(state, playerId, order.retreatHealthPercent, getPlayerAiEmergency())
    if (selfPreservation?.type === 'move') {
      const action = defenseActionToAiAction(state, playerId, selfPreservation)
      const rejection = validateAiStepAction(state, action)
      if (rejection) {
        recordAiStepEvent(state.round, playerId, player.name, action, { ok: false, reason: rejection })
        return { ok: false, reason: rejection }
      }
      const result = gameStore.movePlayerTo(playerId, selfPreservation.position.row, selfPreservation.position.column)
      recordAiStepEvent(state.round, playerId, player.name, action, result)
      return result.ok ? { ok: true } : { ok: false, reason: result.reason ?? 'AI 自保移動失敗。' }
    }
    if (selfPreservation) {
      const action = defenseActionToAiAction(state, playerId, selfPreservation)
      const rejection = validateAiStepAction(state, action)
      if (rejection) {
        recordAiStepEvent(state.round, playerId, player.name, action, { ok: false, reason: rejection })
        return { ok: false, reason: rejection }
      }
      gameStore.endPlayerTurn(playerId)
      recordAiStepEvent(state.round, playerId, player.name, action, { ok: true })
      return { ok: true }
    }

    const decision = chooseDefenseAction(state, playerId, order)
    if (decision.type === 'attack') {
      const action = defenseActionToAiAction(state, playerId, decision)
      const rejection = validateAiStepAction(state, action)
      if (rejection) {
        recordAiStepEvent(state.round, playerId, player.name, action, { ok: false, reason: rejection })
        return { ok: false, reason: rejection }
      }
      const result = gameStore.executeAiAttack(playerId, decision.targetType, decision.targetId)
      recordAiStepEvent(state.round, playerId, player.name, action, result.ok ? { ok: true } : { ok: false, reason: result.reason })
      return result.ok ? { ok: true } : { ok: false, reason: result.reason ?? 'AI 攻擊失敗。' }
    }
    if (decision.type === 'move') {
      const action = defenseActionToAiAction(state, playerId, decision)
      const rejection = validateAiStepAction(state, action)
      if (rejection) {
        recordAiStepEvent(state.round, playerId, player.name, action, { ok: false, reason: rejection })
        return { ok: false, reason: rejection }
      }
      const result = gameStore.movePlayerTo(playerId, decision.position.row, decision.position.column)
      recordAiStepEvent(state.round, playerId, player.name, action, result)
      return result.ok ? { ok: true } : { ok: false, reason: result.reason ?? 'AI 移動失敗。' }
    }
    {
      const action = defenseActionToAiAction(state, playerId, decision)
      const rejection = validateAiStepAction(state, action)
      if (rejection) {
        recordAiStepEvent(state.round, playerId, player.name, action, { ok: false, reason: rejection })
        return { ok: false, reason: rejection }
      }
      gameStore.endPlayerTurn(playerId)
      recordAiStepEvent(state.round, playerId, player.name, action, { ok: true })
      return { ok: true }
    }
  },

  /**
   * 建設 AI 步驟（重構文件 §12 Phase 4／§15 Phase 6）：
   * - `paused` 方針不建造，僅嘗試採集相鄰資源點，否則待命。
   * - 一般方針：依效用評分逐一套用 queue 候選；失敗者標記 `blocked`（含原因）並嘗試下一個；
   *   建料不足的 blocked 在材料累積後會自動重試。
   * - 佇列無候選且允許升級時，升級等級最低的建築。
   * - 建造／升級成功：寫入全域日誌＋完成提醒彈窗（玩家確認後 AI 再繼續）。
   */
  runAiConstructionStep: (playerId: string): ActionOutcome => {
    const state = gameState
    const player = state.players.find((candidate) => candidate.id === playerId)
    const plan = state.aiConstructionPlans?.find((candidate) => candidate.aiPlayerId === playerId)
    if (!player?.isAI || state.activePlayerId !== playerId || state.creatureTurnInProgress || state.gameOver || !plan) {
      return { ok: false, reason: '目前無法執行 AI 建設回合。' }
    }
    if (!state.bases.some((candidate) => candidate.id === plan.baseId)) {
      return { ok: false, reason: '建設計畫的據點不存在。' }
    }

    // paused 方針：不主動建造，但可執行採集（§14.6）。
    if (plan.policy === 'paused') {
      const adjacentPoint = (state.resourcePoints ?? []).find((point) => isSameOrAdjacent(player.position, point.position))
      if (adjacentPoint) {
        const collectAction: AiAction = { type: 'collect', actor: { id: playerId, kind: 'player' }, target: { id: adjacentPoint.id, kind: 'resource', position: adjacentPoint.position }, reason: '暫停建造，採集建料。' }
        const rejection = validateAiStepAction(state, collectAction)
        if (rejection) {
          recordAiStepEvent(state.round, playerId, player.name, collectAction, { ok: false, reason: rejection })
          return { ok: false, reason: rejection }
        }
        const result = gameStore.collectResourcePoint(playerId, adjacentPoint.id)
        recordAiStepEvent(state.round, playerId, player.name, collectAction, result.ok ? { ok: true } : { ok: false, reason: result.reason })
        return result.ok ? { ok: true } : { ok: false, reason: result.reason ?? '採集失敗。' }
      }
      gameStore.endPlayerTurn(playerId)
      recordAiStepEvent(
        state.round,
        playerId,
        player.name,
        { type: 'hold', actor: { id: playerId, kind: 'player' }, reason: '暫停建造：附近無可採集的資源點。' },
        { ok: true },
      )
      return { ok: true }
    }

    // 體力護欄：體力不足以建造時直接結束回合；這是暫時性狀態，不可標記為 blocked。
    if (!canPlayerPerformAction(gameState, playerId, ACTION_STAMINA_COSTS.build).ok) {
      gameStore.endPlayerTurn(playerId)
      recordAiStepEvent(
        state.round,
        playerId,
        player.name,
        { type: 'end-turn', actor: { id: playerId, kind: 'player' }, reason: '體力不足，結束建設回合。' },
        { ok: true },
      )
      return { ok: true }
    }

    // 依效用評分逐一套用候選；失敗者標記 blocked（含原因）後換下一個。
    const excluded = new Set<number>()
    while (true) {
      const candidate = pickNextBuildCandidate(gameState, plan, excluded)
      if (!candidate) break
      const buildAction: AiAction = { type: 'build', actor: { id: playerId, kind: 'player' }, baseId: plan.baseId, buildingType: candidate.buildingType, reason: `建設計畫：${candidate.buildingName}（優先度 ${candidate.item.priority}）。` }
      const rejection = validateAiStepAction(gameState, buildAction)
      if (rejection) {
        updateConstructionPlanItem(playerId, candidate.itemIndex, { status: 'blocked', blockedReason: rejection })
        excluded.add(candidate.itemIndex)
        continue
      }
      const outcome = constructBuildingAction(gameState, plan.baseId, candidate.buildingId, playerId)
      if (outcome.result.ok) {
        updateGameState(() => outcome.state)
        updateConstructionPlanItem(playerId, candidate.itemIndex, { status: 'completed', blockedReason: undefined })
        recordAiStepEvent(
          gameState.round,
          playerId,
          player.name,
          buildAction,
          { ok: true },
        )
        gameStore.showActionResult({
          title: '🏗️ 建設完成',
          message: `${player.name} 已在據點完成「${candidate.buildingName}」。`,
          rewards: [],
        })
        return { ok: true }
      }
      updateConstructionPlanItem(playerId, candidate.itemIndex, { status: 'blocked', blockedReason: outcome.result.reason })
      excluded.add(candidate.itemIndex)
    }

    // 佇列全部受阻 → 升級 fallback（若允許）。
    const upgradeCandidate = pickUpgradeCandidate(gameState, plan)
    if (upgradeCandidate) {
      const outcome = upgradeBuildingAction(gameState, playerId, plan.baseId, upgradeCandidate.buildingId)
      if (outcome.result.ok) {
        updateGameState(() => outcome.state)
        recordAiStepEvent(
          gameState.round,
          playerId,
          player.name,
          { type: 'build', actor: { id: playerId, kind: 'player' }, baseId: plan.baseId, buildingType: upgradeCandidate.buildingName, reason: '佇列已無可建項目，升級既有建築。' },
          { ok: true },
        )
        gameStore.showActionResult({
          title: '⬆️ 建築升級',
          message: `${player.name} 已將「${upgradeCandidate.buildingName}」升級。`,
          rewards: [],
        })
        return { ok: true }
      }
      // 升級失敗不阻塞 queue：記錄待命原因即可。
      gameStore.endPlayerTurn(playerId)
      recordAiStepEvent(
        gameState.round,
        playerId,
        player.name,
        { type: 'hold', actor: { id: playerId, kind: 'player' }, reason: outcome.result.reason ?? '目前無法升級建築。' },
        { ok: true },
      )
      return { ok: true }
    }

    gameStore.endPlayerTurn(playerId)
    recordAiStepEvent(
      gameState.round,
      playerId,
      player.name,
      { type: 'end-turn', actor: { id: playerId, kind: 'player' }, reason: '沒有可執行的建設項目，結束回合。' },
      { ok: true },
    )
    return { ok: true }
  },

  runAiSupportStep: (playerId: string): ActionOutcome => {
    const state = gameState
    const player = state.players.find((candidate) => candidate.id === playerId)
    const order = state.aiOrders?.find((candidate) => candidate.aiPlayerId === playerId && candidate.type === 'support-player' && candidate.status === 'active')
    if (!player?.isAI || state.activePlayerId !== playerId || state.creatureTurnInProgress || state.gameOver || !order || order.type !== 'support-player') {
      return { ok: false, reason: '目前無法執行 AI 支援回合。' }
    }
    const selfPreservation = chooseSelfPreservationAction(state, playerId, order.retreatHealthPercent, getPlayerAiEmergency())
    if (selfPreservation?.type === 'move') {
      const action = defenseActionToAiAction(state, playerId, selfPreservation)
      const rejection = validateAiStepAction(state, action)
      if (rejection) {
        recordAiStepEvent(state.round, playerId, player.name, action, { ok: false, reason: rejection })
        return { ok: false, reason: rejection }
      }
      const result = gameStore.movePlayerTo(playerId, selfPreservation.position.row, selfPreservation.position.column)
      recordAiStepEvent(state.round, playerId, player.name, action, result)
      return result.ok ? { ok: true } : { ok: false, reason: result.reason ?? 'AI 自保移動失敗。' }
    }
    if (selfPreservation) {
      const action = defenseActionToAiAction(state, playerId, selfPreservation)
      const rejection = validateAiStepAction(state, action)
      if (rejection) {
        recordAiStepEvent(state.round, playerId, player.name, action, { ok: false, reason: rejection })
        return { ok: false, reason: rejection }
      }
      gameStore.endPlayerTurn(playerId)
      recordAiStepEvent(state.round, playerId, player.name, action, { ok: true })
      return { ok: true }
    }
    const target = state.players.find((candidate) => candidate.id === order.playerId)
    if (!target || target.health <= 0) {
      updateGameState((current) => ({
        ...current,
        aiOrders: (current.aiOrders ?? []).map((currentOrder) => currentOrder.id === order.id ? { ...currentOrder, status: 'paused' as const } : currentOrder),
      }))
      gameStore.endPlayerTurn(playerId)
      recordAiStepEvent(
        state.round,
        playerId,
        player.name,
        { type: 'end-turn', actor: { id: playerId, kind: 'player' }, reason: '支援目標不存在，暫停支援命令。' },
        { ok: true },
      )
      return { ok: true }
    }

    const decision = chooseSupportAction(state, playerId, order)
    if (decision.type === 'attack') {
      const action = defenseActionToAiAction(state, playerId, decision)
      const rejection = validateAiStepAction(state, action)
      if (rejection) {
        recordAiStepEvent(state.round, playerId, player.name, action, { ok: false, reason: rejection })
        return { ok: false, reason: rejection }
      }
      const result = gameStore.executeAiAttack(playerId, decision.targetType, decision.targetId)
      recordAiStepEvent(state.round, playerId, player.name, action, result.ok ? { ok: true } : { ok: false, reason: result.reason })
      return result.ok ? { ok: true } : { ok: false, reason: result.reason ?? 'AI 支援攻擊失敗。' }
    }
    if (decision.type === 'move') {
      const action = defenseActionToAiAction(state, playerId, decision)
      const rejection = validateAiStepAction(state, action)
      if (rejection) {
        recordAiStepEvent(state.round, playerId, player.name, action, { ok: false, reason: rejection })
        return { ok: false, reason: rejection }
      }
      const result = gameStore.movePlayerTo(playerId, decision.position.row, decision.position.column)
      recordAiStepEvent(state.round, playerId, player.name, action, result)
      return result.ok ? { ok: true } : { ok: false, reason: result.reason ?? 'AI 支援移動失敗。' }
    }
    {
      const action = defenseActionToAiAction(state, playerId, decision)
      const rejection = validateAiStepAction(state, action)
      if (rejection) {
        recordAiStepEvent(state.round, playerId, player.name, action, { ok: false, reason: rejection })
        return { ok: false, reason: rejection }
      }
      gameStore.endPlayerTurn(playerId)
      recordAiStepEvent(state.round, playerId, player.name, action, { ok: true })
      return { ok: true }
    }
  },

  runTest1Step: (playerId: string): ActionOutcome => {
    const state = gameState
    const player = state.players.find((candidate) => candidate.id === playerId)
    const order = state.aiOrders?.find((candidate) => candidate.aiPlayerId === playerId && candidate.type === 'test1' && candidate.status === 'active')
    if (!player?.isAI || state.activePlayerId !== playerId || state.creatureTurnInProgress || state.gameOver || !order) {
      return { ok: false, reason: '目前無法執行 AI test1 回合。' }
    }

    const actor = { id: playerId, kind: 'player' as const }
    let loopCount = 0
    const MAX_LOOPS = 50
    let exitReason = ''

    // 模糊邏輯迴圈：每步 perceive → evaluate → select → execute
    // 所有 break 只設定 exitReason，迴圈結束後統一走 endPlayerTurn 出口。
    while (!exitReason && gameState.players.find((p) => p.id === playerId)!.stamina > 0 && loopCount < MAX_LOOPS) {
      loopCount++
      const currentPlayer = gameState.players.find((p) => p.id === playerId)!

      // 1. Perceive
      const inputs = computeFuzzyInputs(gameState, currentPlayer)

      // 2. Evaluate
      const goalResults = evaluateAllGoals(inputs)

      // 3. Override：selfPreservation > 0.6 時不攻擊（V1 暫無 combat，此處記錄）
      // （V2 加入 engageCombat 時生效）

      // 4. Select
      const { goal, result } = selectBestGoal(goalResults)

      // 5. Threshold
      if (result.score < MIN_THRESHOLD) {
        exitReason = `所有目標分數過低（最高 ${goal} = ${result.score.toFixed(2)} < ${MIN_THRESHOLD}）`
        continue
      }

      // 6. Build actions
      const actions = buildActionSequence(goal, result, gameState, currentPlayer)
      if (actions.length === 0) {
        exitReason = `目標 ${goal} 無法產生行動序列`
        continue
      }

      // 7. Execute
      for (const action of actions) {
        const cp = gameState.players.find((p) => p.id === playerId)
        if (!cp || cp.stamina <= 0) {
          exitReason = `體力耗盡（剩餘 ${cp?.stamina ?? 0}）`
          break
        }
        const actionResult = gameStore.executeAiAction(action)
        recordAiStepEvent(gameState.round, playerId, currentPlayer.name, action, actionResult)
        if (!actionResult.ok) {
          exitReason = `行動失敗：${actionResult.reason ?? '未知錯誤'}`
          break
        }
      }
    }

    // ── 出口邏輯 ──────────────────────────────────────────────
    if (!exitReason) {
      // 正常結束：呼叫 endPlayerTurn，回傳 ok:true（scheduler 不會重複呼叫 endTurn）
      const endAction = { type: 'end-turn' as const, actor, reason: `迴圈正常結束（${loopCount} 步）` }
      gameStore.endPlayerTurn(playerId)
      recordAiStepEvent(state.round, playerId, player.name, endAction, { ok: true })
      return { ok: true }
    }
    // 異常退出：不呼叫 endPlayerTurn，回傳 ok:false（scheduler 會負責結束回合）
    return { ok: false, reason: exitReason }
  },

  endPlayerTurn: (playerId: string) => {
    let scheduledCreatureTurn: CreatureTurnResult | null = null
    let creatureTurnBasePlayers: PlayerState[] | null = null

    let triggeredEvent = false
    updateGameState((state) => {
      const action = endPlayerTurnAction(state, playerId, {
        moveCreatures: (currentState) => moveCreatures(
          currentState.creatures,
          currentState.map,
          currentState.players,
          currentState.bases,
          currentState.resourcePoints,
          currentState.defenseStructures ?? [],
          currentState.itemPoints,
          currentState.explorationEvents ?? [],
          currentState.creatureNests,
          currentState.ruins ?? [],
          currentState.traps ?? [],
          currentState.sectGates ?? [],
          currentState.globalBuffs ?? [],
          defaultRandomSource,
          currentState.round,
        ),
        spawnCreaturesFromNests: (currentState, creatures, players) => spawnCreaturesFromNests(
          currentState.creatureNests,
          creatures,
          currentState.map,
          players,
          currentState.bases,
          currentState.round + 1,
          getBlockedPositions({ ...currentState, players } as GameState, '', { includeInteractionPoints: true }),
        ),
      })
      if (action.creatureTurn) {
        scheduledCreatureTurn = action.creatureTurn
        creatureTurnBasePlayers = state.players
      }
      // 偵測是否觸發了探索事件（此回合結束隨機觸發）。
      triggeredEvent = Boolean(action.state.pendingExplorationEvent)
      // 劇情模式下，回合結束時檢查條件式目標（survive-rounds / reach-prestige）與勝利。
      const withVictoryCheck = action.state.campaignState
        ? checkVictory(action.state)
        : action.state
      // 劇情模式下，回合遞增後觸發 on-round-reached 觸發器（到達指定回合）。
      const withTriggers = action.state.campaignState
        ? executeTriggers(withVictoryCheck, { type: 'on-round-reached', param: String(action.state.round) })
        : withVictoryCheck
      return withTriggers
    })

    if (scheduledCreatureTurn) {
      // 若回合結束時有探索事件，或劇情對話佇列尚有未顯示內容（如勝利對話），
      // 先延後敵人行動，改由對應彈窗流程關閉後執行（flush）。
      const dialoguePending = (gameState.campaignState?.dialogueQueue?.length ?? 0) > 0
      if (triggeredEvent || dialoguePending) {
        // ── 探索事件 / 對話已觸發：先延後敵人行動 ─────────────────
        // 這裡不立即 animateCreatureTurn，而是把計算好的敵人行動結果暫存起來。
        // 後續流程：事件彈窗（PendingExplorationEventModal）先出現，玩家選擇後
        // 顯示事件結果彈窗，關閉結果彈窗才執行此暫存的敵人行動（flush）。
        // 如此確保彈窗順序為「事件 → 事件結果 → 敵人行動」而非同時出現。
        pendingCreatureTurn = scheduledCreatureTurn
        pendingCreatureTurnBasePlayers = creatureTurnBasePlayers
      } else {
        // 沒有觸發事件：維持原本流程，立即執行敵人行動。
        animateCreatureTurn(scheduledCreatureTurn)
      }
    }
    // 遊戲失敗的回合不自動保存，避免自動存檔直接停在失敗畫面。
    // 觸發探索事件時，敵人行動尚未執行，改由 flushPendingCreatureTurn 結算後保存。
    if (!triggeredEvent && !gameState.gameOver) saveGameStateToSlot(gameState, AUTO_SAVE_SLOT)
  },

  startPlayerTurn: (playerId: string) => {
    updateGameState((state) => {
      return startPlayerTurnAction(state, playerId)
    })
  },

  clearCreatureActionLogs: () => {
    updateGameState((state) => {
      if (state.creatureActionLogs.length === 0) {
        return state
      }

      return { ...state, creatureActionLogs: [] }
    })
  },

  /** 僅供測試使用：將狀態重置回初始狀態。 */
  resetForTest: () => {
    gameState = initialGameState
    lastGameSettings = { ...DEFAULT_GAME_SETTINGS }
    listeners.forEach((listener) => listener())
  },

  /** 僅供測試使用：直接覆寫目前狀態。 */
  setStateForTest: (nextState: GameState) => {
    gameState = nextState
    listeners.forEach((listener) => listener())
  },
}

export function useGameState() {
  return useSyncExternalStore(gameStore.subscribe, gameStore.getState, gameStore.getState)
}
