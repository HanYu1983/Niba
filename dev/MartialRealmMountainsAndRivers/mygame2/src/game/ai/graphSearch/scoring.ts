import type { GameState, PlayerState, CreatureState, CreatureNestState } from '../../types'
import { getEffectiveAttributesForPlayer, getEffectiveAttributesForCreature } from '../../rules/playerDerivedRules'

/**
 * Tier 位階分數計算（V3 §5.1）。
 * 返回 0~1.5 的分數。
 */

export function getTierScore(tier: number): number {
  return Math.max(0, Math.min(1.5, tier / 10))
}

/** 計算玩家對敵人的粗估攻擊力。 */
export function getPlayerAttackPower(state: GameState, playerId: string): number {
  const player = state.players.find((p) => p.id === playerId)
  if (!player) return 0
  const attrs = getEffectiveAttributesForPlayer(player)
  return Math.max(1, Math.floor(attrs.armStrength * 1.5))
}

/** 計算敵人的最大攻擊力（粗估：0.3 × maxHealth）。 */
export function getEnemyMaxDamage(enemy: { health: number; maxHealth: number }): number {
  return Math.max(1, Math.floor(enemy.maxHealth * 0.3))
}

/** 判斷本回合击殺可行性：傷害 ≥ 敵人血量 且 體力夠攻擊。 */
export function canKillThisTurn(
  state: GameState,
  playerId: string,
  enemy: { health: number; maxHealth: number; position: { row: number; column: number } },
  remainingStamina: number,
): boolean {
  const attackCost = 5 // ACTION_STAMINA_COSTS.attack
  if (remainingStamina < attackCost) return false
  const attackPower = getPlayerAttackPower(state, playerId)
  return attackPower >= enemy.health
}

/** 取得玩家有效五維。 */
export function getEffectiveAttrs(player: PlayerState) {
  return getEffectiveAttributesForPlayer(player)
}

/** 取得怪物有效五維。 */
export function getEffectiveCreatureAttrs(creature: CreatureState, terrain?: import('../../types').TerrainType) {
  return getEffectiveAttributesForCreature(creature, terrain)
}

/** 計算玩家對敵人的粗估傷害（含減傷）。 */
export function estimateDamageToEnemy(
  state: GameState,
  playerId: string,
  enemy: CreatureState | CreatureNestState,
): number {
  const attackPower = getPlayerAttackPower(state, playerId)
  const enemyAttrs = 'behaviorType' in enemy
    ? getEffectiveAttributesForCreature(enemy as CreatureState)
    : { constitution: 5, armStrength: 3 }
  const defense = Math.max(1, Math.floor(enemyAttrs.constitution * 0.5))
  return Math.max(1, attackPower - defense)
}
