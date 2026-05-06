package impl_ver1.staging;

import game.Balance;
import game.GameIds;
import game.GeneralStat;
import game.IJiCeStagingPreviewRow;
import game.IPlayer;
import game.IPlayerMenu;
import game.IPlayerMenuEntry;
import game.IPlayerMenuNode;
import game.IStagingAction;
import game.MenuFormWidget;
import game.PlayerMenuKind;
import game.GeneralAssignmentKind;
import impl_ver1.rules.GeneralAssignmentOps;
import impl_ver1.core.GameMatchCore;
import impl_ver1.model.Monarch;
import impl_ver1.model.General;
import impl_ver1.model.PlayerMenu;

/**
 * 我方領地開發（骨架）：選一名武將 → 預覽成功率 → 提交。
 * 參考 docs/數值算法.md 4.x 類型公式（此處用 政治 + 體力修正 做占位）。
 */
class FriendlyCityDevelopStagingAction implements IStagingAction {
  final match:GameMatchCore;

  public function new(match:GameMatchCore) {
    this.match = match;
  }

  public function designLabel():String
    return "領地：開發";

  public function registryKey():String
    return "friendly_develop";

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
    var submit:IPlayerMenuEntry = match.createPlayerMenuEntry(PlayerMenuKind.StagingSubmit, "確認開發", true, "dev_ok");
    var widgets:Array<MenuFormWidget> = [
      GeneralMultiPick("選擇開發武將（單選）", choices, defSel),
      Button(submit),
    ];
    var node = match.createPlayerMenuNode("開發", null, [], widgets);
    return new PlayerMenu(actor, actor.monarchId() + "-friendly-dev", [node]);
  }

  public function resolveChoice(actor:IPlayer, menuNode:IPlayerMenuNode):Void {
    var ruler = cast(match.activeMonarch(), Monarch);
    if (actor.monarchId() != ruler.id())
      throw "FriendlyCityDevelopStagingAction: actor must be active monarch";
    match.pushInfoPopup(ruler.id(), "開發完成", game.PopupPayload.Plain("領地開發已執行（數值結算仍為骨架）。"), "friendly-develop");
  }

  public function previewRows(actor:IPlayer):Array<IJiCeStagingPreviewRow> {
    var ruler = cast(match.activeMonarch(), Monarch);
    var rows:Array<IJiCeStagingPreviewRow> = [];
    var previews = GeneralAssignmentOps.previewForRosterWithRate(
      GeneralAssignmentKind.FriendlyCityDevelop,
      ruler.roster(),
      Stewardship,
      0,
      g -> {
        var pol = g.stat(Stewardship);
        return (pol / 100.0) * 0.60 * Balance.staminaModifier(g.stamina());
      },
      (_, rate) -> '成功率約 ${Std.int(Math.floor(rate * 100))}%'
    );
    for (p in previews)
      rows.push(new SimpleStagingPreviewRow(p.generalId, p.summary, 0));
    return rows;
  }
}

