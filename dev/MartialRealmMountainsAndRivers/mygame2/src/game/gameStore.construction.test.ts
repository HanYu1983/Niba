import { beforeEach, describe, expect, it } from 'vitest'
import { gameStore } from './gameStore'
import { resetAiActionEventSequenceForTest } from './ai/aiActionEvent'
import type { AiActionEvent } from './ai/aiActionEvent'
import { CONSTRUCTION_MATERIALS_BLOCK_REASON } from './ai/construction/constructionAi'
import type { AiConstructionPlanItem, GameState } from './types'
import {
  makeAiTestState,
  makeConstructionPlan,
  makeTestBase,
  makeTestHuman,
  makeTestPlayer,
  makeTestResourcePoint,
} from './testHelpers/gameFixtures'

/**
 * 切片 G：建設 AI——runAiConstructionStep 的 queue 狀態機（§14.6）：
 * planned → building → completed／blocked；paused 方針只採集不建造；
 * 建料不足屬暫時性阻塞，材料累積後自動重試；完成時產生提醒彈窗與全域日誌。
 */
beforeEach(() => {
  gameStore.resetForTest()
  resetAiActionEventSequenceForTest()
})

function load(overrides: Partial<GameState> = {}): void {
  const ai = makeTestPlayer()
  const human = makeTestHuman()
  gameStore.setStateForTest(makeAiTestState({
    players: [ai, human],
    activePlayerId: 'ai-1',
    ...overrides,
  }))
}

function events(): AiActionEvent[] {
  return gameStore.getState().actionEvents ?? []
}

function planItem(index: number): AiConstructionPlanItem | undefined {
  return gameStore.getState().aiConstructionPlans?.[0]?.queue[index]
}

describe('建設 AI：queue 狀態機', () => {
  it('遠離目標據點 → 拒絕建造且不改變據點', () => {
    const base = makeTestBase({ buildingMaterials: 100 })
    load({
      players: [makeTestPlayer({ position: { row: 8, column: 8 } }), makeTestHuman()],
      bases: [base],
    })

    const result = gameStore.constructBuilding('base-1', 'building-type-wall', 'ai-1')

    expect(result).toEqual({ ok: false, reason: '需位於據點旁才能建造。' })
    expect(gameStore.getState().bases[0].buildings).toEqual([])
    expect(gameStore.getState().bases[0].buildingMaterials).toBe(100)
  })

  it('建料不足 → item 標記 blocked（含原因），材料不變', () => {
    load({
      aiConstructionPlans: [
        makeConstructionPlan({ queue: [{ buildingType: 'wall', priority: 5, status: 'planned' }] }),
      ],
    })

    expect(gameStore.runAiConstructionStep('ai-1').ok).toBe(true)

    expect(planItem(0)?.status).toBe('blocked')
    expect(planItem(0)?.blockedReason).toBe(CONSTRUCTION_MATERIALS_BLOCK_REASON)
    expect(gameStore.getState().bases[0].buildingMaterials).toBe(0)
    expect(gameStore.getState().bases[0].buildings).toEqual([])
  })

  it('材料到位後自動重試：blocked → completed，扣材料、寫日誌、彈完成提醒', () => {
    load({
      bases: [makeTestBase({ buildingMaterials: 0 })],
      aiConstructionPlans: [
        makeConstructionPlan({ queue: [{ buildingType: 'wall', priority: 5, status: 'planned' }] }),
      ],
    })

    // 第一步：建料不足被阻塞。
    gameStore.runAiConstructionStep('ai-1')
    // 補料並把回合交回 AI（模擬下一輪）。
    gameStore.setStateForTest({
      ...gameStore.getState(),
      activePlayerId: 'ai-1',
      blockingModal: null,
      bases: [{ ...gameStore.getState().bases[0], buildingMaterials: 100 }],
    })

    expect(gameStore.runAiConstructionStep('ai-1').ok).toBe(true)

    expect(planItem(0)?.status).toBe('completed')
    expect(planItem(0)?.blockedReason).toBeUndefined()
    const base = gameStore.getState().bases[0]
    expect(base.buildingMaterials).toBe(70)
    expect(base.buildings.map((building) => building.type)).toContain('wall')
    const log = events()
    expect(log.at(-1)?.action.type).toBe('build')
    expect(log.at(-1)?.result).toBe('succeeded')
    expect(log.at(-1)?.reason).toContain('城牆')
    expect(gameStore.getState().blockingModal?.type).toBe('action-result')
  })

  it('前置條件硬阻擋：跳過失敗候選繼續佇列，下一項成功建造', () => {
    load({
      bases: [makeTestBase({
        buildingMaterials: 100,
        allowedBuildings: [{ type: 'infirmary' }],
      })],
      aiConstructionPlans: [
        makeConstructionPlan({
          queue: [
            { buildingType: 'wall', priority: 9, status: 'planned' },
            { buildingType: 'infirmary', priority: 2, status: 'planned' },
          ],
        }),
      ],
    })

    expect(gameStore.runAiConstructionStep('ai-1').ok).toBe(true)

    expect(planItem(0)?.status).toBe('blocked')
    expect(planItem(0)?.blockedReason).toBe('此據點不允許建造該建築。')
    expect(planItem(1)?.status).toBe('completed')
  })

  it('paused 方針：相鄰資源點改為採集，queue 不變、不建造', () => {
    load({
      resourcePoints: [makeTestResourcePoint()],
      aiConstructionPlans: [
        makeConstructionPlan({
          policy: 'paused',
          allowUpgrade: true,
          queue: [{ buildingType: 'wall', priority: 5, status: 'planned' }],
        }),
      ],
    })

    expect(gameStore.runAiConstructionStep('ai-1').ok).toBe(true)

    expect(planItem(0)?.status).toBe('planned')
    expect(gameStore.getState().bases[0].buildingMaterials).toBe(10)
    expect(events()[0].action.type).toBe('collect')
    expect(gameStore.getState().activePlayerId).toBe('ai-1')
  })

  it('paused 方針且無相鄰資源點 → 記錄 hold 事件並結束回合', () => {
    load({
      aiConstructionPlans: [
        makeConstructionPlan({ policy: 'paused', queue: [{ buildingType: 'wall', priority: 5, status: 'planned' }] }),
      ],
    })

    expect(gameStore.runAiConstructionStep('ai-1').ok).toBe(true)

    expect(events()[0].action.type).toBe('hold')
    expect(events()[0].reason).toContain('暫停建造')
    expect(gameStore.getState().activePlayerId).toBe('player-1')
  })

  it('體力不足以建造 → 直接結束回合，item 保持 planned（暫時性狀態不標 blocked）', () => {
    load({
      players: [makeTestPlayer({ stamina: 1 }), makeTestHuman()],
      bases: [makeTestBase({ buildingMaterials: 100 })],
      aiConstructionPlans: [
        makeConstructionPlan({ queue: [{ buildingType: 'wall', priority: 5, status: 'planned' }] }),
      ],
    })

    expect(gameStore.runAiConstructionStep('ai-1').ok).toBe(true)

    expect(planItem(0)?.status).toBe('planned')
    expect(events()[0].action.type).toBe('end-turn')
    expect(events()[0].reason).toContain('體力不足')
    expect(gameStore.getState().activePlayerId).toBe('player-1')
  })

  it('守衛：非 AI、Game Over 或無計畫時拒絕執行', () => {
    load({
      aiConstructionPlans: [makeConstructionPlan()],
    })
    expect(gameStore.runAiConstructionStep('player-1')).toEqual({ ok: false, reason: '目前無法執行 AI 建設回合。' })

    gameStore.setStateForTest({ ...gameStore.getState(), gameOver: true, gameOverReason: 'all-players-defeated' })
    expect(gameStore.runAiConstructionStep('ai-1').ok).toBe(false)
    expect(events()).toEqual([])

    gameStore.setStateForTest({ ...gameStore.getState(), gameOver: false, aiConstructionPlans: [] })
    expect(gameStore.runAiConstructionStep('ai-1').ok).toBe(false)
  })
})
