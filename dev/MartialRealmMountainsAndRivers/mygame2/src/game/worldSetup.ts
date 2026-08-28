import type {
  AiOrder,
  BaseState,
  CreatureNestState,
  GameSettings,
  GameState,
  ItemPointState,
  MapState,
  ResourcePointState,
  RuinState,
  SectGateState,
} from './types'
import { buildingCatalog } from './catalogs/buildingCatalog'
import { allInnerSkillCatalog, allExternalSkillCatalog } from './catalogs/martialHallSkillCatalog'
import { getCreatureInnerSkillId } from './rules/creatureBehaviorRules'
import { getPlayerVisibleCellIds } from './rules/visibilityRules'
import { createCharacterState } from './characterFactory'
import {
  createCreatureNests,
  createInitialPlayers,
  createItemPoints,
  createMapCells,
  createRandomBases,
  createRandomPositions,
  createResourcePoints,
  createRoamerCreatures,
  createRuins,
  createSectGates,
  type InitialCharacterConfig,
} from './worldGeneration'
import { playerNames } from './catalogs/placeNameCatalog'
import { pickRandom, createSeededRandom } from './rules/randomRules'
import { createExplorationEventsFromCatalog } from './events/eventSpawner'
import { DEFAULT_GAME_SETTINGS } from './gameSettings'
import { createEmptyRunStats } from './runStats'
import { generateRunId } from './settledRuns'
import { buildGameStateFromScenario } from '../editor/rules/scenarioCompiler'
import { campaignScenarioCatalog } from './catalogs/campaignScenarioCatalog'

const WORLD_SEED_OFFSETS = {
  players: 101,
  itemPoints: 307,
  events: 409,
  nests: 503,
  creatures: 701,
  ruins: 809,
  sectGates: 911,
} as const

export function createGameState(
  settings: GameSettings = DEFAULT_GAME_SETTINGS,
  selectedCharacters?: (InitialCharacterConfig & { id?: string } | null)[],
): GameState {
  const humanPlayerCount = Math.min(4, Math.max(1, Math.round(settings.playerCount ?? 1)))
  const aiPlayerCount = Math.min(8, Math.max(0, Math.round(settings.aiPlayerCount ?? 0)))
  const playerCount = humanPlayerCount + aiPlayerCount
  const map: MapState = {
    rows: settings.rows,
    columns: settings.columns,
    cells: createMapCells(settings.rows, settings.columns, settings.seed, 0.2, settings.terrainWeights),
  }
  const bases = createRandomBases(map, settings.baseCount, settings.seed)
  const resourcePoints = createResourcePoints(map, bases, settings.resourcePointCount, settings.seed)
  const excludedPositions = [
    ...bases.map((base) => base.position),
    ...resourcePoints.map((resourcePoint) => resourcePoint.position),
  ]
  const playerPositions = createRandomPositions(map, playerCount, settings.seed + WORLD_SEED_OFFSETS.players, excludedPositions)
  const itemPoints = createItemPoints(map, settings.itemPointCount, settings.seed + WORLD_SEED_OFFSETS.itemPoints, [
    ...excludedPositions,
    ...playerPositions,
  ])
  const explorationEvents = createExplorationEventsFromCatalog(map, [
    ...excludedPositions,
    ...playerPositions,
    ...itemPoints.map((itemPoint) => itemPoint.position),
  ], settings.seed + WORLD_SEED_OFFSETS.events, settings.explorationEventCount)
  const sectGates = createSectGates(
    map,
    settings.sectGateCount ?? 3,
    settings.seed + WORLD_SEED_OFFSETS.sectGates,
    [...excludedPositions, ...playerPositions, ...itemPoints.map((itemPoint) => itemPoint.position), ...explorationEvents.map((event) => event.position)],
  )
  const interactionPointPositions = [
    ...excludedPositions,
    ...playerPositions,
    ...itemPoints.map((itemPoint) => itemPoint.position),
    ...explorationEvents.map((event) => event.position),
    ...sectGates.map((gate) => gate.position),
  ]
  const creatureNests = createCreatureNests(map, settings.nestCount, settings.seed + WORLD_SEED_OFFSETS.nests, [
    ...interactionPointPositions,
  ])
  const players = createInitialPlayers(
    playerPositions,
    settings.seed + WORLD_SEED_OFFSETS.players,
    humanPlayerCount,
    selectedCharacters,
  )
  const aiOrders: AiOrder[] = players
    .filter((p) => p.isAI)
    .map((p) => ({ id: `ai-order-decision-tree-${p.id}`, type: 'decision-tree' as const, aiPlayerId: p.id, priority: 50, status: 'active' as const }))
  const fallbackRandom = createSeededRandom(settings.seed + WORLD_SEED_OFFSETS.players + 333)
  const fallbackPlayerName = pickRandom(playerNames, fallbackRandom) ?? '玩家 1'
  const player = players[0] ?? createCharacterState({ id: 'player-1', name: fallbackPlayerName, innerSkillId: 'tuna-gong', position: { row: 1, column: 1 }, attributes: { armStrength: 8, constitution: 8, agility: 8, innerEnergy: 8, insight: 8 }, prestige: 0, money: 0, experience: 0, turnEnded: false })
  const ruins = createRuins(map, settings.ruinCount ?? 10, settings.seed + WORLD_SEED_OFFSETS.ruins, [
    ...interactionPointPositions,
    ...creatureNests.map((nest) => nest.position),
  ])
  const visibilityState = {
    map,
    players,
    bases,
    defenseStructures: [],
  } as unknown as GameState
  const creatures = createRoamerCreatures(map, settings.creatureCount, settings.seed + WORLD_SEED_OFFSETS.creatures, [
    ...interactionPointPositions,
    ...creatureNests.map((nest) => nest.position),
    ...ruins.map((ruin) => ruin.position),
  ])

  return {
    map,
    visibility: { exploredCellIds: [...getPlayerVisibleCellIds(visibilityState, player.id)], mode: 'fog' },
    bases,
    defenseStructures: [],
    ruins,
    creatureNests,
    resourcePoints,
    itemPoints,
    explorationEvents,
    explorationTriggerChance: settings.explorationTriggerChance ?? 0.2,
    nestHealthRegenPercent: settings.nestHealthRegenPercent ?? 0.01,
    sectGates,
    players,
    creatures,
    activePlayerId: player.id,
    round: 1,
    creatureActionLogs: [],
    attackPreview: null,
    externalSkillPreview: null,
    repairPreview: null,
    creatureTurnInProgress: false,
    activeCreatureId: null,
    operation: { type: 'idle' },
    blockingModal: null,
    runStats: createEmptyRunStats(),
    runId: generateRunId(),
    // 依人類玩家順序記錄選用的名册角色 id（未選用為 null）。
    activeCharacterIds: Array.from({ length: humanPlayerCount }, (_, i) => selectedCharacters?.[i]?.id ?? null),
    sharedWarehouse: [],
    sharedEquipmentWarehouse: [],
    aiOrders,
    aiConstructionPlans: [],
  }
}

function createDebugMap(): MapState {
  const rows = 21
  const columns = 21

  return {
    rows,
    columns,
    cells: Array.from({ length: rows * columns }, (_, index) => {
      const row = Math.floor(index / columns)
      const column = index % columns
      const isBorder = row === 0 || column === 0 || row === rows - 1 || column === columns - 1

      return {
        id: `${row}-${column}`,
        row,
        column,
        // Debug 地圖劃分五個地形測試區：草地、森林、水域、山嶽、荒漠。
        terrain: isBorder
          ? 'wall'
          : column <= 4 ? 'plain'
            : column <= 8 ? 'forest'
              : column <= 12 ? 'water'
                : column <= 16 ? 'mountain'
                  : 'desert',
      }
    }),
  }
}

export function createDebugGameState(): GameState {
  const map = createDebugMap()
  const playerPosition = { row: 10, column: 10 }
  // 排除「牆」與「貿易市場」：貿易市場需由玩家自行建造才能觸發靈氣，方便測試。
  const debugBuildings = buildingCatalog
    .filter((building) => building.type !== 'wall' && building.type !== 'trade-market')
    .map((building, index) => ({
      ...building,
      id: `debug-building-${index + 1}`,
      level: 6,
    }))
  // 測試用：裝備所有內功與外功（全部 Lv.10），方便快速驗證各類功法效果。
  const debugAllInnerIds = allInnerSkillCatalog.map((skill) => skill.id)
  const debugAllExternalIds = allExternalSkillCatalog.map((skill) => skill.id)
  const debugSkillProgression = Object.fromEntries(
    [...debugAllInnerIds, ...debugAllExternalIds].map((skillId) => [skillId, { experience: 0, level: 1 }]),
  )
  const debugPlayer = createCharacterState({
    id: 'player-1',
    name: 'Debug 玩家',
    innerSkillId: 'tuna-gong',
    innerSkillIds: debugAllInnerIds,
    position: playerPosition,
    attributes: { armStrength: 30, constitution: 30, agility: 30, innerEnergy: 30, insight: 30 },
    externalSkillIds: debugAllExternalIds,
    equippedExternalSkillIds: [],
    skillProgression: debugSkillProgression,
    prestige: 2000,
    money: 1000,
    experience: 1000,
    turnEnded: false,
  })
  const debugBase: BaseState = {
    id: 'debug-base',
    name: 'Debug 據點',
    position: { row: 9, column: 10 },
    buildings: debugBuildings,
    buildingMaterials: 200,
    maxBuildingMaterials: 200,
    health: 150,
    maxHealth: 150,
    active: true,
    discovered: true,
  }
  const debugBase2: BaseState = {
    id: 'debug-base-2',
    name: 'Debug 據點 2',
    position: { row: 10, column: 14 },
    buildings: debugBuildings.map((building) => ({ ...building, id: `${building.id}-base-2` })),
    buildingMaterials: 200,
    maxBuildingMaterials: 200,
    health: 150,
    maxHealth: 150,
    active: true,
    discovered: true,
  }
  const debugResourcePoint: ResourcePointState = {
    id: 'debug-resource-point', name: 'Debug 資源點', position: { row: 10, column: 11 }, ownerBaseId: debugBase.id,
    materialIncome: 15, lastCollectedRound: null, health: 30, maxHealth: 30,
  }
  const debugResourcePoint2: ResourcePointState = {
    id: 'debug-resource-point-2', name: 'Debug 資源點 2', position: { row: 11, column: 14 }, ownerBaseId: debugBase2.id,
    materialIncome: 15, lastCollectedRound: null, health: 30, maxHealth: 30,
  }
  const debugItemPoint: ItemPointState = {
    id: 'debug-item-point', itemId: null, position: { row: 9, column: 9 },
  }
  const debugExplorationEvent = {
    id: 'debug-lost-caravan', type: 'lost-caravan' as const, name: '失散商隊',
    description: '一支失散的商隊正在等待你的決定。你可以交易、護送或掠奪。',
    position: { row: 11, column: 10 }, status: 'available' as const, discovered: true, expiresAtRound: null,
  }
  const debugNest: CreatureNestState = {
    id: 'debug-creature-nest', name: 'Debug 生物巢穴', position: { row: 13, column: 13 },
    health: 5, maxHealth: 120, spawnChance: 1, cooldownRounds: 0, spawnLevel: 1,
  }
  // 測試用廢墟：前幾座位於 debug 據點影響範圍內（清除可得建料），最後一座在範圍外。
  const debugRuins: RuinState[] = [
    { id: 'debug-ruin-1', name: '破落村', position: { row: 8, column: 12 }, status: 'intact' },
    { id: 'debug-ruin-2', name: '荒廢山寨', position: { row: 12, column: 8 }, status: 'intact' },
    { id: 'debug-ruin-3', name: '湮沒古井', position: { row: 7, column: 13 }, status: 'intact' },
    { id: 'debug-ruin-4', name: '坍塌驛站', position: { row: 10, column: 6 }, status: 'intact' },
    { id: 'debug-ruin-5', name: '荒村哨所', position: { row: 13, column: 10 }, status: 'intact' },
    { id: 'debug-ruin-6', name: '迷途廢村', position: { row: 15, column: 17 }, status: 'intact' },
  ]
  const debugSectGates: SectGateState[] = [
    // 各門派各配置一個據點，分散在五個地形測試區。
    { id: 'debug-sect-gate-1', schoolId: 'earth-mountain', position: { row: 8, column: 3 }, experience: 0, level: 1 },
    { id: 'debug-sect-gate-2', schoolId: 'swift-wind', position: { row: 9, column: 6 }, experience: 0, level: 1 },
    { id: 'debug-sect-gate-3', schoolId: 'frost-water', position: { row: 12, column: 10 }, experience: 0, level: 1 },
    { id: 'debug-sect-gate-4', schoolId: 'golden-body', position: { row: 8, column: 14 }, experience: 0, level: 1 },
    { id: 'debug-sect-gate-5', schoolId: 'scarlet-flame', position: { row: 12, column: 18 }, experience: 0, level: 1 },
    { id: 'debug-sect-gate-6', schoolId: 'void-spirit', position: { row: 17, column: 10 }, experience: 0, level: 1 },
    { id: 'debug-sect-gate-7', schoolId: 'hundred-poison', position: { row: 17, column: 4 }, experience: 0, level: 1 },
    // 新五行門派：依主場地形配置（幽影流無主場，比照太虛流水域測試區）。
    { id: 'debug-sect-gate-8', schoolId: 'sharp-edge', position: { row: 15, column: 15 }, experience: 0, level: 1 },
    { id: 'debug-sect-gate-9', schoolId: 'misty-rain', position: { row: 15, column: 11 }, experience: 0, level: 1 },
    { id: 'debug-sect-gate-10', schoolId: 'blazing-sun', position: { row: 15, column: 18 }, experience: 0, level: 1 },
    { id: 'debug-sect-gate-11', schoolId: 'yellow-earth', position: { row: 6, column: 7 }, experience: 0, level: 1 },
    { id: 'debug-sect-gate-12', schoolId: 'ghost-shadow', position: { row: 4, column: 10 }, experience: 0, level: 1 },
  ]
  const debugCreatureDefinitions = [
    { id: 'debug-creature-water', name: 'Debug 寒水妖', schoolId: 'frost-water' as const, behaviorType: 'hunter' as const, position: { row: 10, column: 9 }, attributes: { armStrength: 7, constitution: 7, agility: 6, innerEnergy: 5, insight: 5 } },
    { id: 'debug-creature-metal', name: 'Debug 金剛妖', schoolId: 'golden-body' as const, behaviorType: 'sieger' as const, position: { row: 9, column: 14 }, attributes: { armStrength: 9, constitution: 7, agility: 5, innerEnergy: 5, insight: 5 } },
    { id: 'debug-creature-wood', name: 'Debug 追風妖', schoolId: 'swift-wind' as const, behaviorType: 'wanderer' as const, position: { row: 8, column: 6 }, attributes: { armStrength: 6, constitution: 6, agility: 9, innerEnergy: 5, insight: 5 } },
    { id: 'debug-creature-fire', name: 'Debug 赤炎妖', schoolId: 'scarlet-flame' as const, behaviorType: 'roamer' as const, position: { row: 9, column: 11 }, attributes: { armStrength: 8, constitution: 36, agility: 5, innerEnergy: 9, insight: 5 } },
    { id: 'debug-creature-earth', name: 'Debug 厚土妖', schoolId: 'earth-mountain' as const, behaviorType: 'scavenger' as const, position: { row: 9, column: 3 }, attributes: { armStrength: 6, constitution: 9, agility: 5, innerEnergy: 7, insight: 5 } },
    { id: 'debug-creature-void', name: 'Debug 太虛妖', schoolId: 'void-spirit' as const, behaviorType: 'sieger' as const, position: { row: 16, column: 11 }, attributes: { armStrength: 7, constitution: 7, agility: 7, innerEnergy: 7, insight: 7 } },
    { id: 'debug-creature-poison', name: 'Debug 百毒妖', schoolId: 'hundred-poison' as const, behaviorType: 'hunter' as const, position: { row: 18, column: 5 }, attributes: { armStrength: 8, constitution: 6, agility: 8, innerEnergy: 5, insight: 5 } },
  ]
  const debugCreatures = debugCreatureDefinitions.map((definition) => createCharacterState({
    id: definition.id,
    name: definition.name,
    innerSkillId: getCreatureInnerSkillId({ behaviorType: definition.behaviorType ?? 'sieger', schoolId: definition.schoolId }, 1),
    position: definition.position,
    attributes: definition.attributes,
    prestige: 0, money: 0, experience: 0, turnEnded: false, behaviorType: definition.behaviorType ?? 'sieger', schoolId: definition.schoolId,
    homePosition: debugNest.position, homeNestId: debugNest.id,
  }))

  const visibilityState = {
    map,
    players: [debugPlayer],
    bases: [debugBase, debugBase2],
    defenseStructures: [],
  } as unknown as GameState

  return {
    map, visibility: { exploredCellIds: [...getPlayerVisibleCellIds(visibilityState, debugPlayer.id)], mode: 'fog' }, bases: [debugBase, debugBase2], defenseStructures: [],
    creatureNests: [debugNest], resourcePoints: [debugResourcePoint, debugResourcePoint2], itemPoints: [debugItemPoint], ruins: debugRuins,
    explorationEvents: [debugExplorationEvent], sectGates: debugSectGates, players: [debugPlayer], creatures: debugCreatures,
    activePlayerId: debugPlayer.id, round: 1, creatureActionLogs: [], attackPreview: null, externalSkillPreview: null,
    repairPreview: null, creatureTurnInProgress: false, activeCreatureId: null, operation: { type: 'idle' },
    blockingModal: null, runStats: createEmptyRunStats(), sharedWarehouse: [], sharedEquipmentWarehouse: [], aiOrders: [], aiConstructionPlans: [],
  }
}

/**
 * 建立序章「青石遺恨」專用地圖（10×10）。
 *
 * 地理配置：
 * - 左下角：青石村據點（安全起點）
 * - 中央：森林與山嶽阻隔帶，分隔村莊與妖物巢穴
 * - 右上角：妖物巢穴與 Boss 妖物盤踞處
 * - 邊界：牆壁圍繞
 */
function createPrologueMap(): MapState {
  const rows = 10
  const columns = 10
  const cells = Array.from({ length: rows * columns }, (_, index) => {
    const row = Math.floor(index / columns)
    const column = index % columns
    const isBorder = row === 0 || column === 0 || row === rows - 1 || column === columns - 1
    // 中央森林帶（row 4-5）與右上山嶽帶（row 1-3, col 6-8）作為天然阻隔。
    const isForest = !isBorder && row >= 4 && row <= 5 && column >= 2 && column <= 7
    const isMountain = !isBorder && row >= 1 && row <= 3 && column >= 6 && column <= 8
    return {
      id: `${row}-${column}`,
      row,
      column,
      terrain: isBorder ? 'wall' as const : isMountain ? 'mountain' as const : isForest ? 'forest' as const : 'plain' as const,
    }
  })
  return { rows, columns, cells }
}

/**
 * 建立序章「青石遺恨」GameState。
 *
 * 對應 story-campaign-system-design.md 的序章設計：
 * - 1 座基礎據點（青石村）
 * - 1 名 Boss 妖物（青石妖王，isBoss 標記）
 * - 1 座妖物巢穴（摧毀即勝利）
 * - 基礎教學對話（開局、勝利）
 */
export function createPrologueGameState(): GameState {
  const map = createPrologueMap()
  const playerPosition = { row: 8, column: 2 }
  const basePosition = { row: 8, column: 3 }
  const nestPosition = { row: 2, column: 8 }
  const bossPosition = { row: 2, column: 7 }

  // 青石村預建建築：醫療室 Lv.1、告示牌 Lv.1、建料倉庫 Lv.1。
  const prologueBuildings = buildingCatalog
    .filter((building) => building.type === 'infirmary' || building.type === 'board' || building.type === 'warehouse')
    .map((building, index) => ({ ...building, id: `prologue-building-${index + 1}`, level: 1 }))

  const player = createCharacterState({
    id: 'player-1',
    name: '主角',
    innerSkillId: 'tuna-gong',
    innerSkillIds: ['tuna-gong'],
    position: playerPosition,
    attributes: { armStrength: 8, constitution: 8, agility: 8, innerEnergy: 8, insight: 8 },
    externalSkillIds: ['sky-breaking-palm'],
    equippedExternalSkillIds: ['sky-breaking-palm'],
    prestige: 0,
    money: 50,
    experience: 0,
    turnEnded: false,
    inventory: [
      { itemId: 'heal-wound-medicine', quantity: 2 },
      { itemId: 'gather-qi-pill', quantity: 1 },
    ],
  })

  const base: BaseState = {
    id: 'base-qingshi',
    name: '青石村',
    position: basePosition,
    buildings: prologueBuildings,
    buildingMaterials: 60,
    maxBuildingMaterials: 100,
    health: 100,
    maxHealth: 100,
    active: true,
    discovered: true,
  }

  const nest: CreatureNestState = {
    id: 'nest-prologue',
    name: '妖物巢穴',
    position: nestPosition,
    health: 40,
    maxHealth: 40,
    spawnChance: 0.1,
    cooldownRounds: 0,
    spawnLevel: 1,
    behaviorType: 'sieger',
    schoolId: 'swift-wind',
  }

  const boss = createCharacterState({
    id: 'boss-prologue',
    name: '青石妖王',
    innerSkillId: getCreatureInnerSkillId({ behaviorType: 'sieger', schoolId: 'swift-wind' }, 3),
    position: bossPosition,
    attributes: { armStrength: 10, constitution: 10, agility: 9, innerEnergy: 8, insight: 8 },
    prestige: 0,
    money: 0,
    experience: 0,
    turnEnded: false,
    behaviorType: 'sieger',
    schoolId: 'swift-wind',
    homePosition: nestPosition,
    homeNestId: nest.id,
    isBoss: true,
    level: 3,
  })

  const visibilityState = {
    map,
    players: [player],
    bases: [base],
    defenseStructures: [],
  } as unknown as GameState

  return {
    map,
    visibility: { exploredCellIds: [...getPlayerVisibleCellIds(visibilityState, player.id)], mode: 'fog' },
    bases: [base],
    defenseStructures: [],
    ruins: [],
    creatureNests: [nest],
    resourcePoints: [],
    itemPoints: [],
    explorationEvents: [],
    sectGates: [],
    players: [player],
    creatures: [boss],
    activePlayerId: player.id,
    round: 1,
    creatureActionLogs: [],
    attackPreview: null,
    externalSkillPreview: null,
    repairPreview: null,
    creatureTurnInProgress: false,
    activeCreatureId: null,
    operation: { type: 'idle' },
    blockingModal: null,
    runStats: createEmptyRunStats(),
    runId: generateRunId(),
    sharedWarehouse: [],
    sharedEquipmentWarehouse: [],
    aiOrders: [],
    aiConstructionPlans: [],
  }
}

/**
 * 建立測試用劇情模式 GameState。
 *
 * 以序章「青石遺恨」的 ScenarioDefinition（campaignScenarioCatalog）為資料來源，
 * 透過 scenarioCompiler.buildGameStateFromScenario 編譯為 GameState，
 * 驗證「資料驅動 → 編譯 → 遊戲」的完整抽象層整合。
 */
export function createTestCampaignGameState(): GameState {
  const scenario = campaignScenarioCatalog['prologue-village']
  return buildGameStateFromScenario(scenario)
}
