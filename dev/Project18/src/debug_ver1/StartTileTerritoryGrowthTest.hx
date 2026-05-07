package debug_ver1;

import game.GameIds;
import game.IGame;
import game.IGameMatch;
import game.IPlayer;
import game.MenuNodeQuery;
import game.PlayerMenuKind;
import game.LevelKeys;
import game.TileKind;
import game.CityLevel;
import impl_ver1.model.Monarch;

/**
 * 對齊 GDD 2.1.12：經過起點時，領地資源成長一次（最小版）。
 * ver1 目前以 Balance.cityBaseIncome(level) 作為成長量。
 */
class StartTileTerritoryGrowthTest {
  public static function testStartTileTerritoryGrowth(game:IGame):Void {
    var match:IGameMatch = game.createGameMatch(LevelKeys.EMPTY);
    // 走 1 步：0(Plain) -> 1(Start) 觸發 onPassStartTile
    match.forceSetFixedMoveDelta(1);

    match.createBoard([
      match.createTile(0, Plain),
      match.createTile(1, Start),
      match.createTile(2, City),
      match.createTile(3, Plain),
    ]);

    var idA:MonarchId = "m-a";
    match.createMonarch(idA, 0, 0, 0, 0);
    match.createGeneral("g-a", idA, 10, 10, 10, 10);
    var actor:IPlayer = match.createPlayer(idA, "A");

    // 設置城池領地（SmallCity → baseIncome 20/20）
    match.forceSetCityOwner(2, idA);
    match.forceSetCityLevel(2, CityLevel.SmallCity);
    match.forcePutCityStores(2, 0, 0);

    var mon = cast(match.activeMonarch(), Monarch);
    // 壓低聲望到 0：Start tile reward 固定 +50 gold（避免高聲望分支干擾）
    mon.reducePrestige(100);

    var gold0 = mon.gold();
    var cityGr0 = match.forceGetCityStoredGrain(2);

    match.applyMenuLeaf(actor, MenuNodeQuery.requireNodeWithKind(match.createPlayerMenu(actor), PlayerMenuKind.Move));
    // 不需要 LandingContinue 才能拿到「經過起點」的效果（移動過程每步落地即結算）

    // Start reward: +50 gold
    // Territory growth: +20 gold to monarch, +20 grain into city store
    if (mon.gold() != gold0 + 50 + 20)
      throw "StartTileTerritoryGrowthTest: expected gold +70 (start+growth)";
    if (match.forceGetCityStoredGrain(2) != cityGr0 + 20)
      throw "StartTileTerritoryGrowthTest: expected city grain store +20";

    trace("[StartTileTerritoryGrowthTest] OK — pass Start triggers territory growth");
  }
}

