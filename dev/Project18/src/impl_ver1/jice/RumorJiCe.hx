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
import game.MenuMonarchChoice;
import game.PlayerMenuKind;
import game.StrategyCostTier;
import game.StrategyPhase;
import impl_ver1.core.GameMatchCore;
import impl_ver1.model.General;
import impl_ver1.model.Monarch;
import impl_ver1.model.PlayerMenu;
import impl_ver1.jice.JiCeApply;
import impl_ver1.jice.JiCeMenuLegalChoices;
import impl_ver1.jice.JiCeMenuSig;

/**
 * 策略：【指定玩家】流言 — 降低目標玩家聲望。
 * - 消耗：中
 * - 主要屬性：智力
 * - 使用時機：移動前
 *
 * 骨架：ver1 新增 {@link Monarch#prestige} 欄位作為最小可用資料來源。
 */
class RumorJiCe implements IJiCe {
  public static inline var REGISTRY_KEY = "jice_rumor";
  public static inline var DESIGN_LABEL = "流言";

  var gameMatch:GameMatchCore;

  public function new(gameMatch:GameMatchCore) {
    this.gameMatch = gameMatch;
  }

  public function designLabel():String
    return DESIGN_LABEL;

  public function registryKey():String
    return REGISTRY_KEY;

  public function allowedPhases():Array<StrategyPhase>
    return [PreMove];

  public function buildPlayerMenu(actor:IPlayer):IPlayerMenu {
    var ruler = cast(gameMatch.activeMonarch(), Monarch);
    var monarchChoices:Array<MenuMonarchChoice> = JiCeMenuLegalChoices.otherMonarchChoices(gameMatch, actor.monarchId());
    var defTarget:Array<String> = monarchChoices.length > 0 ? [monarchChoices[0].monarchId] : [];

    var gChoices:Array<MenuGeneralChoice> = JiCeMenuLegalChoices.eligibleCasters(ruler, registryKey(), StrategyCostTier.Medium);
    var defCaster:Array<String> = gChoices.length > 0 ? [gChoices[0].generalId] : [];

    var enabled = monarchChoices.length > 0 && gChoices.length > 0;
    var sig = JiCeMenuSig.make([
      registryKey(),
      "phase=pre",
      "casters=" + gChoices.map(c -> c.generalId).join(","),
      "monarchs=" + monarchChoices.map(m -> m.monarchId).join(","),
    ]);
    var submit = gameMatch.createPlayerMenuEntry(PlayerMenuKind.StagingSubmit, "確認流言", enabled, JiCeMenuSig.attach("rumor_ok", sig));
    var widgets:Array<MenuFormWidget> = [
      MonarchSinglePick("選擇目標君主", monarchChoices, defTarget),
      GeneralMultiPick("選擇發動武將（單選）", gChoices, defCaster),
      Button(submit),
    ];
    var root = gameMatch.createPlayerMenuNode("流言", null, [], widgets);
    return new PlayerMenu(actor, "jice-" + registryKey(), [root]);
  }

  public function resolveChoice(actor:IPlayer, menuNode:IPlayerMenuNode):Void {
    if (!gameMatch.stagingMatchesJiCe(this))
      throw "RumorJiCe.resolveChoice: pending mismatch";
    if (MenuActivation.activatingEntry(menuNode).kind() != PlayerMenuKind.StagingSubmit)
      throw "RumorJiCe.resolveChoice: expected StagingSubmit";

    var widgets = menuNode.formWidgets();
    if (widgets.length < 2)
      throw "RumorJiCe: missing widgets";

    var targetMonarchId = JiCeApply.readSingleMonarchId(widgets[0], "RumorJiCe", "target");
    var casterId = JiCeApply.readSingleGeneralId(widgets[1], "RumorJiCe", "caster");

    var ruler = cast(gameMatch.activeMonarch(), Monarch);

    // --- menu snapshot sig（只作歸因，不作一票否決）---
    var token = MenuActivation.activatingEntry(menuNode).decisionToken();
    var gotSig = JiCeMenuSig.parseSig(token);
    var monarchChoices = JiCeMenuLegalChoices.otherMonarchChoices(gameMatch, actor.monarchId());
    var gChoices = JiCeMenuLegalChoices.eligibleCasters(ruler, registryKey(), StrategyCostTier.Medium);
    var nowSig = JiCeMenuSig.make([
      registryKey(),
      "phase=pre",
      "casters=" + gChoices.map(c -> c.generalId).join(","),
      "monarchs=" + monarchChoices.map(m -> m.monarchId).join(","),
    ]);
    var sigMismatch = (gotSig != null && gotSig != nowSig);

    var casterOk = false;
    for (c in gChoices)
      if (c.generalId == casterId) {
        casterOk = true;
        break;
      }
    var targetOk = false;
    for (m in monarchChoices)
      if (m.monarchId == targetMonarchId) {
        targetOk = true;
        break;
      }
    if (!casterOk || !targetOk) {
      if (sigMismatch)
        throw JiCeMenuSig.stateChangedError("狀態已變更，請重新選擇流言目標。", "jice-rumor/state-changed");
      throw "RumorJiCe: invalid-choice (sig matched) — menu/widget mismatch";
    }

    var caster = JiCeApply.requireCaster(ruler, casterId, "RumorJiCe");
    JiCeApply.requireCasterRank(caster, Balance.requiredRankForStrategy(registryKey()), "RumorJiCe");

    var tier = StrategyCostTier.Medium;
    var phase = gameMatch.forceGetPendingLandingTile() != null ? PostMove : PreMove;
    var roll = JiCeApply.rollAndConsumeStamina(
      gameMatch,
      caster,
      Wit,
      tier,
      'jice_rumor|r=${gameMatch.roundNumber()}|m=${ruler.id()}|g=${casterId}|p=${Std.string(phase)}|t=${targetMonarchId}'
    );
    var effectLines:Array<String> = [];
    // docs/數值算法.md §4.3：此策略採「失敗仍有 25% 基礎效果」。
    var delta = roll.ok ? 5 : Balance.strategyFailEffectAmountInt(5, registryKey());
    // docs/數值算法.md 7.1：使用流言策略 → 聲望降低（成功 -5；失敗依上式取 25%）
    for (m in gameMatch.monarchs())
      if (m.id() == targetMonarchId) {
        var tm = cast(m, Monarch);
        tm.reducePrestige(delta);
        break;
      }

    effectLines.push("聲望 -" + delta);
    JiCeApply.popupCaster(gameMatch, ruler.id(), designLabel(), phase, casterId, Wit, tier, roll, '君主 $targetMonarchId', effectLines, "jice-rumor");
    JiCeApply.popupTargetMonarch(gameMatch, targetMonarchId, designLabel(), ruler.id(), casterId, effectLines, "jice-rumor/target");
  }

  static function readSingleGeneralId(w:MenuFormWidget, label:String):GeneralId {
    return JiCeApply.readSingleGeneralId(w, "RumorJiCe", label);
  }

  static function readSingleMonarchId(w:MenuFormWidget, label:String):MonarchId {
    return JiCeApply.readSingleMonarchId(w, "RumorJiCe", label);
  }

  static function __init__():Void {
    JiCeRegistry.register(REGISTRY_KEY, function(m:GameMatchCore) return new RumorJiCe(m));
  }
}

