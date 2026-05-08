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
import game.CityLevel;
import impl_ver1.core.GameMatchCore;
import impl_ver1.model.General;
import impl_ver1.model.Monarch;
import impl_ver1.model.PlayerMenu;
import impl_ver1.rules.GeneralAssignmentApply;
import impl_ver1.rules.GeneralAssignmentOps;
import impl_ver1.rules.GeneralAssignmentKeys;
import impl_ver1.util.Deterministic;
import game.GameError;
import game.MenuActivation;
import impl_ver1.jice.JiCeMenuSig;

/**
 * 我方村落開發（最小可用）：
 * - 需在踩到「我方已歸順村落」時使用
 * - 消耗村落領地資源庫（gold/grain）
 * - 政治（Stewardship）+ 體力決定成功率（deterministic）
 * - 成功則 _villageLevel 升級：Village → SmallCity → BigCity → Capital（封頂）
 */
class VillageDevelopStagingAction implements IStagingAction {
  final match:GameMatchCore;

  public function new(match:GameMatchCore) {
    this.match = match;
  }

  public function designLabel():String
    return "村落：開發";

  public function registryKey():String
    return "village_develop";

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
    // 由 menu 建構端先做「合法性」判斷：不合法就 disabled，AI/玩家都能共用同一套規則
    var idx = match.forceGetPendingVillageTile();
    var costGold = 25;
    var costGrain = 25;
    var enabled = false;
    if (idx != null) {
      var owner = match.forceGetVillageOwner(idx);
      enabled =
        owner != null
        && owner == ruler.id()
        && choices.length > 0
        && match.forceGetVillageStoredGold(idx) >= costGold
        && match.forceGetVillageStoredGrain(idx) >= costGrain;
    }
    var submit:IPlayerMenuEntry = match.createPlayerMenuEntry(PlayerMenuKind.StagingSubmit, "確認開發", enabled, "v_dev_ok");
    var sig = JiCeMenuSig.make([
      registryKey(),
      "pending=" + (idx != null ? Std.string(idx) : "null"),
      "owner=" + (idx != null && match.forceGetVillageOwner(idx) != null ? match.forceGetVillageOwner(idx) : "null"),
      "generals=" + choices.map(c -> c.generalId).join(","),
      "gold=" + (idx != null ? Std.string(match.forceGetVillageStoredGold(idx)) : "na"),
      "grain=" + (idx != null ? Std.string(match.forceGetVillageStoredGrain(idx)) : "na"),
    ]);
    submit = match.createPlayerMenuEntry(PlayerMenuKind.StagingSubmit, "確認開發", enabled, JiCeMenuSig.attach("v_dev_ok", sig));
    var widgets:Array<MenuFormWidget> = [
      GeneralMultiPick("選擇開發武將（單選）", choices, defSel),
      Button(submit),
    ];
    return new PlayerMenu(actor, actor.monarchId() + "-village-dev", [match.createPlayerMenuNode("村落開發", null, [], widgets)]);
  }

  public function resolveChoice(actor:IPlayer, menuNode:IPlayerMenuNode):Void {
    var ruler = cast(match.activeMonarch(), Monarch);
    if (actor.monarchId() != ruler.id())
      throw new GameError("目前不是你的回合，無法進行村落開發。", "操作失敗", "village-develop/actor");
    var token = MenuActivation.activatingEntry(menuNode).decisionToken();
    var gotSig = JiCeMenuSig.parseSig(token);
    var idx = match.forceGetPendingVillageTile();
    var nowChoices:Array<game.MenuGeneralChoice> = [];
    for (g in ruler.roster())
      nowChoices.push({generalId: g.id(), caption: g.id()});
    var owner = idx != null ? match.forceGetVillageOwner(idx) : null;
    var nowSig = JiCeMenuSig.make([
      registryKey(),
      "pending=" + (idx != null ? Std.string(idx) : "null"),
      "owner=" + (owner != null ? owner : "null"),
      "generals=" + nowChoices.map(c -> c.generalId).join(","),
      "gold=" + (idx != null ? Std.string(match.forceGetVillageStoredGold(idx)) : "na"),
      "grain=" + (idx != null ? Std.string(match.forceGetVillageStoredGrain(idx)) : "na"),
    ]);
    var sigMismatch = (gotSig != null && gotSig != nowSig);
    if (idx == null) {
      if (sigMismatch)
        throw JiCeMenuSig.stateChangedError("狀態已變更，請重新開啟村落開發。", "village-develop/state-changed");
      throw new GameError("必須在拜訪村落時才能進行開發。", "操作失敗", "village-develop/pending");
    }
    if (owner == null || owner != ruler.id()) {
      if (sigMismatch)
        throw JiCeMenuSig.stateChangedError("狀態已變更，村落不再屬於我方。", "village-develop/state-changed");
      throw new GameError("只有我方已歸順的村落才能開發。", "操作失敗", "village-develop/not-owned");
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
        throw JiCeMenuSig.stateChangedError("狀態已變更，請重新選擇開發武將。", "village-develop/state-changed");
      throw "VillageDevelopStagingAction: invalid-choice (sig matched) — menu/widget mismatch";
    }
    var g:General = GeneralAssignmentApply.requireOwnedGeneral(ruler, gid);

    var costGold = 25;
    var costGrain = 25;
    if (match.forceGetVillageStoredGold(idx) < costGold) {
      if (sigMismatch)
        throw JiCeMenuSig.stateChangedError("狀態已變更，村落金庫不足。請重新開啟開發。", "village-develop/state-changed");
      throw "VillageDevelopStagingAction: insufficient-gold (sig matched) — menu/widget mismatch";
    }
    if (match.forceGetVillageStoredGrain(idx) < costGrain) {
      if (sigMismatch)
        throw JiCeMenuSig.stateChangedError("狀態已變更，村落糧庫不足。請重新開啟開發。", "village-develop/state-changed");
      throw "VillageDevelopStagingAction: insufficient-grain (sig matched) — menu/widget mismatch";
    }

    var pol = g.stat(Stewardship);
    var rate = 0.40 + (pol / 100.0) * 0.40 * Balance.staminaModifier(g.stamina());
    // NOTE(num-algo): docs/數值算法.md 尚未定義「村落開發成功率」；
    // 目前先用 ver1 自訂公式（政治與體力修正），待文件補齊後再集中到 Balance/資料表統一。
    if (rate < 0)
      rate = 0;
    if (rate > 1)
      rate = 1;
    var roll = Deterministic.hash01('v_dev|t=${idx}|r=${match.roundNumber()}|m=${ruler.id()}|g=${gid}');
    var ok = roll < rate;

    // 扣成本（無論成敗都扣）
    match.forcePutVillageStores(
      idx,
      match.forceGetVillageStoredTroops(idx),
      match.forceGetVillageStoredGrain(idx) - costGrain,
      match.forceGetVillageStoredGold(idx) - costGold
    );
    GeneralAssignmentApply.applyStaminaCost(g, 12);

    var before = match.forceGetVillageLevel(idx);
    var after = before;
    if (ok) {
      // docs/數值算法.md §10.1：開發成功 → 功績 +15
      g.grantMerit(15);
      after = switch before {
        case Village: SmallCity;
        case SmallCity: BigCity;
        case BigCity: Capital;
        case Capital: Capital;
      };
      match.forceSetVillageLevel(idx, after);
    }
    match.pushInfoPopup(
      ruler.id(),
      ok ? "村落開發成功" : "村落開發失敗",
      game.PopupPayload.Plain(
        '村落格 ${idx}\n'
        + '武將：${gid}（政治=${pol}）\n'
        + '成功率：約 ${Std.int(Math.floor(rate * 100))}%\n'
        + '消耗：村落金 -${costGold}、村落糧 -${costGrain}、體力 -12\n'
        + (ok ? '等級：${Std.string(before)} → ${Std.string(after)}' : '等級：${Std.string(before)}（不變）')
      ),
      "village-develop"
    );
  }

  public function previewRows(actor:IPlayer):Array<IJiCeStagingPreviewRow> {
    var ruler = cast(match.activeMonarch(), Monarch);
    var rows:Array<IJiCeStagingPreviewRow> = [];
    var previews = GeneralAssignmentOps.previewForRosterWithRate(
      GeneralAssignmentKeys.VillageTrade, // 先借用 key（只用於統一預覽表；後續可新增專屬 key）
      ruler.roster(),
      Stewardship,
      12,
      g -> {
        var pol = g.stat(Stewardship);
        return 0.40 + (pol / 100.0) * 0.40 * Balance.staminaModifier(g.stamina());
      },
      (_, rate) -> '成功率約 ${Std.int(Math.floor(rate * 100))}%｜成本：村落金25+糧25｜體力-12'
    );
    for (p in previews)
      rows.push(new SimpleStagingPreviewRow(p.generalId, p.summary, 0));
    return rows;
  }
}

