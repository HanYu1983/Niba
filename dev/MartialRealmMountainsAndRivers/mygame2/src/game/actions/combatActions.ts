import type {
  ActionExecutionResult,
  AttackExecutionResult,
  AttackPreview,
  AttackTargetType,
  CreatureNestState,
  CreatureState,
  ExternalDamageExecutionResult,
  GameState,
  LearnedSkillResult,
  LootResult,
  PlayerState,
  EquipmentDurabilityChange,
  Position,
} from '../types'
import { addSkillExperience, getElementDamageMultiplier, getExternalSkill, getGenerationSynergyMultiplier, getInnerSkill, getSkillDamage, getSkillEffectMultiplier, getSkillInnerPowerCost, getSkillProgression, isElementGenerating, SKILL_EXPERIENCE_PER_USE } from '../rules/skillRules'
import { getActiveBuffsForPlayer, getBuff, getCreatureDamageReductionPercent, getCreatureEvasionRate, getCreatureRootReductionRate, getEffectiveAttributesForPlayer, getExternalSkillCritRateForPlayer, getExternalSkillDamagePercent, getExternalSkillInnerCostReduction, getInnerPowerLeechPercent, getLifestealPercent, getPlayerSkillExpGainPercent } from '../rules/playerDerivedRules'
import { getMaxHealth, getMaxInnerPower, getMaxStamina } from '../rules/playerStatsRules'
import { getAttackTarget } from '../rules/targetRules'
import { resolveTargetShapeCells } from '../rules/targetingRules'
import { reduceEquipmentDurability } from '../rules/equipmentRules'
import { ACTION_STAMINA_COSTS, canPlayerPerformAction, spendPlayerStamina } from '../rules/actionCostRules'
import { defaultRandomSource, rollChance, type RandomSource } from '../rules/randomRules'
import { getFunctionalSkillBuffOverrides } from '../rules/functionalSkillScaling'
import { getGlobalSkillExperienceMultiplier } from '../rules/globalBuffRules'
import { getFunctionalSkillBuffIds } from '../catalogs/functionalSkillRegistry'
import { bumpRunStatMax, incrementRunStat, recordDamageDealt } from '../runStats'
import { getTerrainAtPosition, getTerrainResonanceDamageMultiplier, getTerrainResonanceInnerPowerDiscount, getTerrainResonanceLabel, isTripleResonance } from '../rules/terrainCombatRules'
import { collectTriggeredDialogues, type DialogueTrigger } from '../rules/dialogueTriggerRules'
import { enqueueDialogue } from './dialogueActions'
import { progressObjectives, checkVictory } from '../rules/campaignRules'
import { executeTriggers } from '../rules/triggerRules'
import { getSchoolElement } from '../catalogs/skillProgressionCatalog'

export type CombatActionDependencies = {
  getActionablePlayer: (state: GameState, playerId: string) => PlayerState | null
  createLootForPlayer: (player: PlayerState, creatureLevel?: number) => LootResult | undefined
  getLearnableSkill: (player: PlayerState) => LearnedSkillResult | undefined
  applyExperienceAndLevelUp: (player: PlayerState, gain: number) => PlayerState
  addLootToPlayer: (player: PlayerState, loot: LootResult) => PlayerState
  random?: RandomSource
}

export const CREATURE_DEFEAT_MONEY_REWARD = 6
export const CREATURE_DEFEAT_EXPERIENCE_REWARD = 20
/** 攻擊生物造成傷害但未擊殺時，仍給予的少量經驗值。 */
export const CREATURE_HIT_EXPERIENCE_REWARD = 3
export const CREATURE_DROP_RATE = 0.2

/**
 * 統一處理目標被擊敗（血量歸零）後的狀態變動：
 * - 生物：從 state.creatures 移除
 * - 巢穴：從 state.creatureNests 移除，並在摧毀最後一座巢穴時觸發勝利
 *
 * 供普通攻擊、外功、元素爆發道具等所有傷害來源共用，確保死亡流程一致。
 */
export function applyTargetDefeat(
  state: GameState,
  targetType: AttackTargetType,
  targetId: string,
  nextHealth: number,
): GameState {
  if (nextHealth > 0) return state
  if (targetType === 'creature') {
    const defeatedCreature = state.creatures.find((creature) => creature.id === targetId)
    let nextState: GameState = incrementRunStat({
      ...state,
      creatures: state.creatures.filter((creature) => creature.id !== targetId),
    }, 'creaturesDefeated')
    // 擊殺首領時觸發 on-defeat-boss 對話與觸發器。
    if (defeatedCreature?.isBoss) {
      nextState = enqueueTriggeredDialogues(nextState, {
        type: 'on-defeat-boss',
        param: targetId,
      })
      nextState = executeTriggers(nextState, { type: 'on-defeat-boss', param: targetId })
    }
    // 物件從地圖消失（生物死亡）時觸發 on-object-destroyed 觸發器。
    nextState = executeTriggers(nextState, { type: 'on-object-destroyed', param: targetId })
    // 劇情模式下，更新 defeat-creature 目標進度並檢查勝利。
    if (nextState.campaignState) {
      nextState = progressObjectives(nextState, { type: 'defeat-creature', targetId })
      nextState = checkVictory(nextState)
      if (nextState.gameWon) {
        nextState = enqueueTriggeredDialogues(nextState, { type: 'on-victory' })
      }
    }
    return nextState
  }
  const destroyedLastNest = state.creatureNests.length === 1
  // 僅在沙盒模式（無 campaignState）預設 gameWon；劇情模式下由 checkVictory 依目標判定，
  // 否則 checkVictory 會因 gameWon 已為 true 而 early-return，導致 on-victory 觸發器（勝利對話）永不觸發。
  let nextState: GameState = incrementRunStat({
    ...state,
    gameWon: !state.campaignState && destroyedLastNest ? true : state.gameWon,
    creatureNests: state.creatureNests.filter((nest) => nest.id !== targetId),
  }, 'nestsDestroyed')
  // 物件從地圖消失（巢穴被摧毀）時觸發 on-object-destroyed 觸發器。
  nextState = executeTriggers(nextState, { type: 'on-object-destroyed', param: targetId })
  // 劇情模式下，更新 destroy-nest 目標進度並檢查勝利。
  if (nextState.campaignState) {
    nextState = progressObjectives(nextState, { type: 'destroy-nest', targetId })
    nextState = checkVictory(nextState)
    if (nextState.gameWon) {
      nextState = enqueueTriggeredDialogues(nextState, { type: 'on-victory' })
    }
  } else if (destroyedLastNest) {
    // 沙盒模式：摧毀最後一座巢穴觸發勝利 → on-victory 對話。
    nextState = enqueueTriggeredDialogues(nextState, { type: 'on-victory' })
  }
  return nextState
}

/**
 * 收集並推入符合觸發事件的對話步驟（若處於劇情模式）。
 * 沙盒模式（無 campaignState）下 collectTriggeredDialogues 會回傳空清單，不污染狀態。
 */
function enqueueTriggeredDialogues(state: GameState, trigger: DialogueTrigger): GameState {
  const steps = collectTriggeredDialogues(state, trigger)
  return enqueueDialogue(state, steps)
}

// 功能型外功效果 → Buff 對應統一由 functionalSkillRegistry 提供（見 FUNCTIONAL_BUFF 用法）。
function getFunctionalBuffIds(effect: string | undefined): string[] {
  return getFunctionalSkillBuffIds(effect as never)
}

function getDurabilityChanges(
  before: PlayerState,
  after: PlayerState,
  changes: Array<{ slot: 'weapon' | 'armor' | 'accessory'; amount: number }>,
): EquipmentDurabilityChange[] {
  const beforeInventory = new Map((before.equipmentInventory ?? []).map((item) => [item.instanceId, item]))
  const afterInventory = new Map((after.equipmentInventory ?? []).map((item) => [item.instanceId, item]))
  const loadout = after.equipmentLoadout ?? before.equipmentLoadout
  return changes.flatMap(({ slot }) => {
    const instanceId = loadout?.[`${slot}InstanceId`]
    if (!instanceId) return []
    const beforeItem = beforeInventory.get(instanceId)
    const afterItem = afterInventory.get(instanceId)
    if (!beforeItem || !afterItem || beforeItem.durability === afterItem.durability) return []
    return [{
      slot,
        equipmentName: slot === 'weapon' ? '武器' : slot === 'armor' ? '防具' : '配件',
      before: beforeItem.durability,
      after: afterItem.durability,
      amount: beforeItem.durability - afterItem.durability,
    }]
  })
}

export function getCreatureDefeatRewards(creature: { level?: number }): { experience: number; money: number } {
  const level = Math.max(1, creature.level ?? 1)
  return {
    experience: CREATURE_DEFEAT_EXPERIENCE_REWARD * level,
    money: CREATURE_DEFEAT_MONEY_REWARD * level,
  }
}

export type CreatureDefeatRewardResult = {
  loot?: LootResult
  experienceGain: number
  moneyReward: number
  progressedPlayer: PlayerState
}

/**
 * 統一處理擊殺生物（血量歸零）後的獎勵結算：
 * - 經驗值：依生物等級計算（與普通攻擊/外功一致）
 * - 金錢：依生物等級計算
 * - 掉落：依掉落率隨機產生
 *
 * 供普通攻擊、外功、元素爆發道具等所有傷害來源共用，確保擊殺流程一致。
 */
export function resolveCreatureDefeatRewards(
  player: PlayerState,
  creature: { level?: number },
  defeated: boolean,
  dependencies: CombatActionDependencies,
  random: RandomSource,
): CreatureDefeatRewardResult {
  const creatureLevel = creature.level
  const loot = defeated && rollChance(CREATURE_DROP_RATE, random)
    ? dependencies.createLootForPlayer(player, creatureLevel)
    : undefined
  // 擊殺生物獲得完整獎勵；攻擊生物造成傷害但未擊殺時，仍獲得少量經驗值。
  const rewards = defeated
    ? getCreatureDefeatRewards(creature)
    : { experience: CREATURE_HIT_EXPERIENCE_REWARD, money: 0 }

  return {
    loot,
    experienceGain: rewards.experience,
    moneyReward: rewards.money,
    progressedPlayer: dependencies.applyExperienceAndLevelUp(player, rewards.experience),
  }
}

type CombatRewards = {
  loot?: LootResult
  learnedSkill?: LearnedSkillResult
  experienceGain: number
  moneyReward: number
  progressedPlayer: PlayerState
}

function resolveCombatRewards(
  target: { player: PlayerState; target: unknown },
  targetType: AttackTargetType,
  nextHealth: number,
  dependencies: CombatActionDependencies,
  random: RandomSource,
): CombatRewards {
  const defeated = nextHealth === 0
  const learnedSkill = targetType === 'nest' && defeated
    ? dependencies.getLearnableSkill(target.player)
    : undefined
  // 生物：統一使用 resolveCreatureDefeatRewards 結算經驗/金錢/掉落。
  // 巢穴：不提供經驗/金錢/掉落。
  const creatureRewards = targetType === 'creature'
    ? resolveCreatureDefeatRewards(target.player, target.target as { level?: number }, defeated, dependencies, random)
    : { loot: undefined, experienceGain: 0, moneyReward: 0, progressedPlayer: target.player }

  return {
    loot: creatureRewards.loot,
    learnedSkill,
    experienceGain: creatureRewards.experienceGain,
    moneyReward: creatureRewards.moneyReward,
    progressedPlayer: creatureRewards.progressedPlayer,
  }
}

function applyCombatPlayerState(
  state: GameState,
  player: PlayerState,
  rewards: CombatRewards,
  dependencies: CombatActionDependencies,
  options: { staminaCost?: number; innerPowerCost?: number; externalSkillId?: string; innerSkillId?: string; skipSkillExperience?: boolean },
): PlayerState {
  const withDurability = reduceEquipmentDurability(
    reduceEquipmentDurability(player, 'weapon', 1),
    'accessory',
    0.5,
  )
  const withLoot = rewards.loot ? dependencies.addLootToPlayer(withDurability, rewards.loot) : withDurability
  const withStamina = options.staminaCost === undefined
    ? withLoot
    : spendPlayerStamina(withLoot, options.staminaCost)
  const withSkill = rewards.learnedSkill
    ? rewards.learnedSkill.type === 'inner'
      ? { ...withStamina, innerSkillIds: [...withStamina.innerSkillIds, rewards.learnedSkill.skill.id] }
      : { ...withStamina, externalSkillIds: [...withStamina.externalSkillIds, rewards.learnedSkill.skill.id] }
    : withStamina
  const skillExperience = Math.round(SKILL_EXPERIENCE_PER_USE * getGlobalSkillExperienceMultiplier(state) * (1 + getPlayerSkillExpGainPercent(player)))
  const withSkillExperience = options.skipSkillExperience
    ? withSkill
    : options.externalSkillId
    ? addSkillExperience(withSkill, options.externalSkillId, skillExperience)
    : options.innerSkillId
      ? addSkillExperience(withSkill, options.innerSkillId, skillExperience)
      : withSkill

  return {
    ...withSkillExperience,
    level: rewards.progressedPlayer.level,
    availableAttributePoints: rewards.progressedPlayer.availableAttributePoints,
    experience: rewards.progressedPlayer.experience,
    health: rewards.progressedPlayer.health,
    innerPower: rewards.progressedPlayer.innerPower,
    money: withSkillExperience.money + rewards.moneyReward,
    // 本次外功消耗一律扣除（升級不再回滿內力，故無升級豁免）。
    ...(options.innerPowerCost === undefined
      ? {}
      : { innerPower: rewards.progressedPlayer.innerPower - options.innerPowerCost }),
    ...(options.externalSkillId === undefined ? {} : {
      externalSkillsUsedThisTurn: [...(withSkill.externalSkillsUsedThisTurn ?? []), options.externalSkillId],
    }),
  }
}

type CombatHitOptions = {
  staminaCost?: number
  innerPowerCost?: number
  externalSkillId?: string
  innerSkillId?: string
  skipSkillExperience?: boolean
}

/**
 * 統一處理「對目標造成傷害」後的狀態變動，供普通攻擊與外功共用：
 * - 攻擊者：套用 applyCombatPlayerState（耐久、體力/內力消耗、功法經驗、獎勵），並依嗜血/汲元回復血量/內力
 * - 目標：更新生物/巢穴血量（外功可傳入已套用功能 Buff 與衍生上限的 resolvedTarget）
 * - 擊殺：統一呼叫 applyTargetDefeat
 */
function applyCombatHitState(
  state: GameState,
  attacker: PlayerState,
  targetId: string,
  targetType: AttackTargetType,
  resolvedTarget: CreatureState | CreatureNestState,
  nextHealth: number,
  damage: number,
  rewards: CombatRewards,
  dependencies: CombatActionDependencies,
  options: CombatHitOptions,
): GameState {
  const attackerEffective = getEffectiveAttributesForPlayer(attacker)
  const attackerMaxHealth = getMaxHealth(attackerEffective)
  const attackerMaxInnerPower = getMaxInnerPower(attackerEffective)
  const lifestealHeal = damage * getLifestealPercent(attacker)
  const innerPowerLeech = damage * getInnerPowerLeechPercent(attacker)
  // 生物反震：被攻擊的生物若有反震 Buff（厚土流），將實際傷害的一定比例反彈回攻擊者。
  const reflectedDamage = targetType === 'creature'
    ? getActiveBuffsForPlayer(resolvedTarget as CreatureState).reduce(
        (total, buff) => total + (getBuff(buff.definitionId)?.reflectionPercent ?? 0),
        0,
      ) * damage
    : 0

  const nextState: GameState = {
    ...state,
    creatures: targetType === 'creature'
      ? state.creatures.map((creature) => creature.id === targetId ? { ...resolvedTarget as typeof creature } : creature)
      : state.creatures,
    creatureNests: targetType === 'nest'
      ? state.creatureNests.map((nest) => nest.id === targetId ? { ...nest, health: nextHealth } : nest)
      : state.creatureNests,
    players: state.players.map((currentPlayer) => currentPlayer.id === attacker.id
      ? (() => {
        const appliedPlayer = applyCombatPlayerState(state, attacker, rewards, dependencies, options)
        return {
          ...appliedPlayer,
          // 反震傷害回彈到攻擊者（最小為 0），採「先回復後扣反震」。
          health: Math.max(0, Math.min(attackerMaxHealth, appliedPlayer.health + lifestealHeal) - reflectedDamage),
          innerPower: Math.min(attackerMaxInnerPower, appliedPlayer.innerPower + innerPowerLeech),
        }
      })()
      : currentPlayer),
  }
  // 記錄人類玩家造成的單次傷害峰值（普通攻擊 / 外功）。
  const withDamagePeak = options.externalSkillId
    ? bumpRunStatMax(nextState, 'maxExternalSkillDamage', damage)
    : bumpRunStatMax(nextState, 'maxNormalAttackDamage', damage)
  // 累加本回合傷害並刷新「單回合最高傷害」峰值（僅人類玩家）。
  return applyTargetDefeat(
    (attacker.isAI ? withDamagePeak : recordDamageDealt(withDamagePeak, damage)),
    targetType,
    targetId,
    nextHealth,
  )
}

export function executeExternalDamage(
  state: GameState,
  playerId: string,
  targetType: AttackTargetType,
  targetId: string,
  skillId: string,
  dependencies: CombatActionDependencies,
  internal?: { areaPass?: boolean },
): { state: GameState; result: ActionExecutionResult<ExternalDamageExecutionResult> } {
  const skill = getExternalSkill(skillId)
  const player = state.players.find((candidate) => candidate.id === playerId)
  const playerSkillLevel = getSkillProgression(player ?? ({ skillProgression: {} } as PlayerState), skillId).level
  const baseInnerPowerCost = getSkillInnerPowerCost(skill.innerPowerCost, playerSkillLevel)
  const playerTerrain = player ? getTerrainAtPosition(state.map.cells, player.position) : undefined
  const innerPowerCost = Math.max(1, baseInnerPowerCost - getTerrainResonanceInnerPowerDiscount(skill.element, playerTerrain) - (player ? getExternalSkillInnerCostReduction(player) : 0))
  const actionCheck = canPlayerPerformAction(state, playerId, ACTION_STAMINA_COSTS.externalSkill)
  if (!actionCheck.ok) return { state, result: { ok: false, reason: actionCheck.reason ?? '目前無法行動。' } }
  if (skill.target === 'self') {
    const player = dependencies.getActionablePlayer(state, playerId)
    if (!player || !player.externalSkillIds.includes(skillId) || player.innerPower < innerPowerCost || player.externalSkillsUsedThisTurn?.includes(skillId)) {
      return { state, result: { ok: false, reason: '自身不存在、外功未學會、內力不足，或此外功本回合已使用。' } }
    }
    const functionalBuffIds = getFunctionalBuffIds(skill.functionalEffect)
    const terrainResonanceBuffIds = skill.element === 'wood' && playerTerrain === 'forest'
      ? ['terrain-resonance-swift-evasion']
      : skill.element === 'earth' && playerTerrain === 'plain' && skill.functionalEffect === 'reflection'
        ? ['terrain-resonance-earth-reflection']
        : []
    const withBuff = [...functionalBuffIds, ...terrainResonanceBuffIds].reduce((currentPlayer, functionalBuffId) => {
      const definition = getBuff(functionalBuffId)
      if (!definition) return currentPlayer
      const overrides = getFunctionalSkillBuffOverrides(skill.functionalEffect, playerSkillLevel, definition)
      return { ...currentPlayer, buffs: [...(currentPlayer.buffs ?? []).filter((buff) => buff.definitionId !== functionalBuffId), { id: `skill:${skillId}:${player.id}:${functionalBuffId}`, definitionId: functionalBuffId, sourceId: skillId, remainingRounds: overrides.remainingRounds ?? (definition.duration === 'rounds' ? definition.durationRounds ?? null : null), ...overrides }] }
    }, player)
    // 定向強化型外功：直接施放、立即完成（無冷卻、不消耗體力）。目前支援回復自身最大生命百分比。
    const activatedPlayer = skill.activationEffect?.kind === 'heal-self-percent'
      ? { ...withBuff, health: Math.min(withBuff.maxHealth, withBuff.health + withBuff.maxHealth * skill.activationEffect.percent) }
      : withBuff
    const rewards: CombatRewards = { experienceGain: 0, moneyReward: 0, progressedPlayer: activatedPlayer }
    const nextPlayer = applyCombatPlayerState(state, activatedPlayer, rewards, dependencies, { innerPowerCost, externalSkillId: skillId, skipSkillExperience: true })
    return { state: { ...state, players: state.players.map((candidate) => candidate.id === playerId ? nextPlayer : candidate) }, result: { ok: true, data: { playerId, playerName: player.name, targetType: 'creature', targetId: playerId, targetName: player.name, skillId, skillName: skill.name, damage: 0, nextHealth: player.health, maxHealth: player.maxHealth, innerPowerCost, targetMode: 'self', defeated: false, experienceReward: rewards.experienceGain || undefined } } }
  }
  // 範圍攻擊（selectionMode = all）：對形狀範圍內的所有合法目標逐一結算傷害。
  if (skill.selectionMode?.kind === 'all' && !internal?.areaPass) {
    return executeAreaExternalDamage(state, playerId, targetType, targetId, skillId, dependencies)
  }
  const target = getAttackTarget(state, dependencies.getActionablePlayer(state, playerId), targetType, targetId, skill.shape ?? { kind: 'radius', range: skill.range ?? 1 })
  const targetSkillLevel = target ? getSkillProgression(target.player, skillId).level : 1
  const targetBaseInnerPowerCost = getSkillInnerPowerCost(skill.innerPowerCost, targetSkillLevel)
  const targetTerrain = target ? getTerrainAtPosition(state.map.cells, target.player.position) : undefined
  const targetInnerPowerCost = Math.max(1, targetBaseInnerPowerCost - getTerrainResonanceInnerPowerDiscount(skill.element, targetTerrain) - (target ? getExternalSkillInnerCostReduction(target.player) : 0))
  if (!target || !target.player.equippedExternalSkillIds.includes(skillId) || target.player.innerPower < targetInnerPowerCost || (targetType === 'nest' && Boolean(skill.functionalEffect))) {
    return { state, result: { ok: false, reason: '目標不存在、外功未裝備，或內力不足。' } }
  }
  if (target.player.externalSkillsUsedThisTurn?.includes(skillId)) {
    return { state, result: { ok: false, reason: '此外功本回合已使用。' } }
  }

  const skillLevel = getSkillProgression(target.player, skillId).level
  const creatureTargetTerrain = targetType === 'creature'
    ? getTerrainAtPosition(state.map.cells, target.target.position)
    : undefined
  const targetDamageReduction = targetType === 'creature'
    ? getCreatureDamageReductionPercent(target.target as CreatureState, creatureTargetTerrain)
    : 0
  const resonanceMultiplier = getTerrainResonanceDamageMultiplier(skill.element, targetTerrain)
  const elementMultiplier = getElementDamageMultiplier(skill.element, getSchoolElement(target.target.schoolId))
  const innerElement = getInnerSkill(target.player.innerSkillId).element
  const synergy = !skill.functionalEffect && isElementGenerating(innerElement, skill.element)
  // 三重共振：連攜＋天地共鳴＋五行相剋（僅限傷害型外功、對象為生物）。需在暴擊之前套用乘算。
  const synergyMultiplier = getGenerationSynergyMultiplier(innerElement, skill.element)
  const tripleResonance = targetType === 'creature' && !skill.functionalEffect && isTripleResonance({
    innerElement,
    outerElement: skill.element,
    terrain: targetTerrain,
    targetSchoolId: target.target.schoolId,
  })
  const baseDamage = skill.functionalEffect ? 0 : Math.max(1, Math.floor(getSkillDamage(getEffectiveAttributesForPlayer(target.player), skill, skillLevel) * getSkillEffectMultiplier(target.player) * elementMultiplier * resonanceMultiplier * synergyMultiplier))
  // 罡氣訣：外功造成的最終傷害 +%
  const damageBeforeTargetReduction = Math.max(1, Math.floor(baseDamage * (1 + getExternalSkillDamagePercent(target.player))))
  const damageBeforeCrit = targetDamageReduction > 0
    ? Math.max(1, Math.floor(damageBeforeTargetReduction * (1 - targetDamageReduction)))
    : damageBeforeTargetReduction
  // 傷害型外功可暴擊：暴擊率 = 內息 × 2，暴擊造成 1.5 倍傷害。
  const random = dependencies.random ?? defaultRandomSource
  const criticalRate = skill.functionalEffect ? 0 : getExternalSkillCritRateForPlayer(target.player)
  const criticalHit = criticalRate > 0 && rollChance(criticalRate / 100, random)
  let damage = criticalHit ? Math.floor(damageBeforeCrit * 1.5) : damageBeforeCrit
  // 對稱防禦：生物作為被攻擊方時套用回避／根骨減傷（與玩家被生物攻擊時一致）。
  let targetDefense: 'evaded' | 'reduced' | undefined
  if (targetType === 'creature') {
    const creature = target.target as CreatureState
    const avoided = rollChance(Math.min(1, getCreatureEvasionRate(creature, creatureTargetTerrain) / 100), random)
    const halved = !avoided && rollChance(Math.min(1, getCreatureRootReductionRate(creature, creatureTargetTerrain) / 100), random)
    targetDefense = avoided ? 'evaded' : halved ? 'reduced' : undefined
    damage = avoided ? 0 : halved ? Math.max(1, Math.floor(damage / 2)) : damage
  }
  const nextHealth = Math.max(0, target.target.health - damage)
  const rewards = resolveCombatRewards(target, targetType, nextHealth, dependencies, random)
  const { experienceGain, moneyReward, loot, learnedSkill, progressedPlayer } = rewards
  const playerWithAccessoryWear = reduceEquipmentDurability(
    reduceEquipmentDurability(target.player, 'weapon', 1),
    'accessory',
    0.5,
  )
  const equipmentDurabilityChanges = getDurabilityChanges(target.player, playerWithAccessoryWear, [
    { slot: 'weapon', amount: 1 },
    { slot: 'accessory', amount: 0.5 },
  ])
  const functionalBuffIds = skill.functionalEffect ? getFunctionalBuffIds(skill.functionalEffect) : []
  const terrainResonanceTargetBuffId = targetType === 'creature'
    ? skill.functionalEffect === 'burning' && targetTerrain === 'desert'
      ? 'terrain-resonance-burning'
      : skill.functionalEffect === 'attribute-reduction' && targetTerrain === 'water'
        ? 'terrain-resonance-cold-poison'
        : undefined
    : undefined
  const effectiveFunctionalBuffIds = terrainResonanceTargetBuffId
    ? functionalBuffIds.map((buffId) => buffId === 'scarlet-flame-burning' || buffId === 'frost-water-cold-poison' ? terrainResonanceTargetBuffId : buffId)
    : functionalBuffIds
  const functionalBuffs = effectiveFunctionalBuffIds
    .map((buffId) => getBuff(buffId))
    .filter((buff): buff is NonNullable<typeof buff> => Boolean(buff))
  const appliedBuffs = (functionalBuffs.length > 0 || tripleResonance) && targetType === 'creature'
    ? [
      ...functionalBuffs.map((buff) => ({
        ...(() => {
          const overrides = getFunctionalSkillBuffOverrides(skill.functionalEffect, skillLevel, buff)
          return { description: `${buff.description}${overrides.maxHealthDamagePercent !== undefined ? `（目前 ${Math.round(overrides.maxHealthDamagePercent * 100)}%）` : ''}` }
        })(),
        name: buff.name,
        remainingRounds: getFunctionalSkillBuffOverrides(skill.functionalEffect, skillLevel, buff).remainingRounds ?? (buff.duration === 'rounds' ? buff.durationRounds ?? null : null),
      })),
      ...(tripleResonance ? [{ name: '震懾', description: '三重共振衝擊，目標下一個回合完全無法行動。', remainingRounds: 1 }] : []),
    ]
    : undefined
  const result: ExternalDamageExecutionResult = {
    playerId: target.player.id,
    playerName: target.player.name,
    targetType,
    targetId: target.target.id,
    targetName: target.target.name,
    targetPosition: target.target.position,
    skillId,
    skillName: skill.name,
    damage,
    nextHealth,
    maxHealth: target.target.maxHealth,
    innerPowerCost: targetInnerPowerCost,
    criticalRate: criticalRate > 0 ? criticalRate : undefined,
    criticalHit: criticalHit || undefined,
    targetDefense,
    synergy: synergy || undefined,
    tripleResonance: tripleResonance || undefined,
    targetMode: skill.target,
    defeated: nextHealth === 0,
    moneyReward: moneyReward || undefined,
    experienceReward: experienceGain || undefined,
    loot,
    learnedSkill,
    levelsGained: (progressedPlayer.level ?? 1) - (target.player.level ?? 1),
    newLevel: progressedPlayer.level,
    attributePointsGained: (progressedPlayer.availableAttributePoints ?? 0) - (target.player.availableAttributePoints ?? 0),
    equipmentDurabilityChanges,
    appliedBuffs,
    terrainResonance: getTerrainResonanceLabel(skill.element, targetTerrain),
  }

  // 三重共振時，對目標施加震懾（stunned）Buff：完全跳過下一個回合。
  const stunnedDefinition = getBuff('triple-resonance-stun')
  const allAppliedBuffDefinitions = tripleResonance && stunnedDefinition
    ? [...functionalBuffs, stunnedDefinition]
    : functionalBuffs
  const targetWithFunctionalBuff = allAppliedBuffDefinitions.length > 0 && targetType === 'creature'
    ? allAppliedBuffDefinitions.reduce((currentTarget, buff) => {
      const overrides = getFunctionalSkillBuffOverrides(skill.functionalEffect, skillLevel, buff)
      return {
        ...currentTarget,
        buffs: [...((currentTarget as PlayerState).buffs ?? []).filter((existing) => existing.definitionId !== buff.id), { id: `skill:${skillId}:${target.target.id}:${buff.id}`, definitionId: buff.id, sourceId: skillId, remainingRounds: overrides.remainingRounds ?? (buff.duration === 'rounds' ? buff.durationRounds ?? null : null), ...overrides }],
      }
    }, target.target)
    : target.target
  const targetWithDerivedValues = targetType === 'creature'
    ? (() => {
      const playerTarget = targetWithFunctionalBuff as PlayerState
      const effectiveAttributes = getEffectiveAttributesForPlayer(playerTarget)
      const maxHealth = getMaxHealth(effectiveAttributes)
      const maxStamina = getMaxStamina(effectiveAttributes)
      const maxInnerPower = getMaxInnerPower(effectiveAttributes)
      return { ...playerTarget, maxHealth, maxStamina, maxInnerPower, health: Math.min(nextHealth, maxHealth), stamina: Math.min(playerTarget.stamina, maxStamina), innerPower: Math.min(playerTarget.innerPower, maxInnerPower) }
    })()
    : targetWithFunctionalBuff

  const nextState = applyCombatHitState(
    state,
    target.player,
    target.target.id,
    targetType,
    targetWithDerivedValues,
    nextHealth,
    damage,
    rewards,
    dependencies,
    { innerPowerCost: targetInnerPowerCost, externalSkillId: skillId },
  )
  return { state: nextState, result: { ok: true, data: result } }
}

/**
 * 範圍攻擊（selectionMode = all）：對形狀範圍內的所有合法目標逐一施放單體外功。
 * 以玩家為中心，依 skill.shape 計算範圍，將範圍內所有存活生物與巢穴作為目標。
 */
function executeAreaExternalDamage(
  state: GameState,
  playerId: string,
  _targetType: AttackTargetType,
  _targetId: string,
  skillId: string,
  dependencies: CombatActionDependencies,
): { state: GameState; result: ActionExecutionResult<ExternalDamageExecutionResult> } {
  const skill = getExternalSkill(skillId)
  const player = dependencies.getActionablePlayer(state, playerId)
  if (!player) return { state, result: { ok: false, reason: '自身不存在或無法行動。' } }

  const shape = skill.shape ?? { kind: 'radius', range: skill.range ?? 1 }
  const shapeCells = resolveTargetShapeCells(shape, player.position, state.map)
  const inRangeTargets: Array<{ type: AttackTargetType; id: string; position: Position }> = []
  for (const creature of state.creatures) {
    if (creature.health > 0 && shapeCells.has(`${creature.position.row}-${creature.position.column}`)) {
      inRangeTargets.push({ type: 'creature', id: creature.id, position: creature.position })
    }
  }
  for (const nest of state.creatureNests) {
    if (nest.health > 0 && shapeCells.has(`${nest.position.row}-${nest.position.column}`)) {
      inRangeTargets.push({ type: 'nest', id: nest.id, position: nest.position })
    }
  }
  if (inRangeTargets.length === 0) {
    return { state, result: { ok: false, reason: '範圍內沒有可攻擊的目標。' } }
  }

  // 依序對每個目標施加單體外功，逐步累加狀態；範圍攻擊共享一次內力消耗。
  let currentState = state
  const areaTargets: NonNullable<ExternalDamageExecutionResult['areaTargets']> = []
  let primaryResult: ExternalDamageExecutionResult | null = null
  for (let idx = 0; idx < inRangeTargets.length; idx += 1) {
    const t = inRangeTargets[idx]
    // 範圍攻擊多目標共享一次施放：
    // - 首個目標後清除「本回合已使用」標記，避免單體路徑視為已使用而拒絕。
    // - 首個目標後還原內力消耗，最終僅在首個目標支付一次內力。
    const passState = idx === 0
      ? currentState
      : {
          ...currentState,
          players: currentState.players.map((p) => p.id === playerId
            ? {
                ...p,
                externalSkillsUsedThisTurn: (p.externalSkillsUsedThisTurn ?? []).filter((used) => used !== skillId),
                innerPower: p.innerPower + (primaryResult?.innerPowerCost ?? 0),
              }
            : p),
        }
    const single = executeExternalDamage(passState, playerId, t.type, t.id, skillId, dependencies, { areaPass: true })
    currentState = single.state
    if (!single.result.ok) {
      if (!primaryResult && !areaTargets.length) return { state: currentState, result: single.result }
      continue
    }
    const data = single.result.data
    if (!primaryResult) {
      primaryResult = { ...data, areaTargets: [] }
    }
    areaTargets.push({
      targetType: data.targetType,
      targetId: data.targetId,
      targetName: data.targetName,
      targetPosition: data.targetPosition,
      damage: data.damage,
      nextHealth: data.nextHealth,
      maxHealth: data.maxHealth,
      defeated: data.defeated,
      targetDefense: data.targetDefense,
    })
  }
  if (!primaryResult) return { state: currentState, result: { ok: false, reason: '範圍攻擊未命中任何目標。' } }
  primaryResult.areaTargets = areaTargets
  return { state: currentState, result: { ok: true, data: primaryResult } }
}

export function executeAttack(
  state: GameState,
  preview: AttackPreview | null,
  dependencies: CombatActionDependencies,
): { state: GameState; result: ActionExecutionResult<AttackExecutionResult> } {
  if (!preview) return { state, result: { ok: false, reason: '沒有待確認的攻擊預覽。' } }
  const actionCheck = canPlayerPerformAction(state, preview.playerId, ACTION_STAMINA_COSTS.attack)
  if (!actionCheck.ok) return { state, result: { ok: false, reason: actionCheck.reason ?? '目前無法行動。' } }
  const target = getAttackTarget(state, dependencies.getActionablePlayer(state, preview.playerId), preview.targetType, preview.targetId)
  if (!target) return { state: { ...state, attackPreview: null, operation: { type: 'idle' } }, result: { ok: false, reason: '攻擊目標已不存在或無法攻擊。' } }

  const random = dependencies.random ?? defaultRandomSource
  const criticalHit = rollChance(preview.criticalRate / 100, random)
  let damage = criticalHit ? Math.floor(preview.expectedDamage * 1.5) : preview.expectedDamage
  // 對稱防禦：生物作為被攻擊方時套用回避／根骨減傷／減傷比例（與玩家被生物攻擊時一致）。
  let targetDefense: 'evaded' | 'reduced' | undefined
  if (preview.targetType === 'creature') {
    const creature = target.target as CreatureState
    const creatureTerrain = getTerrainAtPosition(state.map.cells, creature.position)
    const avoided = rollChance(Math.min(1, getCreatureEvasionRate(creature, creatureTerrain) / 100), random)
    const halved = !avoided && rollChance(Math.min(1, getCreatureRootReductionRate(creature, creatureTerrain) / 100), random)
    const reduction = getCreatureDamageReductionPercent(creature, creatureTerrain)
    targetDefense = avoided ? 'evaded' : halved ? 'reduced' : undefined
    damage = avoided
      ? 0
      : halved
        ? Math.max(1, Math.floor(damage / 2))
        : reduction > 0
          ? Math.max(1, Math.floor(damage * (1 - reduction)))
          : damage
  }
  const nextHealth = Math.max(0, target.target.health - damage)
  const rewards = resolveCombatRewards(target, preview.targetType, nextHealth, dependencies, random)
  const { experienceGain, moneyReward, loot, learnedSkill, progressedPlayer } = rewards
  const playerAfterDurability = reduceEquipmentDurability(
    reduceEquipmentDurability(target.player, 'weapon', 1),
    'accessory',
    0.5,
  )
  const result: AttackExecutionResult = {
    playerId: target.player.id, playerName: target.player.name, targetType: preview.targetType, targetId: target.target.id, targetName: target.target.name,
    damage, nextHealth, maxHealth: target.target.maxHealth, criticalRate: preview.criticalRate, criticalHit, terrainResonance: preview.terrainResonance, targetDefense, defeated: nextHealth === 0, experienceReward: experienceGain || undefined, moneyReward: moneyReward || undefined, loot, learnedSkill,
    levelsGained: (progressedPlayer.level ?? 1) - (target.player.level ?? 1), newLevel: progressedPlayer.level,
    attributePointsGained: (progressedPlayer.availableAttributePoints ?? 0) - (target.player.availableAttributePoints ?? 0),
    equipmentDurabilityChanges: getDurabilityChanges(target.player, playerAfterDurability, [
      { slot: 'weapon', amount: 1 },
      { slot: 'accessory', amount: 0.5 },
    ]),
  }
  const nextState: GameState = {
    ...applyCombatHitState(
      state,
      target.player,
      target.target.id,
      preview.targetType,
      { ...target.target, health: nextHealth },
      nextHealth,
      damage,
      rewards,
      dependencies,
      { staminaCost: ACTION_STAMINA_COSTS.attack, innerSkillId: target.player.innerSkillId },
    ),
    attackPreview: null,
    operation: { type: 'idle' },
  }
  return { state: nextState, result: { ok: true, data: result } }
}
