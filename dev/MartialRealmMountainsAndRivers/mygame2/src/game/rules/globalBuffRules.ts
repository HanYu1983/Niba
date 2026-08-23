import type { GameState, GlobalBuff, GlobalBuffKind } from '../types'
import { isBaseActive } from './baseRules'
import { defaultRandomSource, type RandomSource } from './randomRules'

/** 單一 buff 的定義（用於隨機抽取與 UI 展示）。 */
export type GlobalBuffDefinition = {
  kind: GlobalBuffKind
  /** 效果幅度（百分比；round-end-recovery-bonus 為每回合額外回復的氣血/內力百分比）。 */
  magnitude: number
  name: string
  description: string
}

/**
 * 貿易市場隨機賦予的 buff 池。
 * 城市據點數量有限，故允許同類無限疊加（每座市場獨立抽取）。
 */
export const GLOBAL_BUFF_POOL: GlobalBuffDefinition[] = [
  { kind: 'shop-price-reduction', magnitude: 5, name: '商路通達', description: '所有商店購買價格 -5%。' },
  { kind: 'material-income-bonus', magnitude: 5, name: '物資豐饒', description: '資源採集與被動建料收入 +5%。' },
  { kind: 'healing-bonus', magnitude: 5, name: '杏林春暖', description: '醫療室與休整的氣血/內力回復 +5%。' },
  { kind: 'base-defense-reduction', magnitude: 5, name: '城防堅固', description: '據點承受傷害 -5%。' },
  { kind: 'round-end-recovery-bonus', magnitude: 5, name: '養精蓄銳', description: '每回合結束額外回復 5% 氣血與 5% 內力。' },
  { kind: 'skill-experience-bonus', magnitude: 20, name: '悟性天成', description: '功法練習獲得的經驗 +20%。' },
]

export function getGlobalBuffDefinition(kind: GlobalBuffKind): GlobalBuffDefinition {
  return GLOBAL_BUFF_POOL.find((definition) => definition.kind === kind) ?? GLOBAL_BUFF_POOL[0]
}

/**
 * 取得目前生效的全局 buff（來源據點仍活躍者）。
 * 來源據點失活（active === false）時，該 buff 自動失效。
 */
export function getActiveGlobalBuffs(state: GameState): GlobalBuff[] {
  const buffs = state.globalBuffs ?? []
  return buffs.filter((buff) => {
    const sourceBase = state.bases.find((base) => base.id === buff.sourceBaseId)
    return sourceBase ? isBaseActive(sourceBase) : false
  })
}

/** 商店購買價格乘數（shop-price-reduction 相乘，夾底為 0）。 */
export function getGlobalShopPriceMultiplier(state: GameState): number {
  return getActiveGlobalBuffs(state)
    .filter((buff) => buff.kind === 'shop-price-reduction')
    .reduce((multiplier, buff) => multiplier * (1 - buff.magnitude / 100), 1)
}

/** 資源採集/被動建料乘數（material-income-bonus 相乘）。 */
export function getGlobalMaterialMultiplier(state: GameState): number {
  return getActiveGlobalBuffs(state)
    .filter((buff) => buff.kind === 'material-income-bonus')
    .reduce((multiplier, buff) => multiplier * (1 + buff.magnitude / 100), 1)
}

/** 醫療/休整回復乘數（healing-bonus 相乘）。 */
export function getGlobalHealingMultiplier(state: GameState): number {
  return getActiveGlobalBuffs(state)
    .filter((buff) => buff.kind === 'healing-bonus')
    .reduce((multiplier, buff) => multiplier * (1 + buff.magnitude / 100), 1)
}

/** 據點承受傷害乘數（base-defense-reduction 相乘，夾底為 0）。 */
export function getGlobalBaseDefenseMultiplier(state: GameState): number {
  return getActiveGlobalBuffs(state)
    .filter((buff) => buff.kind === 'base-defense-reduction')
    .reduce((multiplier, buff) => multiplier * (1 - buff.magnitude / 100), 1)
}

/** 每回合結束額外回復氣血/內力百分比（round-end-recovery-bonus 加總）。 */
export function getGlobalRoundEndRecoveryPercent(state: GameState): number {
  return getActiveGlobalBuffs(state)
    .filter((buff) => buff.kind === 'round-end-recovery-bonus')
    .reduce((total, buff) => total + buff.magnitude, 0)
}

/** 功法練習經驗乘數（skill-experience-bonus 相乘）。 */
export function getGlobalSkillExperienceMultiplier(state: GameState): number {
  return getActiveGlobalBuffs(state)
    .filter((buff) => buff.kind === 'skill-experience-bonus')
    .reduce((multiplier, buff) => multiplier * (1 + buff.magnitude / 100), 1)
}

/**
 * 計算指定種類 buff 疊加後的總效果百分比（用於 UI 顯示）。
 * - 相乘型（減傷/價格/建料/回復/經驗）：以乘數換算回等效百分比。
 * - 加總型（回合結束回復）：直接加總。
 */
export function getGlobalBuffStackedPercent(buffs: GlobalBuff[], kind: GlobalBuffKind): number {
  const matching = buffs.filter((buff) => buff.kind === kind)
  if (matching.length === 0) return 0
  switch (kind) {
    case 'base-defense-reduction':
    case 'shop-price-reduction': {
      const multiplier = matching.reduce((m, buff) => m * (1 - buff.magnitude / 100), 1)
      return Math.round((1 - multiplier) * 1000) / 10
    }
    case 'material-income-bonus':
    case 'healing-bonus':
    case 'skill-experience-bonus': {
      const multiplier = matching.reduce((m, buff) => m * (1 + buff.magnitude / 100), 1)
      return Math.round((multiplier - 1) * 1000) / 10
    }
    case 'round-end-recovery-bonus':
      return matching.reduce((total, buff) => total + buff.magnitude, 0)
  }
}

/** 依種類分組的全局 buff 顯示條目（用於 UI 疊加顯示）。 */
export type GlobalBuffDisplayEntry = {
  kind: GlobalBuffKind
  name: string
  count: number
  /** 每個來源市場的等級（依 buff 記錄，反映升級狀態）。 */
  levels: number[]
  totalPercent: number
  description: string
}

/** 將 buff 依種類分組，並計算每種的疊加總效果。 */
export function getGlobalBuffDisplayEntries(buffs: GlobalBuff[]): GlobalBuffDisplayEntry[] {
  const byKind = new Map<GlobalBuffKind, GlobalBuff[]>()
  for (const buff of buffs) {
    const list = byKind.get(buff.kind) ?? []
    list.push(buff)
    byKind.set(buff.kind, list)
  }
  return [...byKind.entries()].map(([kind, list]) => {
    const definition = getGlobalBuffDefinition(kind)
    return {
      kind,
      name: definition.name,
      count: list.length,
      levels: list.map((buff) => buff.sourceBuildingLevel ?? 1),
      totalPercent: getGlobalBuffStackedPercent(list, kind),
      description: definition.description,
    }
  })
}

/**
 * 依貿易市場等級計算靈氣 magnitude（每級 = 基底 magnitude）。
 * Lv.1 = 基底值；Lv.N = 基底值 × N。
 */
export function getGlobalBuffMagnitudeForLevel(kind: GlobalBuffKind, level: number): number {
  return getGlobalBuffDefinition(kind).magnitude * Math.max(1, level)
}

/**
 * 為指定據點隨機賦予一項全局 buff（貿易市場建成時呼叫）。
 * 回傳加入 buff 後的新狀態；若隨機來源異常則原樣回傳。
 */
export function grantRandomGlobalBuff(
  state: GameState,
  sourceBaseId: string,
  random: RandomSource = defaultRandomSource,
  sourceBuilding?: { id: string; level?: number },
): GameState {
  if (!state.bases.some((base) => base.id === sourceBaseId)) return state
  const definition = GLOBAL_BUFF_POOL[Math.floor(random() * GLOBAL_BUFF_POOL.length)]
  const level = sourceBuilding?.level ?? 1
  const buff: GlobalBuff = {
    id: `global-buff-${sourceBuilding?.id ?? sourceBaseId}-${state.globalBuffs?.length ?? 0}`,
    kind: definition.kind,
    magnitude: getGlobalBuffMagnitudeForLevel(definition.kind, level),
    sourceBaseId,
    sourceBuildingId: sourceBuilding?.id,
    sourceBuildingLevel: sourceBuilding ? level : undefined,
  }
  return {
    ...state,
    globalBuffs: [...(state.globalBuffs ?? []), buff],
  }
}

/**
 * 升級貿易市場時，提升該市場賦予的全局 buff 的 magnitude。
 * 若找不到對應 buff 則原樣回傳；回傳更新後的新狀態。
 */
export function upgradeGlobalBuffForBuilding(
  state: GameState,
  sourceBuildingId: string,
  newLevel: number,
): GameState {
  if (!state.globalBuffs?.some((buff) => buff.sourceBuildingId === sourceBuildingId)) return state
  const globalBuffs = state.globalBuffs.map((buff) =>
    buff.sourceBuildingId === sourceBuildingId
      ? { ...buff, magnitude: getGlobalBuffMagnitudeForLevel(buff.kind, newLevel), sourceBuildingLevel: newLevel }
      : buff,
  )
  return { ...state, globalBuffs }
}
