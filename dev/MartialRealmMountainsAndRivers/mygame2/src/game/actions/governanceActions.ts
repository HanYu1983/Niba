import type {
  ActionExecutionResult,
  ActionOutcome,
  GameState,
  MaterialTransferResult,
} from '../types'
import type { GovernancePolicyId } from '../catalogs/governancePolicyCatalog'
import { canSwitchPolicy as validatePolicySwitch } from '../rules/policyRules'
import { canSwitchRemotePolicy, canTransferMaterials } from '../rules/regionalManagementRules'
import { isBaseActive } from '../rules/baseRules'

export type GovernanceActionResult<T> = {
  state: GameState
  result: T
}

export function switchBasePolicy(
  state: GameState,
  playerId: string,
  baseId: string,
  policyId: GovernancePolicyId,
): GovernanceActionResult<ActionOutcome> {
  const player = state.players.find((candidate) => candidate.id === playerId)
  const base = state.bases.find((candidate) => candidate.id === baseId)
  if (!player || !base || !isBaseActive(base) || state.activePlayerId !== playerId || state.creatureTurnInProgress) {
    return { state, result: { ok: false, reason: '目前無法行動。' } }
  }

  const validation = validatePolicySwitch(player, base, policyId, state.round)
  if (!validation.ok) return { state, result: { ok: false, reason: validation.reason ?? '無法切換政策。' } }

  return {
    state: {
      ...state,
      players: state.players,
      bases: state.bases.map((currentBase) => currentBase.id === baseId
        ? { ...currentBase, activePolicyId: policyId, lastPolicySwitchRound: state.round }
        : currentBase),
    },
    result: { ok: true },
  }
}

export function switchRemoteBasePolicy(
  state: GameState,
  playerId: string,
  targetBaseId: string,
  policyId: GovernancePolicyId,
): GovernanceActionResult<ActionOutcome> {
  const validation = canSwitchRemotePolicy(state, playerId, targetBaseId, policyId)
  if (!validation.ok) return { state, result: { ok: false, reason: validation.reason ?? '遠端政策切換失敗。' } }

  return {
    state: {
      ...state,
      players: state.players,
      bases: state.bases.map((currentBase) => currentBase.id === targetBaseId
        ? { ...currentBase, activePolicyId: policyId, lastPolicySwitchRound: state.round }
        : currentBase),
    },
    result: { ok: true },
  }
}

export function transferBaseMaterials(
  state: GameState,
  playerId: string,
  sourceBaseId: string,
  targetBaseId: string,
  amount: number,
): GovernanceActionResult<ActionExecutionResult<MaterialTransferResult>> {
  const validation = canTransferMaterials(state, playerId, sourceBaseId, targetBaseId, amount)
  if (!validation.ok) {
    return { state, result: { ok: false, reason: validation.reason ?? '建料調度失敗。' } }
  }

  const deliveredAmount = validation.deliveredAmount ?? amount
  return {
    state: {
      ...state,
      bases: state.bases.map((currentBase) => {
        if (currentBase.id === sourceBaseId) {
          return { ...currentBase, buildingMaterials: currentBase.buildingMaterials - amount }
        }
        if (currentBase.id === targetBaseId) {
          return { ...currentBase, buildingMaterials: currentBase.buildingMaterials + deliveredAmount }
        }
        return currentBase
      }),
    },
    result: {
      ok: true,
      data: { deliveredAmount, loss: amount - deliveredAmount },
    },
  }
}
