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
import game.MenuClientConfirm;
import game.IGameMatchGetter;
import game.CityLevel;
import game.PopupPayload;
import game.TerrainKind;
import game.TileGrowth;

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
    // NOTE(num-algo): docs/數值算法.md 落地追蹤（介面層缺口/未實作規則清單）
    // - §1.0 格子類型出現概率：尚未有「依概率生成 TileKind」的正式 API/規則入口（目前多由關卡或測試直接 createTile）。
    // - §2 搶奪機率算法：缺「搶奪戰鬥」的正式流程/結算 API（包含隨機係數 0.85~1.15、資源獲取比例、不改變所有權等）。
    // - §3 攻占機率算法：目前攻城/攻占仍有大量骨架（隨機係數、友好度/城防/駐將參與、掠奪/資源處理等）。
    // - §6.1 資源成長算法：目前採 ver1 growth 模型；未完全按文件的地形係數表/等級係數/政治加成公式統一。
    // - §7 聲望算法：目前僅零星效果（起點獎勵分段、部分價格微調、計策影響），未形成完整規則與結算點。
    // - §8~§10 裝備/武將生成/功績職位：多為骨架或尚未形成可驗證的規則/資料表。
    //
    // TODO(num-algo backlog): 依 docs/數值算法.md 逐章補齊（可用於規劃下一批）
    // - §1.0：把「依機率生成 TileKind」升級成正式開局/關卡共用 API（不只單一 LevelKeys 測試關卡）。
    // - §1.3：難度（簡單/普通/困難）對應初始資源的統一入口（目前多落在各關卡配置）。
    // - §2：將「搶奪」從 hostile city settlement 的內嵌實作，抽成可重用的正式流程（含預覽勝率 API）。
    // - §3：補齊完整攻城/攻占流程（投入兵力指定、守方全投入、友好度修正、易主、掠奪 30%、失敗 -10 friendly 等）。
    // - §4.3：文件提到「失敗 0 或 25%」但未列策略類型表；待補齊資料表後可由規格表驅動（目前 ver1 以 key 白名單）。
    // - §6.1：地形係數（GDD 2.1.7）與成長表（§12）目前混用；待統一為單一來源（terrain→係數/成長）。
    // - §7.2：商店價格與聲望規則文件缺失（目前為 ver1 placeholder）；待補規格後對齊。
    // - §8.3：價格公式含「稀有度係數」的明確數值尚未定義（目前以 tier+bonus 線性化），待規格表化。
    // - §11：規避成功後「減半/無效」需依事件類型細分；目前僅 multiplier 機制，待把事件效果分類並加測。
    //
    // TODO(strategy-system/doc-missing): docs/策略系統.md 尚未明確定義（目前只能做 ver1 假設/占位）
    // - 事件解鎖策略：文件提「特殊事件解鎖」，但缺「哪個事件→解鎖哪些策略」與解鎖持久性/是否可重複等資料表。
    // - Buff/效果生命週期細則：
    //   - 激勵（NextCommandMultiplier）是否只作用於「下一次哪類指令」（移動/策略/交易/開發/戰鬥…）與結束時機。
    //   - 覺醒（TempStatBoost turns=1）的「turns」扣減點（回合末？輪到自己時？執行一次指令後？）缺明確規格。
    // - 築城的「防禦力」定義：文件只說提升防禦力，未給「加成幅度/疊加/持續回合數」與其在戰鬥公式中的確切位置。
    // - 「敵方領地」的精確定義：空城/無主村落/未歸順村落（友好度）是否算敵方？文件未明確。
    //
    // TODO(strategy-system/code-misaligned): docs/策略系統.md 已描述但代碼仍未完全對齊（或僅骨架）
    // - Buff/效果生命週期未落地：
    //   - 激勵 NextCommandMultiplier：目前有寫入 effect，但缺「觸發一次後移除」的結算點。
    //   - 覺醒 TempStatBoost(turns=1)：目前缺「回合推進時 turns 遞減」機制（可能變成永久）。
    // - 築城防禦加成未完整接入戰鬥：
    //   - `FortifyJiCe` 寫入 `_tileDefenseBonus`，但該值尚未在主要攻城/防禦戰力計算中完整使用（僅存放）。
    // - 策略卡清單缺項：
    //   - docs 範例提到「潛入」「開發（作為策略範例）」等，但目前無對應 `JiCe` 實作或未納入策略系統。
    //
    // TODO(equipment-system/doc-missing): docs/裝備系統.md 尚未明確定義（目前只能做 ver1 假設/占位）
    // - 商店商品生成細則：
    //   - 「遊戲進度」的正式指標（round? 回合數? 勝利進度?）與權重表目前未給定。
    //   - 「玩家聲望」如何影響稀有度/價格的精確公式未給定（目前為保守的 ver1 權重/價格微調）。
    // - 價格體系：
    //   - 文件只有「低/中/高/極高」區間描述，缺稀有度係數與基礎價格表。
    //   - 「價格 = 基礎價格 × 稀有度係數 × (1 + 屬性浮動比例)」中各係數的明確數值缺失。
    // - 其他獲取途徑資料表：
    //   - 事件獎勵（如天降神兵）對應哪些裝備/稀有度/抽樣權重未定義。
    //   - 攻占掠奪是否會掉落裝備、掉落規則與機率未定義。
    //   - 武將初始攜帶裝備的配置規則未定義。
    // - 忠誠度影響：
    //   - 文件列出「挖角難度/成功率/叛逃機率」但缺具體公式與結算點。
    //
    // TODO(equipment-system/code-misaligned): docs/裝備系統.md 已描述但代碼仍未完全對齊（或僅骨架）
    // - 商店格商品數量 3~5：已做，但「刷新時機/是否每次踩到都重抽/同回合購買後是否補貨」尚未形成明確規則。
    // - 程序化生成：已做到「依進度+聲望抽稀有度→依類型挑模板→±10% 浮動」，但仍缺：
    //   - 價格公式對齊（目前為 tier+bonus 線性，未完全照文件公式與稀有度係數）。
    // - 其他獲取途徑尚未接入：
    //   - 事件獎勵掉落裝備（目前事件系統未接裝備掉落）。
    //   - 攻占掠奪掉落裝備（目前攻占只處理資源掠奪）。
    // - 忠誠度影響尚未落地：目前裝備會加忠誠，但忠誠尚未實際影響挖角/成功率/叛逃機率。

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
     * 除錯／測試：直接設定回合數（用於終局/時限勝利等情境的快速建局）。
     * round 必須 >= 1。
     */
    function forceSetRoundNumber(round:Int):Void;

    /** 除錯／測試：直接增加君主糧食（n 必須 >= 0）。 */
    function forceGrantMonarchGrain(monarchId:MonarchId, n:Int):Void;

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

    /** 除錯／測試：直接寫入城池格金錢儲備。 */
    function forcePutCityStoredGold(at:TileIndex, gold:Int):Void;

    /** 除錯／測試：直接寫入城池等級。 */
    function forceSetCityLevel(at:TileIndex, level:CityLevel):Void;

    /** 除錯／測試：直接寫入村落對玩家友好度（0~100）。 */
    function forceSetVillageFriendly(at:TileIndex, monarchId:MonarchId, friendly:Int):Void;

    /** 除錯／測試：直接寫入村落屬主（無屬主語意請傳 null）。 */
    function forceSetVillageOwner(at:TileIndex, ownerMonarchId:Null<MonarchId>):Void;

    /** 除錯／測試：直接寫入村落領地資源庫（兵/糧/金）。 */
    function forcePutVillageStores(at:TileIndex, troops:Int, grain:Int, gold:Int):Void;

    /** 除錯／測試：直接寫入村落等級。 */
    function forceSetVillageLevel(at:TileIndex, level:CityLevel):Void;

    /** 除錯／測試：直接寫入格子地形。 */
    function forceSetTileTerrain(at:TileIndex, terrain:TerrainKind):Void;

    /** 除錯／測試：直接寫入格子成長率（增量）。 */
    function forceSetTileGrowth(at:TileIndex, growth:TileGrowth):Void;

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
    function createPlayerMenuEntry(kind:PlayerMenuKind, caption:String, enabled:Bool, ?decisionToken:String, ?clientConfirm:MenuClientConfirm):IPlayerMenuEntry;

    /** 巢狀選單節點；{@code formWidgets} 非空時為表單語意節點。 */
    function createPlayerMenuNode(caption:String, leaf:Null<IPlayerMenuEntry>, children:Array<IPlayerMenuNode>, ?formWidgets:Array<MenuFormWidget>):IPlayerMenuNode;

    /**
     * 對本局賽局結算 **選單節點**（移動、計策、表單送出等），並視規剘修改棋子／兵力／切片旗標等。
     * 表單節點須已就地更新 {@link IPlayerMenuNode#formWidgets} 內之取值；多 {@link MenuFormWidget.Button} 時須 {@link IPlayerMenuNode#setActivationEntry}；結算後清空 {@link IPlayerMenuNode#setActivationEntry}。
     */
    function applyMenuLeaf(actor:IPlayer, menuNode:IPlayerMenuNode):Void;

    /**
     * docs/玩家指令.md §8：將結果／事件類訊息寫入該君主之彈窗 outbox（由 view 顯示並 ack）。
     * {@code ctxKey} 供辨識來源；實際 popup id 仍含回合序與流水號。
     */
    function pushInfoPopup(monarchId:MonarchId, title:String, payload:PopupPayload, ctxKey:String):Void;
}
