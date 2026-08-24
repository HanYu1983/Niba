package debug_ver1;

import game.IPlayerMenu;
import game.IPlayerMenuNode;
import game.MenuNodeQuery;
import game.PlayerMenuKind.StagingSubmit;

/** 測試／除錯：暫存提交節點（目前計策/休整皆用 {@link StagingSubmit}）。 */
class PlayerMenuFind {
  public static function findStagingSubmitNode(menu:IPlayerMenu):IPlayerMenuNode {
    return MenuNodeQuery.requireNodeWithKind(menu, StagingSubmit);
  }
}
