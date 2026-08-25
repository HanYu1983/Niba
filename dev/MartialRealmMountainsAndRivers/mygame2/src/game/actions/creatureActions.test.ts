import { describe, expect, it } from 'vitest'
import { moveCreatures, type CreatureTurnResult } from './creatureActions'
import { createSeededRandom } from '../rules/randomRules'
import type { CreatureState, DefenseStructureState, GameState, PlayerState, RuinState, TrapState } from '../types'

function makePlayer(overrides: Partial<PlayerState> = {}): PlayerState {
  const attributes = { armStrength: 8, constitution: 8, agility: 7, innerEnergy: 5, insight: 7 }
  return {
    id: 'player-1',
    name: '玩家 1',
    position: { row: 5, column: 5 },
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

function makeCreature(id: string, position: { row: number; column: number }): CreatureState {
  return makePlayer({
    id,
    name: `生物 ${id}`,
    position,
    attributes: { armStrength: 4, constitution: 6, agility: 3, innerEnergy: 2, insight: 1 },
  })
}

function makeGameState(overrides: Partial<GameState> = {}): GameState {
  return {
    map: {
      rows: 40,
      columns: 40,
      cells: Array.from({ length: 40 * 40 }, (_, index) => {
        const row = Math.floor(index / 40)
        const column = index % 40
        const isBorder = row === 0 || column === 0 || row === 39 || column === 39
        return { id: `${row}-${column}`, row, column, terrain: isBorder ? 'wall' : 'plain' }
      }),
    },
    bases: [],
    creatureNests: [],
    resourcePoints: [],
    itemPoints: [],
    players: [makePlayer()],
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
    ...overrides,
  }
}

describe('moveCreatures 陷阱觸發', () => {
  it('怪物踩中絆馬索受到傷害且陷阱被移除', () => {
    const creature = makeCreature('c1', { row: 3, column: 3 })
    const trap: TrapState = {
      id: 'trap-1',
      position: { row: 3, column: 4 },
      type: 'snare',
      ownerPlayerId: 'player-1',
      damage: 15,
    }
    const state = makeGameState({ creatures: [creature], players: [makePlayer({ position: { row: 3, column: 5 } })], traps: [trap] })

    const result = moveCreatures(
      state.creatures,
      state.map,
      state.players,
      state.bases,
      state.resourcePoints,
      state.defenseStructures ?? [],
      state.itemPoints,
      state.explorationEvents ?? [],
      state.creatureNests,
      state.ruins ?? [],
      state.traps ?? [],
    )

    // 陷阱被觸發移除
    expect(result.traps).toEqual([])
    // 怪物受到傷害（絆馬索傷害 = trap.damage = 15）
    const movedCreature = result.creatures.find((c) => c.id === 'c1')
    expect(movedCreature).toBeDefined()
    expect(movedCreature!.health).toBe(creature.health - 15)
    // 有觸發 log
    expect(result.logs.some((log) => log.message.includes('絆馬索'))).toBe(true)
  })

  it('怪物踩中定身索被掛上定身 Buff 且陷阱被移除', () => {
    const creature = makeCreature('c1', { row: 3, column: 3 })
    const trap: TrapState = {
      id: 'trap-2',
      position: { row: 3, column: 4 },
      type: 'immobilize',
      ownerPlayerId: 'player-1',
    }
    const state = makeGameState({ creatures: [creature], players: [makePlayer({ position: { row: 3, column: 5 } })], traps: [trap] })

    const result = moveCreatures(
      state.creatures,
      state.map,
      state.players,
      state.bases,
      state.resourcePoints,
      state.defenseStructures ?? [],
      state.itemPoints,
      state.explorationEvents ?? [],
      state.creatureNests,
      state.ruins ?? [],
      state.traps ?? [],
    )

    expect(result.traps).toEqual([])
    const movedCreature = result.creatures.find((c) => c.id === 'c1')
    expect(movedCreature?.buffs?.some((buff) => buff.definitionId === 'trap-immobilize')).toBe(true)
    expect(result.logs.some((log) => log.message.includes('定身索'))).toBe(true)
  })

  it('持有定身 Buff 的怪物本回合跳過移動', () => {
    const creature = makeCreature('c1', { row: 3, column: 3 })
    const immobilizedCreature = {
      ...creature,
      buffs: [{ id: 'immobilize-1', definitionId: 'trap-immobilize', sourceId: 'trap-2', remainingRounds: 3 }],
    }
    const state = makeGameState({ creatures: [immobilizedCreature] })

    const result = moveCreatures(
      state.creatures,
      state.map,
      state.players,
      state.bases,
      state.resourcePoints,
      state.defenseStructures ?? [],
      state.itemPoints,
      state.explorationEvents ?? [],
      state.creatureNests,
      state.ruins ?? [],
      state.traps ?? [],
    )

    const movedCreature = result.creatures.find((c) => c.id === 'c1')
    // 位置不變（原地不動）
    expect(movedCreature?.position).toEqual({ row: 3, column: 3 })
  })

  it('持有震懾 Buff 的怪物本回合完全跳過行動', () => {
    const creature = makeCreature('c1', { row: 3, column: 3 })
    const stunnedCreature = {
      ...creature,
      buffs: [{ id: 'stun-1', definitionId: 'triple-resonance-stun', sourceId: 'player-1', remainingRounds: 1 }],
    }
    const state = makeGameState({ creatures: [stunnedCreature] })

    const result = moveCreatures(
      state.creatures,
      state.map,
      state.players,
      state.bases,
      state.resourcePoints,
      state.defenseStructures ?? [],
      state.itemPoints,
      state.explorationEvents ?? [],
      state.creatureNests,
      state.ruins ?? [],
      state.traps ?? [],
    )

    const skippedCreature = result.creatures.find((c) => c.id === 'c1')
    // 震懾：完全不移動，且不產生移動日誌
    expect(skippedCreature?.position).toEqual({ row: 3, column: 3 })
  })
})

describe('moveCreatures 阻擋邏輯', () => {
  it('怪物被未清除的廢墟阻擋', () => {
    const creature = makeCreature('c1', { row: 3, column: 3 })
    const state = makeGameState({
      creatures: [creature],
      ruins: [{ id: 'ruin-1', name: '廢墟', position: { row: 3, column: 4 }, status: 'intact' }],
    })

    const result = moveCreatures(
      state.creatures,
      state.map,
      state.players,
      state.bases,
      state.resourcePoints,
      state.defenseStructures ?? [],
      state.itemPoints,
      state.explorationEvents ?? [],
      state.creatureNests,
      state.ruins ?? [],
      state.traps ?? [],
    )

    const movedCreature = result.creatures.find((c) => c.id === 'c1')
    // 廢墟阻擋，怪物無法移動到 (3,4)
    expect(movedCreature?.position).not.toEqual({ row: 3, column: 4 })
  })

  it('怪物被門派據點阻擋', () => {
    const creature = makeCreature('c1', { row: 3, column: 3 })
    const state = makeGameState({
      creatures: [creature],
      sectGates: [{ id: 'gate-1', schoolId: 'void-spirit', position: { row: 3, column: 4 }, experience: 0, level: 1 }],
    })

    const result = moveCreatures(
      state.creatures,
      state.map,
      state.players,
      state.bases,
      state.resourcePoints,
      state.defenseStructures ?? [],
      state.itemPoints,
      state.explorationEvents ?? [],
      state.creatureNests,
      state.ruins ?? [],
      state.traps ?? [],
      state.sectGates ?? [],
    )

    const movedCreature = result.creatures.find((c) => c.id === 'c1')
    // 門派據點阻擋，怪物無法移動到 (3,4)
    expect(movedCreature?.position).not.toEqual({ row: 3, column: 4 })
  })

  it('小型驛站（廢墟修復）被怪物攻擊摧毀時直接消失，不留廢墟點', () => {
    // 構造怪物唯一可通行路徑被驛站擋住的情境：怪物 (3,3)，四周以牆封閉，
    // 唯一出口為驛站 (3,4)，驛站後方為據點 (3,5)。怪物需穿過驛站才能到達據點。
    const wallCells = new Set(['2-3', '4-3', '3-2'])
    const map = {
      rows: 40,
      columns: 40,
      cells: Array.from({ length: 40 * 40 }, (_, index) => {
        const row = Math.floor(index / 40)
        const column = index % 40
        const isBorder = row === 0 || column === 0 || row === 39 || column === 39
        return { id: `${row}-${column}`, row, column, terrain: (isBorder || wallCells.has(`${row}-${column}`) ? 'wall' : 'plain') as 'wall' | 'plain' }
      }),
    }
    const creature = { ...makeCreature('c1', { row: 3, column: 3 }), behaviorType: 'sieger' as const, attributes: { armStrength: 5, constitution: 6, agility: 3, innerEnergy: 2, insight: 1 } }
    const ruin: RuinState = { id: 'ruin-1', name: '蘆葦村', position: { row: 3, column: 4 }, status: 'reconstructed' }
    const smallWaystation: DefenseStructureState = {
      type: 'small-waystation',
      name: '小型驛站',
      description: '由廢墟修復而成',
      icon: '🐎',
      constructionCost: 0,
      requiredRank: 0,
      maxHealth: 15,
      healthBonus: 0,
      blocksMovement: true,
      providesVision: false,
      attackRange: 0,
      attackDamage: 0,
      id: `${ruin.id}-structure`,
      position: { row: 3, column: 4 },
      ownerBaseId: '',
      originName: ruin.name,
      health: 1, // 讓怪物一次攻擊即摧毀
    }
    const state = makeGameState({
      map,
      creatures: [creature],
      ruins: [ruin],
      defenseStructures: [smallWaystation],
      bases: [{ id: 'base-1', name: '據點', position: { row: 3, column: 5 }, buildings: [], buildingMaterials: 0, maxBuildingMaterials: 100, health: 100, maxHealth: 100 }],
      players: [makePlayer({ position: { row: 8, column: 8 } })],
    })

    const result = moveCreatures(
      state.creatures,
      state.map,
      state.players,
      state.bases,
      state.resourcePoints,
      state.defenseStructures ?? [],
      state.itemPoints,
      state.explorationEvents ?? [],
      state.creatureNests,
      state.ruins ?? [],
      state.traps ?? [],
    )

    // 小型驛站被移除
    expect(result.defenseStructures).toEqual([])
    // 被摧毀的由廢墟修復的設施直接消失，連同對應廢墟一併移除，不留廢墟點。
    expect(result.ruins ?? []).not.toContainEqual(expect.objectContaining({ position: { row: 3, column: 4 } }))
  })
})

describe('moveCreatures 據點減傷', () => {
  // 怪物 (3,3) 直接攻擊相鄰據點 (3,4)。
  function makeAttackState(overrides: Partial<GameState> = {}): GameState {
    return makeGameState({
      creatures: [makeCreature('c1', { row: 3, column: 3 })],
      bases: [{
        id: 'base-1',
        name: '據點',
        position: { row: 3, column: 4 },
        buildings: [],
        buildingMaterials: 0,
        maxBuildingMaterials: 100,
        health: 100,
        maxHealth: 100,
        activePolicyId: 'basic',
      }],
      players: [makePlayer({ position: { row: 8, column: 8 } })],
      ...overrides,
    })
  }

  function runAttack(state: GameState) {
    return moveCreatures(
      state.creatures,
      state.map,
      state.players,
      state.bases,
      state.resourcePoints,
      state.defenseStructures ?? [],
      state.itemPoints,
      state.explorationEvents ?? [],
      state.creatureNests,
      state.ruins ?? [],
      state.traps ?? [],
      state.sectGates ?? [],
      state.globalBuffs ?? [],
    )
  }

  it('怪物攻擊據點時套用軍事政策減傷並在彈窗說明', () => {
    const base = {
      id: 'base-1',
      name: '據點',
      position: { row: 3, column: 4 },
      buildings: [],
      buildingMaterials: 0,
      maxBuildingMaterials: 100,
      health: 100,
      maxHealth: 100,
      activePolicyId: 'military',
    }
    const state = makeAttackState({ bases: [base] as unknown as GameState['bases'] })

    const result = runAttack(state)

    // 生物臂力 4 → 基礎傷害 2；軍事政策 -5% → round(2 * 0.95) = 2
    expect(result.bases?.[0]?.health).toBe(98)
    expect(result.logs.some((log) => log.message.includes('軍事政策'))).toBe(true)
  })

  it('怪物攻擊據點時套用城防堅固全局靈氣減傷', () => {
    const state = makeAttackState({
      globalBuffs: [{ id: 'g1', kind: 'base-defense-reduction', magnitude: 50, sourceBaseId: 'base-1' }],
    })

    const result = runAttack(state)

    // 基礎傷害 2；城防堅固 50% → round(2 * 0.5) = 1
    expect(result.bases?.[0]?.health).toBe(99)
    expect(result.logs.some((log) => log.message.includes('城防堅固'))).toBe(true)
  })
})

describe('moveCreatures 探索事件點被吃掉開關', () => {
  // 怪物 maxStamina 0 → 本回合不移動，停留在 (3,3)（即事件格），驗證「被吃掉」檢查的 eatableByCreatures 開關。
  function runWithEvent(event: { id: string; eatableByCreatures?: boolean }) {
    const player = makePlayer({ position: { row: 8, column: 8 } })
    const stillCreature: CreatureState = {
      ...makeCreature('c1', { row: 3, column: 3 }),
      maxStamina: 0,
      stamina: 0,
    }
    const state = makeGameState({
      creatures: [stillCreature],
      players: [player],
      explorationEvents: [{
        id: event.id,
        type: 'lost-caravan' as const,
        name: '測試事件',
        description: '',
        position: { row: 3, column: 3 },
        status: 'available' as const,
        discovered: true,
        expiresAtRound: null,
        eatableByCreatures: event.eatableByCreatures,
      }],
    })
    return moveCreatures(
      state.creatures,
      state.map,
      state.players,
      state.bases,
      state.resourcePoints,
      state.defenseStructures ?? [],
      state.itemPoints,
      state.explorationEvents ?? [],
      state.creatureNests,
      state.ruins ?? [],
      state.traps ?? [],
      state.sectGates ?? [],
      state.globalBuffs ?? [],
    )
  }

  it('eatableByCreatures 未設定（undefined）的事件點默認可被吃掉（沙盒行為）', () => {
    const result = runWithEvent({ id: 'event-1' })
    expect(result.explorationEvents?.find((event) => event.id === 'event-1')).toBeUndefined()
    expect(result.logs.some((log) => log.message.includes('探索事件'))).toBe(true)
  })

  it('eatableByCreatures 為 false 的事件點不會被吃掉', () => {
    const result = runWithEvent({ id: 'event-1', eatableByCreatures: false })
    expect(result.explorationEvents?.find((event) => event.id === 'event-1')).toBeDefined()
    expect(result.logs.some((log) => log.message.includes('探索事件'))).toBe(false)
  })

  it('eatableByCreatures 為 true 的事件點會被吃掉', () => {
    const result = runWithEvent({ id: 'event-1', eatableByCreatures: true })
    expect(result.explorationEvents?.find((event) => event.id === 'event-1')).toBeUndefined()
    expect(result.logs.some((log) => log.message.includes('探索事件'))).toBe(true)
  })
})

describe('moveCreatures 道具點被吃掉開關', () => {
  // 怪物 maxStamina 0 → 本回合不移動，停留在 (3,3)（即道具點格），驗證 eatableByCreatures 開關。
  function runWithItemPoint(eatableByCreatures?: boolean) {
    const player = makePlayer({ position: { row: 8, column: 8 } })
    const stillCreature: CreatureState = {
      ...makeCreature('c1', { row: 3, column: 3 }),
      maxStamina: 0,
      stamina: 0,
    }
    const state = makeGameState({
      creatures: [stillCreature],
      players: [player],
      itemPoints: [{ id: 'itempoint-1', itemId: null, position: { row: 3, column: 3 }, eatableByCreatures }],
    })
    return moveCreatures(
      state.creatures,
      state.map,
      state.players,
      state.bases,
      state.resourcePoints,
      state.defenseStructures ?? [],
      state.itemPoints,
      state.explorationEvents ?? [],
      state.creatureNests,
      state.ruins ?? [],
      state.traps ?? [],
      state.sectGates ?? [],
      state.globalBuffs ?? [],
    )
  }

  it('eatableByCreatures 未設定（undefined）的道具點默認可被吃掉（沙盒行為）', () => {
    const result = runWithItemPoint(undefined)
    expect(result.itemPoints?.find((point) => point.id === 'itempoint-1')).toBeUndefined()
    expect(result.logs.some((log) => log.message.includes('道具點'))).toBe(true)
  })

  it('eatableByCreatures 為 false 的道具點不會被吃掉', () => {
    const result = runWithItemPoint(false)
    expect(result.itemPoints?.find((point) => point.id === 'itempoint-1')).toBeDefined()
    expect(result.logs.some((log) => log.message.includes('道具點'))).toBe(false)
  })

  it('eatableByCreatures 為 true 的道具點會被吃掉', () => {
    const result = runWithItemPoint(true)
    expect(result.itemPoints?.find((point) => point.id === 'itempoint-1')).toBeUndefined()
    expect(result.logs.some((log) => log.message.includes('道具點'))).toBe(true)
  })
})

describe('moveCreatures blocked 只反擊堵路防禦設施', () => {
  // 舊實作：blocked 時攻擊「任一」相鄰防禦設施（依陣列順序）；新實作只打真正堵住去路的那座。
  function makeBarricade(id: string, name: string, position: { row: number; column: number }): DefenseStructureState {
    return {
      type: 'barricade',
      name,
      description: '',
      icon: '🪵',
      constructionCost: 10,
      requiredRank: 0,
      maxHealth: 50,
      healthBonus: 0,
      blocksMovement: true,
      providesVision: false,
      attackRange: 0,
      attackDamage: 0,
      id,
      position,
      ownerBaseId: '',
      health: 50,
    }
  }

  function runBlocked(state: GameState) {
    return moveCreatures(
      state.creatures,
      state.map,
      state.players,
      state.bases,
      state.resourcePoints,
      state.defenseStructures ?? [],
      state.itemPoints,
      state.explorationEvents ?? [],
      state.creatureNests,
      state.ruins ?? [],
      state.traps ?? [],
      state.sectGates ?? [],
      state.globalBuffs ?? [],
    )
  }

  it('兩座相鄰木柵中，只攻擊離目標最近、真正堵路的那座（而非陣列順序優先者）', () => {
    const wallCells = new Set(['4-3', '3-2'])
    const map = {
      rows: 40,
      columns: 40,
      cells: Array.from({ length: 40 * 40 }, (_, index) => {
        const row = Math.floor(index / 40)
        const column = index % 40
        const isBorder = row === 0 || column === 0 || row === 39 || column === 39
        return { id: `${row}-${column}`, row, column, terrain: (isBorder || wallCells.has(`${row}-${column}`) ? 'wall' : 'plain') as 'wall' | 'plain' }
      }),
    }
    const chaser = { ...makeCreature('c1', { row: 3, column: 3 }), behaviorType: 'roamer' as const, aggroRange: 9 }
    // 北側 (2,3) 的木柵在陣列中排第一；東側 (3,4) 才是通往目標的最佳去路。
    const northBarricade = makeBarricade('barricade-north', '北木柵', { row: 2, column: 3 })
    const eastBarricade = makeBarricade('barricade-east', '東木柵', { row: 3, column: 4 })
    const state = makeGameState({
      map,
      creatures: [chaser],
      players: [makePlayer({ position: { row: 3, column: 6 } })],
      defenseStructures: [northBarricade, eastBarricade],
    })

    const result = runBlocked(state)

    // 東木柵被攻擊（臂力 4 → 傷害 2），北木柵原封不動。
    expect(result.defenseStructures?.find((structure) => structure.id === 'barricade-east')?.health).toBe(48)
    expect(result.defenseStructures?.find((structure) => structure.id === 'barricade-north')?.health).toBe(50)
    expect(result.logs.some((log) => log.message.includes('東木柵'))).toBe(true)
    expect(result.logs.some((log) => log.message.includes('北木柵'))).toBe(false)
  })

  it('體力耗盡造成的 blocked 不會誤擊相鄰的無辜設施', () => {
    const exhaustedChaser = {
      ...makeCreature('c1', { row: 3, column: 3 }),
      behaviorType: 'roamer' as const,
      aggroRange: 9,
      stamina: 2,
      maxStamina: 2,
    }
    const bystander = makeBarricade('barricade-side', '旁邊木柵', { row: 2, column: 4 })
    const state = makeGameState({
      creatures: [exhaustedChaser],
      players: [makePlayer({ position: { row: 3, column: 9 } })],
      defenseStructures: [bystander],
    })

    const result = runBlocked(state)

    // 怪物向東走一步後體力歸零被擋下；相鄰的旁邊木柵不應被攻擊。
    expect(result.creatures.find((creature) => creature.id === 'c1')?.position).toEqual({ row: 3, column: 4 })
    expect(result.defenseStructures?.[0]?.health).toBe(50)
    expect(result.logs.some((log) => log.message.includes('旁邊木柵'))).toBe(false)
  })
})

describe('moveCreatures 巡邏隨機注入', () => {
  // 遠離所有目標的游蕩型：警戒範圍 2 格內沒有玩家 → selectCreatureTarget 回 null → 走巡邏分支。
  function makePatrolInputs() {
    const roamer: CreatureState = {
      ...makePlayer({
        id: 'creature-1',
        name: '游蕩妖物',
        position: { row: 10, column: 10 },
        // 偶數體力：平原每格成本 2，巡邏會正好走盡。
        stamina: 6,
        maxStamina: 6,
      }),
      behaviorType: 'roamer',
      aggroRange: 2,
    }
    const farPlayer = makePlayer({ id: 'player-1', name: '玩家 1', position: { row: 25, column: 25 } })
    const state = makeGameState({ creatures: [roamer], players: [farPlayer] })
    return { roamer, farPlayer, state }
  }

  function runPatrol(seed: number): CreatureTurnResult {
    const { roamer, farPlayer, state } = makePatrolInputs()
    return moveCreatures(
      [roamer],
      state.map,
      [farPlayer],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      state.globalBuffs ?? [],
      createSeededRandom(seed),
    )
  }

  it('相同 seed 的巡邏結果完全一致（可重現）', () => {
    const first = runPatrol(42)
    const second = runPatrol(42)

    expect(second.creatures[0].position).toEqual(first.creatures[0].position)
    expect(second.creatures[0].stamina).toBe(first.creatures[0].stamina)
    expect(second.logs).toEqual(first.logs)
  })

  it('巡邏會消耗體力移動，直到體力用盡（開闊平原上每格成本 1）', () => {
    const result = runPatrol(42)
    const creature = result.creatures[0]

    expect(creature.position).not.toEqual({ row: 10, column: 10 })
    expect(creature.stamina).toBe(0)
    expect(result.steps?.length ?? 0).toBe(1)
  })

  it('不同 seed 產生不同的巡邏序列（注入確實生效）', () => {
    const seedA = runPatrol(42)
    const seedB = runPatrol(1337)

    expect(seedB.creatures[0].position).not.toEqual(seedA.creatures[0].position)
  })
})

