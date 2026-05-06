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
import game.GeneralAssignmentKind;
import impl_ver1.rules.GeneralAssignmentOps;
import impl_ver1.rules.GeneralAssignmentApply;
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
    var tradeConfirm:MenuClientConfirm = {
      title: "確認交易",
      message: "將消耗金錢 20，武將體力 -10，並提升村落友好度。\n確定要交易嗎？",
    };
    var submit:IPlayerMenuEntry = match.createPlayerMenuEntry(PlayerMenuKind.StagingSubmit, "確認交易", true, "trade_ok", tradeConfirm);
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
    var vIdx = match.forceGetPendingVillageTile();
    if (vIdx == null)
      throw "VillageTradeStagingAction: no pendingVillage";
    var gid = GeneralAssignmentApply.pickSingleGeneralId(menuNode.formWidgets());

    // 真結算線（骨架）：
    // - 成功率暫不擲隨機（避免測試不穩）；先視為成功。
    // - 消耗金錢換糧食：20 gold → 50 grain（之後可依友好度調整比例）
    // - 友好度 +10（上限 100）
    var costGold = 20;
    if (ruler.gold() < costGold)
      throw "VillageTradeStagingAction: insufficient gold";
    ruler.reduceGold(costGold);
    ruler.grantGrain(50);
    var prevF = match.forceGetVillageFriendly(vIdx, ruler.id());
    var nextF = prevF + 10;
    if (nextF > 100)
      nextF = 100;
    match.forceSetVillageFriendly(vIdx, ruler.id(), nextF);
    var gg = GeneralAssignmentApply.requireOwnedGeneral(ruler, gid);
    GeneralAssignmentApply.applyStaminaCost(gg, 10);
    match.pushInfoPopup(
      ruler.id(),
      "交易成功",
      game.PopupPayload.Plain('與村落（格 ${vIdx}）交易完成。\n\n獲得：糧食 +50\n友好度：${prevF} → ${nextF}\n消耗：金錢 -${costGold}\n${gid} 體力 -10'),
      "village-trade"
    );
  }

  public function previewRows(actor:IPlayer):Array<IJiCeStagingPreviewRow> {
    var ruler = cast(match.activeMonarch(), Monarch);
    var rows:Array<IJiCeStagingPreviewRow> = [];
    var previews = GeneralAssignmentOps.previewForRosterWithRate(
      GeneralAssignmentKind.VillageTrade,
      ruler.roster(),
      Stewardship,
      10,
      g -> {
        var pol = g.stat(Stewardship);
        return 0.90 + (pol / 100.0) * 0.10 * Balance.staminaModifier(g.stamina());
      },
      (_, rate) -> '成功率約 ${Std.int(Math.floor(rate * 100))}%；成功獎勵 +50 糧'
    );
    for (p in previews)
      rows.push(new SimpleStagingPreviewRow(p.generalId, p.summary, 0));
    return rows;
  }
}

