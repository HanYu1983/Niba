/**
 * 挑戰關卡的地圖參數換算（Challenge Map Generator）。
 *
 * 以「闖關等級」為單一輸入，依 reports/system/challenge-mode-design.md §4
 * 的定案公式換算出完整的 GameSettings 地圖參數。
 *
 * 換算原則：
 * - 地圖尺寸：15 + floor(level/2)×2，封頂 50（15×15 → 50×50，Lv.36 封頂）
 * - 基地數：max(1, floor(行×列/100))
 * - 巢穴數：基地數 × 3
 * - 初始遊蕩怪／道具點／廢墟／探索事件：基地數 × 10
 * - 資源點：基地數 × 3
 * - 門派據點：基地數 × 4（可重複，不封頂）
 * - 地形權重：五種地形各自隨機，值域相同 rand(10, 80)
 * - 探索觸發機率：固定 0.05
 * - 巢穴回血：固定 0.01
 * - 玩家數固定 1、AI 玩家固定 0、seed 每次重抽
 */

import type { GameSettings, TerrainWeights } from './types'

/** 地圖尺寸上限（50×50）。 */
export const CHALLENGE_MAX_SIZE = 50
/** 地圖尺寸下限（15×15）。 */
export const CHALLENGE_MIN_SIZE = 15
/** 探索觸發機率（固定值）。 */
export const CHALLENGE_EXPLORATION_TRIGGER_CHANCE = 0.05
/** 巢穴每回合回血比例（固定值）。 */
export const CHALLENGE_NEST_HEALTH_REGEN_PERCENT = 0.01

/** 產生 [min, max] 區間內的隨機整數（含兩端）。 */
function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/** 依闖關等級換算地圖尺寸（方形，15 → 50 封頂）。 */
export function getChallengeMapSize(level: number): number {
  const safeLevel = Math.max(1, Math.floor(level))
  return Math.min(CHALLENGE_MIN_SIZE + Math.floor(safeLevel / 2) * 2, CHALLENGE_MAX_SIZE)
}

/** 依地圖面積換算基地數（每 100 格 1 座，最少 1 座）。 */
export function getChallengeBaseCount(rows: number, columns: number): number {
  return Math.max(1, Math.floor((rows * columns) / 150))
}

/** 產生挑戰關卡的地形權重（五種地形各自隨機，值域相同 rand(10, 80)）。 */
export function getChallengeTerrainWeights(): TerrainWeights {
  return {
    plain: randInt(10, 80),
    forest: randInt(10, 80),
    water: randInt(10, 80),
    mountain: randInt(10, 80),
    desert: randInt(10, 80),
  }
}

/**
 * 依闖關等級換算完整的挑戰關卡地圖設置。
 * @param level 闖關等級（≥1）
 * @returns 可直接餵給地圖生成器的 GameSettings
 */
export function generateChallengeMapConfig(level: number): GameSettings {
  const size = getChallengeMapSize(level)
  const baseCount = getChallengeBaseCount(size, size)
  const creatureCount = baseCount * 10

  return {
    rows: size,
    columns: size,
    baseCount,
    nestCount: baseCount * 3,
    resourcePointCount: baseCount * 3,
    itemPointCount: creatureCount,
    playerCount: 1,
    aiPlayerCount: 0,
    explorationEventCount: creatureCount,
    explorationTriggerChance: CHALLENGE_EXPLORATION_TRIGGER_CHANCE,
    nestHealthRegenPercent: CHALLENGE_NEST_HEALTH_REGEN_PERCENT,
    creatureCount,
    ruinCount: creatureCount,
    sectGateCount: baseCount * 4,
    terrainWeights: getChallengeTerrainWeights(),
    seed: Math.floor(Math.random() * 999999999),
  }
}
