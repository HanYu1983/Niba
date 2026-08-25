import type { GameState, Position } from '../types'
import type { AiDefenseAction } from '../aiDefenseRules'

/** 通用 Actor 參照：player 對應 PlayerState、creature 對應 CreatureState，兩種 State 不合併（重構文件 §4.1）。 */
export type AiActorKind = 'player' | 'creature'

export type AiActorRef = {
  id: string
  kind: AiActorKind
}

export type AiTargetKind = 'player' | 'creature' | 'nest' | 'base' | 'resource' | 'defense' | 'item'

export type AiTargetRef = {
  id: string
  kind: AiTargetKind
  position: Position
}

/**
 * 通用行動（重構文件 §4.4）：決策層只產生此形狀，不含 GameState。
 * collect／build 目前尚無決策來源，先定義型別供切片 D/G 使用。
 */
export type AiAction =
  | {
      type: 'move'
      actor: AiActorRef
      destination: Position
      path?: Position[]
      cost?: number
      reason: string
    }
  | {
      type: 'attack'
      actor: AiActorRef
      target: AiTargetRef
      reason: string
    }
  | {
      type: 'collect'
      actor: AiActorRef
      target: AiTargetRef
      reason: string
    }
  | {
      type: 'build'
      actor: AiActorRef
      baseId: string
      buildingType: string
      reason: string
    }
  | {
      type: 'hold'
      actor: AiActorRef
      reason: string
    }
  | {
      type: 'end-turn'
      actor: AiActorRef
      reason: string
    }

const MISSING_POSITION: Position = { row: -1, column: -1 }

/**
 * 舊 `AiDefenseAction` → 通用 `AiAction` 的轉換（重構文件 §12 Phase 1「Adapter 轉換」步驟）。
 *
 * 舊形狀的 attack 只帶 targetId/targetType，位置需查表補上；
 * 查不到時用 (-1,-1) 佔位——目標是否仍有效由 Validator 依 id 判定。
 */
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
