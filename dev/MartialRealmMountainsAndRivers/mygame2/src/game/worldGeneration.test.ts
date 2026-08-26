import { describe, expect, it } from 'vitest'
import {
  createMapCells,
  createRandomBases,
  createCreatureNests,
  createRandomPositions,
  createItemPoints,
  createResourcePoints,
  createRoamerCreatures,
  createInitialPlayers,
  createRuins,
  replenishInteractionPoint,
  getRandomFreeInteractionPosition,
} from './worldGeneration'
import type { GameState, MapState, Position } from './types'
import { isSamePosition } from './types'

const SEED = 20260803

function createMap(rows = 20, columns = 20, seed = SEED): MapState {
  return {
    rows,
    columns,
    cells: createMapCells(rows, columns, seed, 0.2),
  }
}

describe('createMapCells', () => {
  it('產生指定數量的 cell', () => {
    const cells = createMapCells(10, 12, SEED)
    expect(cells).toHaveLength(120)
  })

  it('邊界格為 wall 地形', () => {
    const cells = createMapCells(5, 5, SEED)
    expect(cells[0]?.terrain).toBe('wall')
    expect(cells[4]?.terrain).toBe('wall')
    expect(cells[24]?.terrain).toBe('wall')
  })

  it('相同 seed 產生決定性結果', () => {
    const first = createMapCells(8, 8, SEED)
    const second = createMapCells(8, 8, SEED)
    expect(first).toEqual(second)
  })

  it('地形權重影響地形分布', () => {
    // 全部權重集中在荒漠，非邊界格應幾乎全為 desert。
    const cells = createMapCells(20, 20, SEED, 1, {
      plain: 0,
      forest: 0,
      water: 0,
      mountain: 0,
      desert: 100,
    })
    const interior = cells.filter((cell) => cell.terrain !== 'wall')
    expect(interior.length).toBeGreaterThan(0)
    expect(interior.every((cell) => cell.terrain === 'desert')).toBe(true)
  })

  it('權重為 0 的地形不會出現', () => {
    const cells = createMapCells(20, 20, SEED, 1, {
      plain: 0,
      forest: 0,
      water: 0,
      mountain: 0,
      desert: 100,
    })
    expect(cells.some((cell) => cell.terrain === 'water')).toBe(false)
    expect(cells.some((cell) => cell.terrain === 'forest')).toBe(false)
    expect(cells.some((cell) => cell.terrain === 'plain')).toBe(false)
    expect(cells.some((cell) => cell.terrain === 'mountain')).toBe(false)
  })
})

describe('createRandomBases', () => {
  it('產生指定數量的據點', () => {
    const map = createMap(40, 40)
    const bases = createRandomBases(map, 5, SEED)
    expect(bases).toHaveLength(5)
  })

  it('據點位置互不重疊且保持最小距離', () => {
    const map = createMap(40, 40)
    const bases = createRandomBases(map, 5, SEED)
    for (let i = 0; i < bases.length; i += 1) {
      for (let j = i + 1; j < bases.length; j += 1) {
        const distance =
          Math.abs(bases[i].position.row - bases[j].position.row) +
          Math.abs(bases[i].position.column - bases[j].position.column)
        expect(distance).toBeGreaterThanOrEqual(8)
      }
    }
  })

  it('每個據點初始包含告示牌建築', () => {
    const map = createMap(40, 40)
    const bases = createRandomBases(map, 3, SEED)
    for (const base of bases) {
      expect(base.buildings).toHaveLength(1)
      expect(base.buildings[0]?.id).toContain('board')
    }
  })

  it('據點城市名稱不重複', () => {
    const map = createMap(80, 80)
    const bases = createRandomBases(map, 8, SEED)
    expect(new Set(bases.map((base) => base.name)).size).toBe(bases.length)
  })

  it('據點避開水地形', () => {
    const map = createMap(40, 40)
    const waterKeys = new Set(
      map.cells.filter((cell) => cell.terrain === 'water').map((cell) => `${cell.row}-${cell.column}`),
    )
    const bases = createRandomBases(map, 5, SEED)
    expect(bases.length).toBeGreaterThan(0)
    for (const base of bases) {
      expect(waterKeys.has(`${base.position.row}-${base.position.column}`)).toBe(false)
    }
  })
})

describe('createRandomPositions', () => {
  it('排除指定位置', () => {
    const map = createMap(20, 20)
    const excluded: Position[] = [{ row: 1, column: 1 }]
    const positions = createRandomPositions(map, 5, SEED, excluded)
    for (const position of positions) {
      expect(isSamePosition(position, excluded[0])).toBe(false)
    }
  })

  it('數量超過可用格時退回不可重疊規則', () => {
    const map = createMap(5, 5)
    const positions = createRandomPositions(map, 9, SEED)
    expect(positions.length).toBeGreaterThan(0)
  })

  it('不選 wall 地形', () => {
    const map = createMap(10, 10)
    const positions = createRandomPositions(map, 5, SEED)
    for (const position of positions) {
      const cell = map.cells.find((cell) => cell.row === position.row && cell.column === position.column)
      expect(cell?.terrain).not.toBe('wall')
    }
  })
})

describe('createCreatureNests', () => {
  it('產生指定數量的巢穴', () => {
    const map = createMap(40, 40)
    const nests = createCreatureNests(map, 3, SEED, [])
    expect(nests).toHaveLength(3)
  })

  it('巢穴初始生命與最大生命一致', () => {
    const map = createMap(40, 40)
    const nests = createCreatureNests(map, 2, SEED, [])
    for (const nest of nests) {
      expect(nest.health).toBe(nest.maxHealth)
      expect(nest.maxHealth).toBe(120)
    }
  })

  it('巢穴隨機生成流派與行為類型', () => {
    const map = createMap(40, 40)
    const nests = createCreatureNests(map, 6, SEED, [])
    for (const nest of nests) {
      expect(nest.schoolId).toBeDefined()
      expect(nest.behaviorType).toBeDefined()
    }
  })

  it('巢穴優先生成在流派親和地形', () => {
    const map = createMap(40, 40)
    const nests = createCreatureNests(map, 6, SEED, [])
    // 五行對應：每個門派皆傾向生成在其五行對應的地形（含同五行的多流派）。
    const affinity: Record<string, string> = {
      'golden-body': 'mountain',
      'sharp-edge': 'mountain',
      'swift-wind': 'forest',
      'hundred-poison': 'forest',
      'scarlet-flame': 'desert',
      'blazing-sun': 'desert',
      'frost-water': 'water',
      'misty-rain': 'water',
      'earth-mountain': 'plain',
      'yellow-earth': 'plain',
      'void-spirit': 'plain',
      'ghost-shadow': 'plain',
    }
    const matched = nests.filter((nest) => {
      const cell = map.cells.find((candidate) => candidate.row === nest.position.row && candidate.column === nest.position.column)
      return cell?.terrain === affinity[nest.schoolId ?? 'void-spirit']
    })
    expect(matched.length).toBeGreaterThan(0)
  })

  it('相同 seed 產生決定性的巢穴流派', () => {
    const map = createMap(40, 40)
    const first = createCreatureNests(map, 3, SEED, [])
    const second = createCreatureNests(map, 3, SEED, [])
    expect(first.map((nest) => nest.schoolId)).toEqual(second.map((nest) => nest.schoolId))
    expect(first.map((nest) => nest.behaviorType)).toEqual(second.map((nest) => nest.behaviorType))
  })
})

describe('createItemPoints', () => {
  it('產生指定數量的道具點', () => {
    const map = createMap(40, 40)
    const points = createItemPoints(map, 4, SEED, [])
    expect(points).toHaveLength(4)
  })

  it('道具點初始 itemId 為 null', () => {
    const map = createMap(40, 40)
    const points = createItemPoints(map, 3, SEED, [])
    for (const point of points) {
      expect(point.itemId).toBeNull()
    }
  })
})

describe('createResourcePoints', () => {
  it('據點為空時回傳空陣列', () => {
    const map = createMap(40, 40)
    expect(createResourcePoints(map, [], 10, SEED)).toEqual([])
  })

  it('依據點數量分配資源點', () => {
    const map = createMap(40, 40)
    const bases = createRandomBases(map, 2, SEED)
    const points = createResourcePoints(map, bases, 6, SEED)
    expect(points).toHaveLength(6)
    for (const point of points) {
      expect(bases.some((base) => base.id === point.ownerBaseId)).toBe(true)
    }
  })
})

describe('createRoamerCreatures', () => {
  it('產生指定數量的游蕩 Creature', () => {
    const map = createMap(40, 40)
    const creatures = createRoamerCreatures(map, 3, SEED, [])
    expect(creatures).toHaveLength(3)
  })

  it('游蕩 Creature 行為類型為 roamer', () => {
    const map = createMap(40, 40)
    const creatures = createRoamerCreatures(map, 2, SEED, [])
    for (const creature of creatures) {
      expect(creature.behaviorType).toBe('roamer')
    }
  })
})

describe('createInitialPlayers', () => {
  it('第一位玩家為當前回合，其他玩家等待行動', () => {
    const positions: Position[] = [{ row: 1, column: 1 }, { row: 2, column: 2 }]
    const players = createInitialPlayers(positions)
    expect(players[0]?.turnEnded).toBe(false)
    expect(players[1]?.turnEnded).toBe(false)
  })

  it('玩家初始沒有外功', () => {
    const players = createInitialPlayers([{ row: 1, column: 1 }])
    expect(players[0]?.externalSkillIds).toEqual([])
    expect(players[0]?.equippedExternalSkillIds).toEqual([])
  })

  it('玩家初始持有兩個療傷藥與一個聚氣丹', () => {
    const players = createInitialPlayers([{ row: 1, column: 1 }])
    expect(players[0]?.inventory).toEqual(expect.arrayContaining([
      { itemId: 'heal-wound-medicine', quantity: 2 },
      { itemId: 'gather-qi-pill', quantity: 1 },
    ]))
  })
})

describe('createRuins', () => {
  it('產生的廢墟名稱不重複', () => {
    const map = createMap(40, 40)
    const ruins = createRuins(map, 12, SEED, [])
    const names = ruins.map((ruin) => ruin.name)
    expect(new Set(names).size).toBe(names.length)
  })

  it('廢墟點避開水地形', () => {
    const map = createMap(40, 40)
    const waterKeys = new Set(
      map.cells.filter((cell) => cell.terrain === 'water').map((cell) => `${cell.row}-${cell.column}`),
    )
    const ruins = createRuins(map, 12, SEED, [])
    expect(ruins.length).toBeGreaterThan(0)
    for (const ruin of ruins) {
      expect(waterKeys.has(`${ruin.position.row}-${ruin.position.column}`)).toBe(false)
    }
  })

  it('createRandomPositions 不會生成在已被佔用的格子上', () => {
    const map = createMap(20, 20)
    const excluded: Position[] = [{ row: 10, column: 10 }, { row: 12, column: 12 }]
    const positions = createRandomPositions(map, 5, SEED, excluded)

    expect(positions.some((position) => isSamePosition(position, excluded[0]))).toBe(false)
    expect(positions.some((position) => isSamePosition(position, excluded[1]))).toBe(false)
  })
})

describe('getRandomFreeInteractionPosition', () => {
  it('避開已佔用位置', () => {
    const map = createMap(10, 10)
    const state = {
      map,
      bases: [],
      resourcePoints: [],
      players: [],
      creatures: [],
      creatureNests: [],
      itemPoints: [],
      explorationEvents: [],
    } as unknown as GameState
    const position = getRandomFreeInteractionPosition(state, SEED)
    expect(position).not.toBeNull()
  })

  it('地圖全滿時回傳 null', () => {
    const map = createMap(3, 3)
    const occupied = map.cells.filter((cell) => cell.terrain !== 'wall')
    const state = {
      map,
      bases: [],
      resourcePoints: [],
      players: occupied.map((cell) => ({ position: { row: cell.row, column: cell.column } })),
      creatures: [],
      creatureNests: [],
      itemPoints: [],
      explorationEvents: [],
    } as unknown as GameState
    expect(getRandomFreeInteractionPosition(state, SEED)).toBeNull()
  })
})

describe('replenishInteractionPoint', () => {
  it('移除道具點後不再補回道具點', () => {
    const map = createMap(20, 20)
    const state = {
      map,
      bases: [],
      resourcePoints: [],
      players: [],
      creatures: [],
      creatureNests: [],
      itemPoints: [],
      explorationEvents: [],
      round: 5,
    } as unknown as GameState
    const next = replenishInteractionPoint(state, true, null)
    expect(next.itemPoints).toHaveLength(0)
  })

  it('無空格時不改變狀態', () => {
    const map = createMap(3, 3)
    const occupied = map.cells.filter((cell) => cell.terrain !== 'wall')
    const state = {
      map,
      bases: [],
      resourcePoints: [],
      players: occupied.map((cell) => ({ position: { row: cell.row, column: cell.column } })),
      creatures: [],
      creatureNests: [],
      itemPoints: [],
      explorationEvents: [],
      round: 1,
    } as unknown as GameState
    const next = replenishInteractionPoint(state, true, null)
    expect(next).toBe(state)
  })
})
