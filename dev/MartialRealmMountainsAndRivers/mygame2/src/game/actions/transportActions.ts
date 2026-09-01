import type { ActionOutcome, GameState } from '../types'
import { updatePlayerVisibility } from '../rules/visibilityRules'
import { canTransportPlayer, getTransportLandingPosition, resolveTransportTarget, WAYSTATION_TRANSPORT_COST } from '../rules/transportRules'

export function transportPlayerAction(
  state: GameState,
  playerId: string,
  targetId: string,
): { state: GameState; result: ActionOutcome } {
  const validation = canTransportPlayer(state, playerId, targetId)
  if (!validation.ok) return { state, result: { ok: false, reason: validation.reason ?? '傳送失敗。' } }

  const target = resolveTransportTarget(state, targetId)
  if (!target) return { state, result: { ok: false, reason: '目標不存在。' } }

  const landingPosition = getTransportLandingPosition(state, target, playerId)
  if (!landingPosition) return { state, result: { ok: false, reason: '目標周遭沒有可供降落的空地。' } }

  const cost = validation.cost ?? WAYSTATION_TRANSPORT_COST
  const nextState = {
    ...state,
    players: state.players.map((player) => player.id === playerId
      ? { ...player, position: landingPosition, money: player.money - cost }
      : player),
  }

  return {
    state: { ...nextState, visibility: updatePlayerVisibility(nextState, playerId) },
    result: { ok: true },
  }
}
