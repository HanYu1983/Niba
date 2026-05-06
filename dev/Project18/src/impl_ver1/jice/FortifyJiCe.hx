package impl_ver1.jice;

import game.Balance;
import game.GameIds;
import game.GeneralStat;
import game.IJiCe;
import game.IPlayer;
import game.IPlayerMenu;
import game.IPlayerMenuNode;
import game.MenuActivation;
import game.MenuFormWidget;
import game.MenuGeneralChoice;
import game.MenuTileChoice;
import game.PlayerMenuKind;
import game.StrategyCostTier;
import game.StrategyPhase;
import impl_ver1.core.GameMatchCore;
import impl_ver1.model.Monarch;
import impl_ver1.model.General;
import impl_ver1.model.PlayerMenu;
import impl_ver1.jice.JiCeRegistry;
import impl_ver1.jice.JiCeApply;

/**
 * 策略：築城（指定格子）
 * - 消耗：中
 * - 主要屬性：政治
 *
 * TODO(strategy-tile): docs 語意為「提升目標格子的防禦力」；
 * 目前先寫入 GameMatchCore 的 _tileDefenseBonus（尚未接到攻城/防禦計算）。
 */
class FortifyJiCe implements IJiCe {
  public static inline var REGISTRY_KEY = "jice_fortify";
  public static inline var DESIGN_LABEL = "築城";

  var gameMatch:GameMatchCore;

  public function new(gameMatch:GameMatchCore) {
    this.gameMatch = gameMatch;
  }

  public function designLabel():String
    return DESIGN_LABEL;

  public function registryKey():String
    return REGISTRY_KEY;

  public function allowedPhases():Array<StrategyPhase>
    return [PreMove, PostMove];

  public function buildPlayerMenu(actor:IPlayer):IPlayerMenu {
    var ruler = cast(gameMatch.activeMonarch(), Monarch);
    var roster = ruler.roster();
    if (roster.length == 0)
      throw "FortifyJiCe: roster empty";

    var gChoices:Array<MenuGeneralChoice> = [];
    var defCaster:Array<String> = [];
    for (g in roster) {
      var gid = g.id();
      gChoices.push({generalId: gid, caption: gid});
      if (defCaster.length == 0)
        defCaster.push(gid);
    }

    var tChoices:Array<MenuTileChoice> = [];
    var n = gameMatch.board().length();
    for (i in 0...n) {
      var tile = gameMatch.tileAt(i);
      tChoices.push({tileIndex: i, caption: '[$i] ' + Std.string(tile.kind())});
    }
    var defTile:Array<Int> = [ruler.pawnIndex()];

    var submit = gameMatch.createPlayerMenuEntry(PlayerMenuKind.StagingSubmit, "確認築城", true, "fortify_ok");
    var widgets:Array<MenuFormWidget> = [
      GeneralMultiPick("選擇發動武將（單選）", gChoices, defCaster),
      TileSinglePick("選擇目標格子", tChoices, defTile),
      Button(submit),
    ];
    var root = gameMatch.createPlayerMenuNode("築城", null, [], widgets);
    return new PlayerMenu(actor, "jice-" + registryKey(), [root]);
  }

  public function resolveChoice(actor:IPlayer, menuNode:IPlayerMenuNode):Void {
    if (!gameMatch.stagingMatchesJiCe(this))
      throw "FortifyJiCe.resolveChoice: pending mismatch";
    if (MenuActivation.activatingEntry(menuNode).kind() != PlayerMenuKind.StagingSubmit)
      throw "FortifyJiCe.resolveChoice: expected StagingSubmit";

    var widgets = menuNode.formWidgets();
    if (widgets.length < 2)
      throw "FortifyJiCe: missing widgets";
    var casterId = JiCeApply.readSingleGeneralId(widgets[0], "FortifyJiCe", "caster");
    var targetTile = JiCeApply.readSingleTileIndex(widgets[1], "FortifyJiCe", "tile");

    var ruler = cast(gameMatch.activeMonarch(), Monarch);
    if (gameMatch.forceGetPendingLandingTile() != null && targetTile != ruler.pawnIndex())
      throw "FortifyJiCe: post-move must target current tile";
    var caster = JiCeApply.requireCaster(ruler, casterId, "FortifyJiCe");

    var tier = StrategyCostTier.Medium;
    var ok = JiCeApply.rollAndConsumeStamina(caster, Stewardship, tier);

    if (!ok)
      return;

    gameMatch.forceAddTileDefenseBonus(targetTile, 0.15); // TODO(strategy-tile): 以規格表調整
  }

  static function readSingleGeneralId(w:MenuFormWidget, label:String):GeneralId {
    return JiCeApply.readSingleGeneralId(w, "FortifyJiCe", label);
  }

  static function readSingleTileIndex(w:MenuFormWidget, label:String):TileIndex {
    return JiCeApply.readSingleTileIndex(w, "FortifyJiCe", label);
  }

  static function __init__():Void {
    JiCeRegistry.register(REGISTRY_KEY, function(m:GameMatchCore) return new FortifyJiCe(m));
  }
}

