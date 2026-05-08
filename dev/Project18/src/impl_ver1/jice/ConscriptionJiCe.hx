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
 * 策略：【指定玩家】徵兵 — 從目標玩家處獲取少量士兵。
 * - 消耗：中
 * - 主要屬性：統率
 * - 使用時機：移動前
 *
 * 骨架：目前僅有 troops；此策略以「轉移士兵」作為示範效果。
 */
class ConscriptionJiCe implements IJiCe {
  public static inline var REGISTRY_KEY = "jice_conscription";
  public static inline var DESIGN_LABEL = "徵兵";

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
    var submit = gameMatch.createPlayerMenuEntry(PlayerMenuKind.StagingSubmit, "確認徵兵", enabled, JiCeMenuSig.attach("conscription_ok", sig));
    var widgets:Array<MenuFormWidget> = [
      MonarchSinglePick("選擇目標君主", monarchChoices, defTarget),
      GeneralMultiPick("選擇發動武將（單選）", gChoices, defCaster),
      Button(submit),
    ];
    var root = gameMatch.createPlayerMenuNode("徵兵", null, [], widgets);
    return new PlayerMenu(actor, "jice-" + registryKey(), [root]);
  }

  public function resolveChoice(actor:IPlayer, menuNode:IPlayerMenuNode):Void {
    if (!gameMatch.stagingMatchesJiCe(this))
      throw "ConscriptionJiCe.resolveChoice: pending mismatch";
    if (MenuActivation.activatingEntry(menuNode).kind() != PlayerMenuKind.StagingSubmit)
      throw "ConscriptionJiCe.resolveChoice: expected StagingSubmit";

    var widgets = menuNode.formWidgets();
    if (widgets.length < 2)
      throw "ConscriptionJiCe: missing widgets";

    var targetMonarchId = JiCeApply.readSingleMonarchId(widgets[0], "ConscriptionJiCe", "target");
    var casterId = JiCeApply.readSingleGeneralId(widgets[1], "ConscriptionJiCe", "caster");

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
        throw JiCeMenuSig.stateChangedError("狀態已變更，請重新選擇徵兵目標。", "jice-conscription/state-changed");
      throw "ConscriptionJiCe: invalid-choice (sig matched) — menu/widget mismatch";
    }

    var caster = JiCeApply.requireCaster(ruler, casterId, "ConscriptionJiCe");
    JiCeApply.requireCasterRank(caster, Balance.requiredRankForStrategy(registryKey()), "ConscriptionJiCe");

    var tier = StrategyCostTier.Medium;
    var phase = gameMatch.forceGetPendingLandingTile() != null ? PostMove : PreMove;
    var roll = JiCeApply.rollAndConsumeStamina(
      gameMatch,
      caster,
      Command,
      tier,
      'jice_conscription|r=${gameMatch.roundNumber()}|m=${ruler.id()}|g=${casterId}|p=${Std.string(phase)}|t=${targetMonarchId}'
    );
    var effectLines:Array<String> = [];

    // docs/數值算法.md §4.3：效果倍率（ver1 基礎效果=min(目標 5% + command/10, 20)，再乘倍率）
    var defTroops = gameMatch.monarchTroopCount(targetMonarchId);
    var base = Std.int(Math.ceil(Math.max(0, defTroops) * 0.05)) + Std.int(Balance.clampInt(caster.stat(Command), 0, 100) / 10);
    if (base > 20)
      base = 20;
    if (base < 0)
      base = 0;
    var take = if (roll.ok) Balance.conscriptionTroopTake(defTroops, caster.stat(Command), roll.before) else Balance.strategyFailEffectAmountInt(base, registryKey());

    // 先扣目標，再加回己方（避免負數）
    gameMatch.monarchApplyTroopLoss(targetMonarchId, take);
    ruler.grantTroops(take);

    effectLines.push('奪取士兵 +${take}');
    JiCeApply.popupCaster(gameMatch, ruler.id(), designLabel(), phase, casterId, Command, tier, roll, '君主 $targetMonarchId', effectLines, "jice-conscription");
    JiCeApply.popupTargetMonarch(gameMatch, targetMonarchId, designLabel(), ruler.id(), casterId, ['士兵 -${take}'], "jice-conscription/target");
  }

  static function readSingleGeneralId(w:MenuFormWidget, label:String):GeneralId {
    return JiCeApply.readSingleGeneralId(w, "ConscriptionJiCe", label);
  }

  static function readSingleMonarchId(w:MenuFormWidget, label:String):MonarchId {
    return JiCeApply.readSingleMonarchId(w, "ConscriptionJiCe", label);
  }

  static function __init__():Void {
    JiCeRegistry.register(REGISTRY_KEY, function(m:GameMatchCore) return new ConscriptionJiCe(m));
  }
}

