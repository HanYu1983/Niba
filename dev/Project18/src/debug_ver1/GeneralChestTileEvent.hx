package debug_ver1;

import game.GameIds;
import game.IPlayer;
import game.IPlayerMenu;
import game.IPlayerMenuEntry;
import game.IPlayerMenuNode;
import game.ITileEvent;
import game.IGameMatch;
import game.MenuActivation;
import game.MenuFormWidget;
import game.MenuGeneralChoice;
import game.PopupPayload;
import game.PlayerMenuKind.TileEventPick;
import impl_ver1.model.PlayerMenu;

/**
 * 除錯用事件：開箱領賞；麾下武將時以 {@link MenuFormWidget.GeneralMultiPick}＋確認鈕同節點結算。
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
    var ruler = _match.activeMonarch();
    var choices:Array<MenuGeneralChoice> = [];
    for (g in ruler.roster())
      choices.push({generalId: g.id(), caption: g.id()});
    var widgets:Array<MenuFormWidget> = [];
    if (choices.length > 0) {
      var def:Array<String> = [choices[0].generalId];
      widgets.push(GeneralMultiPick("領賞武將（選一人）", choices, def));
    }
    widgets.push(Button(_match.createPlayerMenuEntry(TileEventPick, "確認開箱領賞", true, "claim_reward")));
    var roots:Array<IPlayerMenuNode> = [_match.createPlayerMenuNode("開箱領賞", null, ([] : Array<IPlayerMenuNode>), widgets)];
    return new PlayerMenu(actor, "evt-" + registryKey(), roots);
  }

  public function resolveChoice(actor:IPlayer, menuNode:IPlayerMenuNode):Void {
    var leaf = MenuActivation.activatingEntry(menuNode);
    if (leaf.kind() != TileEventPick)
      throw "GeneralChestTileEvent.resolveChoice: 預期 TileEventPick 葉";
    var tok = leaf.decisionToken();
    if (tok == null)
      throw "GeneralChestTileEvent.resolveChoice: leaf 須有 decisionToken";
    lastResolvedChoice = tok;
    var ruler = _match.activeMonarch();
    switch tok {
      case "claim_reward":
        if (ruler.roster().length == 0) {
          ruler.grantTroops(GRANT_NO_ROSTER);
          lastResolvedChoice = "claim_reward:no_general";
          _match.pushOutboxPlain(
            actor.monarchId(),
            "奇遇：開箱領賞",
            PopupPayload.ChestTroopReward(false, null, GRANT_NO_ROSTER),
            "evt-general-chest"
          );
        } else {
          var ids = parseTileEventGeneralIds(menuNode, ruler);
          if (ids.length != 1)
            throw "GeneralChestTileEvent.resolveChoice: 領賞須恰好選擇一名麾下武將";
          ruler.grantTroops(GRANT_PER_GENERAL);
          lastResolvedChoice = "claim_reward:" + ids[0];
          _match.pushOutboxPlain(
            actor.monarchId(),
            "奇遇：開箱領賞",
            PopupPayload.ChestTroopReward(true, ids[0], GRANT_PER_GENERAL),
            "evt-general-chest"
          );
        }
      default:
        throw "GeneralChestTileEvent.resolveChoice: unknown decisionToken " + tok;
    }
  }

  static function parseTileEventGeneralIds(menuNode:IPlayerMenuNode, ruler:game.IMonarch):Array<GeneralId> {
    var raw:Array<String> = [];
    for (w in menuNode.formWidgets())
      switch w {
        case GeneralMultiPick(_, _, sel):
          raw = sel.copy();
        case Slider(_, _, _, _, _):
        case MonarchSinglePick(_, _, _):
        case Button(_):
        case TileSinglePick(_, _, _):
      }
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
