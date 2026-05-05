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
import impl_ver1.core.GameMatchCore;
import impl_ver1.model.Monarch;
import impl_ver1.model.General;
import impl_ver1.model.PlayerMenu;

/**
 * 村落交易（示範）：選一名武將進行交易 → 顯示成功率預覽 → 確認提交。
 * - 成功率公式參考 docs/數值算法.md 5.1（政治 + 體力修正）
 * - 目前先用固定獎勵（grain +50）做骨架；之後接村落/資源模型再細化。
 */
class VillageTradeStagingAction implements IStagingAction {
  final match:GameMatchCore;

  public function new(match:GameMatchCore) {
    this.match = match;
  }

  public function designLabel():String
    return "村落：交易";

  public function registryKey():String
    return "village_trade";

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
    var submit:IPlayerMenuEntry = match.createPlayerMenuEntry(PlayerMenuKind.StagingSubmit, "確認交易", true, "trade_ok");
    var widgets:Array<MenuFormWidget> = [
      GeneralMultiPick("選擇交易武將（單選）", choices, defSel),
      Button(submit),
    ];
    var node = match.createPlayerMenuNode("交易", null, [], widgets);
    return new PlayerMenu(actor, actor.monarchId() + "-village-trade", [node]);
  }

  public function resolveChoice(actor:IPlayer, menuNode:IPlayerMenuNode):Void {
    var ruler = cast(match.activeMonarch(), Monarch);
    if (actor.monarchId() != ruler.id())
      throw "VillageTradeStagingAction: actor must be active monarch";

    var picked:Array<String> = [];
    for (w in menuNode.formWidgets())
      switch w {
        case GeneralMultiPick(_, _, sel):
          picked = sel.copy();
        default:
      }
    var gid:Null<GeneralId> = null;
    var seen = new Map<String, Bool>();
    for (id in picked) {
      if (seen.exists(id))
        continue;
      seen.set(id, true);
      gid = id;
    }
    if (gid == null || picked.length == 0)
      throw "VillageTradeStagingAction: must pick a general";

    // 目前先當作必定成功：給固定收益，並做一點體力消耗（低消耗策略級別）
    ruler.grantGrain(50);
    for (g in ruler.roster())
      if (g.id() == gid) {
        var gg = cast(g, General);
        gg.setStamina(Balance.clampInt(gg.stamina() - 10, 0, 100));
        return;
      }
    throw "VillageTradeStagingAction: picked general not in roster";
  }

  public function previewRows(actor:IPlayer):Array<IJiCeStagingPreviewRow> {
    var ruler = cast(match.activeMonarch(), Monarch);
    var rows:Array<IJiCeStagingPreviewRow> = [];
    for (g in ruler.roster()) {
      var pol = cast(g, General).stat(Stewardship);
      var stamina = cast(g, General).stamina();
      var rate = 0.90 + (pol / 100.0) * 0.10 * Balance.staminaModifier(stamina);
      var pct = Std.int(Math.floor(rate * 100));
      rows.push(new SimpleStagingPreviewRow(g.id(), '成功率約 ${pct}%；成功獎勵 +50 糧', 0));
    }
    return rows;
  }
}

