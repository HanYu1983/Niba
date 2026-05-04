package game;

import game.GameIds;
import game.IPlayerMenuEntry;

/**
 * GDD：計策為君主可操作之規剘資源；打出時機由規剘／賽局狀態約定。
 *
 * 實作通常由賽局／工廠建立並持有 IGameMatch 引用；介面方法不再傳入 match，以免膨脹 IGameMatch 契約負擔。
 *
 * - applyAgainstMonarch：對目標君主進入「暫存／待選」態（通常經 enterJiCeStaging）。
 * - buildPlayerMenu：暫存期中組裝後續選單。
 * - resolveChoice：傳入玩家所點選之選單葉（與 {@link IGameMatch#applyMenuLeaf} 相同引用語意），暫存選將時附 {@code formStringListFields}（鍵 {@link MenuFieldIds.JiCeStagingGenerals}）；結算後由 match.applyMenuLeaf 清除計策暫存。
 */
interface IJiCe {
    /** 規剘／版本無關之設計顯示名（本地化由此向上委派）。 */
    function designLabel():String;

    /** 資料／存檔／UI 上下文用之穩定鍵（例如計策表 id）。 */
    function registryKey():String;

    /** 打出本計策並對 targetMonarchId 進入暫存態（尚未套用對守方之最終結算）。 */
    function applyAgainstMonarch(actor:IPlayer, targetMonarchId:MonarchId):Void;

    /** 暫存期中組裝後續選單（賽局內暫存之計策須為 this）。 */
    function buildPlayerMenu(actor:IPlayer):IPlayerMenu;

    /**
     * {@code leaf}：通常為 {@link PlayerMenuKind.JiCeStagingSubmit}（機械鍵見 {@link IPlayerMenuEntry#decisionToken}）。
     * {@code formStringListFields}：與 {@link MenuFormWidget.GeneralMultiPick} 鍵 {@link MenuFieldIds.JiCeStagingGenerals} 對齊。
     */
    function resolveChoice(actor:IPlayer, leaf:IPlayerMenuEntry, ?formStringListFields:Map<String, Array<String>>):Void;
}
