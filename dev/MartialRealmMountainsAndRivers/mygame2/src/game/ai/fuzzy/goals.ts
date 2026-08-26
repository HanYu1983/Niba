import type { Position } from '../../types'
import { trapezoid, fuzzyAnd, fuzzyOr } from './membershipFunctions'
import type { FuzzyInputs } from './fuzzyInputs'

export type GoalName = 'selfPreservation' | 'collectItems' | 'positioning' | 'construction' | 'exploration' | 'engageCombat' | 'allocateAttributes' | 'useItem' | 'equipEquipment' | 'attackNest' | 'equipInnerSkill' | 'useInnerSkillAttack'

export interface GoalResult {
  score: number
  target?: GoalTarget
  context?: Record<string, unknown>
}

export type GoalTarget =
  | { kind: 'retreat'; escapeDirection: Position }
  | { kind: 'item'; id: string; position: Position }
  | { kind: 'attack'; targetId: string; targetType: 'creature' | 'nest'; position: Position }
  | { kind: 'exit'; position: Position }
  | { kind: 'build'; baseId: string; buildingId: string; buildingName: string }
  | { kind: 'resource-point'; resourcePointId: string; position: Position }
  | { kind: 'explore'; position: Position }
  | { kind: 'allocate-attribute'; attribute: string }
  | { kind: 'use-item'; itemId: string }
  | { kind: 'equip'; instanceId: string }
  | { kind: 'equip-inner-skill'; skillId: string }
  | { kind: 'use-inner-skill-attack'; targetId: string; targetType: 'creature'; position: Position }

// ─── selfPreservation ──────────────────────────────────────────────

export function evaluateSelfPreservation(inputs: FuzzyInputs): GoalResult {
  const { hitsSurvivable, staminaRatio, distToNearestThreat } = inputs

  // 無威脅 → 不需要保命
  if (distToNearestThreat === Infinity) {
    return { score: 0 }
  }

  // hitsSurvivable < 2 → LOW 高（危險）；> 5 → HIGH 高（安全）
  const f_hitsLow = trapezoid(hitsSurvivable, 0, 0, 1.5, 3)
  const f_staminaDepleted = trapezoid(staminaRatio, 0, 0, 0.1, 0.2)
  const f_threatClose = trapezoid(distToNearestThreat, 0, 0, 2, 4)

  const score = fuzzyOr(
    f_hitsLow,
    f_staminaDepleted,
    fuzzyAnd(f_hitsLow, f_threatClose),
  )

  return {
    score,
    target: { kind: 'retreat', escapeDirection: { row: 0, column: 0 } },
    context: { hitsSurvivable, distToNearestThreat },
  }
}

// ─── collectItems ──────────────────────────────────────────────────

export function evaluateCollectItems(inputs: FuzzyInputs): GoalResult {
  const { reachableItemCount, staminaRatio, distToNearestItem } = inputs

  const f_manyItems = trapezoid(reachableItemCount, 0, 0, 3, 5)    // >=5 → 1.0, >=3 → 0.6
  const f_staminaHigh = trapezoid(staminaRatio, 0.7, 0.85, 1, 1)
  const f_hasItems = trapezoid(reachableItemCount, 0, 0, 99, 99)     // 有道具就 = 1

  let score = fuzzyOr(
    fuzzyAnd(f_manyItems, f_staminaHigh),
    f_hasItems,
  )

  // 距離衰減
  if (distToNearestItem > 5) {
    score *= 0.7
  }

  // 最近道具作為 target（V1: 取第一個，後續可改為最佳選擇）
  const bestItem = inputs.reachableInterests.find((i) => i.kind === 'item' as const)

  return {
    score,
    target: bestItem
      ? { kind: 'item', id: bestItem.ref.id, position: bestItem.position }
      : undefined,
    context: { reachableItemCount, distToNearestItem },
  }
}

// ─── engageCombat ───────────────────────────────────────────────
// 附近有怪物 → 高分；體力充足 + 血量健康 → 加分

function evaluateEngageCombat(inputs: FuzzyInputs): GoalResult {
  const { distToNearestCreature, staminaRatio, hitsSurvivable, nearestCreatureId } = inputs

  if (!nearestCreatureId || distToNearestCreature === Infinity) {
    return { score: 0 }
  }

  const f_closeCreature = distToNearestCreature <= 1
    ? 1
    : distToNearestCreature <= 3
      ? 0.7
      : 0.3

  const f_staminaHigh = trapezoid(staminaRatio, 0.4, 0.6, 1, 1)
  const f_healthy = trapezoid(hitsSurvivable, 3, 5, 10, 10)

  const score = fuzzyAnd(fuzzyOr(f_closeCreature, f_healthy), fuzzyOr(f_staminaHigh, f_closeCreature))

  return {
    score,
    target: { kind: 'attack', targetId: nearestCreatureId, targetType: 'creature', position: { row: -1, column: -1 } },
    context: { distToNearestCreature, nearestCreatureId },
  }
}

// ─── allocateAttributes ─────────────────────────────────────────
// 有可分配屬性點 → 分數 = 1（最高優先）

function evaluateAllocateAttributes(inputs: FuzzyInputs): GoalResult {
  const { availableAttributePoints } = inputs

  if (availableAttributePoints <= 0) {
    return { score: 0 }
  }

  // V1：固定分配 armStrength（攻擊力）
  return {
    score: 1,
    target: { kind: 'allocate-attribute', attribute: 'armStrength' },
    context: { availableAttributePoints },
  }
}

// ─── useItem ────────────────────────────────────────────────────
// 有值得用的道具 → 高分

function evaluateUseItem(inputs: FuzzyInputs): GoalResult {
  const { bestItemToUse, healthRatio, innerPowerRatio } = inputs

  if (!bestItemToUse) {
    return { score: 0 }
  }

  // 回血道具：恢復量 / 缺血量，佔比越高分數越高
  if (bestItemToUse.effect === 'health') {
    const missingHealth = 1 - healthRatio
    if (missingHealth <= 0) return { score: 0 }
    const restoreRatio = Math.min(1, bestItemToUse.effectValue / (missingHealth * 100))
    return {
      score: restoreRatio,
      target: { kind: 'use-item', itemId: bestItemToUse.id },
      context: { effect: bestItemToUse.effect, name: bestItemToUse.name, effectValue: bestItemToUse.effectValue },
    }
  }

  // 回內力道具：恢復量 / 缺內力量，佔比越高分數越高
  if (bestItemToUse.effect === 'inner-power') {
    const missingInnerPower = 1 - innerPowerRatio
    if (missingInnerPower <= 0) return { score: 0 }
    const restoreRatio = Math.min(1, bestItemToUse.effectValue / (missingInnerPower * 100))
    return {
      score: restoreRatio,
      target: { kind: 'use-item', itemId: bestItemToUse.id },
      context: { effect: bestItemToUse.effect, name: bestItemToUse.name, effectValue: bestItemToUse.effectValue },
    }
  }

  // 回體力道具：固定分數
  if (bestItemToUse.effect === 'stamina') {
    return {
      score: 0.6,
      target: { kind: 'use-item', itemId: bestItemToUse.id },
      context: { effect: bestItemToUse.effect, name: bestItemToUse.name },
    }
  }

  // 其他道具：中等分數
  return {
    score: 0.4,
    target: { kind: 'use-item', itemId: bestItemToUse.id },
    context: { effect: bestItemToUse.effect, name: bestItemToUse.name },
  }
}

// ─── equipEquipment ────────────────────────────────────────────
// 有可裝備的武具（部位空 or 耐久=0）→ score = 1

function evaluateEquipEquipment(inputs: FuzzyInputs): GoalResult {
  const { equipableEquipment } = inputs

  if (!equipableEquipment) {
    return { score: 0 }
  }

  return {
    score: 1,
    target: { kind: 'equip', instanceId: equipableEquipment.instanceId },
    context: { slot: equipableEquipment.slot, name: equipableEquipment.name, durability: equipableEquipment.durability },
  }
}

// ─── evaluateAllGoals ──────────────────────────────────────────────

export function evaluateAllGoals(inputs: FuzzyInputs): Record<GoalName, GoalResult> {
  return {
    selfPreservation: evaluateSelfPreservation(inputs),
    collectItems: evaluateCollectItems(inputs),
    positioning: evaluatePositioning(inputs),
    construction: evaluateConstruction(inputs),
    exploration: evaluateExploration(inputs),
    engageCombat: evaluateEngageCombat(inputs),
    allocateAttributes: evaluateAllocateAttributes(inputs),
    useItem: evaluateUseItem(inputs),
    equipEquipment: evaluateEquipEquipment(inputs),
    attackNest: evaluateAttackNest(inputs),
    equipInnerSkill: evaluateEquipInnerSkill(inputs),
    useInnerSkillAttack: evaluateUseInnerSkillAttack(inputs),
  }
}

// ─── construction ──────────────────────────────────────────────────
// 建料滿 + 可蓋 → 高分 build；建料不足 + 有資源點 → 移動/採集

function evaluateConstruction(inputs: FuzzyInputs): GoalResult {
  const { materialRatio, canBuild, buildableBuilding, nearestBase, nearestResourcePoint, distToNearestResourcePoint, isAdjacentToResourcePoint, visibleBaseIds } = inputs

  // 無可見據點 → 分數 0
  if (visibleBaseIds.length === 0) {
    return { score: 0 }
  }

  const primaryBaseId = visibleBaseIds[0]
  const primaryBaseIsActive = nearestBase?.id === primaryBaseId

  // 情境 A：最近可見據點未 active → 高分打工（採集資源）
  if (!primaryBaseIsActive) {
    return {
      score: 0.7,
      context: { visibleBaseIds, action: 'work' },
    }
  }

  // 情境 B：建料滿 + 可建造 → 高分 + build target
  if (materialRatio >= 1 && canBuild && buildableBuilding && nearestBase) {
    return {
      score: 0.9,
      target: { kind: 'build', baseId: nearestBase.id, buildingId: buildableBuilding.id, buildingName: buildableBuilding.name },
      context: { materialRatio, action: 'build' },
    }
  }

  // 情境 C：已與資源點相鄰 → 採集（高分）
  if (isAdjacentToResourcePoint && nearestResourcePoint) {
    return {
      score: 0.8,
      target: { kind: 'resource-point', resourcePointId: nearestResourcePoint.id, position: nearestResourcePoint.position },
      context: { materialRatio, action: 'collect' },
    }
  }

  // 情境 D：有據點 + 建料不足 + 有資源點 → 移動到資源點（中高分）
  if (materialRatio < 1 && nearestResourcePoint && distToNearestResourcePoint < Infinity) {
    return {
      score: 0.5,
      target: { kind: 'resource-point', resourcePointId: nearestResourcePoint.id, position: nearestResourcePoint.position },
      context: { materialRatio, distToNearestResourcePoint, action: 'move-to-resource' },
    }
  }

  // 無資源點 → 低分
  return {
    score: 0.1,
    context: { materialRatio },
  }
}

// ─── exploration ──────────────────────────────────────────────────
// 預設目標：有未探索可達格 → 高分 + 移動到最近的未探索格

function evaluateExploration(inputs: FuzzyInputs): GoalResult {
  const { unexploredInvisibleCells, nearestUnexploredInvisiblePosition, staminaRatio } = inputs

  if (unexploredInvisibleCells === 0 || !nearestUnexploredInvisiblePosition) {
    return { score: 0 }
  }

  // 不可見未探索格越多分數越高，體力充足時加分
  const baseScore = Math.min(1, unexploredInvisibleCells / 10)
  const score = staminaRatio > 0.3 ? baseScore : baseScore * 0.5

  return {
    score,
    target: { kind: 'explore', position: nearestUnexploredInvisiblePosition },
    context: { unexploredInvisibleCells },
  }
}

// ─── positioning ──────────────────────────────────────────────────
// 出口越少 → 分數越高；無出口且有怪 → attack target；有出口 → exit target

export function evaluatePositioning(inputs: FuzzyInputs): GoalResult {
  const { exitCount, distToNearestThreat, nearestExit } = inputs

  // 出口越少分數越高：0 → 1.0, 1 → 0.667, 2 → 0.333, >=3 → 0
  const f_fewExits = exitCount >= 3 ? 0 : (3 - exitCount) / 3

  // 無出口時的危險加成：周圍有怪則更高
  const f_threatClose = trapezoid(distToNearestThreat, 0, 0, 2, 4)
  const score = exitCount === 0
    ? Math.min(1, f_fewExits + f_threatClose * 0.3)
    : f_fewExits

  // 四周無怪時
  const finalScore = distToNearestThreat === Infinity ? 0 : score

  // target：無出口 → 用 nearestCreature（由 mapper 找最近怪）；有出口 → exit
  let target: GoalTarget | undefined
  if (exitCount === 0 && distToNearestThreat < Infinity) {
    // attack target：由 mapper 從 state 中找最近 creature
    target = { kind: 'attack', targetId: '', targetType: 'creature', position: { row: -1, column: -1 } }
  } else if (nearestExit) {
    target = { kind: 'exit', position: nearestExit }
  }

  return {
    score: finalScore,
    target,
    context: { exitCount, distToNearestThreat },
  }
}

// ─── attackNest ─────────────────────────────────────────────────

export function evaluateAttackNest(inputs: FuzzyInputs): GoalResult {
  const { hitsSurvivable, distToNearestNest, visibleCreatureIds } = inputs

  if (distToNearestNest === Infinity) return { score: 0 }

  const f_safeHealth = trapezoid(hitsSurvivable, 4, 6, 10, 10)
  const f_noCreatures = visibleCreatureIds.length === 0 ? 1 : 0
  const f_nestClose = distToNearestNest <= 1
    ? 1
    : trapezoid(distToNearestNest, 1, 2, 5, 8)

  const score = fuzzyAnd(f_safeHealth, fuzzyAnd(f_noCreatures, f_nestClose))

  return {
    score,
    target: { kind: 'attack', targetId: '', targetType: 'nest', position: { row: -1, column: -1 } },
    context: { distToNearestNest, visibleCreatureCount: visibleCreatureIds.length },
  }
}

// ─── equipInnerSkill ────────────────────────────────────────────

export function evaluateEquipInnerSkill(inputs: FuzzyInputs): GoalResult {
  const { betterInnerSkill, innerPowerRatio } = inputs

  if (!betterInnerSkill) return { score: 0 }

  const f_hasCapacity = 1
  const f_hasPower = trapezoid(innerPowerRatio, 0.1, 0.2, 1, 1)
  const score = fuzzyAnd(f_hasCapacity, f_hasPower)

  return {
    score,
    target: { kind: 'equip-inner-skill', skillId: betterInnerSkill.id },
    context: { skillId: betterInnerSkill.id, skillName: betterInnerSkill.name },
  }
}

// ─── useInnerSkillAttack ───────────────────────────────────────

export function evaluateUseInnerSkillAttack(inputs: FuzzyInputs): GoalResult {
  // 先關閉
  return { score: 0 }

  const { hasDamageInnerSkill, innerPowerRatio, distToNearestThreat, visibleCreatureIds } = inputs

  if (!hasDamageInnerSkill || visibleCreatureIds.length === 0) return { score: 0 }

  const f_hasSkill = .6
  const f_hasPower = trapezoid(innerPowerRatio, 0.15, 0.25, 1, 1)
  const f_threatClose = distToNearestThreat <= 1
    ? 1
    : trapezoid(distToNearestThreat, 1, 2, 5, 8)

  const score = fuzzyAnd(f_hasSkill, fuzzyAnd(f_hasPower, f_threatClose))

  return {
    score,
    target: { kind: 'use-inner-skill-attack', targetId: '', targetType: 'creature', position: { row: -1, column: -1 } },
    context: { innerPowerRatio, distToNearestThreat },
  }
}
