import type { GameState, RunStats } from './types'
import type { InnerSkill } from './catalogs/innerSkillCatalog'
import { createEmptyRunStats } from './runStats'
import { getInnerSkill, getSkillProgression } from './rules/skillRules'

/** 結局彈窗顯示的本局戰績結算。 */
export type BattleRecord = {
  won: boolean
  reason?: 'all-players-defeated' | 'any-base-destroyed'
  roundsSurvived: number
  playerLevel: number
  prestige: number
  governanceRank: number
  money: number
  remainingBases: number
  remainingNests: number
  stats: RunStats
  /** 人類玩家裝備的內功（供結算畫面顯示內功卡片）。 */
  innerSkill: InnerSkill
  innerSkillLevel: number
}

/** 取得人類玩家（非 AI）；缺省取第一個非 AI 玩家。 */
function getHumanPlayer(state: GameState) {
  const active = state.players.find((player) => player.id === state.activePlayerId && !player.isAI)
  return active ?? state.players.find((player) => !player.isAI) ?? state.players[0]
}

/** 由 GameState 計算本局戰績結算（純讀取，不修改 state）。 */
export function computeBattleRecord(state: GameState): BattleRecord {
  const player = getHumanPlayer(state)
  const innerSkillId = player?.innerSkillId ?? 'tuna-gong'
  const innerSkill = getInnerSkill(innerSkillId)
  return {
    won: Boolean(state.gameWon),
    reason: state.gameOverReason,
    roundsSurvived: state.round,
    playerLevel: player?.level ?? 1,
    prestige: player?.prestige ?? 0,
    governanceRank: player?.governanceRank ?? 1,
    money: player?.money ?? 0,
    remainingBases: state.bases.filter((base) => base.active !== false).length,
    remainingNests: state.creatureNests.length,
    stats: state.runStats ?? createEmptyRunStats(),
    innerSkill,
    innerSkillLevel: player ? getSkillProgression(player, innerSkillId).level : 1,
  }
}
