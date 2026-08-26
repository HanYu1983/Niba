import { buildingCatalog } from '../catalogs/buildingCatalog'
import { defenseStructureCatalog, type DefenseStructureType } from '../catalogs/defenseStructureCatalog'
import type { ActionOutcome, BaseState, DefenseStructureState, GameState, Position, ResourcePointState } from '../types'
import { applyBaseHealthBonuses, getBaseMaxBuildingMaterials, getBaseMaxHealth, isBaseActive } from '../rules/baseRules'
import { getBaseBuilding, getBuildingUpgradeResult, upgradeBuildingInBase, canPlayerBuildBuildingType } from '../rules/buildingProgressionRules'
import { validateDefenseBuild } from '../rules/defenseRules'
import { restoreTowerHealthForBastion } from '../rules/defenseBastionRules'
import { createImmediateBeaconReveal } from '../rules/warningBeaconRules'
import { ACTION_STAMINA_COSTS, canPlayerPerformAction, spendPlayerStamina } from '../rules/actionCostRules'
import { getBuildingMaterialCostReduction } from '../rules/playerDerivedRules'
import { grantRandomGlobalBuff, upgradeGlobalBuffForBuilding } from '../rules/globalBuffRules'
import { incrementRunStat } from '../runStats'
import { progressObjectives, checkVictory } from '../rules/campaignRules'

export type BuildingActionResult = {
  state: GameState
  result: ActionOutcome
}

export function constructBuilding(state: GameState, baseId: string, buildingId: string, playerId?: string): BuildingActionResult {
  const base = state.bases.find((currentBase) => currentBase.id === baseId)
  const buildingTemplate = buildingCatalog.find((building) =>
    building.id === buildingId && (!base?.martialSchoolId || !building.schoolId || building.schoolId === base.martialSchoolId),
  )
  const player = playerId ? state.players.find((candidate) => candidate.id === playerId) : undefined
  const rankUnlocked = !player || canPlayerBuildBuildingType(player, buildingTemplate?.type ?? '')
  const actionCheck = playerId ? canPlayerPerformAction(state, playerId, ACTION_STAMINA_COSTS.build) : { ok: true as const }
  const schoolMismatch = base?.martialSchoolId !== undefined && buildingTemplate?.schoolId !== undefined && buildingTemplate.schoolId !== base.martialSchoolId

  const alreadyBuilt = buildingTemplate?.schoolId !== undefined
    ? base?.buildings.some((building) => building.schoolId === buildingTemplate.schoolId)
    : base?.buildings.some((building) => building.type === buildingTemplate?.type)

  // 據點允許建築限制：若指定了 allowedBuildings，則僅允許清單內的建築類型。
  const allowed = base?.allowedBuildings
  const buildingAllowed = !allowed || allowed.some((entry) => entry.type === buildingTemplate?.type)
  const constructionCost = player
    ? Math.max(1, Math.floor((buildingTemplate?.constructionCost ?? 0) * (1 - getBuildingMaterialCostReduction(player))))
    : (buildingTemplate?.constructionCost ?? 0)

  if (!base || !isBaseActive(base) || !buildingTemplate || !rankUnlocked || !actionCheck.ok || schoolMismatch || alreadyBuilt || !buildingAllowed || base.buildingMaterials < constructionCost) {
    const reason = !base
      ? '據點不存在。'
      : !isBaseActive(base)
        ? '據點已停用，無法使用建築功能。'
      : !buildingTemplate
        ? '未知建築。'
        : !actionCheck.ok
          ? actionCheck.reason ?? '目前無法行動。'
        : schoolMismatch
          ? '此據點只能建造指定流派的武館。'
          : !rankUnlocked
            ? '官階不足。'
          : alreadyBuilt
            ? '此武館已建造。'
          : !buildingAllowed
            ? '此據點不允許建造該建築。'
            : '建料不足。'
    return { state, result: { ok: false, reason } }
  }

  const building = {
    ...buildingTemplate,
    id: `${base.id}-${buildingTemplate.type}-${base.buildings.length + 1}`,
    level: 1,
  }
  const nextBase: BaseState = {
    ...base,
    buildings: [...base.buildings, building],
    buildingMaterials: base.buildingMaterials - constructionCost,
  }
  const nextBaseWithCapacity = {
    ...nextBase,
    maxBuildingMaterials: getBaseMaxBuildingMaterials(nextBase),
    maxHealth: getBaseMaxHealth(nextBase),
    health: Math.min(
      getBaseMaxHealth(nextBase),
      base.health + Math.max(0, building.healthBonus ?? 0),
    ),
  }

  const builtState: GameState = applyBaseHealthBonuses({
    ...state,
    bases: state.bases.map((currentBase) => currentBase.id === baseId ? nextBaseWithCapacity : currentBase),
    players: playerId
      ? state.players.map((currentPlayer) => currentPlayer.id === playerId ? spendPlayerStamina(currentPlayer, ACTION_STAMINA_COSTS.build) : currentPlayer)
      : state.players,
  })

  // 貿易市場建成時隨機賦予一項全局靈氣 buff（來源據點失活即失效；升級會隨等級增強）。
  const withBuff = buildingTemplate.type === 'trade-market'
    ? grantRandomGlobalBuff(builtState, baseId, undefined, { id: building.id, level: 1 })
    : builtState

  const withRunStat = incrementRunStat(withBuff, 'buildingsBuilt')
  // 劇情模式下，更新 build-building 目標進度並檢查勝利（新建築為 Lv.1）。
  const withProgress = withRunStat.campaignState
    ? checkVictory(progressObjectives(withRunStat, { type: 'build-building', buildingType: buildingTemplate.type, buildingLevel: 1 }))
    : withRunStat

  return {
    state: withProgress,
    result: { ok: true },
  }
}

export function upgradeBuilding(state: GameState, playerId: string, baseId: string, buildingId: string): BuildingActionResult {
  const player = state.players.find((candidate) => candidate.id === playerId)
  const base = state.bases.find((candidate) => candidate.id === baseId)
  const actionCheck = canPlayerPerformAction(state, playerId, ACTION_STAMINA_COSTS.upgrade)
  if (!player || !base || !isBaseActive(base) || !actionCheck.ok) {
    return { state, result: { ok: false, reason: '目前無法行動。' } }
  }

  const building = getBaseBuilding(base, buildingId)
  if (!building) return { state, result: { ok: false, reason: '建築不存在。' } }

  // 據點允許建築的最高等級限制：若指定了 maxLevel，則不可超過。
  const allowedEntry = base.allowedBuildings?.find((entry) => entry.type === building.type)
  if (allowedEntry?.maxLevel !== undefined && (building.level ?? 1) >= allowedEntry.maxLevel) {
    return { state, result: { ok: false, reason: `此據點的${building.name}最高只能升到 Lv.${allowedEntry.maxLevel}。` } }
  }

  const validation = getBuildingUpgradeResult(base, building, player)
  if (!validation.ok) return { state, result: { ok: false, reason: validation.reason ?? '無法升級建築。' } }

  const upgradedBases = state.bases.map((currentBase) => currentBase.id === baseId ? upgradeBuildingInBase(base, buildingId, player) : currentBase)
  // 貿易市場升級：隨等級增強該市場賦予的全局靈氣 buff。
  const upgradedState = building.type === 'trade-market'
    ? upgradeGlobalBuffForBuilding({ ...state, bases: upgradedBases }, buildingId, validation.nextLevel ?? 1)
    : { ...state, bases: upgradedBases }

  const withRunStat = incrementRunStat({
    ...upgradedState,
    players: state.players.map((currentPlayer) => currentPlayer.id === playerId ? spendPlayerStamina(currentPlayer, ACTION_STAMINA_COSTS.upgrade) : currentPlayer),
  }, 'buildingsUpgraded')
  // 劇情模式下，升級後更新 build-building 目標進度（檢查是否達到指定等級）並檢查勝利。
  const withProgress = withRunStat.campaignState
    ? checkVictory(progressObjectives(withRunStat, { type: 'build-building', buildingType: building.type, buildingLevel: validation.nextLevel ?? 1 }))
    : withRunStat

  return {
    state: withProgress,
    result: { ok: true },
  }
}

export function constructDefenseStructure(
  state: GameState,
  playerId: string,
  baseId: string,
  structureType: DefenseStructureType,
  position: Position,
): BuildingActionResult {
  const player = state.players.find((candidate) => candidate.id === playerId)
  const definition = defenseStructureCatalog.find((candidate) => candidate.type === structureType)
  const staminaCost = definition?.changesTerrain ? ACTION_STAMINA_COSTS.roadBuild : ACTION_STAMINA_COSTS.defenseBuild
  const actionCheck = canPlayerPerformAction(state, playerId, staminaCost)
  const error = actionCheck.ok
    ? validateDefenseBuild(state, player ?? null, playerId, baseId, structureType, position)
    : actionCheck.reason ?? '目前無法行動。'
  const base = state.bases.find((candidate) => candidate.id === baseId)
  if (error || !definition || !base || !isBaseActive(base)) {
    return { state, result: { ok: false, reason: error ?? (!definition ? '未知防禦設施。' : '據點不存在。') } }
  }

  const structure: DefenseStructureState = {
    ...definition,
    id: `${baseId}-defense-${(state.defenseStructures ?? []).length + 1}`,
    position,
    ownerBaseId: baseId,
    health: definition.maxHealth,
  }

  // 道路等不佔格子的設施：改寫目標格地形，而非新增防禦設施。
  if (definition.changesTerrain) {
    const roadState: GameState = incrementRunStat({
      ...state,
      map: {
        ...state.map,
        cells: state.map.cells.map((cell) =>
          cell.row === position.row && cell.column === position.column
            ? { ...cell, terrain: 'road' as const }
            : cell,
        ),
      },
      bases: state.bases.map((candidate) => candidate.id === baseId
        ? { ...candidate, buildingMaterials: candidate.buildingMaterials - definition.constructionCost }
        : candidate),
      players: state.players.map((candidate) => candidate.id === playerId
        ? spendPlayerStamina(candidate, staminaCost)
        : candidate),
    }, 'defenseStructuresBuilt')
    return {
      state: roadState.campaignState
        ? checkVictory(progressObjectives(roadState, { type: 'build-defense-structure', structureType }))
        : roadState,
      result: { ok: true },
    }
  }

  // 輜重庫等設施：於自身位置生成大型資源點（採集量 ×N），歸屬所屬據點。
  const resourcePoints = definition.resourceIncomeMultiplier
    ? [...(state.resourcePoints ?? []), {
        id: `${baseId}-resource-${(state.resourcePoints ?? []).length + 1}`,
        name: definition.name,
        position,
        ownerBaseId: baseId,
        materialIncome: 15 * definition.resourceIncomeMultiplier,
        lastCollectedRound: null,
        health: 100,
        maxHealth: 100,
      } satisfies ResourcePointState]
    : state.resourcePoints ?? []

  // 烽燧臺建成瞬間：直接揭示全圖敵軍一次（不經機率）。
  const immediateBeaconReveal = definition.type === 'warning-beacon'
    ? createImmediateBeaconReveal({ ...state, defenseStructures: [...(state.defenseStructures ?? []), structure] })
    : null

  // 輜重庫等設施：不新增實體防禦設施（僅生成大型資源點），避免地圖上疊加雙 icon。
  // 其他設施則照常新增；軍壘另需觸發建造瞬間的回復範圍塔類 HP。
  const isDepot = Boolean(definition.resourceIncomeMultiplier)
  const nextDefenseStructures = isDepot
    ? (state.defenseStructures ?? [])
    : definition.type === 'warcamp-bastion'
      ? restoreTowerHealthForBastion([...(state.defenseStructures ?? []), structure], position)
      : [...(state.defenseStructures ?? []), structure]

  const defenseState: GameState = incrementRunStat({
    ...state,
    bases: state.bases.map((candidate) => candidate.id === baseId
      ? { ...candidate, buildingMaterials: candidate.buildingMaterials - definition.constructionCost }
      : candidate),
    defenseStructures: nextDefenseStructures,
    resourcePoints,
    revealedCreatureCellIds: immediateBeaconReveal?.revealedCreatureCellIds ?? state.revealedCreatureCellIds,
    revealedCreatureUntilRound: immediateBeaconReveal?.revealedCreatureUntilRound ?? state.revealedCreatureUntilRound,
    players: state.players.map((candidate) => candidate.id === playerId
      ? spendPlayerStamina(candidate, staminaCost)
      : candidate),
  }, 'defenseStructuresBuilt')
  return {
    state: defenseState.campaignState
      ? checkVictory(progressObjectives(defenseState, { type: 'build-defense-structure', structureType }))
      : defenseState,
    result: { ok: true },
  }
}

/**
 * 修路：將玩家所在位置的地形改為 road。
 * 不消耗建料、不需據點，僅消耗體力（ACTION_STAMINA_COSTS.buildRoad）。
 */
export function buildRoadAtPlayer(state: GameState, playerId: string): BuildingActionResult {
  const player = state.players.find((candidate) => candidate.id === playerId)
  const actionCheck = canPlayerPerformAction(state, playerId, ACTION_STAMINA_COSTS.buildRoad)
  if (!actionCheck.ok) return { state, result: { ok: false, reason: actionCheck.reason ?? '目前無法行動。' } }
  if (!player) return { state, result: { ok: false, reason: '玩家不存在。' } }

  const cell = state.map.cells.find(
    (candidate) => candidate.row === player.position.row && candidate.column === player.position.column,
  )
  if (!cell) return { state, result: { ok: false, reason: '玩家所在格不存在。' } }
  if (cell.terrain === 'road') return { state, result: { ok: false, reason: '此處已是道路。' } }
  if (cell.terrain === 'wall') return { state, result: { ok: false, reason: '牆壁無法鋪設道路。' } }

  const roadState: GameState = incrementRunStat({
    ...state,
    map: {
      ...state.map,
      cells: state.map.cells.map((candidate) =>
        candidate.row === player.position.row && candidate.column === player.position.column
          ? { ...candidate, terrain: 'road' as const }
          : candidate,
      ),
    },
    players: state.players.map((candidate) => candidate.id === playerId
      ? spendPlayerStamina(candidate, ACTION_STAMINA_COSTS.buildRoad)
      : candidate),
  }, 'defenseStructuresBuilt')

  return {
    state: roadState.campaignState
      ? checkVictory(progressObjectives(roadState, { type: 'build-defense-structure', structureType: 'road' }))
      : roadState,
    result: { ok: true },
  }
}
