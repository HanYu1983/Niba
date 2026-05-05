package debug_ver1;

import game.GameIds;
import game.MenuActivation;
import game.MenuNodeQuery;
import game.IGame;
import game.IGameMatch;
import game.IPlayer;
import game.IPlayerMenu;
import game.IPlayerMenuEntry;
import game.IPlayerMenuNode;
import game.ITile;
import game.PlayerMenuKind;
import game.PlayerMenuKind.ConfirmDone;
import game.PlayerMenuKind.Move;
import game.TileKind;
import impl_ver1.Game;

/**
 * 單一玩家：移動後（切片完成）主選單不再出現「移動」，直到按下「結束」後才再次出現。
 */
class MoveMenuHiddenUntilConfirmTest {
  public static function run():Void {
    var game:IGame = new Game();
    var match:IGameMatch = game.createGameMatch(Game.LEVEL_KEY_EMPTY);
    var tiles:Array<ITile> = [];
    for (i in 0...12)
      tiles.push(match.createTile(i, Plain));
    match.createBoard(tiles);

    var idA:MonarchId = "m-a";
    match.createMonarch(idA, 0, 0, 100, 0);
    match.createGeneral("g-a", idA, 1, 1, 1, 1);
    var actor:IPlayer = match.createPlayer(idA, "A");

    // 開局應出現 Move
    var m0 = match.createPlayerMenu(actor);
    requireNodeWithKind(m0, Move);
    if (MenuNodeQuery.findNodeWithKind(m0.rootNodes(), ConfirmDone) != null)
      throw "MoveMenuHiddenUntilConfirmTest: 開局不應出現 ConfirmDone";

    // 點 Move
    match.applyMenuLeaf(actor, requireEnabledNode(m0, Move));

    // 平原落地無 pending，切片應完成 → Move 不再出現，ConfirmDone 出現
    var m1 = match.createPlayerMenu(actor);
    if (MenuNodeQuery.findNodeWithKind(m1.rootNodes(), Move) != null)
      throw "MoveMenuHiddenUntilConfirmTest: 切片完成後不應再出現 Move";
    requireNodeWithKind(m1, ConfirmDone);

    // 點 ConfirmDone 後切片重置 → Move 再次出現
    match.applyMenuLeaf(actor, requireEnabledNode(m1, ConfirmDone));
    var m2 = match.createPlayerMenu(actor);
    requireNodeWithKind(m2, Move);

    trace("[MoveMenuHiddenUntilConfirmTest] OK — move hidden until confirm");
  }

  static function requireEnabledNode(menu:IPlayerMenu, kind:PlayerMenuKind):IPlayerMenuNode {
    var n = MenuNodeQuery.requireNodeWithKind(menu, kind);
    if (!MenuActivation.activatingEntry(n).isEnabled())
      throw "MoveMenuHiddenUntilConfirmTest: 節點 " + Std.string(kind) + " 應為可用";
    return n;
  }

  static function requireNodeWithKind(menu:IPlayerMenu, kind:PlayerMenuKind):IPlayerMenuNode {
    return MenuNodeQuery.requireNodeWithKind(menu, kind);
  }
}

