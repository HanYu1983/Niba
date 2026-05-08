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

/**
 * 策略：鼓舞（指定武將）— 回復目標武將體力。
 * - 使用時機：移動前（骨架先不提供移動後版本）
 * - 成功率：依 docs/數值算法.md 4.1（統率 × 基礎成功率 × 體力修正）
 * - 體力消耗：中（先用 20）
 */
class InspireJiCe implements IJiCe {
  public static inline var REGISTRY_KEY = "jice_inspire";
  public static inline var DESIGN_LABEL = "鼓舞";

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
    var roster = ruler.roster();
    if (roster.length == 0)
      throw "InspireJiCe: roster empty";

    var choices:Array<MenuGeneralChoice> = [];
    var defCaster:Array<String> = [];
    var defTarget:Array<String> = [];
    for (g in roster) {
      var gid = g.id();
      choices.push({generalId: gid, caption: gid});
      if (defCaster.length == 0)
        defCaster.push(gid);
      if (defTarget.length == 0)
        defTarget.push(gid);
    }

    var submit = gameMatch.createPlayerMenuEntry(PlayerMenuKind.StagingSubmit, "確認鼓舞", true, "inspire_ok");
    var widgets:Array<MenuFormWidget> = [
      GeneralMultiPick("選擇發動武將（單選）", choices, defCaster),
      GeneralMultiPick("選擇目標武將（單選）", choices, defTarget),
      Button(submit),
    ];
    var root = gameMatch.createPlayerMenuNode("鼓舞", null, [], widgets);
    return new PlayerMenu(actor, "jice-" + registryKey(), [root]);
  }

  public function resolveChoice(actor:IPlayer, menuNode:IPlayerMenuNode):Void {
    if (!gameMatch.stagingMatchesJiCe(this))
      throw "InspireJiCe.resolveChoice: pending mismatch";
    if (MenuActivation.activatingEntry(menuNode).kind() != PlayerMenuKind.StagingSubmit)
      throw "InspireJiCe.resolveChoice: expected StagingSubmit";

    // widgets[0] caster, widgets[1] target
    var widgets = menuNode.formWidgets();
    if (widgets.length < 2)
      throw "InspireJiCe: missing widgets";

    var casterId = JiCeApply.readSingleGeneralId(widgets[0], "InspireJiCe", "caster");
    var targetId = JiCeApply.readSingleGeneralId(widgets[1], "InspireJiCe", "target");

    var ruler = cast(gameMatch.activeMonarch(), Monarch);
    var caster = JiCeApply.requireCaster(ruler, casterId, "InspireJiCe");
    JiCeApply.requireCasterRank(caster, Balance.requiredRankForStrategy(registryKey()), "InspireJiCe");
    var target = JiCeApply.requireCaster(ruler, targetId, "InspireJiCe");

    // 成功率（統率 × 基礎成功率 × 體力修正）
    var tier = StrategyCostTier.Medium;
    var phase = gameMatch.forceGetPendingLandingTile() != null ? PostMove : PreMove;
    var roll = JiCeApply.rollAndConsumeStamina(
      gameMatch,
      caster,
      Command,
      tier,
      'jice_inspire|r=${gameMatch.roundNumber()}|m=${ruler.id()}|g=${casterId}|p=${Std.string(phase)}|tg=${targetId}'
    );
    var effectLines:Array<String> = [];
    if (roll.ok) {
      // docs/數值算法.md §4.3：效果 = 基礎效果 × (屬性/100) × 體力修正
      // ver1：基礎效果 = +20
      var before = target.stamina();
      var amt = Balance.strategyEffectAmountInt(20, caster.stat(Command), roll.before);
      target.setStamina(Balance.clampInt(before + amt, 0, 100));
      effectLines.push('目標體力 ${before} → ${target.stamina()}（+${amt}）');
    }
    JiCeApply.popupCaster(gameMatch, ruler.id(), designLabel(), phase, casterId, Command, tier, roll, '武將 $targetId', effectLines, "jice-inspire");
  }

  static function readSinglePick(w:MenuFormWidget, label:String):GeneralId {
    return JiCeApply.readSingleGeneralId(w, "InspireJiCe", label);
  }

  static function __init__():Void {
    JiCeRegistry.register(REGISTRY_KEY, function(m:GameMatchCore) return new InspireJiCe(m));
  }
}

