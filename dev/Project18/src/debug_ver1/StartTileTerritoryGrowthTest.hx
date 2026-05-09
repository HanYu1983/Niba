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
 * ver1 目前以「每格成長率（TileGrowth）」作為成長量，並寫入領地資源庫。
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
    match.createPlayer(idA, idA, false);
    match.createGeneral("g-a", idA, 10, 10, 10, 10);
    var actor:IPlayer = match.playerForMonarch(idA);

    // 設置城池領地（本測試不依城等級；直接 forceSetTileGrowth）
    match.forceSetCityOwner(2, idA);
    // 設為 Village，避免等級倍率影響斷言（等級倍率另有專門測試）
    match.forceSetCityLevel(2, CityLevel.Village);
    match.forcePutCityStores(2, 0, 0);
    match.forcePutCityStoredGold(2, 0);
    match.forceSetTileGrowth(2, {gold: 9, grain: 8, troops: 7});

    var mon = cast(match.activeMonarch(), Monarch);
    // 壓低聲望到 0：Start tile reward 對齊 docs/數值算法.md 7.2 固定 +100 gold（避免高聲望分支干擾）
    mon.reducePrestige(100);

    var gold0 = mon.gold();
    var cityGr0 = match.forceGetCityStoredGrain(2);
    var cityGold0 = match.forceGetCityStoredGold(2);
    var cityTroop0 = match.forceGetCityStoredTroops(2);

    match.applyMenuLeaf(actor, MenuNodeQuery.requireNodeWithKind(match.createPlayerMenu(actor), PlayerMenuKind.Move));
    // 不需要 LandingContinue 才能拿到「經過起點」的效果（移動過程每步落地即結算）

    // Start reward: +100 gold（低聲望）
    // Territory growth: 寫入領地資源庫（城池儲備）
    if (mon.gold() != gold0 + 100)
      throw "StartTileTerritoryGrowthTest: expected gold +100 (start only)";
    if (match.forceGetCityStoredGold(2) != cityGold0 + 9)
      throw "StartTileTerritoryGrowthTest: expected city gold store +9";
    if (match.forceGetCityStoredGrain(2) != cityGr0 + 8)
      throw "StartTileTerritoryGrowthTest: expected city grain store +8";
    if (match.forceGetCityStoredTroops(2) != cityTroop0 + 7)
      throw "StartTileTerritoryGrowthTest: expected city troops store +7";

    trace("[StartTileTerritoryGrowthTest] OK — pass Start triggers territory growth");
  }
}

