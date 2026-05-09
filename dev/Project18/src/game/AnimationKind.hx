package game;

enum AnimationKind {
  /** 棋子移動（from→to，含步數）。 */
  PawnMove;
  /** 移動結束摘要（骰步／落地格），與 {@link AnimationKind.PawnMove} 搭配 FanOut2。 */
  MoveSummary;
  /** 事件發生/結算（文字即可）。 */
  TileEvent;
}

