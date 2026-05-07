package impl_ver1.jice;

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
import game.StrategyPhase;
import impl_ver1.core.GameMatchCore;
import impl_ver1.model.Monarch;
import impl_ver1.model.General;
import impl_ver1.util.Deterministic;
import impl_ver1.model.PlayerMenu;
import impl_ver1.jice.JiCeRegistry;
import impl_ver1.jice.JiCeApply;

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

  public function allowedPhases():Array<StrategyPhase>
    return [PreMove];

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

    var casterId = JiCeApply.readSingleGeneralId(widgets[0], "AwakenJiCe", "caster");
    var targetId = JiCeApply.readSingleGeneralId(widgets[1], "AwakenJiCe", "target");

    var ruler = cast(gameMatch.activeMonarch(), Monarch);
    var caster = JiCeApply.requireCaster(ruler, casterId, "AwakenJiCe");
    var target = JiCeApply.requireCaster(ruler, targetId, "AwakenJiCe");

    var tier = StrategyCostTier.High;
    var phase = gameMatch.forceGetPendingLandingTile() != null ? PostMove : PreMove;
    var roll = JiCeApply.rollAndConsumeStamina(
      gameMatch,
      caster,
      Wit,
      tier,
      'jice_awaken|r=${gameMatch.roundNumber()}|m=${ruler.id()}|g=${casterId}|p=${Std.string(phase)}|tg=${targetId}'
    );
    var effectLines:Array<String> = [];
    if (roll.ok) {
      var pool:Array<GeneralStat> = [Command, Might, Wit, Stewardship];
      var idx = Std.int(Math.floor(Deterministic.hash01('jice_awaken_pick|r=${gameMatch.roundNumber()}|m=${ruler.id()}|g=${casterId}|tg=${targetId}') * pool.length));
      if (idx < 0) idx = 0;
      if (idx >= pool.length) idx = pool.length - 1;
      var picked = pool[idx];
      // 骨架：+20 維持 1 回合（生命週期由後續核心接上）
      target.addEffect(GeneralEffect.TempStatBoost(picked, 20, 1));
      effectLines.push('目標獲得暫時屬性提升：${JiCeApply.statLabel(picked)} +20（1 回合）');
    }
    JiCeApply.popupCaster(gameMatch, ruler.id(), designLabel(), phase, casterId, Wit, tier, roll, '武將 $targetId', effectLines, "jice-awaken");
  }

  static function readSinglePick(w:MenuFormWidget, label:String):GeneralId {
    return JiCeApply.readSingleGeneralId(w, "AwakenJiCe", label);
  }

  static function __init__():Void {
    JiCeRegistry.register(REGISTRY_KEY, function(m:GameMatchCore) return new AwakenJiCe(m));
  }
}

