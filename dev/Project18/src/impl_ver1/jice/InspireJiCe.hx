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

    var casterId = readSinglePick(widgets[0], "caster");
    var targetId = readSinglePick(widgets[1], "target");

    var ruler = cast(gameMatch.activeMonarch(), Monarch);
    var caster:Null<General> = null;
    var target:Null<General> = null;
    for (g in ruler.roster()) {
      if (g.id() == casterId)
        caster = cast g;
      if (g.id() == targetId)
        target = cast g;
    }
    if (caster == null || target == null)
      throw "InspireJiCe: picked general not in roster";

    // 成功率（統率 × 基礎成功率 × 體力修正）
    var tier = StrategyCostTier.Medium;
    var rate = Balance.strategySuccessRate(caster.stat(Command), tier, caster.stamina());
    var ok = Math.random() < rate;

    // 消耗體力（中）
    caster.setStamina(Balance.clampInt(caster.stamina() - Balance.strategyStaminaCost(tier), 0, 100));

    if (ok) {
      // 效果：目標回復（先用 +20 當骨架；之後可依屬性/修正調整）
      target.setStamina(Balance.clampInt(target.stamina() + 20, 0, 100));
    }
  }

  static function readSinglePick(w:MenuFormWidget, label:String):GeneralId {
    return switch w {
      case GeneralMultiPick(_, _, sel):
        if (sel == null || sel.length != 1)
          throw 'InspireJiCe: $label must pick exactly 1 general';
        sel[0];
      default:
        throw 'InspireJiCe: $label widget must be GeneralMultiPick';
    };
  }

  static function __init__():Void {
    JiCeRegistry.register(REGISTRY_KEY, function(m:GameMatchCore) return new InspireJiCe(m));
  }
}

