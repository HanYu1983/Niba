package debug_ver1;

import game.GameIds;
import game.GeneralStat;
import game.IAvoidableTileEvent;
import game.IGameMatch;
import game.IPlayer;
import game.IPlayerMenu;
import game.IPlayerMenuNode;
import game.ITileEvent;
import game.MenuActivation;
import game.PopupPayload;
import game.PlayerMenuKind.TileEventPick;
import impl_ver1.model.PlayerMenu;

/**
 * 負面事件示範：糧倉失火（可規避）。
 * - 效果：損失糧食（可依 match.forceGetPendingTileEventEffectMultiplier 減半/無效）
 * - 規避屬性：政治（Stewardship）
 */
class GranaryFireAvoidableTileEvent implements ITileEvent implements IAvoidableTileEvent {
  final match:IGameMatch;
  final baseLoss:Int;

  public function new(match:IGameMatch, baseLoss:Int) {
    this.match = match;
    this.baseLoss = baseLoss;
  }

  public function registryKey():String
    return "evt_granary_fire";

  public function isNegative():Bool
    return true;

  public function avoidanceStat():GeneralStat
    return Stewardship;

  public function avoidanceBaseRate():Float
    return 0.35;

  public function avoidanceStaminaCost():Int
    return 10;

  public function avoidanceSuccessMultiplier():Float
    return 0.5;

  public function buildPlayerMenu(actor:IPlayer):IPlayerMenu {
    var leaf = match.createPlayerMenuEntry(TileEventPick, "確認：承受損失", true, "accept");
    var roots:Array<IPlayerMenuNode> = [
      match.createPlayerMenuNode("糧倉失火", leaf, ([] : Array<IPlayerMenuNode>)),
    ];
    return new PlayerMenu(actor, "evt-" + registryKey(), roots);
  }

  public function resolveChoice(actor:IPlayer, menuNode:IPlayerMenuNode):Void {
    var leaf = MenuActivation.activatingEntry(menuNode);
    if (leaf.kind() != TileEventPick)
      throw "GranaryFireAvoidableTileEvent.resolveChoice: expected TileEventPick";
    var ruler = cast(match.activeMonarch(), impl_ver1.model.Monarch);
    var mult = match.forceGetPendingTileEventEffectMultiplier();
    var loss = Std.int(Math.round(baseLoss * mult));
    if (loss < 0)
      loss = 0;
    if (loss > 0)
      ruler.reduceGrain(loss);
    match.pushInfoPopup(
      actor.monarchId(),
      "事件：糧倉失火",
      PopupPayload.Plain('損失糧食：${loss}（倍率 ${mult}）'),
      "evt-granary-fire"
    );
  }
}

