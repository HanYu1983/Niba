import { describe, expect, it } from 'vitest'
import { createDebugGameState, createGameState } from './gameStore'
import { isAdjacent } from './types'

describe('createDebugGameState', () => {
  it('建立小型固定地圖', () => {
    const state = createDebugGameState()

    expect(state.map.rows).toBe(21)
    expect(state.map.columns).toBe(21)
    expect(state.map.cells).toHaveLength(441)
    expect(state.map.cells.find((cell) => cell.row === 10 && cell.column === 6)?.terrain).toBe('forest')
    expect(state.map.cells.find((cell) => cell.row === 10 && cell.column === 18)?.terrain).toBe('desert')
  })

  it('啟用戰爭迷霧並初始化玩家可見範圍', () => {
    const state = createDebugGameState()

    expect(state.visibility?.mode).toBe('fog')
    // 玩家周遭可見格已初始化（非空），其餘為迷霧。
    expect(state.visibility?.exploredCellIds.length).toBeGreaterThan(0)
    expect(state.visibility?.exploredCellIds.length).toBeLessThan(state.map.cells.length)
  })

  it('將主要互動物件放在玩家附近', () => {
    const state = createDebugGameState()
    const player = state.players[0]

    expect(player.position).toEqual({ row: 10, column: 10 })
    expect(state.bases).toHaveLength(2)
    expect(state.resourcePoints).toHaveLength(2)
    expect(state.itemPoints).toHaveLength(1)
    expect(state.creatureNests).toHaveLength(1)
    expect(state.creatures).toHaveLength(6)
    expect(state.bases.every((base) => base.health === 150 && base.maxHealth === 150)).toBe(true)
    expect(new Set(state.creatures.map((creature) => creature.behaviorType))).toEqual(new Set(['scavenger', 'hunter', 'sieger', 'wanderer', 'roamer']))

    expect(isAdjacent(player.position, state.bases[0].position)).toBe(true)
    expect(isAdjacent(player.position, state.resourcePoints[0].position)).toBe(true)
    expect(isAdjacent(player.position, state.creatures[0].position)).toBe(true)
    expect(new Set(state.creatures.map((creature) => creature.schoolId))).toEqual(new Set([
      'frost-water', 'golden-body', 'swift-wind', 'scarlet-flame', 'earth-mountain', 'void-spirit',
    ]))

    const occupiedPositions = [
      ...state.bases.map((base) => base.position),
      ...state.resourcePoints.map((resourcePoint) => resourcePoint.position),
      ...state.itemPoints.map((itemPoint) => itemPoint.position),
      ...state.creatureNests.map((nest) => nest.position),
      ...state.creatures.map((creature) => creature.position),
    ]
    const adjacentPositions = [
      { row: player.position.row - 1, column: player.position.column },
      { row: player.position.row + 1, column: player.position.column },
      { row: player.position.row, column: player.position.column - 1 },
      { row: player.position.row, column: player.position.column + 1 },
    ]
    expect(adjacentPositions.some((position) =>
      !occupiedPositions.some((occupied) =>
        occupied.row === position.row && occupied.column === position.column,
      ),
    )).toBe(true)
  })

  it('提供可直接測試的玩家資源與外功', () => {
    const state = createDebugGameState()
    const player = state.players[0]

    expect(player.inventory).toEqual([])
    expect(player.equipmentInventory).toEqual([])
    expect(player.equippedExternalSkillIds).toEqual(['sky-breaking-palm'])
    expect(state.bases[0].buildings.some((building) => building.type === 'board')).toBe(true)
    expect(state.bases[0].buildings.some((building) => building.type === 'wall')).toBe(false)
    // 貿易市場不預建，須由玩家自行建造以觸發全局靈氣。
    expect(state.bases[0].buildings.some((building) => building.type === 'trade-market')).toBe(false)
    expect(state.bases[0].buildings).toHaveLength(16)
    expect(state.bases[0].buildings.every((building) => building.level === 6)).toBe(true)
    expect(state.bases[0].buildingMaterials).toBeGreaterThan(0)
  })

  it('所有 Debug 互動物件都使用唯一格子', () => {
    const state = createDebugGameState()
    const positions = [
      ...state.bases.map((base) => base.position),
      ...state.resourcePoints.map((resourcePoint) => resourcePoint.position),
      ...state.itemPoints.map((itemPoint) => itemPoint.position),
      ...state.creatureNests.map((nest) => nest.position),
      ...state.creatures.map((creature) => creature.position),
      ...(state.sectGates ?? []).map((gate) => gate.position),
    ]
    const positionKeys = positions.map((position) => `${position.row}-${position.column}`)

    expect(new Set(positionKeys).size).toBe(positionKeys.length)
  })

  it('包含不同門派的門派據點供測試（不再有等級差異）', () => {
    const state = createDebugGameState()
    expect(state.sectGates ?? []).toHaveLength(6)
    expect(new Set((state.sectGates ?? []).map((gate) => gate.schoolId))).toEqual(new Set([
      'golden-body', 'swift-wind', 'scarlet-flame', 'frost-water', 'earth-mountain', 'void-spirit',
    ]))
    expect((state.sectGates ?? []).every((gate) => gate.level === 1 && gate.experience === 0)).toBe(true)
  })
})

describe('createGameState', () => {
  it('預設設定會生成巢穴', () => {
    const state = createGameState()

    expect(state.creatureNests).toHaveLength(2)
  })

  it('一般地圖的互動物件不會共用同一格', () => {
    const state = createGameState({
      rows: 30,
      columns: 30,
      baseCount: 3,
      nestCount: 6,
      resourcePointCount: 12,
      itemPointCount: 10,
      playerCount: 1,
      explorationEventCount: 3,
      creatureCount: 2,
      ruinCount: 10,
      seed: 20260803,
    })
    const positions = [
      ...state.bases.map((base) => base.position),
      ...state.resourcePoints.map((resourcePoint) => resourcePoint.position),
      ...state.itemPoints.map((itemPoint) => itemPoint.position),
      ...(state.explorationEvents ?? []).map((event) => event.position),
      ...state.creatureNests.map((nest) => nest.position),
      ...state.players.map((player) => player.position),
      ...state.creatures.map((creature) => creature.position),
      ...(state.ruins ?? []).map((ruin) => ruin.position),
      ...(state.sectGates ?? []).map((gate) => gate.position),
    ]
    const positionKeys = positions.map((position) => `${position.row}-${position.column}`)

    expect(new Set(positionKeys).size).toBe(positionKeys.length)
  })

  it('小型高密度地圖仍會生成要求數量的巢穴', () => {
    const state = createGameState({
      rows: 15,
      columns: 15,
      baseCount: 1,
      nestCount: 4,
      resourcePointCount: 4,
      itemPointCount: 4,
      playerCount: 1,
      explorationEventCount: 3,
      creatureCount: 2,
      ruinCount: 10,
      seed: 20260803,
    })

    expect(state.creatureNests).toHaveLength(4)
  })
})
