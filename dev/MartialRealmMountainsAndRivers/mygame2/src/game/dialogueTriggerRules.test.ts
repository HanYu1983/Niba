import { describe, expect, it } from 'vitest'
import { collectTriggeredDialogues } from './rules/dialogueTriggerRules'
import type { CampaignState, GameState } from './types'

const campaign: CampaignState = {
  currentChapter: 0,
  triggeredDialogueIds: [],
  dialogueQueue: [],
  activeObjectives: [],
  failConditions: {},
}

function makeState(overrides: Partial<GameState> = {}): GameState {
  return {
    map: { rows: 5, columns: 5, cells: [] },
    bases: [],
    creatureNests: [],
    resourcePoints: [],
    itemPoints: [],
    players: [],
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
    campaignState: { ...campaign },
    ...overrides,
  }
}

// 測試用自訂章節 Catalog（on-start 觸發、無章節 ID 限制以模擬序章）。
// 這裡直接引用序章 Catalog 的對外行為（透過 collectTriggeredDialogues 的 chapterId 索引）。
describe('collectTriggeredDialogues', () => {
  it('on-start 觸發序章開局對話（依原始順序）', () => {
    const state = makeState({ campaignState: { ...campaign, currentChapter: 0 } })
    const steps = collectTriggeredDialogues(state, { type: 'on-start', chapterId: 'prologue-village' })
    expect(steps.length).toBeGreaterThan(0)
    expect(steps.every((s) => s.triggerCondition === 'on-start')).toBe(true)
  })

  it('已觸發過的對話不重複回傳', () => {
    const first = collectTriggeredDialogues(makeState(), { type: 'on-start', chapterId: 'prologue-village' })
    expect(first.length).toBeGreaterThan(0)
    const state = makeState({
      campaignState: { ...campaign, triggeredDialogueIds: first.map((s) => s.id) },
    })
    expect(collectTriggeredDialogues(state, { type: 'on-start', chapterId: 'prologue-village' })).toEqual([])
  })

  it('on-victory 觸發勝利對話', () => {
    const state = makeState({ campaignState: { ...campaign } })
    const steps = collectTriggeredDialogues(state, { type: 'on-victory', chapterId: 'prologue-village' })
    expect(steps.some((s) => s.triggerCondition === 'on-victory')).toBe(true)
  })

  it('未知章節回傳空清單', () => {
    expect(collectTriggeredDialogues(makeState(), { type: 'on-start', chapterId: 'unknown-chapter' })).toEqual([])
  })

  it('triggerParam 不符的對話不觸發', () => {
    const state = makeState({ campaignState: { ...campaign } })
    // on-defeat-boss 需要特定 param；序章沒有 on-defeat-boss 對話，因此回傳空。
    const steps = collectTriggeredDialogues(state, { type: 'on-defeat-boss', param: 'boss-treant', chapterId: 'prologue-village' })
    expect(steps.length).toBe(0)
  })
})
