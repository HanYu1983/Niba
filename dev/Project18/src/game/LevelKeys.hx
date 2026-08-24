package game;

import game.GameIds;

/**
 * 領域常量：關卡／劇本組態鍵。
 * 測試與上層入口應只依賴本層常量，不應依賴具象 Game 實作。
 */
class LevelKeys {
  /** 空白賽局：僅 match 初始化，供測試自行組局。 */
  public static inline var EMPTY:LevelKey = "ver1/empty";

  /**
   * 依 docs/數值算法.md §1.0 機率表生成 TileKind 的示範關卡（32 格、Start 固定 1 個）。
   * 目的：提供「正式生成器」入口，讓上層可以直接 NewGame 進入程序化棋盤。
   */
  public static inline var PROB_GEN_32:LevelKey = "ver1/prob_gen_32";
}

