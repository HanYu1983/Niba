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
 * 策略：火計（指定格子）
 * - 消耗：中
 * - 主要屬性：智力
 * - 使用時機：移動前、移動後（敵方領地）
 *
 * NOTE(strategy-tile): ver1 尚未有「敵方領地」判定與格子駐軍模型；
 * 先以 City 格的 storedTroops 作為示範目標。
 */
class FireJiCe implements IJiCe {
  public static inline var REGISTRY_KEY = "jice_fire";
  public static inline var DESIGN_LABEL = "火計";

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
    var gChoices:Array<MenuGeneralChoice> = JiCeMenuLegalChoices.eligibleCasters(ruler, registryKey(), StrategyCostTier.Medium);
    var defCaster:Array<String> = gChoices.length > 0 ? [gChoices[0].generalId] : [];

    // 合法目標格：PreMove 可選敵方領地；PostMove 只能選當前所站格且仍需為敵方領地
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
    var submit = gameMatch.createPlayerMenuEntry(PlayerMenuKind.StagingSubmit, "確認火計", enabled, JiCeMenuSig.attach("fire_ok", sig));
    var widgets:Array<MenuFormWidget> = [
      GeneralMultiPick("選擇發動武將（單選）", gChoices, defCaster),
      TileSinglePick("選擇目標格子", tChoices, defTile),
      Button(submit),
    ];
    var root = gameMatch.createPlayerMenuNode("火計", null, [], widgets);
    return new PlayerMenu(actor, "jice-" + registryKey(), [root]);
  }

  public function resolveChoice(actor:IPlayer, menuNode:IPlayerMenuNode):Void {
    if (!gameMatch.stagingMatchesJiCe(this))
      throw "FireJiCe.resolveChoice: pending mismatch";
    if (MenuActivation.activatingEntry(menuNode).kind() != PlayerMenuKind.StagingSubmit)
      throw "FireJiCe.resolveChoice: expected StagingSubmit";

    var widgets = menuNode.formWidgets();
    if (widgets.length < 2)
      throw "FireJiCe: missing widgets";
    var casterId = JiCeApply.readSingleGeneralId(widgets[0], "FireJiCe", "caster");
    var targetTile = JiCeApply.readSingleTileIndex(widgets[1], "FireJiCe", "tile");

    var ruler = cast(gameMatch.activeMonarch(), Monarch);
    // --- menu snapshot sig（只作歸因，不作一票否決）---
    var token = MenuActivation.activatingEntry(menuNode).decisionToken();
    var gotSig = JiCeMenuSig.parseSig(token);
    var gChoices = JiCeMenuLegalChoices.eligibleCasters(ruler, registryKey(), StrategyCostTier.Medium);
    var only = gameMatch.forceGetPendingLandingTile() != null ? ruler.pawnIndex() : null;
    var tChoices = JiCeMenuLegalChoices.enemyTerritoryTileChoices(gameMatch, ruler.id(), only);
    var nowSig = JiCeMenuSig.make([
      registryKey(),
      "phase=" + (gameMatch.forceGetPendingLandingTile() != null ? "post" : "pre"),
      "casters=" + gChoices.map(c -> c.generalId).join(","),
      "tiles=" + tChoices.map(t -> Std.string(t.tileIndex)).join(","),
    ]);
    var sigMismatch = (gotSig != null && gotSig != nowSig);

    // 當下合法性：以「現在」的合法集合為準（sig mismatch 時若仍合法照樣執行）
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
        throw JiCeMenuSig.stateChangedError("狀態已變更，請重新選擇火計目標。", "jice-fire/state-changed");
      throw "FireJiCe: invalid-choice (sig matched) — menu/widget mismatch";
    }
    var caster = JiCeApply.requireCaster(ruler, casterId, "FireJiCe");
    JiCeApply.requireCasterRank(caster, Balance.requiredRankForStrategy(registryKey()), "FireJiCe");

    var tier = StrategyCostTier.Medium;
    var phase = gameMatch.forceGetPendingLandingTile() != null ? PostMove : PreMove;
    var roll = JiCeApply.rollAndConsumeStamina(
      gameMatch,
      caster,
      Wit,
      tier,
      'jice_fire|r=${gameMatch.roundNumber()}|m=${ruler.id()}|g=${casterId}|p=${Std.string(phase)}|t=${targetTile}'
    );

    var effectLines:Array<String> = [];
    var tile = gameMatch.tileAt(targetTile);
    // 骨架：僅對 City 格生效（示範用）
    if (tile.kind() == TileKind.City) {
      var prevT = gameMatch.forceGetCityStoredTroops(targetTile);
      // docs/數值算法.md §4.3：
      // - 成功：基礎效果 × (屬性/100) × 體力修正
      // - 失敗：0 或基礎效果的 25%（此策略採 25%）
      var baseLossRatio = 0.20;
      var ratio = if (roll.ok) {
        baseLossRatio * Balance.strategyEffectMultiplier(caster.stat(Wit), roll.before);
      } else {
        baseLossRatio * Balance.strategyFailBaseRate(registryKey());
      };
      if (ratio < 0)
        ratio = 0;
      if (ratio > 1)
        ratio = 1;
      var loss = Balance.clampInt(Std.int(Math.floor(prevT * ratio)), 0, prevT);
      gameMatch.putCityStores(targetTile, prevT - loss, gameMatch.forceGetCityStoredGrain(targetTile));
      effectLines.push('城池兵力 ${prevT} → ${prevT - loss}（-${loss}，比例=${Std.int(Math.floor(ratio * 100))}%）');
    } else {
      effectLines.push("目標非城池，無效果");
    }

    JiCeApply.popupCaster(gameMatch, ruler.id(), designLabel(), phase, casterId, Wit, tier, roll, '格 $targetTile', effectLines, "jice-fire");
  }

  static function readSingleGeneralId(w:MenuFormWidget, label:String):GeneralId {
    return JiCeApply.readSingleGeneralId(w, "FireJiCe", label);
  }

  static function readSingleTileIndex(w:MenuFormWidget, label:String):TileIndex {
    return JiCeApply.readSingleTileIndex(w, "FireJiCe", label);
  }

  static function __init__():Void {
    JiCeRegistry.register(REGISTRY_KEY, function(m:GameMatchCore) return new FireJiCe(m));
  }
}

