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
import game.PlayerMenuKind.ConfirmDone;
import game.PlayerMenuKind.FriendlyCityDevelop;
import game.PlayerMenuKind.FriendlyCityRest;
import game.PlayerMenuKind.FriendlyCityVisitEnd;
import game.PlayerMenuKind.LandingContinue;
import game.PlayerMenuKind.Move;
import game.PlayerMenuKind.StagingSubmit;
import game.TileKind;
import game.LevelKeys;

/**
 * 指令菜單流程：移動落在我方 City → 出現 開發/休整/調度/結束拜訪 → 開發進 staging 提交 → 仍停留拜訪 → 結束拜訪後可結束。
 * 重點：只測菜單流程，不檢查開發/休整/調度結算狀態。
 */
class FriendlyCityDevelopRestMenuFlowTest {
  public static function testFriendlyCityDevelopRestMenuFlow(game:IGame):Void {
    var match:IGameMatch = game.createGameMatch(LevelKeys.EMPTY);
    match.forceSetFixedMoveDelta(3);

    // 讓 Move 落在 City=3
    var tiles:Array<ITile> = [];
    tiles.push(match.createTile(0, Plain));
    tiles.push(match.createTile(1, Plain));
    tiles.push(match.createTile(2, Plain));
    tiles.push(match.createTile(3, City));
    match.createBoard(tiles);

    var idA:MonarchId = "m-a";
    match.createMonarch(idA, 0, 0, 500, 100);
    match.createPlayer(idA, idA, false);
    match.createGeneral("g-a-1", idA, 40, 40, 40, 40);
    var actor:IPlayer = match.playerForMonarch(idA);

    // 標記格 3 屬於 A
    match.forceSetCityOwner(3, idA);
    // 開發需要領地資源庫（城池儲備）足夠
    match.forcePutCityStores(3, 0, 100);
    match.forcePutCityStoredGold(3, 100);

    var m0 = match.createPlayerMenu(actor);
    match.applyMenuLeaf(actor, requireEnabledNode(m0, Move));
    var m0b = match.createPlayerMenu(actor);
    match.applyMenuLeaf(actor, requireEnabledNode(m0b, LandingContinue));
    if (match.forceGetPendingFriendlyCityVisitTile() == null)
      throw "FriendlyCityDevelopRestMenuFlowTest: 落地後應 pendingFriendlyCity";

    var m1 = match.createPlayerMenu(actor);
    requireEnabledNode(m1, FriendlyCityDevelop);
    requireEnabledNode(m1, FriendlyCityRest);
    requireEnabledNode(m1, FriendlyCityVisitEnd);

    // 開發 → staging → submit → 仍在拜訪
    match.applyMenuLeaf(actor, requireEnabledNode(m1, FriendlyCityDevelop));
    var m2 = match.createPlayerMenu(actor);
    var stg = MenuNodeQuery.requireNodeWithKind(m2, StagingSubmit);
    var sub = MenuNodeQuery.buttonEntryOnNode(stg, StagingSubmit);
    if (sub == null)
      throw "FriendlyCityDevelopRestMenuFlowTest: 缺少提交鈕";
    stg.setActivationEntry(sub);
    match.applyMenuLeaf(actor, stg);

    if (match.forceGetPendingFriendlyCityVisitTile() == null)
      throw "FriendlyCityDevelopRestMenuFlowTest: 開發提交後仍應停留在拜訪";

    // 結束拜訪後應可結束
    var m3 = match.createPlayerMenu(actor);
    match.applyMenuLeaf(actor, requireEnabledNode(m3, FriendlyCityVisitEnd));

    var m4 = match.createPlayerMenu(actor);
    requireEnabledNode(m4, ConfirmDone);

    trace("[FriendlyCityDevelopRestMenuFlowTest] OK — friendly city develop/rest menu flow");
  }

  static function requireEnabledNode(menu:IPlayerMenu, kind:PlayerMenuKind):IPlayerMenuNode {
    var n = MenuNodeQuery.requireNodeWithKind(menu, kind);
    if (!MenuActivation.activatingEntry(n).isEnabled())
      throw "FriendlyCityDevelopRestMenuFlowTest: 節點 " + Std.string(kind) + " 應為可用";
    return n;
  }
}

