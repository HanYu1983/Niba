import type { Position } from '../../types'
import { trapezoid, fuzzyAnd, fuzzyOr } from './membershipFunctions'
import type { FuzzyInputs } from './fuzzyInputs'

export type GoalName = 'selfPreservation' | 'collectItems' | 'positioning' | 'construction' | 'exploration' | 'engageCombat' | 'allocateAttributes' | 'useItem' | 'equipEquipment' | 'attackNest' | 'equipInnerSkill' | 'useInnerSkillAttack' | 'learnMartialSkill' | 'practiceSkill' | 'executeMission' | 'repairEquipment' | 'buildDefense'

export interface GoalResult {
  score: number
  target?: GoalTarget
  /** 目標距離（格數），供距離衰減使用；undefined = 不衰減 */
  distanceToTarget?: number
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
  | { kind: 'return-to-base-heal'; baseId: string; position: Position }
  | { kind: 'learn-skill'; baseId?: string; gateId?: string; skillType: 'inner' | 'external'; skillId: string }
  | { kind: 'practice-skill'; gateId: string; skillId: string; position: Position }
  | { kind: 'use-facility'; baseId: string; facilityType: 'heal' | 'mission' | 'repair' }
  | { kind: 'defense-build'; baseId: string; structureType: string; position: Position }
  | { kind: 'buy-item'; baseId: string; itemId: string }

// ─── selfPreservation ──────────────────────────────────────────────

export function evaluateSelfPreservation(inputs: FuzzyInputs): GoalResult {
  const { hitsSurvivable, distToNearestThreat, healthRatio, bestItemToUse, nearestBase, hasInfirmary } = inputs

  // 有威脅 → 評估逃命或用道具續命
  if (distToNearestThreat !== Infinity) {
    const f_hitsLow = trapezoid(hitsSurvivable, 0, 0.5, 1, 2)
    const f_threatClose = trapezoid(distToNearestThreat, 0, 0, 2, 4)

    // 逃命分數
    const retreatScore = Math.min(1, fuzzyOr(
      f_hitsLow,
      fuzzyAnd(f_hitsLow, f_threatClose),
    ))

    // 用回血道具續命：血越低 + 道具回血越多 → 分數越高
    let healScore = 0
    if (bestItemToUse?.effect === 'health' && healthRatio < 0.8) {
      const missingHealth = 1 - healthRatio
      const restoreRatio = bestItemToUse.effectValue / (missingHealth * 100)
      // 血量越低，回血越值得
      const f_urgency = trapezoid(healthRatio, 0, 0.2, 0.5, 0.8)
      // 回復佔比越高，分數越高
      const f_effectiveness = Math.min(1, restoreRatio)
      healScore = Math.min(0.95, fuzzyAnd(f_urgency, f_effectiveness))
    }

    // 取較高者：逃命 vs 用道具續命
    const score = Math.max(retreatScore, healScore)
    if (healScore > retreatScore) {
      return {
        score,
        target: { kind: 'use-item', itemId: bestItemToUse!.id },
        distanceToTarget: 0,
        context: { hitsSurvivable, distToNearestThreat, action: 'heal-in-combat' },
      }
    }
    return {
      score,
      target: { kind: 'retreat', escapeDirection: { row: 0, column: 0 } },
      distanceToTarget: 0,
      context: { hitsSurvivable, distToNearestThreat },
    }
  }

  // 無威脅 + 血量低 → 先試用回血道具，再考慮回據點
  if (healthRatio < 0.5 && bestItemToUse?.effect === 'health') {
    const missingHealth = 1 - healthRatio
    const restoreRatio = bestItemToUse.effectValue / (missingHealth * 100)
    const score = Math.min(0.95, restoreRatio >= 1 ? 0.95 : restoreRatio * 0.95)
    return {
      score,
      target: { kind: 'use-item', itemId: bestItemToUse.id },
      distanceToTarget: 0,
      context: { healthRatio, action: 'heal-out-of-combat' },
    }
  }

  // 無威脅 + 血量低 + 無回血道具 → 回據點醫治
  if (healthRatio < 0.3 && nearestBase) {
    if (hasInfirmary && inputs.feasibility.healBaseId) {
      const score = Math.min(0.95, (0.3 - healthRatio) / 0.3)
      return {
        score,
        target: { kind: 'use-facility', baseId: inputs.feasibility.healBaseId, facilityType: 'heal' },
        distanceToTarget: inputs.feasibility.distToNearestActiveBase,
        context: { healthRatio },
      }
    }
    const score = Math.min(0.85, (0.3 - healthRatio) / 0.3)
    return {
      score,
      target: { kind: 'return-to-base-heal', baseId: nearestBase.id, position: nearestBase.position },
      distanceToTarget: inputs.feasibility.distToNearestActiveBase,
      context: { healthRatio },
    }
  }

  return { score: 0 }
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
    distanceToTarget: distToNearestItem === Infinity ? undefined : distToNearestItem,
    context: { reachableItemCount, distToNearestItem },
  }
}

// ─── engageCombat ───────────────────────────────────────────────
// 附近有怪物 → 高分；體力充足 + 血量健康 → 加分

function evaluateEngageCombat(inputs: FuzzyInputs): GoalResult {
  const { distToNearestCreature, staminaRatio, hitsSurvivable, nearestCreatureId, needsLeveling, killableCreature } = inputs

  if (!nearestCreatureId || distToNearestCreature === Infinity) {
    return { score: 0 }
  }

  // 可擊殺 → score = 1
  if (killableCreature) {
    return {
      score: 1,
      target: { kind: 'attack', targetId: nearestCreatureId, targetType: 'creature', position: { row: -1, column: -1 } },
      distanceToTarget: distToNearestCreature,
      context: { distToNearestCreature, nearestCreatureId, killable: true },
    }
  }

  const f_closeCreature = distToNearestCreature <= 1
    ? 1
    : distToNearestCreature <= 3
      ? 0.7
      : 0.3

  const f_staminaHigh = trapezoid(staminaRatio, 0.4, 0.6, 1, 1)
  const f_healthy = trapezoid(hitsSurvivable, 3, 5, 10, 10)

  let score = Math.min(0.85, fuzzyAnd(fuzzyOr(f_closeCreature, f_healthy), fuzzyOr(f_staminaHigh, f_closeCreature)))

  // 等級落後時打怪分數提升
  if (needsLeveling) {
    score = Math.min(0.85, score * 1.5)
  }

  return {
    score,
    target: { kind: 'attack', targetId: nearestCreatureId, targetType: 'creature', position: { row: -1, column: -1 } },
    distanceToTarget: distToNearestCreature,
    context: { distToNearestCreature, nearestCreatureId, killable: false },
  }
}

// ─── allocateAttributes ─────────────────────────────────────────
// 有可分配屬性點 → 分數 = 1（最高優先）

function evaluateAllocateAttributes(inputs: FuzzyInputs): GoalResult {
  const { availableAttributePoints, healthRatio } = inputs

  if (availableAttributePoints <= 0) {
    return { score: 0 }
  }

  // 血量低 → 優先根骨（增加 maxHealth）
  // 血量正常 → 70% 根骨 / 30% 臂力
  const attribute = healthRatio < 0.5 ? 'constitution' : (Math.random() < 0.7 ? 'constitution' : 'armStrength')

  return {
    score: 1,
    target: { kind: 'allocate-attribute', attribute },
    context: { availableAttributePoints, chosen: attribute },
  }
}

// ─── useItem ────────────────────────────────────────────────────
// 有值得用的道具 → 高分

function evaluateUseItem(inputs: FuzzyInputs): GoalResult {
  const { bestItemToUse, healthRatio, innerPowerRatio } = inputs

  if (!bestItemToUse) {
    return { score: 0 }
  }

  // 回血道具：恢復量 / 缺血量，佔比越高分數越高；可完全恢復時 score = 1
  if (bestItemToUse.effect === 'health') {
    const missingHealth = 1 - healthRatio
    if (missingHealth <= 0) return { score: 0 }
    const restoreRatio = bestItemToUse.effectValue / (missingHealth * 100)
    const score = restoreRatio >= 1 ? 1 : restoreRatio
    return {
      score,
      target: { kind: 'use-item', itemId: bestItemToUse.id },
      context: { effect: bestItemToUse.effect, name: bestItemToUse.name, effectValue: bestItemToUse.effectValue },
    }
  }

  // 回內力道具：恢復量 / 缺內力量，佔比越高分數越高；可完全恢復時 score = 1
  if (bestItemToUse.effect === 'inner-power') {
    const missingInnerPower = 1 - innerPowerRatio
    if (missingInnerPower <= 0) return { score: 0 }
    const restoreRatio = bestItemToUse.effectValue / (missingInnerPower * 100)
    const score = restoreRatio >= 1 ? 1 : restoreRatio
    return {
      score,
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
  const results: Record<GoalName, GoalResult> = {
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
    learnMartialSkill: evaluateLearnMartialSkill(inputs),
    practiceSkill: evaluatePracticeSkill(inputs),
    executeMission: evaluateExecuteMission(inputs),
    repairEquipment: evaluateRepairEquipment(inputs),
    buildDefense: evaluateBuildDefense(inputs),
  }

  // 距離衰減：除探索外，有 distanceToTarget 的目標分數隨距離下降
  for (const goal of Object.keys(results) as GoalName[]) {
    if (goal === 'exploration') continue
    const r = results[goal]
    if (r.distanceToTarget != null && r.distanceToTarget > 0) {
      // 每格衰減 0.05，到 10 格以上分數歸零
      const decay = Math.max(0, 1 - r.distanceToTarget * 0.05)
      r.score *= decay
    }
  }

  return results
}

// ─── construction ──────────────────────────────────────────────────
// 建料滿 + 可蓋 → 高分 build；建料不足 + 有資源點 → 移動/採集

function evaluateConstruction(inputs: FuzzyInputs): GoalResult {
  const { materialRatio, canBuild, buildableBuilding, nearestBase, nearestResourcePoint, distToNearestResourcePoint, isAdjacentToResourcePoint, visibleBaseIds, isAdjacentToBase } = inputs

  // 無可見據點 → 分數 0
  if (visibleBaseIds.length === 0) {
    return { score: 0 }
  }

  const primaryBaseId = visibleBaseIds[0]

  // 情境 A：最近可見據點未 active → 高分打工（採集資源）
  // 注意：這裡判斷 nearestBase 是否就是 primaryBase，若是但非 active 則打工
  if (nearestBase && nearestBase.id === primaryBaseId && nearestBase.active === false) {
    return {
      score: 0.7,
      context: { visibleBaseIds, action: 'work' },
    }
  }

  // 情境 B：建料滿 + 可建造
  if (materialRatio >= 1 && canBuild && buildableBuilding && nearestBase) {
    // B1：已在據點旁 → 直接建造（高分）
    if (isAdjacentToBase) {
      return {
        score: 0.9,
        target: { kind: 'build', baseId: nearestBase.id, buildingId: buildableBuilding.id, buildingName: buildableBuilding.name },
        context: { materialRatio, action: 'build' },
      }
    }
    // B2：不在據點旁 → 移動到據點（中高分）
    return {
      score: 0.7,
      target: { kind: 'resource-point', resourcePointId: '', position: nearestBase.position },
      distanceToTarget: inputs.feasibility.distToNearestActiveBase,
      context: { materialRatio, action: 'move-to-base-for-build' },
    }
  }

  // 情境 C：已與資源點相鄰 → 採集（高分，但建料充足時快速降低）
  if (isAdjacentToResourcePoint && nearestResourcePoint) {
    const f_materialUrgency = materialRatio <= 0.33 ? 1 : materialRatio <= 0.66 ? 0.4 : 0.1
    return {
      score: 0.8 * f_materialUrgency,
      target: { kind: 'resource-point', resourcePointId: nearestResourcePoint.id, position: nearestResourcePoint.position },
      distanceToTarget: 1,
      context: { materialRatio, action: 'collect' },
    }
  }

  // 情境 D：有據點 + 建料不足 + 有資源點 → 移動到資源點（中分，建料充足時快速降低）
  if (materialRatio < 1 && nearestResourcePoint && distToNearestResourcePoint < Infinity) {
    const f_materialUrgency = materialRatio <= 0.33 ? 1 : materialRatio <= 0.66 ? 0.4 : 0.1
    return {
      score: 0.5 * f_materialUrgency,
      target: { kind: 'resource-point', resourcePointId: nearestResourcePoint.id, position: nearestResourcePoint.position },
      distanceToTarget: distToNearestResourcePoint,
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

  // 不可見未探索格越多分數越高，體力充足時加分，上限 0.8
  const baseScore = Math.min(0.6, unexploredInvisibleCells / 10)
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
    distanceToTarget: distToNearestNest,
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

// ─── learnMartialSkill ─────────────────────────────────────────
// 武館/門派有可學技能 → 高分

function evaluateLearnMartialSkill(inputs: FuzzyInputs): GoalResult {
  const { learnableSkillAtHall, learnableSkillAtGate, staminaRatio, feasibility } = inputs

  // 門派學招：需要可步行到達 + 體力夠 + 金錢夠
  if (learnableSkillAtGate && feasibility.canReachNearestGate && feasibility.canAffordGateLearn && staminaRatio > 0.3) {
    return {
      score: 0.7,
      target: { kind: 'learn-skill', gateId: learnableSkillAtGate.gateId, skillType: 'inner', skillId: learnableSkillAtGate.skillId },
      distanceToTarget: feasibility.distToNearestGate,
      context: { source: 'gate', name: learnableSkillAtGate.name, cost: feasibility.learnGateCost },
    }
  }

  // 武館學招：需要金錢夠
  if (learnableSkillAtHall && feasibility.canAffordHallLearn) {
    return {
      score: 0.6,
      target: { kind: 'learn-skill', baseId: learnableSkillAtHall.baseId, skillType: learnableSkillAtHall.skillType, skillId: learnableSkillAtHall.skillId },
      distanceToTarget: feasibility.distToNearestHallBase,
      context: { source: 'hall', name: learnableSkillAtHall.name, cost: feasibility.learnHallCost },
    }
  }

  return { score: 0 }
}

// ─── practiceSkill ─────────────────────────────────────────────
// 門派有可練技能 → 中分（需要體力）

function evaluatePracticeSkill(inputs: FuzzyInputs): GoalResult {
  const { practiceableSkillAtGate, staminaRatio, needsLeveling, feasibility } = inputs

  if (!practiceableSkillAtGate) return { score: 0 }
  if (!feasibility.canReachNearestGate) return { score: 0 }
  if (staminaRatio < 0.3) return { score: 0 }

  // 等級落後時練功優先度提升
  const baseScore = needsLeveling ? 0.6 : 0.4
  const f_stamina = trapezoid(staminaRatio, 0.3, 0.5, 1, 1)

  return {
    score: baseScore * f_stamina,
    target: { kind: 'practice-skill', gateId: practiceableSkillAtGate.gateId, skillId: practiceableSkillAtGate.skillId, position: practiceableSkillAtGate.position },
    distanceToTarget: feasibility.distToNearestGate,
    context: { name: practiceableSkillAtGate.name, needsLeveling },
  }
}

// ─── executeMission ────────────────────────────────────────────
// 有告示牌 + 體力夠 → 執行任務（金錢+聲望）

function evaluateExecuteMission(inputs: FuzzyInputs): GoalResult {
  const { hasMissionBoard, staminaRatio, materialRatio, feasibility } = inputs

  if (!hasMissionBoard) return { score: 0 }
  if (staminaRatio < 0.2) return { score: 0 }
  if (!feasibility.missionBaseId) return { score: 0 }

  // 建料充足時做任務的動機較低（已不需要金錢），建料不足時動機高
  const f_needMaterials = materialRatio < 0.5 ? 0.7 : 0.4

  return {
    score: f_needMaterials,
    target: { kind: 'use-facility', baseId: feasibility.missionBaseId, facilityType: 'mission' },
    distanceToTarget: feasibility.distToNearestActiveBase,
    context: { materialRatio },
  }
}

// ─── repairEquipment ──────────────────────────────────────────
// 有工坊 + 裝備受損 → 修理

function evaluateRepairEquipment(inputs: FuzzyInputs): GoalResult {
  const { hasWorkshopDamaged, staminaRatio, feasibility } = inputs

  if (!hasWorkshopDamaged) return { score: 0 }
  if (staminaRatio < 0.2) return { score: 0 }
  if (!feasibility.repairBaseId) return { score: 0 }

  return {
    score: 0.5,
    target: { kind: 'use-facility', baseId: feasibility.repairBaseId, facilityType: 'repair' },
    distanceToTarget: feasibility.distToNearestActiveBase,
  }
}

// ─── buildDefense ──────────────────────────────────────────────
// 據點附近有威脅 + 可建造防禦設施 → 建造

function evaluateBuildDefense(inputs: FuzzyInputs): GoalResult {
  const { buildableDefenseStructure, threatCountNearBase, materialRatio, staminaRatio, nearestBase } = inputs

  if (!buildableDefenseStructure || !nearestBase) return { score: 0 }
  if (staminaRatio < 0.3 || materialRatio < 0.5) return { score: 0 }

  // 據點附近威脅越多 → 建造動機越高
  const f_threat = trapezoid(threatCountNearBase, 0, 1, 3, 5)
  // 建料充足 → 加分
  const f_material = trapezoid(materialRatio, 0.5, 0.7, 1, 1)

  const score = fuzzyAnd(f_threat, f_material)
  if (score <= 0) return { score: 0 }

  return {
    score: score * 0.7,
    target: { kind: 'defense-build', baseId: nearestBase.id, structureType: buildableDefenseStructure.type, position: nearestBase.position },
    distanceToTarget: inputs.feasibility.distToNearestActiveBase,
    context: { structureName: buildableDefenseStructure.name, threatCountNearBase },
  }
}
