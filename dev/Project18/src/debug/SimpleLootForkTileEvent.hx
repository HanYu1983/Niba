package debug;

import game.IGameMatch;
import game.IPlayer;
import game.IPlayerMenu;
import game.IPlayerMenuEntry;
import game.IPlayerMenuNode;
import game.ITileEvent;
import game.PlayerMenuKind;

/**
 * 範例事件：三選一（軍資／糧秣／略過）；展示 ITileEvent.buildPlayerMenu／resolveChoice 語意。
 */
class SimpleLootForkTileEvent implements ITileEvent {
  public var lastResolvedChoice:String = "";

  var _match:IGameMatch;

  public function new(match:IGameMatch) {
    _match = match;
  }

  public function registryKey():String
    return "fork_loot_v1";

  public function buildPlayerMenu(actor:IPlayer):IPlayerMenu {
    var roots:Array<IPlayerMenuNode> = [
      new SimplePlayerMenuNode(
        "軍資",
        new SimplePlayerMenuEntry(TileEventPick, "事件選項：取軍資（+兵力）", true, "take_supplies"),
        []
      ),
      new SimplePlayerMenuNode(
        "糧秣",
        new SimplePlayerMenuEntry(TileEventPick, "事件選項：取糧秣（+糧食）", true, "take_grain"),
        []
      ),
      new SimplePlayerMenuNode(
        "略過",
        new SimplePlayerMenuEntry(TileEventPick, "事件選項：什麼都不拿", true, "pass"),
        []),
    ];
    return new SimplePlayerMenu(actor, "evt-" + registryKey(), roots);
  }

  public function resolveChoice(actor:IPlayer, choiceId:String):Void {
    lastResolvedChoice = choiceId;
    var ruler = cast(_match.activeMonarch(), SimpleMonarch);
    switch choiceId {
      case "take_supplies":
        ruler.grantTroops(15);
      case "take_grain":
        ruler.grantGrain(22);
      case "pass":
      default:
        throw "SimpleLootForkTileEvent.resolveChoice: unknown choiceId " + choiceId;
    }
  }
}
