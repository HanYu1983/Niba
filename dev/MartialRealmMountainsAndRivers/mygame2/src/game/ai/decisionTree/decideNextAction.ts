import type { GameState } from '../../types'
import type { AiAction } from '../aiAction'
import { validateAiAction } from '../validation/validateAiAction'
import { buildingCatalog, BUILDING_TYPES } from '../../catalogs/buildingCatalog'
import {
  isHealthCritical,
  findHealingItemToUse,
  findAdjacentCreature,
  findAdjacentItem,
  findAdjacentBase,
  needsBaseHeal,
  findUnexploredNearby,
} from './conditions'
import {
  buildRetreatAction,
  buildAttackAction,
  buildCollectItemAction,
  buildExploreAction,
} from './actionBuilders'

/**
 * 決策樹 V2（方案 C：無狀態分層）
 *
 * 小樹（先 return）：保命、即時戰鬥
 * 中樹（中段 return）：撿道具、採集、建造
 * 大樹（最後 return）：探索（預設戰略）
 *
 * 每個條件成立 → 生成 candidate → validate → return。
 * 條件不成立或 validation 失敗 → fall through 到下一棵。
 */
/**
 * 決策診斷收集器：累積整次決策被拒絕的候選行動與原因。
 */
export type DecisionTreeDiagnostics = { reasons: string[] }

/**
 * 驗證 candidate；valid 回 true。
 * 失敗時（含 candidate 為 null）把「label + 原因」收集進 out.reasons。
 */
function passesValidation(
  state: GameState,
  candidate: AiAction | null,
  label: string,
  out?: DecisionTreeDiagnostics,
): candidate is AiAction {
  if (out) {
    if (!candidate) {
      out.reasons.push(`${label}：無法產生候選行動`)
      return false
    }
    const validation = validateAiAction(state, candidate)
    if (validation.valid) return true
    out.reasons.push(`${label}：${validation.reason}`)
    return false
  }
  if (!candidate) return false
  return validateAiAction(state, candidate).valid
}

export function decideNextAction(
  state: GameState,
  playerId: string,
  out?: DecisionTreeDiagnostics,
): AiAction | null {
  const player = state.players.find((p) => p.id === playerId)
  if (!player) return null

  // 需要回血 → 使用回血道具
  // 取得回血道具的量的陣列的排序, 由小到大[{itemId, healAmount}]
  // 若現有血量和滿血的差距大於等於最小的回血道具量, 則使用回血道具
  // 現有血量小於15也使用回血道具
  const healTarget = findHealingItemToUse(player)
  if (healTarget) {
    const candidate: AiAction = {
      type: 'use-item',
      actor: { id: player.id, kind: 'player' },
      itemId: healTarget.itemId,
      reason: `使用回血道具 ${healTarget.itemId}（回血 ${healTarget.healAmount}，現有血量 ${player.health}/${player.maxHealth}）`,
    }
    if (passesValidation(state, candidate, '使用回血道具', out)) return candidate
  }

  // ═══════════════════════════════════════════════════
  // 據點醫療（回血／蓋醫院）
  // ═══════════════════════════════════════════════════
  // 條件：在據點旁邊，且血量或內力沒有滿
  //   若據點沒有醫院又有足夠材料 → 蓋醫院
  //   若醫院已存在 → 使用醫院

  const healBase = findAdjacentBase(state, player)
  if (healBase && needsBaseHeal(player)) {
    const infirmaryTemplate = buildingCatalog.find((b) => b.type === BUILDING_TYPES.INFIRMARY)
    const hasInfirmary = healBase.buildings.some((b) => b.type === BUILDING_TYPES.INFIRMARY)
    if (!hasInfirmary && infirmaryTemplate && healBase.buildingMaterials >= infirmaryTemplate.constructionCost) {
      const candidate: AiAction = {
        type: 'build',
        actor: { id: player.id, kind: 'player' },
        baseId: healBase.id,
        buildingType: infirmaryTemplate.id,
        reason: `蓋醫院（材料 ${healBase.buildingMaterials}/${infirmaryTemplate.constructionCost}）`,
      }
      if (passesValidation(state, candidate, '蓋醫院', out)) return candidate
    } else if (hasInfirmary) {
      const candidate: AiAction = {
        type: 'use-facility',
        actor: { id: player.id, kind: 'player' },
        baseId: healBase.id,
        facilityType: 'heal',
        reason: `使用醫院回血（血量 ${player.health}/${player.maxHealth}，內力 ${player.innerPower}/${player.maxInnerPower}）`,
      }
      if (passesValidation(state, candidate, '使用醫院', out)) return candidate
    }
  }

  // 血量極低 → 逃命
  if (isHealthCritical(player)) {
    const candidate = buildRetreatAction(state, player)
    if (passesValidation(state, candidate, '撤退（血量極低）', out)) return candidate
  }

  // 旁邊有怪 → 打
  const adjacentCreature = findAdjacentCreature(state, player)
  if (adjacentCreature && player.stamina >= 5) {
    const candidate = buildAttackAction(state, player, adjacentCreature)
    if (passesValidation(state, candidate, '攻擊鄰近怪', out)) return candidate
  }

  // 2.2 近距離有怪（2格內）+ 體力足 → 走過去
  // if (player.stamina >= 5) {
  //   const visible = getVisibleCreatures(state, player.id)
  //   const nearby = visible
  //     .filter((a) => {
  //       const pos = a.sourceType === 'creature' ? a.creature.position : a.nest.position
  //       const dist = Math.abs(pos.row - player.position.row) + Math.abs(pos.column - player.position.column)
  //       return dist <= 2
  //     })
  //     .sort((a, b) => {
  //       const posA = a.sourceType === 'creature' ? a.creature.position : a.nest.position
  //       const posB = b.sourceType === 'creature' ? b.creature.position : b.nest.position
  //       const dA = Math.abs(posA.row - player.position.row) + Math.abs(posA.column - player.position.column)
  //       const dB = Math.abs(posB.row - player.position.row) + Math.abs(posB.column - player.position.column)
  //       return dA - dB
  //     })[0]
  //   if (nearby) {
  //     const candidate = buildAttackAction(state, player, nearby)
  //     if (passesValidation(state, candidate, '攻擊近距離怪', out)) return candidate
  //   }
  // }

  // ═══════════════════════════════════════════════════
  // 中樹 3：撿道具
  // ═══════════════════════════════════════════════════

  const adjacentItem = findAdjacentItem(state, player)
  if (adjacentItem) {
    const candidate = buildCollectItemAction(state, player, adjacentItem.id, adjacentItem.position)
    if (passesValidation(state, candidate, '撿道具', out)) return candidate
  }


  // ═══════════════════════════════════════════════════
  // 中樹 4：建造 / 採集
  // ═══════════════════════════════════════════════════

  // 中樹 4 以「視野內可見的據點」為判斷依據（不可見據點不得據以規劃建造/採集）。
  // const base = getVisibleOwnedBase(state, player.id)
  // if (base) {
  //   const isAtBase = Math.abs(player.position.row - base.position.row) + Math.abs(player.position.column - base.position.column) <= 1

  //   // 4.1 已與據點相鄰 + 建料足夠 → 建造
  //   if (isAtBase && base.buildingMaterials >= 3) {
  //     const existingTypes = new Set(base.buildings.map((b) => b.type))
  //     const buildable = buildingCatalog.find((template) => {
  //       if (existingTypes.has(template.type)) return false
  //       if (base.martialSchoolId && template.schoolId && template.schoolId !== base.martialSchoolId) return false
  //       if (base.allowedBuildings && !base.allowedBuildings.some((a) => a.type === template.type)) return false
  //       if (!canPlayerBuildBuildingType(player, template.type)) return false
  //       if (base.buildingMaterials < template.constructionCost) return false
  //       return true
  //     })
  //     if (buildable) {
  //       const candidate: AiAction = {
  //         type: 'build',
  //         actor: { id: player.id, kind: 'player' },
  //         baseId: base.id,
  //         buildingType: buildable.id,
  //         reason: `建造 ${buildable.name}`,
  //       }
  //       if (passesValidation(state, candidate, '建造', out)) return candidate
  //     }
  //   }

  //   // 4.2 旁邊有資源點 + 建料不足 → 採集
  //   if (needsBuildingMaterials(state, player.id)) {
  //     const resource = findAdjacentResourcePoint(state, player)
  //     if (resource) {
  //       const candidate = buildCollectResourceAction(state, player, resource.id, resource.position)
  //       if (passesValidation(state, candidate, '採集資源', out)) return candidate
  //     }
  //   }

  //   // 4.2b 相鄰有完好廢墟 + 建料不足 → 清理廢墟採集建料（kind: 'ruin'）
  //   // ⚠️ createRuins 未避開 resourcePoints，廢墟與資源點可能重疊，兩者皆可採集。
  //   if (needsBuildingMaterials(state, player.id)) {
  //     const candidate = buildCollectRuinAction(state, player)
  //     if (passesValidation(state, candidate, '清理廢墟', out)) return candidate
  //   }

  //   // 4.3 不在據點旁 → 移動到據點
  //   if (!isAtBase) {
  //     const candidate = buildMoveToBaseAction(state, player)
  //     if (passesValidation(state, candidate, '移動到據點', out)) return candidate
  //   }

  //   // 4.4 需要建料 + 不在資源點旁 → 移動到資源點
  //   if (needsBuildingMaterials(state, player.id)) {
  //     const nearest = state.resourcePoints.reduce(
  //       (best, rp) => {
  //         const dRp = Math.abs(rp.position.row - player.position.row) + Math.abs(rp.position.column - player.position.column)
  //         const dB = best ? Math.abs(best.position.row - player.position.row) + Math.abs(best.position.column - player.position.column) : Infinity
  //         return dRp < dB ? rp : best
  //       },
  //       null as typeof state.resourcePoints[0] | null,
  //     )
  //     if (nearest) {
  //       const candidate = buildCollectResourceAction(state, player, nearest.id, nearest.position)
  //       if (passesValidation(state, candidate, '移動到資源點採集', out)) return candidate
  //     }
  //   }
  // }

  // ═══════════════════════════════════════════════════
  // 大樹 5：探索（預設戰略）
  // ═══════════════════════════════════════════════════

  const unexplored = findUnexploredNearby(state, player)
  if (unexplored) {
    const candidate = buildExploreAction(state, player, unexplored)
    if (passesValidation(state, candidate, '探索', out)) return candidate
  }

  // ═══════════════════════════════════════════════════
  // 兜底：待命
  // ═══════════════════════════════════════════════════
  return null
}
