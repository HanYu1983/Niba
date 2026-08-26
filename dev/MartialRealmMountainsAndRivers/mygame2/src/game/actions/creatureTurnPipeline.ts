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
import { getBastionMultipliers, getEffectiveAttackDamage } from '../rules/defenseBastionRules'
import { countdownBombardCooldowns, fireBombardCannons } from '../rules/bombardCannonRules'
import { uniqueCreaturesById } from '../rules/playerRules'
import {
  getActiveBuffsForPlayer,
  getBuff,
  canTraverseTerrain,
  getCreatureDamageDealtPercent,
  getDamageReductionPercent,
  getEffectiveAttributesForCreature,
  getCreatureTerrainStaminaCost,
  getEvasionRate,
  getLifestealPercent,
} from '../rules/playerDerivedRules'
import { reduceEquipmentDurability } from '../rules/equipmentRules'
import { selectCreatureTarget } from '../rules/creatureBehaviorRules'
import { getInnerSkill, getSkillDamage, getSkillEffectMultiplier, getSkillProgression } from '../rules/skillRules'
import { getGlobalBaseDefenseMultiplier } from '../rules/globalBuffRules'
import { hasActivePolicy, MILITARY_DEFENSE_REDUCTION } from '../rules/policyRules'
import { defaultRandomSource, rollChance, type RandomSource } from '../rules/randomRules'
import { createAiActionEvent, type AiActionEvent } from '../ai/aiActionEvent'
import type { AiTargetKind } from '../ai/aiAction'
import { manhattanDistance } from '../ai/perception/distance'

/** Creature 回合計算與逐隻動畫共用的結果協定（維持與舊 moveCreatures 相容）。 */
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
  events?: AiActionEvent[]
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

/** 六段管線共用的回合情境（重構文件 §12 Phase 2）：靜態世界快照＋可變累加器。 */
export type CreatureTurnContext = {
  map: MapState
  globalBuffs: GameState['globalBuffs']
  players: PlayerState[]
  bases: BaseState[]
  resourcePoints: ResourcePointState[]
  itemPoints: ItemPointState[]
  explorationEvents: ExplorationEventState[]
  defenseStructures: DefenseStructureState[]
  ruins: RuinState[]
  traps: TrapState[]
  occupiedByBases: Position[]
  occupiedByCreatureNests: Position[]
  occupiedByItemPoints: Position[]
  occupiedByExplorationEvents: Position[]
  occupiedByRuins: Position[]
  occupiedBySectGates: Position[]
  occupiedByCreatures: Map<string, Position>
  reflectedDamageByCreatureId: Map<string, number>
  logs: CreatureActionLog[]
  steps: CreatureTurnStep[]
  /** 切片 J：全域行動日誌事件（與玩家 AI 共用 §4.5 格式），回合結束後併入 GameState.actionEvents。 */
  events: AiActionEvent[]
  round: number
}

/** Perceive 段前置：建立整個 Creature 回合共用的世界情境。 */
export function createCreatureTurnContext(inputs: {
  map: MapState
  globalBuffs: GameState['globalBuffs']
  players: PlayerState[]
  bases: BaseState[]
  resourcePoints: ResourcePointState[]
  defenseStructures: DefenseStructureState[]
  itemPoints: ItemPointState[]
  explorationEvents: ExplorationEventState[]
  nests: CreatureNestState[]
  ruins: RuinState[]
  traps: TrapState[]
   sectGates: SectGateState[]
   survivingCreatures: CreatureState[]
   round?: number
 }): CreatureTurnContext {
  return {
    map: inputs.map,
    globalBuffs: inputs.globalBuffs,
    players: inputs.players.map((player) => ({ ...player })),
    bases: inputs.bases.map((base) => ({ ...base })),
    resourcePoints: inputs.resourcePoints.map((point) => ({ ...point })),
    itemPoints: inputs.itemPoints.map((point) => ({ ...point })),
    explorationEvents: inputs.explorationEvents.map((event) => ({ ...event })),
    defenseStructures: inputs.defenseStructures.map((structure) => ({ ...structure })),
    ruins: inputs.ruins.map((ruin) => ({ ...ruin })),
    traps: inputs.traps.map((trap) => ({ ...trap })),
    occupiedByBases: inputs.bases.map((base) => base.position),
    occupiedByCreatureNests: inputs.nests.map((nest) => nest.position),
    occupiedByItemPoints: [],
    occupiedByExplorationEvents: [],
    occupiedByRuins: inputs.ruins.filter((ruin) => ruin.status === 'intact').map((ruin) => ruin.position),
    occupiedBySectGates: inputs.sectGates.map((gate) => gate.position),
    occupiedByCreatures: new Map(inputs.survivingCreatures.map((creature) => [creature.id, creature.position])),
    reflectedDamageByCreatureId: new Map(),
    logs: [],
    steps: [],
    events: [],
    round: inputs.round ?? 0,
  }
}

const CREATURE_DIRECTIONS = [{ row: -1, column: 0 }, { row: 1, column: 0 }, { row: 0, column: -1 }, { row: 0, column: 1 }]

// 切片 L：距離計算委託感知層統一出口（rules/mapCellStateRules 單一實作），消除雙份實作。
const stepDistance = manhattanDistance

function isCellTraversable(context: CreatureTurnContext, creature: CreatureState, position: Position): boolean {
  const cell = context.map.cells.find((candidate) => candidate.row === position.row && candidate.column === position.column)
  return Boolean(cell) && canTraverseTerrain(cell!.terrain, creature)
}

function getCellMoveCost(context: CreatureTurnContext, creature: CreatureState, position: Position): number {
  const cell = context.map.cells.find((current) => current.row === position.row && current.column === position.column)
  return cell ? getCreatureTerrainStaminaCost(creature, cell.terrain) : Infinity
}

/** 除防禦設施外的佔位：玩家、據點、巢穴、道具點、事件點、廢墟、門派據點。 */
function isOccupiedExcludingDefenses(context: CreatureTurnContext, position: Position): boolean {
  return context.players.some((player) => isSamePosition(player.position, position))
    || context.occupiedByBases.some((occupied) => isSamePosition(occupied, position))
    || context.occupiedByCreatureNests.some((occupied) => isSamePosition(occupied, position))
    || context.occupiedByItemPoints.some((occupied) => isSamePosition(occupied, position))
    || context.occupiedByExplorationEvents.some((occupied) => isSamePosition(occupied, position))
    || context.occupiedByRuins.some((occupied) => isSamePosition(occupied, position))
    || context.occupiedBySectGates.some((occupied) => isSamePosition(occupied, position))
}

function isDefenseOccupied(context: CreatureTurnContext, position: Position): boolean {
  return context.defenseStructures.some((structure) => isSamePosition(structure.position, position))
}

function isOccupiedByOtherCreature(context: CreatureTurnContext, creatureId: string, position: Position): boolean {
  return [...context.occupiedByCreatures.entries()].some(([currentId, currentPosition]) =>
    currentId !== creatureId && isSamePosition(currentPosition, position))
}

/** 巡邏／追擊的移動計畫結果。 */
export type CreatureMovementPlan = {
  finalPosition: Position
  remainingStamina: number
  moved: boolean
  blocked: boolean
  /** 被擋下時，實際堵住最佳去路的防禦設施 id（而非任意相鄰設施）。 */
  blockingDefenseId: string | null
  /** 移動途中踩到的陷阱格（執行段才套用傷害／定身）。 */
  trappedAt: Position | null
}

export type CreatureMovementTarget = {
  type: 'player' | 'resource' | 'item' | 'base' | 'defense'
  position: Position
}

/** 找出堵住去路的防禦設施：該鄰格除防禦設施外皆可通行且體力可負擔，取離目標最近者。 */
function findBlockingDefenseId(
  context: CreatureTurnContext,
  creature: CreatureState,
  from: Position,
  targetPosition: Position,
  remainingStamina: number,
): string | null {
  const candidates = CREATURE_DIRECTIONS.map((direction) => ({ row: from.row + direction.row, column: from.column + direction.column }))
    .filter((candidate) => isCellTraversable(context, creature, candidate))
    .filter((candidate) => !isOccupiedExcludingDefenses(context, candidate))
    .filter((candidate) => !isOccupiedByOtherCreature(context, creature.id, candidate))
    .map((candidate) => ({
      candidate,
      cost: getCellMoveCost(context, creature, candidate),
      structure: context.defenseStructures.find((structure) => isSamePosition(structure.position, candidate)),
    }))
    .filter((entry) => entry.structure && entry.cost <= remainingStamina)
    .sort((first, second) => stepDistance(first.candidate, targetPosition) - stepDistance(second.candidate, targetPosition))
  return candidates[0]?.structure?.id ?? null
}

/** Plan 段：以現行貪婪步進模型預演移動；隨機來源消費順序與舊實作一致（可重現巡邏）。 */
export function planCreatureMovement(
  context: CreatureTurnContext,
  creature: CreatureState,
  target: CreatureMovementTarget | null,
  randomSource: RandomSource,
): CreatureMovementPlan {
  const stay: CreatureMovementPlan = {
    finalPosition: creature.position,
    remainingStamina: creature.maxStamina,
    moved: false,
    blocked: false,
    blockingDefenseId: null,
    trappedAt: null,
  }

  // 定身：持有 immobilize Buff 的怪物本回合跳過移動。
  const isImmobilized = getActiveBuffsForPlayer(creature)
    .some((buff) => getBuff(buff.definitionId)?.immobilized)
  if (isImmobilized) return stay

  let position = creature.position
  let remainingStamina = creature.maxStamina
  let moved = false
  let blocked = false
  let blockingDefenseId: string | null = null
  let trappedAt: Position | null = null

  const neighborCandidates = (from: Position) =>
    CREATURE_DIRECTIONS.map((direction) => ({ row: from.row + direction.row, column: from.column + direction.column }))
      .filter((candidate) => isCellTraversable(context, creature, candidate))
      .filter((candidate) => !isOccupiedExcludingDefenses(context, candidate))
      .filter((candidate) => !isDefenseOccupied(context, candidate))
      .filter((candidate) => !isOccupiedByOtherCreature(context, creature.id, candidate))

  if (target) {
    const stoppingDistance = target.type === 'item' ? 0 : 1
    while (stepDistance(position, target.position) > stoppingDistance) {
      const candidates = neighborCandidates(position)
        .map((candidate) => ({
          position: candidate,
          cost: getCellMoveCost(context, creature, candidate),
          distance: stepDistance(candidate, target.position),
        }))
        .filter((candidate) => candidate.cost <= remainingStamina)
        .sort((first, second) => first.distance - second.distance)
      const nextStep = candidates[0]
      if (!nextStep) {
        blocked = true
        blockingDefenseId = findBlockingDefenseId(context, creature, position, target.position, remainingStamina)
        break
      }
      position = nextStep.position
      remainingStamina -= nextStep.cost
      moved = true
      if (context.traps.some((trap) => isSamePosition(trap.position, position))) {
        trappedAt = position
        break
      }
    }
  } else {
    while (remainingStamina > 0) {
      const candidates = neighborCandidates(position)
        .map((candidate) => ({ position: candidate, cost: getCellMoveCost(context, creature, candidate) }))
        .filter((candidate) => candidate.cost <= remainingStamina)
      const patrolStep = candidates[Math.floor(randomSource() * candidates.length)]
      if (!patrolStep) break
      position = patrolStep.position
      remainingStamina -= patrolStep.cost
      moved = true
      if (context.traps.some((trap) => isSamePosition(trap.position, position))) {
        trappedAt = position
        break
      }
    }
  }

  return { finalPosition: position, remainingStamina, moved, blocked, blockingDefenseId, trappedAt }
}

export type CreaturePlanValidation = { ok: true } | { ok: false; reason: string }

/**
 * Creature 回合資格檢查（重構文件 §9.2 creature kind，切片 I 接線）：
 * 行動者必須存活且座標有效。與玩家側 `validateAiAction` 的 actor 層檢查同源對應；
 * 管線在 select／plan 之前先過此關，不合格者跳過該回合（不產生行動）。
 */
export function validateCreatureTurnEligibility(creature: CreatureState): CreaturePlanValidation {
  if (creature.health <= 0) return { ok: false, reason: 'Creature 已無法行動。' }
  const position = creature.position
  if (!position || !Number.isFinite(position.row) || !Number.isFinite(position.column)) {
    return { ok: false, reason: 'Creature 座標無效。' }
  }
  // 震懾：三重共振觸發，目標完全跳過下一個回合。
  if (getActiveBuffsForPlayer(creature).some((buff) => getBuff(buff.definitionId)?.stunned)) {
    return { ok: false, reason: 'Creature 被震懾，本回合無法行動。' }
  }
  return { ok: true }
}

/** Validate 段（§9.2 子集）：最終位置、體力與阻路設施的健全性檢查。 */
export function validateCreaturePlan(
  context: CreatureTurnContext,
  creature: CreatureState,
  plan: CreatureMovementPlan,
): CreaturePlanValidation {
  if (plan.remainingStamina < 0) return { ok: false, reason: '體力結算為負。' }
  if (!isCellTraversable(context, creature, plan.finalPosition)) return { ok: false, reason: '最終位置不可通行。' }
  if (isOccupiedExcludingDefenses(context, plan.finalPosition) || isOccupiedByOtherCreature(context, creature.id, plan.finalPosition)) {
    return { ok: false, reason: '最終位置已被佔用。' }
  }
  if (plan.blockingDefenseId && !context.defenseStructures.some((structure) => structure.id === plan.blockingDefenseId && structure.health > 0)) {
    return { ok: false, reason: '阻路的防禦設施已失效。' }
  }
  return { ok: true }
}

/** Select 段輸出：與 selectCreatureTarget 的聯集解耦的最小目標快照。 */
export type CreatureTargetSelection = {
  type: 'player' | 'resource' | 'item' | 'base' | 'defense'
  id: string
  position: Position
  name?: string
}

/** 套用陷阱效果（絆馬索＝傷害；定身索＝掛 Buff），並從情境中移除該陷阱。 */
function applyTrapAt(context: CreatureTurnContext, creature: CreatureState, position: Position): void {
  const steppedTrapIndex = context.traps.findIndex((trap) => isSamePosition(trap.position, position))
  if (steppedTrapIndex < 0) return
  const steppedTrap = context.traps[steppedTrapIndex]
  context.traps = context.traps.filter((trap) => trap.id !== steppedTrap.id)
  if (steppedTrap.type === 'snare') {
    const trapDamage = Math.max(1, steppedTrap.damage ?? 15)
    creature.health = Math.max(0, creature.health - trapDamage)
    context.logs.push({ creatureId: creature.id, creatureName: creature.name, message: `${creature.name} 踩中絆馬索，受到 ${trapDamage} 點傷害。` })
  } else {
    const durationRounds = getBuff('trap-immobilize')?.durationRounds ?? 3
    const immobilizeBuff: BuffInstance = {
      id: `trap:${steppedTrap.id}:${Date.now()}`,
      definitionId: 'trap-immobilize',
      sourceId: steppedTrap.id,
      remainingRounds: durationRounds,
    }
    creature.buffs = [...(creature.buffs ?? []), immobilizeBuff]
    context.logs.push({ creatureId: creature.id, creatureName: creature.name, message: `${creature.name} 踩中定身索，被定身 ${durationRounds} 回合。` })
  }
}

/** Execute 段的行動判別（切片 J）：事件化與日誌共用的單一事實來源。 */
export type CreatureExecutionOutcome =
  | { type: 'attack'; targetId: string; targetKind: AiTargetKind; targetPosition: Position; targetName?: string }
  | { type: 'move' }
  | { type: 'idle' }

/** Execute 段：套用移動（含陷阱）並結算互動分支。順序與舊實作一致：道具→據點→資源→玩家→防禦設施。 */
export function executeCreatureAction(
  context: CreatureTurnContext,
  creature: CreatureState,
  selection: CreatureTargetSelection | null,
  plan: CreatureMovementPlan,
  randomSource: RandomSource,
): CreatureExecutionOutcome {
  const position = plan.finalPosition
  if (plan.trappedAt) applyTrapAt(context, creature, plan.trappedAt)

  const adjacentResource = selection && selection.type === 'resource' && (
    isAdjacent(position, selection.position) || isSamePosition(position, selection.position)
  ) ? context.resourcePoints.find((point) => point.id === selection.id) : undefined
  // 僅吃掉「可被生物吃掉」的道具點（eatableByCreatures !== false）；劇本模式預設 false＝不可被吃掉。
  const reachedItem = selection && selection.type === 'item' && isSamePosition(position, selection.position)
    ? context.itemPoints.find((point) => point.id === selection.id) : undefined
  const adjacentPlayer = selection && selection.type === 'player' && isAdjacent(position, selection.position)
    ? context.players.find((player) => player.id === selection.id && player.health > 0) : undefined
  const adjacentBase = selection && selection.type === 'base' && isAdjacent(position, selection.position)
    ? context.bases.find((base) => base.id === selection.id && base.health > 0) : undefined
  // 直接選中的防禦設施照打；被擋下時只反擊「堵住去路」的那座設施。
  const adjacentDefense = (selection && selection.type === 'defense' && isAdjacent(position, selection.position)
      ? context.defenseStructures.find((structure) => structure.id === selection.id && structure.health > 0)
      : plan.blocked && plan.blockingDefenseId
        ? context.defenseStructures.find((structure) => structure.id === plan.blockingDefenseId && structure.health > 0 && isAdjacent(position, structure.position))
        : undefined)

  if (reachedItem && reachedItem.eatableByCreatures !== false) {
    context.itemPoints = context.itemPoints.filter((point) => point.id !== reachedItem.id)
    context.logs.push({ creatureId: creature.id, creatureName: creature.name, message: `${creature.name} 吃掉了道具點。` })
    return { type: 'move' }
  } else if (adjacentBase) {
    const rawDamage = Math.max(1, creature.attributes.armStrength - 2)
    // 據點承傷加成：軍事政策（-5%）與全局靈氣「城防堅固」相乘。
    const defenseOrState = { bases: context.bases, globalBuffs: context.globalBuffs } as GameState
    const globalDefenseMultiplier = getGlobalBaseDefenseMultiplier(defenseOrState)
    const militaryReduction = hasActivePolicy(adjacentBase, 'military') ? MILITARY_DEFENSE_REDUCTION : 0
    const damage = Math.max(1, Math.round(rawDamage * globalDefenseMultiplier * (1 - militaryReduction)))
    const health = Math.max(0, adjacentBase.health - damage)
    context.bases = context.bases.map((base) => base.id === adjacentBase.id ? { ...base, health, active: health > 0 } : base)
    const reductions: string[] = []
    if (militaryReduction > 0) reductions.push('軍事政策')
    if (globalDefenseMultiplier < 1) reductions.push('城防堅固')
    const reducedNote = reductions.length > 0 ? `（傷害因${reductions.join('、')}降低）` : ''
    context.logs.push({ creatureId: creature.id, creatureName: creature.name, message: `${creature.name} 攻擊${adjacentBase.name}，造成 ${damage} 點傷害${health === 0 ? '並將其摧毀' : ''}${reducedNote}。` })
    return { type: 'attack', targetId: adjacentBase.id, targetKind: 'base', targetPosition: adjacentBase.position, targetName: adjacentBase.name }
  } else if (adjacentResource) {
    const damage = Math.max(1, creature.attributes.armStrength - 2)
    const health = Math.max(0, adjacentResource.health - damage)
    context.resourcePoints = context.resourcePoints.map((point) => point.id === adjacentResource.id
      ? { ...point, health, active: health > 0 }
      : point)
    context.logs.push({ creatureId: creature.id, creatureName: creature.name, message: health <= 0 ? `${creature.name} 摧毀了${adjacentResource.name}。` : `${creature.name} 攻擊${adjacentResource.name}，造成 ${damage} 點傷害。` })
    return { type: 'attack', targetId: adjacentResource.id, targetKind: 'resource', targetPosition: adjacentResource.position, targetName: adjacentResource.name }
  } else if (adjacentPlayer) {
    resolveAttackAgainstPlayer(context, creature, adjacentPlayer, randomSource)
    return { type: 'attack', targetId: adjacentPlayer.id, targetKind: 'player', targetPosition: adjacentPlayer.position, targetName: adjacentPlayer.name }
  } else if (adjacentDefense) {
    // 軍壘強化：3 格內塔類 HP×2，等同減半承受傷害（動態查詢，軍壘失活自動失效）。
    const bastionBoosted = getBastionMultipliers(context.defenseStructures, adjacentDefense)
    const damage = Math.max(1, Math.floor((creature.attributes.armStrength - 2) / bastionBoosted.hpMultiplier))
    const health = Math.max(0, adjacentDefense.health - damage)
    if (health === 0) {
      context.defenseStructures = context.defenseStructures.filter((structure) => structure.id !== adjacentDefense.id)
      // 被怪物摧毀的防禦設施直接從地圖消失；
      // 若是由廢墟修復而成，連同對應的已修復廢墟一併移除，不留廢墟點。
      if (adjacentDefense.originName) {
        context.ruins = context.ruins.filter((ruin) =>
          !(ruin.position.row === adjacentDefense.position.row && ruin.position.column === adjacentDefense.position.column),
        )
      }
    } else {
      context.defenseStructures = context.defenseStructures.map((structure) => structure.id === adjacentDefense.id ? { ...structure, health } : structure)
    }
    context.logs.push({ creatureId: creature.id, creatureName: creature.name, message: health === 0 ? `${creature.name} 攻擊${adjacentDefense.name}，造成 ${damage} 點傷害並將其摧毀。` : `${creature.name} 攻擊${adjacentDefense.name}，造成 ${damage} 點傷害。` })
    return { type: 'attack', targetId: adjacentDefense.id, targetKind: 'defense', targetPosition: adjacentDefense.position, targetName: adjacentDefense.name }
  } else if (plan.moved && selection) {
    context.logs.push({ creatureId: creature.id, creatureName: creature.name, message: `${creature.name} 朝 ${selection.name ?? selection.id} 移動到 (${position.row + 1}, ${position.column + 1})。` })
    return { type: 'move' }
  }
  return { type: 'idle' }
}

/** Creature 對玩家的攻擊結算（閃避／根骨減傷／破軍／鐵壁／嗜血／反震），公式與舊實作一致。 */
function resolveAttackAgainstPlayer(
  context: CreatureTurnContext,
  creature: CreatureState,
  adjacentPlayer: PlayerState,
  randomSource: RandomSource,
): void {
  const creatureTerrain = context.map.cells.find((cell) => cell.row === creature.position.row && cell.column === creature.position.column)?.terrain
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
  // 鐵壁訣：玩家受到傷害時最終傷害 -%（反震仍基於 actualDamage）
  const reduction = getDamageReductionPercent(adjacentPlayer)
  const finalDamage = actualDamage <= 0 ? 0 : Math.max(1, Math.floor(actualDamage * (1 - reduction)))
  context.players = context.players.map((player) => player.id === adjacentPlayer.id ? { ...reduceEquipmentDurability(reduceEquipmentDurability(player, 'armor', 1), 'accessory', 0.5), health: Math.max(0, player.health - finalDamage) } : player)
  // 嗜血：怪物造成傷害時回復血量
  const lifestealHeal = Math.floor(actualDamage * getLifestealPercent(creature))
  if (lifestealHeal > 0) {
    creature.health = Math.min(creature.maxHealth, creature.health + lifestealHeal)
  }
  const reflectionPercent = getActiveBuffsForPlayer(adjacentPlayer)
    .reduce((total, buff) => total + (getBuff(buff.definitionId)?.reflectionPercent ?? 0), 0)
  if (reflectionPercent > 0 && actualDamage > 0) {
    const reflectedDamage = actualDamage * reflectionPercent
    context.reflectedDamageByCreatureId.set(creature.id, reflectedDamage)
    context.logs.push({ creatureId: adjacentPlayer.id, creatureName: adjacentPlayer.name, message: `${adjacentPlayer.name} 的反震對 ${creature.name} 造成 ${reflectedDamage} 點傷害。` })
  }
  context.logs.push({ creatureId: creature.id, creatureName: creature.name, message: `${creature.name} 攻擊 ${adjacentPlayer.name}，${avoided ? '被閃避。' : halved ? `造成 ${damage} 點傷害（根骨減傷）。` : `造成 ${damage} 點傷害。`}` })
}

/**
 * 切片 J：把單一 Creature 的回合行動轉成 §4.5 全域事件（與玩家 AI 同格式）。
 * 攻擊／移動如實記錄；原地待命依原因區分成敗（驗證失敗或體力不足視為 failed）。
 */
export function buildCreatureActionEvent(
  context: CreatureTurnContext,
  creature: CreatureState,
  selection: CreatureTargetSelection | null,
  plan: CreatureMovementPlan,
  outcome: CreatureExecutionOutcome,
  validation: CreaturePlanValidation,
): AiActionEvent {
  const actor = { id: creature.id, kind: 'creature' as const, name: creature.name }
  if (outcome.type === 'attack') {
    return createAiActionEvent({
      round: context.round,
      actor,
      action: {
        type: 'attack',
        actor: { id: creature.id, kind: 'creature' },
        target: { id: outcome.targetId, kind: outcome.targetKind, position: outcome.targetPosition },
        reason: `與 ${outcome.targetName ?? outcome.targetId} 交戰。`,
      },
      result: 'succeeded',
    })
  }
  if (outcome.type === 'move') {
    return createAiActionEvent({
      round: context.round,
      actor,
      action: {
        type: 'move',
        actor: { id: creature.id, kind: 'creature' },
        destination: plan.finalPosition,
        reason: selection ? `移動接近 ${selection.name ?? selection.id}。` : '巡邏移動。',
      },
      result: 'succeeded',
    })
  }
  const reason = !validation.ok
    ? validation.reason
    : plan.blocked
      ? '體力不足，無法繼續移動。'
      : selection
        ? '未能接近目標，原地待命。'
        : '沒有可執行的目標，原地待命。'
  return createAiActionEvent({
    round: context.round,
    actor,
    action: { type: 'hold', actor: { id: creature.id, kind: 'creature' }, reason },
    result: !validation.ok || plan.blocked ? 'failed' : 'succeeded',
  })
}

/** Reduce 段：結算終點的道具／事件吞噬、反震傷害，組出下一隻 Creature 快照與動畫 step。 */
export function reduceCreatureEvents(
  context: CreatureTurnContext,
  creature: CreatureState,
  plan: CreatureMovementPlan,
): CreatureState {
  const finalPosition = plan.finalPosition
  context.occupiedByCreatures.set(creature.id, finalPosition)
  // 僅吃掉「可被生物吃掉」的道具點（eatableByCreatures !== false）；劇本模式預設 false＝不可被吃掉。
  const removedItemPoint = context.itemPoints.find(
    (point) => point.eatableByCreatures !== false && isSamePosition(point.position, finalPosition),
  ) ?? null
  // 僅吃掉「可被生物吃掉」的探索事件點（eatableByCreatures !== false）；劇本模式預設 false＝不可被吃掉。
  const removedEvent = context.explorationEvents.find(
    (event) => event.eatableByCreatures !== false && isSamePosition(event.position, finalPosition),
  ) ?? null
  if (removedItemPoint) {
    context.itemPoints = context.itemPoints.filter((point) => point.id !== removedItemPoint.id)
    context.logs.push({ creatureId: creature.id, creatureName: creature.name, message: `${creature.name} 發現並摧毀了道具點。` })
  }
  if (removedEvent) {
    context.explorationEvents = context.explorationEvents.filter((event) => event.id !== removedEvent.id)
    context.logs.push({ creatureId: creature.id, creatureName: creature.name, message: `${creature.name} 使探索事件「${removedEvent.name}」消失。` })
  }
  const reflectedDamage = context.reflectedDamageByCreatureId.get(creature.id) ?? 0
  const nextCreature = {
    ...creature,
    position: finalPosition,
    stamina: plan.remainingStamina,
    health: Math.max(0, creature.health - reflectedDamage),
    turnEnded: true,
  }
  context.steps.push({
    creature: nextCreature,
    players: context.players,
    bases: context.bases,
    resourcePoints: context.resourcePoints,
    itemPoints: context.itemPoints,
    explorationEvents: context.explorationEvents,
    defenseStructures: context.defenseStructures,
    ruins: context.ruins,
    traps: context.traps,
    logs: context.logs.slice(),
  })
  return nextCreature
}

export type RunCreatureTurnInputs = {
  creatures: CreatureState[]
  map: MapState
  players: PlayerState[]
  bases: BaseState[]
  resourcePoints: ResourcePointState[]
  defenseStructures: DefenseStructureState[]
  itemPoints: ItemPointState[]
  explorationEvents: ExplorationEventState[]
  nests?: CreatureNestState[]
  ruins?: RuinState[]
  traps?: TrapState[]
  sectGates?: SectGateState[]
  globalBuffs?: GameState['globalBuffs']
  randomSource?: RandomSource
  /** 切片 J：事件歸屬回合（GameState.round），未提供時為 0（單元測試情境）。 */
  round?: number
}

/** 六段管線 orchestrator：perceive（情境＋箭塔）→ select → plan → validate → execute → reduce。 */
export function runCreatureTurn(inputs: RunCreatureTurnInputs): CreatureTurnResult {
  const {
    creatures, map, players, bases, resourcePoints, defenseStructures, itemPoints,
    explorationEvents, nests = [], ruins = [], traps = [], sectGates = [], globalBuffs = [],
    randomSource = defaultRandomSource, round = 0,
  } = inputs

  const hasValidPosition = (value: { position?: Position } | null | undefined): value is { position: Position } => {
    const position = value?.position
    return Boolean(position && Number.isFinite(position.row) && Number.isFinite(position.column))
  }

  // 舊存檔或異常資料可能缺少 position；忽略該筆資料，避免怪物回合崩潰。
  const damagedCreatures = creatures.filter(hasValidPosition).map((creature) => ({ ...creature, attributes: { ...creature.attributes } }))
  let damagedCreaturesForActions = damagedCreatures
  const context = createCreatureTurnContext({
    map,
    globalBuffs,
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
    survivingCreatures: damagedCreatures,
    round,
  })

  // 轟城砲：冷卻遞減，再執行範圍砲擊（與箭塔同一結算時序前段）。
  context.defenseStructures = countdownBombardCooldowns(context.defenseStructures)
  const bombardResult = fireBombardCannons(context.defenseStructures, damagedCreaturesForActions, round)
  damagedCreaturesForActions = bombardResult.creatures
  context.defenseStructures = bombardResult.defenseStructures
  for (const message of bombardResult.logs) {
    context.logs.push({ creatureId: '', creatureName: '', message })
  }

  for (const tower of defenseStructures.filter((structure) =>
    hasValidPosition(structure) && (structure.type === 'arrow-tower' || structure.type === 'advanced-arrow-tower' || structure.type === 'small-arrow-tower'),
  )) {
    const target = damagedCreaturesForActions
      .filter((creature) => creature.health > 0 && hasValidPosition(creature))
      .map((creature) => ({ creature, distance: manhattanDistance(creature.position, tower.position) }))
      .filter(({ distance }) => distance <= tower.attackRange)
      .sort((first, second) => first.distance - second.distance)[0]?.creature
    if (!target) continue
    const attackDamage = getEffectiveAttackDamage(defenseStructures, tower)
    target.health = Math.max(0, target.health - attackDamage)
    context.logs.push({ creatureId: target.id, creatureName: target.name, message: `${tower.name} 攻擊 ${target.name}，造成 ${attackDamage} 點傷害${target.health === 0 ? '並將其擊敗' : ''}。` })
  }

  const survivingCreatures = damagedCreaturesForActions.filter((creature) => creature.health > 0)
  const aliveIds = new Set(survivingCreatures.map((creature) => creature.id))
  for (const creatureId of [...context.occupiedByCreatures.keys()]) if (!aliveIds.has(creatureId)) context.occupiedByCreatures.delete(creatureId)

  const fakeStateForSelection = {
    map,
    bases: context.bases,
    defenseStructures: context.defenseStructures,
    creatureNests: [],
    resourcePoints: context.resourcePoints,
    itemPoints,
    explorationEvents,
    players: context.players,
    creatures: survivingCreatures,
    activePlayerId: context.players[0]?.id ?? '',
    round: 0,
    creatureActionLogs: [],
    attackPreview: null,
    externalSkillPreview: null,
    creatureTurnInProgress: false,
    activeCreatureId: null,
    operation: { type: 'idle' },
    blockingModal: null,
  } as GameState

  const nextCreatures = survivingCreatures.map((creature) => {
    // Validate 段前置：回合資格（存活＋座標有效）不合格者跳過，不產生任何行動或日誌。
    if (!validateCreatureTurnEligibility(creature).ok) return { ...creature }
    const rawTarget = selectCreatureTarget(fakeStateForSelection, creature)
    const selection: CreatureTargetSelection | null = !rawTarget
      ? null
      : rawTarget.type === 'player'
        ? { type: 'player', id: rawTarget.player!.id, position: rawTarget.position, name: rawTarget.player!.name }
        : rawTarget.type === 'resource'
          ? { type: 'resource', id: rawTarget.resourcePoint!.id, position: rawTarget.position, name: rawTarget.resourcePoint!.name }
          : rawTarget.type === 'item'
            ? { type: 'item', id: rawTarget.itemPoint!.id, position: rawTarget.position }
            : rawTarget.type === 'base'
              ? { type: 'base', id: rawTarget.base!.id, position: rawTarget.position, name: rawTarget.base!.name }
              : { type: 'defense', id: rawTarget.defenseStructure!.id, position: rawTarget.position, name: rawTarget.defenseStructure!.name }
    const movementTarget: CreatureMovementTarget | null = selection
      ? { type: selection.type, position: selection.position }
      : null

    let plan = planCreatureMovement(context, creature, movementTarget, randomSource)
    const validation = validateCreaturePlan(context, creature, plan)
    if (!validation.ok) {
      plan = { finalPosition: creature.position, remainingStamina: creature.maxStamina, moved: false, blocked: false, blockingDefenseId: null, trappedAt: null }
    }
    const outcome = executeCreatureAction(context, creature, selection, plan, randomSource)
    context.events.push(buildCreatureActionEvent(context, creature, selection, plan, outcome, validation))
    return reduceCreatureEvents(context, creature, plan)
  })

  const survivingAfterReflection = nextCreatures.filter((creature) => creature.health > 0)
  return {
    creatures: uniqueCreaturesById(survivingAfterReflection),
    players: context.players,
    bases: context.bases,
    resourcePoints: context.resourcePoints,
    itemPoints: context.itemPoints,
    explorationEvents: context.explorationEvents,
    defenseStructures: context.defenseStructures,
    ruins: context.ruins,
    traps: context.traps,
    logs: context.logs,
    steps: context.steps,
    events: context.events,
  }
}



