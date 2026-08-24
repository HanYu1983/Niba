import { describe, expect, it } from 'vitest'
import {
  clearRuin,
  reconstructRuin,
  RUIN_CLEAR_EXPERIENCE,
  RUIN_CLEAR_MATERIAL_BONUS,
  RUIN_RECONSTRUCT_STAMINA,
  RUIN_RECONSTRUCT_EXPERIENCE,
} from './ruinActions'
import type { GameState, PlayerState, RuinState } from '../types'
import { getMaxHealth, getMaxInnerPower, getMaxStamina } from '../rules/playerStatsRules'

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

function makeRuin(overrides: Partial<RuinState> = {}): RuinState {
  return {
    id: 'ruin-1',
    name: '破落村',
    position: { row: 5, column: 6 },
    status: 'intact',
    ...overrides,
  }
}

function makeState(overrides: Partial<GameState> = {}): GameState {
  return {
    map: { rows: 15, columns: 15, cells: [] },
    visibility: { exploredCellIds: [], mode: 'fog' },
    bases: [],
    defenseStructures: [],
    ruins: [makeRuin()],
    creatureNests: [],
    resourcePoints: [],
    itemPoints: [],
    explorationEvents: [],
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

describe('reconstructRuin', () => {
  it('玩家在廢墟旁且體力足夠時可修復為小型瞭望臺', () => {
    const state = makeState()
    const result = reconstructRuin(state, 'player-1', 'ruin-1', 'small-watchtower')

    expect(result.result.ok).toBe(true)
    const nextState = result.state
    // 廢墟變為已修復
    expect(nextState.ruins?.find((ruin) => ruin.id === 'ruin-1')?.status).toBe('reconstructed')
    // 新增小型瞭望臺
    expect(nextState.defenseStructures?.some((structure) => structure.type === 'small-watchtower')).toBe(true)
    // 消耗體力
    expect(nextState.players[0].stamina).toBe(state.players[0].stamina - RUIN_RECONSTRUCT_STAMINA)
    // 獲得經驗值
    expect(nextState.players[0].experience).toBe(RUIN_RECONSTRUCT_EXPERIENCE)
  })

  it('玩家在廢墟旁且體力足夠時可修復為小型箭塔', () => {
    const state = makeState()
    const result = reconstructRuin(state, 'player-1', 'ruin-1', 'small-arrow-tower')

    expect(result.result.ok).toBe(true)
    const nextState = result.state
    expect(nextState.defenseStructures?.some((structure) => structure.type === 'small-arrow-tower')).toBe(true)
  })

  it('修復後將設施所在格標記為已探索', () => {
    const state = makeState()
    const result = reconstructRuin(state, 'player-1', 'ruin-1', 'small-watchtower')

    expect(result.result.ok).toBe(true)
    const nextState = result.state
    // 設施位於 (5,6)，其格子 id 為 '5-6'
    expect(nextState.visibility?.exploredCellIds).toContain('5-6')
  })

  it('玩家不在廢墟旁時修復失敗', () => {
    const state = makeState({
      players: [makePlayer({ position: { row: 10, column: 10 } })],
    })
    const result = reconstructRuin(state, 'player-1', 'ruin-1', 'small-watchtower')

    expect(result.result.ok).toBe(false)
    if (!result.result.ok) expect(result.result.reason).toContain('周遭一格')
  })

  it('體力不足時修復失敗且不扣資源', () => {
    const state = makeState({
      players: [makePlayer({ stamina: RUIN_RECONSTRUCT_STAMINA - 1 })],
    })
    const result = reconstructRuin(state, 'player-1', 'ruin-1', 'small-watchtower')

    expect(result.result.ok).toBe(false)
    if (!result.result.ok) expect(result.result.reason).toBe('體力不足。')
    expect(result.state.players[0].stamina).toBe(RUIN_RECONSTRUCT_STAMINA - 1)
    expect(result.state.defenseStructures?.length ?? 0).toBe(0)
  })

  it('已修復的廢墟不可重複修復', () => {
    const state = makeState({
      ruins: [makeRuin({ status: 'reconstructed' })],
    })
    const result = reconstructRuin(state, 'player-1', 'ruin-1', 'small-watchtower')

    expect(result.result.ok).toBe(false)
    if (!result.result.ok) expect(result.result.reason).toBe('此廢墟已修復。')
  })

  it('只能修復為小型設施', () => {
    const state = makeState()
    const result = reconstructRuin(state, 'player-1', 'ruin-1', 'watchtower')

    expect(result.result.ok).toBe(false)
    if (!result.result.ok) expect(result.result.reason).toBe('未知的小型設施。')
  })

  it('清除廢墟會移除廢墟並獲得 20 經驗值', () => {
    const state = makeState({
      map: {
        rows: 15,
        columns: 15,
        cells: [{ id: '5-6', row: 5, column: 6, terrain: 'plain' }],
      },
    })
    const result = clearRuin(state, 'player-1', 'ruin-1')

    expect(result.result.ok).toBe(true)
    expect(result.state.ruins).toEqual([])
    expect(result.state.players[0].experience).toBe(RUIN_CLEAR_EXPERIENCE)
    expect(result.state.players[0].stamina).toBe(state.players[0].stamina - RUIN_RECONSTRUCT_STAMINA)
  })

  it('清除位於活躍據點影響範圍內的廢墟時，據點獲得建料', () => {
    const state = makeState({
      bases: [
        {
          id: 'base-1',
          name: '據點',
          position: { row: 5, column: 6 },
          buildings: [],
          buildingMaterials: 50,
          maxBuildingMaterials: 100,
          health: 100,
          maxHealth: 100,
          active: true,
        },
      ],
      map: {
        rows: 15,
        columns: 15,
        cells: [{ id: '5-6', row: 5, column: 6, terrain: 'wall' }],
      },
    })
    const result = clearRuin(state, 'player-1', 'ruin-1')

    expect(result.result.ok).toBe(true)
    expect(result.state.bases[0].buildingMaterials).toBe(50 + RUIN_CLEAR_MATERIAL_BONUS)
  })

  it('清除位於影響範圍外的廢墟時，據點不獲得建料', () => {
    const state = makeState({
      bases: [
        {
          id: 'base-1',
          name: '據點',
          position: { row: 0, column: 0 },
          buildings: [],
          buildingMaterials: 50,
          maxBuildingMaterials: 100,
          health: 100,
          maxHealth: 100,
          active: true,
        },
      ],
      map: {
        rows: 15,
        columns: 15,
        cells: [{ id: '5-6', row: 5, column: 6, terrain: 'wall' }],
      },
    })
    const result = clearRuin(state, 'player-1', 'ruin-1')

    expect(result.result.ok).toBe(true)
    expect(result.state.bases[0].buildingMaterials).toBe(50)
  })
})
