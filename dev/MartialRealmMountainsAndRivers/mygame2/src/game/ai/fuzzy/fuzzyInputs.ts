import type { BaseState, GameState, PlayerState, Position, ResourcePointState, SectGateState } from '../../types'
import { listHostileActors, type HostileActor } from '../perception/targetDiscovery'
import { collectReachableInterests, type ReachableInterest } from '../perception/reachableInterests'
import { getBlockedPositions, buildMovementCostMap } from '../../rules/movementRules'
import { canTraverseTerrain } from '../../rules/playerDerivedRules'
import { getAdjacentPositions } from '../../types'
import { buildingCatalog } from '../../catalogs/buildingCatalog'
import { canPlayerBuildBuildingType } from '../../rules/buildingProgressionRules'
import { collectReachableCells } from '../perception/reachablePositions'
import { itemCatalog } from '../../catalogs/itemCatalog'
import { equipmentCatalog } from '../../catalogs/equipmentCatalog'
import { allInnerSkillCatalog, getMartialHallSkills, martialHallInnerSkillCatalog, martialHallExternalSkillCatalog } from '../../catalogs/martialHallSkillCatalog'
import { getEffectiveAttributesForPlayer } from '../../rules/playerDerivedRules'
import { getPlayerVisibleCellIds } from '../../rules/visibilityRules'
import { getSectGateSkills, getSectGateLearnCost } from '../../rules/sectGateRules'
import { defenseStructureCatalog } from '../../catalogs/defenseStructureCatalog'
import { getRepairSummary, hasBuilding } from '../../rules/buildingRules'
import { getMartialHallSkillCost } from '../../actions/martialHallActions'

/** 各目標的可行性資料：「能不能做」+「走多遠」 */
export interface FeasibilityData {
  /** 學招：最近門派學費 */
  learnGateCost: number
  /** 學招：玩家金錢是否夠門派學費 */
  canAffordGateLearn: boolean
  /** 學招：到最近門派距離 */
  distToNearestGate: number
  /** 學招：最近武館學費 */
  learnHallCost: number
  /** 學招：玩家金錢是否夠武館學費 */
  canAffordHallLearn: boolean
  /** 學招：到最近有武館的據點距離 */
  distToNearestHallBase: number
  /** 練功/學招：門派是否可步行到達 */
  canReachNearestGate: boolean
  /** 任務：最近有告示牌的據點 id */
  missionBaseId: string
  /** 修理：最近有工坊的據點 id */
  repairBaseId: string
  /** 就醫：最近有醫療室的據點 id */
  healBaseId: string
  /** 據點：到最近 active 據點距離 */
  distToNearestActiveBase: number
}

export interface FuzzyInputs {
  /** 能扛幾下攻擊（health / maxEnemyDamage），無敵人時 = 99 */
  hitsSurvivable: number
  /** 體力比 0~1 */
  staminaRatio: number
  /** 血量比 0~1 */
  healthRatio: number
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
  /** 不可見且未探索的格子數量 */
  unexploredInvisibleCells: number
  /** 最近的不可見未探索格子位置，無則 undefined */
  nearestUnexploredInvisiblePosition: Position | undefined
  /** 到最近怪物的距離，無怪物 = Infinity */
  distToNearestCreature: number
  /** 最近怪物 id，無則空字串 */
  nearestCreatureId: string
  /** 可分配屬性點數 */
  availableAttributePoints: number
  /** 建議使用的道具（id + effect），無則 undefined */
  bestItemToUse: { id: string; effect: string; name: string; effectValue: number } | undefined
  /** 建議裝備的裝備（部位空 or 耐久=0 需替換），無則 undefined */
  equipableEquipment: { instanceId: string; equipmentId: string; slot: string; name: string; durability: number } | undefined
  /** 到最近巢穴的距離，無巢穴 = Infinity */
  distToNearestNest: number
  /** 最近巢穴 id，無則空字串 */
  nearestNestId: string
  /** 視野範圍內的生物 id 陣列（近到遠排序） */
  visibleCreatureIds: string[]
  /** 建議裝備的內功（有更強的未裝備內功），無則 undefined */
  betterInnerSkill: { id: string; name: string; insightRequirement: number } | undefined
  /** 是否有傷害型內功已裝備 */
  hasDamageInnerSkill: boolean
  /** 內力比 0~1 */
  innerPowerRatio: number
  /** 可在武館學習的技能（最近據點的武館），無則 undefined */
  learnableSkillAtHall: { baseId: string; skillType: 'inner' | 'external'; skillId: string; name: string } | undefined
  /** 可在門派據點學習的技能（最近門派），無則 undefined */
  learnableSkillAtGate: { gateId: string; skillId: string; name: string; position: Position } | undefined
  /** 可在門派據點練功的技能，無則 undefined */
  practiceableSkillAtGate: { gateId: string; skillId: string; name: string; position: Position } | undefined
  /** 附近據點是否有告示牌（可執行任務） */
  hasMissionBoard: boolean
  /** 附近據點是否有醫療室（可就醫） */
  hasInfirmary: boolean
  /** 附近據點有工坊且裝備受損（可修理） */
  hasWorkshopDamaged: boolean
  /** 玩家等級 */
  playerLevel: number
  /** 預期等級（round / 5），低於此值表示落後 */
  expectedLevel: number
  /** 等級是否落後（需要積極打怪） */
  needsLeveling: boolean
  /** 可在商店購買的回血道具（有商店 + 有錢 + 未買過） */
  buyableHealItem: { itemId: string; name: string; price: number } | undefined
  /** 可建造的防禦設施（材料夠 + rank 夠），取最近據點 */
  buildableDefenseStructure: { type: string; name: string } | undefined
  /** 據點附近的威脅數量（曼哈頓 ≤ 5） */
  threatCountNearBase: number
  /** 是否與最近的 active 據點相鄰 */
  isAdjacentToBase: boolean
  /** 是否有可擊殺的生物（相鄰 + 扛得住 + 體力夠） */
  killableCreature: boolean
  /** 各目標可行性資料 */
  feasibility: FeasibilityData
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

  // 先計算視野，後續用於過濾可見生物
  const visibleCellIds = getPlayerVisibleCellIds(state, player.id)
  const cellsByPosition = new Map(state.map.cells.map((c) => [`${c.row}-${c.column}`, c]))

  // 粗估敵人最高傷害力：只取視野內生物的 health * 0.3
  const creatureHostiles = hostiles.filter((h): h is HostileActor & { sourceType: 'creature'; creature: { health: number; position: Position } } => h.sourceType === 'creature')
  const visibleCreatures = creatureHostiles.filter((h) => {
    const cell = cellsByPosition.get(`${h.creature.position.row}-${h.creature.position.column}`)
    return cell != null && visibleCellIds.has(cell.id)
  })
  const maxVisibleEnemyDamage = visibleCreatures.length > 0
    ? Math.max(...visibleCreatures.map((h) => Math.max(1, Math.floor(h.creature.maxHealth * 0.3))))
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
    .filter((b) => {
      if (b.health <= 0) return false
      const cell = cellsByPosition.get(`${b.position.row}-${b.position.column}`)
      return cell != null && visibleCellIds.has(cell.id)
    })
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

  // 不可見且未探索的格子：玩家從未看見也當前看不見的格子
  // 無穿牆輕功時，排除牆壁地形（最外圍一圈）
  const hasWallStep = (player.buffs ?? []).some((b) => b.definitionId === 'wall-step')
  const allInvisibleUnexplored = state.map.cells.filter((c) => {
    if (!hasWallStep && c.terrain === 'wall') return false
    return !visibleCellIds.has(c.id) && !exploredIds.has(c.id)
  })
  const unexploredInvisibleCells = allInvisibleUnexplored.length
  // 用 Dijkstra 從玩家位置建成本圖，找路徑最近的不可見未探索格
  let nearestUnexploredInvisiblePosition: Position | undefined
  if (allInvisibleUnexplored.length > 0) {
    const playerCosts = buildMovementCostMap(state.map, player)
    nearestUnexploredInvisiblePosition = allInvisibleUnexplored
      .reduce<Position | undefined>((best, c) => {
        const costBest = best ? (playerCosts.get(`${best.row}-${best.column}`) ?? Infinity) : Infinity
        const costC = playerCosts.get(`${c.row}-${c.column}`) ?? Infinity
        return costC < costBest ? c : best
      }, undefined)
  }

  // 戰鬥相關：視野內生物（近到遠）
  const visibleCreatureIds = visibleCreatures.map((c) => c.creature.id)
  const distToNearestCreature = visibleCreatures.length > 0
    ? manhattan(player.position, visibleCreatures[0].creature.position)
    : Infinity
  const nearestCreature = visibleCreatures[0]?.creature

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

  // 內功相關：裝備更好的內功 / 傷害型內功 / 內力比
  const effectiveAttributes = getEffectiveAttributesForPlayer(player)
  const innerPowerRatio = player.maxInnerPower > 0 ? player.innerPower / player.maxInnerPower : 0
  const currentInnerSkill = allInnerSkillCatalog.find((s) => s.id === player.innerSkillId)
  const hasDamageInnerSkill = currentInnerSkill != null && currentInnerSkill.calculateDamage != null

  // 找更好的內功：已學會但未裝備，且悟性足夠，且比目前內功更強
  const bestInnerSkill = findBetterInnerSkill(player, effectiveAttributes)

  // ── 新增目標相關輸入 ──────────────────────────────────────────

  // 武館學招：找最近據點的武館，是否有未學技能
  const learnableSkillAtHall = findLearnableSkillAtHall(player, nearestBase)

  // 門派學招/練功：找最近門派據點
  const nearestSectGate = (state.sectGates ?? []).length > 0
    ? (state.sectGates ?? []).reduce((best, g) => manhattan(player.position, g.position) < manhattan(player.position, best.position) ? g : best)
    : undefined
  const learnableSkillAtGate = findLearnableSkillAtGate(player, nearestSectGate)
  const practiceableSkillAtGate = findPracticeableSkillAtGate(player, nearestSectGate)

  // 告示牌任務 / 醫療室 / 修理工坊
  const hasMissionBoard = nearestBase != null && hasBuilding(nearestBase, 'board')
  const hasInfirmary = nearestBase != null && hasBuilding(nearestBase, 'infirmary')
  const hasWorkshopDamaged = nearestBase != null && hasBuilding(nearestBase, 'workshop')
    && getRepairSummary(player, nearestBase.buildings.find((b) => b.type === 'workshop')?.level ?? 1).equipmentCount > 0

  // 等級相關
  const playerLevel = player.level ?? 1
  const expectedLevel = Math.max(1, Math.floor(state.round / 5))
  const needsLeveling = playerLevel < expectedLevel

  // 商店買道具：附近有道具商店 + 有錢買回血道具
  const buyableHealItem = findBuyableHealItem(player, nearestBase, state)

  // 防禦建設：找可建造的防禦設施
  const buildableDefenseStructure = findBuildableDefenseStructure(player, nearestBase)

  // 據點附近威脅數（曼哈頓 ≤ 5）
  const threatCountNearBase = nearestBase
    ? hostiles.filter((h) => {
      const pos = h.sourceType === 'creature' ? h.creature.position : h.nest.position
      return manhattan(nearestBase.position, pos) <= 5
    }).length
    : 0

  // 是否與最近 active 據點相鄰
  const isAdjacentToBase = nearestBase != null && manhattan(player.position, nearestBase.position) === 1

  // 可擊殺：怪在相鄰格 + 扛得住 + 體力夠
  const killableCreature = distToNearestCreature === 1 && hitsSurvivable >= 1 && player.stamina > 0

  // ── feasibility ────────────────────────────────────────────────

  // 學招（門派）：學費 + 距離
  const learnGateCost = nearestSectGate ? getSectGateLearnCost(nearestSectGate.schoolId, '') : Infinity
  const canAffordGateLearn = learnGateCost !== Infinity && (player.money ?? 0) >= learnGateCost
  const distToNearestGate = nearestSectGate ? manhattan(player.position, nearestSectGate.position) : Infinity

  // 學招（武館）：學費 + 距離
  const hallSkills = nearestBase ? getMartialHallSkills(nearestBase.martialSchoolId) : { inner: [] as typeof martialHallInnerSkillCatalog, external: [] as typeof martialHallExternalSkillCatalog }
  const learnableHallSkill = hallSkills.inner.find((s) => !player.innerSkillIds.includes(s.id) && (player.attributes?.insight ?? 0) >= s.insightRequirement)
    ?? hallSkills.external.find((s) => !player.externalSkillIds.includes(s.id))
  const learnHallCost = learnableHallSkill ? getMartialHallSkillCost('insightCost' in learnableHallSkill ? learnableHallSkill.insightCost : learnableHallSkill.insightRequirement) : Infinity
  const canAffordHallLearn = learnHallCost !== Infinity && (player.money ?? 0) >= learnHallCost
  const distToNearestHallBase = nearestBase && learnableHallSkill ? manhattan(player.position, nearestBase.position) : Infinity

  // 門派是否可步行到達（Dijkstra 成本圖，成本 > 0 即可達）
  const canReachNearestGate = (() => {
    if (!nearestSectGate) return false
    const costs = buildMovementCostMap(state.map, player)
    const cost = costs.get(`${nearestSectGate.position.row}-${nearestSectGate.position.column}`) ?? 0
    return cost > 0
  })()

  // 任務/修理/就醫：視野內最近有設施的據點 id
  const visibleBases = state.bases.filter((b) => visibleBaseIds.includes(b.id))
  const missionBaseId = visibleBases.find((b) => b.active !== false && b.health > 0 && hasBuilding(b, 'board'))?.id ?? ''
  const repairBaseId = visibleBases.find((b) => b.active !== false && b.health > 0 && hasBuilding(b, 'workshop'))?.id ?? ''
  const healBaseId = visibleBases.find((b) => b.active !== false && b.health > 0 && hasBuilding(b, 'infirmary'))?.id ?? ''

  // 到最近 active 據點距離
  const distToNearestActiveBase = nearestBase ? manhattan(player.position, nearestBase.position) : Infinity

  return {
    hitsSurvivable,
    staminaRatio: player.stamina / player.maxStamina,
    healthRatio: player.health / player.maxHealth,
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
    unexploredInvisibleCells,
    nearestUnexploredInvisiblePosition: nearestUnexploredInvisiblePosition
      ? { row: nearestUnexploredInvisiblePosition.row, column: nearestUnexploredInvisiblePosition.column }
      : undefined,
    distToNearestCreature,
    nearestCreatureId: nearestCreature?.id ?? '',
    availableAttributePoints,
    bestItemToUse,
    equipableEquipment,
    distToNearestNest,
    nearestNestId: nearestNest?.id ?? '',
    visibleCreatureIds,
    betterInnerSkill: bestInnerSkill,
    hasDamageInnerSkill,
    innerPowerRatio,
    learnableSkillAtHall,
    learnableSkillAtGate,
    practiceableSkillAtGate,
    hasMissionBoard,
    hasInfirmary,
    hasWorkshopDamaged,
    playerLevel,
    expectedLevel,
    needsLeveling,
    buyableHealItem,
    buildableDefenseStructure,
    threatCountNearBase,
    isAdjacentToBase,
    killableCreature,
    feasibility: {
      learnGateCost,
      canAffordGateLearn,
      distToNearestGate,
      learnHallCost,
      canAffordHallLearn,
      distToNearestHallBase,
      canReachNearestGate,
      missionBaseId,
      repairBaseId,
      healBaseId,
      distToNearestActiveBase,
    },
  }
}

function pickBestItem(
  inventory: Array<{ itemId: string; quantity: number }>,
  catalog: typeof itemCatalog,
  healthRatio: number,
  staminaRatio: number,
  unexploredCount: number,
  nearestBase: BaseState | undefined,
): { id: string; effect: string; name: string; effectValue: number } | undefined {
  // 優先級：低血回血 > 低體力回氣 > 探地符(有未探索) > 回營符(離據點遠) > 其他
  const byEffect = new Map(inventory.map((e) => {
    const def = catalog.find((c) => c.id === e.itemId)
    return [e.itemId, def] as const
  }).filter((pair): pair is [string, NonNullable<typeof pair[1]>] => pair[1] !== undefined))

  // 低血回血
  if (healthRatio < 0.5) {
    const heal = [...byEffect.entries()].find(([, d]) => d.effect === 'health')
    if (heal) return { id: heal[0], effect: 'health', name: heal[1].name, effectValue: heal[1].effectValue ?? 0 }
  }

  // 低體力回氣
  if (staminaRatio < 0.4) {
    const stamina = [...byEffect.entries()].find(([, d]) => d.effect === 'stamina')
    if (stamina) return { id: stamina[0], effect: 'stamina', name: stamina[1].name, effectValue: stamina[1].effectValue ?? 0 }
  }

  // 探地符（有未探索格）
  if (unexploredCount > 0) {
    const scout = [...byEffect.entries()].find(([, d]) => d.effect === 'scout')
    if (scout) return { id: scout[0], effect: 'scout', name: scout[1].name, effectValue: scout[1].effectValue ?? 0 }
  }

  // 回營符（有據點時）
  if (nearestBase) {
    const recall = [...byEffect.entries()].find(([, d]) => d.effect === 'recall-base')
    if (recall) return { id: recall[0], effect: 'recall-base', name: recall[1].name, effectValue: recall[1].effectValue ?? 0 }
  }

  // 屬性提升道具
  const attrUp = [...byEffect.entries()].find(([, d]) => d.effect === 'attribute-up')
  if (attrUp) return { id: attrUp[0], effect: 'attribute-up', name: attrUp[1].name, effectValue: attrUp[1].effectValue ?? 0 }

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

// ── 新增目標輔助函數 ───────────────────────────────────────────

function findLearnableSkillAtHall(
  player: PlayerState,
  base: BaseState | undefined,
): { baseId: string; skillType: 'inner' | 'external'; skillId: string; name: string } | undefined {
  if (!base) return undefined
  const hall = base.buildings.find((b) => b.type.startsWith('martial-hall'))
  if (!hall) return undefined
  const skills = getMartialHallSkills(base.martialSchoolId)
  // 找未學會的內功
  const unlearnedInner = skills.inner.find((s) => !player.innerSkillIds.includes(s.id) && (player.attributes?.insight ?? 0) >= s.insightRequirement)
  if (unlearnedInner) return { baseId: base.id, skillType: 'inner', skillId: unlearnedInner.id, name: unlearnedInner.name }
  // 找未學會的外功
  const unlearnedExternal = skills.external.find((s) => !player.externalSkillIds.includes(s.id))
  if (unlearnedExternal) return { baseId: base.id, skillType: 'external', skillId: unlearnedExternal.id, name: unlearnedExternal.name }
  return undefined
}

function findLearnableSkillAtGate(
  player: PlayerState,
  gate: SectGateState | undefined,
): { gateId: string; skillId: string; name: string; position: Position } | undefined {
  if (!gate) return undefined
  const skills = getSectGateSkills(gate.schoolId)
  const all = [...skills.inner, ...skills.damage, ...skills.aura]
  const unlearned = all.find((s) => {
    if ('insightRequirement' in s) return !player.innerSkillIds.includes(s.id)
    return !player.externalSkillIds.includes(s.id)
  })
  if (!unlearned) return undefined
  return { gateId: gate.id, skillId: unlearned.id, name: unlearned.name, position: gate.position }
}

function findPracticeableSkillAtGate(
  player: PlayerState,
  gate: SectGateState | undefined,
): { gateId: string; skillId: string; name: string; position: Position } | undefined {
  if (!gate) return undefined
  const skills = getSectGateSkills(gate.schoolId)
  const all = [...skills.inner, ...skills.damage, ...skills.aura]
  const learned = all.find((s) => {
    if ('insightRequirement' in s) return player.innerSkillIds.includes(s.id)
    return player.externalSkillIds.includes(s.id)
  })
  if (!learned) return undefined
  return { gateId: gate.id, skillId: learned.id, name: learned.name, position: gate.position }
}

function findBuyableHealItem(
  player: PlayerState,
  base: BaseState | undefined,
  _state: GameState,
): { itemId: string; name: string; price: number } | undefined {
  if (!base) return undefined
  if (!hasBuilding(base, 'item-shop')) return undefined
  const healthMissing = player.maxHealth - player.health
  if (healthMissing <= 0) return undefined
  const healItems = itemCatalog.filter((i) => i.effect === 'health' && i.buyPrice > 0)
  // 找玩家買得起且未使用過的回血道具（由低到高）
  const usedEffects = new Set(player.itemEffectsUsedThisTurn ?? [])
  const affordable = healItems
    .filter((i) => i.buyPrice <= (player.money ?? 0) && !usedEffects.has(i.effect))
    .sort((a, b) => a.buyPrice - b.buyPrice)
  if (affordable.length === 0) return undefined
  const best = affordable[0]
  return { itemId: best.id, name: best.name, price: best.buyPrice }
}

function findBuildableDefenseStructure(
  player: PlayerState,
  base: BaseState | undefined,
): { type: string; name: string } | undefined {
  if (!base) return undefined
  // 從防禦設施目錄中找玩家 rank 夠且材料夠的設施
  const materialBudget = base.buildingMaterials
  const rank = player.governanceRank ?? 1
  const candidates = defenseStructureCatalog.filter((d) => {
    if (d.constructionCost > materialBudget) return false
    if (d.requiredRank != null && rank < d.requiredRank) return false
    return true
  })
  if (candidates.length === 0) return undefined
  // 優先箭塔（主動防禦），其次城牆（被動防禦）
  const arrowTower = candidates.find((d) => d.type === 'arrow-tower')
  if (arrowTower) return { type: arrowTower.type, name: arrowTower.name }
  const wall = candidates.find((d) => d.type === 'barricade')
  if (wall) return { type: wall.type, name: wall.name }
  return { type: candidates[0].type, name: candidates[0].name }
}
