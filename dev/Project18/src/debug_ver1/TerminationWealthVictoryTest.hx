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
 * 對齊 GDD 2.4：財富勝利（總金錢達門檻，ver1 暫用 100000）。
 */
class TerminationWealthVictoryTest {
  public static function testTerminationWealthVictory(game:IGame):Void {
    var match:IGameMatch = game.createGameMatch(LevelKeys.EMPTY);

    match.createBoard([
      match.createTile(0, City),
      match.createTile(1, Plain),
    ]);

    var a:MonarchId = "m-a";
    var b:MonarchId = "m-b";
    match.createMonarch(a, 0, 0, 0, 0);
    match.createPlayer(a, a, false);
    match.createGeneral("g-a", a, 1, 1, 1, 1);
    match.createMonarch(b, 1, 0, 0, 0);
    match.createPlayer(b, b, false);
    match.createGeneral("g-b", b, 1, 1, 1, 1);

    // 避免征服勝利先觸發：兩邊都給 1 兵
    cast(match.monarchById(a), impl_ver1.model.Monarch).grantTroops(1);
    cast(match.monarchById(b), impl_ver1.model.Monarch).grantTroops(1);

    // A 的財富達標：君主金 + 城池金
    cast(match.monarchById(a), impl_ver1.model.Monarch).grantGold(100000);
    match.forceSetCityOwner(0, a);
    match.forcePutCityStoredGold(0, 1);

    GameMatchVer1Ops.evaluateTermination(cast(match, GameMatchCore));

    switch match.getTerminationReason() {
      case Victory(mid):
        if (mid != a)
          throw "TerminationWealthVictoryTest: expected winner m-a, got " + mid;
      default:
        throw "TerminationWealthVictoryTest: expected Victory";
    }
    trace("[TerminationWealthVictoryTest] OK — wealth victory");
  }
}

