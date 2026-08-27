import {
  type Position,
  type TerrainType,
  type TerrainWeights,
  type MapCell,
  type MapState,
  type PlayerState,
  type PlayerAttributes,
  type CreatureState,
  type ItemPointState,
  type ExplorationEventState,
  type BaseState,
  type CreatureNestState,
  type ResourcePointState,
  type GameState,
  type RuinState,
  type SectGateState,
  isSamePosition,
} from './types'
import { buildingCatalog } from './catalogs/buildingCatalog'
import { getTalentBuffs } from './catalogs/talentCatalog'
import { martialSchoolCatalog, type MartialSchoolId } from './catalogs/martialSchoolCatalog'
import { cityNames, playerNames, resourceNames, villageNames } from './catalogs/placeNameCatalog'
import {
  type CreatureBehaviorType,
  CREATURE_BEHAVIOR_BY_INDEX,
  getCreatureAttributes,
  getCreatureInnerSkillId,
  rollRoamerLevel,
} from './rules/creatureBehaviorRules'
import { createSeededRandom, pickRandom } from './rules/randomRules'
import { getPlayerVisibleCellIds } from './rules/visibilityRules'
import { NEST_SPAWN_BASE_CHANCE, getNestMaxHealth } from './actions/creatureActions'
import { createExplorationEventsFromCatalog } from './events/eventSpawner'
import { createCharacterState } from './characterFactory'
import { getSchoolElement, martialSchoolCatalog as progressionMartialSchoolCatalog, type SchoolElement } from './catalogs/skillProgressionCatalog'

/**
 * 世界生成純函式集合。
 *
 * 抽離自 `gameStore.ts`，集中管理：
 * - 地形 noise 與 cell 生成
 * - 據點、資源點、道具點、探索事件、巢穴與游蕩 Creature 的隨機位置選取
 * - 互動點補點邏輯
 *
 * 這些函式不直接讀寫 module-level `gameState`，僅依賴輸入參數與 rules 模組。
 */

function smoothNoise(row: number, column: number, seed: number): number {
  const value = Math.sin(row * 127.1 + column * 311.7 + seed * 74.7) * 43758.5453
  return value - Math.floor(value)
}

function interpolatedNoise(row: number, column: number, seed: number, scale: number): number {
  const sampleRow = row / scale
  const sampleColumn = column / scale
  const row0 = Math.floor(sampleRow)
  const column0 = Math.floor(sampleColumn)
  const rowFraction = sampleRow - row0
  const columnFraction = sampleColumn - column0
  const topLeft = smoothNoise(row0, column0, seed)
  const topRight = smoothNoise(row0, column0 + 1, seed)
  const bottomLeft = smoothNoise(row0 + 1, column0, seed)
  const bottomRight = smoothNoise(row0 + 1, column0 + 1, seed)
  const top = topLeft + (topRight - topLeft) * columnFraction
  const bottom = bottomLeft + (bottomRight - bottomLeft) * columnFraction

  return top + (bottom - top) * rowFraction
}

function terrainNoise(row: number, column: number, seed: number, scale = 1): number {
  return (
    interpolatedNoise(row, column, seed, 12 * scale) * 0.55 +
    interpolatedNoise(row, column, seed + 17, 6 * scale) * 0.3 +
    interpolatedNoise(row, column, seed + 31, 3 * scale) * 0.15
  )
}

/** 預設地形權重：與原本的 noise 門檻分布一致（water 0.2 / forest 0.14 / plain 0.21 / mountain 0.17 / desert 0.28）。 */
export const DEFAULT_TERRAIN_WEIGHTS: TerrainWeights = {
  plain: 21,
  forest: 14,
  water: 20,
  mountain: 17,
  desert: 28,
}

/** 依權重將 [0,1) 的 noise 值映射到地形。 */
function terrainFromNoise(noise: number, weights: TerrainWeights): TerrainType {
  const total = weights.plain + weights.forest + weights.water + weights.mountain + weights.desert
  const scaled = noise * total
  let acc = 0
  if (scaled < (acc += weights.water)) return 'water'
  if (scaled < (acc += weights.forest)) return 'forest'
  if (scaled < (acc += weights.plain)) return 'plain'
  if (scaled < (acc += weights.mountain)) return 'mountain'
  return 'desert'
}

export function createMapCells(
  rows: number,
  columns: number,
  seed = 20260803,
  noiseScale = 1,
  weights: TerrainWeights = DEFAULT_TERRAIN_WEIGHTS,
): MapCell[] {
  return Array.from({ length: rows * columns }, (_, index) => {
    const row = Math.floor(index / columns)
    const column = index % columns
    const isBorder = row === 0 || column === 0 || row === rows - 1 || column === columns - 1
    const noise = terrainNoise(row, column, seed, noiseScale)
    const terrain: TerrainType = isBorder
      ? 'wall'
      : terrainFromNoise(noise, weights)

    return { id: `${row}-${column}`, row, column, terrain }
  })
}

export function createRandomBases(map: MapState, count = 5, seed = 20260803): BaseState[] {
  const candidates = map.cells
    .filter((cell) => cell.terrain !== 'wall' && cell.terrain !== 'water')
    .map((cell) => ({
      position: { row: cell.row, column: cell.column },
      score: smoothNoise(cell.row + 41, cell.column + 17, seed),
    }))
    .sort((first, second) => second.score - first.score)
  const selectedPositions: Position[] = []
  const minimumDistance = 8

  for (const candidate of candidates) {
    const isFarEnough = selectedPositions.every(
      (position) =>
        Math.abs(position.row - candidate.position.row) +
        Math.abs(position.column - candidate.position.column) >= minimumDistance,
    )

    if (!isFarEnough) {
      continue
    }

    selectedPositions.push(candidate.position)

    if (selectedPositions.length === count) {
      break
    }
  }

  const schools: MartialSchoolId[] = martialSchoolCatalog.map((school) => school.id)
  const random = createSeededRandom(seed + 555)
  const availableCityNames = [...cityNames]
  const usedCityNames = new Set<string>()

  const getUniqueCityName = (index: number): string => {
    const name = pickRandom(availableCityNames, random)
    if (name) {
      const nameIndex = availableCityNames.indexOf(name)
      if (nameIndex >= 0) availableCityNames.splice(nameIndex, 1)
      usedCityNames.add(name)
      return name
    }

    let suffix = index + 1
    let fallback = `守護據點 ${suffix}`
    while (usedCityNames.has(fallback)) {
      suffix += 1
      fallback = `守護據點 ${suffix}`
    }
    usedCityNames.add(fallback)
    return fallback
  }

  return selectedPositions.map((position, index) => {
    const maxHealth = Math.round(random() * 50 + 110)
    return {
      id: `base-${index + 1}`,
      // 每次生成從武俠風城市名中隨機挑選，並確保同局不重複
      name: getUniqueCityName(index),
      position,
      buildings: [
        {
          ...buildingCatalog[0],
          id: `building-${index + 1}-board`,
        },
      ],
      buildingMaterials: 0,
      maxBuildingMaterials: 150,
      health: maxHealth,
      maxHealth,
      active: true,
      // 各據點隨機分配不同門派（array + random slice），避免玩家學習成本過高
      martialSchoolId: pickRandom(schools, random) ?? 'void-spirit',
      discovered: false,
    }
  })
}

export function createCreatureNests(
  map: MapState,
  count: number,
  seed: number,
  excludedPositions: Position[],
): CreatureNestState[] {
  const positions = createRandomPositions(map, count, seed, excludedPositions)
  const schools: MartialSchoolId[] = martialSchoolCatalog.map((school) => school.id)
  const behaviors: CreatureBehaviorType[] = CREATURE_BEHAVIOR_BY_INDEX
  const random = createSeededRandom(seed + 999)
  // 地形 → 五行屬性對應：依地形推導巢穴應有的五行，再從該五行的門派中隨機選取。
  const elementByTerrain: Partial<Record<TerrainType, SchoolElement>> = {
    mountain: 'metal',
    forest: 'wood',
    desert: 'fire',
    water: 'water',
    plain: 'earth',
  }
  // 依五行屬性取得 skillProgressionCatalog 中同屬性的門派清單；無對應屬性時回傳所有門派。
  const schoolsByElement = (element: SchoolElement): MartialSchoolId[] => {
    const matches = progressionMartialSchoolCatalog
      .filter((school) => school.element === element)
      .map((school) => school.id as MartialSchoolId)
    return matches.length > 0 ? matches : schools
  }
  // 70% 依巢穴所在格地形對應的五行決定流派，30% 完全隨機，保留世界生成的不確定性。
  const selectedSchools = positions.map((position) => {
    const terrain = map.cells.find((cell) => cell.row === position.row && cell.column === position.column)?.terrain
    const terrainElement = terrain ? elementByTerrain[terrain] : undefined
    return terrainElement && random() < 0.7
      ? pickRandom(schoolsByElement(terrainElement), random) ?? 'void-spirit'
      : pickRandom(schools, random) ?? 'void-spirit'
  })

  return positions.map((position, index) => ({
    id: `creature-nest-${index + 1}`,
    name: `生物巢穴 ${index + 1}`,
    position,
    health: getNestMaxHealth(1),
    maxHealth: getNestMaxHealth(1),
    spawnChance: NEST_SPAWN_BASE_CHANCE,
    cooldownRounds: 0,
    spawnLevel: 1,
    // 巢穴流派與行為類型隨機生成，決定其生成 Creature 的屬性與內功。
    schoolId: selectedSchools[index] ?? 'void-spirit',
    behaviorType: pickRandom(behaviors, random) ?? 'scavenger',
    // 巢穴主導元素由流派推導（區域靈氣系統）；太虛流等無屬性流派為 'none'。
    dominantElement: getSchoolElement(selectedSchools[index]),
  }))
}

export function createRandomPositions(
  map: MapState,
  count: number,
  seed: number,
  excludedPositions: Position[] = [],
): Position[] {
  // 先排除已被佔用的格子，確保只在空格上生成（絕不與既有物件重疊）。
  const occupiedKeys = new Set(
    excludedPositions
      .filter((position) => position && position.row !== undefined && position.column !== undefined)
      .map((position) => `${position.row}-${position.column}`),
  )
  const candidates = map.cells
    .filter((cell) => cell.terrain !== 'wall' && !occupiedKeys.has(`${cell.row}-${cell.column}`))
    .map((cell) => ({
      position: { row: cell.row, column: cell.column },
      score: smoothNoise(cell.row + count * 13, cell.column + seed, seed),
    }))
    .sort((first, second) => second.score - first.score)
  const positions = [...excludedPositions.filter((position) => position && position.row !== undefined && position.column !== undefined)]
  const selectedPositions: Position[] = []
  const minimumDistance = 5

  for (const candidate of candidates) {
    const isFarEnough = positions.every(
      (position) => position &&
        Math.abs(position.row - candidate.position.row) +
        Math.abs(position.column - candidate.position.column) >= minimumDistance,
    )

    if (!isFarEnough) {
      continue
    }

    selectedPositions.push(candidate.position)
    positions.push(candidate.position)

    if (selectedPositions.length === count) {
      break
    }
  }

  // 地圖較小或互動點數量較多時，最小距離規則可能過於嚴格。
  // 在仍有空格的情況下退回「不可重疊」規則，確保設定的巢穴數量不會直接變成 0。
  if (selectedPositions.length < count) {
    for (const candidate of candidates) {
      const isOccupied = positions.some((position) => isSamePosition(position, candidate.position))
      if (isOccupied) continue

      selectedPositions.push(candidate.position)
      positions.push(candidate.position)

      if (selectedPositions.length === count) {
        break
      }
    }
  }

  return selectedPositions
}

/**
 * 生成廢墟位置。廢墟格子會改為 `wall` 地形（不可行走），
 * 玩家在周邊一格時可互動修復為小型防禦設施。
 */
export function createRuins(
  map: MapState,
  count: number,
  seed: number,
  excludedPositions: Position[] = [],
): RuinState[] {
  // 廢墟點避開水地形：將所有水域格子加入排除清單。
  const waterPositions = map.cells
    .filter((cell) => cell.terrain === 'water')
    .map((cell) => ({ row: cell.row, column: cell.column }))
  const positions = createRandomPositions(map, count, seed, [...excludedPositions, ...waterPositions])
  const random = createSeededRandom(seed + 777)
  const availableNames = [...villageNames]
  return positions.map((position, index) => {
    // 每次生成從武俠風村落名中隨機挑選，並排除已用過的名稱，避免重複
    const name = pickRandom(availableNames, random) ?? `廢墟 ${index + 1}`
    const nameIndex = name ? availableNames.indexOf(name) : -1
    if (nameIndex >= 0) availableNames.splice(nameIndex, 1)
    return {
      id: `ruin-${index + 1}`,
      name,
      position,
      status: 'intact' as const,
    }
  })
}

/**
 * 生成中立門派據點。
 *
 * 每個據點隨機指定一個不同門派（六門派各一），攜帶該門派三個功法；
 * 玩家可在據點學習或練習功法，累積據點經驗升級（1→2→3）解鎖更多功法。
 */
export function createSectGates(
  map: MapState,
  count: number,
  seed: number,
  excludedPositions: Position[] = [],
): SectGateState[] {
  const requested = Math.max(0, count)
  if (requested === 0) return []
  // 門派據點避開水地形：將所有水域格子加入排除清單。
  const waterPositions = map.cells
    .filter((cell) => cell.terrain === 'water')
    .map((cell) => ({ row: cell.row, column: cell.column }))
  const positions = createRandomPositions(map, requested, seed, [...excludedPositions, ...waterPositions])
  const random = createSeededRandom(seed + 655)
  // 先將門派目錄隨機排列，確保每個門派至少出現一次；超過目錄數量後循環分配並允許重複。
  const allSchoolIds: MartialSchoolId[] = martialSchoolCatalog.map((school) => school.id)
  const shuffledSchoolIds = [...allSchoolIds]
  for (let index = shuffledSchoolIds.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1))
    ;[shuffledSchoolIds[index], shuffledSchoolIds[swapIndex]] = [shuffledSchoolIds[swapIndex], shuffledSchoolIds[index]]
  }
  return positions.map((position, index) => ({
    id: `sect-gate-${index + 1}`,
    schoolId: shuffledSchoolIds[index % shuffledSchoolIds.length] ?? 'void-spirit',
    position,
    experience: 0,
    level: 1,
  }))
}

export function getRandomFreeInteractionPosition(state: GameState, seed: number): Position | null {
  const occupied = [
    ...state.bases.map((base) => base.position),
    ...(state.sectGates ?? []).map((gate) => gate.position),
    ...(state.ruins ?? []).filter((ruin) => ruin.status === 'intact').map((ruin) => ruin.position),
    ...state.resourcePoints.map((point) => point.position),
    ...state.players.map((player) => player.position),
    ...state.creatures.map((creature) => creature.position),
    ...state.creatureNests.map((nest) => nest.position),
    ...state.itemPoints.map((point) => point.position),
    ...(state.explorationEvents ?? []).map((event) => event.position),
    ...(state.defenseStructures ?? []).map((structure) => structure.position),
  ]
  const candidates = state.map.cells
    .filter((cell) => cell.terrain !== 'wall' && !occupied.some((position) => isSamePosition(position, cell)))
    .sort((first, second) => Math.sin((second.row + 1) * 127.1 + (second.column + 1) * 311.7 + seed * 74.7) - Math.sin((first.row + 1) * 127.1 + (first.column + 1) * 311.7 + seed * 74.7))
  return candidates[0] ? { row: candidates[0].row, column: candidates[0].column } : null
}

export function replenishInteractionPoint(state: GameState, removedItemPoint: boolean, removedEvent: ExplorationEventState | null): GameState {
  // 道具點為一次性有限資源；玩家拾取後不再補充。探索事件仍維持原本的補充流程。
  if (removedItemPoint) return state
  // 劇本模式：若關閉探索點補充（replenishExplorationEvents !== true），則不補點。
  if (state.campaignState && state.campaignState.replenishExplorationEvents !== true) return state
  const position = getRandomFreeInteractionPosition(state, state.round + state.itemPoints.length + (state.explorationEvents?.length ?? 0) + 901)
  if (!position) return state

  if (removedEvent) {
    const replacements = createExplorationEventsFromCatalog(
      state.map,
      [
        ...state.bases.map((base) => base.position),
        ...(state.sectGates ?? []).map((gate) => gate.position),
        ...(state.ruins ?? []).filter((ruin) => ruin.status === 'intact').map((ruin) => ruin.position),
        ...state.resourcePoints.map((point) => point.position),
        ...state.players.map((player) => player.position),
        ...state.creatures.map((creature) => creature.position),
        ...state.creatureNests.map((nest) => nest.position),
        ...state.itemPoints.map((point) => point.position),
        ...(state.explorationEvents ?? []).map((event) => event.position),
        ...(state.defenseStructures ?? []).map((structure) => structure.position),
      ],
      state.round + (state.explorationEvents?.length ?? 0) + 901,
      1,
    )
    const replacement = replacements[0]
    if (replacement) {
      const uniqueReplacement = {
        ...replacement,
        id: `event-respawn-${state.round}-${(state.explorationEvents?.length ?? 0) + 1}`,
      }
      return { ...state, explorationEvents: [...(state.explorationEvents ?? []), uniqueReplacement] }
    }
  }
  return state
}

export function createItemPoints(
  map: MapState,
  count: number,
  seed: number,
  excludedPositions: Position[] = [],
): ItemPointState[] {
  const positions = createRandomPositions(map, count, seed, excludedPositions)

  return positions.map((position, index) => ({
    id: `item-point-${index + 1}`,
    itemId: null,
    position,
  }))
}

export function createResourcePoints(
  map: MapState,
  bases: BaseState[],
  count = 10,
  seed = 20260803,
): ResourcePointState[] {
  if (bases.length === 0) {
    return []
  }

  const cellsByPosition = new Map(
    map.cells.map((cell) => [`${cell.row}-${cell.column}`, cell]),
  )
  const occupiedKeys = new Set(
    bases.map((base) => `${base.position.row}-${base.position.column}`),
  )
  const pointsPerBase = Math.floor(count / bases.length)
  const remainder = count % bases.length
  const resourcePoints: ResourcePointState[] = []

  bases.forEach((base, baseIndex) => {
    const baseCount = pointsPerBase + (baseIndex < remainder ? 1 : 0)
    const candidates = Array.from({ length: 13 * 13 }, (_, index) => {
      const rowOffset = Math.floor(index / 13) - 6
      const columnOffset = (index % 13) - 6
      const position = {
        row: base.position.row + rowOffset,
        column: base.position.column + columnOffset,
      }
      const distance = Math.abs(rowOffset) + Math.abs(columnOffset)

      return {
        position,
        distance,
        score: smoothNoise(
          position.row + baseIndex * 31,
          position.column + seed + baseIndex * 17,
          seed + 211,
        ),
      }
    })
      .filter(({ position, distance }) => {
        const cell = cellsByPosition.get(`${position.row}-${position.column}`)
        return Boolean(cell) && cell?.terrain !== 'wall' && distance > 0
      })
      .sort((first, second) => second.score - first.score)

    let selectedForBase = 0

    for (const candidate of candidates) {
      const positionKey = `${candidate.position.row}-${candidate.position.column}`

      if (occupiedKeys.has(positionKey)) {
        continue
      }

      occupiedKeys.add(positionKey)
      const cell = cellsByPosition.get(`${candidate.position.row}-${candidate.position.column}`)
      resourcePoints.push({
        id: `resource-point-${resourcePoints.length + 1}`,
        // 依所在地形隨機取名：森林→樹林、水→清泉、其餘→石礦等
        name: resourceNames[cell?.terrain ?? 'default'] ?? resourceNames.default ?? `資源點 ${resourcePoints.length + 1}`,
        position: candidate.position,
        ownerBaseId: base.id,
        materialIncome: 15,
        lastCollectedRound: null,
        health: 30,
        maxHealth: 30,
      })
      selectedForBase += 1

      if (selectedForBase === baseCount) {
        break
      }
    }
  })

  return resourcePoints
}

/**
 * 建立開局游蕩型 Creature。
 *
 * 游蕩型 Creature 不屬於任何巢穴；巢穴 Creature 仍在後續回合生成。
 */
export function createRoamerCreatures(
  map: MapState,
  count: number,
  seed: number,
  excludedPositions: Position[],
): CreatureState[] {
  const creaturePositions = createRandomPositions(map, count, seed, excludedPositions)
  return creaturePositions.map((position, index) => {
    const behaviorType = 'roamer' as const
    // 開局游蕩妖物維持既有 roamer + void-spirit 設定。
    const schoolId = 'void-spirit' as const
    const level = rollRoamerLevel()
    return createCharacterState({
      id: `roamer-creature-${index + 1}`,
      name: '游蕩妖物',
      innerSkillId: getCreatureInnerSkillId({ behaviorType, schoolId }, level),
      position,
      attributes: getCreatureAttributes(
        { armStrength: 6, constitution: 6, agility: 6, innerEnergy: 6, insight: 6 },
        { behaviorType, schoolId },
        level,
      ),
      prestige: 0,
      money: 0,
      experience: 0,
      turnEnded: false,
      behaviorType,
      schoolId,
      level,
    })
  })
}

/**
 * 建立開局玩家清單。
 *
 * @param humanAttributeBonuses 可選：套用於人類玩家的五維永久加成（來自名册角色）。
 *   僅套用於 index < humanPlayerCount 的人類玩家；AI 玩家維持預設全 8。
 * @param humanName 可選：套用於第一位人類玩家的名稱（來自名册角色）。
 * @param initialInternalSkillId 可選：第一位人類玩家的初始內功（預設吐納功）。
 * @param initialExternalSkillIds 可選：第一位人類玩家的初始外功清單。
 * @param talentIds 可選：第一位人類玩家所屬名册角色的天賦 ids；開局會轉為常駐 buff 注入。
 * @param humanPortrait 可選：第一位人類玩家的外觀 icon（來自名册角色）。
 * @param humanTitle 可選：第一位人類玩家的稱號（來自名册角色）。
 */
export function createInitialPlayers(
  playerPositions: Position[],
  seed = 20260803,
  humanPlayerCount = playerPositions.length,
  humanAttributeBonuses?: PlayerAttributes,
  humanName?: string,
  initialInternalSkillId?: string,
  initialExternalSkillIds?: string[],
  talentIds?: string[],
  humanPortrait?: string,
  humanTitle?: string,
): PlayerState[] {
  const random = createSeededRandom(seed + 111)
  const availableNames = [...playerNames]
  const usedNames = new Set<string>()
  return playerPositions.map((position, index) => {
    const isAI = index >= humanPlayerCount
    // 第一位人類玩家若指定了名册角色名稱，直接採用；其餘照常隨機取名。
    let name = !isAI && index === 0 && humanName ? humanName : pickRandom(availableNames, random)
    const nameIndex = name ? availableNames.indexOf(name) : -1
    if (nameIndex >= 0) availableNames.splice(nameIndex, 1)
    if (!name || usedNames.has(name)) {
      let suffix = index + 1
      name = `玩家 ${suffix}`
      while (usedNames.has(name)) {
        suffix += 1
        name = `玩家 ${suffix}`
      }
    }
    usedNames.add(name)
    const base = { armStrength: 8, constitution: 8, agility: 8, innerEnergy: 8, insight: 8 }
    const attributes = !isAI && humanAttributeBonuses
      ? {
          armStrength: base.armStrength + (humanAttributeBonuses.armStrength ?? 0),
          constitution: base.constitution + (humanAttributeBonuses.constitution ?? 0),
          agility: base.agility + (humanAttributeBonuses.agility ?? 0),
          innerEnergy: base.innerEnergy + (humanAttributeBonuses.innerEnergy ?? 0),
          insight: base.insight + (humanAttributeBonuses.insight ?? 0),
        }
      : base
    // 第一位人類玩家套用名册角色的初始功法；其餘維持預設吐納功、無外功。
    const useCharacterSkills = !isAI && index === 0
    const innerSkillId = useCharacterSkills && initialInternalSkillId ? initialInternalSkillId : 'tuna-gong'
    // 已知內功清單需含初始內功（含吐納功），否則功法設定頁不會顯示名册角色帶入的內功。
    const innerSkillIds = [...new Set(['tuna-gong', innerSkillId])]
    const externalSkillIds = useCharacterSkills ? (initialExternalSkillIds ?? []) : []
    const talentBuffs = useCharacterSkills ? getTalentBuffs(talentIds ?? []) : []
    return createCharacterState({
      id: `player-${index + 1}`,
      name,
      isAI,
      portrait: useCharacterSkills ? humanPortrait : undefined,
      title: useCharacterSkills ? humanTitle : undefined,
      innerSkillId,
      innerSkillIds,
      position,
      attributes,
      buffs: talentBuffs,
      prestige: 0,
      money: 30,
      experience: 0,
      externalSkillIds,
      equippedExternalSkillIds: externalSkillIds,
      // 玩家起始道具：絆馬索、定身鎖、探地符各 1，另有療傷藥 2 與聚氣丹 1（人類與 AI 皆給）。
      inventory: [
        { itemId: 'hobble-rope', quantity: 1 },
        { itemId: 'immobilize-rope', quantity: 1 },
        { itemId: 'scout-talisman', quantity: 1 },
        { itemId: 'heal-wound-medicine', quantity: 2 },
        { itemId: 'gather-qi-pill', quantity: 1 },
      ],
      // 玩家是否輪到行動由 activePlayerId 控制；所有玩家進入新回合時都尚未結束回合。
      turnEnded: false,
    })
  })
}

export { getPlayerVisibleCellIds }
