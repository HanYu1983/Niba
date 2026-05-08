package impl_ver1.jice;

import game.Balance;
import game.GameIds;
import game.GameError;
import game.GeneralEffect;
import game.GeneralStat;
import game.IJiCe;
import game.IPlayer;
import game.IPlayerMenu;
import game.IPlayerMenuNode;
import game.MenuActivation;
import game.MenuFormWidget;
import game.MenuGeneralChoice;
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
 * 策略：激勵（指定武將）— 指定武將下次指令效果提升。
 * - 使用時機：移動前
 * - 成功率：統率 × 基礎成功率 × 體力修正
 * - 體力消耗：低
 */
class EncourageJiCe implements IJiCe {
  public static inline var REGISTRY_KEY = "jice_encourage";
  public static inline var DESIGN_LABEL = "激勵";

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
    var casterChoices:Array<MenuGeneralChoice> = JiCeMenuLegalChoices.eligibleCasters(ruler, registryKey(), StrategyCostTier.Low);
    var targetChoices:Array<MenuGeneralChoice> = JiCeMenuLegalChoices.rosterChoices(ruler);
    var defCaster:Array<String> = casterChoices.length > 0 ? [casterChoices[0].generalId] : [];
    var defTarget:Array<String> = targetChoices.length > 0 ? [targetChoices[0].generalId] : [];

    var enabled = casterChoices.length > 0 && targetChoices.length > 0;
    var sig = JiCeMenuSig.make([
      registryKey(),
      "phase=pre",
      "casters=" + casterChoices.map(c -> c.generalId).join(","),
      "targets=" + targetChoices.map(c -> c.generalId).join(","),
    ]);
    var submit = gameMatch.createPlayerMenuEntry(PlayerMenuKind.StagingSubmit, "確認激勵", enabled, JiCeMenuSig.attach("encourage_ok", sig));
    var widgets:Array<MenuFormWidget> = [
      GeneralMultiPick("選擇發動武將（單選）", casterChoices, defCaster),
      GeneralMultiPick("選擇目標武將（單選）", targetChoices, defTarget),
      Button(submit),
    ];
    var root = gameMatch.createPlayerMenuNode("激勵", null, [], widgets);
    return new PlayerMenu(actor, "jice-" + registryKey(), [root]);
  }

  public function resolveChoice(actor:IPlayer, menuNode:IPlayerMenuNode):Void {
    if (!gameMatch.stagingMatchesJiCe(this))
      throw "EncourageJiCe.resolveChoice: pending mismatch";
    if (MenuActivation.activatingEntry(menuNode).kind() != PlayerMenuKind.StagingSubmit)
      throw "EncourageJiCe.resolveChoice: expected StagingSubmit";

    var widgets = menuNode.formWidgets();
    if (widgets.length < 2)
      throw "EncourageJiCe: missing widgets";

    var casterId = JiCeApply.readSingleGeneralId(widgets[0], "EncourageJiCe", "caster");
    var targetId = JiCeApply.readSingleGeneralId(widgets[1], "EncourageJiCe", "target");

    var ruler = cast(gameMatch.activeMonarch(), Monarch);

    // --- menu snapshot sig（只作歸因，不作一票否決）---
    var token = MenuActivation.activatingEntry(menuNode).decisionToken();
    var gotSig = JiCeMenuSig.parseSig(token);
    var casterChoices = JiCeMenuLegalChoices.eligibleCasters(ruler, registryKey(), StrategyCostTier.Low);
    var targetChoices = JiCeMenuLegalChoices.rosterChoices(ruler);
    var nowSig = JiCeMenuSig.make([
      registryKey(),
      "phase=pre",
      "casters=" + casterChoices.map(c -> c.generalId).join(","),
      "targets=" + targetChoices.map(c -> c.generalId).join(","),
    ]);
    var sigMismatch = (gotSig != null && gotSig != nowSig);

    var casterOk = false;
    for (c in casterChoices)
      if (c.generalId == casterId) {
        casterOk = true;
        break;
      }
    var targetOk = false;
    for (c in targetChoices)
      if (c.generalId == targetId) {
        targetOk = true;
        break;
      }
    if (!casterOk || !targetOk) {
      if (sigMismatch)
        throw JiCeMenuSig.stateChangedError("狀態已變更，請重新選擇激勵目標。", "jice-encourage/state-changed");
      throw new GameError("激勵目標已不合法（請重新開啟選單再選擇）。", "目標不合法", "jice-encourage/invalid-choice");
    }

    var caster = JiCeApply.requireCaster(ruler, casterId, "EncourageJiCe");
    JiCeApply.requireCasterRank(caster, Balance.requiredRankForStrategy(registryKey()), "EncourageJiCe");
    var target = JiCeApply.requireCaster(ruler, targetId, "EncourageJiCe");

    var tier = StrategyCostTier.Low;
    var phase = gameMatch.forceGetPendingLandingTile() != null ? PostMove : PreMove;
    var roll = JiCeApply.rollAndConsumeStamina(
      gameMatch,
      caster,
      Command,
      tier,
      'jice_encourage|r=${gameMatch.roundNumber()}|m=${ruler.id()}|g=${casterId}|p=${Std.string(phase)}|tg=${targetId}'
    );
    var effectLines:Array<String> = [];
    if (roll.ok) {
      // docs/數值算法.md §4.3：效果 = 基礎效果 × (屬性/100) × 體力修正
      // ver1：基礎「額外倍率」= +0.2（也就是 1.2×），並乘上效果倍率後加到 1.0 上。
      var extra = Balance.strategyEffectAmountFloat(0.20, caster.stat(Command), roll.before);
      var mult = 1.0 + extra;
      target.addEffect(GeneralEffect.NextCommandMultiplier(mult));
      effectLines.push("目標獲得下次指令倍率 " + Std.string(mult) + "×");
    }
    JiCeApply.popupCaster(gameMatch, ruler.id(), designLabel(), phase, casterId, Command, tier, roll, '武將 $targetId', effectLines, "jice-encourage");
  }

  static function readSinglePick(w:MenuFormWidget, label:String):GeneralId {
    return JiCeApply.readSingleGeneralId(w, "EncourageJiCe", label);
  }

  static function __init__():Void {
    JiCeRegistry.register(REGISTRY_KEY, function(m:GameMatchCore) return new EncourageJiCe(m));
  }
}

