import { describe, expect, it } from 'vitest'
import { executeTriggers } from './triggerRules'
import { checkVictory, progressObjectives } from './campaignRules'
import { buildGameStateFromScenario } from '../../editor/rules/scenarioCompiler'
import { createEmptyScenario } from '../../editor/editorTypes'
import type { ScenarioDefinition } from '../../editor/editorTypes'

/** 建立含對話組與觸發器的測試劇本。 */
function makeScenario(): ScenarioDefinition {
  const scenario = createEmptyScenario(10, 10)
  return {
    ...scenario,
    id: 'trigger-test',
    chapterIndex: 0,
    entities: [
      { id: 'player-1', kind: 'player', position: { row: 8, column: 2 }, data: { name: '主角' } },
      { id: 'boss-1', kind: 'creature', position: { row: 2, column: 7 }, data: { name: '青石妖王', isBoss: true, level: 3, schoolId: 'swift-wind', behaviorType: 'sieger', homeNestId: 'nest-1' } },
      { id: 'creature-hidden', kind: 'creature', position: { row: 3, column: 3 }, data: { name: '隱藏妖物', level: 1, schoolId: 'void-spirit', behaviorType: 'roamer', spawnOnLoad: false } },
    ],
    quests: {
      victoryObjectives: [
        { id: 'obj-1', title: '擊敗青石妖王', type: 'defeat-creature', targetId: 'boss-1', targetValue: 1 },
      ],
      failConditions: { baseMustSurvive: true, playerMustSurvive: true, maxRounds: 20 },
    },
    dialogues: {
      'group-intro': {
        name: '開局對話組',
        steps: [
          { id: 'd1', speakerName: '村長', speakerIcon: '👴', content: '開局對話' },
          { id: 'd2', speakerName: '凌淵', speakerIcon: '🥋', content: '我這便去打探。' },
        ],
      },
    },
    triggers: [
      { id: 'trigger-start', condition: 'on-start', action: 'start-dialogue', actionParam: 'group-intro' },
      { id: 'trigger-spawn', condition: 'on-defeat-boss', conditionParam: 'boss-1', action: 'spawn-creature', actionParam: 'creature-hidden' },
    ],
  }
}

describe('executeTriggers', () => {
  it('on-start 觸發 start-dialogue：將對話組步驟填入佇列', () => {
    const state = buildGameStateFromScenario(makeScenario())
    const next = executeTriggers(state, { type: 'on-start' })
    const queue = next.campaignState?.dialogueQueue ?? []
    expect(queue).toHaveLength(2)
    expect(queue[0]).toMatchObject({ stepId: 'd1', speakerName: '村長', content: '開局對話' })
    expect(queue[1]).toMatchObject({ stepId: 'd2', speakerName: '凌淵' })
  })

  it('條件不符時不觸發（on-victory 不觸發 on-start 觸發器）', () => {
    const state = buildGameStateFromScenario(makeScenario())
    const next = executeTriggers(state, { type: 'on-victory' })
    expect(next.campaignState?.dialogueQueue ?? []).toHaveLength(0)
  })

  it('on-defeat-boss 觸發 spawn-creature：將隱藏怪物加入場上', () => {
    const state = buildGameStateFromScenario(makeScenario())
    expect(state.creatures.some((c) => c.id === 'creature-hidden')).toBe(false)
    const next = executeTriggers(state, { type: 'on-defeat-boss', param: 'boss-1' })
    expect(next.creatures.some((c) => c.id === 'creature-hidden')).toBe(true)
  })

  it('spawn-creature 避免重複生成：同 id 怪物已在場上時跳過', () => {
    const state = buildGameStateFromScenario(makeScenario())
    const first = executeTriggers(state, { type: 'on-defeat-boss', param: 'boss-1' })
    const second = executeTriggers(first, { type: 'on-defeat-boss', param: 'boss-1' })
    const count = second.creatures.filter((c) => c.id === 'creature-hidden').length
    expect(count).toBe(1)
  })

  it('conditionParam 不符時不觸發（擊敗其他 Boss）', () => {
    const state = buildGameStateFromScenario(makeScenario())
    const next = executeTriggers(state, { type: 'on-defeat-boss', param: 'boss-other' })
    expect(next.creatures.some((c) => c.id === 'creature-hidden')).toBe(false)
  })

  it('沙盒模式（無 campaignState）下不觸發任何行為', () => {
    const state = buildGameStateFromScenario(makeScenario())
    const sandbox = { ...state, campaignState: undefined }
    const next = executeTriggers(sandbox, { type: 'on-start' })
    expect(next).toBe(sandbox)
  })

  it('on-round-reached 觸發 start-dialogue：到達指定回合時填入對話', () => {
    const scenario = makeScenario()
    scenario.triggers = [
      { id: 'trigger-round', condition: 'on-round-reached', conditionParam: '3', action: 'start-dialogue', actionParam: 'group-intro' },
    ]
    const state = buildGameStateFromScenario(scenario)
    // 未到達指定回合（round 2）不觸發。
    const notYet = executeTriggers(state, { type: 'on-round-reached', param: '2' })
    expect(notYet.campaignState?.dialogueQueue ?? []).toHaveLength(0)
    // 到達指定回合（round 3）觸發。
    const reached = executeTriggers(state, { type: 'on-round-reached', param: '3' })
    expect(reached.campaignState?.dialogueQueue ?? []).toHaveLength(2)
  })

  it('on-victory 透過 checkVictory 觸發 start-dialogue（勝利結算前）', () => {
    const scenario = makeScenario()
    scenario.triggers = [
      { id: 'trigger-victory', condition: 'on-victory', action: 'start-dialogue', actionParam: 'group-intro' },
    ]
    const state = buildGameStateFromScenario(scenario)
    // 尚未勝利：不觸發。
    const notWon = checkVictory(state)
    expect(notWon.gameWon).toBeFalsy()
    expect(notWon.campaignState?.dialogueQueue ?? []).toHaveLength(0)
    // 擊敗 Boss 完成目標 → checkVictory 判定勝利並觸發 on-victory。
    const progressed = progressObjectives(state, { type: 'defeat-creature', targetId: 'boss-1' })
    const won = checkVictory(progressed)
    expect(won.gameWon).toBe(true)
    expect(won.campaignState?.dialogueQueue ?? []).toHaveLength(2)
  })

  it('on-object-destroyed 觸發 start-dialogue：指定物件從地圖消失時填入對話', () => {
    const scenario = makeScenario()
    scenario.triggers = [
      { id: 'trigger-destroy', condition: 'on-object-destroyed', conditionParam: 'boss-1', action: 'start-dialogue', actionParam: 'group-intro' },
    ]
    const state = buildGameStateFromScenario(scenario)
    // 指定物件未消失（其他物件）不觸發。
    const notDestroyed = executeTriggers(state, { type: 'on-object-destroyed', param: 'creature-hidden' })
    expect(notDestroyed.campaignState?.dialogueQueue ?? []).toHaveLength(0)
    // 指定物件消失（boss-1）觸發。
    const destroyed = executeTriggers(state, { type: 'on-object-destroyed', param: 'boss-1' })
    expect(destroyed.campaignState?.dialogueQueue ?? []).toHaveLength(2)
  })

  it('on-object-destroyed 未指定物件 id 時，任何物件消失皆觸發', () => {
    const scenario = makeScenario()
    scenario.triggers = [
      { id: 'trigger-destroy-any', condition: 'on-object-destroyed', action: 'start-dialogue', actionParam: 'group-intro' },
    ]
    const state = buildGameStateFromScenario(scenario)
    const destroyed = executeTriggers(state, { type: 'on-object-destroyed', param: 'creature-hidden' })
    expect(destroyed.campaignState?.dialogueQueue ?? []).toHaveLength(2)
  })

  describe('on-events-resolved（多探索點事件解決後觸發）', () => {
    /** 建立含 on-events-resolved 觸發器的劇本（對話 + 生成隱藏 boss）。 */
    function makeEventsScenario(): ScenarioDefinition {
      const scenario = makeScenario()
      scenario.triggers = [
        {
          id: 'trigger-all-events',
          condition: 'on-events-resolved',
          conditionParam: 'event-a,event-b,event-c',
          action: 'start-dialogue',
          actionParam: 'group-intro',
        },
        {
          id: 'trigger-all-events-boss',
          condition: 'on-events-resolved',
          conditionParam: 'event-a,event-b,event-c',
          action: 'spawn-creature',
          actionParam: 'creature-hidden',
        },
      ]
      return scenario
    }

    /** 將指定事件標記為已解決。 */
    function markResolved(state: ReturnType<typeof buildGameStateFromScenario>, ids: string[]) {
      return {
        ...state,
        campaignState: state.campaignState
          ? { ...state.campaignState, resolvedEventIds: [...new Set([...(state.campaignState.resolvedEventIds ?? []), ...ids])] }
          : state.campaignState,
      }
    }

    it('部分事件解決時不觸發', () => {
      const state = buildGameStateFromScenario(makeEventsScenario())
      const partial = markResolved(state, ['event-a', 'event-b'])
      const next = executeTriggers(partial, { type: 'on-events-resolved', param: 'event-b' })
      expect(next.campaignState?.dialogueQueue ?? []).toHaveLength(0)
      expect(next.creatures.some((c) => c.id === 'creature-hidden')).toBe(false)
    })

    it('全部事件解決後觸發：對話入佇列 + boss 生成', () => {
      const state = buildGameStateFromScenario(makeEventsScenario())
      const all = markResolved(state, ['event-a', 'event-b', 'event-c'])
      const next = executeTriggers(all, { type: 'on-events-resolved', param: 'event-c' })
      expect(next.campaignState?.dialogueQueue ?? []).toHaveLength(2)
      expect(next.creatures.some((c) => c.id === 'creature-hidden')).toBe(true)
    })

    it('只執行一次：再次檢查不重複觸發（對話不重播、boss 不重生）', () => {
      const state = buildGameStateFromScenario(makeEventsScenario())
      const all = markResolved(state, ['event-a', 'event-b', 'event-c'])
      const first = executeTriggers(all, { type: 'on-events-resolved', param: 'event-c' })
      const second = executeTriggers(first, { type: 'on-events-resolved', param: 'event-c' })
      expect(second.campaignState?.dialogueQueue ?? []).toHaveLength(2)
      expect(second.creatures.filter((c) => c.id === 'creature-hidden')).toHaveLength(1)
    })

    it('conditionParam 為空或格式錯誤時不觸發', () => {
      const scenario = makeScenario()
      scenario.triggers = [
        { id: 'trigger-empty', condition: 'on-events-resolved', action: 'start-dialogue', actionParam: 'group-intro' },
      ]
      const state = buildGameStateFromScenario(scenario)
      const next = executeTriggers(state, { type: 'on-events-resolved' })
      expect(next.campaignState?.dialogueQueue ?? []).toHaveLength(0)
    })
  })
})