package debug;

import game.IPlayer;
import game.IPlayerMenu;
import game.IPlayerMenuEntry;
import game.IPlayerMenuNode;
import game.PlayerMenuKind;

/**
 * 踩中 TileKind.Event：移動後出現 pendingTileEvent，選單含 ITileEvent.buildPlayerMenu；
 */
class TileEventLandingTest {
  static inline var EVENT_IDX = 3;

  public static function run():Void {
    var g = new SimpleGame();
    var match:SimpleGameMatch = cast g.createGameMatch(MatchLevels.KEY_TILE_EVENT_RING10_EVT3);

    var monarch = cast(match.monarchs()[0], SimpleMonarch);
    var fork = match.debugForkLoot;
    if (fork == null)
      throw "TileEventLandingTest: debugForkLoot 未設定";

    var player:IPlayer = match.createPlayer(monarch.id(), "evt-player");

    match.applyMenuLeaf(player, requireLeafKind(match.createPlayerMenu(player), Move));

    if (match.pendingTileEvent() == null)
      throw "TileEventLandingTest: 應有 pending 事件";
    if (monarch.pawnIndex() != EVENT_IDX)
      throw "TileEventLandingTest: 預期落在事件格 " + EVENT_IDX + ", pawn=" + monarch.pawnIndex();
    if (match.isActivePlayerSliceComplete())
      throw "TileEventLandingTest: 事件未結算前切片不得標為可結束";

    var m1 = match.createPlayerMenu(player);
    var picks = collectLeavesKind(m1, TileEventPick);
    if (picks.length != 3)
      throw "TileEventLandingTest: 預期三選一選項數 3，got " + picks.length;

    var grainLeaf:Null<IPlayerMenuEntry> = null;
    for (p in picks)
      if (p.decisionToken() == "take_grain")
        grainLeaf = p;
    if (grainLeaf == null)
      throw "TileEventLandingTest: 缺少 take_grain 選項";

    match.applyMenuLeaf(player, grainLeaf);

    if (match.pendingTileEvent() != null)
      throw "TileEventLandingTest: 事件結算後應清除 pending";
    if (fork.lastResolvedChoice != "take_grain")
      throw "TileEventLandingTest: resolveChoice 鍵不符";
    if (monarch.grain() != 72)
      throw "TileEventLandingTest: 預期糧食 50+22=72，got " + monarch.grain();

    if (!match.isActivePlayerSliceComplete())
      throw "TileEventLandingTest: 事件後應視同踩點結束可收束";

    var m2 = match.createPlayerMenu(player);
    requireLeafKind(m2, ConfirmDone);

    trace("[TileEventLandingTest] OK — Event 格→三選一→resolveChoice→結束項");
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

  static function requireLeafKind(menu:IPlayerMenu, kind:PlayerMenuKind):IPlayerMenuEntry {
    var found:Null<IPlayerMenuEntry> = null;
    function walk(nodes:Array<IPlayerMenuNode>):Void {
      for (n in nodes) {
        var L = n.leaf();
        if (L != null && L.kind() == kind && found == null)
          found = L;
        walk(n.children());
      }
    }
    walk(menu.rootNodes());
    if (found == null)
      throw "TileEventLandingTest: missing leaf kind " + Std.string(kind);
    return found;
  }
}
