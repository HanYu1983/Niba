package game;

import game.GameIds;

/**
 * 計策／場地效果若需在「移動逐步前進」時介入，實作此介面並由賽局 {@link IGameMatch#forceRegisterMovementStepHook} 登錄。
 *
 * @param stepOrdinal 本步為本次 Move 的第幾步（自 1 起，對應「已走的步數」）。
 * @param stepsPlanned 本次 Move 計畫總步數（現為常量步幅；日後可改為骰子等）。
 * @param landedTileIndex 本步走完後君主棋子所在環上索引。
 */
interface IJiCeMovementStepHook {
  function onMovementStepAfterLand(
    match:IGameMatch,
    actor:IPlayer,
    stepOrdinal:Int,
    stepsPlanned:Int,
    landedTileIndex:TileIndex
  ):MovementStepOutcome;
}
