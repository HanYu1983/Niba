package debug_ver1;

import game.IGame;
import game.IGameMatch;
import game.IPlayer;
import game.MenuNodeQuery;
import game.PlayerMenuKind;
import game.TileKind;
import game.LevelKeys;
import game.GameIds;
import impl_ver1.model.Monarch;

/**
 * 骨架測試：新增 Resource 格子後，落地會立即結算並改變資源。
 */
class ResourceTileSettlementTest {
  public static function testResourceTileSettlement(game:IGame):Void {
    var match:IGameMatch = game.createGameMatch(LevelKeys.EMPTY);
    match.forceSetFixedMoveDelta(1);

    match.createBoard([
      match.createTile(0, Plain),
      match.createTile(1, Resource),
      match.createTile(2, Plain),
    ]);

    var idA:MonarchId = "m-a";
    match.createMonarch(idA, 0, 0, 0, 0);
    match.createGeneral("g-a", idA, 10, 10, 10, 10);
    var actor:IPlayer = match.createPlayer(idA, "A");

    var ruler = cast(match.activeMonarch(), Monarch);
    var g0 = ruler.gold();
    var gr0 = ruler.grain();

    match.applyMenuLeaf(actor, MenuNodeQuery.requireNodeWithKind(match.createPlayerMenu(actor), PlayerMenuKind.Move));
    match.applyMenuLeaf(actor, MenuNodeQuery.requireNodeWithKind(match.createPlayerMenu(actor), PlayerMenuKind.LandingContinue));

    if (ruler.pawnIndex() != 1)
      throw "ResourceTileSettlementTest: expected landing at 1";
    if (ruler.gold() != g0 + 30)
      throw "ResourceTileSettlementTest: gold should +30";
    if (ruler.grain() != gr0 + 30)
      throw "ResourceTileSettlementTest: grain should +30";

    trace("[ResourceTileSettlementTest] OK — resource tile settles immediately");
  }
}

