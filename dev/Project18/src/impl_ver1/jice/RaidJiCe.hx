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
import impl_ver1.jice.JiCeApply;
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

  public function allowedPhases():Array<StrategyPhase>
    return [PreMove];

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

    var targetMonarchId = JiCeApply.readSingleMonarchId(widgets[0], "RaidJiCe", "target");
    var casterId = JiCeApply.readSingleGeneralId(widgets[1], "RaidJiCe", "caster");

    var ruler = cast(gameMatch.activeMonarch(), Monarch);
    var caster = JiCeApply.requireCaster(ruler, casterId, "RaidJiCe");
    JiCeApply.requireCasterRank(caster, Balance.requiredRankForStrategy(registryKey()), "RaidJiCe");

    var tier = StrategyCostTier.High;
    var phase = gameMatch.forceGetPendingLandingTile() != null ? PostMove : PreMove;
    var roll = JiCeApply.rollAndConsumeStamina(
      gameMatch,
      caster,
      Might,
      tier,
      'jice_raid|r=${gameMatch.roundNumber()}|m=${ruler.id()}|g=${casterId}|p=${Std.string(phase)}|t=${targetMonarchId}'
    );
    var effectLines:Array<String> = [];
    if (!roll.ok) {
      JiCeApply.popupCaster(gameMatch, ruler.id(), designLabel(), phase, casterId, Might, tier, roll, '君主 $targetMonarchId', effectLines, "jice-raid");
      return;
    }

    // docs/數值算法.md §4.3：效果倍率（ver1 基礎效果=目標 10% + might/10，再乘倍率）
    var defTroops = gameMatch.monarchTroopCount(targetMonarchId);
    var loss = Balance.raidTroopLoss(defTroops, caster.stat(Might), roll.before);
    gameMatch.monarchApplyTroopLoss(targetMonarchId, loss);

    effectLines.push('目標兵力 -${loss}');
    JiCeApply.popupCaster(gameMatch, ruler.id(), designLabel(), phase, casterId, Might, tier, roll, '君主 $targetMonarchId', effectLines, "jice-raid");
    JiCeApply.popupTargetMonarch(gameMatch, targetMonarchId, designLabel(), ruler.id(), casterId, ['兵力 -${loss}'], "jice-raid/target");
  }

  static function readSingleGeneralId(w:MenuFormWidget, label:String):GeneralId
    return JiCeApply.readSingleGeneralId(w, "RaidJiCe", label);

  static function readSingleMonarchId(w:MenuFormWidget, label:String):MonarchId
    return JiCeApply.readSingleMonarchId(w, "RaidJiCe", label);

  static function __init__():Void {
    JiCeRegistry.register(REGISTRY_KEY, function(m:GameMatchCore) return new RaidJiCe(m));
  }
}

