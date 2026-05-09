package impl_ver1.staging;

import game.GameIds;
import game.GeneralStat;
import game.IJiCeStagingPreviewRow;
import game.IPlayer;
import game.IPlayerMenu;
import game.IPlayerMenuNode;
import game.IStagingAction;
import game.MenuFormWidget;
import game.PlayerMenuKind;
import game.PopupPayload;
import game.ResourceReward;
import impl_ver1.core.GameMatchCore;
import impl_ver1.model.General;
import impl_ver1.model.Monarch;
import impl_ver1.model.PlayerMenu;
import impl_ver1.rules.GeneralAssignmentApply;
import impl_ver1.staging.SimpleStagingPreviewRow;
import game.GameError;
import game.MenuActivation;
import impl_ver1.jice.JiCeMenuSig;

/**
 * 資源格：指派武將加成（staging）。
 *
 * 規剘（ver1 骨架但可玩）：
 * - 需選 1 名麾下武將（單選）
 * - 扣體力 10
 * - 依資源類型取對應屬性計算加成（固定成功）
 */
class ResourceTileBoostStagingAction implements IStagingAction {
  final match:GameMatchCore;
  final tileIndex:TileIndex;
  final base:ResourceReward;

  public function new(match:GameMatchCore, tileIndex:TileIndex, base:ResourceReward) {
    this.match = match;
    this.tileIndex = tileIndex;
    this.base = base;
  }

  public function designLabel():String
    return "資源格加成";

  public function registryKey():String
    return "resource_tile_boost";

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
    var sig = JiCeMenuSig.make([
      registryKey(),
      "tile=" + Std.string(tileIndex),
      "generals=" + choices.map(c -> c.generalId).join(","),
    ]);
    var submit = match.createPlayerMenuEntry(PlayerMenuKind.StagingSubmit, "確認加成（體力 -10）", choices.length > 0, JiCeMenuSig.attach("resource_boost_ok", sig));
    var widgets:Array<MenuFormWidget> = [
      GeneralMultiPick("選擇指派武將（單選）", choices, defSel),
      Button(submit),
    ];
    var node = match.createPlayerMenuNode('資源格加成（格 $tileIndex）', null, [], widgets);
    return new PlayerMenu(actor, actor.monarchId() + "-resource-boost", [node]);
  }

  public function resolveChoice(actor:IPlayer, menuNode:IPlayerMenuNode):Void {
    var ruler = cast(match.activeMonarch(), Monarch);
    if (actor.monarchId() != ruler.id())
      throw new GameError("目前不是你的回合，無法指派武將加成。", "操作失敗", "resource-boost/actor");

    var gid = GeneralAssignmentApply.pickSingleGeneralId(menuNode.formWidgets());
    var token = MenuActivation.activatingEntry(menuNode).decisionToken();
    var gotSig = JiCeMenuSig.parseSig(token);
    var nowChoices:Array<game.MenuGeneralChoice> = [];
    for (g in ruler.roster())
      nowChoices.push({generalId: g.id(), caption: g.id()});
    var nowSig = JiCeMenuSig.make([
      registryKey(),
      "tile=" + Std.string(tileIndex),
      "generals=" + nowChoices.map(c -> c.generalId).join(","),
    ]);
    var sigMismatch = (gotSig != null && gotSig != nowSig);
    var gOk = false;
    for (c in nowChoices)
      if (c.generalId == gid) {
        gOk = true;
        break;
      }
    if (!gOk) {
      if (sigMismatch)
        throw JiCeMenuSig.stateChangedError("狀態已變更，請重新選擇資源格加成武將。", "resource-boost/state-changed");
      throw "ResourceTileBoostStagingAction: invalid-choice (sig matched) — menu/widget mismatch";
    }
    var g:General = GeneralAssignmentApply.requireOwnedGeneral(ruler, gid);

    var stat = resourceBoostStat(base);
    var statVal = generalStatValue(g, stat);
    var bonus = computeBonusAmount(base, statVal);

    var prevSt = g.stamina();
    GeneralAssignmentApply.applyStaminaCost(g, 10);
    var nextSt = g.stamina();

    // 套用：領 base + bonus（僅對應那一類資源）
    var grant = withBonus(base, bonus);
    if (grant.gold > 0)
      ruler.grantGold(grant.gold);
    if (grant.grain > 0)
      ruler.grantGrain(grant.grain);
    if (grant.troops > 0)
      ruler.grantTroops(grant.troops);

    match.pushOutboxPlain(
      ruler.id(),
      "資源格加成完成",
      PopupPayload.Plain(
        '格位 $tileIndex\n'
        + '指派武將：$gid（${Std.string(stat)}=$statVal，體力 ${prevSt}→${nextSt}）\n'
        + '基礎：金 ${base.gold}／糧 ${base.grain}／兵 ${base.troops}\n'
        + '加成：+$bonus\n'
        + '合計：金 ${grant.gold}／糧 ${grant.grain}／兵 ${grant.troops}'
      ),
      "resource-boost"
    );
  }

  public function previewRows(actor:IPlayer):Array<IJiCeStagingPreviewRow> {
    var ruler = cast(match.activeMonarch(), Monarch);
    var stat = resourceBoostStat(base);
    var rows:Array<IJiCeStagingPreviewRow> = [];
    for (x in ruler.roster()) {
      var g:General = cast x;
      var v = generalStatValue(g, stat);
      var bonus = computeBonusAmount(base, v);
      rows.push(new SimpleStagingPreviewRow(g.id(), '加成 +$bonus（${Std.string(stat)}=$v，體力-10）', 0));
    }
    return rows;
  }

  static function resourceBoostStat(base:ResourceReward):GeneralStat {
    if (base.gold > 0)
      return Stewardship;
    if (base.grain > 0)
      return Wit;
    return Command;
  }

  static function generalStatValue(g:General, s:GeneralStat):Int {
    return g.stat(s);
  }

  static function baseAmount(base:ResourceReward):Int {
    if (base.gold > 0)
      return base.gold;
    if (base.grain > 0)
      return base.grain;
    return base.troops;
  }

  static function withBonus(base:ResourceReward, bonus:Int):ResourceReward {
    if (base.gold > 0)
      return {gold: base.gold + bonus, grain: 0, troops: 0};
    if (base.grain > 0)
      return {gold: 0, grain: base.grain + bonus, troops: 0};
    return {gold: 0, grain: 0, troops: base.troops + bonus};
  }

  /**
   * ver1：加成 = base * (0.10 + stat/200)。
   * stat=0 → 10%；stat=100 → 60%。
   */
  static function computeBonusAmount(base:ResourceReward, statVal:Int):Int {
    var b = baseAmount(base);
    if (b <= 0)
      return 0;
    var rate = 0.10 + (statVal / 200.0);
    var v = Std.int(Math.floor(b * rate));
    if (v < 1)
      v = 1;
    return v;
  }
}

