import type { GameState, PlayerAttributes, RunStats } from './types'

/** 建立一組全為 0 的初始 RunStats。 */
export function createEmptyRunStats(): RunStats {
  return {
    creaturesDefeated: 0,
    nestsDestroyed: 0,
    buildingsBuilt: 0,
    buildingsUpgraded: 0,
    buildingsRepaired: 0,
    eventsResolved: 0,
    itemsCollected: 0,
    skillsLearned: 0,
    defenseStructuresBuilt: 0,
    maxNormalAttackDamage: 0,
    maxExternalSkillDamage: 0,
    maxDamageInSingleRound: 0,
    maxLevelReached: 0,
    attributesAtMaxLevel: null,
    moneySpent: 0,
  }
}

/** 取得 state.runStats，若尚未初始化則回傳空統計（不寫回）。 */
export function getRunStats(state: GameState): RunStats {
  return state.runStats ?? createEmptyRunStats()
}

/** 以新的 runStats 覆寫回 state。 */
export function withRunStats(state: GameState, stats: RunStats): GameState {
  return { ...state, runStats: stats }
}

/** 累加一個數值型欄位。 */
export function incrementRunStat(
  state: GameState,
  key: Exclude<keyof RunStats, 'attributesAtMaxLevel'>,
  amount = 1,
): GameState {
  const stats = getRunStats(state)
  return withRunStats(state, {
    ...stats,
    [key]: (stats[key] as number) + amount,
  })
}

/** 以 Math.max 更新一個峰值型欄位。 */
export function bumpRunStatMax(
  state: GameState,
  key: 'maxNormalAttackDamage' | 'maxExternalSkillDamage' | 'maxLevelReached',
  value: number,
): GameState {
  const stats = getRunStats(state)
  return withRunStats(state, {
    ...stats,
    [key]: Math.max(stats[key], value),
  })
}

/**
 * 累加本回合傷害並刷新「單回合最高傷害」峰值。
 *
 * 設計：回合內傷害累積在 GameState.damageDealtThisRound（隨存檔序列化，
 * 讀檔後仍能正確續算），回合開始時歸零；每次造成傷害時累加並以 Math.max
 * 刷新 maxDamageInSingleRound。
 */
export function recordDamageDealt(state: GameState, amount: number): GameState {
  if (amount <= 0) return state
  const dealtThisRound = (state.damageDealtThisRound ?? 0) + amount
  const stats = getRunStats(state)
  return withRunStats({
    ...state,
    damageDealtThisRound: dealtThisRound,
  }, {
    ...stats,
    maxDamageInSingleRound: Math.max(stats.maxDamageInSingleRound, dealtThisRound),
  })
}

/** 累加金錢消費。 */
export function addMoneySpent(state: GameState, amount: number): GameState {
  if (amount <= 0) return state
  const stats = getRunStats(state)
  return withRunStats(state, {
    ...stats,
    moneySpent: stats.moneySpent + amount,
  })
}

/** 當玩家等級刷新峰值時，記錄最高等級與該等級的五維快照。 */
export function recordMaxLevel(state: GameState, level: number, attributes: PlayerAttributes): GameState {
  const stats = getRunStats(state)
  if (level <= stats.maxLevelReached) return state
  return withRunStats(state, {
    ...stats,
    maxLevelReached: level,
    attributesAtMaxLevel: { ...attributes },
  })
}
