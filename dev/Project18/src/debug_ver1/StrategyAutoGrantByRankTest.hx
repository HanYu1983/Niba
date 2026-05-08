package debug_ver1;

import game.GameIds;
import game.IGame;
import game.IGameMatch;
import game.IPlayer;
import game.LevelKeys;
import game.MenuNodeQuery;
import game.PlayerMenuKind;
import game.TileKind;
import impl_ver1.model.General;
import impl_ver1.model.Monarch;

/**
 * docs/策略系統.md：策略可依職位解鎖。
 * ver1：即使沒額外拿到牌，只要職位達標，也應自動補齊可用策略卡（至少基礎策略）。
 */
class StrategyAutoGrantByRankTest {
  public static function testStrategyAutoGrantByRank(game:IGame):Void {
    var match:IGameMatch = game.createGameMatch(LevelKeys.EMPTY);
    match.createBoard([match.createTile(0, Plain)]);

    var idA:MonarchId = "m-a";
    match.createMonarch(idA, 0, 0, 0, 0);
    match.createGeneral("g-a", idA, 80, 80, 80, 80);
    var actor:IPlayer = match.createPlayer(idA, "A");

    // 不手動 createJiCe；靠 auto-grant
    var menu0 = match.createPlayerMenu(actor);
    var n0 = MenuNodeQuery.requireNodeWithKind(menu0, PlayerMenuKind.JiCe);
    if (n0.leaf() == null || !n0.leaf().isEnabled())
      throw "StrategyAutoGrantByRankTest: expected JiCe node enabled after auto-grant";

    // 升到大將軍後再刷新一次，仍應可用
    var ruler = cast(match.activeMonarch(), Monarch);
    var g = cast(ruler.roster()[0], General);
    g.grantMerit(800);
    var menu1 = match.createPlayerMenu(actor);
    var n1 = MenuNodeQuery.requireNodeWithKind(menu1, PlayerMenuKind.JiCe);
    if (n1.leaf() == null || !n1.leaf().isEnabled())
      throw "StrategyAutoGrantByRankTest: expected JiCe node enabled at GreatGeneral";
  }
}

