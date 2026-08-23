import type { BaseState, GameState, PlayerState } from './types'
import { getBaseMaxHealth, getWallHealthRecovery } from './rules/baseRules'
import { applyPeriodicBuffEffects, recoverLivingPlayers, tickPlayerBuffs, uniqueCreaturesById } from './rules/playerRules'
import type { CreatureTurnResult } from './actions/creatureActions'
import { getActiveBuffsForPlayer, getBuff } from './rules/playerDerivedRules'
import { replenishInteractionPoint } from './worldGeneration'
import { executeTriggers } from './rules/triggerRules'

export type UpdateGameState = (updater: (state: GameState) => GameState) => void

/**
 * 回光玉（return-light）：血量歸零時攔截死亡，復活至指定比例血量，
 * 清除所有 debuff（含致死 debuff），並移除該 Buff（只保一次）。
 */
function revivePlayersWithReturnLight(players: PlayerState[]): PlayerState[] {
  return players.map((player) => {
    if (player.health > 0) return player
    const returnLightBuff = (player.buffs ?? []).find((buff) =>
      getBuff(buff.definitionId)?.reviveOnDeath,
    )
    if (!returnLightBuff) return player
    const definition = getBuff(returnLightBuff.definitionId)
    const revivePercent = definition?.reviveHealthPercent ?? 0.3
    const clearDebuffs = definition?.clearDebuffsOnRevive ?? true
    const revivedHealth = Math.max(1, Math.floor(player.maxHealth * revivePercent))
    const remainingBuffs = clearDebuffs
      ? []
      : (player.buffs ?? []).filter((buff) => buff.id !== returnLightBuff.id)
    return {
      ...player,
      health: revivedHealth,
      buffs: remainingBuffs,
      turnEnded: false,
    }
  })
}

function getAttackLogs(logs: CreatureTurnResult['logs']) {
  return logs.filter((log) => !log.message.includes(' 朝 ') || log.message.includes('攻擊') || log.message.includes('摧毀'))
}

/**
 * 合併 Creature 攻擊造成的據點變動與回合結算結果。
 *
 * Creature 動畫的 `result.bases` 是攻擊前的 snapshot，不包含回合結算寫入的
 * 被動建料收入。此函式以 `stateBases`（含被動收入）為底，僅套用 Creature
 * 攻擊造成的血量變動，避免舊 snapshot 覆蓋回合結算結果。
 */
function mergeCreatureAttackBases(stateBases: BaseState[], creatureAttackBases: BaseState[]): BaseState[] {
  return stateBases.map((currentBase) => {
    const attackedBase = creatureAttackBases.find((candidate) => candidate.id === currentBase.id)
    return attackedBase
      ? { ...currentBase, health: attackedBase.health, active: attackedBase.health > 0 }
      : currentBase
  })
}

export function animateCreatureTurn(
  result: CreatureTurnResult,
  updateGameState: UpdateGameState,
): void {
  const creaturesBeforeBuffs = uniqueCreaturesById(result.creatures)
  const creaturesAfterPeriodicDamage = applyPeriodicBuffEffects(creaturesBeforeBuffs)
  const buffDamageLogs = creaturesBeforeBuffs.flatMap((before) => {
    const after = creaturesAfterPeriodicDamage.find((creature) => creature.id === before.id)
    if (!after || after.health >= before.health) return []

    const damage = before.health - after.health
    const damagingBuff = getActiveBuffsForPlayer(before)
      .map((buff) => getBuff(buff.definitionId))
      .find((definition) => definition?.maxHealthDamagePercent)
    return [{
      creatureId: before.id,
      creatureName: before.name,
      message: `${damagingBuff?.name ?? 'Buff'} 對 ${before.name} 造成 ${damage} 點傷害。`,
    }]
  })
  const creaturesAfterBuffs = creaturesAfterPeriodicDamage
    .map((creature) => tickPlayerBuffs(creature))
    .filter((creature) => creature.health > 0)
  const playersBeforeBuffs = result.players
  const playersAfterPeriodicDamage = applyPeriodicBuffEffects(playersBeforeBuffs)
  const playerBuffDamageLogs = playersBeforeBuffs.flatMap((before) => {
    const after = playersAfterPeriodicDamage.find((player) => player.id === before.id)
    if (!after || after.health >= before.health) return []

    const damage = before.health - after.health
    const damagingBuff = getActiveBuffsForPlayer(before)
      .map((buff) => getBuff(buff.definitionId))
      .find((definition) => definition?.maxHealthDamagePercent)
    return [{
      creatureId: before.id,
      creatureName: before.name,
      message: `${damagingBuff?.name ?? 'Buff'} 對 ${before.name} 造成 ${damage} 點傷害。`,
    }]
  })

  updateGameState((state) => {
    const nextBases = mergeCreatureAttackBases(state.bases, result.bases ?? []).map((base) => ({
      ...base,
      health: Math.min(getBaseMaxHealth(base), base.health + getWallHealthRecovery(base)),
      active: base.health > 0,
    }))
    // 只要有任何一個據點被破壞（失活），遊戲立即失敗。
    const anyBaseInactive = nextBases.length > 0 && nextBases.some((base) => base.active === false)
    const revivedPlayers = revivePlayersWithReturnLight(playersAfterPeriodicDamage)
    const revivedHealthById = new Map(
      revivedPlayers
        .filter((player, index) => playersAfterPeriodicDamage[index]?.health <= 0 && player.health > 0)
        .map((player) => [player.id, player.health]),
    )
    const allPlayersDefeated = revivedPlayers.length > 0 && revivedPlayers.every((player) => player.health <= 0)

    // 怪物吃掉探索點後，補回一個新的探索事件（與資源點/物品點行為一致）。
    const resultExplorationEvents = result.explorationEvents ?? state.explorationEvents ?? []
    const removedEvent =
      (state.explorationEvents ?? []).find(
        (event) => !resultExplorationEvents.some((candidate) => candidate.id === event.id),
      ) ?? null
    const nextExplorationEvents = removedEvent
      ? replenishInteractionPoint(
          { ...state, explorationEvents: resultExplorationEvents },
          false,
          removedEvent,
        ).explorationEvents
      : resultExplorationEvents

    // 偵測被怪物摧毀的防禦設施（從地圖消失），觸發 on-object-destroyed 觸發器。
    const resultDefenseStructures = result.defenseStructures ?? []
    const destroyedDefenseIds = (state.defenseStructures ?? [])
      .filter((structure) => !resultDefenseStructures.some((candidate) => candidate.id === structure.id))
      .map((structure) => structure.id)
    let triggerState: GameState = {
      ...state,
      creatures: creaturesAfterBuffs,
      players: recoverLivingPlayers(revivedPlayers).map((player) => {
        const fromState = state.players.find((candidate) => candidate.id === player.id)
        return {
          ...player,
          experience: fromState?.experience ?? player.experience,
          level: fromState?.level ?? player.level,
          availableAttributePoints: fromState?.availableAttributePoints ?? player.availableAttributePoints,
          ...(revivedHealthById.has(player.id) ? { health: revivedHealthById.get(player.id) } : {}),
          externalSkillsUsedThisTurn: [],
          itemEffectsUsedThisTurn: [],
        }
      }),
      bases: nextBases,
      resourcePoints: result.resourcePoints,
      itemPoints: result.itemPoints ?? state.itemPoints,
      explorationEvents: nextExplorationEvents,
      defenseStructures: resultDefenseStructures,
      ruins: result.ruins ?? state.ruins ?? [],
      traps: result.traps ?? state.traps ?? [],
      creatureActionLogs: [...getAttackLogs(result.logs), ...buffDamageLogs, ...playerBuffDamageLogs],
      creatureTurnInProgress: false,
      activeCreatureId: null,
      operation: { type: 'idle' },
      gameOver: allPlayersDefeated || anyBaseInactive,
      gameOverReason: allPlayersDefeated ? 'all-players-defeated' : anyBaseInactive ? 'any-base-destroyed' : undefined,
    }
    for (const destroyedId of destroyedDefenseIds) {
      triggerState = executeTriggers(triggerState, { type: 'on-object-destroyed', param: destroyedId })
    }

    return triggerState
  })
}
