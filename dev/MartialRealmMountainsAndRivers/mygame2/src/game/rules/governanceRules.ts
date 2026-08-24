import { type GovernancePolicyId, governancePolicyCatalog } from '../catalogs/governancePolicyCatalog'
import type {
  ConstructionPrestigeSource,
  GovernanceRank,
  PlayerState,
} from '../types'
import {
  CONSTRUCTION_PRESTIGE,
  governanceRankCatalog,
} from '../types'

/**
 * 依累計聲望計算玩家目前的官階。
 * 官階不會因聲望暫時減少而倒退；取滿足條件的最高官階。
 */
export function getGovernanceRank(prestige: number): GovernanceRank {
  const found = [...governanceRankCatalog]
    .filter((rank) => prestige >= rank.requiredPrestige)
    .sort((a, b) => b.rank - a.rank)[0]

  return found ?? governanceRankCatalog[0]
}

export function getGovernanceRankNumber(prestige: number): number {
  return getGovernanceRank(prestige).rank
}

export function getGovernanceRankName(prestige: number): string {
  return getGovernanceRank(prestige).name
}

/** 若聲望跨越官階門檻，回傳官階升級訊息；否則回傳 null。 */
export function getGovernanceRankUpMessage(beforePrestige: number, afterPrestige: number): string | null {
  if (afterPrestige <= beforePrestige) return null
  const beforeRank = getGovernanceRank(beforePrestige).rank
  const afterRank = getGovernanceRank(afterPrestige).rank
  if (afterRank <= beforeRank) return null
  return `🎉 官階升級！由「${getGovernanceRankName(beforePrestige)}」晉升為「${getGovernanceRankName(afterPrestige)}」。`
}

/** 回傳下一官階所需的累計聲望；若已達最高官階則回傳 null。 */
export function getNextGovernanceRequirement(rank: number): number | null {
  const next = governanceRankCatalog.find((candidate) => candidate.rank === rank + 1)
  return next ? next.requiredPrestige : null
}

export function getMaxBuildingLevelForPlayer(player: PlayerState): number {
  return getGovernanceRank(player.prestige).maxBuildingLevel
}

export function getPolicyDefinition(policyId: GovernancePolicyId) {
  return governancePolicyCatalog.find((policy) => policy.id === policyId)
}

export function getAvailablePolicyIds(player: PlayerState): GovernancePolicyId[] {
  // 第一版：所有玩家一律可使用基本政策，並隨官階解鎖其餘政策。
  const rank = getGovernanceRank(player.prestige).rank
  const policies: GovernancePolicyId[] = ['basic']

  if (rank >= 2) policies.push('civilian')
  if (rank >= 3) policies.push('military')
  if (rank >= 4) policies.push('economic')

  return policies
}

export function getUnlockedPolicyIds(player: PlayerState): GovernancePolicyId[] {
  return player.unlockedPolicyIds ?? ['basic']
}

export function isPolicyUnlocked(player: PlayerState, policyId: GovernancePolicyId): boolean {
  return getAvailablePolicyIds(player).includes(policyId)
}

/**
 * 增加玩家聲望，並同步更新官階與已解鎖政策。
 * 官階提升只會向前，不會因聲望暫時減少而倒退。
 */
export function applyPrestigeGain(player: PlayerState, amount: number): PlayerState {
  if (amount <= 0) return player

  const prestige = player.prestige + amount
  const rank = getGovernanceRank(prestige).rank
  const unlockedPolicyIds = getUnlockedPolicyIds(player)

  for (const policyId of getAvailablePolicyIds({ ...player, prestige })) {
    if (!unlockedPolicyIds.includes(policyId)) {
      unlockedPolicyIds.push(policyId)
    }
  }

  return {
    ...player,
    prestige,
    governanceRank: rank,
    unlockedPolicyIds,
  }
}

/** 依建設聲望來源發放固定聲望；預覽、取消或失敗操作不應呼叫此函式。 */
export function applyConstructionPrestige(
  player: PlayerState,
  source: ConstructionPrestigeSource,
): PlayerState {
  return applyPrestigeGain(player, CONSTRUCTION_PRESTIGE[source])
}

export function getConstructionPrestigeAmount(source: ConstructionPrestigeSource): number {
  return CONSTRUCTION_PRESTIGE[source]
}
