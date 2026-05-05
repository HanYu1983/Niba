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
 * 策略：破壞（指定格子）
 * - 消耗：高
 * - 主要屬性：智力
 *
 * TODO(strategy-tile): docs 要求「降低城池等級」；目前領域模型尚無城池等級存放。
 * 先以 City 格的 storedGrain 減少作為骨架示範，並留下 TODO。
 */
class SabotageJiCe implements IJiCe {
  public static inline var REGISTRY_KEY = "jice_sabotage";
  public static inline var DESIGN_LABEL = "破壞";

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
      throw "SabotageJiCe: roster empty";

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

    var submit = gameMatch.createPlayerMenuEntry(PlayerMenuKind.StagingSubmit, "確認破壞", true, "sabotage_ok");
    var widgets:Array<MenuFormWidget> = [
      GeneralMultiPick("選擇發動武將（單選）", gChoices, defCaster),
      TileSinglePick("選擇目標格子", tChoices, defTile),
      Button(submit),
    ];
    var root = gameMatch.createPlayerMenuNode("破壞", null, [], widgets);
    return new PlayerMenu(actor, "jice-" + registryKey(), [root]);
  }

  public function resolveChoice(actor:IPlayer, menuNode:IPlayerMenuNode):Void {
    if (!gameMatch.stagingMatchesJiCe(this))
      throw "SabotageJiCe.resolveChoice: pending mismatch";
    if (MenuActivation.activatingEntry(menuNode).kind() != PlayerMenuKind.StagingSubmit)
      throw "SabotageJiCe.resolveChoice: expected StagingSubmit";

    var widgets = menuNode.formWidgets();
    if (widgets.length < 2)
      throw "SabotageJiCe: missing widgets";
    var casterId = readSingleGeneralId(widgets[0], "caster");
    var targetTile = readSingleTileIndex(widgets[1], "tile");

    var ruler = cast(gameMatch.activeMonarch(), Monarch);
    var caster:Null<General> = null;
    for (g in ruler.roster())
      if (g.id() == casterId)
        caster = cast g;
    if (caster == null)
      throw "SabotageJiCe: caster not in roster";

    var tier = StrategyCostTier.High;
    var rate = Balance.strategySuccessRate(caster.stat(Wit), tier, caster.stamina());
    var ok = Math.random() < rate;
    caster.forceSetStamina(Balance.clampInt(caster.stamina() - Balance.strategyStaminaCost(tier), 0, 100));

    if (!ok)
      return;

    var tile = gameMatch.tileAt(targetTile);
    if (tile.kind() == TileKind.City) {
      // TODO(strategy-tile): 改為城池等級下降；目前先做資源破壞示範。
      var prevG = gameMatch.forceGetCityStoredGrain(targetTile);
      var loss = Balance.clampInt(Std.int(prevG * 0.25), 0, prevG);
      gameMatch.forcePutCityStores(targetTile, gameMatch.forceGetCityStoredTroops(targetTile), prevG - loss);
    }
  }

  static function readSingleGeneralId(w:MenuFormWidget, label:String):GeneralId {
    return switch w {
      case GeneralMultiPick(_, _, sel):
        if (sel == null || sel.length != 1)
          throw 'SabotageJiCe: $label must pick exactly 1 general';
        sel[0];
      default:
        throw 'SabotageJiCe: $label widget must be GeneralMultiPick';
    };
  }

  static function readSingleTileIndex(w:MenuFormWidget, label:String):TileIndex {
    return switch w {
      case TileSinglePick(_, _, selected):
        if (selected == null || selected.length != 1)
          throw 'SabotageJiCe: $label must pick exactly 1 tile';
        selected[0];
      default:
        throw 'SabotageJiCe: $label widget must be TileSinglePick';
    };
  }

  static function __init__():Void {
    JiCeRegistry.register(REGISTRY_KEY, function(m:GameMatchCore) return new SabotageJiCe(m));
  }
}

