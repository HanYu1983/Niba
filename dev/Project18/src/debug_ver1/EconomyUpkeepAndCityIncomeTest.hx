package debug_ver1;

import game.IGame;
import game.IGameMatch;
import game.IPlayer;
import game.MenuNodeQuery;
import game.PlayerMenuKind;
import game.TileKind;
import game.LevelKeys;
import game.GameIds;
import game.CityLevel;
import impl_ver1.model.Monarch;

/**
 * 骨架測試：回合末士兵耗糧 + 城池等級基本產出。
 */
class EconomyUpkeepAndCityIncomeTest {
  public static function testEconomyUpkeepAndCityIncome(game:IGame):Void {
    var match:IGameMatch = game.createGameMatch(LevelKeys.EMPTY);
    // 不需要移動；避免 0 觸發範圍檢查
    match.forceSetFixedMoveDelta(null);

    match.createBoard([
      match.createTile(0, Plain),
      match.createTile(1, City),
      match.createTile(2, Plain),
    ]);

    var idA:MonarchId = "m-a";
    match.createMonarch(idA, 0, 0, 1000, 20);
    match.createGeneral("g-a", idA, 10, 10, 10, 10);
    var actor:IPlayer = match.createPlayer(idA, "A");

    match.forceSetCityOwner(1, idA);
    match.forceSetCityLevel(1, CityLevel.SmallCity);

    var mon = cast(match.activeMonarch(), Monarch);
    mon.grantGold(0);

    var g0 = mon.grain();
    var gold0 = mon.gold();

    // 單人局：ConfirmDone 會立刻進入新回合並觸發回合末結算
    match.applyMenuLeaf(actor, MenuNodeQuery.requireNodeWithKind(match.createPlayerMenu(actor), PlayerMenuKind.Move));
    match.applyMenuLeaf(actor, MenuNodeQuery.requireNodeWithKind(match.createPlayerMenu(actor), PlayerMenuKind.LandingContinue));
    match.applyMenuLeaf(actor, MenuNodeQuery.requireNodeWithKind(match.createPlayerMenu(actor), PlayerMenuKind.ConfirmDone));

    // upkeep：1000 troops → ceil(1000*0.01)=10 grain
    if (mon.grain() != g0 - 10 + 20) // +20 grain from SmallCity base income
      throw "EconomyUpkeepAndCityIncomeTest: expected grain apply upkeep + city income";
    if (mon.gold() != gold0 + 20)
      throw "EconomyUpkeepAndCityIncomeTest: expected gold +20 from SmallCity income";

    trace("[EconomyUpkeepAndCityIncomeTest] OK — upkeep and city income at end of round");
  }
}

