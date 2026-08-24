import { describe, expect, it } from 'vitest'
import type { GameState, MapCell, MapState, PlayerState } from '../../types'
import {
  makePlainMap,
  makeTestCreature,
  makeTestHuman,
  makeTestNest,
  makeTestPlayer,
} from '../../testHelpers/aiTestFixtures'
import { manhattanDistance } from './distance'
import { collectReachableCells } from './reachablePositions'
import {
  getHostileActorId,
  getHostileActorPosition,
  isHostileActorStillValid,
  listHostileActors,
} from './targetDiscovery'

function makeMapWithWalls(walls: Array<{ row: number; column: number }>, rows = 7, columns = 7): MapState {
  const wallKeys = new Set(walls.map((wall) => `${wall.row}-${wall.column}`))
  return {
    rows,
    columns,
    cells: Array.from({ length: rows * columns }, (_, index) => {
      const row = Math.floor(index / columns)
      const column = index % columns
      const terrain: MapCell['terrain'] = wallKeys.has(`${row}-${column}`) ? 'wall' : 'plain'
      return { id: `${row}-${column}`, row, column, terrain }
    }),
  }
}

function makeStateWith(overrides: Partial<GameState>): GameState {
  const base: GameState = {
    map: makePlainMap(),
    bases: [],
    defenseStructures: [],
    ruins: [],
    creatureNests: [],
    resourcePoints: [],
    itemPoints: [],
    explorationEvents: [],
    players: [],
    creatures: [],
    activePlayerId: '',
    round: 1,
    creatureActionLogs: [],
    attackPreview: null,
    externalSkillPreview: null,
    repairPreview: null,
    creatureTurnInProgress: false,
    activeCreatureId: null,
    operation: { type: 'idle' },
    blockingModal: null,
    sharedWarehouse: [],
    sharedEquipmentWarehouse: [],
    aiOrders: [],
    aiConstructionPlans: [],
    explorationTriggerChance: 0,
  }
  return { ...base, ...overrides }
}

describe('manhattanDistance', () => {
  it('計算兩點間的曼哈頓距離（含負向座標差）', () => {
    expect(manhattanDistance({ row: 1, column: 1 }, { row: 4, column: 5 })).toBe(7)
    expect(manhattanDistance({ row: 4, column: 5 }, { row: 1, column: 1 })).toBe(7)
    expect(manhattanDistance({ row: 3, column: 3 }, { row: 3, column: 3 })).toBe(0)
  })
})

describe('listHostileActors', () => {
  it('只列出存活的生物與巢穴，並標記來源類型', () => {
    const aliveCreature = makeTestCreature()
    const deadCreature = makeTestCreature({ id: 'creature-2', health: 0 })
    const aliveNest = makeTestNest()
    const deadNest = makeTestNest({ id: 'nest-2', health: 0 })

    const actors = listHostileActors(makeStateWith({
      creatures: [aliveCreature, deadCreature],
      creatureNests: [aliveNest, deadNest],
    }))

    expect(actors.map(getHostileActorId)).toEqual(['creature-1', 'nest-1'])
    expect(actors[0]).toMatchObject({ sourceType: 'creature' })
    expect(actors[1]).toMatchObject({ sourceType: 'nest' })
    expect(actors.map(getHostileActorPosition)).toEqual([
      aliveCreature.position,
      aliveNest.position,
    ])
  })

  it('isHostileActorStillValid 檢查目標存在且存活', () => {
    const state = makeStateWith({
      creatures: [makeTestCreature()],
      creatureNests: [makeTestNest()],
    })

    expect(isHostileActorStillValid(state, 'creature', 'creature-1')).toBe(true)
    expect(isHostileActorStillValid(state, 'nest', 'nest-1')).toBe(true)
    expect(isHostileActorStillValid(state, 'creature', 'missing')).toBe(false)
    expect(isHostileActorStillValid(state, 'nest', 'missing')).toBe(false)
  })

  it('isHostileActorStillValid 對已死亡目標回傳 false', () => {
    const state = makeStateWith({
      creatures: [makeTestCreature({ health: 0 })],
      creatureNests: [makeTestNest({ health: 0 })],
    })

    expect(isHostileActorStillValid(state, 'creature', 'creature-1')).toBe(false)
    expect(isHostileActorStillValid(state, 'nest', 'nest-1')).toBe(false)
  })
})

describe('collectReachableCells', () => {
  function findCell(cells: ReturnType<typeof collectReachableCells>, row: number, column: number) {
    return cells.find((cell) => cell.position.row === row && cell.position.column === column)
  }

  it('開闊平原：包含原地（cost 0）與體力範圍內的格子，排除超出體力的格子', () => {
    // 平原每格體力成本 2。
    const actor: PlayerState = makeTestPlayer({ position: { row: 3, column: 3 }, stamina: 4, maxStamina: 4 })
    const cells = collectReachableCells(makeStateWith({ players: [actor] }), actor)

    expect(findCell(cells, 3, 3)).toMatchObject({ cost: 0 })
    expect(findCell(cells, 3, 4)).toMatchObject({ cost: 2 })
    expect(findCell(cells, 3, 5)).toMatchObject({ cost: 4 })
    expect(findCell(cells, 3, 6)).toBeUndefined()
  })

  it('牆與被牆完全包圍的孤立區域不會出現在結果中', () => {
    const walls = [
      { row: 0, column: 0 }, { row: 0, column: 1 }, { row: 0, column: 2 },
      { row: 1, column: 0 }, { row: 1, column: 2 },
      { row: 2, column: 0 }, { row: 2, column: 1 }, { row: 2, column: 2 },
    ]
    const actor: PlayerState = makeTestPlayer({ position: { row: 5, column: 5 }, stamina: 99, maxStamina: 99 })
    const state = makeStateWith({ map: makeMapWithWalls(walls), players: [actor] })
    const cells = collectReachableCells(state, actor)

    expect(findCell(cells, 1, 1)).toBeUndefined()
    for (const wall of walls) {
      expect(findCell(cells, wall.row, wall.column)).toBeUndefined()
    }
    expect(findCell(cells, 5, 5)).toBeDefined()
  })

  it('被其他玩家佔據的格子不可停留；繞路成本超過體力時對側格子不可達', () => {
    const actor: PlayerState = makeTestPlayer({ id: 'ai-1', position: { row: 3, column: 3 }, stamina: 2, maxStamina: 2 })
    const blocker = makeTestHuman({ position: { row: 3, column: 4 } })
    const cells = collectReachableCells(makeStateWith({ players: [actor, blocker] }), actor)

    expect(findCell(cells, 3, 4)).toBeUndefined()
    expect(findCell(cells, 3, 5)).toBeUndefined()

    // 繞路（上→右→右→下）共 4 步 × 每格 2 = 成本 8。
    const patientActor: PlayerState = { ...actor, stamina: 8, maxStamina: 8 }
    const widerCells = collectReachableCells(
      makeStateWith({ players: [patientActor, blocker] }),
      patientActor,
    )
    expect(findCell(widerCells, 3, 5)).toMatchObject({ cost: 8 })
  })
})
