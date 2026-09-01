import { describe, expect, it } from 'vitest'
import { computeBattleRecord } from './battleRecord'
import { createEmptyRunStats } from './runStats'
import type { GameState, PlayerState } from './types'

function makePlayer(overrides: Partial<PlayerState> = {}): PlayerState {
  return {
    id: 'player-1',
    name: '玩家',
    position: { row: 1, column: 1 },
    attributes: { armStrength: 8, constitution: 8, agility: 8, innerEnergy: 8, insight: 8 },
    innerSkillIds: [],
    innerSkillId: 'tuna-gong',
    externalSkillIds: [],
    equippedExternalSkillIds: [],
    health: 100,
    maxHealth: 100,
    stamina: 100,
    maxStamina: 100,
    innerPower: 100,
    maxInnerPower: 100,
    prestige: 0,
    money: 0,
    experience: 0,
    level: 1,
    inventory: [],
    turnEnded: false,
    ...overrides,
  }
}

function makeState(overrides: Partial<GameState> = {}): GameState {
  return {
    map: { rows: 5, columns: 5, cells: [] },
    bases: [],
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
    creatureTurnInProgress: false,
    activeCreatureId: null,
    operation: { type: 'idle' },
    blockingModal: null,
    ...overrides,
  }
}

describe('computeBattleRecord', () => {
  it('勝利時回傳 won=true 與結束原因', () => {
    const record = computeBattleRecord(makeState({ gameWon: true, gameOverReason: 'all-players-defeated' }))
    expect(record.won).toBe(true)
    expect(record.reason).toBe('all-players-defeated')
  })

  it('讀取人類玩家的等級、聲望、治理階級與金錢', () => {
    const record = computeBattleRecord(makeState({
      players: [makePlayer({ level: 5, prestige: 120, governanceRank: 2, money: 300 })],
    }))
    expect(record.playerLevel).toBe(5)
    expect(record.prestige).toBe(120)
    expect(record.governanceRank).toBe(2)
    expect(record.money).toBe(300)
  })

  it('跳過 AI 玩家，取人類玩家為結算對象', () => {
    const record = computeBattleRecord(makeState({
      activePlayerId: 'ai-1',
      players: [
        makePlayer({ id: 'ai-1', name: 'AI', isAI: true, level: 9 }),
        makePlayer({ id: 'player-1', level: 3 }),
      ],
    }))
    expect(record.playerLevel).toBe(3)
  })

  it('計算存活回合、剩餘據點與剩餘巢穴', () => {
    const record = computeBattleRecord(makeState({
      round: 12,
      bases: [
        { id: 'b1', name: '據點1', position: { row: 0, column: 0 }, buildings: [], buildingMaterials: 0, maxBuildingMaterials: 100, health: 100, maxHealth: 100, active: true },
        { id: 'b2', name: '據點2', position: { row: 0, column: 1 }, buildings: [], buildingMaterials: 0, maxBuildingMaterials: 100, health: 0, maxHealth: 100, active: false },
      ],
      creatureNests: [
        { id: 'n1', name: '巢穴1', position: { row: 2, column: 2 }, health: 100, maxHealth: 100, spawnChance: 0.5, cooldownRounds: 1, spawnLevel: 1 },
        { id: 'n2', name: '巢穴2', position: { row: 2, column: 3 }, health: 100, maxHealth: 100, spawnChance: 0.5, cooldownRounds: 1, spawnLevel: 1 },
      ],
    }))
    expect(record.roundsSurvived).toBe(12)
    expect(record.remainingBases).toBe(1)
    expect(record.remainingNests).toBe(2)
  })

  it('runStats 未初始化時回傳全 0 統計', () => {
    const record = computeBattleRecord(makeState())
    expect(record.stats.creaturesDefeated).toBe(0)
    expect(record.stats.moneySpent).toBe(0)
  })

  it('runStats 已初始化時原樣帶入', () => {
    const stats = { ...createEmptyRunStats(), creaturesDefeated: 7, moneySpent: 50 }
    const record = computeBattleRecord(makeState({ runStats: stats }))
    expect(record.stats.creaturesDefeated).toBe(7)
    expect(record.stats.moneySpent).toBe(50)
  })

  it('每個人類玩家都有獨立的結局戰績', () => {
    const record = computeBattleRecord(makeState({
      players: [
        makePlayer({ id: 'p1', name: '玩家甲', level: 5, prestige: 120, governanceRank: 2, money: 300 }),
        makePlayer({ id: 'p2', name: '玩家乙', level: 3, prestige: 40, governanceRank: 1, money: 80 }),
      ],
    }))
    expect(record.players).toHaveLength(2)
    expect(record.players[0]).toMatchObject({ id: 'p1', name: '玩家甲', level: 5, prestige: 120, governanceRank: 2, money: 300 })
    expect(record.players[1]).toMatchObject({ id: 'p2', name: '玩家乙', level: 3, prestige: 40, governanceRank: 1, money: 80 })
  })

  it('跳過 AI 玩家，只為人類玩家建立獨立戰績', () => {
    const record = computeBattleRecord(makeState({
      players: [
        makePlayer({ id: 'ai-1', name: 'AI', isAI: true, level: 9 }),
        makePlayer({ id: 'p1', name: '玩家甲', level: 5 }),
        makePlayer({ id: 'p2', name: '玩家乙', level: 3 }),
      ],
    }))
    expect(record.players).toHaveLength(2)
    expect(record.players.map((p) => p.id)).toEqual(['p1', 'p2'])
  })
})
