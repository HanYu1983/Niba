package debug_ver1;

import game.GameIds;
import game.GeneralEffect;
import game.GeneralStat;
import game.IAvoidableTileEvent;
import game.IGameMatch;
import game.IPlayer;
import game.IPlayerMenu;
import game.IPlayerMenuNode;
import game.ITileEvent;
import game.MenuActivation;
import game.MenuFormWidget;
import game.MenuGeneralChoice;
import game.OutboxPayload;
import game.PlayerMenuKind;
import game.PlayerMenuKind.TileEventPick;
import impl_ver1.model.General;
import impl_ver1.model.Monarch;
import impl_ver1.model.PlayerMenu;
import impl_ver1.util.Deterministic;

/**
 * 負面事件示範：暗殺企圖（可規避）。
 * - 效果：指定武將某項能力永久 -3（可依 multiplier 減半/無效）
 * - 規避屬性：武力（Might）
 */
class AssassinationAvoidableTileEvent implements ITileEvent implements IAvoidableTileEvent {
  final match:IGameMatch;

  public function new(match:IGameMatch) {
    this.match = match;
  }

  public function registryKey():String
    return "evt_assassination";

  public function isNegative():Bool
    return true;

  public function avoidanceStat():GeneralStat
    return Might;

  public function avoidanceBaseRate():Float
    return 0.25;

  public function avoidanceStaminaCost():Int
    return 10;

  public function avoidanceSuccessMultiplier():Float
    return 0.0;

  public function buildPlayerMenu(actor:IPlayer):IPlayerMenu {
    var ruler:Monarch = cast match.activeMonarch();
    var choices:Array<MenuGeneralChoice> = [];
    for (g in ruler.roster())
      choices.push({generalId: g.id()});
    var defSel:Array<String> = choices.length > 0 ? [choices[0].generalId] : [];

    var submit = match.createPlayerMenuEntry(PlayerMenuKind.TileEventPick, "確認：處理暗殺後果", true, "accept");
    var widgets:Array<MenuFormWidget> = [];
    if (choices.length > 0)
      widgets.push(GeneralMultiPick("受影響武將（單選）", choices, defSel));
    widgets.push(Button(submit));

    var roots:Array<IPlayerMenuNode> = [
      match.createPlayerMenuNode("暗殺企圖", null, ([] : Array<IPlayerMenuNode>), widgets),
    ];
    return new PlayerMenu(actor, "evt-" + registryKey(), roots);
  }

  public function resolveChoice(actor:IPlayer, menuNode:IPlayerMenuNode):Void {
    var leaf = MenuActivation.activatingEntry(menuNode);
    if (leaf.kind() != TileEventPick)
      throw "AssassinationAvoidableTileEvent.resolveChoice: expected TileEventPick";
    var ruler:Monarch = cast match.activeMonarch();
    if (ruler.roster().length == 0) {
      match.pushOutboxPlain(actor.monarchId(), "事件：暗殺企圖", OutboxPayload.AssassinationNoGeneralsSkipped, "evt-assassination");
      return;
    }

    var picked:Array<String> = [];
    for (w in menuNode.formWidgets())
      switch w {
        case GeneralMultiPick(_, _, sel):
          picked = sel.copy();
        default:
      }
    if (picked.length != 1)
      throw "AssassinationAvoidableTileEvent: must pick exactly 1 general";
    var gid:GeneralId = picked[0];
    var target:Null<General> = null;
    for (g in ruler.roster())
      if (g != null && g.id() == gid) {
        target = cast g;
        break;
      }
    if (target == null)
      throw 'AssassinationAvoidableTileEvent: unknown general "$gid"';

    var mult = match.forceGetPendingTileEventEffectMultiplier();
    var loss = Std.int(Math.round(3 * mult));
    if (loss < 0)
      loss = 0;

    // 決定受損屬性（可重現）
    var seed = 'assassination|m=${ruler.id()}|g=${gid}|r=${match.roundNumber()}';
    var pick = Deterministic.pickIndex(seed, 4);
    var stat:GeneralStat = switch pick {
      case 0: Command;
      case 1: Might;
      case 2: Wit;
      default: Stewardship;
    };

    if (loss > 0)
      target.addEffect(GeneralEffect.PermanentStatDelta(stat, -loss));

    match.pushOutboxPlain(
      actor.monarchId(),
      "事件：暗殺企圖",
      OutboxPayload.AssassinationResolved(gid, stat, loss, mult),
      "evt-assassination"
    );
  }
}

