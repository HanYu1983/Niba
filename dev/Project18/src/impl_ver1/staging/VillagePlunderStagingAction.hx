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
import game.OutboxPayload;
import impl_ver1.rules.GeneralAssignmentOps;
import impl_ver1.rules.GeneralAssignmentKeys;
import impl_ver1.core.GameMatchCore;
import impl_ver1.model.Monarch;
import impl_ver1.model.General;
import impl_ver1.model.PlayerMenu;
import game.GameError;
import game.MenuActivation;
import impl_ver1.jice.JiCeMenuSig;

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
      choices.push({generalId: gid});
      if (defSel.length == 0)
        defSel.push(gid);
    }
    var plunderConfirm:MenuClientConfirm = {title: "確認搶奪", message: "搶奪會大幅降低村落友好度。確定要執行嗎？"};
    // menu 建構端先做合法性：需有 pending village、至少 1 名武將
    var vIdx = match.forceGetPendingVillageTile();
    var enabled = vIdx != null && choices.length > 0;
    var sig = JiCeMenuSig.make([
      registryKey(),
      "pending=" + (vIdx != null ? Std.string(vIdx) : "null"),
      "generals=" + choices.map(c -> c.generalId).join(","),
    ]);
    var submit:IPlayerMenuEntry = match.createPlayerMenuEntry(PlayerMenuKind.StagingSubmit, "確認搶奪", enabled, JiCeMenuSig.attach("plunder_ok", sig), plunderConfirm);
    var widgets:Array<MenuFormWidget> = [
      GeneralMultiPick("選擇搶奪武將（單選）", choices, defSel),
      Button(submit),
    ];
    var node = match.createPlayerMenuNode("搶奪", null, [], widgets);
    return new PlayerMenu(actor, actor.monarchId() + "-village-plunder", [node]);
  }

  public function resolveChoice(actor:IPlayer, menuNode:IPlayerMenuNode):Void {
    var ruler = cast(match.activeMonarch(), Monarch);
    if (actor.monarchId() != ruler.id())
      throw new GameError("目前不是你的回合，無法搶奪。", "操作失敗", "village-plunder/actor");
    var token = MenuActivation.activatingEntry(menuNode).decisionToken();
    var gotSig = JiCeMenuSig.parseSig(token);
    var vIdx = match.forceGetPendingVillageTile();
    var nowChoices:Array<game.MenuGeneralChoice> = [];
    for (g in ruler.roster())
      nowChoices.push({generalId: g.id()});
    var nowSig = JiCeMenuSig.make([
      registryKey(),
      "pending=" + (vIdx != null ? Std.string(vIdx) : "null"),
      "generals=" + nowChoices.map(c -> c.generalId).join(","),
    ]);
    var sigMismatch = (gotSig != null && gotSig != nowSig);
    if (vIdx == null) {
      if (sigMismatch)
        throw JiCeMenuSig.stateChangedError("狀態已變更，請重新開啟村落搶奪。", "village-plunder/state-changed");
      throw "VillagePlunderStagingAction: pending missing (sig matched) — menu/widget mismatch";
    }
    var gid = impl_ver1.rules.GeneralAssignmentApply.pickSingleGeneralId(menuNode.formWidgets());
    var gOk = false;
    for (c in nowChoices)
      if (c.generalId == gid) {
        gOk = true;
        break;
      }
    if (!gOk) {
      if (sigMismatch)
        throw JiCeMenuSig.stateChangedError("狀態已變更，請重新選擇搶奪武將。", "village-plunder/state-changed");
      throw "VillagePlunderStagingAction: invalid-choice (sig matched) — menu/widget mismatch";
    }
    var g = impl_ver1.rules.GeneralAssignmentApply.requireOwnedGeneral(ruler, gid);

    // GDD 2.1.3：低成功率，高效果；武力影響；友好度 -20~-40（劇烈下降）
    // 對齊 GDD：搶奪成功時立即獲得村落「儲存資源」（ver1：把村落儲備全數掠走）。
    var might = g.stat(Might);
    var rate = 0.30 + (might / 100.0) * 0.20 * Balance.staminaModifier(g.stamina());
    if (rate < 0)
      rate = 0;
    if (rate > 1)
      rate = 1;

    var seed = 'village_plunder|t=${vIdx}|r=${match.roundNumber()}|m=${ruler.id()}|g=${gid}';
    var roll = impl_ver1.util.Deterministic.hash01(seed);
    var ok = roll < rate;

    // docs/數值算法.md 7.1：搶奪（村落）→ 聲望 -5~10（可重現；無論成敗皆屬負面行為）
    var pSeed = 'prestige|village_plunder|t=${vIdx}|r=${match.roundNumber()}|m=${ruler.id()}|g=${gid}';
    var pLoss = 5 + Std.int(Math.floor(impl_ver1.util.Deterministic.hash01(pSeed) * 6)); // 5..10
    ruler.reducePrestige(pLoss);

    var prevF = match.forceGetVillageFriendly(vIdx, ruler.id());
    var lossSeed = 'village_plunder_f_loss|t=${vIdx}|r=${match.roundNumber()}|m=${ruler.id()}|g=${gid}';
    var fLoss = 20 + Std.int(Math.floor(impl_ver1.util.Deterministic.hash01(lossSeed) * 21)); // 20..40
    var nextF = Balance.clampInt(prevF - (ok ? fLoss : 10), 0, 100); // 失敗也 -10（GDD 只寫攻占失敗-10，但搶奪失敗亦應惡化）
    match.forceSetVillageFriendly(vIdx, ruler.id(), nextF);

    // 高效果：成功時獲取村落儲備資源
    var gainGold = 0;
    var gainGrain = 0;
    var gainTroops = 0;
    if (ok) {
      // docs/數值算法.md §10.1：搶奪成功 → 功績 +10
      g.grantMerit(10);
      gainGold = match.forceGetVillageStoredGold(vIdx);
      gainGrain = match.forceGetVillageStoredGrain(vIdx);
      gainTroops = match.forceGetVillageStoredTroops(vIdx);
      ruler.grantGold(gainGold);
      ruler.grantGrain(gainGrain);
      ruler.grantTroops(gainTroops);
      match.forcePutVillageStores(vIdx, 0, 0, 0);
    }

    impl_ver1.rules.GeneralAssignmentApply.applyStaminaCost(g, 12);

    var title = ok ? "搶奪成功" : "搶奪失敗";
    match.pushOutboxPlain(
      ruler.id(),
      title,
      OutboxPayload.VillagePlunderOutcome(
        ok,
        vIdx,
        gid,
        Std.int(Math.floor(rate * 100)),
        gainGold,
        gainGrain,
        gainTroops,
        prevF,
        nextF,
        pLoss
      ),
      "village-plunder"
    );
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

