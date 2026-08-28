import { describe, expect, it } from 'vitest'
import type { GameState, MapState } from '../../types'
import {
  makeAiTestState,
  makePlainMap,
  makeProtectBaseOrder,
  makeTestCreature,
  makeTestHuman,
  makeTestPlayer,
} from '../../testHelpers/aiTestFixtures'
import { chooseDefenseAction } from '../../aiDefenseRules'
import { defenseActionToAiAction } from '../aiAction'
import { validateAiAction, validateAiDefenseDecision } from './validateAiAction'

function makeMapWithWalls(walls: Array<{ row: number; column: number }>): MapState {
  const base = makePlainMap()
  const wallKeys = new Set(walls.map((wall) => `${wall.row}-${wall.column}`))
  return {
    ...base,
    cells: base.cells.map((cell) => wallKeys.has(cell.id) ? { ...cell, terrain: 'wall' as const } : cell),
  }
}

describe('既有四種決策輸出經 Adapter 後皆通過驗證', () => {
  const order = makeProtectBaseOrder()

  it('attack：相鄰威脅的攻擊決策有效', () => {
    const state = makeAiTestState({ players: [makeTestPlayer()], creatures: [makeTestCreature()] })
    const decision = chooseDefenseAction(state, 'ai-1', order)
    expect(decision.type).toBe('attack')

    const action = defenseActionToAiAction(state, 'ai-1', decision)
    expect(validateAiAction(state, action)).toEqual({ valid: true })
  })

  it('move：返回防守半徑的移動決策有效', () => {
    const state = makeAiTestState({
      players: [makeTestPlayer({ position: { row: 1, column: 1 }, stamina: 20, maxStamina: 20 })],
      creatures: [],
    })
    const decision = chooseDefenseAction(state, 'ai-1', order)
    expect(decision.type).toBe('move')

    const action = defenseActionToAiAction(state, 'ai-1', decision)
    expect(action.type).toBe('move')
    expect(action.reason).toBe(decision.type === 'move' ? decision.reason : '')
    expect(validateAiAction(state, action)).toEqual({ valid: true })
  })

  it('hold：無威脅待命有效', () => {
    const state = makeAiTestState({ players: [makeTestPlayer()], creatures: [] })
    const decision = chooseDefenseAction(state, 'ai-1', order)

    const action = defenseActionToAiAction(state, 'ai-1', decision)
    expect(action.type).toBe('hold')
    expect(validateAiAction(state, action)).toEqual({ valid: true })
  })

  it('end-turn：命令暫停時結束回合有效', () => {
    const state = makeAiTestState({ players: [makeTestPlayer()], creatures: [makeTestCreature()] })
    const decision = chooseDefenseAction(state, 'ai-1', { ...order, status: 'paused' })

    const action = defenseActionToAiAction(state, 'ai-1', decision)
    expect(action.type).toBe('end-turn')
    expect(validateAiAction(state, action)).toEqual({ valid: true })
  })
})

describe('validateAiAction 拒絕失效行動', () => {
  it('attack：目標已死亡 → 無效；目標不在相鄰格 → 無效', () => {
    const deadTargetState = makeAiTestState({
      players: [makeTestPlayer()],
      creatures: [makeTestCreature({ health: 0 })],
    })
    const deadAttack = defenseActionToAiAction(deadTargetState, 'ai-1', { type: 'attack', targetId: 'creature-1', targetType: 'creature' })
    expect(validateAiAction(deadTargetState, deadAttack)).toMatchObject({ valid: false })

    const farState = makeAiTestState({
      players: [makeTestPlayer()],
      creatures: [makeTestCreature({ position: { row: 8, column: 8 } })],
    })
    const farAttack = defenseActionToAiAction(farState, 'ai-1', { type: 'attack', targetId: 'creature-1', targetType: 'creature' })
    expect(validateAiAction(farState, farAttack)).toEqual({ valid: false, reason: '目標不在攻擊距離內。' })
  })

  it('move：體力不可達的目的地 → 無效', () => {
    const state = makeAiTestState({ players: [makeTestPlayer({ stamina: 2, maxStamina: 2 })] })
    const action = defenseActionToAiAction(state, 'ai-1', { type: 'move', position: { row: 9, column: 5 }, reason: 'return-to-defense-radius' })
    // (9,5) 距 (5,5) 4 步 × 每格成本 2 = 8 > 體力 2。
    const result = validateAiAction(state, action)
    expect(result.valid).toBe(false)
    expect(result.valid === false ? result.reason : '').toMatch(/^目的地不可達：/)
  })

  it('move：被其他玩家佔住的格子與被牆隔離的格子 → 無效', () => {
    const blocker = makeTestHuman({ position: { row: 5, column: 6 } })
    const blockedState = makeAiTestState({
      players: [makeTestPlayer({ stamina: 2, maxStamina: 2 }), blocker],
    })
    // 直接穿過佔位者需 2 步，但佔位格不可停留；繞路成本超出體力。
    const blockedMove = defenseActionToAiAction(blockedState, 'ai-1', { type: 'move', position: { row: 5, column: 7 }, reason: 'intercept-threat' })
    const blockedResult = validateAiAction(blockedState, blockedMove)
    expect(blockedResult.valid).toBe(false)
    expect(blockedResult.valid === false ? blockedResult.reason : '').toMatch(/目的地不可達：/)

    const walledState: GameState = {
      ...makeAiTestState({ players: [makeTestPlayer()] }),
      map: makeMapWithWalls([{ row: 0, column: 0 }, { row: 0, column: 1 }, { row: 0, column: 2 }, { row: 1, column: 0 }, { row: 1, column: 2 }, { row: 2, column: 0 }, { row: 2, column: 1 }, { row: 2, column: 2 }]),
    }
    const pocketMove = defenseActionToAiAction(walledState, 'ai-1', { type: 'move', position: { row: 1, column: 1 }, reason: 'return-to-defense-radius' })
    const pocketResult = validateAiAction(walledState, pocketMove)
    expect(pocketResult.valid).toBe(false)
    expect(pocketResult.valid === false ? pocketResult.reason : '').toMatch(/目的地不可達：/)
  })

  it('行動者不存在或已死亡 → 無效', () => {
    const state = makeAiTestState({ players: [makeTestPlayer()], creatures: [] })

    const missing = defenseActionToAiAction(state, 'ghost', { type: 'hold-position', reason: 'no-threat' })
    expect(validateAiAction(state, missing)).toEqual({ valid: false, reason: '行動者不存在。' })

    const dead = defenseActionToAiAction(state, 'ai-dead', { type: 'hold-position', reason: 'no-threat' })
    const stateWithDeadActor: GameState = {
      ...state,
      players: [...state.players, makeTestPlayer({ id: 'ai-dead', health: 0 })],
    }
    expect(validateAiAction(stateWithDeadActor, dead)).toEqual({ valid: false, reason: '行動者已無法行動。' })
  })

  it('不是該玩家的回合 → 無效', () => {
    const state = makeAiTestState({ players: [makeTestPlayer(), makeTestHuman()], activePlayerId: 'player-1' })
    const hold = defenseActionToAiAction(state, 'ai-1', { type: 'hold-position', reason: 'no-threat' })
    expect(validateAiAction(state, hold)).toEqual({ valid: false, reason: '目前不是玩家回合。' })
  })
})

describe('collect 與 build 的最小驗證', () => {
    it('build：據點存在 → 有效；不存在 → 無效', () => {
    const state = makeAiTestState({ players: [makeTestPlayer()] })
    const buildAction = { type: 'build' as const, actor: { id: 'ai-1', kind: 'player' as const }, baseId: 'base-1', buildingType: 'building-type-board', reason: 'construction-plan' }
    expect(validateAiAction(state, buildAction)).toEqual({ valid: true })

    const missingBase = { ...buildAction, baseId: 'base-missing' }
    expect(validateAiAction(state, missingBase)).toEqual({ valid: false, reason: '建築目標據點不存在。' })
  })

  it('collect：目標存活 → 有效；已死亡 → 無效', () => {
    const state = makeAiTestState({ players: [makeTestPlayer()], creatures: [makeTestCreature()] })
    const collect = { type: 'collect' as const, actor: { id: 'ai-1', kind: 'player' as const }, target: { id: 'creature-1', kind: 'creature' as const, position: { row: 5, column: 6 } }, reason: 'scavenge' }
    expect(validateAiAction(state, collect)).toEqual({ valid: true })

    const staleCollect = { ...collect, target: { ...collect.target, id: 'creature-missing' } }
    expect(validateAiAction(state, staleCollect)).toEqual({ valid: false, reason: '採集目標不存在或已失效。' })
  })
})

describe('體力驗證', () => {
  it('attack：體力不足 → 無效', () => {
    const state = makeAiTestState({
      players: [makeTestPlayer({ stamina: 2, maxStamina: 20 })],
      creatures: [makeTestCreature()],
    })
    const attack = { type: 'attack' as const, actor: { id: 'ai-1', kind: 'player' as const }, target: { id: 'creature-1', kind: 'creature' as const, position: { row: 5, column: 6 } }, reason: 'attack' }
    expect(validateAiAction(state, attack)).toEqual({ valid: false, reason: '體力不足（需要 5，剩餘 2）。' })
  })

  it('build：體力不足 → 無效', () => {
    const state = makeAiTestState({
      players: [makeTestPlayer({ stamina: 1, maxStamina: 20 })],
    })
    const build = { type: 'build' as const, actor: { id: 'ai-1', kind: 'player' as const }, baseId: 'base-1', buildingType: 'building-type-board', reason: 'build' }
    expect(validateAiAction(state, build)).toEqual({ valid: false, reason: '體力不足（需要 3，剩餘 1）。' })
  })

  it('hold / end-turn：不消耗體力 → 體力 0 也有效', () => {
    const state = makeAiTestState({
      players: [makeTestPlayer({ stamina: 0, maxStamina: 20 })],
    })
    const hold = { type: 'hold' as const, actor: { id: 'ai-1', kind: 'player' as const }, reason: 'wait' }
    expect(validateAiAction(state, hold)).toEqual({ valid: true })
    const endTurn = { type: 'end-turn' as const, actor: { id: 'ai-1', kind: 'player' as const }, reason: 'done' }
    expect(validateAiAction(state, endTurn)).toEqual({ valid: true })
  })
})

describe('validateAiDefenseDecision（切片 I：store step 執行前的單一把關）', () => {
  const order = makeProtectBaseOrder()

  it('合法決策（攻擊相鄰威脅／移動到可達格）通過', () => {
    const state = makeAiTestState({ players: [makeTestPlayer()], creatures: [makeTestCreature()] })
    expect(validateAiDefenseDecision(state, 'ai-1', { type: 'attack', targetId: 'creature-1', targetType: 'creature' })).toEqual({ valid: true })
    expect(validateAiDefenseDecision(state, 'ai-1', { type: 'move', position: { row: 9, column: 5 }, reason: 'return-to-defense-radius' })).toEqual({ valid: true })
  })

  it('目標死亡或距離不符的攻擊決策被拒，原因與 §9.2 一致', () => {
    const deadTargetState = makeAiTestState({
      players: [makeTestPlayer()],
      creatures: [makeTestCreature({ health: 0 })],
    })
    expect(validateAiDefenseDecision(deadTargetState, 'ai-1', { type: 'attack', targetId: 'creature-1', targetType: 'creature' }))
      .toEqual({ valid: false, reason: '攻擊目標不存在或已死亡。' })

    const farState = makeAiTestState({
      players: [makeTestPlayer()],
      creatures: [makeTestCreature({ position: { row: 10, column: 10 } })],
    })
    expect(validateAiDefenseDecision(farState, 'ai-1', { type: 'attack', targetId: 'creature-1', targetType: 'creature' }))
      .toEqual({ valid: false, reason: '目標不在攻擊距離內。' })
  })

  it('不可達目的地的移動決策被拒；非當前回合拒絕行動', () => {
    const walledState = makeAiTestState({
      players: [makeTestPlayer()],
      map: makeMapWithWalls([{ row: 0, column: 0 }, { row: 0, column: 1 }, { row: 0, column: 2 }, { row: 1, column: 0 }, { row: 1, column: 2 }, { row: 2, column: 0 }, { row: 2, column: 1 }, { row: 2, column: 2 }]),
    })
    const pocketResult = validateAiDefenseDecision(walledState, 'ai-1', { type: 'move', position: { row: 1, column: 1 }, reason: 'return-to-defense-radius' })
    expect(pocketResult.valid).toBe(false)
    expect(pocketResult.valid === false ? pocketResult.reason : '').toMatch(/目的地不可達：/)

    const notMyTurn = makeAiTestState({ players: [makeTestPlayer(), makeTestHuman()], activePlayerId: 'player-1' })
    expect(validateAiDefenseDecision(notMyTurn, 'ai-1', { type: 'hold-position', reason: 'no-threat' }))
      .toEqual({ valid: false, reason: '目前不是玩家回合。' })
  })

  it('決策層驗證與 Adapter 輸出一致：chooseDefenseAction 的實際輸出必過驗證（零行為變化保證）', () => {
    const state = makeAiTestState({ players: [makeTestPlayer()], creatures: [makeTestCreature()] })
    const decision = chooseDefenseAction(state, 'ai-1', order)
    expect(validateAiDefenseDecision(state, 'ai-1', decision).valid).toBe(true)
  })
})
