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
import game.PlayerMenuKind.ShopEndTurn;
import game.TileKind;
import game.LevelKeys;
import impl_ver1.model.Monarch;

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
    match.linkPlayerToMonarch(idA, match.createPlayer(idA, false));
    match.createGeneral("g-a-1", idA, 10, 10, 10, 10);
    var actor:IPlayer = match.playerForMonarch(idA);
    // 購買需要金錢
    cast(match.activeMonarch(), Monarch).grantGold(100000);

    // Move：0 -> 1（Shop）
    var m0 = match.createPlayerMenu(actor);
    match.applyMenuLeaf(actor, requireEnabledNode(m0, Move));
    var m1 = match.createPlayerMenu(actor);
    match.applyMenuLeaf(actor, requireEnabledNode(m1, LandingContinue));

    if (match.forceGetPendingShopTile() != 1)
      throw "ShopTileMenuFlowTest: 預期 pendingShop=1";

    // 購買：不應結束 pending（可連續購買），需按回合結束才離開
    var m2 = match.createPlayerMenu(actor);
    match.applyMenuLeaf(actor, requireEnabledNode(m2, ShopBuy));
    if (match.forceGetPendingShopTile() == null)
      throw "ShopTileMenuFlowTest: 購買後仍應維持 pendingShop";

    var m3 = match.createPlayerMenu(actor);
    match.applyMenuLeaf(actor, requireEnabledNode(m3, ShopEndTurn));
    if (match.forceGetPendingShopTile() != null)
      throw "ShopTileMenuFlowTest: 離開後應清 pendingShop";
    if (!match.isActivePlayerSliceComplete())
      throw "ShopTileMenuFlowTest: 離開後 slice 應可收束";
    trace("[ShopTileMenuFlowTest] OK — 商店格可購買並可離開收束");
  }

  static function requireEnabledNode(menu:IPlayerMenu, kind:PlayerMenuKind):IPlayerMenuNode {
    var n = MenuNodeQuery.requireNodeWithKind(menu, kind);
    // 若該 kind 是表單內 Button，需先設 activationEntry
    var btn = MenuNodeQuery.buttonEntryOnNode(n, kind);
    if (btn != null)
      n.setActivationEntry(btn);
    if (!MenuActivation.activatingEntry(n).isEnabled())
      throw "ShopTileMenuFlowTest: 節點 " + Std.string(kind) + " 應為可用";
    return n;
  }
}

