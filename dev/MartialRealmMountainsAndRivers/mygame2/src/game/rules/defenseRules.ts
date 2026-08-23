import { type DefenseStructureType, defenseStructureCatalog } from '../catalogs/defenseStructureCatalog'
import type {
  GameState,
  PlayerState,
  Position,
} from '../types'
import { isAdjacent, isSamePosition } from '../types'
import { getGovernanceRank } from './governanceRules'

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
  const occupied = [
    ...state.players.map((candidate) => candidate.position),
    ...state.creatures.map((candidate) => candidate.position),
    ...state.bases.map((candidate) => candidate.position),
    ...state.creatureNests.map((candidate) => candidate.position),
    ...state.resourcePoints.map((candidate) => candidate.position),
    ...state.itemPoints.map((candidate) => candidate.position),
    ...(state.defenseStructures ?? []).map((candidate) => candidate.position),
  ]

  if (!player || playerId !== state.activePlayerId) return '目前無法建造防禦設施。'
  if (!base || !definition) return '據點或設施不存在。'
  if (getGovernanceRank(player.prestige).rank < definition.requiredRank) return `官階不足，需要 ${definition.requiredRank} 階。`
  if (state.creatureTurnInProgress) return 'Creature 行動期間不可建造。'
  if (!isAdjacent(player.position, base.position)) return '玩家必須位於據點旁。'
  if (base.buildingMaterials < definition.constructionCost) return `建料不足，還需要 ${definition.constructionCost - base.buildingMaterials}。`
  if (!cell || cell.terrain === 'wall') return '目標格不可建造。'
  const distance = Math.abs(base.position.row - position.row) + Math.abs(base.position.column - position.column)
  if (distance > 5) return '目標格超出據點 5 格建造範圍。'
  // 道路不佔格子，可鋪設在已被其他物件佔用的格子上（但不可鋪在牆上）。
  if (!definition.changesTerrain && occupied.some((candidate) => isSamePosition(candidate, position))) return '目標格已被佔用。'
  return null
}
