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
import impl_ver1.rules.GeneralAssignmentOps;
import impl_ver1.rules.GeneralAssignmentKeys;
import impl_ver1.core.GameMatchCore;
import impl_ver1.model.Monarch;
import impl_ver1.model.General;
import impl_ver1.model.PlayerMenu;
import impl_ver1.rules.GeneralAssignmentApply;
import impl_ver1.util.Deterministic;
import game.CityLevel;

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
      choices.push({generalId: gid, caption: gid});
      if (defSel.length == 0)
        defSel.push(gid);
    }
    var submit:IPlayerMenuEntry = match.createPlayerMenuEntry(PlayerMenuKind.StagingSubmit, "確認開發", true, "dev_ok");
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
      throw "FriendlyCityDevelopStagingAction: actor must be active monarch";
    var idx = match.forceGetPendingFriendlyCityVisitTile();
    if (idx == null)
      throw "FriendlyCityDevelopStagingAction: no pending friendly city visit";

    var gid = GeneralAssignmentApply.pickSingleGeneralId(menuNode.formWidgets());
    var g:General = GeneralAssignmentApply.requireOwnedGeneral(ruler, gid);

    // 成本（最小版）：花費領地庫內 gold/grain（用城池儲備），並消耗體力
    var costGold = 30;
    var costGrain = 20;
    if (match.forceGetCityStoredGold(idx) < costGold)
      throw "FriendlyCityDevelopStagingAction: insufficient city gold store";
    if (match.forceGetCityStoredGrain(idx) < costGrain)
      throw "FriendlyCityDevelopStagingAction: insufficient city grain store";

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
    match.pushInfoPopup(
      ruler.id(),
      title,
      game.PopupPayload.Plain(
        '城池格 ${idx}\n'
        + '武將：${gid}（政治=${pol}）\n'
        + '成功率：約 ${Std.int(Math.floor(rate * 100))}%\n'
        + '消耗：城池金 -${costGold}、城池糧 -${costGrain}、體力 -15\n'
        + (ok ? '城等級：${Std.string(beforeLvl)} → ${Std.string(afterLvl)}' : '城等級：${Std.string(beforeLvl)}（不變）')
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

