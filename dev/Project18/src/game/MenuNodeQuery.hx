package game;

import game.PlayerMenuKind.HostileCityAttackerPick;
import game.PlayerMenuKind.TileEventPick;

/** 依選單結構尋節點（測試／UI 共用）。 */
class MenuNodeQuery {
  public static function requireNodeWithKind(menu:IPlayerMenu, kind:PlayerMenuKind):IPlayerMenuNode {
    var n = findNodeWithKind(menu.rootNodes(), kind);
    if (n == null)
      throw 'MenuNodeQuery: 缺少 PlayerMenuKind $kind 所屬節點';
    return n;
  }

  public static function findNodeWithKind(nodes:Array<IPlayerMenuNode>, kind:PlayerMenuKind):Null<IPlayerMenuNode> {
    for (n in nodes) {
      var L = n.leaf();
      if (L != null && L.kind() == kind)
        return n;
      for (w in n.formWidgets())
        switch w {
          case Button(e):
            if (e.kind() == kind)
              return n;
          case Slider(_, _, _, _, _):
          case GeneralMultiPick(_, _, _):
        }
      var inner = findNodeWithKind(n.children(), kind);
      if (inner != null)
        return inner;
    }
    return null;
  }

  /** 敵城對峙攻方選項：{@link HostileCityAttackerPick} 且 decisionToken 相符之節點（表單內 Button）。 */
  public static function requireNodeWithHostileAttackerPickToken(menu:IPlayerMenu, decisionToken:String):IPlayerMenuNode {
    var n = findNodeWithHostileAttackerPickToken(menu.rootNodes(), decisionToken);
    if (n == null)
      throw 'MenuNodeQuery: 缺少 HostileCityAttackerPick decisionToken="$decisionToken" 之節點';
    return n;
  }

  static function findNodeWithHostileAttackerPickToken(nodes:Array<IPlayerMenuNode>, decisionToken:String):Null<IPlayerMenuNode> {
    for (n in nodes) {
      for (w in n.formWidgets())
        switch w {
          case Button(e):
            if (e.kind() == HostileCityAttackerPick && e.decisionToken() == decisionToken)
              return n;
          case Slider(_, _, _, _, _):
          case GeneralMultiPick(_, _, _):
        }
      var inner = findNodeWithHostileAttackerPickToken(n.children(), decisionToken);
      if (inner != null)
        return inner;
    }
    return null;
  }

  public static function requireNodeWithTilePickToken(menu:IPlayerMenu, decisionToken:String):IPlayerMenuNode {
    var n = findNodeWithTilePickToken(menu.rootNodes(), decisionToken);
    if (n == null)
      throw 'MenuNodeQuery: 缺少 TileEventPick decisionToken="$decisionToken" 之節點';
    return n;
  }

  static function findNodeWithTilePickToken(nodes:Array<IPlayerMenuNode>, decisionToken:String):Null<IPlayerMenuNode> {
    for (n in nodes) {
      var L = n.leaf();
      if (L != null && L.kind() == TileEventPick && L.decisionToken() == decisionToken)
        return n;
      for (w in n.formWidgets())
        switch w {
          case Button(e):
            if (e.kind() == TileEventPick && e.decisionToken() == decisionToken)
              return n;
          case Slider(_, _, _, _, _):
          case GeneralMultiPick(_, _, _):
        }
      var inner = findNodeWithTilePickToken(n.children(), decisionToken);
      if (inner != null)
        return inner;
    }
    return null;
  }

  /** 表單內依 {@link PlayerMenuKind} 取出 Button 所載之 {@link IPlayerMenuEntry}。 */
  public static function buttonEntryOnNode(node:IPlayerMenuNode, kind:PlayerMenuKind):Null<IPlayerMenuEntry> {
    for (w in node.formWidgets())
      switch w {
        case Button(e):
          if (e.kind() == kind)
            return e;
        case Slider(_, _, _, _, _):
        case GeneralMultiPick(_, _, _):
      }
    return null;
  }
}
