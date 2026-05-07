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
import impl_ver1.rules.GeneralAssignmentApply;
import impl_ver1.rules.GeneralAssignmentKeys;
import impl_ver1.core.GameMatchCore;
import impl_ver1.model.Monarch;
import impl_ver1.model.General;
import impl_ver1.model.PlayerMenu;
import game.GameError;

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
      throw new GameError("目前不是你的回合，無法交易。", "操作失敗", "village-trade/actor");
    var vIdx = match.forceGetPendingVillageTile();
    if (vIdx == null)
      throw new GameError("必須在拜訪村落時才能交易。", "操作失敗", "village-trade/pending");
    var gid = GeneralAssignmentApply.pickSingleGeneralId(menuNode.formWidgets());

    // 真結算線（對齊 GDD 2.1.3）：
    // - 需要指派武將、消耗體力
    // - 成功率由政治（stewardship）與體力決定，採 deterministic 擲骰以利測試可重現
    // - 成功後資源交換為「低效果」；交易比例受友好度影響（友好度越高越優惠）
    // - 友好度提升 +5~15（依交易規模；ver1 先以固定規模 + jitter）
    // TODO(num-algo): docs/數值算法.md §5.1（交易成功率）文件為「0.90 + (政治/100)*10%*體力修正」；本實作已接近，但交易規模/交換公式仍為 ver1 簡化版（未落地完整資源換算表）。
    var costGold = 20;
    if (ruler.gold() < costGold)
      throw new GameError('金錢不足（需要 ${costGold}）。', "資源不足", "village-trade/insufficient-gold");

    var gg = GeneralAssignmentApply.requireOwnedGeneral(ruler, gid);
    var pol = gg.stat(Stewardship);
    var rate = 0.90 + (pol / 100.0) * 0.10 * Balance.staminaModifier(gg.stamina());
    if (rate < 0)
      rate = 0;
    if (rate > 1)
      rate = 1;
    var seed = 'village_trade|t=${vIdx}|r=${match.roundNumber()}|m=${ruler.id()}|g=${gid}|gold=${costGold}';
    var roll = impl_ver1.util.Deterministic.hash01(seed);
    var ok = roll < rate;

    var prevF = match.forceGetVillageFriendly(vIdx, ruler.id());

    // 友好度加成：5~15（以 deterministic jitter）
    var gainSeed = 'village_trade_f_gain|t=${vIdx}|r=${match.roundNumber()}|m=${ruler.id()}|g=${gid}';
    var fGain = 5 + Std.int(Math.floor(impl_ver1.util.Deterministic.hash01(gainSeed) * 11)); // 5..15
    var nextF = Balance.clampInt(prevF + fGain, 0, 100);

    // 交易比例受友好度影響：友好度越高，同額金錢換到的糧食越多（ver1 先做簡化）
    // base 50，友好度 50 時不變；100 時 +20%；0 時 -20%
    var mult = 1.0 + (prevF - 50) / 50.0 * 0.20;
    if (mult < 0.80)
      mult = 0.80;
    if (mult > 1.20)
      mult = 1.20;
    var gainGrain = Std.int(Math.floor(50 * mult));

    // 成功才交換資源；失敗仍消耗體力，友好度不增加（但避免太懲罰，給 +1~3 微幅）
    if (ok) {
      ruler.reduceGold(costGold);
      ruler.grantGrain(gainGrain);
      match.forceSetVillageFriendly(vIdx, ruler.id(), nextF);
      // 歸順：90~100 → 領地化（每回合產出）
      if (nextF >= 90)
        match.forceSetVillageOwner(vIdx, ruler.id());
    } else {
      var micro = 1 + Std.int(Math.floor(roll * 3)); // 1..3
      match.forceSetVillageFriendly(vIdx, ruler.id(), Balance.clampInt(prevF + micro, 0, 100));
    }

    GeneralAssignmentApply.applyStaminaCost(gg, 10);
    var ownerNow = match.forceGetVillageOwner(vIdx);
    var ownerLine = ownerNow == null ? "" : '\n領地：已歸順（屬主 ${ownerNow}）';
    var title = ok ? "交易成功" : "交易失敗";
    var gainLine = ok ? ('\n獲得：糧食 +${gainGrain}\n消耗：金錢 -${costGold}') : "\n未完成交換（仍消耗體力）";
    var fNow = match.forceGetVillageFriendly(vIdx, ruler.id());
    match.pushInfoPopup(
      ruler.id(),
      title,
      game.PopupPayload.Plain('村落（格 ${vIdx}）交易\n武將：${gid}\n成功率：約 ${Std.int(Math.floor(rate * 100))}%（roll=${Std.int(Math.floor(roll * 100))}）${gainLine}\n友好度：${prevF} → ${fNow}${ownerLine}\n${gid} 體力 -10'),
      "village-trade"
    );
  }

  public function previewRows(actor:IPlayer):Array<IJiCeStagingPreviewRow> {
    var ruler = cast(match.activeMonarch(), Monarch);
    var rows:Array<IJiCeStagingPreviewRow> = [];
    var previews = GeneralAssignmentOps.previewForRosterWithRate(
      GeneralAssignmentKeys.VillageTrade,
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

