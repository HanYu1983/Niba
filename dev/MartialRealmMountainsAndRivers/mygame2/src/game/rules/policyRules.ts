import type { GovernancePolicyId } from '../catalogs/governancePolicyCatalog'
import type {
  BaseState,
  GameState,
  PlayerState,
} from '../types'
import { getAvailablePolicyIds, getPolicyDefinition } from './governanceRules'
import { getGlobalShopPriceMultiplier, getGlobalMaterialMultiplier, getGlobalBaseDefenseMultiplier } from './globalBuffRules'

/** 據點政策效果倍率。 */

/** 經濟政策：商店購買支出降低的百分比。 */
export const ECONOMIC_COST_DISCOUNT = 0.05

/** 民生政策：資源點採集與被動建料收入增加的百分比。 */
export const CIVILIAN_MATERIAL_BONUS = 0.05

/** 軍事政策：據點承受傷害降低的百分比。 */
export const MILITARY_DEFENSE_REDUCTION = 0.05

/** 政策切換冷卻回合數：切換後需等待此回合數才能再次切換。 */
export const POLICY_SWITCH_COOLDOWN = 3

export function getActivePolicyId(base: BaseState): GovernancePolicyId {
  return base.activePolicyId ?? 'basic'
}

export function hasActivePolicy(base: BaseState, policyId: GovernancePolicyId): boolean {
  return getActivePolicyId(base) === policyId
}

export function getPolicyName(policyId: GovernancePolicyId): string {
  return getPolicyDefinition(policyId)?.name ?? '基本政策'
}

/** 依據點政策調整金錢支出；目前用於商店、修理與驛站傳送。 */
export function getEffectiveMoneyCost(base: BaseState, cost: number, state?: GameState): number {
  const economic = hasActivePolicy(base, 'economic')
  const global = state ? getGlobalShopPriceMultiplier(state) : 1
  const result = cost * (economic ? 1 - ECONOMIC_COST_DISCOUNT : 1) * global
  return Math.max(0, Math.round(result))
}

/** 依據點政策調整資源點採集獲得的建料。 */
export function getEffectiveMaterialGain(base: BaseState, materialIncome: number, state?: GameState): number {
  const civilian = hasActivePolicy(base, 'civilian')
  const global = state ? getGlobalMaterialMultiplier(state) : 1
  const raw = materialIncome * (civilian ? 1 + CIVILIAN_MATERIAL_BONUS : 1) * global
  // 僅於有加成時才進位，避免破壞無加成時的精確小數值。
  return civilian || global !== 1 ? Math.round(raw) : raw
}

/** 依據點政策調整回合被動建料收入。 */
export function getEffectivePassiveMaterialIncome(base: BaseState, income: number, state?: GameState): number {
  const civilian = hasActivePolicy(base, 'civilian')
  const global = state ? getGlobalMaterialMultiplier(state) : 1
  const raw = income * (civilian ? 1 + CIVILIAN_MATERIAL_BONUS : 1) * global
  // 僅當有加成生效時才進位，保留無加成時的精確小數（如被動 2.5）。
  return civilian || global !== 1 ? Math.round(raw) : raw
}

/** 依據點政策調整據點承受的傷害。 */
export function getEffectiveIncomingDamage(base: BaseState, damage: number, state?: GameState): number {
  const military = hasActivePolicy(base, 'military')
  const global = state ? getGlobalBaseDefenseMultiplier(state) : 1
  const raw = damage * (military ? 1 - MILITARY_DEFENSE_REDUCTION : 1) * global
  return Math.max(0, Math.round(raw))
}

/** 判斷玩家是否可以切換指定據點的政策。 */
export function canSwitchPolicy(
  player: PlayerState,
  base: BaseState,
  policyId: GovernancePolicyId,
  currentRound?: number,
): { ok: boolean; reason?: string } {
  const policy = getPolicyDefinition(policyId)
  if (!policy) {
    return { ok: false, reason: '未知政策。' }
  }

  // 政策解鎖以官階為準，即時計算，不依賴可能過時的 unlockedPolicyIds 欄位。
  if (!getAvailablePolicyIds(player).includes(policyId)) {
    return { ok: false, reason: '尚未解鎖此政策。' }
  }

  if (getActivePolicyId(base) === policyId) {
    return { ok: false, reason: '據點已啟用此政策。' }
  }

  // 政策切換冷卻：上次切換後需等待固定回合數才能再次切換。
  if (currentRound !== undefined && base.lastPolicySwitchRound !== undefined) {
    const roundsElapsed = currentRound - base.lastPolicySwitchRound
    if (roundsElapsed < POLICY_SWITCH_COOLDOWN) {
      const remaining = POLICY_SWITCH_COOLDOWN - roundsElapsed
      return { ok: false, reason: `政策切換需等待 ${remaining} 回合冷卻。` }
    }
  }

  return { ok: true }
}
