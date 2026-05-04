package debug_ver1;

import game.IPlayerMenu;
import game.IPlayerMenuNode;
import game.MenuNodeQuery;
import game.PlayerMenuKind.JiCeStagingSubmit;

/** 測試／除錯：計策暫存確認節點（{@link JiCeStagingSubmit}）。 */
class PlayerMenuFind {
  public static function findJiCeStagingSubmitNode(menu:IPlayerMenu):IPlayerMenuNode {
    return MenuNodeQuery.requireNodeWithKind(menu, JiCeStagingSubmit);
  }
}
