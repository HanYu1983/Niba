import type {
  AttackPreview,
  AttackTargetType,
  CreatureState,
  ExternalSkillPreview,
  GameState,
  ItemBurstPreview,
  PlayerState,
  RepairPreview,
} from './types'
import { getRepairSummary, getWorkshopLevel, hasBuilding, requiresAdjacentActivePlayer } from './rules/buildingRules'
import { getElementDamageMultiplier, getElementInteractionText, getExternalSkill, getGenerationSynergyMultiplier, getInnerSkill, getSkillDamage, getSkillEffectMultiplier, getSkillInnerPowerCost, getSkillProgression, isElementGenerating } from './rules/skillRules'
import { getTerrainAtPosition, getTerrainResonanceCriticalRateBonus, getTerrainResonanceDamageMultiplier, getTerrainResonanceInnerPowerDiscount, getTerrainResonanceLabel, isTerrainResonant, isTripleResonance } from './rules/terrainCombatRules'
import { getCriticalRateForPlayer, getCreatureDamageReductionPercent, getCreatureEvasionRate, getDamageDealtPercent, getEffectiveAttributesForPlayer, getExternalSkillCritRateForPlayer, getExternalSkillInnerCostReduction } from './rules/playerDerivedRules'
import { calculateDamage } from './rules/playerRules'
import { getAttackTarget } from './rules/targetRules'
import { isAdjacent } from './types'
import { itemCatalog } from './catalogs/itemCatalog'
import { getSchoolElement } from './catalogs/skillProgressionCatalog'

export function createAttackPreview(
  state: GameState,
  player: PlayerState | null,
  targetType: AttackTargetType,
  targetId: string,
): AttackPreview | null {
  const target = getAttackTarget(state, player, targetType, targetId)
  if (!target) return null

  const innerSkill = getInnerSkill(target.player.innerSkillId)
  const defenderElement = 'innerSkillId' in target.target
    ? getInnerSkill(target.target.innerSkillId).element
    : getSchoolElement(target.target.schoolId)
  const standingTerrain = getTerrainAtPosition(state.map.cells, target.player.position)
  const terrainResonanceMultiplier = getTerrainResonanceDamageMultiplier(innerSkill.element, standingTerrain)
  const baseDamage = calculateDamage(
    Math.floor(getSkillDamage(getEffectiveAttributesForPlayer(target.player), innerSkill, getSkillProgression(target.player, innerSkill.id).level) * getSkillEffectMultiplier(target.player) * getElementDamageMultiplier(innerSkill.element, defenderElement) * terrainResonanceMultiplier),
    0,
  )
  // 破軍訣：普通攻擊造成的最終傷害 +%
  const expectedDamage = Math.max(1, Math.floor(baseDamage * (1 + getDamageDealtPercent(target.player))))
  // 敵方生物減傷／回避率（供攻擊彈窗顯示）。
  const creatureTarget = targetType === 'creature' ? target.target as CreatureState : undefined
  const creatureTerrain = creatureTarget ? getTerrainAtPosition(state.map.cells, creatureTarget.position) : undefined
  return {
    playerId: target.player.id,
    targetType,
    targetId,
    playerName: target.player.name,
    targetName: target.target.name,
    expectedDamage,
    criticalRate: getCriticalRateForPlayer(target.player) + getTerrainResonanceCriticalRateBonus(innerSkill.element, standingTerrain),
    targetHealth: target.target.health,
    targetMaxHealth: target.target.maxHealth,
    elementInteraction: getElementInteractionText(innerSkill.element, defenderElement),
    terrainResonance: getTerrainResonanceLabel(innerSkill.element, standingTerrain),
    targetReduction: creatureTarget ? getCreatureDamageReductionPercent(creatureTarget, creatureTerrain) : undefined,
    targetEvasion: creatureTarget ? getCreatureEvasionRate(creatureTarget, creatureTerrain) : undefined,
  }
}

/** 建立元素爆發道具（element-burst）的預期結果預覽。 */
export function createItemBurstPreview(
  state: GameState,
  player: PlayerState | null,
  itemId: string,
  targetType: AttackTargetType,
  targetId: string,
): ItemBurstPreview | null {
  const item = itemCatalog.find((candidate) => candidate.id === itemId)
  if (!item || item.effect !== 'element-burst' || !player) return null

  const target = targetType === 'creature'
    ? state.creatures.find((creature) => creature.id === targetId && creature.health > 0)
    : state.creatureNests.find((nest) => nest.id === targetId && nest.health > 0)
  if (!target) return null

  const attackerElement = item.element
  const defenderElement = getSchoolElement(target.schoolId)
  const multiplier = getElementDamageMultiplier(attackerElement, defenderElement)
  const expectedDamage = Math.max(1, Math.floor((item.effectValue ?? 0) * multiplier))

  return {
    playerId: player.id,
    playerName: player.name,
    itemId,
    itemName: item.name,
    itemIcon: item.icon ?? '',
    targetType,
    targetId,
    targetName: target.name,
    expectedDamage,
    targetHealth: target.health,
    targetMaxHealth: target.maxHealth,
    elementInteraction: getElementInteractionText(attackerElement, defenderElement),
  }
}

export function createExternalSkillPreview(
  state: GameState,
  player: PlayerState | null,
  targetType: AttackTargetType,
  targetId: string,
  skillId: string,
): ExternalSkillPreview | null {
  const skill = getExternalSkill(skillId)
  const target = getAttackTarget(state, player, targetType, targetId, skill.shape ?? { kind: 'radius', range: skill.range ?? 1 })
  if (player && skill.target === 'self') {
    const terrain = getTerrainAtPosition(state.map.cells, player.position)
    const baseInnerPowerCost = getSkillInnerPowerCost(skill.innerPowerCost, getSkillProgression(player, skillId).level)
    return {
      playerId: player.id,
      targetType: 'creature',
      targetId: player.id,
      playerName: player.name,
      targetName: player.name,
      skillId,
      skillName: skill.name,
      innerPowerCost: Math.max(1, baseInnerPowerCost - getTerrainResonanceInnerPowerDiscount(skill.element, terrain) - getExternalSkillInnerCostReduction(player)),
      expectedDamage: 0,
      targetMode: 'self',
      effectSummary: skill.description,
      terrainResonance: getTerrainResonanceLabel(skill.element, terrain),
    }
  }
  const baseInnerPowerCost = getSkillInnerPowerCost(skill.innerPowerCost, target ? getSkillProgression(target.player, skillId).level : 1)
  const targetTerrain = target ? getTerrainAtPosition(state.map.cells, target.player.position) : undefined
  const innerPowerCost = Math.max(1, baseInnerPowerCost - getTerrainResonanceInnerPowerDiscount(skill.element, targetTerrain) - (target ? getExternalSkillInnerCostReduction(target.player) : 0))
  if (!target || !target.player.equippedExternalSkillIds.includes(skillId) || target.player.innerPower < innerPowerCost) {
    return null
  }
  const innerElement = getInnerSkill(target.player.innerSkillId).element
  const outerElement = skill.element
  const synergy = isElementGenerating(innerElement, outerElement)
  const tripleResonance = !skill.functionalEffect && isTripleResonance({
    innerElement,
    outerElement,
    terrain: targetTerrain,
    targetSchoolId: target.target.schoolId,
  })

  return {
    playerId: target.player.id,
    targetType,
    targetId,
    skillId,
    playerName: target.player.name,
    targetName: target.target.name,
    skillName: skill.name,
    innerPowerCost,
    expectedDamage: skill.functionalEffect ? 0 : Math.max(1, Math.floor(getSkillDamage(getEffectiveAttributesForPlayer(target.player), skill, getSkillProgression(target.player, skill.id).level) * getSkillEffectMultiplier(target.player) * getElementDamageMultiplier(skill.element, getSchoolElement(target.target.schoolId)) * getTerrainResonanceDamageMultiplier(skill.element, targetTerrain) * getGenerationSynergyMultiplier(innerElement, skill.element))),
    criticalRate: skill.functionalEffect ? undefined : getExternalSkillCritRateForPlayer(target.player),
    synergy: synergy || undefined,
    tripleResonance: tripleResonance || undefined,
    synergyResonanceState: tripleResonance ? 'triple' : synergy && isTerrainResonant(outerElement, targetTerrain) ? 'dual' : synergy ? 'single' : undefined,
    targetHealth: target.target.health,
    targetMaxHealth: target.target.maxHealth,
    targetMode: skill.target,
    effectSummary: skill.functionalEffect ? skill.description : undefined,
    elementInteraction: getElementInteractionText(skill.element, getSchoolElement(target.target.schoolId)),
    terrainResonance: getTerrainResonanceLabel(skill.element, targetTerrain),
    targetReduction: targetType === 'creature'
      ? getCreatureDamageReductionPercent(target.target as CreatureState, targetTerrain)
      : undefined,
    targetEvasion: targetType === 'creature'
      ? getCreatureEvasionRate(target.target as CreatureState, targetTerrain)
      : undefined,
  }
}

export function createRepairPreview(
  state: GameState,
  player: PlayerState | null,
  baseId: string,
): RepairPreview | null {
  const base = state.bases.find((candidate) => candidate.id === baseId)
  if (!player || !base || !hasBuilding(base, 'workshop') || !isAdjacent(player.position, base.position)) return null

  const repairSummary = getRepairSummary(player, getWorkshopLevel(base))
  return repairSummary.durabilityRestored > 0
    ? { playerId: player.id, baseId, ...repairSummary }
    : null
}

export function canExecuteRepair(state: GameState, preview: RepairPreview): boolean {
  const player = state.players.find((candidate) => candidate.id === preview.playerId)
  const base = state.bases.find((candidate) => candidate.id === preview.baseId)
  const repairSummary = player ? getRepairSummary(player, base ? getWorkshopLevel(base) : 1) : null
  return Boolean(
    player &&
    base &&
    hasBuilding(base, 'workshop') &&
    requiresAdjacentActivePlayer(base, player) &&
    repairSummary &&
    repairSummary.durabilityRestored > 0,
  )
}
