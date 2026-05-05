package impl_ver1;

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
import game.TileKind;

/**
 * 策略：火計（指定格子）
 * - 消耗：中
 * - 主要屬性：智力
 * - 使用時機：移動前、移動後（敵方領地）
 *
 * TODO(strategy-tile): 目前 tile 僅有 kind/index；尚無「敵方領地」判定與格子駐軍模型。
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
    var casterId = readSingleGeneralId(widgets[0], "caster");
    var targetTile = readSingleTileIndex(widgets[1], "tile");

    var ruler = cast(gameMatch.activeMonarch(), Monarch);
    var caster:Null<General> = null;
    for (g in ruler.roster())
      if (g.id() == casterId)
        caster = cast g;
    if (caster == null)
      throw "FireJiCe: caster not in roster";

    var tier = StrategyCostTier.Medium;
    var rate = Balance.strategySuccessRate(caster.stat(Wit), tier, caster.stamina());
    var ok = Math.random() < rate;
    caster.setStamina(Balance.clampInt(caster.stamina() - Balance.strategyStaminaCost(tier), 0, 100));

    if (!ok)
      return;

    var tile = gameMatch.tileAt(targetTile);
    // 骨架：僅對 City 格生效（示範用）
    if (tile.kind() == TileKind.City) {
      var prevT = gameMatch.forceGetCityStoredTroops(targetTile);
      var loss = Balance.clampInt(Std.int(prevT * 0.2), 0, prevT); // TODO(strategy-tile): 以規格表調整
      gameMatch.putCityStores(targetTile, prevT - loss, gameMatch.forceGetCityStoredGrain(targetTile));
    }
  }

  static function readSingleGeneralId(w:MenuFormWidget, label:String):GeneralId {
    return switch w {
      case GeneralMultiPick(_, _, sel):
        if (sel == null || sel.length != 1)
          throw 'FireJiCe: $label must pick exactly 1 general';
        sel[0];
      default:
        throw 'FireJiCe: $label widget must be GeneralMultiPick';
    };
  }

  static function readSingleTileIndex(w:MenuFormWidget, label:String):TileIndex {
    return switch w {
      case TileSinglePick(_, _, selected):
        if (selected == null || selected.length != 1)
          throw 'FireJiCe: $label must pick exactly 1 tile';
        selected[0];
      default:
        throw 'FireJiCe: $label widget must be TileSinglePick';
    };
  }

  static function __init__():Void {
    JiCeRegistry.register(REGISTRY_KEY, function(m:GameMatchCore) return new FireJiCe(m));
  }
}

