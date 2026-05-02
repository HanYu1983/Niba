package debug_ver1;

import game.GameIds;
import game.IJiCeStagingPreviewRow;
import game.IPlayer;
import game.IPlayerMenu;
import game.IPlayerMenuNode;
import game.ITileEvent;
import game.IGameMatch;
import game.PlayerMenuKind.TileEventPick;
import impl_ver1.General;
import impl_ver1.JiCeStagingPreviewRow;
import impl_ver1.Monarch;
import impl_ver1.PlayerMenu;

/**
 * 除錯用事件：僅「開箱領賞」一項；若麾下有待選武將則進入與計策共用之選將暫存（JiCePick）。
 * 無武將時直接為君主 +5 兵力（不開武將選單）。
 */
class GeneralChestTileEvent implements ITileEvent {
  public var lastResolvedChoice:String = "";

  var _match:IGameMatch;
  var _awaitingGeneralPick:Bool;

  public function new(match:IGameMatch) {
    _match = match;
    _awaitingGeneralPick = false;
  }

  public function registryKey():String
    return "evt_general_chest";

  inline static var GRANT_PER_GENERAL:Int = 8;
  inline static var GRANT_NO_ROSTER:Int = 5;

  function buildStagingRows(actor:IPlayer):Array<IJiCeStagingPreviewRow> {
    var ruler = cast(_match.activeMonarch(), Monarch);
    var rows:Array<IJiCeStagingPreviewRow> = [];
    for (g in ruler.roster()) {
      var sg = cast(g, General);
      var desc = "【" + sg.id() + "】領賞：君主兵力 +" + GRANT_PER_GENERAL + "（事件暫存，predictedTroopLoss=0）";
      rows.push(new JiCeStagingPreviewRow(sg.id(), desc, 0));
    }
    return rows;
  }

  public function buildPlayerMenu(actor:IPlayer):IPlayerMenu {
    var roots:Array<IPlayerMenuNode> = [
      _match.createPlayerMenuNode(
        "開箱領賞",
        _match.createPlayerMenuEntry(TileEventPick, "事件：為麾下武將領取賞賜（須選將）", true, "claim_reward"),
        ([] : Array<IPlayerMenuNode>)
      ),
    ];
    return new PlayerMenu(actor, "evt-" + registryKey(), roots);
  }

  public function resolveChoice(actor:IPlayer, choiceId:String):Void {
    lastResolvedChoice = choiceId;
    var ruler = cast(_match.activeMonarch(), Monarch);
    switch choiceId {
      case "claim_reward":
        var rows = buildStagingRows(actor);
        if (rows.length == 0) {
          ruler.grantTroops(GRANT_NO_ROSTER);
          lastResolvedChoice = "claim_reward:no_general";
          _awaitingGeneralPick = false;
        } else {
          _awaitingGeneralPick = true;
          _match.enterTileEventGeneralStaging(this, rows);
        }
      default:
        throw "GeneralChestTileEvent.resolveChoice: unknown choiceId " + choiceId;
    }
  }

  public function resolveStagingGeneral(actor:IPlayer, generalId:GeneralId):Void {
    if (!_awaitingGeneralPick)
      throw "GeneralChestTileEvent.resolveStagingGeneral: 未處於選將暫存";
    var ruler = cast(_match.activeMonarch(), Monarch);
    var ok = false;
    for (g in ruler.roster())
      if (g.id() == generalId)
        ok = true;
    if (!ok)
      throw "GeneralChestTileEvent.resolveStagingGeneral: 無此麾下武將 " + generalId;
    ruler.grantTroops(GRANT_PER_GENERAL);
    lastResolvedChoice = "claim_reward:" + generalId;
    _awaitingGeneralPick = false;
  }
}
