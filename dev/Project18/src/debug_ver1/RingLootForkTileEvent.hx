package debug_ver1;

import game.IPlayer;
import game.IPlayerMenu;
import game.IPlayerMenuEntry;
import game.IPlayerMenuNode;
import game.ITileEvent;
import game.PlayerMenuKind.TileEventPick;
import impl_ver1.GameMatch;
import impl_ver1.Monarch;
import impl_ver1.PlayerMenu;

/**
 * impl_ver1 用事件範例：三選一（與 debug.SimpleLootForkTileEvent 語意對齊，操作 {@link Monarch}）。
 */
class RingLootForkTileEvent implements ITileEvent {
  public var lastResolvedChoice:String = "";

  var _match:GameMatch;

  public function new(match:GameMatch) {
    _match = match;
  }

  public function registryKey():String
    return "fork_loot_ring_evt";

  public function buildPlayerMenu(actor:IPlayer):IPlayerMenu {
    var roots:Array<IPlayerMenuNode> = [
      _match.createPlayerMenuNode(
        "軍資",
        _match.createPlayerMenuEntry(TileEventPick, "事件選項：取軍資（+兵力）", true, "take_supplies"),
        ([] : Array<IPlayerMenuNode>)
      ),
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

  public function resolveChoice(actor:IPlayer, choiceId:String):Void {
    lastResolvedChoice = choiceId;
    var ruler = cast(_match.activeMonarch(), Monarch);
    switch choiceId {
      case "take_supplies":
        ruler.grantTroops(15);
      case "take_grain":
        ruler.grantGrain(22);
      case "pass":
      default:
        throw "RingLootForkTileEvent.resolveChoice: unknown choiceId " + choiceId;
    }
  }
}
