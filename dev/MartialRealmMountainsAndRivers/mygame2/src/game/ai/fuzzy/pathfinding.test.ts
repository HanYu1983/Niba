import { describe, it, expect } from 'vitest'
import { findClosestReachablePosition } from './goalActionMapper'
import type { GameState, PlayerState } from '../../types'

/**
 * 驗證尋路演算法（findClosestReachablePosition）給出的座標是否正確。
 */

function makePlayer(position: { row: number; column: number }, stamina: number): PlayerState {
  return {
    id: 'player-1',
    name: '測試',
    position,
    attributes: { armStrength: 8, constitution: 8, agility: 7, innerEnergy: 5, insight: 7 },
    baseAttributes: { armStrength: 8, constitution: 8, agility: 7, innerEnergy: 5, insight: 7 },
    health: 50,
    maxHealth: 50,
    stamina,
    maxStamina: 20,
    innerPower: 10,
    maxInnerPower: 10,
    prestige: 0,
    money: 0,
    experience: 0,
    level: 1,
    inventory: [],
    equipmentInventory: [],
    equipmentLoadout: { weaponInstanceId: null, armorInstanceId: null, accessoryInstanceId: null },
    innerSkillIds: ['tuna-gong'],
    innerSkillId: 'tuna-gong',
    externalSkillIds: [],
    equippedExternalSkillIds: [],
    turnEnded: false,
    isAI: true,
  }
}

function makeState(player: PlayerState, cells: Array<{ row: number; column: number; terrain: string }>): GameState {
  return {
    round: 1,
    players: [player],
    activePlayerId: player.id,
    map: {
      rows: 5,
      columns: 5,
      cells: cells.map((c) => ({ id: `${c.row}-${c.column}`, row: c.row, column: c.column, terrain: c.terrain as never })),
    },
    bases: [],
    creatures: [],
    creatureNests: [],
    resourcePoints: [],
    itemPoints: [],
    sectGates: [],
    visibility: { exploredCellIds: [], mode: 'fog' },
    creatureActionLogs: [],
    attackPreview: null,
    externalSkillPreview: null,
    creatureTurnInProgress: false,
    activeCreatureId: null,
    operation: { type: 'idle' },
    blockingModal: null,
  }
}

function plainCells(rows: number, columns: number): Array<{ row: number; column: number; terrain: string }> {
  const cells: Array<{ row: number; column: number; terrain: string }> = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      cells.push({ row: r, column: c, terrain: 'plain' })
    }
  }
  return cells
}

describe('尋路演算法座標正確性', () => {
  it('無障礙時，往目標方向靠近一格', () => {
    const player = makePlayer({ row: 0, column: 0 }, 20)
    const state = makeState(player, plainCells(5, 5))
    const dest = findClosestReachablePosition(state, player, { row: 2, column: 0 })
    expect(dest).toEqual({ row: 1, column: 0 })
  })

  it('目標在右方時，往右靠近一格', () => {
    const player = makePlayer({ row: 2, column: 2 }, 20)
    const state = makeState(player, plainCells(5, 5))
    const dest = findClosestReachablePosition(state, player, { row: 2, column: 4 })
    expect(dest).toEqual({ row: 2, column: 3 })
  })

  it('目標在斜角時，往斜角方向靠近一格', () => {
    const player = makePlayer({ row: 0, column: 0 }, 20)
    const state = makeState(player, plainCells(5, 5))
    const dest = findClosestReachablePosition(state, player, { row: 2, column: 2 })
    // 應往 (1,1) 或 (1,0) 或 (0,1) 靠近（任一離目標更近的相鄰格）
    const dist = Math.abs(dest.row - 2) + Math.abs(dest.column - 2)
    expect(dist).toBeLessThan(4) // 比玩家到目標的距離 4 更近
  })

  it('目標被牆擋住時，仍應選出可達且離目標最近的相鄰格', () => {
    // 玩家 (0,0)，目標 (2,0)，中間 (1,0) 是牆
    const player = makePlayer({ row: 0, column: 0 }, 20)
    const cells = plainCells(5, 5).map((c) =>
      c.row === 1 && c.column === 0 ? { ...c, terrain: 'wall' } : c,
    )
    const state = makeState(player, cells)
    const dest = findClosestReachablePosition(state, player, { row: 2, column: 0 })
    // 牆擋住直線，應繞路。玩家 (0,0) 的相鄰可達格是 (0,1)、(1,0 是牆)。
    // 目標 (2,0) 被牆擋住，但可從 (0,1)→(1,1)→(2,1)→(2,0) 繞路。
    // 第一步應往 (0,1)（繞路方向）。
    expect(dest).toEqual({ row: 0, column: 1 })
  })
})
