import { describe, expect, it, beforeEach, vi } from 'vitest'
import { groupScenariosByChapter, buildChapterProgressView } from './CampaignScenarioTab'
import type { StoredScenario } from '../game/scenarioStorage'
import type { ScenarioDefinition } from '../editor/editorTypes'
import { lingyuan } from '../game/catalogs/officialCharacterCatalog'
import { CHARACTER_ROSTER_STORAGE_KEY } from '../game/characterRoster'
import type { ScenarioClearanceMap } from '../game/campaignClearance'

function makeScenario(overrides: Partial<ScenarioDefinition> = {}): ScenarioDefinition {
  return {
    version: '1.0.0',
    id: 'test-scenario',
    title: '測試關卡',
    description: 'desc',
    chapterIndex: 0,
    mapSize: { rows: 5, columns: 5 },
    cells: [],
    entities: [],
    quests: { victoryObjectives: [], failConditions: { baseMustSurvive: false, playerMustSurvive: false } },
    dialogues: {},
    triggers: [],
    ...overrides,
  } as ScenarioDefinition
}

function makeEntry(overrides: Partial<StoredScenario> = {}): StoredScenario {
  return {
    id: overrides.scenario?.id ?? 'test-scenario',
    source: 'official',
    sourceVersion: '1.0.0',
    modified: false,
    scenario: makeScenario(),
    ...overrides,
  } as StoredScenario
}

function stubLocalStorage() {
  const store = new Map<string, string>()
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => (store.has(key) ? store.get(key) ?? null : null),
    setItem: (key: string, value: string) => { store.set(key, value) },
    removeItem: (key: string) => { store.delete(key) },
  })
}

/** 建立標準新角狀態的凌淵名册資料（不預學專屬功法——四件套靠章節解鎖）。 */
function makeRosterLingyuan() {
  return {
    id: lingyuan.characterId,
    name: lingyuan.name,
    isOfficial: true,
    chapterId: lingyuan.chapterId,
    attributeBonuses: { armStrength: 0, constitution: 0, agility: 0, innerEnergy: 0, insight: 0 },
    scrolls: 0,
    unlockedSkillIds: ['tuna-gong', 'sky-breaking-palm'],
    learnedSkillIds: ['tuna-gong'],
    initialExternalSkillIds: [],
    initialInternalSkillId: 'tuna-gong',
    unlockedTalentIds: [],
    talentIds: [],
    gamesPlayed: 0,
    createdAt: 0,
  }
}

describe('groupScenariosByChapter', () => {
  it('空清單回傳空陣列', () => {
    expect(groupScenariosByChapter([])).toEqual([])
  })

  it('凌淵的序章關卡會進入「凌淵」群組（key = characterId）', () => {
    const entry = makeEntry({ id: 'prologue-village', scenario: makeScenario({ id: 'prologue-village' }) })
    const groups = groupScenariosByChapter([entry])
    expect(groups).toHaveLength(1)
    expect(groups[0].key).toBe(lingyuan.characterId)
    expect(groups[0].header).toContain(lingyuan.name)
    expect(groups[0].character).toBe(lingyuan)
    expect(groups[0].entries).toEqual([entry])
  })

  it('群組 header 為「主角名稱」、副標含「第 N 章」與篇章標題', () => {
    const entry = makeEntry({
      id: 'prologue-village',
      scenario: makeScenario({ id: 'prologue-village', title: '序章：青石遺恨', chapterIndex: 0 }),
    })
    const groups = groupScenariosByChapter([entry])
    expect(groups[0].header).toBe(`${lingyuan.portrait} ${lingyuan.name}`)
    expect(groups[0].subtitle).toContain('第 1 章')
    expect(groups[0].subtitle).toContain('序章：青石遺恨')
  })

  it('自訂關卡與未綁定守護者的官方關卡，會被收進「未分類」群組', () => {
    const custom = makeEntry({ id: 'custom-1', source: 'custom', scenario: makeScenario({ id: 'custom-1' }) })
    const orphan = makeEntry({ id: 'unknown-official', scenario: makeScenario({ id: 'unknown-official' }) })
    const groups = groupScenariosByChapter([custom, orphan])
    expect(groups).toHaveLength(1)
    expect(groups[0].key).toBe('uncategorized')
    expect(groups[0].character).toBeNull()
    expect(groups[0].header).toContain('未分類')
    // 同 chapterIndex 預設值 0：官方優先於自訂。
    expect(groups[0].entries.map((entry) => entry.id)).toEqual(['unknown-official', 'custom-1'])
  })

  it('混合：官方角色關卡 + 自訂關卡 → 兩個群組（官方在前、未分類在後）', () => {
    const officialEntry = makeEntry({ id: 'prologue-village', scenario: makeScenario({ id: 'prologue-village' }) })
    const custom = makeEntry({ id: 'custom-1', source: 'custom', scenario: makeScenario({ id: 'custom-1' }) })
    const groups = groupScenariosByChapter([custom, officialEntry])
    expect(groups).toHaveLength(2)
    expect(groups[0].key).toBe(lingyuan.characterId)
    expect(groups[1].key).toBe('uncategorized')
  })

  it('群組內依 chapterIndex 升冪排序；同章節官方優先', () => {
    const chapterA = makeEntry({ id: 'prologue-village', scenario: makeScenario({ id: 'prologue-village', chapterIndex: 0 }) })
    // 同章節但有 custom 副本：應排在 official 之後
    const chapterADuplicate = makeEntry({ id: 'prologue-village-copy', source: 'custom', scenario: makeScenario({ id: 'prologue-village', chapterIndex: 0 }) })
    const groups = groupScenariosByChapter([chapterADuplicate, chapterA])
    expect(groups[0].entries.map((entry) => entry.id)).toEqual(['prologue-village', 'prologue-village-copy'])
  })

  it('未分類群組內的關卡也依 chapterIndex 排序', () => {
    const a = makeEntry({ id: 'custom-a', source: 'custom', scenario: makeScenario({ id: 'custom-a', chapterIndex: 2 }) })
    const b = makeEntry({ id: 'custom-b', source: 'custom', scenario: makeScenario({ id: 'custom-b', chapterIndex: 5 }) })
    const c = makeEntry({ id: 'custom-c', source: 'custom', scenario: makeScenario({ id: 'custom-c', chapterIndex: 1 }) })
    const groups = groupScenariosByChapter([a, b, c])
    expect(groups).toHaveLength(1)
    expect(groups[0].key).toBe('uncategorized')
    expect(groups[0].entries.map((entry) => entry.id)).toEqual(['custom-c', 'custom-a', 'custom-b'])
  })

  it('未綁定守護者的官方關卡即使有 chapterIndex，也歸入未分類', () => {
    const orphan = makeEntry({
      id: 'orphan-with-index',
      scenario: makeScenario({ id: 'orphan-with-index', chapterIndex: 3 }),
    })
    const groups = groupScenariosByChapter([orphan])
    expect(groups).toHaveLength(1)
    expect(groups[0].key).toBe('uncategorized')
  })

  it('凌淵的序章 + 第二章（forest-hunt）+ 第三章（frost-water-lament / 寒水之殤）會全部併入同一個凌淵群組', () => {
    const prologue = makeEntry({ id: 'prologue-village', scenario: makeScenario({ id: 'prologue-village', chapterIndex: 0, title: '序章：青石遺恨' }) })
    const chapter2 = makeEntry({ id: 'forest-hunt', scenario: makeScenario({ id: 'forest-hunt', chapterIndex: 1, title: '第二章：林海伏妖' }) })
    const chapter3 = makeEntry({ id: 'frost-water-lament', scenario: makeScenario({ id: 'frost-water-lament', chapterIndex: 2, title: '第三章：寒水之殤' }) })
    const groups = groupScenariosByChapter([chapter2, prologue, chapter3])
    expect(groups).toHaveLength(1)
    expect(groups[0].key).toBe(lingyuan.characterId)
    expect(groups[0].character).toBe(lingyuan)
    // 群組內依 chapterIndex 排序：1→2→3 章
    expect(groups[0].entries.map((entry) => entry.id)).toEqual(['prologue-village', 'forest-hunt', 'frost-water-lament'])
    // 副標：第 1~3 章 + 三個章名
    expect(groups[0].subtitle).toContain('第 1～3 章')
    expect(groups[0].subtitle).toContain('序章：青石遺恨')
    expect(groups[0].subtitle).toContain('第二章：林海伏妖')
    expect(groups[0].subtitle).toContain('第三章：寒水之殤')
  })

  it('未綁定任何守護者的章節（如未來的第四、第五章）仍會落到未分類', () => {
    const ch4 = makeEntry({ id: 'chapter-4', scenario: makeScenario({ id: 'chapter-4', chapterIndex: 3, title: '第四章' }) })
    const groups = groupScenariosByChapter([ch4])
    expect(groups).toHaveLength(1)
    expect(groups[0].key).toBe('uncategorized')
  })
})

describe('buildChapterProgressView', () => {
  beforeEach(() => {
    stubLocalStorage()
  })

  it('空 localStorage：rosterSnapshot 為 null，但 chapters 仍依 chapterIds 列出', () => {
    const clearances: ScenarioClearanceMap = {}
    const view = buildChapterProgressView(lingyuan, clearances)
    expect(view.characterName).toBe('凌淵')
    expect(view.rosterSnapshot).toBeNull()
    expect(view.chapters.map((c) => c.scenarioId)).toEqual([
      'prologue-village',
      'forest-hunt',
      'frost-water-lament',
    ])
    // 沒有 roster → totalUnlocked 只有在「通關解鎖」分支才會填入，初始帶入分支不觸發。
    expect(view.totalUnlocked).toEqual([])
    expect(view.totalPending).toEqual([])
  })

  it('名册內已有凌淵但未通關任何章節 → 僅初始內功（吐納功）已解鎖，專屬功法靠章節解鎖', () => {
    localStorage.setItem(CHARACTER_ROSTER_STORAGE_KEY, JSON.stringify({
      version: 2,
      characters: [makeRosterLingyuan()],
    }))
    const clearances: ScenarioClearanceMap = {}
    const view = buildChapterProgressView(lingyuan, clearances)
    expect(view.rosterSnapshot).not.toBeNull()
    // 初始內功（exclusiveInnerSkillId = tuna-gong）已解鎖
    expect(view.totalUnlocked.map((item) => item.id)).toEqual(['tuna-gong'])
    // 專屬功法尚未解鎖，無 pending
    expect(view.totalPending).toEqual([])
  })

  it('通關全部三章但名册未套用 → 全部解鎖項目進入 totalPending（pending-apply）', () => {
    // 模擬：凌淵已存在名册（標準新角），三章皆通關，但解鎖尚未套用。
    localStorage.setItem(CHARACTER_ROSTER_STORAGE_KEY, JSON.stringify({
      version: 2,
      characters: [makeRosterLingyuan()],
    }))
    const clearances: ScenarioClearanceMap = {
      'prologue-village': true,
      'forest-hunt': true,
      'frost-water-lament': true,
    }
    const view = buildChapterProgressView(lingyuan, clearances)
    expect(view.chapters.map((c) => c.cleared)).toEqual([true, true, true])
    // 序章 1 內功 + 第二章 1 外功 + 第三章 2 外功 = 4 功法；2 天賦
    const pendingIds = view.totalPending.map((item) => item.id)
    expect(pendingIds).toContain('lingyuan-shelter-breath')
    expect(pendingIds).toContain('lingyuan-mountain-pulse')
    expect(pendingIds).toContain('lingyuan-rivers-sustain')
    expect(pendingIds).toContain('lingyuan-five-elements-mend')
    expect(pendingIds).toContain('vital-body')
    expect(pendingIds).toContain('deep-dantian')
    // 初始內功（吐納功）已解鎖，不會進 pending
    expect(view.totalUnlocked.map((item) => item.id)).toEqual(['tuna-gong'])
  })

  it('篇章通關狀態正確對應：未挑戰 / 已通關 / 已挑戰失敗', () => {
    const clearances: ScenarioClearanceMap = {
      'prologue-village': true,
      'forest-hunt': false,
      // 'frost-water-lament' 未設值
    }
    const view = buildChapterProgressView(lingyuan, clearances)
    const cleared = Object.fromEntries(view.chapters.map((c) => [c.scenarioId, c.cleared]))
    expect(cleared['prologue-village']).toBe(true)
    expect(cleared['forest-hunt']).toBe(false)
    expect(cleared['frost-water-lament']).toBeUndefined()
  })

  it('清空通關紀錄時，所有篇章 cleared 為 undefined', () => {
    const view = buildChapterProgressView(lingyuan, {})
    for (const chapter of view.chapters) {
      expect(chapter.cleared).toBeUndefined()
    }
  })

  it('storyUnlocks 分配：序章 1 內功、第二章 1 外功 + 1 天賦、第三章 2 外功 + 1 天賦', () => {
    const view = buildChapterProgressView(lingyuan, {})
    const byId = Object.fromEntries(view.chapters.map((c) => [c.scenarioId, c]))
    expect(byId['prologue-village'].unlocks.innerSkillIds).toEqual(['lingyuan-shelter-breath'])
    expect(byId['forest-hunt'].unlocks.externalSkillIds).toEqual(['lingyuan-mountain-pulse'])
    expect(byId['forest-hunt'].unlocks.talentIds).toEqual(['vital-body'])
    expect(byId['frost-water-lament'].unlocks.externalSkillIds).toEqual([
      'lingyuan-rivers-sustain',
      'lingyuan-five-elements-mend',
    ])
    expect(byId['frost-water-lament'].unlocks.talentIds).toEqual(['deep-dantian'])
  })

  it('通關序章但名册未套用 → 山河歸藏進入 totalPending；第二章未通關 → 其解鎖不出現', () => {
    localStorage.setItem(CHARACTER_ROSTER_STORAGE_KEY, JSON.stringify({
      version: 2,
      characters: [makeRosterLingyuan()],
    }))
    const clearances: ScenarioClearanceMap = { 'prologue-village': true }
    const view = buildChapterProgressView(lingyuan, clearances)
    // 序章解鎖的內功已通關但名册未含 → pending
    expect(view.totalPending.map((item) => item.id)).toEqual(['lingyuan-shelter-breath'])
    expect(view.totalPending[0].name).toBe('山河歸藏')
    // 第二章未通關 → 山河脈動 / 金剛體魄不出現
    const allIds = [...view.totalUnlocked, ...view.totalPending].map((item) => item.id)
    expect(allIds).not.toContain('lingyuan-mountain-pulse')
    expect(allIds).not.toContain('vital-body')
  })

  it('通關序章且名册已含內功 → 山河歸藏進入 totalUnlocked', () => {
    localStorage.setItem(CHARACTER_ROSTER_STORAGE_KEY, JSON.stringify({
      version: 2,
      characters: [{
        ...makeRosterLingyuan(),
        unlockedSkillIds: ['tuna-gong', 'sky-breaking-palm', 'lingyuan-shelter-breath'],
        learnedSkillIds: ['tuna-gong', 'lingyuan-shelter-breath'],
        initialInternalSkillId: 'lingyuan-shelter-breath',
      }],
    }))
    const clearances: ScenarioClearanceMap = { 'prologue-village': true }
    const view = buildChapterProgressView(lingyuan, clearances)
    expect(view.totalUnlocked.map((item) => item.id)).toContain('lingyuan-shelter-breath')
    expect(view.totalPending).toEqual([])
  })

  it('未通關的篇章，其解鎖項目不出現在任何桶中（locked 不顯示於摘要）', () => {
    localStorage.setItem(CHARACTER_ROSTER_STORAGE_KEY, JSON.stringify({
      version: 2,
      characters: [makeRosterLingyuan()],
    }))
    const clearances: ScenarioClearanceMap = { 'prologue-village': true }
    const view = buildChapterProgressView(lingyuan, clearances)
    // 第二章/第三章未通關 → 其解鎖項目不應出現
    const allIds = [...view.totalUnlocked, ...view.totalPending].map((item) => item.id)
    expect(allIds).not.toContain('lingyuan-mountain-pulse')
    expect(allIds).not.toContain('vital-body')
    expect(allIds).not.toContain('deep-dantian')
  })
})
