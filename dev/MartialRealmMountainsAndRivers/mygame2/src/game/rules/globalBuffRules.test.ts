import { describe, expect, it } from 'vitest'
import {
  GLOBAL_BUFF_POOL,
  getActiveGlobalBuffs,
  getGlobalBaseDefenseMultiplier,
  getGlobalBuffDisplayEntries,
  getGlobalBuffMagnitudeForLevel,
  getGlobalBuffStackedPercent,
  getGlobalHealingMultiplier,
  getGlobalMaterialMultiplier,
  getGlobalShopPriceMultiplier,
  getGlobalSkillExperienceMultiplier,
  getGlobalRoundEndRecoveryPercent,
  grantRandomGlobalBuff,
  upgradeGlobalBuffForBuilding,
} from './globalBuffRules'
import type { GameState, GlobalBuff } from '../types'

function makeBase(id: string, active = true) {
  return {
    id,
    name: id,
    position: { row: 0, column: 0 },
    buildings: [],
    buildingMaterials: 100,
    maxBuildingMaterials: 100,
    health: 100,
    maxHealth: 100,
    active,
  }
}

function makeState(buffs: GlobalBuff[] = [], baseActive = true): GameState {
  return {
    map: { rows: 1, columns: 1, cells: [] },
    bases: [makeBase('base-1', baseActive)],
    players: [],
    creatures: [],
    creatureNests: [],
    resourcePoints: [],
    activePlayerId: 'player-1',
    round: 1,
    creatureActionLogs: [],
    attackPreview: null,
    externalSkillPreview: null,
    creatureTurnInProgress: false,
    operation: { type: 'none' },
    blockingModal: null,
    globalBuffs: buffs,
  } as unknown as GameState
}

describe('全局靈氣 buff', () => {
  it('buff 池包含六種效果', () => {
    expect(GLOBAL_BUFF_POOL).toHaveLength(6)
  })

  it('來源據點活躍時 buff 生效', () => {
    const buffs: GlobalBuff[] = [{ id: 'b1', kind: 'shop-price-reduction', magnitude: 10, sourceBaseId: 'base-1' }]
    expect(getActiveGlobalBuffs(makeState(buffs))).toHaveLength(1)
  })

  it('來源據點失活時 buff 失效', () => {
    const buffs: GlobalBuff[] = [{ id: 'b1', kind: 'shop-price-reduction', magnitude: 10, sourceBaseId: 'base-1' }]
    expect(getActiveGlobalBuffs(makeState(buffs, false))).toHaveLength(0)
  })

  it('商店價格乘數隨同類 buff 無限疊加', () => {
    const buffs: GlobalBuff[] = [
      { id: 'b1', kind: 'shop-price-reduction', magnitude: 10, sourceBaseId: 'base-1' },
      { id: 'b2', kind: 'shop-price-reduction', magnitude: 10, sourceBaseId: 'base-1' },
    ]
    expect(getGlobalShopPriceMultiplier(makeState(buffs))).toBeCloseTo(0.81)
  })

  it('建料乘數隨同類 buff 無限疊加', () => {
    const buffs: GlobalBuff[] = [
      { id: 'b1', kind: 'material-income-bonus', magnitude: 10, sourceBaseId: 'base-1' },
      { id: 'b2', kind: 'material-income-bonus', magnitude: 10, sourceBaseId: 'base-1' },
    ]
    expect(getGlobalMaterialMultiplier(makeState(buffs))).toBeCloseTo(1.21)
  })

  it('回復乘數隨同類 buff 無限疊加', () => {
    const buffs: GlobalBuff[] = [
      { id: 'b1', kind: 'healing-bonus', magnitude: 10, sourceBaseId: 'base-1' },
      { id: 'b2', kind: 'healing-bonus', magnitude: 10, sourceBaseId: 'base-1' },
    ]
    expect(getGlobalHealingMultiplier(makeState(buffs))).toBeCloseTo(1.21)
  })

  it('據點減傷乘數隨同類 buff 無限疊加', () => {
    const buffs: GlobalBuff[] = [
      { id: 'b1', kind: 'base-defense-reduction', magnitude: 10, sourceBaseId: 'base-1' },
      { id: 'b2', kind: 'base-defense-reduction', magnitude: 10, sourceBaseId: 'base-1' },
    ]
    expect(getGlobalBaseDefenseMultiplier(makeState(buffs))).toBeCloseTo(0.81)
  })

  it('回合結束回復為同類 buff 加總百分比', () => {
    const buffs: GlobalBuff[] = [
      { id: 'b1', kind: 'round-end-recovery-bonus', magnitude: 5, sourceBaseId: 'base-1' },
      { id: 'b2', kind: 'round-end-recovery-bonus', magnitude: 5, sourceBaseId: 'base-1' },
    ]
    expect(getGlobalRoundEndRecoveryPercent(makeState(buffs))).toBe(10)
  })

  it('功法經驗乘數隨同類 buff 無限疊加', () => {
    const buffs: GlobalBuff[] = [
      { id: 'b1', kind: 'skill-experience-bonus', magnitude: 10, sourceBaseId: 'base-1' },
      { id: 'b2', kind: 'skill-experience-bonus', magnitude: 10, sourceBaseId: 'base-1' },
    ]
    expect(getGlobalSkillExperienceMultiplier(makeState(buffs))).toBeCloseTo(1.21)
  })

  it('隨機賦予會加入一項 buff 並綁定來源據點', () => {
    const state = makeState()
    const next = grantRandomGlobalBuff(state, 'base-1', () => 0)
    expect(next.globalBuffs).toHaveLength(1)
    expect(next.globalBuffs?.[0].sourceBaseId).toBe('base-1')
    expect(next.globalBuffs?.[0].kind).toBe(GLOBAL_BUFF_POOL[0].kind)
  })

  it('來源據點不存在時不賦予 buff', () => {
    const state = makeState()
    const next = grantRandomGlobalBuff(state, 'missing', () => 0)
    expect(next.globalBuffs).toEqual([])
  })

  it('疊加總效果：減傷型以乘數換算等效百分比', () => {
    const buffs: GlobalBuff[] = [
      { id: 'b1', kind: 'base-defense-reduction', magnitude: 2, sourceBaseId: 'base-1' },
      { id: 'b2', kind: 'base-defense-reduction', magnitude: 2, sourceBaseId: 'base-1' },
    ]
    // 0.98 * 0.98 = 0.9604 → 等效減傷 3.96%
    expect(getGlobalBuffStackedPercent(buffs, 'base-defense-reduction')).toBe(4)
  })

  it('疊加總百分比：單層減傷為 2%', () => {
    const buffs: GlobalBuff[] = [
      { id: 'b1', kind: 'base-defense-reduction', magnitude: 2, sourceBaseId: 'base-1' },
    ]
    expect(getGlobalBuffStackedPercent(buffs, 'base-defense-reduction')).toBe(2)
  })

  it('疊加總百分比：加總型直接相加', () => {
    const buffs: GlobalBuff[] = [
      { id: 'b1', kind: 'round-end-recovery-bonus', magnitude: 1, sourceBaseId: 'base-1' },
      { id: 'b2', kind: 'round-end-recovery-bonus', magnitude: 1, sourceBaseId: 'base-1' },
    ]
    expect(getGlobalBuffStackedPercent(buffs, 'round-end-recovery-bonus')).toBe(2)
  })

  it('顯示條目依種類分組並計算疊加總效果', () => {
    const buffs: GlobalBuff[] = [
      { id: 'b1', kind: 'base-defense-reduction', magnitude: 2, sourceBaseId: 'base-1' },
      { id: 'b2', kind: 'base-defense-reduction', magnitude: 2, sourceBaseId: 'base-1' },
      { id: 'b3', kind: 'shop-price-reduction', magnitude: 2, sourceBaseId: 'base-1' },
    ]
    const entries = getGlobalBuffDisplayEntries(buffs)
    expect(entries).toHaveLength(2)
    const defense = entries.find((entry) => entry.kind === 'base-defense-reduction')
    expect(defense?.count).toBe(2)
    expect(defense?.totalPercent).toBe(4)
    expect(defense?.levels).toEqual([1, 1])
    const shop = entries.find((entry) => entry.kind === 'shop-price-reduction')
    expect(shop?.count).toBe(1)
    expect(shop?.totalPercent).toBe(2)
  })

  it('靈氣 magnitude 隨貿易市場等級提升', () => {
    expect(getGlobalBuffMagnitudeForLevel('base-defense-reduction', 1)).toBe(5)
    expect(getGlobalBuffMagnitudeForLevel('base-defense-reduction', 2)).toBe(10)
    expect(getGlobalBuffMagnitudeForLevel('base-defense-reduction', 6)).toBe(30)
  })

  it('賦予時引用來源建築等級設定 magnitude', () => {
    const state = makeState()
    const next = grantRandomGlobalBuff(state, 'base-1', () => 0, { id: 'trade-1', level: 3 })
    expect(next.globalBuffs?.[0].magnitude).toBe(
      getGlobalBuffMagnitudeForLevel(next.globalBuffs![0].kind, 3),
    )
    expect(next.globalBuffs?.[0].sourceBuildingId).toBe('trade-1')
    expect(next.globalBuffs?.[0].sourceBuildingLevel).toBe(3)
  })

  it('升級來源建築會增強對應 buff 的 magnitude', () => {
    const buffs: GlobalBuff[] = [
      { id: 'g1', kind: 'base-defense-reduction', magnitude: 5, sourceBaseId: 'base-1', sourceBuildingId: 'trade-1' },
    ]
    const state = makeState(buffs)
    const next = upgradeGlobalBuffForBuilding(state, 'trade-1', 2)
    expect(next.globalBuffs?.[0].magnitude).toBe(10)
    expect(next.globalBuffs?.[0].sourceBuildingLevel).toBe(2)
  })

  it('升級非來源建築不影響其他 buff', () => {
    const buffs: GlobalBuff[] = [
      { id: 'g1', kind: 'base-defense-reduction', magnitude: 2, sourceBaseId: 'base-1', sourceBuildingId: 'trade-1' },
    ]
    const state = makeState(buffs)
    const next = upgradeGlobalBuffForBuilding(state, 'trade-other', 5)
    expect(next.globalBuffs?.[0].magnitude).toBe(2)
  })
})
