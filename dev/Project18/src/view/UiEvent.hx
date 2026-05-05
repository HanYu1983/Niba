package view;

import game.GameIds;
import game.PlayerMenuKind;

/**
 * UI 事件（由 view/html 元件發送；由上層流程或 ViewModel/Controller 訂閱處理）。
 *
 * 統一入口：EventCenter.onEventSubject。
 */
enum UiEvent {
  /** 點擊格子（棋盤索引）。 */
  TileClick(index:TileIndex);

  /** 點擊玩家/君主。 */
  PlayerClick(monarchId:MonarchId);

  /** 點擊選單項目（kind + 可選 decisionToken）。 */
  MenuClick(kind:PlayerMenuKind, decisionToken:Null<String>);

  /** 調整 Slider（以 id 辨識 + value）。 */
  Slider(id:String, value:Int);
}

