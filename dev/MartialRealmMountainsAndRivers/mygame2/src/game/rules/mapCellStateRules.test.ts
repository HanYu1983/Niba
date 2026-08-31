import { describe, expect, it } from 'vitest'
import { getMapCellRangeState, resolveMapCellAction } from './mapCellStateRules'

describe('mapCellStateRules', () => {
  it('使用曼哈頓距離判定據點範圍', () => {
    expect(getMapCellRangeState(
      { row: 5, column: 5 },
      { row: 5, column: 6 },
      true,
      true,
    ).isBaseInfluence).toBe(true)
    expect(getMapCellRangeState(
      { row: 12, column: 5 },
      { row: 5, column: 6 },
      true,
      true,
    ).isBaseInfluence).toBe(false)
  })

  it('未啟用據點或未知格不顯示影響範圍', () => {
    expect(getMapCellRangeState({ row: 5, column: 5 }, { row: 5, column: 6 }, false, true).isBaseInfluence).toBe(false)
    expect(getMapCellRangeState({ row: 5, column: 5 }, { row: 5, column: 6 }, true, false).isBaseInfluence).toBe(false)
  })

  it('可同時保留據點範圍與移動狀態，移動仍可互動', () => {
    expect(resolveMapCellAction({ position: { row: 1, column: 1 }, visibility: 'visible', movementEnabled: true, attackTargeting: false, firstAidTargeting: false, externalSkillTargeting: false, itemTargeting: false, defenseBuildMode: false, activePlayerId: 'player-1', isReachable: true, canSelectDefensePosition: false })).toEqual({ type: 'move', playerId: 'player-1', position: { row: 1, column: 1 } })
  })

  it('Cell 與 Marker 使用同一套互動結果', () => {
    const baseContext = {
      position: { row: 5, column: 6 },
      visibility: 'visible' as const,
      movementEnabled: false,
      attackTargeting: true,      firstAidTargeting: false,      externalSkillTargeting: false,
      itemTargeting: false,
      defenseBuildMode: false,
      activePlayerId: 'player-1',
      isReachable: true,
      canSelectDefensePosition: false,
      creatureTargetId: 'creature-1',
    }
    expect(resolveMapCellAction(baseContext)).toEqual({ type: 'target-creature', creatureId: 'creature-1' })
    expect(resolveMapCellAction({ ...baseContext, marker: { type: 'creature', id: 'creature-1' } })).toEqual({ type: 'target-creature', creatureId: 'creature-1' })
  })

  it('未探查格子：可移動格仍可移動，但阻擋其他互動', () => {
    // 可移動的高亮格（isReachable）即使未探查也可移動（探索行為）。
    expect(resolveMapCellAction({
      position: { row: 1, column: 1 },
      visibility: 'unexplored',
      movementEnabled: true,
      attackTargeting: false,
      firstAidTargeting: false,
      externalSkillTargeting: false,
      itemTargeting: false,
      defenseBuildMode: false,
      activePlayerId: 'player-1',
      isReachable: true,
      canSelectDefensePosition: false,
    })).toEqual({ type: 'move', playerId: 'player-1', position: { row: 1, column: 1 } })

    // 未探查且不可移動 → 無動作。
    expect(resolveMapCellAction({
      position: { row: 1, column: 1 },
      visibility: 'unexplored',
      movementEnabled: true,
      attackTargeting: false,
      firstAidTargeting: false,
      externalSkillTargeting: false,
      itemTargeting: false,
      defenseBuildMode: false,
      activePlayerId: 'player-1',
      isReachable: false,
      canSelectDefensePosition: false,
    })).toEqual({ type: 'none' })

    // 未探查且不可移動 → 無動作（即使有攻擊/建造/標記情境）。
    expect(resolveMapCellAction({
      position: { row: 1, column: 1 },
      visibility: 'unexplored',
      movementEnabled: true,
      attackTargeting: true,
      firstAidTargeting: false,
      externalSkillTargeting: true,
      itemTargeting: false,
      defenseBuildMode: true,
      activePlayerId: 'player-1',
      isReachable: false,
      canSelectDefensePosition: true,
      creatureTargetId: 'creature-1',
      marker: { type: 'creature', id: 'creature-1' },
    })).toEqual({ type: 'none' })
  })

  it('遊戲結束、阻塞彈窗或 Creature 回合中不可互動', () => {
    const context = { position: { row: 1, column: 1 }, visibility: 'visible' as const, movementEnabled: true, attackTargeting: false, firstAidTargeting: false, externalSkillTargeting: false, itemTargeting: false, defenseBuildMode: false, activePlayerId: 'player-1', isReachable: true, canSelectDefensePosition: true }
    expect(resolveMapCellAction({ ...context, gameOver: true })).toEqual({ type: 'none' })
    expect(resolveMapCellAction({ ...context, blockingModal: true })).toEqual({ type: 'none' })
    expect(resolveMapCellAction({ ...context, creatureTurnInProgress: true })).toEqual({ type: 'none' })
  })
})
