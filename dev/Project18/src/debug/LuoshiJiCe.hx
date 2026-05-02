package debug;

import game.GameIds;
import game.GeneralStat;
import game.IGameMatch;
import game.IGeneral;
import game.IJiCe;
import game.IJiCeStagingPreviewRow;
import game.IPlayer;
import game.IPlayerMenu;
import game.IPlayerMenuNode;
import game.PlayerMenuKind;

/**
 * 落石：暫存後依麾下武將連動預覽折損，選將後對目標君主套用 predictedTroopLoss。
 */
class LuoshiJiCe implements IJiCe {
  public static inline var REGISTRY_KEY = "jice_luoshi";

  var _match:IGameMatch;

  public function new(match:IGameMatch) {
    _match = match;
  }

  public function designLabel():String
    return JiCeLuoshiTest.LUOSHI_LABEL;

  public function registryKey():String
    return REGISTRY_KEY;

  public function applyAgainstMonarch(actor:IPlayer, targetMonarchId:MonarchId):Void {
    var atk = cast(_match.activeMonarch(), SimpleMonarch);
    var roster = atk.roster();
    if (roster.length == 0)
      throw "LuoshiJiCe: 計策暫存需要攻方 roster 至少一名武將";

    var defTroops = monarchTroops(targetMonarchId);
    var previewRows:Array<IJiCeStagingPreviewRow> = [];

    for (g in roster) {
      var sg = cast(g, SimpleGeneral);
      var loss = JiCeLuoshiTest.stagedLuoshiTroopLossPreview(defTroops, sg.stat(Might));
      var desc = "【" + sg.id() + "】落石預覽：預計對守方折兵 " + loss + "（一成基礎+勇武加成）";
      previewRows.push(new SimpleJiCeStagingPreviewRow(sg.id(), desc, loss));
    }

    _match.enterJiCeStaging(this, targetMonarchId, previewRows);
  }

  public function buildPlayerMenu(actor:IPlayer):IPlayerMenu {
    var rows = _match.jiCeStagingPreviewRows();
    var pickNodes:Array<IPlayerMenuNode> = [];
    for (r in rows)
      pickNodes.push(
        _match.createPlayerMenuNode(
          r.generalId(),
          _match.createPlayerMenuEntry(JiCePick, r.outcomeDescription(), true, r.generalId()),
          []
        )
      );
    return new SimplePlayerMenu(actor, "jice-" + registryKey(), pickNodes);
  }

  public function resolveChoice(actor:IPlayer, choiceId:String):Void {
    if (_match.pendingJiCe() != this)
      throw "LuoshiJiCe.resolveChoice: pendingJiCe mismatch";

    var tid = _match.jiCeStagingTargetMonarchId();
    if (tid == null)
      throw "LuoshiJiCe.resolveChoice: missing staging target";

    var pickedLoss:Null<Int> = null;
    for (r in _match.jiCeStagingPreviewRows())
      if (r.generalId() == choiceId)
        pickedLoss = r.predictedTroopLoss();

    if (pickedLoss == null)
      throw "LuoshiJiCe.resolveChoice: unknown general " + choiceId;

    for (mon in _match.monarchs())
      if (mon.id() == tid) {
        cast(mon, SimpleMonarch).reduceTroops(pickedLoss);
        return;
      }
    throw "LuoshiJiCe.resolveChoice: monarch not found " + tid;
  }

  function monarchTroops(monarchId:MonarchId):Int {
    for (m in _match.monarchs())
      if (m.id() == monarchId)
        return m.troops();
    throw "LuoshiJiCe: monarch not found " + monarchId;
  }
}
