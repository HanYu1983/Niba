import type { CreatureActionLog, CreatureState, GameState, PlayerState, CreatureNestState, ExplorationEventState, ExplorationEventType } from '../types'
import { type CreatureTurnResult } from './creatureActions'
import { isAdjacent } from '../types'
import { applyBaseHealthBonuses, getBaseMaxBuildingMaterials } from '../rules/baseRules'
import { resolveRoundEndAuraEffects } from '../rules/auraRules'
import { getEffectivePassiveMaterialIncome } from '../rules/policyRules'
import { getGlobalRoundEndRecoveryPercent } from '../rules/globalBuffRules'
import { recoverFivePercent, recoverLivingPlayers, uniqueCreaturesById } from '../rules/playerRules'
import { applyExperienceAndLevelUp } from '../characterFactory'
import { explorationEventCatalog } from '../events/eventCatalog'
import { COMMON_EXPLORATION_EVENT_TYPES, getTerrainExplorationEventTypes } from '../events/eventSpawner'

/** 結束回合時，依剩餘體力給予經驗值（體力 × 此倍率）。 */
export const STAMINA_EXPERIENCE_MULTIPLIER = 2

/** 回合結束隨機觸發探索事件的預設機率（20%），當 state.explorationTriggerChance 未設定時使用。 */
export const EXPLORATION_TRIGGER_CHANCE = 0.2

/**
 * 隨機選出一個探索事件類型，回傳可用的 ExplorationEventType。
 * 若目錄為空則回傳 null。
 */
function getRandomExplorationEventType(terrain?: GameState['map']['cells'][number]['terrain']): ExplorationEventType | null {
  const terrainTypes = terrain ? getTerrainExplorationEventTypes(terrain) : []
  const commonTypes = COMMON_EXPLORATION_EVENT_TYPES.filter((type) => explorationEventCatalog.some((event) => event.type === type))
  const eventTypes = terrainTypes.length > 0 && commonTypes.length > 0
    ? Math.random() < 0.7 ? terrainTypes : commonTypes
    : terrainTypes.length > 0 ? terrainTypes : commonTypes.length > 0 ? commonTypes : explorationEventCatalog.map((event) => event.type)
  if (eventTypes.length === 0) return null
  return eventTypes[Math.floor(Math.random() * eventTypes.length)]
}

/**
 * 產生一個「回合結束隨機觸發」的暫時探索事件。
 * 不佔用地圖格子，position 使用玩家當前位置作為參考值（僅供 Modal 顯示用，不實際標記在地圖上）。
 */
function createPendingExplorationEvent(player: PlayerState, round: number, terrain?: GameState['map']['cells'][number]['terrain']): ExplorationEventState | null {
  const type = getRandomExplorationEventType(terrain)
  if (!type) return null
  const definition = explorationEventCatalog.find((event) => event.type === type)
  if (!definition) return null
  return {
    id: `pending-event-${player.id}-${round}`,
    type,
    name: definition.name,
    description: definition.description,
    position: { row: player.position.row, column: player.position.column },
    status: 'available',
    discovered: true,
    expiresAtRound: null,
  }
}

/** 結束回合的玩家，依剩餘體力獲得經驗值（體力 × 5）。 */
function applyStaminaExperienceBonus(player: PlayerState): PlayerState {
  const remainingStamina = player.stamina ?? 0
  if (remainingStamina <= 0) return player
  return applyExperienceAndLevelUp(player, remainingStamina * STAMINA_EXPERIENCE_MULTIPLIER)
}

export type { CreatureTurnResult } from './creatureActions'

type NestSpawnResult = {
  nests: CreatureNestState[]
  creatures: CreatureState[]
  logs: CreatureActionLog[]
}

export type TurnActionDependencies = {
  moveCreatures: (state: GameState) => CreatureTurnResult
  spawnCreaturesFromNests: (state: GameState, creatures: CreatureState[], players: PlayerState[]) => NestSpawnResult
}

export type EndPlayerTurnResult = {
  state: GameState
  creatureTurn: CreatureTurnResult | null
}

export function endPlayerTurn(
  state: GameState,
  playerId: string,
  dependencies: TurnActionDependencies,
): EndPlayerTurnResult {
  const player = state.players.find((candidate) => candidate.id === playerId)
  if (!player || state.activePlayerId !== playerId || state.creatureTurnInProgress || state.gameOver) {
    return { state, creatureTurn: null }
  }

  const playerIndex = state.players.findIndex((candidate) => candidate.id === playerId)
  // 下一位行動玩家：從當前玩家之後開始掃描，跳過已死亡（health <= 0）的玩家，
  // 避免 activePlayerId 指向死亡玩家導致其視野為空（地圖全黑）。
  let nextIndex = playerIndex
  for (let offset = 1; offset <= state.players.length; offset++) {
    const candidate = state.players[(playerIndex + offset) % state.players.length]
    if (candidate.health > 0) {
      nextIndex = (playerIndex + offset) % state.players.length
      break
    }
  }
  const nextPlayer = state.players[nextIndex]
  const isRoundComplete = state.players.every((candidate) => candidate.id === playerId || candidate.turnEnded)
  const creatureTurn = isRoundComplete
    ? dependencies.moveCreatures(state)
    : null
  const nestSpawn = isRoundComplete
    ? dependencies.spawnCreaturesFromNests(state, creatureTurn?.creatures ?? state.creatures, creatureTurn?.players ?? state.players)
    : null
  const scheduledCreatureTurn = creatureTurn && nestSpawn
    ? { ...creatureTurn, creatures: nestSpawn.creatures, logs: [...creatureTurn.logs, ...nestSpawn.logs] }
    : creatureTurn
  const nextBases = isRoundComplete
    ? (scheduledCreatureTurn?.bases ?? state.bases).map((base) => {
      const rawIncome = state.resourcePoints
        .filter((point) => point.ownerBaseId === base.id && !(scheduledCreatureTurn?.creatures ?? state.creatures).some((creature) => isAdjacent(creature.position, point.position)))
        .reduce((total, point) => total + point.materialIncome, 0) * 0.25
      // 民生政策與全局靈氣加成，並以含倉庫加成的上限截斷。
      const income = getEffectivePassiveMaterialIncome(base, rawIncome, state)
      const maxBuildingMaterials = getBaseMaxBuildingMaterials(base)
      return { ...base, buildingMaterials: Math.min(maxBuildingMaterials, base.buildingMaterials + income) }
    })
    : state.bases
  const roundEndRecoveryPercent = isRoundComplete ? getGlobalRoundEndRecoveryPercent(state) : 0
  // 區域靈氣：回合結束解析「累積型」效果（防衛營回血 + 巢穴灼燒/金煞）。
  // 使用回合結算後的據點與巢穴，確保來源失活判定正確。
  const auraRecoveredPlayers = isRoundComplete
    ? resolveRoundEndAuraEffects(
        scheduledCreatureTurn?.bases ?? state.bases,
        nestSpawn?.nests ?? state.creatureNests,
        recoverLivingPlayers(scheduledCreatureTurn?.players ?? state.players),
      )
    : []
  const recoveredPlayers = isRoundComplete
    ? auraRecoveredPlayers.map((candidate) => {
      // 全局靈氣：每回合結束額外回復一定比例氣血與內力（隨疊加而增加）。
      const bonusHealth = Math.floor(candidate.maxHealth * roundEndRecoveryPercent / 100)
      const bonusInnerPower = Math.floor(candidate.maxInnerPower * roundEndRecoveryPercent / 100)
      return {
        ...candidate,
        health: Math.min(candidate.maxHealth, candidate.health + bonusHealth),
        innerPower: Math.min(candidate.maxInnerPower, candidate.innerPower + bonusInnerPower),
      }
    })
    : []
  const nextCreatures = isRoundComplete && scheduledCreatureTurn
    ? uniqueCreaturesById(scheduledCreatureTurn.creatures).map((creature) => {
      const previous = state.creatures.find((candidate) => candidate.id === creature.id)
      return previous ? { ...creature, position: previous.position } : creature
    })
    : state.creatures

  // 結束回合的玩家，依「結束當下」的剩餘體力獲得經驗值（體力 × 5）。
  // 需在 recoverLivingPlayers 把體力重置為上限之前，先以原始剩餘體力計算加成。
  const endingPlayer = state.players.find((candidate) => candidate.id === playerId)
  const staminaBonusPlayer = endingPlayer ? applyStaminaExperienceBonus(endingPlayer) : undefined

  // 回合結束時，以可設定的機率隨機觸發一個探索事件（不佔用地圖格子）。
  // 觸發的事件存入 pendingExplorationEvent，由前端開啟 Modal 供該玩家選擇。
  // 僅人類玩家（非 AI）會觸發，因為 AI 玩家無法在 UI 上選擇事件選項。
  const triggerChance = state.explorationTriggerChance ?? EXPLORATION_TRIGGER_CHANCE
  const standingTerrain = endingPlayer
    ? state.map.cells.find((cell) => cell.row === endingPlayer.position.row && cell.column === endingPlayer.position.column)?.terrain
    : undefined
  const pendingExplorationEvent = endingPlayer && !endingPlayer.isAI && Math.random() < triggerChance
    ? createPendingExplorationEvent(endingPlayer, state.round, standingTerrain)
    : null

  return {
    creatureTurn: scheduledCreatureTurn,
    state: {
      ...state,
      pendingExplorationEvent,
      pendingExplorationEventPlayerId: pendingExplorationEvent ? playerId : null,
      activePlayerId: nextPlayer?.id ?? playerId,
      round: isRoundComplete ? state.round + 1 : state.round,
      players: isRoundComplete
        ? recoveredPlayers.map((candidate) => ({
          ...candidate,
          // 將依剩餘體力計算出的經驗/等級/滿血滿內力結果併回已恢復的玩家
          ...(staminaBonusPlayer && candidate.id === playerId ? {
            experience: staminaBonusPlayer.experience,
            level: staminaBonusPlayer.level,
            availableAttributePoints: staminaBonusPlayer.availableAttributePoints,
            health: staminaBonusPlayer.health,
            innerPower: staminaBonusPlayer.innerPower,
          } : {}),
          externalSkillsUsedThisTurn: [],
          itemEffectsUsedThisTurn: [],
        }))
        : state.players.map((candidate) => candidate.id === playerId
          ? { ...applyStaminaExperienceBonus(candidate), turnEnded: true, externalSkillsUsedThisTurn: [], itemEffectsUsedThisTurn: [] }
          : candidate.id === nextPlayer?.id
            ? { ...candidate, externalSkillsUsedThisTurn: [], itemEffectsUsedThisTurn: [] }
            : candidate),
      creatures: nextCreatures,
      bases: nextBases,
      defenseStructures: state.defenseStructures ?? [],
      creatureNests: isRoundComplete ? nestSpawn?.nests ?? state.creatureNests : state.creatureNests,
      resourcePoints: isRoundComplete ? state.resourcePoints : scheduledCreatureTurn?.resourcePoints ?? state.resourcePoints,
      itemPoints: isRoundComplete ? scheduledCreatureTurn?.itemPoints ?? state.itemPoints : state.itemPoints,
      explorationEvents: isRoundComplete ? scheduledCreatureTurn?.explorationEvents ?? state.explorationEvents : state.explorationEvents,
      creatureActionLogs: isRoundComplete ? nestSpawn?.logs ?? [] : state.creatureActionLogs,
      // 切片 J：Creature 行動事件（§4.5 格式）併入全域行動日誌，行動日誌面板即可見。
      actionEvents: isRoundComplete && scheduledCreatureTurn?.events?.length
        ? [...(state.actionEvents ?? []), ...scheduledCreatureTurn.events]
        : state.actionEvents,
      creatureTurnInProgress: isRoundComplete,
      activeCreatureId: null,
      operation: { type: 'idle' },
      // 鳴鑼符（reveal-creatures）：回合遞增超過到期回合時清空暫時揭示。
      revealedCreatureCellIds: isRoundComplete && state.revealedCreatureUntilRound !== undefined && state.round + 1 > state.revealedCreatureUntilRound
        ? undefined
        : state.revealedCreatureCellIds,
      revealedCreatureUntilRound: isRoundComplete && state.revealedCreatureUntilRound !== undefined && state.round + 1 > state.revealedCreatureUntilRound
        ? undefined
        : state.revealedCreatureUntilRound,
    },
  }
}

export function startPlayerTurn(state: GameState, playerId: string): GameState {
  if (state.activePlayerId !== playerId) return state
  return applyBaseHealthBonuses({
    ...state,
    players: state.players.map((player) => player.id === playerId
      ? {
        ...player,
        stamina: player.maxStamina,
        health: recoverFivePercent(player.health, player.maxHealth),
        innerPower: recoverFivePercent(player.innerPower, player.maxInnerPower),
        externalSkillsUsedThisTurn: [],
        itemEffectsUsedThisTurn: [],
        turnEnded: false,
      }
      : player),
  })
}
