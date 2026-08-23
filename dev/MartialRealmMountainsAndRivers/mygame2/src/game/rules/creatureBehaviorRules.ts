import type { BaseState, DefenseStructureState, GameState, ItemPointState, PlayerAttributes, PlayerState, Position, ResourcePointState, CreatureState } from '../types'
import type { MartialSchoolId } from '../catalogs/martialSchoolCatalog'
import { defaultRandomSource, rollWeighted } from './randomRules'

export type CreatureBehaviorType = 'scavenger' | 'hunter' | 'sieger' | 'wanderer' | 'roamer'
export type CreatureTargetType = 'player' | 'resource' | 'item' | 'base' | 'defense'

export const CREATURE_BEHAVIOR_NAMES: Record<CreatureBehaviorType, string> = {
  scavenger: '掠奪型',
  hunter: '獵殺型',
  sieger: '攻城型',
  wanderer: '拾荒型',
  roamer: '游蕩型',
}

export const CREATURE_SCHOOL_ICONS: Record<MartialSchoolId, string> = {
  'frost-water': '🦎',
  'swift-wind': '🦅',
  'earth-mountain': '🐂',
  'golden-body': '🦏',
  'scarlet-flame': '🦊',
  'void-spirit': '🐉',
}

export const CREATURE_BEHAVIOR_BY_INDEX: CreatureBehaviorType[] = [
  'scavenger',
  'hunter',
  'wanderer',
  'sieger',
]

export const CREATURE_AGGRO_RANGES: Record<CreatureBehaviorType, number> = {
  scavenger: 5,
  hunter: 6,
  sieger: 7,
  wanderer: 4,
  roamer: 2,
}

// 開局游蕩妖物等級權重：整體調弱後僅 Lv1-3，且以 Lv1 為大宗，使初始怪易於擊退。
export const ROAMER_LEVEL_WEIGHTS = [75, 25, 7]

export function rollRoamerLevel(randomValue = defaultRandomSource()): number {
  return rollWeighted(ROAMER_LEVEL_WEIGHTS.map((weight, index) => ({ value: index + 1, weight })), () => randomValue) ?? 1
}

export const CREATURE_SCHOOL_ATTRIBUTE_MODIFIERS: Record<MartialSchoolId, Partial<PlayerAttributes>> = {
  'frost-water': { armStrength: 0, constitution: 2, agility: -1, innerEnergy: 2, insight: 0 },
  'swift-wind': { armStrength: 0, constitution: -1, agility: 2, innerEnergy: 0, insight: 2 },
  'earth-mountain': { armStrength: 0, constitution: 3, agility: -2, innerEnergy: 2, insight: -1 },
  'golden-body': { armStrength: 2, constitution: 2, agility: -2, innerEnergy: 0, insight: -1 },
  'scarlet-flame': { armStrength: 2, constitution: -1, agility: 0, innerEnergy: 3, insight: 0 },
  'void-spirit': { armStrength: 0, constitution: 0, agility: 0, innerEnergy: 0, insight: 0 },
}

const CREATURE_LEVEL_GROWTH: PlayerAttributes = {
  armStrength: 3,
  constitution: 3,
  agility: 3,
  innerEnergy: 3,
  insight: 3,
}

export function getCreatureBehaviorType(creature: Pick<CreatureState, 'behaviorType'>): CreatureBehaviorType {
  return creature.behaviorType ?? 'scavenger'
}

export function getCreatureBehaviorName(creature: Pick<CreatureState, 'behaviorType'>): string {
  return CREATURE_BEHAVIOR_NAMES[getCreatureBehaviorType(creature)]
}

export function getCreatureSchoolId(creature: Pick<CreatureState, 'schoolId' | 'behaviorType'>): MartialSchoolId {
  // 新怪物皆在生成時明確指定流派；舊存檔缺少流派時僅使用中性 fallback，不再依行為綁定流派。
  return creature.schoolId ?? 'void-spirit'
}

export function getCreatureIcon(creature: Pick<CreatureState, 'schoolId' | 'behaviorType'>): string {
  return CREATURE_SCHOOL_ICONS[getCreatureSchoolId(creature)]
}

export function getCreatureAttributes(
  baseAttributes: PlayerAttributes,
  creature: Pick<CreatureState, 'schoolId' | 'behaviorType'>,
  level = 1,
): PlayerAttributes {
  const schoolId = getCreatureSchoolId(creature)
  const modifier = CREATURE_SCHOOL_ATTRIBUTE_MODIFIERS[schoolId]
  const levelBonus = Math.max(0, level - 1)
  return {
    armStrength: Math.max(1, baseAttributes.armStrength + (modifier.armStrength ?? 0) + levelBonus * CREATURE_LEVEL_GROWTH.armStrength),
    constitution: Math.max(1, baseAttributes.constitution + (modifier.constitution ?? 0) + levelBonus * CREATURE_LEVEL_GROWTH.constitution),
    agility: Math.max(2, baseAttributes.agility + (modifier.agility ?? 0) + levelBonus * CREATURE_LEVEL_GROWTH.agility),
    innerEnergy: Math.max(1,baseAttributes.innerEnergy + (modifier.innerEnergy ?? 0) + levelBonus * CREATURE_LEVEL_GROWTH.innerEnergy),
    // 怪物生成時最低保有 5 點悟性，避免內功效果因悟性容量不足而固定衰減。
    insight: Math.max(5, baseAttributes.insight + (modifier.insight ?? 0) + levelBonus * CREATURE_LEVEL_GROWTH.insight),
  }
}

/** Creature 的內功等級與 Creature 等級同步；未提供等級時使用第一重。 */
export function getCreatureInnerSkillId(creature: Pick<CreatureState, 'schoolId' | 'behaviorType'>, level = 1): string {
  void level
  const schoolId = creature.schoolId ?? 'void-spirit'
  return `${schoolId}-inner`
}

export type CreatureTarget = {
  type: CreatureTargetType
  id: string
  position: Position
  distance: number
  player?: PlayerState
  resourcePoint?: ResourcePointState
  itemPoint?: ItemPointState
  base?: BaseState
  defenseStructure?: DefenseStructureState
}

function distance(first: Position, second: Position): number {
  return Math.abs(first.row - second.row) + Math.abs(first.column - second.column)
}

function nearest<T extends { id: string; position: Position }>(origin: Position, candidates: T[]): T | undefined {
  return [...candidates].sort((first, second) => distance(origin, first.position) - distance(origin, second.position) || first.id.localeCompare(second.id))[0]
}

function getCreatureTargetGroups(
  behavior: CreatureBehaviorType,
  players: PlayerState[],
  resources: ResourcePointState[],
  items: ItemPointState[],
  bases: BaseState[],
): Array<{ type: CreatureTargetType; candidates: Array<PlayerState | ResourcePointState | ItemPointState | BaseState> }> {
  if (behavior === 'sieger') {
    return [
      { type: 'base', candidates: bases },
      { type: 'player', candidates: players },
    ]
  }

  if (behavior === 'scavenger') {
    return [
      { type: 'resource', candidates: resources },
      { type: 'player', candidates: players },
    ]
  }

  if (behavior === 'wanderer') {
    return [
      { type: 'item', candidates: items },
      { type: 'player', candidates: players },
    ]
  }

  if (behavior === 'hunter') {
    return [
      { type: 'player', candidates: players },
    ]
  }

  if (behavior === 'roamer') {
    // 開局游蕩型只在玩家進入近距離警戒範圍時追蹤玩家，平時不攻擊資源或據點。
    return [{ type: 'player', candidates: players }]
  }

  return [
    { type: 'player', candidates: players },
  ]
}

export const arrowTowerTypes: ReadonlySet<string> = new Set(['arrow-tower', 'advanced-arrow-tower', 'small-arrow-tower'])
export const ARROW_TOWER_AGGRO_RANGE = 5

export function selectCreatureTarget(state: GameState, creature: CreatureState): CreatureTarget | null {
  const behavior = getCreatureBehaviorType(creature)
  const range = creature.aggroRange ?? CREATURE_AGGRO_RANGES[behavior]

  if (behavior === 'roamer') {
    const targets = state.players.filter((player) => player.health > 0 && distance(creature.position, player.position) <= range)
    const target = nearest(creature.position, targets)
    return target ? {
      type: 'player',
      id: target.id,
      position: target.position,
      distance: distance(creature.position, target.position),
      player: target,
    } : null
  }

  // 箭塔（含小型箭塔）是共同最高優先目標，五格內即吸引怪物轉向攻擊。
  const nearbyArrowTower = (state.defenseStructures ?? [])
    .filter((structure) => structure.health > 0 && arrowTowerTypes.has(structure.type) && distance(creature.position, structure.position) <= ARROW_TOWER_AGGRO_RANGE)
    .sort((first, second) => distance(creature.position, first.position) - distance(creature.position, second.position))[0]
  if (nearbyArrowTower) {
    return {
      type: 'defense',
      id: nearbyArrowTower.id,
      position: nearbyArrowTower.position,
      distance: distance(creature.position, nearbyArrowTower.position),
      defenseStructure: nearbyArrowTower,
    }
  }

  const players = state.players.filter((player) => player.health > 0 && distance(creature.position, player.position) <= range)
  const resources = state.resourcePoints.filter((point) => point.active !== false && distance(creature.position, point.position) <= range)
  const bases = state.bases.filter((base) => base.health > 0 && distance(creature.position, base.position) <= range)
  const items = state.itemPoints.filter((point) => distance(creature.position, point.position) <= range)

  const ordered = getCreatureTargetGroups(behavior, players, resources, items, bases)
  for (const group of ordered) {
    const target = nearest(creature.position, group.candidates)
    if (!target) continue
    return {
      type: group.type,
      id: target.id,
      position: target.position,
      distance: distance(creature.position, target.position),
      ...(group.type === 'player' ? { player: target as PlayerState }
        : group.type === 'resource' ? { resourcePoint: target as ResourcePointState }
          : group.type === 'item' ? { itemPoint: target as ItemPointState }
            : { base: target as BaseState }),
    }
  }

  const fallbackBase = nearest(creature.position, bases)
  if (fallbackBase) {
    return {
      type: 'base',
      id: fallbackBase.id,
      position: fallbackBase.position,
      distance: distance(creature.position, fallbackBase.position),
      base: fallbackBase,
    }
  }
  return null
}
