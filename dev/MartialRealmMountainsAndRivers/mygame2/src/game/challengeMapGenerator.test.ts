import { describe, expect, it } from 'vitest'
import {
  CHALLENGE_MAX_SIZE,
  CHALLENGE_MIN_SIZE,
  generateChallengeMapConfig,
  getChallengeBaseCount,
  getChallengeMapSize,
  getChallengeTerrainWeights,
} from './challengeMapGenerator'

describe('challengeMapGenerator', () => {
  describe('getChallengeMapSize', () => {
    it('Lv.1 為 15×15，每 2 級 +2，Lv.36+ 封頂 50', () => {
      expect(getChallengeMapSize(1)).toBe(15)
      expect(getChallengeMapSize(2)).toBe(17)
      expect(getChallengeMapSize(10)).toBe(25)
      expect(getChallengeMapSize(20)).toBe(35)
      expect(getChallengeMapSize(30)).toBe(45)
      expect(getChallengeMapSize(36)).toBe(CHALLENGE_MAX_SIZE)
      expect(getChallengeMapSize(100)).toBe(CHALLENGE_MAX_SIZE)
    })

    it('非法等級（<1）視為 1', () => {
      expect(getChallengeMapSize(0)).toBe(CHALLENGE_MIN_SIZE)
      expect(getChallengeMapSize(-5)).toBe(CHALLENGE_MIN_SIZE)
    })
  })

  describe('getChallengeTerrainWeights', () => {
    it('五種地形權重皆落在 [10, 80] 區間', () => {
      for (let i = 0; i < 50; i++) {
        const weights = getChallengeTerrainWeights()
        for (const value of Object.values(weights)) {
          expect(value).toBeGreaterThanOrEqual(10)
          expect(value).toBeLessThanOrEqual(80)
          expect(Number.isInteger(value)).toBe(true)
        }
      }
    })
  })

  describe('generateChallengeMapConfig', () => {

    it('固定參數：玩家 1、AI 0、觸發機率 0.05、巢穴回血 0.01', () => {
      const config = generateChallengeMapConfig(10)
      expect(config.playerCount).toBe(1)
      expect(config.aiPlayerCount).toBe(0)
      expect(config.explorationTriggerChance).toBe(0.05)
      expect(config.nestHealthRegenPercent).toBe(0.01)
    })

    it('seed 每次重抽（兩次生成不同 seed）', () => {
      const a = generateChallengeMapConfig(5)
      const b = generateChallengeMapConfig(5)
      expect(a.seed).not.toBe(b.seed)
    })

    it('地形權重皆在 [10, 80] 區間', () => {
      const config = generateChallengeMapConfig(3)
      for (const value of Object.values(config.terrainWeights ?? {})) {
        expect(value).toBeGreaterThanOrEqual(10)
        expect(value).toBeLessThanOrEqual(80)
      }
    })
  })
})
