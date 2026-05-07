package debug_ver1;

import game.GameIds;
import game.IGame;
import game.IGameMatch;
import game.IPlayer;
import game.LevelKeys;
import game.MatchTerminationReason;
import game.MenuNodeQuery;
import game.PlayerMenuKind.ConfirmDone;
import game.PlayerMenuKind.Move;
import game.PlayerMenuKind.LandingContinue;
import game.PlayerMenuKind.Status;
import game.TileKind;

/**
 * 對齊 GDD 2.4：時限勝利（回合數達 100 → 綜合評分最高者勝）。
 */
class TerminationTimeLimitVictoryTest {
  public static function testTerminationTimeLimitVictory(game:IGame):Void {
    var match:IGameMatch = game.createGameMatch(LevelKeys.EMPTY);

    match.createBoard([
      match.createTile(0, Plain),
      match.createTile(1, Plain),
      match.createTile(2, Plain),
      match.createTile(3, Plain),
    ]);

    var a:MonarchId = "m-a";
    var b:MonarchId = "m-b";
    match.createMonarch(a, 0, 0, 0, 0);
    match.createGeneral("g-a", a, 1, 1, 1, 1);
    match.createMonarch(b, 1, 0, 0, 0);
    match.createGeneral("g-b", b, 1, 1, 1, 1);

    // 避免提前觸發征服：兩邊都有兵
    cast(match.monarchById(a), impl_ver1.model.Monarch).grantTroops(10);
    cast(match.monarchById(b), impl_ver1.model.Monarch).grantTroops(10);
    // 避免糧食維持費導致兵力歸零（否則會提前 Draw）
    cast(match.monarchById(a), impl_ver1.model.Monarch).grantGrain(1000);
    cast(match.monarchById(b), impl_ver1.model.Monarch).grantGrain(1000);

    // 讓 A 的分數更高（不達財富勝利門檻）
    cast(match.monarchById(a), impl_ver1.model.Monarch).grantGold(1000);

    var actorA:IPlayer = match.createPlayer(a, "A");
    var actorB:IPlayer = match.createPlayer(b, "B");

    match.forceSetFixedMoveDelta(1);

    // 拉到第 100 回合：每回合要「Move → LandingContinue → ConfirmDone」才會輪轉並推進 round
    while (match.roundNumber() < 100) {
      var mid = match.activeMonarch().id();
      var actor = mid == a ? actorA : actorB;
      match.applyMenuLeaf(actor, MenuNodeQuery.requireNodeWithKind(match.createPlayerMenu(actor), Move));
      match.applyMenuLeaf(actor, MenuNodeQuery.requireNodeWithKind(match.createPlayerMenu(actor), LandingContinue));
      match.applyMenuLeaf(actor, MenuNodeQuery.requireNodeWithKind(match.createPlayerMenu(actor), ConfirmDone));
    }

    // 保險：用一個無副作用 leaf 再觸發一次 evaluateTermination
    var mid = match.activeMonarch().id();
    var actor = mid == a ? actorA : actorB;
    match.applyMenuLeaf(actor, MenuNodeQuery.requireNodeWithKind(match.createPlayerMenu(actor), Status));

    var sa = match.scoreOfMonarch(a);
    var sb = match.scoreOfMonarch(b);
    if (sa == sb)
      throw "TerminationTimeLimitVictoryTest: expected score a > b, got a=" + sa + ", b=" + sb;
    if (match.monarchs().length != 2) {
      var parts:Array<String> = [];
      for (m in match.monarchs()) {
        parts.push(m.id() + "=" + match.scoreOfMonarch(m.id()));
      }
      throw "TerminationTimeLimitVictoryTest: expected 2 monarchs, got " + match.monarchs().length + " (" + parts.join(",") + ")";
    }

    switch match.getTerminationReason() {
      case Victory(mid):
        if (mid != a)
          throw "TerminationTimeLimitVictoryTest: expected winner m-a, got " + mid;
      default:
        throw "TerminationTimeLimitVictoryTest: expected Victory, got " + Std.string(match.getTerminationReason());
    }
    trace("[TerminationTimeLimitVictoryTest] OK — time limit victory");
  }
}

