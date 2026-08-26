import type {
  BaseState,
  CreatureNestState,
  CreatureState,
  GameState,
  ItemPointState,
  MapState,
  PlayerState,
  ResourcePointState,
  RuinState,
  SectGateState,
  DefenseStructureState,
  ExplorationEventState,
  CampaignState,
} from '../../game/types'
import { buildingCatalog } from '../../game/catalogs/buildingCatalog'
import { defenseStructureCatalog } from '../../game/catalogs/defenseStructureCatalog'
import { getCreatureInnerSkillId } from '../../game/rules/creatureBehaviorRules'
import { getPlayerVisibleCellIds } from '../../game/rules/visibilityRules'
import { createCharacterState } from '../../game/characterFactory'
import { createEmptyRunStats } from '../../game/runStats'
import { getExplorationEventDefinition } from '../../game/events/eventCatalog'
import type { ScenarioDefinition, ScenarioEntityPlacement, CustomEventChoice } from '../editorTypes'

/**
 * 劇本編譯器：將編輯器產出的 ScenarioDefinition 轉化為標準 GameState。
 *
 * 這是編輯器與遊戲之間的純函式橋樑，對應設計文件 M4-1。
 * 本質上是 createPrologueGameState / createDebugGameState 的「資料驅動通用版」——
 * 將硬編碼的固定配置改為從 ScenarioDefinition 讀取。
 */

/** 依實體 kind 分組的放置清單。 */
type GroupedEntities = {
  players: ScenarioEntityPlacement[]
  bases: ScenarioEntityPlacement[]
  creatures: ScenarioEntityPlacement[]
  nests: ScenarioEntityPlacement[]
  ruins: ScenarioEntityPlacement[]
  resourcePoints: ScenarioEntityPlacement[]
  itemPoints: ScenarioEntityPlacement[]
  events: ScenarioEntityPlacement[]
  sectGates: ScenarioEntityPlacement[]
  defenseStructures: ScenarioEntityPlacement[]
}

function groupEntities(entities: ScenarioEntityPlacement[]): GroupedEntities {
  const grouped: GroupedEntities = {
    players: [], bases: [], creatures: [], nests: [], ruins: [],
    resourcePoints: [], itemPoints: [], events: [], sectGates: [], defenseStructures: [],
  }
  for (const entity of entities) {
    const key = `${entity.kind}s` as keyof GroupedEntities
    grouped[key].push(entity)
  }
  return grouped
}

/** 建立地圖：自動生成 MapCell.id（${row}-${column}）。 */
function compileMap(scenario: ScenarioDefinition): MapState {
  return {
    rows: scenario.mapSize.rows,
    columns: scenario.mapSize.columns,
    cells: scenario.cells.map((cell) => ({
      id: `${cell.row}-${cell.column}`,
      row: cell.row,
      column: cell.column,
      terrain: cell.terrain,
    })),
  }
}

/** 玩家五維屬性預設值。 */
const DEFAULT_PLAYER_ATTRIBUTES: PlayerState['attributes'] = {
  armStrength: 8,
  constitution: 8,
  agility: 8,
  innerEnergy: 8,
  insight: 8,
}

/** 填補玩家屬性缺少的欄位為預設值，避免部分調整導致未調整欄位為 NaN。 */
function normalizePlayerAttributes(attributes?: Partial<PlayerState['attributes']> | null): PlayerState['attributes'] {
  return { ...DEFAULT_PLAYER_ATTRIBUTES, ...attributes }
}

/** 編譯玩家起點與初始配置。 */
function compilePlayers(placements: ScenarioEntityPlacement[]): PlayerState[] {
  return placements.map((placement, index) => {
    const data = placement.data as Record<string, unknown>
    const attributes = normalizePlayerAttributes(data.attributes as Partial<PlayerState['attributes']> | undefined)
    const inventory = (data.inventory as Array<{ itemId: string; quantity: number }>) ?? []
    return createCharacterState({
      id: placement.id,
      name: (data.name as string) ?? `玩家 ${index + 1}`,
      innerSkillId: (data.innerSkillId as string) ?? 'tuna-gong',
      innerSkillIds: (data.innerSkillIds as string[]) ?? ['tuna-gong'],
      position: placement.position,
      attributes,
      externalSkillIds: (data.externalSkillIds as string[]) ?? [],
      equippedExternalSkillIds: (data.equippedExternalSkillIds as string[]) ?? [],
      prestige: (data.prestige as number) ?? 0,
      money: (data.money as number) ?? 50,
      experience: (data.experience as number) ?? 0,
      turnEnded: false,
      inventory,
    })
  })
}

/** 編譯據點與預建建築。 */
function compileBases(placements: ScenarioEntityPlacement[]): BaseState[] {
  return placements.map((placement) => {
    const data = placement.data as Record<string, unknown>
    const presetBuildings = (data.presetBuildings as Array<{ type: string; level: number }>) ?? []
    const buildings = presetBuildings.map((preset, index) => {
      const template = buildingCatalog.find((building) => building.type === preset.type)
      return {
        ...(template ?? { id: `unknown-${preset.type}`, type: preset.type, name: preset.type, description: '', constructionCost: 0 }),
        id: `${placement.id}-building-${index + 1}`,
        level: preset.level,
      }
    })
    return {
      id: placement.id,
      name: (data.name as string) ?? '據點',
      position: placement.position,
      buildings,
      buildingMaterials: (data.buildingMaterials as number) ?? 60,
      maxBuildingMaterials: (data.maxBuildingMaterials as number) ?? 100,
      health: (data.health as number) ?? 100,
      maxHealth: (data.maxHealth as number) ?? 100,
      active: (data.active as boolean) ?? true,
      discovered: (data.discovered as boolean) ?? true,
      activePolicyId: data.activePolicyId as BaseState['activePolicyId'],
      martialSchoolId: data.martialSchoolId as BaseState['martialSchoolId'],
      allowedBuildings: (data.allowedBuildings as BaseState['allowedBuildings']) ?? undefined,
    }
  })
}

/** 編譯怪物與首領。 */
function compileCreatures(placements: ScenarioEntityPlacement[], nests: CreatureNestState[]): CreatureState[] {
  return placements.map((placement) => {
    const data = placement.data as Record<string, unknown>
    const schoolId = (data.schoolId as CreatureState['schoolId']) ?? 'void-spirit'
    const behaviorType = (data.behaviorType as CreatureState['behaviorType']) ?? 'sieger'
    const homeNestId = data.homeNestId as string | undefined
    const homeNest = nests.find((nest) => nest.id === homeNestId)
    const maxHealthOverride = data.maxHealthOverride as number | undefined
    const creature = createCharacterState({
      id: placement.id,
      name: (data.name as string) ?? '妖物',
      innerSkillId: (data.innerSkillId as string) ?? getCreatureInnerSkillId({ behaviorType, schoolId }, (data.level as number) ?? 1),
      position: placement.position,
      attributes: normalizePlayerAttributes(data.attributes as Partial<PlayerState['attributes']> | undefined),
      prestige: 0,
      money: 0,
      experience: 0,
      turnEnded: false,
      behaviorType,
      schoolId,
      aggroRange: data.aggroRange as number | undefined,
      homePosition: homeNest?.position,
      homeNestId,
      isBoss: (data.isBoss as boolean) ?? false,
      level: (data.level as number) ?? 1,
    })
    // 血量上限覆寫（maxHealthOverride）：套用後同時讓當前血量為滿血。
    if (typeof maxHealthOverride === 'number' && maxHealthOverride > 0) {
      creature.maxHealth = Math.floor(maxHealthOverride)
      creature.health = Math.floor(maxHealthOverride)
    }
    return creature
  })
}

/** 編譯巢穴。 */
function compileNests(placements: ScenarioEntityPlacement[]): CreatureNestState[] {
  return placements.map((placement) => {
    const data = placement.data as Record<string, unknown>
    return {
      id: placement.id,
      name: (data.name as string) ?? '巢穴',
      position: placement.position,
      health: (data.health as number) ?? 40,
      maxHealth: (data.maxHealth as number) ?? 40,
      spawnChance: (data.spawnChance as number) ?? 0.1,
      cooldownRounds: (data.cooldownRounds as number) ?? 0,
      spawnLevel: (data.spawnLevel as number) ?? 1,
      behaviorType: data.behaviorType as CreatureNestState['behaviorType'],
      schoolId: data.schoolId as CreatureNestState['schoolId'],
    }
  })
}

/** 編譯廢墟。 */
function compileRuins(placements: ScenarioEntityPlacement[]): RuinState[] {
  return placements.map((placement) => {
    const data = placement.data as Record<string, unknown>
    return {
      id: placement.id,
      name: (data.name as string) ?? '廢墟',
      position: placement.position,
      status: (data.status as RuinState['status']) ?? 'intact',
    }
  })
}

/** 編譯資源點。 */
function compileResourcePoints(placements: ScenarioEntityPlacement[]): ResourcePointState[] {
  return placements.map((placement) => {
    const data = placement.data as Record<string, unknown>
    return {
      id: placement.id,
      name: (data.name as string) ?? '資源點',
      position: placement.position,
      ownerBaseId: (data.ownerBaseId as string) ?? '',
      materialIncome: (data.materialIncome as number) ?? 10,
      lastCollectedRound: null,
      health: (data.health as number) ?? 30,
      maxHealth: (data.maxHealth as number) ?? 30,
    }
  })
}

/** 編譯道具點。 */
function compileItemPoints(placements: ScenarioEntityPlacement[]): ItemPointState[] {
  return placements.map((placement) => {
    const data = placement.data as Record<string, unknown>
    return {
      id: placement.id,
      itemId: (data.itemId as string | null) ?? null,
      position: placement.position,
      // 劇本模式：道具點預設不可被敵人生物吃掉（eatableByCreatures = false）。
      eatableByCreatures: (data.eatableByCreatures as boolean | undefined) ?? false,
      customDrops: (data.customDrops as ItemPointState['customDrops']) ?? undefined,
    }
  })
}

/** 編譯探索事件點。 */
function compileEvents(placements: ScenarioEntityPlacement[]): ExplorationEventState[] {
  return placements.map((placement) => {
    const data = placement.data as Record<string, unknown>
    // 劇本模式：探索事件點預設不可被敵人生物吃掉（eatableByCreatures = false）。
    const eatableByCreatures = (data.eatableByCreatures as boolean | undefined) ?? false
    // 自定義事件：讀取完整定義。
    if (data.type === 'custom') {
      return {
        id: placement.id,
        type: 'custom',
        name: (data.name as string) ?? '事件',
        description: (data.description as string) ?? '',
        position: placement.position,
        status: 'available',
        discovered: true,
        expiresAtRound: null,
        eatableByCreatures,
        customEvent: {
          icon: (data.icon as string) ?? '🗨️',
          choices: (data.choices as CustomEventChoice[]) ?? [],
        },
      }
    }
    // 既有事件：查 eventCatalog。
    const eventType = (data.eventType as string) ?? 'lost-caravan'
    const definition = getExplorationEventDefinition(eventType as never)
    return {
      id: placement.id,
      type: eventType as ExplorationEventState['type'],
      name: definition?.name ?? '事件',
      description: definition?.description ?? '',
      position: placement.position,
      status: 'available',
      discovered: true,
      expiresAtRound: null,
      eatableByCreatures,
    }
  })
}

/** 編譯門派據點。 */
function compileSectGates(placements: ScenarioEntityPlacement[]): SectGateState[] {
  return placements.map((placement) => {
    const data = placement.data as Record<string, unknown>
    return {
      id: placement.id,
      schoolId: (data.schoolId as SectGateState['schoolId']) ?? 'void-spirit',
      position: placement.position,
      experience: (data.experience as number) ?? 0,
      level: (data.level as SectGateState['level']) ?? 1,
    }
  })
}

/** 編譯防禦設施。 */
function compileDefenseStructures(placements: ScenarioEntityPlacement[]): DefenseStructureState[] {
  return placements.map((placement) => {
    const data = placement.data as Record<string, unknown>
    const type = (data.type as DefenseStructureState['type']) ?? 'barricade'
    // 以 catalog 定義為唯一來源，確保 icon / maxHealth / blocksMovement 等欄位正確。
    const definition = defenseStructureCatalog.find((candidate) => candidate.type === type)
    return {
      ...(definition ?? {
        type,
        name: '防禦設施',
        description: '',
        icon: '🛡️',
        constructionCost: 0,
        requiredRank: 1,
        maxHealth: 50,
        healthBonus: 0,
        blocksMovement: true,
        providesVision: false,
        visionRange: 1,
        attackRange: 0,
        attackDamage: 0,
      }),
      id: placement.id,
      name: (data.name as string) ?? definition?.name ?? '防禦設施',
      position: placement.position,
      ownerBaseId: (data.ownerBaseId as string) ?? '',
      health: (data.health as number) ?? definition?.maxHealth ?? 50,
    }
  })
}

/** 編譯 campaignState（任務目標 + 失敗條件 + 對話佇列）。 */
function compileCampaignState(scenario: ScenarioDefinition): CampaignState {
  return {
    currentChapter: scenario.chapterIndex,
    chapterKey: scenario.id,
    triggeredDialogueIds: [],
    dialogueQueue: [],
    // 對話組：以對話組 id 為鍵，供觸發器 start-dialogue 使用。
    dialogueGroups: Object.fromEntries(
      Object.entries(scenario.dialogues).map(([groupId, group]) => [
        groupId,
        {
          name: group.name,
          steps: group.steps.map((step) => ({
            id: step.id,
            speakerName: step.speakerName,
            speakerIcon: step.speakerIcon,
            content: step.content,
          })),
        },
      ]),
    ),
    // 事件觸發器：時機 → 行為 → id。
    triggers: scenario.triggers ?? [],
    // 編輯器定義的區域列表（供 on-enter-area / on-exit-area 觸發器使用）。
    scenarioAreas: (scenario.areas ?? []).map((area) => ({
      id: area.id,
      name: area.name,
      positions: area.positions,
      destroyWhenTriggered: area.destroyWhenTriggered ?? false,
    })),
    // 探索點補充開關（劇本模式預設關閉）。
    replenishExplorationEvents: scenario.replenishExplorationEvents ?? false,
    activeObjectives: scenario.quests.victoryObjectives.map((objective) => ({
      id: objective.id,
      title: objective.title,
      type: objective.type,
      targetValue: objective.targetValue,
      currentValue: 0,
      completed: false,
      isOptional: objective.isOptional,
      targetId: objective.targetId,
      targetIds: objective.targetIds,
      buildingType: objective.buildingType,
      buildingLevel: objective.buildingLevel,
      structureType: objective.structureType,
    })),
    failConditions: {
      maxRounds: scenario.quests.failConditions.maxRounds,
      baseMustSurvive: scenario.quests.failConditions.baseMustSurvive,
      playerMustSurvive: scenario.quests.failConditions.playerMustSurvive,
      criticalBases: scenario.quests.failConditions.criticalBases,
      maxLostBasesCount: scenario.quests.failConditions.maxLostBasesCount,
    },
  }
}

/**
 * 將 ScenarioDefinition 轉化為 GameState。
 *
 * 初始化所有隱藏欄位（visibility、runStats、operation、blockingModal 等），
 * 並編譯據點預建建築、怪物屬性、玩家初始配置與 campaignState。
 */
export function buildGameStateFromScenario(scenario: ScenarioDefinition): GameState {
  const map = compileMap(scenario)
  const grouped = groupEntities(scenario.entities)
  const nests = compileNests(grouped.nests)
  // 分離「開局生成」與「開局不生成」的巢穴：不生成的存入 scenarioNests，供事件 spawn-nest 觸發。
  const spawnedNests = nests.filter((nest) => {
    const placement = grouped.nests.find((p) => p.id === nest.id)
    return (placement?.data as Record<string, unknown>).spawnOnLoad !== false
  })
  const scenarioNests = nests.filter((nest) => {
    const placement = grouped.nests.find((p) => p.id === nest.id)
    return (placement?.data as Record<string, unknown>).spawnOnLoad === false
  })
  const players = compilePlayers(grouped.players)
  const bases = compileBases(grouped.bases)
  // 分離「開局生成」與「開局不生成」的據點：不生成的存入 scenarioBases，供事件 spawn-base 觸發。
  const spawnedBases = bases.filter((base) => {
    const placement = grouped.bases.find((p) => p.id === base.id)
    return (placement?.data as Record<string, unknown>).spawnOnLoad !== false
  })
  const scenarioBases = bases.filter((base) => {
    const placement = grouped.bases.find((p) => p.id === base.id)
    return (placement?.data as Record<string, unknown>).spawnOnLoad === false
  })
  const creatures = compileCreatures(grouped.creatures, nests)
  // 分離「開局生成」與「開局不生成」的怪物：不生成的存入 scenarioCreatures，供事件 spawn-creature 觸發。
  const spawnedCreatures = creatures.filter((creature) => {
    const placement = grouped.creatures.find((p) => p.id === creature.id)
    return (placement?.data as Record<string, unknown>).spawnOnLoad !== false
  })
  const scenarioCreatures = creatures.filter((creature) => {
    const placement = grouped.creatures.find((p) => p.id === creature.id)
    return (placement?.data as Record<string, unknown>).spawnOnLoad === false
  })
  const ruins = compileRuins(grouped.ruins)
  const resourcePoints = compileResourcePoints(grouped.resourcePoints)
  const itemPoints = compileItemPoints(grouped.itemPoints)
  const events = compileEvents(grouped.events)
  // 分離「開局生成」與「開局不生成」的探索事件點：不生成的存入 scenarioEvents，供事件效果 spawn-event 觸發時加入場上。
  const spawnedEvents = events.filter((event) => {
    const placement = grouped.events.find((p) => p.id === event.id)
    return (placement?.data as Record<string, unknown>).spawnOnLoad !== false
  })
  const scenarioEvents = events.filter((event) => {
    const placement = grouped.events.find((p) => p.id === event.id)
    return (placement?.data as Record<string, unknown>).spawnOnLoad === false
  })
  const sectGates = compileSectGates(grouped.sectGates)
  const defenseStructures = compileDefenseStructures(grouped.defenseStructures)

  const activePlayer = players[0]
  const visibilityState = {
    map,
    players,
    bases: spawnedBases,
    defenseStructures,
  } as unknown as GameState

  return {
    map,
    visibility: {
      exploredCellIds: activePlayer ? [...getPlayerVisibleCellIds(visibilityState, activePlayer.id)] : [],
      mode: 'fog',
    },
    bases: spawnedBases,
    scenarioBases,
    defenseStructures,
    ruins,
    creatureNests: spawnedNests,
    scenarioNests,
    resourcePoints,
    itemPoints,
    explorationEvents: spawnedEvents,
    scenarioEvents,
    sectGates,
    players,
    creatures: spawnedCreatures,
    scenarioCreatures,
    activePlayerId: activePlayer?.id ?? 'player-1',
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
    sharedWarehouse: [],
    sharedEquipmentWarehouse: [],
    aiOrders: [],
    aiConstructionPlans: [],
    // 劇本關卡：隨機事件預設關閉；若 enableRandomEvents 為 true 則用預設機率。
    explorationTriggerChance: scenario.enableRandomEvents ? 0.2 : 0,
    campaignState: compileCampaignState(scenario),
  }
}