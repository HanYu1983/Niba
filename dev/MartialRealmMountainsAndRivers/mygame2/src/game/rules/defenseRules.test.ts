import { describe, expect, it } from 'vitest'
import { getDefenseBuildRange, validateDefenseBuild } from './defenseRules'
import type { GameState, PlayerState } from '../types'

const player = (prestige: number): PlayerState => ({ id: 'p1', name: '玩家', position: { row: 2, column: 2 }, attributes: { armStrength: 8, constitution: 8, agility: 7, innerEnergy: 5, insight: 7 }, innerSkillIds: ['tuna-gong'], innerSkillId: 'tuna-gong', externalSkillIds: [], equippedExternalSkillIds: [], health: 20, maxHealth: 20, stamina: 5, maxStamina: 5, innerPower: 10, maxInnerPower: 10, prestige, money: 100, experience: 0, inventory: [], turnEnded: false })

const state = (currentPlayer: PlayerState): GameState => ({ map: { rows: 5, columns: 5, cells: Array.from({ length: 25 }, (_, index) => { const row = Math.floor(index / 5); const column = index % 5; return { id: `${row}-${column}`, row, column, terrain: row === 0 || column === 0 || row === 4 || column === 4 ? 'wall' : 'plain' } }) }, bases: [{ id: 'b1', name: '據點', position: { row: 2, column: 3 }, buildings: [], buildingMaterials: 100, maxBuildingMaterials: 100, health: 100, maxHealth: 100 }], defenseStructures: [], creatureNests: [], resourcePoints: [], itemPoints: [], players: [currentPlayer], creatures: [], activePlayerId: 'p1', round: 1, creatureActionLogs: [], attackPreview: null, externalSkillPreview: null, creatureTurnInProgress: false, activeCreatureId: null, operation: { type: 'idle' }, blockingModal: null })

describe('defenseRules requiredRank', () => {
  it('流民首領即可建造箭塔', () => {
    expect(validateDefenseBuild(state(player(0)), player(0), 'p1', 'b1', 'arrow-tower', { row: 2, column: 2 })).not.toContain('官階不足')
  })

  it('進階箭塔需要官階 3', () => {
    expect(validateDefenseBuild(state(player(240)), player(240), 'p1', 'b1', 'advanced-arrow-tower', { row: 2, column: 2 })).not.toContain('官階不足')
    expect(validateDefenseBuild(state(player(0)), player(0), 'p1', 'b1', 'advanced-arrow-tower', { row: 2, column: 2 })).toContain('官階不足')
  })

  it('瞭望塔需要官階 2，進階瞭望塔需要官階 4', () => {
    expect(validateDefenseBuild(state(player(80)), player(80), 'p1', 'b1', 'watchtower', { row: 2, column: 2 })).not.toContain('官階不足')
    expect(validateDefenseBuild(state(player(560)), player(560), 'p1', 'b1', 'advanced-watchtower', { row: 2, column: 2 })).not.toContain('官階不足')
    expect(validateDefenseBuild(state(player(240)), player(240), 'p1', 'b1', 'advanced-watchtower', { row: 2, column: 2 })).toContain('官階不足')
  })

  it('官階足夠可以通過官階驗證', () => {
    expect(validateDefenseBuild(state(player(200)), player(200), 'p1', 'b1', 'arrow-tower', { row: 2, column: 2 })).not.toContain('官階不足')
  })
})

describe('defenseRules 建造範圍隨官階增長', () => {
  // 大型地圖：據點在中央，方便測試遠距離建造格。
  const largeState = (currentPlayer: PlayerState): GameState => ({
    map: { rows: 30, columns: 30, cells: Array.from({ length: 30 * 30 }, (_, index) => { const row = Math.floor(index / 30); const column = index % 30; return { id: `${row}-${column}`, row, column, terrain: row === 0 || column === 0 || row === 29 || column === 29 ? 'wall' : 'plain' } }) },
    bases: [{ id: 'b1', name: '據點', position: { row: 15, column: 15 }, buildings: [], buildingMaterials: 1000, maxBuildingMaterials: 1000, health: 100, maxHealth: 100 }],
    defenseStructures: [], creatureNests: [], resourcePoints: [], itemPoints: [],
    players: [currentPlayer], creatures: [], activePlayerId: 'p1', round: 1, creatureActionLogs: [],
    attackPreview: null, externalSkillPreview: null, creatureTurnInProgress: false, activeCreatureId: null,
    operation: { type: 'idle' }, blockingModal: null,
  })

  it('getDefenseBuildRange：官階越高範圍越大', () => {
    expect(getDefenseBuildRange(1)).toBe(5)
    expect(getDefenseBuildRange(3)).toBe(7)
    expect(getDefenseBuildRange(6)).toBe(10)
  })

  it('官階 1（流民）只能建 5 格內', () => {
    const p = player(0)
    // 玩家須位於據點旁（相鄰）才能建造。
    const adjacent = { ...p, position: { row: 14, column: 15 } }
    // 距離 5：可建
    expect(validateDefenseBuild(largeState(adjacent), adjacent, 'p1', 'b1', 'barricade', { row: 10, column: 15 })).toBeNull()
    // 距離 6：超出範圍
    expect(validateDefenseBuild(largeState(adjacent), adjacent, 'p1', 'b1', 'barricade', { row: 9, column: 15 })).toContain('超出據點')
  })

  it('官階 4 可建到 8 格', () => {
    const p = player(560)
    const adjacent = { ...p, position: { row: 14, column: 15 } }
    // 距離 8：可建
    expect(validateDefenseBuild(largeState(adjacent), adjacent, 'p1', 'b1', 'barricade', { row: 7, column: 15 })).toBeNull()
    // 距離 9：超出
    expect(validateDefenseBuild(largeState(adjacent), adjacent, 'p1', 'b1', 'barricade', { row: 6, column: 15 })).toContain('超出據點')
  })
})
