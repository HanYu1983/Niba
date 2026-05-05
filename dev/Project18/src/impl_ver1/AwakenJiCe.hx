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
 * 策略：覺醒（指定武將）— 指定武將隨機一項能力暫時提升。
 * - 使用時機：移動前
 * - 成功率：智力 × 基礎成功率 × 體力修正
 * - 體力消耗：高
 */
class AwakenJiCe implements IJiCe {
  public static inline var REGISTRY_KEY = "jice_awaken";
  public static inline var DESIGN_LABEL = "覺醒";

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
      throw "AwakenJiCe: roster empty";

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

    var submit = gameMatch.createPlayerMenuEntry(PlayerMenuKind.StagingSubmit, "確認覺醒", true, "awaken_ok");
    var widgets:Array<MenuFormWidget> = [
      GeneralMultiPick("選擇發動武將（單選）", choices, defCaster),
      GeneralMultiPick("選擇目標武將（單選）", choices, defTarget),
      Button(submit),
    ];
    var root = gameMatch.createPlayerMenuNode("覺醒", null, [], widgets);
    return new PlayerMenu(actor, "jice-" + registryKey(), [root]);
  }

  public function resolveChoice(actor:IPlayer, menuNode:IPlayerMenuNode):Void {
    if (!gameMatch.stagingMatchesJiCe(this))
      throw "AwakenJiCe.resolveChoice: pending mismatch";
    if (MenuActivation.activatingEntry(menuNode).kind() != PlayerMenuKind.StagingSubmit)
      throw "AwakenJiCe.resolveChoice: expected StagingSubmit";

    var widgets = menuNode.formWidgets();
    if (widgets.length < 2)
      throw "AwakenJiCe: missing widgets";

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
      throw "AwakenJiCe: picked general not in roster";

    var tier = StrategyCostTier.High;
    var rate = Balance.strategySuccessRate(caster.stat(Wit), tier, caster.stamina());
    var ok = Math.random() < rate;

    caster.forceSetStamina(Balance.clampInt(caster.stamina() - Balance.strategyStaminaCost(tier), 0, 100));

    if (ok) {
      var pool:Array<GeneralStat> = [Command, Might, Wit, Stewardship];
      var idx = Std.random(pool.length);
      var picked = pool[idx];
      // 骨架：+20 維持 1 回合（生命週期由後續核心接上）
      target.addEffect(GeneralEffect.TempStatBoost(picked, 20, 1));
    }
  }

  static function readSinglePick(w:MenuFormWidget, label:String):GeneralId {
    return switch w {
      case GeneralMultiPick(_, _, sel):
        if (sel == null || sel.length != 1)
          throw 'AwakenJiCe: $label must pick exactly 1 general';
        sel[0];
      default:
        throw 'AwakenJiCe: $label widget must be GeneralMultiPick';
    };
  }

  static function __init__():Void {
    JiCeRegistry.register(REGISTRY_KEY, function(m:GameMatchCore) return new AwakenJiCe(m));
  }
}

