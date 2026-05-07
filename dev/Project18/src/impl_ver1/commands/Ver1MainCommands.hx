package impl_ver1.commands;

import game.IJiCe;
import game.IPlayer;
import game.IPlayerCommand;
import game.IPlayerMenuNode;
import game.PlayerMenuKind;
import game.StrategyPhase;
import impl_ver1.core.GameMatchCore;
import impl_ver1.rules.GameMatchVer1Ops;
import impl_ver1.staging.JiCeStagingAction;
import impl_ver1.staging.FriendlyCityDevelopStagingAction;
import impl_ver1.staging.FriendlyCityRestStagingAction;
import impl_ver1.staging.RestStagingAction;
import impl_ver1.staging.VillageConquerStagingAction;
import impl_ver1.staging.VillagePlunderStagingAction;
import impl_ver1.staging.VillageTradeStagingAction;

/** Ver1：把「本回合」主指令做成可註冊的 command 列表。 */
class Ver1MainCommands {
  public static function build(match:GameMatchCore, actor:IPlayer):Array<IPlayerCommand> {
    return [
      new MoveCommand(match),
      new LandingContinueCommand(match),
      new StrategyPreCommand(match),
      new StrategyPostCommand(match),
      new GeneralEndTurnCommand(match),
      new ShopBuyCommand(match),
      new ShopEndTurnCommand(match),
      new VillageTradeCommand(match),
      new VillagePlunderCommand(match),
      new VillageConquerCommand(match),
      new VillageEndTurnCommand(match),
      new StatusCommand(match),
      new ConfirmDoneCommand(match),
    ];
  }
}

private class GeneralEndTurnCommand implements IPlayerCommand {
  final m:GameMatchCore;
  public function new(m:GameMatchCore) this.m = m;
  public function kind():PlayerMenuKind return GeneralEndTurn;
  public function designLabel():String return "離開武將格";
  public function buildActionNode(actor:IPlayer):Null<IPlayerMenuNode> {
    if (m.isActivePlayerSliceComplete())
      return null;
    if (m.forceGetPendingGeneralTile() == null)
      return null;
    var block =
      m.forceGetPendingTileEvent() != null
      || m.forceHasPendingStaging()
      || m.forceGetPendingEmptyCityOccupyTile() != null
      || m.forceGetPendingFriendlyCityVisitTile() != null
      || m.forceGetPendingHostileCityTile() != null
      || m.forceGetPendingVillageTile() != null
      || m.forceGetPendingResourceTile() != null
      || m.forceGetPendingShopTile() != null;
    return m.createPlayerMenuNode("離開", m.createPlayerMenuEntry(GeneralEndTurn, "離開（武將格）", !block), []);
  }
  public function apply(actor:IPlayer, menuNode:IPlayerMenuNode):Void {}
}

private class ShopBuyCommand implements IPlayerCommand {
  final m:GameMatchCore;
  public function new(m:GameMatchCore) this.m = m;
  public function kind():PlayerMenuKind return ShopBuy;
  public function designLabel():String return "商店購買";
  public function buildActionNode(actor:IPlayer):Null<IPlayerMenuNode> {
    if (m.isActivePlayerSliceComplete())
      return null;
    if (m.forceGetPendingShopTile() == null)
      return null;
    var blockBasics =
      m.forceGetPendingTileEvent() != null
      || m.forceHasPendingStaging()
      || m.forceGetPendingEmptyCityOccupyTile() != null
      || m.forceGetPendingFriendlyCityVisitTile() != null
      || m.forceGetPendingHostileCityTile() != null
      || m.forceGetPendingVillageTile() != null
      || m.forceGetPendingResourceTile() != null
      || m.forceGetPendingGeneralTile() != null;
    return m.createPlayerMenuNode("商店格：購買（骨架）", m.createPlayerMenuEntry(ShopBuy, "購買（骨架）", !blockBasics), []);
  }
  public function apply(actor:IPlayer, menuNode:IPlayerMenuNode):Void {}
}

private class ShopEndTurnCommand implements IPlayerCommand {
  final m:GameMatchCore;
  public function new(m:GameMatchCore) this.m = m;
  public function kind():PlayerMenuKind return ShopEndTurn;
  public function designLabel():String return "離開商店";
  public function buildActionNode(actor:IPlayer):Null<IPlayerMenuNode> {
    if (m.isActivePlayerSliceComplete())
      return null;
    if (m.forceGetPendingShopTile() == null)
      return null;
    var block =
      m.forceGetPendingTileEvent() != null
      || m.forceHasPendingStaging()
      || m.forceGetPendingEmptyCityOccupyTile() != null
      || m.forceGetPendingFriendlyCityVisitTile() != null
      || m.forceGetPendingHostileCityTile() != null
      || m.forceGetPendingVillageTile() != null
      || m.forceGetPendingResourceTile() != null
      || m.forceGetPendingGeneralTile() != null;
    return m.createPlayerMenuNode("離開", m.createPlayerMenuEntry(ShopEndTurn, "離開（商店格）", !block), []);
  }
  public function apply(actor:IPlayer, menuNode:IPlayerMenuNode):Void {}
}

private class LandingContinueCommand implements IPlayerCommand {
  final m:GameMatchCore;
  public function new(m:GameMatchCore) this.m = m;
  public function kind():PlayerMenuKind return LandingContinue;
  public function designLabel():String return "落地";
  public function buildActionNode(actor:IPlayer):Null<IPlayerMenuNode> {
    if (m.forceGetPendingLandingTile() == null)
      return null;
    // 當存在 pendingLanding 時，玩家可選擇先用移動後策略，再按此鍵進入落地分流。
    return m.createPlayerMenuNode("落地", m.createPlayerMenuEntry(LandingContinue, "繼續落地結算", true), []);
  }
  public function apply(actor:IPlayer, menuNode:IPlayerMenuNode):Void {}
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
      || m.forceGetPendingLandingTile() != null
      || m.forceGetPendingEmptyCityOccupyTile() != null
      || m.forceGetPendingFriendlyCityVisitTile() != null
      || m.forceGetPendingHostileCityTile() != null
      || m.forceGetPendingVillageTile() != null
      || m.forceGetPendingResourceTile() != null
      || m.forceGetPendingGeneralTile() != null
      || m.forceGetPendingShopTile() != null;
    return m.createPlayerMenuNode("移動", m.createPlayerMenuEntry(Move, "移動", !blockBasics), []);
  }
  public function apply(actor:IPlayer, menuNode:IPlayerMenuNode):Void {
    GameMatchVer1Ops.applyMenuLeafForMove(m, actor);
  }
}

private class StrategyPreCommand implements IPlayerCommand {
  final m:GameMatchCore;
  public function new(m:GameMatchCore) this.m = m;
  public function kind():PlayerMenuKind return StrategyPre;
  public function designLabel():String return "策略（移動前）";
  public function buildActionNode(actor:IPlayer):Null<IPlayerMenuNode> {
    if (!m.canUseStrategyPreMove())
      return null;
    if (m.forceGetPendingLandingTile() != null)
      return null;
    var owned = m.availableJiCe(actor.monarchId());
    var stagingActive = m.forceHasPendingStaging();
    var hostilePending = m.forceGetPendingHostileCityTile() != null;
    var pend = m.forceGetPendingTileEvent();
    var jiEnabledBase =
      !stagingActive
      && pend == null
      && m.forceGetPendingLandingTile() == null
      && m.forceGetPendingEmptyCityOccupyTile() == null
      && m.forceGetPendingFriendlyCityVisitTile() == null
      && !hostilePending
      && m.forceGetPendingVillageTile() == null
      && m.forceGetPendingResourceTile() == null
      && m.forceGetPendingGeneralTile() == null
      && m.forceGetPendingShopTile() == null;

    var jiChildren:Array<IPlayerMenuNode> = [];
    var phase = StrategyPhase.PreMove;
    var filtered:Array<IJiCe> = [];
    for (j in owned) {
      var ok = false;
      for (p in j.allowedPhases())
        if (p == phase) {
          ok = true;
          break;
        }
      if (ok)
        filtered.push(j);
    }

    if (filtered.length == 0)
      jiChildren.push(m.createPlayerMenuNode("(無所持計策)", m.createPlayerMenuEntry(JiCe, "（尚無所持計策）", false, null), []));
    else
      for (i in 0...filtered.length) {
        var j = filtered[i];
        // decisionToken 仍需對應「原 owned 陣列索引」以便 GameMatchCore 取牌
        var ownedIdx = -1;
        for (k in 0...owned.length)
          if (owned[k] == j) {
            ownedIdx = k;
            break;
          }
        if (ownedIdx < 0)
          throw "StrategyPreCommand: internal index mapping failed";
        jiChildren.push(m.createPlayerMenuNode(j.designLabel(), m.createPlayerMenuEntry(JiCe, "打出：" + j.designLabel(), jiEnabledBase, Std.string(ownedIdx)), []));
      }
    return m.createPlayerMenuNode("策略（移動前）", null, jiChildren);
  }
  public function apply(actor:IPlayer, menuNode:IPlayerMenuNode):Void {
    // applyMenuLeaf 會處理 JiCe leaf → 進入 staging
  }
}

private class StrategyPostCommand implements IPlayerCommand {
  final m:GameMatchCore;
  public function new(m:GameMatchCore) this.m = m;
  public function kind():PlayerMenuKind return StrategyPost;
  public function designLabel():String return "策略（移動後）";
  public function buildActionNode(actor:IPlayer):Null<IPlayerMenuNode> {
    if (!m.canUseStrategyPostMove())
      return null;
    if (m.forceGetPendingLandingTile() == null)
      return null;
    // 移動後策略：只在 pendingLanding 窗口中顯示；目前先沿用同一套計策列表（後續可依策略類型過濾）
    var owned = m.availableJiCe(actor.monarchId());
    var stagingActive = m.forceHasPendingStaging();
    var jiEnabledBase =
      !stagingActive
      && m.forceGetPendingVillageTile() == null
      && m.forceGetPendingResourceTile() == null
      && m.forceGetPendingGeneralTile() == null
      && m.forceGetPendingShopTile() == null;
    var jiChildren:Array<IPlayerMenuNode> = [];
    var phase = StrategyPhase.PostMove;
    var filtered:Array<IJiCe> = [];
    for (j in owned) {
      var ok = false;
      for (p in j.allowedPhases())
        if (p == phase) {
          ok = true;
          break;
        }
      if (ok)
        filtered.push(j);
    }

    if (filtered.length == 0)
      jiChildren.push(m.createPlayerMenuNode("(無所持計策)", m.createPlayerMenuEntry(JiCe, "（尚無所持計策）", false, null), []));
    else
      for (i in 0...filtered.length) {
        var j = filtered[i];
        var ownedIdx = -1;
        for (k in 0...owned.length)
          if (owned[k] == j) {
            ownedIdx = k;
            break;
          }
        if (ownedIdx < 0)
          throw "StrategyPostCommand: internal index mapping failed";
        jiChildren.push(m.createPlayerMenuNode(j.designLabel(), m.createPlayerMenuEntry(JiCe, "打出：" + j.designLabel(), jiEnabledBase, Std.string(ownedIdx)), []));
      }
    return m.createPlayerMenuNode("策略（移動後）", null, jiChildren);
  }
  public function apply(actor:IPlayer, menuNode:IPlayerMenuNode):Void {
    // applyMenuLeaf 會處理 JiCe leaf → 進入 staging
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
      || m.forceGetPendingHostileCityTile() != null;
    return m.createPlayerMenuNode("村落：交易（示範）", m.createPlayerMenuEntry(VillageTrade, "交易（示範）", !blockBasics), []);
  }
  public function apply(actor:IPlayer, menuNode:IPlayerMenuNode):Void {
    m.enterStaging(actor, new VillageTradeStagingAction(m), VillageTrade);
  }
}

private class VillagePlunderCommand implements IPlayerCommand {
  final m:GameMatchCore;
  public function new(m:GameMatchCore) this.m = m;
  public function kind():PlayerMenuKind return VillagePlunder;
  public function designLabel():String return "村落搶奪";
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
    return m.createPlayerMenuNode("村落：搶奪（示範）", m.createPlayerMenuEntry(VillagePlunder, "搶奪（示範）", !blockBasics), []);
  }
  public function apply(actor:IPlayer, menuNode:IPlayerMenuNode):Void {
    m.enterStaging(actor, new VillagePlunderStagingAction(m), VillagePlunder);
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

private class VillageEndTurnCommand implements IPlayerCommand {
  final m:GameMatchCore;
  public function new(m:GameMatchCore) this.m = m;
  public function kind():PlayerMenuKind return VillageEndTurn;
  public function designLabel():String return "村落回合結束";
  public function buildActionNode(actor:IPlayer):Null<IPlayerMenuNode> {
    if (m.isActivePlayerSliceComplete())
      return null;
    if (m.forceGetPendingVillageTile() == null)
      return null;
    var block =
      m.forceGetPendingTileEvent() != null
      || m.forceHasPendingStaging()
      || m.forceGetPendingEmptyCityOccupyTile() != null
      || m.forceGetPendingFriendlyCityVisitTile() != null
      || m.forceGetPendingHostileCityTile() != null;
    return m.createPlayerMenuNode("回合結束", m.createPlayerMenuEntry(VillageEndTurn, "回合結束（村落）", !block), []);
  }
  public function apply(actor:IPlayer, menuNode:IPlayerMenuNode):Void {
    // 實際清 pending 由 GameMatchCore.applyMenuLeaf 處理
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
      && m.forceGetPendingLandingTile() == null
      && m.forceGetPendingEmptyCityOccupyTile() == null
      && m.forceGetPendingFriendlyCityVisitTile() == null
      && m.forceGetPendingHostileCityTile() == null
      && m.forceGetPendingVillageTile() == null
      && m.forceGetPendingResourceTile() == null
      && m.forceGetPendingGeneralTile() == null
      && m.forceGetPendingShopTile() == null;
    if (!allowConfirm)
      return null;
    return m.createPlayerMenuNode("結束", m.createPlayerMenuEntry(ConfirmDone, "結束本階段", true), []);
  }
  public function apply(actor:IPlayer, menuNode:IPlayerMenuNode):Void {
    m.syncActiveSliceAfterMenuLeaf(ConfirmDone);
    m.advanceActiveMonarchAfterConfirmDone();
  }
}

