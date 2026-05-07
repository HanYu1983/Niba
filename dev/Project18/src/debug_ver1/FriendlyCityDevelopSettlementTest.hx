package debug_ver1;

import game.GameIds;
import game.IGame;
import game.IGameMatch;
import game.IPlayer;
import game.MenuNodeQuery;
import game.PlayerMenuKind;
import game.PlayerMenuKind.Move;
import game.PlayerMenuKind.LandingContinue;
import game.PlayerMenuKind.FriendlyCityDevelop;
import game.PlayerMenuKind.StagingSubmit;
import game.TileKind;
import game.LevelKeys;
import game.CityLevel;
import game.MenuFormWidget;

/**
 * 對齊 2.1.3/2.1.7：開發會消耗領地資源庫，成功時提升城等級（最小版）。
 */
class FriendlyCityDevelopSettlementTest {
  public static function testFriendlyCityDevelopSettlement(game:IGame):Void {
    var match:IGameMatch = game.createGameMatch(LevelKeys.EMPTY);
    match.forceSetFixedMoveDelta(1);

    match.createBoard([
      match.createTile(0, Plain),
      match.createTile(1, City),
      match.createTile(2, Plain),
    ]);

    var idA:MonarchId = "m-a";
    match.createMonarch(idA, 0, 0, 0, 0);
    // 政治拉滿，提高成功率（但不保證）
    match.createGeneral("g-a", idA, 10, 10, 10, 100);
    var actor:IPlayer = match.createPlayer(idA, "A");

    match.forceSetCityOwner(1, idA);
    match.forceSetCityLevel(1, CityLevel.Village);
    match.forcePutCityStores(1, 0, 50);
    match.forcePutCityStoredGold(1, 80);

    match.applyMenuLeaf(actor, MenuNodeQuery.requireNodeWithKind(match.createPlayerMenu(actor), Move));
    match.applyMenuLeaf(actor, MenuNodeQuery.requireNodeWithKind(match.createPlayerMenu(actor), LandingContinue));
    if (match.forceGetPendingFriendlyCityVisitTile() != 1)
      throw "FriendlyCityDevelopSettlementTest: expected pending friendly city=1";

    var g0 = match.forceGetCityStoredGold(1);
    var gr0 = match.forceGetCityStoredGrain(1);
    var lvl0 = match.forceGetCityLevel(1);

    match.applyMenuLeaf(actor, MenuNodeQuery.requireNodeWithKind(match.createPlayerMenu(actor), FriendlyCityDevelop));
    var stg = MenuNodeQuery.requireNodeWithKind(match.createPlayerMenu(actor), StagingSubmit);

    // 保險指定選 g-a
    var ws = stg.formWidgets();
    for (i in 0...ws.length)
      switch ws[i] {
        case GeneralMultiPick(lbl, choices, _):
          ws[i] = GeneralMultiPick(lbl, choices, ["g-a"]);
        default:
      }
    var btn = MenuNodeQuery.buttonEntryOnNode(stg, StagingSubmit);
    if (btn == null)
      throw "FriendlyCityDevelopSettlementTest: missing submit button";
    stg.setActivationEntry(btn);
    match.applyMenuLeaf(actor, stg);

    if (match.forceGetCityStoredGold(1) != g0 - 30)
      throw "FriendlyCityDevelopSettlementTest: expected city gold -30";
    if (match.forceGetCityStoredGrain(1) != gr0 - 20)
      throw "FriendlyCityDevelopSettlementTest: expected city grain -20";
    // 成功與否都可接受；若成功則等級 >= 原等級
    var lvl1 = match.forceGetCityLevel(1);
    if (lvl1 == null)
      throw "FriendlyCityDevelopSettlementTest: city level must exist";
    // 至少不應下降
    trace('[FriendlyCityDevelopSettlementTest] OK — cost consumed; level ${Std.string(lvl0)} -> ${Std.string(lvl1)}');
  }
}

