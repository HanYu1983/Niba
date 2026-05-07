package view;

import game.AiDecision;
import game.GameIds;
import game.IPlayer;
import game.IGameMatch;
import game.IPlayerMenu;
import game.IPlayerMenuEntry;
import game.IPlayerMenuNode;
import game.MenuFormWidget;

/**
 * UI/測試共用：把 AiDecision 套用到「menu 快照」並執行 apply。
 *
 * 目的：確保 UI（BasicViewModel）與 debug 測試（AiFourPlayersToTerminationTest）
 * 在「定位節點/套表單/選 activation」這段邏輯完全一致。
 */
class AiUiFlow {
  public static function applyAiDecision(
    match:IGameMatch,
    actor:IPlayer,
    d:AiDecision,
    apply:(node:IPlayerMenuNode, entry:IPlayerMenuEntry) -> Void
  ):Bool {
    var menu:IPlayerMenu = match.createPlayerMenu(actor);
    var node = resolveNodeByPath(menu.rootNodes(), d.nodePath);
    if (node == null) {
      return false;
    }

    // 先套用表單 patch（若有）
    if (d.widgetPatches != null) {
      for (p in d.widgetPatches)
        applyWidgetPatch(node, p);
    }

    // activationEntry（表單內 Button 或 leaf）
    var entry:Null<IPlayerMenuEntry> = null;
    if (d.activation != null) {
      entry = findEntryOnNode(node, d.activation.kind, d.activation.decisionToken);
    } else {
      entry = node.leaf();
    }
    if (entry == null) {
      return false;
    }

    node.setActivationEntry(entry);
    apply(node, entry);
    return true;
  }

  public static function ackAllPopups(match:IGameMatch, monarchId:MonarchId):Void {
    var xs = match.pendingPopups(monarchId);
    if (xs == null || xs.length == 0)
      return;
    for (p in xs)
      match.ackPopup(monarchId, p.id());
  }

  public static function ackAllAnimations(match:IGameMatch, monarchId:MonarchId):Void {
    var xs = match.pendingAnimations(monarchId);
    if (xs == null || xs.length == 0)
      return;
    for (a in xs)
      match.ackAnimation(monarchId, a.id());
  }

  public static function ackAllOutbox(match:IGameMatch, monarchId:MonarchId):Void {
    var xs = match.pendingOutbox(monarchId);
    if (xs == null || xs.length == 0)
      return;
    for (m in xs)
      match.ackOutbox(monarchId, m.id());
  }

  static function resolveNodeByPath(roots:Array<IPlayerMenuNode>, path:Array<Int>):Null<IPlayerMenuNode> {
    if (path == null || path.length == 0)
      return null;
    var cur:Null<IPlayerMenuNode> = null;
    var kids = roots;
    for (i in 0...path.length) {
      var idx = path[i];
      if (kids == null || idx < 0 || idx >= kids.length)
        return null;
      cur = kids[idx];
      kids = cur.children();
    }
    return cur;
  }

  static function findEntryOnNode(node:IPlayerMenuNode, kind:game.PlayerMenuKind, tok:Null<String>):Null<IPlayerMenuEntry> {
    var leaf = node.leaf();
    if (leaf != null && leaf.kind() == kind && (tok == null || leaf.decisionToken() == tok))
      return leaf;
    var ws = node.formWidgets();
    if (ws != null)
      for (w in ws)
        switch w {
          case Button(e):
            if (e.kind() == kind && (tok == null || e.decisionToken() == tok))
              return e;
          default:
        }
    return null;
  }

  static function applyWidgetPatch(node:IPlayerMenuNode, p:game.AiWidgetPatch):Void {
    switch p {
      case SetSlider(widgetIndex, value):
        applySliderToNode(node, widgetIndex, value);
      case SetGeneralMultiPick(widgetIndex, ids):
        applyGeneralMultiPickToNode(node, widgetIndex, ids);
      case SetMonarchSinglePick(widgetIndex, ids):
        applyMonarchSinglePickToNode(node, widgetIndex, ids);
      case SetTileSinglePick(widgetIndex, idxs):
        applyTileSinglePickToNode(node, widgetIndex, idxs);
    }
  }

  static function applySliderToNode(node:IPlayerMenuNode, widgetIndex:Int, value:Int):Void {
    var widgets = node.formWidgets();
    if (widgets == null || widgetIndex < 0 || widgetIndex >= widgets.length)
      return;
    switch widgets[widgetIndex] {
      case Slider(lbl, min, max, step, _):
        widgets[widgetIndex] = Slider(lbl, min, max, step, value);
      default:
    }
  }

  static function applyGeneralMultiPickToNode(node:IPlayerMenuNode, widgetIndex:Int, selectedGeneralIds:Array<String>):Void {
    var widgets = node.formWidgets();
    if (widgets == null || widgetIndex < 0 || widgetIndex >= widgets.length)
      return;
    switch widgets[widgetIndex] {
      case GeneralMultiPick(lbl, choices, _):
        widgets[widgetIndex] = GeneralMultiPick(lbl, choices, selectedGeneralIds.copy());
      default:
    }
  }

  static function applyMonarchSinglePickToNode(node:IPlayerMenuNode, widgetIndex:Int, selectedMonarchIds:Array<String>):Void {
    var widgets = node.formWidgets();
    if (widgets == null || widgetIndex < 0 || widgetIndex >= widgets.length)
      return;
    switch widgets[widgetIndex] {
      case MonarchSinglePick(lbl, choices, _):
        widgets[widgetIndex] = MonarchSinglePick(lbl, choices, selectedMonarchIds.copy());
      default:
    }
  }

  static function applyTileSinglePickToNode(node:IPlayerMenuNode, widgetIndex:Int, selectedTileIndexes:Array<Int>):Void {
    var widgets = node.formWidgets();
    if (widgets == null || widgetIndex < 0 || widgetIndex >= widgets.length)
      return;
    switch widgets[widgetIndex] {
      case TileSinglePick(lbl, choices, _):
        widgets[widgetIndex] = TileSinglePick(lbl, choices, selectedTileIndexes.copy());
      default:
    }
  }
}

