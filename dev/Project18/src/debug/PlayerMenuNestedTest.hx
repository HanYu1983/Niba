package debug;

import game.IGameMatch;
import game.IPlayer;
import game.IPlayerMenu;
import game.IPlayerMenuEntry;
import game.IPlayerMenuNode;
import game.PlayerMenuKind;

/**
 * 巢狀選單：自樹取出「移動」葉節點並套用後，君主 pawnIndex 須於環狀棋盤上更新。
 */
class PlayerMenuNestedTest {
  static inline var TEST_RING = 20;
  static inline var TEST_DELTA = SimpleGameMatch.DEFAULT_MOVE_DELTA;

  public static function run():Void {
    var g = new SimpleGame();
    var match:IGameMatch = g.createGameMatch(MatchLevels.KEY_NESTED_MOVE_PLAIN_RING20);

    var monarch = cast(match.monarchs()[0], SimpleMonarch);
    var player:IPlayer = match.createPlayer(monarch.id(), "測試玩家");

    var moveEntry = match.createPlayerMenuEntry(Move, "前進（測試 +" + TEST_DELTA + "）", true);
    var jiceDisabled = match.createPlayerMenuEntry(JiCe, "計策（測試關閉）", false);
    var statusEntry = match.createPlayerMenuEntry(Status, "狀態總覽", true);

    var roots:Array<IPlayerMenuNode> = [
      match.createPlayerMenuNode(
        "本回合",
        null,
        [
          match.createPlayerMenuNode(
            "行動",
            null,
            [
              match.createPlayerMenuNode(moveEntry.caption(), moveEntry, []),
              match.createPlayerMenuNode(jiceDisabled.caption(), jiceDisabled, []),
            ]
          ),
          match.createPlayerMenuNode(statusEntry.caption(), statusEntry, []),
        ]
      ),
    ];

    var menu:IPlayerMenu = new SimplePlayerMenu(player, "nested-v1", roots);

    if (menu.forPlayer().monarchId() != player.monarchId())
      throw 'PlayerMenuNestedTest: menu owner mismatch';

    if (menu.rootNodes().length != 1)
      throw 'PlayerMenuNestedTest: expected single synthetic root branch';

    var moveLeaf = findEnabledMoveLeaf(menu.rootNodes());
    if (moveLeaf == null)
      throw 'PlayerMenuNestedTest: Move leaf not found under nested menu';

    if (!moveLeaf.isEnabled())
      throw 'PlayerMenuNestedTest: Move leaf must be enabled';

    if (monarch.pawnIndex() != 0)
      throw 'PlayerMenuNestedTest: precondition pawnIndex';

    match.applyMenuLeaf(player, moveLeaf);

    if (monarch.pawnIndex() != TEST_DELTA)
      throw "PlayerMenuNestedTest: expected pawn at " + TEST_DELTA + " after move, got " + monarch.pawnIndex();

    trace("[PlayerMenuNestedTest] OK — nested Move leaf via IGameMatch.applyMenuLeaf, pawn 0 → " + TEST_DELTA);
  }

  static function findEnabledMoveLeaf(nodes:Array<IPlayerMenuNode>):Null<IPlayerMenuEntry> {
    for (n in nodes) {
      var L = n.leaf();
      if (L != null) {
        if (L.kind() == Move && L.isEnabled())
          return L;
      } else {
        var hit = findEnabledMoveLeaf(n.children());
        if (hit != null)
          return hit;
      }
    }
    return null;
  }
}
