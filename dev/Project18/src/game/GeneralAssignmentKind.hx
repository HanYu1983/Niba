package game;

/**
 * 通用：把「指派武將」視為一種領域動作。
 * 後續資源格加成、事件規避、村落互動、開發等都可歸一到這個語彙。
 */
enum GeneralAssignmentKind {
  /** 資源格：指派武將做資源加成（GDD 2.1.8）。 */
  ResourceTileBoost;

  /** 事件格：指派武將規避負面事件（GDD 2.1.9）。 */
  EventAvoidance;

  /** 村落：交易（示範 staging）。 */
  VillageTrade;

  /** 村落：搶奪（示範 staging）。 */
  VillagePlunder;

  /** 村落：攻占（示範 staging）。 */
  VillageConquer;

  /** 我方城池：開發（示範 staging）。 */
  FriendlyCityDevelop;

  /** 我方城池：休整（示範 staging）。 */
  FriendlyCityRest;
}

