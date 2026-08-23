/// <reference types="node" />
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildGameStateFromScenario } from '../../editor/rules/scenarioCompiler'
import { campaignScenarioCatalog, getCampaignChapterList } from './campaignScenarioCatalog'

describe('campaignScenarioCatalog 章節清單', () => {
  it('章節依 chapterIndex 排序，且包含序章與第一章', () => {
    const chapters = getCampaignChapterList()
    expect(chapters.length).toBe(2)
    expect(chapters[0].id).toBe('prologue-village')
    expect(chapters[1].id).toBe('chapter1-shadow-temple')
    expect(chapters[0].chapterIndex).toBeLessThan(chapters[1].chapterIndex)
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
