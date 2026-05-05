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
import game.PlayerMenuKind.Rest;
import game.PlayerMenuKind.StagingSubmit;
import game.TileKind;
import impl_ver1.Game;

/**
 * 指令菜單流程：休整 → 進入 staging → 出現提交鈕 → 提交後退出 staging。
 * 重點：測菜單流程，不檢查體力/資源結算結果。
 */
class RestMenuFlowTest {
  public static function testRestMenuFlow():Void {
    var game:IGame = new Game();
    var match:IGameMatch = game.createGameMatch(Game.LEVEL_KEY_EMPTY);

    var tiles:Array<ITile> = [];
    for (i in 0...8)
      tiles.push(match.createTile(i, Plain));
    match.createBoard(tiles);

    var idA:MonarchId = "m-a";
    match.createMonarch(idA, 0, 0, 200, 50);
    match.createGeneral("g-a", idA, 10, 10, 10, 10);
    var actor:IPlayer = match.createPlayer(idA, "A");

    // 開局應可見 Rest
    var m0 = match.createPlayerMenu(actor);
    var restNode = requireEnabledNode(m0, Rest);

    // 點 Rest → 進入 staging
    match.applyMenuLeaf(actor, restNode);
    if (!match.forceHasPendingStaging())
      throw "RestMenuFlowTest: 點 Rest 後應進入 staging";

    var m1 = match.createPlayerMenu(actor);
    var stg = MenuNodeQuery.requireNodeWithKind(m1, StagingSubmit);
    var sub = MenuNodeQuery.buttonEntryOnNode(stg, StagingSubmit);
    if (sub == null)
      throw "RestMenuFlowTest: staging 節點應含提交按鈕";

    stg.setActivationEntry(sub);
    match.applyMenuLeaf(actor, stg);
    if (match.forceHasPendingStaging())
      throw "RestMenuFlowTest: 提交後 staging 應已清除";

    // 提交後不應再看到 staging submit 節點
    var m2 = match.createPlayerMenu(actor);
    if (MenuNodeQuery.findNodeWithKind(m2.rootNodes(), StagingSubmit) != null)
      throw "RestMenuFlowTest: 提交後不應再出現 StagingSubmit";

    trace("[RestMenuFlowTest] OK — rest menu flow");
  }

  static function requireEnabledNode(menu:IPlayerMenu, kind:PlayerMenuKind):IPlayerMenuNode {
    var n = MenuNodeQuery.requireNodeWithKind(menu, kind);
    if (!MenuActivation.activatingEntry(n).isEnabled())
      throw "RestMenuFlowTest: 節點 " + Std.string(kind) + " 應為可用";
    return n;
  }
}

