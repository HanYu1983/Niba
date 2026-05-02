package debug_ver1;

import game.IPlayerMenu;
import game.IPlayerMenuEntry;
import game.IPlayerMenuNode;
import game.PlayerMenuKind;

/** 測試／除錯用：自巢狀選單找出 JiCePick 葉（機械鍵 = generalId）。 */
class PlayerMenuFind {
  public static function findJiCePickLeaf(menu:IPlayerMenu, generalId:String):IPlayerMenuEntry {
    function walk(nodes:Array<IPlayerMenuNode>):Null<IPlayerMenuEntry> {
      for (n in nodes) {
        var L = n.leaf();
        if (L != null && L.kind() == JiCePick && L.decisionToken() == generalId)
          return L;
        var h = walk(n.children());
        if (h != null)
          return h;
      }
      return null;
    }
    var found = walk(menu.rootNodes());
    if (found == null)
      throw "PlayerMenuFind: missing JiCePick for " + generalId;
    return found;
  }
}
