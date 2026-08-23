import { describe, expect, it } from 'vitest'
import { learnSkillAtSectGate, practiceSkillAtSectGate } from './sectGateActions'
import { getSectGateLearnCost, SECT_GATE_PRACTICE_STAMINA_COST } from '../rules/sectGateRules'
import { SKILL_EXPERIENCE_PER_USE } from '../rules/skillRules'
import type { GameState, PlayerState, SectGateState } from '../types'

function makePlayer(overrides: Partial<PlayerState> = {}): PlayerState {
  return {
    id: 'player-1', name: '玩家', position: { row: 2, column: 2 }, attributes: { armStrength: 8, constitution: 8, agility: 7, innerEnergy: 5, insight: 7 }, innerSkillIds: ['tuna-gong'], innerSkillId: 'tuna-gong', externalSkillIds: [], equippedExternalSkillIds: [], health: 20, maxHealth: 20, stamina: 10, maxStamina: 10, innerPower: 10, maxInnerPower: 10, prestige: 0, money: 500, experience: 0, inventory: [], turnEnded: false, ...overrides,
  }
}

function makeGate(position = { row: 2, column: 3 }, overrides: Partial<SectGateState> = {}): SectGateState {
  return {
    id: 'sect-gate-1',
    schoolId: 'void-spirit',
    position,
    experience: 0,
    level: 3,
    ...overrides,
  }
}

function makeState(overrides: Partial<GameState> = {}): GameState {
  return {
    map: { rows: 5, columns: 5, cells: [] }, bases: [], creatureNests: [], resourcePoints: [], itemPoints: [], sectGates: [makeGate()], players: [makePlayer()], creatures: [], activePlayerId: 'player-1', round: 1, creatureActionLogs: [], attackPreview: null, externalSkillPreview: null, creatureTurnInProgress: false, activeCreatureId: null, operation: { type: 'idle' }, blockingModal: null, ...overrides,
  }
}

describe('sectGateActions', () => {
  it('學習內功加入玩家列表、扣除 3 點體力與 30 金錢，並累積據點經驗', () => {
    const state = makeState()
    const result = learnSkillAtSectGate(state, 'player-1', 'sect-gate-1', 'void-spirit-inner')
    expect(result.result.ok).toBe(true)
    expect(result.state.players[0].innerSkillIds).toContain('void-spirit-inner')
    expect(result.state.players[0].money).toBe(500 - getSectGateLearnCost('void-spirit', 'void-spirit-inner'))
    expect(result.state.players[0].stamina).toBe(10 - SECT_GATE_PRACTICE_STAMINA_COST)
    // 消費多少金錢，門派據點就增加多少經驗。
    expect(result.state.sectGates?.[0]?.experience).toBe(30)
    expect(result.state.sectGates?.[0]?.level).toBe(1)
  })

  it('學習外功加入 externalSkillIds', () => {
    const result = learnSkillAtSectGate(makeState(), 'player-1', 'sect-gate-1', 'void-spirit-external-damage')
    expect(result.result.ok).toBe(true)
    expect(result.state.players[0].externalSkillIds).toContain('void-spirit-external-damage')
  })

  it('體力不足時不能學習功法', () => {
    const state = makeState({ players: [makePlayer({ stamina: SECT_GATE_PRACTICE_STAMINA_COST - 1 })] })
    const result = learnSkillAtSectGate(state, 'player-1', 'sect-gate-1', 'void-spirit-inner')
    expect(result.result.ok).toBe(false)
    expect(result.state.players[0].innerSkillIds).not.toContain('void-spirit-inner')
  })

  it('門派據點不再有等級鎖定，任何功法都可學習', () => {
    const levelOneGate = makeGate({ row: 2, column: 3 }, { level: 1 })
    const state = makeState({ sectGates: [levelOneGate] })
    expect(learnSkillAtSectGate(state, 'player-1', 'sect-gate-1', 'void-spirit-inner').result.ok).toBe(true)
    expect(learnSkillAtSectGate(state, 'player-1', 'sect-gate-1', 'void-spirit-external-functional').result.ok).toBe(true)
  })

  it('已學會功法不能重複學習', () => {
    const state = makeState({ players: [makePlayer({ innerSkillIds: ['tuna-gong', 'void-spirit-inner'] })] })
    const result = learnSkillAtSectGate(state, 'player-1', 'sect-gate-1', 'void-spirit-inner')
    expect(result.result.ok).toBe(false)
    if (!result.result.ok) expect(result.result.reason).toContain('已學會')
  })

  it('遠離門派據點時不能學習或練習', () => {
    const farGate = makeState({ sectGates: [makeGate({ row: 5, column: 5 })] })
    const learn = learnSkillAtSectGate(farGate, 'player-1', 'sect-gate-1', 'void-spirit-inner')
    expect(learn.result.ok).toBe(false)
    if (!learn.result.ok) expect(learn.result.reason).toContain('靠近')
  })

  it('練習已學會功法：扣體力、加個人與據點經驗', () => {
    const player = makePlayer({ externalSkillIds: ['void-spirit-external-damage'], equippedExternalSkillIds: ['void-spirit-external-damage'], stamina: 10 })
    const state = makeState({ players: [player] })
    const result = practiceSkillAtSectGate(state, 'player-1', 'sect-gate-1', 'void-spirit-external-damage')
    expect(result.result.ok).toBe(true)
    expect(result.state.players[0].stamina).toBe(7)
    expect(result.state.players[0].skillProgression?.['void-spirit-external-damage']?.experience).toBe(SKILL_EXPERIENCE_PER_USE)
    expect(result.state.sectGates?.[0]?.experience).toBe(30)
  })

  it('練習未學會的功法會失敗', () => {
    const result = practiceSkillAtSectGate(makeState(), 'player-1', 'sect-gate-1', 'void-spirit-external-damage')
    expect(result.result.ok).toBe(false)
    if (!result.result.ok) expect(result.result.reason).toContain('學會')
  })

  it('體力不足時不能練習', () => {
    const player = makePlayer({ externalSkillIds: ['void-spirit-external-damage'], equippedExternalSkillIds: ['void-spirit-external-damage'], stamina: 2 })
    const state = makeState({ players: [player] })
    const result = practiceSkillAtSectGate(state, 'player-1', 'sect-gate-1', 'void-spirit-external-damage')
    expect(result.result.ok).toBe(false)
    if (!result.result.ok) expect(result.result.reason).toContain('體力')
  })
})