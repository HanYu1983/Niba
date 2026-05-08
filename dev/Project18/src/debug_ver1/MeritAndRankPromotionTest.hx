package debug_ver1;

import game.GameIds;
import game.GeneralStat;
import game.PositionRank;
import impl_ver1.model.General;

class MeritAndRankPromotionTest {
  public static function testMeritAndRankPromotion():Void {
    var g = new General("g-test", "m-test", 100, 100, 100, 100);
    if (g.positionRank() != Soldier)
      throw "MeritAndRankPromotionTest: expected initial rank Soldier";
    if (g.stat(Command) != 100)
      throw "MeritAndRankPromotionTest: expected stat base=100 at Soldier";

    // 升到 伍長（>=50）→ +2
    g.grantMerit(50);
    if (g.positionRank() != SquadLeader)
      throw "MeritAndRankPromotionTest: expected rank SquadLeader at merit>=50";
    if (g.stat(Command) != 102)
      throw "MeritAndRankPromotionTest: expected Command=102 at SquadLeader";

    // 升到 什長（>=150）→ +5
    g.grantMerit(100);
    if (g.positionRank() != SectionLeader)
      throw "MeritAndRankPromotionTest: expected rank SectionLeader at merit>=150";
    if (g.stat(Command) != 105)
      throw "MeritAndRankPromotionTest: expected Command=105 at SectionLeader";

    // 升到 大將軍（>=800）→ +15
    g.grantMerit(650);
    if (g.positionRank() != GreatGeneral)
      throw "MeritAndRankPromotionTest: expected rank GreatGeneral at merit>=800";
    if (g.stat(Command) != 115)
      throw "MeritAndRankPromotionTest: expected Command=115 at GreatGeneral";
  }
}

