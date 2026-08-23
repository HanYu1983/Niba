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
} from '../types'
import { addSkillExperience, getElementDamageMultiplier, getExternalSkill, getSchoolElement, getSkillDamage, getSkillEffectMultiplier, getSkillInnerPowerCost, getSkillProgression, SKILL_EXPERIENCE_PER_USE } from '../rules/skillRules'
import { getBuff, getCreatureDamageReductionPercent, getEffectiveAttributesForPlayer, getExternalSkillDamagePercent, getInnerPowerLeechPercent, getLifestealPercent } from '../rules/playerDerivedRules'
import { getMaxHealth, getMaxInnerPower, getMaxStamina } from '../rules/playerStatsRules'
import { getAttackTarget } from '../rules/targetRules'
import { reduceEquipmentDurability } from '../rules/equipmentRules'
import { ACTION_STAMINA_COSTS, canPlayerPerformAction, spendPlayerStamina } from '../rules/actionCostRules'
import { defaultRandomSource, rollChance, type RandomSource } from '../rules/randomRules'
import { getFunctionalSkillBuffOverrides } from '../rules/functionalSkillScaling'
import { getGlobalSkillExperienceMultiplier } from '../rules/globalBuffRules'
import { getFunctionalSkillBuffIds } from '../catalogs/functionalSkillRegistry'
import { bumpRunStatMax, incrementRunStat } from '../runStats'
import { getTerrainAtPosition, getTerrainResonanceDamageMultiplier, getTerrainResonanceInnerPowerDiscount, getTerrainResonanceLabel } from '../rules/terrainCombatRules'
import { collectTriggeredDialogues, type DialogueTrigger } from '../rules/dialogueTriggerRules'
import { enqueueDialogue } from './dialogueActions'
import { progressObjectives, checkVictory } from '../rules/campaignRules'
import { executeTriggers } from '../rules/triggerRules'

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
  let nextState: GameState = incrementRunStat({
    ...state,
    gameWon: destroyedLastNest ? true : state.gameWon,
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
  const skillExperience = Math.round(SKILL_EXPERIENCE_PER_USE * getGlobalSkillExperienceMultiplier(state))
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
  const lifestealHeal = Math.floor(damage * getLifestealPercent(attacker))
  const innerPowerLeech = Math.floor(damage * getInnerPowerLeechPercent(attacker))

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
          health: Math.min(attackerMaxHealth, appliedPlayer.health + lifestealHeal),
          innerPower: Math.min(attackerMaxInnerPower, appliedPlayer.innerPower + innerPowerLeech),
        }
      })()
      : currentPlayer),
  }
  // 記錄人類玩家造成的單次傷害峰值（普通攻擊 / 外功）。
  const withDamagePeak = options.externalSkillId
    ? bumpRunStatMax(nextState, 'maxExternalSkillDamage', damage)
    : bumpRunStatMax(nextState, 'maxNormalAttackDamage', damage)
  return applyTargetDefeat(withDamagePeak, targetType, targetId, nextHealth)
}

export function executeExternalDamage(
  state: GameState,
  playerId: string,
  targetType: AttackTargetType,
  targetId: string,
  skillId: string,
  dependencies: CombatActionDependencies,
): { state: GameState; result: ActionExecutionResult<ExternalDamageExecutionResult> } {
  const skill = getExternalSkill(skillId)
  const player = state.players.find((candidate) => candidate.id === playerId)
  const playerSkillLevel = getSkillProgression(player ?? ({ skillProgression: {} } as PlayerState), skillId).level
  const baseInnerPowerCost = getSkillInnerPowerCost(skill.innerPowerCost, playerSkillLevel)
  const playerTerrain = player ? getTerrainAtPosition(state.map.cells, player.position) : undefined
  const innerPowerCost = Math.max(1, baseInnerPowerCost - getTerrainResonanceInnerPowerDiscount(skill.element, playerTerrain))
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
    const instantPlayer = skill.functionalEffect === 'cleanse'
      ? { ...withBuff, buffs: (withBuff.buffs ?? []).filter((buff) => getBuff(buff.definitionId)?.category !== 'debuff') }
      : skill.functionalEffect === 'recover'
        ? (() => {
          const attrs = getEffectiveAttributesForPlayer(withBuff)
          const maxStamina = getMaxStamina(attrs)
          const maxInnerPower = getMaxInnerPower(attrs)
          return {
            ...withBuff,
            stamina: Math.min(maxStamina, withBuff.stamina + Math.floor(maxStamina * 0.3)),
            innerPower: Math.min(maxInnerPower, withBuff.innerPower + Math.floor(maxInnerPower * 0.3)),
          }
        })()
        : withBuff
    const trainedPlayer = skill.functionalEffect === 'experience-gain'
      ? [player.innerSkillId, ...player.equippedExternalSkillIds].reduce(
        (currentPlayer, equippedSkillId) => addSkillExperience(currentPlayer, equippedSkillId, 10),
        instantPlayer,
      )
      : instantPlayer
    const rewards: CombatRewards = { experienceGain: 0, moneyReward: 0, progressedPlayer: trainedPlayer }
    const nextPlayer = applyCombatPlayerState(state, trainedPlayer, rewards, dependencies, { innerPowerCost, externalSkillId: skillId, skipSkillExperience: true })
    return { state: { ...state, players: state.players.map((candidate) => candidate.id === playerId ? nextPlayer : candidate) }, result: { ok: true, data: { playerId, playerName: player.name, targetType: 'creature', targetId: playerId, targetName: player.name, skillId, skillName: skill.name, damage: 0, nextHealth: player.health, maxHealth: player.maxHealth, innerPowerCost, targetMode: 'self', defeated: false, experienceReward: rewards.experienceGain || undefined } } }
  }
  const target = getAttackTarget(state, dependencies.getActionablePlayer(state, playerId), targetType, targetId)
  const targetSkillLevel = target ? getSkillProgression(target.player, skillId).level : 1
  const targetBaseInnerPowerCost = getSkillInnerPowerCost(skill.innerPowerCost, targetSkillLevel)
  const targetTerrain = target ? getTerrainAtPosition(state.map.cells, target.player.position) : undefined
  const targetInnerPowerCost = Math.max(1, targetBaseInnerPowerCost - getTerrainResonanceInnerPowerDiscount(skill.element, targetTerrain))
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
  const baseDamage = skill.functionalEffect ? 0 : Math.max(1, Math.floor(getSkillDamage(getEffectiveAttributesForPlayer(target.player), skill, skillLevel) * getSkillEffectMultiplier(target.player) * elementMultiplier * resonanceMultiplier))
  // 罡氣訣：外功造成的最終傷害 +%
  const damageBeforeTargetReduction = Math.max(1, Math.floor(baseDamage * (1 + getExternalSkillDamagePercent(target.player))))
  const damage = targetDamageReduction > 0
    ? Math.max(1, Math.floor(damageBeforeTargetReduction * (1 - targetDamageReduction)))
    : damageBeforeTargetReduction
  const nextHealth = Math.max(0, target.target.health - damage)
  const random = dependencies.random ?? defaultRandomSource
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
  const appliedBuffs = functionalBuffs.length > 0 && targetType === 'creature'
    ? functionalBuffs.map((buff) => ({
      ...(() => {
        const overrides = getFunctionalSkillBuffOverrides(skill.functionalEffect, skillLevel, buff)
        return { description: `${buff.description}${overrides.maxHealthDamagePercent !== undefined ? `（目前 ${Math.round(overrides.maxHealthDamagePercent * 100)}%）` : ''}` }
      })(),
      name: buff.name,
      remainingRounds: getFunctionalSkillBuffOverrides(skill.functionalEffect, skillLevel, buff).remainingRounds ?? (buff.duration === 'rounds' ? buff.durationRounds ?? null : null),
    }))
    : undefined
  const result: ExternalDamageExecutionResult = {
    playerId: target.player.id,
    playerName: target.player.name,
    targetType,
    targetId: target.target.id,
    targetName: target.target.name,
    skillId,
    skillName: skill.name,
    damage,
    nextHealth,
    maxHealth: target.target.maxHealth,
    innerPowerCost: targetInnerPowerCost,
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

  const functionalPlayer = skill.functionalEffect === 'experience-gain'
    ? [target.player.innerSkillId, ...target.player.equippedExternalSkillIds].reduce(
      (currentPlayer, skillToAdvance) => addSkillExperience(currentPlayer, skillToAdvance, 10),
      target.player,
    )
    : target.player
  const targetIsImmuneToDebuffs = ['burning', 'poison', 'attribute-reduction'].includes(skill.functionalEffect ?? '') &&
    ((target.target as PlayerState).buffs ?? []).some((existing) => getBuff(existing.definitionId)?.debuffImmunity)
  const targetWithFunctionalBuff = functionalBuffs.length > 0 && targetType === 'creature' && !targetIsImmuneToDebuffs
    ? functionalBuffs.reduce((currentTarget, buff) => {
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
    functionalPlayer,
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
  const damage = criticalHit ? Math.floor(preview.expectedDamage * 1.5) : preview.expectedDamage
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
    damage, nextHealth, maxHealth: target.target.maxHealth, criticalRate: preview.criticalRate, criticalHit, terrainResonance: preview.terrainResonance, defeated: nextHealth === 0, experienceReward: experienceGain || undefined, moneyReward: moneyReward || undefined, loot, learnedSkill,
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
