package impl_ver1.ai;

import game.AiDecision;
import game.IPlayerMenu;
import game.IPlayerMenuNode;
import game.IGameMatchGetter;
import game.IPlayer;
import game.MenuFormWidget;
import game.PlayerMenuKind;

/**
 * Ver1 AI（最短可用版）：
 * - 把 AI 視為「自動點選單的玩家」
 * - 以簡單優先序選擇可用 leaf，並在 staging submit 時選用既有預設值
 */
class Ver1AiPolicy {
  public static function choose(match:IGameMatchGetter, actor:IPlayer):Null<AiDecision> {
    // 目前 ver1 最小版：仍以「menu 可按項目」為邊界，先不做權重計算（後續可用 match 全息狀態加權）
    var menu:IPlayerMenu = match.createPlayerMenu(actor);
    var nodes = flattenWithPath(menu.rootNodes());
    if (nodes.length == 0)
      return null;

    // 1) staging submit：直接提交（用既有預設值）
    var d = pickLeaf(nodes, PlayerMenuKind.StagingSubmit);
    if (d != null)
      return d;

    // 2) 落地窗口：先 continue
    d = pickLeaf(nodes, PlayerMenuKind.LandingContinue);
    if (d != null)
      return d;

    // 3) 避免卡住：若有可用 StagingAbort，優先退回
    d = pickLeaf(nodes, PlayerMenuKind.StagingAbort);
    if (d != null)
      return d;

    // 4) 主流程：Move → ConfirmDone
    d = pickLeaf(nodes, PlayerMenuKind.Move);
    if (d != null)
      return d;

    d = pickLeaf(nodes, PlayerMenuKind.ConfirmDone);
    if (d != null)
      return d;

    // 5) 後備：第一個 enabled leaf 或 enabled button
    for (n in nodes) {
      var leaf = n.node.leaf();
      if (leaf != null && leaf.isEnabled())
        return {
          nodePath: n.path,
          activation: {kind: leaf.kind(), decisionToken: leaf.decisionToken()},
          widgetPatches: []
        };
      var w = n.node.formWidgets();
      if (w != null)
        for (x in w)
          switch x {
            case Button(e):
              if (e.isEnabled())
                return {
                  nodePath: n.path,
                  activation: {kind: e.kind(), decisionToken: e.decisionToken()},
                  widgetPatches: []
                };
            default:
          }
    }
    return null;
  }

  static function pickLeaf(nodes:Array<{path:Array<Int>, node:IPlayerMenuNode}>, kind:PlayerMenuKind):Null<AiDecision> {
    for (n in nodes) {
      var leaf = n.node.leaf();
      if (leaf != null && leaf.kind() == kind && leaf.isEnabled()) {
        return {
          nodePath: n.path,
          activation: {kind: leaf.kind(), decisionToken: leaf.decisionToken()},
          widgetPatches: []
        };
      }
      var w = n.node.formWidgets();
      if (w != null)
        for (x in w)
          switch x {
            case Button(e):
              if (e.kind() == kind && e.isEnabled())
                return {
                  nodePath: n.path,
                  activation: {kind: e.kind(), decisionToken: e.decisionToken()},
                  widgetPatches: []
                };
            default:
          }
    }
    return null;
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

