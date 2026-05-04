package game;

/**
 * GDD：回合制之「當下可顯示選單」快照。
 *
 * 建構規剘：須以唯讀之 IGameMatch 與操作者 IPlayer（通常即 activeMonarch 所屬玩家）
 * 決定列舉內容；賽局狀態變更後應重新向 IGameMatch.createPlayerMenu 索取，不假定本物件隱式同步。
 * 玩家選定選單節點（含 {@link IPlayerMenuNode#activationEntry} 所指按鈕）後，賽局突變一律經 {@link IGameMatch#applyMenuLeaf} 統一結算。
 */
interface IPlayerMenu {
    /** 選單所服務之玩家（檢視者）。 */
    function forPlayer():IPlayer;

    /** 建構當下作為輸入之賽局切片關聯（實作可用 match 版本碼或回合序標記）。 */
    function matchContextId():String;

    /** 巢狀根節點樹林；語意來源以此為準。 */
    function rootNodes():Array<IPlayerMenuNode>;

    /**
     * 扁平投影（含傳統葉節點與 {@link IPlayerMenuNode#formWidgets} 內 {@link MenuFormWidget.Button}），
     * 供簡易清單 UI 或舊邏輯走訪；順序為前序深優先後再接該節點之表單按鈕。
     */
    function entries():Array<IPlayerMenuEntry>;
}
