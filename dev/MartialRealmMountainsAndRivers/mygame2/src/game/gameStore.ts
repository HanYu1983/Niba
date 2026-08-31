import { useSyncExternalStore } from 'react'
import { createGameStoreCore } from './store/createStore'
import { createSessionContext, clearPendingCreatureTurn, resolveActiveCharacterIds } from './session/sessionController'
import { animateCreatureTurn as animateCreatureTurnBus } from './effects/animationBus'
import { itemCatalog, type ItemEffectType } from './catalogs/itemCatalog'
import {
  type Position,
  type GameSettings,
  type MapState,
  type PlayerState,
  type PlayerAttributes,
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
  type ExplorationEventChoice,
  type UpgradeableAttribute,
  type AiOrder,
  type AiConstructionPlan,
  type AiConstructionPlanItem,
  type CampaignState,
  type RunStats,
  isAdjacent,
  isSameOrAdjacent,
} from './types'
import type { AiAction } from './ai/aiAction'
import type { AiActionEvent } from './ai/aiActionEvent'
import { createAiActionEvent } from './ai/aiActionEvent'
import {
  getEquipment,
  getEquipmentLoadout,
  getEffectiveAttributesForPlayer,
  getEquipmentInventory,
  getBuildingReputationBonus,
} from './rules/playerDerivedRules'
import { getExternalSkill, getPlayerTotalInsightCost, getElementDamageMultiplier, equipInnerSkillAction } from './rules/skillRules'
import {
  applyBaseHealthBonuses,
} from './rules/baseRules'
import { getRepairSummary, getWorkshopLevel, repairEquipmentInventory } from './rules/buildingRules'
import { applyMaterialPrestige } from './rules/governanceRules'
import {
  canTransportPlayer,
  getTransportLandingPosition,
  resolveTransportTarget,
  WAYSTATION_TRANSPORT_COST,
} from './rules/transportRules'
import {
  updatePlayerVisibility,
} from './rules/visibilityRules'
import {
  applyEquipmentLoadout,
} from './rules/equipmentRules'
import { type EquipmentSlot } from './catalogs/equipmentCatalog'
import type { DefenseStructureType } from './catalogs/defenseStructureCatalog'
import type { GovernancePolicyId } from './catalogs/governancePolicyCatalog'
import { ACTION_STAMINA_COSTS, canPlayerPerformAction, getActionablePlayer, spendPlayerStamina } from './rules/actionCostRules'
import {
  createCharacterState,
  applyExperienceAndLevelUp,
  restoreAfterAttributeChange,
} from './characterFactory'
import { getMaxInnerPower } from './rules/playerStatsRules'
import {
  buyEquipment as buyEquipmentAction,
  buySectEquipment as buySectEquipmentAction,
  buyItem as buyItemAction,
  sellEquipment as sellEquipmentAction,
  sellItem as sellItemAction,
} from './actions/shopActions'
import {
  buildRoadAtPlayer as buildRoadAtPlayerAction,
  constructBuilding as constructBuildingAction,
  constructDefenseStructure as constructDefenseStructureAction,
  upgradeBuilding as upgradeBuildingAction,
} from './actions/buildingActions'
import { performFirstAid } from './actions/firstAidActions'
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
import { collectItemPointAction, useItemAction as executeUseItemAction } from './actions/itemActions'
import {
  endPlayerTurn as endPlayerTurnAction,
  startPlayerTurn as startPlayerTurnAction,
  type CreatureTurnResult,
} from './actions/turnActions'
import {
  moveCreatures,
  spawnCreaturesFromNests as spawnCreaturesFromNestsAction,
} from './actions/creatureActions'
import { DEFAULT_GAME_SETTINGS } from './gameSettings'
import { learnSkillAtMartialHall as learnSkillAtMartialHallAction } from './actions/martialHallActions'
import { learnSkillAtSectGate as learnSectGateSkillAction, practiceSkillAtSectGate as practiceSectGateSkillAction } from './actions/sectGateActions'
import { clearRuin as clearRuinAction, reconstructRuin as reconstructRuinAction } from './actions/ruinActions'
import { getGameSaveSlots, loadGameState, loadGameStateFromSlot, saveGameState, saveGameStateToSlot, deleteGameStateFromSlot, scheduleAutoSave } from './gameSave'
import { isRunSettled, markRunSettled } from './settledRuns'
import { recordScenarioClearance } from './campaignClearance'
import { createGameState, createDebugGameState } from './worldSetup'
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
import { recordDamageDealt } from './runStats'
import { applyEndGameRewards, applyStoryUnlocks } from './characterRoster'
import { recordChallengeVictory } from './challengeState'
import { enqueueDialogue, skipAllDialogue } from './actions/dialogueActions'
import { collectTriggeredDialogues } from './rules/dialogueTriggerRules'
import { checkVictory } from './rules/campaignRules'
import { executeTriggers } from './rules/triggerRules'
import { storyDialogueCatalog } from './catalogs/storyDialogueCatalog'
import { buildGameStateFromScenario } from '../editor/rules/scenarioCompiler'
import { validateScenario } from '../editor/rules/scenarioValidator'
import type { ScenarioDefinition } from './contracts/scenario'
import { chooseDefenseAction } from './aiDefenseRules'
import { chooseSupportAction } from './aiSupportRules'
import { chooseSelfPreservationAction } from './aiSelfPreservationRules'
import { defenseActionToAiAction } from './ai/defenseActionAdapter'
import { validateAiAction } from './ai/validation/validateAiAction'
import { getPlayerAiEmergency } from './ai/policy/aiPolicyRegistry'
import { executeAiAction as executeAiActionDomain } from './ai/execution/executeAiAction'
import { computeFuzzyInputs } from './ai/fuzzy/fuzzyInputs'
import { evaluateAllGoals } from './ai/fuzzy/goals'
import { MIN_THRESHOLD, rankGoals } from './ai/fuzzy/decision'
import { decideNextAction } from './ai/decisionTree/decideNextAction'
import { runGraphSearchStep } from './ai/graphSearch/runGraphSearchStep'
import { defaultRandomSource } from './rules/randomRules'
import { getBlockedPositions } from './rules/movementRules'
import { getSchoolElement } from './catalogs/skillProgressionCatalog'

export function spawnCreaturesFromNests(
  nests: CreatureNestState[],
  creatures: CreatureState[],
  map: MapState,
  players: PlayerState[],
  bases: BaseState[],
  round: number,
  blockedPositions: Position[] = [],
  healthRegenPercent?: number,
): { nests: CreatureNestState[]; creatures: CreatureState[]; logs: CreatureActionLog[] } {
  return spawnCreaturesFromNestsAction(nests, creatures, map, players, bases, round, {
    createCreatureState: (input) => createCharacterState(input),
  }, blockedPositions, healthRegenPercent)
}

function hasAvailablePlayerAction(state: GameState, playerId: string): boolean {
  const player = getActionablePlayer(state, playerId)
  if (!player) return false
  return player.stamina > 0 || state.creatures.some((creature) => isAdjacent(player.position, creature.position)) || state.resourcePoints.some((point) => point.lastCollectedRound !== state.round && isSameOrAdjacent(player.position, point.position))
}

// ── Store 核心與 Session 狀態 ──────────────────────────────────────────────
const initialGameState = createGameState()
const storeCore = createGameStoreCore(initialGameState)
const session = createSessionContext()

const { getState, setState, updateGameState, subscribe } = storeCore

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

export function animateCreatureTurn(result: CreatureTurnResult) {
  animateCreatureTurnBus(result, updateGameState)
}

export const gameStore = {
  getState: () => getState(),

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

  startGame: (settings: GameSettings, selectedCharacters?: ({
    id?: string
    attributeBonuses: PlayerAttributes
    name?: string
    portrait?: string
    title?: string
    initialInternalSkillId?: string
    initialExternalSkillIds?: string[]
    talentIds?: string[]
  } | null)[]) => {
    session.isChallengeMode = false
    session.lastGameSettings = { ...settings }
    clearPendingCreatureTurn(session)
    const humanCount = Math.min(4, Math.max(1, Math.round(settings.playerCount ?? 1)))
    session.activeCharacterIds = Array.from({ length: humanCount }, (_, i) => selectedCharacters?.[i]?.id ?? null)
    session.rewardSettled = false
    setState({ ...createGameState(session.lastGameSettings, selectedCharacters), activeCharacterIds: session.activeCharacterIds })
  },

  /** 取得目前對局各人類玩家選用的名册角色 id（依人類玩家順序；未選用為 null）。 */
  getActiveCharacterIds: () => session.activeCharacterIds,

  /**
   * 局末回寫：將本局表現結算為卷並併入功法庫。同一局只結算一次（冪等）。
   *
   * 冪等檢查鏈（設計文件 scroll-reward-settlement-dedup-design.md §4.1）：
   * 1. 未選用任何名册角色 → null
   * 2. 模組旗標 rewardSettled（session 內快速路徑）→ null
   * 3. runId 已在持久化登記表（跨 session 最終防線，解跨欄位重複領取）→ null
   * 4. 通過 → 依人類玩家逐一結算 + markRunSettled 落盤
   */
  settleActiveCharacterRewards: (stats: RunStats, won: boolean, learnedSkillIdsByPlayer: string[][]) => {
    const selectedIds = session.activeCharacterIds.filter((id): id is string => Boolean(id))
    if (selectedIds.length === 0) return null
    if (session.rewardSettled) return null
    const runId = getState().runId
    if (runId && isRunSettled(runId)) {
      session.rewardSettled = true
      return null
    }
    // 依人類玩家順序，將各自的功法清單回寫到對應的名册角色。
    const results = session.activeCharacterIds.map((characterId, index) => {
      if (!characterId) return undefined
      return applyEndGameRewards(characterId, stats, won, learnedSkillIdsByPlayer[index] ?? [])
    })
    const anySettled = results.some((result) => Boolean(result))
    if (anySettled) {
      session.rewardSettled = true
      if (runId) markRunSettled(runId)
      // 結算發生在 GameOverModal 顯示後；此時原本的自動存檔仍是局末前狀態，
      // 因此要把包含局末旗標與同一 runId 的最新狀態寫回自動存檔，
      // 讓存檔摘要能顯示「已領取殘卷」，讀檔也能正確讀取防重登記。
      // activeCharacterIds 已隨 GameState 序列化，故不需再以參數傳入。
      scheduleAutoSave(getState(), null, session.isChallengeMode, session.currentScenarioId)
    }
    return results
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
    const result = saveGameState(getState(), session.activeCharacterIds[0] ?? null, session.isChallengeMode, session.currentScenarioId)
    return result.ok ? { ok: true } : { ok: false, reason: result.reason ?? '儲存失敗。' }
  },

  getSaveSlots: () => getGameSaveSlots(),

  saveGameToSlot: (slot: number): ActionOutcome => {
    const result = saveGameStateToSlot(getState(), slot, session.activeCharacterIds[0] ?? null, session.isChallengeMode, session.currentScenarioId)
    return result.ok ? { ok: true } : { ok: false, reason: result.reason ?? '儲存失敗。' }
  },

  loadGameFromSlot: (slot: number): ActionOutcome => {
    clearPendingCreatureTurn(session)
    const result = loadGameStateFromSlot(slot)
    if (!result.ok) return result
    // 還原挑戰關卡模式旗標與劇本 id（舊存檔缺漏視為 false/null）。
    session.isChallengeMode = result.isChallengeMode
    session.currentScenarioId = result.scenarioId
    const loadedState: GameState = {
      ...result.state,
      aiOrders: result.state.aiOrders ?? [],
      aiConstructionPlans: result.state.aiConstructionPlans ?? [],
    }
    setState(loadedState)
    // 還原名册角色 id 陣列：優先取 GameState.activeCharacterIds（隨存檔序列化），
    // 舊存檔缺漏時由單一 activeCharacterId 或 payload 的 activeCharacterId 轉換（向下相容）。
    session.activeCharacterIds = resolveActiveCharacterIds(loadedState, result.activeCharacterId)
    // 以 runId 登記表判斷是否已結算；局末但尚未登記的存檔需允許補發殘卷。
    // 舊存檔沒有 runId 時，沿用舊規則視為局末已結算，避免重複發放。
    session.rewardSettled = Boolean(
      (loadedState.runId && isRunSettled(loadedState.runId))
      || (!loadedState.runId && (loadedState.gameWon || loadedState.gameOver)),
    )
    return { ok: true }
  },

  deleteGameFromSlot: (slot: number): ActionOutcome => {
    deleteGameStateFromSlot(slot)
    return { ok: true }
  },

  loadGame: (): ActionOutcome => {
    const result = loadGameState()
    if (!result.ok) return result
    // 還原挑戰關卡模式旗標與劇本 id（舊存檔缺漏視為 false/null）。
    session.isChallengeMode = result.isChallengeMode
    session.currentScenarioId = result.scenarioId
    const loadedState: GameState = {
      ...result.state,
      aiOrders: result.state.aiOrders ?? [],
      aiConstructionPlans: result.state.aiConstructionPlans ?? [],
    }
    setState(loadedState)
    // 還原名册角色 id 陣列：優先取 GameState.activeCharacterIds（隨存檔序列化），
    // 舊存檔缺漏時由單 activeCharacterId / payload 的 activeCharacterId 轉換（向下相容）。
    session.activeCharacterIds = resolveActiveCharacterIds(loadedState, result.activeCharacterId)
    // 以 runId 登記表判斷是否已結算；局末但未 runId 的存檔需允許補發殘卷。
    // 舊存檔沒有 runId 時，回退舊規則視為局末已結算，避免重複發放。
    session.rewardSettled = Boolean(
      (loadedState.runId && isRunSettled(loadedState.runId))
      || (!loadedState.runId && (loadedState.gameWon || loadedState.gameOver)),
    )
    return { ok: true }
  },

  setAiOrder: (order: AiOrder): ActionOutcome => {
    const aiPlayer = getState().players.find((player) => player.id === order.aiPlayerId && player.isAI === true)
    if (!aiPlayer) return { ok: false, reason: '指定的玩家不是 AI 玩家。' }
    const existingOrder = getState().aiOrders?.find((current) => current.id === order.id)
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
            : order.type === 'fuzzy' || order.type === 'decision-tree'),
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
    const aiPlayer = getState().players.find((player) => player.id === plan.aiPlayerId && player.isAI === true)
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
    // Debug 地圖不綁定名册角色，清除並同步 state。
    session.activeCharacterIds = []
    session.isChallengeMode = false
    setState({ ...createDebugGameState(), activeCharacterIds: [] })
  },

  /** 以挑戰關卡模式開局：勝利流程比照沙盒，僅多記錄闖關等級。 */
  startChallengeGame: (settings: GameSettings, selectedCharacters?: ({
    id?: string
    attributeBonuses: PlayerAttributes
    name?: string
    portrait?: string
    title?: string
    initialInternalSkillId?: string
    initialExternalSkillIds?: string[]
    talentIds?: string[]
  } | null)[]) => {
    // 注意：startGame 內部會重置 isChallengeMode = false，
    // 因此必須「先呼叫 startGame、再設旗標」，否則旗標會被覆蓋回 sandbox。
    gameStore.startGame(settings, selectedCharacters)
    session.isChallengeMode = true
  },

  /** 目前對局是否為挑戰關卡模式。 */
  isChallengeModeActive: () => session.isChallengeMode,

  /** 載入測試用劇情模式（Debug 地圖 + 序章對話）。 */
  startTestCampaign: () => {
    clearPendingCreatureTurn(session)
    session.isChallengeMode = false
    session.currentScenarioId = null
    // 測試劇情不綁定名册角色，清除並同步 state。
    session.activeCharacterIds = []
    // 觸發開局（on-start）對話：收集符合的步驟並填入佇列（updateGameState 會自動顯示）。
    updateGameState((state) => {
      const steps = collectTriggeredDialogues(state, { type: 'on-start' })
      return enqueueDialogue(state, steps)
    })
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
    clearPendingCreatureTurn(session)
    // 劇本模式不綁定名册角色，清除並同步 state。
    session.isChallengeMode = false
    session.activeCharacterIds = []
    setState({ ...buildGameStateFromScenario(scenario), activeCharacterIds: [] })
    session.currentScenarioId = scenario.id
    // 觸發開局（on-start）對話與觸發器。
    updateGameState((state) => {
      const steps = collectTriggeredDialogues(state, { type: 'on-start' })
      const withDialogue = enqueueDialogue(state, steps)
      return executeTriggers(withDialogue, { type: 'on-start' })
    })
    return { ok: true }
  },

  restartGame: () => {
    clearPendingCreatureTurn(session)
    session.currentScenarioId = null
    session.isChallengeMode = false
    session.rewardSettled = false
    // 刻意沿用目前選用的名册角色（bug.md 記錄的設計），並同步寫入新 state。
    setState({ ...createGameState(session.lastGameSettings), activeCharacterIds: session.activeCharacterIds })
  },

  /** 記錄目前劇本的通關狀態（true = 闖關成功；false = 失敗）。
   *  通關成功時，同步將該章節的 storyUnlocks 併入所有官方角色（功法＋天賦）。 */
  recordCurrentScenarioClearance: (cleared: boolean) => {
    // 挑戰關卡模式：勝利時記錄闖關等級 +1（殘卷結算已由 settleActiveCharacterRewards 比照沙盒處理）。
    if (session.isChallengeMode && cleared) {
      recordChallengeVictory()
    }
    if (!session.currentScenarioId) return
    recordScenarioClearance(session.currentScenarioId, cleared)
    // 劇本通關解鎖：官方角色（如凌淵）作為故事主角，通關即解鎖對應功法／天賦。
    // 冪等（Set 去重），重複通關不會產生重複項目。
    applyStoryUnlocks(session.currentScenarioId, cleared)
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
    const preview = getState().repairPreview
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
    const current = getState()
    const continuation = current.blockingModal?.type === 'action-result'
      ? current.blockingModal.continuation
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

  /** 進入急救目標選取模式（點選周圍一格內倒下的玩家）。 */
  beginFirstAidTargeting: () => {
    updateGameState((state) => ({
      ...state,
      operation: { type: 'targeting-first-aid' },
    }))
  },

  /** 執行急救：復活周圍一格內倒下的玩家，血量恢復至 5。 */
  executeFirstAid: (targetPlayerId: string): ActionOutcome => {
    let outcome: ActionOutcome = { ok: false, reason: '急救失敗。' }
    updateGameState((state) => {
      const action = performFirstAid(state, state.activePlayerId, targetPlayerId)
      if (!action.result.ok) {
        outcome = { ok: false, reason: action.result.reason ?? '急救失敗。' }
        return state
      }
      outcome = { ok: true }
      return action.state
    })
    return outcome
  },

  subscribe: (listener: () => void) => {
    return subscribe(listener)
  },

  equipInnerSkill: (playerId: string, skillId: string) => {
    updateGameState((state) => {
      const result = equipInnerSkillAction(state, playerId, skillId)
      return result.state
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
    const action = executeExternalDamageAction(getState(), playerId, targetType, targetId, skillId, {
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
    const preview = getState().externalSkillPreview

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
    return runActionOutcome(updateGameState, (state) => executeUseItemAction(state, playerId, itemId), '無法使用此道具。')
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
          ? applyMaterialPrestige(currentPlayer, action.materialsUsed ?? 0, getBuildingReputationBonus(currentPlayer))
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
          ? applyMaterialPrestige(currentPlayer, action.materialsUsed ?? 0, getBuildingReputationBonus(currentPlayer))
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
          ? applyMaterialPrestige(currentPlayer, action.materialsUsed ?? 0, getBuildingReputationBonus(currentPlayer))
          : currentPlayer),
      }
    })
    return result
  },

  buildRoad: (playerId: string): ActionOutcome => {
    return runActionOutcome(updateGameState, (state) => buildRoadAtPlayerAction(state, playerId), '修路失敗。')
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
      if (!isSameOrAdjacent(player.position, resourcePoint.position)) return { state, result: { ok: false, reason: '玩家需位於資源點自身格或周圍一格。' } }
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
    const scheduled = session.pendingCreatureTurn
    if (!scheduled) return
    session.pendingCreatureTurn = null
    const basePlayers = session.pendingCreatureTurnBasePlayers ?? getState().players
    session.pendingCreatureTurnBasePlayers = null
    // 保留事件對玩家的效果，同時合併敵人行動快照中實際造成的血量與耐久度變化。
    const currentPlayers = getState().players.map((currentPlayer) => {
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
    // 遊戲結束（勝利或失敗）的回合不自動保存，避免自動存檔直接停在結算畫面。
    if (!getState().gameOver && !getState().gameWon) scheduleAutoSave(getState(), null, session.isChallengeMode, session.currentScenarioId)
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
    const action = executeAttackAction(getState(), getState().attackPreview, {
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
          undefined,
          currentState.nestHealthRegenPercent,
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
        // 元素爆發傷害計入「單回合最高傷害」戰績（僅人類玩家）。
        ...(player.isAI ? state : recordDamageDealt(state, damage)),
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
    if (!playerId || hasAvailablePlayerAction(getState(), playerId)) {
      return
    }

    gameStore.endPlayerTurn(playerId)
  },

  runAiDefenseStep: (playerId: string): ActionOutcome => {
    const state = getState()
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
    const state = getState()
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
    if (!canPlayerPerformAction(getState(), playerId, ACTION_STAMINA_COSTS.build).ok) {
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
      const candidate = pickNextBuildCandidate(getState(), plan, excluded)
      if (!candidate) break
      const buildAction: AiAction = { type: 'build', actor: { id: playerId, kind: 'player' }, baseId: plan.baseId, buildingType: candidate.buildingId, reason: `建設計畫：${candidate.buildingName}（優先度 ${candidate.item.priority}）。` }
      const rejection = validateAiStepAction(getState(), buildAction)
      if (rejection) {
        updateConstructionPlanItem(playerId, candidate.itemIndex, { status: 'blocked', blockedReason: rejection })
        excluded.add(candidate.itemIndex)
        continue
      }
      const outcome = constructBuildingAction(getState(), plan.baseId, candidate.buildingId, playerId)
      if (outcome.result.ok) {
        updateGameState(() => outcome.state)
        updateConstructionPlanItem(playerId, candidate.itemIndex, { status: 'completed', blockedReason: undefined })
        recordAiStepEvent(
          getState().round,
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
    const upgradeCandidate = pickUpgradeCandidate(getState(), plan)
    if (upgradeCandidate) {
      const outcome = upgradeBuildingAction(getState(), playerId, plan.baseId, upgradeCandidate.buildingId)
      if (outcome.result.ok) {
        updateGameState(() => outcome.state)
        recordAiStepEvent(
          getState().round,
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
        getState().round,
        playerId,
        player.name,
        { type: 'hold', actor: { id: playerId, kind: 'player' }, reason: outcome.result.reason ?? '目前無法升級建築。' },
        { ok: true },
      )
      return { ok: true }
    }

    gameStore.endPlayerTurn(playerId)
    recordAiStepEvent(
      getState().round,
      playerId,
      player.name,
      { type: 'end-turn', actor: { id: playerId, kind: 'player' }, reason: '沒有可執行的建設項目，結束回合。' },
      { ok: true },
    )
    return { ok: true }
  },

  runAiSupportStep: (playerId: string): ActionOutcome => {
    const state = getState()
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

  runFuzzyStep: (playerId: string): ActionOutcome => {
    const state = getState()
    const player = state.players.find((candidate) => candidate.id === playerId)
    const order = state.aiOrders?.find((candidate) => candidate.aiPlayerId === playerId && candidate.type === 'fuzzy' && candidate.status === 'active')
    if (!player?.isAI || state.activePlayerId !== playerId || state.creatureTurnInProgress || state.gameOver || !order) {
      return { ok: false, reason: '目前無法執行模糊策略回合。' }
    }

    const actor = { id: playerId, kind: 'player' as const }
    let loopCount = 0
    const MAX_LOOPS = 50
    let exitReason = ''

    // evaluateAllGoals 需要的 dependencies（與 executeAiAction 共用）
    const aiDeps: import('./ai/execution/executeAiAction').ExecuteAiActionDependencies = {
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
          undefined,
          currentState.nestHealthRegenPercent,
        ),
      },
    }

    // 模糊邏輯迴圈：每步 perceive → evaluate → select → execute
    // 所有 break 只設定 exitReason，迴圈結束後統一走 endPlayerTurn 出口。
    while (!exitReason && getState().players.find((p) => p.id === playerId)!.stamina > 0 && loopCount < MAX_LOOPS) {
      loopCount++
      const currentPlayer = getState().players.find((p) => p.id === playerId)!

      // 1. Perceive
      const inputs = computeFuzzyInputs(getState(), currentPlayer)

      // 2. Evaluate（evaluateAllGoals 內部已做 validate + apply）
      const goalResults = evaluateAllGoals(inputs, getState(), currentPlayer, aiDeps)

      // 3. Override：selfPreservation > 0.6 時不攻擊（V1 暫無 combat，此處記錄）
      // （V2 加入 engageCombat 時生效）

      // 4. Select（result.actions 已由 evaluate 保證合法）
      const rankedGoals = rankGoals(goalResults)
      let actions: import('./ai/aiAction').AiAction[] = []
      let goalFound = false

      for (const candidate of rankedGoals) {
        if (candidate.result.score < MIN_THRESHOLD) break

        const candidateActions = candidate.result.actions
        if (!candidateActions || candidateActions.length === 0) continue
        if (candidateActions.every((a) => a.type === 'hold')) continue

        actions = candidateActions
        goalFound = true
        break
      }

      if (!goalFound) {
        exitReason = `所有目標分數過低或無法產生有效行動（最高 ${rankedGoals[0]?.goal} = ${rankedGoals[0]?.result.score.toFixed(2)}）`
        continue
      }

      // 6. Execute（保底 validate：正常必定通過，不通過 = 代碼 bug）
      for (const action of actions) {
        const cp = getState().players.find((p) => p.id === playerId)
        if (!cp || cp.stamina <= 0) {
          exitReason = `體力耗盡（剩餘 ${cp?.stamina ?? 0}）`
          break
        }
        const validation = validateAiAction(getState(), action)
        if (!validation.valid) {
          exitReason = `保底驗證失敗（代碼 bug）：${validation.reason}`
          break
        }
        const actionResult = gameStore.executeAiAction(action)
        recordAiStepEvent(getState().round, playerId, currentPlayer.name, action, actionResult)
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

  runDecisionTreeStep: (playerId: string): ActionOutcome => {
    const state = getState()
    const player = state.players.find((candidate) => candidate.id === playerId)
    const order = state.aiOrders?.find((candidate) => candidate.aiPlayerId === playerId && candidate.type === 'decision-tree' && candidate.status === 'active')
    if (!player?.isAI || state.activePlayerId !== playerId || state.creatureTurnInProgress || state.gameOver || !order) {
      return { ok: false, reason: '目前無法執行決策樹回合。' }
    }

    const actor = { id: playerId, kind: 'player' as const }
    let loopCount = 0
    const MAX_LOOPS = 50
    let exitReason = ''

    while (!exitReason && getState().players.find((p) => p.id === playerId)!.stamina > 0 && loopCount < MAX_LOOPS) {
      loopCount++
      const currentPlayer = getState().players.find((p) => p.id === playerId)!

      const diagnostics: import('./ai/decisionTree/decideNextAction').DecisionTreeDiagnostics = { reasons: [] }
      const action = decideNextAction(getState(), playerId, diagnostics)

      if (!action) {
        exitReason = diagnostics.reasons.length > 0
          ? `決策樹無可執行行動（${diagnostics.reasons.join('；')}）`
          : '決策樹無可執行行動'
        continue
      }

      const actionResult = gameStore.executeAiAction(action)
      recordAiStepEvent(getState().round, playerId, currentPlayer.name, action, actionResult)
      if (!actionResult.ok) {
        exitReason = `行動失敗：${actionResult.reason ?? '未知錯誤'}`
        continue
      }
    }

    if (!exitReason) {
      const endAction = { type: 'end-turn' as const, actor, reason: `決策樹迴圈結束（${loopCount} 步）` }
      gameStore.endPlayerTurn(playerId)
      recordAiStepEvent(state.round, playerId, player.name, endAction, { ok: true })
      return { ok: true }
    }
    return { ok: false, reason: exitReason }
  },

  runGraphSearchStep: (playerId: string): ActionOutcome => {
    const state = getState()
    const player = state.players.find((candidate) => candidate.id === playerId)
    const order = state.aiOrders?.find((candidate) => candidate.aiPlayerId === playerId && candidate.type === 'graph-search' && candidate.status === 'active')
    if (!player?.isAI || state.activePlayerId !== playerId || state.creatureTurnInProgress || state.gameOver || !order) {
      return { ok: false, reason: '目前無法執行圖搜索回合。' }
    }

    const actor = { id: playerId, kind: 'player' as const }
    let loopCount = 0
    const MAX_LOOPS = 50
    let exitReason = ''

    const aiDeps: import('./ai/execution/executeAiAction').ExecuteAiActionDependencies = {
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
          undefined,
          currentState.nestHealthRegenPercent,
        ),
      },
    }

    while (!exitReason && getState().players.find((p) => p.id === playerId)!.stamina > 0 && loopCount < MAX_LOOPS) {
      loopCount++
      const currentPlayer = getState().players.find((p) => p.id === playerId)!

      const { actions, exitReason: searchExit } = runGraphSearchStep(getState(), playerId, aiDeps)

      if (actions.length === 0) {
        exitReason = searchExit ?? '圖搜索無結果'
        continue
      }

      for (const action of actions) {
        const cp = getState().players.find((p) => p.id === playerId)
        if (!cp || cp.stamina <= 0) {
          exitReason = `體力耗盡（剩餘 ${cp?.stamina ?? 0}）`
          break
        }
        const validation = validateAiAction(getState(), action)
        if (!validation.valid) {
          exitReason = `保底驗證失敗（代碼 bug）：${validation.reason}`
          break
        }
        const actionResult = gameStore.executeAiAction(action)
        recordAiStepEvent(getState().round, playerId, currentPlayer.name, action, actionResult)
        if (!actionResult.ok) {
          exitReason = `行動失敗：${actionResult.reason ?? '未知錯誤'}`
          break
        }
      }
    }

    // ── 出口邏輯 ──────────────────────────────────────────────
    // 圖搜索不再把 end-turn 當行動執行。迴圈結束後只走兩個出口：
    // - 無 exitReason（體力耗盡／迴圈上限）：此處 endPlayerTurn，ok:true（scheduler 不重複結束）
    // - 有 exitReason（無可行動／驗證失敗等）：ok:false，由 scheduler.endTurn 結束回合
    if (!exitReason) {
      const endAction = { type: 'end-turn' as const, actor, reason: `圖搜索迴圈結束（${loopCount} 步）` }
      gameStore.endPlayerTurn(playerId)
      recordAiStepEvent(state.round, playerId, player.name, endAction, { ok: true })
      return { ok: true }
    }
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
          currentState.nestHealthRegenPercent,
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
      const dialoguePending = (getState().campaignState?.dialogueQueue?.length ?? 0) > 0
      if (triggeredEvent || dialoguePending) {
        // ── 探索事件 / 對話已觸發：先延後敵人行動 ─────────────────
        // 這裡不立即 animateCreatureTurn，而是把計算好的敵人行動結果暫存起來。
        // 後續流程：事件彈窗（PendingExplorationEventModal）先出現，玩家選擇後
        // 顯示事件結果彈窗，關閉結果彈窗才執行此暫存的敵人行動（flush）。
        // 如此確保彈窗順序為「事件 → 事件結果 → 敵人行動」而非同時出現。
        session.pendingCreatureTurn = scheduledCreatureTurn
        session.pendingCreatureTurnBasePlayers = creatureTurnBasePlayers
      } else {
        // 沒有觸發事件：維持原本流程，立即執行敵人行動。
        animateCreatureTurn(scheduledCreatureTurn)
      }
    }
    // 遊戲結束（勝利或失敗）的回合不自動保存，避免自動存檔直接停在結算畫面。
    // 觸發探索事件時，敵人行動尚未執行，改由 flushPendingCreatureTurn 結算後保存。
    if (!triggeredEvent && !getState().gameOver && !getState().gameWon) scheduleAutoSave(getState(), null, session.isChallengeMode, session.currentScenarioId)
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
    setState(initialGameState)
    session.lastGameSettings = { ...DEFAULT_GAME_SETTINGS }
    session.activeCharacterIds = []
    session.rewardSettled = false
  },

  /** 僅供測試使用：直接覆寫目前狀態。 */
  setStateForTest: (nextState: GameState) => {
    setState(nextState)
    // 同步還原名册角色 id 陣列（若測試 state 有帶）。
    session.activeCharacterIds = resolveActiveCharacterIds(nextState)
  },
}

export function useGameState() {
  return useSyncExternalStore(gameStore.subscribe, gameStore.getState, gameStore.getState)
}
