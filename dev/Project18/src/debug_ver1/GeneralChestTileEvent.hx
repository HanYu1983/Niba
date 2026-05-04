package debug_ver1;

import game.GameIds;
import game.IPlayer;
import game.IPlayerMenu;
import game.IPlayerMenuEntry;
import game.IPlayerMenuNode;
import game.ITileEvent;
import game.IGameMatch;
import game.MenuFieldIds;
import game.MenuFormWidget;
import game.MenuGeneralChoice;
import game.PlayerMenuKind.TileEventPick;
import impl_ver1.Monarch;
import impl_ver1.PlayerMenu;

/**
 * 除錯用事件：開箱領賞；麾下武將時以表單 {@link MenuFormWidget.GeneralMultiPick} 選一名武將並與確認鈕同節點結算。
 * 無武將時僅確認鈕，直接為君主 +5 兵力。
 */
class GeneralChestTileEvent implements ITileEvent {
  public var lastResolvedChoice:String = "";

  var _match:IGameMatch;

  public function new(match:IGameMatch) {
    _match = match;
  }

  public function registryKey():String
    return "evt_general_chest";

  inline static var GRANT_PER_GENERAL:Int = 8;
  inline static var GRANT_NO_ROSTER:Int = 5;

  public function buildPlayerMenu(actor:IPlayer):IPlayerMenu {
    var ruler = cast(_match.activeMonarch(), Monarch);
    var choices:Array<MenuGeneralChoice> = [];
    for (g in ruler.roster())
      choices.push({generalId: g.id(), caption: g.id()});
    var widgets:Array<MenuFormWidget> = [];
    if (choices.length > 0) {
      var def:Array<String> = [choices[0].generalId];
      widgets.push(GeneralMultiPick(MenuFieldIds.TileEventGenerals, "領賞武將（選一人）", choices, def));
    }
    widgets.push(Button(_match.createPlayerMenuEntry(TileEventPick, "確認開箱領賞", true, "claim_reward")));
    var roots:Array<IPlayerMenuNode> = [_match.createPlayerMenuNode("開箱領賞", null, ([] : Array<IPlayerMenuNode>), widgets)];
    return new PlayerMenu(actor, "evt-" + registryKey(), roots);
  }

  public function resolveChoice(actor:IPlayer, leaf:IPlayerMenuEntry, ?formStringListFields:Map<String, Array<String>>):Void {
    if (leaf.kind() != TileEventPick)
      throw "GeneralChestTileEvent.resolveChoice: 預期 TileEventPick 葉";
    var tok = leaf.decisionToken();
    if (tok == null)
      throw "GeneralChestTileEvent.resolveChoice: leaf 須有 decisionToken";
    lastResolvedChoice = tok;
    var ruler = cast(_match.activeMonarch(), Monarch);
    switch tok {
      case "claim_reward":
        if (ruler.roster().length == 0) {
          ruler.grantTroops(GRANT_NO_ROSTER);
          lastResolvedChoice = "claim_reward:no_general";
        } else {
          var ids = parseTileEventGeneralIds(formStringListFields, ruler);
          if (ids.length != 1)
            throw "GeneralChestTileEvent.resolveChoice: 領賞須恰好選擇一名麾下武將";
          ruler.grantTroops(GRANT_PER_GENERAL);
          lastResolvedChoice = "claim_reward:" + ids[0];
        }
      default:
        throw "GeneralChestTileEvent.resolveChoice: unknown decisionToken " + tok;
    }
  }

  static function parseTileEventGeneralIds(form:Null<Map<String, Array<String>>>, ruler:Monarch):Array<GeneralId> {
    var raw = form != null && form.exists(MenuFieldIds.TileEventGenerals) ? form.get(MenuFieldIds.TileEventGenerals) : ([] : Array<String>);
    var seen = new Map<String, Bool>();
    var uniq:Array<GeneralId> = [];
    for (id in raw) {
      if (seen.exists(id))
        continue;
      seen.set(id, true);
      uniq.push(id);
    }
    var ok = new Map<String, Bool>();
    for (g in ruler.roster())
      ok.set(g.id(), true);
    for (gid in uniq)
      if (!ok.exists(gid))
        throw 'GeneralChestTileEvent: 複選含非麾下武將 "$gid"';
    return uniq;
  }
}
