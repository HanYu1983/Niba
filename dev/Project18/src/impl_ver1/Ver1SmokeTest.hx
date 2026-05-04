package impl_ver1;

import game.GeneralStat;
import game.IGame;
import game.IGameMatch;
import game.IJiCe;
import game.IPlayer;
import game.IPlayerMenu;
import game.IPlayerMenuEntry;
import game.IPlayerMenuNode;
import game.MenuFieldIds;
import game.MenuFormWidget;
import game.PlayerMenuKind;

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
    var jiCeLeaf = match.createPlayerMenuEntry(JiCe, "計策：落石", true);

    match.applyMenuLeaf(player, jiCeLeaf, luoshi, defender.id());

    if (defender.troops() != 100)
      throw "Ver1SmokeTest: 暫存階段守方兵力不得變動";

    var pickLeaf = findJiCeStagingSubmitLeaf(match.createPlayerMenu(player));
    var form = new Map<String, Array<String>>();
    form.set(MenuFieldIds.JiCeStagingGenerals, ["g-might-high"]);
    match.applyMenuLeaf(player, pickLeaf, null, null, null, form);

    if (match.forceGetPendingJiCe() != null)
      throw "Ver1SmokeTest: forceGetPendingJiCe 應已清除";

    var lossPickHigh = LuoshiJiCe.previewTroopLoss(100, gHigh.stat(Might));
    if (defender.troops() != 100 - lossPickHigh)
      throw "Ver1SmokeTest: 守方兵力不符預期";

    trace("[Ver1SmokeTest] OK — impl_ver1 level_key→IGameMatch→LuoshiJiCe");
  }

  static function findJiCeStagingSubmitLeaf(menu:IPlayerMenu):IPlayerMenuEntry {
    function walk(nodes:Array<IPlayerMenuNode>):Null<IPlayerMenuEntry> {
      for (n in nodes) {
        var L = n.leaf();
        if (L != null && L.kind() == JiCeStagingSubmit)
          return L;
        for (w in n.formWidgets())
          switch w {
            case Button(entry):
              if (entry.kind() == JiCeStagingSubmit)
                return entry;
            case Slider(_, _, _, _, _, _):
            case GeneralMultiPick(_, _, _, _,):
          }
        var h = walk(n.children());
        if (h != null)
          return h;
      }
      return null;
    }
    var found = walk(menu.rootNodes());
    if (found == null)
      throw "Ver1SmokeTest: missing JiCeStagingSubmit leaf";
    return found;
  }
}
