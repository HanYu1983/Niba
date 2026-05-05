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
import impl_ver1.core.GameMatchCore;
import impl_ver1.model.Monarch;
import impl_ver1.model.General;
import impl_ver1.model.PlayerMenu;

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
    var submit = match.createPlayerMenuEntry(PlayerMenuKind.StagingSubmit, "確認休整", true, "rest_ok");
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
      throw "RestStagingAction: actor must be active monarch";
    var widgets = menuNode.formWidgets();
    if (widgets == null || widgets.length == 0)
      throw "RestStagingAction: missing widgets";

    var picked:Array<String> = [];
    for (w in widgets)
      switch w {
        case GeneralMultiPick(_, _, sel):
          picked = sel.copy();
        default:
      }

    var seen = new Map<String, Bool>();
    var uniq:Array<GeneralId> = [];
    for (id in picked) {
      if (seen.exists(id))
        continue;
      seen.set(id, true);
      uniq.push(id);
    }
    if (uniq.length != 1)
      throw "RestStagingAction: must pick exactly one general";
    var gid = uniq[0];

    var target:Null<General> = null;
    for (g in ruler.roster())
      if (g.id() == gid) {
        target = cast g;
        break;
      }
    if (target == null)
      throw "RestStagingAction: picked general not in roster";

    var next = Balance.clampInt(target.stamina() + Balance.STAMINA_RECOVER_REST, 0, 100);
    target.setStamina(next);
  }

  public function previewRows(actor:IPlayer):Array<IJiCeStagingPreviewRow> {
    var ruler = cast(match.activeMonarch(), Monarch);
    var rows:Array<IJiCeStagingPreviewRow> = [];
    for (g in ruler.roster())
      rows.push(new SimpleStagingPreviewRow(g.id(), "+30 體力", 0));
    return rows;
  }
}

