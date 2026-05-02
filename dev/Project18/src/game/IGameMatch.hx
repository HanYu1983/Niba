package game;

import game.GameIds;
import game.IJiCe;
import game.IPlayer;
import game.ITileEvent;
import game.IPlayerMenu;
import game.IPlayerMenuEntry;
import game.IJiCeStagingPreviewRow;
import game.IBoard;
import game.ITile;
import game.TileKind;
import game.IGeneral;
import game.IMonarch;
import game.IPlayerMenuNode;
import game.PlayerMenuKind;

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
interface IGameMatch {
    /** 環狀棋盤本體。 */
    function board():IBoard;

    /**
     * 四位君主；陣列順序應與 seat 遞增一致或以契約另行說明。
     * monarchs().length 之設計語意為 4。
     */
    function monarchs():Array<IMonarch>;

    /** 當前具行動權之君主。 */
    function activeMonarch():IMonarch;

    /**
     * 指定君主當下可打出的计策視圖。
     * 手牌上限、共用牌庫或冷卻堆疊由實作模型補充。
     */
    function availableJiCe(monarchId:MonarchId):Array<IJiCe>;

    /**
     * 依資料鍵建立計策實例；{@code ownerMonarchId} 為持有／所屬君主（牌組歸屬），實作可據此校驗。
     * 未支援之鍵應拋錯。
     */
    function createJiCe(key:JiCeKey, ownerMonarchId:MonarchId):IJiCe;

    /**
     * 行動切片是否已到「可收束」狀態（例如移動並完成踩點結算後為 true）。
     * 典型用途：為 true 時主選單才出現「結束／確認」類葉節點；為 false 時僅允許進行中指令（移動、計策等）。
     * 選擇 ConfirmDone 並 apply 後，實作應清回 false，以便下一回合切片重新計算。
     */
    function isActivePlayerSliceComplete():Bool;

    /** 踩點後待結算之事件腳本；無則 null。 */
    function pendingTileEvent():Null<ITileEvent>;

    /**
     * 計策打出後尚待 resolveChoice 之腳本；非 null 時 createPlayerMenu 應委派 pendingJiCe.buildPlayerMenu(actor)。
     */
    function pendingJiCe():Null<IJiCe>;

    /** 暫存計策所鎖定之目標君主；僅於 pendingJiCe 非 null 時有效。 */
    function jiCeStagingTargetMonarchId():Null<MonarchId>;

    /** 與暫存計策對應之武將選項預覽；無暫存時為空陣列。 */
    function jiCeStagingPreviewRows():Array<IJiCeStagingPreviewRow>;

    /**
     * IJiCe.applyAgainstMonarch 實作呼叫：設 pendingJiCe、目標君主與預覽列。
     */
    function enterJiCeStaging(card:IJiCe, targetMonarchId:MonarchId, previewRows:Array<IJiCeStagingPreviewRow>):Void;

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

    /** 巢狀選單節點。 */
    function createPlayerMenuNode(caption:String, leaf:Null<IPlayerMenuEntry>, children:Array<IPlayerMenuNode>):IPlayerMenuNode;

    /**
     * 依當前賽局×操作者建立主選單快照（移動／計策／狀態／確認等）。
     * 賽局狀態變更後須重新呼叫，不得假定與賽局隱式同步。
     */
    function createPlayerMenu(actor:IPlayer):IPlayerMenu;

    /**
     * 對本局賽局結算選單葉節點（移動、計策、狀態、確認等），並視規剘修改棋子／兵力／切片旗標等。
     */
    function applyMenuLeaf(actor:IPlayer, leaf:IPlayerMenuEntry, ?playedJiCe:IJiCe, ?jiCeTargetMonarchId:MonarchId):Void;
}
