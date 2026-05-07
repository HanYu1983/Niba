package debug_ver1;

import game.GameIds;
import game.IGame;
import game.IGameMatch;
import game.IPlayer;
import game.MenuNodeQuery;
import game.PlayerMenuKind;
import game.LevelKeys;
import game.TileKind;
import impl_ver1.model.Monarch;

/**
 * 對齊 GDD 2.1.3：村落歸順成為領地後，每回合產出資源（ver1 先用 CityLevel.Village 基本產出）。
 */
class VillageIncomeAtEndOfRoundTest {
  public static function testVillageIncomeAtEndOfRound(game:IGame):Void {
    var match:IGameMatch = game.createGameMatch(LevelKeys.EMPTY);
    match.forceSetFixedMoveDelta(1);

    match.createBoard([
      match.createTile(0, Plain),
      match.createTile(1, Village),
      match.createTile(2, Plain),
    ]);

    var idA:MonarchId = "m-a";
    // pawn 放在 2，走 1 步落在 0（Plain），避免踩到 Village 觸發 pendingVillage 而看不到 ConfirmDone
    match.createMonarch(idA, 0, 2, 0, 0);
    match.createGeneral("g-a", idA, 10, 10, 10, 10);
    var actor:IPlayer = match.createPlayer(idA, "A");

    // 直接標記村落歸順
    match.forceSetVillageOwner(1, idA);

    var mon = cast(match.activeMonarch(), Monarch);
    var g0 = mon.gold();
    var gr0 = mon.grain();

    // 單人局：ConfirmDone 會觸發回合結算
    match.applyMenuLeaf(actor, MenuNodeQuery.requireNodeWithKind(match.createPlayerMenu(actor), PlayerMenuKind.Move));
    match.applyMenuLeaf(actor, MenuNodeQuery.requireNodeWithKind(match.createPlayerMenu(actor), PlayerMenuKind.LandingContinue));
    match.applyMenuLeaf(actor, MenuNodeQuery.requireNodeWithKind(match.createPlayerMenu(actor), PlayerMenuKind.ConfirmDone));

    // Balance.cityBaseIncome(Village) = {gold:10, grain:10}
    if (mon.gold() != g0 + 10)
      throw "VillageIncomeAtEndOfRoundTest: expected gold +10";
    if (mon.grain() != gr0 + 10)
      throw "VillageIncomeAtEndOfRoundTest: expected grain +10";

    trace("[VillageIncomeAtEndOfRoundTest] OK — surrendered village produces income");
  }
}

