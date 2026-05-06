package view;

import game.GameIds;

/**
 * View 層的「換頁狀態」：只描述 UI 導航/焦點，不持有賽局狀態。
 */
enum ViewState {
  Main;
  Debug;
  /** UI 測試頁 2：載入一個包含多種格子功能的示範場景。 */
  TestPage2;
  InspectorTile(tileIndex:TileIndex);
  InspectorMonarch(monarchId:MonarchId);
}

