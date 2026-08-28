import { describe, expect, it } from 'vitest'
import { groupScenariosByChapter } from './CampaignScenarioTab'
import type { StoredScenario } from '../game/scenarioStorage'
import type { ScenarioDefinition } from '../editor/editorTypes'
import { lingyuan } from '../game/catalogs/officialCharacterCatalog'

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
