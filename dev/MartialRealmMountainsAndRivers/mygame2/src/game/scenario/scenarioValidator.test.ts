import { describe, expect, it } from 'vitest'
import { validateScenario } from './scenarioValidator'
import { createEmptyScenario } from '../contracts/scenario'
import type { ScenarioDefinition } from '../contracts/scenario'

function makeScenario(): ScenarioDefinition {
  const scenario = createEmptyScenario(10, 10)
  return {
    ...scenario,
    entities: [
      { id: 'player-1', kind: 'player', position: { row: 8, column: 2 }, data: {} },
      { id: 'base-1', kind: 'base', position: { row: 8, column: 3 }, data: {} },
      { id: 'boss-1', kind: 'creature', position: { row: 2, column: 7 }, data: { isBoss: true } },
    ],
    quests: {
      victoryObjectives: [
        { id: 'obj-1', title: '擊敗 Boss', type: 'defeat-creature', targetId: 'boss-1', targetValue: 1 },
      ],
      failConditions: {},
    },
  }
}

describe('validateScenario', () => {
  it('合法關卡通過驗證', () => {
    const result = validateScenario(makeScenario())
    expect(result.valid).toBe(true)
    expect(result.issues).toEqual([])
  })

  it('缺少玩家起點時報錯', () => {
    const scenario = makeScenario()
    scenario.entities = scenario.entities.filter((entity) => entity.kind !== 'player')
    const result = validateScenario(scenario)
    expect(result.valid).toBe(false)
    expect(result.issues.some((issue) => issue.message.includes('玩家起點'))).toBe(true)
  })

  it('勝利目標為空時報錯', () => {
    const scenario = makeScenario()
    scenario.quests.victoryObjectives = []
    const result = validateScenario(scenario)
    expect(result.valid).toBe(false)
    expect(result.issues.some((issue) => issue.message.includes('勝利目標'))).toBe(true)
  })

  it('目標關聯物件不存在時標記警告', () => {
    const scenario = makeScenario()
    scenario.quests.victoryObjectives[0].targetId = 'missing-boss'
    const result = validateScenario(scenario)
    // 警告不影響 valid（valid 只看 error）
    expect(result.valid).toBe(true)
    expect(result.issues.some((issue) => issue.severity === 'warning' && issue.message.includes('missing-boss'))).toBe(true)
  })

  it('座標超出地圖範圍時報錯', () => {
    const scenario = makeScenario()
    scenario.entities[0].position = { row: 99, column: 99 }
    const result = validateScenario(scenario)
    expect(result.valid).toBe(false)
    expect(result.issues.some((issue) => issue.message.includes('超出地圖範圍'))).toBe(true)
  })

  it('不可重疊物件同格時報錯', () => {
    const scenario = makeScenario()
    // 將據點移到玩家同格
    scenario.entities[1].position = { row: 8, column: 2 }
    const result = validateScenario(scenario)
    expect(result.valid).toBe(false)
    expect(result.issues.some((issue) => issue.message.includes('不可重疊'))).toBe(true)
  })

  it('reach-position 缺少座標時報錯', () => {
    const scenario = makeScenario()
    scenario.quests.victoryObjectives.push({
      id: 'obj-reach', title: '調查靈泉', type: 'reach-position', targetValue: 1,
    })
    const result = validateScenario(scenario)
    expect(result.valid).toBe(false)
    expect(result.issues.some((issue) => issue.message.includes('目標列與目標欄'))).toBe(true)
  })

  it('reach-position 座標超出範圍時報錯', () => {
    const scenario = makeScenario()
    scenario.quests.victoryObjectives.push({
      id: 'obj-reach', title: '調查靈泉', type: 'reach-position', targetRow: 99, targetColumn: 99, targetValue: 1,
    })
    const result = validateScenario(scenario)
    expect(result.valid).toBe(false)
    expect(result.issues.some((issue) => issue.message.includes('超出地圖範圍'))).toBe(true)
  })

  it('interact-object 缺少 targetId 時報錯', () => {
    const scenario = makeScenario()
    scenario.quests.victoryObjectives.push({
      id: 'obj-interact', title: '幫助村民', type: 'interact-object', targetValue: 1,
    })
    const result = validateScenario(scenario)
    expect(result.valid).toBe(false)
    expect(result.issues.some((issue) => issue.message.includes('物件 ID'))).toBe(true)
  })

  it('自定義事件缺少名稱時報錯', () => {
    const scenario = makeScenario()
    scenario.entities.push({
      id: 'event-1', kind: 'event', position: { row: 5, column: 5 },
      data: { type: 'custom', name: '', description: '', icon: '🗨️', choices: [{ id: 'c1', label: '選項', description: '', endsPlayerTurn: false, requirements: [], effects: [{ type: 'money', amount: 1 }] }] },
    })
    const result = validateScenario(scenario)
    expect(result.valid).toBe(false)
    expect(result.issues.some((issue) => issue.message.includes('缺少名稱'))).toBe(true)
  })

  it('自定義事件缺少選項時報錯', () => {
    const scenario = makeScenario()
    scenario.entities.push({
      id: 'event-1', kind: 'event', position: { row: 5, column: 5 },
      data: { type: 'custom', name: '靈泉', description: '', icon: '🗨️', choices: [] },
    })
    const result = validateScenario(scenario)
    expect(result.valid).toBe(false)
    expect(result.issues.some((issue) => issue.message.includes('至少需要一個選項'))).toBe(true)
  })

  it('自定義事件選項缺少效果時報錯', () => {
    const scenario = makeScenario()
    scenario.entities.push({
      id: 'event-1', kind: 'event', position: { row: 5, column: 5 },
      data: { type: 'custom', name: '靈泉', description: '', icon: '🗨️', choices: [{ id: 'c1', label: '選項', description: '', endsPlayerTurn: false, requirements: [], effects: [] }] },
    })
    const result = validateScenario(scenario)
    expect(result.valid).toBe(false)
    expect(result.issues.some((issue) => issue.message.includes('缺少效果'))).toBe(true)
  })
})