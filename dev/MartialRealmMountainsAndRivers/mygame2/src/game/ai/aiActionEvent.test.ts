import { describe, expect, it } from 'vitest'
import type { AiAction } from './aiAction'
import {
  createAiActionEvent,
  formatAiActionEvent,
  resetAiActionEventSequenceForTest,
} from './aiActionEvent'

const actor = { id: 'ai-1', kind: 'player' as const, name: 'AI 玩家' }

function moveAction(): AiAction {
  return { type: 'move', actor: { id: actor.id, kind: 'player' }, destination: { row: 4, column: 4 }, reason: '返回據點防守範圍。' }
}

describe('aiActionEvent', () => {
  it('同一回合多筆事件 id 遞增，順序可比對', () => {
    resetAiActionEventSequenceForTest()
    const first = createAiActionEvent({ round: 3, actor, action: moveAction(), result: 'succeeded', createdAt: '2026-08-24T00:00:00.000Z' })
    const second = createAiActionEvent({ round: 3, actor, action: moveAction(), result: 'failed', reason: '體力不足。', createdAt: '2026-08-24T00:00:01.000Z' })

    expect(first.id < second.id).toBe(true)
    expect(first.round).toBe(3)
    expect(second.result).toBe('failed')
    expect(second.reason).toBe('體力不足。')
    expect(first.createdAt).toBe('2026-08-24T00:00:00.000Z')
  })

  it('格式化：成功行動含回合、名字與細節', () => {
    resetAiActionEventSequenceForTest()
    const event = createAiActionEvent({ round: 2, actor, action: moveAction(), result: 'succeeded' })

    expect(formatAiActionEvent(event)).toBe('[第 2 回合] AI 玩家 移動到 (5, 5)（返回據點防守範圍。）')
  })

  it('格式化：失敗行動附加原因', () => {
    resetAiActionEventSequenceForTest()
    const event = createAiActionEvent({
      round: 1,
      actor,
      action: { type: 'attack', actor: { id: actor.id, kind: 'player' }, target: { id: 'creature-1', kind: 'creature', position: { row: 0, column: 0 } }, reason: '' },
      result: 'failed',
      reason: '體力不足。',
    })

    expect(formatAiActionEvent(event)).toBe('[第 1 回合] AI 玩家 攻擊目標 creature-1（體力不足。）')
  })

  it('格式化：end-turn 行動與無名 actor 顯示 id', () => {
    resetAiActionEventSequenceForTest()
    const event = createAiActionEvent({
      round: 5,
      actor: { id: 'ai-9', kind: 'player' },
      action: { type: 'end-turn', actor: { id: 'ai-9', kind: 'player' }, reason: '沒有需要執行的行動。' },
      result: 'succeeded',
    })

    expect(formatAiActionEvent(event)).toBe('[第 5 回合] ai-9 結束回合（沒有需要執行的行動。）')
  })
})
