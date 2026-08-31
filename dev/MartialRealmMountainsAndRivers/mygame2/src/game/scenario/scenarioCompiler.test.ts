import { describe, expect, it } from 'vitest'
import { buildGameStateFromScenario } from './scenarioCompiler'
import { createEmptyScenario } from '../contracts/scenario'
import type { ScenarioDefinition } from '../contracts/scenario'

/** 建立一個含玩家、據點、Boss、巢穴的完整測試劇本。 */
function makeScenario(): ScenarioDefinition {
  const scenario = createEmptyScenario(10, 10)
  return {
    ...scenario,
    id: 'test-chapter',
    chapterIndex: 0,
    entities: [
      { id: 'player-1', kind: 'player', position: { row: 8, column: 2 }, data: { name: '主角', money: 50 } },
      { id: 'base-qingshi', kind: 'base', position: { row: 8, column: 3 }, data: { name: '青石村', buildingMaterials: 60, presetBuildings: [{ type: 'infirmary', level: 1 }] } },
      { id: 'nest-1', kind: 'nest', position: { row: 2, column: 8 }, data: { name: '妖物巢穴', schoolId: 'swift-wind', behaviorType: 'sieger' } },
      { id: 'boss-1', kind: 'creature', position: { row: 2, column: 7 }, data: { name: '青石妖王', isBoss: true, level: 3, schoolId: 'swift-wind', behaviorType: 'sieger', homeNestId: 'nest-1' } },
    ],
    quests: {
      victoryObjectives: [
        { id: 'obj-1', title: '擊敗青石妖王', type: 'defeat-creature', targetId: 'boss-1', targetValue: 1 },
      ],
      failConditions: { baseMustSurvive: true, playerMustSurvive: true, maxRounds: 20 },
    },
    dialogues: {
      'group-1': {
        name: '開局對話組',
        steps: [
          { id: 'd1', speakerName: '村長', speakerIcon: '👴', content: '開局對話' },
        ],
      },
    },
    triggers: [
      { id: 'trigger-1', condition: 'on-start', action: 'start-dialogue', actionParam: 'group-1' },
    ],
  }
}

describe('buildGameStateFromScenario', () => {
  it('自動生成 MapCell.id（${row}-${column}）', () => {
    const state = buildGameStateFromScenario(makeScenario())
    expect(state.map.cells.length).toBe(100)
    expect(state.map.cells[0].id).toBe('0-0')
    expect(state.map.cells.find((cell) => cell.row === 8 && cell.column === 2)?.id).toBe('8-2')
  })

  it('編譯玩家、據點、巢穴、Boss', () => {
    const state = buildGameStateFromScenario(makeScenario())
    expect(state.players).toHaveLength(1)
    expect(state.players[0].name).toBe('主角')
    expect(state.players[0].money).toBe(50)
    expect(state.bases).toHaveLength(1)
    expect(state.bases[0].name).toBe('青石村')
    expect(state.bases[0].buildingMaterials).toBe(60)
    expect(state.bases[0].buildings[0].type).toBe('infirmary')
    expect(state.creatureNests).toHaveLength(1)
    expect(state.creatures).toHaveLength(1)
    expect(state.creatures[0].isBoss).toBe(true)
    expect(state.creatures[0].homeNestId).toBe('nest-1')
  })

  it('怪物等級影響五維：未覆寫屬性時依等級成長（與巢穴生成同公式）', () => {
    // 回歸測試：compileCreatures 原本未套用 getCreatureAttributes，
    // 導致編輯器設定的 level 只顯示不生效（五維恆為預設值）。
    const scenario = makeScenario()
    scenario.entities = [
      { id: 'player-1', kind: 'player', position: { row: 8, column: 2 }, data: { name: '主角' } },
      { id: 'low', kind: 'creature', position: { row: 2, column: 2 }, data: { name: '低等妖物', level: 1, schoolId: 'void-spirit', behaviorType: 'sieger' } },
      { id: 'high', kind: 'creature', position: { row: 3, column: 2 }, data: { name: '高等妖物', level: 6, schoolId: 'void-spirit', behaviorType: 'sieger' } },
    ]
    const state = buildGameStateFromScenario(scenario)
    const low = state.creatures.find((c) => c.id === 'low')!
    const high = state.creatures.find((c) => c.id === 'high')!
    expect(low.level).toBe(1)
    expect(high.level).toBe(6)
    // 等級 6 的五維應明顯高於等級 1（每級 +3 成長 × 5 級 = +15）
    expect(high.attributes.armStrength).toBe(low.attributes.armStrength + 15)
    expect(high.attributes.constitution).toBe(low.attributes.constitution + 15)
    // 血量上限也應隨等級成長
    expect(high.maxHealth).toBeGreaterThan(low.maxHealth)
  })

  it('明確指定五維時直接採用，不疊加等級成長', () => {
    const scenario = makeScenario()
    scenario.entities = [
      { id: 'player-1', kind: 'player', position: { row: 8, column: 2 }, data: { name: '主角' } },
      { id: 'custom', kind: 'creature', position: { row: 2, column: 2 }, data: { name: '自訂妖物', level: 6, schoolId: 'void-spirit', behaviorType: 'sieger', attributes: { armStrength: 10, constitution: 10, agility: 10, innerEnergy: 10, insight: 10 } } },
    ]
    const state = buildGameStateFromScenario(scenario)
    const custom = state.creatures.find((c) => c.id === 'custom')!
    // void-spirit 內功五維靈氣：臂力/根骨/悟性各 +1
    expect(custom.attributes.armStrength).toBe(11)
    expect(custom.attributes.constitution).toBe(11)
  })

  it('attributes 為空物件時視為未指定，仍依等級成長', () => {
    // 回歸測試：編輯器儲存 boss 時會寫入 "attributes": {}，
    // 空物件是 truthy，原實作會誤走「明確指定」分支，導致等級不生效。
    const scenario = makeScenario()
    scenario.entities = [
      { id: 'player-1', kind: 'player', position: { row: 8, column: 2 }, data: { name: '主角' } },
      { id: 'boss-empty', kind: 'creature', position: { row: 2, column: 5 }, data: { name: '湖中妖邪', isBoss: true, level: 6, schoolId: 'frost-water', behaviorType: 'hunter', attributes: {} } },
    ]
    const state = buildGameStateFromScenario(scenario)
    const boss = state.creatures.find((c) => c.id === 'boss-empty')!
    expect(boss.level).toBe(6)
    // frost-water 流派修正 + 每級 +3 × 5 級：五維應明顯高於預設 8
    expect(boss.attributes.armStrength).toBeGreaterThan(8)
    expect(boss.attributes.constitution).toBeGreaterThan(8)
    expect(boss.maxHealth).toBeGreaterThan(20)
  })

  it('部分調整玩家屬性時，未調整欄位補足預設值（不為 NaN）', () => {
    const scenario = makeScenario()
    scenario.entities[0].data = { name: '主角', attributes: { armStrength: 12 } }
    const state = buildGameStateFromScenario(scenario)
    const attributes = state.players[0].attributes
    expect(attributes.armStrength).toBe(12)
    // 未調整的欄位不應為 NaN / undefined（可能有系統加成，但必須是有限數值）。
    expect(Object.values(attributes).every((value) => Number.isFinite(value))).toBe(true)
    for (const key of ['constitution', 'agility', 'innerEnergy', 'insight'] as const) {
      expect(Number.isFinite(attributes[key])).toBe(true)
    }
  })

  it('怪物 maxHealthOverride 會覆寫編譯後的血量上限與當前血量', () => {
    const scenario = makeScenario()
    scenario.entities.push({
      id: 'creature-override',
      kind: 'creature',
      position: { row: 4, column: 2 },
      data: { name: '高血量怪', level: 2, schoolId: 'void-spirit', behaviorType: 'roamer', maxHealthOverride: 999 },
    })
    const state = buildGameStateFromScenario(scenario)
    const creature = state.creatures.find((c) => c.id === 'creature-override')
    expect(creature).toBeDefined()
    expect(creature!.maxHealth).toBe(999)
    expect(creature!.health).toBe(999)
  })

  it('編譯防禦設施時以 catalog 定義填補 icon / 血量等欄位', () => {
    const scenario = makeScenario()
    scenario.entities.push(
      { id: 'def-arrow', kind: 'defenseStructure', position: { row: 3, column: 3 }, data: { type: 'arrow-tower' } },
      { id: 'def-watch', kind: 'defenseStructure', position: { row: 3, column: 4 }, data: { type: 'watchtower' } },
    )
    const state = buildGameStateFromScenario(scenario)
    const arrow = state.defenseStructures?.find((s) => s.id === 'def-arrow')
    const watch = state.defenseStructures?.find((s) => s.id === 'def-watch')
    expect(arrow).toBeDefined()
    expect(arrow!.type).toBe('arrow-tower')
    expect(arrow!.icon).toBe('🏹')
    expect(arrow!.maxHealth).toBe(50)
    expect(arrow!.health).toBe(50)
    expect(arrow!.attackRange).toBe(2)
    expect(arrow!.attackDamage).toBe(10)
    expect(watch).toBeDefined()
    expect(watch!.icon).toBe('🗼')
    expect(watch!.providesVision).toBe(true)
  })

  it('初始化隱藏欄位', () => {
    const state = buildGameStateFromScenario(makeScenario())
    expect(state.round).toBe(1)
    expect(state.operation).toEqual({ type: 'idle' })
    expect(state.blockingModal).toBeNull()
    expect(state.creatureTurnInProgress).toBe(false)
    expect(state.activeCreatureId).toBeNull()
    expect(state.runStats).toBeDefined()
    expect(state.aiOrders).toEqual([])
    expect(state.aiConstructionPlans).toEqual([])
  })

  it('編譯 campaignState（目標 + 失敗條件）', () => {
    const state = buildGameStateFromScenario(makeScenario())
    expect(state.campaignState).toBeDefined()
    expect(state.campaignState!.chapterKey).toBe('test-chapter')
    expect(state.campaignState!.activeObjectives).toHaveLength(1)
    expect(state.campaignState!.activeObjectives[0]).toMatchObject({
      id: 'obj-1',
      type: 'defeat-creature',
      targetId: 'boss-1',
      currentValue: 0,
      completed: false,
    })
    expect(state.campaignState!.failConditions.maxRounds).toBe(20)
    expect(state.campaignState!.dialogueQueue).toEqual([])
  })

  it('編譯 campaignState 的對話組與觸發器（資料驅動）', () => {
    const state = buildGameStateFromScenario(makeScenario())
    expect(state.campaignState!.dialogueGroups).toBeDefined()
    expect(state.campaignState!.dialogueGroups!['group-1']).toMatchObject({
      name: '開局對話組',
      steps: [{ id: 'd1', speakerName: '村長', speakerIcon: '👴', content: '開局對話' }],
    })
    expect(state.campaignState!.triggers).toEqual([
      { id: 'trigger-1', condition: 'on-start', action: 'start-dialogue', actionParam: 'group-1' },
    ])
  })

  it('無玩家時 activePlayerId 回退為 player-1', () => {
    const scenario = makeScenario()
    scenario.entities = scenario.entities.filter((entity) => entity.kind !== 'player')
    const state = buildGameStateFromScenario(scenario)
    expect(state.activePlayerId).toBe('player-1')
    expect(state.players).toHaveLength(0)
  })

  it('編譯自定義探索事件（type === custom）', () => {
    const scenario = makeScenario()
    scenario.entities.push({
      id: 'event-spring',
      kind: 'event',
      position: { row: 5, column: 5 },
      data: {
        type: 'custom',
        name: '靈泉',
        description: '清澈的靈泉。',
        icon: '⛲',
        choices: [
          {
            id: 'inspect',
            label: '調查靈泉',
            description: '查看靈泉。',
            endsPlayerTurn: false,
            requirements: [{ type: 'active-player' }],
            effects: [{ type: 'prestige', amount: 5 }],
          },
        ],
      },
    })
    const state = buildGameStateFromScenario(scenario)
    const spring = state.explorationEvents?.find((event) => event.id === 'event-spring')
    expect(spring).toBeDefined()
    expect(spring!.type).toBe('custom')
    expect(spring!.name).toBe('靈泉')
    expect(spring!.customEvent).toBeDefined()
    expect(spring!.customEvent!.choices).toHaveLength(1)
    expect(spring!.customEvent!.choices[0].label).toBe('調查靈泉')
    expect(spring!.customEvent!.choices[0].effects[0]).toEqual({ type: 'prestige', amount: 5 })
  })

  it('enableRandomEvents 預設關閉（explorationTriggerChance = 0）', () => {
    const state = buildGameStateFromScenario(makeScenario())
    expect(state.explorationTriggerChance).toBe(0)
  })

  it('enableRandomEvents 為 true 時啟用回合結束事件（explorationTriggerChance = 0.2）', () => {
    const scenario = makeScenario()
    scenario.enableRandomEvents = true
    const state = buildGameStateFromScenario(scenario)
    expect(state.explorationTriggerChance).toBe(0.2)
  })

  it('spawnOnLoad 為 false 的怪物不在地圖載入時生成', () => {
    const scenario = makeScenario()
    scenario.entities.push({
      id: 'creature-hidden',
      kind: 'creature',
      position: { row: 3, column: 3 },
      data: { name: '隱藏妖物', spawnOnLoad: false, schoolId: 'void-spirit', behaviorType: 'roamer' },
    })
    const state = buildGameStateFromScenario(scenario)
    expect(state.creatures.some((creature) => creature.id === 'creature-hidden')).toBe(false)
  })

  it('spawnOnLoad 預設為 true 的怪物會生成', () => {
    const scenario = makeScenario()
    scenario.entities.push({
      id: 'creature-visible',
      kind: 'creature',
      position: { row: 3, column: 3 },
      data: { name: '可見妖物', schoolId: 'void-spirit', behaviorType: 'roamer' },
    })
    const state = buildGameStateFromScenario(scenario)
    expect(state.creatures.some((creature) => creature.id === 'creature-visible')).toBe(true)
  })

  it('spawnOnLoad 為 false 的探索事件點不在地圖載入時生成，存入 scenarioEvents', () => {
    const scenario = makeScenario()
    scenario.entities.push({
      id: 'event-hidden',
      kind: 'event',
      position: { row: 4, column: 4 },
      data: { type: 'custom', name: '隱藏事件', description: '', icon: '🗨️', spawnOnLoad: false, choices: [] },
    })
    const state = buildGameStateFromScenario(scenario)
    expect(state.explorationEvents?.some((event) => event.id === 'event-hidden')).toBe(false)
    expect(state.scenarioEvents?.some((event) => event.id === 'event-hidden')).toBe(true)
  })

  it('spawnOnLoad 預設為 true 的探索事件點會生成', () => {
    const scenario = makeScenario()
    scenario.entities.push({
      id: 'event-visible',
      kind: 'event',
      position: { row: 4, column: 4 },
      data: { type: 'custom', name: '可見事件', description: '', icon: '🗨️', choices: [] },
    })
    const state = buildGameStateFromScenario(scenario)
    expect(state.explorationEvents?.some((event) => event.id === 'event-visible')).toBe(true)
  })

  it('劇本模式探索事件點預設不可被生物吃掉（eatableByCreatures 預設 false，開啟後為 true）', () => {
    const scenario = makeScenario()
    scenario.entities.push(
      { id: 'event-default', kind: 'event', position: { row: 4, column: 4 }, data: { type: 'custom', name: '預設事件', description: '', icon: '🗨️', choices: [] } },
{ id: 'event-eatable', kind: 'event', position: { row: 4, column: 5 }, data: { type: 'custom', name: '可吃事件', description: '', icon: '🗨️', eatableByCreatures: true, choices: [] } },
    )
    const state = buildGameStateFromScenario(scenario)
    expect(state.explorationEvents?.find((event) => event.id === 'event-default')?.eatableByCreatures).toBe(false)
    expect(state.explorationEvents?.find((event) => event.id === 'event-eatable')?.eatableByCreatures).toBe(true)
  })

  it('spawnOnLoad 為 false 的據點不地圖載入時生成，存入 scenarioBases', () => {
    const scenario = makeScenario()
    scenario.entities.push({
      id: 'base-hidden',
      kind: 'base',
      position: { row: 4, column: 6 },
      data: { name: '隱藏據點', spawnOnLoad: false, buildingMaterials: 60, presetBuildings: [{ type: 'board', level: 1 }] },
    })
    const state = buildGameStateFromScenario(scenario)
    expect(state.bases.some((base) => base.id === 'base-hidden')).toBe(false)
    expect(state.scenarioBases?.some((base) => base.id === 'base-hidden')).toBe(true)
    expect(state.scenarioBases?.find((base) => base.id === 'base-hidden')?.buildings[0]?.type).toBe('board')
  })

  it('spawnOnLoad 預設為 true 的據點會生成', () => {
    const scenario = makeScenario()
    scenario.entities.push({
      id: 'base-visible',
      kind: 'base',
      position: { row: 4, column: 6 },
      data: { name: '可見據點', buildingMaterials: 60 },
    })
    const state = buildGameStateFromScenario(scenario)
    expect(state.bases.some((base) => base.id === 'base-visible')).toBe(true)
  })

  it('spawnOnLoad 為 false 的巢穴不地圖載入時生成，存入 scenarioNests', () => {
    const scenario = makeScenario()
    scenario.entities.push({
      id: 'nest-hidden',
      kind: 'nest',
      position: { row: 4, column: 7 },
      data: { name: '隱藏巢穴', spawnOnLoad: false, spawnLevel: 2, schoolId: 'void-spirit', behaviorType: 'scavenger' },
    })
    const state = buildGameStateFromScenario(scenario)
    expect(state.creatureNests.some((nest) => nest.id === 'nest-hidden')).toBe(false)
    expect(state.scenarioNests?.some((nest) => nest.id === 'nest-hidden')).toBe(true)
    expect(state.scenarioNests?.find((nest) => nest.id === 'nest-hidden')?.spawnLevel).toBe(2)
  })

  it('spawnOnLoad 預設為 true 的巢穴會生成', () => {
    const scenario = makeScenario()
    scenario.entities.push({
      id: 'nest-visible',
      kind: 'nest',
      position: { row: 4, column: 7 },
      data: { name: '可見巢穴', spawnLevel: 1 },
    })
    const state = buildGameStateFromScenario(scenario)
    expect(state.creatureNests.some((nest) => nest.id === 'nest-visible')).toBe(true)
  })

  it('劇本模式道具點預設不可被生物吃掉（eatableByCreatures 預設 false，開啟後為 true）', () => {
    const scenario = makeScenario()
    scenario.entities.push(
      { id: 'itempoint-default', kind: 'itemPoint', position: { row: 4, column: 8 }, data: { name: '預設道具點', customDrops: [{ lootId: 'heal-wound-medicine', chance: 100 }] } },
      { id: 'itempoint-eatable', kind: 'itemPoint', position: { row: 4, column: 9 }, data: { name: '可吃道具點', eatableByCreatures: true, customDrops: [] } },
    )
    const state = buildGameStateFromScenario(scenario)
    expect(state.itemPoints.find((point) => point.id === 'itempoint-default')?.eatableByCreatures).toBe(false)
    expect(state.itemPoints.find((point) => point.id === 'itempoint-eatable')?.eatableByCreatures).toBe(true)
  })
})