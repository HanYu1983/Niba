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

  public function buildPlayerMenu(actor:IPlayer):IPlayerMenu {
    var ruler = cast(gameMatch.activeMonarch(), Monarch);
    var roster = ruler.roster();
    if (roster.length == 0)
      throw "RaidJiCe: roster empty";

    var monarchChoices:Array<MenuMonarchChoice> = [];
    for (m in gameMatch.monarchs())
      if (m.id() != actor.monarchId())
        monarchChoices.push({monarchId: m.id(), caption: m.id()});
    if (monarchChoices.length == 0)
      throw "RaidJiCe: 無可選擇之目標君主";
    var defTarget:Array<String> = [monarchChoices[0].monarchId];

    var gChoices:Array<MenuGeneralChoice> = [];
    var defCaster:Array<String> = [];
    for (g in roster) {
      var gid = g.id();
      gChoices.push({generalId: gid, caption: gid});
      if (defCaster.length == 0)
        defCaster.push(gid);
    }

    var submit = gameMatch.createPlayerMenuEntry(PlayerMenuKind.StagingSubmit, "確認急襲", true, "raid_ok");
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

    var targetMonarchId = readSingleMonarchId(widgets[0], "target");
    var casterId = readSingleGeneralId(widgets[1], "caster");

    var ruler = cast(gameMatch.activeMonarch(), Monarch);
    var caster:Null<General> = null;
    for (g in ruler.roster())
      if (g.id() == casterId)
        caster = cast g;
    if (caster == null)
      throw "RaidJiCe: caster not in roster";

    var tier = StrategyCostTier.High;
    var rate = Balance.strategySuccessRate(caster.stat(Might), tier, caster.stamina());
    var ok = Math.random() < rate;
    caster.setStamina(Balance.clampInt(caster.stamina() - Balance.strategyStaminaCost(tier), 0, 100));
    if (!ok)
      return;

    // 骨架公式：目標現有兵力 10% + might/10（與落石類似，之後可改規格表）
    var defTroops = gameMatch.monarchTroopCount(targetMonarchId);
    var loss = Std.int(Math.ceil(defTroops * 0.1)) + Std.int(caster.stat(Might) / 10);
    if (loss < 0)
      loss = 0;
    gameMatch.monarchApplyTroopLoss(targetMonarchId, loss);
  }

  static function readSingleGeneralId(w:MenuFormWidget, label:String):GeneralId {
    return switch w {
      case GeneralMultiPick(_, _, sel):
        if (sel == null || sel.length != 1)
          throw 'RaidJiCe: $label must pick exactly 1 general';
        sel[0];
      default:
        throw 'RaidJiCe: $label widget must be GeneralMultiPick';
    };
  }

  static function readSingleMonarchId(w:MenuFormWidget, label:String):MonarchId {
    return switch w {
      case MonarchSinglePick(_, _, selected):
        if (selected == null || selected.length != 1)
          throw 'RaidJiCe: $label must pick exactly 1 monarch';
        selected[0];
      default:
        throw 'RaidJiCe: $label widget must be MonarchSinglePick';
    };
  }

  static function __init__():Void {
    JiCeRegistry.register(REGISTRY_KEY, function(m:GameMatchCore) return new RaidJiCe(m));
  }
}

