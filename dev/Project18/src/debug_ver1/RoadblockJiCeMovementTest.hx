package debug_ver1;

import game.GameIds;
import game.MenuActivation;
import game.MenuNodeQuery;
import game.IJiCe;
import game.IPlayer;
import game.IPlayerMenu;
import game.IPlayerMenuNode;
import game.IGame;
import game.IGameMatch;
import game.ITile;
import game.PlayerMenuKind;
import game.PlayerMenuKind.ConfirmDone;
import game.PlayerMenuKind.JiCe;
import game.PlayerMenuKind.Move;
import game.TileKind;
import impl_ver1.Game;
import impl_ver1.RoadblockJiCe;
import impl_ver1.RoadblockMovementHook;

/**
 * A／B 雙君主：B 以 {@link RoadblockJiCe} 於當前格設路障（勾子記住格與放置者，只擋非 B）；
 * A 逐步移動經過該格時止步。另附直接註冊 {@link RoadblockMovementHook} 驗證放置者經過目標格不中斷。
 */
class RoadblockJiCeMovementTest {
  public static function run():Void {
    testEnemyHaltedByRoadblockJiCe();
    testPlacerPassesHookTile();
    trace("[RoadblockJiCeMovementTest] OK — 路障擋敵方、放置者除外");
  }

  static function testEnemyHaltedByRoadblockJiCe():Void {
    var game:IGame = new Game();
    var match:IGameMatch = game.createGameMatch(Game.LEVEL_KEY_EMPTY);
    var ring = 12;
    var tiles:Array<ITile> = [];
    for (i in 0...ring)
      tiles.push(match.createTile(i, Plain));
    match.createBoard(tiles);

    var idA:MonarchId = "m-a";
    var idB:MonarchId = "m-b";
    match.createMonarch(idA, 0, 0);
    match.createMonarch(idB, 1, 5);
    match.createGeneral("g-a", idA, 1, 1, 1, 1);

    var roadblock:IJiCe = match.createJiCe(RoadblockJiCe.REGISTRY_KEY, idB);
    var actorA = match.createPlayer(idA, "A");
    var actorB = match.createPlayer(idB, "B");

    if (match.activeMonarch().id() != idA)
      throw "RoadblockJiCeMovementTest: 預期先手為 A";

    var m0 = match.createPlayerMenu(actorA);
    match.applyMenuLeaf(actorA, requireEnabledNode(m0, Move));
    match.applyMenuLeaf(actorA, requireEnabledNode(match.createPlayerMenu(actorA), ConfirmDone));
    if (match.activeMonarch().id() != idB || match.activeMonarch().pawnIndex() != 5)
      throw "RoadblockJiCeMovementTest: 換手後應為 B 在格 5";

    var mB1 = match.createPlayerMenu(actorB);
    match.applyMenuLeaf(actorB, requireEnabledNode(mB1, JiCe));

    var stagingNode = PlayerMenuFind.findStagingSubmitNode(match.createPlayerMenu(actorB));
    var sub = MenuNodeQuery.buttonEntryOnNode(stagingNode, PlayerMenuKind.StagingSubmit);
    if (sub == null)
      throw "RoadblockJiCeMovementTest: 缺少路障確認鈕";
    stagingNode.setActivationEntry(sub);
    match.applyMenuLeaf(actorB, stagingNode);

    if (match.movementStepHooks().length != 1)
      throw "RoadblockJiCeMovementTest: 應已註冊一個路障勾子";
    var hook = match.movementStepHooks()[0];
    if (!Std.isOfType(hook, RoadblockMovementHook))
      throw "RoadblockJiCeMovementTest: 勾子類型應為 RoadblockMovementHook";
    var rbHook = cast(hook, RoadblockMovementHook);
    if (rbHook.blockedTile != 5 || rbHook.placerMonarchId != idB)
      throw "RoadblockJiCeMovementTest: 路障應在格 5 且放置者為 B";

    match.applyMenuLeaf(actorB, requireEnabledNode(match.createPlayerMenu(actorB), Move));
    match.applyMenuLeaf(actorB, requireEnabledNode(match.createPlayerMenu(actorB), ConfirmDone));
    if (match.activeMonarch().id() != idA || match.activeMonarch().pawnIndex() != 3)
      throw "RoadblockJiCeMovementTest: A 應在格 3";

    match.applyMenuLeaf(actorA, requireEnabledNode(match.createPlayerMenu(actorA), Move));
    if (match.activeMonarch().pawnIndex() != 5)
      throw "RoadblockJiCeMovementTest: A 應在路障格 5 止步（剩餘步數不消費）";
  }

  /** 等同 {@link RoadblockMovementHook} 放置者豁免語意（不經計策選單，避免「當前格放置」無法再走回該格的測試死局）。 */
  static function testPlacerPassesHookTile():Void {
    var game:IGame = new Game();
    var match:IGameMatch = game.createGameMatch(Game.LEVEL_KEY_EMPTY);
    var ring = 12;
    var tiles:Array<ITile> = [];
    for (i in 0...ring)
      tiles.push(match.createTile(i, Plain));
    match.createBoard(tiles);

    var idB:MonarchId = "m-b";
    var idA:MonarchId = "m-a";
    match.createMonarch(idB, 0, 5);
    match.createMonarch(idA, 1, 0);
    var actorB = match.createPlayer(idB, "B");

    if (match.activeMonarch().id() != idB)
      throw "RoadblockJiCeMovementTest(placer): 預期先手 B";

    match.forceRegisterMovementStepHook(new RoadblockMovementHook(6, idB));
    match.applyMenuLeaf(actorB, requireEnabledNode(match.createPlayerMenu(actorB), Move));
    if (match.activeMonarch().pawnIndex() != 8)
      throw "RoadblockJiCeMovementTest(placer): B 應跨越己方路障格 6 並走完 3 步至格 8";
  }

  static function requireEnabledNode(menu:IPlayerMenu, kind:PlayerMenuKind):IPlayerMenuNode {
    var n = MenuNodeQuery.requireNodeWithKind(menu, kind);
    if (!MenuActivation.activatingEntry(n).isEnabled())
      throw "RoadblockJiCeMovementTest: 節點 " + Std.string(kind) + " 應為可用";
    return n;
  }
}
