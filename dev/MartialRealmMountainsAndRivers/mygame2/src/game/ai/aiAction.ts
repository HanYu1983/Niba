import type { Position, UpgradeableAttribute } from '../types'

/** 通用 Actor 參照：player 對應 PlayerState、creature 對應 CreatureState，兩種 State 不合併（重構文件 §4.1）。 */
export type AiActorKind = 'player' | 'creature'

export type AiActorRef = {
  id: string
  kind: AiActorKind
}

export type AiTargetKind = 'player' | 'creature' | 'nest' | 'base' | 'resource' | 'ruin' | 'defense' | 'item'

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
      type: 'upgrade'
      actor: AiActorRef
      baseId: string
      buildingId: string
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
  | {
      type: 'allocate-attribute'
      actor: AiActorRef
      attribute: UpgradeableAttribute
      reason: string
    }
  | {
      type: 'use-item'
      actor: AiActorRef
      itemId: string
      reason: string
    }
  | {
      type: 'equip'
      actor: AiActorRef
      instanceId: string
      reason: string
    }
  | {
      type: 'equip-inner-skill'
      actor: AiActorRef
      skillId: string
      reason: string
    }
  | {
      type: 'learn-skill'
      actor: AiActorRef
      baseId?: string
      gateId?: string
      skillType: 'inner' | 'external'
      skillId: string
      reason: string
    }
  | {
      type: 'practice-skill'
      actor: AiActorRef
      gateId: string
      skillId: string
      reason: string
    }
  | {
      type: 'use-facility'
      actor: AiActorRef
      baseId: string
      facilityType: 'heal' | 'mission' | 'repair'
      reason: string
    }
  | {
      type: 'defense-build'
      actor: AiActorRef
      baseId: string
      structureType: string
      position: Position
      reason: string
    }
  | {
      type: 'buy-item'
      actor: AiActorRef
      baseId: string
      itemId: string
      reason: string
    }

