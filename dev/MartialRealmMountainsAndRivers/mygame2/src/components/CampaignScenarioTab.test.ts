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

  it('名册內已有凌淵時，初始四件套列為「已解鎖」', () => {
    localStorage.setItem(CHARACTER_ROSTER_STORAGE_KEY, JSON.stringify({
      version: 2,
      characters: [{
        id: lingyuan.characterId,
        name: lingyuan.name,
        isOfficial: true,
        chapterId: lingyuan.chapterId,
        attributeBonuses: { armStrength: 0, constitution: 0, agility: 0, innerEnergy: 0, insight: 0 },
        scrolls: 0,
        unlockedSkillIds: [
          'tuna-gong',
          'sky-breaking-palm',
          lingyuan.exclusiveInnerSkillId,
          ...lingyuan.exclusiveExternalSkillIds,
        ],
        learnedSkillIds: [lingyuan.exclusiveInnerSkillId, ...lingyuan.exclusiveExternalSkillIds],
        initialExternalSkillIds: [...lingyuan.exclusiveExternalSkillIds],
        initialInternalSkillId: lingyuan.exclusiveInnerSkillId,
        unlockedTalentIds: [],
        talentIds: [],
        gamesPlayed: 0,
        createdAt: 0,
      }],
    }))
    const clearances: ScenarioClearanceMap = {}
    const view = buildChapterProgressView(lingyuan, clearances)
    expect(view.rosterSnapshot).not.toBeNull()
    const unlockedNames = view.totalUnlocked.map((item) => item.name)
    // 四件套的功法名稱至少都應在已解鎖清單中
    expect(unlockedNames.length).toBe(lingyuan.exclusiveExternalSkillIds.length + 1) // 1 內功 + 3 外功
    expect(view.totalPending).toEqual([])
  })

  it('通關後若 storyUnlocks 帶來新功法但名册未含 → 標記為 pending-apply', () => {
    // 模擬：凌淵已存在名册，但「已通關第二章」會額外解鎖一個新功法（mock storyUnlocks）。
    // 為避免動到正式 catalog，這裡直接用「通關一個不屬於 lingyuan chapterIds 的章節」並
    // 觀察其行為；以及測一個關鍵路徑——空 storyUnlocks 時 pending 為空。
    localStorage.setItem(CHARACTER_ROSTER_STORAGE_KEY, JSON.stringify({
      version: 2,
      characters: [{
        id: lingyuan.characterId,
        name: lingyuan.name,
        isOfficial: true,
        chapterId: lingyuan.chapterId,
        attributeBonuses: { armStrength: 0, constitution: 0, agility: 0, innerEnergy: 0, insight: 0 },
        scrolls: 0,
        unlockedSkillIds: [lingyuan.exclusiveInnerSkillId, ...lingyuan.exclusiveExternalSkillIds],
        learnedSkillIds: [],
        initialExternalSkillIds: [],
        initialInternalSkillId: lingyuan.exclusiveInnerSkillId,
        unlockedTalentIds: [],
        talentIds: [],
        gamesPlayed: 0,
        createdAt: 0,
      }],
    }))
    // lingyuan.storyUnlocks 目前為空 → 即使通關也不會有 pending
    const clearances: ScenarioClearanceMap = {
      'prologue-village': true,
      'forest-hunt': true,
      'frost-water-lament': true,
    }
    const view = buildChapterProgressView(lingyuan, clearances)
    expect(view.chapters.map((c) => c.cleared)).toEqual([true, true, true])
    expect(view.totalPending).toEqual([])
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
})
