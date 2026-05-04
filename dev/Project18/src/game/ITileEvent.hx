package game;

import game.GameIds;
import game.IPlayer;
import game.IPlayerMenu;
import game.IPlayerMenuEntry;

/**
 * GDD：踩中事件格後懸置之結算腳本（支線／問卷／多選一等）。
 *
 * 實作通常由 IGameMatch（或其所屬工廠）建立並注入賽局引用，故方法簽名不再傳入 IGameMatch。
 *
 * UI／選單語意對照：
 * - buildPlayerMenu：事件全貌（含是否以 {@link MenuFormWidget.GeneralMultiPick} 組武將複選；鍵見 {@link MenuFieldIds.TileEventGenerals}）。
 * - resolveChoice：傳入玩家所點選之 **選單葉** {@link IPlayerMenuEntry}（與 {@link IGameMatch#applyMenuLeaf} 相同引用語意）；複選武將 id 見該葉 {@link IPlayerMenuEntry#formStringListFields}。
 */
interface ITileEvent {
    /** 資料／存檔用之穩定鍵（例如事件表列 id）。 */
    function registryKey():String;

    /** 事件專用之選項選單（可為二選一、三選一或單鍵「執行」葉節點）。根節點集合可直接交給巢狀 UI。 */
    function buildPlayerMenu(actor:IPlayer):IPlayerMenu;

    /** {@code leaf}：與 {@link IGameMatch#applyMenuLeaf} 所套用者相同之葉（機械鍵見 {@link IPlayerMenuEntry#decisionToken}；複選見 {@link IPlayerMenuEntry#formStringListFields}）。 */
    function resolveChoice(actor:IPlayer, leaf:IPlayerMenuEntry):Void;
}
