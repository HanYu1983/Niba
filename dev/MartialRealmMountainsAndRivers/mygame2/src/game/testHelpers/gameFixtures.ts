import type { AiConstructionPlan, AiOrder, BaseState, CreatureNestState, CreatureState, GameState, MapState, PlayerState, Position, ResourcePointState } from '../types'
import { getMaxHealth, getMaxInnerPower, getMaxStamina } from '../rules/playerStatsRules'

/**
 * 統一測試 fixtures（原 aiTestFixtures 升級版，去掉「ai」限定）。
 *
 * 目標：消除 38 個測試檔各自重複定義 makePlayer / makeState 的散彈式維護——
 * PlayerState 新增必填欄位時只需改這裡。
 *
 * 血量／體力／內力預設走 playerStatsRules 的統一公式（與 rules.test.ts 等檔的
 * 語意一致），不再使用任意固定值。
 */

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
  const attributes = { armStrength: 8, constitution: 8, agility: 7, innerEnergy: 5, insight: 7 }
  return {
    id: 'ai-1',
    name: 'AI',
    isAI: true,
    position: { row: 5, column: 5 },
    attributes,
    innerSkillIds: ['tuna-gong'],
    innerSkillId: 'tuna-gong',
    externalSkillIds: [],
    equippedExternalSkillIds: [],
    // 資源上限走 playerStatsRules 統一公式，與遊戲規則一致（消除 fixture 與規則的語意分歧）。
    health: getMaxHealth(attributes),
    maxHealth: getMaxHealth(attributes),
    stamina: getMaxStamina(attributes),
    maxStamina: getMaxStamina(attributes),
    innerPower: getMaxInnerPower(attributes),
    maxInnerPower: getMaxInnerPower(attributes),
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

export function makeTestState(overrides: Partial<GameState> = {}): GameState {
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

export function makeFuzzyOrder(
  overrides: Partial<Extract<AiOrder, { type: 'fuzzy' }>> = {},
): Extract<AiOrder, { type: 'fuzzy' }> {
  return {
    id: 'order-fuzzy',
    type: 'fuzzy',
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

/** 舊名稱相容別名：makeAiTestState → makeTestState（去掉「ai」限定後的統一命名）。 */
export const makeAiTestState = makeTestState
