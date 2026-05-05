package impl_ver1;

import game.Balance;
import game.GameIds;
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

  public function buildPlayerMenu(actor:IPlayer):IPlayerMenu {
    var ruler = cast(gameMatch.activeMonarch(), Monarch);
    var roster = ruler.roster();
    if (roster.length == 0)
      throw "EncourageJiCe: roster empty";

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

    var submit = gameMatch.createPlayerMenuEntry(PlayerMenuKind.StagingSubmit, "確認激勵", true, "encourage_ok");
    var widgets:Array<MenuFormWidget> = [
      GeneralMultiPick("選擇發動武將（單選）", choices, defCaster),
      GeneralMultiPick("選擇目標武將（單選）", choices, defTarget),
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
      throw "EncourageJiCe: picked general not in roster";

    var tier = StrategyCostTier.Low;
    var rate = Balance.strategySuccessRate(caster.stat(Command), tier, caster.stamina());
    var ok = Math.random() < rate;

    caster.setStamina(Balance.clampInt(caster.stamina() - Balance.strategyStaminaCost(tier), 0, 100));

    if (ok) {
      // 先以 1.2 作為骨架倍率；後續可由 Balance/策略表驅動
      target.addEffect(GeneralEffect.NextCommandMultiplier(1.2));
    }
  }

  static function readSinglePick(w:MenuFormWidget, label:String):GeneralId {
    return switch w {
      case GeneralMultiPick(_, _, sel):
        if (sel == null || sel.length != 1)
          throw 'EncourageJiCe: $label must pick exactly 1 general';
        sel[0];
      default:
        throw 'EncourageJiCe: $label widget must be GeneralMultiPick';
    };
  }

  static function __init__():Void {
    JiCeRegistry.register(REGISTRY_KEY, function(m:GameMatchCore) return new EncourageJiCe(m));
  }
}

