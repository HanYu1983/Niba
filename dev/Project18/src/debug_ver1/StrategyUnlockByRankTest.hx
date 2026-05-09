package debug_ver1;

import game.GameIds;
import game.IGame;
import game.IGameMatch;
import game.IPlayer;
import game.IPlayerMenuNode;
import game.LevelKeys;
import game.PlayerMenuKind;
import impl_ver1.jice.AwakenJiCe;
import impl_ver1.jice.ConscriptionJiCe;
import impl_ver1.jice.DissensionJiCe;
import impl_ver1.jice.EncourageJiCe;
import impl_ver1.jice.FarmJiCe;
import impl_ver1.jice.FireJiCe;
import impl_ver1.jice.FortifyJiCe;
import impl_ver1.jice.HealJiCe;
import impl_ver1.jice.InspireJiCe;
import impl_ver1.jice.RaidJiCe;
import impl_ver1.jice.RumorJiCe;
import impl_ver1.jice.SabotageJiCe;
import impl_ver1.jice.TradeRouteJiCe;
import impl_ver1.model.General;
import impl_ver1.model.Monarch;

class StrategyUnlockByRankTest {
  public static function testStrategyUnlockByRank(game:IGame):Void {
    var match:IGameMatch = game.createGameMatch(LevelKeys.EMPTY);
    var tiles = [match.createTile(0, Plain)];
    match.createBoard(tiles);

    var idA:MonarchId = "m-a";
    var idB:MonarchId = "m-b";
    match.createMonarch(idA, 0, 0, 200, 50);
    match.createPlayer(idA, idA, false);
    match.createMonarch(idB, 1, 0, 200, 50);
    match.createPlayer(idB, idB, false);
    match.createGeneral("g-a", idA, 80, 80, 80, 80);
    match.createGeneral("g-b", idB, 80, 80, 80, 80);

    // A 持有全部策略牌（用來驗證選單會依職位過濾）
    match.createJiCe(FireJiCe.REGISTRY_KEY, idA);
    match.createJiCe(InspireJiCe.REGISTRY_KEY, idA);
    match.createJiCe(FarmJiCe.REGISTRY_KEY, idA);
    match.createJiCe(EncourageJiCe.REGISTRY_KEY, idA);
    match.createJiCe(TradeRouteJiCe.REGISTRY_KEY, idA);
    match.createJiCe(HealJiCe.REGISTRY_KEY, idA);
    match.createJiCe(FortifyJiCe.REGISTRY_KEY, idA);
    match.createJiCe(RumorJiCe.REGISTRY_KEY, idA);
    match.createJiCe(AwakenJiCe.REGISTRY_KEY, idA);
    match.createJiCe(SabotageJiCe.REGISTRY_KEY, idA);
    match.createJiCe(DissensionJiCe.REGISTRY_KEY, idA);
    match.createJiCe(RaidJiCe.REGISTRY_KEY, idA);
    match.createJiCe(ConscriptionJiCe.REGISTRY_KEY, idA);

    var actorA:IPlayer = match.playerForMonarch(idA);
    var rulerA = cast(match.activeMonarch(), Monarch);
    var gA = cast(rulerA.roster()[0], General);

    // Soldier：只應看到 火計/鼓舞/屯田
    var m0 = match.createPlayerMenu(actorA);
    assertHasJiCe(m0.rootNodes(), "火計", true);
    assertHasJiCe(m0.rootNodes(), "鼓舞", true);
    assertHasJiCe(m0.rootNodes(), "屯田", true);
    assertHasJiCe(m0.rootNodes(), "商路", false);
    assertHasJiCe(m0.rootNodes(), "療傷", false);
    assertHasJiCe(m0.rootNodes(), "急襲", false);

    // 升到 SquadLeader（>=50）→ 解鎖 激勵/商路
    gA.grantMerit(50);
    var m1 = match.createPlayerMenu(actorA);
    assertHasJiCe(m1.rootNodes(), "激勵", true);
    assertHasJiCe(m1.rootNodes(), "商路", true);

    // 升到 SectionLeader（>=150）→ 解鎖 療傷/築城/流言
    gA.grantMerit(100);
    var m2 = match.createPlayerMenu(actorA);
    assertHasJiCe(m2.rootNodes(), "療傷", true);
    assertHasJiCe(m2.rootNodes(), "築城", true);
    assertHasJiCe(m2.rootNodes(), "流言", true);

    // 升到 General（>=500）→ 解鎖 急襲/徵兵
    gA.grantMerit(350);
    var m3 = match.createPlayerMenu(actorA);
    assertHasJiCe(m3.rootNodes(), "急襲", true);
    assertHasJiCe(m3.rootNodes(), "徵兵", true);

    trace("[StrategyUnlockByRankTest] OK — strategy menu filtered by position rank");
  }

  static function assertHasJiCe(nodes:Array<IPlayerMenuNode>, caption:String, expected:Bool):Void {
    var found = findJiCeNodeByCaption(nodes, caption);
    if ((found != null) != expected)
      throw "StrategyUnlockByRankTest: expected " + caption + " present=" + expected;
    if (found != null) {
      var L = found.leaf();
      if (L == null || L.kind() != PlayerMenuKind.JiCe)
        throw "StrategyUnlockByRankTest: found node but not JiCe leaf: " + caption;
    }
  }

  static function findJiCeNodeByCaption(nodes:Array<IPlayerMenuNode>, caption:String):Null<IPlayerMenuNode> {
    for (n in nodes) {
      var L = n.leaf();
      if (L != null && L.kind() == PlayerMenuKind.JiCe && n.caption() == caption)
        return n;
      var inner = findJiCeNodeByCaption(n.children(), caption);
      if (inner != null)
        return inner;
    }
    return null;
  }
}

