import { beforeEach, describe, expect, it, vi } from 'vitest'
import { gameStore } from './gameStore'
import type { GameState, PlayerState } from './types'
import {
  makeAiTestState,
  makeProtectBaseOrder,
  makeSupportPlayerOrder,
  makeFuzzyOrder,
  makeTestCreature,
  makeTestHuman,
  makeTestPlayer,
  manhattanDistance,
} from './testHelpers/gameFixtures'

/**
 * 切片 A0：runAiDefenseStep／runAiSupportStep 的行為釘住網。
 * 本切片不改變任何 production 行為；斷言只看結果（位置、血量、回合、命令狀態），
 * 不鎖定 Preview API 內部路徑，以便切片 A 去 preview 化後這組測試仍能當驗收網。
 */
beforeEach(() => {
  gameStore.resetForTest()
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

function playerById(id: string): PlayerState {
  const player = gameStore.getState().players.find((candidate) => candidate.id === id)
  if (!player) throw new Error(`測試夾具缺少玩家 ${id}`)
  return player
}

describe('runAiDefenseStep／runAiSupportStep 整合', () => {
  it('非 AI、非其回合、Creature 行動中皆拒絕執行', () => {
    load({
      players: [makeTestPlayer({ isAI: false }), makeTestHuman()],
      aiOrders: [makeProtectBaseOrder()],
    })
    expect(gameStore.runAiDefenseStep('ai-1')).toEqual({ ok: false, reason: '目前無法執行 AI 防守回合。' })
    expect(playerById('ai-1').position).toEqual({ row: 5, column: 5 })

    load({
      activePlayerId: 'player-1',
      aiOrders: [makeProtectBaseOrder()],
    })
    expect(gameStore.runAiDefenseStep('ai-1')).toEqual({ ok: false, reason: '目前無法執行 AI 防守回合。' })

    load({
      creatureTurnInProgress: true,
      aiOrders: [makeProtectBaseOrder()],
    })
    expect(gameStore.runAiDefenseStep('ai-1')).toEqual({ ok: false, reason: '目前無法執行 AI 防守回合。' })
    expect(gameStore.getState().activePlayerId).toBe('ai-1')
    expect(playerById('ai-1').turnEnded).toBe(false)
  })

  it('防守：相鄰威脅時攻擊成功並扣血', () => {
    load({
      creatures: [makeTestCreature({
        health: 20,
        maxHealth: 20,
        // 低身法與根骨，避免回避／根骨減傷影響扣血判定。
        attributes: { armStrength: 8, constitution: 1, agility: 1, innerEnergy: 5, insight: 7 },
      })],
      aiOrders: [makeProtectBaseOrder()],
    })

    const result = gameStore.runAiDefenseStep('ai-1')
    const creature = gameStore.getState().creatures.find((candidate) => candidate.id === 'creature-1')

    expect(result.ok).toBe(true)
    expect(creature === undefined || creature.health < 20).toBe(true)
    expect(playerById('ai-1').stamina).toBeLessThan(20)
    expect(playerById('ai-1').turnEnded).toBe(false)
    expect(gameStore.getState().activePlayerId).toBe('ai-1')
  })

  it('防守：半徑外且可移動時進入防守範圍', () => {
    load({
      players: [
        makeTestPlayer({ position: { row: 1, column: 1 }, stamina: 20, maxStamina: 20 }),
        makeTestHuman(),
      ],
      creatures: [],
      aiOrders: [makeProtectBaseOrder()],
    })

    const result = gameStore.runAiDefenseStep('ai-1')
    const ai = playerById('ai-1')

    expect(result.ok).toBe(true)
    expect(ai.position).not.toEqual({ row: 1, column: 1 })
    expect(manhattanDistance(ai.position, { row: 5, column: 5 })).toBeLessThanOrEqual(6)
    expect(ai.turnEnded).toBe(false)
  })

  it('防守：無威脅時安全結束回合', () => {
    load({
      creatures: [],
      aiOrders: [makeProtectBaseOrder()],
    })

    const result = gameStore.runAiDefenseStep('ai-1')
    const state = gameStore.getState()

    expect(result.ok).toBe(true)
    expect(playerById('ai-1').turnEnded).toBe(true)
    expect(state.activePlayerId).toBe('player-1')
    expect(state.creatureTurnInProgress).toBe(false)
  })

  it('防守：體力不足以攻擊時回傳失敗且不結束回合', () => {
    load({
      players: [
        makeTestPlayer({ stamina: 3, maxStamina: 20 }),
        makeTestHuman(),
      ],
      creatures: [makeTestCreature({ health: 20, maxHealth: 20 })],
      aiOrders: [makeProtectBaseOrder()],
    })

    const result = gameStore.runAiDefenseStep('ai-1')
    const creature = gameStore.getState().creatures.find((candidate) => candidate.id === 'creature-1')

    expect(result).toEqual({ ok: false, reason: '體力不足（需要 5，剩餘 3）。' })
    expect(creature?.health).toBe(20)
    expect(playerById('ai-1').stamina).toBe(3)
    expect(playerById('ai-1').turnEnded).toBe(false)
    expect(gameStore.getState().activePlayerId).toBe('ai-1')
    expect(gameStore.getState().attackPreview).toBeNull()
    expect(gameStore.getState().operation).toEqual({ type: 'idle' })
  })

  it('支援：相鄰威脅時攻擊成功並扣血', () => {
    load({
      players: [
        makeTestPlayer({ position: { row: 5, column: 3 } }),
        makeTestHuman({ position: { row: 5, column: 5 } }),
      ],
      creatures: [makeTestCreature({ position: { row: 5, column: 4 }, health: 20, maxHealth: 20 })],
      aiOrders: [makeSupportPlayerOrder({ maxDistance: 10 })],
    })

    const result = gameStore.runAiSupportStep('ai-1')
    const creature = gameStore.getState().creatures.find((candidate) => candidate.id === 'creature-1')

    expect(result.ok).toBe(true)
    expect(creature === undefined || creature.health < 20).toBe(true)
    expect(playerById('ai-1').turnEnded).toBe(false)
  })

  it('支援：目標死亡時命令 paused 並結束回合', () => {
    load({
      players: [
        makeTestPlayer(),
        makeTestHuman({ health: 0, position: { row: 5, column: 8 } }),
        makeTestHuman({ id: 'player-2', name: '玩家 2', position: { row: 9, column: 9 } }),
      ],
      aiOrders: [makeSupportPlayerOrder()],
    })

    const result = gameStore.runAiSupportStep('ai-1')
    const order = gameStore.getState().aiOrders?.find((candidate) => candidate.id === 'order-support')

    expect(result.ok).toBe(true)
    expect(order?.status).toBe('paused')
    expect(playerById('ai-1').turnEnded).toBe(true)
    expect(gameStore.getState().activePlayerId).toBe('player-2')
    expect(gameStore.getState().creatureTurnInProgress).toBe(false)
  })

  it('支援：沒有 active 命令時拒絕執行', () => {
    load({
      aiOrders: [makeSupportPlayerOrder({ status: 'paused' })],
    })

    expect(gameStore.runAiSupportStep('ai-1')).toEqual({ ok: false, reason: '目前無法執行 AI 支援回合。' })
    expect(playerById('ai-1').turnEnded).toBe(false)
    expect(gameStore.getState().activePlayerId).toBe('ai-1')
  })

  it('AI 攻擊不經 preview API，且不留下 attackPreview', () => {
    const previewSpy = vi.spyOn(gameStore, 'previewAttackTarget')
    load({
      creatures: [makeTestCreature({ health: 20, maxHealth: 20 })],
      aiOrders: [makeProtectBaseOrder()],
    })

    const defense = gameStore.runAiDefenseStep('ai-1')
    expect(defense.ok).toBe(true)
    expect(previewSpy).not.toHaveBeenCalled()
    expect(gameStore.getState().attackPreview).toBeNull()
    expect(gameStore.getState().operation).toEqual({ type: 'idle' })

    load({
      players: [
        makeTestPlayer({ position: { row: 5, column: 3 } }),
        makeTestHuman({ position: { row: 5, column: 5 } }),
      ],
      creatures: [makeTestCreature({ position: { row: 5, column: 4 }, health: 20, maxHealth: 20 })],
      aiOrders: [makeSupportPlayerOrder({ maxDistance: 10 })],
    })
    const support = gameStore.runAiSupportStep('ai-1')
    expect(support.ok).toBe(true)
    expect(previewSpy).not.toHaveBeenCalled()
    expect(gameStore.getState().attackPreview).toBeNull()
    previewSpy.mockRestore()
  })
})

describe('runFuzzyStep', () => {
  it('無興趣點時直接結束回合', () => {
    // 全地圖已探索（exploration fallback 也為 0）→ 迴圈退出
    const allCellIds = Array.from({ length: 121 }, (_, i) => `${Math.floor(i / 11)}-${i % 11}`)
    load({
      players: [
        makeTestPlayer({ position: { row: 5, column: 3 }, stamina: 20 }),
        makeTestHuman(),
      ],
      bases: [],
      visibility: { exploredCellIds: allCellIds, mode: 'fog' },
      aiOrders: [makeFuzzyOrder()],
    })
    const result = gameStore.runFuzzyStep('ai-1')
    expect(result.ok).toBe(false)
    expect(playerById('ai-1').position.column).toBe(3) // 未移動
  })

  it('非 AI、非其回合、無 active fuzzy 命令時拒絕', () => {
    load({
      players: [makeTestPlayer({ isAI: false }), makeTestHuman()],
      aiOrders: [makeFuzzyOrder()],
    })
    expect(gameStore.runFuzzyStep('ai-1')).toEqual({ ok: false, reason: '目前無法執行模糊策略回合。' })

    load({
      activePlayerId: 'player-1',
      aiOrders: [makeFuzzyOrder()],
    })
    expect(gameStore.runFuzzyStep('ai-1')).toEqual({ ok: false, reason: '目前無法執行模糊策略回合。' })

    load({
      aiOrders: [],
    })
    expect(gameStore.runFuzzyStep('ai-1')).toEqual({ ok: false, reason: '目前無法執行模糊策略回合。' })
  })
})
