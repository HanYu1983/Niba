package debug;

import game.GameIds;
import game.IGameMatch;
import game.IJiCeStagingPreviewRow;
import game.IPlayer;
import game.IPlayerMenu;
import game.IPlayerMenuEntry;
import game.IPlayerMenuNode;
import game.ITileEvent;
import game.PlayerMenuKind;

/**
 * 分叉事件：糧秣／略過單段結算；「軍資」改為選將暫存＋預覽（共用 {@link IJiCeStagingPreviewRow}）。
 */
class SimpleLootForkTileEvent implements ITileEvent {
  public var lastResolvedChoice:String = "";

  var _match:IGameMatch;
  var _awaitingSupplyGeneralPick:Bool;

  public function new(match:IGameMatch) {
    _match = match;
    _awaitingSupplyGeneralPick = false;
  }

  public function registryKey():String
    return "fork_loot_v1";

  function buildSupplyStagingRows(actor:IPlayer):Array<IJiCeStagingPreviewRow> {
    var ruler = cast(_match.activeMonarch(), SimpleMonarch);
    var rows:Array<IJiCeStagingPreviewRow> = [];
    for (g in ruler.roster()) {
      var sg = cast(g, SimpleGeneral);
      var desc = "【" + sg.id() + "】領軍補給：預計 +15 兵力";
      rows.push(new SimpleJiCeStagingPreviewRow(sg.id(), desc, 0));
    }
    return rows;
  }

  public function buildPlayerMenu(actor:IPlayer):IPlayerMenu {
    var roots:Array<IPlayerMenuNode> = [
      new SimplePlayerMenuNode(
        "軍資",
        new SimplePlayerMenuEntry(TileEventPick, "事件選項：取軍資（+兵力，須選將）", true, "take_supplies"),
        []
      ),
      new SimplePlayerMenuNode(
        "糧秣",
        new SimplePlayerMenuEntry(TileEventPick, "事件選項：取糧秣（+糧食）", true, "take_grain"),
        []
      ),
      new SimplePlayerMenuNode(
        "略過",
        new SimplePlayerMenuEntry(TileEventPick, "事件選項：什麼都不拿", true, "pass"),
        []),
    ];
    return new SimplePlayerMenu(actor, "evt-" + registryKey(), roots);
  }

  public function resolveChoice(actor:IPlayer, choiceId:String):Void {
    lastResolvedChoice = choiceId;
    var ruler = cast(_match.activeMonarch(), SimpleMonarch);
    switch choiceId {
      case "take_supplies":
        var rows = buildSupplyStagingRows(actor);
        if (rows.length == 0) {
          ruler.grantTroops(15);
          _awaitingSupplyGeneralPick = false;
        } else {
          _awaitingSupplyGeneralPick = true;
          _match.enterTileEventGeneralStaging(this, rows);
        }
      case "take_grain":
        ruler.grantGrain(22);
      case "pass":
      default:
        throw "SimpleLootForkTileEvent.resolveChoice: unknown choiceId " + choiceId;
    }
  }

  public function resolveStagingGeneral(actor:IPlayer, generalId:GeneralId):Void {
    if (!_awaitingSupplyGeneralPick)
      throw "SimpleLootForkTileEvent.resolveStagingGeneral: 未處於軍資選將暫存";
    var ruler = cast(_match.activeMonarch(), SimpleMonarch);
    var ok = false;
    for (g in ruler.roster())
      if (g.id() == generalId)
        ok = true;
    if (!ok)
      throw "SimpleLootForkTileEvent.resolveStagingGeneral: 無此麾下武將 " + generalId;
    ruler.grantTroops(15);
    lastResolvedChoice = "take_supplies:" + generalId;
    _awaitingSupplyGeneralPick = false;
  }
}
