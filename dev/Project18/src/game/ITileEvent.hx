package game;

import game.GameIds;
import game.IPlayer;
import game.IPlayerMenu;

/**
 * GDD：踩中事件格後懸置之結算腳本（支線／問卷／多選一等）。
 *
 * 實作通常由 IGameMatch（或其所屬工廠）建立並注入賽局引用，故方法簽名不再傳入 IGameMatch。
 *
 * UI／選單語意對照：
 * - buildPlayerMenu：事件全貌（含是否以 {@link MenuFormWidget.GeneralMultiPick} 組武將複選；鍵見 {@link MenuFieldIds.TileEventGenerals}）。
 * - resolveChoice：機械鍵與選單葉 decisionToken 對齊；若同一節點含複選武將 widget，結算時經 {@code formStringListFields} 傳入選中 id。
 */
interface ITileEvent {
    /** 資料／存檔用之穩定鍵（例如事件表列 id）。 */
    function registryKey():String;

    /** 事件專用之選項選單（可為二選一、三選一或單鍵「執行」葉節點）。根節點集合可直接交給巢狀 UI。 */
    function buildPlayerMenu(actor:IPlayer):IPlayerMenu;

    /**
     * choiceId：與選單葉之 decisionToken（機械鍵）對齊；不含展示文案。
     * {@code formStringListFields}：與同一表單 {@link MenuFormWidget.GeneralMultiPick} 對齊時傳入（鍵 {@link MenuFieldIds.TileEventGenerals}）。
     */
    function resolveChoice(actor:IPlayer, choiceId:String, ?formStringListFields:Map<String, Array<String>>):Void;
}
