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
 * 對齊 GDD 2.4：領土勝利（佔領 > 半數城池格）。
 */
class TerminationTerritoryVictoryTest {
  public static function testTerminationTerritoryVictory(game:IGame):Void {
    var match:IGameMatch = game.createGameMatch(LevelKeys.EMPTY);

    // 3 個城池：A 佔 2 → > 1.5 成立
    match.createBoard([
      match.createTile(0, City),
      match.createTile(1, City),
      match.createTile(2, City),
      match.createTile(3, Plain),
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

    match.forceSetCityOwner(0, a);
    match.forceSetCityOwner(1, a);
    match.forceSetCityOwner(2, b);

    GameMatchVer1Ops.evaluateTermination(cast(match, GameMatchCore));

    switch match.getTerminationReason() {
      case Victory(mid):
        if (mid != a)
          throw "TerminationTerritoryVictoryTest: expected winner m-a, got " + mid;
      default:
        throw "TerminationTerritoryVictoryTest: expected Victory";
    }
    trace("[TerminationTerritoryVictoryTest] OK — territory victory");
  }
}

