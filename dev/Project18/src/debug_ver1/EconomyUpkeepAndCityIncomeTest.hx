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
    // 固定走 1 步，避免隨機骰點繞圈「經過起點」拿到額外獎勵（會影響 troops→upkeep）
    match.forceSetFixedMoveDelta(1);

    match.createBoard([
      match.createTile(0, Plain),
      match.createTile(1, City),
      match.createTile(2, Plain),
    ]);

    var idA:MonarchId = "m-a";
    // pawn 放在 1（城市格）再走 1 步到 2，避免「起點獎勵」干擾經濟斷言
    match.createMonarch(idA, 0, 1, 1000, 20);
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
    var grain1 = mon.grain();
    var gold1 = mon.gold();
    var expectGrain = g0 - 10 + 20; // +20 grain from SmallCity base income
    var expectGold = gold0 + 20;
    if (grain1 != expectGrain)
      throw 'EconomyUpkeepAndCityIncomeTest: expected grain=${expectGrain} (g0=${g0} -10 +20) but got ${grain1}';
    if (gold1 != expectGold)
      throw 'EconomyUpkeepAndCityIncomeTest: expected gold=${expectGold} (gold0=${gold0} +20) but got ${gold1}';

    trace("[EconomyUpkeepAndCityIncomeTest] OK — upkeep and city income at end of round");
  }
}

