package game;

/**
 * GDD：回合內玩家主選單之分流鍵。
 * 是否出現、順序與灰階狀態由 IPlayerMenu 建構時依當前 IGameMatch 快照決定。
 */
enum PlayerMenuKind {
    /** 移動份量決議／路徑確認（含擲骰或計策修正後鎖步）。 */
    Move;

    /** 計策：列出可用 IJiCe 並進入打出流程。 */
    JiCe;

    /** 策略（移動前）：每回合一次。 */
    StrategyPre;

    /** 策略（移動後）：每回合一次，且僅在 pendingLanding 窗口中可用。 */
    StrategyPost;

    /** 移動後落地：繼續進入格子事件/領地/村落分流。 */
    LandingContinue;

    /** 狀態：君主、武將、資源與格子資訊之唯讀總覽。 */
    Status;

    /**
     * 完成當前選單輪詢／確認無進一步指令。
     * 是否等同結束回合由規剘／IGameMatch 實作約定（例如僅於切片完成後可用）。
     */
    ConfirmDone;

    /** 踩點事件之分支持選；機械鍵見 IPlayerMenuEntry.decisionToken。 */
    TileEventPick;

    /** 通用暫存：提交表單並結算（可用於非計策的 staging 指令）。 */
    StagingSubmit;

    /** 休整：選將並回復體力（先以 staging 形式實作）。 */
    Rest;

    /** 村落：交易（示範用 staging 指令，之後會接真正的村落模型）。 */
    VillageTrade;

    /** 村落：攻占（示範用 staging 指令：選將＋選兵 slider → 預覽勝率）。 */
    VillageConquer;

    /** 村落：搶奪（staging：選將 → 預覽成功率 → 提交）。 */
    VillagePlunder;

    /** 村落：結束（不互動直接結束落地階段）。 */
    VillageEndTurn;

    /** 武將格：招募（ver1 骨架：先以彈窗結算並結束落地）。 */
    GeneralRecruit;

    /** 武將格：離開（不招募直接結束落地）。 */
    GeneralEndTurn;

    /** 商店格：購買（ver1 骨架：先以彈窗結算並結束落地）。 */
    ShopBuy;

    /** 商店格：離開（不購買直接結束落地）。 */
    ShopEndTurn;

    /** 空城進駐：同表單內複選駐將＋資源滑桿（數值／駐將列表皆改寫該節點 {@link IPlayerMenuNode#formWidgets}）。 */
    EmptyCityOccupySubmit;

    /** 空城進駐：取消進駐。 */
    EmptyCityOccupyAbort;

    /** 我方城池拜訪：調度表單內確認（滑桿數值改寫該節點 {@link IPlayerMenuNode#formWidgets}），不結束拜訪。 */
    FriendlyCityDispatchApply;

    /** 我方領地：開發（staging：選將 → 預覽成功率 → 提交）。 */
    FriendlyCityDevelop;

    /** 我方領地：休整（staging：選將 → 提交）。 */
    FriendlyCityRest;

    /** 我方城池拜訪：結束拜訪並關閉持續選單。 */
    FriendlyCityVisitEnd;

    /** 敵城對峙：攻方選項（機械鍵見 {@link IPlayerMenuEntry#decisionToken}）。 */
    HostileCityAttackerPick;

    /** 敵城對峙：守方在非單挑攻勢後僅確認結束本段。 */
    HostileCityDefenderAck;

    /** 敵城對峙：守方於攻方選單挑後提交應戰武將。 */
    HostileCityDefenderPickSubmit;

    /** 敵城對峙：攻方確認預算結算文案並結束落地流程。 */
    HostileCitySettlementAck;
}
