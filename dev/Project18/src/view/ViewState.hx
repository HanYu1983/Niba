package view;

import game.GameIds;

/**
 * View 層的「換頁狀態」：只描述 UI 導航/焦點，不持有賽局狀態。
 */
enum ViewState {
  Main;
  Debug;
  InspectorTile(tileIndex:TileIndex);
  InspectorMonarch(monarchId:MonarchId);
}

