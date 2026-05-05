package debug_ver1;

import game.GameIds;
import game.MenuActivation;
import game.MenuNodeQuery;
import game.IGame;
import game.IGameMatch;
import game.IPlayer;
import game.IPlayerMenu;
import game.IPlayerMenuNode;
import game.ITile;
import game.PlayerMenuKind;
import game.PlayerMenuKind.LandingContinue;
import game.PlayerMenuKind.Move;
import game.TileKind;
import impl_ver1.Game;

/**
 * 菜單流程：Move 後先進入 pendingLanding → 菜單出現 LandingContinue → 按下後才觸發落地分流（例如 pendingVillage）。
 * 重點：只驗證「移動後策略窗口」的存在，不驗證落地效果。
 */
class PostMoveLandingWindowMenuTest {
  public static function run():Void {
    var game:IGame = new Game();
    var match:IGameMatch = game.createGameMatch(Game.LEVEL_KEY_EMPTY);

    var tiles:Array<ITile> = [];
    for (i in 0...6)
      tiles.push(match.createTile(i, Plain));
    match.createBoard(tiles);

    var idA:MonarchId = "m-a";
    match.createMonarch(idA, 0, 0, 100, 0);
    match.createGeneral("g-a", idA, 1, 1, 1, 1);
    var actor:IPlayer = match.createPlayer(idA, "A");

    var m0 = match.createPlayerMenu(actor);
    match.applyMenuLeaf(actor, requireEnabledNode(m0, Move));

    if (match.forceGetPendingLandingTile() == null)
      throw "PostMoveLandingWindowMenuTest: move 後應有 pendingLanding";

    var m1 = match.createPlayerMenu(actor);
    requireEnabledNode(m1, LandingContinue);

    match.applyMenuLeaf(actor, requireEnabledNode(m1, LandingContinue));
    if (match.forceGetPendingLandingTile() != null)
      throw "PostMoveLandingWindowMenuTest: LandingContinue 後 pendingLanding 應清除";

    trace("[PostMoveLandingWindowMenuTest] OK — post-move landing window");
  }

  static function requireEnabledNode(menu:IPlayerMenu, kind:PlayerMenuKind):IPlayerMenuNode {
    var n = MenuNodeQuery.requireNodeWithKind(menu, kind);
    if (!MenuActivation.activatingEntry(n).isEnabled())
      throw "PostMoveLandingWindowMenuTest: 節點 " + Std.string(kind) + " 應為可用";
    return n;
  }
}

