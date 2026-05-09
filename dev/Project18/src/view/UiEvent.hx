package view;

import game.GameIds;
import game.IPlayerMenuEntry;
import game.IPlayerMenuNode;
import game.PlayerMenuKind;

/**
 * UI 事件（由 view/html 元件發送；由上層流程或 ViewModel/Controller 訂閱處理）。
 *
 * 統一入口：EventCenter.eventSubject。
 */
enum UiEvent {
  /** 點擊格子（棋盤索引）。 */
  TileClick(index:TileIndex);

  /** 點擊玩家/君主。 */
  PlayerClick(monarchId:MonarchId);

  /** 點擊選單項目（帶入 node 與 entry；entry.kind/decisionToken 由 entry 提供）。 */
  MenuClick(node:IPlayerMenuNode, entry:IPlayerMenuEntry);

  /** AI：執行一步（查詢 menu → 填表/選 leaf → apply）；是否為 AI 席位由 {@link IPlayer#isAi}／組局標記決定。 */
  AiStep;

  /** 調整 Slider：帶入 node 與 widgetIndex，並提供新值。 */
  Slider(node:IPlayerMenuNode, widgetIndex:Int, value:Int);

  /** 更新 GeneralMultiPick：帶入 node 與 widgetIndex，並提供新的 selectedGeneralIds。 */
  GeneralMultiPick(node:IPlayerMenuNode, widgetIndex:Int, selectedGeneralIds:Array<String>);

  /** 更新 MonarchSinglePick：帶入 node 與 widgetIndex，並提供新的 selectedMonarchIds（約定單選）。 */
  MonarchSinglePick(node:IPlayerMenuNode, widgetIndex:Int, selectedMonarchIds:Array<String>);

  /** 更新 TileSinglePick：帶入 node 與 widgetIndex，並提供新的 selectedTileIndexes（約定單選）。 */
  TileSinglePick(node:IPlayerMenuNode, widgetIndex:Int, selectedTileIndexes:Array<Int>);

  /**
   * 系統→UI：提示 popup view 重新讀取 pendingPopups 並顯示（若有）。
   * （由 ViewModel 在 apply 後觸發）
   */
  PopupRefresh;

  /** 系統→UI：提示 animation view 重新讀取 pendingAnimations 並播放（若有）。 */
  AnimationRefresh;

  /** 系統→UI：提示 outbox view 重新讀取 pendingOutbox 並處理（若有）。 */
  OutboxRefresh;

  /**
   * UI→系統：使用者關閉某筆 popup（由 ViewModel 執行 ackPopup）。
   */
  PopupClose(popupId:String);
}

