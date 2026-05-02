package game;

import game.IPlayer;
import game.IPlayerMenu;

/**
 * GDD：踩中事件格後懸置之結算腳本（支線／問卷／多選一等）。
 *
 * 實作通常由 IGameMatch（或其所屬工廠）建立並注入賽局引用，故方法簽名不再傳入 IGameMatch。
 *
 * UI／選單語意對照：
 * - buildPlayerMenu ≒ 「為此事件建立選項選單」（常見命名 createMenu）。
 * - resolveChoice ≒ 「玩家選定機械鍵後套用規剘」（機械鍵與選單葉 decisionToken 對齊）。
 */
interface ITileEvent {
    /** 資料／存檔用之穩定鍵（例如事件表列 id）。 */
    function registryKey():String;

    /** 事件專用之選項選單（可為二選一、三選一或單鍵「執行」葉節點）。根節點集合可直接交給巢狀 UI。 */
    function buildPlayerMenu(actor:IPlayer):IPlayerMenu;

    /**
     * choiceId：與選單葉之 decisionToken（機械鍵）對齊；不含展示文案。
     */
    function resolveChoice(actor:IPlayer, choiceId:String):Void;
}
