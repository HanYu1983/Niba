import type { ExplorationEventChoice, ExplorationEventState, ExplorationEventType, GameState, PlayerState } from '../types'
import { getBuildingTypeDisplayName, getExplorationEventDefinition, type EventEffect, type EventRequirement } from './eventCatalog'
import { allInnerSkillCatalog, allExternalSkillCatalog } from '../catalogs/martialHallSkillCatalog'
import { enqueueDialogue } from '../actions/dialogueActions'
import type { ScenarioDialogueStep } from '../catalogs/storyDialogueCatalog'

export type EventRequirementResult = {
  allowed: boolean
  reasons: string[]
}

export function checkEventRequirements(
  state: GameState,
  playerId: string,
  event: ExplorationEventState,
  requirements: EventRequirement[],
): EventRequirementResult {
  const player = state.players.find((candidate) => candidate.id === playerId)
  const reasons: string[] = []

  for (const requirement of requirements) {
    if (requirement.type === 'adjacent-to-event' && (!player || player.position.row !== event.position.row || player.position.column !== event.position.column)) {
      reasons.push('玩家需位於事件點所在格。')
    }
    if (requirement.type === 'active-player' && state.activePlayerId !== playerId) {
      reasons.push('目前不是玩家回合。')
    }
    if (requirement.type === 'player-alive' && (!player || player.health <= 0)) {
      reasons.push('玩家已無法行動。')
    }
    if (requirement.type === 'money-at-least' && (!player || player.money < requirement.amount)) {
      reasons.push(`至少需要 ${requirement.amount} 金錢。`)
    }
    if (requirement.type === 'item-owned') {
      const quantity = player?.inventory.find((entry) => entry.itemId === requirement.itemId)?.quantity ?? 0
      if (quantity < requirement.quantity) {
        reasons.push(`需要物品 ${requirement.itemId} ×${requirement.quantity}。`)
      }
    }
    if (requirement.type === 'building-exists') {
      const hasBuilding = state.bases.some((base) => base.buildings.some((building) => building.type === requirement.buildingType))
      if (!hasBuilding) reasons.push(`需要建築：${getBuildingTypeDisplayName(requirement.buildingType)}。`)
    }
  }

  return { allowed: reasons.length === 0, reasons }
}

export function getEventChoiceDefinition(event: ExplorationEventState, choiceId: ExplorationEventChoice['id']) {
  // 自定義事件：從 customEvent 查選項。
  if (event.type === 'custom' && event.customEvent) {
    return event.customEvent.choices.find((choice) => choice.id === choiceId)
  }
  return getExplorationEventDefinition(event.type as ExplorationEventType)?.choices.find((choice) => choice.id === choiceId)
}

/** 取得事件的所有選項（自定義事件讀 customEvent，既有事件讀 eventCatalog）。 */
export function getEventChoices(event: ExplorationEventState) {
  if (event.type === 'custom' && event.customEvent) {
    return event.customEvent.choices
  }
  return getExplorationEventDefinition(event.type as ExplorationEventType)?.choices ?? []
}

function addItem(player: PlayerState, itemId: string, quantity: number): PlayerState {
  const existing = player.inventory.find((entry) => entry.itemId === itemId)
  if (existing && existing.quantity + quantity <= 0) {
    return {
      ...player,
      inventory: player.inventory.filter((entry) => entry.itemId !== itemId),
    }
  }
  return {
    ...player,
    inventory: existing
      ? player.inventory.map((entry) => entry.itemId === itemId ? { ...entry, quantity: entry.quantity + quantity } : entry)
      : [...player.inventory, { itemId, quantity }],
  }
}

/** 選出指定類型中尚未學會、可隨機授與的功法；若無可學則回傳 undefined。 */
function getRandomLearnableSkill(player: PlayerState, skillType: 'inner' | 'external') {
  const learned = skillType === 'inner'
    ? new Set(player.innerSkillIds)
    : new Set(player.externalSkillIds)
  const catalog = skillType === 'inner' ? allInnerSkillCatalog : allExternalSkillCatalog
  const unlearned = catalog.filter((skill) => !learned.has(skill.id))
  if (unlearned.length === 0) return undefined
  return unlearned[Math.floor(Math.random() * unlearned.length)]
}

/** 將指定類型的一項未學會功法加入玩家已學清單（若無剩餘功法則不改動）。 */
function learnSkill(player: PlayerState, skillType: 'inner' | 'external'): PlayerState {
  const skill = getRandomLearnableSkill(player, skillType)
  if (!skill) return player
  return skillType === 'inner'
    ? { ...player, innerSkillIds: [...player.innerSkillIds, skill.id] }
    : { ...player, externalSkillIds: [...player.externalSkillIds, skill.id] }
}

export function applyEventEffects(player: PlayerState, effects: EventEffect[]): PlayerState {
  return effects.reduce((currentPlayer, effect) => {
    if (effect.type === 'money') return { ...currentPlayer, money: Math.max(0, currentPlayer.money + effect.amount) }
    if (effect.type === 'prestige') return { ...currentPlayer, prestige: currentPlayer.prestige + effect.amount }
    if (effect.type === 'learn-skill') return learnSkill(currentPlayer, effect.skillType)
    if (effect.type === 'item') return addItem(currentPlayer, effect.itemId, effect.quantity)
    // spawn-creature 為狀態層級效果，由 applyEventStateEffects 處理，此處忽略。
    return currentPlayer
  }, player)
}

/**
 * 套用「狀態層級」的事件效果（如 spawn-creature 生產怪物）。
 * 這些效果需要修改整個 GameState，而非單一玩家。
 */
export function applyEventStateEffects(state: GameState, effects: EventEffect[]): GameState {
  return effects.reduce((currentState, effect) => {
    if (effect.type === 'spawn-creature') {
      // 從場景中尋找 spawnOnLoad === false 的怪物定義，將其加入場上。
      const creature = currentState.scenarioCreatures?.find((c) => c.id === effect.creatureId)
      if (creature) {
        return { ...currentState, creatures: [...currentState.creatures, creature] }
      }
    }
    if (effect.type === 'spawn-event') {
      // 從場景中尋找 spawnOnLoad === false 的探索事件點定義，將其加入場上。
      const event = currentState.scenarioEvents?.find((e) => e.id === effect.eventId)
      if (event && !currentState.explorationEvents?.some((e) => e.id === event.id)) {
        return { ...currentState, explorationEvents: [...(currentState.explorationEvents ?? []), event] }
      }
    }
    if (effect.type === 'spawn-base') {
      // 從場景中尋找 spawnOnLoad === false 的據點定義，將其加入場上。
      const base = currentState.scenarioBases?.find((b) => b.id === effect.baseId)
      if (base && !currentState.bases.some((b) => b.id === base.id)) {
        return { ...currentState, bases: [...currentState.bases, base] }
      }
    }
    if (effect.type === 'spawn-nest') {
      // 從場景中尋找 spawnOnLoad === false 的巢穴定義，將其加入場上。
      const nest = currentState.scenarioNests?.find((n) => n.id === effect.nestId)
      if (nest && !currentState.creatureNests.some((n) => n.id === nest.id)) {
        return { ...currentState, creatureNests: [...currentState.creatureNests, nest] }
      }
    }
    if (effect.type === 'start-dialogue') {
      // 從對話組中尋找指定對話組，將其步驟填入對話佇列。
      const group = currentState.campaignState?.dialogueGroups?.[effect.dialogueId]
      if (group && group.steps.length > 0) {
        const steps: ScenarioDialogueStep[] = group.steps.map((step) => ({
          id: step.id,
          speakerName: step.speakerName,
          speakerIcon: step.speakerIcon,
          content: step.content,
          triggerCondition: 'on-start',
        }))
        return enqueueDialogue(currentState, steps)
      }
    }
    return currentState
  }, state)
}
