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
 * 策略：【指定玩家】離間 — 降低目標玩家麾下武將忠誠度。
 * - 消耗：中
 * - 主要屬性：智力
 * - 使用時機：移動前
 *
 * 骨架：目前忠誠度欄位已存在於 {@link General}；本策略僅做最小可用結算示範。
 */
class DissensionJiCe implements IJiCe {
  public static inline var REGISTRY_KEY = "jice_dissension";
  public static inline var DESIGN_LABEL = "離間";

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
      throw "DissensionJiCe: roster empty";

    var monarchChoices:Array<MenuMonarchChoice> = [];
    for (m in gameMatch.monarchs())
      if (m.id() != actor.monarchId())
        monarchChoices.push({monarchId: m.id(), caption: m.id()});
    if (monarchChoices.length == 0)
      throw "DissensionJiCe: 無可選擇之目標君主";
    var defTarget:Array<String> = [monarchChoices[0].monarchId];

    var gChoices:Array<MenuGeneralChoice> = [];
    var defCaster:Array<String> = [];
    for (g in roster) {
      var gid = g.id();
      gChoices.push({generalId: gid, caption: gid});
      if (defCaster.length == 0)
        defCaster.push(gid);
    }

    var submit = gameMatch.createPlayerMenuEntry(PlayerMenuKind.StagingSubmit, "確認離間", true, "dissension_ok");
    var widgets:Array<MenuFormWidget> = [
      MonarchSinglePick("選擇目標君主", monarchChoices, defTarget),
      GeneralMultiPick("選擇發動武將（單選）", gChoices, defCaster),
      Button(submit),
    ];
    var root = gameMatch.createPlayerMenuNode("離間", null, [], widgets);
    return new PlayerMenu(actor, "jice-" + registryKey(), [root]);
  }

  public function resolveChoice(actor:IPlayer, menuNode:IPlayerMenuNode):Void {
    if (!gameMatch.stagingMatchesJiCe(this))
      throw "DissensionJiCe.resolveChoice: pending mismatch";
    if (MenuActivation.activatingEntry(menuNode).kind() != PlayerMenuKind.StagingSubmit)
      throw "DissensionJiCe.resolveChoice: expected StagingSubmit";

    var widgets = menuNode.formWidgets();
    if (widgets.length < 2)
      throw "DissensionJiCe: missing widgets";

    var targetMonarchId = JiCeApply.readSingleMonarchId(widgets[0], "DissensionJiCe", "target");
    var casterId = JiCeApply.readSingleGeneralId(widgets[1], "DissensionJiCe", "caster");

    var ruler = cast(gameMatch.activeMonarch(), Monarch);
    var caster = JiCeApply.requireCaster(ruler, casterId, "DissensionJiCe");
    JiCeApply.requireCasterRank(caster, Balance.requiredRankForStrategy(registryKey()), "DissensionJiCe");

    var tier = StrategyCostTier.Medium;
    var phase = gameMatch.forceGetPendingLandingTile() != null ? PostMove : PreMove;
    var roll = JiCeApply.rollAndConsumeStamina(
      gameMatch,
      caster,
      Wit,
      tier,
      'jice_dissension|r=${gameMatch.roundNumber()}|m=${ruler.id()}|g=${casterId}|p=${Std.string(phase)}|t=${targetMonarchId}'
    );
    var effectLines:Array<String> = [];
    if (!roll.ok) {
      JiCeApply.popupCaster(gameMatch, ruler.id(), designLabel(), phase, casterId, Wit, tier, roll, '君主 $targetMonarchId', effectLines, "jice-dissension");
      return;
    }

    // docs/數值算法.md 7.1：使用離間策略 → 發動方聲望 -3
    ruler.reducePrestige(3);

    // docs/數值算法.md §4.3：效果倍率（ver1 基礎效果=10，再乘倍率）
    var loss = Balance.dissensionLoyaltyLoss(caster.stat(Wit), roll.before);
    // 目標君主麾下所有武將忠誠度 -loss（下限 1）
    for (m in gameMatch.monarchs())
      if (m.id() == targetMonarchId) {
        var tm = cast(m, Monarch);
        for (g in tm.roster()) {
          var gg = cast(g, General);
          gg.setLoyalty(gg.loyalty() - loss);
        }
        break;
      }

    effectLines.push("發動方聲望 -3");
    effectLines.push("目標麾下全體武將忠誠度 -" + loss);
    JiCeApply.popupCaster(gameMatch, ruler.id(), designLabel(), phase, casterId, Wit, tier, roll, '君主 $targetMonarchId', effectLines, "jice-dissension");
    JiCeApply.popupTargetMonarch(gameMatch, targetMonarchId, designLabel(), ruler.id(), casterId, effectLines, "jice-dissension/target");
  }

  static function readSingleGeneralId(w:MenuFormWidget, label:String):GeneralId {
    return JiCeApply.readSingleGeneralId(w, "DissensionJiCe", label);
  }

  static function readSingleMonarchId(w:MenuFormWidget, label:String):MonarchId {
    return JiCeApply.readSingleMonarchId(w, "DissensionJiCe", label);
  }

  static function __init__():Void {
    JiCeRegistry.register(REGISTRY_KEY, function(m:GameMatchCore) return new DissensionJiCe(m));
  }
}

