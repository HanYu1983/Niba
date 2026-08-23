import { describe, expect, it } from 'vitest'
import {
  enqueueDialogue,
  dequeueDialogue,
  markDialogueTriggered,
  skipAllDialogue,
  isDialogueQueueEmpty,
} from './actions/dialogueActions'
import type { CampaignState, GameState } from './types'
import type { ScenarioDialogueStep } from './catalogs/storyDialogueCatalog'

const step = (id: string): ScenarioDialogueStep => ({
  id,
  speakerName: '測試者',
  speakerIcon: '🗣️',
  content: `測試對話 ${id}`,
  triggerCondition: 'on-start',
})

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

describe('enqueueDialogue', () => {
  it('推入對話並轉為佇列項', () => {
    const state = makeState()
    const next = enqueueDialogue(state, [step('a'), step('b')])
    expect(next.campaignState!.dialogueQueue.map((e) => e.stepId)).toEqual(['a', 'b'])
    expect(next.campaignState!.dialogueQueue[0]).toMatchObject({ speakerName: '測試者', consumed: false })
  })

  it('空步驟或無 campaignState 時不修改狀態', () => {
    expect(enqueueDialogue(makeState(), []).campaignState!.dialogueQueue).toEqual([])
    const sandbox = makeState({ campaignState: undefined })
    expect(enqueueDialogue(sandbox, [step('a')])).toBe(sandbox)
  })
})

describe('dequeueDialogue', () => {
  it('取出首項並從佇列移除', () => {
    const state = makeState({ campaignState: { ...campaign, dialogueQueue: [{ stepId: 'a', speakerName: 'x', speakerIcon: '', content: 'c', triggerCondition: 'on-start' }, { stepId: 'b', speakerName: 'x', speakerIcon: '', content: 'c', triggerCondition: 'on-start' }] } })
    const { state: next, entry } = dequeueDialogue(state)
    expect(entry!.stepId).toBe('a')
    expect(next.campaignState!.dialogueQueue.map((e) => e.stepId)).toEqual(['b'])
  })

  it('空佇列回傳 null 且不修改狀態', () => {
    const { state: next, entry } = dequeueDialogue(makeState())
    expect(entry).toBeNull()
    expect(next.campaignState!.dialogueQueue).toEqual([])
  })
})

describe('markDialogueTriggered / skipAllDialogue', () => {
  it('標記已觸發且不重複', () => {
    const state = makeState()
    const once = markDialogueTriggered(state, 'a')
    expect(once.campaignState!.triggeredDialogueIds).toEqual(['a'])
    expect(markDialogueTriggered(once, 'a').campaignState!.triggeredDialogueIds).toEqual(['a'])
  })

  it('跳過全部對話：清空佇列並標記所有 stepId', () => {
    const state = makeState({ campaignState: { ...campaign, dialogueQueue: [{ stepId: 'a', speakerName: 'x', speakerIcon: '', content: 'c', triggerCondition: 'on-start' }, { stepId: 'b', speakerName: 'x', speakerIcon: '', content: 'c', triggerCondition: 'on-start' }] } })
    const next = skipAllDialogue(state)
    expect(next.campaignState!.dialogueQueue).toEqual([])
    expect(next.campaignState!.triggeredDialogueIds.sort()).toEqual(['a', 'b'])
  })
})

describe('isDialogueQueueEmpty', () => {
  it('正確判斷佇列空否', () => {
    expect(isDialogueQueueEmpty(makeState())).toBe(true)
    const nonEmpty = makeState({ campaignState: { ...campaign, dialogueQueue: [{ stepId: 'a', speakerName: 'x', speakerIcon: '', content: 'c', triggerCondition: 'on-start' }] } })
    expect(isDialogueQueueEmpty(nonEmpty)).toBe(false)
  })
})
