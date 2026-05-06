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
import impl_ver1.model.Monarch;
import impl_ver1.model.PlayerMenu;

/**
 * 負面事件示範：疫病流行（可規避）。
 * - 效果：全體武將體力 -20，士兵 -120（可依 multiplier 減半/無效）
 * - 規避屬性：智力（Wit）
 */
class EpidemicAvoidableTileEvent implements ITileEvent implements IAvoidableTileEvent {
  final match:IGameMatch;

  public function new(match:IGameMatch) {
    this.match = match;
  }

  public function registryKey():String
    return "evt_epidemic";

  public function isNegative():Bool
    return true;

  public function avoidanceStat():GeneralStat
    return Wit;

  public function avoidanceBaseRate():Float
    return 0.30;

  public function avoidanceStaminaCost():Int
    return 10;

  public function avoidanceSuccessMultiplier():Float
    return 0.0;

  public function buildPlayerMenu(actor:IPlayer):IPlayerMenu {
    var leaf = match.createPlayerMenuEntry(TileEventPick, "確認：承受疫情影響", true, "accept");
    var roots:Array<IPlayerMenuNode> = [
      match.createPlayerMenuNode("疫病流行", leaf, ([] : Array<IPlayerMenuNode>)),
    ];
    return new PlayerMenu(actor, "evt-" + registryKey(), roots);
  }

  public function resolveChoice(actor:IPlayer, menuNode:IPlayerMenuNode):Void {
    var leaf = MenuActivation.activatingEntry(menuNode);
    if (leaf.kind() != TileEventPick)
      throw "EpidemicAvoidableTileEvent.resolveChoice: expected TileEventPick";
    var ruler:Monarch = cast match.activeMonarch();
    var mult = match.forceGetPendingTileEventEffectMultiplier();
    var staminaLoss = Std.int(Math.round(20 * mult));
    var troopLoss = Std.int(Math.round(120 * mult));
    if (staminaLoss < 0)
      staminaLoss = 0;
    if (troopLoss < 0)
      troopLoss = 0;

    for (x in ruler.roster()) {
      var g:impl_ver1.model.General = cast x;
      var prev = g.stamina();
      g.setStamina(game.Balance.clampInt(prev - staminaLoss, 0, 100));
    }
    if (troopLoss > 0)
      ruler.reduceTroops(troopLoss);
    match.pushInfoPopup(
      actor.monarchId(),
      "事件：疫病流行",
      PopupPayload.Plain('武將體力 -${staminaLoss}（全體）\n士兵 -${troopLoss}\n倍率 ${mult}'),
      "evt-epidemic"
    );
  }
}

