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
 * 資源格測試：落地後進入 pending，需由選單「領取」或「指派加成」結算。
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
    var t0 = ruler.troops();

    match.applyMenuLeaf(actor, MenuNodeQuery.requireNodeWithKind(match.createPlayerMenu(actor), PlayerMenuKind.Move));
    match.applyMenuLeaf(actor, MenuNodeQuery.requireNodeWithKind(match.createPlayerMenu(actor), PlayerMenuKind.LandingContinue));

    if (ruler.pawnIndex() != 1)
      throw "ResourceTileSettlementTest: expected landing at 1";
    if (match.forceGetPendingResourceTile() != 1)
      throw "ResourceTileSettlementTest: expected pendingResource at 1";
    if (ruler.gold() != g0 || ruler.grain() != gr0 || ruler.troops() != t0)
      throw "ResourceTileSettlementTest: resources should not change before claim";

    var claimNode = MenuNodeQuery.requireNodeWithKind(match.createPlayerMenu(actor), PlayerMenuKind.ResourceClaim);
    var claimEntry = MenuNodeQuery.buttonEntryOnNode(claimNode, PlayerMenuKind.ResourceClaim);
    if (claimEntry == null)
      throw "ResourceTileSettlementTest: missing claim entry";
    claimNode.setActivationEntry(claimEntry);
    match.applyMenuLeaf(actor, claimNode);
    if (ruler.gold() == g0 && ruler.grain() == gr0 && ruler.troops() == t0)
      throw "ResourceTileSettlementTest: expected some resource gain after claim";

    trace("[ResourceTileSettlementTest] OK — resource tile pending → claim settles");
  }
}

