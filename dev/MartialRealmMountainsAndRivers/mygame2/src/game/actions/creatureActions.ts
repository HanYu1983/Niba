import type {
  BaseState,
  CreatureActionLog,
  CreatureNestState,
  CreatureState,
  DefenseStructureState,
  ExplorationEventState,
  GameState,
  ItemPointState,
  MapState,
  PlayerState,
  Position,
  ResourcePointState,
  RuinState,
  SectGateState,
  TrapState,
} from '../types'
import { isSamePosition } from '../types'
import { uniqueCreaturesById } from '../rules/playerRules'
import { getCreatureAttributes, getCreatureInnerSkillId, getCreatureSchoolId } from '../rules/creatureBehaviorRules'
import { defaultRandomSource, rollChance, type RandomSource } from '../rules/randomRules'
import { runCreatureTurn, type CreatureTurnResult } from './creatureTurnPipeline'

export type { CreatureTurnResult, CreatureTurnStep } from './creatureTurnPipeline'

export type CreatureActionDependencies = {
  createCreatureState: (input: {
    id: string
    name: string
    innerSkillId: string
    level?: number
    position: { row: number; column: number }
    attributes: CreatureState['attributes']
    prestige: number
    money: number
    experience: number
    turnEnded: boolean
    behaviorType?: CreatureState['behaviorType']
    schoolId?: CreatureState['schoolId']
    aggroRange?: number
    homePosition?: Position
    homeNestId?: string
    spawnedRound?: number
  }) => CreatureState
}

/** Creature 回合結果型別已移至 `creatureTurnPipeline`（六段管線），此處轉出口維持相容。 */

/** 巢穴每回合結束時的基礎生成機率。 */
export const NEST_SPAWN_BASE_CHANCE = 0.1
/** 每回合結束時生成機率的增加量。 */
export const NEST_SPAWN_CHANCE_INCREMENT = 0.005
/** 巢穴生成機率上限。 */
export const NEST_SPAWN_CHANCE_CAP = 0.3
/** 每次生成後機率的減少量。 */
export const NEST_SPAWN_CHANCE_DECREMENT = 0.05
/** 巢穴生成機率下限。 */
export const NEST_SPAWN_CHANCE_FLOOR = 0.1
/** 生成後的冷卻回合數。 */
export const NEST_SPAWN_COOLDOWN_ROUNDS = 3
/** 巢穴基礎最大生命（Lv.1）。 */
export const NEST_BASE_MAX_HEALTH = 120
/** 巢穴每升一級最大生命的成長比例（+10%）。 */
export const NEST_MAX_HEALTH_GROWTH_PER_LEVEL = 0.1
/** 巢穴每回合回復的最大生命比例（+2%）。 */
export const NEST_HEALTH_REGEN_PER_ROUND = 0.02

/** 依巢穴等級計算最大生命：Lv.1 = 120，每級 +10%。 */
export function getNestMaxHealth(level: number): number {
  return Math.floor(NEST_BASE_MAX_HEALTH * Math.pow(1 + NEST_MAX_HEALTH_GROWTH_PER_LEVEL, level - 1))
}

export function spawnCreaturesFromNests(
  nests: CreatureNestState[],
  creatures: CreatureState[],
  map: MapState,
  players: PlayerState[],
  bases: BaseState[],
  round: number,
  dependencies: CreatureActionDependencies,
  blockedPositions: Position[] = [],
): { nests: CreatureNestState[]; creatures: CreatureState[]; logs: CreatureActionLog[] } {
  const occupied = [
    ...blockedPositions,
    ...players.map((player) => player.position),
    ...bases.map((base) => base.position),
    ...nests.map((nest) => nest.position),
    ...creatures.map((creature) => creature.position),
  ]
  const nextCreatures = uniqueCreaturesById(creatures)
  const logs: CreatureActionLog[] = []
  const usedCreatureIds = new Set(nextCreatures.map((creature) => creature.id))
  let nextId = 1

  const getNextCreatureId = () => {
    let candidate = `nest-creature-${nextId}`
    while (usedCreatureIds.has(candidate)) {
      nextId += 1
      candidate = `nest-creature-${nextId}`
    }
    usedCreatureIds.add(candidate)
    nextId += 1
    return candidate
  }

  const nextNests = nests.map((nest) => {
    // 每回合回復 2% 最大生命（上限為最大生命）。
    const regenHealth = Math.min(nest.maxHealth, nest.health + Math.floor(nest.maxHealth * NEST_HEALTH_REGEN_PER_ROUND))

    // 規則 2：生成後有 3 回合冷卻，冷卻期間不生成。
    if (nest.cooldownRounds > 0) {
      return {
        ...nest,
        health: regenHealth,
        // 規則 3：每回合結束生成機率 +0.5%（冷卻期間仍累加），上限 30%。
        spawnChance: Math.min(NEST_SPAWN_CHANCE_CAP, nest.spawnChance + NEST_SPAWN_CHANCE_INCREMENT),
        cooldownRounds: nest.cooldownRounds - 1,
      }
    }

    // 規則 3：每回合結束生成機率 +0.5%，上限 30%。
    const spawnChance = Math.min(NEST_SPAWN_CHANCE_CAP, nest.spawnChance + NEST_SPAWN_CHANCE_INCREMENT)
    // 規則 1：每回合結束有 spawnChance 機率生成。
    const shouldSpawn = rollChance(spawnChance, defaultRandomSource)

    if (!shouldSpawn) {
      return { ...nest, health: regenHealth, spawnChance }
    }

    const spawnPosition = map.cells
      .filter((cell) => cell.terrain !== 'wall')
      .map((cell) => ({
        position: { row: cell.row, column: cell.column },
        distance: Math.abs(cell.row - nest.position.row) + Math.abs(cell.column - nest.position.column),
      }))
      .filter(({ position, distance }) =>
        distance <= 2 && distance > 0 && !occupied.some((occupiedPosition) => isSamePosition(occupiedPosition, position)),
      )
      .sort((first, second) => first.distance - second.distance)[0]?.position

    if (!spawnPosition) {
      return { ...nest, health: regenHealth, spawnChance }
    }

    const level = nest.spawnLevel
    const finalSchoolId = getCreatureSchoolId(nest)
    const finalBehavior = nest.behaviorType ?? 'scavenger'
    nextCreatures.push(dependencies.createCreatureState({
      id: getNextCreatureId(),
      name: `${nest.name}的怪物 Lv.${level}`,
      innerSkillId: getCreatureInnerSkillId({ schoolId: finalSchoolId }, level),
      position: spawnPosition,
      attributes: getCreatureAttributes({
        armStrength: 4,
        constitution: 4,
        agility: 4,
        innerEnergy: 4,
        insight: 4,
      }, { schoolId: finalSchoolId, behaviorType: finalBehavior }, level),
      prestige: 0,
      money: 0,
      experience: 0,
      turnEnded: false,
      level,
      behaviorType: finalBehavior,
      schoolId: finalSchoolId,
      homePosition: nest.position,
      homeNestId: nest.id,
      spawnedRound: round,
    }))
    occupied.push(spawnPosition)
    logs.push({
      creatureId: nest.id,
      creatureName: nest.name,
      message: `${nest.name} 生成了 Lv.${level} 怪物。`,
    })

    const nextLevel = level + 1
    return {
      ...nest,
      // 每回合回復 2% 最大生命。
      health: regenHealth,
      // 升級：最大生命依等級成長（+10%），保留已受傷害（health 不變）。
      maxHealth: getNestMaxHealth(nextLevel),
      // 規則 2：生成後進入 3 回合冷卻。
      cooldownRounds: NEST_SPAWN_COOLDOWN_ROUNDS,
      // 規則 5：每次生成後機率 -5%，最低不低於 10%。
      spawnChance: Math.max(NEST_SPAWN_CHANCE_FLOOR, spawnChance - NEST_SPAWN_CHANCE_DECREMENT),
      spawnLevel: nextLevel,
    }
  })

  return { nests: nextNests, creatures: uniqueCreaturesById(nextCreatures), logs }
}

/**
 * Creature 回合入口（行為契約不變，內部已拆為六段管線：perceive／select／plan／validate／execute／reduce，
 * 見 `creatureTurnPipeline.ts`；重構文件 §12 Phase 2）。
 *
 * 隨機來源注入：巡邏與攻擊閃避/減傷 roll 都經此參數，測試可傳固定偽隨機重現（重構文件 §5.4）。
 */
export function moveCreatures(
  creatures: CreatureState[],
  map: MapState,
  players: PlayerState[],
  bases: BaseState[],
  resourcePoints: ResourcePointState[],
  defenseStructures: DefenseStructureState[],
  itemPoints: ItemPointState[],
  explorationEvents: ExplorationEventState[],
  nests: CreatureNestState[] = [],
  ruins: RuinState[] = [],
  traps: TrapState[] = [],
  sectGates: SectGateState[] = [],
  globalBuffs: GameState['globalBuffs'] = [],
  randomSource: RandomSource = defaultRandomSource,
): CreatureTurnResult {
  return runCreatureTurn({
    creatures,
    map,
    players,
    bases,
    resourcePoints,
    defenseStructures,
    itemPoints,
    explorationEvents,
    nests,
    ruins,
    traps,
    sectGates,
    globalBuffs,
    randomSource,
  })
}

