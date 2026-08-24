import { buildingCatalog } from '../../catalogs/buildingCatalog'
import type { AiConstructionPlan, AiConstructionPlanItem, AiConstructionPolicy, BaseState, GameState } from '../../types'

/**
 * 建設 AI 決策（重構文件 §8.1／§12 Phase 4／§14.6）：
 * - 只讀取 State 與 `AiConstructionPlan`，不修改狀態、不碰 UI（純函式，可單元測試）。
 * - 效用評分：queue item 的 priority 為主，方針（policy）對應類別的建築額外加權。
 * - 前置條件的成敗判斷交由執行層 `constructBuilding`；本層只負責排序與過濾明確不可考慮的項目。
 */

/** 建料不足的 blocked 原因字串：此類阻塞是暫時性的，候選挑選時允許重試。 */
export const CONSTRUCTION_MATERIALS_BLOCK_REASON = '建料不足。'

/** 永久性阻塞原因：再試也不會改變結果，候選挑選時跳過（除非玩家手動調整 queue）。 */
export const PERMANENT_BLOCK_REASONS = [
  '未知建築。',
  '此武館已建造。',
  '此據點只能建造指定流派的武館。',
  '此據點不允許建造該建築。',
] as const

export type ConstructionBuildCandidate = {
  itemIndex: number
  item: AiConstructionPlanItem
  buildingId: string
  buildingType: string
  buildingName: string
}

export type ConstructionDecision =
  | { type: 'build'; candidate: ConstructionBuildCandidate }
  | { type: 'upgrade'; buildingId: string; buildingName: string }
  | { type: 'hold'; reason: string }

/** 建築類別 → 方針加權對應；不在表內的建築（如武館、商店）不吃方針加成。 */
const BUILDING_POLICY_CATEGORY: Record<string, 'defense' | 'economy' | 'frontline'> = {
  wall: 'defense',
  barracks: 'defense',
  warehouse: 'economy',
  'trade-market': 'economy',
  exchange: 'economy',
  'regional-management': 'economy',
  infirmary: 'frontline',
  workshop: 'frontline',
  waystation: 'frontline',
}

const POLICY_BONUS = 3

function getPolicyBonus(policy: AiConstructionPolicy, buildingType: string): number {
  if (policy === 'balanced' || policy === 'paused') return 0
  return BUILDING_POLICY_CATEGORY[buildingType] === policy ? POLICY_BONUS : 0
}

/**
 * 與 `constructBuilding` 相同的流派過濾：有指定流派的據點只能解析出對應流派的武館模板。
 * 回傳 null 代表該 item 在此據點無法解析出唯一模板（例如未指定流派的據點要建武館）。
 */
function resolveTemplate(base: BaseState | undefined, buildingType: string) {
  const matches = buildingCatalog.filter((building) =>
    building.type === buildingType && (!base?.martialSchoolId || !building.schoolId || building.schoolId === base.martialSchoolId),
  )
  return matches.length === 1 ? matches[0] : null
}

function isRetryable(item: AiConstructionPlanItem): boolean {
  if (item.status === 'planned') return true
  // 建料不足屬暫時性阻塞，材料累積後應自動重試。
  return item.status === 'blocked' && item.blockedReason === CONSTRUCTION_MATERIALS_BLOCK_REASON
}

/**
 * 依效用評分取出下一個可嘗試的建造候選。
 * `excludeItemIndexes`：本步驟內已失敗的 item，不再重複嘗試。
 */
export function pickNextBuildCandidate(
  state: GameState,
  plan: AiConstructionPlan,
  excludeItemIndexes: ReadonlySet<number> = new Set(),
): ConstructionBuildCandidate | null {
  const base = state.bases.find((candidateBase) => candidateBase.id === plan.baseId)
  if (!base) return null

  const scored: Array<{ score: number; index: number; item: AiConstructionPlanItem }> = []
  plan.queue.forEach((item, index) => {
    if (excludeItemIndexes.has(index) || !isRetryable(item)) return
    // 無法解析唯一模板（如未定流派的武館）：留給執行層標記 blocked，不在此靜默丟棄。
    scored.push({ score: item.priority + getPolicyBonus(plan.policy, item.buildingType), index, item })
  })
  if (scored.length === 0) return null

  // 分數高者優先；同分依 queue 順序（穩定排序）。
  scored.sort((first, second) => second.score - first.score || first.index - second.index)
  const chosen = scored[0]
  const baseForResolution = base
  const template = resolveTemplate(baseForResolution, chosen.item.buildingType)
  if (!template) {
    // 模板不可解析：回傳一個帶原始 type 的偽候選，讓執行層以『未知建築。』標記 blocked。
    return { itemIndex: chosen.index, item: chosen.item, buildingId: `unknown:${chosen.item.buildingType}`, buildingType: chosen.item.buildingType, buildingName: chosen.item.buildingType }
  }
  return { itemIndex: chosen.index, item: chosen.item, buildingId: template.id, buildingType: template.type, buildingName: template.name }
}

/** 升級候選：allowUpgrade 時取等級最低的既有建築（同級取先建者）。 */
export function pickUpgradeCandidate(
  state: GameState,
  plan: AiConstructionPlan,
): { buildingId: string; buildingName: string } | null {
  if (!plan.allowUpgrade) return null
  const base = state.bases.find((candidateBase) => candidateBase.id === plan.baseId)
  if (!base || base.buildings.length === 0) return null

  let oldest = base.buildings[0]
  for (const building of base.buildings) {
    if ((building.level ?? 1) < (oldest.level ?? 1)) oldest = building
  }
  return { buildingId: oldest.id, buildingName: oldest.name }
}

/** 目前步驟的建設決策：優先依佇列建造，其次升級，最後待命。 */
export function chooseConstructionAction(state: GameState, plan: AiConstructionPlan): ConstructionDecision {
  const buildCandidate = pickNextBuildCandidate(state, plan)
  if (buildCandidate && resolveTemplate(state.bases.find((candidateBase) => candidateBase.id === plan.baseId), buildCandidate.buildingType)) {
    return { type: 'build', candidate: buildCandidate }
  }
  const upgradeCandidate = pickUpgradeCandidate(state, plan)
  if (upgradeCandidate) {
    return { type: 'upgrade', ...upgradeCandidate }
  }
  const hasUnretryableItems = plan.queue.some((item) => !isRetryable(item))
  return {
    type: 'hold',
    reason: hasUnretryableItems ? '佇列項目前置條件不足。' : '佇列沒有可執行的建設項目。',
  }
}
