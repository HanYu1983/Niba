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
    var roster = ruler.roster();
    if (roster.length == 0)
      throw "HealJiCe: roster empty";

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

    var submit = gameMatch.createPlayerMenuEntry(PlayerMenuKind.StagingSubmit, "確認療傷", true, "heal_ok");
    var widgets:Array<MenuFormWidget> = [
      GeneralMultiPick("選擇發動武將（單選）", choices, defCaster),
      GeneralMultiPick("選擇目標武將（單選）", choices, defTarget),
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
    var target = JiCeApply.requireCaster(ruler, targetId, "HealJiCe");

    var tier = StrategyCostTier.High;
    var ok = JiCeApply.rollAndConsumeStamina(caster, Wit, tier);

    if (ok) {
      // 骨架：回復固定 +40（之後可參數化）
      target.setStamina(Balance.clampInt(target.stamina() + 40, 0, 100));
      target.removeOneDebuff();
    }
  }

  static function readSinglePick(w:MenuFormWidget, label:String):GeneralId {
    return JiCeApply.readSingleGeneralId(w, "HealJiCe", label);
  }

  static function __init__():Void {
    JiCeRegistry.register(REGISTRY_KEY, function(m:GameMatchCore) return new HealJiCe(m));
  }
}

