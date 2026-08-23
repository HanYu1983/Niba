import { describe, expect, it } from 'vitest'
import { learnSkillAtMartialHall } from './martialHallActions'
import type { GameState, PlayerState } from '../types'

function makePlayer(overrides: Partial<PlayerState> = {}): PlayerState {
  return {
    id: 'player-1', name: '玩家', position: { row: 2, column: 2 }, attributes: { armStrength: 8, constitution: 8, agility: 7, innerEnergy: 5, insight: 7 }, innerSkillIds: ['tuna-gong'], innerSkillId: 'tuna-gong', externalSkillIds: [], equippedExternalSkillIds: [], health: 20, maxHealth: 20, stamina: 5, maxStamina: 5, innerPower: 10, maxInnerPower: 10, prestige: 0, money: 200, experience: 0, inventory: [], turnEnded: false, ...overrides,
  }
}

function makeState(overrides: Partial<GameState> = {}): GameState {
  return {
    map: { rows: 5, columns: 5, cells: [] }, bases: [{ id: 'base-1', name: '據點', position: { row: 2, column: 3 }, martialSchoolId: 'void-spirit', buildings: [{ id: 'hall', type: 'martial-hall', name: '武館', description: '', constructionCost: 70, level: 3, schoolId: 'void-spirit' }], buildingMaterials: 0, maxBuildingMaterials: 100, health: 100, maxHealth: 100 }], creatureNests: [], resourcePoints: [], itemPoints: [], players: [makePlayer()], creatures: [], activePlayerId: 'player-1', round: 1, creatureActionLogs: [], attackPreview: null, externalSkillPreview: null, creatureTurnInProgress: false, activeCreatureId: null, operation: { type: 'idle' }, blockingModal: null, ...overrides,
  }
}

describe('martialHallActions', () => {
  it('購買內功後加入玩家列表並扣除金錢', () => {
    const result = learnSkillAtMartialHall(makeState(), 'player-1', 'base-1', 'inner', 'void-spirit-inner')
    expect(result.result.ok).toBe(true)
    expect(result.state.players[0].innerSkillIds).toContain('void-spirit-inner')
    expect(result.state.players[0].money).toBe(125)
  })

  it('不符合武館等級時不能學習高階功法', () => {
    const result = learnSkillAtMartialHall(makeState(), 'player-1', 'base-1', 'inner', 'void-spirit-inner')
    expect(result.result.ok).toBe(true)
  })

  it('一級武館只能學習內功，傷害型外功需要二級武館', () => {
    const levelOne = makeState({ bases: [{ id: 'base-1', name: '據點', position: { row: 2, column: 3 }, martialSchoolId: 'void-spirit', buildings: [{ id: 'hall', type: 'martial-hall', name: '武館', description: '', constructionCost: 70, level: 1, schoolId: 'void-spirit' }], buildingMaterials: 0, maxBuildingMaterials: 100, health: 100, maxHealth: 100 }] })
    const inner = learnSkillAtMartialHall(levelOne, 'player-1', 'base-1', 'inner', 'void-spirit-inner')
    expect(inner.result.ok).toBe(true)
    const damage = learnSkillAtMartialHall(levelOne, 'player-1', 'base-1', 'external', 'void-spirit-external-damage')
    expect(damage.result.ok).toBe(false)
    if (!damage.result.ok) expect(damage.result.reason).toContain('需要武館 Lv.2')
  })

  it('二級武館可學習傷害型外功，但功能型外功需要三級武館', () => {
    const levelTwo = makeState({ bases: [{ id: 'base-1', name: '據點', position: { row: 2, column: 3 }, martialSchoolId: 'void-spirit', buildings: [{ id: 'hall', type: 'martial-hall', name: '武館', description: '', constructionCost: 70, level: 2, schoolId: 'void-spirit' }], buildingMaterials: 0, maxBuildingMaterials: 100, health: 100, maxHealth: 100 }] })
    const damage = learnSkillAtMartialHall(levelTwo, 'player-1', 'base-1', 'external', 'void-spirit-external-damage')
    expect(damage.result.ok).toBe(true)
    const functional = learnSkillAtMartialHall(levelTwo, 'player-1', 'base-1', 'external', 'void-spirit-external-functional')
    expect(functional.result.ok).toBe(false)
    if (!functional.result.ok) expect(functional.result.reason).toContain('需要武館 Lv.3')
  })

  it('已學會功法不能重複購買', () => {
    const result = learnSkillAtMartialHall(makeState({ players: [makePlayer({ innerSkillIds: ['tuna-gong', 'void-spirit-inner'] })] }), 'player-1', 'base-1', 'inner', 'void-spirit-inner')
    expect(result.result.ok).toBe(false)
    if (!result.result.ok) expect(result.result.reason).toContain('已學會')
  })

  it('購買外功不檢查悟性且不結束回合', () => {
    const state = makeState({ players: [makePlayer({ attributes: { armStrength: 1, constitution: 1, agility: 1, innerEnergy: 1, insight: 0 } })] })
    const result = learnSkillAtMartialHall(state, 'player-1', 'base-1', 'external', 'void-spirit-external-damage')
    expect(result.result.ok).toBe(true)
    expect(result.state.players[0].externalSkillIds).toContain('void-spirit-external-damage')
    expect(result.state.players[0].turnEnded).toBe(false)
  })

  it('購買太虛流功法後，玩家功法列表包含該功法', () => {
    const result = learnSkillAtMartialHall(makeState(), 'player-1', 'base-1', 'inner', 'void-spirit-inner')
    expect(result.result.ok).toBe(true)
    expect(result.state.players[0].innerSkillIds).toContain('void-spirit-inner')
  })
})
