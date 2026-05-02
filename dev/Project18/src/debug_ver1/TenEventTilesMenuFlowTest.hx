package debug_ver1;

import game.IPlayer;
import game.IPlayerMenu;
import game.IPlayerMenuEntry;
import game.IPlayerMenuNode;
import game.ITile;
import game.PlayerMenuKind;
import game.TileKind;
import impl_ver1.Game;
import impl_ver1.GameMatch;
import impl_ver1.Monarch;

/**
 * 單君主、十格皆 {@link TileKind.Event}：移動落地→pending 事件→選單含事件分歧→結算後出現結束語意。
 */
class TenEventTilesMenuFlowTest {
  static inline var RING_LEN = 10;
  /** {@link GameMatch#DEFAULT_MOVE_DELTA} 為 3：自 0 出發落在索引 3。 */
  static inline var EXPECT_LANDING_IDX = 3;

  public static function run():Void {
    var factory = new Game();
    var match:GameMatch = cast factory.createGameMatch(Game.LEVEL_KEY_EMPTY);

    var tiles:Array<ITile> = [];
    for (i in 0...RING_LEN)
      tiles.push(match.createTile(i, Event));
    match.createBoard(tiles);

    match.createMonarch("m-solo", 0, 0, 100, 50);

    var evt = new RingLootForkTileEvent(match);
    for (i in 0...RING_LEN)
      match.bindTileEvent(i, evt);

    var ruler = cast(match.monarchs()[0], Monarch);
    var player:IPlayer = match.createPlayer(ruler.id(), "evt-solo");

    if (match.activeMonarch().id() != ruler.id())
      throw "TenEventTilesMenuFlowTest: 單君主應為當前行動方";

    var menu0 = match.createPlayerMenu(player);
    requireLeaf(menu0, Move);
    if (findLeaf(menu0, ConfirmDone) != null)
      throw "TenEventTilesMenuFlowTest: 尚未移動前不可結束";

    match.applyMenuLeaf(player, requireLeaf(menu0, Move));

    if (ruler.pawnIndex() != EXPECT_LANDING_IDX)
      throw 'TenEventTilesMenuFlowTest: 預期落在索引 $EXPECT_LANDING_IDX，實際 ${ruler.pawnIndex()}';
    if (match.pendingTileEvent() == null)
      throw "TenEventTilesMenuFlowTest: 十格皆 Event 且已綁腳本時落地應有 pendingTileEvent";
    if (match.isActivePlayerSliceComplete())
      throw "TenEventTilesMenuFlowTest: 事件未結算前切片不得標為可結束";

    var menuEvt = match.createPlayerMenu(player);
    var moveDuringEvt = findLeaf(menuEvt, Move);
    if (moveDuringEvt != null && moveDuringEvt.isEnabled())
      throw "TenEventTilesMenuFlowTest: 事件進行中「移動」應停用";

    var picks = collectLeavesKind(menuEvt, TileEventPick);
    if (picks.length != 3)
      throw "TenEventTilesMenuFlowTest: 預期三選一選項數 3，got " + picks.length;

    var grainLeaf:Null<IPlayerMenuEntry> = null;
    for (p in picks)
      if (p.decisionToken() == "take_grain")
        grainLeaf = p;
    if (grainLeaf == null)
      throw "TenEventTilesMenuFlowTest: 缺少 take_grain";

    match.applyMenuLeaf(player, grainLeaf);

    if (match.pendingTileEvent() != null)
      throw "TenEventTilesMenuFlowTest: 結算後應清除 pending";
    if (evt.lastResolvedChoice != "take_grain")
      throw "TenEventTilesMenuFlowTest: resolveChoice 鍵不符";
    if (ruler.grain() != 72)
      throw "TenEventTilesMenuFlowTest: 預期糧食 50+22=72，got " + ruler.grain();

    if (!match.isActivePlayerSliceComplete())
      throw "TenEventTilesMenuFlowTest: 事件結算後應可收束";

    var menuDone = match.createPlayerMenu(player);
    requireLeaf(menuDone, ConfirmDone);

    trace("[TenEventTilesMenuFlowTest] OK — 10×Event 環→移動→事件選單→選項→結束項");
  }

  static function findLeaf(menu:IPlayerMenu, kind:PlayerMenuKind):Null<IPlayerMenuEntry> {
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

  static function requireLeaf(menu:IPlayerMenu, kind:PlayerMenuKind):IPlayerMenuEntry {
    var L = findLeaf(menu, kind);
    if (L == null)
      throw "TenEventTilesMenuFlowTest: 選單缺少 " + Std.string(kind);
    return L;
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
}
