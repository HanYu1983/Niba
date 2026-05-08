package impl_ver1.jice;

import game.GameIds;
import game.GameError;
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
import game.StrategyPhase;
import impl_ver1.core.GameMatchCore;
import impl_ver1.model.Monarch;
import impl_ver1.model.General;
import impl_ver1.model.PlayerMenu;
import impl_ver1.jice.JiCeRegistry;
import impl_ver1.jice.JiCeMenuLegalChoices;
import impl_ver1.jice.JiCeMenuSig;

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

  public function allowedPhases():Array<StrategyPhase>
    return [PreMove];

  public function buildPlayerMenu(actor:IPlayer):IPlayerMenu {
    var atk = cast(gameMatch.activeMonarch(), Monarch);
    var monarchChoices:Array<MenuMonarchChoice> = JiCeMenuLegalChoices.otherMonarchChoices(gameMatch, actor.monarchId());
    var defTarget:Array<String> = monarchChoices.length > 0 ? [monarchChoices[0].monarchId] : [];

    // 落石 ver1 無體力消耗，但仍限制「至少要有一名我方武將可選」
    var choices:Array<MenuGeneralChoice> = JiCeMenuLegalChoices.rosterChoices(atk);
    var defSel:Array<String> = choices.length > 0 ? [choices[0].generalId] : [];

    var enabled = monarchChoices.length > 0 && choices.length > 0;
    var sig = JiCeMenuSig.make([
      registryKey(),
      "phase=pre",
      "casters=" + choices.map(c -> c.generalId).join(","),
      "monarchs=" + monarchChoices.map(m -> m.monarchId).join(","),
    ]);
    var submitLeaf = gameMatch.createPlayerMenuEntry(StagingSubmit, "確認計策選將", enabled, JiCeMenuSig.attach("confirm_jice_pick", sig));
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

    // --- menu snapshot sig（只作歸因，不作一票否決）---
    var token = MenuActivation.activatingEntry(menuNode).decisionToken();
    var gotSig = JiCeMenuSig.parseSig(token);
    var monarchChoices = JiCeMenuLegalChoices.otherMonarchChoices(gameMatch, actor.monarchId());
    var gChoices = JiCeMenuLegalChoices.rosterChoices(ruler);
    var nowSig = JiCeMenuSig.make([
      registryKey(),
      "phase=pre",
      "casters=" + gChoices.map(c -> c.generalId).join(","),
      "monarchs=" + monarchChoices.map(m -> m.monarchId).join(","),
    ]);
    var sigMismatch = (gotSig != null && gotSig != nowSig);

    var casterOk = false;
    for (c in gChoices)
      if (c.generalId == choiceId) {
        casterOk = true;
        break;
      }
    var targetOk = false;
    for (m in monarchChoices)
      if (m.monarchId == tid) {
        targetOk = true;
        break;
      }
    if (!casterOk || !targetOk) {
      if (sigMismatch)
        throw JiCeMenuSig.stateChangedError("狀態已變更，請重新選擇落石目標。", "jice-luoshi/state-changed");
      throw new GameError("落石目標已不合法（請重新開啟選單再選擇）。", "目標不合法", "jice-luoshi/invalid-choice");
    }

    var might:Null<Int> = null;
    for (g in ruler.roster())
      if (g.id() == choiceId) {
        might = cast(g, General).stat(Might);
        break;
      }
    if (might == null)
      throw 'LuoshiJiCe: 計策選將含非麾下武將 "$choiceId"';

    // Ver1：落石沿用「純結算」骨架（無擲骰/無體力消耗），但仍走通用彈窗模板。
    var pickedLoss = previewTroopLoss(defTroops, might);
    gameMatch.monarchApplyTroopLoss(tid, pickedLoss);
    var effectLines:Array<String> = ['目標兵力 -${pickedLoss}'];
    JiCeApply.popupTargetMonarch(gameMatch, tid, designLabel(), actor.monarchId(), choiceId, ['兵力 -${pickedLoss}'], "jice-luoshi/target");
    var dummy = {ok: true, rate: 1.0, roll: 0.0, cost: 0, before: 0, after: 0};
    JiCeApply.popupCaster(gameMatch, actor.monarchId(), designLabel(), PreMove, choiceId, Might, game.StrategyCostTier.High, dummy, '君主 $tid', effectLines, "jice-luoshi");
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
