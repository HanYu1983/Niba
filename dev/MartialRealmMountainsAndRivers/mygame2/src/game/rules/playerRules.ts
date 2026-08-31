import type { CreatureState, PlayerState } from '../types'
import { getActiveBuffDefinitions, getEffectiveAttributesForPlayer, getPlayerResourceLimit, getStaminaToInnerPowerRatio } from './playerDerivedRules'

export function recoverFivePercent(currentValue: number, maxValue: number): number {
  return Math.min(maxValue, currentValue + Math.max(1, maxValue * 0.05))
}

/** 每 1 點悟性提升的內力回復比例（0.5%）。 */
export const INSIGHT_INNER_POWER_RECOVERY_PER_POINT = 0.005

/** 依悟性計算內力回復比例：基礎 5% + 每點悟性 0.5%。 */
export function getInnerPowerRecoveryRate(player: PlayerState): number {
  const insight = getEffectiveAttributesForPlayer(player).insight
  return 0.05 + insight * INSIGHT_INNER_POWER_RECOVERY_PER_POINT
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
  const maxHealth = getPlayerResourceLimit(withBuffs, 'health')
  const maxStamina = getPlayerResourceLimit(withBuffs, 'stamina')
  const maxInnerPower = getPlayerResourceLimit(withBuffs, 'innerPower')
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
    // 太虛引氣：將回合結束時剩餘體力依比例轉化為內力（1 體力 → N 內力）。
    const staminaToInnerPowerRatio = getStaminaToInnerPowerRatio(updatedPlayer)
    const innerPowerFromStamina = staminaToInnerPowerRatio > 0
      ? updatedPlayer.stamina * staminaToInnerPowerRatio
      : 0
    const innerPowerRecoveryRate = getInnerPowerRecoveryRate(updatedPlayer)
    return {
      ...updatedPlayer,
      stamina: updatedPlayer.maxStamina,
      health: recoverFivePercent(updatedPlayer.health, updatedPlayer.maxHealth),
      innerPower: Math.min(
        updatedPlayer.maxInnerPower,
        updatedPlayer.innerPower + Math.max(1, updatedPlayer.maxInnerPower * innerPowerRecoveryRate) + innerPowerFromStamina,
      ),
      turnEnded: false,
    }
  })
}

/** 回合結束時套用週期性 Buff 效果（傷害與回復），回傳更新後的玩家陣列。 */
export function applyPeriodicBuffEffects(players: PlayerState[]): PlayerState[] {
  return players.map((player) => {
    const effectiveMaxHealth = getPlayerResourceLimit(player, 'health')
    const effectiveMaxInnerPower = getPlayerResourceLimit(player, 'innerPower')

    let damage = 0
    let healthRegen = 0
    let innerPowerRegen = 0
    for (const definition of getActiveBuffDefinitions(player)) {
      const healthDamage = definition.maxHealthDamagePercent ?? 0
      if (healthDamage > 0) damage += effectiveMaxHealth * healthDamage
      const healthRegenPercent = definition.healthRegenPercent ?? 0
      const innerPowerToHealthRegen = definition.innerPowerHealthRegenPercent ?? 0
      const innerPowerRegenPercent = definition.innerPowerRegenPercent ?? 0
      if (healthRegenPercent > 0) healthRegen += effectiveMaxHealth * healthRegenPercent
      if (innerPowerToHealthRegen > 0) healthRegen += effectiveMaxInnerPower * innerPowerToHealthRegen
      if (innerPowerRegenPercent > 0) innerPowerRegen += effectiveMaxInnerPower * innerPowerRegenPercent
    }

    const health = Math.min(effectiveMaxHealth, Math.max(0, player.health - damage + healthRegen))
    const innerPower = Math.min(effectiveMaxInnerPower, player.innerPower + innerPowerRegen)
    const healthChanged = health !== player.health
    const innerPowerChanged = innerPower !== player.innerPower
    return healthChanged || innerPowerChanged ? { ...player, health, innerPower } : player
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
