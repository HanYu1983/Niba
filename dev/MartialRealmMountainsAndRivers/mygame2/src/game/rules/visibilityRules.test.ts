import { describe, expect, it } from 'vitest'
import { getCellVisibility, getPlayerVisibleCellIds, getPlayerVisionRange, updatePlayerVisibility } from './visibilityRules'
import type { GameState, PlayerState } from '../types'
import { getMaxHealth, getMaxInnerPower, getMaxStamina } from './playerStatsRules'

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
    health: getMaxHealth(attributes),
    maxHealth: getMaxHealth(attributes),
    stamina: getMaxStamina(attributes),
    maxStamina: getMaxStamina(attributes),
    innerPower: getMaxInnerPower(attributes),
    maxInnerPower: getMaxInnerPower(attributes),
    prestige: 0,
    money: 0,
    experience: 0,
    inventory: [],
    turnEnded: false,
    ...overrides,
  }
}

function makeState(overrides: Partial<GameState> = {}): GameState {
  const rows = 15
  const columns = 15
  return {
    map: {
      rows,
      columns,
      cells: Array.from({ length: rows * columns }, (_, index) => {
        const row = Math.floor(index / columns)
        const column = index % columns
        return { id: `${row}-${column}`, row, column, terrain: 'plain' as const }
      }),
    },
    visibility: { exploredCellIds: [], mode: 'fog' },
    bases: [],
    defenseStructures: [],
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
    repairPreview: null,
    creatureTurnInProgress: false,
    activeCreatureId: null,
    operation: { type: 'idle' },
    blockingModal: null,
    ...overrides,
  }
}

describe('visibility rules', () => {
  it('玩家周圍的格子可見，遠處格子未探索', () => {
    const state = makeState()
    const near = state.map.cells.find((cell) => cell.id === '5-6')!
    const far = state.map.cells.find((cell) => cell.id === '0-0')!

    expect(getCellVisibility(state, 'player-1', near)).toBe('visible')
    expect(getCellVisibility(state, 'player-1', far)).toBe('unexplored')
  })

  it('合作模式下所有存活玩家共享視野', () => {
    const state = makeState({
      players: [
        makePlayer({ id: 'player-1', position: { row: 2, column: 2 } }),
        makePlayer({ id: 'player-2', position: { row: 12, column: 12 } }),
      ],
    })
    const remoteCell = state.map.cells.find((cell) => cell.id === '12-11')!

    expect(getCellVisibility(state, 'player-1', remoteCell)).toBe('visible')
    expect(getCellVisibility(state, 'player-2', remoteCell)).toBe('visible')
  })

  it('鳴鑼符揭示的怪物所在格顯示為可見', () => {
    const state = makeState({
      revealedCreatureCellIds: ['0-0', '14-14'],
      revealedCreatureUntilRound: 2,
    })
    const revealedCell = state.map.cells.find((cell) => cell.id === '0-0')!
    const otherCell = state.map.cells.find((cell) => cell.id === '1-1')!

    expect(getCellVisibility(state, 'player-1', revealedCell)).toBe('visible')
    expect(getCellVisibility(state, 'player-1', otherCell)).toBe('unexplored')
  })

  it('瞭望塔提供額外可見範圍', () => {
    const state = makeState({
      defenseStructures: [{
        id: 'watchtower-1',
        type: 'watchtower',
        name: '瞭望塔',
        description: '提供視野',
        icon: '🗼',
        constructionCost: 20,
        requiredRank: 2,
        maxHealth: 80,
        healthBonus: 0,
        blocksMovement: false,
        providesVision: true,
        visionRange: 3,
        attackRange: 0,
        attackDamage: 0,
        position: { row: 5, column: 9 },
        ownerBaseId: 'base-1',
        health: 80,
      }],
    })
    const visibleIds = getPlayerVisibleCellIds(state, 'player-1')

    expect(visibleIds.has('5-12')).toBe(true)
  })

  it('小型瞭望臺提供 2 格視野', () => {
    const state = makeState({
      defenseStructures: [{
        id: 'small-watchtower-1',
        type: 'small-watchtower',
        name: '小型瞭望臺',
        description: '提供視野',
        icon: '🗼',
        constructionCost: 0,
        requiredRank: 0,
        maxHealth: 30,
        healthBonus: 0,
        blocksMovement: true,
        providesVision: true,
        visionRange: 2,
        attackRange: 0,
        attackDamage: 0,
        position: { row: 5, column: 9 },
        ownerBaseId: '',
        health: 30,
      }],
    })
    const visibleIds = getPlayerVisibleCellIds(state, 'player-1')

    // 小型瞭望臺提供 2 格視野
    expect(visibleIds.has('5-11')).toBe(true)
    // 3 格外不可見
    expect(visibleIds.has('5-12')).toBe(false)
  })

  it('小型箭塔提供 1 格視野', () => {
    const state = makeState({
      defenseStructures: [{
        id: 'small-arrow-tower-1',
        type: 'small-arrow-tower',
        name: '小型箭塔',
        description: '提供視野',
        icon: '🏹',
        constructionCost: 0,
        requiredRank: 0,
        maxHealth: 40,
        healthBonus: 0,
        blocksMovement: true,
        providesVision: true,
        visionRange: 1,
        attackRange: 1,
        attackDamage: 5,
        position: { row: 5, column: 9 },
        ownerBaseId: '',
        health: 40,
      }],
    })
    const visibleIds = getPlayerVisibleCellIds(state, 'player-1')

    // 小型箭塔提供 1 格視野
    expect(visibleIds.has('5-10')).toBe(true)
    // 2 格外不可見
    expect(visibleIds.has('5-11')).toBe(false)
  })

  it('所有防禦建築（即使 providesVision=false）至少提供自身一格視野', () => {
    const state = makeState({
      defenseStructures: [{
        id: 'barricade-1',
        type: 'barricade',
        name: '木柵',
        description: '阻擋通行',
        icon: '🪵',
        constructionCost: 20,
        requiredRank: 1,
        maxHealth: 25,
        healthBonus: 0,
        blocksMovement: true,
        providesVision: false,
        visionRange: 1,
        attackRange: 0,
        attackDamage: 0,
        position: { row: 5, column: 9 },
        ownerBaseId: 'base-1',
        health: 25,
      }],
    })
    const visibleIds = getPlayerVisibleCellIds(state, 'player-1')

    // 自身格與相鄰一格可見
    expect(visibleIds.has('5-9')).toBe(true)
    expect(visibleIds.has('5-10')).toBe(true)
    // 兩格外不可見
    expect(visibleIds.has('5-11')).toBe(false)
  })

  it('視野範圍由 visionRange 參數決定', () => {
    const state = makeState({
      defenseStructures: [{
        id: 'custom-tower-1',
        type: 'watchtower',
        name: '自訂瞭望塔',
        description: '提供視野',
        icon: '🗼',
        constructionCost: 30,
        requiredRank: 2,
        maxHealth: 40,
        healthBonus: 0,
        blocksMovement: false,
        providesVision: true,
        visionRange: 4,
        attackRange: 0,
        attackDamage: 0,
        position: { row: 5, column: 9 },
        ownerBaseId: 'base-1',
        health: 40,
      }],
    })
    const visibleIds = getPlayerVisibleCellIds(state, 'player-1')

    // visionRange=4 時，4 格內可見、5 格外不可見
    expect(visibleIds.has('5-13')).toBe(true)
    expect(visibleIds.has('5-14')).toBe(false)
  })

  it('更新視野會保留既有探索格並合併目前可見格', () => {
    const state = makeState({ visibility: { exploredCellIds: ['0-0'], mode: 'fog' } })
    const nextVisibility = updatePlayerVisibility(state, 'player-1')

    expect(nextVisibility.exploredCellIds).toContain('0-0')
    expect(nextVisibility.exploredCellIds).toContain('5-6')
  })

  it('已探索格中的資源點與巢穴位置在離開視野後仍屬於已知位置', () => {
    const state = makeState({
      visibility: { exploredCellIds: ['5-6'], mode: 'fog' },
      creatureNests: [{
        id: 'nest-1',
        name: '巢穴',
        position: { row: 5, column: 6 },
        health: 100,
        maxHealth: 100,
        spawnChance: 0.1,
        cooldownRounds: 0,
        spawnLevel: 1,
      }],
      resourcePoints: [{
        id: 'resource-1',
        name: '資源點',
        position: { row: 5, column: 6 },
        materialIncome: 10,
        health: 100,
        maxHealth: 100,
        lastCollectedRound: null,
        ownerBaseId: 'base-1',
      }],
    })
    const cell = state.map.cells.find((candidate) => candidate.id === '5-6')!

    expect(getCellVisibility(state, 'player-1', cell)).toBe('visible')

    const movedState = {
      ...state,
      players: [makePlayer({ position: { row: 0, column: 0 } })],
    }
    expect(getCellVisibility(movedState, 'player-1', cell)).toBe('explored')
  })

  it('未解鎖視野的據點不提供視野', () => {
    const state = makeState({
      players: [makePlayer({ position: { row: 0, column: 0 } })],
      bases: [{
        id: 'base-1',
        name: '據點',
        position: { row: 10, column: 10 },
        buildings: [],
        buildingMaterials: 0,
        maxBuildingMaterials: 100,
        health: 100,
        maxHealth: 100,
        discovered: false,
      }],
    })
    const baseCell = state.map.cells.find((cell) => cell.id === '10-10')!

    // 據點位置不在玩家視野（4格）內，且據點未解鎖視野，應為未探索
    expect(getCellVisibility(state, 'player-1', baseCell)).toBe('unexplored')
  })

  it('已解鎖視野的據點提供永久視野', () => {
    const state = makeState({
      players: [makePlayer({ position: { row: 0, column: 0 } })],
      bases: [{
        id: 'base-1',
        name: '據點',
        position: { row: 10, column: 10 },
        buildings: [],
        buildingMaterials: 0,
        maxBuildingMaterials: 100,
        health: 100,
        maxHealth: 100,
        discovered: true,
      }],
    })
    const baseCell = state.map.cells.find((cell) => cell.id === '10-10')!

    // 據點已解鎖視野，即使玩家不在附近，據點位置仍應可見
    expect(getCellVisibility(state, 'player-1', baseCell)).toBe('visible')
  })

  it('天眼望氣 Buff 擴大玩家視野半徑', () => {
    const state = makeState({
      players: [makePlayer({
        buffs: [{ id: 'b1', definitionId: 'sky-eye-vision', sourceId: 'insight-sky-eye-vision', remainingRounds: null }],
      })],
    })
    expect(getPlayerVisionRange(state, 'player-1')).toBeGreaterThan(3)
  })

  it('無視野 Buff 時玩家使用基礎視野', () => {
    const state = makeState()
    expect(getPlayerVisionRange(state, 'player-1')).toBe(3)
  })
})
