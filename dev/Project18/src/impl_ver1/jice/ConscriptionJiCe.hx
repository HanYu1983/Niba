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
import impl_ver1.jice.JiCeApply;

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

    var targetMonarchId = JiCeApply.readSingleMonarchId(widgets[0], "ConscriptionJiCe", "target");
    var casterId = JiCeApply.readSingleGeneralId(widgets[1], "ConscriptionJiCe", "caster");

    var ruler = cast(gameMatch.activeMonarch(), Monarch);
    var caster = JiCeApply.requireCaster(ruler, casterId, "ConscriptionJiCe");
    JiCeApply.requireCasterRank(caster, Balance.requiredRankForStrategy(registryKey()), "ConscriptionJiCe");

    var tier = StrategyCostTier.Medium;
    var phase = gameMatch.forceGetPendingLandingTile() != null ? PostMove : PreMove;
    var roll = JiCeApply.rollAndConsumeStamina(
      gameMatch,
      caster,
      Command,
      tier,
      'jice_conscription|r=${gameMatch.roundNumber()}|m=${ruler.id()}|g=${casterId}|p=${Std.string(phase)}|t=${targetMonarchId}'
    );
    var effectLines:Array<String> = [];
    if (!roll.ok) {
      JiCeApply.popupCaster(gameMatch, ruler.id(), designLabel(), phase, casterId, Command, tier, roll, '君主 $targetMonarchId', effectLines, "jice-conscription");
      return;
    }

    // docs/數值算法.md §4.3：效果倍率（ver1 基礎效果=min(目標 5% + command/10, 20)，再乘倍率）
    var defTroops = gameMatch.monarchTroopCount(targetMonarchId);
    var take = Balance.conscriptionTroopTake(defTroops, caster.stat(Command), roll.before);

    // 先扣目標，再加回己方（避免負數）
    gameMatch.monarchApplyTroopLoss(targetMonarchId, take);
    ruler.grantTroops(take);

    effectLines.push('奪取士兵 +${take}');
    JiCeApply.popupCaster(gameMatch, ruler.id(), designLabel(), phase, casterId, Command, tier, roll, '君主 $targetMonarchId', effectLines, "jice-conscription");
    JiCeApply.popupTargetMonarch(gameMatch, targetMonarchId, designLabel(), ruler.id(), casterId, ['士兵 -${take}'], "jice-conscription/target");
  }

  static function readSingleGeneralId(w:MenuFormWidget, label:String):GeneralId {
    return JiCeApply.readSingleGeneralId(w, "ConscriptionJiCe", label);
  }

  static function readSingleMonarchId(w:MenuFormWidget, label:String):MonarchId {
    return JiCeApply.readSingleMonarchId(w, "ConscriptionJiCe", label);
  }

  static function __init__():Void {
    JiCeRegistry.register(REGISTRY_KEY, function(m:GameMatchCore) return new ConscriptionJiCe(m));
  }
}

