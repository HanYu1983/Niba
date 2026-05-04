package game;

import game.GameIds;
import game.IPlayer;
import game.IPlayerMenu;
import game.IPlayerMenuNode;

/**
 * GDD：計策為君主可操作之規剘資源。
 *
 * - resolveChoice：傳入暫存選將 **節點**（widgets 已更新；施計武將見其中 {@link MenuFormWidget.GeneralMultiPick}）。
 */
interface IJiCe {
    function designLabel():String;

    function registryKey():String;

    function applyAgainstMonarch(actor:IPlayer, targetMonarchId:MonarchId):Void;

    function buildPlayerMenu(actor:IPlayer):IPlayerMenu;

    function resolveChoice(actor:IPlayer, menuNode:IPlayerMenuNode):Void;
}
