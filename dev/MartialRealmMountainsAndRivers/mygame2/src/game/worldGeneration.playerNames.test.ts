import { describe, expect, it } from 'vitest'
import { createInitialPlayers } from './worldGeneration'
import { createGameState } from './worldSetup'
import type { Position } from './types'

describe('createInitialPlayers 名稱隨機', () => {
  const positions: Position[] = [
    { row: 1, column: 1 },
    { row: 2, column: 2 },
  ]

  it('換 seed 會產生不同玩家名稱', () => {
    const seedA = createInitialPlayers(positions, 100).map((p) => p.name)
    const seedB = createInitialPlayers(positions, 200).map((p) => p.name)
    expect(seedA).not.toEqual(seedB)
  })

  it('相同 seed 產生相同名稱（決定性）', () => {
    const first = createInitialPlayers(positions, 300).map((p) => p.name)
    const second = createInitialPlayers(positions, 300).map((p) => p.name)
    expect(first).toEqual(second)
  })

  it('同一局內玩家名稱不重複', () => {
    const names = createInitialPlayers(positions, 500).map((p) => p.name)
    expect(new Set(names).size).toBe(names.length)
  })

  it('不同 seed 第一位玩家名稱不同', () => {
    const names = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000].map((seed) =>
      createInitialPlayers(positions, seed)[0]?.name,
    )
    console.log('第一位玩家名稱:', names)
    expect(new Set(names).size).toBeGreaterThan(1)
  })

  it('不同 seed 第二位玩家名稱不同', () => {
    const names = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000].map((seed) =>
      createInitialPlayers(positions, seed)[1]?.name,
    )
    console.log('第二位玩家名稱:', names)
    expect(new Set(names).size).toBeGreaterThan(1)
  })

  it('完整 createGameState 流程：不同 seed 第一位玩家名稱不同', () => {
    const states = [100, 200, 300, 400, 500].map((seed) =>
      createGameState({ rows: 30, columns: 30, baseCount: 3, nestCount: 2, resourcePointCount: 4, itemPointCount: 4, playerCount: 2, explorationEventCount: 3, creatureCount: 4, ruinCount: 5, seed }),
    )
    const names = states.map((s) => s.players[0]?.name)
    expect(new Set(names).size).toBeGreaterThan(1)
  })

  it('相鄰 seed 也產生不同名稱（散列攪拌）', () => {
    const names = [6666666, 6666667, 6666668, 6666669, 6666670].map((seed) =>
      createInitialPlayers(positions, seed)[0]?.name,
    )
    console.log('相鄰 seed 第一位玩家名稱:', names)
    expect(new Set(names).size).toBeGreaterThan(1)
  })
})