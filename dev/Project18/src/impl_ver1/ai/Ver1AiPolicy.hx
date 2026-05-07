package impl_ver1.ai;

import game.AiDecision;
import game.IPlayerMenu;
import game.IPlayerMenuNode;
import game.IGameMatchGetter;
import game.IPlayer;
import game.MenuFormWidget;
import game.PlayerMenuKind;
import impl_ver1.util.Deterministic;

/**
 * Ver1 AI（最短可用版）：
 * - 把 AI 視為「自動點選單的玩家」
 * - 以簡單優先序選擇可用 leaf，並在 staging submit 時選用既有預設值
 */
class Ver1AiPolicy {
  public static function choose(match:IGameMatchGetter, actor:IPlayer):Null<AiDecision> {
    var menu:IPlayerMenu = match.createPlayerMenu(actor);
    var nodes = flattenWithPath(menu.rootNodes());
    if (nodes.length == 0)
      return null;

    // 權重模型（隨意版）：枚舉所有可用 entry，算分後取最大
    var best:Null<{d:AiDecision, score:Float}> = null;

    for (n in nodes) {
      // leaf
      var leaf = n.node.leaf();
      if (leaf != null && leaf.isEnabled()) {
        var d = {
          nodePath: n.path,
          activation: {kind: leaf.kind(), decisionToken: leaf.decisionToken()},
          widgetPatches: []
        };
        var s = scoreDecision(match, actor, d);
        s += tieBreakJitter(match, actor, leaf.kind(), leaf.decisionToken());
        if (best == null || s > best.score)
          best = {d: d, score: s};
      }

      // form buttons
      var w = n.node.formWidgets();
      if (w != null)
        for (x in w)
          switch x {
            case Button(e):
              if (!e.isEnabled())
                continue;
              var d = {
                nodePath: n.path,
                activation: {kind: e.kind(), decisionToken: e.decisionToken()},
                widgetPatches: []
              };
              var s = scoreDecision(match, actor, d);
              s += tieBreakJitter(match, actor, e.kind(), e.decisionToken());
              if (best == null || s > best.score)
                best = {d: d, score: s};
            default:
          }
    }

    return best != null ? best.d : null;
  }

  static function scoreDecision(match:IGameMatchGetter, actor:IPlayer, d:AiDecision):Float {
    var mid = actor.monarchId();
    var a = match.activeMonarch();
    // 不是自己回合就不要動（防禦性：避免 UI/測試 actor 傳錯）
    if (a == null || a.id() != mid)
      return -1e9;

    // 終局不再操作
    switch match.getTerminationReason() {
      case NotEnded:
      case _:
        return -1e9;
    }

    var k = d.activation != null ? d.activation.kind : null;
    if (k == null)
      return -1e6;

    // 合法性下推到 menu 建構端：AI 僅會枚舉 enabled entry（choose() 只取 isEnabled）

    // 基本偏好：推進狀態機、避免無意義操作
    var s = 0.0;

    // staging：能提交就提交
    if (match.forceHasPendingStaging())
      // Abort 只作為保底退路（避免一直看到「已取消暫存操作」）
      s += (k == StagingSubmit ? 10000 : (k == StagingAbort ? 200 : -100));

    // 移動後落地窗口：能 continue 就 continue
    if (match.forceGetPendingLandingTile() != null)
      s += (k == LandingContinue ? 8000 : -50);

    // 若切片已可收束：優先 ConfirmDone，其次各種「End/VisitEnd」
    if (match.isActivePlayerSliceComplete()) {
      if (k == ConfirmDone)
        s += 7000;
      if (k == VillageEndTurn || k == ResourceEndTurn || k == GeneralEndTurn || k == ShopEndTurn)
        s += 6500;
      if (k == FriendlyCityVisitEnd || k == VillageVisitEnd)
        s += 6400;
      // 已可收束時，Move 應該不會出現；若出現就重罰
      if (k == Move)
        s -= 2000;
    } else {
      // 尚未可收束：Move 通常是最主要推進
      if (k == Move)
        s += 5000;
      // ConfirmDone 在此階段通常不可用，若可用也不應太早結束（但不重罰）
      if (k == ConfirmDone)
        s += 200;
    }

    // ---- pending 專屬推進：避免 AI 一直在拜訪/互動中打轉 ----
    if (!match.forceHasPendingStaging() && match.forceGetPendingLandingTile() == null) {
      if (match.forceGetPendingFriendlyCityVisitTile() != null) {
        // 在城池拜訪中：優先結束拜訪（讓回合能收束到 ConfirmDone）
        if (k == FriendlyCityVisitEnd)
          s += 6200;
      }
      if (match.forceGetPendingVillageTile() != null) {
        // 村落互動：若有 EndTurn/VisitEnd，優先離開（避免一直 trade/plunder）
        if (k == VillageEndTurn || k == VillageVisitEnd)
          s += 6100;
      }
      if (match.forceGetPendingResourceTile() != null) {
        if (k == ResourceEndTurn)
          s += 6000;
      }
      if (match.forceGetPendingGeneralTile() != null) {
        if (k == GeneralEndTurn)
          s += 6000;
      }
      if (match.forceGetPendingShopTile() != null) {
        if (k == ShopEndTurn)
          s += 6000;
      }
      if (match.forceGetPendingHostileCityTile() != null) {
        // 敵城對峙：目前流程多為確認/ack，優先推進（避免停住）
        if (k == HostileCityDefenderAck || k == HostileCityDefenderPickSubmit || k == HostileCitySettlementAck)
          s += 6500;
      }
    }

    // Status（狀態）菜單已移除（GDD 未設計），不需特別處理

    // 一些互動類：給中等分（避免完全不會玩）
    if (k == FriendlyCityDevelop || k == FriendlyCityRest)
      s += 1200;
    if (k == VillageTrade || k == VillagePlunder || k == VillageConquer || k == VillageDevelop)
      s += 1100;
    if (k == ResourceClaim || k == ResourceBoost)
      s += 1000;
    if (k == GeneralRecruit || k == GeneralRecruitSubmit)
      s += 900;
    if (k == ShopBuy)
      s += 800;

    // 事件規避：若出現，略偏好嘗試（但不蓋過推進）
    if (k == TileEventAvoidAttempt)
      s += 600;
    if (k == TileEventAvoidSkip)
      s += 500;

    return s;
  }

  static function tieBreakJitter(match:IGameMatchGetter, actor:IPlayer, k:PlayerMenuKind, tok:Null<String>):Float {
    // 小抖動：避免同分時永遠選到同一個（仍保持 deterministic）
    var seed = 'ai_tie|r=${match.roundNumber()}|m=${actor.monarchId()}|k=${Std.string(k)}|tok=${tok != null ? tok : ""}';
    return Deterministic.hash01(seed) * 0.01;
  }

  static function flattenWithPath(roots:Array<IPlayerMenuNode>):Array<{path:Array<Int>, node:IPlayerMenuNode}> {
    var out:Array<{path:Array<Int>, node:IPlayerMenuNode}> = [];
    // DFS：stack item 含 path
    var stack:Array<{path:Array<Int>, node:IPlayerMenuNode}> = [];
    for (i in 0...roots.length)
      stack.push({path: [i], node: roots[i]});
    while (stack.length > 0) {
      var it = stack.pop();
      out.push(it);
      var kids = it.node.children();
      if (kids != null)
        for (i in 0...kids.length) {
          var p = it.path.copy();
          p.push(i);
          stack.push({path: p, node: kids[i]});
        }
    }
    return out;
  }
}

