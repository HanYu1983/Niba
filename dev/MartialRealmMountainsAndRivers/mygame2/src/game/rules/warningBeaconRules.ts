import type { GameState } from '../types'

/**
 * 烽燧臺（warning-beacon）：全局支援設施。
 * - 建造完成的瞬間揭示一次全圖敵軍。
 * - 之後每回合以 50% 機率再次揭示全圖敵軍，直到下回合清空。
 *
 * 揭示機制完全復用「鳴鑼符（reveal-creatures）」欄位 `revealedCreatureCellIds` /
 * `revealedCreatureUntilRound`（見 gameStore.ts 鳴鑼符分支），不需另作視野系統。
 */

export const WARNING_BEACON_REVEAL_CHANCE = 0.5
/** 烽火台一次揭示持續回合數。 */
const WARNING_BEACON_REVEAL_DURATION = 1

/** 計算目前存活敵軍所在的格子 id 清單。 */
function getAliveCreatureCellIds(state: GameState): string[] {
  return state.creatures
    .filter((creature) => creature.health > 0)
    .map((creature) => {
      const cell = state.map.cells.find(
        (candidate) =>
          candidate.row === creature.position.row &&
          candidate.column === creature.position.column,
      )
      return cell?.id
    })
    .filter((cellId): cellId is string => Boolean(cellId))
}

/** 是否存在任何存活的烽燧臺。 */
export function hasActiveWarningBeacon(state: GameState): boolean {
  return (state.defenseStructures ?? []).some(
    (structure) => structure.type === 'warning-beacon' && structure.health > 0,
  )
}

/** 剛建造烽燧臺完成時，立即揭示一次全圖敵軍（不經機率）。 */
export function createImmediateBeaconReveal(state: GameState): { revealedCreatureCellIds: string[]; revealedCreatureUntilRound: number } {
  return {
    revealedCreatureCellIds: getAliveCreatureCellIds(state),
    revealedCreatureUntilRound: state.round + WARNING_BEACON_REVEAL_DURATION,
  }
}

/**
 * 判斷烽火台是否於本回合揭示，並回傳應設定的揭示狀態。
 * 若無烽火台或未觸發，回傳 null。
 */
export function evaluateWarningBeaconReveal(
  state: GameState,
  randomValue = Math.random(),
): { revealedCreatureCellIds: string[]; revealedCreatureUntilRound: number } | null {
  if (!hasActiveWarningBeacon(state)) return null
  if (randomValue >= WARNING_BEACON_REVEAL_CHANCE) return null
  return {
    revealedCreatureCellIds: getAliveCreatureCellIds(state),
    revealedCreatureUntilRound: state.round + WARNING_BEACON_REVEAL_DURATION,
  }
}
