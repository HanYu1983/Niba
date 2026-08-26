import type { CreatureState, DefenseStructureState, Position } from '../types'

/**
 * 轟城砲（bombard-cannon）：範圍大殺器。
 * - 超遠距範圍砲擊，對射程（曼哈頓距離）內所有敵軍造成範圍傷害。
 * - 有冷卻：每 N 回合可發射一次，發射後設置 cooldownRemaining。
 *
 * 砲擊掛載於 Creature 回合管線（creatureTurnPipeline），與箭塔同一結算時序。
 */

/** 若砲擊冷卻遞減為 0，回傳新的 defenseStructures 陣列（否則回傳原陣列）。 */
export function countdownBombardCooldowns(defenseStructures: DefenseStructureState[]): DefenseStructureState[] {
  const hasBombard = defenseStructures.some((structure) => structure.type === 'bombard-cannon')
  if (!hasBombard) return defenseStructures
  return defenseStructures.map((structure) =>
    structure.type === 'bombard-cannon' && (structure.cooldownRemaining ?? 0) > 0
      ? { ...structure, cooldownRemaining: (structure.cooldownRemaining ?? 0) - 1 }
      : structure,
  )
}

/**
 * 執行所有可發射轟城砲的範圍砲擊，回傳 { creatures, defenseStructures, logs }。
 * - 只有 cooldownRemaining <= 0 的轟城砲可發射。
 * - 對射程（attackRange）內所有存活敵軍造成 attackDamage 範圍傷害。
 * - 發射後設 cooldownRemaining = cooldownRounds。
 */
export function fireBombardCannons(
  defenseStructures: DefenseStructureState[],
  creatures: CreatureState[],
  round: number,
): { creatures: CreatureState[]; defenseStructures: DefenseStructureState[]; logs: string[] } {
  const cannons = defenseStructures.filter(
    (structure) => structure.type === 'bombard-cannon' && structure.health > 0 && (structure.cooldownRemaining ?? 0) <= 0,
  )
  if (cannons.length === 0) return { creatures, defenseStructures, logs: [] }

  const logs: string[] = []
  let result = defenseStructures
  let damagedCreatures = creatures.map((creature) => ({ ...creature, attributes: { ...creature.attributes } }))

  for (const cannon of cannons) {
    const targets = damagedCreatures.filter(
      (creature) => creature.health > 0 && manhattanDistance(creature.position, cannon.position) <= cannon.attackRange,
    )
    // 冷卻仍遞減（即使本回合沒有目標，也進入冷卻，避免無目標時每回合連發）。
    result = result.map((structure) =>
      structure.id === cannon.id ? { ...structure, cooldownRemaining: cannon.cooldownRounds ?? 0, lastFiredRound: round } : structure,
    )
    if (targets.length === 0) continue
    for (const target of targets) {
      target.health = Math.max(0, target.health - cannon.attackDamage)
    }
    logs.push(`${cannon.name} 砲擊，對 ${targets.length} 個目標造成 ${cannon.attackDamage} 點範圍傷害。`)
  }

  return { creatures: damagedCreatures, defenseStructures: result, logs }
}

function manhattanDistance(first: Position, second: Position): number {
  return Math.abs(first.row - second.row) + Math.abs(first.column - second.column)
}
