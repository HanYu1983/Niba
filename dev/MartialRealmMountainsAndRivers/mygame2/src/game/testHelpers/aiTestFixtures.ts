import type { AiConstructionPlan, AiOrder, BaseState, CreatureNestState, CreatureState, GameState, MapState, PlayerState, Position, ResourcePointState } from '../types'

/** 11×11 全平原小地圖：固定座標、無隨機牆，供 AI 決策與 store 整合測試使用。 */
export function makePlainMap(rows = 11, columns = 11): MapState {
  return {
    rows,
    columns,
    cells: Array.from({ length: rows * columns }, (_, index) => {
      const row = Math.floor(index / columns)
      const column = index % columns
      return { id: `${row}-${column}`, row, column, terrain: 'plain' as const }
    }),
  }
}

export function makeTestPlayer(overrides: Partial<PlayerState> = {}): PlayerState {
  return {
    id: 'ai-1',
    name: 'AI',
    isAI: true,
    position: { row: 5, column: 5 },
    attributes: { armStrength: 8, constitution: 8, agility: 7, innerEnergy: 5, insight: 7 },
    innerSkillIds: ['tuna-gong'],
    innerSkillId: 'tuna-gong',
    externalSkillIds: [],
    equippedExternalSkillIds: [],
    health: 30,
    maxHealth: 30,
    stamina: 20,
    maxStamina: 20,
    innerPower: 10,
    maxInnerPower: 10,
    prestige: 0,
    money: 0,
    experience: 0,
    inventory: [],
    turnEnded: false,
    ...overrides,
  }
}

export function makeTestHuman(overrides: Partial<PlayerState> = {}): PlayerState {
  return makeTestPlayer({
    id: 'player-1',
    name: '玩家 1',
    isAI: false,
    position: { row: 9, column: 9 },
    ...overrides,
  })
}

export function makeTestCreature(overrides: Partial<CreatureState> = {}): CreatureState {
  return {
    ...makeTestPlayer({
      id: 'creature-1',
      name: '敵人',
      isAI: false,
      position: { row: 5, column: 6 },
      health: 20,
      maxHealth: 20,
    }),
    behaviorType: 'roamer',
    schoolId: 'scarlet-flame',
    ...overrides,
  }
}

export function makeTestBase(overrides: Partial<BaseState> = {}): BaseState {
  return {
    id: 'base-1',
    name: '洛陽',
    position: { row: 5, column: 5 },
    buildings: [],
    buildingMaterials: 0,
    maxBuildingMaterials: 100,
    health: 100,
    maxHealth: 100,
    ...overrides,
  }
}

export function makeTestNest(overrides: Partial<CreatureNestState> = {}): CreatureNestState {
  return {
    id: 'nest-1',
    name: '妖物巢穴',
    position: { row: 8, column: 5 },
    health: 120,
    maxHealth: 120,
    spawnChance: 0.1,
    cooldownRounds: 0,
    spawnLevel: 1,
    behaviorType: 'scavenger',
    schoolId: 'void-spirit',
    ...overrides,
  }
}

export function makeAiTestState(overrides: Partial<GameState> = {}): GameState {
  return {
    map: makePlainMap(),
    bases: [makeTestBase()],
    defenseStructures: [],
    ruins: [],
    creatureNests: [],
    resourcePoints: [],
    itemPoints: [],
    explorationEvents: [],
    players: [makeTestPlayer()],
    creatures: [],
    activePlayerId: 'ai-1',
    round: 1,
    creatureActionLogs: [],
    attackPreview: null,
    externalSkillPreview: null,
    repairPreview: null,
    creatureTurnInProgress: false,
    activeCreatureId: null,
    operation: { type: 'idle' },
    blockingModal: null,
    sharedWarehouse: [],
    sharedEquipmentWarehouse: [],
    aiOrders: [],
    aiConstructionPlans: [],
    explorationTriggerChance: 0,
    ...overrides,
  }
}

export function makeProtectBaseOrder(
  overrides: Partial<Extract<AiOrder, { type: 'protect-base' }>> = {},
): Extract<AiOrder, { type: 'protect-base' }> {
  return {
    id: 'order-protect',
    type: 'protect-base',
    aiPlayerId: 'ai-1',
    baseId: 'base-1',
    radius: 6,
    priority: 80,
    retreatHealthPercent: 30,
    status: 'active',
    ...overrides,
  }
}

export function makeSupportPlayerOrder(
  overrides: Partial<Extract<AiOrder, { type: 'support-player' }>> = {},
): Extract<AiOrder, { type: 'support-player' }> {
  return {
    id: 'order-support',
    type: 'support-player',
    aiPlayerId: 'ai-1',
    playerId: 'player-1',
    maxDistance: 8,
    priority: 90,
    retreatHealthPercent: 30,
    status: 'active',
    ...overrides,
  }
}

export function makeTest1Order(
  overrides: Partial<Extract<AiOrder, { type: 'test1' }>> = {},
): Extract<AiOrder, { type: 'test1' }> {
  return {
    id: 'order-test1',
    type: 'test1',
    aiPlayerId: 'ai-1',
    priority: 50,
    status: 'active',
    ...overrides,
  }
}

export function makeTestResourcePoint(overrides: Partial<ResourcePointState> = {}): ResourcePointState {
  return {
    id: 'resource-point-1',
    name: '林場',
    position: { row: 5, column: 4 },
    ownerBaseId: 'base-1',
    materialIncome: 10,
    lastCollectedRound: null,
    health: 30,
    maxHealth: 30,
    ...overrides,
  }
}

export function makeConstructionPlan(
  overrides: Partial<AiConstructionPlan> = {},
): AiConstructionPlan {
  return {
    aiPlayerId: 'ai-1',
    baseId: 'base-1',
    policy: 'balanced',
    allowUpgrade: false,
    queue: [],
    ...overrides,
  }
}

export function manhattanDistance(first: Position, second: Position): number {
  return Math.abs(first.row - second.row) + Math.abs(first.column - second.column)
}
