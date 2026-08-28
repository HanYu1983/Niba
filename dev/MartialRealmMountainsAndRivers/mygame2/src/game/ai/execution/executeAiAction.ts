import type { ActionOutcome, AttackTargetType, GameState } from '../../types'
import type { AiAction } from '../aiAction'
import { movePlayer } from '../../actions/movementActions'
import { collectResourcePoint } from '../../actions/explorationActions'
import { constructBuilding, constructDefenseStructure } from '../../actions/buildingActions'
import type { TurnActionDependencies } from '../../actions/turnActions'
import { executeAiAttack } from './executeAiAttack'
import { collectItemPointAction } from '../../actions/itemActions'
import { useItemAction } from '../../actions/itemActions'
import { allocateAttributePointAction } from '../../rules/playerDerivedRules'
import { equipEquipmentAction } from '../../rules/equipmentRules'
import { equipInnerSkillAction } from '../../rules/skillRules'
import { learnSkillAtMartialHall } from '../../actions/martialHallActions'
import { learnSkillAtSectGate, practiceSkillAtSectGate } from '../../actions/sectGateActions'
import { useInfirmary, executeMission } from '../../actions/explorationActions'
import { clearRuin } from '../../actions/ruinActions'
import { buyItem } from '../../actions/shopActions'
import type { CombatActionDependencies } from '../../actions/combatActions'

export type ExecuteAiActionDependencies = {
  combat: CombatActionDependencies
  turn: TurnActionDependencies
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
    case 'move':
      return movePlayer(state, action.actor.id, action.destination.row, action.destination.column)
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
    case 'allocate-attribute':
      return allocateAttributePointAction(state, action.actor.id, action.attribute)
    case 'use-item':
      return useItemAction(state, action.actor.id, action.itemId)
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
        const result = useInfirmary(state, action.actor.id, action.baseId)
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
