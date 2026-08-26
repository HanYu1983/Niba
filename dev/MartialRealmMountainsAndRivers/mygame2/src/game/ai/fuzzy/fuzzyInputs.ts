import type { BaseState, GameState, PlayerState, Position, ResourcePointState } from '../../types'
import { listHostileActors, type HostileActor } from '../perception/targetDiscovery'
import { collectReachableInterests, type ReachableInterest } from '../perception/reachableInterests'
import { getBlockedPositions } from '../../rules/movementRules'
import { canTraverseTerrain } from '../../rules/playerDerivedRules'
import { getAdjacentPositions } from '../../types'
import { buildingCatalog } from '../../catalogs/buildingCatalog'
import { canPlayerBuildBuildingType } from '../../rules/buildingProgressionRules'
import { collectReachableCells } from '../perception/reachablePositions'
import { itemCatalog } from '../../catalogs/itemCatalog'
import { equipmentCatalog } from '../../catalogs/equipmentCatalog'
import { allInnerSkillCatalog } from '../../catalogs/martialHallSkillCatalog'
import { getEffectiveAttributesForPlayer } from '../../rules/playerDerivedRules'

export interface FuzzyInputs {
  /** 能扛幾下攻擊（health / maxEnemyDamage），無敵人時 = 99 */
  hitsSurvivable: number
  /** 體力比 0~1 */
  staminaRatio: number
  /** 到最近威脅的距離 */
  distToNearestThreat: number
  /** 場上可見生物最高傷害力（粗估） */
  maxVisibleEnemyDamage: number
  /** 可到達的道具數量 */
  reachableItemCount: number
  /** 可到達的資源點數量 */
  reachableResourceCount: number
  /** 可到達的興趣點（道具 + 資源） */
  reachableInterests: ReturnType<typeof collectReachableInterests>
  /** 到最近道具的距離（格數），無道具 = Infinity */
  distToNearestItem: number
  /** 四方向可通行出口數（0~4） */
  exitCount: number
  /** 最近出口位置（曼哈頓 1 格內），無出口 = undefined */
  nearestExit: Position | undefined
  /** 最近的友方據點 */
  nearestBase: BaseState | undefined
  /** 視野範圍內的據點 id 陣列（近到遠排序） */
  visibleBaseIds: string[]
  /** 據點建料比 0~1（buildingMaterials / maxBuildingMaterials），無據點 = 0 */
  materialRatio: number
  /** 據點是否可建造建築（有模板 + rank 夠 + 材料夠） */
  canBuild: boolean
  /** 可建造的建築模板（第一個） */
  buildableBuilding: { id: string; type: string; name: string } | undefined
  /** 最近的資源點（屬於最近據點） */
  nearestResourcePoint: ResourcePointState | undefined
  /** 到最近資源點的距離，無資源點 = Infinity */
  distToNearestResourcePoint: number
  /** 是否與資源點相鄰 */
  isAdjacentToResourcePoint: boolean
  /** 體力內可達且未探索的格子數 */
  unexploredReachableCount: number
  /** 最近的未探索可達格子位置，無則 undefined */
  nearestUnexploredPosition: Position | undefined
  /** 到最近怪物的距離，無怪物 = Infinity */
  distToNearestCreature: number
  /** 最近怪物 id，無則空字串 */
  nearestCreatureId: string
  /** 可分配屬性點數 */
  availableAttributePoints: number
  /** 建議使用的道具（id + effect），無則 undefined */
  bestItemToUse: { id: string; effect: string; name: string } | undefined
  /** 建議裝備的裝備（部位空 or 耐久=0 需替換），無則 undefined */
  equipableEquipment: { instanceId: string; equipmentId: string; slot: string; name: string; durability: number } | undefined
  /** 到最近巢穴的距離，無巢穴 = Infinity */
  distToNearestNest: number
  /** 最近巢穴 id，無則空字串 */
  nearestNestId: string
  /** 場上可見生物數量 */
  visibleCreatureCount: number
  /** 建議裝備的內功（有更強的未裝備內功），無則 undefined */
  betterInnerSkill: { id: string; name: string; insightRequirement: number } | undefined
  /** 是否有傷害型內功已裝備 */
  hasDamageInnerSkill: boolean
  /** 內力比 0~1 */
  innerPowerRatio: number
}

function manhattan(a: Position, b: Position): number {
  return Math.abs(a.row - b.row) + Math.abs(a.column - b.column)
}

/**
 * 計算模糊輸入變數（每步重新呼叫，perception 基於當前 state）。
 *
 * V1 簡化：maxVisibleEnemyDamage 用 creature.health * 0.3 粗估，
 * 後續可替換為精確傷害公式。
 */
export function computeFuzzyInputs(state: GameState, player: PlayerState): FuzzyInputs {
  const hostiles = listHostileActors(state)

  // 粗估敵人最高傷害力：取最強生物的 health * 0.3
  const creatureHostiles = hostiles.filter((h): h is HostileActor & { sourceType: 'creature'; creature: { health: number; position: Position } } => h.sourceType === 'creature')
  const maxVisibleEnemyDamage = creatureHostiles.length > 0
    ? Math.max(...creatureHostiles.map((h) => Math.max(1, Math.floor(h.creature.health * 0.3))))
    : 0

  const hitsSurvivable = maxVisibleEnemyDamage > 0
    ? player.health / maxVisibleEnemyDamage
    : 99

  const distToNearestThreat = hostiles.length > 0
    ? Math.min(...hostiles.map((h) => manhattan(player.position, h.sourceType === 'creature' ? h.creature.position : h.nest.position)))
    : Infinity

  const interests = collectReachableInterests(state, player)
  const itemInterests = interests.filter((i: ReachableInterest) => i.kind === 'item')

  const distToNearestItem = itemInterests.length > 0
    ? Math.min(...itemInterests.map((i: ReachableInterest) => i.cost))
    : Infinity

  // 四方向出口計算：上下左右可通行且未被佔據 = 出口
  const blocked = new Set(
    getBlockedPositions(state, player.id).map((p) => `${p.row}-${p.column}`),
  )
  const cellsByPosition = new Map(state.map.cells.map((c) => [`${c.row}-${c.column}`, c]))
  const adjacents = getAdjacentPositions(player.position)
  let exitCount = 0
  let nearestExit: Position | undefined
  for (const pos of adjacents) {
    const cell = cellsByPosition.get(`${pos.row}-${pos.column}`)
    const isBlocked = blocked.has(`${pos.row}-${pos.column}`)
    if (cell && canTraverseTerrain(cell.terrain, player) && !isBlocked) {
      exitCount++
      if (!nearestExit) nearestExit = pos
    }
  }

  // 建設相關：找可見據點（近到遠）+ 最近據點 + 建料 + 可建造建築 + 最近資源點
  const activeBases = state.bases.filter((b) => b.active !== false && b.health > 0)
  const allVisibleBases = state.bases
    .filter((b) => b.health > 0)
    .sort((a, b) => manhattan(player.position, a.position) - manhattan(player.position, b.position))
  const visibleBaseIds = allVisibleBases.map((b) => b.id)

  const nearestBase = activeBases.length > 0
    ? activeBases.reduce((best, b) => manhattan(player.position, b.position) < manhattan(player.position, best.position) ? b : best)
    : undefined

  const materialRatio = nearestBase
    ? nearestBase.buildingMaterials / Math.max(1, nearestBase.maxBuildingMaterials)
    : 0

  // 找可建造的建築：材料夠 + rank 夠 + 未建過同類型
  const existingTypes = new Set(nearestBase?.buildings.map((b) => b.type) ?? [])
  const buildableBuilding = nearestBase
    ? buildingCatalog.find((template) => {
      if (existingTypes.has(template.type)) return false
      if (nearestBase.martialSchoolId && template.schoolId && template.schoolId !== nearestBase.martialSchoolId) return false
      if (nearestBase.allowedBuildings && !nearestBase.allowedBuildings.some((a) => a.type === template.type)) return false
      if (!canPlayerBuildBuildingType(player, template.type)) return false
      if (nearestBase.buildingMaterials < template.constructionCost) return false
      return true
    })
    : undefined
  const canBuild = !!buildableBuilding

  // 最近資源點（屬於最近據點）
  const baseResourcePoints = nearestBase
    ? state.resourcePoints.filter((rp) => rp.ownerBaseId === nearestBase!.id && rp.active !== false && rp.health > 0)
    : []
  const nearestResourcePoint = baseResourcePoints.length > 0
    ? baseResourcePoints.reduce((best, rp) => manhattan(player.position, rp.position) < manhattan(player.position, best.position) ? rp : best)
    : undefined
  const distToNearestResourcePoint = nearestResourcePoint
    ? manhattan(player.position, nearestResourcePoint.position)
    : Infinity
  const isAdjacentToResourcePoint = distToNearestResourcePoint === 1

  // 探索相關：可達且未探索的格子
  const exploredIds = new Set(state.visibility?.exploredCellIds ?? [])
  const reachableCells = collectReachableCells(state, player)
  const unexploredCells = reachableCells.filter((c) => !exploredIds.has(c.cellId) && c.cost > 0)
  const unexploredReachableCount = unexploredCells.length
  const nearestUnexploredPosition = unexploredCells.length > 0
    ? unexploredCells.reduce((best, c) => c.cost < best.cost ? c : best).position
    : undefined

  // 戰鬥相關：最近怪物
  const creatures = state.creatures.filter((c) => c.health > 0)
  const distToNearestCreature = creatures.length > 0
    ? Math.min(...creatures.map((c) => manhattan(player.position, c.position)))
    : Infinity
  const nearestCreature = creatures.length > 0
    ? creatures.reduce((best, c) => manhattan(player.position, c.position) < manhattan(player.position, best.position) ? c : best)
    : undefined

  // 屬性分配
  const availableAttributePoints = player.availableAttributePoints ?? 0

  // 道具使用：找最值得用的道具（低血→回血，低體力→回體力，未探索→探地符，遠離據點→回營符）
  const usedEffects = new Set(player.itemEffectsUsedThisTurn ?? [])
  const inventory = player.inventory
    .filter((e) => e.quantity > 0)
    .filter((e) => {
      const def = itemCatalog.find((c) => c.id === e.itemId)
      return def != null && !usedEffects.has(def.effect)
    })
  const healthRatio = player.health / player.maxHealth
  const staminaRatioVal = player.stamina / player.maxStamina
  const bestItemToUse = inventory.length > 0
    ? pickBestItem(inventory, itemCatalog, healthRatio, staminaRatioVal, unexploredCells.length, nearestBase)
    : undefined

  // 裝備相關：找出值得裝備的裝備
  const equipableEquipment = findBestEquipCandidate(player)

  // 巢穴相關：最近巢穴
  const nests = state.creatureNests.filter((n) => n.health > 0)
  const distToNearestNest = nests.length > 0
    ? Math.min(...nests.map((n) => manhattan(player.position, n.position)))
    : Infinity
  const nearestNest = nests.length > 0
    ? nests.reduce((best, n) => manhattan(player.position, n.position) < manhattan(player.position, best.position) ? n : best)
    : undefined

  // 可見生物數量
  const visibleCreatureCount = creatures.length

  // 內功相關：裝備更好的內功 / 傷害型內功 / 內力比
  const effectiveAttributes = getEffectiveAttributesForPlayer(player)
  const innerPowerRatio = player.maxInnerPower > 0 ? player.innerPower / player.maxInnerPower : 0
  const currentInnerSkill = allInnerSkillCatalog.find((s) => s.id === player.innerSkillId)
  const hasDamageInnerSkill = currentInnerSkill != null && currentInnerSkill.calculateDamage != null

  // 找更好的內功：已學會但未裝備，且悟性足夠，且比目前內功更強
  const bestInnerSkill = findBetterInnerSkill(player, effectiveAttributes)

  return {
    hitsSurvivable,
    staminaRatio: player.stamina / player.maxStamina,
    distToNearestThreat,
    maxVisibleEnemyDamage,
    reachableItemCount: itemInterests.length,
    reachableResourceCount: interests.filter((i: ReachableInterest) => i.kind === 'resource').length,
    reachableInterests: interests,
    distToNearestItem,
    exitCount,
    nearestExit,
    nearestBase,
    visibleBaseIds,
    materialRatio,
    canBuild,
    buildableBuilding: buildableBuilding ? { id: buildableBuilding.id, type: buildableBuilding.type, name: buildableBuilding.name } : undefined,
    nearestResourcePoint,
    distToNearestResourcePoint,
    isAdjacentToResourcePoint,
    unexploredReachableCount,
    nearestUnexploredPosition,
    distToNearestCreature,
    nearestCreatureId: nearestCreature?.id ?? '',
    availableAttributePoints,
    bestItemToUse,
    equipableEquipment,
    distToNearestNest,
    nearestNestId: nearestNest?.id ?? '',
    visibleCreatureCount,
    betterInnerSkill: bestInnerSkill,
    hasDamageInnerSkill,
    innerPowerRatio,
  }
}

function pickBestItem(
  inventory: Array<{ itemId: string; quantity: number }>,
  catalog: typeof itemCatalog,
  healthRatio: number,
  staminaRatio: number,
  unexploredCount: number,
  nearestBase: BaseState | undefined,
): { id: string; effect: string; name: string } | undefined {
  // 優先級：低血回血 > 低體力回氣 > 探地符(有未探索) > 回營符(離據點遠) > 其他
  const byEffect = new Map(inventory.map((e) => {
    const def = catalog.find((c) => c.id === e.itemId)
    return [e.itemId, def] as const
  }).filter((pair): pair is [string, NonNullable<typeof pair[1]>] => pair[1] !== undefined))

  // 低血回血
  if (healthRatio < 0.5) {
    const heal = [...byEffect.entries()].find(([, d]) => d.effect === 'health')
    if (heal) return { id: heal[0], effect: 'health', name: heal[1].name }
  }

  // 低體力回氣
  if (staminaRatio < 0.4) {
    const stamina = [...byEffect.entries()].find(([, d]) => d.effect === 'stamina')
    if (stamina) return { id: stamina[0], effect: 'stamina', name: stamina[1].name }
  }

  // 探地符（有未探索格）
  if (unexploredCount > 0) {
    const scout = [...byEffect.entries()].find(([, d]) => d.effect === 'scout')
    if (scout) return { id: scout[0], effect: 'scout', name: scout[1].name }
  }

  // 回營符（有據點時）
  if (nearestBase) {
    const recall = [...byEffect.entries()].find(([, d]) => d.effect === 'recall-base')
    if (recall) return { id: recall[0], effect: 'recall-base', name: recall[1].name }
  }

  // 屬性提升道具
  const attrUp = [...byEffect.entries()].find(([, d]) => d.effect === 'attribute-up')
  if (attrUp) return { id: attrUp[0], effect: 'attribute-up', name: attrUp[1].name }

  return undefined
}

function findBestEquipCandidate(player: PlayerState): { instanceId: string; equipmentId: string; slot: string; name: string; durability: number } | undefined {
  const loadout = player.equipmentLoadout
  const inventory = player.equipmentInventory ?? []
  if (inventory.length === 0) return undefined

  const getDef = (equipmentId: string) => equipmentCatalog.find((e) => e.id === equipmentId)
  const slotKeys: Array<{ slot: string; key: 'weaponInstanceId' | 'armorInstanceId' | 'accessoryInstanceId' }> = [
    { slot: 'weapon', key: 'weaponInstanceId' },
    { slot: 'armor', key: 'armorInstanceId' },
    { slot: 'accessory', key: 'accessoryInstanceId' },
  ]

  for (const { slot, key } of slotKeys) {
    const currentInstanceId = loadout?.[key]
    const currentInstance = currentInstanceId
      ? inventory.find((e) => e.instanceId === currentInstanceId)
      : undefined

    // 情況 A：部位空 → 找第一個該部位、耐久 > 0 的裝備
    if (!currentInstance) {
      const candidate = inventory.find((e) => {
        if (e.durability <= 0) return false
        const def = getDef(e.equipmentId)
        return def?.slot === slot
      })
      if (candidate) {
        const def = getDef(candidate.equipmentId)
        return {
          instanceId: candidate.instanceId,
          equipmentId: candidate.equipmentId,
          slot,
          name: def?.name ?? candidate.equipmentId,
          durability: candidate.durability,
        }
      }
    }

    // 情況 B：部位有裝備但耐久 = 0 → 找同部位替換品（耐久 > 0）
    if (currentInstance && currentInstance.durability <= 0) {
      const candidate = inventory.find((e) => {
        if (e.instanceId === currentInstance.instanceId) return false
        if (e.durability <= 0) return false
        const def = getDef(e.equipmentId)
        return def?.slot === slot
      })
      if (candidate) {
        const def = getDef(candidate.equipmentId)
        return {
          instanceId: candidate.instanceId,
          equipmentId: candidate.equipmentId,
          slot,
          name: def?.name ?? candidate.equipmentId,
          durability: candidate.durability,
        }
      }
    }
  }

  return undefined
}

function findBetterInnerSkill(
  player: PlayerState,
  effectiveAttributes: { insight: number; armStrength: number; constitution: number; agility: number; innerEnergy: number },
): { id: string; name: string; insightRequirement: number } | undefined {
  const currentSkill = allInnerSkillCatalog.find((s) => s.id === player.innerSkillId)
  const currentDamage = currentSkill?.calculateDamage?.(effectiveAttributes) ?? 0

  const candidates = allInnerSkillCatalog.filter((s) => player.innerSkillIds.includes(s.id) && s.id !== player.innerSkillId)

  let best: { id: string; name: string; insightRequirement: number } | undefined
  let bestDamage = currentDamage

  for (const skill of candidates) {
    if (effectiveAttributes.insight < skill.insightRequirement) continue
    const damage = skill.calculateDamage(effectiveAttributes)
    if (damage > bestDamage) {
      bestDamage = damage
      best = { id: skill.id, name: skill.name, insightRequirement: skill.insightRequirement }
    }
  }

  return best
}
