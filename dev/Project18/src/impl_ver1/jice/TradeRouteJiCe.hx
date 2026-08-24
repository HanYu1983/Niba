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
 * 策略：商路（指定格子）
 * - 消耗：低
 * - 主要屬性：政治
 *
 * NOTE(strategy-tile): 目前寫入 GameMatchCore 的 _tileNextTurnGoldBonus，
 * 並在回合結算時統一套用（一次性加成）。
 */
class TradeRouteJiCe implements IJiCe {
  public static inline var REGISTRY_KEY = "jice_trade_route";
  public static inline var DESIGN_LABEL = "商路";

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
    var gChoices:Array<MenuGeneralChoice> = JiCeMenuLegalChoices.eligibleCasters(ruler, registryKey(), StrategyCostTier.Low);
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
    var submit = gameMatch.createPlayerMenuEntry(PlayerMenuKind.StagingSubmit, "確認商路", enabled, JiCeMenuSig.attach("trade_route_ok", sig));
    var widgets:Array<MenuFormWidget> = [
      GeneralMultiPick("選擇發動武將（單選）", gChoices, defCaster),
      TileSinglePick("選擇目標格子", tChoices, defTile),
      Button(submit),
    ];
    var root = gameMatch.createPlayerMenuNode("商路", null, [], widgets);
    return new PlayerMenu(actor, "jice-" + registryKey(), [root]);
  }

  public function resolveChoice(actor:IPlayer, menuNode:IPlayerMenuNode):Void {
    if (!gameMatch.stagingMatchesJiCe(this))
      throw "TradeRouteJiCe.resolveChoice: pending mismatch";
    if (MenuActivation.activatingEntry(menuNode).kind() != PlayerMenuKind.StagingSubmit)
      throw "TradeRouteJiCe.resolveChoice: expected StagingSubmit";

    var widgets = menuNode.formWidgets();
    if (widgets.length < 2)
      throw "TradeRouteJiCe: missing widgets";
    var casterId = JiCeApply.readSingleGeneralId(widgets[0], "TradeRouteJiCe", "caster");
    var targetTile = JiCeApply.readSingleTileIndex(widgets[1], "TradeRouteJiCe", "tile");

    var ruler = cast(gameMatch.activeMonarch(), Monarch);

    // --- menu snapshot sig（只作歸因，不作一票否決）---
    var token = MenuActivation.activatingEntry(menuNode).decisionToken();
    var gotSig = JiCeMenuSig.parseSig(token);
    var gChoices = JiCeMenuLegalChoices.eligibleCasters(ruler, registryKey(), StrategyCostTier.Low);
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
        throw JiCeMenuSig.stateChangedError("狀態已變更，請重新選擇商路目標。", "jice-trade-route/state-changed");
      throw "TradeRouteJiCe: invalid-choice (sig matched) — menu/widget mismatch";
    }
    var caster = JiCeApply.requireCaster(ruler, casterId, "TradeRouteJiCe");
    JiCeApply.requireCasterRank(caster, Balance.requiredRankForStrategy(registryKey()), "TradeRouteJiCe");

    var tier = StrategyCostTier.Low;
    var phase = gameMatch.forceGetPendingLandingTile() != null ? PostMove : PreMove;
    var roll = JiCeApply.rollAndConsumeStamina(
      gameMatch,
      caster,
      Stewardship,
      tier,
      'jice_trade_route|r=${gameMatch.roundNumber()}|m=${ruler.id()}|g=${casterId}|p=${Std.string(phase)}|t=${targetTile}'
    );
    var effectLines:Array<String> = [];
    // 商路失敗 → 0（策略類型：正向增益）
    if (!roll.ok) {
      JiCeApply.popupCaster(gameMatch, ruler.id(), designLabel(), phase, casterId, Stewardship, tier, roll, '格 $targetTile', effectLines, "jice-trade-route");
      return;
    }
    var amt = Balance.strategyEffectAmountInt(100, caster.stat(Stewardship), roll.before);
    gameMatch.forceAddTileNextTurnGoldBonus(targetTile, amt);
    effectLines.push("下回合金錢產出 +" + amt);
    JiCeApply.popupCaster(gameMatch, ruler.id(), designLabel(), phase, casterId, Stewardship, tier, roll, '格 $targetTile', effectLines, "jice-trade-route");
  }

  static function readSingleGeneralId(w:MenuFormWidget, label:String):GeneralId {
    return JiCeApply.readSingleGeneralId(w, "TradeRouteJiCe", label);
  }

  static function readSingleTileIndex(w:MenuFormWidget, label:String):TileIndex {
    return JiCeApply.readSingleTileIndex(w, "TradeRouteJiCe", label);
  }

  static function __init__():Void {
    JiCeRegistry.register(REGISTRY_KEY, function(m:GameMatchCore) return new TradeRouteJiCe(m));
  }
}

