import type { AiAction, AiActorRef } from './aiAction'

/**
 * AI 行動事件（重構文件 §4.5）：全域遊戲日誌的紀錄單位。
 * Creature 與玩家 AI 使用同一格式；事件可序列化（存檔隨 GameState 一併保存）。
 */
export type AiActionResult = 'started' | 'succeeded' | 'failed'

export type AiActionEvent = {
  id: string
  round: number
  actor: AiActorRef & { name?: string }
  action: AiAction
  result: AiActionResult
  reason?: string
  createdAt: string
}

/** 事件 id 的遞增序號：保證同回合內多筆事件的順序可比對（事件順序測試依據）。 */
let sequence = 0

export function resetAiActionEventSequenceForTest(): void {
  sequence = 0
}

export type CreateAiActionEventInput = {
  round: number
  actor: AiActorRef & { name?: string }
  action: AiAction
  result: AiActionResult
  reason?: string
  /** 測試可注入固定時間；預設為當下時間。 */
  createdAt?: string
}

export function createAiActionEvent(input: CreateAiActionEventInput): AiActionEvent {
  sequence += 1
  return {
    id: `action-${input.round}-${input.actor.id}-${sequence}`,
    round: input.round,
    actor: input.actor,
    action: input.action,
    result: input.result,
    reason: input.reason ?? (input.action.reason || undefined),
    createdAt: input.createdAt ?? new Date().toISOString(),
  }
}

const ACTION_TYPE_LABELS: Record<AiAction['type'], string> = {
  move: '移動',
  attack: '攻擊',
  collect: '採集',
  build: '建設',
  hold: '原地待命',
  'end-turn': '結束回合',
  'allocate-attribute': '分配屬性',
  'use-item': '使用道具',
}

function formatActionDetail(action: AiAction): string {
  switch (action.type) {
    case 'move':
      return `移動到 (${action.destination.row + 1}, ${action.destination.column + 1})`
    case 'attack':
      return `攻擊目標 ${action.target.id}`
    case 'collect':
      return `採集 ${action.target.id}`
    case 'build':
      return `在據點建設 ${action.buildingType}`
    default:
      return ACTION_TYPE_LABELS[action.type]
  }
}

/** 全域日誌顯示用的一行文字。 */
export function formatAiActionEvent(event: AiActionEvent): string {
  const actorName = event.actor.name ?? event.actor.id
  const detail = formatActionDetail(event.action)
  const reason = event.reason ? `（${event.reason}）` : ''
  return `[第 ${event.round} 回合] ${actorName} ${detail}${reason}`
}
