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
import game.OutboxPayload;
import impl_ver1.rules.GeneralAssignmentOps;
import impl_ver1.rules.GeneralAssignmentKeys;
import impl_ver1.core.GameMatchCore;
import impl_ver1.model.Monarch;
import impl_ver1.model.General;
import impl_ver1.model.PlayerMenu;
import impl_ver1.rules.GeneralAssignmentApply;
import impl_ver1.util.Deterministic;
import game.CityLevel;
import game.GameError;
import game.MenuActivation;
import impl_ver1.jice.JiCeMenuSig;

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
      choices.push({generalId: gid});
      if (defSel.length == 0)
        defSel.push(gid);
    }
    // 由 menu 建構端先做「合法性」判斷：不合法就 disabled，AI/玩家都能共用同一套規則
    var idx = match.forceGetPendingFriendlyCityVisitTile();
    var costGold = 30;
    var costGrain = 20;
    var enabled =
      idx != null
      && choices.length > 0
      && match.forceGetCityStoredGold(idx) >= costGold
      && match.forceGetCityStoredGrain(idx) >= costGrain;
    var sig = JiCeMenuSig.make([
      registryKey(),
      "pending=" + (idx != null ? Std.string(idx) : "null"),
      "generals=" + choices.map(c -> c.generalId).join(","),
      "gold=" + (idx != null ? Std.string(match.forceGetCityStoredGold(idx)) : "na"),
      "grain=" + (idx != null ? Std.string(match.forceGetCityStoredGrain(idx)) : "na"),
    ]);
    var submit:IPlayerMenuEntry = match.createPlayerMenuEntry(PlayerMenuKind.StagingSubmit, "確認開發", enabled, JiCeMenuSig.attach("dev_ok", sig));
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
      throw new GameError("目前不是你的回合，無法執行開發。", "操作失敗", "friendly-city-develop/actor");
    var token = MenuActivation.activatingEntry(menuNode).decisionToken();
    var gotSig = JiCeMenuSig.parseSig(token);
    var idx = match.forceGetPendingFriendlyCityVisitTile();
    var nowChoices:Array<game.MenuGeneralChoice> = [];
    for (g in ruler.roster())
      nowChoices.push({generalId: g.id()});
    var nowSig = JiCeMenuSig.make([
      registryKey(),
      "pending=" + (idx != null ? Std.string(idx) : "null"),
      "generals=" + nowChoices.map(c -> c.generalId).join(","),
      "gold=" + (idx != null ? Std.string(match.forceGetCityStoredGold(idx)) : "na"),
      "grain=" + (idx != null ? Std.string(match.forceGetCityStoredGrain(idx)) : "na"),
    ]);
    var sigMismatch = (gotSig != null && gotSig != nowSig);
    if (idx == null) {
      if (sigMismatch)
        throw JiCeMenuSig.stateChangedError("狀態已變更，請重新開啟領地開發。", "friendly-city-develop/state-changed");
      throw "FriendlyCityDevelopStagingAction: pending missing (sig matched) — menu/widget mismatch";
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
        throw JiCeMenuSig.stateChangedError("狀態已變更，請重新選擇開發武將。", "friendly-city-develop/state-changed");
      throw "FriendlyCityDevelopStagingAction: invalid-choice (sig matched) — menu/widget mismatch";
    }
    var g:General = GeneralAssignmentApply.requireOwnedGeneral(ruler, gid);

    // 成本（最小版）：花費領地庫內 gold/grain（用城池儲備），並消耗體力
    var costGold = 30;
    var costGrain = 20;
    if (match.forceGetCityStoredGold(idx) < costGold) {
      if (sigMismatch)
        throw JiCeMenuSig.stateChangedError("狀態已變更，城池金庫不足。請重新開啟開發。", "friendly-city-develop/state-changed");
      throw "FriendlyCityDevelopStagingAction: insufficient-gold (sig matched) — menu/widget mismatch";
    }
    if (match.forceGetCityStoredGrain(idx) < costGrain) {
      if (sigMismatch)
        throw JiCeMenuSig.stateChangedError("狀態已變更，城池糧庫不足。請重新開啟開發。", "friendly-city-develop/state-changed");
      throw "FriendlyCityDevelopStagingAction: insufficient-grain (sig matched) — menu/widget mismatch";
    }

    // 成功率：政治 × 體力（deterministic 擲骰）
    var pol = g.stat(Stewardship);
    var rate = (pol / 100.0) * 0.60 * Balance.staminaModifier(g.stamina());
    if (rate < 0)
      rate = 0;
    if (rate > 1)
      rate = 1;
    var seed = 'dev|t=${idx}|r=${match.roundNumber()}|m=${ruler.id()}|g=${gid}';
    var roll = Deterministic.hash01(seed);
    var ok = roll < rate;

    // 扣成本（無論成敗都扣，避免洗）
    match.forcePutCityStoredGold(idx, match.forceGetCityStoredGold(idx) - costGold);
    match.forcePutCityStores(idx, match.forceGetCityStoredTroops(idx), match.forceGetCityStoredGrain(idx) - costGrain);
    GeneralAssignmentApply.applyStaminaCost(g, 15);

    var beforeLvl = match.forceGetCityLevel(idx);
    var afterLvl = beforeLvl;
    if (ok) {
      // docs/數值算法.md §10.1：開發成功 → 功績 +15
      g.grantMerit(15);
      // 成功：城池等級+1（上限 Capital）
      afterLvl = switch beforeLvl {
        case Village: SmallCity;
        case SmallCity: BigCity;
        case BigCity: Capital;
        case Capital: Capital;
      };
      match.forceSetCityLevel(idx, afterLvl);
    }

    var title = ok ? "開發成功" : "開發失敗";
    match.pushOutboxPlain(
      ruler.id(),
      title,
      OutboxPayload.FriendlyCityDevelopOutcome(
        ok,
        idx,
        gid,
        pol,
        Std.int(Math.floor(rate * 100)),
        costGold,
        costGrain,
        beforeLvl,
        afterLvl
      ),
      "friendly-develop"
    );
  }

  public function previewRows(actor:IPlayer):Array<IJiCeStagingPreviewRow> {
    var ruler = cast(match.activeMonarch(), Monarch);
    var rows:Array<IJiCeStagingPreviewRow> = [];
    var previews = GeneralAssignmentOps.previewForRosterWithRate(
      GeneralAssignmentKeys.FriendlyCityDevelop,
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

