import type { GameState, PlayerAttributes, RunStats } from './types'
import type { InnerSkill } from './catalogs/innerSkillCatalog'
import { createEmptyRunStats } from './runStats'
import { getInnerSkill, getSkillProgression } from './rules/skillRules'

/** 單一玩家的結局戰績。 */
export type PlayerBattleRecord = {
  id: string
  name: string
  level: number
  prestige: number
  governanceRank: number
  money: number
  /** 該玩家裝備的內功（供結算畫面顯示內功卡片）。 */
  innerSkill: InnerSkill
  innerSkillLevel: number
  /** 該玩家局末五維。 */
  attributes: PlayerAttributes
}

/** 結局彈窗顯示的本局戰績結算。 */
export type BattleRecord = {
  won: boolean
  reason?: 'all-players-defeated' | 'any-base-destroyed'
  roundsSurvived: number
  remainingBases: number
  remainingNests: number
  stats: RunStats
  /** 各人類玩家的獨立戰績（結局畫面分開顯示）。 */
  players: PlayerBattleRecord[]
  /** 第一個（或當前）人類玩家的戰績（向後相容的單一玩家欄位）。 */
  playerLevel: number
  prestige: number
  governanceRank: number
  money: number
  /** 第一個（或當前）人類玩家裝備的內功。 */
  innerSkill: InnerSkill
  innerSkillLevel: number
}

/** 由單一玩家建立其結局戰績。 */
function toPlayerRecord(player: GameState['players'][number]): PlayerBattleRecord {
  const innerSkillId = player?.innerSkillId ?? 'tuna-gong'
  const innerSkill = getInnerSkill(innerSkillId)
  return {
    id: player.id,
    name: player.name,
    level: player.level ?? 1,
    prestige: player.prestige ?? 0,
    governanceRank: player.governanceRank ?? 1,
    money: player.money ?? 0,
    innerSkill,
    innerSkillLevel: player ? getSkillProgression(player, innerSkillId).level : 1,
    attributes: player.attributes,
  }
}

/** 由 GameState 計算本局戰績結算（純讀取，不修改 state）。 */
export function computeBattleRecord(state: GameState): BattleRecord {
  const humanPlayers = state.players.filter((player) => !player.isAI)
  const players = humanPlayers.length > 0 ? humanPlayers.map(toPlayerRecord) : [toPlayerRecord(state.players[0])]
  const primary = players[0]
  return {
    won: Boolean(state.gameWon),
    reason: state.gameOverReason,
    roundsSurvived: state.round,
    remainingBases: state.bases.filter((base) => base.active !== false).length,
    remainingNests: state.creatureNests.length,
    stats: state.runStats ?? createEmptyRunStats(),
    players,
    playerLevel: primary.level,
    prestige: primary.prestige,
    governanceRank: primary.governanceRank,
    money: primary.money,
    innerSkill: primary.innerSkill,
    innerSkillLevel: primary.innerSkillLevel,
  }
}
