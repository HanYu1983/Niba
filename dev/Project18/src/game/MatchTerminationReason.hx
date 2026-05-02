package game;

import game.GameIds;

/**
 * 賽局終結語意：進行中、平局，或唯一勝方。
 * 由 {@link IGameMatch#getTerminationReason} 讀取；於賽局 {@code evaluateTermination} 掛鉤內更新。
 */
enum MatchTerminationReason {
  /** 尚未結束；主迴圈可繼續。 */
  NotEnded;

  /** 平局（無唯一勝方或規剘判定和局）。 */
  Draw;

  /** 該君主獲勝。 */
  Victory(winnerMonarchId:MonarchId);
}
