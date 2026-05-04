package impl_ver1;

import game.GameIds;
import game.GeneralStat;
import game.IGeneral;
import game.IJiCe;
import game.IJiCeStagingPreviewRow;
import game.IPlayer;
import game.IPlayerMenu;
import game.IPlayerMenuEntry;
import game.IPlayerMenuNode;
import game.MenuActivation;
import game.MenuFormWidget;
import game.MenuGeneralChoice;
import game.PlayerMenuKind;
import game.PlayerMenuKind.JiCeStagingSubmit;

/**
 * 落石計策：建構子綁定 {@link GameMatchCore}，並直接讀寫其私有暫存欄位（與 GameMatchCore 同套件友元）。
 */
class LuoshiJiCe implements IJiCe {
  public static inline var REGISTRY_KEY = "jice_luoshi";
  public static inline var DESIGN_LABEL = "落石";

  var gameMatch:GameMatchCore;

  public function new(gameMatch:GameMatchCore) {
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
    var choices:Array<MenuGeneralChoice> = [];
    var defSel:Array<String> = [];
    for (r in rows) {
      choices.push({generalId: r.generalId(), caption: r.outcomeDescription()});
      if (defSel.length == 0)
        defSel.push(r.generalId());
    }
    var submitLeaf = gameMatch.createPlayerMenuEntry(JiCeStagingSubmit, "確認計策選將", true, "confirm_jice_pick");
    var widgets:Array<MenuFormWidget> = [
      GeneralMultiPick("選擇施計武將", choices, defSel),
      Button(submitLeaf),
    ];
    var root = gameMatch.createPlayerMenuNode("落石選將", null, ([] : Array<IPlayerMenuNode>), widgets);
    return new PlayerMenu(actor, "jice-" + registryKey(), [root]);
  }

  public function resolveChoice(actor:IPlayer, menuNode:IPlayerMenuNode):Void {
    if (gameMatch._pendingJiCe != this)
      throw "LuoshiJiCe.resolveChoice: pendingJiCe mismatch";
    if (MenuActivation.activatingEntry(menuNode).kind() != JiCeStagingSubmit)
      throw "LuoshiJiCe.resolveChoice: 預期 JiCeStagingSubmit";

    var tid = gameMatch._jiCeStagingTargetId;
    if (tid == null)
      throw "LuoshiJiCe.resolveChoice: missing staging target";

    var choiceId = readStagingPickGeneralId(menuNode.formWidgets());

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

  /**
   * 與 {@link #buildPlayerMenu} 約定：索引 0 為施計武將 {@link MenuFormWidget.GeneralMultiPick}。
   * 須恰好一名、在暫存預覽列且為當前行動君主麾下。
   */
  function readStagingPickGeneralId(widgets:Array<MenuFormWidget>):GeneralId {
    if (widgets.length == 0)
      throw "LuoshiJiCe: 計策暫存選單為空";
    var raw:Array<String>;
    switch widgets[0] {
      case GeneralMultiPick(_, _, sel):
        raw = sel.copy();
      default:
        throw "LuoshiJiCe: 計策暫存選單第一元件須為 GeneralMultiPick";
    }
    var seen = new Map<String, Bool>();
    var uniq:Array<GeneralId> = [];
    for (id in raw) {
      if (seen.exists(id))
        continue;
      seen.set(id, true);
      uniq.push(id);
    }
    if (uniq.length != 1)
      throw "LuoshiJiCe: 計策選將須恰好選擇一名麾下武將";
    var gid = uniq[0];
    var allowed = new Map<String, Bool>();
    for (r in gameMatch._jiCeStagingRows)
      allowed.set(r.generalId(), true);
    if (!allowed.exists(gid))
      throw 'LuoshiJiCe: 計策選將 "$gid" 不在暫存預覽列';
    var ruler = cast(gameMatch.activeMonarch(), Monarch);
    var ok = new Map<String, Bool>();
    for (g in ruler.roster())
      ok.set(g.id(), true);
    if (!ok.exists(gid))
      throw 'LuoshiJiCe: 計策選將含非麾下武將 "$gid"';
    return gid;
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

  static function __init__():Void {
    JiCeRegistry.register(REGISTRY_KEY, function(m:GameMatchCore) return new LuoshiJiCe(m));
  }
}
