package impl_ver1.staging;

import game.Balance;
import game.GameIds;
import game.IPlayer;
import game.IPlayerMenu;
import game.IPlayerMenuEntry;
import game.IPlayerMenuNode;
import game.IStagingAction;
import game.MenuFormWidget;
import game.PlayerMenuKind;
import game.IJiCeStagingPreviewRow;
import impl_ver1.staging.SimpleStagingPreviewRow;
import impl_ver1.rules.GeneralAssignmentApply;
import impl_ver1.core.GameMatchCore;
import impl_ver1.model.Monarch;
import impl_ver1.model.General;
import impl_ver1.model.PlayerMenu;
import game.GameError;
import game.MenuActivation;
import impl_ver1.jice.JiCeMenuSig;

/** 休整（staging）：選一名武將回復體力。 */
class RestStagingAction implements IStagingAction {
  final match:GameMatchCore;

  public function new(match:GameMatchCore) {
    this.match = match;
  }

  public function designLabel():String
    return "休整";

  public function registryKey():String
    return "rest";

  public function asJiCe():Null<game.IJiCe>
    return null;

  public function buildPlayerMenu(actor:IPlayer):IPlayerMenu {
    var ruler = cast(match.activeMonarch(), Monarch);
    var choices:Array<game.MenuGeneralChoice> = [];
    var defSel:Array<String> = [];
    for (g in ruler.roster()) {
      var gid = g.id();
      choices.push({generalId: gid, caption: gid});
      if (defSel.length == 0)
        defSel.push(gid);
    }
    // menu 建構端先做合法性：至少 1 名武將
    var sig = JiCeMenuSig.make([registryKey(), "generals=" + choices.map(c -> c.generalId).join(",")]);
    var submit = match.createPlayerMenuEntry(PlayerMenuKind.StagingSubmit, "確認休整", choices.length > 0, JiCeMenuSig.attach("rest_ok", sig));
    var widgets:Array<MenuFormWidget> = [
      GeneralMultiPick("選擇休整武將（單選）", choices, defSel),
      Button(submit),
    ];
    var node = match.createPlayerMenuNode("休整", null, [], widgets);
    return new PlayerMenu(actor, actor.monarchId() + "-rest", [node]);
  }

  public function resolveChoice(actor:IPlayer, menuNode:IPlayerMenuNode):Void {
    var ruler = cast(match.activeMonarch(), Monarch);
    if (actor.monarchId() != ruler.id())
      throw new GameError("目前不是你的回合，無法休整。", "操作失敗", "rest/actor");
    var token = MenuActivation.activatingEntry(menuNode).decisionToken();
    var gotSig = JiCeMenuSig.parseSig(token);
    var widgets = menuNode.formWidgets();
    if (widgets == null || widgets.length == 0)
      throw new GameError("休整表單異常（缺少輸入）。", "操作失敗", "rest/missing-widgets");

    var gid = GeneralAssignmentApply.pickSingleGeneralId(widgets);
    var nowChoices:Array<game.MenuGeneralChoice> = [];
    for (g in ruler.roster())
      nowChoices.push({generalId: g.id(), caption: g.id()});
    var nowSig = JiCeMenuSig.make([registryKey(), "generals=" + nowChoices.map(c -> c.generalId).join(",")]);
    var sigMismatch = (gotSig != null && gotSig != nowSig);
    var gOk = false;
    for (c in nowChoices)
      if (c.generalId == gid) {
        gOk = true;
        break;
      }
    if (!gOk) {
      if (sigMismatch)
        throw JiCeMenuSig.stateChangedError("狀態已變更，請重新選擇休整武將。", "rest/state-changed");
      throw "RestStagingAction: invalid-choice (sig matched) — menu/widget mismatch";
    }
    var target = GeneralAssignmentApply.requireOwnedGeneral(ruler, gid);

    var prevSt = target.stamina();
    var next = Balance.clampInt(prevSt + Balance.STAMINA_RECOVER_REST, 0, 100);
    target.setStamina(next);
    match.pushOutboxPlain(ruler.id(), "休整完成", game.PopupPayload.Plain('${gid} 體力：${prevSt} → ${next}'), "rest");
  }

  public function previewRows(actor:IPlayer):Array<IJiCeStagingPreviewRow> {
    var ruler = cast(match.activeMonarch(), Monarch);
    var rows:Array<IJiCeStagingPreviewRow> = [];
    for (g in ruler.roster())
      rows.push(new SimpleStagingPreviewRow(g.id(), "+30 體力", 0));
    return rows;
  }
}

