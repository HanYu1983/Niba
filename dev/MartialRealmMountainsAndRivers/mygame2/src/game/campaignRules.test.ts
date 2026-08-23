import { describe, expect, it } from 'vitest'
import { progressObjectives, checkVictory, areMainObjectivesComplete } from './rules/campaignRules'
import type { CampaignState, GameState } from './types'

function makeCampaign(overrides: Partial<CampaignState> = {}): CampaignState {
  return {
    currentChapter: 0,
    triggeredDialogueIds: [],
    dialogueQueue: [],
    activeObjectives: [],
    failConditions: {},
    ...overrides,
  }
}

function makeState(campaign: CampaignState, overrides: Partial<GameState> = {}): GameState {
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
    campaignState: campaign,
    ...overrides,
  }
}

describe('progressObjectives - defeat-creature', () => {
  it('綁定 targetId：只有擊敗指定怪物才算', () => {
    const campaign = makeCampaign({
      activeObjectives: [
        { id: 'o1', title: '擊敗青石妖王', type: 'defeat-creature', targetId: 'boss-1', targetValue: 1, currentValue: 0, completed: false },
      ],
    })
    // 擊敗其他怪物：不推進
    const other = progressObjectives(makeState(campaign), { type: 'defeat-creature', targetId: 'wolf-1' })
    expect(other.campaignState!.activeObjectives[0].currentValue).toBe(0)
    expect(other.campaignState!.activeObjectives[0].completed).toBe(false)
    // 擊敗指定 Boss：完成
    const boss = progressObjectives(makeState(campaign), { type: 'defeat-creature', targetId: 'boss-1' })
    expect(boss.campaignState!.activeObjectives[0].currentValue).toBe(1)
    expect(boss.campaignState!.activeObjectives[0].completed).toBe(true)
  })

  it('不綁定 targetId：擊敗任意怪物都累計', () => {
    const campaign = makeCampaign({
      activeObjectives: [
        { id: 'o1', title: '擊敗 3 隻怪物', type: 'defeat-creature', targetValue: 3, currentValue: 0, completed: false },
      ],
    })
    const once = progressObjectives(makeState(campaign), { type: 'defeat-creature', targetId: 'wolf-1' })
    expect(once.campaignState!.activeObjectives[0].currentValue).toBe(1)
    const twice = progressObjectives(once, { type: 'defeat-creature', targetId: 'wolf-2' })
    expect(twice.campaignState!.activeObjectives[0].currentValue).toBe(2)
    const thrice = progressObjectives(twice, { type: 'defeat-creature', targetId: 'wolf-3' })
    expect(thrice.campaignState!.activeObjectives[0].currentValue).toBe(3)
    expect(thrice.campaignState!.activeObjectives[0].completed).toBe(true)
  })

  it('已完成的目標不再累計', () => {
    const campaign = makeCampaign({
      activeObjectives: [
        { id: 'o1', title: '擊敗 1 隻怪物', type: 'defeat-creature', targetValue: 1, currentValue: 1, completed: true },
      ],
    })
    const next = progressObjectives(makeState(campaign), { type: 'defeat-creature', targetId: 'wolf-1' })
    expect(next.campaignState!.activeObjectives[0].currentValue).toBe(1)
  })

  it('沙盒模式（無 campaignState）不修改狀態', () => {
    const state = makeState(makeCampaign())
    const sandbox: GameState = { ...state, campaignState: undefined }
    expect(progressObjectives(sandbox, { type: 'defeat-creature', targetId: 'wolf-1' })).toBe(sandbox)
  })
})

describe('progressObjectives - build-building', () => {
  it('指定建築類型：只有建造該建築才算', () => {
    const campaign = makeCampaign({
      activeObjectives: [
        { id: 'o1', title: '建造醫療室', type: 'build-building', buildingType: 'infirmary', targetValue: 1, currentValue: 0, completed: false },
      ],
    })
    // 建造其他建築：不推進
    const other = progressObjectives(makeState(campaign), { type: 'build-building', buildingType: 'board' })
    expect(other.campaignState!.activeObjectives[0].completed).toBe(false)
    // 建造指定建築：完成
    const infirmary = progressObjectives(makeState(campaign), { type: 'build-building', buildingType: 'infirmary' })
    expect(infirmary.campaignState!.activeObjectives[0].completed).toBe(true)
  })

  it('未指定建築類型：建造任意建築都累計', () => {
    const campaign = makeCampaign({
      activeObjectives: [
        { id: 'o1', title: '建造 2 座建築', type: 'build-building', targetValue: 2, currentValue: 0, completed: false },
      ],
    })
    const once = progressObjectives(makeState(campaign), { type: 'build-building', buildingType: 'board' })
    expect(once.campaignState!.activeObjectives[0].currentValue).toBe(1)
    const twice = progressObjectives(once, { type: 'build-building', buildingType: 'infirmary' })
    expect(twice.campaignState!.activeObjectives[0].currentValue).toBe(2)
    expect(twice.campaignState!.activeObjectives[0].completed).toBe(true)
  })

  it('指定建築等級：需達到指定等級才算（如三級道具店）', () => {
    const campaign = makeCampaign({
      activeObjectives: [
        { id: 'o1', title: '洛陽建立三級道具店', type: 'build-building', buildingType: 'item-shop', buildingLevel: 3, targetValue: 1, currentValue: 0, completed: false },
      ],
    })
    // 建造 Lv.1：未達標
    const lv1 = progressObjectives(makeState(campaign), { type: 'build-building', buildingType: 'item-shop', buildingLevel: 1 })
    expect(lv1.campaignState!.activeObjectives[0].completed).toBe(false)
    // 升級到 Lv.2：仍未達標
    const lv2 = progressObjectives(makeState(campaign), { type: 'build-building', buildingType: 'item-shop', buildingLevel: 2 })
    expect(lv2.campaignState!.activeObjectives[0].completed).toBe(false)
    // 升級到 Lv.3：達標
    const lv3 = progressObjectives(makeState(campaign), { type: 'build-building', buildingType: 'item-shop', buildingLevel: 3 })
    expect(lv3.campaignState!.activeObjectives[0].completed).toBe(true)
  })
})

describe('checkVictory', () => {
  it('所有主線目標完成時設定 gameWon', () => {
    const campaign = makeCampaign({
      activeObjectives: [
        { id: 'o1', title: '擊敗 Boss', type: 'defeat-creature', targetId: 'boss-1', targetValue: 1, currentValue: 1, completed: true },
        { id: 'o2', title: '支線', type: 'destroy-nest', targetValue: 1, currentValue: 0, completed: false, isOptional: true },
      ],
    })
    const next = checkVictory(makeState(campaign))
    expect(next.gameWon).toBe(true)
  })

  it('主線目標未全完成時不設定 gameWon', () => {
    const campaign = makeCampaign({
      activeObjectives: [
        { id: 'o1', title: '擊敗 Boss', type: 'defeat-creature', targetId: 'boss-1', targetValue: 1, currentValue: 0, completed: false },
      ],
    })
    const next = checkVictory(makeState(campaign))
    expect(next.gameWon).toBeUndefined()
  })

  it('無主線目標時不勝利', () => {
    const campaign = makeCampaign({ activeObjectives: [] })
    const next = checkVictory(makeState(campaign))
    expect(next.gameWon).toBeUndefined()
  })

  it('reach-prestige：玩家聲望達標時自動完成並勝利', () => {
    const campaign = makeCampaign({
      activeObjectives: [
        { id: 'o1', title: '聲望達 240', type: 'reach-prestige', targetValue: 240, currentValue: 0, completed: false },
      ],
    })
    const state = makeState(campaign, {
      players: [{ id: 'player-1', name: '主角', prestige: 300 } as never],
    })
    const next = checkVictory(state)
    expect(next.campaignState!.activeObjectives[0].completed).toBe(true)
    expect(next.gameWon).toBe(true)
  })

  it('reach-prestige：聲望未達標時不完成', () => {
    const campaign = makeCampaign({
      activeObjectives: [
        { id: 'o1', title: '聲望達 240', type: 'reach-prestige', targetValue: 240, currentValue: 0, completed: false },
      ],
    })
    const state = makeState(campaign, {
      players: [{ id: 'player-1', name: '主角', prestige: 100 } as never],
    })
    const next = checkVictory(state)
    expect(next.campaignState!.activeObjectives[0].completed).toBe(false)
    expect(next.gameWon).toBeUndefined()
  })

  it('survive-rounds：到達指定回合時自動完成並勝利', () => {
    const campaign = makeCampaign({
      activeObjectives: [
        { id: 'o1', title: '存活 20 回合', type: 'survive-rounds', targetValue: 20, currentValue: 0, completed: false },
      ],
    })
    const next = checkVictory(makeState(campaign, { round: 20 }))
    expect(next.campaignState!.activeObjectives[0].completed).toBe(true)
    expect(next.gameWon).toBe(true)
  })

  it('survive-rounds：未到達指定回合時不完成', () => {
    const campaign = makeCampaign({
      activeObjectives: [
        { id: 'o1', title: '存活 20 回合', type: 'survive-rounds', targetValue: 20, currentValue: 0, completed: false },
      ],
    })
    const next = checkVictory(makeState(campaign, { round: 10 }))
    expect(next.campaignState!.activeObjectives[0].completed).toBe(false)
    expect(next.gameWon).toBeUndefined()
  })
})

describe('areMainObjectivesComplete', () => {
  it('正確判斷主線目標完成與否', () => {
    const allDone = makeCampaign({
      activeObjectives: [
        { id: 'o1', title: '目標1', type: 'defeat-creature', targetValue: 1, currentValue: 1, completed: true },
        { id: 'o2', title: '目標2', type: 'destroy-nest', targetValue: 1, currentValue: 1, completed: true },
      ],
    })
    expect(areMainObjectivesComplete(allDone)).toBe(true)

    const notDone = makeCampaign({
      activeObjectives: [
        { id: 'o1', title: '目標1', type: 'defeat-creature', targetValue: 1, currentValue: 1, completed: true },
        { id: 'o2', title: '目標2', type: 'destroy-nest', targetValue: 1, currentValue: 0, completed: false },
      ],
    })
    expect(areMainObjectivesComplete(notDone)).toBe(false)
  })
})

describe('progressObjectives - reach-position', () => {
  it('到達指定位置才完成', () => {
    const campaign = makeCampaign({
      activeObjectives: [
        { id: 'o1', title: '調查靈泉', type: 'reach-position', targetRow: 5, targetColumn: 5, targetValue: 1, currentValue: 0, completed: false },
      ],
    })
    // 到達其他位置：不推進
    const other = progressObjectives(makeState(campaign), { type: 'reach-position', row: 3, column: 3 })
    expect(other.campaignState!.activeObjectives[0].completed).toBe(false)
    // 到達指定位置：完成
    const reached = progressObjectives(makeState(campaign), { type: 'reach-position', row: 5, column: 5 })
    expect(reached.campaignState!.activeObjectives[0].completed).toBe(true)
  })
})

describe('progressObjectives - interact-object', () => {
  it('與指定物件互動才完成', () => {
    const campaign = makeCampaign({
      activeObjectives: [
        { id: 'o1', title: '幫助村民', type: 'interact-object', targetId: 'villager-1', targetValue: 1, currentValue: 0, completed: false },
      ],
    })
    // 與其他物件互動：不推進
    const other = progressObjectives(makeState(campaign), { type: 'interact-object', targetId: 'spring-1' })
    expect(other.campaignState!.activeObjectives[0].completed).toBe(false)
    // 與指定物件互動：完成
    const interacted = progressObjectives(makeState(campaign), { type: 'interact-object', targetId: 'villager-1' })
    expect(interacted.campaignState!.activeObjectives[0].completed).toBe(true)
  })
})
