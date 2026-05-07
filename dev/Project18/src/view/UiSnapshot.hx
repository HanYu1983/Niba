package view;

import game.GameIds;

/**
 * UI 呈現快照（可選覆寫層）：
 * - 未提供的欄位一律委派到底層 match（保持增量擴充的可維護性）
 * - 目前先支援 monarch 的位置/資源（足以讓移動動畫期間顯示「過程中」狀態）
 */
typedef UiSnapshot = {
  ?monarchPawnIndexById:Map<MonarchId, TileIndex>,
  ?monarchTroopsById:Map<MonarchId, Int>,
  ?monarchGrainById:Map<MonarchId, Int>,
  ?monarchGoldById:Map<MonarchId, Int>,
}

