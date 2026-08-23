/// <reference types="node" />
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildGameStateFromScenario } from '../../editor/rules/scenarioCompiler'
import { campaignScenarioCatalog, getCampaignChapterList } from './campaignScenarioCatalog'

describe('campaignScenarioCatalog 章節清單', () => {
  it('章節依 chapterIndex 排序：主線在前，番外三部曲在後', () => {
    const chapters = getCampaignChapterList()
    expect(chapters.map((chapter) => chapter.id)).toEqual([
      'prologue-village',
      'chapter1-shadow-temple',
      'extra-1-blackstone-road',
      'extra-2-frost-ford',
      'extra-3-darkrock-lair',
    ])
  })

  it('每個章節都已導出 JSON 並註冊於官方關卡 index（UI 劇本分頁可見）', () => {
    const scenariosDir = resolve(dirname(fileURLToPath(import.meta.url)), '../../../public/data/scenarios')
    const index = JSON.parse(readFileSync(resolve(scenariosDir, 'index.json'), 'utf8')) as {
      scenarios: Array<{ id: string; file: string; version: string }>
    }
    for (const [id, scenario] of Object.entries(campaignScenarioCatalog)) {
      const entry = index.scenarios.find((candidate) => candidate.id === id)
      expect(entry, `${id} 未註冊於 public/data/scenarios/index.json`).toBeDefined()
      const exported = JSON.parse(readFileSync(resolve(scenariosDir, `${id}.json`), 'utf8'))
      expect(exported.id, `${id}.json 內容與 catalog 不一致`).toBe(scenario.id)
      expect(exported.version, `${id}.json 版本與 index 註冊不一致`).toBe(entry?.version)
    }
  })
})

describe('第一章：荒廟影禍 劇本定義', () => {
  const scenario = campaignScenarioCatalog['chapter1-shadow-temple']

  it('地圖邊界為牆、實體不落在牆上且位置不重複', () => {
    const state = buildGameStateFromScenario(scenario)
    const wallCells = state.map.cells.filter((cell) => cell.terrain === 'wall')
    expect(wallCells.length).toBe(44)
    const occupied = new Set<string>()
    for (const entity of scenario.entities) {
      const key = `${entity.position.row}-${entity.position.column}`
      const cell = state.map.cells.find((c) => c.row === entity.position.row && c.column === entity.position.column)
      expect(cell?.terrain).not.toBe('wall')
      expect(occupied.has(key)).toBe(false)
      occupied.add(key)
    }
  })

  it('玩家與山間客棧配置正確', () => {
    const state = buildGameStateFromScenario(scenario)
    expect(state.players[0].position).toEqual({ row: 10, column: 2 })
    expect(state.players[0].money).toBe(80)
    expect(state.players[0].innerSkillIds).toEqual(['tuna-gong'])
    const base = state.bases[0]
    expect(base.id).toBe('base-mountain-inn')
    expect(base.buildings.length).toBe(3)
    expect(base.buildingMaterials).toBe(80)
  })

  it('幽影巢穴與三隻妖物（含首領）配置正確', () => {
    const state = buildGameStateFromScenario(scenario)
    const nest = state.creatureNests[0]
    expect(nest.id).toBe('nest-shadow')
    expect(nest.schoolId).toBe('ghost-shadow')
    expect(nest.spawnChance).toBeCloseTo(0.15)
    expect(nest.spawnLevel).toBe(2)

    expect(state.creatures.length).toBe(3)
    const boss = state.creatures.find((creature) => creature.id === 'boss-shadow-master')
    expect(boss?.isBoss).toBe(true)
    expect(boss?.level).toBe(3)
    expect(boss?.schoolId).toBe('ghost-shadow')
    expect(boss?.maxHealth).toBe(65)
    expect(boss?.attributes.agility).toBeGreaterThan(boss!.attributes.armStrength)
    const scouts = state.creatures.filter((creature) => creature.id !== 'boss-shadow-master')
    expect(scouts.every((creature) => creature.homeNestId === 'nest-shadow')).toBe(true)
  })

  it('任務目標、對話組與觸發器完整接線', () => {
    const state = buildGameStateFromScenario(scenario)
    const campaign = state.campaignState
    expect(campaign).toBeDefined()
    if (!campaign) return
    expect(campaign.chapterKey).toBe('chapter1-shadow-temple')
    expect(campaign.currentChapter).toBe(1)
    expect(campaign.activeObjectives.length).toBe(2)
    const mainObjective = campaign.activeObjectives[0]
    expect(mainObjective.type).toBe('defeat-creature')
    expect(mainObjective.targetId).toBe('boss-shadow-master')
    expect(campaign.failConditions.maxRounds).toBe(25)

    expect(Object.keys(campaign.dialogueGroups ?? {})).toEqual([
      'group-c1-start',
      'group-c1-warn',
      'group-c1-victory',
    ])
    const triggers = campaign.triggers ?? []
    expect(triggers.some((trigger) => trigger.condition === 'on-start' && trigger.actionParam === 'group-c1-start')).toBe(true)
    expect(triggers.some((trigger) => trigger.condition === 'on-round-reached' && trigger.conditionParam === '5')).toBe(true)
    expect(triggers.some((trigger) => trigger.condition === 'on-victory')).toBe(true)
    // 劇本關卡隨機事件預設關閉。
    expect(state.explorationTriggerChance).toBe(0)
  })
})

describe('番外篇「玄冥遺禍」三部曲', () => {
  const EXTRA_IDS = ['extra-1-blackstone-road', 'extra-2-frost-ford', 'extra-3-darkrock-lair'] as const

  it('難度階梯：巢穴數與怪物數逐章嚴格遞增，回合上限不遞減', () => {
    const nestCounts = EXTRA_IDS.map((id) => campaignScenarioCatalog[id].entities.filter((entity) => entity.kind === 'nest').length)
    const creatureCounts = EXTRA_IDS.map((id) => campaignScenarioCatalog[id].entities.filter((entity) => entity.kind === 'creature').length)
    const maxRounds = EXTRA_IDS.map((id) => campaignScenarioCatalog[id].quests.failConditions.maxRounds ?? 0)
    expect(nestCounts).toEqual([1, 2, 3])
    expect(creatureCounts).toEqual([3, 5, 7])
    expect(maxRounds).toEqual([22, 25, 28])
  })

  for (const id of EXTRA_IDS) {
    it(`${id}：結構完整且可編譯`, () => {
      const scenario = campaignScenarioCatalog[id]
      const state = buildGameStateFromScenario(scenario)

      // 邊界牆格數 = 2×(rows+columns)−4；實體不落牆、不重疊。
      const expectedWalls = 2 * (scenario.mapSize.rows + scenario.mapSize.columns) - 4
      expect(state.map.cells.filter((cell) => cell.terrain === 'wall').length).toBe(expectedWalls)
      const occupied = new Set<string>()
      for (const entity of scenario.entities) {
        const key = `${entity.position.row}-${entity.position.column}`
        const cell = state.map.cells.find((c) => c.row === entity.position.row && c.column === entity.position.column)
        expect(cell?.terrain).not.toBe('wall')
        expect(occupied.has(key)).toBe(false)
        occupied.add(key)
      }

      // 主線目標綁定的怪物必須存在；頭目階梯：番外一精英無 isBoss，二、三章為 isBoss。
      const mainObjective = scenario.quests.victoryObjectives[0]
      expect(mainObjective.type).toBe('defeat-creature')
      const bossPlacement = scenario.entities.find((entity) => entity.id === mainObjective.targetId)
      expect(bossPlacement?.kind).toBe('creature')
      const isBoss = (bossPlacement?.data as { isBoss?: boolean }).isBoss ?? false
      expect(isBoss).toBe(id !== 'extra-1-blackstone-road')

      // 選配目標：僅第三章有剷平妖窟（destroy-nest ×3）。
      const razeObjective = scenario.quests.victoryObjectives.find((objective) => objective.type === 'destroy-nest')
      if (id === 'extra-3-darkrock-lair') {
        expect(razeObjective?.targetValue).toBe(3)
      } else {
        expect(razeObjective).toBeUndefined()
      }

      // 對話與觸發器三件套接線；巢穴歸屬的 homeNestId 都存在。
      const campaign = state.campaignState
      expect(campaign).toBeDefined()
      if (!campaign) return
      expect(Object.keys(campaign.dialogueGroups ?? {}).length).toBe(3)
      const triggers = campaign.triggers ?? []
      expect(triggers.some((trigger) => trigger.condition === 'on-start')).toBe(true)
      expect(triggers.some((trigger) => trigger.condition === 'on-round-reached')).toBe(true)
      expect(triggers.some((trigger) => trigger.condition === 'on-victory')).toBe(true)
      const nestIds = new Set(scenario.entities.filter((entity) => entity.kind === 'nest').map((entity) => entity.id))
      const creaturesWithHome = scenario.entities.filter(
        (entity) => entity.kind === 'creature' && (entity.data as { homeNestId?: string }).homeNestId,
      )
      expect(creaturesWithHome.length).toBeGreaterThan(0)
      for (const creature of creaturesWithHome) {
        expect(nestIds.has((creature.data as { homeNestId: string }).homeNestId)).toBe(true)
      }
      expect(state.explorationTriggerChance).toBe(0)
    })
  }
})
