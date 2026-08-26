import type { GameState, PlayerState } from '../types'

export const ACTION_STAMINA_COSTS = {
  attack: 5,
  externalSkill: 0,
  useItem: 0,
  collectResource: 2,
  collectItem: 0,
  mission: 2,
  heal: 2,
  repair: 2,
  shop: 0,
  policy: 2,
  transport: 3,
  build: 3,
  upgrade: 3,
  defenseBuild: 3,
  resourcePointBuild: 10,
  roadBuild: 1,
  /** 公用指令欄「修路」：將玩家所在格改為道路。 */
  buildRoad: 2,
  exploration: 0,
} as const

export function canPlayerPerformAction(
  state: GameState,
  playerId: string,
  staminaCost: number,
): { ok: boolean; reason?: string } {
  const player = state.players.find((candidate) => candidate.id === playerId)
  if (!player) return { ok: false, reason: '玩家不存在。' }
  if (state.activePlayerId !== playerId) return { ok: false, reason: '目前不是玩家回合。' }
  if (state.creatureTurnInProgress) return { ok: false, reason: 'Creature 行動中。' }
  if (state.blockingModal) return { ok: false, reason: '目前有未處理的結果。' }
  if (state.gameOver || state.gameWon) return { ok: false, reason: '遊戲已結束。' }
  if (player.health <= 0) return { ok: false, reason: '玩家已無法行動。' }
  if (player.stamina < staminaCost) return { ok: false, reason: '體力不足。' }
  return { ok: true }
}

export function getActionablePlayer(state: GameState, playerId: string): PlayerState | null {
  const player = state.players.find((candidate) => candidate.id === playerId)
  return player && !player.turnEnded && canPlayerPerformAction(state, playerId, 0).ok ? player : null
}

export function assertPlayerTurn(
  state: GameState,
  player: PlayerState,
): { ok: true } | { ok: false; reason: string } {
  if (state.activePlayerId !== player.id || state.creatureTurnInProgress || player.turnEnded) {
    return { ok: false, reason: '目前無法行動。' }
  }
  return { ok: true }
}

export function spendPlayerStamina(player: PlayerState, cost: number): PlayerState {
  return { ...player, stamina: Math.max(0, player.stamina - cost) }
}
