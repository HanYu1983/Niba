package debug_ver1;

import game.GameIds;
import game.IGame;
import game.IGameMatch;
import game.IPlayer;
import game.MenuNodeQuery;
import game.PlayerMenuKind;
import game.TileKind;
import game.LevelKeys;
import impl_ver1.model.Monarch;

/**
 * 事件規避流程測試（GDD 2.1.9 對齊）：
 * - 負面事件時會出現「事件規避（可選）」節點
 * - 嘗試規避會消耗體力並寫入 effect multiplier（成功時）
 * - 事件本體仍可繼續結算（本測試走 accept）
 */
class TileEventAvoidanceMenuFlowTest {
  public static function testTileEventAvoidanceMenuFlow(game:IGame):Void {
    var match:IGameMatch = game.createGameMatch(LevelKeys.EMPTY);
    match.forceSetFixedMoveDelta(1);

    match.createBoard([
      match.createTile(0, Plain),
      match.createTile(1, Event),
      match.createTile(2, Plain),
    ]);

    var idA:MonarchId = "m-a";
    match.createMonarch(idA, 0, 0, 0, 0);
    match.createGeneral("g-a", idA, 10, 10, 10, 10);
    var actor:IPlayer = match.createPlayer(idA, "A");

    // 綁定負面事件：糧倉失火（基礎損失 100）
    match.forceBindTileEvent(1, new GranaryFireAvoidableTileEvent(match, 100));

    var ruler = cast(match.activeMonarch(), Monarch);
    var st0 = ruler.roster()[0].stamina();

    match.applyMenuLeaf(actor, MenuNodeQuery.requireNodeWithKind(match.createPlayerMenu(actor), PlayerMenuKind.Move));
    match.applyMenuLeaf(actor, MenuNodeQuery.requireNodeWithKind(match.createPlayerMenu(actor), PlayerMenuKind.LandingContinue));

    // 事件規避節點存在且可按
    var avoidNode = MenuNodeQuery.requireNodeWithKind(match.createPlayerMenu(actor), PlayerMenuKind.TileEventAvoidAttempt);
    var avoidEntry = MenuNodeQuery.buttonEntryOnNode(avoidNode, PlayerMenuKind.TileEventAvoidAttempt);
    if (avoidEntry == null)
      throw "TileEventAvoidanceMenuFlowTest: missing avoid attempt entry";
    avoidNode.setActivationEntry(avoidEntry);
    match.applyMenuLeaf(actor, avoidNode);

    var st1 = ruler.roster()[0].stamina();
    if (st1 >= st0)
      throw "TileEventAvoidanceMenuFlowTest: stamina should decrease after avoidance attempt";

    // 成功/失敗都可繼續進事件本體並 accept
    var acceptNode = MenuNodeQuery.requireNodeWithKind(match.createPlayerMenu(actor), PlayerMenuKind.TileEventPick);
    match.applyMenuLeaf(actor, acceptNode);

    trace("[TileEventAvoidanceMenuFlowTest] OK — avoid attempt consumes stamina and event can resolve");
  }
}

