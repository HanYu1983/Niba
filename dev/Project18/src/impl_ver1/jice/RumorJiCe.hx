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
import impl_ver1.core.GameMatchCore;
import impl_ver1.model.General;
import impl_ver1.model.Monarch;
import impl_ver1.model.PlayerMenu;

/**
 * 策略：【指定玩家】流言 — 降低目標玩家聲望。
 * - 消耗：中
 * - 主要屬性：智力
 * - 使用時機：移動前
 *
 * 骨架：ver1 新增 {@link Monarch#prestige} 欄位作為最小可用資料來源。
 */
class RumorJiCe implements IJiCe {
  public static inline var REGISTRY_KEY = "jice_rumor";
  public static inline var DESIGN_LABEL = "流言";

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
      throw "RumorJiCe: roster empty";

    var monarchChoices:Array<MenuMonarchChoice> = [];
    for (m in gameMatch.monarchs())
      if (m.id() != actor.monarchId())
        monarchChoices.push({monarchId: m.id(), caption: m.id()});
    if (monarchChoices.length == 0)
      throw "RumorJiCe: 無可選擇之目標君主";
    var defTarget:Array<String> = [monarchChoices[0].monarchId];

    var gChoices:Array<MenuGeneralChoice> = [];
    var defCaster:Array<String> = [];
    for (g in roster) {
      var gid = g.id();
      gChoices.push({generalId: gid, caption: gid});
      if (defCaster.length == 0)
        defCaster.push(gid);
    }

    var submit = gameMatch.createPlayerMenuEntry(PlayerMenuKind.StagingSubmit, "確認流言", true, "rumor_ok");
    var widgets:Array<MenuFormWidget> = [
      MonarchSinglePick("選擇目標君主", monarchChoices, defTarget),
      GeneralMultiPick("選擇發動武將（單選）", gChoices, defCaster),
      Button(submit),
    ];
    var root = gameMatch.createPlayerMenuNode("流言", null, [], widgets);
    return new PlayerMenu(actor, "jice-" + registryKey(), [root]);
  }

  public function resolveChoice(actor:IPlayer, menuNode:IPlayerMenuNode):Void {
    if (!gameMatch.stagingMatchesJiCe(this))
      throw "RumorJiCe.resolveChoice: pending mismatch";
    if (MenuActivation.activatingEntry(menuNode).kind() != PlayerMenuKind.StagingSubmit)
      throw "RumorJiCe.resolveChoice: expected StagingSubmit";

    var widgets = menuNode.formWidgets();
    if (widgets.length < 2)
      throw "RumorJiCe: missing widgets";

    var targetMonarchId = readSingleMonarchId(widgets[0], "target");
    var casterId = readSingleGeneralId(widgets[1], "caster");

    var ruler = cast(gameMatch.activeMonarch(), Monarch);
    var caster:Null<General> = null;
    for (g in ruler.roster())
      if (g.id() == casterId)
        caster = cast g;
    if (caster == null)
      throw "RumorJiCe: caster not in roster";

    var tier = StrategyCostTier.Medium;
    var rate = Balance.strategySuccessRate(caster.stat(Wit), tier, caster.stamina());
    var ok = Math.random() < rate;
    caster.setStamina(Balance.clampInt(caster.stamina() - Balance.strategyStaminaCost(tier), 0, 100));
    if (!ok)
      return;

    // 最小示範：目標聲望 -12（下限 0）
    for (m in gameMatch.monarchs())
      if (m.id() == targetMonarchId) {
        var tm = cast(m, Monarch);
        tm.reducePrestige(12);
        break;
      }
  }

  static function readSingleGeneralId(w:MenuFormWidget, label:String):GeneralId {
    return switch w {
      case GeneralMultiPick(_, _, sel):
        if (sel == null || sel.length != 1)
          throw 'RumorJiCe: $label must pick exactly 1 general';
        sel[0];
      default:
        throw 'RumorJiCe: $label widget must be GeneralMultiPick';
    };
  }

  static function readSingleMonarchId(w:MenuFormWidget, label:String):MonarchId {
    return switch w {
      case MonarchSinglePick(_, _, selected):
        if (selected == null || selected.length != 1)
          throw 'RumorJiCe: $label must pick exactly 1 monarch';
        selected[0];
      default:
        throw 'RumorJiCe: $label widget must be MonarchSinglePick';
    };
  }

  static function __init__():Void {
    JiCeRegistry.register(REGISTRY_KEY, function(m:GameMatchCore) return new RumorJiCe(m));
  }
}

