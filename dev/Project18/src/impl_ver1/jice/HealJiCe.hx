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

/**
 * 策略：療傷（指定武將）— 回復指定武將體力並解除負面狀態。
 * - 使用時機：移動前
 * - 成功率：智力 × 基礎成功率 × 體力修正
 * - 體力消耗：高
 */
class HealJiCe implements IJiCe {
  public static inline var REGISTRY_KEY = "jice_heal";
  public static inline var DESIGN_LABEL = "療傷";

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
    var casterChoices:Array<MenuGeneralChoice> = JiCeMenuLegalChoices.eligibleCasters(ruler, registryKey(), StrategyCostTier.High);
    var targetChoices:Array<MenuGeneralChoice> = JiCeMenuLegalChoices.rosterChoices(ruler);
    var defCaster:Array<String> = casterChoices.length > 0 ? [casterChoices[0].generalId] : [];
    var defTarget:Array<String> = targetChoices.length > 0 ? [targetChoices[0].generalId] : [];

    var enabled = casterChoices.length > 0 && targetChoices.length > 0;
    var submit = gameMatch.createPlayerMenuEntry(PlayerMenuKind.StagingSubmit, "確認療傷", enabled, "heal_ok");
    var widgets:Array<MenuFormWidget> = [
      GeneralMultiPick("選擇發動武將（單選）", casterChoices, defCaster),
      GeneralMultiPick("選擇目標武將（單選）", targetChoices, defTarget),
      Button(submit),
    ];
    var root = gameMatch.createPlayerMenuNode("療傷", null, [], widgets);
    return new PlayerMenu(actor, "jice-" + registryKey(), [root]);
  }

  public function resolveChoice(actor:IPlayer, menuNode:IPlayerMenuNode):Void {
    if (!gameMatch.stagingMatchesJiCe(this))
      throw "HealJiCe.resolveChoice: pending mismatch";
    if (MenuActivation.activatingEntry(menuNode).kind() != PlayerMenuKind.StagingSubmit)
      throw "HealJiCe.resolveChoice: expected StagingSubmit";

    var widgets = menuNode.formWidgets();
    if (widgets.length < 2)
      throw "HealJiCe: missing widgets";

    var casterId = JiCeApply.readSingleGeneralId(widgets[0], "HealJiCe", "caster");
    var targetId = JiCeApply.readSingleGeneralId(widgets[1], "HealJiCe", "target");

    var ruler = cast(gameMatch.activeMonarch(), Monarch);
    var caster = JiCeApply.requireCaster(ruler, casterId, "HealJiCe");
    JiCeApply.requireCasterRank(caster, Balance.requiredRankForStrategy(registryKey()), "HealJiCe");
    var target = JiCeApply.requireCaster(ruler, targetId, "HealJiCe");

    var tier = StrategyCostTier.High;
    var phase = gameMatch.forceGetPendingLandingTile() != null ? PostMove : PreMove;
    var roll = JiCeApply.rollAndConsumeStamina(
      gameMatch,
      caster,
      Wit,
      tier,
      'jice_heal|r=${gameMatch.roundNumber()}|m=${ruler.id()}|g=${casterId}|p=${Std.string(phase)}|tg=${targetId}'
    );
    var effectLines:Array<String> = [];
    if (roll.ok) {
      // docs/數值算法.md §4.3：效果 = 基礎效果 × (屬性/100) × 體力修正
      // ver1：基礎效果 = +40
      var before = target.stamina();
      var amt = Balance.strategyEffectAmountInt(40, caster.stat(Wit), roll.before);
      target.setStamina(Balance.clampInt(before + amt, 0, 100));
      var removed = target.removeOneDebuff();
      effectLines.push('目標體力 ${before} → ${target.stamina()}（+${amt}）');
      effectLines.push(removed ? "移除 1 個 debuff" : "無 debuff 可移除");
    }
    JiCeApply.popupCaster(gameMatch, ruler.id(), designLabel(), phase, casterId, Wit, tier, roll, '武將 $targetId', effectLines, "jice-heal");
  }

  static function readSinglePick(w:MenuFormWidget, label:String):GeneralId {
    return JiCeApply.readSingleGeneralId(w, "HealJiCe", label);
  }

  static function __init__():Void {
    JiCeRegistry.register(REGISTRY_KEY, function(m:GameMatchCore) return new HealJiCe(m));
  }
}

