package debug_ver1;

import game.GameIds;
import game.IPlayer;
import game.IPlayerMenu;
import game.IPlayerMenuEntry;
import game.IPlayerMenuNode;
import game.IGame;
import game.IGameMatch;
import game.ITile;
import game.PlayerMenuKind;
import game.TileKind;
import impl_ver1.Game;

/**
 * 空白 level（{@link Game#LEVEL_KEY_EMPTY}）組局後，驗證四人主迴圈：
 * 當前玩家 → 選單含移動 → 移動 → 選單含「結束」→ 確認 → 輪到下家，直至回到首位。
 */
class EmptyLevelFourPlayerLoopTest {
  public static function run():Void {
    var game:IGame = new Game();
    var match:IGameMatch = game.createGameMatch(Game.LEVEL_KEY_EMPTY);

    var tiles:Array<ITile> = [];
    for (i in 0...10)
      tiles.push(match.createTile(i, Plain));
    match.createBoard(tiles);

    var monarchIds:Array<MonarchId> = ["m0", "m1", "m2", "m3"];
    for (s in 0...4)
      match.createMonarch(monarchIds[s], s, 0);

    var players = new Map<MonarchId, IPlayer>();
    for (id in monarchIds)
      players[id] = match.createPlayer(id, "player-" + id);

    var firstId = monarchIds[0];
    if (match.activeMonarch().id() != firstId)
      throw "EmptyLevelFourPlayerLoopTest: 第一位登錄之君主應為當前行動方";

    for (round in 0...4) {
      var expected = monarchIds[round];
      if (match.activeMonarch().id() != expected)
        throw 'EmptyLevelFourPlayerLoopTest: round $round 預期當前 $expected，實際為 ${match.activeMonarch().id()}';

      var actor = players[expected];
      var menuMove = match.createPlayerMenu(actor);
      if (findLeaf(menuMove, ConfirmDone) != null)
        throw "EmptyLevelFourPlayerLoopTest: 移動前不應出現「結束本階段」葉節點";

      match.applyMenuLeaf(actor, requireLeaf(menuMove, Move));

      if (!match.isActivePlayerSliceComplete())
        throw "EmptyLevelFourPlayerLoopTest: 全平原移動後切片應可結束";

      var menuEnd = match.createPlayerMenu(actor);
      var endLeaf = requireLeaf(menuEnd, ConfirmDone);
      match.applyMenuLeaf(actor, endLeaf);
    }

    if (match.activeMonarch().id() != firstId)
      throw "EmptyLevelFourPlayerLoopTest: 四人都結束後應輪回首君 " + firstId;

    trace("[EmptyLevelFourPlayerLoopTest] OK — empty level：4 玩家×（移動→結束）輪詢回首");
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
      throw "EmptyLevelFourPlayerLoopTest: 選單缺少葉節點 " + Std.string(kind);
    return L;
  }
}
