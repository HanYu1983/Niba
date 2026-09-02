import type { GameState, PlayerState, Position } from '../../types'
import { getManhattanDistance as manhattan } from '../../rules/mapCellStateRules'
import { trapezoid, fuzzyAnd, fuzzyOr } from './membershipFunctions'
import type { FuzzyInputs } from './fuzzyInputs'
import type { AiAction } from '../aiAction'
import { buildValidatedActionSequence } from './goalActionMapper'
import type { ExecuteAiActionDependencies } from '../execution/executeAiAction'
import type { AiGoalConstraints } from './personality'
import { canTransportPlayer } from '../../rules/transportRules'
import { getInnerSkill, getSkillDamage, getSkillProgression, getPlayerInsightCapacityBreakdown } from '../../rules/skillRules'
import { getEffectiveAttributesForPlayer } from '../../rules/playerDerivedRules'
import { getKillTargetId, KILL_MAX_DISTANCE } from './midTermGoal'

export type GoalName = 'selfPreservation' | 'collectItems' | 'positioning' | 'construction' | 'exploration' | 'engageCombat' | 'allocateAttributes' | 'useItem' | 'equipEquipment' | 'attackNest' | 'prepareNest' | 'equipInnerSkill' | 'equipExternalSkill' | 'useInnerSkillAttack' | 'learnMartialSkill' | 'practiceSkill' | 'executeMission' | 'repairEquipment' | 'buildDefense' | 'buyConsumable' | 'buyEquipment'

export interface GoalResult {
  score: number
  target?: GoalTarget
  /** 目標距離（格數），供距離衰減使用；undefined = 不衰減 */
  distanceToTarget?: number
  context?: Record<string, unknown>
  /** score > 0 時由 evaluate 函數附帶，必定合法可執行 */
  actions?: AiAction[]
}

export type GoalTarget =
  | { kind: 'retreat'; escapeDirection: Position }
  | { kind: 'item'; id: string; position: Position }
  | { kind: 'attack'; targetId: string; targetType: 'creature' | 'nest'; position: Position }
  | { kind: 'exit'; position: Position }
  | { kind: 'build'; baseId: string; buildingId: string; buildingName: string }
  | { kind: 'upgrade'; baseId: string; buildingId: string; buildingType: string; buildingName: string; nextLevel: number }
  | { kind: 'resource-point'; resourcePointId: string; position: Position }
  | { kind: 'follow-player'; position: Position }
  | { kind: 'explore'; position: Position }
  | { kind: 'allocate-attribute'; attribute: string }
  | { kind: 'use-item'; itemId: string }
  | { kind: 'equip'; instanceId: string }
  | { kind: 'equip-inner-skill'; skillId: string }
  | { kind: 'equip-external-skill'; skillId: string }
  | { kind: 'use-inner-skill-attack'; targetId: string; targetType: 'creature'; position: Position }
  | { kind: 'return-to-base-heal'; baseId: string; position: Position }
  | { kind: 'learn-skill'; baseId?: string; gateId?: string; skillType: 'inner' | 'external'; skillId: string }
  | { kind: 'practice-skill'; gateId: string; skillId: string; position: Position }
  | { kind: 'use-facility'; baseId: string; facilityType: 'heal' | 'mission' | 'repair' }
  | { kind: 'defense-build'; baseId: string; structureType: string; position: Position }
  | { kind: 'buy-item'; baseId: string; itemId: string }
  | { kind: 'buy-equipment'; baseId: string; equipmentId: string }

// ─── selfPreservation ──────────────────────────────────────────────

export function evaluateSelfPreservation(
  inputs: FuzzyInputs,
  state?: GameState,
  player?: PlayerState,
  dependencies?: ExecuteAiActionDependencies,
): GoalResult {
  if (!state || !player || !dependencies) return { score: 0 }
  const { hitsSurvivable, distToNearestThreat, healthRatio, bestItemToUse, nearestBase, hasInfirmary } = inputs

  // 有威脅 → 評估逃命或用道具續命
  if (distToNearestThreat !== Infinity) {
    const f_hitsLow = trapezoid(hitsSurvivable, 0, 0.5, 1, 2)
    const f_threatClose = trapezoid(distToNearestThreat, 0, 0, 2, 4)
    const f_healthLow = trapezoid(healthRatio, 0, 0.2, 0.5, 0.8)

    // 逃命分數
    const retreatScore = Math.min(1, fuzzyOr(
      fuzzyAnd(f_hitsLow, f_healthLow),
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

    // 血量低且威脅相鄰時視為緊急自保，避免任務／建設分數壓過救命行動。
    const emergencyScore = healthRatio < 0.5 && distToNearestThreat <= 1 ? 0.8 : 0
    const score = Math.max(retreatScore, healScore, emergencyScore)
    if (healScore > retreatScore) {
      const result: GoalResult = {
        score,
        target: { kind: 'use-item', itemId: bestItemToUse!.id },
        distanceToTarget: 0,
        context: { hitsSurvivable, distToNearestThreat, action: 'heal-in-combat' },
      }
      const actions = buildValidatedActionSequence('selfPreservation', result, state, player, dependencies)
      if (actions.length === 0) return { score: 0 }
      result.actions = actions
      return result
    }
    const result: GoalResult = {
      score,
      target: { kind: 'retreat', escapeDirection: { row: 0, column: 0 } },
      distanceToTarget: 0,
      context: { hitsSurvivable, distToNearestThreat },
    }
    const actions = buildValidatedActionSequence('selfPreservation', result, state, player, dependencies)
    if (actions.length === 0) return { score: 0 }
    result.actions = actions
    return result
  }

  // 無威脅 + 血量低 → 先試用回血道具，再考慮回據點
  if (healthRatio < 0.5 && bestItemToUse?.effect === 'health') {
    const missingHealth = 1 - healthRatio
    const restoreRatio = bestItemToUse.effectValue / (missingHealth * 100)
    const score = Math.min(0.95, restoreRatio >= 1 ? 0.95 : restoreRatio * 0.95)
    const result: GoalResult = {
      score,
      target: { kind: 'use-item', itemId: bestItemToUse.id },
      distanceToTarget: 0,
      context: { healthRatio, action: 'heal-out-of-combat' },
    }
    const actions = buildValidatedActionSequence('selfPreservation', result, state, player, dependencies)
    if (actions.length === 0) return { score: 0 }
    result.actions = actions
    return result
  }

  // 無威脅 + 血量低 + 無回血道具 → 回據點醫治
  if (healthRatio < 0.3 && nearestBase) {
    if (hasInfirmary && inputs.feasibility.healBaseId) {
      const score = Math.min(0.95, (0.3 - healthRatio) / 0.3)
      const result: GoalResult = {
        score,
        target: { kind: 'use-facility', baseId: inputs.feasibility.healBaseId, facilityType: 'heal' },
        distanceToTarget: inputs.feasibility.distToNearestActiveBase,
        context: { healthRatio },
      }
      const actions = buildValidatedActionSequence('selfPreservation', result, state, player, dependencies)
      if (actions.length === 0) return { score: 0 }
      result.actions = actions
      return result
    }
    const score = Math.min(0.85, (0.3 - healthRatio) / 0.3)
    const result: GoalResult = {
      score,
      target: { kind: 'return-to-base-heal', baseId: nearestBase.id, position: nearestBase.position },
      distanceToTarget: inputs.feasibility.distToNearestActiveBase,
      context: { healthRatio },
    }
    const actions = buildValidatedActionSequence('selfPreservation', result, state, player, dependencies)
    if (actions.length === 0) return { score: 0 }
    result.actions = actions
    return result
  }

  return { score: 0 }
}

// ─── collectItems ──────────────────────────────────────────────────

export function evaluateCollectItems(
  inputs: FuzzyInputs,
  state?: GameState,
  player?: PlayerState,
  dependencies?: ExecuteAiActionDependencies,
): GoalResult {
  if (!state || !player || !dependencies) return { score: 0 }
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

  const result: GoalResult = {
    score,
    target: bestItem
      ? { kind: 'item', id: bestItem.ref.id, position: bestItem.position }
      : undefined,
    distanceToTarget: distToNearestItem === Infinity ? undefined : distToNearestItem,
    context: { reachableItemCount, distToNearestItem },
  }

  if (score > 0 && result.target) {
    const actions = buildValidatedActionSequence('collectItems', result, state, player, dependencies)
    if (actions.length === 0) return { score: 0 }
    result.actions = actions
  }

  return result
}

// ─── engageCombat ───────────────────────────────────────────────
// 附近有怪物 → 高分；體力充足 + 血量健康 → 加分

function evaluateEngageCombat(
  inputs: FuzzyInputs,
  state?: GameState,
  player?: PlayerState,
  dependencies?: ExecuteAiActionDependencies,
): GoalResult {
  if (!state || !player || !dependencies) return { score: 0 }
  const { hitsSurvivable, combatCandidates, hasGrowthPath, playerLevel, needsLeveling, totalCreatureCount } = inputs

  // 場上怪壓力：場上存活生物越多，清怪優先度越高（避免囤怪被圍攻致死）。
  const f_pressure = totalCreatureCount == null ? 0 : trapezoid(totalCreatureCount, 1, 2, 4, 6)
  const nearestNest = state.creatureNests
    .filter((nest) => nest.health > 0)
    .sort((first, second) => manhattan(player.position, first.position) - manhattan(player.position, second.position))[0]
  const nestThreat = nearestNest
    ? combatCandidates.find((candidate) => manhattan(candidate.position, nearestNest.position) <= 2)
    : undefined
  const bestCandidate = nestThreat ?? combatCandidates[0]

  if (!bestCandidate) {
    return { score: 0 }
  }

  const { creatureId, position, distance, damageRatio } = bestCandidate
  const isNestThreat = nestThreat?.creatureId === creatureId
  // 擊殺目標：AI 已鎖定追殺這隻怪（midTerm kill goal）。即使距離 > 1 也應追擊靠近，
  // 否則距離 > 1 時 killable=false，engageCombat 分數為 0，擊殺目標永遠無法觸發追擊。
  const isKillTarget = getKillTargetId(player.id) === creatureId
  const killable = (distance === 1 || (isKillTarget && distance <= KILL_MAX_DISTANCE))
    && hitsSurvivable >= 1 && player.stamina > 0

  // 傷害評估（damageRatio = 一回合總傷害（內功普攻 + 可用外功）/ 怪物血量）：
  // - canKillInOneTurn：一回合總傷≥75%，很可能一回合收 → 最高權重。
  // - canKillInTwoTurns：一回合總傷≥40%，兩回合可磨死 → 中高權重（無法一回收，但仍有磨血價值）。
  // - 否則：完全打不死 → 放低權重，優先學招/升級/練功變強。
  const canKillInOneTurn = damageRatio >= 0.75
  const canKillInTwoTurns = damageRatio >= 0.4

  if (killable && canKillInOneTurn) {
    const combatReadiness = Math.min(1, damageRatio * 1.5)
    const result: GoalResult = {
      score: isNestThreat ? Math.max(0.9, combatReadiness) : Math.max(0.85, combatReadiness),
      target: { kind: 'attack', targetId: creatureId, targetType: 'creature', position },
      distanceToTarget: distance,
      context: { distance, creatureId, killable: true, canKillInOneTurn, canKillInTwoTurns, damageRatio, combatReadiness, isNestThreat },
    }
    const actions = buildValidatedActionSequence('engageCombat', result, state, player, dependencies)
    if (actions.length === 0) return { score: 0 }
    result.actions = actions
    return result
  }

  // 兩回殺可磨：無法一回合收，但兩回合內可磨死 → 保留中高意願，仍優於去打完全不死的怪。
  // 巢穴守衛（isNestThreat）給較高分，因為不打會被持續消耗。
  if (killable && canKillInTwoTurns) {
    const result: GoalResult = {
      score: isNestThreat ? 0.7 : 0.55,
      target: { kind: 'attack', targetId: creatureId, targetType: 'creature', position },
      distanceToTarget: distance,
      context: { distance, creatureId, killable: true, canKillInOneTurn: false, canKillInTwoTurns, damageRatio, isNestThreat },
    }
    const actions = buildValidatedActionSequence('engageCombat', result, state, player, dependencies)
    if (actions.length === 0) return { score: 0 }
    result.actions = actions
    return result
  }

  // 磨血意願：低等級（或等級落後）時不計較能不能快速殺，先磨血練等累積經驗；
  // 等級高了才要求效率。Lv.1~5 高度願意磨，Lv.8+ 降至 0（重視快速擊殺）。
  const f_grindWillingness = needsLeveling ? 1 : trapezoid(playerLevel, 1, 1, 5, 8)

  // 完全打不死（或打不到）：
  // - 低等級且願意磨血練等 → 提高磨血意願（低於兩回殺但仍有練功價值），避免「打不死就不打」死鎖。
  // - 有變強途徑 → 略低；等級高 → 幾乎不磨（重視效率）。
  // - 場上怪多（f_pressure 高）→ 即使打不死也抬高出清意願，避免囤積被圍攻致死。
  const lowCombatBase = hasGrowthPath ? 0.2 : 0.35
  const pressureBonus = 0.4 * f_pressure
  const lowCombatScore = killable ? lowCombatBase + 0.25 * f_grindWillingness + pressureBonus : 0
  const result: GoalResult = {
    score: lowCombatScore,
    target: { kind: 'attack', targetId: creatureId, targetType: 'creature', position },
    distanceToTarget: distance,
    context: { distance, creatureId, killable, canKillInOneTurn: false, canKillInTwoTurns: false, damageRatio, grindWillingness: f_grindWillingness, totalCreatureCount },
  }
  const actions = buildValidatedActionSequence('engageCombat', result, state, player, dependencies)
  if (actions.length === 0) return { score: 0 }
  result.actions = actions
  return result
}

// ─── allocateAttributes ─────────────────────────────────────────
// 有可分配屬性點 → 分數 = 1（最高優先）

function evaluateAllocateAttributes(
  inputs: FuzzyInputs,
  state?: GameState,
  player?: PlayerState,
  dependencies?: ExecuteAiActionDependencies,
): GoalResult {
  const { availableAttributePoints, healthRatio } = inputs

  if (availableAttributePoints <= 0) {
    return { score: 0 }
  }

  // 依目前裝備內功的傷害公式配點：對五維各試「+1」，選能讓內功傷害提升最多的屬性。
  // 若提升持平（如均衡型功法），血量健康時投資臂力/根骨均衡輸出，血量低時優先根骨保命。
  let chosen: 'armStrength' | 'constitution' | 'agility' | 'innerEnergy' | 'insight' = 'armStrength'
  if (state && player) {
    const innerSkill = getInnerSkill(player.innerSkillId)
    const effective = getEffectiveAttributesForPlayer(player)
    const baseLevel = getSkillProgression(player, player.innerSkillId).level
    const baseDamage = Math.floor(getSkillDamage(effective, innerSkill, baseLevel))
    const attrKeys = ['armStrength', 'constitution', 'agility', 'innerEnergy', 'insight'] as const
    const gains = attrKeys.map((key) => {
      const next = { ...effective, [key]: effective[key] + 1 }
      const damage = Math.floor(getSkillDamage(next, innerSkill, baseLevel))
      return { key, gain: damage - baseDamage }
    })
    // 取傷害增量最大者；通常只有功法公式吃到的屬性才會有增量。
    const best = gains.reduce((acc, curr) => (curr.gain > acc.gain ? curr : acc), gains[0])
    if (best.gain > 0) {
      chosen = best.key
    } else {
      // 功法傷害對任何單項配點都無提升（均衡型）→ 血量低優先根骨保命，否則均衡輸出（臂力/根骨）。
      chosen = healthRatio < 0.5 ? 'constitution' : 'armStrength'
    }
  } else {
    chosen = healthRatio < 0.5 ? 'constitution' : 'armStrength'
  }

  const result: GoalResult = {
    score: 1,
    target: { kind: 'allocate-attribute', attribute: chosen },
    context: { availableAttributePoints, chosen },
  }
  if (!state || !player || !dependencies) return result

  const actions = buildValidatedActionSequence('allocateAttributes', result, state, player, dependencies)
  return actions.length > 0 ? { ...result, actions } : { score: 0 }
}

// ─── useItem ────────────────────────────────────────────────────
// 有值得用的道具 → 高分

function evaluateUseItem(
  inputs: FuzzyInputs,
  state?: GameState,
  player?: PlayerState,
  dependencies?: ExecuteAiActionDependencies,
): GoalResult {
  const { bestItemToUse, healthRatio, innerPowerRatio } = inputs

  if (!bestItemToUse) {
    return { score: 0 }
  }

  const withExecutableAction = (result: GoalResult): GoalResult => {
    if (!state || !player || !dependencies) return result
    const actions = buildValidatedActionSequence('useItem', result, state, player, dependencies)
    return actions.length > 0 ? { ...result, actions } : { score: 0 }
  }

  // 回血道具：恢復量 / 缺血量，佔比越高分數越高；可完全恢復時 score = 1
  if (bestItemToUse.effect === 'health') {
    const missingHealth = 1 - healthRatio
    if (missingHealth <= 0) return { score: 0 }
    const restoreRatio = bestItemToUse.effectValue / (missingHealth * 100)
    const score = restoreRatio >= 1 ? 1 : restoreRatio
    return withExecutableAction({
      score,
      target: { kind: 'use-item', itemId: bestItemToUse.id },
      context: { effect: bestItemToUse.effect, name: bestItemToUse.name, effectValue: bestItemToUse.effectValue },
    })
  }

  // 回內力道具：恢復量 / 缺內力量，佔比越高分數越高；可完全恢復時 score = 1
  if (bestItemToUse.effect === 'inner-power') {
    const missingInnerPower = 1 - innerPowerRatio
    if (missingInnerPower <= 0) return { score: 0 }
    const restoreRatio = bestItemToUse.effectValue / (missingInnerPower * 100)
    const score = restoreRatio >= 1 ? 1 : restoreRatio
    return withExecutableAction({
      score,
      target: { kind: 'use-item', itemId: bestItemToUse.id },
      context: { effect: bestItemToUse.effect, name: bestItemToUse.name, effectValue: bestItemToUse.effectValue },
    })
  }

  // 回體力道具：固定分數
  if (bestItemToUse.effect === 'stamina') {
    return withExecutableAction({
      score: 0.6,
      target: { kind: 'use-item', itemId: bestItemToUse.id },
      context: { effect: bestItemToUse.effect, name: bestItemToUse.name },
    })
  }

  // 其他道具：中等分數
  return withExecutableAction({
    score: 0.4,
    target: { kind: 'use-item', itemId: bestItemToUse.id },
    context: { effect: bestItemToUse.effect, name: bestItemToUse.name },
  })
}

// ─── equipEquipment ────────────────────────────────────────────
// 有可裝備的武具（部位空 or 耐久=0）→ score = 1

function evaluateEquipEquipment(
  inputs: FuzzyInputs,
  state?: GameState,
  player?: PlayerState,
  dependencies?: ExecuteAiActionDependencies,
): GoalResult {
  const { equipmentCandidates } = inputs
  const equipableEquipment = equipmentCandidates[0]

  if (!equipableEquipment) {
    return { score: 0 }
  }

  const result: GoalResult = {
    score: equipableEquipment.value,
    target: { kind: 'equip', instanceId: equipableEquipment.instanceId },
    context: { slot: equipableEquipment.slot, name: equipableEquipment.name, durability: equipableEquipment.durability, value: equipableEquipment.value },
  }
  if (!state || !player || !dependencies) return result

  const actions = buildValidatedActionSequence('equipEquipment', result, state, player, dependencies)
  return actions.length > 0 ? { ...result, actions } : { score: 0 }
}

// ─── evaluateAllGoals ──────────────────────────────────────────────

export function evaluateAllGoals(
  inputs: FuzzyInputs,
  state?: GameState,
  player?: PlayerState,
  dependencies?: ExecuteAiActionDependencies,
  constraints: AiGoalConstraints = {},
): Record<GoalName, GoalResult> {
  const results: Record<GoalName, GoalResult> = {
    selfPreservation: evaluateSelfPreservation(inputs, state, player, dependencies),
    collectItems: evaluateCollectItems(inputs, state, player, dependencies),
    positioning: evaluatePositioning(inputs, state, player, dependencies),
    construction: evaluateConstruction(inputs, state, player, dependencies),
    exploration: evaluateExploration(inputs, state, player, dependencies),
    engageCombat: evaluateEngageCombat(inputs, state, player, dependencies),
    allocateAttributes: evaluateAllocateAttributes(inputs, state, player, dependencies),
    useItem: evaluateUseItem(inputs, state, player, dependencies),
    equipEquipment: evaluateEquipEquipment(inputs, state, player, dependencies),
    attackNest: evaluateAttackNest(inputs, state, player, dependencies),
    prepareNest: evaluatePrepareNest(inputs, state, player, dependencies),
    equipInnerSkill: evaluateEquipInnerSkill(inputs, state, player, dependencies),
    equipExternalSkill: evaluateEquipExternalSkill(inputs, state, player, dependencies),
    useInnerSkillAttack: evaluateUseInnerSkillAttack(inputs, state, player, dependencies),
    learnMartialSkill: evaluateLearnMartialSkill(inputs, state, player, dependencies),
    practiceSkill: evaluatePracticeSkill(inputs, state, player, dependencies),
    executeMission: evaluateExecuteMission(inputs, state, player, dependencies),
    repairEquipment: evaluateRepairEquipment(inputs, state, player, dependencies),
    buildDefense: evaluateBuildDefense(inputs, state, player, dependencies),
    buyConsumable: evaluateBuyConsumable(inputs, state, player, dependencies),
    buyEquipment: evaluateBuyEquipment(inputs, state, player, dependencies),
  }

  // 距離衰減：探索與巢穴攻略都以移動 action 表達距離成本，不重複扣分。
  for (const goal of Object.keys(results) as GoalName[]) {
    if (goal === 'exploration' || goal === 'attackNest') continue
    const r = results[goal]
    if (r.distanceToTarget != null && r.distanceToTarget > 0) {
      // 每格衰減 0.05，到 10 格以上分數歸零
      const decay = Math.max(0, 1 - r.distanceToTarget * 0.05)
      r.score *= decay
    }
  }

  const allowedGoals = constraints.allowedGoals ? new Set(constraints.allowedGoals) : undefined
  if (constraints.followTarget && state && player && dependencies) {
    const distance = Math.abs(player.position.row - constraints.followTarget.position.row)
      + Math.abs(player.position.column - constraints.followTarget.position.column)
    const followResult: GoalResult = {
      score: distance > constraints.followTarget.maxDistance
        ? Math.min(1, 0.65 + (distance - constraints.followTarget.maxDistance) * 0.08)
        : 0,
      target: { kind: 'follow-player', position: constraints.followTarget.position },
      distanceToTarget: distance,
      context: { distance, maxDistance: constraints.followTarget.maxDistance },
    }
    const actions = buildValidatedActionSequence('positioning', followResult, state, player, dependencies)
    results.positioning = actions.length > 0 ? { ...followResult, actions } : { score: 0 }
  }
  if (constraints.forcedCombatTarget && state && player && dependencies) {
    const combatResult: GoalResult = {
      score: 1,
      target: { kind: 'attack', targetId: constraints.forcedCombatTarget.id, targetType: 'creature', position: constraints.forcedCombatTarget.position },
      distanceToTarget: Math.abs(player.position.row - constraints.forcedCombatTarget.position.row)
        + Math.abs(player.position.column - constraints.forcedCombatTarget.position.column),
      context: { forcedBy: 'support-player' },
    }
    const actions: AiAction[] = [{
      type: 'attack',
      actor: { id: player.id, kind: 'player' },
      target: { id: constraints.forcedCombatTarget.id, kind: 'creature', position: constraints.forcedCombatTarget.position },
      reason: '支援命令：保護目標，攔截威脅',
    }]
    results.engageCombat = actions.length > 0 ? { ...combatResult, actions } : { score: 0 }
  }
  for (const goal of Object.keys(results) as GoalName[]) {
    if (allowedGoals && !allowedGoals.has(goal)) {
      results[goal] = { score: 0 }
      continue
    }
    const weight = constraints.goalWeights?.[goal]
    if (weight !== undefined) results[goal].score *= Math.max(0, weight)
  }

  return results
}

function evaluateBuyConsumable(
  inputs: FuzzyInputs,
  state?: GameState,
  player?: PlayerState,
  dependencies?: ExecuteAiActionDependencies,
): GoalResult {
  const { buyableUsefulItem, nearestBase, isAdjacentToBase, staminaRatio } = inputs
  // 避免在體力低時遠赴商店購物（優先保留體力做更緊急的事）
  if (!state || !player || !dependencies || !buyableUsefulItem || !nearestBase) return { score: 0 }
  if (staminaRatio < 0.3) return { score: 0 }

  const result: GoalResult = {
    score: 0.55,
    target: { kind: 'buy-item', baseId: nearestBase.id, itemId: buyableUsefulItem.itemId },
    distanceToTarget: isAdjacentToBase ? 0 : manhattan(player.position, nearestBase.position),
    context: { baseId: nearestBase.id, itemName: buyableUsefulItem.name, price: buyableUsefulItem.price, effect: buyableUsefulItem.effect },
  }
  const actions = buildValidatedActionSequence('buyConsumable', result, state, player, dependencies)
  return actions.length > 0 ? { ...result, actions } : { score: 0 }
}

// ─── buyEquipment ──────────────────────────────────────────────────
// 有值得買的裝備（改善配裝 + 買得起）→ 中高分，買下強化自身

function evaluateBuyEquipment(
  inputs: FuzzyInputs,
  state?: GameState,
  player?: PlayerState,
  dependencies?: ExecuteAiActionDependencies,
): GoalResult {
  const { buyableEquipment, staminaRatio } = inputs
  if (!state || !player || !dependencies || !buyableEquipment) return { score: 0 }
  if (staminaRatio < 0.3) return { score: 0 }

  const base = state.bases.find((candidate) => candidate.id === buyableEquipment.baseId)
  if (!base) return { score: 0 }
  const distance = manhattan(player.position, base.position)

  const result: GoalResult = {
    score: 0.62,
    target: { kind: 'buy-equipment', baseId: buyableEquipment.baseId, equipmentId: buyableEquipment.equipmentId },
    distanceToTarget: distance,
    context: { baseId: buyableEquipment.baseId, equipmentName: buyableEquipment.name, price: buyableEquipment.price, slot: buyableEquipment.slot },
  }
  const actions = buildValidatedActionSequence('buyEquipment', result, state, player, dependencies)
  return actions.length > 0 ? { ...result, actions } : { score: 0 }
}

function evaluatePrepareNest(
  inputs: FuzzyInputs,
  state?: GameState,
  player?: PlayerState,
  dependencies?: ExecuteAiActionDependencies,
): GoalResult {
  const { buyableNestBurstItem, nearestBase, isAdjacentToBase } = inputs
  if (!state || !player || !dependencies || !buyableNestBurstItem || !nearestBase) return { score: 0 }
  const result: GoalResult = {
    score: 0.78,
    target: { kind: 'buy-item', baseId: nearestBase.id, itemId: buyableNestBurstItem.itemId },
    distanceToTarget: isAdjacentToBase ? 0 : manhattan(player.position, nearestBase.position),
    context: { baseId: nearestBase.id, itemName: buyableNestBurstItem.name, damage: buyableNestBurstItem.damage },
  }
  const actions = buildValidatedActionSequence('prepareNest', result, state, player, dependencies)
  return actions.length > 0 ? { ...result, actions } : { score: 0 }
}

// ─── construction ──────────────────────────────────────────────────
// 建料滿 + 可蓋 → 高分 build；建料不足 + 有資源點 → 移動/採集

function evaluateConstruction(
  inputs: FuzzyInputs,
  state?: GameState,
  player?: PlayerState,
  dependencies?: ExecuteAiActionDependencies,
): GoalResult {
  if (!state || !player || !dependencies) return { score: 0 }
  const { materialRatio, nearestBase, nearestUndiscoveredBase, nearestResourcePoint, distToNearestResourcePoint, isAdjacentToResourcePoint, visibleBaseIds, isAdjacentToBase, threatCountNearBase, constructionCandidates } = inputs

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
  const candidates = constructionCandidates
    .filter((candidate) => threatCountNearBase === 0 || candidate.kind === 'upgrade' || candidate.buildingType === 'arrow-tower' || candidate.buildingType === 'advanced-arrow-tower')
    .sort((a, b) => b.value - a.value)
  const shouldPrepareUndiscoveredBase = isAdjacentToBase
    && threatCountNearBase === 0
    && nearestUndiscoveredBase != null
    && nearestUndiscoveredBase.id !== nearestBase?.id
  const waystationCandidate = shouldPrepareUndiscoveredBase
    ? constructionCandidates.find((candidate) => candidate.kind === 'build' && candidate.buildingType === 'waystation')
    : undefined
  const bestCandidate = waystationCandidate ?? candidates[0]

  if (bestCandidate && nearestBase && materialRatio > 0) {
    const isWaystationAccessPlan = bestCandidate.buildingType === 'waystation'
      && isAdjacentToBase
      && nearestUndiscoveredBase != null
      && nearestUndiscoveredBase.id !== nearestBase.id

    // B1：已在據點旁 → 直接建造（高分）
    if (isAdjacentToBase) {
      const target = bestCandidate.kind === 'build'
        ? { kind: 'build' as const, baseId: bestCandidate.baseId, buildingId: bestCandidate.buildingId, buildingName: bestCandidate.buildingName }
        : { kind: 'upgrade' as const, baseId: bestCandidate.baseId, buildingId: bestCandidate.buildingId, buildingType: bestCandidate.buildingType, buildingName: bestCandidate.buildingName, nextLevel: bestCandidate.nextLevel! }
      const result: GoalResult = {
        score: isWaystationAccessPlan ? Math.max(0.82, bestCandidate.value) : bestCandidate.value,
        target,
        context: { materialRatio, action: bestCandidate.kind },
      }
      const actions = buildValidatedActionSequence('construction', result, state, player, dependencies)
      if (actions.length === 0) return { score: 0 }
      result.actions = actions
      return result
    }
    // B2：不在據點旁 → 移動到據點（中高分）
    const result: GoalResult = {
      score: 0.7,
      target: bestCandidate.kind === 'build'
        ? { kind: 'build' as const, baseId: bestCandidate.baseId, buildingId: bestCandidate.buildingId, buildingName: bestCandidate.buildingName }
        : { kind: 'upgrade' as const, baseId: bestCandidate.baseId, buildingId: bestCandidate.buildingId, buildingType: bestCandidate.buildingType, buildingName: bestCandidate.buildingName, nextLevel: bestCandidate.nextLevel! },
      distanceToTarget: inputs.feasibility.distToNearestActiveBase,
      context: { materialRatio, action: 'move-to-base-for-build', baseId: nearestBase.id },
    }
    const actions = buildValidatedActionSequence('construction', result, state, player, dependencies)
    if (actions.length === 0) return { score: 0 }
    result.actions = actions
    return result
  }

  // 情境 C：已與資源點相鄰 → 採集（高分，但建料充足時快速降低）
  if (isAdjacentToResourcePoint && nearestResourcePoint) {
    const f_materialUrgency = materialRatio <= 0.33 ? 1 : materialRatio <= 0.66 ? 0.4 : 0.1
    const result: GoalResult = {
      score: 0.8 * f_materialUrgency,
      target: { kind: 'resource-point', resourcePointId: nearestResourcePoint.id, position: nearestResourcePoint.position },
      distanceToTarget: 1,
      context: { materialRatio, action: 'collect' },
    }
    const actions = buildValidatedActionSequence('construction', result, state, player, dependencies)
    if (actions.length === 0) return { score: 0 }
    result.actions = actions
    return result
  }

  // 情境 D：有據點 + 建料不足 + 有資源點 → 移動到資源點（中分，建料充足時快速降低）
  if (materialRatio < 1 && nearestResourcePoint && distToNearestResourcePoint < Infinity) {
    const f_materialUrgency = materialRatio <= 0.33 ? 1 : materialRatio <= 0.66 ? 0.4 : 0.1
    const result: GoalResult = {
      score: 0.85 * f_materialUrgency,
      target: { kind: 'resource-point', resourcePointId: nearestResourcePoint.id, position: nearestResourcePoint.position },
      distanceToTarget: distToNearestResourcePoint,
      context: { materialRatio, distToNearestResourcePoint, action: 'move-to-resource' },
    }
    const actions = buildValidatedActionSequence('construction', result, state, player, dependencies)
    if (actions.length === 0) return { score: 0 }
    result.actions = actions
    return result
  }

  // 無資源點 → 低分
  return {
    score: 0.1,
    context: { materialRatio },
  }
}

// ─── exploration ──────────────────────────────────────────────────
// 預設目標：有未探索可達格 → 高分 + 移動到最近的未探索格

function evaluateExploration(
  inputs: FuzzyInputs,
  state?: GameState,
  player?: PlayerState,
  dependencies?: ExecuteAiActionDependencies,
): GoalResult {
  if (!state || !player || !dependencies) return { score: 0 }
  const { unexploredReachableCount, nearestUnexploredPosition, nearestUndiscoveredBase, staminaRatio, allBasesVisible } = inputs

  // 探索的重點是「把據點納入視野」；若沒有未發現據點，探索僅以「體力可達的未探索格」為目標，
  // 避免跑去遙遠/不可達的不可見格卡住空轉，資源應轉向建設/經營。
  if (!nearestUndiscoveredBase) {
    // 完全沒有可達未探索格 → 0
    if (unexploredReachableCount === 0 || !nearestUnexploredPosition) {
      return { score: 0 }
    }
    // 以「最近的可行未探索格」為目標，給中等偏低分（可持續推進地圖，但不搶經營）。
    const result: GoalResult = {
      score: 0.15,
      target: { kind: 'explore', position: nearestUnexploredPosition },
      context: { unexploredReachableCount, target: 'unexplored-cell-reachable' },
    }
    const actions = buildValidatedActionSequence('exploration', result, state, player, dependencies)
    if (actions.length === 0 || actions.every((action) => action.type === 'hold')) return { score: 0 }
    result.actions = actions
    return result
  }

  // 所有據點在視野內 → 探索分數極低（無未發現據點時已於上面攔截，這裡是保險）
  if (allBasesVisible) {
    return { score: 0.03 }
  }

  const canTransportToUndiscoveredBase = nearestUndiscoveredBase != null
    && canTransportPlayer(state, player.id, nearestUndiscoveredBase.id).ok

  // 到這裡必存在未發現據點（無未發現據點已提前 return）：探索聚焦把據點納入視野。
  // 距離門檻：據點太遠（超出體力可達範圍）時不鎖定，避免 AI 每回合只爬 1 格、體力耗盡目標仍遠，
  // 產生大量無效 move 與 hold。太遠時改為探索附近的未探索格（若有）。
  const distToBase = nearestUndiscoveredBase
    ? manhattan(player.position, nearestUndiscoveredBase.position)
    : Infinity
  // 距離門檻：據點太遠（超出體力可達範圍）時不鎖定，避免 AI 每回合只爬 1 格、體力耗盡目標仍遠，
  // 產生大量無效 move 與 hold。太遠時改為探索附近的未探索格（若有）。
  const baseReachable = distToBase <= Math.max(6, player.stamina)
  if (!baseReachable) {
    if (unexploredReachableCount > 0 && nearestUnexploredPosition) {
      const nearbyResult: GoalResult = {
        score: 0.15,
        target: { kind: 'explore', position: nearestUnexploredPosition },
        context: { unexploredReachableCount, target: 'unexplored-cell-reachable' },
      }
      const nearbyActions = buildValidatedActionSequence('exploration', nearbyResult, state, player, dependencies)
      if (nearbyActions.length > 0 && nearbyActions.some((action) => action.type !== 'hold')) {
        return { ...nearbyResult, actions: nearbyActions }
      }
    }
    return { score: 0 }
  }

  const baseScore = canTransportToUndiscoveredBase ? 1 : 0.9
  const score = staminaRatio > 0.3 ? baseScore : baseScore * 0.5

  const result: GoalResult = {
    score,
    target: { kind: 'explore', position: nearestUndiscoveredBase!.position },
    distanceToTarget: manhattan(player.position, nearestUndiscoveredBase!.position),
    context: {
      target: 'undiscovered-base',
      canTransportToUndiscoveredBase,
      targetBaseId: nearestUndiscoveredBase!.id,
      targetBasePosition: nearestUndiscoveredBase!.position,
    },
  }

  const actions = buildValidatedActionSequence('exploration', result, state, player, dependencies)
  const hasMovement = actions.some((action) => action.type !== 'hold')

  // 未發現據點可能被障礙或剩餘體力封鎖；此時退回可行的未探索格（若有），避免只有 hold 的虛假目標。
  if (!hasMovement && nearestUndiscoveredBase && nearestUnexploredPosition) {
    const fallbackResult: GoalResult = {
      ...result,
      target: { kind: 'explore', position: nearestUnexploredPosition },
      distanceToTarget: undefined,
      context: { target: 'unexplored-cell-fallback' },
    }
    const fallbackActions = buildValidatedActionSequence('exploration', fallbackResult, state, player, dependencies)
    if (fallbackActions.some((action) => action.type !== 'hold')) return { ...fallbackResult, actions: fallbackActions }
  }

  if (actions.length === 0 || actions.every((action) => action.type === 'hold')) {
    // eslint-disable-next-line no-console
    console.log('[exploration-stuck]', JSON.stringify({
      player: player.position,
      base: nearestUndiscoveredBase?.position,
      distToBase,
      baseReachable,
      stamina: player.stamina,
      unexploredReachableCount,
      nearestUnexploredPosition,
      actions: actions.map((a) => a.type),
    }))
    return { score: 0 }
  }
  result.actions = actions
  return result
}

// ─── positioning ──────────────────────────────────────────────────
// 出口越少 → 分數越高；無出口且有怪 → attack target；有出口 → exit target

export function evaluatePositioning(
  inputs: FuzzyInputs,
  state?: GameState,
  player?: PlayerState,
  dependencies?: ExecuteAiActionDependencies,
): GoalResult {
  if (!state || !player || !dependencies) return { score: 0 }
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

  const result: GoalResult = {
    score: finalScore,
    target,
    context: { exitCount, distToNearestThreat },
  }

  if (finalScore > 0 && target) {
    const actions = buildValidatedActionSequence('positioning', result, state, player, dependencies)
    if (actions.length === 0) return { score: 0 }
    result.actions = actions
  }

  return result
}

// ─── attackNest ─────────────────────────────────────────────────

export function evaluateAttackNest(
  inputs: FuzzyInputs,
  state?: GameState,
  player?: PlayerState,
  dependencies?: ExecuteAiActionDependencies,
): GoalResult {
  if (!state || !player || !dependencies) return { score: 0 }
  const { hitsSurvivable, distToNearestNest, visibleCreatureIds, playerLevel } = inputs

  if (distToNearestNest === Infinity) return { score: 0 }

  // 戰力門檻：攻擊巢穴是高風險的長期目標，應等玩家有一定戰力才逐漸加權。
  // Lv.7 以下幾乎不主動攻擊巢穴（優先學招/練功變強）；Lv.7+ 權重隨等級平滑升高。
  const f_levelGate = trapezoid(playerLevel, 5, 7, 9, 12)

  const f_safeHealth = Math.min(1, Math.max(0, (hitsSurvivable - 2) / 2))
  const nearestNest = state.creatureNests
    .filter((nest) => nest.health > 0)
    .sort((first, second) => {
      const firstDistance = Math.abs(first.position.row - player.position.row) + Math.abs(first.position.column - player.position.column)
      const secondDistance = Math.abs(second.position.row - player.position.row) + Math.abs(second.position.column - player.position.column)
      return firstDistance - secondDistance
    })[0]
  const localThreatCount = nearestNest
    ? state.creatures.filter((creature) => {
      if (creature.health <= 0 || !visibleCreatureIds.includes(creature.id)) return false
      return Math.abs(creature.position.row - nearestNest.position.row)
        + Math.abs(creature.position.column - nearestNest.position.column) <= 2
    }).length
    : 0
  const f_nestArea = localThreatCount === 0 ? 1 : 0.9
  const f_nestClose = 1

  // 基礎分（安全度＋巢穴無守衛）再乘上等級門檻：戰力不足時攻擊巢穴意願大幅壓低。
  const baseScore = fuzzyAnd(f_safeHealth, fuzzyAnd(f_nestArea, f_nestClose))
  const score = baseScore * f_levelGate

  const result: GoalResult = {
    score,
    target: { kind: 'attack', targetId: '', targetType: 'nest', position: { row: -1, column: -1 } },
    distanceToTarget: distToNearestNest,
    context: { distToNearestNest, visibleCreatureCount: visibleCreatureIds.length, localThreatCount, playerLevel, levelGate: f_levelGate },
  }

  if (score > 0) {
    const actions = buildValidatedActionSequence('attackNest', result, state, player, dependencies)
    if (actions.length === 0) return { score: 0 }
    result.actions = actions
  }

  return result
}

// ─── equipInnerSkill ────────────────────────────────────────────

export function evaluateEquipInnerSkill(
  inputs: FuzzyInputs,
  state?: GameState,
  player?: PlayerState,
  dependencies?: ExecuteAiActionDependencies,
): GoalResult {
  const { innerSkillCandidates, innerPowerRatio } = inputs
  const betterInnerSkill = innerSkillCandidates[0]

  if (!betterInnerSkill) return { score: 0 }

  const f_hasCapacity = 1
  const f_hasPower = trapezoid(innerPowerRatio, 0.1, 0.2, 1, 1)
  const score = fuzzyAnd(f_hasCapacity, f_hasPower)

  const result: GoalResult = {
    score,
    target: { kind: 'equip-inner-skill', skillId: betterInnerSkill.id },
    context: { skillId: betterInnerSkill.id, skillName: betterInnerSkill.name, value: betterInnerSkill.value },
  }
  if (!state || !player || !dependencies) return result

  const actions = buildValidatedActionSequence('equipInnerSkill', result, state, player, dependencies)
  return actions.length > 0 ? { ...result, actions } : { score: 0 }
}

// ─── equipExternalSkill ────────────────────────────────────────
// 有已學會但未啟用的外功 → 啟用它（讓學到的外功真正派上用場）

function evaluateEquipExternalSkill(
  inputs: FuzzyInputs,
  state?: GameState,
  player?: PlayerState,
  dependencies?: ExecuteAiActionDependencies,
): GoalResult {
  const { unequippedExternalSkill, innerPowerRatio } = inputs
  if (!unequippedExternalSkill) return { score: 0 }
  // 啟用外功消耗 1% 內力，需有基本內力
  const f_hasPower = trapezoid(innerPowerRatio, 0.1, 0.2, 1, 1)
  const score = f_hasPower

  const result: GoalResult = {
    score,
    target: { kind: 'equip-external-skill', skillId: unequippedExternalSkill.skillId },
    context: { skillId: unequippedExternalSkill.skillId, skillName: unequippedExternalSkill.name, category: unequippedExternalSkill.category },
  }
  if (!state || !player || !dependencies) return result

  const actions = buildValidatedActionSequence('equipExternalSkill', result, state, player, dependencies)
  return actions.length > 0 ? { ...result, actions } : { score: 0 }
}

// ─── useInnerSkillAttack ───────────────────────────────────────

export function evaluateUseInnerSkillAttack(
  _inputs: FuzzyInputs,
  _state?: GameState,
  _player?: PlayerState,
  _dependencies?: ExecuteAiActionDependencies,
): GoalResult {
  // 先關閉
  return { score: 0 }
}

// ─── learnMartialSkill ─────────────────────────────────────────
// 武館/門派有可學技能 → 高分

function evaluateLearnMartialSkill(
  inputs: FuzzyInputs,
  state?: GameState,
  player?: PlayerState,
  dependencies?: ExecuteAiActionDependencies,
): GoalResult {
  if (!state || !player || !dependencies) return { score: 0 }
  const { learnableSkillAtHall, learnableSkillAtGate, staminaRatio, feasibility, combatDamageRatio } = inputs

  // 悟性容量因子：已裝備功法超出悟性容量時，新學的功法裝備後效果會大幅衰減（getSkillEffectMultiplier → 0.1），
  // 學了也無法有效運用 → 視為無效行為，大幅降低學招分數。
  const capacityExceeded = getPlayerInsightCapacityBreakdown(player).exceeded
  const f_capacity = capacityExceeded ? 0.1 : 1

  // 傷害不足因子：玩家目前一擊能打掉怪物多少血（0~1）。打不動時學招需求高；傷害足夠時學招權重降低，
  // 避免玩家傷害夠了仍被「學招」鎖在門派往返、不去實戰。
  const f_damageNeed = combatDamageRatio != null && combatDamageRatio > 0
    ? trapezoid(combatDamageRatio, 0, 0, 0.5, 0.75)
    : 1

  // 門派學招：需要可步行到達 + 體力夠 + 金錢夠
  // 學招是「先變強再打」的投資：傷害不足時高分，傷害足夠時分數降低讓位給實戰/清巢穴。
  if (learnableSkillAtGate && feasibility.canReachNearestGate && feasibility.canAffordGateLearn && staminaRatio > 0.3) {
    const result: GoalResult = {
      score: 1 * (0.6 + 0.4 * f_damageNeed) * f_capacity,
      target: { kind: 'learn-skill', gateId: learnableSkillAtGate.gateId, skillType: learnableSkillAtGate.skillType, skillId: learnableSkillAtGate.skillId },
      distanceToTarget: undefined,
      context: { source: 'gate', name: learnableSkillAtGate.name, cost: feasibility.learnGateCost, damageRatio: combatDamageRatio },
    }
    const actions = buildValidatedActionSequence('learnMartialSkill', result, state, player, dependencies)
    if (actions.length === 0) return { score: 0 }
    result.actions = actions
    return result
  }

  // 武館學招：需要金錢夠
  if (learnableSkillAtHall && feasibility.canAffordHallLearn) {
    const result: GoalResult = {
      score: 0.6 * f_capacity,
      target: { kind: 'learn-skill', baseId: learnableSkillAtHall.baseId, skillType: learnableSkillAtHall.skillType, skillId: learnableSkillAtHall.skillId },
      distanceToTarget: feasibility.distToNearestHallBase,
      context: { source: 'hall', name: learnableSkillAtHall.name, cost: feasibility.learnHallCost },
    }
    const actions = buildValidatedActionSequence('learnMartialSkill', result, state, player, dependencies)
    if (actions.length === 0) return { score: 0 }
    result.actions = actions
    return result
  }

  return { score: 0 }
}

// ─── practiceSkill ─────────────────────────────────────────────
// 門派有可練技能 → 中分（需要體力）

function evaluatePracticeSkill(
  inputs: FuzzyInputs,
  state?: GameState,
  player?: PlayerState,
  dependencies?: ExecuteAiActionDependencies,
): GoalResult {
  if (!state || !player || !dependencies) return { score: 0 }
  const { practiceableSkillAtGate, staminaRatio, needsLeveling, feasibility } = inputs

  if (!practiceableSkillAtGate) return { score: 0 }
  if (!feasibility.canReachNearestGate) return { score: 0 }
  if (staminaRatio < 0.3) return { score: 0 }

  // 練功升的是「功法等級」，不是角色等級。角色 Lv 靠擊殺 XP。
  // 因此練功永遠不應壓過「可有效清怪」（兩回殺 0.55 / 一回殺 0.85+）：
  // 有可打之怪時要清怪優先，才不會把體力耗在練功而錯失升級需要的擊殺 XP。
  const baseScore = needsLeveling ? 0.45 : 0.35
  const f_stamina = trapezoid(staminaRatio, 0.3, 0.5, 1, 1)

  const result: GoalResult = {
    score: baseScore * f_stamina,
    target: { kind: 'practice-skill', gateId: practiceableSkillAtGate.gateId, skillId: practiceableSkillAtGate.skillId, position: practiceableSkillAtGate.position },
    distanceToTarget: feasibility.distToNearestGate,
    context: { name: practiceableSkillAtGate.name, needsLeveling },
  }

  const actions = buildValidatedActionSequence('practiceSkill', result, state, player, dependencies)
  if (actions.length === 0) return { score: 0 }
  result.actions = actions
  return result
}

// ─── executeMission ────────────────────────────────────────────
// 有告示牌 + 體力夠 → 執行任務（金錢+聲望）

function evaluateExecuteMission(
  inputs: FuzzyInputs,
  state?: GameState,
  player?: PlayerState,
  dependencies?: ExecuteAiActionDependencies,
): GoalResult {
  if (!state || !player || !dependencies) return { score: 0 }
  const { hasMissionBoard, needsBaseVision, staminaRatio, materialRatio, feasibility } = inputs

  if (!hasMissionBoard) return { score: 0 }
  if (staminaRatio < 0.2) return { score: 0 }
  if (!feasibility.missionBaseId) return { score: 0 }

  // 建料充足時做任務的動機較低；但已在告示牌旁時，任務是零移動成本的可執行行動，
  // 不應因分數四捨五入到門檻以下而讓 AI 永遠停在據點外。
  const isAdjacentToMissionBase = feasibility.distToNearestActiveBase <= 1
  const f_needMaterials = isAdjacentToMissionBase
    ? 0.35
    : materialRatio < 0.5 ? 0.35 : 0.2
  const score = needsBaseVision ? 0.95 : f_needMaterials

  const result: GoalResult = {
    score,
    target: { kind: 'use-facility', baseId: feasibility.missionBaseId, facilityType: 'mission' },
    distanceToTarget: feasibility.distToNearestActiveBase,
    context: { materialRatio, needsBaseVision },
  }

  const actions = buildValidatedActionSequence('executeMission', result, state, player, dependencies)
  if (actions.length === 0) return { score: 0 }
  result.actions = actions
  return result
}

// ─── repairEquipment ──────────────────────────────────────────
// 有工坊 + 裝備受損 → 修理

function evaluateRepairEquipment(
  inputs: FuzzyInputs,
  state?: GameState,
  player?: PlayerState,
  dependencies?: ExecuteAiActionDependencies,
): GoalResult {
  if (!state || !player || !dependencies) return { score: 0 }
  const { hasWorkshopDamaged, staminaRatio, feasibility } = inputs

  if (!hasWorkshopDamaged) return { score: 0 }
  if (staminaRatio < 0.2) return { score: 0 }
  if (!feasibility.repairBaseId) return { score: 0 }

  const result: GoalResult = {
    score: 0.5,
    target: { kind: 'use-facility', baseId: feasibility.repairBaseId, facilityType: 'repair' },
    distanceToTarget: feasibility.distToNearestActiveBase,
  }

  const actions = buildValidatedActionSequence('repairEquipment', result, state, player, dependencies)
  if (actions.length === 0) return { score: 0 }
  result.actions = actions
  return result
}

// ─── buildDefense ──────────────────────────────────────────────
// 有可建造防禦設施且據點尚未達到防禦需求 → 建造

function evaluateBuildDefense(
  inputs: FuzzyInputs,
  state?: GameState,
  player?: PlayerState,
  dependencies?: ExecuteAiActionDependencies,
): GoalResult {
  if (!state || !player || !dependencies) return { score: 0 }
  const { buildableDefenseStructure, defenseTowerCount, threatCountNearBase, materialRatio, staminaRatio, nearestBase, isAdjacentToBase } = inputs

  if (!buildableDefenseStructure || !nearestBase) return { score: 0 }
  if (staminaRatio < 0.3 || materialRatio < 0.5) return { score: 0 }
  const requiredTowerCount = Math.max(1, Math.ceil(threatCountNearBase / 2))
  if (defenseTowerCount >= requiredTowerCount) return { score: 0 }

  // 據點附近威脅越多 → 建造動機越高
  // 沒有威脅時仍保留一座基礎箭塔的低強度防禦需求。
  const f_threat = threatCountNearBase === 0
    ? 0.45
    : trapezoid(threatCountNearBase, 0, 1, 3, 5)
  // 建料充足 → 加分
  const f_material = trapezoid(materialRatio, 0.5, 0.7, 1, 1)

  const score = fuzzyAnd(f_threat, f_material)
  if (score <= 0) return { score: 0 }

  const result: GoalResult = {
    score: threatCountNearBase === 0 && isAdjacentToBase ? 0.95 : score * (threatCountNearBase === 0 ? 0.55 : 0.7),
    target: { kind: 'defense-build', baseId: nearestBase.id, structureType: buildableDefenseStructure.type, position: nearestBase.position },
    distanceToTarget: inputs.feasibility.distToNearestActiveBase,
    context: { structureName: buildableDefenseStructure.name, threatCountNearBase, defenseTowerCount, requiredTowerCount },
  }

  const actions = buildValidatedActionSequence('buildDefense', result, state, player, dependencies)
  if (actions.length === 0) return { score: 0 }
  result.actions = actions
  return result
}
