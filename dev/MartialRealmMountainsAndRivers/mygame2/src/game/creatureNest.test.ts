import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { moveCreatures, spawnCreaturesFromNests } from './actions/creatureActions'
import { createCharacterState } from './characterFactory'
import type {
  BaseState,
  CreatureNestState,
  CreatureState,
  DefenseStructureState,
  ExplorationEventState,
  ItemPointState,
  MapState,
  PlayerState,
  ResourcePointState,
} from './types'

function makeMap(): MapState {
  return {
    rows: 10,
    columns: 10,
    cells: Array.from({ length: 10 * 10 }, (_, index) => {
      const row = Math.floor(index / 10)
      const column = index % 10
      const isBorder = row === 0 || column === 0 || row === 9 || column === 9
      return { id: `${row}-${column}`, row, column, terrain: isBorder ? 'wall' : 'plain' }
    }),
  }
}

function makeNest(overrides: Partial<CreatureNestState> = {}): CreatureNestState {
  return {
    id: 'nest-1',
    name: '生物巢穴 1',
    position: { row: 5, column: 5 },
    health: 120,
    maxHealth: 120,
    spawnChance: 1,
    cooldownRounds: 0,
    spawnLevel: 1,
    ...overrides,
  }
}

function makePlayer(overrides: Partial<PlayerState> = {}): PlayerState {
  const attributes = { armStrength: 8, constitution: 8, agility: 7, innerEnergy: 5, insight: 7 }
  return {
    id: 'player-1',
    name: '玩家 1',
    position: { row: 1, column: 1 },
    attributes,
    innerSkillIds: ['tuna-gong'],
    innerSkillId: 'tuna-gong',
    externalSkillIds: [],
    equippedExternalSkillIds: [],
    health: 24,
    maxHealth: 24,
    stamina: 7,
    maxStamina: 7,
    innerPower: 15,
    maxInnerPower: 15,
    prestige: 0,
    money: 0,
    experience: 0,
    inventory: [],
    turnEnded: false,
    ...overrides,
  }
}

function makeCreature(overrides: Partial<CreatureState> = {}): CreatureState {
  return makePlayer({
    id: 'creature-1',
    name: '測試 Creature',
    position: { row: 3, column: 3 },
    attributes: { armStrength: 8, constitution: 6, agility: 4, innerEnergy: 2, insight: 1 },
    ...overrides,
  })
}

function makeResourcePoint(overrides: Partial<ResourcePointState> = {}): ResourcePointState {
  return {
    id: 'resource-1',
    name: '測試資源點',
    position: { row: 3, column: 6 },
    ownerBaseId: 'base-1',
    materialIncome: 10,
    lastCollectedRound: null,
    health: 30,
    maxHealth: 30,
    ...overrides,
  }
}

function makeDefenseStructure(overrides: Partial<DefenseStructureState> = {}): DefenseStructureState {
  return {
    type: 'barricade',
    name: '木柵',
    description: '阻擋 Creature 通行。',
    icon: '🪵',
    constructionCost: 10,
    maxHealth: 50,
    healthBonus: 0,
    blocksMovement: true,
    providesVision: false,
    visionRange: 1,
    attackRange: 0,
    attackDamage: 0,
    id: 'defense-1',
    position: { row: 3, column: 4 },
    ownerBaseId: 'base-1',
    health: 50,
    ...overrides,
    requiredRank: overrides.requiredRank ?? 1,
  }
}

function makeBase(): BaseState {
  return {
    id: 'base-1',
    name: '測試據點',
    position: { row: 8, column: 8 },
    buildings: [],
    buildingMaterials: 0,
    maxBuildingMaterials: 100,
    health: 100,
    maxHealth: 100,
  }
}

function makeBlockedMap(): MapState {
  const map = makeMap()
  const blockedPositions = [
    { row: 2, column: 3 },
    { row: 4, column: 3 },
    { row: 3, column: 2 },
  ]
  map.cells = map.cells.map((cell) =>
    blockedPositions.some((position) => position.row === cell.row && position.column === cell.column)
      ? { ...cell, terrain: 'wall' }
      : cell,
  )
  return map
}

/** spawnCreaturesFromNests 的依賴：以 createCharacterState 建立生物。 */
const spawnDeps = {
  createCreatureState: (input: Parameters<typeof createCharacterState>[0]) => createCharacterState(input),
}

describe('spawnCreaturesFromNests', () => {

  // 生成機率測試：固定 Math.random 回傳 0，確保必定生成（rollChance 判定 random() < chance）。
  beforeEach(() => {
    vi.spyOn(Math, 'random').mockReturnValue(0)
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('冷卻期間不會生成怪物，且機率仍每回合 +0.5%', () => {
    const nest = makeNest({ spawnChance: 0.1, cooldownRounds: 3 })
    const result = spawnCreaturesFromNests(
      [nest],
      [],
      makeMap(),
      [makePlayer()],
      [],
      2,
      spawnDeps,
    )

    expect(result.creatures).toHaveLength(0)
    expect(result.logs).toHaveLength(0)
    expect(result.nests[0].spawnLevel).toBe(1)
    // 冷卻期間機率仍 +0.5%
    expect(result.nests[0].spawnChance).toBeCloseTo(0.105)
    expect(result.nests[0].cooldownRounds).toBe(2)
  })

  it('機率達標時生成一隻怪物並提升巢穴等級', () => {
    const nest = makeNest({ spawnChance: 1, cooldownRounds: 0 })
    const result = spawnCreaturesFromNests(
      [nest],
      [],
      makeMap(),
      [makePlayer()],
      [],
      10,
      spawnDeps,
    )

    expect(result.creatures).toHaveLength(1)
    expect(result.logs).toHaveLength(1)
    expect(result.logs[0].message).toContain('生成了 Lv.1 怪物')
    expect(result.nests[0].spawnLevel).toBe(2)
  })

  it('生成後進入 3 回合冷卻', () => {
    const nest = makeNest({ spawnChance: 1, cooldownRounds: 0 })
    const result = spawnCreaturesFromNests(
      [nest],
      [],
      makeMap(),
      [makePlayer()],
      [],
      10,
      spawnDeps,
    )

    expect(result.nests[0].cooldownRounds).toBe(3)
  })

  it('升級時最大生命依等級成長（+10%），保留已受傷害', () => {
    // Lv.1 最大生命 120，受 20 點傷害 → health 100
    const nest = makeNest({ spawnChance: 1, cooldownRounds: 0, spawnLevel: 1, health: 100, maxHealth: 120 })
    const result = spawnCreaturesFromNests(
      [nest],
      [],
      makeMap(),
      [makePlayer()],
      [],
      10,
      spawnDeps,
    )

    // 升級到 Lv.2：maxHealth = 120 * 1.1 = 132；先回血 1%（120×1%=1.2 → 101.2），升級到不因升級回滿
    expect(result.nests[0].spawnLevel).toBe(2)
    expect(result.nests[0].maxHealth).toBe(132)
    expect(result.nests[0].health).toBe(101.2)
  })

  it('每回合回復 1% 最大生命', () => {
    // 冷卻期間不生成，僅驗證回血
    const nest = makeNest({ spawnChance: 0.1, cooldownRounds: 3, health: 100, maxHealth: 120 })
    const result = spawnCreaturesFromNests(
      [nest],
      [],
      makeMap(),
      [makePlayer()],
      [],
      10,
      spawnDeps,
    )

    // 回復 120 * 1% = 1.2 → health 101.2
    expect(result.nests[0].health).toBe(101.2)
  })

  it('每回合回復不會超過最大生命', () => {
    const nest = makeNest({ spawnChance: 0.1, cooldownRounds: 3, health: 119, maxHealth: 120 })
    const result = spawnCreaturesFromNests(
      [nest],
      [],
      makeMap(),
      [makePlayer()],
      [],
      10,
      spawnDeps,
    )

    expect(result.nests[0].health).toBe(120)
  })

  it('生成後機率 -5%，最低不低於 10%', () => {
    const nest = makeNest({ spawnChance: 0.2, cooldownRounds: 0 })
    const result = spawnCreaturesFromNests(
      [nest],
      [],
      makeMap(),
      [makePlayer()],
      [],
      10,
      spawnDeps,
    )

    // 生成前機率 +0.5% → 0.205，生成後 -5% → 0.155
    expect(result.nests[0].spawnChance).toBeCloseTo(0.155)
  })

  it('生成後機率不會低於 10%', () => {
    const nest = makeNest({ spawnChance: 0.1, cooldownRounds: 0 })
    const result = spawnCreaturesFromNests(
      [nest],
      [],
      makeMap(),
      [makePlayer()],
      [],
      10,
      spawnDeps,
    )

    // 生成前 0.105，生成後 -5% → 0.055，但下限 10%
    expect(result.nests[0].spawnChance).toBeCloseTo(0.1)
  })

  it('每回合結束機率 +0.5%，上限 30%', () => {
    // 冷卻期間不生成，僅驗證機率累加上限
    const nest = makeNest({ spawnChance: 0.3, cooldownRounds: 1 })
    const result = spawnCreaturesFromNests(
      [nest],
      [],
      makeMap(),
      [makePlayer()],
      [],
      10,
      spawnDeps,
    )

    // 已達上限 30%，不再增加
    expect(result.nests[0].spawnChance).toBeCloseTo(0.3)
  })

  it('生成的怪物屬性隨等級成長', () => {
    const nest = makeNest({ spawnChance: 1, cooldownRounds: 0, spawnLevel: 3 })
    const result = spawnCreaturesFromNests(
      [nest],
      [],
      makeMap(),
      [makePlayer()],
      [],
      10,
      spawnDeps,
    )

    const creature = result.creatures[0] as CreatureState
    // 攻城化已移除；巢穴未指定流派時使用中性流派計算屬性成長。
    expect(creature.attributes).toEqual({ armStrength: 10, constitution: 10, agility: 10, innerEnergy: 10, insight: 10 })
    expect(creature.name).toContain('Lv.3')
  })

  it('巢穴周圍沒有空位時不會生成', () => {
    // 巢穴在 (5,5)，生成範圍是距離 ≤ 2 的所有格子
    const occupiedPositions: Array<{ row: number; column: number }> = []
    for (let row = 3; row <= 7; row += 1) {
      for (let column = 3; column <= 7; column += 1) {
        if (row === 5 && column === 5) {
          continue
        }
        occupiedPositions.push({ row, column })
      }
    }
    const players = occupiedPositions.map((position, index) =>
      makePlayer({ id: `p${index}`, position }),
    )
    const nest = makeNest({ spawnChance: 1, cooldownRounds: 0 })
    const result = spawnCreaturesFromNests(
      [nest],
      [],
      makeMap(),
      players,
      [],
      10,
      spawnDeps,
    )

    expect(result.creatures).toHaveLength(0)
    expect(result.nests[0].spawnLevel).toBe(1)
  })

  it('多個巢穴各自生成並獨立升級', () => {
    const nest1 = makeNest({ id: 'nest-1', position: { row: 2, column: 2 }, spawnChance: 1, cooldownRounds: 0 })
    const nest2 = makeNest({ id: 'nest-2', position: { row: 7, column: 7 }, spawnChance: 1, cooldownRounds: 0 })
    const result = spawnCreaturesFromNests(
      [nest1, nest2],
      [],
      makeMap(),
      [makePlayer()],
      [],
      10,
      spawnDeps,
    )

    expect(result.creatures).toHaveLength(2)
    expect(result.nests[0].spawnLevel).toBe(2)
    expect(result.nests[1].spawnLevel).toBe(2)
  })
})

describe('moveCreatures 與防禦設施互動', () => {
  const emptyEvents: ExplorationEventState[] = []
  const emptyItems: ItemPointState[] = []

  it('防禦設施阻擋路徑時，Creature 會攻擊相鄰設施', () => {
    const structure = makeDefenseStructure()
    const result = moveCreatures(
      [makeCreature()],
      makeBlockedMap(),
      [],
      [makeBase()],
      [makeResourcePoint()],
      [structure],
      emptyItems,
      emptyEvents,
    )

    expect(result.defenseStructures?.[0].health).toBe(44)
    expect(result.logs[0].message).toContain('攻擊木柵')
    expect(result.creatures[0].position).toEqual({ row: 3, column: 3 })
  })

  it('設施生命歸零後會移除並恢復該格通行', () => {
    const structure = makeDefenseStructure({ health: 4 })
    const result = moveCreatures(
      [makeCreature()],
      makeBlockedMap(),
      [],
      [makeBase()],
      [makeResourcePoint()],
      [structure],
      emptyItems,
      emptyEvents,
    )

    expect(result.defenseStructures).toEqual([])
    expect(result.logs[0].message).toContain('摧毀')
  })

  it('所有防禦設施都使用相同的阻擋與受擊規則', () => {
    for (const type of ['watchtower', 'arrow-tower'] as const) {
      const structure = makeDefenseStructure({ type, name: type === 'watchtower' ? '瞭望塔' : '箭塔' })
      const result = moveCreatures(
        [makeCreature()],
        makeBlockedMap(),
        [],
        [makeBase()],
        [makeResourcePoint()],
        [structure],
        emptyItems,
        emptyEvents,
      )

      expect(result.defenseStructures?.[0].health).toBe(44)
      expect(result.logs[0].message).toContain(`攻擊${structure.name}`)
    }
  })

  it('每隻 Creature 都會產生獨立的逐步 action snapshot', () => {
    const first = makeCreature({ id: 'creature-1', position: { row: 3, column: 3 } })
    const second = makeCreature({ id: 'creature-2', position: { row: 4, column: 3 } })
    const result = moveCreatures(
      [first, second],
      makeBlockedMap(),
      [],
      [makeBase()],
      [makeResourcePoint()],
      [],
      emptyItems,
      emptyEvents,
    )

    expect(result.steps).toHaveLength(2)
    expect(result.steps?.[0].creature.id).toBe('creature-1')
    expect(result.steps?.[1].creature.id).toBe('creature-2')
  })

  it('箭塔在 Creature 行動前造成傷害，擊敗的 Creature 不會產生 action step', () => {
    const creature = makeCreature({ health: 5, position: { row: 3, column: 3 } })
    const tower = makeDefenseStructure({
      type: 'arrow-tower',
      name: '箭塔',
      position: { row: 3, column: 4 },
      attackRange: 2,
      attackDamage: 5,
    })

    const result = moveCreatures(
      [creature],
      makeMap(),
      [],
      [makeBase()],
      [],
      [tower],
      emptyItems,
      emptyEvents,
    )

    expect(result.creatures).toEqual([])
    expect(result.steps).toEqual([])
    expect(result.logs[0].message).toContain('擊敗')
  })

  it('Creature 攻擊玩家時會累積傷害並降低護甲與配件耐久', () => {
    const creature = makeCreature({ position: { row: 3, column: 3 } })
    const player = makePlayer({
      id: 'player-target',
      position: { row: 3, column: 4 },
      equipmentInventory: [
        { instanceId: 'armor-1', equipmentId: 'traveling-robe', durability: 20, maxDurability: 20 },
        { instanceId: 'accessory-1', equipmentId: 'jade-pendant', durability: 20, maxDurability: 20 },
      ],
      equipmentLoadout: { weaponInstanceId: null, armorInstanceId: 'armor-1', accessoryInstanceId: 'accessory-1' },
    })

    const result = moveCreatures(
      [creature],
      makeMap(),
      [player],
      [makeBase()],
      [],
      [],
      emptyItems,
      emptyEvents,
    )

    const updatedPlayer = result.players[0]
    expect(updatedPlayer.health).toBeLessThanOrEqual(player.health)
    expect(updatedPlayer.equipmentInventory?.find((item) => item.instanceId === 'armor-1')?.durability).toBe(19)
    expect(updatedPlayer.equipmentInventory?.find((item) => item.instanceId === 'accessory-1')?.durability).toBe(19.5)
  })

  it('掠奪型沒有資源點時會朝警戒範圍內玩家移動', () => {
    const creature = makeCreature({ behaviorType: 'scavenger', position: { row: 3, column: 3 }, maxStamina: 2, stamina: 2 })
    const player = makePlayer({ id: 'player-target', position: { row: 3, column: 5 } })
    const result = moveCreatures([creature], makeMap(), [player], [makeBase()], [], [], emptyItems, emptyEvents)

    expect(result.creatures[0].position).not.toEqual(creature.position)
  })

  it('Creature 不會移動進入巢穴所在格', () => {
    const creature = makeCreature({ position: { row: 3, column: 3 }, maxStamina: 2, stamina: 2 })
    const nest = makeNest({ position: { row: 3, column: 4 } })
    const player = makePlayer({ id: 'player-target', position: { row: 3, column: 5 } })
    const result = moveCreatures([creature], makeMap(), [player], [makeBase()], [], [], emptyItems, emptyEvents, [nest])

    expect(result.creatures[0].position).not.toEqual(nest.position)
  })

  it('Creature 不會生成在巢穴所在格', () => {
    const nest = makeNest({ spawnChance: 1, cooldownRounds: 0 })
    const result = spawnCreaturesFromNests([nest], [], makeMap(), [makePlayer()], [], 1, spawnDeps)

    expect(result.creatures[0]?.position).not.toEqual(nest.position)
  })
})
