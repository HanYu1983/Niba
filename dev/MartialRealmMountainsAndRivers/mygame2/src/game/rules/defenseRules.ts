import { type DefenseStructureType, defenseStructureCatalog } from '../catalogs/defenseStructureCatalog'
import type {
  GameState,
  PlayerState,
  Position,
} from '../types'
import { isAdjacent, isSamePosition } from '../types'
import { getGovernanceRank } from './governanceRules'
import { getOccupiedPositions, SPAWN_LAYERS } from './occupancyRules'

/** 防禦設施建造範圍：據點曼哈頓距離內可建造。 */
export const DEFENSE_BUILD_RANGE = 5

/** 獲得建造範圍：基礎 5 格，官階每高 1 級 +1（官階 6 達最大 10 格）。 */
export function getDefenseBuildRange(rank: number): number {
  return DEFENSE_BUILD_RANGE + Math.max(0, rank - 1)
}

export function validateDefenseBuild(
  state: GameState,
  player: PlayerState | null,
  playerId: string,
  baseId: string,
  structureType: DefenseStructureType,
  position: Position,
): string | null {
  const base = state.bases.find((candidate) => candidate.id === baseId)
  const definition = defenseStructureCatalog.find((candidate) => candidate.type === structureType)
  const cell = state.map.cells.find((candidate) => isSamePosition(candidate, position))
  const occupied = getOccupiedPositions(state, { layers: SPAWN_LAYERS })

  if (!player || playerId !== state.activePlayerId) return '目前無法建造防禦設施。'
  if (!base || !definition) return '據點或設施不存在。'
  const playerRank = getGovernanceRank(player.prestige).rank
  if (playerRank < definition.requiredRank) return `官階不足，需要 ${definition.requiredRank} 階。`
  if (state.creatureTurnInProgress) return 'Creature 行動期間不可建造。'
  if (!isAdjacent(player.position, base.position)) return '玩家必須位於據點旁。'
  if (base.buildingMaterials < definition.constructionCost) return `建料不足，還需要 ${definition.constructionCost - base.buildingMaterials}。`
  if (!cell || cell.terrain === 'wall') return '目標格不可建造。'
  // 輜重庫每據點最多一座：輜重庫於生成時轉為同所屬據點的大型資源點（name = 輜重庫）。
  if (structureType === 'supply-depot' && (state.resourcePoints ?? []).some(
    (point) => point.ownerBaseId === baseId && point.name === '輜重庫',
  )) return '每座據點最多只能擁有一座輜重庫。'
  const buildRange = getDefenseBuildRange(playerRank)
  const distance = Math.abs(base.position.row - position.row) + Math.abs(base.position.column - position.column)
  if (distance > buildRange) return `目標格超出據點 ${buildRange} 格建造範圍。`
  // 道路不佔格子，可鋪設在已被其他物件佔用的格子上（但不可鋪在牆上）。
  if (!definition.changesTerrain && occupied.some((candidate) => isSamePosition(candidate, position))) return '目標格已被佔用。'
  return null
}
