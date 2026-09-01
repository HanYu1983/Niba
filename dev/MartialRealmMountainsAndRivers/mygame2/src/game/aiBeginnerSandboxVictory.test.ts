import { beforeEach, describe, expect, it } from 'vitest'
import { BUILTIN_TEMPLATES } from './mapTemplates'
import { gameStore } from './gameStore'

describe('AI 玩家：入門沙盒地圖通關能力', () => {
  beforeEach(() => {
    gameStore.resetForTest()
  })

  it('應能在有限回合內摧毀所有妖物巢穴並取得勝利', () => {
    const template = BUILTIN_TEMPLATES.find((candidate) => candidate.id === 'standard')
    if (!template) throw new Error('找不到入門地圖模板。')

    gameStore.startGame({
      ...template.settings,
      seed: 20260902,
      aiPlayerCount: 1,
      explorationEventCount: 0,
      explorationTriggerChance: 0,
    })

    const startedState = gameStore.getState()
    const aiPlayer = startedState.players.find((player) => player.isAI)
    if (!aiPlayer) throw new Error('入門地圖沒有建立 AI 玩家。')
    gameStore.setStateForTest({
      ...startedState,
      players: [aiPlayer],
      activePlayerId: aiPlayer.id,
    })

    const maxRounds = 200
    let aiTurns = 0

    while (!gameStore.getState().gameWon && !gameStore.getState().gameOver && aiTurns < maxRounds) {
      const state = gameStore.getState()
      const activePlayer = state.players.find((player) => player.id === state.activePlayerId)
      if (!activePlayer) throw new Error(`找不到當前玩家 ${state.activePlayerId}。`)

      expect(activePlayer.isAI).toBe(true)
      const result = gameStore.runFuzzyStep(activePlayer.id)
      expect(result.ok, result.ok ? undefined : result.reason).toBe(true)
      aiTurns++
    }

    const finalState = gameStore.getState()
    expect({
      gameWon: finalState.gameWon,
      gameOver: finalState.gameOver,
      remainingNests: finalState.creatureNests.length,
      aiTurns,
    }).toEqual({
      gameWon: true,
      gameOver: false,
      remainingNests: 0,
      aiTurns: expect.any(Number),
    })
  })

  it('簡單難度：沒有初始生物時應能摧毀唯一妖物巢穴', () => {
    const template = BUILTIN_TEMPLATES.find((candidate) => candidate.id === 'standard')
    if (!template) throw new Error('找不到入門地圖模板。')

    gameStore.startGame({
      ...template.settings,
      rows: 15,
      columns: 15,
      seed: 20260903,
      nestCount: 1,
      creatureCount: 0,
      resourcePointCount: 0,
      itemPointCount: 0,
      ruinCount: 0,
      sectGateCount: 0,
      aiPlayerCount: 1,
      explorationEventCount: 0,
      explorationTriggerChance: 0,
    })

    const startedState = gameStore.getState()
    const aiPlayer = startedState.players.find((player) => player.isAI)
    if (!aiPlayer) throw new Error('簡單難度沒有建立 AI 玩家。')
    gameStore.setStateForTest({
      ...startedState,
      players: [aiPlayer],
      activePlayerId: aiPlayer.id,
      creatureNests: startedState.creatureNests.map((nest) => ({ ...nest, spawnChance: 0 })),
      nestHealthRegenPercent: 0,
    })

    const maxTurns = 200
    let aiTurns = 0
    while (!gameStore.getState().gameWon && !gameStore.getState().gameOver && aiTurns < maxTurns) {
      const state = gameStore.getState()
      const activePlayer = state.players.find((player) => player.id === state.activePlayerId)
      if (!activePlayer) throw new Error(`找不到當前玩家 ${state.activePlayerId}。`)

      expect(activePlayer.isAI).toBe(true)
      const result = gameStore.runFuzzyStep(activePlayer.id)
      expect(result.ok, result.ok ? undefined : result.reason).toBe(true)
      aiTurns++
    }

    const finalState = gameStore.getState()
    expect({
      gameWon: finalState.gameWon,
      gameOver: finalState.gameOver,
      remainingNests: finalState.creatureNests.length,
      aiTurns,
    }).toEqual({
      gameWon: true,
      gameOver: false,
      remainingNests: 0,
      aiTurns: expect.any(Number),
    })
  })
})