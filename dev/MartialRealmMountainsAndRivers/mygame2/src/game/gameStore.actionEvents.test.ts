import { beforeEach, describe, expect, it } from 'vitest'
import { gameStore } from './gameStore'
import { resetAiActionEventSequenceForTest } from './ai/aiActionEvent'
import type { AiActionEvent } from './ai/aiActionEvent'
import type { GameState } from './types'
import {
  makeAiTestState,
  makeProtectBaseOrder,
  makeSupportPlayerOrder,
  makeTestCreature,
  makeTestHuman,
  makeTestPlayer,
} from './testHelpers/gameFixtures'

/**
 * 切片 F：Player AI 行動事件化——runAiDefenseStep／runAiSupportStep 的每一步
 * 都要寫入全域行動日誌（GameState.actionEvents），順序穩定、成敗如實記錄。
 */
beforeEach(() => {
  gameStore.resetForTest()
  resetAiActionEventSequenceForTest()
})

function load(overrides: Partial<GameState> = {}): void {
  const ai = makeTestPlayer()
  const human = makeTestHuman()
  gameStore.setStateForTest(makeAiTestState({
    players: [ai, human],
    activePlayerId: 'ai-1',
    ...overrides,
  }))
}

function events(): AiActionEvent[] {
  return gameStore.getState().actionEvents ?? []
}

describe('Player AI 行動事件化', () => {
  it('防守：相鄰威脅攻擊成功 → 記錄 succeeded 的 attack 事件', () => {
    load({
      creatures: [makeTestCreature({ health: 20, maxHealth: 20 })],
      aiOrders: [makeProtectBaseOrder()],
    })

    expect(gameStore.runAiDefenseStep('ai-1').ok).toBe(true)

    const log = events()
    expect(log).toHaveLength(1)
    expect(log[0].action.type).toBe('attack')
    expect(log[0].result).toBe('succeeded')
    expect(log[0].actor.id).toBe('ai-1')
    expect(log[0].round).toBe(1)
  })

  it('防守：無威脅結束回合 → 記錄 end-turn 事件且回合確實結束', () => {
    load({
      creatures: [],
      aiOrders: [makeProtectBaseOrder()],
    })

    expect(gameStore.runAiDefenseStep('ai-1').ok).toBe(true)

    const log = events()
    expect(log).toHaveLength(1)
    // 無威脅時決策為原地待命，隨後結束回合（與 aiSteps 釘住網一致）。
    expect(log[0].action.type).toBe('hold')
    expect(log[0].result).toBe('succeeded')
    expect(gameStore.getState().activePlayerId).toBe('player-1')
  })

  it('防守：體力不足攻擊失敗 → 如實記錄 failed 事件與原因', () => {
    load({
      players: [
        makeTestPlayer({ stamina: 3, maxStamina: 20 }),
        makeTestHuman(),
      ],
      creatures: [makeTestCreature({ health: 20, maxHealth: 20 })],
      aiOrders: [makeProtectBaseOrder()],
    })

    expect(gameStore.runAiDefenseStep('ai-1')).toEqual({ ok: false, reason: '體力不足（需要 5，剩餘 3）。' })

    const log = events()
    expect(log).toHaveLength(1)
    expect(log[0].action.type).toBe('attack')
    expect(log[0].result).toBe('failed')
    expect(log[0].reason).toBe('體力不足（需要 5，剩餘 3）。')
  })

  it('支援：目標死亡暫停命令 → 記錄帶原因的 end-turn 事件', () => {
    load({
      players: [
        makeTestPlayer(),
        makeTestHuman({ health: 0, position: { row: 5, column: 8 } }),
        makeTestHuman({ id: 'player-2', name: '玩家 2', position: { row: 9, column: 9 } }),
      ],
      aiOrders: [makeSupportPlayerOrder()],
    })

    expect(gameStore.runAiSupportStep('ai-1').ok).toBe(true)

    const log = events()
    expect(log).toHaveLength(1)
    expect(log[0].action.type).toBe('end-turn')
    expect(log[0].reason).toContain('暫停支援')
  })

  it('事件順序：連續兩步的事件依執行順序排列、id 遞增', () => {
    load({
      players: [
        makeTestPlayer({ position: { row: 1, column: 1 }, stamina: 20, maxStamina: 20 }),
        makeTestHuman(),
      ],
      creatures: [],
      aiOrders: [makeProtectBaseOrder()],
    })

    // 第一步：從遠處移動進入防守範圍。
    expect(gameStore.runAiDefenseStep('ai-1').ok).toBe(true)
    // 第二步：已在範圍內且無威脅，收斂為待命／結束類決策。
    gameStore.setStateForTest({
      ...gameStore.getState(),
      activePlayerId: 'ai-1',
    })
    expect(gameStore.runAiDefenseStep('ai-1').ok).toBe(true)

    const log = events()
    expect(log.length).toBeGreaterThanOrEqual(2)
    expect(log[0].action.type).toBe('move')
    for (let index = 1; index < log.length; index += 1) {
      expect(log[index].id > log[index - 1].id).toBe(true)
    }
  })

  it('Game Over 後拒絕執行且不寫入新事件（清理語意）', () => {
    load({
      gameOver: true,
      gameOverReason: 'all-players-defeated',
      aiOrders: [makeProtectBaseOrder()],
    })

    expect(gameStore.runAiDefenseStep('ai-1')).toEqual({ ok: false, reason: '目前無法執行 AI 防守回合。' })
    expect(gameStore.runAiSupportStep('ai-1')).toEqual({ ok: false, reason: '目前無法執行 AI 支援回合。' })
    expect(events()).toEqual([])
  })

  it('舊存檔沒有 actionEvents 欄位時視為空陣列（讀檔相容）', () => {
    load({
      creatures: [makeTestCreature({ health: 20, maxHealth: 20 })],
      aiOrders: [makeProtectBaseOrder()],
    })
    // 模擬舊存檔：欄位不存在。
    const legacyState = gameStore.getState() as GameState & { actionEvents?: AiActionEvent[] }
    delete legacyState.actionEvents
    gameStore.setStateForTest(legacyState)

    expect(events()).toEqual([])
    expect(gameStore.runAiDefenseStep('ai-1').ok).toBe(true)
    expect(events()).toHaveLength(1)
  })
})
