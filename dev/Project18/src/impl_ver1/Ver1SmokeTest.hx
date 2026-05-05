package impl_ver1;

import game.GeneralStat;
import game.IGame;
import game.IGameMatch;
import game.IJiCe;
import game.IPlayer;
import game.IPlayerMenu;
import game.MenuFormWidget;
import game.MenuNodeQuery;
import game.PlayerMenuKind;
import game.PlayerMenuKind.JiCe;
import game.PlayerMenuKind.JiCeStagingSubmit;

/**
 * Ver1 骨架煙霧：{@link IGame#createGameMatch}（{@code ver1/smoke}）→ LuoshiJiCe。
 */
class Ver1SmokeTest {
  public static function run():Void {
    var game:IGame = new Game();
    var match:IGameMatch = game.createGameMatch("ver1/smoke");

    var attacker = cast(match.monarchs()[0], Monarch);
    var defender = cast(match.monarchs()[1], Monarch);
    var gHigh = cast(attacker.roster()[0], General);

    var luoshi:IJiCe = match.createJiCe(LuoshiJiCe.REGISTRY_KEY, attacker.id());

    var player:IPlayer = match.createPlayer(attacker.id(), "攻方");

    var menuJi = match.createPlayerMenu(player);
    match.applyMenuLeaf(player, MenuNodeQuery.requireNodeWithKind(menuJi, JiCe), luoshi, defender.id());

    if (defender.troops() != 100)
      throw "Ver1SmokeTest: 暫存階段守方兵力不得變動";

    var menuPick = match.createPlayerMenu(player);
    var jNode = MenuNodeQuery.requireNodeWithKind(menuPick, JiCeStagingSubmit);
    var fw = jNode.formWidgets();
    switch fw[0] {
      case MonarchSinglePick(lbl, choices, _):
        fw[0] = MonarchSinglePick(lbl, choices, [defender.id()]);
      default:
        throw "Ver1SmokeTest: 預期計策暫存 MonarchSinglePick";
    }
    switch fw[1] {
      case GeneralMultiPick(lbl, choices, _):
        fw[1] = GeneralMultiPick(lbl, choices, ["g-might-high"]);
      default:
        throw "Ver1SmokeTest: 預期計策暫存 MultiPick";
    }
    var sub = MenuNodeQuery.buttonEntryOnNode(jNode, JiCeStagingSubmit);
    if (sub == null)
      throw "Ver1SmokeTest: 缺少確認計策選將";
    jNode.setActivationEntry(sub);
    match.applyMenuLeaf(player, jNode);

    if (match.forceGetPendingJiCe() != null)
      throw "Ver1SmokeTest: forceGetPendingJiCe 應已清除";

    var lossPickHigh = LuoshiJiCe.previewTroopLoss(100, gHigh.stat(Might));
    if (defender.troops() != 100 - lossPickHigh)
      throw "Ver1SmokeTest: 守方兵力不符預期";

    trace("[Ver1SmokeTest] OK — impl_ver1 level_key→IGameMatch→LuoshiJiCe");
  }
}
