import type { DefenseStructureState, Position } from '../types'

/**
 * 軍壘：強化自身 3 格（曼哈頓距離）內箭塔／瞭望塔系列設施，HP ×2、箭塔攻擊 ×2。
 *
 * 此效果為**非持久性動態查詢**——不直接改寫 DefenceStructureState 的 health/maxHealth 永久值，
 * 而是當軍壘存活時，於攻擊結算與 HP 檢視即時查詢並套用倍率；軍壘被摧毀後強化自動失效。
 */

export const WARCAMP_BASTION_RADIUS = 3

/** 軍壘所強化的塔類設施型別集合。 */
const BASTION_TARGET_TYPES = new Set([
  'arrow-tower',
  'advanced-arrow-tower',
  'watchtower',
  'advanced-watchtower',
])

function isTowerType(type: DefenseStructureState['type']): boolean {
  return BASTION_TARGET_TYPES.has(type)
}

/** 通用的軍壘查詢：是否存在某活躍軍壘距離 target 3 格內。 */
export function isWithinAnyWarcampBastion(
  defenseStructures: DefenseStructureState[],
  targetPosition: Position,
): boolean {
  return defenseStructures.some(
    (candidate) =>
      candidate.type === 'warcamp-bastion' &&
      candidate.health > 0 &&
      manhattanDistance(candidate.position, targetPosition) <= WARCAMP_BASTION_RADIUS,
  )
}

/** 若該設施是被軍壘強化的塔類，且位於任一活躍軍壘 3 格內，回傳 { hpMultiplier: 2, attackMultiplier: 2 }。 */
export function getBastionMultipliers(
  defenseStructures: DefenseStructureState[],
  structure: DefenseStructureState,
): { hpMultiplier: number; attackMultiplier: number } {
  if (!isTowerType(structure.type)) return { hpMultiplier: 1, attackMultiplier: 1 }
  if (!isWithinAnyWarcampBastion(defenseStructures, structure.position)) return { hpMultiplier: 1, attackMultiplier: 1 }
  // 箭塔／大型箭塔：HP×2、攻擊×2；瞭望塔系列：僅 HP×2。
  const attackMultiplier = structure.type === 'arrow-tower' || structure.type === 'advanced-arrow-tower' ? 2 : 1
  return { hpMultiplier: 2, attackMultiplier }
}

/** 取得設施有效生命（軍壘強化時 ×2 呈現）。 */
export function getEffectiveMaxHealth(
  defenseStructures: DefenseStructureState[],
  structure: DefenseStructureState,
): number {
  const { hpMultiplier } = getBastionMultipliers(defenseStructures, structure)
  return structure.maxHealth * hpMultiplier
}

/** 取得設施有效攻擊力（軍壘強化時 ×2）。 */
export function getEffectiveAttackDamage(
  defenseStructures: DefenseStructureState[],
  structure: DefenseStructureState,
): number {
  const { attackMultiplier } = getBastionMultipliers(defenseStructures, structure)
  return structure.attackDamage * attackMultiplier
}

/** 返回新陣營查詢的巢狀版本：若為軍壘，回傳其 3 格內所有塔類設施位置清單。 */
export function getTowersWithinBastions(
  defenseStructures: DefenseStructureState[],
  bastionPosition: Position,
): DefenseStructureState[] {
  return defenseStructures.filter(
    (candidate) =>
      isTowerType(candidate.type) &&
      manhattanDistance(candidate.position, bastionPosition) <= WARCAMP_BASTION_RADIUS,
  )
}

/** 軍壘建造完成的瞬間：回復其 3 格內所有塔類設施的 HP。回傳新陣列（不可變更新）。 */
export function restoreTowerHealthForBastion(
  defenseStructures: DefenseStructureState[],
  bastionPosition: Position,
): DefenseStructureState[] {
  const towers = new Set(getTowersWithinBastions(defenseStructures, bastionPosition).map((tower) => tower.id))
  return defenseStructures.map((candidate) =>
    towers.has(candidate.id) ? { ...candidate, health: candidate.maxHealth } : candidate,
  )
}

function manhattanDistance(first: Position, second: Position): number {
  return Math.abs(first.row - second.row) + Math.abs(first.column - second.column)
}