package impl_ver1;

import game.IJiCe;
import game.IPlayer;
import game.IPlayerCommand;
import game.IPlayerMenuNode;
import game.PlayerMenuKind;
import impl_ver1.VillageConquerStagingAction;

/** Ver1：把「本回合」主指令做成可註冊的 command 列表。 */
class Ver1MainCommands {
  public static function build(match:GameMatchCore, actor:IPlayer):Array<IPlayerCommand> {
    return [
      new MoveCommand(match),
      new JiCeCommand(match),
      new RestCommand(match),
      new VillageTradeCommand(match),
      new VillageConquerCommand(match),
      new StatusCommand(match),
      new ConfirmDoneCommand(match),
    ];
  }
}

private class MoveCommand implements IPlayerCommand {
  final m:GameMatchCore;
  public function new(m:GameMatchCore) this.m = m;
  public function kind():PlayerMenuKind return Move;
  public function designLabel():String return "移動";
  public function buildActionNode(actor:IPlayer):Null<IPlayerMenuNode> {
    if (m.isActivePlayerSliceComplete())
      return null;
    var blockBasics =
      m.forceGetPendingTileEvent() != null
      || m.forceHasPendingStaging()
      || m.forceGetPendingEmptyCityOccupyTile() != null
      || m.forceGetPendingFriendlyCityVisitTile() != null
      || m.forceGetPendingHostileCityTile() != null
      || m.forceGetPendingVillageTile() != null;
    return m.createPlayerMenuNode("移動", m.createPlayerMenuEntry(Move, "移動", !blockBasics), []);
  }
  public function apply(actor:IPlayer, menuNode:IPlayerMenuNode):Void {
    GameMatchVer1Ops.applyMenuLeafForMove(m, actor);
  }
}

private class JiCeCommand implements IPlayerCommand {
  final m:GameMatchCore;
  public function new(m:GameMatchCore) this.m = m;
  public function kind():PlayerMenuKind return JiCe;
  public function designLabel():String return "計策";
  public function buildActionNode(actor:IPlayer):Null<IPlayerMenuNode> {
    var owned = m.availableJiCe(actor.monarchId());
    var stagingActive = m.forceHasPendingStaging();
    var hostilePending = m.forceGetPendingHostileCityTile() != null;
    var pend = m.forceGetPendingTileEvent();
    var jiEnabledBase =
      !stagingActive
      && pend == null
      && m.forceGetPendingEmptyCityOccupyTile() == null
      && m.forceGetPendingFriendlyCityVisitTile() == null
      && !hostilePending;

    var jiChildren:Array<IPlayerMenuNode> = [];
    if (owned.length == 0)
      jiChildren.push(m.createPlayerMenuNode("(無所持計策)", m.createPlayerMenuEntry(JiCe, "（尚無所持計策）", false, null), []));
    else
      for (i in 0...owned.length) {
        var j = owned[i];
        jiChildren.push(m.createPlayerMenuNode(j.designLabel(), m.createPlayerMenuEntry(JiCe, "打出：" + j.designLabel(), jiEnabledBase, Std.string(i)), []));
      }
    return m.createPlayerMenuNode("計策", null, jiChildren);
  }
  public function apply(actor:IPlayer, menuNode:IPlayerMenuNode):Void {
    var leaf = game.MenuActivation.activatingEntry(menuNode);
    var card:IJiCe = m.resolvePlayedJiCeFromLeaf(actor, leaf);
    m.enterStaging(actor, new JiCeStagingAction(m, card), JiCe);
  }
}

private class RestCommand implements IPlayerCommand {
  final m:GameMatchCore;
  public function new(m:GameMatchCore) this.m = m;
  public function kind():PlayerMenuKind return Rest;
  public function designLabel():String return "休整";
  public function buildActionNode(actor:IPlayer):Null<IPlayerMenuNode> {
    if (m.isActivePlayerSliceComplete())
      return null;
    var blockBasics =
      m.forceGetPendingTileEvent() != null
      || m.forceHasPendingStaging()
      || m.forceGetPendingEmptyCityOccupyTile() != null
      || m.forceGetPendingFriendlyCityVisitTile() != null
      || m.forceGetPendingHostileCityTile() != null
      || m.forceGetPendingVillageTile() != null;
    return m.createPlayerMenuNode("休整", m.createPlayerMenuEntry(Rest, "休整（回復體力）", !blockBasics), []);
  }
  public function apply(actor:IPlayer, menuNode:IPlayerMenuNode):Void {
    m.enterStaging(actor, new RestStagingAction(m), Rest);
  }
}

private class VillageTradeCommand implements IPlayerCommand {
  final m:GameMatchCore;
  public function new(m:GameMatchCore) this.m = m;
  public function kind():PlayerMenuKind return VillageTrade;
  public function designLabel():String return "村落交易";
  public function buildActionNode(actor:IPlayer):Null<IPlayerMenuNode> {
    if (m.isActivePlayerSliceComplete())
      return null;
    if (m.forceGetPendingVillageTile() == null)
      return null;
    var blockBasics =
      m.forceGetPendingTileEvent() != null
      || m.forceHasPendingStaging()
      || m.forceGetPendingEmptyCityOccupyTile() != null
      || m.forceGetPendingFriendlyCityVisitTile() != null
      || m.forceGetPendingHostileCityTile() != null
      || m.forceGetPendingVillageTile() != null;
    return m.createPlayerMenuNode("村落：交易（示範）", m.createPlayerMenuEntry(VillageTrade, "交易（示範）", !blockBasics), []);
  }
  public function apply(actor:IPlayer, menuNode:IPlayerMenuNode):Void {
    m.enterStaging(actor, new VillageTradeStagingAction(m), VillageTrade);
  }
}

private class VillageConquerCommand implements IPlayerCommand {
  final m:GameMatchCore;
  public function new(m:GameMatchCore) this.m = m;
  public function kind():PlayerMenuKind return VillageConquer;
  public function designLabel():String return "村落攻占";
  public function buildActionNode(actor:IPlayer):Null<IPlayerMenuNode> {
    if (m.isActivePlayerSliceComplete())
      return null;
    if (m.forceGetPendingVillageTile() == null)
      return null;
    var blockBasics =
      m.forceGetPendingTileEvent() != null
      || m.forceHasPendingStaging()
      || m.forceGetPendingEmptyCityOccupyTile() != null
      || m.forceGetPendingFriendlyCityVisitTile() != null
      || m.forceGetPendingHostileCityTile() != null;
    return m.createPlayerMenuNode("村落：攻占（示範）", m.createPlayerMenuEntry(VillageConquer, "攻占（示範）", !blockBasics), []);
  }
  public function apply(actor:IPlayer, menuNode:IPlayerMenuNode):Void {
    m.enterStaging(actor, new VillageConquerStagingAction(m), VillageConquer);
  }
}

private class StatusCommand implements IPlayerCommand {
  final m:GameMatchCore;
  public function new(m:GameMatchCore) this.m = m;
  public function kind():PlayerMenuKind return Status;
  public function designLabel():String return "狀態";
  public function buildActionNode(actor:IPlayer):Null<IPlayerMenuNode> {
    return m.createPlayerMenuNode("狀態", m.createPlayerMenuEntry(Status, "狀態（前端用，無後端結算）", true), []);
  }
  public function apply(actor:IPlayer, menuNode:IPlayerMenuNode):Void {
    // Status 無結算，但仍視為一次操作（與原實作一致）
    m.syncActiveSliceAfterMenuLeaf(Status);
  }
}

private class ConfirmDoneCommand implements IPlayerCommand {
  final m:GameMatchCore;
  public function new(m:GameMatchCore) this.m = m;
  public function kind():PlayerMenuKind return ConfirmDone;
  public function designLabel():String return "結束";
  public function buildActionNode(actor:IPlayer):Null<IPlayerMenuNode> {
    var allowConfirm =
      m.isActivePlayerSliceComplete()
      && m.forceGetPendingTileEvent() == null
      && !m.forceHasPendingStaging()
      && m.forceGetPendingEmptyCityOccupyTile() == null
      && m.forceGetPendingFriendlyCityVisitTile() == null
      && m.forceGetPendingHostileCityTile() == null
      && m.forceGetPendingVillageTile() == null;
    if (!allowConfirm)
      return null;
    return m.createPlayerMenuNode("結束", m.createPlayerMenuEntry(ConfirmDone, "結束本階段", true), []);
  }
  public function apply(actor:IPlayer, menuNode:IPlayerMenuNode):Void {
    m.syncActiveSliceAfterMenuLeaf(ConfirmDone);
    m.advanceActiveMonarchAfterConfirmDone();
  }
}

