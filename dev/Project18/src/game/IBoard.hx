package game;

import game.GameIds;

/**
 * GDD：環狀棋盤；君主標記沿索引前進，跨越末尾視為繞圈。
 * 鄰接關係由索引 ±1（模長）推得，不由本介面列舉邊集合。
 */
interface IBoard {
    /** 環上格子總數。 */
    function length():Int;

    /** 依索引取得格；索引無效時之行為由實作／規剘決定並應於註記中載明。 */
    function tileAt(index:TileIndex):ITile;
}
