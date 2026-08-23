import { describe, expect, it } from 'vitest'
import { applyEventEffects, applyEventStateEffects, checkEventRequirements } from './eventResolver'
import { getExplorationEventDefinition } from './eventCatalog'
import { allInnerSkillCatalog, allExternalSkillCatalog } from '../catalogs/martialHallSkillCatalog'
import type { GameState, PlayerState } from '../types'
import { jianghuExternalSkills } from '../catalogs/jianghuExternalSkillCatalog'
import { buildingCatalog } from '../catalogs/buildingCatalog'

function makePlayer(overrides: Partial<PlayerState> = {}): PlayerState {
  return {
    id: 'player-1',
    name: '玩家',
    position: { row: 0, column: 0 },
    attributes: { armStrength: 8, constitution: 8, agility: 7, innerEnergy: 5, insight: 7 },
    innerSkillIds: ['tuna-gong'],
    innerSkillId: 'tuna-gong',
    externalSkillIds: [],
    equippedExternalSkillIds: [],
    health: 20,
    maxHealth: 20,
    stamina: 10,
    maxStamina: 10,
    innerPower: 10,
    maxInnerPower: 10,
    prestige: 0,
    money: 100,
    experience: 0,
    inventory: [],
    turnEnded: false,
    ...overrides,
  }
}

describe('事件效果：習得功法', () => {
  it('learn-skill（外功）會讓玩家學會一項尚未學會的外功', () => {
    const player = makePlayer()
    const next = applyEventEffects(player, [{ type: 'learn-skill', skillType: 'external' }])

    expect(next.externalSkillIds.length).toBeGreaterThan(0)
    const learned = allExternalSkillCatalog.find((skill) => skill.id === next.externalSkillIds[0])
    expect(learned).toBeDefined()
  })

  it('learn-skill（內功）會讓玩家學會一項尚未學會的內功', () => {
    const player = makePlayer()
    const next = applyEventEffects(player, [{ type: 'learn-skill', skillType: 'inner' }])

    expect(next.innerSkillIds.length).toBeGreaterThan(player.innerSkillIds.length)
    const learned = allInnerSkillCatalog.find((skill) => skill.id === next.innerSkillIds[next.innerSkillIds.length - 1])
    expect(learned).toBeDefined()
  })

  it('已學會全部可學外功時不再重複習得', () => {
    const player = makePlayer({ externalSkillIds: allExternalSkillCatalog.map((skill) => skill.id) })
    const next = applyEventEffects(player, [{ type: 'learn-skill', skillType: 'external' }])

    expect(next.externalSkillIds).toEqual(player.externalSkillIds)
  })

  it('health／stamina／inner-power 效果會增減資源且以上限與 0 為界', () => {
    const player = makePlayer({ health: 18, stamina: 8, innerPower: 4 })
    const next = applyEventEffects(player, [
      { type: 'health', amount: -12 },
      { type: 'stamina', amount: -5 },
      { type: 'inner-power', amount: 15 },
    ])
    expect(next.health).toBe(6)
    expect(next.stamina).toBe(3)
    expect(next.innerPower).toBe(10)

    const floored = applyEventEffects(makePlayer(), [{ type: 'health', amount: -999 }, { type: 'stamina', amount: -999 }, { type: 'inner-power', amount: -999 }])
    expect(floored.health).toBe(0)
    expect(floored.stamina).toBe(0)
    expect(floored.innerPower).toBe(0)
  })

  it('江湖外功可透過事件習得', () => {
    const player = makePlayer()
    const next = applyEventEffects(player, [{ type: 'learn-skill', skillType: 'external' }])

    const gainedId = next.externalSkillIds[next.externalSkillIds.length - 1]
    const isJianghu = jianghuExternalSkills.some((skill) => skill.id === gainedId) ||
      allExternalSkillCatalog.some((skill) => skill.id === gainedId)
    expect(isJianghu).toBe(true)
  })
})

describe('事件效果：spawn-event 生成探索事件點', () => {
  it('將 scenarioEvents 中指定的事件點加入場上', () => {
    const hiddenEvent = {
      id: 'event-hidden',
      type: 'custom' as const,
      name: '隱藏事件',
      description: '',
      position: { row: 4, column: 4 },
      status: 'available' as const,
      discovered: true,
      expiresAtRound: null,
      customEvent: { icon: '🗨️', choices: [] },
    }
    const state = {
      explorationEvents: [],
      scenarioEvents: [hiddenEvent],
    } as unknown as GameState
    const next = applyEventStateEffects(state, [{ type: 'spawn-event', eventId: 'event-hidden' }])
    expect(next.explorationEvents?.some((event) => event.id === 'event-hidden')).toBe(true)
  })

  it('指定事件點已在場上時不重複生成', () => {
    const hiddenEvent = {
      id: 'event-hidden',
      type: 'custom' as const,
      name: '隱藏事件',
      description: '',
      position: { row: 4, column: 4 },
      status: 'available' as const,
      discovered: true,
      expiresAtRound: null,
      customEvent: { icon: '🗨️', choices: [] },
    }
    const state = {
      explorationEvents: [hiddenEvent],
      scenarioEvents: [hiddenEvent],
    } as unknown as GameState
    const next = applyEventStateEffects(state, [{ type: 'spawn-event', eventId: 'event-hidden' }])
    expect(next.explorationEvents?.filter((event) => event.id === 'event-hidden')).toHaveLength(1)
  })

  it('指定事件點不在 scenarioEvents 中時不生成', () => {
    const state = {
      explorationEvents: [],
      scenarioEvents: [],
    } as unknown as GameState
    const next = applyEventStateEffects(state, [{ type: 'spawn-event', eventId: 'event-missing' }])
    expect(next.explorationEvents ?? []).toHaveLength(0)
  })
})

describe('事件效果：spawn-base 生成據點', () => {
  it('將 scenarioBases 中指定的據點加入場上', () => {
    const hiddenBase = {
      id: 'base-hidden',
      name: '隱藏據點',
      position: { row: 4, column: 6 },
      buildings: [{ id: 'b1', type: 'board', name: '告示牌', description: '', constructionCost: 0, level: 1 }],
      buildingMaterials: 60,
      maxBuildingMaterials: 100,
      health: 100,
      maxHealth: 100,
      active: true,
    }
    const state = {
      bases: [],
      scenarioBases: [hiddenBase],
    } as unknown as GameState
    const next = applyEventStateEffects(state, [{ type: 'spawn-base', baseId: 'base-hidden' }])
    expect(next.bases.some((base) => base.id === 'base-hidden')).toBe(true)
  })

  it('指定據點已在場上時不重複生成', () => {
    const hiddenBase = {
      id: 'base-hidden',
      name: '隱藏據點',
      position: { row: 4, column: 6 },
      buildings: [],
      buildingMaterials: 60,
      maxBuildingMaterials: 100,
      health: 100,
      maxHealth: 100,
      active: true,
    }
    const state = {
      bases: [hiddenBase],
      scenarioBases: [hiddenBase],
    } as unknown as GameState
    const next = applyEventStateEffects(state, [{ type: 'spawn-base', baseId: 'base-hidden' }])
    expect(next.bases.filter((base) => base.id === 'base-hidden')).toHaveLength(1)
  })

  it('指定據點不在 scenarioBases 中時不生成', () => {
    const state = {
      bases: [],
      scenarioBases: [],
    } as unknown as GameState
    const next = applyEventStateEffects(state, [{ type: 'spawn-base', baseId: 'base-missing' }])
    expect(next.bases).toHaveLength(0)
  })
})

describe('事件效果：spawn-nest 生成巢穴', () => {
  it('將 scenarioNests 中指定的巢穴加入場上', () => {
    const hiddenNest = {
      id: 'nest-hidden',
      name: '隱藏巢穴',
      position: { row: 4, column: 7 },
      health: 40,
      maxHealth: 40,
      spawnChance: 0.1,
      cooldownRounds: 0,
      spawnLevel: 2,
      behaviorType: 'scavenger',
      schoolId: 'void-spirit',
    }
    const state = {
      creatureNests: [],
      scenarioNests: [hiddenNest],
    } as unknown as GameState
    const next = applyEventStateEffects(state, [{ type: 'spawn-nest', nestId: 'nest-hidden' }])
    expect(next.creatureNests.some((nest) => nest.id === 'nest-hidden')).toBe(true)
  })

  it('指定巢穴已在場上時不重複生成', () => {
    const hiddenNest = {
      id: 'nest-hidden',
      name: '隱藏巢穴',
      position: { row: 4, column: 7 },
      health: 40,
      maxHealth: 40,
      spawnChance: 0.1,
      cooldownRounds: 0,
      spawnLevel: 2,
      behaviorType: 'scavenger',
      schoolId: 'void-spirit',
    }
    const state = {
      creatureNests: [hiddenNest],
      scenarioNests: [hiddenNest],
    } as unknown as GameState
    const next = applyEventStateEffects(state, [{ type: 'spawn-nest', nestId: 'nest-hidden' }])
    expect(next.creatureNests.filter((nest) => nest.id === 'nest-hidden')).toHaveLength(1)
  })

  it('指定巢穴不在 scenarioNests 中時不生成', () => {
    const state = {
      creatureNests: [],
      scenarioNests: [],
    } as unknown as GameState
    const next = applyEventStateEffects(state, [{ type: 'spawn-nest', nestId: 'nest-missing' }])
    expect(next.creatureNests).toHaveLength(0)
  })
})

describe('事件需求訊息', () => {
  it('異獸足跡的防衛營選項沒有防衛營時不可執行', () => {
    const player = makePlayer({ position: { row: 1, column: 1 } })
    const state = { players: [player], bases: [], activePlayerId: player.id } as unknown as GameState
    const choice = getExplorationEventDefinition('deep-forest-beast')?.choices.find((candidate) => candidate.id === 'set-trap')
    expect(choice).toBeDefined()
    const result = checkEventRequirements(
      state,
      player.id,
      { id: 'event-1', type: 'deep-forest-beast', name: '密林異獸蹤跡', description: '', position: { row: 1, column: 1 }, status: 'available', discovered: true, expiresAtRound: null },
      choice?.requirements ?? [],
    )
    expect(result.allowed).toBe(false)
    expect(result.reasons.some((reason) => reason.includes('防衛營'))).toBe(true)
  })

  it('荒漠海市蜃樓的辨識選項需要探地符', () => {
    const player = makePlayer({ position: { row: 1, column: 1 } })
    const state = { players: [player], bases: [], activePlayerId: player.id } as unknown as GameState
    const choice = getExplorationEventDefinition('desert-mirage')?.choices.find((candidate) => candidate.id === 'break-mirage')
    const result = checkEventRequirements(
      state,
      player.id,
      { id: 'event-2', type: 'desert-mirage', name: '荒漠海市蜃樓', description: '', position: { row: 1, column: 1 }, status: 'available', discovered: true, expiresAtRound: null },
      choice?.requirements ?? [],
    )
    expect(result.allowed).toBe(false)
  })

  it('建築需求使用中文名稱', () => {
    const player = makePlayer({ position: { row: 1, column: 1 } })
    const state = {
      players: [player],
      bases: [],
      activePlayerId: player.id,
    } as unknown as GameState
    const result = checkEventRequirements(
      state,
      player.id,
      { id: 'event-1', type: 'wandering-scholar', name: '遊方學者', description: '', position: { row: 1, column: 1 }, status: 'available', discovered: true, expiresAtRound: null },
      [{ type: 'building-exists', buildingType: 'martial-hall' }],
    )

    const martialHallName = buildingCatalog.find((building) => building.type === 'martial-hall')?.name
    expect(result.reasons).toContain(`需要建築：${martialHallName}。`)
    expect(result.reasons).not.toContain('需要建築：martial-hall。')
  })
})