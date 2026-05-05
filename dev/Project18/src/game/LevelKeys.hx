package game;

import game.GameIds;

/**
 * 領域常量：關卡／劇本組態鍵。
 * 測試與上層入口應只依賴本層常量，不應依賴具象 Game 實作。
 */
class LevelKeys {
  /** 空白賽局：僅 match 初始化，供測試自行組局。 */
  public static inline var EMPTY:LevelKey = "ver1/empty";
}

