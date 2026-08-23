import type { CreatureState, PlayerState } from '../types'
import { getActiveBuffDefinitions, getEffectiveAttributesForPlayer } from './playerDerivedRules'
import { getMaxHealth, getMaxInnerPower, getMaxStamina } from './playerStatsRules'

export function recoverFivePercent(currentValue: number, maxValue: number): number {
  return Math.min(maxValue, currentValue + Math.max(1, Math.floor(maxValue * 0.05)))
}

/** 回合結束時，減少有限回合 Buff 的剩餘回合數，過期的 Buff 會被移除。 */
export function tickPlayerBuffs(player: PlayerState): PlayerState {
  const buffs = (player.buffs ?? [])
    .map((buff) => {
      if (buff.remainingRounds === null) return buff
      return { ...buff, remainingRounds: buff.remainingRounds - 1 }
    })
    .filter((buff) => buff.remainingRounds === null || buff.remainingRounds > 0)

  const withBuffs = { ...player, buffs }
  const effectiveAttributes = getEffectiveAttributesForPlayer(withBuffs)
  const maxHealth = getMaxHealth(effectiveAttributes)
  const maxStamina = getMaxStamina(effectiveAttributes)
  const maxInnerPower = getMaxInnerPower(effectiveAttributes)
  return {
    ...withBuffs,
    maxHealth,
    maxStamina,
    maxInnerPower,
    health: Math.min(player.health, maxHealth),
    stamina: Math.min(player.stamina, maxStamina),
    innerPower: Math.min(player.innerPower, maxInnerPower),
  }
}

export function recoverLivingPlayers(players: PlayerState[]): PlayerState[] {
  return players.map((player) => {
    if (player.health <= 0) return { ...player, health: 0, stamina: 0, innerPower: 0, turnEnded: true }
    const updatedPlayer = tickPlayerBuffs(player)
    return {
      ...updatedPlayer,
      stamina: updatedPlayer.maxStamina,
      health: recoverFivePercent(updatedPlayer.health, updatedPlayer.maxHealth),
      innerPower: recoverFivePercent(updatedPlayer.innerPower, updatedPlayer.maxInnerPower),
      turnEnded: false,
    }
  })
}

/** 回合結束時套用週期性 Buff 效果（傷害與回復），回傳更新後的玩家陣列。 */
export function applyPeriodicBuffEffects(players: PlayerState[]): PlayerState[] {
  return players.map((player) => {
    const effectiveAttributes = getEffectiveAttributesForPlayer(player)
    const effectiveMaxHealth = getMaxHealth(effectiveAttributes)
    const effectiveMaxStamina = getMaxStamina(effectiveAttributes)
    const effectiveMaxInnerPower = getMaxInnerPower(effectiveAttributes)

    let damage = 0
    let regen = 0
    let staminaRegen = 0
    let innerPowerRegen = 0
    for (const definition of getActiveBuffDefinitions(player)) {
      const healthDamage = definition.maxHealthDamagePercent ?? 0
      if (healthDamage > 0) damage += Math.floor(effectiveMaxHealth * healthDamage)
      const healthRegen = definition.healthRegenPercent ?? 0
      const innerPowerHealthRegen = definition.innerPowerHealthRegenPercent ?? 0
      if (healthRegen > 0) regen += Math.floor(effectiveMaxHealth * healthRegen)
      if (innerPowerHealthRegen > 0) regen += Math.floor(effectiveMaxInnerPower * innerPowerHealthRegen)
      const staminaRegenPercent = definition.staminaRegenPercent ?? 0
      if (staminaRegenPercent > 0) staminaRegen += Math.floor(effectiveMaxStamina * staminaRegenPercent)
      const innerPowerRegenPercent = definition.innerPowerRegenPercent ?? 0
      if (innerPowerRegenPercent > 0) innerPowerRegen += Math.floor(effectiveMaxInnerPower * innerPowerRegenPercent)
    }

    const health = Math.min(effectiveMaxHealth, Math.max(0, player.health - damage + regen))
    const stamina = Math.min(effectiveMaxStamina, player.stamina + staminaRegen)
    const innerPower = Math.min(effectiveMaxInnerPower, player.innerPower + innerPowerRegen)
    if (health === player.health && stamina === player.stamina && innerPower === player.innerPower) return player
    return { ...player, health, stamina, innerPower }
  })
}

/** @deprecated 請使用 {@link applyPeriodicBuffEffects}。 */
export const applyPeriodicBuffDamage = applyPeriodicBuffEffects

export function calculateDamage(attackPower: number, defensePower: number): number {
  return Math.max(1, attackPower - defensePower)
}

export function uniqueCreaturesById(creatures: CreatureState[]): CreatureState[] {
  const seen = new Set<string>()
  return creatures.filter((creature) => {
    if (seen.has(creature.id)) return false
    seen.add(creature.id)
    return true
  })
}
