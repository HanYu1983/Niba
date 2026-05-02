package debug;

import game.IGameMatch;
import game.IJiCe;
import game.IPlayer;
import game.IPlayerMenuEntry;
import game.PlayerMenuKind;

/**
 * 驗證 IGameMatch.isActivePlayerSliceComplete。
 */
class TurnSliceFlagTest {
  public static function run():Void {
    statusDoesNotEndSlice();
    jiCeDoesNotEndSlice();
    moveEndsSliceAfterApply();
    trace("[TurnSliceFlagTest] OK");
  }

  static function statusDoesNotEndSlice():Void {
    var m = minimalMatch();
    assertSlice(m, false, "initial");
    var g = new SimpleGame();
    var leaf = g.createPlayerMenuEntry(Status, "狀態", true);
    m.applyMenuLeaf(g.createPlayer("m-a", "p"), leaf);
    assertSlice(m, false, "after Status");
  }

  static function jiCeDoesNotEndSlice():Void {
    var g = new SimpleGame();
    var m:SimpleGameMatch = cast g.createGameMatch(MatchLevels.KEY_SLICE_JICE_TWO_MONARCHS_PLAIN);

    assertSlice(m, false, "jiCe initial");
    var leaf:IPlayerMenuEntry = g.createPlayerMenuEntry(JiCe, "計策", true);
    var card:IJiCe = m.createJiCe(LuoshiJiCe.REGISTRY_KEY, "m-a");
    var pl:IPlayer = g.createPlayer("m-a", "p");
    m.applyMenuLeaf(pl, leaf, card, "m-b");
    assertSlice(m, false, "after JiCe staging");
    var pick = JiCeLuoshiTest.findJiCePickLeaf(m.createPlayerMenu(pl), "g-ts");
    m.applyMenuLeaf(pl, pick);
    assertSlice(m, false, "after JiCe resolve pick");
  }

  static function moveEndsSliceAfterApply():Void {
    var m = minimalMatch();
    assertSlice(m, false, "move initial");
    var g = new SimpleGame();
    var leaf = g.createPlayerMenuEntry(Move, "移動", true);
    m.applyMenuLeaf(g.createPlayer("m-a", "p"), leaf);
    assertSlice(m, true, "after Move (tile settle implied)");
  }

  static function minimalMatch():SimpleGameMatch {
    var g = new SimpleGame();
    return cast g.createGameMatch(MatchLevels.KEY_SLICE_MINIMAL_SOLO_RING2);
  }

  static function assertSlice(m:IGameMatch, expect:Bool, label:String):Void {
    if (m.isActivePlayerSliceComplete() != expect)
      throw "TurnSliceFlagTest: isActivePlayerSliceComplete expected " + expect + " (" + label + "), got "
        + m.isActivePlayerSliceComplete();
  }
}
