package game;

/**
 * GDD 2.1.7：格子資源成長率（每次觸發時的增量；單位以遊戲資源整數表示）。
 * - gold：金錢
 * - grain：糧食
 * - troops：士兵
 */
typedef TileGrowth = {
  var gold:Int;
  var grain:Int;
  var troops:Int;
};

