import type { BaseState, GameState, PlayerState, Position, ResourcePointState, SectGateState } from '../../types'
import { listHostileActors, type HostileActor } from '../perception/targetDiscovery'
import { collectReachableInterests, type ReachableInterest } from '../perception/reachableInterests'
import { getBlockedPositions, buildMovementCostMap } from '../../rules/movementRules'
import { canTraverseTerrain } from '../../rules/playerDerivedRules'
import { getAdjacentPositions } from '../../types'
import { buildingCatalog } from '../../catalogs/buildingCatalog'
import { canPlayerBuildBuildingType } from '../../rules/buildingProgressionRules'
import { collectReachableCells } from '../perception/reachablePositions'
import { elementBurstItems, itemCatalog } from '../../catalogs/itemCatalog'
import { equipmentCatalog } from '../../catalogs/equipmentCatalog'
import { allInnerSkillCatalog, getMartialHallSkills, martialHallInnerSkillCatalog, martialHallExternalSkillCatalog } from '../../catalogs/martialHallSkillCatalog'
import { getEffectiveAttributesForPlayer } from '../../rules/playerDerivedRules'
import { getElementDamageMultiplier, getSchoolElement, getSkillDamage, getSkillProgression, getExternalSkill, getSkillInnerPowerCost } from '../../rules/skillRules'
import { getPlayerVisibleCellIds } from '../../rules/visibilityRules'
import { getSectGateSkills, getSectGateLearnCost } from '../../rules/sectGateRules'
import { defenseStructureCatalog } from '../../catalogs/defenseStructureCatalog'
import { getRepairSummary, hasBuilding } from '../../rules/buildingRules'
import { getMartialHallSkillCost } from '../../actions/martialHallActions'
import { canUpgradeBuildingType, getBuildingLevel, getBuildingUpgradeResult, getEffectiveBuildingUpgradeCost } from '../../rules/buildingProgressionRules'
import { canBuyEquipment, getShopBaseId } from '../../rules/shopRules'
import type { AiPersonalityId } from '../../types/ai'
import { evaluateConstructionCandidateValue } from './constructionValue'
import { evaluateCombatCandidateValue } from './combatValue'
import { evaluateEquipmentCandidateValue, evaluateInnerSkillCandidateValue } from './equipmentValue'
import type { ValueEvaluation } from './valueContext'

export type ConstructionCandidate = {
  kind: 'build' | 'upgrade'
  baseId: string
  buildingId: string
  buildingType: string
  buildingName: string
  cost: number
  currentLevel?: number
  nextLevel?: number
  value: number
  valueFactors: ValueEvaluation['factors']
}

export type CombatCandidate = {
  creatureId: string
  creatureName: string
  position: Position
  distance: number
  damageRatio: number
  healthRatio: number
  value: number
  valueFactors: ValueEvaluation['factors']
}

export type EquipmentCandidate = {
  instanceId: string
  equipmentId: string
  slot: string
  name: string
  durability: number
  value: number
  valueFactors: ValueEvaluation['factors']
}

export type InnerSkillCandidate = {
  id: string
  name: string
  insightRequirement: number
  damageGainRatio: number
  value: number
  valueFactors: ValueEvaluation['factors']
}

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
  /** 所有據點是否都在視野內 */
  allBasesVisible: boolean
  /** 最近尚未取得視野的據點，無則 undefined */
  nearestUndiscoveredBase: BaseState | undefined
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
  /** 所有可替換裝備候選，依價值由高到低排序 */
  equipmentCandidates: EquipmentCandidate[]
  /** 到最近巢穴的距離，無巢穴 = Infinity */
  distToNearestNest: number
  /** 最近巢穴 id，無則空字串 */
  nearestNestId: string
  /** 視野範圍內的生物 id 陣列（近到遠排序） */
  visibleCreatureIds: string[]
  /** 場上存活生物總數（含視野外）；越多代表囤怪壓力越大，應優先清怪避免被圍攻 */
  totalCreatureCount: number
  /** 所有視野內生物的攻擊價值候選（高到低排序） */
  combatCandidates: CombatCandidate[]
  /** 建議裝備的內功（有更強的未裝備內功），無則 undefined */
  betterInnerSkill: { id: string; name: string; insightRequirement: number } | undefined
  /** 所有可替換內功候選，依價值由高到低排序 */
  innerSkillCandidates: InnerSkillCandidate[]
  /** 是否有傷害型內功已裝備 */
  hasDamageInnerSkill: boolean
  /** 目前內功單次傷害／最近可見敵人最大生命值，0~1 */
  combatDamageRatio: number
  /** 內力比 0~1 */
  innerPowerRatio: number
  /** 可在武館學習的技能（最近據點的武館），無則 undefined */
  learnableSkillAtHall: { baseId: string; skillType: 'inner' | 'external'; skillId: string; name: string } | undefined
  /** 可在門派據點學習的技能（最近門派），無則 undefined */
  learnableSkillAtGate: { gateId: string; skillType: 'inner' | 'external'; skillId: string; name: string; position: Position } | undefined
  /** 可在門派據點練功的技能，無則 undefined */
  practiceableSkillAtGate: { gateId: string; skillType: 'inner' | 'external'; skillId: string; name: string; position: Position } | undefined
  /** 附近據點是否有告示牌（可執行任務） */
  hasMissionBoard: boolean
  /** 最近據點是否尚未完成首次告示牌任務（完成後解鎖永久視野） */
  needsBaseVision: boolean
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
  /** 值得花錢買的實用道具（永久屬性丹優先，其次回血）+ 可達商店基地 */
  buyableUsefulItem: { itemId: string; name: string; price: number; effect: string } | undefined
  /** 值得在商店購買的裝備（能改善配裝 + 買得起）+ 可達商店基地 */
  buyableEquipment: { baseId: string; equipmentId: string; name: string; price: number; slot: string } | undefined
  /** 為最近巢穴準備的可購買元素爆發道具 */
  buyableNestBurstItem: { itemId: string; name: string; price: number; damage: number } | undefined
  /** 可建造的防禦設施（材料夠 + rank 夠），取最近據點 */
  buildableDefenseStructure: { type: string; name: string } | undefined
  /** 最近據點現有箭塔數量（含進階箭塔） */
  defenseTowerCount: number
  /** 最近據點所有合法建造與升級候選，已附帶基礎價值 */
  constructionCandidates: ConstructionCandidate[]
  /** 據點附近的威脅數量（曼哈頓 ≤ 5） */
  threatCountNearBase: number
  /** 是否與最近的 active 據點相鄰 */
  isAdjacentToBase: boolean
  /** 是否有可擊殺的生物（相鄰 + 扛得住 + 體力夠） */
  killableCreature: boolean
  /** 是否有可行「變強途徑」（可學招/練功/買裝/升內功/分配屬性）；打不死時據此決定是否放棄攻擊轉向經營 */
  hasGrowthPath: boolean
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
export function computeFuzzyInputs(state: GameState, player: PlayerState, personality?: AiPersonalityId): FuzzyInputs {
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

  // 所有據點是否都在視野內（排除已毀滅的）
  const activeBaseCount = state.bases.filter((b) => b.health > 0).length
  const allBasesVisible = visibleBaseIds.length >= activeBaseCount && activeBaseCount > 0

  const nearestBase = activeBases.length > 0
    ? activeBases.reduce((best, b) => manhattan(player.position, b.position) < manhattan(player.position, best.position) ? b : best)
    : undefined

  const undiscoveredBases = activeBases.filter((base) => base.discovered !== true)
  const nearestUndiscoveredBase = undiscoveredBases.length > 0
    ? undiscoveredBases.reduce((best, base) => manhattan(player.position, base.position) < manhattan(player.position, best.position) ? base : best)
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
  const threatCountNearBase = nearestBase
    ? hostiles.filter((h) => {
      const pos = h.sourceType === 'creature' ? h.creature.position : h.nest.position
      return manhattan(nearestBase.position, pos) <= 5
    }).length
    : 0
  const constructionCandidates: ConstructionCandidate[] = nearestBase
    ? [
        ...buildingCatalog
          .filter((template) => {
            if (existingTypes.has(template.type)) return false
            if (nearestBase.martialSchoolId && template.schoolId && template.schoolId !== nearestBase.martialSchoolId) return false
            if (nearestBase.allowedBuildings && !nearestBase.allowedBuildings.some((entry) => entry.type === template.type)) return false
            if (!canPlayerBuildBuildingType(player, template.type)) return false
            return nearestBase.buildingMaterials >= template.constructionCost
          })
          .map((template) => {
            const evaluation = evaluateConstructionCandidateValue({
              kind: 'build',
              buildingType: template.type,
              cost: template.constructionCost,
              materialRatio,
              threatCountNearBase,
              distanceToBase: manhattan(player.position, nearestBase.position),
              waystationAccessNeed: nearestUndiscoveredBase && nearestUndiscoveredBase.id !== nearestBase.id ? 1 : 0,
              personality,
            })
            return {
            kind: 'build' as const,
            baseId: nearestBase.id,
            buildingId: template.id,
            buildingType: template.type,
            buildingName: template.name,
            cost: template.constructionCost,
              value: evaluation.value,
              valueFactors: evaluation.factors,
            }
          }),
        ...nearestBase.buildings
          .filter((building) => {
            if (!canUpgradeBuildingType(building.type)) return false
            const allowedEntry = nearestBase.allowedBuildings?.find((entry) => entry.type === building.type)
            if (allowedEntry?.maxLevel !== undefined && getBuildingLevel(building) >= allowedEntry.maxLevel) return false
            return getBuildingUpgradeResult(nearestBase, building, player).ok
          })
          .map((building) => {
            const cost = getEffectiveBuildingUpgradeCost(building, player)
            const evaluation = evaluateConstructionCandidateValue({
              kind: 'upgrade',
              buildingType: building.type,
              cost,
              materialRatio,
              threatCountNearBase,
              distanceToBase: manhattan(player.position, nearestBase.position),
              waystationAccessNeed: nearestUndiscoveredBase && nearestUndiscoveredBase.id !== nearestBase.id ? 1 : 0,
              personality,
            })
            return {
            kind: 'upgrade' as const,
            baseId: nearestBase.id,
            buildingId: building.id,
            buildingType: building.type,
            buildingName: building.name,
            cost,
            currentLevel: getBuildingLevel(building),
            nextLevel: getBuildingLevel(building) + 1,
              value: evaluation.value,
              valueFactors: evaluation.factors,
            }
          }),
      ]
    : []

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
  const totalCreatureCount = state.creatures.filter((c) => c.health > 0).length
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
  const equipmentCandidates = findEquipmentCandidates(player, personality)
  const equipableEquipment = equipmentCandidates[0]
  // 值得在商店購買的裝備（能改善配裝且買得起）
  const buyableEquipment = findBuyableEquipment(state, player)

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
  // 玩家一回合可用的傷害手段總和：內功普通攻擊 + 所有「已裝備、目標為敵人、非功能型、內力足夠」的傷害外功。
  const innerAttackDamage = currentInnerSkill
    ? getSkillDamage(effectiveAttributes, currentInnerSkill, getSkillProgression(player, currentInnerSkill.id).level)
    : 0
  const equippedDamageExternalSkills = (player.equippedExternalSkillIds ?? [])
    .map((skillId) => getExternalSkill(skillId))
    .filter((skill) =>
      skill.target === 'target'
      && !skill.functionalEffect
      && (!skill.innerPowerCost || player.innerPower >= getSkillInnerPowerCost(skill.innerPowerCost, getSkillProgression(player, skill.id).level)),
    )
  const externalTurnDamage = equippedDamageExternalSkills.reduce(
    (total, skill) => total + getSkillDamage(effectiveAttributes, skill, getSkillProgression(player, skill.id).level),
    0,
  )
  const maxTurnDamage = innerAttackDamage + externalTurnDamage
  const nearestVisibleCreature = visibleCreatures[0]?.creature
  const combatDamageRatio = nearestVisibleCreature
    ? Math.min(1, maxTurnDamage / Math.max(1, nearestVisibleCreature.maxHealth))
    : 0
  const combatCandidates: CombatCandidate[] = visibleCreatures
    .map(({ creature }) => {
      const distance = manhattan(player.position, creature.position)
      const damageRatio = Math.min(1, maxTurnDamage / Math.max(1, creature.maxHealth))
      const hitsAgainstCreature = creature.health / Math.max(1, Math.floor(creature.maxHealth * 0.3))
      const evaluation = evaluateCombatCandidateValue({
        distance,
        healthRatio: creature.health / Math.max(1, creature.maxHealth),
        damageRatio,
        hitsSurvivable: hitsAgainstCreature > 0 ? player.health / Math.max(1, Math.floor(creature.maxHealth * 0.3)) : 0,
        staminaRatio: staminaRatioVal,
        level: creature.level ?? 1,
        personality,
      })
      return {
        creatureId: creature.id,
        creatureName: creature.name,
        position: creature.position,
        distance,
        damageRatio,
        healthRatio: creature.health / Math.max(1, creature.maxHealth),
        value: evaluation.value,
        valueFactors: evaluation.factors,
      }
    })
    .sort((first, second) => second.value - first.value)

  // 找更好的內功：已學會但未裝備，且悟性足夠，且比目前內功更強
  const innerSkillCandidates = findInnerSkillCandidates(player, effectiveAttributes, personality)
  const bestInnerSkill = innerSkillCandidates[0]

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
  const needsBaseVision = nearestBase != null && nearestBase.discovered !== true
  const hasInfirmary = nearestBase != null && hasBuilding(nearestBase, 'infirmary')
  const hasWorkshopDamaged = nearestBase != null && hasBuilding(nearestBase, 'workshop')
    && getRepairSummary(player, nearestBase.buildings.find((b) => b.type === 'workshop')?.level ?? 1).equipmentCount > 0

  // 等級相關
  const playerLevel = player.level ?? 1
  const expectedLevel = Math.max(1, Math.floor(state.round / 5))
  const needsLeveling = playerLevel < expectedLevel

  // 商店買道具：附近有道具商店 + 有錢買回血道具
  const buyableHealItem = findBuyableHealItem(player, nearestBase, state)
  const buyableUsefulItem = findBuyableUsefulItem(player, nearestBase)
  const buyableNestBurstItem = findBuyableNestBurstItem(player, nearestBase, nearestNest, state)

  // 防禦建設：找可建造的防禦設施
  const buildableDefenseStructure = findBuildableDefenseStructure(player, nearestBase)
  const defenseTowerCount = nearestBase?.buildings.filter((building) => building.type === 'arrow-tower' || building.type === 'advanced-arrow-tower').length ?? 0

  // 是否與最近 active 據點相鄰
  const isAdjacentToBase = nearestBase != null && manhattan(player.position, nearestBase.position) === 1

  // 可擊殺：怪在相鄰格 + 扛得住 + 體力夠
  const killableCreature = distToNearestCreature === 1 && hitsSurvivable >= 1 && player.stamina > 0

  // 可行變強途徑：能學招/練功/買裝/升內功/分配屬性。打不死時若有途徑應優先變強而非空轉或硬打。
  const hasGrowthPath = Boolean(
    learnableSkillAtHall
    || learnableSkillAtGate
    || practiceableSkillAtGate
    || equipableEquipment
    || innerSkillCandidates.length > 0
    || availableAttributePoints > 0,
  )

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
    const gateDistance = manhattan(player.position, nearestSectGate.position)
    if (gateDistance <= 1) return true
    return getAdjacentPositions(nearestSectGate.position).some((position) => {
      const cost = costs.get(`${position.row}-${position.column}`) ?? 0
      return cost > 0
    })
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
    allBasesVisible,
    nearestUndiscoveredBase,
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
    equipmentCandidates,
    distToNearestNest,
    nearestNestId: nearestNest?.id ?? '',
    visibleCreatureIds,
    totalCreatureCount,
    combatCandidates,
    betterInnerSkill: bestInnerSkill,
    innerSkillCandidates,
    hasDamageInnerSkill,
    combatDamageRatio,
    innerPowerRatio,
    learnableSkillAtHall,
    learnableSkillAtGate,
    practiceableSkillAtGate,
    hasMissionBoard,
    needsBaseVision,
    hasInfirmary,
    hasWorkshopDamaged,
    playerLevel,
    expectedLevel,
    needsLeveling,
    buyableHealItem,
    buyableUsefulItem,
    buyableEquipment,
    buyableNestBurstItem,
    buildableDefenseStructure,
    defenseTowerCount,
    constructionCandidates,
    threatCountNearBase,
    isAdjacentToBase,
    killableCreature,
    hasGrowthPath,
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

function findEquipmentCandidates(player: PlayerState, personality?: AiPersonalityId): EquipmentCandidate[] {
  const loadout = player.equipmentLoadout
  const inventory = player.equipmentInventory ?? []
  if (inventory.length === 0) return []

  const getDef = (equipmentId: string) => equipmentCatalog.find((e) => e.id === equipmentId)
  const slotKeys: Array<{ slot: string; key: 'weaponInstanceId' | 'armorInstanceId' | 'accessoryInstanceId' }> = [
    { slot: 'weapon', key: 'weaponInstanceId' },
    { slot: 'armor', key: 'armorInstanceId' },
    { slot: 'accessory', key: 'accessoryInstanceId' },
  ]

  const candidates: EquipmentCandidate[] = []
  for (const { slot, key } of slotKeys) {
    const currentInstanceId = loadout?.[key]
    const currentInstance = currentInstanceId
      ? inventory.find((e) => e.instanceId === currentInstanceId)
      : undefined
    const currentDef = currentInstance ? getDef(currentInstance.equipmentId) : undefined
    const replacesBroken = currentInstance?.durability === 0
    for (const candidate of inventory) {
      if (candidate.instanceId === currentInstance?.instanceId || candidate.durability <= 0) continue
      const def = getDef(candidate.equipmentId)
      if (!def || def.slot !== slot) continue
      const attributeGain = Object.entries(def.modifiers).reduce((total, [attribute, amount]) =>
        total + (amount ?? 0) - (currentDef?.modifiers[attribute as keyof typeof def.modifiers] ?? 0), 0)
      if (currentInstance && !replacesBroken && attributeGain <= 0) continue
      const evaluation = evaluateEquipmentCandidateValue({
        attributeGain,
        durabilityRatio: candidate.durability / Math.max(1, def.maxDurability),
        replacesBroken: !!replacesBroken,
        personality,
      })
      candidates.push({
        instanceId: candidate.instanceId,
        equipmentId: candidate.equipmentId,
        slot,
        name: def.name,
        durability: candidate.durability,
        value: evaluation.value,
        valueFactors: evaluation.factors,
      })
      }
  }

  return candidates.sort((first, second) => second.value - first.value)
}

/**
 * 找到「值得買的裝備」：**武器/防具/配件三槽各補一件即可**。
 *
 * 持有邏輯：「有就停」——某一槽若已持有（已穿戴或背包有）任何裝備，
 * 就不再花錢買該槽的更強裝備（更強裝備靠道具點/掉落取得，省下金錢）。
 * 只有「完全空槽」時，才花錢買該槽的第一件。
 */
function findBuyableEquipment(
  state: GameState,
  player: PlayerState,
): { baseId: string; equipmentId: string; name: string; price: number; slot: string } | undefined {
  const baseId = getShopBaseId(state, player.id)
  if (!baseId) return undefined
  const base = state.bases.find((candidate) => candidate.id === baseId)
  if (!base) return undefined
  const money = player.money ?? 0
  const loadout = player.equipmentLoadout
  const inventory = player.equipmentInventory ?? []

  const getDef = (equipmentId: string) => equipmentCatalog.find((e) => e.id === equipmentId)
  const slotKeys: Array<{ slot: string; key: 'weaponInstanceId' | 'armorInstanceId' | 'accessoryInstanceId' }> = [
    { slot: 'weapon', key: 'weaponInstanceId' },
    { slot: 'armor', key: 'armorInstanceId' },
    { slot: 'accessory', key: 'accessoryInstanceId' },
  ]

  // 該槽是否「已有任何裝備」（已穿戴或背包有）→ 有就停，不再買。
  const slotHasEquipment = (slot: string): boolean => {
    const equippedInstanceId = loadout?.[slotKeys.find((s) => s.slot === slot)?.key as keyof typeof loadout]
    if (equippedInstanceId) return true
    return inventory.some((inst) => {
      const def = getDef(inst.equipmentId)
      return def?.slot === slot && inst.durability > 0
    })
  }

  let best: { baseId: string; equipmentId: string; name: string; price: number; slot: string } | undefined
  // 先優先「完全空槽」的槽位（武器 > 防具 > 配件），買該槽最便宜的一件
  for (const { slot } of slotKeys) {
    if (slotHasEquipment(slot)) continue
    const candidate = equipmentCatalog
      .filter((equipment) => equipment.slot === slot && equipment.buyPrice > 0 && money >= equipment.buyPrice)
      .sort((a, b) => a.buyPrice - b.buyPrice)[0]
    if (!candidate) continue
    const validation = canBuyEquipment(state, player.id, candidate.id)
    if (!validation.ok) continue
    if (best) continue // 一次只補一個空槽，依 slotKeys 優先序（武器優先）
    best = { baseId, equipmentId: candidate.id, name: candidate.name, price: candidate.buyPrice, slot }
  }

  return best
}

function findInnerSkillCandidates(
  player: PlayerState,
  effectiveAttributes: { insight: number; armStrength: number; constitution: number; agility: number; innerEnergy: number },
  personality?: AiPersonalityId,
): InnerSkillCandidate[] {
  const currentSkill = allInnerSkillCatalog.find((s) => s.id === player.innerSkillId)
  const currentDamage = currentSkill?.calculateDamage?.(effectiveAttributes) ?? 0

  const candidates = allInnerSkillCatalog.filter((s) => player.innerSkillIds.includes(s.id) && s.id !== player.innerSkillId)
  return candidates
    .filter((skill) => effectiveAttributes.insight >= skill.insightRequirement)
    .map((skill) => {
      const damage = skill.calculateDamage(effectiveAttributes)
      const damageGainRatio = (damage - currentDamage) / Math.max(1, currentDamage)
      const evaluation = evaluateInnerSkillCandidateValue({
        damageGainRatio,
        insightRatio: effectiveAttributes.insight > 0 ? skill.insightRequirement / effectiveAttributes.insight : 0,
        personality,
      })
      return {
        id: skill.id,
        name: skill.name,
        insightRequirement: skill.insightRequirement,
        damageGainRatio,
        value: evaluation.value,
        valueFactors: evaluation.factors,
      }
    })
    .filter((candidate) => candidate.damageGainRatio > 0)
    .sort((first, second) => second.value - first.value)
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
): { gateId: string; skillType: 'inner' | 'external'; skillId: string; name: string; position: Position } | undefined {
  if (!gate) return undefined
  const skills = getSectGateSkills(gate.schoolId)
  // 已在門派學過任一內功（排除初始吐納功）→ 有基本戰力，之後優先補外功。
  const gateInnerIds = new Set(skills.inner.map((s) => s.id))
  const hasLearnedGateInner = player.innerSkillIds.some((id) => gateInnerIds.has(id))
  const unlearnedDamage = skills.damage.find((s) => !player.externalSkillIds.includes(s.id))
  const unlearnedAura = skills.aura.find((s) => !player.externalSkillIds.includes(s.id))
  const unlearnedInner = skills.inner.find((s) => !player.innerSkillIds.includes(s.id) && (player.attributes?.insight ?? 0) >= s.insightRequirement)

  // 已學過門派內功後，優先補齊傷害外功與靈氣型外功，而非繼續堆疊內功。
  if (hasLearnedGateInner) {
    const damageCandidate = unlearnedDamage ?? unlearnedAura
    if (damageCandidate) {
      return { gateId: gate.id, skillType: 'external', skillId: damageCandidate.id, name: damageCandidate.name, position: gate.position }
    }
  }

  if (unlearnedInner) {
    return { gateId: gate.id, skillType: 'inner', skillId: unlearnedInner.id, name: unlearnedInner.name, position: gate.position }
  }
  const remainingExternal = unlearnedDamage ?? unlearnedAura
  if (remainingExternal) {
    return { gateId: gate.id, skillType: 'external', skillId: remainingExternal.id, name: remainingExternal.name, position: gate.position }
  }
  return undefined
}

function findPracticeableSkillAtGate(
  player: PlayerState,
  gate: SectGateState | undefined,
): { gateId: string; skillType: 'inner' | 'external'; skillId: string; name: string; position: Position } | undefined {
  if (!gate) return undefined
  const skills = getSectGateSkills(gate.schoolId)
  const all = [...skills.inner, ...skills.damage, ...skills.aura]
  const learned = all.find((s) => {
    if ('insightRequirement' in s) return player.innerSkillIds.includes(s.id)
    return player.externalSkillIds.includes(s.id)
  })
  if (!learned) return undefined
  return { gateId: gate.id, skillType: 'insightRequirement' in learned ? 'inner' : 'external', skillId: learned.id, name: learned.name, position: gate.position }
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

/**
 * 找到「值得花錢買」的實用道具：優先確保生存，再談變強。
 *
 * 生存優先（第一層）：
 * - 確保身上「回復氣血 / 回復內力 / 回復體力」三類道具各至少 1 個。
 *   AI 需先有續航力，才不會在打鬥/練功途中資源枯竭暴斃。
 *   （優先順序：回血 > 回內力 > 回體力，依生存關鍵程度。）
 *
 * 變強（第二層）：三類生存道具都有了，才買永久屬性丹。
 */
function findBuyableUsefulItem(
  player: PlayerState,
  base: BaseState | undefined,
): { itemId: string; name: string; price: number; effect: string } | undefined {
  if (!base) return undefined
  if (!hasBuilding(base, 'item-shop')) return undefined
  const money = player.money ?? 0
  // 統計身上各效果道具的持有總量
  const ownedCountByEffect = new Map<string, number>()
  for (const entry of player.inventory ?? []) {
    if (entry.quantity <= 0) continue
    const def = itemCatalog.find((i) => i.id === entry.itemId)
    if (def?.effect) {
      ownedCountByEffect.set(def.effect, (ownedCountByEffect.get(def.effect) ?? 0) + entry.quantity)
    }
  }
  const hasAtLeastOne = (effect: string): boolean => (ownedCountByEffect.get(effect) ?? 0) > 0

  // 1. 正在用的生存效果：身上缺哪類就補哪類（回復效果類）
  const survivalEffects: Array<{ effect: string; label: string }> = [
    { effect: 'health', label: '回血' },
    { effect: 'inner-power', label: '回內力' },
    { effect: 'stamina', label: '回體力' },
  ]
  for (const { effect } of survivalEffects) {
    if (!hasAtLeastOne(effect)) {
      const recovery = itemCatalog
        .filter((i) => i.effect === effect && i.buyPrice > 0 && i.buyPrice <= money)
        .sort((a, b) => a.buyPrice - b.buyPrice)[0]
      if (recovery) return { itemId: recovery.id, name: recovery.name, price: recovery.buyPrice, effect: recovery.effect }
    }
  }

  // 2. 三類生存道具都齊 → 才買永久屬性丹（真正的變強投資）
  const attrPill = itemCatalog
    .filter((i) => i.effect === 'attribute-up' && i.buyPrice > 0 && i.buyPrice <= money)
    .sort((a, b) => a.buyPrice - b.buyPrice)[0]
  if (attrPill) {
    return { itemId: attrPill.id, name: attrPill.name, price: attrPill.buyPrice, effect: 'attribute-up' }
  }

  return undefined
}

function findBuyableNestBurstItem(
  player: PlayerState,
  base: BaseState | undefined,
  nest: GameState['creatureNests'][number] | undefined,
  _state: GameState,
): { itemId: string; name: string; price: number; damage: number } | undefined {
  if (!base || !hasBuilding(base, 'item-shop') || !nest) return undefined
  const defenderElement = getSchoolElement(nest.schoolId)
  const ownedIds = new Set(player.inventory.filter((entry) => entry.quantity > 0).map((entry) => entry.itemId))
  const candidates = elementBurstItems
    .filter((item) => item.buyPrice > 0 && item.buyPrice <= (player.money ?? 0) && !ownedIds.has(item.id))
    .map((item) => ({
      item,
      damage: Math.floor((item.effectValue ?? 0) * getElementDamageMultiplier(item.element, defenderElement)),
    }))
    .sort((first, second) => second.damage - first.damage || first.item.buyPrice - second.item.buyPrice)
  const best = candidates[0]
  return best ? { itemId: best.item.id, name: best.item.name, price: best.item.buyPrice, damage: best.damage } : undefined
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
