package debug_ver1;

import game.GameIds;
import game.IJiCeStagingPreviewRow;
import game.IPlayer;
import game.IPlayerMenu;
import game.IPlayerMenuEntry;
import game.IPlayerMenuNode;
import game.ITileEvent;
import game.PlayerMenuKind.TileEventPick;
import impl_ver1.GameMatch;
import impl_ver1.General;
import impl_ver1.JiCeStagingPreviewRow;
import impl_ver1.Monarch;
import impl_ver1.PlayerMenu;

/**
 * impl_ver1 分叉事件：糧秣／略過仍為單段；「軍資」改為選將暫存＋預覽（對齊計策 staging 模型）。
 */
class RingLootForkTileEvent implements ITileEvent {
  public var lastResolvedChoice:String = "";

  var _match:GameMatch;
  var _awaitingSupplyGeneralPick:Bool;

  public function new(match:GameMatch) {
    _match = match;
    _awaitingSupplyGeneralPick = false;
  }

  public function registryKey():String
    return "fork_loot_ring_evt";

  function buildSupplyStagingRows(actor:IPlayer):Array<IJiCeStagingPreviewRow> {
    var ruler = cast(_match.activeMonarch(), Monarch);
    var rows:Array<IJiCeStagingPreviewRow> = [];
    for (g in ruler.roster()) {
      var sg = cast(g, General);
      var desc = "【" + sg.id() + "】領軍補給：預計 +15 兵力（predictedTroopLoss 事件語意填 0）";
      rows.push(new JiCeStagingPreviewRow(sg.id(), desc, 0));
    }
    return rows;
  }

  public function buildPlayerMenu(actor:IPlayer):IPlayerMenu {
    var roots:Array<IPlayerMenuNode> = [
      _match.createPlayerMenuNode(
        "軍資",
        _match.createPlayerMenuEntry(TileEventPick, "事件選項：取軍資（+兵力，須選將）", true, "take_supplies"),
        ([] : Array<IPlayerMenuNode>)
      ),
      _match.createPlayerMenuNode(
        "糧秣",
        _match.createPlayerMenuEntry(TileEventPick, "事件選項：取糧秣（+糧食）", true, "take_grain"),
        ([] : Array<IPlayerMenuNode>)
      ),
      _match.createPlayerMenuNode(
        "略過",
        _match.createPlayerMenuEntry(TileEventPick, "事件選項：什麼都不拿", true, "pass"),
        ([] : Array<IPlayerMenuNode>)
      ),
    ];
    return new PlayerMenu(actor, "evt-" + registryKey(), roots);
  }

  public function resolveChoice(actor:IPlayer, choiceId:String):Void {
    lastResolvedChoice = choiceId;
    var ruler = cast(_match.activeMonarch(), Monarch);
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
        throw "RingLootForkTileEvent.resolveChoice: unknown choiceId " + choiceId;
    }
  }

  public function resolveStagingGeneral(actor:IPlayer, generalId:GeneralId):Void {
    if (!_awaitingSupplyGeneralPick)
      throw "RingLootForkTileEvent.resolveStagingGeneral: 未處於軍資選將暫存";
    var ruler = cast(_match.activeMonarch(), Monarch);
    var ok = false;
    for (g in ruler.roster())
      if (g.id() == generalId)
        ok = true;
    if (!ok)
      throw "RingLootForkTileEvent.resolveStagingGeneral: 無此麾下武將 " + generalId;
    ruler.grantTroops(15);
    lastResolvedChoice = "take_supplies:" + generalId;
    _awaitingSupplyGeneralPick = false;
  }
}
