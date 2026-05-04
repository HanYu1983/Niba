package debug_ver1;

import game.GameIds;
import game.IPlayer;
import game.IPlayerMenu;
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
 * impl_ver1 分叉事件：「軍資」以表單複選武將＋確認鈕結算；糧秣／略過為單葉。
 */
class RingLootForkTileEvent implements ITileEvent {
  public var lastResolvedChoice:String = "";

  var _match:IGameMatch;

  public function new(match:IGameMatch) {
    _match = match;
  }

  public function registryKey():String
    return "fork_loot_ring_evt";

  public function buildPlayerMenu(actor:IPlayer):IPlayerMenu {
    var ruler = cast(_match.activeMonarch(), Monarch);
    var choices:Array<MenuGeneralChoice> = [];
    for (g in ruler.roster())
      choices.push({generalId: g.id(), caption: g.id()});
    var supplyWidgets:Array<MenuFormWidget> = [];
    if (choices.length > 0) {
      var def:Array<String> = [choices[0].generalId];
      supplyWidgets.push(GeneralMultiPick(MenuFieldIds.TileEventGenerals, "領軍補給武將（選一人）", choices, def));
    }
    supplyWidgets.push(
      Button(_match.createPlayerMenuEntry(TileEventPick, "事件選項：取軍資（+兵力，須選將若有麾下）", true, "take_supplies"))
    );
    var roots:Array<IPlayerMenuNode> = [
      _match.createPlayerMenuNode("軍資", null, ([] : Array<IPlayerMenuNode>), supplyWidgets),
      _match.createPlayerMenuNode(
        "糧秣",
        _match.createPlayerMenuEntry(TileEventPick, "事件選項：取糧秣（+糧食）", true, "take_grain"),
        ([] : Array<IPlayerMenuNode>)
      ),
      _match.createPlayerMenuNode(
        "略過",
        _match.createPlayerMenuEntry(TileEventPick, "事件選項：什麼都不拿", true, "pass"),
        ([] : Array<IPlayerMenuNode>)
      ),
    ];
    return new PlayerMenu(actor, "evt-" + registryKey(), roots);
  }

  public function resolveChoice(actor:IPlayer, choiceId:String, ?formStringListFields:Map<String, Array<String>>):Void {
    lastResolvedChoice = choiceId;
    var ruler = cast(_match.activeMonarch(), Monarch);
    switch choiceId {
      case "take_supplies":
        if (ruler.roster().length == 0)
          ruler.grantTroops(15);
        else {
          var ids = parseTileEventGeneralIds(formStringListFields, ruler);
          if (ids.length != 1)
            throw "RingLootForkTileEvent.resolveChoice: 取軍資須恰好選擇一名麾下武將";
          ruler.grantTroops(15);
          lastResolvedChoice = "take_supplies:" + ids[0];
        }
      case "take_grain":
        ruler.grantGrain(22);
      case "pass":
      default:
        throw "RingLootForkTileEvent.resolveChoice: unknown choiceId " + choiceId;
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
        throw 'RingLootForkTileEvent: 複選含非麾下武將 "$gid"';
    return uniq;
  }
}
