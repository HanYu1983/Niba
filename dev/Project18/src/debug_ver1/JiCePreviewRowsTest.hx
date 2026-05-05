package debug_ver1;

import game.IGame;
import game.IGameMatch;
import game.IPlayer;
import game.LevelKeys;
import game.PlayerMenuKind;
import game.MenuNodeQuery;
import game.TileKind;
import game.IPlayerMenuNode;
import game.GameIds;

/**
 * 骨架測試：計策 staging 會產生成功率預覽列（previewRows）。
 */
class JiCePreviewRowsTest {
  public static function testJiCePreviewRows(game:IGame):Void {
    var match:IGameMatch = game.createGameMatch(LevelKeys.EMPTY);
    match.createBoard([
      match.createTile(0, Plain),
      match.createTile(1, Plain),
      match.createTile(2, Plain),
    ]);

    var idA:MonarchId = "m-a";
    var idB:MonarchId = "m-b";
    match.createMonarch(idA, 0, 0, 0, 0);
    match.createGeneral("g-a-1", idA, 60, 60, 60, 60);
    match.createGeneral("g-a-2", idA, 30, 30, 30, 30);
    match.createMonarch(idB, 1, 0, 0, 0);
    match.createGeneral("g-b-1", idB, 10, 10, 10, 10);

    var actor:IPlayer = match.createPlayer(idA, "A");
    match.createPlayer(idB, "B");

    // 建一張離間，並從主選單打出進 staging（使 previewRows 由 action.previewRows 填入）
    match.createJiCe("jice_dissension", idA);
    var menu = match.createPlayerMenu(actor);
    var jiceNode = requireJiCeNodeByDecisionToken(menu.rootNodes(), "0");
    match.applyMenuLeaf(actor, jiceNode);

    var rows = match.forceStagingPreviewRows();
    if (rows == null || rows.length != 2)
      throw "JiCePreviewRowsTest: expected 2 preview rows";
    if (rows[0].outcomeDescription().indexOf("成功率") < 0)
      throw "JiCePreviewRowsTest: expected success-rate description";

    trace("[JiCePreviewRowsTest] OK — staging preview rows include success rate");
  }

  static function requireJiCeNodeByDecisionToken(nodes:Array<IPlayerMenuNode>, tok:String):IPlayerMenuNode {
    for (n in nodes) {
      var L = n.leaf();
      if (L != null && L.kind() == PlayerMenuKind.JiCe && L.decisionToken() == tok)
        return n;
      // children 遞迴搜尋
      if (n.children() != null && n.children().length > 0) {
        var inner = findJiCeNodeByDecisionToken(n.children(), tok);
        if (inner != null)
          return inner;
      }
    }
    return throw 'JiCePreviewRowsTest: missing JiCe node tok=$tok';
  }

  static function findJiCeNodeByDecisionToken(nodes:Array<IPlayerMenuNode>, tok:String):Null<IPlayerMenuNode> {
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

