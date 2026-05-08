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
 * 對齊 2.1.7：村落等級（villageLevel）會影響成長倍率（起點觸發）。
 * - base growth 固定
 * - Village 等級：倍率 1.0
 * - BigCity 等級：倍率 1.6（對齊 docs/數值算法.md 6.1）
 */
class VillageGrowthAffectedByLevelTest {
  public static function testVillageGrowthAffectedByLevel(game:IGame):Void {
    // Case A: Village
    var a = runOnce(game, CityLevel.Village);
    if (a.goldInc != 10 || a.grainInc != 10 || a.troopInc != 10)
      throw 'VillageGrowthAffectedByLevelTest: expected base 10/10/10, got ${a.goldInc}/${a.grainInc}/${a.troopInc}';

    // Case B: BigCity => floor(10*1.6)=16
    var b = runOnce(game, CityLevel.BigCity);
    if (b.goldInc != 16 || b.grainInc != 16 || b.troopInc != 16)
      throw 'VillageGrowthAffectedByLevelTest: expected 16/16/16, got ${b.goldInc}/${b.grainInc}/${b.troopInc}';

    trace("[VillageGrowthAffectedByLevelTest] OK — village level affects growth multiplier");
  }

  static function runOnce(game:IGame, level:CityLevel):{goldInc:Int, grainInc:Int, troopInc:Int} {
    var match:IGameMatch = game.createGameMatch(LevelKeys.EMPTY);
    match.forceSetFixedMoveDelta(1);

    match.createBoard([
      match.createTile(0, Plain),
      match.createTile(1, Start),
      match.createTile(2, Village),
      match.createTile(3, Plain),
    ]);

    var idA:MonarchId = "m-a";
    // pawn 0 -> 1(Start) 觸發領地成長
    match.createMonarch(idA, 0, 0, 0, 0);
    match.createGeneral("g-a", idA, 10, 10, 10, 10);
    var actor:IPlayer = match.createPlayer(idA, "A");
    var mon = cast(match.activeMonarch(), Monarch);
    mon.reducePrestige(100); // 避免高聲望分支干擾（只測領地成長，不測獎勵）

    match.forceSetVillageOwner(2, idA);
    match.forceSetVillageLevel(2, level);
    match.forcePutVillageStores(2, 0, 0, 0);
    match.forceSetTileGrowth(2, {gold: 10, grain: 10, troops: 10});

    var g0 = match.forceGetVillageStoredGold(2);
    var gr0 = match.forceGetVillageStoredGrain(2);
    var t0 = match.forceGetVillageStoredTroops(2);

    match.applyMenuLeaf(actor, MenuNodeQuery.requireNodeWithKind(match.createPlayerMenu(actor), PlayerMenuKind.Move));

    return {
      goldInc: match.forceGetVillageStoredGold(2) - g0,
      grainInc: match.forceGetVillageStoredGrain(2) - gr0,
      troopInc: match.forceGetVillageStoredTroops(2) - t0,
    };
  }
}

