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
    var submit:IPlayerMenuEntry = match.createPlayerMenuEntry(PlayerMenuKind.StagingSubmit, "確認開發", true, "v_dev_ok");
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
    var idx = match.forceGetPendingVillageTile();
    if (idx == null)
      throw new GameError("必須在拜訪村落時才能進行開發。", "操作失敗", "village-develop/pending");
    var owner = match.forceGetVillageOwner(idx);
    if (owner == null || owner != ruler.id())
      throw new GameError("只有我方已歸順的村落才能開發。", "操作失敗", "village-develop/not-owned");

    var gid = GeneralAssignmentApply.pickSingleGeneralId(menuNode.formWidgets());
    var g:General = GeneralAssignmentApply.requireOwnedGeneral(ruler, gid);

    var costGold = 25;
    var costGrain = 25;
    if (match.forceGetVillageStoredGold(idx) < costGold)
      throw new GameError('村落金庫不足（需要 ${costGold}）。', "資源不足", "village-develop/insufficient-gold");
    if (match.forceGetVillageStoredGrain(idx) < costGrain)
      throw new GameError('村落糧庫不足（需要 ${costGrain}）。', "資源不足", "village-develop/insufficient-grain");

    var pol = g.stat(Stewardship);
    var rate = 0.40 + (pol / 100.0) * 0.40 * Balance.staminaModifier(g.stamina());
    // TODO(num-algo): docs/數值算法.md 尚未定義「村落開發成功率」；此處先用 ver1 自訂公式（政治與體力修正），後續若文件補齊應抽到 Balance/資料表統一。
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

