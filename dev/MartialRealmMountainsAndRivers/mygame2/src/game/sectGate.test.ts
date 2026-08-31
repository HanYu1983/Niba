import { describe, expect, it } from 'vitest'
import { createGameState } from './worldSetup'
import { createSectGates } from './worldGeneration'
import { martialSchoolCatalog } from './catalogs/martialSchoolCatalog'

function makeMap(rows = 40, columns = 40) {
  return {
    rows,
    columns,
    cells: Array.from({ length: rows * columns }, (_, index) => {
      const row = Math.floor(index / columns)
      const column = index % columns
      const isBorder = row === 0 || column === 0 || row === rows - 1 || column === columns - 1
      return { id: `${row}-${column}`, row, column, terrain: isBorder ? 'wall' as const : 'plain' as const }
    }),
  }
}

describe('門派據點生成', () => {
  it('依 sectGateCount 生成指定數量門派', () => {
    const g1 = createSectGates(makeMap(), 3, 100, [])
    expect(g1).toHaveLength(3)
    expect(g1.every((gate) => gate.level === 1 && gate.experience === 0)).toBe(true)
  })

  it('每次生成皆從目錄隨機選取門派，允許重複', () => {
    const gates = createSectGates(makeMap(), martialSchoolCatalog.length + 2, 200, [])
    expect(gates.length).toBe(martialSchoolCatalog.length + 2)
    const schoolIds = gates.map((gate) => gate.schoolId)
    // 所有門派都來自目錄。
    expect(schoolIds.every((id) => martialSchoolCatalog.some((school) => school.id === id))).toBe(true)
    // 生成數量超過門派總數時必定出現重複。
    expect(new Set(schoolIds).size).toBe(martialSchoolCatalog.length)
  })

  it('createGameState 預設生成 3 個門派據點', () => {
    const state = createGameState({ rows: 30, columns: 30, baseCount: 3, nestCount: 1, resourcePointCount: 4, itemPointCount: 4, playerCount: 1, explorationEventCount: 3, creatureCount: 4, ruinCount: 10, seed: 20260803, sectGateCount: 3 })
    expect(state.sectGates ?? []).toHaveLength(3)
    expect(new Set((state.sectGates ?? []).map((gate) => gate.schoolId)).size).toBe(3)
  })

  it('sectGateCount 設為 0 時不生成門派據點', () => {
    const state = createGameState({ rows: 30, columns: 30, baseCount: 3, nestCount: 1, resourcePointCount: 4, itemPointCount: 4, playerCount: 1, explorationEventCount: 3, creatureCount: 4, ruinCount: 10, seed: 20260803, sectGateCount: 0 })
    expect(state.sectGates ?? []).toHaveLength(0)
  })

  it('門派據點與廢墟不重疊在同一格', () => {
    const state = createGameState({ rows: 40, columns: 40, baseCount: 3, nestCount: 4, resourcePointCount: 6, itemPointCount: 6, playerCount: 2, explorationEventCount: 6, creatureCount: 6, ruinCount: 15, seed: 20260803, sectGateCount: 3 })
    const gateKeys = new Set((state.sectGates ?? []).map((gate) => `${gate.position.row}-${gate.position.column}`))
    const ruinKeys = (state.ruins ?? []).map((ruin) => `${ruin.position.row}-${ruin.position.column}`)

    const overlapping = ruinKeys.filter((key) => gateKeys.has(key))
    expect(overlapping).toEqual([])
  })

  it('門派據點避開水地形', () => {
    const map = {
      rows: 40,
      columns: 40,
      cells: Array.from({ length: 40 * 40 }, (_, index) => {
        const row = Math.floor(index / 40)
        const column = index % 40
        const isBorder = row === 0 || column === 0 || row === 39 || column === 39
        // 中央區域設為水域，其餘為草地。
        const terrain = isBorder ? 'wall' as const : (row >= 15 && row <= 25 && column >= 15 && column <= 25) ? 'water' as const : 'plain' as const
        return { id: `${row}-${column}`, row, column, terrain }
      }),
    }
    const gates = createSectGates(map, 3, 100, [])
    expect(gates.length).toBeGreaterThan(0)
    for (const gate of gates) {
      const cell = map.cells.find((c) => c.row === gate.position.row && c.column === gate.position.column)
      expect(cell?.terrain).not.toBe('water')
    }
  })
})