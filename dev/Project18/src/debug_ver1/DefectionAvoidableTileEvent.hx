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
import impl_ver1.model.General;
import impl_ver1.model.Monarch;
import impl_ver1.model.PlayerMenu;
import impl_ver1.util.Deterministic;

/**
 * 負面事件示範：叛逃事件（可規避）。
 * - 效果：忠誠度最低的武將可能離開（可依 multiplier 降低發生機率）
 * - 規避屬性：統率（Command）
 */
class DefectionAvoidableTileEvent implements ITileEvent implements IAvoidableTileEvent {
  final match:IGameMatch;

  public function new(match:IGameMatch) {
    this.match = match;
  }

  public function registryKey():String
    return "evt_defection";

  public function isNegative():Bool
    return true;

  public function avoidanceStat():GeneralStat
    return Command;

  public function avoidanceBaseRate():Float
    return 0.25;

  public function avoidanceStaminaCost():Int
    return 10;

  public function avoidanceSuccessMultiplier():Float
    return 0.0;

  public function buildPlayerMenu(actor:IPlayer):IPlayerMenu {
    var leaf = match.createPlayerMenuEntry(TileEventPick, "確認：處理叛逃事件", true, "accept");
    var roots:Array<IPlayerMenuNode> = [
      match.createPlayerMenuNode("叛逃事件", leaf, ([] : Array<IPlayerMenuNode>)),
    ];
    return new PlayerMenu(actor, "evt-" + registryKey(), roots);
  }

  public function resolveChoice(actor:IPlayer, menuNode:IPlayerMenuNode):Void {
    var leaf = MenuActivation.activatingEntry(menuNode);
    if (leaf.kind() != TileEventPick)
      throw "DefectionAvoidableTileEvent.resolveChoice: expected TileEventPick";

    var ruler:Monarch = cast match.activeMonarch();
    if (ruler.roster().length == 0) {
      match.pushInfoPopup(actor.monarchId(), "事件：叛逃事件", PopupPayload.Plain("（無麾下武將，事件略過）"), "evt-defection");
      return;
    }

    // 找忠誠最低者（同忠誠則取第一個）
    var picked:General = cast ruler.roster()[0];
    for (x in ruler.roster()) {
      var g:General = cast x;
      if (g.loyalty() < picked.loyalty())
        picked = g;
    }

    var mult = match.forceGetPendingTileEventEffectMultiplier();
    if (mult < 0)
      mult = 0;
    if (mult > 1)
      mult = 1;

    // 基礎叛逃機率 70%，乘上 multiplier（0.0 → 不會叛逃）
    var rate = 0.70 * mult;
    var seed = 'defection|m=${ruler.id()}|g=${picked.id()}|r=${match.roundNumber()}';
    var roll = Deterministic.hash01(seed);
    var left = roll < rate;

    if (left) {
      ruler.removeGeneralById(picked.id());
      match.pushInfoPopup(
        actor.monarchId(),
        "事件：叛逃事件",
        PopupPayload.Plain('武將 ${picked.id()} 叛逃離開（率 ${Std.int(rate * 100)}%｜倍率 ${mult}）'),
        "evt-defection"
      );
    } else {
      match.pushInfoPopup(
        actor.monarchId(),
        "事件：叛逃事件",
        PopupPayload.Plain('叛逃未發生（率 ${Std.int(rate * 100)}%｜倍率 ${mult}）'),
        "evt-defection"
      );
    }
  }
}

