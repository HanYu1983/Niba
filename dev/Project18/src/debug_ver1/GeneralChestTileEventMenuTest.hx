package debug_ver1;

import game.IGame;
import game.IGameMatch;
import game.IPlayer;
import game.IPlayerMenu;
import game.IPlayerMenuEntry;
import game.IPlayerMenuNode;
import game.ITile;
import game.PlayerMenuKind;
import game.TileKind;
import impl_ver1.Game;
import impl_ver1.Monarch;

/**
 * {@link GeneralChestTileEvent}：落地→TileEventPick claim_reward→JiCePick 武將子選單→結算兵力。
 */
class GeneralChestTileEventMenuTest {
  static inline var RING_LEN = 10;
  static inline var LANDING_IDX = 3;

  public static function run():Void {
    var game:IGame = new Game();
    var match:IGameMatch = game.createGameMatch(Game.LEVEL_KEY_EMPTY);

    var tiles:Array<ITile> = [];
    for (i in 0...RING_LEN)
      tiles.push(match.createTile(i, i == LANDING_IDX ? Event : Plain));
    match.createBoard(tiles);

    match.createMonarch("m-chest", 0, 0, 100, 0);
    match.createGeneral("g-chest", "m-chest", 5, 5, 5, 5);

    var evt = new GeneralChestTileEvent(match);
    match.forceBindTileEvent(LANDING_IDX, evt);

    var ruler = cast(match.monarchs()[0], Monarch);
    var player:IPlayer = match.createPlayer(ruler.id(), "evt-chest");

    match.applyMenuLeaf(player, requireLeafKind(match.createPlayerMenu(player), Move));

    if (ruler.pawnIndex() != LANDING_IDX)
      throw 'GeneralChestTileEventMenuTest: 預期落在索引 $LANDING_IDX，實際 ${ruler.pawnIndex()}';
    if (match.forceGetPendingTileEvent() != evt)
      throw "GeneralChestTileEventMenuTest: 應為 GeneralChest pending";

    var menuEvt = match.createPlayerMenu(player);
    var claim = findTileEventPick(menuEvt, "claim_reward");
    if (claim == null)
      throw "GeneralChestTileEventMenuTest: 缺少 claim_reward";
    match.applyMenuLeaf(player, claim);

    if (match.forceGetPendingTileEvent() == null)
      throw "GeneralChestTileEventMenuTest: 選將暫存期仍應有 forceGetPendingTileEvent";
    var rows = match.forceTileEventStagingPreviewRows();
    if (rows.length != 1 || rows[0].generalId() != "g-chest")
      throw "GeneralChestTileEventMenuTest: 預覽列應為單一 g-chest";

    var menuPick = match.createPlayerMenu(player);
    var jiPicks = collectLeavesKind(menuPick, JiCePick);
    if (jiPicks.length != 1)
      throw "GeneralChestTileEventMenuTest: 預期武將選單僅一葉 JiCePick，got " + jiPicks.length;
    if (jiPicks[0].decisionToken() != "g-chest")
      throw "GeneralChestTileEventMenuTest: JiCePick 機械鍵應為 g-chest";

    match.applyMenuLeaf(player, PlayerMenuFind.findJiCePickLeaf(menuPick, "g-chest"));

    if (match.forceGetPendingTileEvent() != null)
      throw "GeneralChestTileEventMenuTest: 結算後應清除 pending";
    if (ruler.troops() != 108)
      throw "GeneralChestTileEventMenuTest: 預期兵力 100+8=108，got " + ruler.troops();
    if (evt.lastResolvedChoice != "claim_reward:g-chest")
      throw "GeneralChestTileEventMenuTest: lastResolvedChoice 不符，got " + evt.lastResolvedChoice;

    var menuDone = match.createPlayerMenu(player);
    requireLeafKind(menuDone, ConfirmDone);

    trace("[GeneralChestTileEventMenuTest] OK — 事件→武將 JiCePick 子選單→領賞兵力");
  }

  static function findTileEventPick(menu:IPlayerMenu, decisionToken:String):Null<IPlayerMenuEntry> {
    return findPickInNodes(menu.rootNodes(), TileEventPick, decisionToken);
  }

  static function findPickInNodes(nodes:Array<IPlayerMenuNode>, kind:PlayerMenuKind, decisionToken:String):Null<IPlayerMenuEntry> {
    for (n in nodes) {
      var L = n.leaf();
      if (L != null && L.kind() == kind && L.decisionToken() == decisionToken)
        return L;
      var inner = findPickInNodes(n.children(), kind, decisionToken);
      if (inner != null)
        return inner;
    }
    return null;
  }

  static function collectLeavesKind(menu:IPlayerMenu, kind:PlayerMenuKind):Array<IPlayerMenuEntry> {
    var acc:Array<IPlayerMenuEntry> = [];
    collectLeavesKindNodes(menu.rootNodes(), kind, acc);
    return acc;
  }

  static function collectLeavesKindNodes(nodes:Array<IPlayerMenuNode>, kind:PlayerMenuKind, acc:Array<IPlayerMenuEntry>):Void {
    for (n in nodes) {
      var L = n.leaf();
      if (L != null && L.kind() == kind)
        acc.push(L);
      collectLeavesKindNodes(n.children(), kind, acc);
    }
  }

  static function findLeafKind(menu:IPlayerMenu, kind:PlayerMenuKind):Null<IPlayerMenuEntry> {
    return findLeafInNodes(menu.rootNodes(), kind);
  }

  static function findLeafInNodes(nodes:Array<IPlayerMenuNode>, kind:PlayerMenuKind):Null<IPlayerMenuEntry> {
    for (n in nodes) {
      var L = n.leaf();
      if (L != null && L.kind() == kind)
        return L;
      var inner = findLeafInNodes(n.children(), kind);
      if (inner != null)
        return inner;
    }
    return null;
  }

  static function requireLeafKind(menu:IPlayerMenu, kind:PlayerMenuKind):IPlayerMenuEntry {
    var L = findLeafKind(menu, kind);
    if (L == null)
      throw "GeneralChestTileEventMenuTest: 選單缺少 " + Std.string(kind);
    if (!L.isEnabled())
      throw "GeneralChestTileEventMenuTest: 葉應為可用 " + Std.string(kind);
    return L;
  }
}
