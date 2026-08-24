package game;

/**
 * docs/裝備系統.md：職位等級（影響可裝備數量上限）。
 * 目前先做成 enum；升遷規則之後再由功績系統接上。
 */
enum PositionRank {
  Soldier; // 士兵
  SquadLeader; // 伍長
  SectionLeader; // 什長
  Captain; // 校尉
  General; // 將軍
  GreatGeneral; // 大將軍
}

