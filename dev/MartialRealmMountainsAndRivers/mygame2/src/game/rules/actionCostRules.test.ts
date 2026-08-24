import { describe, expect, it } from 'vitest'
import { getActionablePlayer } from './actionCostRules'
import type { ActionContinuation, ActionResult, GameState, PlayerState } from '../types'

function makePlayer(overrides: Partial<PlayerState> = {}): PlayerState {
  return {
    id: 'player-1',
    name: '玩家',
    position: { row: 1, column: 1 },
    attributes: { armStrength: 5, constitution: 5, agility: 5, innerEnergy: 5, insight: 5 },
    innerSkillIds: ['tuna-gong'],
    innerSkillId: 'tuna-gong',
    externalSkillIds: [],
    equippedExternalSkillIds: [],
    health: 10,
    maxHealth: 10,
    stamina: 5,
    maxStamina: 5,
    innerPower: 5,
    maxInnerPower: 5,
    prestige: 0,
    money: 0,
    experience: 0,
    inventory: [],
    turnEnded: false,
    ...overrides,
  }
}

function makeState(player: PlayerState, overrides: Partial<GameState> = {}): GameState {
  return {
    map: { rows: 3, columns: 3, cells: [] },
    bases: [],
    defenseStructures: [],
    creatureNests: [],
    resourcePoints: [],
    itemPoints: [],
    explorationEvents: [],
    players: [player],
    creatures: [],
    activePlayerId: player.id,
    round: 1,
    creatureActionLogs: [],
    attackPreview: null,
    externalSkillPreview: null,
    repairPreview: null,
    creatureTurnInProgress: false,
    activeCreatureId: null,
    operation: { type: 'idle' },
    blockingModal: null,
    ...overrides,
  }
}

describe('getActionablePlayer', () => {
  it('回傳當前可行動玩家', () => {
    const player = makePlayer()
    expect(getActionablePlayer(makeState(player), player.id)).toBe(player)
  })

  it('非當前玩家、生物回合、結果視窗或遊戲結束時回傳 null', () => {
    const player = makePlayer()
    const result: ActionResult = { title: '結果', message: '', rewards: [] }
    const continuation: ActionContinuation = { type: 'none' }
    const blockedState = makeState(player, {
      activePlayerId: 'other',
      creatureTurnInProgress: true,
      blockingModal: { type: 'action-result', result, continuation },
      gameOver: true,
      gameWon: true,
    })
    expect(getActionablePlayer(blockedState, player.id)).toBeNull()
  })

  it.each([
    ['死亡玩家', { health: 0 }],
    ['已結束回合玩家', { turnEnded: true }],
  ])('%s 時回傳 null', (_label, playerOverrides) => {
    const player = makePlayer(playerOverrides)
    expect(getActionablePlayer(makeState(player), player.id)).toBeNull()
  })
})
