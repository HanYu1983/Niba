import { useSyncExternalStore } from 'react'
import { createGameStoreCore } from './store/createStore'
import { createSessionContext, clearPendingCreatureTurn, resolveActiveCharacterIds } from './session/sessionController'
import { animateCreatureTurn as animateCreatureTurnBus } from './effects/animationBus'
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
  type CampaignState,
  type RunStats,
  isAdjacent,
  isSameOrAdjacent,
} from './types'
import {
  getEquipment,
  getEquipmentLoadout,
  getEffectiveAttributesForPlayer,
  getEquipmentInventory,
  getBuildingReputationBonus,
} from './rules/playerDerivedRules'
import { getExternalSkill, equipInnerSkillAction, toggleExternalSkillAction } from './rules/skillRules'
import {
  applyBaseHealthBonuses,
} from './rules/baseRules'
import { getRepairSummary, getWorkshopLevel, repairEquipmentInventory } from './rules/buildingRules'
import { applyMaterialPrestige } from './rules/governanceRules'
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
  executeAttack as executeAttackAction,
  executeExternalDamage as executeExternalDamageAction,
} from './actions/combatActions'
import { executeAiAttack as executeAiAttackAction } from './ai/execution/executeAiAttack'
import {
  depositEquipment as depositEquipmentAction,
  depositItem as depositItemAction,
  depositSkill as depositSkillAction,
  withdrawEquipment as withdrawEquipmentAction,
  withdrawItem as withdrawItemAction,
  withdrawSkill as withdrawSkillAction,
} from './actions/storageActions'
import { movePlayer as movePlayerAction } from './actions/movementActions'
import { transportPlayerAction } from './actions/transportActions'
import { collectItemPointAction, useItemAction as executeUseItemAction } from './actions/itemActions'
import { executeItemBurstAction } from './actions/itemBurstActions'
import {
  endPlayerTurn as endPlayerTurnAction,
  startPlayerTurn as startPlayerTurnAction,
  triggerTurnStartExplorationEvent,
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
import { applyEndGameRewards, applyStoryUnlocks } from './characterRoster'
import { recordChallengeVictory } from './challengeState'
import { enqueueDialogue, skipAllDialogue } from './actions/dialogueActions'
import { collectTriggeredDialogues } from './rules/dialogueTriggerRules'
import { checkVictory } from './rules/campaignRules'
import { executeTriggers } from './rules/triggerRules'
import { storyDialogueCatalog } from './catalogs/storyDialogueCatalog'
import { buildGameStateFromScenario } from './scenario/scenarioCompiler'
import { validateScenario } from './scenario/scenarioValidator'
import type { ScenarioDefinition } from './contracts/scenario'
import { executeAiAction as executeAiActionDomain } from './ai/execution/executeAiAction'
import { defaultRandomSource } from './rules/randomRules'
import { getBlockedPositions } from './rules/movementRules'
import {
  runAiDefenseStep as runAiDefenseStepDomain,
  runAiSupportStep as runAiSupportStepDomain,
  runAiConstructionStep as runAiConstructionStepDomain,
  runFuzzyStep as runFuzzyStepDomain,
  buildAiDependencies,
  type AiStepRunnerDeps,
} from './ai/aiStepRunner'

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

/** AI step 執行所需的依賴（供 aiStepRunner 使用）。 */
const aiStepDeps: AiStepRunnerDeps = {
  getState,
  updateGameState,
  executeAiAction: (action) => gameStore.executeAiAction(action),
  endPlayerTurn: (playerId) => gameStore.endPlayerTurn(playerId),
  movePlayerTo: (playerId, row, column) => gameStore.movePlayerTo(playerId, row, column),
  executeAiAttack: (playerId, targetType, targetId) => gameStore.executeAiAttack(playerId, targetType as AttackTargetType, targetId),
  collectResourcePoint: (playerId, resourcePointId) => gameStore.collectResourcePoint(playerId, resourcePointId),
  showActionResult: (result) => gameStore.showActionResult(result),
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
            : order.type === 'fuzzy'),
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

  setAiPersonality: (playerId: string, personality: PlayerState['aiPersonality']): ActionOutcome => {
    let updated = false
    updateGameState((state) => {
      const player = state.players.find((candidate) => candidate.id === playerId && candidate.isAI === true)
      if (!player || !personality) return state
      updated = true
      return {
        ...state,
        players: state.players.map((candidate) => candidate.id === playerId
          ? { ...candidate, aiPersonality: personality }
          : candidate),
      }
    })
    return updated ? { ok: true } : { ok: false, reason: '指定的玩家不是 AI 玩家。' }
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
      const result = toggleExternalSkillAction(state, playerId, skillId)
      return result.state
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
   * 關閉並清除「輪到該玩家」的回合開始隨機觸發的探索事件（不套用任何效果）。
   * 此為「玩家直接關閉事件彈窗、不選擇任何選項」的路徑。
   * 敵人行動已在回合結束執行結束，此處僅清除事件、不需延後。
   */
  dismissPendingExplorationEvent: () => {
    updateGameState((state) => ({
      ...state,
      pendingExplorationEvent: null,
      pendingExplorationEventPlayerId: null,
    }))
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
      const action = transportPlayerAction(state, playerId, targetId)
      result = action.result
      return action.result.ok ? action.state : state
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

  depositSkillToSharedWarehouse: (playerId: string, skillId: string): ActionOutcome => {
    return runActionOutcome(updateGameState, (state) => depositSkillAction(state, playerId, skillId), '存入功法失敗。')
  },

  withdrawSkillFromSharedWarehouse: (playerId: string, skillId: string): ActionOutcome => {
    return runActionOutcome(updateGameState, (state) => withdrawSkillAction(state, playerId, skillId), '取出功法失敗。')
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
    return runActionOutcome(updateGameState, (state) => executeAiActionDomain(state, action, buildAiDependencies({
      getActionablePlayer,
      createLootForPlayer,
      getLearnableSkill,
      applyExperienceAndLevelUp,
      addLootToPlayer,
    })), 'AI 行動失敗。')
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
      const outcome = executeItemBurstAction(state, {
        getActionablePlayer,
        createLootForPlayer,
        getLearnableSkill,
        applyExperienceAndLevelUp,
        addLootToPlayer,
      })
      result = outcome.result
      return outcome.state
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
    return runAiDefenseStepDomain(aiStepDeps, playerId)
  },

  runAiConstructionStep: (playerId: string): ActionOutcome => {
    return runAiConstructionStepDomain(aiStepDeps, playerId)
  },

  runAiSupportStep: (playerId: string): ActionOutcome => {
    return runAiSupportStepDomain(aiStepDeps, playerId)
  },

  runFuzzyStep: (playerId: string): ActionOutcome => {
    return runFuzzyStepDomain(aiStepDeps, playerId)
  },

  endPlayerTurn: (playerId: string) => {
    let scheduledCreatureTurn: CreatureTurnResult | null = null
    let creatureTurnBasePlayers: PlayerState[] | null = null

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
      // 若回合結束時劇情對話佇列尚有未顯示內容（如勝利對話），先延後敵人行動，
      // 改由對應彈窗流程關閉後執行（flush）。隨機探索事件已移至「輪到該玩家」的回合開始觸發，
      // 與敵人行動不再同時出現，故不需要為了事件延後敵方行動。
      const dialoguePending = (getState().campaignState?.dialogueQueue?.length ?? 0) > 0
      if (dialoguePending) {
        // ── 對話已觸發：先延後敵人行動 ─────────────────
        // 這裡不立即 animateCreatureTurn，而是把計算好的敵人行動結果暫存起來，
        // 待對話佇列清空後由 flushPendingCreatureTurn 執行。
        session.pendingCreatureTurn = scheduledCreatureTurn
        session.pendingCreatureTurnBasePlayers = creatureTurnBasePlayers
      } else {
        // 沒有延後需求：維持原本流程，立即執行敵人行動。
        animateCreatureTurn(scheduledCreatureTurn)
      }
    }
    // 回合結束後切換到「下一位玩家」的回合開始：以可設定機率隨機觸發探索事件。
    // 事件在目標玩家的回合開始出現，讓回合結束只負責敵方行動，不需延後機制。
    const newActiveId = getState().activePlayerId
    if (newActiveId) {
      updateGameState((state) => triggerTurnStartExplorationEvent(state, newActiveId))
    }
    // 遊戲結束（勝利或失敗）的回合不自動保存，避免自動存檔直接停在結算畫面。
    if (!getState().gameOver && !getState().gameWon) scheduleAutoSave(getState(), null, session.isChallengeMode, session.currentScenarioId)
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
