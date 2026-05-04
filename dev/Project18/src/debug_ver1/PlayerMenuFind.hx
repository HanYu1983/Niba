package debug_ver1;

import game.IPlayerMenu;
import game.IPlayerMenuEntry;
import game.IPlayerMenuNode;
import game.MenuFormWidget;
import game.PlayerMenuKind;

/** 測試／除錯：計策暫存確認葉（{@link PlayerMenuKind.JiCeStagingSubmit}）。 */
class PlayerMenuFind {
  public static function findJiCeStagingSubmitLeaf(menu:IPlayerMenu):IPlayerMenuEntry {
    function walk(nodes:Array<IPlayerMenuNode>):Null<IPlayerMenuEntry> {
      for (n in nodes) {
        var L = n.leaf();
        if (L != null && L.kind() == JiCeStagingSubmit)
          return L;
        for (w in n.formWidgets())
          switch w {
            case Button(entry):
              if (entry.kind() == JiCeStagingSubmit)
                return entry;
            case Slider(_, _, _, _, _, _):
            case GeneralMultiPick(_, _, _, _,):
          }
        var h = walk(n.children());
        if (h != null)
          return h;
      }
      return null;
    }
    var found = walk(menu.rootNodes());
    if (found == null)
      throw "PlayerMenuFind: missing JiCeStagingSubmit leaf";
    return found;
  }
}
