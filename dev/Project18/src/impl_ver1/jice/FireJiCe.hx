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
import game.MenuTileChoice;
import game.PlayerMenuKind;
import game.StrategyCostTier;
import game.StrategyPhase;
import game.TileKind;
import impl_ver1.core.GameMatchCore;
import impl_ver1.model.Monarch;
import impl_ver1.model.General;
import impl_ver1.model.PlayerMenu;
import impl_ver1.jice.JiCeRegistry;
import impl_ver1.jice.JiCeApply;

/**
 * 策略：火計（指定格子）
 * - 消耗：中
 * - 主要屬性：智力
 * - 使用時機：移動前、移動後（敵方領地）
 *
 * NOTE(strategy-tile): ver1 尚未有「敵方領地」判定與格子駐軍模型；
 * 先以 City 格的 storedTroops 作為示範目標。
 */
class FireJiCe implements IJiCe {
  public static inline var REGISTRY_KEY = "jice_fire";
  public static inline var DESIGN_LABEL = "火計";

  var gameMatch:GameMatchCore;

  public function new(gameMatch:GameMatchCore) {
    this.gameMatch = gameMatch;
  }

  public function designLabel():String
    return DESIGN_LABEL;

  public function registryKey():String
    return REGISTRY_KEY;

  public function allowedPhases():Array<StrategyPhase>
    return [PreMove, PostMove];

  public function buildPlayerMenu(actor:IPlayer):IPlayerMenu {
    var ruler = cast(gameMatch.activeMonarch(), Monarch);
    var roster = ruler.roster();
    if (roster.length == 0)
      throw "FireJiCe: roster empty";

    var gChoices:Array<MenuGeneralChoice> = [];
    var defCaster:Array<String> = [];
    for (g in roster) {
      var gid = g.id();
      gChoices.push({generalId: gid, caption: gid});
      if (defCaster.length == 0)
        defCaster.push(gid);
    }

    var tChoices:Array<MenuTileChoice> = [];
    var n = gameMatch.board().length();
    for (i in 0...n) {
      var tile = gameMatch.tileAt(i);
      tChoices.push({tileIndex: i, caption: '[$i] ' + Std.string(tile.kind())});
    }
    var defTile:Array<Int> = [ruler.pawnIndex()];

    var submit = gameMatch.createPlayerMenuEntry(PlayerMenuKind.StagingSubmit, "確認火計", true, "fire_ok");
    var widgets:Array<MenuFormWidget> = [
      GeneralMultiPick("選擇發動武將（單選）", gChoices, defCaster),
      TileSinglePick("選擇目標格子", tChoices, defTile),
      Button(submit),
    ];
    var root = gameMatch.createPlayerMenuNode("火計", null, [], widgets);
    return new PlayerMenu(actor, "jice-" + registryKey(), [root]);
  }

  public function resolveChoice(actor:IPlayer, menuNode:IPlayerMenuNode):Void {
    if (!gameMatch.stagingMatchesJiCe(this))
      throw "FireJiCe.resolveChoice: pending mismatch";
    if (MenuActivation.activatingEntry(menuNode).kind() != PlayerMenuKind.StagingSubmit)
      throw "FireJiCe.resolveChoice: expected StagingSubmit";

    var widgets = menuNode.formWidgets();
    if (widgets.length < 2)
      throw "FireJiCe: missing widgets";
    var casterId = JiCeApply.readSingleGeneralId(widgets[0], "FireJiCe", "caster");
    var targetTile = JiCeApply.readSingleTileIndex(widgets[1], "FireJiCe", "tile");

    var ruler = cast(gameMatch.activeMonarch(), Monarch);
    // docs/策略系統.md：移動後策略一律針對所站格子（骨架先針對指定格子類策略硬檢查）
    if (gameMatch.forceGetPendingLandingTile() != null && targetTile != ruler.pawnIndex())
      throw "FireJiCe: post-move must target current tile";
    var caster = JiCeApply.requireCaster(ruler, casterId, "FireJiCe");

    var tier = StrategyCostTier.Medium;
    var phase = gameMatch.forceGetPendingLandingTile() != null ? PostMove : PreMove;
    var roll = JiCeApply.rollAndConsumeStamina(
      gameMatch,
      caster,
      Wit,
      tier,
      'jice_fire|r=${gameMatch.roundNumber()}|m=${ruler.id()}|g=${casterId}|p=${Std.string(phase)}|t=${targetTile}'
    );

    var effectLines:Array<String> = [];
    if (!roll.ok) {
      JiCeApply.popupCaster(gameMatch, ruler.id(), designLabel(), phase, casterId, Wit, tier, roll, '格 $targetTile', effectLines, "jice-fire");
      return;
    }

    var tile = gameMatch.tileAt(targetTile);
    // 骨架：僅對 City 格生效（示範用）
    if (tile.kind() == TileKind.City) {
      var prevT = gameMatch.forceGetCityStoredTroops(targetTile);
      var loss = Balance.clampInt(Std.int(prevT * 0.2), 0, prevT); // NOTE(balance): 數值待平衡表調整
      gameMatch.putCityStores(targetTile, prevT - loss, gameMatch.forceGetCityStoredGrain(targetTile));
      effectLines.push('城池兵力 ${prevT} → ${prevT - loss}（-${loss}）');
    } else {
      effectLines.push("目標非城池，無效果");
    }

    JiCeApply.popupCaster(gameMatch, ruler.id(), designLabel(), phase, casterId, Wit, tier, roll, '格 $targetTile', effectLines, "jice-fire");
  }

  static function readSingleGeneralId(w:MenuFormWidget, label:String):GeneralId {
    return JiCeApply.readSingleGeneralId(w, "FireJiCe", label);
  }

  static function readSingleTileIndex(w:MenuFormWidget, label:String):TileIndex {
    return JiCeApply.readSingleTileIndex(w, "FireJiCe", label);
  }

  static function __init__():Void {
    JiCeRegistry.register(REGISTRY_KEY, function(m:GameMatchCore) return new FireJiCe(m));
  }
}

