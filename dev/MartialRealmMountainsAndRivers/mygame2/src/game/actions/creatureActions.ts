import type {
  BaseState,
  BuffInstance,
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
import { isAdjacent, isSamePosition } from '../types'
import { uniqueCreaturesById } from '../rules/playerRules'
import { getActiveBuffsForPlayer, getBuff, canTraverseTerrain, getCreatureDamageDealtPercent, getDamageReductionPercent, getEffectiveAttributesForCreature, getCreatureTerrainStaminaCost, getEvasionRate, getLifestealPercent } from '../rules/playerDerivedRules'
import { reduceEquipmentDurability } from '../rules/equipmentRules'
import { getCreatureAttributes, getCreatureInnerSkillId, getCreatureSchoolId, selectCreatureTarget } from '../rules/creatureBehaviorRules'
import { getInnerSkill, getSkillDamage, getSkillEffectMultiplier, getSkillProgression } from '../rules/skillRules'
import { getGlobalBaseDefenseMultiplier } from '../rules/globalBuffRules'
import { hasActivePolicy, MILITARY_DEFENSE_REDUCTION } from '../rules/policyRules'
import { defaultRandomSource, rollChance, type RandomSource } from '../rules/randomRules'

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

/** Creature 回合計算與逐隻動畫共用的結果協定。 */
export type CreatureTurnResult = {
  creatures: CreatureState[]
  players: PlayerState[]
  bases?: BaseState[]
  resourcePoints: ResourcePointState[]
  itemPoints?: ItemPointState[]
  explorationEvents?: ExplorationEventState[]
  defenseStructures?: DefenseStructureState[]
  ruins?: RuinState[]
  traps?: TrapState[]
  logs: CreatureActionLog[]
  steps?: CreatureTurnStep[]
}

export type CreatureTurnStep = {
  creature: CreatureState
  players: PlayerState[]
  bases?: BaseState[]
  resourcePoints: ResourcePointState[]
  itemPoints?: ItemPointState[]
  explorationEvents?: ExplorationEventState[]
  defenseStructures: DefenseStructureState[]
  ruins?: RuinState[]
  traps?: TrapState[]
  logs: CreatureActionLog[]
}

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
  // 隨機來源注入：巡邏與攻擊閃避/減傷 roll 都經此參數，測試可傳固定偽隨機重現（重構文件 §5.4）。
  randomSource: RandomSource = defaultRandomSource,
): CreatureTurnResult {
  const hasValidPosition = (value: { position?: Position } | null | undefined): value is { position: Position } => {
    const position = value?.position
    return Boolean(position && Number.isFinite(position.row) && Number.isFinite(position.column))
  }
  const logs: CreatureActionLog[] = []
  const steps: CreatureTurnStep[] = []
  let nextPlayers = players
  let nextBases = bases
  let nextResourcePoints = resourcePoints
  let nextItemPoints = itemPoints
  let nextExplorationEvents = explorationEvents
  let nextDefenseStructures = defenseStructures
  let nextRuins = ruins
  let nextTraps = traps
  const directions = [{ row: -1, column: 0 }, { row: 1, column: 0 }, { row: 0, column: -1 }, { row: 0, column: 1 }]
  const occupiedByBases = bases.map((base) => base.position)
  const occupiedByCreatureNests = nests.map((nest) => nest.position)
  const occupiedByItemPoints: Position[] = []
  const occupiedByExplorationEvents: Position[] = []
  const occupiedByRuins = ruins.filter((ruin) => ruin.status === 'intact').map((ruin) => ruin.position)
  const occupiedBySectGates = sectGates.map((gate) => gate.position)
  const occupiedByCreatures = new Map(creatures.map((creature) => [creature.id, creature.position]))
  const reflectedDamageByCreatureId = new Map<string, number>()
  const getDefensePositions = () => nextDefenseStructures.map((structure) => structure.position)

  const triggerTrap = (creature: CreatureState, position: Position): boolean => {
    const steppedTrap = nextTraps.find((trap) => isSamePosition(trap.position, position))
    if (!steppedTrap) return false

    nextTraps = nextTraps.filter((trap) => trap.id !== steppedTrap.id)
    if (steppedTrap.type === 'snare') {
      const trapDamage = Math.max(1, steppedTrap.damage ?? 15)
      creature.health = Math.max(0, creature.health - trapDamage)
      logs.push({ creatureId: creature.id, creatureName: creature.name, message: `${creature.name} 踩中絆馬索，受到 ${trapDamage} 點傷害。` })
    } else {
      const durationRounds = getBuff('trap-immobilize')?.durationRounds ?? 3
      const immobilizeBuff: BuffInstance = {
        id: `trap:${steppedTrap.id}:${Date.now()}`,
        definitionId: 'trap-immobilize',
        sourceId: steppedTrap.id,
        remainingRounds: durationRounds,
      }
      creature.buffs = [...(creature.buffs ?? []), immobilizeBuff]
      logs.push({ creatureId: creature.id, creatureName: creature.name, message: `${creature.name} 踩中定身索，被定身 ${durationRounds} 回合。` })
    }
    return true
  }

  // 舊存檔或異常資料可能缺少 position；忽略該筆資料，避免怪物回合崩潰。
  const damagedCreatures = creatures.filter(hasValidPosition).map((creature) => ({ ...creature, attributes: { ...creature.attributes } }))
  for (const tower of defenseStructures.filter((structure) =>
    hasValidPosition(structure) && (structure.type === 'arrow-tower' || structure.type === 'advanced-arrow-tower' || structure.type === 'small-arrow-tower'),
  )) {
    const target = damagedCreatures
      .filter((creature) => creature.health > 0 && hasValidPosition(creature))
      .map((creature) => ({ creature, distance: Math.abs(creature.position.row - tower.position.row) + Math.abs(creature.position.column - tower.position.column) }))
      .filter(({ distance }) => distance <= tower.attackRange)
      .sort((first, second) => first.distance - second.distance)[0]?.creature
    if (!target) continue
    target.health = Math.max(0, target.health - tower.attackDamage)
    logs.push({ creatureId: target.id, creatureName: target.name, message: `${tower.name} 攻擊 ${target.name}，造成 ${tower.attackDamage} 點傷害${target.health === 0 ? '並將其擊敗' : ''}。` })
  }

  const survivingCreatures = damagedCreatures.filter((creature) => creature.health > 0)
  const aliveIds = new Set(survivingCreatures.map((creature) => creature.id))
  for (const creatureId of [...occupiedByCreatures.keys()]) if (!aliveIds.has(creatureId)) occupiedByCreatures.delete(creatureId)
  const occupiedByOtherCreature = (id: string, position: Position) => [...occupiedByCreatures.entries()].some(([currentId, currentPosition]) => currentId !== id && isSamePosition(currentPosition, position))
  const canOccupy = (creature: CreatureState, position: Position) => {
    const cell = map.cells.find((candidate) => candidate.row === position.row && candidate.column === position.column)
    return Boolean(cell)
      && canTraverseTerrain(cell!.terrain, creature)
      && !nextPlayers.some((player) => isSamePosition(player.position, position))
      && !occupiedByBases.some((occupied) => isSamePosition(occupied, position))
      && !occupiedByCreatureNests.some((occupied) => isSamePosition(occupied, position))
      && !occupiedByItemPoints.some((occupied) => isSamePosition(occupied, position))
      && !occupiedByExplorationEvents.some((occupied) => isSamePosition(occupied, position))
      && !occupiedByRuins.some((occupied) => isSamePosition(occupied, position))
      && !occupiedBySectGates.some((occupied) => isSamePosition(occupied, position))
      && !getDefensePositions().some((occupied) => isSamePosition(occupied, position))
  }

  const nextCreatures = survivingCreatures.map((creature) => {
    const target = selectCreatureTarget({
      map,
      bases: nextBases,
      defenseStructures: nextDefenseStructures,
      creatureNests: [],
      resourcePoints: nextResourcePoints,
      itemPoints,
      explorationEvents,
      players: nextPlayers,
      creatures: survivingCreatures,
      activePlayerId: nextPlayers[0]?.id ?? '',
      round: 0,
      creatureActionLogs: [],
      attackPreview: null,
      externalSkillPreview: null,
      creatureTurnInProgress: false,
      activeCreatureId: null,
      operation: { type: 'idle' },
      blockingModal: null,
    }, creature)
    const playerTarget = target?.type === 'player' ? target.player : undefined
    const resourceTarget = target?.type === 'resource' ? target.resourcePoint : undefined
    const itemTarget = target?.type === 'item' ? target.itemPoint : undefined
    const baseTarget = target?.type === 'base' ? target.base : undefined
    const defenseTarget = target?.type === 'defense' ? target.defenseStructure : undefined
    const targetPosition = target?.position
    const targetName = playerTarget?.name ?? resourceTarget?.name ?? itemTarget?.id ?? baseTarget?.name ?? defenseTarget?.name
    let position = creature.position
    let remainingStamina = creature.maxStamina
    let moved = false
    let blocked = false

    // 定身（immobilized）：持有此 Buff 的怪物本回合跳過移動。
    const isImmobilized = getActiveBuffsForPlayer(creature)
      .some((buff) => getBuff(buff.definitionId)?.immobilized)

    if (targetPosition && !isImmobilized) {
      const stoppingDistance = itemTarget ? 0 : 1
      while (Math.abs(position.row - targetPosition.row) + Math.abs(position.column - targetPosition.column) > stoppingDistance) {
        const candidates = directions.map((direction) => ({ row: position.row + direction.row, column: position.column + direction.column }))
          .filter((candidate) => canOccupy(creature, candidate) && !occupiedByOtherCreature(creature.id, candidate))
          .map((candidate) => {
            const cell = map.cells.find((current) => current.row === candidate.row && current.column === candidate.column)
            return { position: candidate, cost: cell ? getCreatureTerrainStaminaCost(creature, cell.terrain) : Infinity, distance: Math.abs(targetPosition.row - candidate.row) + Math.abs(targetPosition.column - candidate.column) }
          }).filter((candidate) => candidate.cost <= remainingStamina).sort((first, second) => first.distance - second.distance)
        const nextStep = candidates[0]
        if (!nextStep) { blocked = true; break }
        position = nextStep.position
        remainingStamina -= nextStep.cost
        moved = true
        if (triggerTrap(creature, position)) break
      }
    } else if (!isImmobilized) {
      while (remainingStamina > 0) {
        const candidates = directions.map((direction) => ({ row: position.row + direction.row, column: position.column + direction.column }))
          .filter((candidate) => canOccupy(creature, candidate) && !occupiedByOtherCreature(creature.id, candidate))
          .map((candidate) => {
            const cell = map.cells.find((current) => current.row === candidate.row && current.column === candidate.column)
            return { position: candidate, cost: cell ? getCreatureTerrainStaminaCost(creature, cell.terrain) : Infinity }
          }).filter((candidate) => candidate.cost <= remainingStamina)
        const patrolStep = candidates[Math.floor(randomSource() * candidates.length)]
        if (!patrolStep) break
        position = patrolStep.position
        remainingStamina -= patrolStep.cost
        moved = true
        if (triggerTrap(creature, position)) break
        occupiedByCreatures.set(creature.id, position)
      }
    }

    const adjacentResource = resourceTarget && (
      isAdjacent(position, resourceTarget.position) || isSamePosition(position, resourceTarget.position)
    ) ? nextResourcePoints.find((point) => point.id === resourceTarget.id) : undefined
    const reachedItem = itemTarget && isSamePosition(position, itemTarget.position) ? nextItemPoints.find((point) => point.id === itemTarget.id) : undefined
    const adjacentPlayer = playerTarget && isAdjacent(position, playerTarget.position) ? nextPlayers.find((player) => player.id === playerTarget.id && player.health > 0) : undefined
    const adjacentBase = baseTarget && isAdjacent(position, baseTarget.position) ? nextBases.find((base) => base.id === baseTarget.id && base.health > 0) : undefined
    const adjacentDefense = (defenseTarget && isAdjacent(position, defenseTarget.position)
          ? nextDefenseStructures.find((structure) => structure.id === defenseTarget.id && structure.health > 0)
          : blocked ? nextDefenseStructures.find((structure) => structure.health > 0 && isAdjacent(position, structure.position)) : undefined)
    // 僅吃掉「可被生物吃掉」的道具點（eatableByCreatures !== false）；劇本模式預設 false＝不可被吃掉。
    if (reachedItem && reachedItem.eatableByCreatures !== false) {
      nextItemPoints = nextItemPoints.filter((point) => point.id !== reachedItem.id)
      logs.push({ creatureId: creature.id, creatureName: creature.name, message: `${creature.name} 吃掉了道具點。` })
    } else if (adjacentBase) {
      const rawDamage = Math.max(1, creature.attributes.armStrength - 2)
      // 據點承傷加成：軍事政策（-5%）與全局靈氣「城防堅固」相乘。
      const defenseOrState = { bases: nextBases, globalBuffs } as GameState
      const globalDefenseMultiplier = getGlobalBaseDefenseMultiplier(defenseOrState)
      const militaryReduction = hasActivePolicy(adjacentBase, 'military') ? MILITARY_DEFENSE_REDUCTION : 0
      const damage = Math.max(1, Math.round(rawDamage * globalDefenseMultiplier * (1 - militaryReduction)))
      const health = Math.max(0, adjacentBase.health - damage)
      nextBases = nextBases.map((base) => base.id === adjacentBase.id ? { ...base, health, active: health > 0 } : base)
      // 說明減傷來源（如有）。
      const reductions: string[] = []
      if (militaryReduction > 0) reductions.push('軍事政策')
      if (globalDefenseMultiplier < 1) reductions.push('城防堅固')
      const reducedNote = reductions.length > 0 ? `（傷害因${reductions.join('、')}降低）` : ''
      logs.push({ creatureId: creature.id, creatureName: creature.name, message: `${creature.name} 攻擊${adjacentBase.name}，造成 ${damage} 點傷害${health === 0 ? '並將其摧毀' : ''}${reducedNote}。` })
    } else if (adjacentResource) {
      const damage = Math.max(1, creature.attributes.armStrength - 2)
      const health = Math.max(0, adjacentResource.health - damage)
      nextResourcePoints = nextResourcePoints.map((point) => point.id === adjacentResource.id
        ? { ...point, health, active: health > 0 }
        : point)
      logs.push({ creatureId: creature.id, creatureName: creature.name, message: health <= 0 ? `${creature.name} 摧毀了${adjacentResource.name}。` : `${creature.name} 攻擊${adjacentResource.name}，造成 ${damage} 點傷害。` })
    } else if (adjacentPlayer) {
      const creatureTerrain = map.cells.find((cell) => cell.row === creature.position.row && cell.column === creature.position.column)?.terrain
      const creatureAttributes = getEffectiveAttributesForCreature(creature, creatureTerrain)
      const innerSkill = getInnerSkill(creature.innerSkillId)
      const innerSkillLevel = getSkillProgression(creature, innerSkill.id).level
      const baseDamage = Math.max(1, Math.floor(
        getSkillDamage(creatureAttributes, innerSkill, innerSkillLevel) * getSkillEffectMultiplier(creature),
      ))
      const avoided = rollChance(Math.min(1, getEvasionRate(adjacentPlayer) / 100), randomSource)
      const halved = !avoided && rollChance(Math.min(1, adjacentPlayer.attributes.constitution * 2 / 100), randomSource)
      const rawDamage = avoided ? 0 : halved ? Math.max(1, Math.floor(baseDamage / 2)) : baseDamage
      // 破軍訣：普通攻擊造成的最終傷害 +%（怪物攻擊玩家屬普攻）
      const damage = avoided
        ? 0
        : Math.max(1, Math.floor(rawDamage * (1 + getCreatureDamageDealtPercent(creature, creatureTerrain))))
      const actualDamage = Math.min(adjacentPlayer.health, damage)
      // 鐵壁訣：玩家受到傷害時最終傷害 -%（方案 A：只影響玩家損血，反震仍基於 actualDamage）
      const reduction = getDamageReductionPercent(adjacentPlayer)
      const finalDamage = actualDamage <= 0 ? 0 : Math.max(1, Math.floor(actualDamage * (1 - reduction)))
      nextPlayers = nextPlayers.map((player) => player.id === adjacentPlayer.id ? { ...reduceEquipmentDurability(reduceEquipmentDurability(player, 'armor', 1), 'accessory', 0.5), health: Math.max(0, player.health - finalDamage) } : player)
      // 嗜血：怪物造成傷害時回復血量
      const lifestealHeal = Math.floor(actualDamage * getLifestealPercent(creature))
      if (lifestealHeal > 0) {
        creature.health = Math.min(creature.maxHealth, creature.health + lifestealHeal)
      }
      const reflectionPercent = getActiveBuffsForPlayer(adjacentPlayer)
        .reduce((total, buff) => total + (getBuff(buff.definitionId)?.reflectionPercent ?? 0), 0)
      if (reflectionPercent > 0 && actualDamage > 0) {
        const reflectedDamage = actualDamage * reflectionPercent
        reflectedDamageByCreatureId.set(creature.id, reflectedDamage)
        logs.push({ creatureId: adjacentPlayer.id, creatureName: adjacentPlayer.name, message: `${adjacentPlayer.name} 的反震對 ${creature.name} 造成 ${reflectedDamage} 點傷害。` })
      }
      logs.push({ creatureId: creature.id, creatureName: creature.name, message: `${creature.name} 攻擊 ${adjacentPlayer.name}，${avoided ? '被閃避。' : halved ? `造成 ${damage} 點傷害（根骨減傷）。` : `造成 ${damage} 點傷害。`}` })
    } else if (adjacentDefense) {
      const damage = Math.max(1, creature.attributes.armStrength - 2)
      const health = Math.max(0, adjacentDefense.health - damage)
      if (health === 0) {
        nextDefenseStructures = nextDefenseStructures.filter((structure) => structure.id !== adjacentDefense.id)
        // 被怪物摧毀的防禦設施直接從地圖消失；
        // 若是由廢墟修復而成，連同對應的已修復廢墟一併移除，不留廢墟點。
        if (adjacentDefense.originName) {
          nextRuins = nextRuins.filter((ruin) =>
            !(ruin.position.row === adjacentDefense.position.row && ruin.position.column === adjacentDefense.position.column),
          )
        }
      } else {
        nextDefenseStructures = nextDefenseStructures.map((structure) => structure.id === adjacentDefense.id ? { ...structure, health } : structure)
      }
      logs.push({ creatureId: creature.id, creatureName: creature.name, message: health === 0 ? `${creature.name} 攻擊${adjacentDefense.name}，造成 ${damage} 點傷害並將其摧毀。` : `${creature.name} 攻擊${adjacentDefense.name}，造成 ${damage} 點傷害。` })
    } else if (moved && targetPosition) {
      logs.push({ creatureId: creature.id, creatureName: creature.name, message: `${creature.name} 朝 ${targetName} 移動到 (${position.row + 1}, ${position.column + 1})。` })
    }

    occupiedByCreatures.set(creature.id, position)
    // 僅吃掉「可被生物吃掉」的道具點（eatableByCreatures !== false）；劇本模式預設 false＝不可被吃掉。
    const removedItemPoint = nextItemPoints.find(
      (point) => point.eatableByCreatures !== false && isSamePosition(point.position, position),
    ) ?? null
    // 僅吃掉「可被生物吃掉」的探索事件點（eatableByCreatures !== false）；劇本模式預設 false＝不可被吃掉。
    const removedEvent = nextExplorationEvents.find(
      (event) => event.eatableByCreatures !== false && isSamePosition(event.position, position),
    ) ?? null
    if (removedItemPoint) {
      nextItemPoints = nextItemPoints.filter((point) => point.id !== removedItemPoint.id)
      logs.push({ creatureId: creature.id, creatureName: creature.name, message: `${creature.name} 發現並摧毀了道具點。` })
    }
    if (removedEvent) {
      nextExplorationEvents = nextExplorationEvents.filter((event) => event.id !== removedEvent.id)
      logs.push({ creatureId: creature.id, creatureName: creature.name, message: `${creature.name} 使探索事件「${removedEvent.name}」消失。` })
    }
    const reflectedDamage = reflectedDamageByCreatureId.get(creature.id) ?? 0
    const nextCreature = {
      ...creature,
      position,
      stamina: remainingStamina,
      health: Math.max(0, creature.health - reflectedDamage),
      turnEnded: true,
    }
    steps.push({ creature: nextCreature, players: nextPlayers, bases: nextBases, resourcePoints: nextResourcePoints, itemPoints: nextItemPoints, explorationEvents: nextExplorationEvents, defenseStructures: nextDefenseStructures, ruins: nextRuins, traps: nextTraps, logs: logs.slice() })
    return nextCreature
  })
  const survivingAfterReflection = nextCreatures.filter((creature) => creature.health > 0)
  return { creatures: uniqueCreaturesById(survivingAfterReflection), players: nextPlayers, bases: nextBases, resourcePoints: nextResourcePoints, itemPoints: nextItemPoints, explorationEvents: nextExplorationEvents, defenseStructures: nextDefenseStructures, ruins: nextRuins, traps: nextTraps, logs, steps }
}
