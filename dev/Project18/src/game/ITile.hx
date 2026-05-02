package game;

import game.GameIds;

/**
 * GDD：棋盤單格之唯讀視角。
 * 格上動態占用（君主標記、暫駐武將等）若存在，由規剘延伸介面另行揭露。
 */
interface ITile {
    /** 於所屬 IBoard 脈絡下之索引座標。 */
    function index():TileIndex;

    /** 四類語意之一，驅動踩點結算分流。 */
    function kind():TileKind;
}
