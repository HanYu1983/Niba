package view;

import game.GameIds;
import game.IPlayerMenuEntry;
import game.IPlayerMenuNode;
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

  /** 點擊選單項目（帶入 node 與 entry；entry.kind/decisionToken 由 entry 提供）。 */
  MenuClick(node:IPlayerMenuNode, entry:IPlayerMenuEntry);

  /** 調整 Slider：帶入 node 與 widgetIndex，並提供新值。 */
  Slider(node:IPlayerMenuNode, widgetIndex:Int, value:Int);

  /** 更新 GeneralMultiPick：帶入 node 與 widgetIndex，並提供新的 selectedGeneralIds。 */
  GeneralMultiPick(node:IPlayerMenuNode, widgetIndex:Int, selectedGeneralIds:Array<String>);
}

