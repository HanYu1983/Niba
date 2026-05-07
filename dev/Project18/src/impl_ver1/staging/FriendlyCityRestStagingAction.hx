package impl_ver1.staging;

import game.Balance;
import game.GameIds;
import game.IJiCeStagingPreviewRow;
import game.IPlayer;
import game.IPlayerMenu;
import game.IPlayerMenuEntry;
import game.IPlayerMenuNode;
import game.IStagingAction;
import game.MenuFormWidget;
import game.PlayerMenuKind;
import impl_ver1.core.GameMatchCore;
import impl_ver1.model.Monarch;
import impl_ver1.model.General;
import impl_ver1.model.PlayerMenu;
import game.GameError;
import impl_ver1.rules.GeneralAssignmentApply;

/**
 * 我方領地休整（骨架）：選一名武將 → 提交（回復 +40）。
 * docs/數值算法.md 1.4：領地休整回復 +40。
 */
class FriendlyCityRestStagingAction implements IStagingAction {
  final match:GameMatchCore;

  public function new(match:GameMatchCore) {
    this.match = match;
  }

  public function designLabel():String
    return "領地：休整";

  public function registryKey():String
    return "friendly_rest";

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
    var submit:IPlayerMenuEntry = match.createPlayerMenuEntry(PlayerMenuKind.StagingSubmit, "確認休整", true, "friendly_rest_ok");
    var widgets:Array<MenuFormWidget> = [
      GeneralMultiPick("選擇休整武將（單選）", choices, defSel),
      Button(submit),
    ];
    var node = match.createPlayerMenuNode("領地休整", null, [], widgets);
    return new PlayerMenu(actor, actor.monarchId() + "-friendly-rest", [node]);
  }

  public function resolveChoice(actor:IPlayer, menuNode:IPlayerMenuNode):Void {
    var ruler = cast(match.activeMonarch(), Monarch);
    if (actor.monarchId() != ruler.id())
      throw new GameError("目前不是你的回合，無法領地休整。", "操作失敗", "friendly-rest/actor");
    var widgets = menuNode.formWidgets();
    if (widgets == null || widgets.length == 0)
      throw new GameError("休整表單異常（缺少輸入）。", "操作失敗", "friendly-rest/missing-widgets");

    var gid = GeneralAssignmentApply.pickSingleGeneralId(widgets);
    var g:General = GeneralAssignmentApply.requireOwnedGeneral(ruler, gid);
    var prevSt = g.stamina();
    var next = Balance.clampInt(prevSt + Balance.STAMINA_RECOVER_TERRITORY_REST, 0, 100);
    g.setStamina(next);

    match.pushInfoPopup(ruler.id(), "休整完成", game.PopupPayload.Plain('${gid} 體力：${prevSt} → ${next}（+${Balance.STAMINA_RECOVER_TERRITORY_REST}）'), "friendly-city-rest");
  }

  public function previewRows(actor:IPlayer):Array<IJiCeStagingPreviewRow> {
    var ruler = cast(match.activeMonarch(), Monarch);
    var rows:Array<IJiCeStagingPreviewRow> = [];
    for (g in ruler.roster())
      rows.push(new SimpleStagingPreviewRow(g.id(), "+40 體力", 0));
    return rows;
  }
}

