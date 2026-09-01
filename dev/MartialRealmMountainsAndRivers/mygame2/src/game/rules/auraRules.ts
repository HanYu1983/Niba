import type { BaseState, CreatureNestState, GameState, PlayerState, Position } from '../types'
import type { SchoolElement } from './skillRules'
import { isBaseActive } from './baseRules'
import { BUILDING_TYPES } from '../catalogs/buildingCatalog'

/**
 * 區域靈氣抽象系統（Regional Aura System）
 *
 * 由地圖上具位置的實體（敵方巢穴、玩家據點建築）向四周散發、對範圍內單位
 * 產生持續性影響的「影響力場」框架。巢穴靈氣（負面）與據點靈氣（正面，如
 * 防衛營回血）共用同一套抽象底層。
 *
 * 設計原則（對齊 `reports/system/regional-spiritual-energy-design.md`）：
 * - 元素復用 `SchoolElement`。
 * - 範圍採曼哈頓距離（對齊 `isPlayerWithinBaseVision`）。
 * - 解析時序僅兩種：每回合結束（累積型）與進入即時查詢（被動型）。
 * - 來源失活（巢穴 health === 0、據點 !isBaseActive）→ 靈氣失效。
 */

/** 靈氣效果種類。目前僅保留「累積型」效果（回合結束結算）；被動型效果待接入實際計算後再加入。 */
export type AuraEffectKind =
  | 'damage-over-time' // 每回合掉血（負面，巢穴灼燒/金煞）
  | 'heal-over-time'   // 每回合回血（正面，防衛營）

/** 靈氣效果影響的目標類型。 */
export type AuraTargetType = 'player' | 'creature' | 'all'

/** 單一靈氣效果。 */
export type AuraEffect = {
  kind: AuraEffectKind
  /** 效果幅度（百分比或絕對值）。 */
  magnitude: number
  target: AuraTargetType
}

/** 單一靈氣場（來源向四周的投射）。 */
export type AuraField = {
  sourceId: string
  position: Position
  /** 影響半徑（曼哈頓距離）。 */
  radius: number
  element: SchoolElement
  effects: AuraEffect[]
}

/** 巢穴靈氣預設半徑。 */
export const NEST_AURA_RADIUS = 3

/** 巢穴靈氣每回合掉血比例（依元素）。 */
export const NEST_AURA_DAMAGE_PERCENT: Partial<Record<Exclude<SchoolElement, 'none'>, number>> = {
  fire: 0.05,   // 灼燒：每回合損失最大生命 5%
  metal: 0.03,  // 金煞：每回合損失最大生命 3%
}

/** 依巢穴主導元素建立靈氣場；無屬性巢穴（none / 未指定）不產生靈氣。 */
export function getNestAuraField(nest: CreatureNestState): AuraField | null {
  const element = nest.dominantElement
  if (!element || element === 'none') return null

  const effects: AuraEffect[] = []
  const damagePercent = NEST_AURA_DAMAGE_PERCENT[element]
  if (damagePercent) {
    effects.push({ kind: 'damage-over-time', magnitude: damagePercent, target: 'player' })
  }

  return {
    sourceId: nest.id,
    position: nest.position,
    radius: NEST_AURA_RADIUS,
    element,
    effects,
  }
}

/** 曼哈頓距離判定單位是否在靈氣場內。 */
export function isWithinAura(field: AuraField, position: Position): boolean {
  const distance = Math.abs(field.position.row - position.row) + Math.abs(field.position.column - position.column)
  return distance <= field.radius
}

/** 收集場上所有「活躍來源」的靈氣場（巢穴 + 防衛營）。 */
export function getActiveAuraFields(state: GameState): AuraField[] {
  const fields: AuraField[] = []

  // 巢穴靈氣：僅活躍巢穴（health > 0）產生。
  for (const nest of state.creatureNests) {
    if (nest.health <= 0) continue
    const field = getNestAuraField(nest)
    if (field) fields.push(field)
  }

  // 據點靈氣：防衛營產生「庇護靈氣」（每回合回血），僅活躍據點產生。
  for (const base of state.bases) {
    if (!isBaseActive(base)) continue
    const barracksRecovery = base.buildings
      .filter((building) => building.type === BUILDING_TYPES.BARRACKS)
      .reduce((total, building) => total + (building.healthBonus ?? 0), 0)
    if (barracksRecovery <= 0) continue
    fields.push({
      sourceId: base.id,
      position: base.position,
      radius: 5, // 對齊 BASE_INFLUENCE_RANGE
      element: 'none',
      effects: [{ kind: 'heal-over-time', magnitude: barracksRecovery, target: 'player' }],
    })
  }

  return fields
}

/** 取得單位所在位置受到的所有靈氣效果（依目標類型過濾）。 */
export function getAuraEffectsAt(
  state: GameState,
  position: Position,
  targetType: AuraTargetType,
): AuraEffect[] {
  const effects: AuraEffect[] = []
  for (const field of getActiveAuraFields(state)) {
    if (!isWithinAura(field, position)) continue
    for (const effect of field.effects) {
      if (effect.target === 'all' || effect.target === targetType) {
        effects.push(effect)
      }
    }
  }
  return effects
}

/** 單一靈氣效果的 UI 顯示條目（含來源名稱與可讀描述）。 */
export type AuraDisplayEntry = {
  sourceId: string
  sourceName: string
  element: SchoolElement
  kind: AuraEffectKind
  magnitude: number
  /** 可讀描述，例如「每回合損失最大生命 5%」。 */
  description: string
}

/** 將靈氣效果種類格式化為可讀描述。 */
export function formatAuraEffect(kind: AuraEffectKind, magnitude: number): string {
  switch (kind) {
    case 'damage-over-time':
      return `每回合損失最大生命 ${Math.round(magnitude * 100)}%`
    case 'heal-over-time':
      return `每回合回復 ${magnitude} 氣血`
  }
}

/** 取得單位所在位置的所有靈氣場（含來源名稱），供 UI 顯示。 */
export function getAuraDisplayEntries(
  state: GameState,
  position: Position,
  targetType: AuraTargetType,
): AuraDisplayEntry[] {
  const entries: AuraDisplayEntry[] = []
  for (const field of getActiveAuraFields(state)) {
    if (!isWithinAura(field, position)) continue
    const sourceName = getAuraSourceName(state, field.sourceId)
    for (const effect of field.effects) {
      if (effect.target !== 'all' && effect.target !== targetType) continue
      entries.push({
        sourceId: field.sourceId,
        sourceName,
        element: field.element,
        kind: effect.kind,
        magnitude: effect.magnitude,
        description: formatAuraEffect(effect.kind, effect.magnitude),
      })
    }
  }
  return entries
}

/** 依來源 id 取得靈氣來源名稱（巢穴或據點）。 */
function getAuraSourceName(state: GameState, sourceId: string): string {
  const nest = state.creatureNests.find((candidate) => candidate.id === sourceId)
  if (nest) return nest.name
  const base = state.bases.find((candidate) => candidate.id === sourceId)
  if (base) return `${base.name}·防衛營`
  return sourceId
}

/**
 * 回合結束時解析「累積型」靈氣效果（damage-over-time / heal-over-time）。
 * 回傳更新後的玩家陣列。
 *
 * @param bases 使用「回合結算後」的據點（含防衛營回血）。
 * @param creatureNests 使用「回合結算後」的巢穴（含每回合回血後的狀態）。
 */
export function resolveRoundEndAuraEffects(
  bases: BaseState[],
  creatureNests: CreatureNestState[],
  players: PlayerState[],
): PlayerState[] {
  const fields = getActiveAuraFields({ bases, creatureNests } as GameState)
  return players.map((player) => {
    if (player.health <= 0) return player

    let damage = 0
    let regen = 0
    for (const field of fields) {
      if (!isWithinAura(field, player.position)) continue
      for (const effect of field.effects) {
        if (effect.target !== 'player' && effect.target !== 'all') continue
        if (effect.kind === 'damage-over-time') {
          damage += player.maxHealth * effect.magnitude
        } else if (effect.kind === 'heal-over-time') {
          regen += effect.magnitude
        }
      }
    }

    const health = Math.min(player.maxHealth, Math.max(0, player.health - damage + regen))
    return health !== player.health ? { ...player, health } : player
  })
}
