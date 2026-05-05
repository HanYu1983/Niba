package impl_ver1;

import game.IJiCe;
import game.IPlayer;
import game.IPlayerMenu;
import game.IPlayerMenuNode;
import game.IStagingAction;
import game.IJiCeStagingPreviewRow;
import game.GeneralStat;
import game.GameIds;
import impl_ver1.SimpleStagingPreviewRow;

/** 把 {@link IJiCe} 包成通用 staging action。 */
class JiCeStagingAction implements IStagingAction {
  final match:GameMatchCore;
  public final card:IJiCe;

  public function new(match:GameMatchCore, card:IJiCe) {
    this.match = match;
    this.card = card;
  }

  public function designLabel():String
    return card.designLabel();

  public function registryKey():String
    return "jice:" + card.registryKey();

  public function buildPlayerMenu(actor:IPlayer):IPlayerMenu
    return card.buildPlayerMenu(actor);

  public function resolveChoice(actor:IPlayer, menuNode:IPlayerMenuNode):Void
    card.resolveChoice(actor, menuNode);

  public function previewRows(actor:IPlayer):Array<IJiCeStagingPreviewRow> {
    // 先只針對已實作預覽公式的計策做預覽；其餘回傳空陣列（可逐步補齊）。
    if (Std.isOfType(card, LuoshiJiCe)) {
      var atk = cast(match.activeMonarch(), Monarch);
      var tid:Null<MonarchId> = null;
      for (m in match.monarchs())
        if (m.id() != actor.monarchId()) {
          tid = m.id();
          break;
        }
      if (tid == null)
        return [];
      var defTroops = cast(match.monarchById(tid), Monarch).troops();

      var rows:Array<IJiCeStagingPreviewRow> = [];
      for (g in atk.roster()) {
        var might = cast(g, General).stat(Might);
        var loss = LuoshiJiCe.previewTroopLoss(defTroops, might);
        rows.push(new SimpleStagingPreviewRow(g.id(), '預估折兵 $loss', loss));
      }
      return rows;
    }
    return [];
  }

  public function asJiCe():Null<IJiCe>
    return card;
}

