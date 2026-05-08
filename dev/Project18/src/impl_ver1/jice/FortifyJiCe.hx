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
import impl_ver1.core.GameMatchCore;
import impl_ver1.model.Monarch;
import impl_ver1.model.General;
import impl_ver1.model.PlayerMenu;
import impl_ver1.jice.JiCeRegistry;
import impl_ver1.jice.JiCeApply;
import impl_ver1.jice.JiCeMenuLegalChoices;
import impl_ver1.jice.JiCeMenuSig;

/**
 * 策略：築城（指定格子）
 * - 消耗：中
 * - 主要屬性：政治
 *
 * NOTE(strategy-tile): docs 語意為「提升目標格子的防禦力」；
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
    var gChoices:Array<MenuGeneralChoice> = JiCeMenuLegalChoices.eligibleCasters(ruler, registryKey(), StrategyCostTier.Medium);
    var defCaster:Array<String> = gChoices.length > 0 ? [gChoices[0].generalId] : [];

    var only = gameMatch.forceGetPendingLandingTile() != null ? ruler.pawnIndex() : null;
    var tChoices:Array<MenuTileChoice> = JiCeMenuLegalChoices.ownedTerritoryTileChoices(gameMatch, ruler.id(), only);
    var defTile:Array<Int> = tChoices.length > 0 ? [tChoices[0].tileIndex] : [];

    var enabled = gChoices.length > 0 && tChoices.length > 0;
    var sig = JiCeMenuSig.make([
      registryKey(),
      "phase=" + (gameMatch.forceGetPendingLandingTile() != null ? "post" : "pre"),
      "casters=" + gChoices.map(c -> c.generalId).join(","),
      "tiles=" + tChoices.map(t -> Std.string(t.tileIndex)).join(","),
    ]);
    var submit = gameMatch.createPlayerMenuEntry(PlayerMenuKind.StagingSubmit, "確認築城", enabled, JiCeMenuSig.attach("fortify_ok", sig));
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

    // --- menu snapshot sig（只作歸因，不作一票否決）---
    var token = MenuActivation.activatingEntry(menuNode).decisionToken();
    var gotSig = JiCeMenuSig.parseSig(token);
    var gChoices = JiCeMenuLegalChoices.eligibleCasters(ruler, registryKey(), StrategyCostTier.Medium);
    var only = gameMatch.forceGetPendingLandingTile() != null ? ruler.pawnIndex() : null;
    var tChoices = JiCeMenuLegalChoices.ownedTerritoryTileChoices(gameMatch, ruler.id(), only);
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
        throw JiCeMenuSig.stateChangedError("狀態已變更，請重新選擇築城目標。", "jice-fortify/state-changed");
      throw "FortifyJiCe: invalid-choice (sig matched) — menu/widget mismatch";
    }
    var caster = JiCeApply.requireCaster(ruler, casterId, "FortifyJiCe");
    JiCeApply.requireCasterRank(caster, Balance.requiredRankForStrategy(registryKey()), "FortifyJiCe");

    var tier = StrategyCostTier.Medium;
    var phase = gameMatch.forceGetPendingLandingTile() != null ? PostMove : PreMove;
    var roll = JiCeApply.rollAndConsumeStamina(
      gameMatch,
      caster,
      Stewardship,
      tier,
      'jice_fortify|r=${gameMatch.roundNumber()}|m=${ruler.id()}|g=${casterId}|p=${Std.string(phase)}|t=${targetTile}'
    );
    var effectLines:Array<String> = [];
    // 築城失敗 → 0（策略類型：正向增益）
    if (!roll.ok) {
      JiCeApply.popupCaster(gameMatch, ruler.id(), designLabel(), phase, casterId, Stewardship, tier, roll, '格 $targetTile', effectLines, "jice-fortify");
      return;
    }
    var amt = Balance.strategyEffectAmountFloat(0.15, caster.stat(Stewardship), roll.before);
    gameMatch.forceAddTileDefenseBonus(targetTile, amt);
    effectLines.push("防禦加成 +" + Std.string(amt));
    JiCeApply.popupCaster(gameMatch, ruler.id(), designLabel(), phase, casterId, Stewardship, tier, roll, '格 $targetTile', effectLines, "jice-fortify");
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

