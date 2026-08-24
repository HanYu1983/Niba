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
import impl_ver1.jice.JiCeApply;
import impl_ver1.model.General;
import impl_ver1.model.Monarch;
import impl_ver1.model.PlayerMenu;
import impl_ver1.jice.JiCeMenuLegalChoices;
import impl_ver1.jice.JiCeMenuSig;

/**
 * 策略：【指定玩家】急襲 — 對目標玩家造成士兵損失。
 * - 消耗：高
 * - 主要屬性：武力
 * - 使用時機：移動前
 */
class RaidJiCe implements IJiCe {
  public static inline var REGISTRY_KEY = "jice_raid";
  public static inline var DESIGN_LABEL = "急襲";

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

    var gChoices:Array<MenuGeneralChoice> = JiCeMenuLegalChoices.eligibleCasters(ruler, registryKey(), StrategyCostTier.High);
    var defCaster:Array<String> = gChoices.length > 0 ? [gChoices[0].generalId] : [];

    var enabled = monarchChoices.length > 0 && gChoices.length > 0;
    var sig = JiCeMenuSig.make([
      registryKey(),
      "phase=pre",
      "casters=" + gChoices.map(c -> c.generalId).join(","),
      "monarchs=" + monarchChoices.map(m -> m.monarchId).join(","),
    ]);
    var submit = gameMatch.createPlayerMenuEntry(PlayerMenuKind.StagingSubmit, "確認急襲", enabled, JiCeMenuSig.attach("raid_ok", sig));
    var widgets:Array<MenuFormWidget> = [
      MonarchSinglePick("選擇目標君主", monarchChoices, defTarget),
      GeneralMultiPick("選擇發動武將（單選）", gChoices, defCaster),
      Button(submit),
    ];
    var root = gameMatch.createPlayerMenuNode("急襲", null, [], widgets);
    return new PlayerMenu(actor, "jice-" + registryKey(), [root]);
  }

  public function resolveChoice(actor:IPlayer, menuNode:IPlayerMenuNode):Void {
    if (!gameMatch.stagingMatchesJiCe(this))
      throw "RaidJiCe.resolveChoice: pending mismatch";
    if (MenuActivation.activatingEntry(menuNode).kind() != PlayerMenuKind.StagingSubmit)
      throw "RaidJiCe.resolveChoice: expected StagingSubmit";

    var widgets = menuNode.formWidgets();
    if (widgets.length < 2)
      throw "RaidJiCe: missing widgets";

    var targetMonarchId = JiCeApply.readSingleMonarchId(widgets[0], "RaidJiCe", "target");
    var casterId = JiCeApply.readSingleGeneralId(widgets[1], "RaidJiCe", "caster");

    var ruler = cast(gameMatch.activeMonarch(), Monarch);

    // --- menu snapshot sig（只作歸因，不作一票否決）---
    var token = MenuActivation.activatingEntry(menuNode).decisionToken();
    var gotSig = JiCeMenuSig.parseSig(token);
    var monarchChoices = JiCeMenuLegalChoices.otherMonarchChoices(gameMatch, actor.monarchId());
    var gChoices = JiCeMenuLegalChoices.eligibleCasters(ruler, registryKey(), StrategyCostTier.High);
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
        throw JiCeMenuSig.stateChangedError("狀態已變更，請重新選擇急襲目標。", "jice-raid/state-changed");
      throw "RaidJiCe: invalid-choice (sig matched) — menu/widget mismatch";
    }

    var caster = JiCeApply.requireCaster(ruler, casterId, "RaidJiCe");
    JiCeApply.requireCasterRank(caster, Balance.requiredRankForStrategy(registryKey()), "RaidJiCe");

    var tier = StrategyCostTier.High;
    var phase = gameMatch.forceGetPendingLandingTile() != null ? PostMove : PreMove;
    var roll = JiCeApply.rollAndConsumeStamina(
      gameMatch,
      caster,
      Might,
      tier,
      'jice_raid|r=${gameMatch.roundNumber()}|m=${ruler.id()}|g=${casterId}|p=${Std.string(phase)}|t=${targetMonarchId}'
    );
    var effectLines:Array<String> = [];

    // docs/數值算法.md §4.3：效果倍率（ver1 基礎效果=目標 10% + might/10，再乘倍率）
    var defTroops = gameMatch.monarchTroopCount(targetMonarchId);
    var loss = if (roll.ok) Balance.raidTroopLoss(defTroops, caster.stat(Might), roll.before) else Balance.strategyFailEffectAmountInt(Std.int(Math.ceil(Math.max(0, defTroops) * 0.1)) + Std.int(Balance.clampInt(caster.stat(Might), 0, 100) / 10), registryKey());
    gameMatch.monarchApplyTroopLoss(targetMonarchId, loss);

    effectLines.push('目標兵力 -${loss}');
    JiCeApply.popupCaster(gameMatch, ruler.id(), designLabel(), phase, casterId, Might, tier, roll, '君主 $targetMonarchId', effectLines, "jice-raid");
    JiCeApply.popupTargetMonarch(gameMatch, targetMonarchId, designLabel(), ruler.id(), casterId, ['兵力 -${loss}'], "jice-raid/target");
  }

  static function readSingleGeneralId(w:MenuFormWidget, label:String):GeneralId
    return JiCeApply.readSingleGeneralId(w, "RaidJiCe", label);

  static function readSingleMonarchId(w:MenuFormWidget, label:String):MonarchId
    return JiCeApply.readSingleMonarchId(w, "RaidJiCe", label);

  static function __init__():Void {
    JiCeRegistry.register(REGISTRY_KEY, function(m:GameMatchCore) return new RaidJiCe(m));
  }
}

