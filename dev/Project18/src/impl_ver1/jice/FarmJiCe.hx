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
 * 策略：屯田（指定格子）
 * - 消耗：低
 * - 主要屬性：政治
 *
 * NOTE(strategy-tile): docs 語意為「提升目標格子下回合糧食產出」；
 * ver1 以一次性「下回合加成」寫入 GameMatchCore，並在回合結算時統一套用。
 */
class FarmJiCe implements IJiCe {
  public static inline var REGISTRY_KEY = "jice_farm";
  public static inline var DESIGN_LABEL = "屯田";

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
      throw "FarmJiCe: roster empty";

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

    var submit = gameMatch.createPlayerMenuEntry(PlayerMenuKind.StagingSubmit, "確認屯田", true, "farm_ok");
    var widgets:Array<MenuFormWidget> = [
      GeneralMultiPick("選擇發動武將（單選）", gChoices, defCaster),
      TileSinglePick("選擇目標格子", tChoices, defTile),
      Button(submit),
    ];
    var root = gameMatch.createPlayerMenuNode("屯田", null, [], widgets);
    return new PlayerMenu(actor, "jice-" + registryKey(), [root]);
  }

  public function resolveChoice(actor:IPlayer, menuNode:IPlayerMenuNode):Void {
    if (!gameMatch.stagingMatchesJiCe(this))
      throw "FarmJiCe.resolveChoice: pending mismatch";
    if (MenuActivation.activatingEntry(menuNode).kind() != PlayerMenuKind.StagingSubmit)
      throw "FarmJiCe.resolveChoice: expected StagingSubmit";

    var widgets = menuNode.formWidgets();
    if (widgets.length < 2)
      throw "FarmJiCe: missing widgets";
    var casterId = JiCeApply.readSingleGeneralId(widgets[0], "FarmJiCe", "caster");
    var targetTile = JiCeApply.readSingleTileIndex(widgets[1], "FarmJiCe", "tile");

    var ruler = cast(gameMatch.activeMonarch(), Monarch);
    if (gameMatch.forceGetPendingLandingTile() != null && targetTile != ruler.pawnIndex())
      throw "FarmJiCe: post-move must target current tile";
    var caster = JiCeApply.requireCaster(ruler, casterId, "FarmJiCe");

    var tier = StrategyCostTier.Low;
    var phase = gameMatch.forceGetPendingLandingTile() != null ? PostMove : PreMove;
    var roll = JiCeApply.rollAndConsumeStamina(
      gameMatch,
      caster,
      Stewardship,
      tier,
      'jice_farm|r=${gameMatch.roundNumber()}|m=${ruler.id()}|g=${casterId}|p=${Std.string(phase)}|t=${targetTile}'
    );
    var effectLines:Array<String> = [];
    if (!roll.ok) {
      JiCeApply.popupCaster(gameMatch, ruler.id(), designLabel(), phase, casterId, Stewardship, tier, roll, '格 $targetTile', effectLines, "jice-farm");
      return;
    }
    gameMatch.forceAddTileNextTurnGrainBonus(targetTile, 100); // NOTE(balance): 數值待平衡表調整
    effectLines.push("下回合糧食產出 +100");
    JiCeApply.popupCaster(gameMatch, ruler.id(), designLabel(), phase, casterId, Stewardship, tier, roll, '格 $targetTile', effectLines, "jice-farm");
  }

  static function readSingleGeneralId(w:MenuFormWidget, label:String):GeneralId {
    return JiCeApply.readSingleGeneralId(w, "FarmJiCe", label);
  }

  static function readSingleTileIndex(w:MenuFormWidget, label:String):TileIndex {
    return JiCeApply.readSingleTileIndex(w, "FarmJiCe", label);
  }

  static function __init__():Void {
    JiCeRegistry.register(REGISTRY_KEY, function(m:GameMatchCore) return new FarmJiCe(m));
  }
}

