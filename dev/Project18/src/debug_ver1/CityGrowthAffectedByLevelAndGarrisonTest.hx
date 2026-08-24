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
 * 對齊 GDD 2.1.7：成長率受城池等級與駐守武將能力影響（最小版）。
 * - 同一格 base growth 固定
 * - 無駐將/等級 Village：按 base 增長
 * - 提升等級 + 指派高能力駐將：增長應變大
 */
class CityGrowthAffectedByLevelAndGarrisonTest {
  public static function testCityGrowthAffectedByLevelAndGarrison(game:IGame):Void {
    // Case A：Village + 無駐將
    var gotBase = runOnce(game, CityLevel.Village, null);
    if (gotBase != 10)
      throw "CityGrowthAffectedByLevelAndGarrisonTest: expected base growth 10, got " + gotBase;

    // Case B：SmallCity + 高能力駐將
    var got = runOnce(game, CityLevel.SmallCity, "g-hi");
    // 對齊 docs/數值算法.md 6.1：
    // - 城池等級係數（SmallCity=1.3）
    // - 武將政治加成（Stewardship=100 → 1 + 1*0.3 = 1.3）
    // 期望至少 floor(10*1.3*1.3)=16
    if (got < 16)
      throw 'CityGrowthAffectedByLevelAndGarrisonTest: expected boosted growth >=16, got ' + got;

    trace("[CityGrowthAffectedByLevelAndGarrisonTest] OK — level and garrison affect growth");
  }

  static function runOnce(game:IGame, level:CityLevel, garrisonId:Null<GeneralId>):Int {
    var match:IGameMatch = game.createGameMatch(LevelKeys.EMPTY);
    match.forceSetFixedMoveDelta(1);
    match.createBoard([
      match.createTile(0, Plain),
      match.createTile(1, Start),
      match.createTile(2, City),
      match.createTile(3, Plain),
    ]);
    var idA:MonarchId = "m-a";
    match.createMonarch(idA, 0, 0, 0, 0);
    match.linkPlayerToMonarch(idA, match.createPlayer(idA, false));
    match.createGeneral("g-low", idA, 10, 10, 10, 10);
    match.createGeneral("g-hi", idA, 100, 10, 100, 100);
    var actor:IPlayer = match.playerForMonarch(idA);

    match.forceSetCityOwner(2, idA);
    match.forceSetCityLevel(2, level);
    match.forcePutCityStores(2, 0, 0);
    match.forcePutCityStoredGold(2, 0);
    match.forceSetTileGrowth(2, {gold: 10, grain: 10, troops: 10});
    if (garrisonId != null)
      match.forceAssignCityGarrison(2, garrisonId);
    var mon = cast(match.activeMonarch(), Monarch);
    mon.reducePrestige(100);

    var before = match.forceGetCityStoredGold(2);
    match.applyMenuLeaf(actor, MenuNodeQuery.requireNodeWithKind(match.createPlayerMenu(actor), PlayerMenuKind.Move));
    return match.forceGetCityStoredGold(2) - before;
  }
}

