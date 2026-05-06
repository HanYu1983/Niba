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
import game.MenuClientConfirm;
import game.PlayerMenuKind;
import impl_ver1.rules.GeneralAssignmentOps;
import impl_ver1.rules.GeneralAssignmentKeys;
import impl_ver1.core.GameMatchCore;
import impl_ver1.model.Monarch;
import impl_ver1.model.General;
import impl_ver1.model.PlayerMenu;

/**
 * 村落搶奪（骨架）：選一名武將 → 預覽成功率 → 提交。
 * 參考 docs/數值算法.md 5.2（武力 + 體力修正）。
 */
class VillagePlunderStagingAction implements IStagingAction {
  final match:GameMatchCore;

  public function new(match:GameMatchCore) {
    this.match = match;
  }

  public function designLabel():String
    return "村落：搶奪";

  public function registryKey():String
    return "village_plunder";

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
    var plunderConfirm:MenuClientConfirm = {title: "確認搶奪", message: "搶奪會大幅降低村落友好度。確定要執行嗎？"};
    var submit:IPlayerMenuEntry = match.createPlayerMenuEntry(PlayerMenuKind.StagingSubmit, "確認搶奪", true, "plunder_ok", plunderConfirm);
    var widgets:Array<MenuFormWidget> = [
      GeneralMultiPick("選擇搶奪武將（單選）", choices, defSel),
      Button(submit),
    ];
    var node = match.createPlayerMenuNode("搶奪", null, [], widgets);
    return new PlayerMenu(actor, actor.monarchId() + "-village-plunder", [node]);
  }

  public function resolveChoice(actor:IPlayer, menuNode:IPlayerMenuNode):Void {
    // 菜單流程測試為主：結算先做最小骨架（略）
    var ruler = cast(match.activeMonarch(), Monarch);
    if (actor.monarchId() != ruler.id())
      throw "VillagePlunderStagingAction: actor must be active monarch";
    match.pushInfoPopup(ruler.id(), "搶奪", game.PopupPayload.Plain("搶奪指令已確認（數值結算仍為骨架）。"), "village-plunder");
  }

  public function previewRows(actor:IPlayer):Array<IJiCeStagingPreviewRow> {
    var ruler = cast(match.activeMonarch(), Monarch);
    var rows:Array<IJiCeStagingPreviewRow> = [];
    var previews = GeneralAssignmentOps.previewForRosterWithRate(
      GeneralAssignmentKeys.VillagePlunder,
      ruler.roster(),
      Might,
      0,
      g -> {
        var might = g.stat(Might);
        return 0.30 + (might / 100.0) * 0.20 * Balance.staminaModifier(g.stamina());
      },
      (_, rate) -> '成功率約 ${Std.int(Math.floor(rate * 100))}%'
    );
    for (p in previews)
      rows.push(new SimpleStagingPreviewRow(p.generalId, p.summary, 0));
    return rows;
  }
}

