package game;

import game.GameIds;
import game.MenuFormWidget;
import game.IJiCe;
import game.IPlayer;
import game.ITileEvent;
import game.IPlayerMenu;
import game.IPlayerMenuEntry;
import game.IJiCeMovementStepHook;
import game.IJiCeStagingPreviewRow;
import game.IBoard;
import game.ITile;
import game.TileKind;
import game.IGeneral;
import game.IMonarch;
import game.IPlayerMenuNode;
import game.PlayerMenuKind;
import game.IGameMatchGetter;

/**
 * GDD：一局對戲之頂層聚合視角（類大富翁踩點行軍）。
 *
 * 設計常量（由規剘保證，非程式常數強制）：
 * - 玩家（君主）數為 4。
 * - 開局每位君主麾下武將數為三。
 * - 每名武將暴露 4 個數值維度（見 GeneralStat）。
 * - 棋盤格子語意類型見 TileKind（含 Event 與 ITileEvent 綁定）。
 * - 計策為君主可持有／打出的規剘物件（見 IJiCe），與格子 Scheme 類可交聯。
 *
 * 查詢與狀態讀取由此介面暴露；選單快照（createPlayerMenu）與 **會改變賽局內容** 之結算（applyMenuLeaf）皆屬本介面。
 * 零件工廠（createTile／createBoard／…）於取得賽局後由此介面提供，與關卡組立解耦。
 */
interface IGameMatch extends IGameMatchGetter {
    /**
     * 依資料鍵建立計策實例；{@code ownerMonarchId} 為持有／所屬君主（牌組歸屬），實作可據此校驗。
     * 未支援之鍵應拋錯。
     */
    function createJiCe(key:JiCeKey, ownerMonarchId:MonarchId):IJiCe;

    /** 除錯／測試／擴充：登錄移動逐步勾子（同一實例重複登錄應為 no-op）。 */
    function forceRegisterMovementStepHook(h:IJiCeMovementStepHook):Void;

    /** 除錯／測試／擴充：移除先前登錄之勾子。 */
    function forceUnregisterMovementStepHook(h:IJiCeMovementStepHook):Void;

    /** 除錯／測試：固定每次移動骰點（設為 null 代表恢復隨機）。 */
    function forceSetFixedMoveDelta(delta:Null<Int>):Void;

    /**
     * 除錯／測試／關卡組立：將事件腳本綁至環上索引（生產流程可改由劇本載入呼叫）。
     */
    function forceBindTileEvent(at:TileIndex, handler:ITileEvent):Void;

    /** 除錯／測試：進入計策暫存。 */
    function forceEnterJiCeStaging(card:IJiCe):Void;

    /** 除錯／測試：標記城池格已有武將駐守（非空城）；供分支測試用。 */
    function forceAssignCityGarrison(at:TileIndex, generalId:GeneralId):Void;

    /**
     * 除錯／測試：標記城池格所屬君主；與 {@link #activeMonarch} 相符且踩中該城時進入我方拜訪選單。
     */
    function forceSetCityOwner(at:TileIndex, ownerMonarchId:MonarchId):Void;

    /** 除錯／測試：直接寫入城池格儲備（兵力／糧食）。 */
    function forcePutCityStores(at:TileIndex, troops:Int, grain:Int):Void;

    /** 單格；多格按索引有序組裝後再交由 createBoard。 */
    function createTile(index:TileIndex, kind:TileKind):ITile;

    /** 環狀棋盤；陣列順序即環上行走順序，長度為環長。 */
    function createBoard(tiles:Array<ITile>):IBoard;

    /**
     * 武將四維一次性注入（對應 GeneralStat 列舉順序之語意：統／勇／智／政）。
     * 實作須將武將登錄至 {@code owner} 對應君主之麾下 roster。
     */
    function createGeneral(id:GeneralId, owner:MonarchId, command:Int, might:Int, wit:Int, stewardship:Int):IGeneral;

    /**
     * 君主；麾下武將須另行 {@link #createGeneral} 登錄。
     * 兵力／糧食可選；未傳時由實作預設。實作可於組局時將君主登錄入本局（如 ver1 以首次登錄者為當前行動方）。
     */
    function createMonarch(id:MonarchId, seat:Int, pawnIndex:TileIndex, ?troops:Int, ?grain:Int):IMonarch;

    /** 玩家視角物件；每位人類／AI 控制器一個實例，與 monarchId 綁定。 */
    function createPlayer(monarchId:MonarchId, displayName:String):IPlayer;

    /** 單列選單條目；通常由 createPlayerMenu 內部組裝，亦允許模組化注入。 */
    function createPlayerMenuEntry(kind:PlayerMenuKind, caption:String, enabled:Bool, ?decisionToken:String):IPlayerMenuEntry;

    /** 巢狀選單節點；{@code formWidgets} 非空時為表單語意節點。 */
    function createPlayerMenuNode(caption:String, leaf:Null<IPlayerMenuEntry>, children:Array<IPlayerMenuNode>, ?formWidgets:Array<MenuFormWidget>):IPlayerMenuNode;

    /**
     * 對本局賽局結算 **選單節點**（移動、計策、表單送出等），並視規剘修改棋子／兵力／切片旗標等。
     * 表單節點須已就地更新 {@link IPlayerMenuNode#formWidgets} 內之取值；多 {@link MenuFormWidget.Button} 時須 {@link IPlayerMenuNode#setActivationEntry}；結算後清空 {@link IPlayerMenuNode#setActivationEntry}。
     */
    function applyMenuLeaf(actor:IPlayer, menuNode:IPlayerMenuNode):Void;
}
