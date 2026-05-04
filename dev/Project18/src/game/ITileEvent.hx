package game;

import game.GameIds;
import game.IPlayer;
import game.IPlayerMenu;
import game.IPlayerMenuNode;

/**
 * GDD：踩中事件格後懸置之結算腳本（支線／問卷／多選一等）。
 *
 * UI／選單語意對照：
 * - buildPlayerMenu：事件全貌（含 {@link MenuFormWidget.GeneralMultiPick} 等）。
 * - resolveChoice：傳入玩家送出之 **節點**（{@link IPlayerMenuNode#formWidgets} 已由 UI 更新；機械鍵見 {@link MenuActivation#activatingEntry}）。
 */
interface ITileEvent {
    function registryKey():String;

    function buildPlayerMenu(actor:IPlayer):IPlayerMenu;

    function resolveChoice(actor:IPlayer, menuNode:IPlayerMenuNode):Void;
}
