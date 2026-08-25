import type { BaseState, GameState, PlayerState, Position, ResourcePointState } from '../../types'
import { listHostileActors, type HostileActor } from '../perception/targetDiscovery'
import { collectReachableInterests, type ReachableInterest } from '../perception/reachableInterests'
import { getBlockedPositions } from '../../rules/movementRules'
import { canTraverseTerrain } from '../../rules/playerDerivedRules'
import { getAdjacentPositions } from '../../types'
import { buildingCatalog } from '../../catalogs/buildingCatalog'
import { canPlayerBuildBuildingType } from '../../rules/buildingProgressionRules'
import { collectReachableCells } from '../perception/reachablePositions'

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

  // 建設相關：找最近友方據點 + 建料 + 可建造建築 + 最近資源點
  const activeBases = state.bases.filter((b) => b.active !== false && b.health > 0)
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
  const baseResourcePoints = state.resourcePoints.filter((rp) => rp.ownerBaseId === nearestBase?.id && rp.active !== false && rp.health > 0)
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
    materialRatio,
    canBuild,
    buildableBuilding: buildableBuilding ? { id: buildableBuilding.id, type: buildableBuilding.type, name: buildableBuilding.name } : undefined,
    nearestResourcePoint,
    distToNearestResourcePoint,
    isAdjacentToResourcePoint,
    unexploredReachableCount,
    nearestUnexploredPosition,
  }
}
