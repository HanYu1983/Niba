import type { GameState, PlayerState } from '../types'
import type { AiAction } from '../ai/aiAction'
import { getTerrainStaminaCost } from './playerDerivedRules'

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
  /** 公用指令欄「急救」：復活周圍一格內的死亡玩家，血量恢復至 5。 */
  firstAid: 8,
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

const AVG_MOVEMENT_COST = 2

/**
 * 從 AiAction + GameState 計算體力消耗。validateAiAction 和 V3 search 共用此函數。
 *
 * - move（相鄰格）：getTerrainStaminaCost 精確計算
 * - move（非相鄰格）：manhattan × AVG_MOVEMENT_COST 估算
 * - 其他 action：查 ACTION_STAMINA_COSTS
 */
export function getAiActionStaminaCost(state: GameState, action: AiAction): number {
  switch (action.type) {
    case 'move': {
      const player = state.players.find((p) => p.id === action.actor.id)
      if (!player) return Infinity
      const dist = Math.abs(player.position.row - action.destination.row)
                 + Math.abs(player.position.column - action.destination.column)
      if (dist <= 1) {
        const destCell = state.map.cells.find(
          (c) => c.row === action.destination.row && c.column === action.destination.column,
        )
        if (!destCell) return Infinity
        return getTerrainStaminaCost(destCell.terrain, player)
      }
      return dist * AVG_MOVEMENT_COST
    }
    case 'transport':       return ACTION_STAMINA_COSTS.transport
    case 'attack':        return ACTION_STAMINA_COSTS.attack
    case 'collect':       return action.target.kind === 'item'
                             ? ACTION_STAMINA_COSTS.collectItem
                             : ACTION_STAMINA_COSTS.collectResource
    case 'build':         return ACTION_STAMINA_COSTS.build
    case 'upgrade':       return ACTION_STAMINA_COSTS.upgrade
    case 'defense-build': return ACTION_STAMINA_COSTS.defenseBuild
    case 'buy-item':      return ACTION_STAMINA_COSTS.shop
    case 'use-facility':
      switch (action.facilityType) {
        case 'heal':     return ACTION_STAMINA_COSTS.heal
        case 'mission':  return ACTION_STAMINA_COSTS.mission
        case 'repair':   return ACTION_STAMINA_COSTS.repair
      }
      return 0
    case 'hold':               return 0
    case 'end-turn':           return 0
    case 'allocate-attribute': return 0
    case 'use-item':           return 0
    case 'equip':              return 0
    case 'equip-inner-skill':  return 0
    case 'learn-skill':        return 0
    case 'practice-skill':     return 0
  }
}
