package view;

import game.GameIds;
import view.ViewState;

/**
 * UI 指令（one-to-one）：由單一 controller/router 消費的「意圖」。
 */
enum UiCommand {
  ChangePage(next:ViewState);
  NewGame(levelKey:String);
  ResetGame;
}

