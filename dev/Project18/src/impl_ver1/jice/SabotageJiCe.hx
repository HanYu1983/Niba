package impl_ver1.jice;

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
import game.TileKind;
import impl_ver1.core.GameMatchCore;
import impl_ver1.model.Monarch;
import impl_ver1.model.General;
import impl_ver1.model.PlayerMenu;
import impl_ver1.jice.JiCeRegistry;
import impl_ver1.jice.JiCeApply;

/**
 * 策略：破壞（指定格子）
 * - 消耗：高
 * - 主要屬性：智力
 *
 * NOTE(strategy-tile): docs 語意為「降低城池等級」；
 * ver1 已有城池等級（CityLevel），因此此處直接下調等級（最低為 Village）。
 */
class SabotageJiCe implements IJiCe {
  public static inline var REGISTRY_KEY = "jice_sabotage";
  public static inline var DESIGN_LABEL = "破壞";

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
      throw "SabotageJiCe: roster empty";

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

    var submit = gameMatch.createPlayerMenuEntry(PlayerMenuKind.StagingSubmit, "確認破壞", true, "sabotage_ok");
    var widgets:Array<MenuFormWidget> = [
      GeneralMultiPick("選擇發動武將（單選）", gChoices, defCaster),
      TileSinglePick("選擇目標格子", tChoices, defTile),
      Button(submit),
    ];
    var root = gameMatch.createPlayerMenuNode("破壞", null, [], widgets);
    return new PlayerMenu(actor, "jice-" + registryKey(), [root]);
  }

  public function resolveChoice(actor:IPlayer, menuNode:IPlayerMenuNode):Void {
    if (!gameMatch.stagingMatchesJiCe(this))
      throw "SabotageJiCe.resolveChoice: pending mismatch";
    if (MenuActivation.activatingEntry(menuNode).kind() != PlayerMenuKind.StagingSubmit)
      throw "SabotageJiCe.resolveChoice: expected StagingSubmit";

    var widgets = menuNode.formWidgets();
    if (widgets.length < 2)
      throw "SabotageJiCe: missing widgets";
    var casterId = JiCeApply.readSingleGeneralId(widgets[0], "SabotageJiCe", "caster");
    var targetTile = JiCeApply.readSingleTileIndex(widgets[1], "SabotageJiCe", "tile");

    var ruler = cast(gameMatch.activeMonarch(), Monarch);
    if (gameMatch.forceGetPendingLandingTile() != null && targetTile != ruler.pawnIndex())
      throw "SabotageJiCe: post-move must target current tile";
    var caster = JiCeApply.requireCaster(ruler, casterId, "SabotageJiCe");

    var tier = StrategyCostTier.High;
    var phase = gameMatch.forceGetPendingLandingTile() != null ? PostMove : PreMove;
    var roll = JiCeApply.rollAndConsumeStamina(
      gameMatch,
      caster,
      Wit,
      tier,
      'jice_sabotage|r=${gameMatch.roundNumber()}|m=${ruler.id()}|g=${casterId}|p=${Std.string(phase)}|t=${targetTile}'
    );
    var effectLines:Array<String> = [];
    if (!roll.ok) {
      JiCeApply.popupCaster(gameMatch, ruler.id(), designLabel(), phase, casterId, Wit, tier, roll, '格 $targetTile', effectLines, "jice-sabotage");
      return;
    }

    var tile = gameMatch.tileAt(targetTile);
    if (tile.kind() == TileKind.City) {
      var before = gameMatch.forceGetCityLevel(targetTile);
      var after = switch before {
        case Capital: game.CityLevel.BigCity;
        case BigCity: game.CityLevel.SmallCity;
        case SmallCity: game.CityLevel.Village;
        case Village: game.CityLevel.Village;
      };
      gameMatch.forceSetCityLevel(targetTile, after);
      effectLines.push('城池等級 ${Std.string(before)} → ${Std.string(after)}');
    } else {
      effectLines.push("目標非城池，無效果");
    }
    JiCeApply.popupCaster(gameMatch, ruler.id(), designLabel(), phase, casterId, Wit, tier, roll, '格 $targetTile', effectLines, "jice-sabotage");
  }

  static function readSingleGeneralId(w:MenuFormWidget, label:String):GeneralId {
    return JiCeApply.readSingleGeneralId(w, "SabotageJiCe", label);
  }

  static function readSingleTileIndex(w:MenuFormWidget, label:String):TileIndex {
    return JiCeApply.readSingleTileIndex(w, "SabotageJiCe", label);
  }

  static function __init__():Void {
    JiCeRegistry.register(REGISTRY_KEY, function(m:GameMatchCore) return new SabotageJiCe(m));
  }
}

