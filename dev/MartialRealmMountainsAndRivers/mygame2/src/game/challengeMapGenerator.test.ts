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

  describe('getChallengeBaseCount', () => {
    it('每 100 格 1 座，最少 1 座', () => {
      expect(getChallengeBaseCount(10, 10)).toBe(1)
      expect(getChallengeBaseCount(20, 20)).toBe(4)
      expect(getChallengeBaseCount(30, 30)).toBe(9)
      expect(getChallengeBaseCount(40, 40)).toBe(16)
      expect(getChallengeBaseCount(50, 50)).toBe(25)
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
    it('Lv.1：15×15、2 基地、6 巢、20 遊蕩怪、6 資源點、8 門派', () => {
      const config = generateChallengeMapConfig(1)
      expect(config.rows).toBe(15)
      expect(config.columns).toBe(15)
      expect(config.baseCount).toBe(2)
      expect(config.nestCount).toBe(6)
      expect(config.creatureCount).toBe(20)
      expect(config.resourcePointCount).toBe(6)
      expect(config.itemPointCount).toBe(20)
      expect(config.ruinCount).toBe(20)
      expect(config.explorationEventCount).toBe(20)
      expect(config.sectGateCount).toBe(8)
    })

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

    it('高等級（Lv.100）：尺寸封頂 50', () => {
      const config = generateChallengeMapConfig(100)
      expect(config.rows).toBe(50)
      expect(config.columns).toBe(50)
      expect(config.baseCount).toBe(25)
      expect(config.nestCount).toBe(75)
      expect(config.creatureCount).toBe(250)
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
