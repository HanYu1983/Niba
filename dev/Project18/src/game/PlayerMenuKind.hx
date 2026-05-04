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

    /** 狀態：君主、武將、資源與格子資訊之唯讀總覽。 */
    Status;

    /**
     * 完成當前選單輪詢／確認無進一步指令。
     * 是否等同結束回合由規剘／IGameMatch 實作約定（例如僅於切片完成後可用）。
     */
    ConfirmDone;

    /** 踩點事件之分支持選；機械鍵見 IPlayerMenuEntry.decisionToken。 */
    TileEventPick;

    /** 計策暫存：確認選將（複選寫入葉 {@link IPlayerMenuEntry#setFormStringListFields}，鍵 {@link MenuFieldIds.JiCeStagingGenerals}）。 */
    JiCeStagingSubmit;

    /** 空城進駐：同表單內複選駐將＋資源滑桿（數值／駐將列表寫入葉 {@link IPlayerMenuEntry#setFormNumericFields}／{@link IPlayerMenuEntry#setFormStringListFields}）。 */
    EmptyCityOccupySubmit;

    /** 空城進駐：取消進駐。 */
    EmptyCityOccupyAbort;

    /** 我方城池拜訪：調度表單內確認（滑桿數值寫入葉 {@link IPlayerMenuEntry#setFormNumericFields}），不結束拜訪。 */
    FriendlyCityDispatchApply;

    /** 我方城池拜訪：結束拜訪並關閉持續選單。 */
    FriendlyCityVisitEnd;
}
