package game;

import game.GameIds;

/**
 * 彈窗受眾：指定君主或全體廣播。
 */
enum PopupAudience {
  ToMonarch(monarchId:MonarchId);
  Broadcast;
}

