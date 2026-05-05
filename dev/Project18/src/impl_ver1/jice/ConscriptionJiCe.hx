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
import game.MenuMonarchChoice;
import game.PlayerMenuKind;
import game.StrategyCostTier;
import game.StrategyPhase;
import impl_ver1.core.GameMatchCore;
import impl_ver1.model.General;
import impl_ver1.model.Monarch;
import impl_ver1.model.PlayerMenu;

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
    var roster = ruler.roster();
    if (roster.length == 0)
      throw "ConscriptionJiCe: roster empty";

    var monarchChoices:Array<MenuMonarchChoice> = [];
    for (m in gameMatch.monarchs())
      if (m.id() != actor.monarchId())
        monarchChoices.push({monarchId: m.id(), caption: m.id()});
    if (monarchChoices.length == 0)
      throw "ConscriptionJiCe: 無可選擇之目標君主";
    var defTarget:Array<String> = [monarchChoices[0].monarchId];

    var gChoices:Array<MenuGeneralChoice> = [];
    var defCaster:Array<String> = [];
    for (g in roster) {
      var gid = g.id();
      gChoices.push({generalId: gid, caption: gid});
      if (defCaster.length == 0)
        defCaster.push(gid);
    }

    var submit = gameMatch.createPlayerMenuEntry(PlayerMenuKind.StagingSubmit, "確認徵兵", true, "conscription_ok");
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

    var targetMonarchId = readSingleMonarchId(widgets[0], "target");
    var casterId = readSingleGeneralId(widgets[1], "caster");

    var ruler = cast(gameMatch.activeMonarch(), Monarch);
    var caster:Null<General> = null;
    for (g in ruler.roster())
      if (g.id() == casterId)
        caster = cast g;
    if (caster == null)
      throw "ConscriptionJiCe: caster not in roster";

    var tier = StrategyCostTier.Medium;
    var rate = Balance.strategySuccessRate(caster.stat(Command), tier, caster.stamina());
    var ok = Math.random() < rate;
    caster.setStamina(Balance.clampInt(caster.stamina() - Balance.strategyStaminaCost(tier), 0, 100));
    if (!ok)
      return;

    // 最小示範：轉移 min(目標兵力的 5% + command/10, 20) 到施計者
    var defTroops = gameMatch.monarchTroopCount(targetMonarchId);
    var take = Std.int(Math.ceil(defTroops * 0.05)) + Std.int(caster.stat(Command) / 10);
    if (take > 20)
      take = 20;
    if (take < 0)
      take = 0;

    // 先扣目標，再加回己方（避免負數）
    gameMatch.monarchApplyTroopLoss(targetMonarchId, take);
    ruler.grantTroops(take);
  }

  static function readSingleGeneralId(w:MenuFormWidget, label:String):GeneralId {
    return switch w {
      case GeneralMultiPick(_, _, sel):
        if (sel == null || sel.length != 1)
          throw 'ConscriptionJiCe: $label must pick exactly 1 general';
        sel[0];
      default:
        throw 'ConscriptionJiCe: $label widget must be GeneralMultiPick';
    };
  }

  static function readSingleMonarchId(w:MenuFormWidget, label:String):MonarchId {
    return switch w {
      case MonarchSinglePick(_, _, selected):
        if (selected == null || selected.length != 1)
          throw 'ConscriptionJiCe: $label must pick exactly 1 monarch';
        selected[0];
      default:
        throw 'ConscriptionJiCe: $label widget must be MonarchSinglePick';
    };
  }

  static function __init__():Void {
    JiCeRegistry.register(REGISTRY_KEY, function(m:GameMatchCore) return new ConscriptionJiCe(m));
  }
}

