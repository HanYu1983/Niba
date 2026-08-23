import { beforeEach, describe, expect, it } from 'vitest'
import { animateCreatureTurn, gameStore } from './gameStore'
import type { CreatureActionLog, CreatureState, GameState, PlayerState } from './types'

function makePlayer(overrides: Partial<PlayerState> = {}): PlayerState {
  const attributes = { armStrength: 8, constitution: 8, agility: 7, innerEnergy: 5, insight: 7 }
  return {
    id: 'player-1',
    name: '玩家 1',
    position: { row: 5, column: 5 },
    attributes,
    innerSkillIds: ['tuna-gong'],
    innerSkillId: 'tuna-gong',
    externalSkillIds: [],
    equippedExternalSkillIds: [],
    health: 24,
    maxHealth: 24,
    stamina: 7,
    maxStamina: 7,
    innerPower: 15,
    maxInnerPower: 15,
    prestige: 0,
    money: 0,
    experience: 0,
    inventory: [],
    turnEnded: false,
    ...overrides,
  }
}

function makeCreature(id: string, position: { row: number; column: number }): CreatureState {
  return makePlayer({
    id,
    name: `生物 ${id}`,
    position,
    attributes: { armStrength: 4, constitution: 6, agility: 3, innerEnergy: 2, insight: 1 },
    health: 18,
    maxHealth: 18,
  })
}

function makeGameState(overrides: Partial<GameState> = {}): GameState {
  return {
    map: {
      rows: 40,
      columns: 40,
      cells: Array.from({ length: 40 * 40 }, (_, index) => {
        const row = Math.floor(index / 40)
        const column = index % 40
        const isBorder = row === 0 || column === 0 || row === 39 || column === 39
        return { id: `${row}-${column}`, row, column, terrain: isBorder ? 'wall' : 'plain' }
      }),
    },
    bases: [],
    creatureNests: [],
    resourcePoints: [],
    itemPoints: [],
    players: [makePlayer()],
    creatures: [],
    activePlayerId: 'player-1',
    round: 1,
    creatureActionLogs: [],
    attackPreview: null,
    externalSkillPreview: null,
    creatureTurnInProgress: false,
    activeCreatureId: null,
    operation: { type: 'idle' },
    blockingModal: null,
    ...overrides,
  }
}

beforeEach(() => {
  gameStore.resetForTest()
})

describe('animateCreatureTurn', () => {
  it('沒有生物時直接結束生物回合', () => {
    const player = makePlayer({ stamina: 0 })
    gameStore.setStateForTest(makeGameState({ players: [player] }))

    animateCreatureTurn({
      creatures: [],
      players: [player],
      resourcePoints: [],
      logs: [],
    })

    const state = gameStore.getState()
    expect(state.creatureTurnInProgress).toBe(false)
    expect(state.activeCreatureId).toBeNull()
  })

  it('沒有既有生物時不會清除巢穴新生成的 Creature', () => {
    const spawned = makeCreature('spawned-1', { row: 6, column: 6 })
    animateCreatureTurn({
      creatures: [spawned],
      players: [makePlayer()],
      resourcePoints: [],
      logs: [{ creatureId: 'nest-1', creatureName: '巢穴', message: '巢穴生成了 Lv.1 怪物。' }],
      steps: [],
    })

    expect(gameStore.getState().creatures.map((creature) => creature.id)).toEqual(['spawned-1'])
  })

  it('沒有生物時仍會恢復玩家資源', () => {
    const player = makePlayer({ stamina: 0, health: 10, innerPower: 0 })
    gameStore.setStateForTest(makeGameState({ players: [player] }))

    animateCreatureTurn({
      creatures: [],
      players: [player],
      resourcePoints: [],
      logs: [],
    })

    const state = gameStore.getState()
    expect(state.players[0].stamina).toBe(state.players[0].maxStamina)
    expect(state.players[0].health).toBe(11)
    expect(state.players[0].innerPower).toBe(1)
    expect(state.players[0].turnEnded).toBe(false)
  })

  it('所有玩家死亡時會標記遊戲結束且不恢復死亡玩家', () => {
    const player = makePlayer({ health: 0, stamina: 0, innerPower: 0, turnEnded: true })
    gameStore.setStateForTest(makeGameState({ players: [player] }))

    animateCreatureTurn({
      creatures: [],
      players: [player],
      resourcePoints: [],
      logs: [],
    })

    const state = gameStore.getState()
    expect(state.gameOver).toBe(true)
    expect(state.players[0].health).toBe(0)
    expect(state.players[0].turnEnded).toBe(true)
  })

  it('只要有一個據點被摧毀時會標記遊戲結束', () => {
    const base1 = {
      id: 'base-1',
      name: '測試據點 1',
      position: { row: 5, column: 6 },
      buildings: [],
      buildingMaterials: 0,
      maxBuildingMaterials: 100,
      health: 1,
      maxHealth: 100,
      active: true,
    }
    const base2 = {
      id: 'base-2',
      name: '測試據點 2',
      position: { row: 8, column: 8 },
      buildings: [],
      buildingMaterials: 0,
      maxBuildingMaterials: 100,
      health: 100,
      maxHealth: 100,
      active: true,
    }
    const player = makePlayer({ stamina: 0 })

    // 只有其中一個據點被摧毀（base-1 失活，base-2 仍存活）。
    gameStore.setStateForTest(makeGameState({ players: [player], bases: [base1, base2] }))
    animateCreatureTurn({
      creatures: [],
      players: [player],
      bases: [{ ...base1, health: 0, active: false }, base2],
      resourcePoints: [],
      logs: [],
    })

    const state = gameStore.getState()
    expect(state.gameOver).toBe(true)
    expect(state.gameOverReason).toBe('any-base-destroyed')
  })

  it('一次性套用所有生物位置與行動記錄', () => {
    const creature1 = makeCreature('c1', { row: 3, column: 3 })
    const creature2 = makeCreature('c2', { row: 4, column: 4 })
    const player = makePlayer()
    gameStore.setStateForTest(
      makeGameState({
        players: [player],
        creatures: [creature1, creature2],
      }),
    )

    const logs: CreatureActionLog[] = [
      { creatureId: 'c1', creatureName: '生物 c1', message: 'c1 移動' },
      { creatureId: 'c2', creatureName: '生物 c2', message: 'c2 移動' },
    ]

    animateCreatureTurn({
      creatures: [
        { ...creature1, position: { row: 6, column: 6 } },
        { ...creature2, position: { row: 7, column: 7 } },
      ],
      players: [player],
      resourcePoints: [],
      logs,
    })

    // 一次性套用所有生物的最終狀態
    const state = gameStore.getState()
    expect(state.creatureTurnInProgress).toBe(false)
    expect(state.activeCreatureId).toBeNull()
    expect(state.creatures.find((c) => c.id === 'c1')?.position).toEqual({ row: 6, column: 6 })
    expect(state.creatures.find((c) => c.id === 'c2')?.position).toEqual({ row: 7, column: 7 })
    // 保留本回合所有生物的完整行動記錄，供玩家查看。
    expect(state.creatureActionLogs).toEqual(logs)
  })

  it('沒有 log 的生物不會影響最終行動記錄', () => {
    const creature1 = makeCreature('c1', { row: 3, column: 3 })
    const creature2 = makeCreature('c2', { row: 4, column: 4 })
    const player = makePlayer()
    gameStore.setStateForTest(
      makeGameState({
        players: [player],
        creatures: [creature1, creature2],
      }),
    )

    // c1 沒有 log，c2 有 log
    const logs: CreatureActionLog[] = [
      { creatureId: 'c2', creatureName: '生物 c2', message: 'c2 移動' },
    ]

    animateCreatureTurn({
      creatures: [
        { ...creature1, position: { row: 6, column: 6 } },
        { ...creature2, position: { row: 7, column: 7 } },
      ],
      players: [player],
      resourcePoints: [],
      logs,
    })

    // 一次性套用後，保留所有 log（c1 沒有 log 不影響結果）
    const state = gameStore.getState()
    expect(state.creatureActionLogs).toEqual(logs)
  })

  it('一次性套用後保留本回合所有攻擊記錄供玩家查看', () => {
    const creature1 = makeCreature('c1', { row: 3, column: 3 })
    const creature2 = makeCreature('c2', { row: 4, column: 4 })
    const player = makePlayer()
    gameStore.setStateForTest(
      makeGameState({
        players: [player],
        creatures: [creature1, creature2],
      }),
    )

    const logs: CreatureActionLog[] = [
      { creatureId: 'c1', creatureName: '生物 c1', message: 'c1 朝 玩家 1 攻擊，造成 5 點傷害。' },
      { creatureId: 'c2', creatureName: '生物 c2', message: 'c2 朝 玩家 1 攻擊，造成 3 點傷害。' },
    ]

    animateCreatureTurn({
      creatures: [
        { ...creature1, position: { row: 6, column: 6 } },
        { ...creature2, position: { row: 7, column: 7 } },
      ],
      players: [player],
      resourcePoints: [],
      logs,
    })

    const state = gameStore.getState()
    expect(state.creatureTurnInProgress).toBe(false)
    // 一次性套用後保留所有攻擊記錄，彈窗保持開啟直到玩家確認。
    expect(state.creatureActionLogs).toEqual(logs)
  })

  it('資源點被擊破後在第一隻生物動畫步驟立即消失', () => {
    const creature = makeCreature('c1', { row: 3, column: 3 })
    const player = makePlayer()
    const resourcePoint = {
      id: 'resource-point-1',
      name: '測試資源點',
      position: { row: 3, column: 4 },
      ownerBaseId: 'base-1',
      materialIncome: 10,
      lastCollectedRound: null,
      health: 1,
      maxHealth: 30,
    }
    gameStore.setStateForTest(
      makeGameState({
        players: [player],
        creatures: [creature],
        resourcePoints: [resourcePoint],
      }),
    )

    animateCreatureTurn({
      creatures: [{ ...creature, position: creature.position }],
      players: [player],
      resourcePoints: [],
      logs: [],
    })

    expect(gameStore.getState().resourcePoints).toEqual([])
  })

  it('一次性套用所有生物的最終位置與狀態', () => {
    const creature1 = makeCreature('c1', { row: 3, column: 3 })
    const creature2 = makeCreature('c2', { row: 4, column: 4 })
    const player = makePlayer()
    const firstStepPlayer = { ...player, health: player.health - 5 }

    gameStore.setStateForTest(makeGameState({ players: [player], creatures: [creature1, creature2] }))

    animateCreatureTurn({
      creatures: [
        { ...creature1, position: { row: 5, column: 5 } },
        { ...creature2, position: { row: 6, column: 6 } },
      ],
      players: [firstStepPlayer],
      resourcePoints: [],
      logs: [],
      steps: [
        {
          creature: { ...creature1, position: { row: 4, column: 4 } },
          players: [firstStepPlayer],
          resourcePoints: [],
          defenseStructures: [],
          logs: [],
        },
        {
          creature: { ...creature2, position: { row: 6, column: 6 } },
          players: [firstStepPlayer],
          resourcePoints: [],
          defenseStructures: [],
          logs: [],
        },
      ],
    })

    // 一次性套用最終狀態：使用 result.creatures 的位置，而非中間 steps
    const state = gameStore.getState()
    expect(state.activeCreatureId).toBeNull()
    // 玩家狀態經 recoverLivingPlayers 處理（恢復體力、生命、內力）
    expect(state.players[0].stamina).toBe(state.players[0].maxStamina)
    expect(state.players[0].turnEnded).toBe(false)
    expect(state.creatures.find((creature) => creature.id === 'c1')?.position).toEqual({ row: 5, column: 5 })
    expect(state.creatures.find((creature) => creature.id === 'c2')?.position).toEqual({ row: 6, column: 6 })
  })

  it('回合結算的被動建料收入不被 Creature 動畫覆蓋', () => {
    const base = {
      id: 'base-1',
      name: '守護據點 1',
      position: { row: 5, column: 6 },
      buildings: [{ id: 'building-1-board', type: 'board', name: '告示牌', description: '', constructionCost: 0 }],
      buildingMaterials: 0,
      maxBuildingMaterials: 100,
      health: 450,
      maxHealth: 450,
    }
    const resourcePoint = {
      id: 'resource-point-1',
      name: '資源點 1',
      position: { row: 2, column: 2 },
      ownerBaseId: 'base-1',
      materialIncome: 10,
      lastCollectedRound: null,
      health: 30,
      maxHealth: 30,
    }
    const creature = makeCreature('c1', { row: 3, column: 3 })
    const player = makePlayer({ stamina: 0, health: 10 })

    // 模擬 endPlayerTurn 已寫入被動建料收入（10 * 0.25 = 2.5）。
    gameStore.setStateForTest(
      makeGameState({
        players: [player],
        bases: [{ ...base, buildingMaterials: 2.5 }],
        resourcePoints: [resourcePoint],
        creatures: [creature],
      }),
    )

    // Creature 動畫的 result.bases 是攻擊前的舊 snapshot（buildingMaterials: 0）。
    animateCreatureTurn({
      creatures: [{ ...creature, position: creature.position }],
      players: [player],
      bases: [{ ...base, buildingMaterials: 0 }],
      resourcePoints: [resourcePoint],
      logs: [],
    })

    // 被動建料收入應保留，不被舊 snapshot 覆蓋。
    expect(gameStore.getState().bases[0].buildingMaterials).toBe(2.5)
  })

  it('Creature 攻擊造成的據點血量變動仍保留', () => {
    const base = {
      id: 'base-1',
      name: '守護據點 1',
      position: { row: 5, column: 6 },
      buildings: [{ id: 'building-1-board', type: 'board', name: '告示牌', description: '', constructionCost: 0 }],
      buildingMaterials: 5,
      maxBuildingMaterials: 100,
      health: 450,
      maxHealth: 450,
    }
    const creature = makeCreature('c1', { row: 3, column: 3 })
    const player = makePlayer({ stamina: 0, health: 10 })

    gameStore.setStateForTest(
      makeGameState({
        players: [player],
        bases: [base],
        creatures: [creature],
      }),
    )

    // Creature 攻擊後據點血量降至 400，但建料維持 5。
    animateCreatureTurn({
      creatures: [{ ...creature, position: creature.position }],
      players: [player],
      bases: [{ ...base, health: 400 }],
      resourcePoints: [],
      logs: [],
    })

    const finalBase = gameStore.getState().bases[0]
    // 血量變動保留
    expect(finalBase.health).toBe(400)
    // 建料不被舊 snapshot 覆蓋
    expect(finalBase.buildingMaterials).toBe(5)
  })

  it('回光玉在玩家死亡時復活至 30% 血並清除所有 debuff', () => {
    const player = makePlayer({
      health: 0,
      stamina: 0,
      innerPower: 0,
      turnEnded: true,
      buffs: [
        { id: 'return-light-1', definitionId: 'return-light', sourceId: 'return-light-jade', remainingRounds: null },
        { id: 'burn-1', definitionId: 'scarlet-flame-burning', sourceId: 'creature', remainingRounds: 2 },
      ],
    })
    gameStore.setStateForTest(makeGameState({ players: [player] }))

    animateCreatureTurn({
      creatures: [],
      players: [player],
      resourcePoints: [],
      logs: [],
    })

    const state = gameStore.getState()
    // 復活至 30% 血（maxHealth 24 * 0.3 = 7.2 → 7）
    expect(state.players[0].health).toBeGreaterThan(0)
    expect(state.players[0].health).toBe(Math.floor(24 * 0.3))
    // 清除所有 debuff（含回光 Buff 本身）
    expect(state.players[0].buffs ?? []).toHaveLength(0)
    // 不觸發遊戲結束
    expect(state.gameOver).toBe(false)
  })

  it('沒有回光 Buff 的死亡玩家不會復活', () => {
    const player = makePlayer({
      health: 0,
      stamina: 0,
      innerPower: 0,
      turnEnded: true,
    })
    gameStore.setStateForTest(makeGameState({ players: [player] }))

    animateCreatureTurn({
      creatures: [],
      players: [player],
      resourcePoints: [],
      logs: [],
    })

    const state = gameStore.getState()
    expect(state.players[0].health).toBe(0)
    expect(state.gameOver).toBe(true)
  })

  it('怪物吃掉探索點後會補回一個新的探索事件', () => {
    const creature = makeCreature('c1', { row: 3, column: 3 })
    const player = makePlayer()
    const base = {
      id: 'base-1',
      name: '測試據點',
      position: { row: 5, column: 6 },
      buildings: [{ id: 'building-1-board', type: 'board', name: '告示牌', description: '', constructionCost: 0 }],
      buildingMaterials: 0,
      maxBuildingMaterials: 100,
      health: 450,
      maxHealth: 450,
      active: true,
    }
    const eatenEvent = {
      id: 'exploration-event-1',
      type: 'lost-caravan' as const,
      name: '被吃掉的探索事件',
      description: '測試事件',
      position: { row: 3, column: 4 },
      status: 'available' as const,
      discovered: false,
      expiresAtRound: null,
    }
    gameStore.setStateForTest(
      makeGameState({
        players: [player],
        creatures: [creature],
        bases: [base],
        explorationEvents: [eatenEvent],
      }),
    )

    // 怪物移動到探索點上，result.explorationEvents 不含被吃掉的事件。
    animateCreatureTurn({
      creatures: [{ ...creature, position: eatenEvent.position }],
      players: [player],
      bases: [base],
      resourcePoints: [],
      explorationEvents: [],
      logs: [{ creatureId: 'c1', creatureName: '生物 c1', message: 'c1 吃掉了探索事件。' }],
    })

    const state = gameStore.getState()
    // 被吃掉的事件已移除。
    expect(state.explorationEvents?.find((event) => event.id === 'exploration-event-1')).toBeUndefined()
    // 補回一個新的探索事件（數量維持 1）。
    expect(state.explorationEvents ?? []).toHaveLength(1)
    expect(state.explorationEvents?.[0]?.id).not.toBe('exploration-event-1')
  })
})
