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

    /** 選將暫存期選項：機械鍵常為 GeneralId（計策 pendingJiCe，或格子事件 tileEventStagingPreviewRows）。 */
    JiCePick;
}
