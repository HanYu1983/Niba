package impl_ver1.jice;

import game.GameIds;
import game.GeneralStat;
import game.IGeneral;
import game.IJiCe;
import game.IPlayer;
import game.IPlayerMenu;
import game.IPlayerMenuEntry;
import game.IPlayerMenuNode;
import game.MenuActivation;
import game.MenuFormWidget;
import game.MenuGeneralChoice;
import game.MenuMonarchChoice;
import game.PlayerMenuKind;
import game.PlayerMenuKind.StagingSubmit;
import impl_ver1.core.GameMatchCore;
import impl_ver1.model.Monarch;
import impl_ver1.model.General;
import impl_ver1.model.PlayerMenu;
import impl_ver1.jice.JiCeRegistry;

/**
 * 落石計策：建構子綁定 {@link GameMatchCore}；暫存與兵力結算經 Core 私有方法（同套件友元可見）。
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

  public function buildPlayerMenu(actor:IPlayer):IPlayerMenu {
    var monarchChoices:Array<MenuMonarchChoice> = [];
    for (m in gameMatch.monarchs())
      if (m.id() != actor.monarchId())
        monarchChoices.push({monarchId: m.id(), caption: m.id()});
    if (monarchChoices.length == 0)
      throw "LuoshiJiCe: 無可選擇之目標君主（至少需一名非自身君主）";
    var defTarget:Array<String> = [monarchChoices[0].monarchId];

    var atk = cast(gameMatch.activeMonarch(), Monarch);
    var roster = atk.roster();
    if (roster.length == 0)
      throw "LuoshiJiCe: 計策暫存需要攻方 roster 至少一名武將";
    var choices:Array<MenuGeneralChoice> = [];
    var defSel:Array<String> = [];
    for (g in roster) {
      var gid = g.id();
      choices.push({generalId: gid, caption: "以【" + gid + "】施計"});
      if (defSel.length == 0)
        defSel.push(gid);
    }
    var submitLeaf = gameMatch.createPlayerMenuEntry(StagingSubmit, "確認計策選將", true, "confirm_jice_pick");
    var widgets:Array<MenuFormWidget> = [
      MonarchSinglePick("選擇目標君主", monarchChoices, defTarget),
      GeneralMultiPick("選擇施計武將", choices, defSel),
      Button(submitLeaf),
    ];
    var root = gameMatch.createPlayerMenuNode("落石選將", null, ([] : Array<IPlayerMenuNode>), widgets);
    return new PlayerMenu(actor, "jice-" + registryKey(), [root]);
  }

  public function resolveChoice(actor:IPlayer, menuNode:IPlayerMenuNode):Void {
    if (!gameMatch.stagingMatchesJiCe(this))
      throw "LuoshiJiCe.resolveChoice: pendingJiCe mismatch";
    if (MenuActivation.activatingEntry(menuNode).kind() != StagingSubmit)
      throw "LuoshiJiCe.resolveChoice: 預期 StagingSubmit";

    var tid = readStagingPickTargetMonarchId(menuNode.formWidgets());
    var choiceId = readStagingPickGeneralId(menuNode.formWidgets());

    var defTroops = gameMatch.monarchTroopCount(tid);
    var ruler = cast(gameMatch.activeMonarch(), Monarch);
    var might:Null<Int> = null;
    for (g in ruler.roster())
      if (g.id() == choiceId) {
        might = cast(g, General).stat(Might);
        break;
      }
    if (might == null)
      throw 'LuoshiJiCe: 計策選將含非麾下武將 "$choiceId"';
    var pickedLoss = previewTroopLoss(defTroops, might);
    gameMatch.monarchApplyTroopLoss(tid, pickedLoss);
  }

  /**
   * 與 {@link #buildPlayerMenu} 約定：索引 0 為目標君主 {@link MenuFormWidget.MonarchSinglePick}；
   * 索引 1 為施計武將 {@link MenuFormWidget.GeneralMultiPick}。
   * 須恰好一名、在暫存預覽列且為當前行動君主麾下。
   */
  function readStagingPickGeneralId(widgets:Array<MenuFormWidget>):GeneralId {
    if (widgets.length == 0)
      throw "LuoshiJiCe: 計策暫存選單為空";
    var raw:Array<String> = [];
    if (widgets.length < 2)
      throw "LuoshiJiCe: 計策暫存選單缺少目標君主/選將元件";
    switch widgets[1] {
      case GeneralMultiPick(_, _, sel):
        raw = sel.copy();
      default:
        throw "LuoshiJiCe: 計策暫存選單第二元件須為 GeneralMultiPick";
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
    var ruler = cast(gameMatch.activeMonarch(), Monarch);
    var ok = new Map<String, Bool>();
    for (g in ruler.roster())
      ok.set(g.id(), true);
    if (!ok.exists(gid))
      throw 'LuoshiJiCe: 計策選將含非麾下武將 "$gid"';
    return gid;
  }

  /**
   * 與 {@link #buildPlayerMenu} 約定：索引 0 為 {@link MenuFormWidget.MonarchSinglePick}（單選）。
   */
  function readStagingPickTargetMonarchId(widgets:Array<MenuFormWidget>):MonarchId {
    if (widgets.length == 0)
      throw "LuoshiJiCe: 計策暫存選單為空";
    var raw:Array<String> = [];
    switch widgets[0] {
      case MonarchSinglePick(_, _, sel):
        raw = sel.copy();
      default:
        throw "LuoshiJiCe: 計策暫存選單第一元件須為 MonarchSinglePick";
    }
    var seen = new Map<String, Bool>();
    var uniq:Array<MonarchId> = [];
    for (id in raw) {
      if (seen.exists(id))
        continue;
      seen.set(id, true);
      uniq.push(id);
    }
    if (uniq.length != 1)
      throw "LuoshiJiCe: 目標君主須恰好選擇一名";
    return uniq[0];
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
