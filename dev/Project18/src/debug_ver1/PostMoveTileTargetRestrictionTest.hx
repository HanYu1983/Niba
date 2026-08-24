package debug_ver1;

import game.IGame;
import game.IGameMatch;
import game.IPlayer;
import game.MenuNodeQuery;
import game.MenuFormWidget;
import game.PlayerMenuKind;
import game.TileKind;
import game.LevelKeys;
import game.GameIds;
import impl_ver1.model.Monarch;

/**
 * 骨架測試：移動後（pendingLanding）打出指定格子類策略時，目標必須是所站格。
 */
class PostMoveTileTargetRestrictionTest {
  public static function testPostMoveTileTargetRestriction(game:IGame):Void {
    var match:IGameMatch = game.createGameMatch(LevelKeys.EMPTY);
    match.forceSetFixedMoveDelta(2);

    match.createBoard([
      match.createTile(0, Plain),
      match.createTile(1, Plain),
      match.createTile(2, City),
      match.createTile(3, Plain),
    ]);

    var idA:MonarchId = "m-a";
    var idB:MonarchId = "m-b";
    match.createMonarch(idA, 0, 0, 0, 0);
    match.linkPlayerToMonarch(idA, match.createPlayer(idA, false));
    match.createGeneral("g-a", idA, 50, 50, 50, 50);
    match.createMonarch(idB, 1, 0, 0, 0);
    match.linkPlayerToMonarch(idB, match.createPlayer(idB, false));
    match.createGeneral("g-b", idB, 10, 10, 10, 10);

    var actorA:IPlayer = match.playerForMonarch(idA);

    // 讓 A 持有火計（可移動後使用）
    match.createJiCe("jice_fire", idA);

    // Move 後進入 pendingLanding（此時可用 StrategyPost）
    match.applyMenuLeaf(actorA, MenuNodeQuery.requireNodeWithKind(match.createPlayerMenu(actorA), PlayerMenuKind.Move));
    if (match.forceGetPendingLandingTile() == null)
      throw "PostMoveTileTargetRestrictionTest: expected pendingLanding";

    // 於 pendingLanding 直接打出火計（decisionToken=0）
    var m1 = match.createPlayerMenu(actorA);
    var jiceNode = requireJiCeNodeByDecisionToken(m1.rootNodes(), "0");
    match.applyMenuLeaf(actorA, jiceNode);

    // 修改 staging 表單：把目標格子刻意改成非站位（站位=2，改成 1）
    var stg = MenuNodeQuery.requireNodeWithKind(match.createPlayerMenu(actorA), PlayerMenuKind.StagingSubmit);
    var widgets = stg.formWidgets();
    if (widgets.length < 2)
      throw "PostMoveTileTargetRestrictionTest: missing widgets";
    switch widgets[1] {
      case TileSinglePick(_, _, selected):
        selected.splice(0, selected.length);
        selected.push(1);
      default:
        throw "PostMoveTileTargetRestrictionTest: expected TileSinglePick";
    }
    var btn = MenuNodeQuery.buttonEntryOnNode(stg, PlayerMenuKind.StagingSubmit);
    if (btn == null)
      throw "PostMoveTileTargetRestrictionTest: missing submit button";
    stg.setActivationEntry(btn);

    var threw = false;
    try {
      match.applyMenuLeaf(actorA, stg);
    } catch (e:Dynamic) {
      threw = true;
    }
    if (!threw)
      throw "PostMoveTileTargetRestrictionTest: should reject non-current tile target on post-move";

    trace("[PostMoveTileTargetRestrictionTest] OK — post-move tile targeting restricted to current tile");
  }

  static function requireJiCeNodeByDecisionToken(nodes:Array<game.IPlayerMenuNode>, tok:String):game.IPlayerMenuNode {
    for (n in nodes) {
      var L = n.leaf();
      if (L != null && L.kind() == PlayerMenuKind.JiCe && L.decisionToken() == tok)
        return n;
      if (n.children() != null && n.children().length > 0) {
        var inner = findJiCeNodeByDecisionToken(n.children(), tok);
        if (inner != null)
          return inner;
      }
    }
    return throw 'PostMoveTileTargetRestrictionTest: missing JiCe tok=$tok';
  }

  static function findJiCeNodeByDecisionToken(nodes:Array<game.IPlayerMenuNode>, tok:String):Null<game.IPlayerMenuNode> {
    for (n in nodes) {
      var L = n.leaf();
      if (L != null && L.kind() == PlayerMenuKind.JiCe && L.decisionToken() == tok)
        return n;
      if (n.children() != null && n.children().length > 0) {
        var inner = findJiCeNodeByDecisionToken(n.children(), tok);
        if (inner != null)
          return inner;
      }
    }
    return null;
  }
}

