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
import game.LevelKeys;
import game.PlayerMenuKind;
import game.PlayerMenuKind.FriendlyCityRest;
import game.PlayerMenuKind.StagingSubmit;
import game.PlayerMenuKind.Move;
import game.PlayerMenuKind.LandingContinue;
import game.TileKind;

/**
 * 領地休整菜單流程：移動落在己方城池 → 出現「領地：休整」→ 進入 staging → 提交後退出 staging（仍停留拜訪）。
 * 重點：測菜單流程，不檢查體力結算結果。
 */
class RestMenuFlowTest {
  public static function testRestMenuFlow(game:IGame):Void {
    var match:IGameMatch = game.createGameMatch(LevelKeys.EMPTY);

    var tiles:Array<ITile> = [];
    for (i in 0...8)
      tiles.push(match.createTile(i, i == 1 ? City : Plain));
    match.createBoard(tiles);

    var idA:MonarchId = "m-a";
    match.createMonarch(idA, 0, 0, 200, 50);
    match.linkPlayerToMonarch(idA, match.createPlayer(idA, false));
    match.createGeneral("g-a", idA, 10, 10, 10, 10);
    var actor:IPlayer = match.playerForMonarch(idA);

    // 走到己方城池（格 1）
    match.forceSetFixedMoveDelta(1);
    match.forceSetCityOwner(1, idA);
    match.applyMenuLeaf(actor, MenuNodeQuery.requireNodeWithKind(match.createPlayerMenu(actor), Move));
    match.applyMenuLeaf(actor, MenuNodeQuery.requireNodeWithKind(match.createPlayerMenu(actor), LandingContinue));

    // 應可見 FriendlyCityRest
    var m0 = match.createPlayerMenu(actor);
    var restNode = requireEnabledNode(m0, FriendlyCityRest);

    // 點 FriendlyCityRest → 進入 staging
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

