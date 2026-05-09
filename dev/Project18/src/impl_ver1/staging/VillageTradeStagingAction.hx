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
import game.PopupPayload;
import impl_ver1.rules.GeneralAssignmentOps;
import impl_ver1.rules.GeneralAssignmentApply;
import impl_ver1.rules.GeneralAssignmentKeys;
import impl_ver1.core.GameMatchCore;
import impl_ver1.model.Monarch;
import impl_ver1.model.General;
import impl_ver1.model.PlayerMenu;
import game.GameError;
import game.MenuActivation;
import impl_ver1.jice.JiCeMenuSig;

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
    // menu 建構端先做合法性：需有 pending village、至少 1 名武將、且金錢足夠
    var vIdx = match.forceGetPendingVillageTile();
    var costGold = 20;
    var enabled = vIdx != null && choices.length > 0 && ruler.gold() >= costGold;
    var sig = JiCeMenuSig.make([
      registryKey(),
      "pending=" + (vIdx != null ? Std.string(vIdx) : "null"),
      "generals=" + choices.map(c -> c.generalId).join(","),
      "gold=" + Std.string(ruler.gold()),
    ]);
    var submit:IPlayerMenuEntry = match.createPlayerMenuEntry(PlayerMenuKind.StagingSubmit, "確認交易", enabled, JiCeMenuSig.attach("trade_ok", sig), tradeConfirm);
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
    var token = MenuActivation.activatingEntry(menuNode).decisionToken();
    var gotSig = JiCeMenuSig.parseSig(token);
    var vIdx = match.forceGetPendingVillageTile();
    var nowChoices:Array<game.MenuGeneralChoice> = [];
    for (g in ruler.roster())
      nowChoices.push({generalId: g.id(), caption: g.id()});
    var nowSig = JiCeMenuSig.make([
      registryKey(),
      "pending=" + (vIdx != null ? Std.string(vIdx) : "null"),
      "generals=" + nowChoices.map(c -> c.generalId).join(","),
      "gold=" + Std.string(ruler.gold()),
    ]);
    var sigMismatch = (gotSig != null && gotSig != nowSig);
    if (vIdx == null) {
      if (sigMismatch)
        throw JiCeMenuSig.stateChangedError("狀態已變更，請重新開啟村落交易。", "village-trade/state-changed");
      throw "VillageTradeStagingAction: pending missing (sig matched) — menu/widget mismatch";
    }
    var gid = GeneralAssignmentApply.pickSingleGeneralId(menuNode.formWidgets());
    var gOk = false;
    for (c in nowChoices)
      if (c.generalId == gid) {
        gOk = true;
        break;
      }
    if (!gOk) {
      if (sigMismatch)
        throw JiCeMenuSig.stateChangedError("狀態已變更，請重新選擇交易武將。", "village-trade/state-changed");
      throw "VillageTradeStagingAction: invalid-choice (sig matched) — menu/widget mismatch";
    }

    // 真結算線（對齊 GDD 2.1.3）：
    // - 需要指派武將、消耗體力
    // - 成功率由政治（stewardship）與體力決定，採 deterministic 擲骰以利測試可重現
    // - 成功後資源交換為「低效果」；交易比例受友好度影響（友好度越高越優惠）
    // - 友好度提升 +5~15（依交易規模；ver1 先以固定規模 + jitter）
    // NOTE(num-algo): 交易成功率對齊 docs/數值算法.md §5.1；
    // 但交易規模/交換公式目前仍為 ver1 簡化版（文件未提供完整換算表時先保持可玩）。
    var costGold = 20;
    if (ruler.gold() < costGold) {
      if (sigMismatch)
        throw JiCeMenuSig.stateChangedError("狀態已變更，金錢不足。請重新開啟交易。", "village-trade/state-changed");
      throw "VillageTradeStagingAction: insufficient-gold (sig matched) — menu/widget mismatch";
    }

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
      // docs/數值算法.md §10.1：交易成功 → 功績 +5
      gg.grantMerit(5);
      // docs/數值算法.md 7.1：交易（村落）→ 聲望 +2~5（可重現）
      var pSeed = 'prestige|village_trade|t=${vIdx}|r=${match.roundNumber()}|m=${ruler.id()}|g=${gid}';
      var pGain = 2 + Std.int(Math.floor(impl_ver1.util.Deterministic.hash01(pSeed) * 4)); // 2..5
      ruler.grantPrestige(pGain);

      ruler.reduceGold(costGold);
      ruler.grantGrain(gainGrain);
      match.forceSetVillageFriendly(vIdx, ruler.id(), nextF);
      // 歸順：90~100 → 領地化（每回合產出）
      if (nextF >= 90) {
        var prevOwner = match.forceGetVillageOwner(vIdx);
        match.forceSetVillageOwner(vIdx, ruler.id());
        // docs/數值算法.md 7.1：歸順村落 → 聲望 +10（僅首次歸屬時）
        if (prevOwner == null)
          ruler.grantPrestige(10);
      }
    } else {
      var micro = 1 + Std.int(Math.floor(roll * 3)); // 1..3
      match.forceSetVillageFriendly(vIdx, ruler.id(), Balance.clampInt(prevF + micro, 0, 100));
    }

    GeneralAssignmentApply.applyStaminaCost(gg, 10);
    var ownerNow = match.forceGetVillageOwner(vIdx);
    var title = ok ? "交易成功" : "交易失敗";
    var fNow = match.forceGetVillageFriendly(vIdx, ruler.id());
    match.pushOutboxPlain(
      ruler.id(),
      title,
      PopupPayload.VillageTradeOutcome(
        ok,
        vIdx,
        gid,
        Std.int(Math.floor(rate * 100)),
        Std.int(Math.floor(roll * 100)),
        ok ? costGold : 0,
        ok ? gainGrain : 0,
        prevF,
        fNow,
        ownerNow
      ),
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

