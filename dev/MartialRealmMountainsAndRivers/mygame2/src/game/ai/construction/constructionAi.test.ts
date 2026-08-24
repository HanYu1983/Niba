import { describe, expect, it } from 'vitest'
import {
  chooseConstructionAction,
  CONSTRUCTION_MATERIALS_BLOCK_REASON,
  pickNextBuildCandidate,
  pickUpgradeCandidate,
} from './constructionAi'
import type { AiConstructionPlan, BaseState, GameState } from '../../types'

function makeBase(overrides: Partial<BaseState> = {}): BaseState {
  return { id: 'base-1', name: '據點', position: { row: 5, column: 5 }, buildings: [], buildingMaterials: 100, maxBuildingMaterials: 100, health: 100, maxHealth: 100, ...overrides }
}

function makeState(bases: BaseState[]): GameState {
  return { bases } as unknown as GameState
}

function makePlan(queue: AiConstructionPlan['queue'], overrides: Partial<AiConstructionPlan> = {}): AiConstructionPlan {
  return { aiPlayerId: 'ai-1', baseId: 'base-1', policy: 'balanced', allowUpgrade: false, queue, ...overrides }
}

describe('pickNextBuildCandidate 效用評分', () => {
  const wall = { buildingType: 'wall', priority: 8, status: 'planned' as const }
  const exchange = { buildingType: 'exchange', priority: 6, status: 'planned' as const }

  it('balanced 方針只看 priority，分高者優先', () => {
    const candidate = pickNextBuildCandidate(makeState([makeBase()]), makePlan([wall, exchange]))
    expect(candidate?.buildingType).toBe('wall')
  })

  it('economy 方針給經濟類建築加權（priority + 方針加成）', () => {
    const candidate = pickNextBuildCandidate(makeState([makeBase()]), makePlan([wall, exchange], { policy: 'economy' }))
    expect(candidate?.buildingType).toBe('exchange')
  })

  it('同分依 queue 順序（穩定排序）', () => {
    const first = { buildingType: 'infirmary', priority: 5, status: 'planned' as const }
    const second = { buildingType: 'waystation', priority: 5, status: 'planned' as const }
    const candidate = pickNextBuildCandidate(makeState([makeBase()]), makePlan([first, second], { policy: 'frontline' }))
    expect(candidate?.itemIndex).toBe(0)
    expect(candidate?.buildingId).toBe('building-type-infirmary')
  })

  it('defense 方針給防禦類建築加權', () => {
    const barracks = { buildingType: 'barracks', priority: 4, status: 'planned' as const }
    const board = { buildingType: 'board', priority: 6, status: 'planned' as const }
    const candidate = pickNextBuildCandidate(makeState([makeBase()]), makePlan([board, barracks], { policy: 'defense' }))
    expect(candidate?.buildingType).toBe('barracks')
  })
})

describe('pickNextBuildCandidate 狀態過濾', () => {
  it('跳過 cancelled、completed 與永久性 blocked；建料不足的 blocked 可重試', () => {
    const plan = makePlan([
      { buildingType: 'wall', priority: 9, status: 'cancelled' },
      { buildingType: 'barracks', priority: 8, status: 'completed' },
      { buildingType: 'infirmary', priority: 7, status: 'blocked', blockedReason: '此據點不允許建造該建築。' },
      { buildingType: 'trade-market', priority: 2, status: 'blocked', blockedReason: CONSTRUCTION_MATERIALS_BLOCK_REASON },
      { buildingType: 'exchange', priority: 1, status: 'planned' },
    ])
    const state = makeState([makeBase()])
    // 建料不足的 blocked（優先度 2）與 planned 的 exchange 都可考慮；建料不足分數較高先選。
    expect(pickNextBuildCandidate(state, plan)?.buildingType).toBe('trade-market')
    // 排除後換 exchange。
    expect(pickNextBuildCandidate(state, plan, new Set([3]))?.buildingType).toBe('exchange')
  })

  it('排除所有候選後回傳 null', () => {
    const plan = makePlan([{ buildingType: 'wall', priority: 9, status: 'cancelled' }])
    expect(pickNextBuildCandidate(makeState([makeBase()]), plan)).toBeNull()
  })
})

describe('武館模板解析（流派過濾）', () => {
  it('未指定流派的據點無法解析唯一武館 → 偽候選交由執行層標記 blocked', () => {
    const plan = makePlan([{ buildingType: 'martial-hall', priority: 5, status: 'planned' as const }])
    const candidate = pickNextBuildCandidate(makeState([makeBase()]), plan)
    expect(candidate?.buildingId).toBe('unknown:martial-hall')
  })

  it('指定流派的據點解析出對應流派武館', () => {
    const plan = makePlan([{ buildingType: 'martial-hall', priority: 5, status: 'planned' as const }])
    const base = makeBase({ martialSchoolId: 'golden-body' })
    const candidate = pickNextBuildCandidate(makeState([base]), plan)
    expect(candidate?.buildingId).toBe('building-type-martial-hall-golden-body')
  })
})

describe('pickUpgradeCandidate 升級候選', () => {
  const buildings = [
    { id: 'building-1-wall', type: 'wall', name: '城牆', description: '', constructionCost: 30, level: 3 },
    { id: 'building-2-board', type: 'board', name: '告示牌', description: '', constructionCost: 0, level: 1 },
  ]

  it('allowUpgrade=false 時不升級', () => {
    expect(pickUpgradeCandidate(makeState([makeBase({ buildings })]), makePlan([], { allowUpgrade: false }))).toBeNull()
  })

  it('取等級最低的既有建築', () => {
    const candidate = pickUpgradeCandidate(makeState([makeBase({ buildings })]), makePlan([], { allowUpgrade: true }))
    expect(candidate?.buildingId).toBe('building-2-board')
    expect(candidate?.buildingName).toBe('告示牌')
  })

  it('沒有建築時回傳 null', () => {
    expect(pickUpgradeCandidate(makeState([makeBase()]), makePlan([], { allowUpgrade: true }))).toBeNull()
  })
})

describe('chooseConstructionAction 決策優先序', () => {
  it('有可建候選時優先建造', () => {
    const decision = chooseConstructionAction(
      makeState([makeBase()]),
      makePlan([{ buildingType: 'wall', priority: 5, status: 'planned' }]),
    )
    expect(decision.type).toBe('build')
  })

  it('佇列無候選且允許升級時升級既有建築', () => {
    const decision = chooseConstructionAction(
      makeState([makeBase({ buildings: [{ id: 'building-1-wall', type: 'wall', name: '城牆', description: '', constructionCost: 30 }] })]),
      makePlan([], { allowUpgrade: true }),
    )
    expect(decision).toEqual({ type: 'upgrade', buildingId: 'building-1-wall', buildingName: '城牆' })
  })

  it('全部受阻且不可升級時待命並說明原因', () => {
    const decision = chooseConstructionAction(
      makeState([makeBase()]),
      makePlan([
        { buildingType: 'wall', priority: 5, status: 'blocked', blockedReason: '此據點不允許建造該建築。' },
      ]),
    )
    expect(decision.type).toBe('hold')
    if (decision.type === 'hold') expect(decision.reason).toContain('前置條件不足')
  })
})
