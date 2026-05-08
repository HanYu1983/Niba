package impl_ver1.jice;

import game.Balance;
import game.GameIds;
import game.GameError;
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
import impl_ver1.jice.JiCeMenuLegalChoices;
import impl_ver1.jice.JiCeMenuSig;

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
    var gChoices:Array<MenuGeneralChoice> = JiCeMenuLegalChoices.eligibleCasters(ruler, registryKey(), StrategyCostTier.High);
    var defCaster:Array<String> = gChoices.length > 0 ? [gChoices[0].generalId] : [];

    var only = gameMatch.forceGetPendingLandingTile() != null ? ruler.pawnIndex() : null;
    var tChoices:Array<MenuTileChoice> = JiCeMenuLegalChoices.enemyTerritoryTileChoices(gameMatch, ruler.id(), only);
    var defTile:Array<Int> = tChoices.length > 0 ? [tChoices[0].tileIndex] : [];

    var enabled = gChoices.length > 0 && tChoices.length > 0;
    var sig = JiCeMenuSig.make([
      registryKey(),
      "phase=" + (gameMatch.forceGetPendingLandingTile() != null ? "post" : "pre"),
      "casters=" + gChoices.map(c -> c.generalId).join(","),
      "tiles=" + tChoices.map(t -> Std.string(t.tileIndex)).join(","),
    ]);
    var submit = gameMatch.createPlayerMenuEntry(PlayerMenuKind.StagingSubmit, "確認破壞", enabled, JiCeMenuSig.attach("sabotage_ok", sig));
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

    // --- menu snapshot sig（只作歸因，不作一票否決）---
    var token = MenuActivation.activatingEntry(menuNode).decisionToken();
    var gotSig = JiCeMenuSig.parseSig(token);
    var gChoices = JiCeMenuLegalChoices.eligibleCasters(ruler, registryKey(), StrategyCostTier.High);
    var only = gameMatch.forceGetPendingLandingTile() != null ? ruler.pawnIndex() : null;
    var tChoices = JiCeMenuLegalChoices.enemyTerritoryTileChoices(gameMatch, ruler.id(), only);
    var nowSig = JiCeMenuSig.make([
      registryKey(),
      "phase=" + (gameMatch.forceGetPendingLandingTile() != null ? "post" : "pre"),
      "casters=" + gChoices.map(c -> c.generalId).join(","),
      "tiles=" + tChoices.map(t -> Std.string(t.tileIndex)).join(","),
    ]);
    var sigMismatch = (gotSig != null && gotSig != nowSig);

    var casterOk = false;
    for (c in gChoices)
      if (c.generalId == casterId) {
        casterOk = true;
        break;
      }
    var tileOk = false;
    for (t in tChoices)
      if (t.tileIndex == targetTile) {
        tileOk = true;
        break;
      }
    if (!casterOk || !tileOk) {
      if (sigMismatch)
        throw JiCeMenuSig.stateChangedError("狀態已變更，請重新選擇破壞目標。", "jice-sabotage/state-changed");
      throw "SabotageJiCe: invalid-choice (sig matched) — menu/widget mismatch";
    }
    var caster = JiCeApply.requireCaster(ruler, casterId, "SabotageJiCe");
    JiCeApply.requireCasterRank(caster, Balance.requiredRankForStrategy(registryKey()), "SabotageJiCe");

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

    var tile = gameMatch.tileAt(targetTile);
    if (tile.kind() == TileKind.City) {
      var before = gameMatch.forceGetCityLevel(targetTile);
      // docs/數值算法.md §4.3：此策略採「失敗仍有 25% 基礎效果」。
      // ver1：基礎效果 = 降 1 階；失敗效果 = 25% → 以 deterministic 機率方式表達是否觸發降級。
      var okDrop = roll.ok
        || (impl_ver1.util.Deterministic.hash01('jice_sabotage|fail25|r=${gameMatch.roundNumber()}|m=${ruler.id()}|g=${casterId}|t=${targetTile}') < Balance.strategyFailBaseRate(registryKey()));
      if (okDrop) {
        var after = switch before {
          case Capital: game.CityLevel.BigCity;
          case BigCity: game.CityLevel.SmallCity;
          case SmallCity: game.CityLevel.Village;
          case Village: game.CityLevel.Village;
        };
        gameMatch.forceSetCityLevel(targetTile, after);
        effectLines.push('城池等級 ${Std.string(before)} → ${Std.string(after)}');
      } else {
        effectLines.push('城池等級 ${Std.string(before)}（不變）');
      }
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

