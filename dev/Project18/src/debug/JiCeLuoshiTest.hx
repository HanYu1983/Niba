package debug;

import game.IGameMatch;
import game.IGeneral;
import game.IJiCe;
import game.IMonarch;
import game.IPlayer;
import game.IPlayerMenu;
import game.IPlayerMenuEntry;
import game.IPlayerMenuNode;
import game.PlayerMenuKind;

/**
 * 落石計策：對目標君主結算「一成」兵力折損（當前兵力之 10%，以小數進位收尾見 loseTroopFractionOneTenth）。
 */
class JiCeLuoshiTest {
  public static inline var LUOSHI_LABEL = "落石";

  public static function run():Void {
    var g = new SimpleGame();
    var match = g.createGameMatch(MatchLevels.KEY_JICE_LUOSHI_BASIC);
    var attacker = cast(match.monarchs()[0], SimpleMonarch);
    var defender = cast(match.monarchs()[1], SimpleMonarch);
    var gHigh = cast(attacker.roster()[0], SimpleGeneral);

    if (defender.grain() != 200 || attacker.grain() != 80)
      throw "JiCeLuoshiTest: grain precondition";

    var luoshi:IJiCe = new LuoshiJiCe(match);
    var player:IPlayer = match.createPlayer(attacker.id(), "攻方");
    var jiCeLeaf:IPlayerMenuEntry = match.createPlayerMenuEntry(JiCe, "計策：落石", true);

    match.applyMenuLeaf(player, jiCeLeaf, luoshi, defender.id());

    if (defender.troops() != 100)
      throw "JiCeLuoshiTest: 暫存階段守方兵力不得變動";

    var lossPickHigh = stagedLuoshiTroopLossPreview(defender.troops(), gHigh.stat(game.GeneralStat.Might));
    if (lossPickHigh != 15)
      throw "JiCeLuoshiTest: preview high might expected loss 15 got " + lossPickHigh;

    var menuPick = match.createPlayerMenu(player);
    var pickLeaf = findJiCePickLeaf(menuPick, "g-might-high");
    match.applyMenuLeaf(player, pickLeaf);

    var grainAfterDef = defender.grain();
    var troopsAfterDef = defender.troops();

    if (grainAfterDef != 200)
      throw "JiCeLuoshiTest: grain must be unchanged, got " + grainAfterDef;

    if (troopsAfterDef != 85)
      throw "JiCeLuoshiTest: expected defender troops 85 after loss " + lossPickHigh + ", got " + troopsAfterDef;

    if (attacker.troops() != 500)
      throw "JiCeLuoshiTest: attacker troops must be unchanged";

    if (match.pendingJiCe() != null)
      throw "JiCeLuoshiTest: pendingJiCe must be cleared";

    trace('[JiCeLuoshiTest] OK — 落石（暫存→選將）→ 守方兵力 100→' + troopsAfterDef + "，糧食仍 " + grainAfterDef);

    nonRoundTripCeilingCase();
  }

  public static function findJiCePickLeaf(menu:IPlayerMenu, generalId:String):IPlayerMenuEntry {
    function walk(nodes:Array<IPlayerMenuNode>):Null<IPlayerMenuEntry> {
      for (n in nodes) {
        var L = n.leaf();
        if (L != null && L.kind() == JiCePick && L.decisionToken() == generalId)
          return L;
        var h = walk(n.children());
        if (h != null)
          return h;
      }
      return null;
    }
    var found = walk(menu.rootNodes());
    if (found == null)
      throw "JiCeLuoshiTest: missing JiCePick for " + generalId;
    return found;
  }

  public static function loseTroopFractionOneTenth(currentTroops:Int):Int {
    if (currentTroops <= 0)
      return 0;
    return Std.int(Math.ceil(currentTroops * 0.1));
  }

  public static function stagedLuoshiTroopLossPreview(defenderTroops:Int, casterGeneralMight:Int):Int {
    return loseTroopFractionOneTenth(defenderTroops) + Std.int(casterGeneralMight / 10);
  }

  public static function resolveAgainstMonarch(card:IJiCe, target:IMonarch):Void {
    if (card.designLabel() != LUOSHI_LABEL)
      throw "JiCeLuoshiTest.resolveAgainstMonarch: not 落石 (" + card.designLabel() + ")";

    var m = cast(target, SimpleMonarch);
    var loss = loseTroopFractionOneTenth(m.troops());
    m.reduceTroops(loss);
  }

  static function nonRoundTripCeilingCase():Void {
    var g = new SimpleGame();
    var match = g.createGameMatch(MatchLevels.KEY_JICE_LUOSHI_CEILING);
    var atk = cast(match.monarchs()[0], SimpleMonarch);
    var d = cast(match.monarchs()[1], SimpleMonarch);
    var gen = cast(atk.roster()[0], SimpleGeneral);

    var p = match.createPlayer(atk.id(), "攻");
    var leaf = match.createPlayerMenuEntry(JiCe, "計策", true);
    match.applyMenuLeaf(p, leaf, new LuoshiJiCe(match), d.id());
    var expectLoss = stagedLuoshiTroopLossPreview(33, gen.stat(game.GeneralStat.Might));
    var pick = findJiCePickLeaf(match.createPlayerMenu(p), gen.id());
    match.applyMenuLeaf(p, pick);
    if (d.troops() != 33 - expectLoss)
      throw "JiCeLuoshiTest: 33 troops after preview loss " + expectLoss + " should be " + (33 - expectLoss) + ", got " + d.troops();
    trace("[JiCeLuoshiTest] OK — ceil 一成+勇武: 33→" + d.troops());
  }
}
