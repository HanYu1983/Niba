package debug_ver1;

import game.GameIds;
import game.IGame;
import game.IGameMatch;
import game.IPlayer;
import game.LevelKeys;
import game.MatchTerminationReason;
import game.TileKind;
import impl_ver1.core.GameMatchCore;
import impl_ver1.rules.GameMatchVer1Ops;

/**
 * 對齊 GDD 2.4：征服勝利（僅剩 1 名總兵力 > 0）。
 */
class TerminationConquestVictoryTest {
  public static function testTerminationConquestVictory(game:IGame):Void {
    var match:IGameMatch = game.createGameMatch(LevelKeys.EMPTY);

    match.createBoard([
      match.createTile(0, Plain),
      match.createTile(1, City),
      match.createTile(2, Village),
    ]);

    var a:MonarchId = "m-a";
    var b:MonarchId = "m-b";
    match.createMonarch(a, 0, 0, 0, 0);
    match.createPlayer(a, a, false);
    match.createGeneral("g-a", a, 1, 1, 1, 1);
    match.createMonarch(b, 1, 0, 0, 0);
    match.createPlayer(b, b, false);
    match.createGeneral("g-b", b, 1, 1, 1, 1);

    // A 有兵，B 無兵（含領地儲備也為 0）
    cast(match.monarchById(a), impl_ver1.model.Monarch).grantTroops(1);

    // 觸發終局判定（原本用 Status leaf；該 leaf 已移除）
    GameMatchVer1Ops.evaluateTermination(cast(match, GameMatchCore));

    switch match.getTerminationReason() {
      case Victory(mid):
        if (mid != a)
          throw "TerminationConquestVictoryTest: expected winner m-a, got " + mid;
      default:
        throw "TerminationConquestVictoryTest: expected Victory";
    }
    trace("[TerminationConquestVictoryTest] OK — conquest victory");
  }
}

