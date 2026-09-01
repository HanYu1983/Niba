import type { ActionOutcome, AttackTargetType, GameState } from '../../types'
import type { AiAction } from '../aiAction'
import { movePlayer } from '../../actions/movementActions'
import { collectResourcePoint } from '../../actions/explorationActions'
import { constructBuilding, constructDefenseStructure, upgradeBuilding } from '../../actions/buildingActions'
import type { TurnActionDependencies } from '../../actions/turnActions'
import { executeAiAttack } from './executeAiAttack'
import { collectItemPointAction } from '../../actions/itemActions'
import { useItemAction as executeItemAction } from '../../actions/itemActions'
import { allocateAttributePointAction } from '../../rules/playerDerivedRules'
import { equipEquipmentAction } from '../../rules/equipmentRules'
import { equipInnerSkillAction } from '../../rules/skillRules'
import { learnSkillAtMartialHall } from '../../actions/martialHallActions'
import { learnSkillAtSectGate, practiceSkillAtSectGate } from '../../actions/sectGateActions'
import { useInfirmary as executeInfirmary, executeMission } from '../../actions/explorationActions'
import { clearRuin } from '../../actions/ruinActions'
import { buyItem } from '../../actions/shopActions'
import { transportPlayerAction } from '../../actions/transportActions'
import type { CombatActionDependencies } from '../../actions/combatActions'
import { resolveExplorationEvent } from '../../actions/explorationActions'
import { checkEventRequirements, getEventChoices } from '../../events/eventResolver'
import { computeEventChoiceValue } from '../fuzzy/eventValue'
import { createItemBurstPreview } from '../../previewOrchestration'
import { executeItemBurstAction } from '../../actions/itemBurstActions'

export type ExecuteAiActionDependencies = {
  combat: CombatActionDependencies
  turn: TurnActionDependencies
}

function resolveAiExplorationEvent(state: GameState, playerId: string): GameState {
  const player = state.players.find((candidate) => candidate.id === playerId)
  if (!player?.isAI) return state

  const event = (state.explorationEvents ?? []).find((candidate) =>
    candidate.status === 'available'
      && candidate.position.row === player.position.row
      && candidate.position.column === player.position.column,
  )
  if (!event) return state

  const eligibleChoices = getEventChoices(event).filter((candidate) =>
    checkEventRequirements(state, playerId, event, candidate.requirements).allowed,
  )
  const rankedChoices = eligibleChoices
    .map((candidate, index) => ({
      candidate,
      index,
      value: computeEventChoiceValue({ effects: candidate.effects, playerMoney: player.money, personality: player.aiPersonality }),
    }))
    .sort((first, second) => second.value - first.value || first.index - second.index)
  const choice = rankedChoices[0]?.candidate
  if (!choice) return state

  console.info('[AI decision]', {
    kind: 'exploration-event',
    player: { id: player.id, name: player.name, position: player.position },
    event: { id: event.id, type: event.type, name: event.name },
    personality: player.aiPersonality ?? 'balanced',
    choices: rankedChoices.map(({ candidate, value }) => ({
      id: candidate.id,
      label: candidate.label,
      value: Number(value.toFixed(3)),
    })),
    selectedChoice: choice.id,
  })

  const result = resolveExplorationEvent(state, playerId, event.id, choice.id)
  return result.result.ok ? result.state : state
}

/**
 * 通用 AI 行動執行器（純領域函數）：validate → execute → return。
 *
 * 所有 AI 行動經此單一入口執行，確保一致性與可測試性。
 * 呼叫端負責驗證（validateAiAction）與記錄（recordAiStepEvent）。
 */
export function executeAiAction(
  state: GameState,
  action: AiAction,
  dependencies: ExecuteAiActionDependencies,
): { state: GameState; result: ActionOutcome } {
  switch (action.type) {
    case 'transport':
      return transportPlayerAction(state, action.actor.id, action.targetId)
    case 'move': {
      const result = movePlayer(state, action.actor.id, action.destination.row, action.destination.column)
      if (!result.result.ok) return result
      return { state: resolveAiExplorationEvent(result.state, action.actor.id), result: result.result }
    }
    case 'attack': {
      const result = executeAiAttack(state, action.actor.id, action.target.kind as AttackTargetType, action.target.id, dependencies.combat)
      return { state: result.state, result: result.result }
    }
    case 'collect': {
      if (action.target.kind === 'item') {
        const result = collectItemPointAction(state, action.actor.id, action.target.id)
        return { state: result.state, result: result.result }
      }
      if (action.target.kind === 'ruin') {
        const result = clearRuin(state, action.actor.id, action.target.id)
        return { state: result.state, result: result.result }
      }
      const result = collectResourcePoint(state, action.actor.id, action.target.id)
      return { state: result.state, result: result.result }
    }
    case 'build': {
      const result = constructBuilding(state, action.baseId, action.buildingType, action.actor.id)
      return { state: result.state, result: result.result }
    }
    case 'upgrade': {
      const result = upgradeBuilding(state, action.actor.id, action.baseId, action.buildingId)
      return { state: result.state, result: result.result }
    }
    case 'allocate-attribute':
      return allocateAttributePointAction(state, action.actor.id, action.attribute)
    case 'use-item':
      return executeItemAction(state, action.actor.id, action.itemId)
    case 'use-element-burst': {
      const player = state.players.find((candidate) => candidate.id === action.actor.id)
      const preview = player
        ? createItemBurstPreview(state, player, action.itemId, action.target.kind as AttackTargetType, action.target.id)
        : null
      if (!preview) return { state, result: { ok: false, reason: '元素爆發目標或道具無效。' } }
      return executeItemBurstAction({ ...state, itemBurstPreview: preview }, dependencies.combat)
    }
    case 'equip':
      return equipEquipmentAction(state, action.actor.id, action.instanceId)
    case 'equip-inner-skill':
      return equipInnerSkillAction(state, action.actor.id, action.skillId)
    case 'learn-skill': {
      if (action.baseId) {
        const result = learnSkillAtMartialHall(state, action.actor.id, action.baseId, action.skillType, action.skillId)
        return { state: result.state, result: result.result }
      }
      if (action.gateId) {
        const result = learnSkillAtSectGate(state, action.actor.id, action.gateId, action.skillId)
        return { state: result.state, result: result.result }
      }
      return { state, result: { ok: false, reason: '學招：無據點或門派目標' } }
    }
    case 'practice-skill': {
      const result = practiceSkillAtSectGate(state, action.actor.id, action.gateId, action.skillId)
      return { state: result.state, result: result.result }
    }
    case 'use-facility': {
      if (action.facilityType === 'heal') {
        const result = executeInfirmary(state, action.actor.id, action.baseId)
        return { state: result.state, result: result.result }
      }
      if (action.facilityType === 'mission') {
        const result = executeMission(state, action.actor.id, action.baseId)
        return { state: result.state, result: result.result }
      }
      return { state, result: { ok: true } }
    }
    case 'defense-build': {
      const result = constructDefenseStructure(state, action.actor.id, action.baseId, action.structureType as import('../../catalogs/defenseStructureCatalog').DefenseStructureType, action.position)
      return { state: result.state, result: result.result }
    }
    case 'buy-item': {
      const result = buyItem(state, action.actor.id, action.itemId, 1)
      return { state: result.state, result: result.result }
    }
    case 'hold':
      return { state, result: { ok: true } }
    case 'end-turn':
      // 結束回合不在此執行：會觸發完整 endPlayerTurn 連鎖（生物移動／巢穴／事件）。
      // 回傳 ok:false 不改 state，由 runStep 出口或 scheduler.endTurn 結束回合。
      return {
        state,
        result: { ok: false, reason: 'end-turn 不可作為一般 AI 行動執行。' },
      }
  }
}
