package debug_ver1;

import game.GameIds;
import game.IGame;
import game.IGameMatch;
import game.IPlayer;
import game.IPlayerMenu;
import game.IPlayerMenuNode;
import game.MenuActivation;
import game.MenuNodeQuery;
import game.PlayerMenuKind;
import game.PlayerMenuKind.LandingContinue;
import game.PlayerMenuKind.Move;
import game.PlayerMenuKind.ShopBuy;
import game.TileKind;
import game.LevelKeys;

/**
 * 商店格（骨架）：落地後應出現 pendingShop，點「購買」可結束落地切片。
 */
class ShopTileMenuFlowTest {
  public static function testShopTileMenuFlow(game:IGame):Void {
    var match:IGameMatch = game.createGameMatch(LevelKeys.EMPTY);
    match.forceSetFixedMoveDelta(1);
    match.createBoard([
      match.createTile(0, Plain),
      match.createTile(1, Shop),
    ]);

    var idA:MonarchId = "m-a";
    match.createMonarch(idA, 0, 0, 500, 80);
    var actor:IPlayer = match.createPlayer(idA, "A");

    // Move：0 -> 1（Shop）
    var m0 = match.createPlayerMenu(actor);
    match.applyMenuLeaf(actor, requireEnabledNode(m0, Move));
    var m1 = match.createPlayerMenu(actor);
    match.applyMenuLeaf(actor, requireEnabledNode(m1, LandingContinue));

    if (match.forceGetPendingShopTile() != 1)
      throw "ShopTileMenuFlowTest: 預期 pendingShop=1";

    // 購買（骨架）→ 應清 pending + slice complete
    var m2 = match.createPlayerMenu(actor);
    match.applyMenuLeaf(actor, requireEnabledNode(m2, ShopBuy));
    if (match.forceGetPendingShopTile() != null)
      throw "ShopTileMenuFlowTest: 購買後應清 pendingShop";
    if (!match.isActivePlayerSliceComplete())
      throw "ShopTileMenuFlowTest: 購買後 slice 應可收束";
    trace("[ShopTileMenuFlowTest] OK — 商店格骨架可收束");
  }

  static function requireEnabledNode(menu:IPlayerMenu, kind:PlayerMenuKind):IPlayerMenuNode {
    var n = MenuNodeQuery.requireNodeWithKind(menu, kind);
    if (!MenuActivation.activatingEntry(n).isEnabled())
      throw "ShopTileMenuFlowTest: 節點 " + Std.string(kind) + " 應為可用";
    return n;
  }
}

