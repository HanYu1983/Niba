package impl_ver1;

import game.GameIds;
import game.GeneralStat;
import game.IGeneral;
import game.IJiCe;
import game.IJiCeStagingPreviewRow;
import game.IPlayer;
import game.IPlayerMenu;
import game.IPlayerMenuNode;
import game.PlayerMenuKind;

/**
 * 落石計策：建構子綁定具體 {@link GameMatch}，並直接讀寫其私有暫存欄位（與 GameMatch 同套件友元）。
 */
class LuoshiJiCe implements IJiCe {
  public static inline var REGISTRY_KEY = "jice_luoshi";
  public static inline var DESIGN_LABEL = "落石";

  var gameMatch:GameMatch;

  public function new(gameMatch:GameMatch) {
    this.gameMatch = gameMatch;
  }

  public function designLabel():String
    return DESIGN_LABEL;

  public function registryKey():String
    return REGISTRY_KEY;

  public function applyAgainstMonarch(actor:IPlayer, targetMonarchId:MonarchId):Void {
    var atk = cast(gameMatch.activeMonarch(), Monarch);
    var roster = atk.roster();
    if (roster.length == 0)
      throw "LuoshiJiCe: 計策暫存需要攻方 roster 至少一名武將";

    var defTroops = monarchTroops(targetMonarchId);
    var previewRows:Array<IJiCeStagingPreviewRow> = [];

    for (g in roster) {
      var sg = cast(g, General);
      var loss = stagedLuoshiTroopLossPreview(defTroops, sg.stat(Might));
      var desc = "【" + sg.id() + "】落石預覽：預計對守方折兵 " + loss + "（一成基礎+勇武加成）";
      previewRows.push(new JiCeStagingPreviewRow(sg.id(), desc, loss));
    }

    gameMatch.enterJiCeStaging(this, targetMonarchId, previewRows);
  }

  public function buildPlayerMenu(actor:IPlayer):IPlayerMenu {
    var rows = gameMatch._jiCeStagingRows;
    var pickNodes:Array<IPlayerMenuNode> = [];
    for (r in rows)
      pickNodes.push(
        gameMatch.createPlayerMenuNode(
          r.generalId(),
          gameMatch.createPlayerMenuEntry(JiCePick, r.outcomeDescription(), true, r.generalId()),
          ([] : Array<IPlayerMenuNode>)
        )
      );
    return new PlayerMenu(actor, "jice-" + registryKey(), pickNodes);
  }

  public function resolveChoice(actor:IPlayer, choiceId:String):Void {
    if (gameMatch._pendingJiCe != this)
      throw "LuoshiJiCe.resolveChoice: pendingJiCe mismatch";

    var tid = gameMatch._jiCeStagingTargetId;
    if (tid == null)
      throw "LuoshiJiCe.resolveChoice: missing staging target";

    var pickedLoss:Null<Int> = null;
    for (r in gameMatch._jiCeStagingRows)
      if (r.generalId() == choiceId)
        pickedLoss = r.predictedTroopLoss();

    if (pickedLoss == null)
      throw "LuoshiJiCe.resolveChoice: unknown general " + choiceId;

    for (mon in gameMatch._monarchs)
      if (mon.id() == tid) {
        mon.reduceTroops(pickedLoss);
        return;
      }
    throw "LuoshiJiCe.resolveChoice: monarch not found " + tid;
  }

  function monarchTroops(monarchId:MonarchId):Int {
    for (m in gameMatch._monarchs)
      if (m.id() == monarchId)
        return m.troops();
    throw "LuoshiJiCe: monarch not found " + monarchId;
  }

  static function loseTroopFractionOneTenth(currentTroops:Int):Int {
    if (currentTroops <= 0)
      return 0;
    return Std.int(Math.ceil(currentTroops * 0.1));
  }

  static function stagedLuoshiTroopLossPreview(defenderTroops:Int, casterGeneralMight:Int):Int {
    return loseTroopFractionOneTenth(defenderTroops) + Std.int(casterGeneralMight / 10);
  }

  /** 測試／UI 共用預覽公式（等同 staged 規剘）。 */
  public static function previewTroopLoss(defenderTroops:Int, casterGeneralMight:Int):Int {
    return stagedLuoshiTroopLossPreview(defenderTroops, casterGeneralMight);
  }
}
