package impl_ver1;

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
    var submit:IPlayerMenuEntry = match.createPlayerMenuEntry(PlayerMenuKind.StagingSubmit, "確認搶奪", true, "plunder_ok");
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
  }

  public function previewRows(actor:IPlayer):Array<IJiCeStagingPreviewRow> {
    var ruler = cast(match.activeMonarch(), Monarch);
    var rows:Array<IJiCeStagingPreviewRow> = [];
    for (g in ruler.roster()) {
      var might = cast(g, General).stat(Might);
      var stamina = cast(g, General).stamina();
      var rate = 0.30 + (might / 100.0) * 0.20 * Balance.staminaModifier(stamina);
      var pct = Std.int(Math.floor(rate * 100));
      rows.push(new SimpleStagingPreviewRow(g.id(), '成功率約 ${pct}%', 0));
    }
    return rows;
  }
}

