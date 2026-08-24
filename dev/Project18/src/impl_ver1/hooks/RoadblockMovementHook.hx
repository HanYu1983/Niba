package impl_ver1.hooks;

import game.GameIds;
import game.IGameMatch;
import game.IJiCeMovementStepHook;
import game.IPlayer;
import game.MovementStepOutcome;
import game.MovementStepOutcome.Continue;
import game.MovementStepOutcome.HaltRemainingSteps;

/**
 * 路障：落地在 {@link #blockedTile} 時，若非 {@link #placerMonarchId} 則止步（敵方阻斷）。
 * 由 {@link RoadblockJiCe} 於結算時建立並 {@link IGameMatch#forceRegisterMovementStepHook}。
 */
class RoadblockMovementHook implements IJiCeMovementStepHook {
  public var blockedTile(default, null):TileIndex;
  public var placerMonarchId(default, null):MonarchId;

  public function new(blockedTile:TileIndex, placerMonarchId:MonarchId) {
    this.blockedTile = blockedTile;
    this.placerMonarchId = placerMonarchId;
  }

  public function onMovementStepAfterLand(
    match:IGameMatch,
    actor:IPlayer,
    stepOrdinal:Int,
    stepsPlanned:Int,
    landedTileIndex:TileIndex
  ):MovementStepOutcome {
    if (landedTileIndex == blockedTile && actor.monarchId() != placerMonarchId)
      return HaltRemainingSteps;
    return Continue;
  }
}
