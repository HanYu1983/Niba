import { describe, expect, it } from 'vitest'
import { createDebugGameState, createGameState } from './worldSetup'
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
    expect(state.creatures).toHaveLength(7)
    expect(state.bases.every((base) => base.health === 150 && base.maxHealth === 150)).toBe(true)
    expect(new Set(state.creatures.map((creature) => creature.behaviorType))).toEqual(new Set(['scavenger', 'hunter', 'sieger', 'wanderer', 'roamer']))

    expect(isAdjacent(player.position, state.bases[0].position)).toBe(true)
    expect(isAdjacent(player.position, state.resourcePoints[0].position)).toBe(true)
    expect(isAdjacent(player.position, state.creatures[0].position)).toBe(true)
    expect(new Set(state.creatures.map((creature) => creature.schoolId))).toEqual(new Set([
      'frost-water', 'golden-body', 'swift-wind', 'scarlet-flame', 'earth-mountain', 'void-spirit', 'hundred-poison',
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
    // 測試用玩家已學會所有外功（含破空掌），但不預設裝備（避免超出裝備格位上限）。
    expect(player.externalSkillIds).toContain('sky-breaking-palm')
    expect(player.externalSkillIds.length).toBeGreaterThan(1)
    expect(player.equippedExternalSkillIds).toEqual([])
    expect(player.innerSkillIds.length).toBeGreaterThan(1)
    expect(state.bases[0].buildings.some((building) => building.type === 'board')).toBe(true)
    expect(state.bases[0].buildings.some((building) => building.type === 'wall')).toBe(false)
    // 貿易市場不預建，須由玩家自行建造以觸發全局靈氣。
    expect(state.bases[0].buildings.some((building) => building.type === 'trade-market')).toBe(false)
    // 全部建築（除牆與貿易市場）：含 12 座門派武館。
    expect(state.bases[0].buildings).toHaveLength(22)
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
    expect(state.sectGates ?? []).toHaveLength(12)
    expect(new Set((state.sectGates ?? []).map((gate) => gate.schoolId))).toEqual(new Set([
      'golden-body', 'swift-wind', 'scarlet-flame', 'frost-water', 'earth-mountain', 'void-spirit',
      'hundred-poison', 'sharp-edge', 'misty-rain', 'blazing-sun', 'yellow-earth', 'ghost-shadow',
    ]))
    expect((state.sectGates ?? []).every((gate) => gate.level === 1 && gate.experience === 0)).toBe(true)
  })

  it('提供可測試三重共振的便利配置（玩家站水域並配置火系目標）', () => {
    const state = createDebugGameState()
    const player = state.players[0]
    const fireCreature = state.creatures.find((creature) => creature.schoolId === 'scarlet-flame')
    const playerTerrain = state.map.cells.find((cell) => cell.row === player.position.row && cell.column === player.position.column)?.terrain
    const fireTerrain = fireCreature ? state.map.cells.find((cell) => cell.row === fireCreature.position.row && cell.column === fireCreature.position.column)?.terrain : undefined

    // Debug 狀態包含完整功法清單，方便手動選擇符合相生循環的內功與外功。
    expect(state.players[0].innerSkillIds).toContain('earth-mountain-inner')
    expect(state.players[0].externalSkillIds).toContain('frost-water-external-damage')
    // 目標為火系生物（外功水克火）
    expect(fireCreature?.schoolId).toBe('scarlet-flame')
    // 玩家起始位於水域（外功水共鳴地形）；赤炎妖也在水域，移動一步即可站在相鄰水域格攻擊它。
    expect(playerTerrain).toBe('water')
    expect(fireTerrain).toBe('water')
    // 兩者距離 2（玩家一步踏到火旁水域，第二步即可攻擊）
    const manhattan = Math.abs(player.position.row - fireCreature!.position.row) + Math.abs(player.position.column - fireCreature!.position.column)
    expect(manhattan).toBeLessThanOrEqual(2)
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
