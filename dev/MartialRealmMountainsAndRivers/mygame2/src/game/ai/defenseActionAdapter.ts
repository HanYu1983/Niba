import type { GameState } from '../types'
import type { AiDefenseAction } from '../aiDefenseRules'
import type { AiAction, AiActorRef } from './aiAction'

const MISSING_POSITION = { row: -1, column: -1 } as const

/** 將舊版防禦決策轉換為通用 AI 行動。 */
export function defenseActionToAiAction(state: GameState, actorId: string, action: AiDefenseAction): AiAction {
  const actor: AiActorRef = { id: actorId, kind: 'player' }
  switch (action.type) {
    case 'move':
      return { type: 'move', actor, destination: action.position, reason: action.reason }
    case 'attack': {
      const creature = state.creatures.find((candidate) => candidate.id === action.targetId)
      const nest = state.creatureNests.find((candidate) => candidate.id === action.targetId)
      const position = creature?.position ?? nest?.position ?? MISSING_POSITION
      return {
        type: 'attack',
        actor,
        target: { id: action.targetId, kind: action.targetType, position },
        reason: '',
      }
    }
    case 'hold-position':
      return { type: 'hold', actor, reason: action.reason }
    case 'end-turn':
      return { type: 'end-turn', actor, reason: action.reason }
  }
}
